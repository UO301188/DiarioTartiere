import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';
import StandingsTable from '@/components/StandingsTable';
import RecentMatches from '@/components/RecentMatches';

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    coverImage?: string;
    category: string;
    author: string;
    createdAt: string;
}

// 1. Buscamos directo en la Base de Datos (Igual que en la noticia individual)
async function getNews(category?: string): Promise<NewsItem[]> {
    try {
        await connectDB();
        const filter = category ? { category } : {};
        // Traemos las últimas 20 noticias ordenadas de más nueva a más vieja
        const news = await News.find(filter).sort({ createdAt: -1 }).limit(20).lean();

        // Serializamos para que React pase los datos al cliente sin problemas
        return JSON.parse(JSON.stringify(news));
    } catch (error) {
        console.error("Error cargando noticias en portada:", error);
        return [];
    }
}

function CategoryStrip({ news }: { news: NewsItem[] }) {
    const cats = ['Fichajes', 'Cantera', 'Copa del Rey'];
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-oviedo-lightGray border border-oviedo-lightGray mt-10">
            {cats.map((cat) => {
                const item = news.find((n) => n.category === cat);
                if (!item) return null;
                return (
                    <div key={cat} className="bg-oviedo-white p-5">
                        <div className="divider-line" />
                        <span
                            className="text-xs uppercase tracking-widest text-oviedo-blue font-semibold"
                            style={{ fontFamily: 'var(--font-barlow)' }}
                        >
              {cat}
            </span>
                        <NewsCard {...item} size="large" />
                    </div>
                );
            })}
        </div>
    );
}

// 2. Await en los searchParams (Requisito de Next.js 15)
export default async function HomePage({
                                           searchParams,
                                       }: {
    searchParams: Promise<{ category?: string }>;
}) {
    const params = await searchParams;
    const category = params.category;

    const news = await getNews(category);

    const hero      = news[0];
    const secondary = news.slice(1, 4);
    const tertiary  = news.slice(4, 8);
    const sidebar   = news.slice(8, 14);
    const rest      = news.slice(14);

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-8">

                {/* Filtro activo */}
                {category && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="divider-line flex-shrink-0 w-8" />
                        <h2
                            className="text-2xl font-bold text-oviedo-blue"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                        >
                            {category}
                        </h2>
                        <a href="/" className="ml-auto text-xs text-oviedo-gray hover:text-oviedo-blue transition-colors" style={{ fontFamily: 'var(--font-barlow)' }}>
                            ✕ Quitar filtro
                        </a>
                    </div>
                )}

                {news.length === 0 ? (
                    /* Estado vacío */
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">⚽</div>
                        <h2
                            className="text-2xl font-bold text-oviedo-blue mb-2"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                        >
                            Aún no hay noticias publicadas
                        </h2>
                        <p className="text-oviedo-gray mb-6" style={{ fontFamily: 'var(--font-barlow)' }}>
                            Accede al panel de administración para publicar la primera noticia.
                        </p>
                        <a href="/login" className="btn-primary inline-block">Ir al panel</a>
                    </div>
                ) : (
                    <>
                        {/* ══ BLOQUE PRINCIPAL ══ */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Hero + secundarias */}
                            <div className="lg:col-span-2">
                                {hero && <NewsCard {...hero} size="hero" />}

                                {/* Secundarias en fila */}
                                {secondary.length > 0 && (
                                    <div className="mt-6">
                                        <div className="divider-line" />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            {secondary.map((n) => (
                                                <NewsCard key={n._id} {...n} size="large" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Columna lateral — Más leídas y Widgets */}
                            <aside className="lg:col-span-1">
                                <div className="sticky top-4">

                                    {/* WIDGETS DE FÚTBOL (Clasificación y Resultados) */}
                                    <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse mb-6 rounded border border-gray-200"></div>}>
                                        <StandingsTable />
                                    </Suspense>

                                    <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse mb-6 rounded border border-gray-200"></div>}>
                                        <RecentMatches />
                                    </Suspense>

                                    {/* Última Hora */}
                                    <div className="bg-oviedo-blue p-4 mb-1">
                                        <h3
                                            className="text-white font-bold text-sm uppercase tracking-widest"
                                            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
                                        >
                                            Última Hora
                                        </h3>
                                    </div>
                                    <div className="bg-white border border-oviedo-lightGray p-4 space-y-0">
                                        {sidebar.length > 0
                                            ? sidebar.map((n) => <NewsCard key={n._id} {...n} size="small" />)
                                            : <p className="text-oviedo-gray text-sm py-4 text-center" style={{ fontFamily: 'var(--font-barlow)' }}>Sin noticias recientes</p>
                                        }
                                    </div>
                                </div>
                            </aside>
                        </div>

                        {/* ══ BANDA DE CATEGORÍAS ══ */}
                        <Suspense>
                            <CategoryStrip news={news} />
                        </Suspense>

                        {/* ══ GRID TERCIARIO ══ */}
                        {tertiary.length > 0 && (
                            <section className="mt-10">
                                <div className="divider-line" />
                                <h2
                                    className="text-xl font-bold text-oviedo-ink mb-5"
                                    style={{ fontFamily: 'var(--font-playfair)' }}
                                >
                                    Más noticias
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {tertiary.map((n) => (
                                        <NewsCard key={n._id} {...n} size="large" />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ══ LISTA ADICIONAL ══ */}
                        {rest.length > 0 && (
                            <section className="mt-10 max-w-2xl">
                                <div className="divider-line" />
                                <h2
                                    className="text-xl font-bold text-oviedo-ink mb-4"
                                    style={{ fontFamily: 'var(--font-playfair)' }}
                                >
                                    También en Oviedo Noticias
                                </h2>
                                <div className="space-y-3">
                                    {rest.map((n) => (
                                        <NewsCard key={n._id} {...n} size="normal" />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}