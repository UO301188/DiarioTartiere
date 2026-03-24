export { default } from 'next-auth/middleware';

// Solo protege las rutas que empiecen por /admin
export const config = {
  matcher: ['/admin/:path*'],
};
