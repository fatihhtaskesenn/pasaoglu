'use client';

import { useState, useEffect } from 'react';
import {
  fetchOrdersFromSupabase,
  fetchMonthlyFinancialsFromSupabase,
} from '@/lib/supabase-data';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, Wallet, ShoppingBag } from 'lucide-react';
import type { Order, RevenueDataPoint } from '@/types';

export default function CiroPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthly, setMonthly] = useState<RevenueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchOrdersFromSupabase(),
      fetchMonthlyFinancialsFromSupabase(),
    ]).then(([o, m]) => {
      setOrders(o);
      setMonthly(m);
      setLoading(false);
    });
  }, []);

  const validOrders = orders.filter((o) => o.status !== 'iptal-edildi');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrder = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Ciro & Finans Özeti
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Supabase sipariş ve finans kayıtlarından otomatik hesaplanan gerçek veriler
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Toplam Ciro</span>
            <TrendingUp size={18} className="text-[#005596]" />
          </div>
          <p className="text-2xl font-display font-bold text-slate-900 mt-2">
            {loading ? '...' : formatPrice(totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Onaylı Sipariş Sayısı</span>
            <ShoppingBag size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-display font-bold text-slate-900 mt-2">
            {loading ? '...' : validOrders.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Ortalama Sepet</span>
            <Wallet size={18} className="text-amber-600" />
          </div>
          <p className="text-2xl font-display font-bold text-slate-900 mt-2">
            {loading ? '...' : formatPrice(avgOrder)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-base font-display font-bold text-slate-900 mb-4">
          Aylık Finans Kayıtları
        </h2>
        {monthly.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">
            Henüz aylık finans kaydı bulunmuyor. Siparişler oluştukça burada listelenecektir.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                  <th className="py-3 px-4">Dönem</th>
                  <th className="py-3 px-4">Ciro</th>
                  <th className="py-3 px-4">Gider</th>
                  <th className="py-3 px-4">Net Kâr</th>
                  <th className="py-3 px-4">Sipariş</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthly.map((row) => (
                  <tr key={row.month}>
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.month}</td>
                    <td className="py-3 px-4 font-bold text-[#005596]">{formatPrice(row.revenue)}</td>
                    <td className="py-3 px-4 text-slate-600">{formatPrice(row.expenses)}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{formatPrice(row.profit)}</td>
                    <td className="py-3 px-4 text-slate-700">{row.orderCount}</td>
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
