import { NextResponse } from 'next/server';

export interface InstagramPostItem {
  id: string;
  image: string;
  title: string;
  permalink: string;
}

const defaultInstagramPosts: InstagramPostItem[] = [
  {
    id: 'ig-post-1',
    image: '/resim/kampanyalar/k1.jpeg',
    title: 'Kampanyaya Özel 4K Ultra HD / Android Smart TV (55PA525EQG) — 45.999 ₺',
    permalink: 'https://www.instagram.com/pasaoglu_profilo/',
  },
  {
    id: 'ig-post-2',
    image: '/resim/kampanyalar/k2.jpeg',
    title: 'İkili Alımlara Özel 9 Kg Çamaşır & Kurutma Makinesi — 49.999 ₺',
    permalink: 'https://www.instagram.com/pasaoglu_profilo/',
  },
  {
    id: 'ig-post-3',
    image: '/resim/kampanyalar/k3.jpeg',
    title: 'Kampanyaya Özel A++ Enerji Verimli Buzdolabı (RF4210W) — 89.999 ₺',
    permalink: 'https://www.instagram.com/pasaoglu_profilo/',
  },
  {
    id: 'ig-post-4',
    image: '/resim/kampanyalar/k4.jpeg',
    title: 'Kampanyaya Özel 4 Programlı Bulaşık Makinesi (BM4210MA) — 15.999 ₺',
    permalink: 'https://www.instagram.com/pasaoglu_profilo/',
  },
];

export async function GET() {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (token) {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=4&access_token=${token}`,
        { next: { revalidate: 900 } }
      );
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.data) && json.data.length > 0) {
          const livePosts: InstagramPostItem[] = json.data.slice(0, 4).map((item: any, idx: number) => ({
            id: item.id || `ig-${idx}`,
            image: item.media_type === 'VIDEO' ? item.thumbnail_url || item.media_url : item.media_url,
            title: item.caption || defaultInstagramPosts[idx]?.title || 'Instagram Kampanya Paylaşımı',
            permalink: item.permalink || 'https://www.instagram.com/pasaoglu_profilo/',
          }));
          return NextResponse.json({ posts: livePosts, source: 'instagram-graph-api' });
        }
      }
    }
  } catch {
    // Fallback to latest 4 Instagram posts
  }

  return NextResponse.json({ posts: defaultInstagramPosts, source: 'instagram-feed' });
}
