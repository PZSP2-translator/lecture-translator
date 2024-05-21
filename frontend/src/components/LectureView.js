import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import "./LectureView.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { openFile } from './openFile';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { port, craftTitle, getMetaData} from '../Resources';



function getSrc(html) {
    var regex = /src="([^"]+)"/;
    return html.match(regex)[1];
}

const LectureView = ({ notes, setNotes }) => {
    const quillRef = useRef(null);
    const [localNotes, setLocalNotes] = useState(notes);


    const [lastCode, setLastCode] = useState(sessionStorage.getItem("lastCode"))
    const [title, setTitle] = useState("Lecture");
    const [question, setQuestion] = useState("");
    const [transcription, setTranscription] = useState("");

    console.log(lastCode);



    const htmllink = '<iframe src="https://1drv.ms/p/c/77287afd4195c30f/IQMPw5VB_XooIIB3dAYAAAAAATZKsZ-Zjucl6tGxFUc8pfM" width="402" height="327" frameborder="0" scrolling="no"></iframe>';
    const link = getSrc(htmllink) + "?em=2&amp;wdAr=1.7777777777777777&amp;wdEaaCheck=1";

    let { code } = useParams();
    if (code === "-1") {
        code = lastCode;
    }

    useEffect(() => {
        sessionStorage.setItem("lastCode", code);

        (async () => {
            const result = await craftTitle(code);
            setTitle(result);
        })();

        const fetchData = async()=>{
            try{
            const responce = await fetch(`http://localhost:${port}/`);
            if (!responce.ok){
                throw new Error("XD" + responce.statusText);
            }
            const data = await responce.json();
            console.log("Received data:", data);
            setTranscription(prevTranscription =>prevTranscription  + " " + data.text);
            }
            catch (error){
                console.error("ERROR", error);
            }
    };

    // fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
}, []);


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
        
        // Temporarily expand the editor to ensure all content is captured
        editor.style.height = 'auto';
        editor.style.overflow = 'visible';
        
        // Wait for styles to take effect
        await new Promise(resolve => setTimeout(resolve, 100));
      
        // Calculate full height of the content
        const fullHeight = editor.scrollHeight;
        const fullWidth = editor.scrollWidth;
      
        // Use html2canvas to snapshot the full content
        const canvas = await html2canvas(editor, {
          scale: 2,
          logging: true,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          width: fullWidth,
          height: fullHeight
        });
      
        // Restore editor styles if necessary
        editor.style.height = '';
        editor.style.overflow = '';
      
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4'
        });
      
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
        let heightLeft = imgHeight;
        let position = 0;
      
        // Add the initial image to PDF
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // A4 height in mm
      
        // Handle content that spans multiple pages
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
        fetch(`http://localhost:${port}/questions`, {
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
            <div className="component-title-lectureview">{title}</div>
            <div className='divider-lectureview'>
                <div className="element-lectureview">
                    <div className="transcription">{transcription}</div>
                    <iframe className="presentation"
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
