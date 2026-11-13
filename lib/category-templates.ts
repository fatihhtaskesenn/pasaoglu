import type { ProductCategory } from '@/types';

export interface CategoryFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  options?: string[];
}

export interface CategoryTemplate {
  tag: string;
  label: string;
  category: ProductCategory;
  fields: CategoryFieldDef[];
  quickChips: string[];
  subTypes?: {
    id: string;
    label: string;
    extraTag: string;
    fields: CategoryFieldDef[];
    quickChips: string[];
  }[];
}

export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    tag: 'buzdolabi',
    label: 'Buzdolabı',
    category: 'beyaz-esya',
    fields: [
      { key: 'hacim', label: 'Toplam Hacim', placeholder: 'Örn: 542 Litre' },
      { key: 'sogutma', label: 'Soğutma Tipi', options: ['No-Frost', 'LowFrost', 'Statik'] },
      { key: 'tip', label: 'Tipi', options: ['Üstten Donduruculu', 'Alttan Donduruculu (Kombi)', 'Gardırop Tipi'] },
      { key: 'renk', label: 'Renk / Yüzey', options: ['Beyaz', 'Inox (Parmak İzi Bırakmaz)', 'Siyah Cam', 'Antrasit'] },
    ],
    quickChips: [
      'No-Frost Soğutma Teknolojisi',
      'ExtraFresh Tazelik Çekmecesi',
      'Kapak Üzeri LED Dijital Ekran',
      'MultiAirflow Homojen Hava Akışı',
      'Sessiz Inverter Kompresör',
      'Süper Soğutma & Süper Dondurma',
      'Değiştirilebilir Kapı Yönü',
    ],
  },
  {
    tag: 'derin-dondurucu',
    label: 'Derin Dondurucu',
    category: 'beyaz-esya',
    fields: [
      { key: 'cekmece', label: 'Çekmece / Bölme', options: ['6 Çekmeceli', '7 Çekmeceli', '8 Çekmeceli', 'Sandık Tipi'] },
      { key: 'hacim', label: 'Net Hacim', placeholder: 'Örn: 242 Litre' },
      { key: 'sogutma', label: 'Soğutma Sistemi', options: ['No-Frost (Buzlanma Yapmaz)', 'LowFrost'] },
      { key: 'joker', label: 'Joker Modu', options: ['İster Dondurucu İster Soğutucu', 'Sadece Dondurucu'] },
    ],
    quickChips: [
      'BigBox Ekstra Derin Çekmece',
      'No-Frost Buzlanma Önleyici Sistem',
      'Joker (Soğutucu / Dondurucu) Özelliği',
      'Kapı Açık Uyarı Sinyali',
      'Elektrik Kesintisinde 24 Saat Koruma',
      'Parmak İzi Bırakmayan Inox',
    ],
  },
  {
    tag: 'bulasik-makinesi',
    label: 'Bulaşık Makinesi',
    category: 'beyaz-esya',
    fields: [
      { key: 'program', label: 'Program Sayısı', options: ['3 Programlı', '4 Programlı', '5 Programlı', '6 Programlı', '8 Programlı'] },
      { key: 'kapasite', label: 'Kapasite', options: ['12 Kişilik', '13 Kişilik', '14 Kişilik', '15 Kişilik'] },
      { key: 'renk', label: 'Renk', options: ['Beyaz', 'Inox', 'Siyah', 'Antrasit'] },
      { key: 'enerji', label: 'Enerji Sınıfı', options: ['C Sınıfı', 'D Sınıfı', 'E Sınıfı'] },
    ],
    quickChips: [
      'HijyenEkstra Yüksek Isı Opsiyonu',
      'Rackmatic Ayarlanabilir Üst Sepet',
      'Yarım Yük Ekonomik Yıkama',
      'Ekstra Kurutma Fonksiyonu',
      'Sessiz SilentPlus Motor',
      'Zaman Erteleme (1-24 Saat)',
      'Su Taşma Emniyeti (AquaStop)',
    ],
  },
  {
    tag: 'camasir-makinesi',
    label: 'Çamaşır Makinesi',
    category: 'beyaz-esya',
    fields: [
      { key: 'kapasite', label: 'Yıkama Kapasitesi', options: ['8 Kg', '9 Kg', '10 Kg', '11 Kg', '12 Kg'] },
      { key: 'devir', label: 'Sıkma Devri', options: ['1000 Devir/Dk', '1200 Devir/Dk', '1400 Devir/Dk'] },
      { key: 'motor', label: 'Motor', options: ['SilentPlus Inverter (10 Yıl Garantili)', 'Standart Motor'] },
      { key: 'renk', label: 'Renk', options: ['Beyaz', 'Inox / Gri', 'Siyah'] },
    ],
    quickChips: [
      'SilentPlus Fırçasız Inverter Motor',
      'Buhar Destekli Kırışıklık Azaltma',
      'Ekspres 15/30 Dk Hızlı Yıkama',
      'Leke Uzmanı Özel Programı',
      'Reload (Sonradan Çamaşır Ekleme)',
      'Yorgan & Perde Programı',
      'A Enerji Sınıfı Yüksek Tasarruf',
    ],
  },
  {
    tag: 'kurutma-makinesi',
    label: 'Kurutma Makinesi',
    category: 'beyaz-esya',
    fields: [
      { key: 'kapasite', label: 'Kurutma Kapasitesi', options: ['8 Kg', '9 Kg', '10 Kg'] },
      { key: 'teknoloji', label: 'Kurutma Teknolojisi', options: ['Isı Pompalı (Heat-Pump)', 'Yoğuşturmalı'] },
      { key: 'enerji', label: 'Enerji Sınıfı', options: ['A++', 'A+++', 'A+'] },
    ],
    quickChips: [
      'DuoTronic Nem Algılama Sensörü',
      'Kırışıklık Önleyici Hassas Tambur',
      '40 Dk Hızlı Gömlek/Bluz Kurutma',
      'Kendi Kendini Temizleyen Kondenser',
      'LED Tambur İçi Aydınlatma',
      'Titreşim Önleyici Sessiz Gövde',
    ],
  },
  {
    tag: 'ocak',
    label: 'Fırın & Ocak',
    category: 'beyaz-esya',
    fields: [
      { key: 'cihazTipi', label: 'Ürün Tipi', options: ['Ankastre Fırın', 'Ankastre Ocak', 'Ankastre 3’lü Set', 'Solo Fırınlı Ocak'] },
      { key: 'yuzey', label: 'Yüzey / Renk', options: ['Siyah Cam', 'Beyaz Cam', 'Inox / Paslanmaz Çelik'] },
      { key: 'hacim', label: 'Hacim / Göz Sayısı', placeholder: 'Örn: 72 Lt veya 4 Gözü Gazlı' },
    ],
    quickChips: [
      '3D Sıcak Hava Dolaşımı',
      'Gaz Emniyet Sistemi',
      'Otomatik Düğmeden Ateşleme',
      'Wok Bekli Yüksek Güçlü Göz',
      'Buharlı Kolay Temizleme (SteamClean)',
      'Dokunmatik Dijital Zamanlayıcı',
      'Döküm Izgara Sistemi',
    ],
  },
  {
    tag: 'davlumbaz',
    label: 'Davlumbaz',
    category: 'beyaz-esya',
    fields: [
      { key: 'genislik', label: 'Genişlik', options: ['60 cm', '90 cm'] },
      { key: 'tip', label: 'Tasarım', options: ['Eğimli Cam Duvar Tipi', 'Piramit Tipi', 'T-Tipi', 'Sürgülü Aspiratör'] },
      { key: 'renk', label: 'Renk', options: ['Siyah Cam', 'Beyaz Cam', 'Inox'] },
    ],
    quickChips: [
      'Yüksek Emiş Gücü (650+ m³/sa)',
      'Dokunmatik Cam Kontrol Paneli',
      'Bulaşık Makinesinde Yıkanabilir Yağ Filtresi',
      'Çift LED Ocak Aydınlatması',
      'Bacalı veya Karbon Filtreli Kullanım',
    ],
  },
  {
    tag: 'smart-tv',
    label: 'Televizyon',
    category: 'tv-ses-sistemleri',
    fields: [
      { key: 'ekran', label: 'Ekran Boyutu', options: ['43" (109 Ekran)', '50" (127 Ekran)', '55" (139 Ekran)', '65" (165 Ekran)', '75" (190 Ekran)'] },
      { key: 'cozunurluk', label: 'Çözünürlük', options: ['4K Ultra HD', 'QLED 4K', 'Full HD'] },
      { key: 'sistem', label: 'Akıllı Sistem', options: ['Lisanslı Android TV', 'Google TV', 'WebOS'] },
    ],
    quickChips: [
      'Netflix, YouTube, Prime Video Lisanslı',
      'Google Asistan Sesli Komut Kumanda',
      'HDR10 & Dolby Audio Ses Sistemi',
      'Dahili 4K Uydu Alıcısı',
      'Bluetooth & Chromecast Built-in',
      'Ultra İnce Çerçevesiz Tasarım',
    ],
  },
  {
    tag: 'klima',
    label: 'Klima',
    category: 'klima',
    fields: [
      { key: 'btu', label: 'Kapasite (BTU)', options: ['9.000 BTU', '12.000 BTU', '18.000 BTU', '24.000 BTU'] },
      { key: 'enerji', label: 'Enerji Verimliliği', options: ['A++ Soğutma / A+ Isıtma', 'A+++ Inverter'] },
      { key: 'gaz', label: 'Soğutucu Gaz', options: ['R32 Çevreci Gaz', 'R410A'] },
    ],
    quickChips: [
      'Wi-Fi Akıllı Telefon Kontrolü',
      'Hızlı Turbo Soğutma & Isıtma',
      'Golden Fin Korozyon Koruması',
      '-15°C Dış Ortamda Isıtma Desteği',
      'Uyku Modu & Sessiz Çalışma',
      'Kendi Kendini Temizleme (Self Clean)',
    ],
  },
  {
    tag: 'kucuk-ev-aletleri',
    label: 'Küçük Ev Aletleri',
    category: 'kucuk-ev-aletleri',
    fields: [],
    quickChips: ['2 Yıl Resmi Profilo Garantisi', 'Ergonomik Tasarım'],
    subTypes: [
      {
        id: 'supurge',
        label: 'Elektrikli & Dikey Süpürge',
        extraTag: 'supurge',
        fields: [
          { key: 'tip', label: 'Süpürge Tipi', options: ['Toz Torbasız (Siklon)', 'Toz Torbalı', 'Şarjlı Dikey Süpürge'] },
          { key: 'guc', label: 'Motor / Emiş Gücü', placeholder: 'Örn: 850W veya 25.2V' },
          { key: 'filtre', label: 'Filtre', options: ['HEPA 13 Yıkanabilir', 'HEPA 12'] },
        ],
        quickChips: [
          'HEPA 13 Alerjen Filtresi',
          'Yüksek Emiş Güçlü Siklon Motor',
          'Ultra Sessiz Çalışma (68 dB)',
          '10 Metre Çalışma Yarıçapı',
          'Çelik Teleskopik Boru & Parke Başlığı',
        ],
      },
      {
        id: 'robot-supurge',
        label: 'Akıllı Robot Süpürge',
        extraTag: 'robot-supurge',
        fields: [
          { key: 'emis', label: 'Emiş Gücü (Pa)', placeholder: 'Örn: 4000 Pa' },
          { key: 'navigasyon', label: 'Navigasyon', options: ['360° LiDAR Lazer Haritalama', 'Jiroskop'] },
          { key: 'mop', label: 'Paspas (Mop)', options: ['Vakum + Islak Mop 2’si 1 Arada', 'Çöp İstasyonlu'] },
        ],
        quickChips: [
          '360° LiDAR Lazer Oda Haritalama',
          'Türkçe Mobil Uygulama Kontrolü',
          '150 Dk Kesintisiz Pil Ömrü',
          'Otomatik Şarj İstasyonuna Dönüş',
          'Halı Tanıma & Emiş Artırma',
        ],
      },
      {
        id: 'cay-kahve',
        label: 'Çay & Kahve Makinesi',
        extraTag: 'kahve',
        fields: [
          { key: 'tur', label: 'Ürün Türü', options: ['Türk Kahvesi Makinesi', 'Filtre Kahve Makinesi', 'Çay Makinesi', 'Kettle / Su Isıtıcı'] },
          { key: 'kapasite', label: 'Kapasite', placeholder: 'Örn: 4 Fincan veya 1.7 Lt' },
          { key: 'govde', label: 'Gövde', options: ['Paslanmaz Çelik (Inox)', 'Cam Hazneli', 'Siyah / Rose'] },
        ],
        quickChips: [
          'Taşma Önleyici Akıllı Sensör',
          'Közde Yavaş Pişirme Özelliği',
          'Otomatik Sıcak Tutma & Kapanma',
          'Susuz Çalışma Emniyeti',
          'Damlama Önleyici (Anti-Drip) Sistem',
        ],
      },
      {
        id: 'mutfak-robotu',
        label: 'Blender & Mutfak Robotu',
        extraTag: 'blender',
        fields: [
          { key: 'guc', label: 'Motor Gücü', placeholder: 'Örn: 1200 Watt' },
          { key: 'tur', label: 'Ürün Türü', options: ['Cam Sürahili Blender', 'El Blender Seti', 'Mutfak Şefi / Mikser', 'Doğrayıcı Rondo'] },
          { key: 'bicak', label: 'Bıçak Yapısı', options: ['4 Kanatlı Paslanmaz Çelik', '6 Kanatlı Buz Kırıcı'] },
        ],
        quickChips: [
          'Buz Kırma & Smoothie Fonksiyonu',
          'Isıya Dayanıklı Cam Hazne',
          'Kademeli Hız + Turbo (Pulse) Modu',
          'Bulaşık Makinesinde Yıkanabilir Parçalar',
          'Kaymaz Taban Ayakları',
        ],
      },
      {
        id: 'tost-izgara',
        label: 'Tost & Izgara / Airfryer',
        extraTag: 'tost-makinesi',
        fields: [
          { key: 'guc', label: 'Güç', placeholder: 'Örn: 2000 Watt' },
          { key: 'plaka', label: 'Plaka / Hazne', options: ['Çıkarılabilir Döküm Plaka', 'Granit Kaplama', 'XXL Airfryer Haznesi'] },
        ],
        quickChips: [
          '180° Açılabilir Izgara Özelliği',
          'Çıkarılabilir Yıkanabilir Döküm Plakalar',
          'Kademeli Termostat Isı Ayarı',
          'Yağ Toplama Haznesi',
        ],
      },
      {
        id: 'utu',
        label: 'Ütü & Buhar Kazanlı',
        extraTag: 'utu',
        fields: [
          { key: 'guc', label: 'Güç (Watt)', placeholder: 'Örn: 2800 Watt' },
          { key: 'tip', label: 'Tip', options: ['Buharlı Ütü', 'Buhar Kazanlı Ütü', 'Dikey Buharlı Kırışıklık Giderici'] },
        ],
        quickChips: [
          'Yüksek Şok Buhar Basıncı',
          'Seramik Kaygan Taban',
          'Kendi Kendini Temizleyen Kireç Önleyici',
          'Otomatik Emniyet Kapanması',
        ],
      },
      {
        id: 'kisisel-bakim',
        label: 'Saç Kurutma & Kişisel Bakım',
        extraTag: 'kisisel-bakim',
        fields: [
          { key: 'guc', label: 'Motor Gücü', placeholder: 'Örn: 2200W AC Motor' },
          { key: 'ozellik', label: 'Bakım Teknolojisi', options: ['İyonik Elektriklenme Önleyici', 'Difüzör Başlıklı', 'Seramik Plaka'] },
        ],
        quickChips: [
          'Elektriklenme Önleyici İyonik Teknoloji',
          '3 Isı & 2 Hız Kademesi',
          'Soğuk Hava Sabitleme Tuşu',
          'Difüzör & Dar Fön Başlığı',
        ],
      },
    ],
  },
];

