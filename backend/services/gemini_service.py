import json
import logging
from typing import Any

import google.generativeai as genai

from core.config import settings

logger = logging.getLogger(__name__)

# ── SDK Init ─────────────────────────────────
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL_ID = "gemini-2.5-flash"

# ── Fallback Mock Data ──────────────────────

FALLBACK_CARDS = [
    {
        "card_index": 1,
        "card_type": "what_happened",
        "title": "What Happened",
        "content": "The RBI held the repo rate at 6.5% for the eighth consecutive meeting, with a 5-1 vote. Governor Das cited food inflation and global trade risks as the primary concerns keeping rates elevated.",
        "citations": [
            {"article_id": "et-10599", "exact_quote": "The RBI's Monetary Policy Committee voted 5-1 to keep the repo rate unchanged at 6.5% for the eighth consecutive meeting."}
        ],
    },
    {
        "card_index": 2,
        "card_type": "why_it_matters",
        "title": "Why It Matters",
        "content": "This hold signals the RBI is prioritizing inflation control over growth stimulus. For borrowers, EMIs remain elevated. For the economy, it shows confidence that growth can sustain itself without additional monetary support.",
        "citations": [
            {"article_id": "et-10597", "exact_quote": "Deputy Governor Michael Patra warned that 'premature monetary easing could destabilize inflation expectations.'"}
        ],
    },
    {
        "card_index": 3,
        "card_type": "key_players",
        "title": "Key Players",
        "content": "Governor Shaktikanta Das leads the hold decision. Deputy Governor Michael Patra supports the inflation-focused stance. External MPC member Ashima Goyal dissented in favor of a 25 bps cut to boost employment.",
        "citations": [
            {"article_id": "et-10599", "exact_quote": "External MPC member Ashima Goyal dissented, arguing for a 25 basis point cut to support employment growth."}
        ],
    },
    {
        "card_index": 4,
        "card_type": "market_impact",
        "title": "Market Impact",
        "content": "The Nifty 50 rose 0.6% on the decision. Banking stocks gained 1.2% as stable rates protect net interest margins. The 10-year bond yield fell 4 bps to 7.08%, signaling market confidence in the RBI's stance.",
        "citations": [
            {"article_id": "et-10599", "exact_quote": "Markets reacted positively — the Nifty 50 rose 0.6%, banking stocks gained 1.2%, and the 10-year bond yield fell 4 basis points to 7.08%."}
        ],
    },
    {
        "card_index": 5,
        "card_type": "what_to_watch",
        "title": "What to Watch",
        "content": "Watch the June MPC meeting — if monsoon forecasts improve and food inflation drops below 5%, a cut becomes likely. The US Fed's June decision will also influence RBI calculus. Bond markets will price in expectations starting May.",
        "citations": [
            {"article_id": "et-10599", "exact_quote": "The committee maintained its 'withdrawal of accommodation' stance, signaling no imminent easing."}
        ],
    },
]

FALLBACK_DISAGREEMENTS = [
    {
        "summary_claim": "Rate hold is appropriate given inflation levels",
        "majority_view_article_id": "et-10599",
        "contrarian_article_id": "et-10599",
        "contrarian_quote": "Ashima Goyal dissented, arguing for a 25 basis point cut to support employment growth.",
    },
    {
        "summary_claim": "Stable rates protect banking sector profitability",
        "majority_view_article_id": "et-10599",
        "contrarian_article_id": "et-10597",
        "contrarian_quote": "Nomura and Goldman Sachs pushed their rate cut forecasts to Q3 2026, suggesting the hold may not last as long as markets expect.",
    },
]

FALLBACK_QA = {
    "answer": "Based on the available articles, the key development is the RBI's decision to hold rates steady. This maintains the current borrowing cost environment and signals continued focus on inflation management.",
    "citations": [
        {"article_id": "et-10599", "exact_quote": "The RBI's Monetary Policy Committee voted 5-1 to keep the repo rate unchanged at 6.5% for the eighth consecutive meeting."}
    ],
    "suggested_follow_ups": [
        "How does this rate decision affect home loan EMIs?",
        "What are analysts predicting for the next RBI meeting?",
        "How did the stock market react to the rate hold?",
    ],
}

