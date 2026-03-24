# 🚀 Guía de Despliegue — Real Oviedo Noticias

> Stack: **Next.js 14 · MongoDB Atlas · NextAuth.js · Vercel**
> Coste total: **0 €/mes** usando los planes gratuitos.

---

## RESUMEN DE PLATAFORMAS GRATUITAS

| Plataforma    | Qué aloja                   | Plan gratuito          |
|---------------|-----------------------------|------------------------|
| **Vercel**    | Frontend + Backend (API)    | ∞ peticiones, sin límite de tiempo |
| **MongoDB Atlas** | Base de datos           | 512 MB (M0 Sandbox)    |
| **GitHub**    | Repositorio de código       | Repos públicos gratis  |

---

## PASO 1 — CREAR LA BASE DE DATOS EN MONGODB ATLAS

1. Ve a **https://cloud.mongodb.com** y crea una cuenta gratuita.
2. Haz clic en **"Build a Database"** → elige **M0 FREE** (512 MB, sin tarjeta de crédito).
3. Elige la región más cercana (ej: `AWS / eu-west-1 Ireland`).
4. En **"Cluster Name"** pon: `oviedo-cluster`.
5. Haz clic en **"Create"**.

### Crear usuario de base de datos
1. En el menú lateral ve a **Security → Database Access**.
2. Haz clic en **"Add New Database User"**.
3. Elige autenticación **Password**.
4. Usuario: `oviedo-admin`
5. Contraseña: genera una segura y **GUÁRDALA**.
6. Permisos: **"Read and write to any database"**.
7. Haz clic en **"Add User"**.

### Permitir conexiones desde cualquier IP
1. Ve a **Security → Network Access**.
2. Haz clic en **"Add IP Address"**.
3. Selecciona **"Allow Access from Anywhere"** (`0.0.0.0/0`).
   > Esto es necesario porque Vercel usa IPs dinámicas.
4. Haz clic en **"Confirm"**.

### Obtener la cadena de conexión
1. En tu cluster, haz clic en **"Connect"**.
2. Elige **"Drivers"** → Node.js.
3. Copia la cadena. Tendrá este formato:
   ```
   mongodb+srv://oviedo-admin:<password>@oviedo-cluster.XXXXX.mongodb.net/?retryWrites=true&w=majority
   ```
4. Sustituye `<password>` por tu contraseña real.
5. Añade el nombre de la base de datos antes del `?`:
   ```
   mongodb+srv://oviedo-admin:TUPASSWORD@oviedo-cluster.XXXXX.mongodb.net/real-oviedo-news?retryWrites=true&w=majority
   ```
6. **Guarda este string**, lo necesitarás en los siguientes pasos.

---

## PASO 2 — CONFIGURAR EL PROYECTO LOCALMENTE

```bash
# 1. Clona o descarga el proyecto
cd real-oviedo-news

# 2. Instala dependencias
npm install

# 3. Crea el archivo de variables de entorno
cp .env.local.example .env.local
```

Edita `.env.local` con tus valores reales:
```env
MONGODB_URI=mongodb+srv://oviedo-admin:TUPASSWORD@oviedo-cluster.XXXXX.mongodb.net/real-oviedo-news?retryWrites=true&w=majority
NEXTAUTH_SECRET=genera_un_string_aleatorio_aqui
NEXTAUTH_URL=http://localhost:3000
```

Para generar `NEXTAUTH_SECRET` seguro, ejecuta en tu terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## PASO 3 — CREAR EL USUARIO ADMIN Y DATOS DE PRUEBA

Con la base de datos configurada, ejecuta el script de seed:
```bash
npm run seed
```

Esto creará:
- **Usuario admin**: `admin@oviedo.com` / `Oviedo2025!`
- **4 noticias de ejemplo** para ver la portada en acción

> ⚠️ Cambia la contraseña del admin tras el primer login editando directamente en MongoDB Atlas.

---

## PASO 4 — PROBAR EN LOCAL

```bash
npm run dev
```

Abre **http://localhost:3000** y verifica:
- ✅ Portada con las noticias de ejemplo
- ✅ Click en una noticia → página completa
- ✅ http://localhost:3000/login → formulario de login
- ✅ Login con `admin@oviedo.com` / `Oviedo2025!` → panel de administración
- ✅ Crear, editar y eliminar noticias

---

## PASO 5 — SUBIR EL CÓDIGO A GITHUB

