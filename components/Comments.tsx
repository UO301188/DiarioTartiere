'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Comments({ slug, initialComments = [] }: { slug: string, initialComments?: any[] }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState(initialComments);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/noticias/${slug}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            if (res.ok) {
                const data = await res.json();
                setComments([...comments, data.comment]); // Añadimos el nuevo comentario a la lista
                setText(''); // Limpiamos la caja de texto
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 bg-white p-6 border border-oviedo-lightGray shadow-sm">
            <h3 className="text-2xl font-bold text-oviedo-ink mb-6 border-b pb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                La Grada ({comments.length} comentarios)
            </h3>

            {session ? (
                <form onSubmit={handleSubmit} className="mb-8">
          <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="¿Qué opinas sobre esto? Escribe aquí tu comentario..."
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:border-oviedo-blue min-h-[100px] mb-2 text-sm resize-y"
              required
          />
                    <button type="submit" disabled={loading} className="btn-primary text-sm px-6 py-2 disabled:opacity-50">
                        {loading ? 'Publicando...' : 'Publicar comentario'}
                    </button>
                </form>
            ) : (
                <div className="bg-oviedo-lightGray p-6 rounded mb-8 text-center border border-gray-200">
                    <p className="text-oviedo-ink font-bold mb-2">Únete al debate carbayón</p>
                    <p className="text-oviedo-gray text-sm mb-4">Debes iniciar sesión o registrarte para poder comentar en la noticia.</p>
                    <Link href="/login" className="btn-primary inline-block text-sm">Identificarse / Registrarse</Link>
                </div>
            )}

            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-sm text-oviedo-gray italic text-center py-4">Sé el primero en comentar esta noticia.</p>
                ) : (
                    [...comments].reverse().map((c, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-oviedo-blue text-sm">👤 {c.userName}</span>
                                <span className="text-xs text-oviedo-gray">
                  {new Date(c.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                            </div>
                            <p className="text-sm text-oviedo-ink whitespace-pre-wrap leading-relaxed">{c.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}