import unittest
from unittest.mock import patch, MagicMock
import numpy as np
from main import LectureTranscriber
from transcribe import get_model, transcribe_from_file
from translate import translate_pl_to_en
from sender import send_text
from globals import FREQ
import whisper, os


class TestLectureTranscriber(unittest.TestCase):
    
    def setUp(self):
        self.transcriber = LectureTranscriber('TESTcode', '127.0.0.1')
    
    @patch('main.write')
    @patch('main.AudioSegment.from_wav')
    @patch('main.S.detect_silence')
    def test_process_audio(self, mock_detect_silence, mock_from_wav, mock_write):
        indata = np.random.rand(44100, 1).astype('float32')
        
        mock_audio_segment = MagicMock()
        mock_from_wav.return_value = mock_audio_segment
        mock_audio_segment.dBFS = -20
        mock_detect_silence.return_value = [(1000, 2000)]

        result = self.transcriber.process_audio(indata)
        
        expected_cutting_point = ((2000 + 1000) // 2) * FREQ // 1000
        
        self.assertEqual(result, expected_cutting_point)
        mock_write.assert_called_once()
        mock_from_wav.assert_called_once()
        mock_detect_silence.assert_called_once_with(mock_audio_segment, min_silence_len=100, silence_thresh=-80)


    @patch('main.write')
    @patch('main.AudioSegment.from_wav')
    @patch('main.S.detect_silence')
    def test_process_audio_no_silence(self, mock_detect_silence, mock_from_wav, mock_write):
        indata = np.random.rand(44100, 1).astype('float32')

        mock_audio_segment = MagicMock()
        mock_from_wav.return_value = mock_audio_segment
        mock_audio_segment.dBFS = -20
        mock_detect_silence.return_value = []

        result = self.transcriber.process_audio(indata)
        
        self.assertEqual(result, len(indata)) 
        mock_write.assert_called_once()
        mock_from_wav.assert_called_once()
        mock_detect_silence.assert_called_once_with(mock_audio_segment, min_silence_len=100, silence_thresh=-80)


class TestTranscription(unittest.TestCase):
    @patch('transcribe.get_model')
    def test_transcription(self, mock_get_model):
        mock_model = MagicMock()
        mock_model.transcribe.return_value = {"text": "transkrypcja"}
        mock_get_model.return_value = mock_model

        result = mock_model.transcribe("dummyfile.wav")
        self.assertEqual(result['text'], "transkrypcja")


class TestPolishToEnglishTranslation(unittest.TestCase):
    @patch('translate.GoogleTranslator.translate')
    def test_translation_pl_to_en(self, mock_translate):
        mock_translate.return_value = "translation"

        result = translate_pl_to_en("przykładowy tekst")
        self.assertEqual(result, "translation")
        mock_translate.assert_called_once_with("przykładowy tekst")


class TestPolishToEnglishTranslationReal(unittest.TestCase):
    def test_translation_pl_to_en_real(self):
        input_text = "przykładowy początek wykładu"
        expected_translation = "sample beginning of a lecture" 
        
        result = translate_pl_to_en(input_text)
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)
        self.assertEqual(result.lower(), expected_translation.lower())


class TestRealAudioTranscription(unittest.TestCase):
    def setUp(self):
        self.model = whisper.load_model("base")

    def test_real_audio_transcription(self):
        base_dir = "backend/"
        audio_file_path = os.path.join(base_dir, "sample1.wav")

        self.assertTrue(os.path.exists(audio_file_path), "Audio file does not exist")

        result = self.model.transcribe(audio_file_path, language="pl")['text']

        expected_transcription = " Cześć, świecie!"
        self.assertEqual(result, expected_transcription)

    def test_real_audio_transcription_second(self):
        base_dir = "backend/"
        second_audio_file_path = os.path.join(base_dir, "sample2.wav")

        self.assertTrue(os.path.exists(second_audio_file_path), "Audio file does not exist")

        result = self.model.transcribe(second_audio_file_path, language="pl")['text']
        expected_transcription = " Dzień dobry, to jest mój pierwszy wykład. Zapraszam."  
        self.assertEqual(result, expected_transcription)