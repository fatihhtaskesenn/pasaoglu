'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  fetchProductsFromSupabase,
  patchProductQuickInSupabase,
} from '@/lib/supabase-data';
import { formatPrice } from '@/lib/utils';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Minus,
} from 'lucide-react';
import type { Product } from '@/types';

const categoryNames: Record<string, string> = {
  'beyaz-esya': 'Beyaz Eşya',
  'tv-ses-sistemleri': 'Televizyon & Ses',
  klima: 'Klima',
  'kucuk-ev-aletleri': 'Küçük Ev Aletleri',
};

export default function StokPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await fetchProductsFromSupabase();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAdjustStock = async (item: Product, delta: number) => {
    const nextStock = Math.max(0, item.stock + delta);
    setProducts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, stock: nextStock } : p))
    );
    await patchProductQuickInSupabase(item.id, { stock: nextStock });
  };

  const filteredItems = products.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce(
    (sum, p) => sum + (p.discountedPrice ?? p.price) * p.stock,
    0
  );
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Stok & Envanter Yönetimi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supabase veritabanındaki ürünlerin anlık stok takibi
          </p>
        </div>
        <Link
          href="/admin/urunler"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005596] hover:bg-[#004478] text-white text-xs font-bold transition-colors"
        >
          <Plus size={15} />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* 3 Sade Özet Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Toplam Ürün / Adet</p>
          <p className="text-2xl font-display font-bold text-slate-900 mt-1">
            {products.length} Çeşit • {totalUnits} Adet
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Toplam Stok Değeri</p>
          <p className="text-2xl font-display font-bold text-[#005596] mt-1">
            {formatPrice(totalValue)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Kritik Stok (5 Altı)</p>
          <p className="text-2xl font-display font-bold text-amber-600 mt-1">
            {lowStockCount} Ürün
          </p>
        </div>
      </div>

      {/* Filtre */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün adı ara..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
        >
          <option value="all">Tüm Kategoriler</option>
          <option value="beyaz-esya">Beyaz Eşya</option>
          <option value="tv-ses-sistemleri">Televizyon & Ses</option>
          <option value="kucuk-ev-aletleri">Küçük Ev Aletleri</option>
          <option value="klima">Klima</option>
        </select>
      </div>

      {/* Liste */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-sm text-slate-400">Yükleniyor...</p>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">Stokta kayıtlı ürün bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-5">Ürün</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Satış Fiyatı</th>
                  <th className="py-3.5 px-4">Stok</th>
                  <th className="py-3.5 px-4">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredItems.map((item) => {
                  const status =
                    item.stock === 0
                      ? { label: 'Tükendi', cls: 'bg-red-50 text-red-700', icon: XCircle }
                      : item.stock < 5
                      ? { label: 'Kritik', cls: 'bg-amber-50 text-amber-700', icon: AlertTriangle }
                      : { label: 'Yeterli', cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 };
                  const StatusIcon = status.icon;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {categoryNames[item.category] || item.category}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#005596]">
                        {formatPrice(item.discountedPrice ?? item.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(item, -1)}
                            className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900">
                            {item.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(item, 1)}
                            className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${status.cls}`}
                        >
                          <StatusIcon size={13} />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
