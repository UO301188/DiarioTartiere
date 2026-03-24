import Link from 'next/link';

const categories = ['Primera División', 'Copa del Rey', 'Fichajes', 'Cantera', 'Opinión', 'Historia'];

export default function Header() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header>
      {/* Franja superior — fecha + admin link */}
      <div className="bg-oviedo-ink text-white py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <span
            className="capitalize"
            style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.06em' }}
          >
            {dateStr}
          </span>
          <Link
            href="/login"
            className="hover:text-oviedo-gold transition-colors"
            style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.06em' }}
          >
            Admin ↗
          </Link>
        </div>
      </div>

      {/* Cabecera principal */}
      <div className="bg-oviedo-blue text-white py-5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Nombre */}
          <Link href="/" className="flex items-center gap-4 group">
            {/* Escudo SVG simplificado */}
            <div className="w-14 h-14 bg-white rounded-sm flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg viewBox="0 0 56 56" className="w-10 h-10" fill="none">
                <rect width="56" height="56" fill="white"/>
                <path d="M28 4 L52 15 L52 30 C52 42 42 51 28 54 C14 51 4 42 4 30 L4 15 Z"
                      fill="#003F8A" stroke="#C8A84B" strokeWidth="2"/>
                <path d="M28 4 L28 54" stroke="#C8A84B" strokeWidth="1.5"/>
                <path d="M4 28 L52 28" stroke="#C8A84B" strokeWidth="1"/>
                <text x="12" y="44" fill="white" fontSize="9" fontWeight="bold" fontFamily="Georgia">RO</text>
              </svg>
            </div>
            <div>
              <div
                className="text-oviedo-gold text-xs uppercase tracking-widest mb-0.5"
                style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
              >
                Diario Digital
              </div>
              <h1
                className="text-3xl md:text-4xl font-black leading-none text-white group-hover:text-oviedo-gold transition-colors"
                style={{ fontFamily: 'var(--font-playfair)', fontWeight: 900 }}
              >
                Real Oviedo
              </h1>
              <div
                className="text-oviedo-gold/80 text-xs uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-barlow)' }}
              >
                Noticias · Carbayones
              </div>
            </div>
          </Link>

          {/* Lema */}
          <div className="hidden md:block text-right">
            <p
              className="text-oviedo-gold font-bold italic text-xl"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              &ldquo;¡Vamos, Oviedo!&rdquo;
            </p>
            <p className="text-white/60 text-xs mt-1" style={{ fontFamily: 'var(--font-barlow)' }}>
              La voz del Tartiere desde la red
            </p>
          </div>
        </div>
      </div>

      {/* Barra de navegación de categorías */}
      <nav className="bg-oviedo-blueDark border-b-2 border-oviedo-gold">
        <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto">
          <Link
            href="/"
            className="flex-shrink-0 px-4 py-3 text-white hover:text-oviedo-gold text-xs uppercase tracking-widest font-semibold transition-colors border-r border-white/10"
            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
          >
            Portada
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className="flex-shrink-0 px-4 py-3 text-white/80 hover:text-oviedo-gold text-xs uppercase tracking-widest font-semibold transition-colors whitespace-nowrap"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </nav>

      {/* Ticker de noticias */}
      <div className="bg-oviedo-gold flex items-center overflow-hidden h-8">
        <span
          className="bg-oviedo-ink text-white px-3 h-full flex items-center text-xs font-bold flex-shrink-0 z-10"
          style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.1em' }}
        >
          ÚLTIMA HORA
        </span>
        <div className="overflow-hidden flex-1">
          <span
            className="ticker-content text-oviedo-ink text-xs font-semibold"
            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
          >
            &nbsp;&nbsp;⚽&nbsp; Real Oviedo CF — Toda la actualidad del equipo carbayón, temporada a temporada &nbsp;|&nbsp;
            🏟️&nbsp; Estadio Carlos Tartiere — La fortaleza azul del norte &nbsp;|&nbsp;
            📰&nbsp; Bienvenido al diario digital del Real Oviedo &nbsp;&nbsp;
          </span>
        </div>
      </div>
    </header>
  );
}
