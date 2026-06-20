import json
import os
from typing import List, Dict, Any
from models.schemas import EligibilityRequest, ProgramResult


PROGRAMS_DIR = os.path.join(os.path.dirname(__file__), "..", "configs", "programs")


def load_program_config(program_id: str) -> Dict[str, Any]:
    path = os.path.join(PROGRAMS_DIR, f"{program_id}.json")
    with open(path) as f:
        return json.load(f)


def check_4ps_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("4ps")
    gaps = []
    trace = []
    eligible = True
    confidence = 1.0

    income_per_capita = req.monthly_income / max(req.household_size, 1)
    
    if req.monthly_income > 3000:
        eligible = False
        gaps.append(f"Monthly income ₱{req.monthly_income:,.0f} exceeds ₱3,000 threshold")
        confidence -= 0.5
    else:
        trace.append(f"✓ Income ₱{req.monthly_income:,.0f} is within 4Ps threshold")

    if req.household_size < 2:
        eligible = False
        gaps.append("Household must have at least 2 members")
        confidence -= 0.3
    else:
        trace.append(f"✓ Household size of {req.household_size} qualifies")

    if income_per_capita > 1500:
        eligible = False
        gaps.append(f"Income per capita ₱{income_per_capita:,.0f} exceeds ₱1,500 limit")
        confidence -= 0.3

    return ProgramResult(
        program_id="4ps",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=max(0.0, min(1.0, confidence)),
        gaps=gaps,
        next_steps=config["next_steps"] if eligible else ["Consider applying once household income decreases or family size grows"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def check_philhealth_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("philhealth")
    gaps = []
    eligible = True
    confidence = 0.95

    if req.has_philhealth:
        return ProgramResult(
            program_id="philhealth",
            name=config["name"],
            agency=config["agency"],
            eligible=True,
            confidence=1.0,
            gaps=[],
            next_steps=["You are already a PhilHealth member — ensure contributions are up to date"],
            description=config["description"],
            benefits=config["benefits"],
            office=config["office"],
        )

    if req.employment_status == "employed":
        note = "Employer must register you — ask your HR department"
    elif req.employment_status in ["self_employed", "informal"]:
        note = "You can register as a self-paying member"
    else:
        note = "You may qualify as an indigent member (free) if income is below threshold"
        if req.monthly_income > 10000:
            eligible = False
            gaps.append("Income may be too high for indigent PhilHealth — you can still register as voluntary member")
            confidence = 0.7

    return ProgramResult(
        program_id="philhealth",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=confidence,
        gaps=gaps,
        next_steps=config["next_steps"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def check_tupad_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("tupad")
    gaps = []
    eligible = True
    confidence = 1.0

    if req.employment_status == "employed":
        eligible = False
        gaps.append("TUPAD is only for displaced, seasonal, or informal workers — regular employment disqualifies")
        confidence = 0.0

    if req.age < 18:
        eligible = False
        gaps.append("Minimum age for TUPAD is 18 years old")
        confidence -= 0.5

    if req.age > 59:
        eligible = False
        gaps.append("Maximum age for regular TUPAD is 59 (senior programs available through OSCA)")
        confidence -= 0.5

    if req.employment_status in ["unemployed", "informal", "self_employed"] and 18 <= req.age <= 59:
        confidence = 0.85

    return ProgramResult(
        program_id="tupad",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=max(0.0, confidence),
        gaps=gaps,
        next_steps=config["next_steps"] if eligible else ["Check DOLE Senior Worker programs if 60+"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def check_sss_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("sss")
    gaps = []
    eligible = True
    confidence = 0.9

    if req.has_sss:
        return ProgramResult(
            program_id="sss",
            name=config["name"],
            agency=config["agency"],
            eligible=True,
            confidence=1.0,
            gaps=[],
            next_steps=["You are already an SSS member — check your contribution history at my.sss.gov.ph"],
            description=config["description"],
            benefits=config["benefits"],
            office=config["office"],
        )

    if req.age < 18:
        eligible = False
        gaps.append("Minimum age for SSS membership is 18")
        confidence = 0.0
    elif req.age >= 60 and req.is_senior:
        gaps.append("As a senior, you may only claim benefits if you have prior contributions — check retirement eligibility")
        confidence = 0.6

    if req.employment_status == "unemployed" and not req.has_sss:
        gaps.append("Unemployed individuals can register as voluntary members but must have prior employment history for most benefits")
        confidence = 0.6

    return ProgramResult(
        program_id="sss",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=max(0.0, confidence),
        gaps=gaps,
        next_steps=config["next_steps"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def check_aics_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("aics")
    gaps = []
    eligible = True
    confidence = 0.9

    if req.monthly_income > 15000 and not req.in_crisis:
        eligible = False
        gaps.append("AICS prioritizes low-income or crisis-affected individuals — income above ₱15,000/month may require stronger crisis documentation")
        confidence = 0.4

    if req.in_crisis:
        confidence = 0.95
    elif req.monthly_income <= 8000:
        confidence = 0.85

    return ProgramResult(
        program_id="aics",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=max(0.0, min(1.0, confidence)),
        gaps=gaps,
        next_steps=config["next_steps"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def check_solo_parent_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("solo_parent")
    gaps = []
    eligible = req.is_solo_parent
    confidence = 0.95 if req.is_solo_parent else 0.0

    if not req.is_solo_parent:
        gaps.append("Solo Parent benefits require documented solo parenting status (widowed, separated, unmarried, or sole caregiver)")
    elif req.monthly_income > 25000:
        gaps.append("You qualify for Solo Parent ID but may not receive income-based priority in other programs")
        confidence = 0.75

    return ProgramResult(
        program_id="solo_parent",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=confidence,
        gaps=gaps,
        next_steps=config["next_steps"] if eligible else ["If you are a sole caregiver, consult MSWDO about qualifying as a solo parent"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def check_osca_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("osca")
    gaps = []
    is_senior = req.is_senior or req.age >= 60
    eligible = is_senior
    confidence = 1.0 if is_senior else 0.0

    if not is_senior:
        gaps.append("Senior Citizen benefits require age 60 or above")
    elif req.monthly_income < 4000:
        gaps.append("You may also qualify for DSWD Social Pension (₱500/month) — apply separately with indigency certificate")
        confidence = 0.95

    return ProgramResult(
        program_id="osca",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=confidence,
        gaps=gaps,
        next_steps=config["next_steps"] if eligible else ["Check back when you turn 60 for OSCA registration"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def check_pwd_benefits_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("pwd_benefits")
    gaps = []
    eligible = req.is_pwd
    confidence = 1.0 if req.is_pwd else 0.0

    if not req.is_pwd:
        gaps.append("PWD benefits require a documented disability confirmed by a licensed physician")

    return ProgramResult(
        program_id="pwd_benefits",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=confidence,
        gaps=gaps,
        next_steps=config["next_steps"] if eligible else ["If you have a disability, get a medical certificate and apply at MSWDO/PDAO"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def check_unifast_tes_eligibility(req: EligibilityRequest) -> ProgramResult:
    config = load_program_config("unifast_tes")
    gaps = []
    annual_income = req.monthly_income * 12
    eligible = req.has_college_student and annual_income <= 400000
    confidence = 0.9

    if not req.has_college_student:
        eligible = False
        gaps.append("TES requires at least one household member enrolled in college")
        confidence = 0.0
    elif annual_income > 400000:
        eligible = False
        gaps.append(f"Household annual income ₱{annual_income:,.0f} exceeds TES threshold of ₱400,000")
        confidence = 0.3
    elif req.monthly_income <= 10000:
        confidence = 0.95

    return ProgramResult(
        program_id="unifast_tes",
        name=config["name"],
        agency=config["agency"],
        eligible=eligible,
        confidence=max(0.0, confidence),
        gaps=gaps,
        next_steps=config["next_steps"] if eligible else ["Check CHED scholarship programs when a household member enters college"],
        description=config["description"],
        benefits=config["benefits"],
        office=config["office"],
    )


def run_all_rules(req: EligibilityRequest) -> List[ProgramResult]:
    results = []
    results.append(check_4ps_eligibility(req))
    results.append(check_philhealth_eligibility(req))
    results.append(check_tupad_eligibility(req))
    results.append(check_sss_eligibility(req))
    results.append(check_aics_eligibility(req))
    results.append(check_solo_parent_eligibility(req))
    results.append(check_osca_eligibility(req))
    results.append(check_pwd_benefits_eligibility(req))
    results.append(check_unifast_tes_eligibility(req))
    return results
