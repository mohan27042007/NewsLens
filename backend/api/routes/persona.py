from fastapi import APIRouter

from models.schemas import (
    PersonaToggleRequest,
    PersonaToggleResponse,
    BriefingCard,
    CardType,
    Citation,
)

router = APIRouter(prefix="/api/persona", tags=["Persona"])


def _mock_investor_card(watchlist: list[str]) -> BriefingCard:
    stocks = ", ".join(watchlist) if watchlist else "your portfolio"
    return BriefingCard(
        card_index=6,
        card_type=CardType.WATCHLIST_IMPACT,
        title="Direct Impact on Your Watchlist",
        content=(
            f"HDFC Bank and ICICI Bank are likely to benefit from stable rates "
            f"as net interest margins remain intact. TCS may see margin pressure "
            f"from rupee stability. Your watchlist ({stocks}) shows mixed signals — "
            f"banking stocks are bullish while IT faces headwinds."
        ),
        citations=[
            Citation(
                article_id="et-10610",
                exact_quote="Banking sector NII is expected to grow 12-14% this quarter on the back of stable rates.",
            ),
            Citation(
                article_id="et-10612",
                exact_quote="IT exporters face margin challenges as the rupee holds steady near 83.2 against the dollar.",
            ),
        ],
    )


def _mock_student_card() -> BriefingCard:
    return BriefingCard(
        card_index=6,
        card_type=CardType.WHAT_HAPPENED,
        title="What This Means for You as a Student",
        content=(
            "Stable interest rates mean education loan EMIs remain predictable. "
            "If you're planning a loan for higher studies, now is a good time to lock in. "
            "The RBI's cautious stance also signals economic stability, which is positive "
            "for campus placements in finance and banking sectors."
        ),
        citations=[
            Citation(
                article_id="et-10615",
                exact_quote="Education loan rates are expected to remain stable at 8.5-9.5% for the foreseeable future.",
            ),
        ],
    )


@router.post("/toggle", response_model=PersonaToggleResponse)
async def toggle_persona(body: PersonaToggleRequest):
    if body.target_persona == "investor":
        card = _mock_investor_card(body.user_watchlist)
    else:
        card = _mock_student_card()

    return PersonaToggleResponse(updated_cards=[card])
