import whisper as W
def get_model():
    return W.load_model("base")

def transcribe_from_file(filename, model, freq):
    model.transcribe(filename, language = "pl")