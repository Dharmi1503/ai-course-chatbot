from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from rag import get_answer

app = FastAPI()

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    question: str
    course_id: str
    session_id: str

# Response model
class ChatResponse(BaseModel):
    answer: str

@app.get("/")
def root():
    return {"status": "AI Course Chatbot is running!"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    answer = get_answer(
        question=request.question,
        course_id=request.course_id,
        session_id=request.session_id
    )
    return ChatResponse(answer=answer)