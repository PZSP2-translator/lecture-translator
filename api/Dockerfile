FROM python:3
WORKDIR /api

COPY . .
# TODO switch the password from file to an environment variable
RUN pip install fastapi==0.78.0 uvicorn==0.17.6 oracledb==2.1.2