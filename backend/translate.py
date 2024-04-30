# pip install googletrans
from googletrans import Translator

translator = Translator()


def translate_pl_to_en(text):
    return translator.translate(text, dest='en', src='pl').text


def translate_en_to_pl(text):
    return translator.translate(text, dest='pl', src='en').text