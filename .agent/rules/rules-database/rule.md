---

# Strict Architectural & Clean Code Rules

## 1. No Hallucination / Schema Restriction Rule
*   **Source of Truth**: The Agent MUST strictly restrict its mutations, schema generation, and reasoning to the classes and attributes defined in `doc/conception/classe.mmd`.
*   **Prohibition**: You are forbidden from inventing new classes, database collections, or entity fields. If a property or relation is not explicitly declared in the diagram, it does not exist.

## 2. Class Alignment & Field Typing Constraints
Every operation executed by the Agent must map perfectly to the following properties:

### A. Authentication & Authorization (RBAC)
*   **User**: Must only handle `#id`, `#email`, `#passwordHash`, and `#createdAt`.
*   **Role**: Must map to `-id`, `-name`, `-description`, and `-permissions`. 
*   **Strict Rule**: No `User` can be processed without an explicit, valid association to at least one `Role` object (`User "0..*" -- "1..*" Role`).

### B. Candidate & Profile Processing
*   **Candidate**: Inherits from `User`. Extends with fields `-firstName`, `-lastName`, `-phone`, `-employabilityScore`, and `-careerSuggestions`.
*   **CV**: Bound to `Candidate` via `1-to-1`. Contains only `-id`, `-rawFileUrl`, `-parsedText`, `-extractedSkills`, and `-experienceYears`.
*   **Portfolio & Project**: A `Candidate` has `0..*` `Portfolio` (`platformName`, `externalUrl`, `verifiedStatus`). A `Portfolio` contains `0..*` `Project` (`title`, `description`, `repositoryUrl`, `hiddenSkillsDetected`).
*   **Clean Code Rule**: The Agent must never inject transient parsing logs inside these entities. Clean data only.

### C. Matching & Application Domain
*   **JobOffer**: Managed by `Recruiter`. Contains `-id`, `-title`, `-description`, `-parsedSkills`, `-location`, `-salaryRange`, and `-status`.
*   **MatchResult**: Generated between a `JobOffer` and a `Candidate`. Must strictly fill `-id`, `-globalScore`, `-contentScore`, `-collaborativeScore`, `-explainabilityText`, and `-generatedAt`.
*   **Clean Code Rule**: The `explainabilityText` must be formatted in clean, human-readable prose explaining the delta between `JobOffer.parsedSkills` and `CV.extractedSkills`.

## 3. Clean Code Standards for Agent Execution
*   **Single Responsibility Principle (SRP)**: Each skill used by the workflow must perform exactly one mutation or one query. Do not mix CV parsing with compatibility scoring.
*   **Naming Conventions**: All generated fields, runtime variables, and JSON payloads must strictly use `camelCase` (e.g., `employabilityScore`, `hiddenSkillsDetected`). Classes must use `PascalCase`.
*   **Immutability**: Historical logs like `Application.appliedAt` and `MatchResult.generatedAt` must be treated as read-only once instantiated.

## 4. Frontend-Backend Contract Rules
*   **API Payload Alignment**: All API request/response payloads must map exactly to the schema attributes defined in `doc/conception/classe.mmd`. No extra fields, no missing required fields.
*   **Error Responses**: Every API endpoint must return a consistent JSON structure: `{ success: boolean, data?: any, error?: { code: string, message: string } }`.
*   **Authentication**: All protected routes require a valid JWT in the `Authorization: Bearer <token>` header. The token must contain `userId`, `role`, and `exp` claims.

## 5. AI Service Contract Rules
*   **Microservice Isolation**: The Python AI microservice (FastAPI) must only communicate via HTTP REST with the Node.js backend. No direct database access from the AI service.
*   **NLP Output Validation**: All NLP-extracted fields (`CV.extractedSkills`, `JobOffer.parsedSkills`, `Project.hiddenSkillsDetected`) must be validated to contain only known skill strings before persisting.
*   **Score Range**: All score fields (`globalScore`, `contentScore`, `collaborativeScore`, `employabilityScore`) must be floats in the range `[0.0, 1.0]`.