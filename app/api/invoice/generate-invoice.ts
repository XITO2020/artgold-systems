// pages/api/generate-invoice.ts
import { createInvoicePDF } from '~/pdf-generator';
import { InvoiceData } from 'T/invoice'; // Assurez-vous d'importer correctement InvoiceData
import { S3 } from 'aws-sdk'; // Utilisation de S3 pour stocker le PDF
import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId, amount, artworkTitle, buyerEmail, paymentMethod }: InvoiceData = req.body;

    try {
      // Générer le PDF avec les données de la facture
      const pdfBuffer = createInvoicePDF({ orderId, amount, artworkTitle, buyerEmail, paymentMethod });

      // Option 1: Stocker le PDF sur S3
      const s3Params = {
        Bucket: 'your-bucket-name', // Remplace par ton nom de bucket S3
        Key: `invoices/${orderId}.pdf`, // Le chemin où le fichier sera stocké dans S3
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        ACL: 'public-read', // Rendre le fichier public (si nécessaire)
      };

      // Télécharger le fichier vers S3
      const s3Response = await s3.upload(s3Params).promise();

      // Retourner l'URL du fichier généré
      res.status(200).json({
        message: 'Invoice generated and uploaded to S3',
        fileUrl: s3Response.Location, // L'URL publique du PDF
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to generate invoice', error: error.message });
    }
  } else {
    // Méthode non autorisée
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
