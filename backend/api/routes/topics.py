from fastapi import APIRouter, Query

from models.schemas import TrendingResponse, SearchResponse, Topic

router = APIRouter(prefix="/api", tags=["Topics"])

MOCK_TOPICS = [
    Topic(
        topic_id="rbi-rates-2026",
        display_title="RBI Holds Repo Rate at 6.5%",
        article_count=3,
        last_updated="2026-03-27T14:30:00Z",
    ),
    Topic(
        topic_id="budget-2026",
        display_title="Union Budget 2026: Key Highlights",
        article_count=3,
        last_updated="2026-02-02T09:00:00Z",
    ),
    Topic(
        topic_id="reliance-jio-5g",
        display_title="Reliance Jio 5G Launches Nationwide",
        article_count=3,
        last_updated="2026-02-05T11:15:00Z",
    ),
]


@router.get("/trending", response_model=TrendingResponse)
async def get_trending():
    return TrendingResponse(topics=MOCK_TOPICS)


@router.get("/search", response_model=SearchResponse)
async def search_topics(q: str = Query(default="")):
    return SearchResponse(topics=MOCK_TOPICS)
