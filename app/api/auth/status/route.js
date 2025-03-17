import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Utiliser jose au lieu de jsonwebtoken
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_supersecurise";
// Convertir la clé secrète en Uint8Array pour jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    // Récupérer le token depuis les cookies
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier et décoder le token avec jose
    try {
      const { payload } = await jwtVerify(token, secretKey);
      const userId = payload.id;
      
      // Récupérer l'utilisateur depuis la base de données
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json(
          { message: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      // Renvoyer les informations de l'utilisateur sans le mot de passe
      const { password, ...userWithoutPassword } = user;
      return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}