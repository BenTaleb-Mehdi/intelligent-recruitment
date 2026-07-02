# 📋 Sprint Backlog - Plateforme Intelligente de Recrutement IA

**Méthodologie :** Agile (Scrum)  
**Durée d'un Sprint :** 2 semaines  
**Architecture Target :** Next.js (App Router) · Express.js · Prisma · MySQL · MongoDB · Better Auth · Python · Ray Serve  
**Objectif du Projet :** Livrer un MVP fonctionnel, intelligent et basé sur une persistance polyglotte (SQL + NoSQL).

---

## 🏃‍♂️ Sprint 1 : Conception, Authentification & Charte Graphique / Design System (Semaines 1-2)
**🎯 Objectif du Sprint :** Valider la conception technique, installer le socle d'authentification, et créer l'ensemble du Design System (Atomic Design).

* [ ] **Task 1.1 [Conception] :** Validation finale, ajustements et documentation du Diagramme de Cas d'Utilisation et du Diagramme de Classe Hybride (MySQL/MongoDB).
* [ ] **Task 1.2 [Auth Setup] :** Initialisation du serveur Node.js/Express, configuration de Better Auth (Social Logins + configuration du plugin RBAC pour les rôles `candidate`, `recruiter`, `admin`).
* [ ] **Task 1.3 [Charte Graphique] :** Configuration de la palette de couleurs (Tokens), des polices globales, et initialisation de Shadcn UI dans le projet Next.js.
* [ ] **Task 1.4 [Atomic Design Components] :** Création des composants UI réutilisables (Atoms & Molecules) : boutons customisés, inputs intelligents, alertes, cartes (Cards) et menus de navigation.
* [ ] **Task 1.5 [Global Layouts] :** Intégration de la Landing Page publique et des structures de base (Shells/Layouts de navigation) intégrant la Sidebar et la Navbar pour l'Admin, le Recruteur et le Candidat.

---

## 🏃‍♂️ Sprint 2 : Développement Full Frontend - Toutes les Pages Next.js (Semaines 3-4)
**🎯 Objectif du Sprint :** Intégrer toutes les maquettes graphiques et créer le squelette complet et navigable des interfaces pour les 3 acteurs (avec Mock Data).

