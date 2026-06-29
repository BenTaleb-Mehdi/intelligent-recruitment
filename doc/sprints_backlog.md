# 📋 Sprint Backlog - Plateforme Intelligente de Recrutement IA

**Méthodologie :** Agile (Scrum)
**Durée d'un Sprint :** 2 semaines
**Architecture Target :** React · Node.js · Express.js · MySQL · Better Auth · Python · Ray
**Objectif :** Livrer un MVP fonctionnel et intelligent

---

## 🏃‍♂️ Sprint 1 : Architecture de Base & Authentification (Semaines 1-2)
**🎯 Objectif du Sprint :** Mettre en place le socle technique et la gestion des comptes pour les 3 acteurs.

*   **Task 1.1 [Backend] :** Configuration initiale du serveur **Node.js + Express.js** et connexion sécurisée à la base de données **MySQL** (via le driver `mysql2`).
*   **Task 1.2 [Database] :** Création du schéma initial de la base de données MySQL : tables `users`, `sessions`, `profiles`.
*   **Task 1.3 [Auth] :** Intégration et configuration de **Better Auth** (inscription, connexion, sessions sécurisées via cookies `httpOnly`).
*   **Task 1.4 [Auth] :** Configuration du plugin **RBAC de Better Auth** pour la gestion des rôles (`candidate`, `recruiter`, `admin`) et protection des routes Express.
*   **Task 1.5 [Frontend] :** Initialisation de l'application **React** et intégration des pages Login / Register connectées au client Better Auth.

---

## 🏃‍♂️ Sprint 2 : Gestion des Profils & Offres d'Emploi (Semaines 3-4)
**🎯 Objectif du Sprint :** Permettre aux candidats de remplir leurs informations et aux recruteurs de publier des annonces.

*   **Task 2.1 [Candidat] :** Interface React de création de profil complet et système d'upload de fichiers CV (PDF / DOC).
*   **Task 2.2 [Recruteur] :** Formulaire React de création, modification et suppression d'offres d'emploi.
*   **Task 2.3 [Backend] :** Création de la table MySQL `job_offers` et développement des routes CRUD Express correspondantes.
*   **Task 2.4 [Backend] :** Implémentation du système de stockage de fichiers (local ou S3) pour sauvegarder les CVs téléversés et enregistrer leurs URLs en base MySQL.
*   **Task 2.5 [Frontend] :** Intégration du flux d'affichage des offres d'emploi côté candidat avec React Query / Axios.

---

## 🏃‍♂️ Sprint 3 : Moteur IA - NLP & Extraction de Compétences (Semaines 5-6)
**🎯 Objectif du Sprint :** Initialiser le microservice Python pour analyser textuellement les CVs et les offres.

*   **Task 3.1 [AI Service] :** Initialisation du microservice **Python** avec **Ray Serve** (exposition des endpoints d'analyse IA via une API HTTP).
*   **Task 3.2 [NLP Parsing] :** Développement du **Ray Actor** de parsing automatique des CVs avec `spaCy` / `Transformers` pour extraire les compétences.
*   **Task 3.3 [NLP Parsing] :** Développement du **Ray Actor** d'analyse et de parsing des descriptions d'offres d'emploi.
*   **Task 3.4 [Embeddings] :** Intégration d'un modèle NLP (BERT/GPT) pour transformer CVs et offres en vecteurs numériques (`cv_embeddings` & `offer_embeddings`), stockés dans MySQL (colonne `TEXT` / JSON).
*   **Task 3.5 [Bridge] :** Connexion et communication API entre le backend **Node.js/Express** et le microservice **Python/Ray Serve** (requêtes HTTP internes).

---

## 🏃‍♂️ Sprint 4 : Moteur IA - Scoring Bidirectionnel & IA Explicable (Semaines 7-8)
**🎯 Objectif du Sprint :** Implémenter l'algorithme de matching et le ranking intelligent.

*   **Task 4.1 [Algorithme] :** Implémentation du calcul de **Similarité Cosinus** en Python/Ray pour comparer les vecteurs CV / Offres.
*   **Task 4.2 [Matching] :** Développement du système de scoring bidirectionnel (Top 10 candidats pour un recruteur / Top 10 jobs pour un candidat) orchestré par Ray.
*   **Task 4.3 [IA Explicable] :** Développement du module textuel qui explique pourquoi un candidat est recommandé (extraction des points forts / compétences manquantes).
*   **Task 4.4 [Applications] :** Création de la table MySQL `applications` pour gérer la soumission des candidatures avec stockage du score final (%).
*   **Task 4.5 [Frontend] :** Affichage visuel du score d'adéquation dynamique et de l'explication IA sur les interfaces Candidat et Recruteur.

---

## 🏃‍♂️ Sprint 5 : Intégrations Externes & Module d'Évaluation (Semaines 9-10)
**🎯 Objectif du Sprint :** Connecter les plateformes de portfolios et mettre en place les tests techniques de validation.

*   **Task 5.1 [API Integration] :** Connexion avec l'API **GitHub** pour récupérer et analyser les projets techniques des candidats.
*   **Task 5.2 [API Integration] :** Connexion avec l'API **BidigitalHub** (et/ou LinkedIn) pour importer automatiquement les données du portfolio digital.
*   **Task 5.3 [Evaluations] :** Création du module de tests techniques automatiques et quiz de compétences ; table MySQL `quiz_results`.
*   **Task 5.4 [Scoring Global] :** Algorithme de calcul du **score d'employabilité global** combinant (CV + Projets Portfolio + Résultats des Quiz), traitement distribué via **Ray**.
*   **Task 5.5 [Frontend] :** Interface React pour passer les quiz et visualiser la progression des compétences.

---

## 🏃‍♂️ Sprint 6 : Tableaux de Bord, Sécurité & Tests Finaux (Semaines 11-12)
**🎯 Objectif du Sprint :** Finaliser les interfaces analytics, sécuriser l'application, et préparer la livraison du projet.

*   **Task 6.1 [Dashboard] :** Tableau de bord Analytics Recruteur (nombre de candidatures, performance des offres, temps moyen de recrutement) — données agrégées depuis MySQL.
*   **Task 6.2 [Dashboard] :** Tableau de bord Candidat (historique des candidatures, offres recommandées, score de profil).
*   **Task 6.3 [Admin] :** Interface Administrateur pour la modération des comptes et la détection / protection anti-fake CV.
*   **Task 6.4 [Sécurité] :** Validation finale : conformité RGPD, chiffrement des données sensibles en MySQL, audit des sessions **Better Auth**, et tests de pénétration.
*   **Task 6.5 [QA] :** Tests de bout en bout (End-to-End) avec Postman / Playwright, correction des bugs, et déploiement de la solution sur le cloud (AWS / Render / Vercel).
