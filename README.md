# 🇵🇭 Tulong AI

**Filipino Social Services Eligibility Checker**

Tulong AI helps Filipinos quickly find out which government programs they qualify for — 4Ps, PhilHealth, TUPAD, SSS, AICS, Solo Parent benefits, OSCA, PWD, UniFAST TES, and more — using AI-powered intake parsing and a deterministic rules engine.

---

## Features

- **Bilingual** — English and Filipino (Tagalog) support
- **Free-text intake** — Describe your situation naturally; Claude parses it into structured data
- **Structured form** — Fill a simple form if you prefer
- **Rules engine** — Deterministic eligibility checks for 9 government programs
- **Gap analysis** — Identifies systemic gaps in your coverage
- **Conflict detection** — Warns when programs may conflict
- **Document checklist** — Interactive checklist of required documents
- **NGO fallback** — Suggests civil society organizations when government programs don't fit
- **Reasoning trace** — Transparent audit trail of how eligibility was determined
- **AI explanation** — Claude summarizes results in warm, accessible language

---

## Programs Covered

| Program | Agency | What It Covers |
|---------|--------|---------------|
| 4Ps (Pantawid Pamilyang Pilipino Program) | DSWD | Conditional cash transfer for poor households |
| PhilHealth | PhilHealth | National health insurance |
| TUPAD | DOLE | Emergency employment for displaced workers |
| SSS | SSS | Social insurance (sickness, maternity, retirement) |
| AICS | DSWD | Crisis assistance (medical, burial, disaster) |
| Solo Parent Benefits | DSWD / LGU | ID, leave, and priority for solo parents |
| Senior Citizen (OSCA) | LGU | 20% discounts and social pension |
| PWD Benefits | LGU / MSWDO | PWD ID and Magna Carta entitlements |
| UniFAST TES | CHED | College tuition and allowance subsidy |

---

## Tech Stack

**Backend:** FastAPI · Python · Anthropic Claude API  
**Frontend:** React 18 · Vite · Tailwind CSS · React Router

---

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Anthropic API key

### 1. Clone and configure

```bash
git clone <repo-url>
cd tulong-ai
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## API Endpoints

### `POST /api/eligibility/parse-and-check`
Parse free-form text and return eligibility results.

```json
{
  "text": "I'm 35 years old, living in Quezon City with my wife and 2 kids. I lost my job 3 months ago...",
  "language": "en"
}
```

### `POST /api/eligibility/check`
Check eligibility from structured data.

```json
{
  "age": 35,
  "monthly_income": 6000,
  "household_size": 4,
  "employment_status": "unemployed",
  "is_pwd": false,
  "is_senior": false,
  "has_philhealth": false,
  "has_sss": false,
  "is_solo_parent": false,
  "has_children_under_18": true,
  "has_college_student": false,
  "in_crisis": false,
  "location_type": "urban",
  "language": "en"
}
```

### `GET /api/programs`
List all supported government programs.

### `GET /api/programs/{program_id}`
Get full details for one program.

### `GET /api/offices`
Get government office contact information (optional `?agency=DSWD` filter).

---

## Project Structure

```
tulong-ai/
├── frontend/
│   └── src/
│       ├── components/       # UI components
│       ├── pages/            # Home, Results
│       ├── hooks/            # useEligibility
│       └── utils/            # api.js
└── backend/
    ├── engines/              # Rules, gap analysis, conflict detection, NGO routing
    ├── services/             # Input parsing, explanation generation
    ├── routers/              # FastAPI route handlers
    ├── configs/              # Program configs (JSON)
    ├── models/               # Pydantic schemas
    └── prompts/              # Claude system prompts (EN + FIL)
```

---

## Adding New Programs

1. Create `backend/configs/programs/<program_id>.json` following the existing structure
2. Add a check function in `backend/engines/rules_engine.py`
3. Call it inside `run_all_rules()`
4. Update `conflicts.json` if needed

---

## Disclaimer

Tulong AI is for informational purposes only. Results are indicative and not a guarantee of government program approval. Always consult your local MSWDO, DOLE, PhilHealth, or SSS office for official application.

---

*Tulong* means *help* in Filipino. Built to make government services more accessible to every Filipino.
