import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./LectureView.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { openFile } from './openFile';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { port, craftTitle, getMetaData} from '../Resources';
import { extractDate } from './utils';
import { useUser } from './UserContext';
import {ip} from "../Resources.js";



const LectureView = ({ notes, setNotes }) => {
    const quillRef = useRef(null);
    const [localNotes, setLocalNotes] = useState(notes);
    const [title, setTitle] = useState("Lecture");
    const [question, setQuestion] = useState("");
    const [transcription, setTranscription] = useState("");
    const [link, setLink] = useState("");
    const [lectureID, setLectureID] = useState(useParams().id);
    const [lastLectureID, setLastLectureID] = useState(sessionStorage.getItem("lastLectureID"))
    const {user} = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        if (lectureID === "-1") {
            navigate(`/notes/${lastLectureID}`);
            setLectureID(lastLectureID);
        }

        (async () => {
            if (lectureID === "-1") {
                return;
            }
            const result = await craftTitle(lectureID);
            sessionStorage.setItem("lastLectureID", lectureID);
            setTitle(result);
        })();
    }, [lectureID, lastLectureID, navigate]);

    useEffect(() => {
        const fetchData = async()=>{
            try {
                const response = await fetch(`${ip}/transcription/${lectureID}?last=${true}`);
                if (!response.ok) {
                    throw new Error("XD" + response.statusText);
                }
                const data = await response.json();
                // console.log("Received data:", data);
                console.log("last", transcription)
                console.log("new", data.text)
                console.log("check:", transcription.includes(data.text))
                if (!transcription.includes(data.text)) {
                    setTranscription(prevTranscription => prevTranscription + " " + data.text);
                }
            } catch (error) {
                console.error("ERROR", error);
            }
    };

    //fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
}, [transcription, lectureID]);

useEffect(() => {
    const saveNotesDB = async () => {
        if (user) {
            fetch(`http://localhost:${port}/note`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user_id": user.id,
                    "lecture_id": lectureID,
                    "text": localNotes
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Note saved:', user.id, lectureID);
                console.log(localNotes);
            })
            .catch((error) => console.error('Error saving note to db:', error));
        }
    };

    const intervalId = setInterval(saveNotesDB, 10000);

    return () => clearInterval(intervalId);
    }, [localNotes]);


    const saveNotes = () => {
        const element = document.createElement("a");
        const file = new Blob([localNotes], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = "myNotes.html";
        document.body.appendChild(element);
        element.click();
    };

    const handleOpen = () => {
        openFile((content) => {
            setNotes(content);
            setLocalNotes(content);
            const quill = quillRef.current.getEditor();
            quill.clipboard.dangerouslyPasteHTML(content);
            quill.setSelection(quill.getLength(), 0);
        });
    };

    const exportToPDF = async () => {
        const editor = quillRef.current.getEditor().root;

        editor.style.height = 'auto';
        editor.style.overflow = 'visible';

        await new Promise(resolve => setTimeout(resolve, 100));

        const fullHeight = editor.scrollHeight;
        const fullWidth = editor.scrollWidth;

        const canvas = await html2canvas(editor, {
          scale: 2,
          logging: true,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          width: fullWidth,
          height: fullHeight
        });

        editor.style.height = '';
        editor.style.overflow = '';

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= 297;
        }

        pdf.save('exportedNotes.pdf');
      };

    const handleQuestion = () => {
        console.log("MY CHANGES" + question);
        fetch(`http://localhost:${port}/questions/${lectureID}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "question": question
            }),
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => console.error('Error:', error));
        alert(`Question sent!\n "${question}"`);
        setQuestion("");
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            [{ 'align': [] }],
            ['clean']
        ]
    };

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const response = await fetch(ip + `/lecture/${lectureID}`);
                if (!response.ok) {
                    throw new Error("XD" + response.statusText);
                }
                const data = await response.json();
                setLink(data[4])
            } catch (error) {
                console.error("ERROR", error);
            }
        };
        const fetchNotes = async () => {
            if (user) {
                const url = `http://localhost:${port}/note/${user.id}?lecture_id=${lectureID}`;

                fetch(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data){
                        setLocalNotes(data);
                    }
                })
                .catch((error) => console.error('Error:', error));
            }
        };
        const fetchTranscription = async()=>{
            try {
                const response = await fetch(`${ip}/transcription/${lectureID}`);
                if (!response.ok) {
                    throw new Error("XD" + response.statusText);
                }
                const data = await response.json();
                console.log("Received data:", data);
                setTranscription(prevTranscription => prevTranscription + " " + data.text);
            } catch (error) {
                console.error("ERROR", error);
            }
        };
        fetchLecture();
        fetchNotes();
        fetchTranscription();
    }, [ip, lectureID]);




    return (
        <div className="component-container-lectureview">
            <div className="component-title-lectureview">{title}</div>
            <div className='divider-lectureview'>
                <div className="element-lectureview">
                    <div className="transcription">{transcription}</div>
                    <iframe className="presentation" title='presentation'
                        src={link} width="730px" height="270px">
                    </iframe>
                </div>
                <div className="element-lectureview">
                    <div className="notes">
                        <ReactQuill className="ql-container" ref={quillRef} value={localNotes} onChange={setLocalNotes} theme="snow" modules={quillModules} />
                    </div>
                    <div className='buttons'>
                        <button onClick={saveNotes}>Save</button>
                        <button onClick={handleOpen}>Open</button>
                        <button onClick={exportToPDF}>Export</button>
                    </div>
                    <div className="question-lectureview">
                        <input
                            type="text"
                            placeholder="Enter your question here..."
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <button onClick={handleQuestion}>?</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureView;
