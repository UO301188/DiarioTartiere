'use client';
import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router   = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email, password, redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Credenciales incorrectas. Verifica email y contraseña.');
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-oviedo-ink flex flex-col items-center justify-center px-4">
      {/* Patrón de fondo */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #003F8A 0, #003F8A 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="inline-flex flex-col items-center">
              <div className="w-16 h-16 bg-oviedo-blue border-2 border-oviedo-gold flex items-center justify-center mb-3 shadow-xl">
                <svg viewBox="0 0 56 56" className="w-10 h-10" fill="none">
                  <path d="M28 4 L52 15 L52 30 C52 42 42 51 28 54 C14 51 4 42 4 30 L4 15 Z"
                        fill="#003F8A" stroke="#C8A84B" strokeWidth="2"/>
                  <path d="M28 4 L28 54" stroke="#C8A84B" strokeWidth="1.5"/>
                  <path d="M4 28 L52 28" stroke="#C8A84B" strokeWidth="1"/>
                  <text x="12" y="44" fill="white" fontSize="9" fontWeight="bold" fontFamily="Georgia">RO</text>
                </svg>
              </div>
              <h1
                className="text-3xl font-black text-white"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Real Oviedo
              </h1>
              <span
                className="text-oviedo-gold text-xs uppercase tracking-widest mt-1"
                style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
              >
                Panel de Administración
              </span>
            </div>
          </Link>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 shadow-2xl">
          <div className="h-1 bg-oviedo-gold -mx-8 -mt-8 mb-8" />
          <h2
            className="text-xl font-bold text-oviedo-ink mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Acceso Restringido
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 mb-5" style={{ fontFamily: 'var(--font-barlow)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1"
                style={{ fontFamily: 'var(--font-barlow)' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1"
                style={{ fontFamily: 'var(--font-barlow)' }}
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                'Entrar al Panel'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-oviedo-lightGray text-center">
            <Link
              href="/"
              className="text-xs text-oviedo-gray hover:text-oviedo-blue transition-colors"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              ← Volver a la portada pública
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
