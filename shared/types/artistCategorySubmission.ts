import { PrismaClient, Prisma } from '@prisma/client'; // Import des types Prisma

// Interface complète pour le modèle 'ArtistCategorySubmission'
export interface ArtistCategorySubmission {
  id: number;
  userId: string;
  imageUrl: string;
  categoryId: number;
  points: number;
  isFirst: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    balance: number;
    artworkCount: number;
    isAdmin: boolean;
    discordVerified: boolean;
    discordRoles: string[];
    createdAt: Date;
    updatedAt: Date;
  } | null; // Permettre que user puisse être null
  category: {
    id: number;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null; // Permettre que category puisse être null
}

// Fonction pour créer une soumission d'artiste
export async function createArtistCategorySubmission(
  prisma: PrismaClient, // Client Prisma
  userId: string,              // ID de l'utilisateur
  imageUrl: string,            // URL de l'image soumise
  categoryId: number           // ID de la catégorie
): Promise<ArtistCategorySubmission> {
  // Vérifier si l'utilisateur a déjà soumis une œuvre pour cette catégorie
  const existingSubmission = await prisma.artistCategorySubmission.findFirst({
    where: { userId, categoryId },
  });

  // Calculer les points : attribuer 10 points pour la première soumission, sinon 0
  const points = existingSubmission ? 0 : 10;  // Exemple : attribuer 10 points pour la première soumission

  // Créer la nouvelle soumission
  const newSubmission = await prisma.artistCategorySubmission.create({
    data: {
      userId,
      imageUrl,
      categoryId,
      points,
      isFirst: !existingSubmission, // true si c'est la première soumission, sinon false
    },
  });

  // Retourner la soumission avec les relations
  return {
    ...newSubmission,
    user: await prisma.user.findUnique({ where: { id: userId } }),
    category: await prisma.category.findUnique({ where: { id: categoryId } }),
  };
}

// Fonction pour récupérer une soumission existante
export async function getExistingSubmission(
  prisma: PrismaClient, // Client Prisma
  userId: string,              // ID de l'utilisateur
  categoryId: number           // ID de la catégorie
): Promise<ArtistCategorySubmission | null> {
  const submission = await prisma.artistCategorySubmission.findFirst({
    where: { userId, categoryId },
    include: {
      user: true,
      category: true,
    },
  });

  return submission as ArtistCategorySubmission | null;
}
