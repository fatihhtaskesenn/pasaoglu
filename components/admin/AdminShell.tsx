'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f1f5f9] text-slate-900 overflow-hidden">
      {/* Masaüstü Sabit Sidebar (lg ve üzeri) */}
      <div className="hidden lg:flex h-full shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobil Çekmece Sidebar (< lg) */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 lg:hidden bg-slate-950/60 backdrop-blur-xs flex"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-full w-64 max-w-[82vw] shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Menüyü Kapat"
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
            <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