* [ ] **Task 2.1 [Espace Candidat UI] :** Intégration complète des pages `/candidate/dashboard`, `/profile` (avec zone drag & drop pour le CV), `/jobs` (feed des offres d'emploi) et la page d'examen interactive `/quizzes/[id]`.
* [ ] **Task 2.2 [Espace Recruteur UI] :** Intégration des interfaces `/recruiter/dashboard`, `/jobs/create` (formulaire de publication d'offres), `/jobs/[id]/applicants` (tableau de classement des candidats) et `/jobs/[id]/quiz` (visualisation du quiz généré par l'IA).
* [ ] **Task 2.3 [Espace Admin UI] :** Création des vues d'administration : `/admin/users` (Table de gestion et modération des comptes), `/admin/jobs-moderation` et `/admin/quizzes-moderation`.
* [ ] **Task 2.4 [Routing & Guards] :** Configuration finale du routage Next.js via les Route Groups et gestion des redirections logiques liées à l'état d'Onboarding de l'utilisateur.

---

## 🏃‍♂️ Sprint 3 : Développement Backend, Modèles Prisma & CRUDs (Semaines 5-6)
**🎯 Objectif du Sprint :** Connecter l'architecture hybride des bases de données et développer toutes les APIs REST pour rendre les pages Next.js dynamiques.

* [ ] **Task 3.1 [Database Setup] :** Configuration et initialisation du client Prisma pour MySQL et du client Mongoose pour MongoDB dans le backend Express.
* [ ] **Task 3.2 [Prisma Migrations] :** Écriture et exécution des schémas relationnels dans MySQL via Prisma (`JobOffer`, `Skill`, `Application`, `Quiz`, `Question`, `TestResult`).
* [ ] **Task 3.3 [Mongoose Schemas] :** Création et déploiement des collections MongoDB non-relationnelles (`ParsedCV`, `GitHubData`, `PortfolioData`) indexées par `userId`.
* [ ] **Task 3.4 [APIs Espace Candidat] :** Développement des endpoints pour uploader le fichier PDF (Multer/S3), sauvegarder les données du profil et récupérer l'historique des candidatures et des tests passés.
* [ ] **Task 3.5 [APIs Recruteur & Admin] :** Implémentation des routes CRUD pour la création/gestion des offres d'emploi, la soumission des dossiers (`Application`) et les fonctionnalités de modération (bannissement/vérification) pour l'Admin.

---

## 🏃‍♂️ Sprint 4 : Moteur IA - NLP, Scoring & Génération de Quiz GenAI (Semaines 7-8)
**🎯 Objectif du Sprint :** Connecter le microservice Python/Ray pour injecter l'intelligence artificielle (Parsing de documents, algorithme de matching et génération automatique de tests).

* [ ] **Task 4.1 [Python Infrastructure] :** Configuration du microservice Python avec Ray Serve et sécurisation des requêtes HTTP internes avec le backend Express.
* [ ] **Task 4.2 [CV NLP Parser] :** Implémentation du Ray Actor d'extraction textuelle des CVs (PDF) à l'aide de `spaCy` / `Transformers` et persistance du payload JSON dans **MongoDB (`ParsedCV`)**.
* [ ] **Task 4.3 [GenAI Quiz Generation] :** Développement de la logique automatique : à la publication d'une offre côté Express, le service Python génère par IA un QCM technique de 5 questions inséré directement dans MySQL via Prisma.
* [ ] **Task 4.4 [Scoring Engine] :** Développement du calcul distribué de la **Similarité Cosinus** sur Ray (Vecteurs d'embeddings BERT/GPT) pour générer le score d'adéquation dynamique (%).
* [ ] **Task 4.5 [IA Explicable] :** Module d'analyse comparative textuelle extrayant les points forts et les compétences manquantes du candidat par rapport à l'offre (destiné au modal du recruteur).

---

## 🏃‍♂️ Sprint 5 : Intégrations Externes APIs & Connectivité Globale (Semaines 9-10)
**🎯 Objectif du Sprint :** Connecter les APIs des plateformes tierces et lier définitivement les requêtes du Frontend Next.js avec le Backend Express.

* [ ] **Task 5.1 [GitHub API Sync] :** Connexion à l'API GitHub via le token OAuth pour aspirer l'arborescence des projets techniques du candidat et stocker les données brutes dans la collection **MongoDB (`GitHubData`)**.
* [ ] **Task 5.2 [Portfolio Sync] :** Intégration avec l'API BidigitalHub pour centraliser et structurer les données du portfolio numérique dans **MongoDB (`PortfolioData`)**.
* [ ] **Task 5.3 [Quiz Frontend Sync] :** Liaison frontend/backend pour l'envoi des réponses aux quiz en temps réel, calcul automatique de la note et enregistrement sécurisé dans la table MySQL `TestResult`.
* [ ] **Task 5.4 [Score Global Ray Actor] :** Implémentation de l'algorithme Ray qui fusionne les données hétérogènes (Score CV + Projets GitHub + Portfolio + Note Quiz) pour mettre à jour le champ `employabilityScore` dans MySQL.

---

## 🏃‍♂️ Sprint 6 : Dashboards Avancés, Sécurité & Préparation Livraison (Semaines 11-12)
**🎯 Objectif du Sprint :** Finaliser les graphiques analytiques, sécuriser l'application par contrôle d'accès strict (Middleware) et préparer la soutenance.

* [ ] **Task 6.1 [Charts & Analytics UI] :** Intégration de graphiques dynamiques et interactifs (Next.js Recharts) dans les dashboards Recruteur (KPIs de recrutement) et Admin.
* [ ] **Task 6.2 [Middleware de Sécurité] :** Implémentation finale du Next.js Middleware pour le contrôle d'accès basé sur les rôles (RBAC) pour bloquer hermétiquement les routes (`/admin`, `/recruiter`, `/candidate`).
* [ ] **Task 6.3 [Audit & Conformité] :** Chiffrement des données sensibles en base de données, application des politiques RGPD (suppression définitive de compte) et optimisation des index MySQL/MongoDB.
* [ ] **Task 6.4 [QA & Bug Fixing] :** Phase intensive de tests de bout en bout (E2E) via Postman / Playwright et résolution des anomalies critiques.
* [ ] **Task 6.5 [Deployment & Cloud] :** Déploiement de l'infrastructure hybride : Frontend Next.js sur Vercel, Backend Express et service Python sur AWS ou Render, bases de données sur instances managées cloud.