```bash
# Inicializa el repositorio Git (si no lo has hecho)
git init
git add .
git commit -m "feat: Real Oviedo News - versión inicial"

# Crea un repositorio en github.com y luego:
git remote add origin https://github.com/TU_USUARIO/real-oviedo-news.git
git branch -M main
git push -u origin main
```

> ⚠️ Verifica que `.env.local` está en `.gitignore` y NUNCA lo subas a GitHub.

---

## PASO 6 — DESPLEGAR EN VERCEL (GRATIS)

1. Ve a **https://vercel.com** y crea una cuenta (puedes usar tu cuenta de GitHub).
2. Haz clic en **"Add New Project"**.
3. Importa tu repositorio `real-oviedo-news` desde GitHub.
4. Vercel detecta automáticamente que es un proyecto Next.js.

### Configurar las Variables de Entorno en Vercel
En la pantalla de configuración del proyecto, **antes de desplegar**, añade estas variables:

| Variable           | Valor                                          |
|--------------------|------------------------------------------------|
| `MONGODB_URI`      | Tu cadena de conexión de MongoDB Atlas         |
| `NEXTAUTH_SECRET`  | El string aleatorio que generaste antes        |
| `NEXTAUTH_URL`     | `https://TU-PROYECTO.vercel.app` *(ver nota)*  |

> **Nota sobre `NEXTAUTH_URL`**: Vercel te asignará un dominio como `real-oviedo-news.vercel.app`. Puedes añadir esta variable después del primer deploy cuando ya conozcas la URL exacta. También puedes dejarla vacía inicialmente, NextAuth la detecta sola en Vercel.

5. Haz clic en **"Deploy"**.
6. Espera ~2 minutos. Vercel construirá y desplegará la app.
7. ¡Tu app estará disponible en `https://real-oviedo-news.vercel.app`! 🎉

---

## PASO 7 — EJECUTAR EL SEED EN PRODUCCIÓN

El seed se ejecuta desde tu máquina local apuntando a la base de datos de producción:

```bash
# Exporta temporalmente la MONGODB_URI de producción
export MONGODB_URI="mongodb+srv://oviedo-admin:TUPASSWORD@oviedo-cluster..."

# Ejecuta el seed
npm run seed

# Recuerda que el seed no duplica si ya existen datos
```

O bien puedes ejecutarlo directamente desde la interfaz de MongoDB Atlas usando **"Collections"** para crear el primer usuario admin manualmente.

---

## PASO 8 (OPCIONAL) — DOMINIO PERSONALIZADO

Si quieres usar `www.realoviedo-noticias.com` en lugar del dominio de Vercel:
1. En Vercel → tu proyecto → **Settings → Domains**.
2. Añade tu dominio.
3. Vercel te dará registros DNS que debes configurar en tu registrador de dominios.
4. Actualiza `NEXTAUTH_URL` en las variables de entorno de Vercel con el nuevo dominio.
5. Haz un **Redeploy** para que los cambios surtan efecto.

---

## FLUJO DE TRABAJO CONTINUO

Cada vez que hagas cambios en el código:
```bash
git add .
git commit -m "descripción del cambio"
git push
```
Vercel detecta el push automáticamente y **redespliega en segundos**.

---

## RESUMEN DE URLs

| Recurso              | URL                                           |
|----------------------|-----------------------------------------------|
| Portada pública      | `https://TU-PROYECTO.vercel.app/`            |
| Artículo             | `https://TU-PROYECTO.vercel.app/noticias/slug`|
| Login admin          | `https://TU-PROYECTO.vercel.app/login`        |
| Panel de admin       | `https://TU-PROYECTO.vercel.app/admin`        |
| API noticias         | `https://TU-PROYECTO.vercel.app/api/noticias` |

---

## SOLUCIÓN DE PROBLEMAS FRECUENTES

**Error: "MONGODB_URI is not defined"**
→ Comprueba que las variables de entorno están correctamente añadidas en Vercel y haz un Redeploy.

**Error: "Invalid credentials" al hacer login**
→ Verifica que ejecutaste el script de seed y que la MONGODB_URI apunta a la base de datos correcta.

**Las imágenes no cargan**
→ Verifica que las URLs de las imágenes son HTTPS. Puedes usar imágenes de Unsplash, Cloudinary, o cualquier CDN público.

**Error 500 en producción**
→ Revisa los logs en Vercel → tu proyecto → **Deployments → Functions** para ver el error exacto.
