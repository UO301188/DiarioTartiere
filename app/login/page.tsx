'use client';
import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegistering) {
      // Flujo de Registro
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al registrarse');
        }
        // Si el registro va bien, iniciamos sesión automáticamente y vamos a portada
        await signIn('credentials', { email, password, redirect: false });
        router.push('/');
        router.refresh();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Flujo de Login Normal
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('Credenciales incorrectas.');
        setLoading(false);
      } else {
        // Al loguearte, te mandamos a la portada. El header revelará el botón de admin si lo eres.
        router.push('/');
        router.refresh();
      }
    }
  }

  return (
      <div className="min-h-screen bg-oviedo-ink flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #003F8A 0, #003F8A 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="bg-white p-4 rounded-xl shadow-2xl border border-white/10">
                <Image src="/logo.png" alt="Diario Tartiere" width={240} height={85} priority className="h-auto w-56" />
              </div>
            </Link>
          </div>

          <div className="bg-white p-8 shadow-2xl">
            <div className="h-1 bg-oviedo-gold -mx-8 -mt-8 mb-8" />
            <h2 className="text-xl font-bold text-oviedo-ink mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              {isRegistering ? 'Únete a la afición' : 'Accede a tu cuenta'}
            </h2>

            {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 mb-5">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1">Nombre o Alias</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Ej: Carbayon99" />
                  </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1">Contraseña</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                {loading ? 'Procesando...' : (isRegistering ? 'Crear cuenta' : 'Iniciar sesión')}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-oviedo-lightGray text-center text-sm" style={{ fontFamily: 'var(--font-barlow)' }}>
              {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="ml-2 text-oviedo-blue font-bold hover:underline">
                {isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-oviedo-gray hover:text-oviedo-blue transition-colors">← Volver a la portada</Link>
            </div>
          </div>
        </div>
      </div>
  );
}