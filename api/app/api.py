from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .db import (
    login,
    create_user,
    change_password,
    add_presenation,
    get_transcription,
    add_transcription,
    join_lecture,
    create_lecture,
    get_lectures,
    get_lecture_metadata,
    add_note,
    get_note,
)
from pydantic import BaseModel
import json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


class UserLecturesRequest(BaseModel):
    user_id: int


@app.post("/userLectures")
async def user_lectures(request: UserLecturesRequest):
    """
    Returns a list of lectures for given user.

    Parameters:
    - request (UserLecturesRequest): model containing the user ID.

    Returns:
    - List[Dict]: A list of dictionaries containing lecture_id, title, date, and user_type.
    """
    try:
        lectures = get_lectures(request.user_id)
        if lectures:
            return [
                {
                    "lecture_id": lec[0],
                    "title": lec[1],
                    "date": lec[2],
                    "user_type": lec[3],
                }
                for lec in lectures
            ]
        else:
            return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class TranscriptionRequest(BaseModel):
    text: str


@app.get("/transcription/{id}?")
def transcription(id: int, last: bool = Query(False)):
    """
    Returns the transcription for given lecture id.

    Parameters:
    - id (int): ID of the transcription.
    - last (bool, optional): Flag indicating whether to return the last portion of transcription. Defaults to False.

    Returns:
    - Dict: A dictionary containing the transcription.
    """
    return {"text": get_transcription(id, last)}


@app.post("/transcription/{id}")
def add_transcription_req(id: str, data: TranscriptionRequest):
    """
    Add transcription to given lecture ID.

    Parameters:
    - lecturer_code (str): Code of lecturer for backend
    - request (UserLecturesRequest): model containing the text of transcription.
    """
    add_transcription(id, data.text)


##################################################################
# TODO test this


class AskQuestionRequest(BaseModel):
    question: str


questions = {}


@app.post("/questions/{id}")
async def add_question(id: int, request: AskQuestionRequest):
    """
    Adds a new question to given lecture.

    Parameters:
    - id (int): ID of the lecture.
    - request (AskQuestionRequest): model containing the question text.
    """

    if str(id) not in questions:
        questions[str(id)] = []
    questions[str(id)].append(request.question)


@app.delete("/question/{id}")
async def del_question(id: int, request: AskQuestionRequest):
    """
    Deletes a question from given lecture.

    Parameters:
    - id (int): ID of the lecture.
    - request (AskQuestionRequest): model containing the question text.
    """
    questions[str(id)].remove(request.question)


@app.get("/questions/{id}")  # TODO implement this as Server Sent Event (SSE)
async def get_question(id: int):
    """
    Returns the list of questions for the given lecture.

    Parameters:
    - id (int): ID of the lecture.

    Returns:
    - List[str]: A list of questions for the lecture.
    """
    if str(id) in questions:
        questions_list = list(questions[str(id)])
    else:
        questions_list = []
    # questions_json = json.dumps(questions_list)
    return questions_list


#############################################################################


class LoginRequest(BaseModel):
    mail: str
    pass_hash: str


@app.post("/login")
def authenticate_user_req(login_request: LoginRequest):
    """
    Authenticates a user with given email and password hash.

    Parameters:
    - login_request (LoginRequest): model containing email and password hash.

    Returns:
    - Dict: A dictionary containing the user ID if authentication is successful.
    - HTTPException: If authentication fails.
    """
    user_id = login(login_request.mail, login_request.pass_hash)
    if user_id != 0:
        return {"user_id": user_id}
    else:
        raise HTTPException(status_code=401, detail="Invalid mail or password")


class RegisterRequest(LoginRequest):
    first_name: str
    last_name: str


@app.post("/register")
def register_user_req(register_request: RegisterRequest):
    """
    Registers a new user with given data.

    Parameters:
    - register_request (RegisterRequest): model containing first name, last name, email, and password hash.

    Returns:
    - HTTPException: If an account with the given email already exists.
    """
    is_succesful = create_user(
        register_request.first_name,
        register_request.last_name,
        register_request.mail,
        register_request.pass_hash,
    )
    if is_succesful == 1:
        raise HTTPException(
            status_code=401, detail="Account with that mail already exist."
        )


class ChangePasswordRequest(BaseModel):
    user_id: int
    password: str


@app.post("/change_pass")
def change_pass_req(password_request: ChangePasswordRequest):
    """
    Changes the password for the given user.

    Parameters:
    - password_request (ChangePasswordRequest): model containing user ID and new password.
    """
    change_password(password_request.user_id, password_request.password)


class JoinLectureRequest(BaseModel):
    user_id: int = None
    lecture_code: str
    user_type: str = "S"


@app.post("/join_lecture")
def join_lecture_req(join_lecture_request: JoinLectureRequest):
    """
    Joins a user to a lecture with given lecture code.

    Parameters:
    - join_lecture_request (JoinLectureRequest): model containing user ID, lecture code, and user type.

    Returns:
    - Dict: A dictionary containing the lecture ID.
    - HTTPException: If the user has already joined the lecture or if the lecture code is invalid.
    """
    lecture_id, is_succesful = join_lecture(
        join_lecture_request.lecture_code,
        join_lecture_request.user_id,
        join_lecture_request.user_type,
    )
    if is_succesful == 1:
        raise HTTPException(status_code=401, detail="User already joined the course.")
    elif is_succesful == -1:
        raise HTTPException(
            status_code=401, detail="Lecture with given code doesn't exist."
        )
    return {"lecture_id": lecture_id}


class CreateLectureRequest(BaseModel):
    title: str
    lecturer_id: int = None


@app.post("/create_lecture")
def create_lecture_req(create_lecture_request: CreateLectureRequest):
    """
    Creates a new lecture with given title and lecturer ID.

    Parameters:
    - create_lecture_request (CreateLectureRequest): model containing the lecture title and lecturer ID.

    Returns:
    - Dict: A dictionary containing the lecturer code and lecture ID.
    """
    lecturer_code, lecture_id = create_lecture(
        create_lecture_request.title, create_lecture_request.lecturer_id
    )
    return {"lecturer_code": lecturer_code, "lecture_id": lecture_id}


class PresentationRequest(BaseModel):
    lecture_id: int
    link: str


@app.post("/presentation")
def add_presentation_req(presentation_request: PresentationRequest):
    """
    Adds a presentation to the given lecture.

    Parameters:
    - presentation_request (PresentationRequest): model containing the lecture ID and presentation link.
    """
    add_presenation(presentation_request.lecture_id, presentation_request.link)


@app.get("/lecture/{id}")
def get_lecture_data(id: int):
    """
    Returns metadata for the given lecture.

    Parameters:
    - id (int): ID of the lecture.

    Returns:
    - List: A list containing the lecture metadata.
    """
    return get_lecture_metadata(id)


# TODO Add in frontend


class NoteRequest(BaseModel):
    user_id: int
    lecture_id: int


@app.get("/note")
def get_note_req(note_req: NoteRequest):
    """
    Returns a note for the given user and lecture.

    Parameters:
    - note_req (NoteRequest): model containing user ID and lecture ID.

    Returns:
    - str: note in html format
    """
    return get_note(note_req.user_id, note_req.lecture_id)


class NoteRequestPost(NoteRequest):
    text: str


@app.post("/note")
def save_note(note_req: NoteRequestPost):
    """
    Saves a note for the given user and lecture.

    Parameters:
    - note_req (NoteRequestPost): model containing user ID, lecture ID, and note text.

    """
    add_note(note_req.user_id, note_req.lecture_id, note_req.text)
