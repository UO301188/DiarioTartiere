'use client';
import { signOut } from 'next-auth/react';

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full text-left text-white/50 hover:text-red-400 text-xs transition-colors py-1"
      style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
    >
      ⏏ Cerrar sesión
    </button>
  );
}
