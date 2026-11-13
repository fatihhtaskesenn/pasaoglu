'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Megaphone,
  ShoppingBag,
  Wallet,
  Plus,
  ArrowRight,
  Boxes,
} from 'lucide-react';
import {
  fetchProductsFromSupabase,
  fetchCampaignsFromSupabase,
  fetchOrdersFromSupabase,
  type CampaignRecord,
} from '@/lib/supabase-data';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Product, Order } from '@/types';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProductsFromSupabase(),
      fetchCampaignsFromSupabase(),
      fetchOrdersFromSupabase(),
    ]).then(([p, c, o]) => {
      setProducts(p);
      setCampaigns(c);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalStockValue = products.reduce(
    (sum, p) => sum + (p.discountedPrice ?? p.price) * p.stock,
    0
  );
  const totalOrderRevenue = orders
    .filter((o) => o.status !== 'iptal-edildi')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Üst Başlık & Hızlı Aksiyon */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Mağaza Yönetim Özeti
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tüm rakamlar doğrudan Supabase veritabanınızdaki canlı kayıtlardan hesaplanır.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/urunler"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005596] hover:bg-[#004478] text-white text-xs font-bold transition-colors"
          >
            <Plus size={15} />
            Seri Ürün Ekle / Düzenle
          </Link>
          <Link
            href="/admin/stok"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Boxes size={15} />
            Stok Yönetimi
          </Link>
        </div>
      </div>

      {/* 4 Sade Özet Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Kayıtlı Ürün</span>
            <Package size={18} className="text-[#005596]" />
          </div>
          <p className="text-3xl font-display font-bold text-slate-900 mt-2">
            {loading ? '...' : products.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Toplam {totalUnits} adet stok • {lowStockCount} kritik ürün
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Envanter Değeri</span>
            <Wallet size={18} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-display font-bold text-slate-900 mt-2">
            {loading ? '...' : formatPrice(totalStockValue)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Stoktaki ürünlerin satış toplamı</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Siparişler</span>
            <ShoppingBag size={18} className="text-amber-600" />
          </div>
          <p className="text-3xl font-display font-bold text-slate-900 mt-2">
            {loading ? '...' : orders.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Toplam Tutar: {formatPrice(totalOrderRevenue)}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Aktif Kampanya</span>
            <Megaphone size={18} className="text-purple-600" />
          </div>
          <p className="text-3xl font-display font-bold text-slate-900 mt-2">
            {loading ? '...' : campaigns.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Ana sayfada yayınlanan afişler</p>
        </div>
      </div>

      {/* İki Kolon: Son Ürünler & Son Siparişler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Eklenen Ürünler */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-display font-bold text-slate-900">
              Katalogdaki Son Ürünler
            </h2>
            <Link
              href="/admin/urunler"
              className="text-xs font-bold text-[#005596] hover:underline inline-flex items-center gap-1"
            >
              Tümünü Yönet <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">Yükleniyor...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <p className="text-sm font-semibold text-slate-700">Henüz ürün eklenmemiş</p>
              <Link
                href="/admin/urunler"
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-lg bg-[#005596] text-white text-xs font-bold"
              >
                <Plus size={14} /> İlk Ürünü Ekle
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {products.slice(0, 6).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.images[0] || '/resim/pasaoglulogo-crop.png'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">Stok: {item.stock} adet</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#005596] shrink-0">
                    {formatPrice(item.discountedPrice ?? item.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Son Siparişler */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-display font-bold text-slate-900">Son Siparişler</h2>
            <Link
              href="/admin/siparisler"
              className="text-xs font-bold text-[#005596] hover:underline inline-flex items-center gap-1"
            >
              Tümünü Gör <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">Yükleniyor...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <p className="text-sm font-semibold text-slate-700">Henüz kayıtlı sipariş yok</p>
              <p className="text-xs text-slate-500 mt-1">
                Siparişler geldikçe burada canlı olarak listelenecektir.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 6).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.orderNumber} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 shrink-0">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
