'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
} from '@/lib/supabase-data';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, ShoppingBag } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';

const statusLabels: Record<OrderStatus, string> = {
  beklemede: 'Beklemede',
  onaylandi: 'Onaylandı',
  hazirlaniyor: 'Hazırlanıyor',
  'kargoya-verildi': 'Sevkiyatta',
  'teslim-edildi': 'Teslim Edildi',
  'iptal-edildi': 'İptal Edildi',
};

export default function SiparislerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const data = await fetchOrdersFromSupabase();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    await updateOrderStatusInSupabase(orderId, newStatus);
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAmount = orders
    .filter((o) => o.status !== 'iptal-edildi')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Sipariş Yönetimi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supabase veritabanına düşen tüm sipariş kayıtları
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 font-semibold">Toplam Sipariş Tutarı</p>
          <p className="text-xl font-display font-bold text-[#005596]">
            {formatPrice(totalAmount)}
          </p>
        </div>
      </div>

      {/* Arama ve Durum Filtresi */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sipariş no, müşteri adı veya telefon ara..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
        >
          <option value="all">Tüm Durumlar ({orders.length})</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-sm text-slate-400">Yükleniyor...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">Kayıtlı sipariş bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-5">Sipariş No</th>
                  <th className="py-3.5 px-4">Müşteri</th>
                  <th className="py-3.5 px-4">Telefon</th>
                  <th className="py-3.5 px-4">Tutar</th>
                  <th className="py-3.5 px-4">Tarih</th>
                  <th className="py-3.5 px-4">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{order.customerPhone}</td>
                    <td className="py-3.5 px-4 font-bold text-[#005596]">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-white cursor-pointer"
                      >
                        {Object.entries(statusLabels).map(([k, lbl]) => (
                          <option key={k} value={k}>
                            {lbl}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
