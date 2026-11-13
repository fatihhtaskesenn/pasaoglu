import { getSupabaseClient } from './supabase';
import { optimizeImageForWeb } from './image-optimizer';
import type { Product, ProductCategory, Order, OrderStatus, RevenueDataPoint } from '@/types';

export interface CampaignRecord {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  target_url: string;
  badge_text: string;
  price_label: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProductInput {
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  discountedPrice?: number;
  stock: number;
  description: string;
  features: string[];
  tags: string[];
  images: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

function slugifyTurkish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Storage: Görsel Yükleme ───────────────────────────────────────────────

export async function uploadMediaFile(
  file: File,
  folder: 'products' | 'campaigns' = 'products'
): Promise<{
  url: string | null;
  error: string | null;
  originalSize?: number;
  optimizedSize?: number;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { url: null, error: 'Supabase bağlantısı henüz yapılandırılmamış (.env.local).' };
  }

  // Ürün ve kampanya görsellerini canlılığını koruyarak düşük boyutlu WebP'ye dönüştür
  const optimized = await optimizeImageForWeb(
    file,
    folder === 'campaigns'
      ? { maxDimension: 1600, targetMaxBytes: 260 * 1024, initialQuality: 0.85, minQuality: 0.72 }
      : { maxDimension: 1200, targetMaxBytes: 180 * 1024, initialQuality: 0.84, minQuality: 0.7 }
  );

  const fileToUpload = optimized.file;
  const ext = fileToUpload.name.split('.').pop() || 'webp';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('pasaoglu-media')
    .upload(fileName, fileToUpload, {
      cacheControl: '31536000',
      contentType: fileToUpload.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from('pasaoglu-media').getPublicUrl(fileName);
  return {
    url: data.publicUrl,
    error: null,
    originalSize: optimized.originalSize,
    optimizedSize: optimized.optimizedSize,
  };
}

// ─── Ürünler (CRUD — Doğrudan Supabase) ───────────────────────────────────

interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number | string;
  discounted_price: number | string | null;
  stock: number;
  rating: number | string;
  review_count: number;
  images: string[] | null;
  description: string;
  features: string[] | null;
  tags: string[] | null;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
}

function mapRowToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: Number(row.price),
    discountedPrice: row.discounted_price ? Number(row.discounted_price) : undefined,
    stock: row.stock,
    rating: Number(row.rating || 4.9),
    reviewCount: row.review_count || 0,
    images:
      Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : ['/resim/pasaoglulogo-crop.png'],
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    isFeatured: row.is_featured,
    isNew: row.is_new,
    createdAt: row.created_at,
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as DbProductRow[]).map(mapRowToProduct);
}

export async function fetchProductBySlugFromSupabase(
  slug: string
): Promise<{ product: Product | null; related: Product[] }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { product: null, related: [] };

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return { product: null, related: [] };
  }

  const product = mapRowToProduct(data as DbProductRow);

  const { data: relatedRows } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(3);

  const related = Array.isArray(relatedRows)
    ? (relatedRows as DbProductRow[]).map(mapRowToProduct)
    : [];

  return { product, related };
}

export async function createProductInSupabase(
  input: ProductInput
): Promise<{ product: Product | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { product: null, error: 'Supabase bağlantısı henüz yapılandırılmamış (.env.local).' };
  }

  const slug = `${slugifyTurkish(input.name)}-${Date.now().toString().slice(-4)}`;
  const payload = {
    slug,
    name: input.name.trim(),
    brand: input.brand.trim() || 'Profilo',
    category: input.category,
    price: input.price,
    discounted_price:
      input.discountedPrice && input.discountedPrice > 0 ? input.discountedPrice : null,
    stock: input.stock,
    images: input.images,
    description: input.description.trim(),
    features: input.features.filter(Boolean),
    tags: input.tags.filter(Boolean),
    is_featured: Boolean(input.isFeatured),
    is_new: Boolean(input.isNew ?? true),
    is_active: true,
  };

  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    return { product: null, error: error?.message || 'Ürün eklenemedi.' };
  }

  return { product: mapRowToProduct(data as DbProductRow), error: null };
}

