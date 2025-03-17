import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_supersecurise";

// Fonction pour extraire l'ID utilisateur du token
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// POST /api/cart/remove - Supprimer un produit du panier
export async function POST(request) {
  const prisma = new PrismaClient();
  
  try {
    // Récupérer les données de la requête
    const body = await request.json();
    const { productId } = body;

    // Validation
    if (!productId) {
      return NextResponse.json(
        { message: "ID de produit requis" },
        { status: 400 }
      );
    }

    // Récupérer le token depuis les cookies
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      );
    }

    // Extraire l'ID utilisateur du token
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: "Token invalide" },
        { status: 401 }
      );
    }

    // Trouver le panier actif de l'utilisateur
    const cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
        isActive: true
      }
    });

    if (!cart) {
      return NextResponse.json(
        { message: "Panier non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer l'item du panier
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    return NextResponse.json(
      { message: "Produit supprimé du panier avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}