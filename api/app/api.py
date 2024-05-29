from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db import login, create_user, change_password, \
    add_presenation, get_transcription, add_transcription, \
    join_lecture, create_lecture, get_lectures, get_lecture_metadata
from pydantic import BaseModel
import json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


class UserLecturesRequest(BaseModel):
    user_id: int

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


class Transcription(BaseModel):
    text: str


@app.get("/transcription/{id}")
def transcription(id: int, last: bool = False):
    return get_transcription(id, last)


@app.post("/transcription/{id}")
def add_transcription_req(id: int, data: Transcription):
    return add_transcription(id, data.text)


class AskQuestionRequest(BaseModel):
    question: str


questions = {}


@app.post("/questions/{id}")
async def add_question(id: int, request: AskQuestionRequest):
    if id not in questions:
        questions[str(id)] = []
    questions[str(id)].append(request.question)


@app.delete("/question/{id}")
async def del_question(id: int, request: AskQuestionRequest):
    questions[str(id)].remove(request.question)


@app.get("/questions/{id}")  # TODO implement this as Server Sent Event (SSE)
async def get_question(id: int):
    questions_list = list(questions[str(id)])
    # questions_json = json.dumps(questions_list)
    return questions_list


class LoginRequest(BaseModel):
    mail: str
    pass_hash: str


@app.post("/login")
def authenticate_user_req(login_request: LoginRequest):
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
def register_user_req(register_request: RegisterRequest):
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
def change_pass_req(password_request: ChangePasswordRequest):
    change_password(password_request.user_id,
                    password_request.password)


class JoinLectureRequest(BaseModel):
    user_id: int = None
    lecture_code: str
    user_type: str = "S"


@app.post("/join_lecture")
def join_lecture_req(join_lecture_request: JoinLectureRequest):
    lecture_id, is_succesful = join_lecture(join_lecture_request.lecture_code,
                                            join_lecture_request.user_id,
                                            join_lecture_request.user_type)
    if is_succesful == 1:
        raise HTTPException(status_code=401, detail="User already joined the course.")
    elif is_succesful == -1:
        raise HTTPException(status_code=401, detail="Lecture with given code doesn't exist.")
    return {"lecture_id": lecture_id}


class CreateLectureRequest(BaseModel):
    title: str
    lecturer_id: int = None


@app.post("/create_lecture")
def create_lecture_req(create_lecture_request: CreateLectureRequest):
    lecturer_code, lecture_id = create_lecture(create_lecture_request.title,
                                               create_lecture_request.lecturer_id)
    return {"lecturer_code": lecturer_code, "lecture_id": lecture_id}


class PresentationRequest(BaseModel):
    lecture_id: int
    link: str


@app.post("/presentation")
def add_presentation_req(presentation_request: PresentationRequest):
    add_presenation(presentation_request.lecture_id,
                    presentation_request.link)


@app.get("/lecture/{id}")
def get_lecture_data(id: int):
    return get_lecture_metadata(id)
