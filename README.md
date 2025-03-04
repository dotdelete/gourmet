# Gourmet - Application de Gestion de Recettes

Une application web pour gérer une liste de recettes, basée sur l'API Gourmet.

## Fonctionnalités

- Affichage de la liste des recettes disponibles
- Affichage détaillé d'une recette
- Authentification utilisateur (connexion/déconnexion)
- Gestion des recettes favorites (ajout/suppression)
- Affichage des recettes favorites de l'utilisateur

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React pour le développement web
- [React](https://reactjs.org/) - Bibliothèque JavaScript pour construire des interfaces utilisateur
- [TypeScript](https://www.typescriptlang.org/) - Superset typé de JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitaire
- [Docker](https://www.docker.com/) - Plateforme de conteneurisation

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [npm](https://www.npmjs.com/) (v8 ou supérieur)
- [Docker](https://www.docker.com/) (optionnel, pour le déploiement)

## Installation et démarrage

### Développement local

1. Cloner le dépôt
   ```bash
   git clone <url-du-depot>
   cd gourmet
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Démarrer le serveur de développement
   ```bash
   npm run dev
   ```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

### Avec Docker

1. Construire et démarrer les conteneurs
   ```bash
   docker-compose up -d
   ```

2. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

3. Pour arrêter les conteneurs
   ```bash
   docker-compose down
   ```

## Structure du projet

```
/
├── public/            # Fichiers statiques
├── src/
│   ├── app/           # Pages de l'application (Next.js App Router)
│   ├── components/    # Composants React réutilisables
│   ├── lib/           # Utilitaires et services
│   └── types/         # Définitions de types TypeScript
├── Dockerfile         # Configuration Docker
├── docker-compose.yml # Configuration Docker Compose
└── next.config.ts     # Configuration Next.js
```

## API

L'application utilise l'API Gourmet disponible à l'adresse suivante :
- API URL: https://gourmet.cours.quimerch.com
- Documentation OpenAPI: https://gourmet.cours.quimerch.com/swagger/index.html

## Authentification

Pour utiliser les fonctionnalités nécessitant une authentification (comme la gestion des favoris), vous devez vous connecter avec les identifiants fournis par votre enseignant.
