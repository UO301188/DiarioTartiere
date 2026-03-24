import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';
import { authOptions } from '@/lib/auth';

// GET /api/noticias — listado público
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const limit    = parseInt(searchParams.get('limit') ?? '20');
  const page     = parseInt(searchParams.get('page') ?? '1');
  const category = searchParams.get('category') ?? '';

  const filter = category ? { category } : {};
  const skip   = (page - 1) * limit;

  const [news, total] = await Promise.all([
    News.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    News.countDocuments(filter),
  ]);

  return NextResponse.json({ news, total, page, pages: Math.ceil(total / limit) });
}

// POST /api/noticias — crear noticia (requiere sesión)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const { title, summary, content, coverImage, category, featured, author } = body;

  if (!title || !summary || !content) {
    return NextResponse.json({ error: 'Título, resumen y contenido son obligatorios' }, { status: 400 });
  }

  // Genera slug único
  let slug = slugify(title, { lower: true, strict: true, locale: 'es' });
  const existing = await News.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now()}`;

  const news = await News.create({ title, slug, summary, content, coverImage, category, featured, author });
  return NextResponse.json(news, { status: 201 });
}
