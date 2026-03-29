from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import qa, persona, topics, websocket

app = FastAPI(
    title="NewsLens API",
    description="AI-Native News Intelligence Platform — Backend",
    version="0.1.0",
)

# ── CORS ─────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST routers ─────────────────────────────
app.include_router(qa.router)
app.include_router(persona.router)
app.include_router(topics.router)

# ── WebSocket router ─────────────────────────
app.include_router(websocket.router)


@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "NewsLens API"}
