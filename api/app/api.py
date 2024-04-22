from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.get("/api")
async def root():
    return {"message": "Hello World"}

# Docker
# pip install fastapi==0.78.0 uvicorn==0.17.6
# uvicorn main:app --reload
