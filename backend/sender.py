# import multiprocessing
import time
import requests


def sender():
    count = 0
    while True:
        count += 1
        data = {"text": str(count)}
        response = requests.post("http://localhost:8000/", json=data)
        print(f"Sent: {count}, Response: {response.json()}")
        time.sleep(5)

def send_text(text):
    data = {"text": text}
    response = requests.post("http://localhost:8000/", json=data)
    print(f"Sent: {text}, Response: {response.json()}")


# if __name__ == "__main__":
#     process = multiprocessing.Process(target=sender)
#     process.start()

# FLOW: microphone(sender(transcribe->translate))