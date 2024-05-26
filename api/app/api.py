from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db import login, get_lectures
from dataclasses import dataclass
from pydantic import BaseModel
import random
import datetime
import json

@dataclass
class Course(BaseModel):
    course_id: int
    name: str
    code: int
    date: datetime.datetime

class JoinCourseRequest(BaseModel):
    code: str

class UserLecturesRequest(BaseModel):
    user_id: int


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


@app.post("/userLectures")
async def user_lectures(request: UserLecturesRequest):
    try:
        lectures = get_lectures(request.user_id)
        if lectures:
            return [
                {"lecture_id": lec[0], "title": lec[1], "date": lec[2], "user_type": lec[3]} 
                for lec in lectures
            ]
        else:
            return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




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
        return {"text": ""}
    return l[-1]

class AskQuestionRequest(BaseModel):
    question: str

questions = set()

@app.post("/questions") # TODO make it so it works with multiple lectures at once
async def add_question(request: AskQuestionRequest):
    questions.add(request.question)
    print(questions)
    questions.remove("ajaj")
    print(questions)

@app.delete("/question")
async def del_question(request: AskQuestionRequest):
    questions.remove(request.question)

@app.get("/questions") # TODO implement this as Server Sent Event (SSE)
async def get_question():
    questions_list = list(questions)
    questions_json = json.dumps(questions_list)
    print(questions_json)
    return questions_list

# Docker
# pip install fastapi==0.78.0 uvicorn==0.17.6
# uvicorn main:app --reload


class LoginRequest(BaseModel):
    mail: str
    pass_hash: str


@app.post("/login")
def authenticate_user(login_request: LoginRequest):
    user_id = login(login_request.mail, login_request.pass_hash)
    if user_id != 0:
        return {"user_id": user_id}
    else:
        # Obsłużyć po stronie przeglądarki
        raise HTTPException(status_code=401, detail="Invalid mail or password")
