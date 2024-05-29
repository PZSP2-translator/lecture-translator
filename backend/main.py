import sounddevice as sd
from scipy.io.wavfile import write
import tempfile
import argparse

from pydub import AudioSegment
from pydub import silence as S

import transcribe
import sender
import globals as G
import translate
import numpy as np
import time

def choose_cutting_point(indata):
    cutting_frame = 0
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
        filename = tmpfile.name
        write(filename, G.FREQ, indata)
        song = AudioSegment.from_wav(filename)
        dBFS = song.dBFS
        silence = S.detect_silence(song, min_silence_len=100, silence_thresh=dBFS-60)
        if len(silence) <= 1:
            cutting_frame = len(indata)
        else:
            cutting_frame = ((silence[-1][1] - silence[-1][0]) // 2 + silence[-1][0]) * G.FREQ // 1000  # converting from ms to s
    return cutting_frame

def transcribe_fragment(data, model):
    result = None
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
        filename = tmpfile.name
        write(filename, G.FREQ, data)
        result = model.transcribe(filename, language="pl", fp16=False)
    return result["text"]

def callback(indata, frames, time, status, model, ip_address, lecture_code):
    global last_data_buffer
    cutting_frame = choose_cutting_point(indata)
    text = transcribe_fragment(indata[:cutting_frame], model)
    if text == None or text == "":
        return
    last_data_buffer = indata[cutting_frame:]
    text = translate.translate_pl_to_en(text)
    sender.send_text(text, ip_address, lecture_code)


def main(lecture_code, ip_address):
    print(f"Starting transcription for lecture: {lecture_code} at IP: {ip_address}")
    print(sd.query_devices())

    model = transcribe.get_model() 
    global last_data_buffer
    last_data_buffer = np.zeros([0, 1], dtype='float32')

    with sd.InputStream(device=1, samplerate=G.FREQ, blocksize=G.FREQ * G.BLOCK_LENGTH_SEC,
                        channels=1, callback=lambda indata, frame, time, status: callback(indata, frame, time, status, model)):
        time.sleep(5)
        print("Microphone started")
        print("#" * 80)
        print("Press Enter to quit")
        print("#" * 80)
        input()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Script to transcribe lectures.")
    parser.add_argument("lecture_code", type=str, help="Code of the lecture to transcribe.", default="TESTcode", nargs='?')
    parser.add_argument("ip_address", type=str, help="IP address for sending transcriptions.", default="api", nargs='?')

    args = parser.parse_args()
    main(args.lecture_code, args.ip_address)
