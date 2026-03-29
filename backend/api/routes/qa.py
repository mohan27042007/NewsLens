from fastapi import APIRouter

from models.schemas import QARequest, QAResponse
from services.article_store import get_articles, format_articles_for_prompt
from services.gemini_service import answer_question, FALLBACK_QA

router = APIRouter(prefix="/api/qa", tags=["Q&A"])


@router.post("/ask", response_model=QAResponse)
async def ask_question(body: QARequest):
    articles = get_articles(body.topic_id)
    articles_text = format_articles_for_prompt(articles)

    result = await answer_question(
        articles=articles_text,
        user_query=body.user_query,
        chat_history=[msg.model_dump() for msg in body.chat_history],
    )

    return QAResponse(**result)
