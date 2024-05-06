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
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# @app.get("/courses")
# async def root():
#     return [Course(*course) for course in get_courses()]


class Transcription(BaseModel):
    text: str


@app.post("/")
def main(data: Transcription):
    return data


# Docker
# pip install fastapi==0.78.0 uvicorn==0.17.6
# uvicorn main:app --reload
