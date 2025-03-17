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

// POST /api/cart/merge - Fusionner un panier local avec le panier serveur
export async function POST(request) {
  const prisma = new PrismaClient();
  
  try {
    // Récupérer les données de la requête
    const body = await request.json();
    const { items } = body;

    // Validation
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: "Format de panier invalide" },
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

    // Trouver ou créer un panier actif pour l'utilisateur
    let cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
        isActive: true
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
          isActive: true
        }
      });
    }

    // Fusionner les articles
    for (const item of items) {
      if (!item.productId || !item.quantity) continue;

      // Vérifier que le produit existe
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) continue;

      // Vérifier si le produit est déjà dans le panier
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.productId
        }
      });

      if (existingItem) {
        // Mettre à jour la quantité
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + item.quantity
          }
        });
      } else {
        // Ajouter un nouvel item
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity
          }
        });
      }
    }

    return NextResponse.json(
      { message: "Paniers fusionnés avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la fusion des paniers:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}