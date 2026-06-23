# 📋 Sprint Backlog - Plateforme Intelligente de Recrutement IA

**Méthodologie :** Agile (Scrum)[cite: 1]  
**Durée d'un Sprint :** 2 semaines[cite: 1]  
**Architecture Target :** MERN Stack + Python (FastAPI)[cite: 1]  
**Objectif :** Livrer un MVP fonctionnel et intelligent[cite: 1]

---

## 🏃‍♂️ Sprint 1 : Architecture de Base & Authentification (Semaines 1-2)
**🎯 Objectif du Sprint :** Mettre en place le socle technique et la gestion des comptes pour les 3 acteurs[cite: 1].

*   **Task 1.1 [Backend] :** Configuration initiale du serveur Node.js, Express, et connexion sécurisée à MongoDB Atlas[cite: 1].
*   **Task 1.2 [Database] :** Création des Schemas Mongoose initiaux (`User`, `Profile`)[cite: 1].
*   **Task 1.3 [Auth] :** Développement des API d'inscription et connexion avec chiffrement des mots de passe (Bcrypt) et génération de Tokens JWT[cite: 1].
*   **Task 1.4 [Auth] :** Gestion des rôles au niveau des routes (Candidate, Recruiter, Admin)[cite: 1].
*   **Task 1.5 [Frontend] :** Initialisation de l'application React/Angular et intégration des pages de Login/Register[cite: 1].

---

## 🏃‍♂️ Sprint 2 : Gestion des Profils & Offres d'Emploi (Semaines 3-4)
**🎯 Objectif du Sprint :** Permettre aux candidats de remplir leurs informations et aux recruteurs de publier des annonces[cite: 1].

*   **Task 2.1 [Candidat] :** Interface de création de profil complet et système d'upload de fichiers CV (PDF / DOC)[cite: 1].
*   **Task 2.2 [Recruteur] :** Formulaire de création, modification et suppression d'offres d'emploi[cite: 1].
*   **Task 2.3 [Backend] :** Création du modèle Mongoose `JobOffer` et des routes CRUD pour les offres[cite: 1].
*   **Task 2.4 [Backend] :** Implémentation du système de stockage (S3-like) pour sauvegarder les CVs téléversés[cite: 1].
*   **Task 2.5 [Frontend] :** Intégration du flux d'affichage des offres d'emploi pour le candidat[cite: 1].

---

## 🏃‍♂️ Sprint 3 : Moteur IA - NLP & Extraction de Compétences (Semaines 5-6)
**🎯 Objectif du Sprint :** Initialiser le microservice Python pour analyser textuellement les CVs et les offres[cite: 1].

*   **Task 3.1 [AI Service] :** Initialisation du serveur Python (FastAPI) et configuration de l'environnement Machine Learning[cite: 1].
*   **Task 3.2 [NLP Parsing] :** Développement du script de parsing automatique des CVs avec spaCy/Transformers pour extraire les compétences cachées[cite: 1].
*   **Task 3.3 [NLP Parsing] :** Développement du script d'analyse et de parsing automatique des descriptions d'offres d'emploi[cite: 1].
*   **Task 3.4 [Embeddings] :** Intégration d'un modèle NLP (BERT/GPT) pour transformer les CVs et les offres en vecteurs numériques (`cv_embeddings` & `offer_embeddings`)[cite: 1].
*   **Task 3.5 [Bridge] :** Connexion et communication API entre le backend Node.js et le microservice Python[cite: 1].

---

## 🏃‍♂️ Sprint 4 : Moteur IA - Scoring Bidirectionnel & IA Explicable (Semaines 7-8)
**🎯 Objectif du Sprint :** Implémenter l'algorithme de matching et le ranking intelligent[cite: 1].

*   **Task 4.1 [Algorithme] :** Implémentation du calcul de similarité cosinus (Cosine Similarity) sous Python pour comparer les vecteurs CV / Offres[cite: 1].
*   **Task 4.2 [Matching] :** Développement du système de scoring bidirectionnel (Top 10 candidats pour un recruteur / Top 10 jobs pour un candidat)[cite: 1].
*   **Task 4.3 [IA Explicable] :** Développement du module textuel qui explique au recruteur pourquoi le candidat est recommandé (Extraction des points forts / compétences manquantes)[cite: 1].
*   **Task 4.4 [Applications] :** Création du modèle `Application` pour gérer la soumission des candidatures avec stockage du score final (%)[cite: 1].
*   **Task 4.5 [Frontend] :** Affichage visuel du score d'adéquation dynamique sur les interfaces Candidat et Recruteur[cite: 1].

---

## 🏃‍♂️ Sprint 5 : Intégrations Externes & Module d'Évaluation (Semaines 9-10)
**🎯 Objectif du Sprint :** Connecter les plateformes de portfolios et mettre en place les tests techniques de validation[cite: 1].

*   **Task 5.1 [API Integration] :** Connexion avec l'API GitHub pour récupérer et analyser les projets techniques des candidats[cite: 1].
*   **Task 5.2 [API Integration] :** Connexion avec l'API BidigitalHub (et/ou LinkedIn) pour importer automatiquement les données du portfolio digital[cite: 1].
*   **Task 5.3 [Evaluations] :** Création du module de tests techniques automatiques et quiz de compétences[cite: 1].
*   **Task 5.4 [Scoring Global] :** Algorithme de calcul du score d'employabilité global combinant (CV + Projets Portfolio + Résultats des Quiz)[cite: 1].
*   **Task 5.5 [Frontend] :** Interface candidat pour passer les quiz et visualiser la progression des compétences[cite: 1].

---

## 🏃‍♂️ Sprint 6 : Tableaux de Bord, Sécurité & Tests Finaux (Semaines 11-12)
**🎯 Objectif du Sprint :** Finaliser les interfaces analytics, sécuriser l'application, et préparer la livraison du projet[cite: 1].

*   **Task 6.1 [Dashboard] :** Tableau de bord Analytics Recruteur (Nombre de candidatures, performance des offres, temps moyen de recrutement)[cite: 1].
*   **Task 6.2 [Dashboard] :** Tableau de bord Candidat (Historique des candidatures, offres recommandées, score de profil)[cite: 1].
*   **Task 6.3 [Admin] :** Interface Administrateur pour la modération des comptes et la détection/protection anti-fake CV[cite: 1].
*   **Task 6.4 [Sécurité] :** Validation finale de la conformité RGPD, chiffrement des données sensibles et tests de pénétration des tokens[cite: 1].
*   **Task 6.5 [QA] :** Tests de bout en bout (End-to-End) avec Postman, correction des bugs, et déploiement de la solution sur le cloud (AWS/Render/Vercel)[cite: 1].