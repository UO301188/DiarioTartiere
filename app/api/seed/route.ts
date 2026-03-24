import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await connectDB();

        // Encriptamos la contraseña Oviedo2025! de forma segura
        const hash = await bcrypt.hash('Oviedo2025!', 12);

        // Buscamos al admin y le forzamos la contraseña nueva (o lo creamos si no existe)
        await User.findOneAndUpdate(
            { email: 'admin@oviedo.com' },
            {
                email: 'admin@oviedo.com',
                name: 'Administrador Vercel',
                password: hash,
                role: 'admin'
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            message: '✅ ¡Usuario admin creado/actualizado correctamente desde Vercel!',
            email: 'admin@oviedo.com',
            password: 'Oviedo2025!'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}