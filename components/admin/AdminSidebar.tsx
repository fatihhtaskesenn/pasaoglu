'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  ShoppingBag,
  PlusSquare,
  Home,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
  { label: 'Ürün & Kampanya', href: '/admin/urunler', icon: PlusSquare },
  { label: 'Stok Yönetimi', href: '/admin/stok', icon: Package },
  { label: 'Siparişler', href: '/admin/siparisler', icon: ShoppingBag },
  { label: 'Ciro & Finans', href: '/admin/ciro', icon: TrendingUp },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#00284d] text-white border-r border-[#003a6e] flex flex-col h-full shrink-0 shadow-lg z-20">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center justify-between gap-2">
          <div className="relative w-36 h-10">
            <Image
              src="/resim/pasaoglulogo-crop.png"
              alt="Paşaoğlu Mağazaları"
              fill
              sizes="144px"
              className="object-contain brightness-0 invert"
            />
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/15 border border-emerald-400/30 px-2 py-0.5 rounded-md uppercase">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/70 px-2">
          Yönetim
        </p>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group',
                isActive
                  ? 'bg-white text-[#00284d] shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon
                size={18}
                className={cn(
                  'transition-colors shrink-0',
                  isActive ? 'text-[#005596]' : 'text-blue-300 group-hover:text-white'
                )}
              />
              <span className="flex-1 whitespace-nowrap">{label}</span>
              {isActive && <ChevronRight size={14} className="text-[#005596] shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-black/15">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all"
        >
          <Home size={14} />
          <span>Mağaza Vitrinine Dön</span>
        </Link>
      </div>
    </aside>
  );
}
