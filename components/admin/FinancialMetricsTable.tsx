'use client';

import { RevenueDataPoint } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface FinancialMetricsTableProps {
  data: RevenueDataPoint[];
}

export function FinancialMetricsTable({ data }: FinancialMetricsTableProps) {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-4 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Aylık Finansal Muhasebe Tablosu</h2>
          <p className="text-xs text-slate-500 mt-0.5">Gelir, maliyet ve net kâr marjı dökümü (2026)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase">
              <th className="py-3 px-3 text-left font-bold">Ay</th>
              <th className="py-3 px-3 text-right font-bold">Gelir (Ciro)</th>
              <th className="py-3 px-3 text-right font-bold">Giderler</th>
              <th className="py-3 px-3 text-right font-bold">Net Kâr</th>
              <th className="py-3 px-3 text-right font-bold">Marj</th>
              <th className="py-3 px-3 text-right font-bold">Sipariş</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((m) => {
              const margin = Math.round((m.profit / m.revenue) * 100);
              return (
                <tr key={m.month} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{m.month}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                    {formatPrice(m.revenue)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    {formatPrice(m.expenses)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                    {formatPrice(m.profit)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-0.5 font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      <ArrowUpRight size={11} />
                      %{margin}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">
                    {m.orderCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
