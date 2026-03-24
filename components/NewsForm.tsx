'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface NewsFormProps {
  mode: 'create' | 'edit';
  id?: string;
  initial?: {
    title: string;
    summary: string;
    content: string;
    coverImage: string;
    category: string;
    featured: boolean;
    author: string;
  };
}

const CATEGORIES = ['Primera División', 'Copa del Rey', 'Fichajes', 'Cantera', 'Opinión', 'Historia'];

const DEFAULT = {
  title:      '',
  summary:    '',
  content:    '',
  coverImage: '',
  category:   'Primera División',
  featured:   false,
  author:     'Redacción',
};

export default function NewsForm({ mode, id, initial }: NewsFormProps) {
  const router  = useRouter();
  const [form,  setForm]    = useState({ ...DEFAULT, ...initial });
  const [error, setError]   = useState('');
  const [busy,  setBusy]    = useState(false);
  const [saved, setSaved]   = useState(false);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);

    const url    = mode === 'create' ? '/api/noticias' : `/api/noticias/${id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Error desconocido.');
      } else {
        setSaved(true);
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 800);
      }
    } catch {
      setError('Error de red. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3" style={{ fontFamily: 'var(--font-barlow)' }}>
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 text-sm px-4 py-3" style={{ fontFamily: 'var(--font-barlow)' }}>
          ✓ Guardado correctamente. Redirigiendo...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1.5" style={{ fontFamily: 'var(--font-barlow)' }}>
              Título *
            </label>
            <input
              type="text"
              required
              maxLength={200}
              className="input-field text-lg font-semibold"
              placeholder="Escribe el titular de la noticia..."
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </div>

          {/* Resumen */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1.5" style={{ fontFamily: 'var(--font-barlow)' }}>
              Resumen / Entradilla * <span className="normal-case text-gray-400 font-normal">(máx. 300 caracteres)</span>
            </label>
            <textarea
              required
              rows={3}
              maxLength={300}
              className="input-field resize-none"
              placeholder="Breve resumen que aparece en las tarjetas de la portada..."
              value={form.summary}
              onChange={(e) => update('summary', e.target.value)}
            />
            <div className="text-right text-xs text-oviedo-gray mt-1" style={{ fontFamily: 'var(--font-barlow)' }}>
              {form.summary.length}/300
            </div>
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-oviedo-gray mb-1.5" style={{ fontFamily: 'var(--font-barlow)' }}>
              Contenido completo *
            </label>
            <textarea
              required
              rows={18}
              className="input-field resize-y font-body"
              placeholder="Escribe aquí el cuerpo de la noticia. Puedes usar saltos de línea para párrafos..."
              value={form.content}
              onChange={(e) => update('content', e.target.value)}
            />
          </div>
        </div>

        {/* Columna lateral — metadatos */}
        <div className="space-y-5">
          {/* Imagen de portada */}
          <div className="bg-white border border-gray-200 p-5">
            <h3
              className="text-sm font-bold text-oviedo-ink mb-3 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Imagen de portada
            </h3>
            <input
              type="url"
              className="input-field text-sm"
              placeholder="https://... (URL de la imagen)"
              value={form.coverImage}
              onChange={(e) => update('coverImage', e.target.value)}
            />
            {form.coverImage && (
              <div className="mt-3 relative h-36 overflow-hidden bg-gray-100">
                {/* Preview */}
                <img
                  src={form.coverImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <p className="text-xs text-oviedo-gray mt-2" style={{ fontFamily: 'var(--font-barlow)' }}>
              Pega la URL directa de la imagen. Puedes usar Unsplash, Cloudinary, etc.
            </p>
          </div>

          {/* Categoría */}
          <div className="bg-white border border-gray-200 p-5">
            <h3
              className="text-sm font-bold text-oviedo-ink mb-3 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Categoría
            </h3>
            <select
              className="input-field text-sm"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Autor */}
          <div className="bg-white border border-gray-200 p-5">
            <h3
              className="text-sm font-bold text-oviedo-ink mb-3 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Autor
            </h3>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="Ej: Juan García"
              value={form.author}
              onChange={(e) => update('author', e.target.value)}
            />
          </div>

          {/* Destacada */}
          <div className="bg-white border border-gray-200 p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update('featured', e.target.checked)}
                className="w-4 h-4 accent-oviedo-blue"
              />
              <div>
                <span
                  className="text-sm font-semibold text-oviedo-ink"
                  style={{ fontFamily: 'var(--font-barlow)' }}
                >
                  Noticia destacada ⭐
                </span>
                <p className="text-xs text-oviedo-gray">Marcar como noticia destacada</p>
              </div>
            </label>
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={busy || saved}
            className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {busy ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : saved ? (
              '✓ Guardado'
            ) : mode === 'create' ? (
              'Publicar noticia'
            ) : (
              'Guardar cambios'
            )}
          </button>

          <a
            href="/admin"
            className="block text-center text-xs text-oviedo-gray hover:text-oviedo-blue transition-colors"
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            ← Cancelar y volver
          </a>
        </div>
      </div>
    </form>
  );
}
