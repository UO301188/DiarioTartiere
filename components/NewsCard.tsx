import Link from 'next/link';
import Image from 'next/image';

interface NewsCardProps {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage?: string;
  category: string;
  author: string;
  createdAt: string;
  size?: 'hero' | 'large' | 'normal' | 'small';
}

const FALLBACK = 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800&q=80';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function CategoryBadge({ category }: { category: string }) {
  const isSpecial = ['Fichajes', 'Historia', 'Opinión'].includes(category);
  return (
    <span className={`category-badge ${isSpecial ? 'category-badge--gold' : ''}`}>
      {category}
    </span>
  );
}

/* ─── HERO ─── */
function HeroCard({ slug, title, summary, coverImage, category, author, createdAt }: NewsCardProps) {
  return (
    <Link href={`/noticias/${slug}`} className="group block relative overflow-hidden col-span-2 row-span-2">
      <div className="relative h-[480px] md:h-[560px] w-full overflow-hidden">
        <Image
          src={coverImage || FALLBACK}
          alt={title}
          fill
          className="object-cover news-card-img"
          priority
        />
        {/* Gradiente oscuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <CategoryBadge category={category} />
        <h2
          className="text-white text-3xl md:text-4xl font-black mt-3 mb-3 leading-tight group-hover:text-oviedo-gold transition-colors"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {title}
        </h2>
        <p className="text-white/80 text-sm line-clamp-2 mb-3" style={{ fontFamily: 'var(--font-source-serif)' }}>
          {summary}
        </p>
        <div className="flex items-center gap-3 text-white/50 text-xs" style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.04em' }}>
          <span>{author}</span>
          <span>·</span>
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
      {/* Borde dorado al hover */}
      <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-oviedo-gold transition-all duration-500" />
    </Link>
  );
}

/* ─── LARGE ─── */
function LargeCard({ slug, title, summary, coverImage, category, author, createdAt }: NewsCardProps) {
  return (
    <Link href={`/noticias/${slug}`} className="group block">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={coverImage || FALLBACK}
          alt={title}
          fill
          className="object-cover news-card-img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={category} />
        </div>
      </div>
      <div className="pt-3 pb-4 border-b border-oviedo-lightGray">
        <h3
          className="text-lg font-bold leading-snug group-hover:text-oviedo-blue transition-colors line-clamp-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {title}
        </h3>
        <p className="text-oviedo-gray text-sm mt-2 line-clamp-2" style={{ fontFamily: 'var(--font-source-serif)' }}>
          {summary}
        </p>
        <div className="flex items-center gap-2 mt-2 text-oviedo-gray text-xs" style={{ fontFamily: 'var(--font-barlow)' }}>
          <span>{author}</span>
          <span>·</span>
          <time>{formatDate(createdAt)}</time>
        </div>
      </div>
    </Link>
  );
}

/* ─── NORMAL ─── */
function NormalCard({ slug, title, summary, coverImage, category, createdAt }: NewsCardProps) {
  return (
    <Link href={`/noticias/${slug}`} className="group flex gap-3 border-b border-oviedo-lightGray pb-4">
      <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden">
        <Image
          src={coverImage || FALLBACK}
          alt={title}
          fill
          className="object-cover news-card-img"
        />
      </div>
      <div className="flex-1 min-w-0">
        <CategoryBadge category={category} />
        <h4
          className="text-sm font-bold mt-1 leading-snug group-hover:text-oviedo-blue transition-colors line-clamp-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {title}
        </h4>
        <time className="text-oviedo-gray text-xs mt-1 block" style={{ fontFamily: 'var(--font-barlow)' }}>
          {formatDate(createdAt)}
        </time>
      </div>
    </Link>
  );
}

/* ─── SMALL (lista) ─── */
function SmallCard({ slug, title, category, createdAt }: NewsCardProps) {
  return (
    <Link
      href={`/noticias/${slug}`}
      className="group flex items-start gap-2 py-2 border-b border-oviedo-lightGray last:border-0"
    >
      <span className="text-oviedo-gold font-bold text-lg leading-none mt-0.5">›</span>
      <div>
        <span className="text-[10px] text-oviedo-blue font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-barlow)' }}>
          {category}
        </span>
        <p
          className="text-sm font-semibold leading-snug group-hover:text-oviedo-blue transition-colors line-clamp-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {title}
        </p>
        <time className="text-oviedo-gray text-xs" style={{ fontFamily: 'var(--font-barlow)' }}>
          {formatDate(createdAt)}
        </time>
      </div>
    </Link>
  );
}

/* ─── EXPORT ─── */
export default function NewsCard(props: NewsCardProps) {
  switch (props.size) {
    case 'hero':   return <HeroCard   {...props} />;
    case 'large':  return <LargeCard  {...props} />;
    case 'small':  return <SmallCard  {...props} />;
    default:       return <NormalCard {...props} />;
  }
}
