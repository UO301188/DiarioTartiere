import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import AdminLogoutButton from '@/components/AdminLogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 bg-oviedo-blueDark flex flex-col flex-shrink-0 shadow-xl">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <Link href="/admin" className="block">
            <div
              className="text-oviedo-gold font-black text-xl"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Real Oviedo
            </div>
            <div
              className="text-white/50 text-xs uppercase tracking-widest mt-0.5"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Backoffice
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-4">
          <p
            className="px-4 py-2 text-white/30 text-xs uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            Contenido
          </p>
          <Link href="/admin" className="admin-sidebar-link text-white/80 hover:text-white">
            <span>📋</span> Dashboard
          </Link>
          <Link href="/admin/nueva-noticia" className="admin-sidebar-link text-white/80 hover:text-white">
            <span>✏️</span> Nueva Noticia
          </Link>

          <p
            className="px-4 pt-4 pb-2 text-white/30 text-xs uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            Sitio
          </p>
          <Link
            href="/"
            target="_blank"
            className="admin-sidebar-link text-white/80 hover:text-white"
          >
            <span>🌐</span> Ver portada
          </Link>
        </nav>

        {/* Usuario + logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-oviedo-gold flex items-center justify-center text-oviedo-ink text-xs font-bold rounded-full">
              {session.user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div>
              <div
                className="text-white text-xs font-semibold"
                style={{ fontFamily: 'var(--font-barlow)' }}
              >
                {session.user?.name}
              </div>
              <div
                className="text-white/40 text-xs"
                style={{ fontFamily: 'var(--font-barlow)' }}
              >
                {session.user?.email}
              </div>
            </div>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* ─── CONTENIDO PRINCIPAL ─── */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1
            className="text-lg font-bold text-oviedo-ink"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Panel de Administración
          </h1>
          <span
            className="text-xs text-oviedo-gray"
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            Real Oviedo Noticias · Backoffice
          </span>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
