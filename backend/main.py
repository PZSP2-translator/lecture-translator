import sounddevice as sd
from scipy.io.wavfile import write
import tempfile
import argparse

from pydub import AudioSegment


import numpy as np
from sender import send_text
from transcribe import get_model
from translate import translate_pl_to_en
from globals import FREQ, BLOCK_LENGTH_SEC



from pydub import silence as S

import globals as G

class LectureTranscriber:
    def __init__(self, lecture_code, ip_address):
        self.lecture_code = lecture_code
        self.ip_address = ip_address
        self.model = get_model()
        self.last_data_buffer = np.zeros([0, 1], dtype='float32')

    def process_audio(self, indata):
        """Process audio to find silence and determine cutting point."""
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
            filename = tmpfile.name
            write(filename, FREQ, indata)
            audio_segment = AudioSegment.from_wav(filename)
            silence_threshold = audio_segment.dBFS - 60
            silence_intervals = S.detect_silence(audio_segment, min_silence_len=100, silence_thresh=silence_threshold)

            if not silence_intervals:
                return len(indata)

            last_silence_end = silence_intervals[-1][1]
            last_silence_start = silence_intervals[-1][0]
            cutting_point = (last_silence_end + last_silence_start) // 2
            return cutting_point * FREQ // 1000


    def transcribe_audio(self, audio_data):
        """Transcribe audio data using the loaded model."""
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
            write(tmpfile.name, FREQ, audio_data)
            return self.model.transcribe(tmpfile.name, language="pl", fp16=False)["text"]

    def process_transcription(self, transcription):
        """Translate transcription and send it"""
        translated_text = translate_pl_to_en(transcription)
        send_text(translated_text, self.ip_address, self.lecture_code)

    def audio_callback(self, indata, frames, time, status):
        """Handle incoming audio"""
        if status:
            print(f"Error: {status}")
        cutting_frame = self.process_audio(indata)
        transcription = self.transcribe_audio(indata[:cutting_frame])
        if transcription:
            self.process_transcription(transcription)
        self.last_data_buffer = indata[cutting_frame:]

    def start(self):
        """Start the audio transcription"""
        print(f"Starting transcription for lecture: {self.lecture_code} at IP: {self.ip_address}")
        with sd.InputStream(device=1, samplerate=FREQ, blocksize=FREQ * BLOCK_LENGTH_SEC,
                            channels=1, callback=self.audio_callback):
            print("Microphone started. Press Enter to quit.")
            input()



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Backend script to record and send transcription.")
    parser.add_argument("lecture_code", type=str, help="Code of the lecture to transcribe.", default="TESTcode", nargs='?')
    parser.add_argument("ip_address", type=str, help="IP address for sending transcriptions.", default="127.0.0.1", nargs='?')

    args = parser.parse_args()
    transcriber = LectureTranscriber(args.lecture_code, args.ip_address)
    transcriber.start()
