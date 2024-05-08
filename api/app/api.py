from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from .db import get_courses
from dataclasses import dataclass
from pydantic import BaseModel


@dataclass
class Course:
    course_id: int
    name: str
    code: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

l = []

# @app.get("/courses")
# async def root():
#     return [Course(*course) for course in get_courses()]


class Transcription(BaseModel):
    text: str


@app.post("/")
def main(data: Transcription):
    l.append(data)
    return data

@app.get("/")
async def root():
    if len(l) == 0:
        return None
    return l[-1]


# Docker
# pip install fastapi==0.78.0 uvicorn==0.17.6
# uvicorn main:app --reload
