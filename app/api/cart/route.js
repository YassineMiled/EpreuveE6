// app/api/cart/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
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

// GET /api/cart - Récupérer le panier de l'utilisateur
export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    // Récupérer le token depuis les cookies - version asynchrone
    const cookieStore = cookies();
    // Utilisez await avec cookieStore.get()
    const token = await cookieStore.get("auth_token")?.value;

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

    // Trouver ou créer un panier actif pour l'utilisateur
    let cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
        isActive: true
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Si aucun panier actif n'existe, en créer un nouveau
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
          isActive: true
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    // Restructurer les données pour le client
    const items = cart.items.map(item => ({
      productId: item.productId,
      product: item.product,
      quantity: item.quantity
    }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}