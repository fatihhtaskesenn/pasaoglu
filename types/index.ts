// ============================================================
// PAŞAOĞLU MAĞAZALARI — Type Definitions
// ============================================================

// ─── Product & Catalog ────────────────────────────────────────

export type ProductCategory =
  | 'beyaz-esya'
  | 'kucuk-ev-aletleri'
  | 'tv-ses-sistemleri'
  | 'klima'
  | 'kamera-fotograf'
  | 'bilgisayar';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  discountedPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
  createdAt: string;
}

export interface ProductCategory_Meta {
  id: ProductCategory;
  label: string;
  icon: string;
  productCount: number;
}

// ─── Cart ─────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

// ─── Orders ───────────────────────────────────────────────────

export type OrderStatus =
  | 'beklemede'
  | 'onaylandi'
  | 'hazirlaniyor'
  | 'kargoya-verildi'
  | 'teslim-edildi'
  | 'iptal-edildi';

export type PaymentMethod = 'kredi-karti' | 'nakit' | 'havale';
export type PaymentStatus = 'odendi' | 'beklemede' | 'iptal';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Financial / Revenue ──────────────────────────────────────

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  orderCount: number;
}

export interface DailyRevenue {
  date: string;
  amount: number;
  orderCount: number;
}

export interface CategoryRevenue {
  category: ProductCategory;
  label: string;
  revenue: number;
  percentage: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number; // percentage YoY
  profitMargin: number;
}

// ─── Inventory / Stock ────────────────────────────────────────

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface StockItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  currentStock: number;
  minimumStock: number;
  status: StockStatus;
  lastRestocked: string;
  unitCost: number;
  totalValue: number;
}

// ─── Admin Dashboard ──────────────────────────────────────────

export interface DashboardMetric {
  label: string;
  value: string | number;
  change: number; // percentage change from last period
  trend: 'up' | 'down' | 'stable';
  unit?: string;
}

// ─── UI State ─────────────────────────────────────────────────

export interface UIState {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  activeCategory: ProductCategory | 'tumu';
  searchQuery: string;
}

