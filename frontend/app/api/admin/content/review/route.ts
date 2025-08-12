// api/admin/content/review/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { reviewContent } from '~/content-validation';
import { pinFileToIPFS } from '$/services/pinataServices';

/*
api/admin/content/review/route.ts
  Utilité : Ce fichier gère la révision du contenu soumis par les utilisateurs. 
  Il peut également utiliser les CID pour vérifier les fichiers uploadés.
  Corrections : Assurez-vous que la route POST fonctionne correctement et que 
  les données sont validées avant d'être enregistrées dans la base de données.
*/


export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { contentId, isArtwork, baseValue, notes } = await req.json();

    const result = await reviewContent(
      contentId,
      session.user.id,
      isArtwork,
      baseValue,
      notes
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Content review error:', error);
    return NextResponse.json(
      { error: 'Failed to review content' },
      { status: 500 }
    );
  }
}
