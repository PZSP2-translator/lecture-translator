from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db import login, create_user, change_password
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

###############################################


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


class RegisterRequest(LoginRequest):
    first_name: str
    last_name: str


@app.post("/register")
def register_user(register_request: RegisterRequest):
    is_succesful = create_user(register_request.first_name,
                               register_request.last_name,
                               register_request.mail,
                               register_request.pass_hash)
    if is_succesful == 1:
        raise HTTPException(status_code=401, detail="Account with that mail already exist.")


class ChangePasswordRequest(BaseModel):
    user_id: int
    password: str


@app.post("/change_pass")
def change_pass(password_request: ChangePasswordRequest):
    change_password(password_request.user_id,
                    password_request.password)
