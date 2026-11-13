'use client';

import { useState } from 'react';
import { RevenueDataPoint } from '@/types';
import { formatPrice } from '@/lib/utils';

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'profit' | 'expenses'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d[activeMetric]));

  const colors = {
    revenue: {
      bar: 'from-[#003b6f] to-[#0077cc] hover:from-[#002b52] hover:to-[#0284c7]',
      label: 'Aylık Ciro',
      accent: 'text-[#005596]',
      badge: 'bg-blue-50 text-[#005596] border-blue-200',
    },
    profit: {
      bar: 'from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500',
      label: 'Net Kâr',
      accent: 'text-emerald-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    expenses: {
      bar: 'from-amber-600 to-amber-400 hover:from-amber-700 hover:to-amber-500',
      label: 'Gider & Maliyet',
      accent: 'text-amber-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  };

  const current = colors[activeMetric];

  return (
    <div className="bg-white rounded-2xl p-6 space-y-6 border border-slate-200 shadow-xs">
      {/* Header & Metric Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Yıllık Finansal Trend (2026)</h2>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${current.badge}`}>
              {current.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ocak – Aralık 2026 dönemi aylık ciro, net kâr ve operasyonel gider dağılımı
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {(['revenue', 'profit', 'expenses'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeMetric === m
                  ? 'bg-[#005596] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {colors[m].label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart Display */}
      <div className="flex items-end gap-2 md:gap-4 h-64 pt-14 px-2 border-b border-slate-200 bg-slate-50/60 rounded-t-xl">
        {data.map((item, index) => {
          const val = item[activeMetric];
          const heightPct = Math.max(12, Math.round((val / maxValue) * 100));
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.month}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-pointer relative"
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 bg-[#002242] text-white text-[11px] px-3 py-1.5 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-20 flex flex-col items-center border border-white/15">
                  <span className="font-bold text-amber-300">{item.month} 2026</span>
                  <span className="font-mono font-bold text-white">{formatPrice(val)}</span>
                  <span className="text-[10px] text-blue-200">{item.orderCount} Sipariş</span>
                </div>
              )}

              {/* Value label on top of bar */}
              <span className="text-[10px] font-mono font-bold text-slate-600 hidden lg:block">
                {(val / 1000000).toFixed(1)}M
              </span>

              {/* Bar */}
              <div className="w-full flex justify-center h-full items-end">
                <div
                  className={`w-full max-w-[30px] md:max-w-[42px] bg-gradient-to-t ${current.bar} rounded-t-lg transition-all duration-300 shadow-xs ${
                    isHovered ? 'scale-x-105 opacity-100 ring-2 ring-[#005596]/30' : 'opacity-90'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>

              {/* Month Label */}
              <span
                className={`text-xs pb-2 transition-colors ${
                  isHovered ? 'text-[#005596] font-extrabold' : 'text-slate-600 font-semibold'
                }`}
              >
                {item.month.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
