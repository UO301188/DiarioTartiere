import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div
          className="text-9xl font-black text-oviedo-blue opacity-10 select-none"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          404
        </div>
        <h1
          className="text-3xl font-black text-oviedo-ink -mt-8 mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Noticia no encontrada
        </h1>
        <p className="text-oviedo-gray mb-8" style={{ fontFamily: 'var(--font-barlow)' }}>
          La página que buscas no existe o ha sido eliminada.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Volver a la portada
        </Link>
      </main>
      <Footer />
    </>
  );
}
