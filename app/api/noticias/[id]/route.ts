import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';
import { authOptions } from '@/lib/auth';

// GET /api/noticias/[id] — una noticia por ID o slug
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const news = await News.findById(params.id).lean().catch(() => null)
    ?? await News.findOne({ slug: params.id }).lean();

  if (!news) return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
  return NextResponse.json(news);
}

// PUT /api/noticias/[id] — editar noticia (requiere sesión)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await connectDB();
  const body = await req.json();

  if (body.title) {
    body.slug = slugify(body.title, { lower: true, strict: true, locale: 'es' });
  }

  const news = await News.findByIdAndUpdate(params.id, body, { new: true });
  if (!news) return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
  return NextResponse.json(news);
}

// DELETE /api/noticias/[id] — eliminar noticia (requiere sesión)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await connectDB();
  const news = await News.findByIdAndDelete(params.id);
  if (!news) return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
  return NextResponse.json({ success: true });
}
