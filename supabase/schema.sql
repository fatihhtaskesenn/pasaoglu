-- ============================================================================
-- PAŞAOĞLU MAĞAZALARI — SUPABASE VERİTABANI ŞEMASI (SQL)
-- Supabase Dashboard > SQL Editor > New Query ekranına yapıştırıp "Run" deyin.
-- ============================================================================

-- 1. UUID uzantısını aktif et
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. ÜRÜNLER TABLOSU (products)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(gen_random_uuid()::text, 1, 8)),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Profilo',
  category TEXT NOT NULL CHECK (
    category IN (
      'beyaz-esya',
      'kucuk-ev-aletleri',
      'tv-ses-sistemleri',
      'klima',
      'kamera-fotograf',
      'bilgisayar'
    )
  ),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  discounted_price NUMERIC(12, 2) CHECK (discounted_price >= 0),
  stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0),
  minimum_stock INTEGER NOT NULL DEFAULT 3,
  unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 4.9,
  review_count INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. KAMPANYALAR TABLOSU (campaigns)
-- Ana sayfadaki kampanya afişleri ve özel fırsatlar için
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  target_url TEXT DEFAULT '/setler',
  badge_text TEXT DEFAULT 'KAMPANYA',
  price_label TEXT DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. ÇEYİZ & AVANTAJ SETLERİ TABLOSU (product_sets)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_sets (
  id TEXT PRIMARY KEY DEFAULT ('set-' || substr(gen_random_uuid()::text, 1, 8)),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  original_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  campaign_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  included_products JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge_text TEXT DEFAULT 'SET FIRSATI',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. SİPARİŞLER TABLOSU (orders)
-- Web sitesi / WhatsApp / Mağaza siparişleri ve admin takibi için
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'beklemede' CHECK (
    status IN (
      'beklemede',
      'onaylandi',
      'hazirlaniyor',
      'kargoya-verildi',
      'teslim-edildi',
      'iptal-edildi'
    )
  ),
  payment_method TEXT NOT NULL DEFAULT 'havale' CHECK (
    payment_method IN ('kredi-karti', 'nakit', 'havale', 'whatsapp')
  ),
  payment_status TEXT NOT NULL DEFAULT 'beklemede' CHECK (
    payment_status IN ('odendi', 'beklemede', 'iptal')
  ),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. AYLIK FİNANS & CİRO ÖZETİ TABLOSU (monthly_financials)
-- Admin panelindeki Ciro & Finans grafikleri için
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.monthly_financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_key TEXT UNIQUE NOT NULL, -- Örn: '2026-11'
  month_label TEXT NOT NULL,       -- Örn: 'Kasım 2026'
  revenue NUMERIC(14, 2) NOT NULL DEFAULT 0,
  expenses NUMERIC(14, 2) NOT NULL DEFAULT 0,
  profit NUMERIC(14, 2) NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. OTOMATİK updated_at TETİKLEYİCİSİ
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- Not: Şimdilik şifresiz admin geliştirme aşaması için CRUD açık tutulmuştur.
-- Canlıya almadan önce admin yazma işlemleri Supabase Auth'a bağlanacaktır.
-- ----------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_financials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on campaigns" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on product_sets" ON public.product_sets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on monthly_financials" ON public.monthly_financials FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 8B. ANA SAYFA HERO GÖRSELLERİ TABLOSU (homepage_slides)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homepage_slides (
  id TEXT PRIMARY KEY DEFAULT ('slide-' || substr(gen_random_uuid()::text, 1, 8)),
  title TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  fit_mode TEXT NOT NULL DEFAULT 'contain' CHECK (fit_mode IN ('cover', 'contain')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.homepage_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on homepage_slides" ON public.homepage_slides FOR ALL USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';

-- ----------------------------------------------------------------------------
-- 9. FOTOĞRAF DEPOLAMA ALANI (Supabase Storage Bucket: "pasaoglu-media")
-- Admin panelinden ürün ve kampanya görselleri yüklemek için
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('pasaoglu-media', 'pasaoglu-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read pasaoglu-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pasaoglu-media');

CREATE POLICY "Public insert pasaoglu-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pasaoglu-media');

CREATE POLICY "Public update pasaoglu-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'pasaoglu-media');

CREATE POLICY "Public delete pasaoglu-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pasaoglu-media');

-- ----------------------------------------------------------------------------
-- 10. BAŞLANGIÇ KAMPANYA VERİLERİ (Örnek 4 Kampanya Afişi)
-- ----------------------------------------------------------------------------
INSERT INTO public.campaigns (title, subtitle, image_url, target_url, badge_text, price_label, display_order)
VALUES
  ('Kampanyaya Özel 4K Ultra HD / Android Smart TV (55PA525EQG)', 'Sınırlı stok fırsatıyla', '/resim/kampanyalar/k1.jpeg', '/urunler?kategori=tv-ses-sistemleri', 'TV FIRSATI', '45.999 ₺', 1),
  ('İkili Alımlara Özel 9 Kg Çamaşır & Kurutma Makinesi', 'KM9611CTR + CGA242X3TR İkili Set', '/resim/kampanyalar/k2.jpeg', '/setler', 'İKİLİ SET', '49.999 ₺', 2),
  ('Kampanyaya Özel A++ Enerji Verimli Buzdolabı (RF4210W)', 'Geniş hacim ve üstün tazelik', '/resim/kampanyalar/k3.jpeg', '/urunler?kategori=buzdolabi', 'SOĞUTMA', '89.999 ₺', 3),
  ('Kampanyaya Özel 4 Programlı Bulaşık Makinesi (BM4210MA)', 'Ekonomik ve sessiz yıkama', '/resim/kampanyalar/k4.jpeg', '/urunler?kategori=bulasik-makinesi', 'FIRSAT', '15.999 ₺', 4);

