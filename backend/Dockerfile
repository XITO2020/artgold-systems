# Étape 1 : base node
FROM node:20-alpine

# Crée un répertoire de travail
WORKDIR /app

# Copie package.json et lock
COPY package.json ./
COPY tsconfig.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste
COPY . .

# Génère le client Prisma (important !)
RUN npx prisma generate

# Expose le port d’API
EXPOSE 4000

# Commande de lancement en production
CMD ["npm", "run", "start"]
