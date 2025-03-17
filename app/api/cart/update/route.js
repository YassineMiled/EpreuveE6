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

// POST /api/cart/update - Mettre à jour la quantité d'un produit dans le panier
export async function POST(request) {
  const prisma = new PrismaClient();
  
  try {
    // Récupérer les données de la requête
    const body = await request.json();
    const { productId, quantity } = body;

    // Validation
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { message: "ID de produit et quantité requis" },
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

    // Trouver l'item dans le panier
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Produit non trouvé dans le panier" },
        { status: 404 }
      );
    }

    // Mettre à jour ou supprimer l'item en fonction de la quantité
    if (quantity <= 0) {
      // Supprimer l'item si la quantité est 0 ou négative
      await prisma.cartItem.delete({
        where: { id: cartItem.id }
      });
    } else {
      // Mettre à jour la quantité
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: quantity }
      });
    }

    return NextResponse.json(
      { message: "Panier mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du panier:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}