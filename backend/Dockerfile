FROM python:3.12-slim-bookworm

COPY . .

RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    libsndfile1-dev \
    pulseaudio \
    libasound-dev \
    libportaudio2 \
    libportaudiocpp0 \
    portaudio19-dev \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install PyAudio pydub deep-translator numpy scipy requests

RUN pip install -U openai-whisper

RUN python3 -m pip install sounddevice
