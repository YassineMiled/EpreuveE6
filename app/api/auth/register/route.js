import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// N'initialisez PAS Prisma en dehors de la fonction de gestionnaire
// car Next.js peut réutiliser les modules entre les requêtes.

export async function POST(request) {
  // Créer une instance Prisma à l'intérieur du gestionnaire de requêtes
  const prisma = new PrismaClient();
  
  try {
    // Récupérer les données du formulaire
    const body = await request.json();
    const { name, email, password } = body;

    console.log("Données reçues:", { name, email, passwordLength: password?.length });

    // Validation simple
    if (!email || !password) {
      console.log("Validation échouée: email ou mot de passe manquant");
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log("Utilisateur existant avec l'email:", email);
        return NextResponse.json(
          { message: "Cet email est déjà utilisé" },
          { status: 400 }
        );
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Mot de passe haché avec succès");

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      console.log("Utilisateur créé avec l'ID:", user.id);

      // Créer un panier pour le nouvel utilisateur
      await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
      console.log("Panier créé pour l'utilisateur");

      // Renvoyer la réponse sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json(
        { 
          message: "Utilisateur créé avec succès", 
          user: userWithoutPassword 
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Erreur base de données:", dbError);
      return NextResponse.json(
        { message: `Erreur lors de l'opération en base de données: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { message: `Erreur lors de l'inscription: ${error.message}` },
      { status: 500 }
    );
  } finally {
    // Déconnectez Prisma à la fin de la requête
    await prisma.$disconnect().catch(console.error);
  }
}