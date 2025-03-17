import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; // Remplace jsonwebtoken
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_supersecurise";
// Convertir la clé secrète en Uint8Array pour jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function POST(request) {
  const prisma = new PrismaClient();
  
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation simple
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Générer un token JWT avec jose à la place de jsonwebtoken
    const token = await new SignJWT({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey);

    // Configurer le cookie - Utiliser la version asynchrone avec await
    const cookieStore = cookies();
    await cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 jours en secondes
    });

    // Renvoyer la réponse sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { 
        message: "Connexion réussie", 
        user: userWithoutPassword, 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { message: `Erreur lors de la connexion: ${error.message}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}