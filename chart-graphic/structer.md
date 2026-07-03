src/app/
├── layout.tsx                 # Layout l-kbir dyal l-site كامل (Providers dyal Better-Auth, Toast, etc.)
├── page.tsx                   # Landing Page public (صفحة الاستقبال الرئيسية)
│
├── (auth)/                    # 🔐 GROUP: AUTHENTIFICATION & ONBOARDING
│   ├── login/
│   │   └── page.tsx           # Page dyal Login (Social & Manuel)
│   ├── register/
│   │   └── page.tsx           # Page dyal Inscription
│   └── onboarding/
│       └── page.tsx           # Multi-step form (Khtar: Candidat wla Recruteur + kemmel data l-onboarding)
│
├── (candidate)/               # 👨‍🎓 GROUP: ESPACE CANDIDAT
│   └── candidate/
│       ├── layout.tsx         # Sidebar + Navbar dyal l-candidat
│       ├── dashboard/
│       │   └── page.tsx       # Espace d'accueil (Overview, Score d'employabilité calculated b l-IA)
│       ├── profile/
│       │   └── page.tsx       # Mon Profil (Upload CV, Sync projects GitHub, links Portfolio)
│       ├── jobs/
│       │   ├── page.tsx       # Feed dyal l-offres m-recommandyin b l-IA m3a Score Matching (%)
│       │   └── [id]/
│       │       └── page.tsx   # Détails dyal l-offre + Match Explanation + Bouton "Postuler"
│       ├── applications/
│       │   └── page.tsx       # Suivi des candidatures (En cours, Accepté, Refusé)
│       └── quizzes/
│           ├── page.tsx       # Liste dyal les tests techniques li khsso y-douwz (tab3in l l-offres li postula lihom)
│           └── [id]/
│               └── page.tsx   # L-interface fin kiy-douwz l-quiz (Timer + Questions QCM)
│
├── (recruiter)/               # 👨‍💼 GROUP: ESPACE RECRUTEUR
│   └── recruiter/
│       ├── layout.tsx         # Sidebar + Navbar dyal l-recruteur
│       ├── dashboard/
│       │   └── page.tsx       # Main Dashboard (KPIs, Nombre d'offres, candidatures récentes)
│       ├── jobs/
│       │   ├── page.tsx       # Liste dyal l-offres d'emploi li la7hom had l-recruteur
│       │   ├── create/
│       │   │   └── page.tsx   # 🪄 Création d'offre (Melli kiy-lo7ha, Express back-end kiy-générer l-quiz b l-IA)
│       │   └── [id]/
│       │       ├── applicants/
│       │       │   └── page.tsx # 🧠 Ranking dyal les candidats par score % m3a l-explication dyal l-IA
│       │       └── quiz/
│       │           └── page.tsx # 👁️ NEW: Recruteur kiy-chouf + kiy-valider l-quiz li l-IA créat-ou l had l-offre
│       └── analytics/
│           └── page.tsx       # Performance dyal recruitment (Graphs dyal response time, etc.)
│
└── (admin)/                   # 👑 GROUP: ESPACE ADMINISTRATEUR
    └── admin/
        ├── layout.tsx         # Sidebar + Navbar dyal l-admin
        ├── dashboard/
        │   └── page.tsx       # Statistique globale dyal la plateforme (Total active users, jobs, etc.)
        ├── users/
        │   ├── page.tsx       # Gestion dyal les utilisateurs (Candidats / Recruteurs) -> Ban / Verify
        │   └── [id]/
        │       └── page.tsx   # Inspection dyal profil complete dyal chi user
        ├── jobs-moderation/
        │   └── page.tsx       # Modération des offres (Approuver wla blocker les fausses offres)
        └── quizzes-moderation/
            └── page.tsx       # Monitoring de systeme (Read-only overview 3la ga3 les quizzes generated f la DB)


--------------------------------------------------------------------------------------

src/
├── app/                       # Les routes kima chfna f l-fo9
├── components/                # Reusable UI components
│   ├── ui/                    # Shadcn-ui components (Button, Input, Card, Dialog...)
│   ├── shared/                # Components commun bhal (NavbarPublic, Sidebar shared)
│   ├── candidate/             # Components dyal candidat (ex: CvUploader.tsx, SkillTags.tsx)
│   ├── recruiter/             # Components dyal recruteur (ex: ApplicantCard.tsx, QuizViewer.tsx)
│   └── admin/                 # Components dyal admin (ex: UserStatsTable.tsx)
├── hooks/                     # Custom React hooks (ex: useAuth.ts)
├── lib/                       # Configurations client (better-auth-client.ts, utils.ts)
├── services/                  # Les API requests m3a Express Backend (bhal jobsService.ts, profileService.ts)
└── types/                     # TypeScript Interfaces (index.ts fih User, Job, Quiz, Application)