export async function updateProductInSupabase(
  id: string,
  input: ProductInput
): Promise<{ product: Product | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { product: null, error: 'Supabase bağlantısı henüz yapılandırılmamış (.env.local).' };
  }

  const payload = {
    name: input.name.trim(),
    brand: input.brand.trim() || 'Profilo',
    category: input.category,
    price: input.price,
    discounted_price:
      input.discountedPrice && input.discountedPrice > 0 ? input.discountedPrice : null,
    stock: input.stock,
    images: input.images,
    description: input.description.trim(),
    features: input.features.filter(Boolean),
    tags: input.tags.filter(Boolean),
    is_featured: Boolean(input.isFeatured),
  };

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    return { product: null, error: error?.message || 'Ürün güncellenemedi.' };
  }

  return { product: mapRowToProduct(data as DbProductRow), error: null };
}

export async function deleteProductInSupabase(id: string): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase bağlantısı yok.' };

  const { error } = await supabase.from('products').delete().eq('id', id);
  return { error: error ? error.message : null };
}

// ─── Kampanyalar (CRUD) ────────────────────────────────────────────────────

export async function fetchCampaignsFromSupabase(): Promise<CampaignRecord[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error || !data) return [];
  return data as CampaignRecord[];
}

export async function createCampaignInSupabase(input: {
  title: string;
  subtitle?: string;
  image_url: string;
  target_url?: string;
  badge_text?: string;
  price_label?: string;
}): Promise<{ campaign: CampaignRecord | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { campaign: null, error: 'Supabase bağlantısı henüz yapılandırılmamış (.env.local).' };
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      title: input.title.trim(),
      subtitle: input.subtitle?.trim() || '',
      image_url: input.image_url,
      target_url: input.target_url?.trim() || '/setler',
      badge_text: input.badge_text?.trim() || 'KAMPANYA',
      price_label: input.price_label?.trim() || '',
      is_active: true,
    })
    .select('*')
    .single();

  if (error || !data) {
    return { campaign: null, error: error?.message || 'Kampanya eklenemedi.' };
  }
  return { campaign: data as CampaignRecord, error: null };
}

export async function deleteCampaignInSupabase(id: string): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase bağlantısı yok.' };

  const { error } = await supabase.from('campaigns').delete().eq('id', id);
  return { error: error ? error.message : null };
}

// ─── Hızlı Stok / Fiyat Güncelleme (Satır İçi Seri Düzenleme) ────────────

export async function patchProductQuickInSupabase(
  id: string,
  patch: { price?: number; discountedPrice?: number | null; stock?: number }
): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase bağlantısı yok.' };

  const payload: Record<string, unknown> = {};
  if (typeof patch.price === 'number') payload.price = patch.price;
  if (patch.discountedPrice !== undefined) payload.discounted_price = patch.discountedPrice;
  if (typeof patch.stock === 'number') payload.stock = Math.max(0, patch.stock);

  const { error } = await supabase.from('products').update(payload).eq('id', id);
  return { error: error ? error.message : null };
}

// ─── Siparişler (Doğrudan Supabase) ───────────────────────────────────────

interface DbOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: Order['items'] | null;
  total_amount: number | string;
  status: OrderStatus;
  payment_method: Order['paymentMethod'];
  payment_status: Order['paymentStatus'];
  created_at: string;
  updated_at: string;
}

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return (data as DbOrderRow[]).map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email || '',
    customerPhone: row.customer_phone,
    shippingAddress: row.shipping_address || '',
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.total_amount || 0),
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function updateOrderStatusInSupabase(
  id: string,
  status: OrderStatus
): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase bağlantısı yok.' };

  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  return { error: error ? error.message : null };
}

// ─── Aylık Finans Verileri (Doğrudan Supabase) ─────────────────────────────

export async function fetchMonthlyFinancialsFromSupabase(): Promise<RevenueDataPoint[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('monthly_financials')
    .select('*')
    .order('period_key', { ascending: true });

  if (error || !data) return [];

  return data.map((row: {
    month_label: string;
    revenue: number | string;
    expenses: number | string;
    profit: number | string;
    order_count: number;
  }) => ({
    month: row.month_label,
    revenue: Number(row.revenue || 0),
    expenses: Number(row.expenses || 0),
    profit: Number(row.profit || 0),
    orderCount: Number(row.order_count || 0),
  }));
}
