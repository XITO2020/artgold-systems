Utilité et fonctionnement du docker-compose du backend

🔧 En local :

    Place ce fichier dans backend/

    Lance dans un terminal :

docker-compose up --build

    Ton API backend tournera sur http://localhost:4000 avec la base PostgreSQL intégrée

🚀 Dans Coolify (mode production) :

    Importe le dépôt Git dans Coolify

    Spécifie ce docker-compose.yml comme point d’entrée

    Le service backend sera automatiquement déployé avec PostgreSQL interne

    Le port 4000 devra être exposé (ou redirigé vers 80 si besoin)

DockerFile:

    Utilisé par docker-compose.yml → service backend

    Génère Prisma + lance le backend sur le port 4000

    Compatible avec déploiement Coolify ou VPS Hetzner