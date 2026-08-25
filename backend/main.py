from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analysis import router as analysis_router

app = FastAPI(
    title="AEGISx API",
    description="AI-powered Cybercrime Network Analysis API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router)


@app.get("/")
def root():
    return {
        "message": "AEGISx Backend is running",
        "status": "online"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }