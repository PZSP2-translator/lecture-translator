from deep_translator import GoogleTranslator


def translate_pl_to_en(text):
    return GoogleTranslator(source="pl", target="en").translate(text)
