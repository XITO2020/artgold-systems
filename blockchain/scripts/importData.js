const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importData() {
  const data = JSON.parse(fs.readFileSync('path/to/your/data.json', 'utf-8'));

  for (const item of data) {
    await prisma.article.create({
      data: {
        title: item.title,
        content: item.content,
        authorId: item.authorId,
        // Ajoutez d'autres champs selon votre schéma
      },
    });
  }

  console.log('Data imported successfully');
}

importData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
