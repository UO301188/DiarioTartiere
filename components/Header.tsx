import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const categories = ['Primera División', 'Copa del Rey', 'Fichajes', 'Cantera', 'Opinión', 'Historia'];

export default async function Header() {
    const session = await getServerSession(authOptions);
    // Extraemos el rol de forma segura
    const userRole = session?.user ? (session.user as any).role : null;

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <header>
            {/* Franja superior inteligente */}
            <div className="bg-oviedo-ink text-white py-1 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <span className="capitalize" style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.06em' }}>
            {dateStr}
          </span>

                    <div className="flex items-center gap-4" style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.06em' }}>
                        {session ? (
                            <>
                                <span className="text-white/60">Hola, <span className="text-white">{session.user?.name}</span></span>

                                {/* 🤫 Este botón SOLO lo ves tú */}
                                {userRole === 'admin' && (
                                    <Link href="/admin" className="text-oviedo-gold hover:text-white transition-colors uppercase font-bold">
                                        Panel Admin ↗
                                    </Link>
                                )}

                                {/* Botón rápido para salir desde la portada (usando ruta API nativa de NextAuth) */}
                                <Link href="/api/auth/signout?callbackUrl=/" className="text-white/40 hover:text-red-400 transition-colors uppercase">
                                    Salir
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" className="hover:text-oviedo-gold transition-colors uppercase">
                                Identificarse
                            </Link>
                        )}
                    </div>
                </div>
            </div>


        {/* Cabecera principal */}
        <div className="bg-oviedo-blue text-white py-5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo Nuevo */}
            <Link href="/" className="inline-block group">
              <div className="bg-white rounded-md p-2 shadow-lg flex-shrink-0 transition-transform group-hover:scale-105">
                <Image
                    src="/logo.png"
                    alt="Diario Tartiere"
                    width={200}
                    height={70}
                    priority
                    className="w-40 md:w-56 h-auto object-contain"
                />
              </div>
            </Link>

            {/* Lema */}
            <div className="hidden md:block text-right">
              <p className="text-oviedo-gold font-bold italic text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>
                &ldquo;¡Vamos, Oviedo!&rdquo;
              </p>
              <p className="text-white/60 text-xs mt-1" style={{ fontFamily: 'var(--font-barlow)' }}>
                La voz del Tartiere desde la red
              </p>
            </div>
          </div>
        </div>

        {/* Barra de navegación */}
        <nav className="bg-oviedo-blueDark border-b-2 border-oviedo-gold">
          <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto">
            <Link href="/" className="flex-shrink-0 px-4 py-3 text-white hover:text-oviedo-gold text-xs uppercase tracking-widest font-semibold transition-colors border-r border-white/10" style={{ fontFamily: 'var(--font-barlow)' }}>
              Portada
            </Link>
            {categories.map((cat) => (
                <Link key={cat} href={`/?category=${encodeURIComponent(cat)}`} className="flex-shrink-0 px-4 py-3 text-white/80 hover:text-oviedo-gold text-xs uppercase tracking-widest font-semibold transition-colors whitespace-nowrap" style={{ fontFamily: 'var(--font-barlow)' }}>
                  {cat}
                </Link>
            ))}
          </div>
        </nav>

        {/* Ticker de noticias */}
        <div className="bg-oviedo-gold flex items-center overflow-hidden h-8">
        <span className="bg-oviedo-ink text-white px-3 h-full flex items-center text-xs font-bold flex-shrink-0 z-10" style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.1em' }}>
          ÚLTIMA HORA
        </span>
          <div className="overflow-hidden flex-1">
          <span className="ticker-content text-oviedo-ink text-xs font-semibold" style={{ fontFamily: 'var(--font-barlow)' }}>
            &nbsp;&nbsp;⚽&nbsp; Diario Tartiere — Toda la actualidad del equipo carbayón, temporada a temporada &nbsp;|&nbsp;
            🏟️&nbsp; Estadio Carlos Tartiere — La fortaleza azul del norte &nbsp;|&nbsp;
            📰&nbsp; Bienvenido al diario digital del Real Oviedo &nbsp;&nbsp;
          </span>
          </div>
        </div>
      </header>
  );
}