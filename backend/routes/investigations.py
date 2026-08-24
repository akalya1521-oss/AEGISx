from fastapi import APIRouter


router = APIRouter(
    prefix="/investigations",
    tags=["Investigations"]
)
# Temporary investigation storage
investigations = {}


@router.get("/")
def investigations_home():
    return {
        "message": "AEGISx Investigations API is running"
    }
@router.get("/{investigation_id}")
def get_investigation(investigation_id: str):

    if investigation_id not in investigations:
        return {
            "investigation_id": investigation_id,
            "status": "investigation_not_found"
        }

    return investigations[investigation_id]