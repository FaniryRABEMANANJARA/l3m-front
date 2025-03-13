# Frontend Next.js pour L3m-holding

Ce projet est un frontend Next.js pour l'application L3m-holding. Il permet aux utilisateurs de gérer leurs transactions et de consulter leur profil.

## Prérequis

* Node.js (version 18 ou supérieure)
* npm ou yarn
* Un backend Laravel fonctionnel (avec une API REST)

## Installation

1.  Clonez le dépôt :

    ```bash
    git clone <[URL_DU_DÉPÔT](https://github.com/FaniryRABEMANANJARA/l3m-front.git)>
    cd <cd frontend-nextjs>
    ```

2.  Installez les dépendances :

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  Configurez les variables d'environnement :

    * Créez un fichier `.env.local` à la racine du projet.
    * Ajoutez la variable `NEXT_PUBLIC_LARAVEL_API_ENDPOINT` avec l'URL de votre API Laravel :

        ```
        NEXT_PUBLIC_LARAVEL_API_ENDPOINT=[http://http://127.0.0.1:8000/api]
        ```

4.  Démarrez le serveur de développement :

    ```bash
    npm run dev
    # ou
    yarn dev
    ```

    L'application sera accessible à l'adresse `http://localhost:3000`.

## Structure du projet