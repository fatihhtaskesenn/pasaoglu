'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Package,
  Megaphone,
  Search,
  Minus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchProductsFromSupabase,
  createProductInSupabase,
  updateProductInSupabase,
  patchProductQuickInSupabase,
  deleteProductInSupabase,
  fetchCampaignsFromSupabase,
  createCampaignInSupabase,
  deleteCampaignInSupabase,
  fetchHomepageSlidesFromSupabase,
  createHomepageSlideInSupabase,
  updateHomepageSlideOrderInSupabase,
  deleteHomepageSlideInSupabase,
  uploadMediaFile,
  type CampaignRecord,
  type HomepageSlideRecord,
} from '@/lib/supabase-data';
import { CATEGORY_TEMPLATES } from '@/lib/category-templates';
import { formatFileSize } from '@/lib/image-optimizer';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function AdminCatalogPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'campaigns' | 'homepage'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [homepageSlides, setHomepageSlides] = useState<HomepageSlideRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Liste Filtreleri
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('all');

  // Düzenlenen Ürün ID
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Temel Ürün Alanları
  const MAX_PRODUCT_IMAGES = 5;
  const [selectedTag, setSelectedTag] = useState('buzdolabi');
  const [selectedSubTypeId, setSelectedSubTypeId] = useState('supurge');
  const [prodName, setProdName] = useState('');
  const [prodModelCode, setProdModelCode] = useState('');
  const [prodBrand, setProdBrand] = useState('Profilo');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscounted, setProdDiscounted] = useState('');
  const [prodStock, setProdStock] = useState('10');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodImageInput, setProdImageInput] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  // Dinamik Makine Özellikleri & Seçili Hızlı Metin Kutuları
  const [specValues, setSpecValues] = useState<Record<string, string>>({});
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [customFeatureText, setCustomFeatureText] = useState('');

  const [uploadingProdImg, setUploadingProdImg] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Satır içi hızlı fiyat düzenleme
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState('');

  // Kampanya Formu
  const [campTitle, setCampTitle] = useState('');
  const [campPriceLabel, setCampPriceLabel] = useState('');
  const [campImageUrl, setCampImageUrl] = useState('');
  const [uploadingCampImg, setUploadingCampImg] = useState(false);
  const [savingCampaign, setSavingCampaign] = useState(false);

  // Ana Sayfa Hero Görselleri Formu
  const [slideTitle, setSlideTitle] = useState('');
  const [slideImageUrl, setSlideImageUrl] = useState('');
  const [slideFitMode, setSlideFitMode] = useState<'contain' | 'cover'>('contain');
  const [uploadingSlideImg, setUploadingSlideImg] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [p, c, s] = await Promise.all([
      fetchProductsFromSupabase(),
      fetchCampaignsFromSupabase(),
      fetchHomepageSlidesFromSupabase(),
    ]);
    setProducts(p);
    setCampaigns(c);
    setHomepageSlides(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const activeTemplate =
    CATEGORY_TEMPLATES.find((t) => t.tag === selectedTag) || CATEGORY_TEMPLATES[0];

  const activeSubType =
    activeTemplate.subTypes?.find((s) => s.id === selectedSubTypeId) ||
    activeTemplate.subTypes?.[0];

  const activeFields = activeSubType ? activeSubType.fields : activeTemplate.fields;
  const activeQuickChips = activeSubType
    ? [...activeSubType.quickChips, ...activeTemplate.quickChips]
    : activeTemplate.quickChips;

  const handleCategoryChange = (newTag: string) => {
    setSelectedTag(newTag);
    setSpecValues({});
    if (!editingProductId) {
      setFeaturesList([]);
    }
  };

  const handleSubTypeChange = (newSubId: string) => {
    setSelectedSubTypeId(newSubId);
    setSpecValues({});
  };

  const toggleQuickChip = (chip: string) => {
    setFeaturesList((prev) =>
      prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip]
    );
  };

  const addCustomFeature = () => {
    const trimmed = customFeatureText.trim();
    if (!trimmed) return;
    if (!featuresList.includes(trimmed)) {
      setFeaturesList((prev) => [...prev, trimmed]);
    }
    setCustomFeatureText('');
  };

  const resetForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdModelCode('');
    setProdBrand('Profilo');
    setProdPrice('');
    setProdDiscounted('');
    setProdStock('10');
    setProdImages([]);
    setProdImageInput('');
    setProdDesc('');
    setSpecValues({});
    setFeaturesList([]);
    setCustomFeatureText('');
  };

  const handleStartEdit = (item: Product) => {
    setEditingProductId(item.id);
    setProdName(item.name);
    const modelFeature = item.features?.find((f) => f.startsWith('Model Kodu:'));
    setProdModelCode(
      modelFeature ? modelFeature.replace('Model Kodu:', '').trim() : ''
    );
    setProdBrand(item.brand || 'Profilo');
    const matchedTag =
      CATEGORY_TEMPLATES.find((t) => item.tags?.includes(t.tag))?.tag || 'buzdolabi';
    setSelectedTag(matchedTag);
    setProdPrice(String(item.price));
    setProdDiscounted(item.discountedPrice ? String(item.discountedPrice) : '');
    setProdStock(String(item.stock));
    const existingImages = (item.images || []).filter(
      (img) => img && img !== '/resim/pasaoglulogo-crop.png'
    );
    setProdImages(existingImages.slice(0, MAX_PRODUCT_IMAGES));
    setProdImageInput('');
    setProdDesc(item.description || '');
    setSpecValues({});
    setFeaturesList(
      (item.features || []).filter((f) => !f.startsWith('Model Kodu:'))
    );
    setStatusMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatUploadMessage = (
    label: string,
    originalSize?: number,
    optimizedSize?: number
  ) => {
    if (originalSize && optimizedSize && optimizedSize < originalSize) {
      const savedPct = Math.round(((originalSize - optimizedSize) / originalSize) * 100);
      return `${label} optimize edilip yüklendi (${formatFileSize(originalSize)} → ${formatFileSize(optimizedSize)}, %${savedPct} tasarruf).`;
    }
    return `${label} yüklendi${optimizedSize ? ` (${formatFileSize(optimizedSize)})` : ''}.`;
  };

  const uploadProductFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const remaining = MAX_PRODUCT_IMAGES - prodImages.length;
    if (remaining <= 0) {
      setStatusMessage({
        type: 'error',
        text: `Bir ürün için en fazla ${MAX_PRODUCT_IMAGES} görsel ekleyebilirsiniz.`,
      });
      return;
    }

    const filesToUpload = fileArray.slice(0, remaining);
    setUploadingProdImg(true);

    const uploadedUrls: string[] = [];
    let totalOrig = 0;
    let totalOpt = 0;
    let lastError: string | null = null;

    for (const file of filesToUpload) {
      const { url, error, originalSize, optimizedSize } = await uploadMediaFile(file, 'products');
      if (error || !url) {
        lastError = error || 'Görsel yüklenemedi.';
      } else {
        uploadedUrls.push(url);
        totalOrig += originalSize || 0;
        totalOpt += optimizedSize || 0;
      }
    }

    if (uploadedUrls.length > 0) {
      setProdImages((prev) => [...prev, ...uploadedUrls].slice(0, MAX_PRODUCT_IMAGES));
      const baseMsg = formatUploadMessage(
        uploadedUrls.length > 1
          ? `${uploadedUrls.length} ürün fotoğrafı`
          : 'Ürün fotoğrafı',
        totalOrig,
        totalOpt
      );
      const skippedNotice =
        fileArray.length > remaining
          ? ` (En fazla ${MAX_PRODUCT_IMAGES} görsel sınırı nedeniyle ${fileArray.length - remaining} görsel atlandı.)`
          : '';
      setStatusMessage({ type: 'success', text: `${baseMsg}${skippedNotice}` });
    } else if (lastError) {
      setStatusMessage({ type: 'error', text: lastError });
    }

    setUploadingProdImg(false);
  };

  const addProductImageUrl = () => {
    const trimmed = prodImageInput.trim();
    if (!trimmed) return;
    if (prodImages.length >= MAX_PRODUCT_IMAGES) {
      setStatusMessage({
        type: 'error',
        text: `Bir ürün için en fazla ${MAX_PRODUCT_IMAGES} görsel ekleyebilirsiniz.`,
      });
      return;
    }
    if (!prodImages.includes(trimmed)) {
      setProdImages((prev) => [...prev, trimmed]);
    }
    setProdImageInput('');
  };

  const removeProductImage = (index: number) => {
    setProdImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setCoverProductImage = (index: number) => {
    if (index === 0) return;
    setProdImages((prev) => {
      const next = [...prev];
      const [picked] = next.splice(index, 1);
      return [picked, ...next];
    });
  };

  const moveProductImage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= prodImages.length) return;
    setProdImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  };

  const handleSlideFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlideImg(true);
    const { url, error, originalSize, optimizedSize } = await uploadMediaFile(file, 'homepage');
    if (error || !url) {
      setStatusMessage({ type: 'error', text: error || 'Ana sayfa görseli yüklenemedi.' });
    } else {
      setSlideImageUrl(url);
      setStatusMessage({
        type: 'success',
        text: formatUploadMessage('Ana sayfa görseli', originalSize, optimizedSize),
      });
    }
    setUploadingSlideImg(false);
    e.target.value = '';
  };

  const handleCreateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImageUrl.trim()) return;
    setSavingSlide(true);
    setStatusMessage(null);

    const nextOrder =
      homepageSlides.length > 0
        ? Math.max(...homepageSlides.map((s) => s.display_order || 0)) + 1
        : 1;

    const { error } = await createHomepageSlideInSupabase({
      title: slideTitle,
      image_url: slideImageUrl.trim(),
      fit_mode: slideFitMode,
      display_order: nextOrder,
    });

    if (error) {
      setStatusMessage({ type: 'error', text: error });
    } else {
      setSlideTitle('');
      setSlideImageUrl('');
      setSlideFitMode('contain');
      setStatusMessage({ type: 'success', text: 'Ana sayfa görseli eklendi.' });
      await loadAll();
    }
    setSavingSlide(false);
  };

  const handleMoveSlide = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= homepageSlides.length) return;

    const currentSlide = homepageSlides[index];
    const swapSlide = homepageSlides[targetIdx];

    const updated = [...homepageSlides];
    updated[index] = swapSlide;
    updated[targetIdx] = currentSlide;
    setHomepageSlides(updated);

    await Promise.all([
      updateHomepageSlideOrderInSupabase(currentSlide.id, targetIdx + 1),
      updateHomepageSlideOrderInSupabase(swapSlide.id, index + 1),
    ]);
  };

  const handleDeleteSlide = async (id: string, title: string) => {
    const { error } = await deleteHomepageSlideInSupabase(id);
    if (error) {
      setStatusMessage({ type: 'error', text: error });
    } else {
      setStatusMessage({ type: 'success', text: `"${title || 'Görsel'}" kaldırıldı.` });
      await loadAll();
    }
  };

  const handleCampaignFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCampImg(true);
    const { url, error, originalSize, optimizedSize } = await uploadMediaFile(file, 'campaigns');
    if (error || !url) {
      setStatusMessage({ type: 'error', text: error || 'Kampanya görseli yüklenemedi.' });
    } else {
      setCampImageUrl(url);
      setStatusMessage({
        type: 'success',
        text: formatUploadMessage('Kampanya afişi', originalSize, optimizedSize),
      });
    }
    setUploadingCampImg(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setStatusMessage(null);

    // Dinamik doldurulan makine özelliklerini okunaklı metin satırlarına çevir
    const dynamicFeatureLines = activeFields
      .map((field) => {
        const val = specValues[field.key]?.trim();
        return val ? `${field.label}: ${val}` : '';
      })
      .filter(Boolean);

    const modelCodeLine = prodModelCode.trim()
      ? [`Model Kodu: ${prodModelCode.trim().toUpperCase()}`]
      : [];

    const mergedFeatures = Array.from(
      new Set([
        ...modelCodeLine,
        ...dynamicFeatureLines,
        ...featuresList.filter((f) => !f.startsWith('Model Kodu:')),
      ])
    );
    const tags = activeSubType
      ? [activeTemplate.tag, activeSubType.extraTag]
      : [activeTemplate.tag];

    const autoDesc =
      prodDesc.trim() ||
      (mergedFeatures.length > 0
        ? `${prodName.trim()} — ${mergedFeatures.slice(0, 4).join(', ')}.`
        : `${prodName.trim()} — Resmi Profilo Yetkili Bayisi Paşaoğlu Mağazaları güvencesiyle.`);

    const finalImages =
      prodImages.length > 0
        ? prodImages.slice(0, MAX_PRODUCT_IMAGES)
        : ['/resim/pasaoglulogo-crop.png'];

    const payload = {
      name: prodName,
      brand: prodBrand,
      category: activeTemplate.category,
      price: Number(prodPrice) || 0,
      discountedPrice: prodDiscounted ? Number(prodDiscounted) : undefined,
      stock: Number(prodStock) || 0,
      description: autoDesc,
      features: mergedFeatures,
      tags,
      images: finalImages,
      isNew: true,
    };

    if (editingProductId) {
      const { error } = await updateProductInSupabase(editingProductId, payload);
      if (error) {
        setStatusMessage({ type: 'error', text: error });
      } else {
        setStatusMessage({ type: 'success', text: `"${prodName}" başarıyla güncellendi.` });
        resetForm();
        await loadAll();
      }
    } else {
      const { error } = await createProductInSupabase(payload);
      if (error) {
        setStatusMessage({ type: 'error', text: error });
      } else {
        setStatusMessage({ type: 'success', text: `"${prodName}" veritabanına eklendi.` });
        resetForm();
        await loadAll();
      }
    }

    setSavingProduct(false);
  };

  const handleQuickStock = async (item: Product, delta: number) => {
    const nextStock = Math.max(0, item.stock + delta);
    setProducts((prev) => prev.map((p) => (p.id === item.id ? { ...p, stock: nextStock } : p)));
    await patchProductQuickInSupabase(item.id, { stock: nextStock });
  };

  const handleQuickPriceSave = async (item: Product) => {
    const num = Number(quickPriceVal);
    if (!num || num <= 0) {
      setQuickPriceId(null);
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === item.id
          ? item.discountedPrice
            ? { ...p, discountedPrice: num }
            : { ...p, price: num }
          : p
      )
    );
    await patchProductQuickInSupabase(
      item.id,
      item.discountedPrice ? { discountedPrice: num } : { price: num }
    );
    setQuickPriceId(null);
    setStatusMessage({ type: 'success', text: `"${item.name}" fiyatı güncellendi.` });
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    const { error } = await deleteProductInSupabase(id);
    if (error) {
      setStatusMessage({ type: 'error', text: error });
    } else {
      if (editingProductId === id) resetForm();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setStatusMessage({ type: 'success', text: `"${name}" silindi.` });
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCampaign(true);
    setStatusMessage(null);

    const { error } = await createCampaignInSupabase({
      title: campTitle,
      price_label: campPriceLabel,
      image_url: campImageUrl.trim(),
    });

    if (error) {
      setStatusMessage({ type: 'error', text: error });
    } else {
      setStatusMessage({ type: 'success', text: `"${campTitle}" kampanyası yayınlandı.` });
      setCampTitle('');
      setCampPriceLabel('');
      setCampImageUrl('');
      await loadAll();
    }
    setSavingCampaign(false);
  };

  const handleDeleteCampaign = async (id: string, title: string) => {
    const { error } = await deleteCampaignInSupabase(id);
    if (!error) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      setStatusMessage({ type: 'success', text: `"${title}" kampanyası silindi.` });
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterTag !== 'all' && !p.tags.includes(filterTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Sekmeler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">
            Ürün & Kampanya Yönetimi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Seçtiğiniz makineye göre otomatik özellik kutuları ve tek tıkla eklenen hazır etiketler
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#005596] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package size={15} />
            Ürünler ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-[#005596] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Megaphone size={15} />
            Kampanyalar ({campaigns.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('homepage')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'homepage'
                ? 'bg-[#005596] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ImageIcon size={15} />
            Ana Sayfa Görselleri ({homepageSlides.length})
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`rounded-xl px-4 py-2.5 text-xs font-semibold border flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button type="button" onClick={() => setStatusMessage(null)} className="cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Sol: Akıllı Kategoriye Göre Değişen Ürün Ekleme / Güncelleme Formu */}
          <form
            onSubmit={handleSaveProduct}
            className="xl:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
                {editingProductId ? (
                  <>
                    <Pencil size={16} className="text-amber-600" />
                    Ürünü Güncelle
                  </>
                ) : (
                  <>
                    <Plus size={16} className="text-[#005596]" />
                    Yeni Ürün Ekle
                  </>
                )}
              </h2>
              {editingProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                >
                  <X size={13} /> Vazgeç
                </button>
              )}
            </div>

            {/* 1. Makine / Kategori Seçimi (Seçime Göre Alt Kısım Değişir) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                1. Ürün Kategorisi Seçin
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {CATEGORY_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTag === tpl.tag;
                  return (
                    <button
                      key={tpl.tag}
                      type="button"
                      onClick={() => handleCategoryChange(tpl.tag)}
                      className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#005596] text-white border-[#005596] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Küçük Ev Aletleri Alt Tür Seçimi */}
            {activeTemplate.subTypes && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 space-y-2">
                <label className="block text-[11px] font-bold text-[#005596]">
                  Küçük Ev Aleti Alt Türü
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {activeTemplate.subTypes.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubTypeChange(sub.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                        selectedSubTypeId === sub.id
                          ? 'bg-[#005596] text-white border-[#005596]'
                          : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Temel Bilgiler */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Ürün Adı *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder={`Örn: Profilo ${activeTemplate.label} Modeli`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005596]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Ürün / Model Kodu
                  </label>
                  <input
                    type="text"
                    value={prodModelCode}
                    onChange={(e) => setProdModelCode(e.target.value)}
                    placeholder="Örn: BD3086WEXN"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono uppercase text-slate-900 focus:outline-none focus:border-[#005596]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Marka</label>
                  <input
                    type="text"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005596]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Fiyat (₺) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  placeholder="38990"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#005596]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">İndirimli (₺)</label>
                <input
                  type="number"
                  min={0}
                  value={prodDiscounted}
                  onChange={(e) => setProdDiscounted(e.target.value)}
                  placeholder="34999"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#005596]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Stok *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#005596]"
                />
              </div>
            </div>

            {/* 3. Seçilen Makineye Özel Teknik Kutular */}
            {activeFields.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {activeSubType ? activeSubType.label : activeTemplate.label} Teknik Özellikleri
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        {field.label}
                      </label>
                      {field.options ? (
                        <select
                          value={specValues[field.key] || ''}
                          onChange={(e) =>
                            setSpecValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#005596]"
                        >
                          <option value="">Seçiniz...</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={specValues[field.key] || ''}
                          onChange={(e) =>
                            setSpecValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          placeholder={field.placeholder}
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#005596]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Hızlı Metin Kutuları (Tek Tıkla Özellik Ekle) */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500">
                Hızlı Özellik Metin Kutuları (Tıklayınca Eklenir)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {activeQuickChips.map((chip) => {
                  const active = featuresList.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleQuickChip(chip)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-[#005596] hover:text-[#005596]'
                      }`}
                    >
                      {active ? <Check size={11} /> : <Plus size={11} />}
                      {chip}
                    </button>
                  );
                })}
              </div>

              {/* Kendi hızlı metin kutunu yazıp ekle */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customFeatureText}
                  onChange={(e) => setCustomFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomFeature();
                    }
                  }}
                  placeholder="Özel özellik yazın ve + Ekle'ye basın..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                />
                <button
                  type="button"
                  onClick={addCustomFeature}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  + Ekle
                </button>
              </div>

              {featuresList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featuresList.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#005596] text-[11px] font-semibold"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() => toggleQuickChip(f)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Çoklu Ürün Fotoğrafları (Maks. 5 Adet) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-500">
                  Ürün Fotoğrafları (En fazla {MAX_PRODUCT_IMAGES} adet)
                </label>
                <span className="text-[11px] font-semibold text-[#005596]">
                  {prodImages.length} / {MAX_PRODUCT_IMAGES} Görsel
                </span>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.length) {
                    uploadProductFiles(e.dataTransfer.files);
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={prodImageInput}
                  onChange={(e) => setProdImageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addProductImageUrl();
                    }
                  }}
                  disabled={prodImages.length >= MAX_PRODUCT_IMAGES}
                  placeholder={
                    prodImages.length >= MAX_PRODUCT_IMAGES
                      ? 'Maksimum 5 görsele ulaşıldı'
                      : 'Görsel URL yapıştırın veya sürükleyip bırakın...'
                  }
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005596] disabled:bg-slate-50"
                />
                {prodImageInput.trim() && (
                  <button
                    type="button"
                    onClick={addProductImageUrl}
                    className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer shrink-0"
                  >
                    + Ekle
                  </button>
                )}
                <label
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 ${
                    prodImages.length >= MAX_PRODUCT_IMAGES
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                  }`}
                >
                  <Upload size={13} />
                  {uploadingProdImg ? 'Yükleniyor...' : 'Çoklu Seç'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={prodImages.length >= MAX_PRODUCT_IMAGES || uploadingProdImg}
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        uploadProductFiles(e.target.files);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {prodImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {prodImages.map((imgUrl, idx) => (
                    <div
                      key={`${imgUrl}-${idx}`}
                      className="group relative aspect-square rounded-xl border border-slate-200 bg-slate-50 overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Ürün görseli ${idx + 1}`}
                        className="w-full h-full object-contain p-1 pb-5"
                      />
                      <span
                        className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          idx === 0
                            ? 'bg-[#005596] text-white'
                            : 'bg-slate-800/75 text-white'
                        }`}
                      >
                        {idx === 0 ? '1 • Kapak' : `${idx + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeProductImage(idx)}
                        title="Görseli kaldır"
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-85 hover:opacity-100 cursor-pointer"
                      >
                        <X size={11} />
                      </button>

                      {/* Sıralama & Kapak Kontrolleri */}
                      <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-0.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveProductImage(idx, -1)}
                          title="Sola taşı"
                          className="w-5 h-5 rounded bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronLeft size={12} />
                        </button>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => setCoverProductImage(idx)}
                            title="1. sıraya (Kapak) al"
                            className="px-1 py-0.5 rounded bg-[#005596]/90 hover:bg-[#005596] text-white text-[8px] font-bold cursor-pointer truncate"
                          >
                            Kapak
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={idx === prodImages.length - 1}
                          onClick={() => moveProductImage(idx, 1)}
                          title="Sağa taşı"
                          className="w-5 h-5 rounded bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Açıklama (Boş bırakırsanız özelliklerden otomatik oluşturulur)
              </label>
              <textarea
                rows={2}
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                placeholder="İsteğe bağlı kısa açıklama..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
              />
            </div>

            <button
              type="submit"
              disabled={savingProduct || !isSupabaseConfigured}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-colors cursor-pointer disabled:opacity-50 ${
                editingProductId
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#005596] hover:bg-[#004478]'
              }`}
            >
              {savingProduct
                ? 'Kaydediliyor...'
                : editingProductId
                ? 'Değişiklikleri Güncelle'
                : 'Ürünü Ekle'}
            </button>
          </form>

          {/* Sağ: Kayıtlı Ürünler + Satır İçi Hızlı Fiyat/Stok Güncelleme */}
          <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün adı veya model ara..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                />
              </div>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#005596]"
              >
                <option value="all">Tüm Kategoriler ({products.length})</option>
                {CATEGORY_TEMPLATES.map((t) => (
                  <option key={t.tag} value={t.tag}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className="text-sm text-slate-400 py-8 text-center">Yükleniyor...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <Package size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">Henüz ürün eklenmemiş</p>
                <p className="text-xs text-slate-500 mt-1">
                  Soldaki bölümden makine türünü seçip hızlı özellik kutularıyla kolayca ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[720px] overflow-y-auto">
                {filteredProducts.map((item) => {
                  const activePrice = item.discountedPrice ?? item.price;
                  const isEditingPrice = quickPriceId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`py-3 px-2 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        editingProductId === item.id ? 'bg-amber-50/70' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.images[0] || '/resim/pasaoglulogo-crop.png'}
                          alt={item.name}
                          className="w-11 h-11 rounded-lg object-contain bg-white border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {item.brand} •{' '}
                            {CATEGORY_TEMPLATES.find((t) => item.tags.includes(t.tag))?.label ||
                              item.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={quickPriceVal}
                              onChange={(e) => setQuickPriceVal(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleQuickPriceSave(item);
                                if (e.key === 'Escape') setQuickPriceId(null);
                              }}
                              autoFocus
                              className="w-24 px-2 py-1 rounded-lg border border-[#005596] text-xs font-bold text-slate-900"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuickPriceSave(item)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                            >
                              <Check size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setQuickPriceId(item.id);
                              setQuickPriceVal(String(activePrice));
                            }}
                            title="Fiyatı hızlı düzenlemek için tıklayın"
                            className="text-xs font-bold text-[#005596] bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            {formatPrice(activePrice)}
                          </button>
                        )}

                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleQuickStock(item, -1)}
                            className="w-6 h-6 rounded-md bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-800">
                            {item.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickStock(item, 1)}
                            className="w-6 h-6 rounded-md bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          title="Tüm Bilgileri Düzenle"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id, item.name)}
                          title="Ürünü Sil"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'campaigns' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreateCampaign}
            className="xl:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit"
          >
            <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
              <Plus size={16} className="text-[#005596]" />
              Yeni Kampanya Afişi
            </h2>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Başlık *</label>
              <input
                type="text"
                required
                value={campTitle}
                onChange={(e) => setCampTitle(e.target.value)}
                placeholder="Örn: Kasım Çeyiz Fırsatı"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#005596]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Fiyat Etiketi</label>
              <input
                type="text"
                value={campPriceLabel}
                onChange={(e) => setCampPriceLabel(e.target.value)}
                placeholder="49.999 ₺"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#005596]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Afiş Görseli *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={campImageUrl}
                  onChange={(e) => setCampImageUrl(e.target.value)}
                  placeholder="URL veya yükleyin"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer shrink-0">
                  <Upload size={13} />
                  {uploadingCampImg ? '...' : 'Seç'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCampaignFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={savingCampaign || !isSupabaseConfigured}
              className="w-full py-2.5 rounded-xl bg-[#005596] hover:bg-[#004478] text-white font-bold text-sm cursor-pointer disabled:opacity-50"
            >
              {savingCampaign ? 'Kaydediliyor...' : 'Kampanyayı Yayınla'}
            </button>
          </form>

          <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-base font-display font-bold text-slate-900 mb-4">
              Yayındaki Kampanyalar ({campaigns.length})
            </h2>
            {campaigns.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">Henüz kampanya yok.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={camp.image_url}
                      alt={camp.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{camp.title}</p>
                        {camp.price_label && (
                          <p className="text-[11px] font-bold text-[#005596]">{camp.price_label}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(camp.id, camp.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreateSlide}
            className="xl:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit"
          >
            <div>
              <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
                <Plus size={16} className="text-[#005596]" />
                Ana Sayfa Vitrini Görseli Ekle
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Ana sayfanın en üstündeki büyük vitrin alanında dönecek görselleri buradan seçebilirsiniz.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Görsel Açıklaması (Opsiyonel)
              </label>
              <input
                type="text"
                value={slideTitle}
                onChange={(e) => setSlideTitle(e.target.value)}
                placeholder="Örn: Akkent Showroom Dış Cephe"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#005596]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Ekrana Sığdırma Modu
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSlideFitMode('contain')}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    slideFitMode === 'contain'
                      ? 'bg-[#005596] text-white border-[#005596]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tam Sığdır (Kesme Yok)
                </button>
                <button
                  type="button"
                  onClick={() => setSlideFitMode('cover')}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    slideFitMode === 'cover'
                      ? 'bg-[#005596] text-white border-[#005596]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tam Ekran Doldur
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Ana Sayfa Görseli *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={slideImageUrl}
                  onChange={(e) => setSlideImageUrl(e.target.value)}
                  placeholder="URL veya bilgisayarınızdan seçin"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer shrink-0">
                  <Upload size={13} />
                  {uploadingSlideImg ? '...' : 'Seç'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlideFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {slideImageUrl && (
              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slideImageUrl}
                  alt="Önizleme"
                  className={`w-full h-full ${
                    slideFitMode === 'contain' ? 'object-contain p-1' : 'object-cover'
                  }`}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={savingSlide || !isSupabaseConfigured}
              className="w-full py-2.5 rounded-xl bg-[#005596] hover:bg-[#004478] text-white font-bold text-sm cursor-pointer disabled:opacity-50"
            >
              {savingSlide ? 'Kaydediliyor...' : 'Ana Sayfaya Ekle'}
            </button>
          </form>

          <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-display font-bold text-slate-900">
                  Ana Sayfa Vitrin Görselleri ({homepageSlides.length})
                </h2>
                <p className="text-[11px] text-slate-500">
                  Liste boşsa sitedeki varsayılan mağaza fotoğrafları gösterilir; eklediğiniz anda sizin seçtikleriniz sırayla yayınlanır.
                </p>
              </div>
            </div>

            {homepageSlides.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">
                Henüz özel ana sayfa görseli eklenmemiş. Sol taraftan görsel ekleyebilirsiniz.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {homepageSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col"
                  >
                    <div className="relative h-44 bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image_url}
                        alt={slide.title}
                        className={`w-full h-full ${
                          slide.fit_mode === 'contain' ? 'object-contain p-1' : 'object-cover'
                        }`}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/75 text-white text-[10px] font-bold">
                        Sıra {idx + 1} • {slide.fit_mode === 'contain' ? 'Tam Sığdır' : 'Tam Doldur'}
                      </span>
                    </div>
                    <div className="p-3 flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {slide.title || `Görsel ${idx + 1}`}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, -1)}
                          title="Yukarı / Öne al"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === homepageSlides.length - 1}
                          onClick={() => handleMoveSlide(idx, 1)}
                          title="Aşağı / Sona al"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(slide.id, slide.title)}
                          title="Görseli sil"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
