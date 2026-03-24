'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SocialBar({ slug, title, initialLikes, initialHasLiked }: { slug: string, title: string, initialLikes: number, initialHasLiked: boolean }) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(initialHasLiked);
    const [url, setUrl] = useState('');

    useEffect(() => {
        // Obtenemos la URL real una vez que el componente carga en el cliente
        setUrl(window.location.href);
    }, []);

    const handleLike = async () => {
        if (!session) {
            alert("Debes iniciar sesión para dar Me Gusta 💙");
            return;
        }

        // Actualización optimista (cambia la interfaz antes de que el servidor responda)
        setHasLiked(!hasLiked);
        setLikes(hasLiked ? likes - 1 : likes + 1);

        try {
            await fetch(`/api/noticias/${slug}/like`, { method: 'POST' });
        } catch (e) {
            // Si falla, revertimos
            setHasLiked(hasLiked);
            setLikes(hasLiked ? likes + 1 : likes - 1);
        }
    };

    const encodedTitle = encodeURIComponent(`He leído esto en Diario Tartiere: ${title}`);
    const encodedUrl = encodeURIComponent(url);

    return (
        <div className="flex flex-wrap items-center justify-between border-y border-oviedo-lightGray py-4 my-8">
            {/* Botón de Like */}
            <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-colors border ${hasLiked ? 'bg-oviedo-blue text-white border-oviedo-blue' : 'bg-white text-oviedo-ink border-gray-300 hover:bg-gray-50'}`}
                style={{ fontFamily: 'var(--font-barlow)' }}
            >
                <svg className={`w-5 h-5 ${hasLiked ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likes} Me gusta
            </button>

            {/* Botones de Compartir */}
            <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-oviedo-gray font-bold" style={{ fontFamily: 'var(--font-barlow)' }}>Compartir:</span>

                {/* WhatsApp */}
                <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
                </a>

                {/* Twitter / X */}
                <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
            </div>
        </div>
    );
}