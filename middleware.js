// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_supersecurise";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;

  // Vérifier si le token existe
  if (!token) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Vérifier la validité du token
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    // Token invalide, rediriger vers la page de connexion
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/cart', '/profile', '/admin/:path*']
};