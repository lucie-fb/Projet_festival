# Sun&Sound

Sun&Sound est une application web que j’ai développée dans le cadre de ma première année de Bachelor Développement Web Fullstack.  
L’objectif est simple : permettre aux utilisateurs de suivre leurs artistes préférés et de trouver facilement les festivals où ils se produisent.

Aujourd’hui, les informations sont dispersées entre plusieurs plateformes (Spotify, Ticketmaster, Google, Instagram, sites de festivals).  
Sun&Sound centralise ces données et propose une recherche inversée : on part de l’artiste pour découvrir les festivals associés.


# Objectif du projet

Le projet vise à simplifier la recherche musicale et événementielle.  
Mon projet permet de :

- rechercher un artiste,
- consulter les festivals où il est programmé,
- enregistrer des favoris,
- accéder à un espace utilisateur personnalisé.

L’application ne remplace pas Spotify ou Ticketmaster.  
Elle utilise leurs données pour offrir une expérience plus simple et plus adaptée aux besoins des utilisateurs.


# Fonctionnalités principales

- Recherche d’artistes via l’API Spotify  
- Récupération des festivals associés via l’API Ticketmaster  
- Système de favoris (artistes)  
- Authentification sécurisée   
- Interface pensée pour être accessible


# Technologies utilisées


- Nuxt 3  
- Pinia  
- Drizzle ORM  
- Neon (PostgreSQL)  
- Zod  
- Zitadel (authentification)  
- Vercel (hébergement et CI/CD)  
- Spotify API  
- Ticketmaster API

# Fonctionnement général

L’application interroge Spotify pour récupérer les informations sur les artistes, puis Ticketmaster pour trouver les festivals correspondants.  
Les favoris sont enregistrés dans une base PostgreSQL.  
L’état global (utilisateur connecté et favoris) est géré avec Pinia.  
Les données externes sont validées pour éviter les erreurs.  
L’authentification est assurée par Zitadel.  
Le projet est déployé automatiquement via Vercel.


# Structure du projet

/components     → composants d’interface (cartes artistes, festivals, etc.)
/pages          → pages principales de l’application
/server/api     → endpoints pour Spotify, Ticketmaster et les favoris
/stores         → gestion d’état avec Pinia
/utils          → fonctions utilitaires (utilisateurs et token Spotify)


# Objectifs pédagogiques

Ce projet m’a permise de travailler sur :

- l’intégration d’APIs externes,
- une base de données réelle,
- l’authentification via une autre plateforme,
- l’accessibilité,
- la structuration d’un projet complet.