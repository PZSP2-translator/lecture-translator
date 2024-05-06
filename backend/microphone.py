# https://www.geeksforgeeks.org/create-a-voice-recorder-using-python/

import sounddevice as sd
from scipy.io.wavfile import write
import tempfile

import numpy as np

from pydub import AudioSegment # pip install pydub sudo apt install ffmpeg
from pydub import silence as S
import whisper as W

import translate
import sender


# Sampling frequency
freq = 44100

# Recording duration
duration = 3

model = W.load_model("base")

last_data_buffer = np.zeros([0, 1], dtype='float32')

callback_status = sd.CallbackFlags()


def choose_cutting_point(indata):
    cutting_frame = 0
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
        filename = tmpfile.name
        write(filename, freq, indata)

        song = AudioSegment.from_wav(filename)

        dBFS=song.dBFS
        silence = S.detect_silence(song, min_silence_len=25, silence_thresh=dBFS-60)
        if len(silence) <= 1:
            cutting_frame = len(indata)
        else:
            cutting_frame = ((silence[-1][1] - silence[-1][0])//2 + silence[-1][0]) * freq // 1000 # converting from ms to s
    return cutting_frame


def translate_fragment(data):
# Convert in-ram buffer to something the model can use directly without needing a temp file.
# Convert data from 16 bit wide integers to floating point with a width of 32 bits.
# Clamp the audio stream frequency to a PCM wavelength compatible default of 32768hz max.
#audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
    result = None
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmpfile:
        filename = tmpfile.name
        print("file: " + filename)
        array_to_translate = np.concatenate((last_data_buffer, data), axis=0)
        write(filename, freq, array_to_translate)
        result = model.transcribe(filename, language = "pl")
    return result["text"]

def filter_weird_artifacts(text):
    if "że to jest to, że to jest to, że to jest to, że to jest to, \
        że to jest to, że to jest to, że to jest to, że to jest to, \
            że to jest to, że to jest to, że to jest to, że to jest to, \
                że to jest to, że to jest to, że to jest to, że to jest to, \
                    że to jest to, że to jest to, że to jest to, że to jest to, \
                        że to jest to, że to jest to, że to jest to, że to jest to, \
                            że to jest to, że to jest to, że to jest to, że to jest to, \
                                że to jest to, że to jest to, że to jest to, że to jest to, \
                                    że to jest to, że to jest to, że to jest to, że to jest to" \
                                        in text:
        return ""
    else:
        return text

def callback(indata, frames, time, status):
    global last_data_buffer
    cutting_frame = choose_cutting_point(indata)
    #print(last_data_buffer.shape)
    text = translate_fragment(indata[:cutting_frame])
    text = filter_weird_artifacts(text)
    print(text)
    if text == None or text == "":
        return
    last_data_buffer = indata[cutting_frame:]
    #print(translate.translate_pl_to_en(text))
    #sender.send_text(text)

with sd.InputStream(device=1,
                samplerate=freq, blocksize=freq * duration,
                channels=1, callback=callback):
    print("#" * 80)
    print("press Enter to quit")
    print("#" * 80)
    input()




# Record audio for the given number of seconds

# print('start')
# recording = sd.rec(int(duration * freq),
#                    samplerate=freq, channels=1, device=1)

# print('start')
# sd.play(recording)
# sd.wait()
# print('stop')

# with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
#     filename = tmpfile.name
#     write(filename, freq, np.add(last_data_buffer,recording))
#     result = model.transcribe(filename)
#     print(result["text"])

    # translate_fragment(recording)
#     write(filename, freq, recording)

#     output = pipeline(filename)
#     print(output.get_timeline())
#     a = 5
#     # TODO
#     # Przed zamknięciem wytworzyć transkrypcję

# TODO
# Wybieranie odpowiedniego urządzenia wejśćia
