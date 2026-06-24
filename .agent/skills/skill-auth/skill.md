You are an Expert Senior Full-Stack Developer specialized f the MERN Stack (MongoDB, Express, React, Node.js) and Role-Based Access Control (RBAC) Security. Your task is to generate the complete Authentication and Registration system for our intelligent recruitment platform, strictly adhering to the schemas defined f our Class Diagram and Agent Rules.

### 🚫 STRICT ARCHITECTURAL CONSTRAINTS:
1. NO SCHEMA HALLUCINATION: Rely only on the fields defined f the Class Diagram:
   - User: id, email, passwordHash, roles (Array of ObjectIds), createdAt.
   - Role: id, name, description, permissions (Array of Strings).
   - Candidate: firstName, lastName, phone, employabilityScore, careerSuggestions.
   - Recruiter: companyName, position, industry.
2. CLEAN DATA INITIALIZATION: When a new User is registered, you must automatically create an empty matching profile f either the 'Candidates' or 'Recruiters' collection depending on their chosen role.

### 🔐 FUNCTIONAL REQUIREMENTS:

1. LOCAL AUTHENTICATION:
   - Implement Inscription (Register) and Connexion (Login) via Email and Password using 'bcryptjs' for secure password hashing and 'jsonwebtoken' (JWT) for stateless token generation.
   - Token Payload must include: `userId`, `roles` (array of names), and `permissions` (array of string tokens).

2. SOCIAL AUTHENTICATION (OAuth2 via Passport.js):
   - CANDIDATES can register/login via: Google, LinkedIn, and GitHub.
   - RECRUITERS can register/login via: Google and LinkedIn only (Strictly prohibit GitHub access for Recruiters).
   - Dynamic Role Mapping: Pass the selected role ('ROLE_CANDIDAT' or 'ROLE_RECRUTEUR') inside the OAuth 'state' parameter from the frontend. In the backend callback, parse this state to assign the correct role and initialize the correct profile collection if the user is logging in for the first time.

3. ADMIN MANAGEMENT (Superuser Gate):
   - Seed or provide a script to create a 'ROLE_ADMIN' inside MongoDB that possesses ALL system permissions (e.g., ["CAN_MANAGE_ROLES", "CAN_VIEW_METRICS", "CAN_MODERATE"]).
   - Provide a local login route where an Admin can authenticate to receive full permissions.

### 📂 EXPECTED CODE OUTPUT:

Please generate clean, modular code structured as follows:
- **Backend (Node/Express)**:
  - `models/User.js`, `models/Role.js`, `models/Candidate.js`, `models/Recruiter.js` (Mongoose Schemas).
  - `config/passport.js` (Strategies for Google, LinkedIn, GitHub passing the role via the state parameter).
  - `controllers/authController.js` (Local register, login, and JWT generation).
  - `middleware/authMiddleware.js` (JWT token verification + dynamic RBAC permission check gatekeeper).
- **Frontend (React)**:
  - `context/AuthContext.jsx` (Global authentication state management storing the token f localStorage and configuring axios headers).
  - `pages/AuthPage.jsx` (Single UI component managing Login, Register toggles, Role Selection buttons for Candidate vs Recruiter, and dynamic Social Login buttons displaying GitHub only when the Candidate role is active).

Ensure all code follows production-grade Clean Code principles, uses camelCase for properties, handles try/catch blocks securely, and returns precise semantic HTTP status codes.