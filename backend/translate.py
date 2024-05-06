# pip install googletrans
# from googletrans import Translator          ### googletrans was not working for me, so i switched to deep translator
# translator = Translator()
# def translate_pl_to_en(text):
#     return translator.translate(text, dest='en', src='pl').text


# def translate_en_to_pl(text):
#     return translator.translate(text, dest='pl', src='en').text

# pip install -U deep-translator
from deep_translator import GoogleTranslator

def translate_pl_to_en(text):
    return GoogleTranslator(source='pl', target='en').translate(text)

