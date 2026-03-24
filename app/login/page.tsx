'use client';
import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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

    const result = await signIn('credentials', { email, password, redirect: false });
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
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #003F8A 0, #003F8A 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="inline-flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl shadow-2xl mb-4 border border-white/10">
                  <Image src="/logo.png" alt="Diario Tartiere" width={240} height={85} priority className="h-auto w-56" />
                </div>
                <span className="text-oviedo-gold text-xs uppercase tracking-widest mt-1" style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}>
                Panel de Administración
              </span>
              </div>
            </Link>
          </div>

          {/* Formulario */}
          <div className="bg-white p-8 shadow-2xl">
            <div className="h-1 bg-oviedo-gold -mx-8 -mt-8 mb-8" />
            <h2 className="text-xl font-bold text-oviedo-ink mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Acceso Restringido</h2>

            {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 mb-5">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="admin@oviedo.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1">Contraseña</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                {loading ? 'Verificando...' : 'Entrar al Panel'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-oviedo-lightGray text-center">
              <Link href="/" className="text-xs text-oviedo-gray hover:text-oviedo-blue transition-colors">← Volver a la portada pública</Link>
            </div>
          </div>
        </div>
      </div>
  );
}