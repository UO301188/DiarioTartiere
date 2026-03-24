import NewsForm from '@/components/NewsForm';

export default function NuevaNoticiaPage() {
  return (
    <div>
      {/* Cabecera */}
      <div className="mb-8">
        <div className="h-1 w-10 bg-oviedo-gold mb-4" />
        <h2
          className="text-2xl font-black text-oviedo-ink"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Nueva Noticia
        </h2>
        <p
          className="text-sm text-oviedo-gray mt-1"
          style={{ fontFamily: 'var(--font-barlow)' }}
        >
          Completa todos los campos marcados con * y haz clic en «Publicar noticia».
        </p>
      </div>

      <NewsForm mode="create" />
    </div>
  );
}
