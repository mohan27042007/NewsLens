import asyncio
import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.article_store import (
    get_articles,
    format_articles_for_prompt,
    get_topic_title,
    get_article_count,
)
from services.gemini_service import (
    FALLBACK_CARDS,
    FALLBACK_DISAGREEMENTS,
    synthesize_briefing,
    find_disagreements,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["WebSocket"])

MOCK_TIMELINE_EVENTS = {
    "rbi-rates-2026": [
        {"date": "2026-03-01", "headline": "RBI signals cautious stance ahead of policy review", "sentiment_score": 0.2, "primary_article_id": "et-10590"},
        {"date": "2026-03-08", "headline": "Economists predict rate hold amid global uncertainty", "sentiment_score": 0.5, "primary_article_id": "et-10593"},
        {"date": "2026-03-15", "headline": "Food inflation rises to 7.2%, complicating RBI calculus", "sentiment_score": -0.4, "primary_article_id": "et-10597"},
        {"date": "2026-03-22", "headline": "MPC begins deliberations; markets expect status quo", "sentiment_score": 0.1, "primary_article_id": "et-10598"},
        {"date": "2026-03-27", "headline": "RBI holds repo rate at 6.5%, signals inflation vigilance", "sentiment_score": 0.8, "primary_article_id": "et-10599"},
    ],
    "budget-2026": [
        {"date": "2026-01-15", "headline": "Pre-budget expectations: infrastructure and tax relief in focus", "sentiment_score": 0.4, "primary_article_id": "et-20098"},
        {"date": "2026-01-28", "headline": "FM reviews fiscal position ahead of budget presentation", "sentiment_score": 0.1, "primary_article_id": "et-20099"},
        {"date": "2026-02-01", "headline": "FM Sitharaman hikes capex by 15% to Rs 11.1 lakh crore", "sentiment_score": 0.8, "primary_article_id": "et-20101"},
        {"date": "2026-02-01", "headline": "Middle class gets income tax relief with revised slabs", "sentiment_score": 0.7, "primary_article_id": "et-20102"},
        {"date": "2026-02-02", "headline": "Budget 2026 sectoral impact: infra surges, FMCG takes a hit", "sentiment_score": 0.3, "primary_article_id": "et-20103"},
    ],
    "reliance-jio-5g": [
        {"date": "2026-01-05", "headline": "Jio completes 5G spectrum rollout in 800 cities", "sentiment_score": 0.6, "primary_article_id": "et-30199"},
        {"date": "2026-01-12", "headline": "Analysts upgrade Jio target price on 5G momentum", "sentiment_score": 0.7, "primary_article_id": "et-30200"},
        {"date": "2026-01-20", "headline": "Jio launches 5G in 1,000 cities, targets 500M subscribers", "sentiment_score": 0.9, "primary_article_id": "et-30201"},
        {"date": "2026-01-24", "headline": "Jio ARPU rises to Rs 203 in Q3, narrowing gap with Airtel", "sentiment_score": 0.6, "primary_article_id": "et-30202"},
        {"date": "2026-02-05", "headline": "Jio's 5G push threatens Airtel in tier-2 cities", "sentiment_score": 0.4, "primary_article_id": "et-30203"},
    ],
}


def _ws_message(event: str, payload: dict) -> str:
    return json.dumps({"event": event, "payload": payload})


@router.websocket("/ws/briefing")
async def briefing_stream(websocket: WebSocket):
    await websocket.accept()

    try:
        # Wait for first message with topic
        first_msg = await websocket.receive_text()
        data = json.loads(first_msg)
        topic_id = data.get("topic", "rbi-rates-2026")

        # Look up articles
        articles = get_articles(topic_id)
        articles_text = format_articles_for_prompt(articles)
        display_title = get_topic_title(topic_id)
        article_count = get_article_count(topic_id)

        # 1. briefing_start
        await websocket.send_text(
            _ws_message("briefing_start", {
                "topic_id": topic_id,
                "display_title": display_title,
                "total_articles_found": article_count,
            })
        )
        await asyncio.sleep(1)

        # 2. timeline_ready
        timeline = MOCK_TIMELINE_EVENTS.get(topic_id, MOCK_TIMELINE_EVENTS["rbi-rates-2026"])
        await websocket.send_text(
            _ws_message("timeline_ready", {
                "topic_id": topic_id,
                "events": timeline,
            })
        )
        await asyncio.sleep(1)

        # 3-7. card_ready x5 — FROM GEMINI
        cards = await synthesize_briefing(articles_text)
        for card in cards:
            await websocket.send_text(
                _ws_message("card_ready", card)
            )
            await asyncio.sleep(1)

        # 8. disagreements_ready — FROM GEMINI
        disagreements = await find_disagreements(articles_text)
        await websocket.send_text(
            _ws_message("disagreements_ready", {
                "critical_takes": disagreements,
            })
        )

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            for card in FALLBACK_CARDS:
                await websocket.send_text(_ws_message("card_ready", card))
                await asyncio.sleep(0.5)
            await websocket.send_text(
                _ws_message("disagreements_ready", {
                    "critical_takes": FALLBACK_DISAGREEMENTS,
                })
            )
        except Exception:
            pass
