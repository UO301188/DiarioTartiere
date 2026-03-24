'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminDeleteButton({ id }: { id: string }) {
  const router  = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/noticias/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Error al eliminar la noticia.');
      }
    } catch {
      alert('Error de red.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors disabled:opacity-40"
      style={{ fontFamily: 'var(--font-barlow)' }}
      title="Eliminar"
    >
      {busy ? '⏳' : '🗑️'}
    </button>
  );
}
