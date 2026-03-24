import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';
import Comments from '@/components/Comments';
const FALLBACK = 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&q=80';

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  author: string;
  createdAt: string;
  comments?: any[];
}

// 1. Buscamos directo en la Base de Datos (Más rápido y sin fallos de URL)
async function getNoticia(slug: string): Promise<NewsItem | null> {
  try {
    await connectDB();
    const noticia = await News.findOne({ slug }).lean();
    if (!noticia) return null;
    // Serializamos las fechas y el _id de Mongo para que React no se queje
    return JSON.parse(JSON.stringify(noticia));
  } catch {
    return null;
  }
}

async function getRelated(): Promise<NewsItem[]> {
  try {
    await connectDB();
    const news = await News.find().sort({ createdAt: -1 }).limit(4).lean();
    return JSON.parse(JSON.stringify(news));
  } catch {
    return [];
  }
}

// 2. Await en los params (Requisito indispensable de Next.js 15)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticia(slug);
  if (!noticia) return { title: 'Noticia no encontrada' };
  return {
    title: `${noticia.title} — Real Oviedo Noticias`,
    description: noticia.summary,
    openGraph: {
      title: noticia.title,
      description: noticia.summary,
      images: noticia.coverImage ? [noticia.coverImage] : [],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

// 3. El componente ahora lee los params de forma asíncrona
export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [noticia, related] = await Promise.all([getNoticia(slug), getRelated()]);

  if (!noticia) notFound();

  // Filtra la noticia actual de las relacionadas
  const relatedFiltered = related.filter((n) => n.slug !== slug).slice(0, 3);

  return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Miga de pan */}
          <nav className="flex items-center gap-2 text-xs text-oviedo-gray mb-6" style={{ fontFamily: 'var(--font-barlow)' }}>
            <Link href="/" className="hover:text-oviedo-blue transition-colors">Portada</Link>
            <span>›</span>
            <Link href={`/?category=${encodeURIComponent(noticia.category)}`} className="hover:text-oviedo-blue transition-colors">
              {noticia.category}
            </Link>
            <span>›</span>
            <span className="text-oviedo-ink line-clamp-1">{noticia.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── ARTÍCULO ── */}
            <article className="lg:col-span-2">
              {/* Cabecera del artículo */}
              <div className="mb-6">
                <span className="category-badge mb-3 inline-block">{noticia.category}</span>
                <h1
                    className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {noticia.title}
                </h1>
                <p
                    className="text-xl text-oviedo-gray leading-relaxed border-l-4 border-oviedo-blue pl-4"
                    style={{ fontFamily: 'var(--font-source-serif)', fontStyle: 'italic' }}
                >
                  {noticia.summary}
                </p>

                {/* Metadata del artículo */}
                <div
                    className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-oviedo-lightGray text-sm text-oviedo-gray"
                    style={{ fontFamily: 'var(--font-barlow)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-oviedo-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {noticia.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold">{noticia.author}</span>
                  </div>
                  <span>·</span>
                  <time className="capitalize">{formatDate(noticia.createdAt)}</time>
                </div>
              </div>

              {/* Imagen de portada */}
              <div className="relative w-full h-64 md:h-96 mb-8 overflow-hidden">
                <Image
                    src={noticia.coverImage || FALLBACK}
                    alt={noticia.title}
                    fill
                    className="object-cover"
                    priority
                />
              </div>

              {/* Contenido */}
              <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: noticia.content.replace(/\n/g, '<br/>') }}
              />

              {/* Footer del artículo */}
              <div className="mt-8 pt-6 border-t-2 border-oviedo-lightGray flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-oviedo-blue text-sm font-semibold hover:underline"
                    style={{ fontFamily: 'var(--font-barlow)' }}
                >
                  ← Volver a portada
                </Link>
                <span
                    className="text-xs text-oviedo-gray"
                    style={{ fontFamily: 'var(--font-barlow)' }}
                >
                Diario Tartiere
              </span>
              </div>

              {/* AQUI AÑADIMOS LA CAJA DE COMENTARIOS */}
              <Comments slug={slug} initialComments={noticia.comments || []} />

            </article>

            {/* ── SIDEBAR ── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4 space-y-8">
                {/* Noticias relacionadas */}
                <div>
                  <div className="bg-oviedo-blue px-4 py-3 mb-3">
                    <h3
                        className="text-white text-sm font-bold uppercase tracking-widest"
                        style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
                    >
                      Otras noticias
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {relatedFiltered.map((n) => (
                        <NewsCard key={n._id} {...n} size="small" />
                    ))}
                  </div>
                </div>

                {/* Widget del equipo */}
                <div className="bg-oviedo-blue text-white p-5">
                  <h3
                      className="text-oviedo-gold font-bold text-sm uppercase tracking-widest mb-4"
                      style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
                  >
                    El Club
                  </h3>
                  <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-barlow)' }}>
                    <li className="flex items-center gap-2">
                      <span className="text-oviedo-gold">🏟️</span> Carlos Tartiere, Oviedo
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-oviedo-gold">📅</span> Fundado en 1926
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-oviedo-gold">👕</span> Azul y blanco
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-oviedo-gold">🏆</span> LaLiga Hypermotion
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </main>
        <Footer />
      </>
  );
}