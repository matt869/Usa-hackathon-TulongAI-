from fastapi import APIRouter
import json
import os
from typing import List, Dict, Any

router = APIRouter()

PROGRAMS_DIR = os.path.join(os.path.dirname(__file__), "..", "configs", "programs")
OFFICES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "offices.json")


def load_all_programs() -> List[Dict[str, Any]]:
    programs = []
    for filename in sorted(os.listdir(PROGRAMS_DIR)):
        if filename.endswith(".json"):
            with open(os.path.join(PROGRAMS_DIR, filename)) as f:
                programs.append(json.load(f))
    return programs


@router.get("/programs")
async def list_programs():
    """Return all supported government programs and their descriptions."""
    programs = load_all_programs()
    return {
        "count": len(programs),
        "programs": [
            {
                "id": p["id"],
                "name": p["name"],
                "agency": p["agency"],
                "description": p["description"],
                "benefits": p["benefits"],
                "office": p.get("office"),
                "documents_count": len(p.get("documents", [])),
            }
            for p in programs
        ],
    }


@router.get("/programs/{program_id}")
async def get_program(program_id: str):
    """Return full details for a single program."""
    path = os.path.join(PROGRAMS_DIR, f"{program_id}.json")
    if not os.path.exists(path):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Program '{program_id}' not found")
    with open(path) as f:
        return json.load(f)


@router.get("/offices")
async def list_offices(agency: str = None):
    """Return government office contact information."""
    with open(OFFICES_PATH) as f:
        data = json.load(f)
    offices = data["offices"]
    if agency:
        offices = [o for o in offices if o["agency"].lower() == agency.lower()]
    return {"offices": offices}
