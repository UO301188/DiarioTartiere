import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Debes iniciar sesión para comentar' }, { status: 401 });
    }

    try {
        await connectDB();
        const { text } = await req.json();

        if (!text || text.trim() === '') {
            return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 });
        }

        const newComment = {
            userId: (session.user as any).id || session.user.email,
            userName: session.user.name || 'Aficionado',
            text: text.trim(),
            createdAt: new Date(),
        };

        const updatedNews = await News.findOneAndUpdate(
            { slug },
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!updatedNews) {
            return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}