from typing import List
from models.schemas import EligibilityRequest, ProgramResult


def analyze_gaps(req: EligibilityRequest, results: List[ProgramResult]) -> List[str]:
    """
    Identifies systemic gaps in coverage — programs the person isn't enrolled in
    but should consider, and structural barriers.
    """
    gaps = []
    eligible_programs = [r for r in results if r.eligible]
    ineligible_programs = [r for r in results if not r.eligible]

    # No programs found eligible
    if not eligible_programs:
        gaps.append("No standard government programs matched your current profile. NGO support may be available.")

    # Not covered by health insurance
    philhealth_result = next((r for r in results if r.program_id == "philhealth"), None)
    if philhealth_result and not philhealth_result.eligible and not req.has_philhealth:
        gaps.append("You currently have no health insurance coverage — a medical emergency could be financially devastating.")

    # Senior without programs
    osca_result = next((r for r in results if r.program_id == "osca"), None)
    if req.is_senior and req.age >= 60 and osca_result and not osca_result.eligible:
        gaps.append("As a senior citizen, register at OSCA for your Senior Citizen ID and 20% discounts.")

    # PWD benefits
    if req.is_pwd:
        pwd_result = next((r for r in results if r.program_id == "pwd_benefits"), None)
        if pwd_result and pwd_result.eligible:
            gaps.append("Apply for your PWD ID to unlock 20% discounts on medicines, medical services, and basic goods.")
        else:
            gaps.append("As a PWD, visit MSWDO or PDAO to apply for a PWD ID and related benefits.")

    # Solo parent
    if req.is_solo_parent:
        solo = next((r for r in results if r.program_id == "solo_parent"), None)
        if solo and solo.eligible:
            gaps.append("Apply for your Solo Parent ID at MSWDO for priority in 4Ps, housing, and educational programs.")

    # College student household
    if req.has_college_student:
        tes = next((r for r in results if r.program_id == "unifast_tes"), None)
        if tes and not tes.eligible:
            gaps.append("Ask your college Financial Aid Office about CHED scholarships and TES alternatives.")

    # Crisis — AICS
    if req.in_crisis:
        gaps.append("For immediate crisis aid, visit MSWDO with documents proving your emergency (medical bill, death certificate, etc.).")

    # Household too large and poor but no 4Ps
    four_ps = next((r for r in results if r.program_id == "4ps"), None)
    if four_ps and not four_ps.eligible and req.household_size >= 5 and req.monthly_income < 8000:
        gaps.append("With a large household and low income, you may still want to ask your MSWDO to re-assess using the Listahanan database.")

    # Informal worker with no SSS
    sss_result = next((r for r in results if r.program_id == "sss"), None)
    if req.employment_status == "informal" and sss_result and not req.has_sss:
        gaps.append("As an informal worker, voluntary SSS membership protects you against sickness, maternity, and disability — consider enrolling even at low contribution rates.")

    return gaps


def build_reasoning_trace(req: EligibilityRequest, results: List[ProgramResult]) -> List[str]:
    """
    Builds a human-readable audit trail of how eligibility was determined.
    """
    trace = []
    trace.append(f"Profile: Age {req.age}, ₱{req.monthly_income:,.0f}/month, {req.household_size}-person household")
    trace.append(f"Employment: {req.employment_status.replace('_', ' ').title()}")
    
    income_per_capita = req.monthly_income / max(req.household_size, 1)
    trace.append(f"Income per capita: ₱{income_per_capita:,.0f}/month")

    if req.is_pwd:
        trace.append("PWD status: Yes")
    if req.is_senior:
        trace.append("Senior citizen: Yes (60+)")
    if req.is_solo_parent:
        trace.append("Solo parent: Yes")
    if req.has_children_under_18:
        trace.append("Has children under 18: Yes")
    if req.has_college_student:
        trace.append("Has college student in household: Yes")
    if req.in_crisis:
        trace.append("Currently in crisis: Yes")
    if req.has_philhealth:
        trace.append("Existing PhilHealth: Yes")
    if req.has_sss:
        trace.append("Existing SSS: Yes")

    trace.append("---")

    for result in results:
        status = "✅ ELIGIBLE" if result.eligible else "❌ NOT ELIGIBLE"
        trace.append(f"{result.name}: {status} (confidence: {result.confidence:.0%})")
        for gap in result.gaps:
            trace.append(f"  • {gap}")

    return trace
