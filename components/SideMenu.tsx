'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SideMenu({ session, categories }: { session: any, categories: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const userRole = session?.user ? (session.user as any).role : null;

    return (
        <>
            {/* Botón de la Hamburguesa */}
            <button onClick={() => setIsOpen(true)} className="text-white hover:text-oviedo-gold transition-colors p-2 flex items-center justify-center bg-white/10 rounded">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Fondo oscuro al abrir el menú */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            )}

            {/* Panel lateral que se desliza */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-oviedo-ink text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Cabecera del panel */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-oviedo-blueDark">
                    <span className="font-bold text-oviedo-gold text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>Menú</span>
                    <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-400 p-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Opciones */}
                <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4" style={{ fontFamily: 'var(--font-barlow)' }}>

                    {/* Tarjeta de Usuario */}
                    {session ? (
                        <div className="bg-white/5 p-4 rounded border border-white/10 mb-2">
                            <p className="text-xs text-white/60 mb-1 uppercase tracking-widest">Conectado como:</p>
                            <p className="font-bold text-base truncate text-oviedo-gold">{session.user?.name}</p>

                            {userRole === 'admin' && (
                                <Link href="/admin" onClick={() => setIsOpen(false)} className="block mt-4 text-sm text-white hover:text-oviedo-gold hover:underline uppercase font-bold">
                                    ⚙️ Panel Administrador
                                </Link>
                            )}
                            <Link href="/api/auth/signout?callbackUrl=/" className="block mt-4 text-sm text-red-400 hover:text-red-300 hover:underline uppercase font-bold">
                                🚪 Cerrar Sesión
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)} className="btn-primary text-center text-sm py-3 mb-2 block uppercase tracking-widest">
                            Identificarse / Registro
                        </Link>
                    )}

                    <div className="h-px bg-white/10 my-2" />

                    {/* Navegación de Noticias */}
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-bold text-white hover:text-oviedo-gold transition-colors uppercase tracking-widest">
                        🏠 Portada
                    </Link>
                    {categories.map((cat) => (
                        <Link key={cat} href={`/?category=${encodeURIComponent(cat)}`} onClick={() => setIsOpen(false)} className="text-sm text-white/80 hover:text-oviedo-gold transition-colors uppercase tracking-widest pl-2 border-l-2 border-transparent hover:border-oviedo-gold">
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}