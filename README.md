# 🤖 Plateforme Intelligente de Recrutement et de Matching IA


## 📌 1. Contexte et Problématique
Le marché du recrutement actuel fait face à des défis majeurs : un volume massif de CV reçus, un tri manuel chronophage et souvent approximatif, ainsi qu'un manque de vérification concrète des compétences (Fake CVs).

Cette plateforme innovante répond à ces problématiques en automatisant et en optimisant le processus de recrutement grâce à l'Intelligence Artificielle (NLP) et à une approche basée sur les preuves (*Proof-Based Hiring*).

---

## 🎯 2. Concept Général & Objectifs
L'objectif principal est de créer un écosystème interconnecté assurant un **Matching Bidirectionnel** :
* **Recruteur ➡️ Candidat :** Analyse automatique des offres d'emploi et classement (*Ranking*) des meilleurs profils.
* **Candidat ➡️ Emploi :** Recommandation dynamique d'opportunités adaptées au profil et suggestions d'amélioration.

---

## 🛠️ 3. Architecture Technique (Tech Stack)
La plateforme repose sur une architecture moderne, fluide et découplée en microservices :

| Couche | Technologie | Rôle |
|---|---|---|
| **Frontend** | React.js + Tailwind CSS / Shadcn UI | Interface dynamique, responsive et *Mobile-First* |
| **Backend Principal** | Node.js + Express.js | API REST, routage, logique métier |
| **Authentification** | **Better Auth** | Sessions sécurisées, OAuth, RBAC (rôles candidat / recruteur / admin) |
| **Base de Données** | **MySQL** | Stockage relationnel des comptes, profils, offres, candidatures et sessions |
| **Microservice IA** | **Python + Ray** | Analyse NLP distribuée, extraction d'entités et calculs de similarité |
| **Intégrations** | APIs GitHub & BidigitalHub | Récupération et analyse des portfolios techniques |

> **Stack Résumé :** React · Node.js · Express.js · MySQL · Better Auth · Python · Ray

---

## ⚙️ 4. Modules Principaux et Acteurs

### 👩‍🎓 4.1 Module Candidat
* **Génération de Profil IA :** Extraction automatique des compétences à partir d'un CV téléversé (PDF/Doc).
* **Intégration de Portfolio :** Analyse des compétences réelles via l'import de projets depuis *GitHub* et *BidigitalHub*.
* **Score d'Employabilité :** Calcul d'un score dynamique basé sur le profil complet et les projets validés.
* **Évaluations :** Quiz et tests techniques intégrés pour certifier les compétences déclarées.

### 👨‍💼 4.2 Module Recruteur
* **Parsing d'Offres d'Emploi :** Analyse sémantique intelligente lors de la création d'une offre.
* **Ranking Top 10 :** Affichage instantané des 10 meilleurs candidats pour une offre grâce à l'algorithme de *Cosine Similarity*.
* **Tableau de Bord Analytics :** Suivi des performances des offres, du nombre de candidatures et du temps moyen de recrutement.

### 🧠 4.3 Module Administrateur
* **Modération :** Gestion et vérification des profils pour assurer la sécurité de la plateforme (*Anti-Fake CV*).
* **Statistiques Globales :** Suivi général des performances et de l'impact de l'écosystème.

---

## 🧠 5. Innovation Clé : IA Explicable (XAI)
La plateforme ne se contente pas de fournir un score de matching abstrait (ex: 85%). Elle intègre un module d'**IA Explicable (Explainable AI)** qui fournit au recruteur et au candidat un compte rendu textuel logique et transparent :
> *"Ce candidat est recommandé à 85% car il maîtrise parfaitement React et Node.js (compétences validées sur GitHub). Cependant, son score est réduit de 15% en raison de l'absence de maîtrise de Docker, requise dans l'offre."*

---

## 📊 6. Modèle de Données & Algorithmes IA

### 🗃️ Base de Données Relationnelle (MySQL)
Les principales tables SQL du projet :
* `users` — Comptes utilisateurs (id, email, role, created_at, ...)
* `sessions` — Sessions gérées nativement par **Better Auth**
* `profiles` — Profils candidats (skills JSON, cv_url, employability_score, ...)
* `job_offers` — Offres d'emploi publiées par les recruteurs
* `applications` — Candidatures avec score de matching (%)
* `quiz_results` — Résultats des évaluations techniques

### 🤖 Pipeline IA (Python + Ray)
* **Traitement de Texte :** NLP avec `spaCy` et `Transformers` (BERT/GPT) pour transformer les CVs et les offres en vecteurs numériques (`embeddings`).
* **Distribution :** **Ray** est utilisé pour paralléliser et distribuer les tâches NLP lourdes (parsing de masse, génération d'embeddings à grande échelle).
* **Algorithme de Matching :** Calcul de la distance sémantique via la **Similarité Cosinus** (*Cosine Similarity*).
* **Recommandation :** Système hybride (filtrage basé sur le contenu + filtrage collaboratif).

### 🔐 Authentification (Better Auth)
* Gestion des sessions sécurisées via cookies `httpOnly` (pas de JWT côté client).
* Gestion des rôles (`candidate`, `recruiter`, `admin`) via le plugin **RBAC** de Better Auth.
* Support OAuth (GitHub, Google) pour une inscription/connexion rapide.
* Intégration native avec Express.js et MySQL (adaptateur `mysql2`).

---

## 📅 7. Méthodologie de Gestion de Projet
Le projet est conduit selon la **Méthode Agile (Scrum)** avec des cycles (Sprints) de 2 semaines, assurant une évolution progressive allant du MVP (Minimum Viable Product) jusqu'à la solution finale complète.