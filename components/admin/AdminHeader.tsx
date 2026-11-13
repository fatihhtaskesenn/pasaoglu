'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Database, ExternalLink, Menu } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export function AdminHeader({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  return (
    <header className="h-14 sm:h-16 border-b border-slate-200 bg-white flex items-center justify-between px-3 sm:px-6 lg:px-8 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Menüyü Aç"
            className="lg:hidden p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            <Menu size={18} />
          </button>
        )}
        <span className="lg:hidden text-sm font-display font-bold text-slate-900">
          Admin Paneli
        </span>
        {dateStr && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar size={14} className="text-[#005596]" />
            <span>{dateStr}</span>
          </div>
        )}
        <div
          className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
            isSupabaseConfigured
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-amber-700 bg-amber-50 border-amber-200'
          }`}
        >
          <Database size={13} />
          <span>{isSupabaseConfigured ? 'Supabase Canlı Bağlı' : 'Veritabanı Bekleniyor'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#005596] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
        >
          <span>Siteyi Görüntüle</span>
          <ExternalLink size={13} />
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-[#005596] text-white flex items-center justify-center font-bold text-xs">
            PM
          </div>
          <span className="hidden sm:inline text-xs font-bold text-slate-800">Yönetim</span>
        </div>
      </div>
    </header>
  );
}
