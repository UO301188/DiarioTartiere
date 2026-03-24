import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';
import AdminDeleteButton from '@/components/AdminDeleteButton';

const FALLBACK = 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=200&q=60';

async function getAllNews() {
  await connectDB();
  return News.find({}).sort({ createdAt: -1 }).lean();
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default async function AdminDashboard() {
  const news = await getAllNews();

  const totalNoticias = news.length;
  const destacadas    = news.filter((n) => n.featured).length;
  const categorias    = [...new Set(news.map((n) => n.category))].length;

  return (
    <div>
      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Noticias', value: totalNoticias, icon: '📰', color: 'bg-oviedo-blue' },
          { label: 'Destacadas',     value: destacadas,    icon: '⭐', color: 'bg-oviedo-gold' },
          { label: 'Categorías',     value: categorias,    icon: '🏷️', color: 'bg-oviedo-ink' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className={`${color} w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <div
                className="text-3xl font-black text-oviedo-ink"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {value}
              </div>
              <div
                className="text-xs text-oviedo-gray uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-barlow)' }}
              >
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Cabecera de la tabla ─── */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-bold text-oviedo-ink"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Todas las noticias
        </h2>
        <Link href="/admin/nueva-noticia" className="btn-primary">
          + Nueva noticia
        </Link>
      </div>

      {/* ─── Tabla de noticias ─── */}
      {news.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p
            className="text-oviedo-gray text-sm"
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            No hay noticias publicadas aún.
          </p>
          <Link href="/admin/nueva-noticia" className="btn-primary inline-block mt-4">
            Publicar la primera noticia
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
          {/* Cabecera tabla */}
          <div
            className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-oviedo-gray font-semibold"
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            <div className="col-span-1">Img</div>
            <div className="col-span-4">Título</div>
            <div className="col-span-2">Categoría</div>
            <div className="col-span-2">Autor</div>
            <div className="col-span-1">Dest.</div>
            <div className="col-span-1">Fecha</div>
            <div className="col-span-1">Acc.</div>
          </div>

          {/* Filas */}
          {news.map((n) => (
            <div
              key={n._id.toString()}
              className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-colors"
            >
              {/* Thumbnail */}
              <div className="col-span-1">
                <div className="relative w-10 h-10 overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={n.coverImage || FALLBACK}
                    alt={n.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Título */}
              <div className="col-span-4">
                <Link
                  href={`/noticias/${n.slug}`}
                  target="_blank"
                  className="text-sm font-semibold text-oviedo-ink hover:text-oviedo-blue transition-colors line-clamp-2"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {n.title}
                </Link>
              </div>

              {/* Categoría */}
              <div className="col-span-2">
                <span className="category-badge text-[10px]">{n.category}</span>
              </div>

              {/* Autor */}
              <div
                className="col-span-2 text-xs text-oviedo-gray truncate"
                style={{ fontFamily: 'var(--font-barlow)' }}
              >
                {n.author}
              </div>

              {/* Destacada */}
              <div className="col-span-1 text-center text-base">
                {n.featured ? '⭐' : <span className="text-gray-300">—</span>}
              </div>

              {/* Fecha */}
              <div
                className="col-span-1 text-xs text-oviedo-gray"
                style={{ fontFamily: 'var(--font-barlow)' }}
              >
                {formatDate(n.createdAt)}
              </div>

              {/* Acciones */}
              <div className="col-span-1 flex items-center gap-2">
                <Link
                  href={`/admin/editar/${n._id.toString()}`}
                  className="text-oviedo-blue hover:text-oviedo-blueDark text-xs font-semibold transition-colors"
                  style={{ fontFamily: 'var(--font-barlow)' }}
                  title="Editar"
                >
                  ✏️
                </Link>
                <AdminDeleteButton id={n._id.toString()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
