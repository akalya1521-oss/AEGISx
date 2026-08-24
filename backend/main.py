from fastapi import FastAPI
from routes.analysis import router as analysis_router
from routes.investigations import router as investigations_router
app = FastAPI(
    title="AEGISx API",
    description="AI-powered Cybercrime Network Analysis System",
    version="1.0.0"
)
app.include_router(
    investigations_router,
    prefix="/api"
)

print("ROUTER LOADED:", analysis_router.routes)

app.include_router(
    analysis_router,
    prefix="/api",
    tags=["Analysis"]
)

print("APP ROUTES:", app.routes)


@app.get("/")
def root():
    return {
        "message": "AEGISx Backend is running 🚀"
    }