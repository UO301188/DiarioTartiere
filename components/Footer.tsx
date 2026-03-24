import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-oviedo-ink text-white mt-16">
      {/* Franja dorada superior */}
      <div className="h-1 bg-oviedo-gold" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Columna 1 — Identidad */}
          <div>
            <h3
              className="text-2xl font-black text-oviedo-gold mb-3"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Real Oviedo Noticias
            </h3>
            <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-barlow)' }}>
              El diario digital independiente dedicado al Real Oviedo. Información, análisis y pasión carbayona.
            </p>
          </div>

          {/* Columna 2 — Secciones */}
          <div>
            <h4
              className="text-xs uppercase tracking-widest text-oviedo-gold mb-4 font-semibold"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Secciones
            </h4>
            <ul className="space-y-2">
              {['Primera División', 'Copa del Rey', 'Fichajes', 'Cantera', 'Opinión', 'Historia'].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/?category=${encodeURIComponent(cat)}`}
                    className="text-white/70 hover:text-oviedo-gold text-sm transition-colors"
                    style={{ fontFamily: 'var(--font-barlow)' }}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Datos del club */}
          <div>
            <h4
              className="text-xs uppercase tracking-widest text-oviedo-gold mb-4 font-semibold"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              El Club
            </h4>
            <ul className="space-y-1 text-sm text-white/70" style={{ fontFamily: 'var(--font-barlow)' }}>
              <li>🏟️ Estadio Carlos Tartiere, Oviedo</li>
              <li>📅 Fundado: 1926</li>
              <li>🎨 Colores: Azul y Blanco</li>
              <li>🏆 LaLiga Hypermotion</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pie de copyright */}
      <div className="border-t border-white/10 py-4">
        <p
          className="text-center text-white/40 text-xs"
          style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.06em' }}
        >
          © {year} Real Oviedo Noticias · Proyecto independiente de aficionados · No afiliado al Real Oviedo
        </p>
      </div>
    </footer>
  );
}
