from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────────────
# Enums
# ──────────────────────────────────────────────

class CardType(str, Enum):
    WHAT_HAPPENED = "what_happened"
    WHY_IT_MATTERS = "why_it_matters"
    KEY_PLAYERS = "key_players"
    MARKET_IMPACT = "market_impact"
    WHAT_TO_WATCH = "what_to_watch"
    WATCHLIST_IMPACT = "watchlist_impact"


class Persona(str, Enum):
    INVESTOR = "investor"
    STUDENT = "student"
    GENERAL = "general"


class WSEvent(str, Enum):
    BRIEFING_START = "briefing_start"
    TIMELINE_READY = "timeline_ready"
    CARD_READY = "card_ready"
    DISAGREEMENTS_READY = "disagreements_ready"


# ──────────────────────────────────────────────
# Shared sub-models
# ──────────────────────────────────────────────

class Citation(BaseModel):
    article_id: str
    exact_quote: str


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class TimelineEvent(BaseModel):
    date: str
    headline: str
    sentiment_score: float = Field(ge=-1.0, le=1.0)
    primary_article_id: str


class BriefingCard(BaseModel):
    card_index: int
    card_type: CardType
    title: str
    content: str
    citations: List[Citation] = []


class CriticalTake(BaseModel):
    summary_claim: str
    majority_view_article_id: str
    contrarian_article_id: str
    contrarian_quote: str


class Topic(BaseModel):
    topic_id: str
    display_title: str
    article_count: int
    last_updated: str


# ──────────────────────────────────────────────
# REST API — Q&A
# ──────────────────────────────────────────────

class QARequest(BaseModel):
    topic_id: str
    user_query: str
    chat_history: List[ChatMessage] = []


class QAResponse(BaseModel):
    answer: str
    citations: List[Citation]
    suggested_follow_ups: List[str] = Field(min_length=3, max_length=3)


# ──────────────────────────────────────────────
# REST API — Persona Toggle
# ──────────────────────────────────────────────

class PersonaToggleRequest(BaseModel):
    topic_id: str
    target_persona: Persona
    user_watchlist: List[str] = []


class PersonaToggleResponse(BaseModel):
    updated_cards: List[BriefingCard]


# ──────────────────────────────────────────────
# REST API — Trending / Search
# ──────────────────────────────────────────────

class TrendingResponse(BaseModel):
    topics: List[Topic]


class SearchResponse(BaseModel):
    topics: List[Topic]


# ──────────────────────────────────────────────
# WebSocket payloads
# ──────────────────────────────────────────────

class BriefingStartPayload(BaseModel):
    topic_id: str
    display_title: str
    total_articles_found: int


class TimelineReadyPayload(BaseModel):
    topic_id: str
    events: List[TimelineEvent]


class CardReadyPayload(BaseModel):
    card_index: int
    card_type: CardType
    title: str
    content: str
    citations: List[Citation] = []


class DisagreementsReadyPayload(BaseModel):
    critical_takes: List[CriticalTake]


class WSMessage(BaseModel):
    event: WSEvent
    payload: dict
