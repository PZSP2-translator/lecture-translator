# https://www.geeksforgeeks.org/create-a-voice-recorder-using-python/

import sounddevice as sd
from scipy.io.wavfile import write
import tempfile

# Sampling frequency
freq = 44100

# Recording duration
duration = 3

# Start recorder with the given values
# of duration and sample frequency
recording = sd.rec(int(duration * freq),
                   samplerate=freq, channels=1, device=1)

# Record audio for the given number of seconds
sd.wait()

with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmpfile:
    filename = tmpfile.name
    write(filename, freq, recording)
    # TODO
    # Przed zamknięciem wytworzyć transkrypcję


# TODO
# Wybieranie odpowiedniego urządzenia wejśćia
