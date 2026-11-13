'use client';

import { useEffect, useState, Suspense, use } from 'react';
import Link from 'next/link';
import { fetchProductBySlugFromSupabase } from '@/lib/supabase-data';
import { ProductDetailClient } from '@/components/storefront/ProductDetailClient';
import type { Product } from '@/types';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

function ProductDetailContent({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProductBySlugFromSupabase(slug).then((res) => {
      if (!active) return;
      setProduct(res.product);
      setRelated(res.related);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-[#f8fafc] flex items-center justify-center text-sm text-slate-500">
        Ürün detayları yükleniyor...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-36 pb-24 bg-[#f8fafc] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-display font-bold text-slate-900">Ürün Bulunamadı</h1>
        <p className="text-sm text-slate-500 mt-2">
          Aradığınız ürün kaldırılmış veya henüz yayınlanmamış olabilir.
        </p>
        <Link
          href="/urunler"
          className="mt-6 px-5 py-2.5 rounded-xl bg-[#005596] text-white text-sm font-bold hover:bg-[#004478] transition-colors"
        >
          Tüm Ürünlere Dön
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} related={related} />;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-24 bg-[#f8fafc] flex items-center justify-center text-sm text-slate-500">
          Ürün detayları yükleniyor...
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