# ── Generation Config (JSON mode) ───────────

JSON_CONFIG = {"response_mime_type": "application/json"}


# ── Service Functions ────────────────────────

async def synthesize_briefing(articles: str) -> list[dict[str, Any]]:
    """Use Gemini to synthesize 5 briefing cards from articles."""
    try:
        model = genai.GenerativeModel(
            MODEL_ID,
            generation_config=JSON_CONFIG,
        )

        prompt = f"""You are an elite financial intelligence synthesizer. 
Given the following news articles, return a JSON array of exactly 5 objects representing briefing cards.

Each card must have these fields:
- card_index (integer, 1-5)
- card_type (one of: what_happened, why_it_matters, key_players, market_impact, what_to_watch)
- title (string)
- content (string, exactly 3 sentences)
- citations (array of objects with article_id and exact_quote fields, use exact quotes from the provided articles)

Articles:
{articles}

Return ONLY the JSON array. No markdown, no explanation."""

        response = model.generate_content(prompt)
        cards = json.loads(response.text)

        if isinstance(cards, list) and len(cards) == 5:
            return cards
        else:
            logger.warning("Gemini returned unexpected card format, using fallback")
            return FALLBACK_CARDS

    except Exception as e:
        logger.error(f"Gemini briefing synthesis failed: {e}")
        return FALLBACK_CARDS


async def find_disagreements(articles: str) -> list[dict[str, Any]]:
    """Use Gemini to find contrarian perspectives in articles."""
    try:
        model = genai.GenerativeModel(
            MODEL_ID,
            generation_config=JSON_CONFIG,
        )

        prompt = f"""You are the Contrarian Radar agent. 
Hunt for minority perspectives, conflicting data, or disagreements in the provided articles.

Return a JSON object with a single field "critical_takes" containing an array of objects.
Each object must have:
- summary_claim (string, the majority view)
- majority_view_article_id (string)
- contrarian_article_id (string)
- contrarian_quote (string, exact quote from the article)

Articles:
{articles}

Return ONLY the JSON object. No markdown, no explanation."""

        response = model.generate_content(prompt)
        data = json.loads(response.text)

        if isinstance(data, dict) and "critical_takes" in data:
            return data["critical_takes"]
        else:
            logger.warning("Gemini returned unexpected disagreement format, using fallback")
            return FALLBACK_DISAGREEMENTS

    except Exception as e:
        logger.error(f"Gemini disagreement detection failed: {e}")
        return FALLBACK_DISAGREEMENTS


async def answer_question(
    articles: str,
    user_query: str,
    chat_history: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    """Use Gemini to answer a question grounded in the articles, with conversation memory."""
    try:
        model = genai.GenerativeModel(
            MODEL_ID,
            generation_config=JSON_CONFIG,
        )

        # Build conversation history section
        history_section = ""
        if chat_history:
            history_lines = []
            for msg in chat_history:
                role = "User" if msg["role"] == "user" else "Assistant"
                history_lines.append(f"{role}: {msg['content']}")
            history_section = (
                "\n\nPrevious conversation:\n"
                + "\n".join(history_lines)
                + "\n\nNow answer this new question in context of the conversation above:\n"
            )

        prompt = f"""You are a grounded Q&A assistant for a news intelligence platform. 
Answer the user's question based ONLY on the provided articles. 
Every factual claim must be backed by a citation from the articles.{history_section}

Articles:
{articles}

Question: {user_query}

Return a JSON object with these fields:
- answer (string, 3-5 sentences, directly answering the question using article evidence)
- citations (array of objects with article_id and exact_quote, at least 1 citation required)
- suggested_follow_ups (array of exactly 3 strings, relevant follow-up questions)

Return ONLY the JSON object. No markdown, no explanation."""

        response = model.generate_content(prompt)
        data = json.loads(response.text)

        if isinstance(data, dict) and "answer" in data and "citations" in data:
            if "suggested_follow_ups" not in data:
                data["suggested_follow_ups"] = FALLBACK_QA["suggested_follow_ups"]
            return data
        else:
            logger.warning("Gemini returned unexpected Q&A format, using fallback")
            return FALLBACK_QA

    except Exception as e:
        logger.error(f"Gemini Q&A failed: {e}")
        return FALLBACK_QA
