import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Debes iniciar sesión para dar me gusta' }, { status: 401 });
    }

    try {
        await connectDB();
        const userEmail = session.user.email as string;
        const news = await News.findOne({ slug });
        if (!news) return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });

        // Comprobamos si el usuario ya le dio like
        const hasLiked = news.likes.includes(userEmail);

        // Si ya le dio like, lo quitamos. Si no, lo añadimos.
        const updatedNews = await News.findOneAndUpdate(
            { slug },
            hasLiked ? { $pull: { likes: userEmail } } : { $push: { likes: userEmail } },
            { new: true }
        );

        // ¡AQUÍ ESTÁ LA MAGIA! Le decimos a TypeScript qué hacer si es nulo
        if (!updatedNews) {
            return NextResponse.json({ error: 'Error al actualizar los likes' }, { status: 500 });
        }

        return NextResponse.json({ success: true, likes: updatedNews.likes.length, hasLiked: !hasLiked });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}