import requests

def send_text(text, ip_address, lecture_code):
    url = f"http://{ip_address}:5000/transcription/{lecture_code}"
    data = {"text": text}
    print(url)
    print(data)
    response = requests.post(url, json=data)

