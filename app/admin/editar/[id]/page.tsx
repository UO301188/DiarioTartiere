import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';
import NewsForm from '@/components/NewsForm';

async function getNoticia(id: string) {
  await connectDB();
  try {
    return await News.findById(id).lean();
  } catch {
    return null;
  }
}

export default async function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noticia = await getNoticia(id);
  if (!noticia) notFound();

  return (
    <div>
      <div className="mb-8">
        <div className="h-1 w-10 bg-oviedo-gold mb-4" />
        <h2
          className="text-2xl font-black text-oviedo-ink"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Editar Noticia
        </h2>
        <p
          className="text-sm text-oviedo-gray mt-1 line-clamp-1"
          style={{ fontFamily: 'var(--font-barlow)' }}
        >
          Editando: <strong>{noticia.title}</strong>
        </p>
      </div>

      <NewsForm
        mode="edit"
        id={id}
        initial={{
          title:      noticia.title,
          summary:    noticia.summary,
          content:    noticia.content,
          coverImage: noticia.coverImage ?? '',
          category:   noticia.category,
          featured:   noticia.featured ?? false,
          author:     noticia.author ?? 'Redacción',
        }}
      />
    </div>
  );
}
