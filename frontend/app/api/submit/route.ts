// app/[lang]/submit/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@LIB/db'; // Import du client Prisma
import { getServerSession } from 'next-auth'; // Pour récupérer la session de NextAuth
import { authOptions } from '@LIB/auth'; // Import des options de NextAuth
import { createArtistCategorySubmission, getExistingSubmission } from 'T/artistCategorySubmission'; // Import des fonctions de création et vérification

export async function POST(request: Request) {
  // Récupérer la session de l'utilisateur
  const session = await getServerSession(authOptions);

  // Si la session n'est pas valide (pas d'utilisateur connecté), renvoyer une erreur 401
  if (!session || !session.user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const userId = session.user.id; // Récupérer l'ID de l'utilisateur connecté
  const { imageUrl, categoryId } = await request.json(); // Récupérer l'URL de l'image et la catégorie

  // Vérifier si une soumission existe déjà pour cette catégorie
  const existingSubmission = await getExistingSubmission(prisma, userId, categoryId);

  // Créer une nouvelle soumission
  const submission = await createArtistCategorySubmission(prisma, userId, imageUrl, categoryId);

  return NextResponse.json({ submission });
}
