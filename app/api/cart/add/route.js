import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose"; // Utiliser jose au lieu de jsonwebtoken
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_supersecurise";
const secretKey = new TextEncoder().encode(JWT_SECRET);

// Fonction pour extraire l'ID utilisateur du token
const getUserIdFromToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload.id;
  } catch (error) {
    return null;
  }
};

// POST /api/cart/add - Ajouter un produit au panier
export async function POST(request) {
  const prisma = new PrismaClient();
  
  try {
    // Récupérer les données de la requête
    const body = await request.json();
    const { productId, quantity = 1 } = body;

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
    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: "Token invalide" },
        { status: 401 }
      );
    }

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produit non trouvé" },
        { status: 404 }
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

    // Vérifier si le produit est déjà dans le panier
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    // Mettre à jour ou créer un nouvel item dans le panier
    if (existingItem) {
      // Augmenter la quantité
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });
    } else {
      // Ajouter un nouvel item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      });
    }

    return NextResponse.json(
      { message: "Produit ajouté au panier avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}