from fastapi import FastAPI
from pydantic import BaseModel
from foxsd_ai.foxsd_model import FoxSDReasoner

app = FastAPI(title="FoxSD AI API", version="1.0.0")
reasoner = FoxSDReasoner()


class AskRequest(BaseModel):
    text: str


@app.get("/")
async def root():
    return {
        "brand": "FoxSD",
        "alias": "Fox",
        "email": "foxsd520@gmail.com",
        "service": "FoxSD AI",
        "status": "online"
    }


@app.post("/ask")
async def ask_ai(payload: AskRequest):
    response = reasoner.build_answer(payload.text)
    return response
