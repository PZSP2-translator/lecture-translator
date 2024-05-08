from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from .db import get_courses
from dataclasses import dataclass
from pydantic import BaseModel
import random
import datetime


@dataclass
class Course(BaseModel):
    course_id: int
    name: str
    code: int
    date: datetime.datetime

class JoinCourseRequest(BaseModel):
    code: str


app = FastAPI()

# Initialize an empty list to store courses
courses = []

@app.post("/createCourse")
async def create_course(course: Course):
    # TODO add the course to your database
    course.course_id = len(courses) + 1
    existing_codes = {course['code'] for course in courses}
    code = random.randint(100000, 999999)
    while code in existing_codes:
        code = random.randint(100000, 999999)
    course.code = code
    course.date = datetime.datetime.now().strftime('%d.%m.%Y')
    courses.append(course.dict())
    return course.code
    # return courses

@app.post("/joinCourse")
async def get_courses(request: JoinCourseRequest):
    # Return the course with the given code
    # if len(request.code) == 7:
    for course in courses:
        if course["code"] == int(request.code):
            return course
            # If no course was found, return an empty dictionary
    return {}
    return courses #TODO DELETE ME! # Return the list of courses



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081","http://localhost:3000"],
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
