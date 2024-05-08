import sounddevice as sd
from scipy.io.wavfile import write
import tempfile

from pydub import AudioSegment # pip install pydub sudo apt install ffmpeg
from pydub import silence as S

import transcribe
import globals as G
import sender
import translate
import numpy as np

def choose_cutting_point(indata):
    cutting_frame = 0
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
        filename = tmpfile.name
        write(filename, G.FREQ, indata)
        song = AudioSegment.from_wav(filename)
        dBFS=song.dBFS
        silence = S.detect_silence(song, min_silence_len=100, silence_thresh=dBFS-60)
        if len(silence) <= 1:
            cutting_frame = len(indata)
        else:
            cutting_frame = ((silence[-1][1] - silence[-1][0])//2 + silence[-1][0]) * G.FREQ // 1000 # converting from ms to s
    return cutting_frame

def transcribe_fragment(data): # currently making a temporary file, test giving data after dividing by 32768.0 as stated below
# Convert in-ram buffer to something the model can use directly without needing a temp file.
# Convert data from 16 bit wide integers to floating point with a width of 32 bits.
# Clamp the audio stream frequency to a PCM wavelength compatible default of 32768hz max.
#audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

    result = None
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
        filename = tmpfile.name
        array_to_translate = np.concatenate((last_data_buffer, data), axis=0)
        write(filename, G.FREQ, array_to_translate)
        result = model.transcribe(filename, language = "pl")
    return result["text"]

def callback(indata, frames, time, status):
    global last_data_buffer
    cutting_frame = choose_cutting_point(indata)
    text = transcribe_fragment(indata[:cutting_frame])
    if text == None or text == "":
        return
    last_data_buffer = indata[cutting_frame:]
    text = translate.translate_pl_to_en(text)
    sender.send_text(text)

if __name__ == "__main__":
    model = transcribe.get_model()
    last_data_buffer = np.zeros([0, 1], dtype='float32')

    with sd.InputStream(device=1,
                samplerate=G.FREQ, blocksize=G.FREQ * G.BLOCK_LENGTH_SEC,
                channels=1, callback=callback):
        print("#" * 80)
        print("press Enter to quit")
        print("#" * 80)
        input()