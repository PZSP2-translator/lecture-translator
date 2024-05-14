import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import "./LectureView.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { openFile } from './openFile';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

function getSrc(html) {
    var regex = /src="([^"]+)"/;
    return html.match(regex)[1];
}

const LectureView = ({ notes, setNotes }) => {
    const quillRef = useRef(null);
    const [localNotes, setLocalNotes] = useState(notes);

    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            quill.on('text-change', () => {
                setLocalNotes(quill.root.innerHTML);
                setNotes(quill.root.innerHTML);
            });

            if (notes && notes !== localNotes) {
                quill.clipboard.dangerouslyPasteHTML(notes);
            }
        }
    }, [notes, localNotes, setNotes]);

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', () => {
            selectLocalImage(quill);
        });
    }, []);

    const selectLocalImage = (quill) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', e.target.result);
                    quill.setSelection(range.index + 1);
                };
                reader.readAsDataURL(file);
            }
        };
    };

    function getMetaData(code) {
        return fetch('http://localhost:8000/joinCourse', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "code": code
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            })
            .catch((error) => console.error('Error:', error));
    }

    let { code } = useParams();
    const [lastCode, setLastCode] = useState(sessionStorage.getItem("lastCode") || code);

    useEffect(() => {
        sessionStorage.setItem("lastCode", lastCode);
        getMetaData(lastCode).then(metaData => {
            if (metaData) {
                setTitle(metaData.name);
                setDate(metaData.date);
            }
        });
    }, [lastCode]);

    const [title, setTitle] = useState("Lecture");
    const [date, setDate] = useState("");
    const [question, setQuestion] = useState("");

    console.log(lastCode);

    useEffect(() => {
        getMetaData(code).then(metaData => {
            if (metaData) {
                setTitle(metaData.name);
                setDate(metaData.date);
            }
        });
    }, [code]);

    const htmllink = '<iframe src="https://1drv.ms/p/c/77287afd4195c30f/IQMPw5VB_XooIIB3dAYAAAAAATZKsZ-Zjucl6tGxFUc8pfM" width="402" height="327" frameborder="0" scrolling="no"></iframe>';
    const link = getSrc(htmllink) + "?em=2&amp;wdAr=1.7777777777777777&amp;wdEaaCheck=1";

    const [transcription, setTranscription] = useState("");

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
        const pdf = new jsPDF();
        const content = quillRef.current.getEditor().root;
        const pageHeight = pdf.internal.pageSize.height;
        const canvas = await html2canvas(content);

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * 190) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('exportedNotes.pdf');
    };

    const handleQuestion = () => {
        console.log(question);
        alert(`Question sent!\n "${question}"`);
        setQuestion("");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/");
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

        // fetchData();
        const intervalId = setInterval(fetchData, 10000);

        return () => clearInterval(intervalId);
    }, []);

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

    return (
        <div className="component-container-lectureview">
            <div className="component-title-lectureview">{title} {date} ---- Code: {code}</div>
            <div className='divider-lectureview'>
                <div className="element-lectureview">
                    <div className="transcription">{transcription}</div>
                    <iframe className="presentation"
                        src={link} width="730px" height="270px">
                    </iframe>
                </div>
                <div className="element-lectureview">
                    <ReactQuill ref={quillRef} value={localNotes} onChange={setLocalNotes} theme="snow" modules={quillModules} />
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
