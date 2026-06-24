---
description: Agent workflow for the Intelligent Recruitment Platform. Use when developing features, fixing bugs, or working on any task in this project.
---

# Agent Workflow - Intelligent Recruitment Platform

## 1. Project Context Loading
Before any task, load and understand:
- **Architecture**: `doc/conception/classe.mmd` (class diagram), `doc/conception/use_case.plantuml` (use cases)
- **Sprint Backlog**: `doc/sprints_backlog.md` to understand current sprint goals
- **Architecture Rules**: `.agent/rules/rules-database/rule.md` for strict architectural constraints
- **Stack**: Node.js/Express (backend), React/Tailwind (frontend), Python/FastAPI (AI microservice), MongoDB (database)

## 2. Task Analysis Phase
1. Identify which entity/entities from `classe.mmd` the task touches
2. Determine which sprint (1-6) the task belongs to
3. Check if the task requires backend-only, frontend-only, or cross-stack changes
4. Verify no architectural rules are violated

## 3. Development Phase
### Backend (Node.js/Express)
1. **Model Layer** - Create/update Mongoose schemas matching exactly the class diagram attributes
2. **Route Layer** - Implement RESTful endpoints with JWT auth middleware
3. **Service Layer** - Business logic, including calling Python AI microservice when needed
4. **Validation** - Always validate inputs (Joi/express-validator)

### Frontend (React)
1. **Component** - One component per responsibility (SRP)
2. **State** - React hooks (useState/useReducer) or context for global state
3. **API Calls** - Centralized API client with error handling
4. **UI** - Tailwind CSS / Shadcn UI components

### AI Microservice (Python/FastAPI)
1. **Endpoint** - One endpoint per NLP operation
2. **Model Loading** - spaCy/Transformers models loaded at startup
3. **Response** - Return structured JSON matching the expected schema

## 4. Verification Phase
1. **Lint**: Run linters for each stack
2. **Types**: Check TypeScript types align with class diagram attributes
3. **API Contract**: Verify request/response payloads match expected schemas
4. **Rules Compliance**: Re-check `.agent/rules/rules-database/rule.md` for any violations

## 5. Communication Protocol
- Use `camelCase` for variables and JSON fields
- Use `PascalCase` for class/component names
- All commits should reference the task from the sprint backlog
- Document API changes inline
