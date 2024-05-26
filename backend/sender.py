# import multiprocessing
import time
import requests

import random
def sender():
    count = 0
    while True:
        count += 1
        data = {"text": random_sentence_in_polish()}
        response = requests.post("http://127.0.0.1:5000/", json=data)
        print(f"Sent: {count}, Response: {response.json()}")
        time.sleep(5)

def send_text(text):
    data = {"text": text}
    response = requests.post("http://api:5000/", json=data)
    # print(f"Sent: {text}, Response: {response.json()}")

def random_sentence_in_polish():
    polish_sentences = [
        "To jest losowe zdanie.",
        "Zajebisty projekt!",
        "Super sie na nim bawie",
        "Losowe zdania jest super"
    ]
    return random.choice(polish_sentences)


if __name__ == "__main__":
    sender()

# if __name__ == "__main__":
#     process = multiprocessing.Process(target=sender)
#     process.start()

# FLOW: microphone(sender(transcribe->translate))