/**
 * SCRIPT DE SEED — Crea el usuario admin y noticias de ejemplo
 *
 * Uso:
 *   1. Crea el archivo .env.local con tu MONGODB_URI
 *   2. Ejecuta:  npx tsx scripts/seed.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ── Carga .env.local manualmente si no está disponible ──────────────────────
import { readFileSync } from 'fs';
import { join } from 'path';

try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
  for (const line of envFile.split('\n')) {
    const [key, ...vals] = line.split('=');
    if (key && !key.startsWith('#')) process.env[key.trim()] = vals.join('=').trim();
  }
} catch { /* .env.local no existe, usa variables de entorno del sistema */ }

// ── Esquemas mínimos ─────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name:     { type: String, required: true },
  role:     { type: String, default: 'admin' },
});

const NewsSchema = new mongoose.Schema(
  {
    title:      String,
    slug:       { type: String, unique: true },
    summary:    String,
    content:    String,
    coverImage: String,
    category:   String,
    featured:   Boolean,
    author:     String,
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model('User', UserSchema);
const News = mongoose.models.News ?? mongoose.model('News', NewsSchema);

// ── Función principal ────────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Falta MONGODB_URI en .env.local');
    process.exit(1);
  }

  console.log('🔗 Conectando a MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Conectado.');

  // ─ Usuario admin ─
  const existing = await User.findOne({ email: 'admin@oviedo.com' });
  if (existing) {
    console.log('ℹ️  Usuario admin ya existe, omitiendo creación.');
  } else {
    const hash = await bcrypt.hash('Oviedo2025!', 12);
    await User.create({
      email:    'admin@oviedo.com',
      password: hash,
      name:     'Admin Oviedo',
      role:     'admin',
    });
    console.log('✅ Usuario admin creado:');
    console.log('   Email:     admin@oviedo.com');
    console.log('   Password:  Oviedo2025!');
    console.log('   ⚠️  Cambia la contraseña tras el primer login.');
  }

  // ─ Noticias de ejemplo ─
  const count = await News.countDocuments();
  if (count > 0) {
    console.log(`ℹ️  Ya existen ${count} noticias, omitiendo seed de noticias.`);
  } else {
    const noticias = [
      {
        title:      'El Real Oviedo remonta en el último suspiro para hacerse con los tres puntos',
        slug:       'real-oviedo-remonta-ultimo-suspiro',
        summary:    'Los carbayones firmaron una segunda parte espectacular en el Carlos Tartiere y consiguieron dar la vuelta al marcador en los minutos finales.',
        content:    'El Real Oviedo vivió una tarde de emociones en el estadio Carlos Tartiere. Tras ir perdiendo al descanso, el equipo azul salió con una actitud radicalmente diferente en la segunda mitad y logró la épica remontada.\n\nEl primer gol llegó en el minuto 65 tras una gran jugada colectiva que terminó con un potente disparo que batió al portero rival. El empate desató la locura en las gradas.\n\nA falta de cinco minutos, en una acción a balón parado, el cabezazo definitivo provocó el estallido del Tartiere. Tres puntos de oro que permiten al Oviedo seguir soñando con los puestos de ascenso.',
        coverImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80',
        category:   'Primera División',
        featured:   true,
        author:     'Redacción Deportiva',
      },
      {
        title:      'El Oviedo cierra el fichaje del delantero más esperado del mercado de invierno',
        slug:       'oviedo-cierra-fichaje-delantero-mercado-invierno',
        summary:    'La dirección deportiva confirma la incorporación del goleador procedente de la Primera División francesa, que firma hasta final de temporada.',
        content:    'El Real Oviedo ha hecho oficial uno de los fichajes más esperados del mercado invernal. El delantero internacional llega cedido hasta el final de la temporada con opción de compra.\n\nEl jugador, de 26 años, llega en un gran momento de forma tras una primera mitad de temporada donde marcó 11 goles en la Ligue 1. Su perfil como delantero centro potente y con buen juego de espaldas encaja perfectamente en el sistema del entrenador.\n\nEl presidente del club mostró su satisfacción por el acuerdo: "Este es el refuerzo que necesitábamos para el tramo final de la temporada".',
        coverImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80',
        category:   'Fichajes',
        featured:   false,
        author:     'Carlos Rodríguez',
      },
      {
        title:      'La cantera azul: el juvenil del Oviedo hace historia al clasificarse para la Copa del Rey juvenil',
        slug:       'cantera-oviedo-juvenil-copa-rey',
        summary:    'El equipo juvenil del Real Oviedo logra un histórico pase a los cuartos de final de la Copa del Rey juvenil por primera vez en su historia.',
        content:    'La cantera del Real Oviedo vive un momento histórico. El equipo juvenil ha conseguido clasificarse para los cuartos de final de la Copa del Rey juvenil, un logro que no se había producido en toda la historia del club.\n\nTras eliminar a rivales de mayor presupuesto, los jóvenes carbayones han demostrado que la apuesta por la formación de jugadores locales da sus frutos. El entrenador del filial destacó la mentalidad y el trabajo del grupo como claves del éxito.\n\nVarios jugadores de este equipo ya han entrenado con el primer equipo esta semana, señal de que el club confía plenamente en sus jóvenes valores.',
        coverImage: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&q=80',
        category:   'Cantera',
        featured:   false,
        author:     'Laura Fernández',
      },
      {
        title:      'Análisis táctico: así ha evolucionado el Oviedo bajo las órdenes del nuevo míster',
        slug:       'analisis-tactico-evolucion-oviedo-nuevo-mister',
        summary:    'Desgranamos los cambios tácticos que ha introducido el entrenador y cómo han transformado al equipo en uno de los más sólidos de la categoría.',
        content:    'Han pasado quince jornadas desde la llegada del nuevo entrenador al banquillo del Real Oviedo y el cambio es más que notable. Los datos hablan por sí solos: de encajar dos goles por partido de media a apenas 0,7 en las últimas diez jornadas.\n\nEl sistema 4-2-3-1 que implementó desde el primer día ha dado solidez defensiva al equipo sin renunciar a la verticalidad en ataque. La doble pivote ha sido clave para recuperar balones y salir rápido al contraataque.\n\nOtro de los grandes aciertos ha sido la gestión del vestuario, integrando a los jugadores más veteranos con la energía de los jóvenes del filial para crear un bloque cohesionado y con hambre de victoria.',
        coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
        category:   'Opinión',
        featured:   false,
        author:     'Miguel Ángel Torres',
      },
    ];

    await News.insertMany(noticias);
    console.log(`✅ ${noticias.length} noticias de ejemplo creadas.`);
  }

  await mongoose.disconnect();
  console.log('\n🎉 Seed completado con éxito. ¡Ya puedes arrancar la app!');
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
