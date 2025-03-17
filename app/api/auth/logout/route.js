import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Supprimer le cookie d'authentification - version asynchrone
  const cookieStore = cookies();
  await cookieStore.delete("auth_token");

  return NextResponse.json(
    { message: "Déconnexion réussie" },
    { status: 200 }
  );
}