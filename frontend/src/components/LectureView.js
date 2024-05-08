import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./LectureView.css"

function getSrc(html) {
    var regex = /src="([^"]+)"/;
    return html.match(regex)[1];
}

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
    };

const LectureView = () => {
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



    // Use the lastCode variable in your component
    console.log(lastCode);

    useEffect(() => {

        getMetaData(code).then(metaData => {
            if (metaData) {
                setTitle(metaData.name);
                setDate(metaData.date);
            }
        });
    }, [code]);

    const htmllink = '<iframe src="https://1drv.ms/p/c/77287afd4195c30f/IQMPw5VB_XooIIB3dAYAAAAAATZKsZ-Zjucl6tGxFUc8pfM" width="402" height="327" frameborder="0" scrolling="no"></iframe>'
    const link = getSrc(htmllink) + "?em=2&amp;wdAr=1.7777777777777777&amp;wdEaaCheck=1"


    const [transcription, setTranscription] = useState("");

    const handleQuestion = () => {
        console.log(question);
        alert(`Question sent!\n "${question}"`);
        setQuestion("");
    }

    useEffect(() => {
        const fetchData = async()=>{
            try{
            const responce = await fetch("http://127.0.0.1:5000/");
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

    return (
        <div className="component-container-lectureview">
            <div className="component-title-lectureview">{title} {date} ---- Code: {code}</div>
            <div className='divider-lectureview'>
                <div className="element-lectureview">
                    <div className="transcription">{transcription}</div>
                    <iframe className="presentation"
                        src="https://1drv.ms/p/c/77287afd4195c30f/IQMPw5VB_XooIIB3dAYAAAAAATZKsZ-Zjucl6tGxFUc8pfM?em=2&amp;wdAr=1.7777777777777777&amp;wdEaaCheck=1" width="730px" height="270px">
                    </iframe>

                </div>
                <div className="element-lectureview">
                    <textarea className='notes' wrap='soft'></textarea>
                    <div className='buttons'>
                        <button >Save</button>
                        <button >Open</button>
                        <button >Export</button>
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


// Prezentacje trzeba ogarnąć żeby poprawnie link przyjmować a nie całego html

// nie wiem czy to bezpieczne
// Instrukcja:
// Osadź
// skopiuj komponent iframe
// wklej
// np. <iframe src="https://1drv.ms/p/c/77287afd4195c30f/IQMPw5VB_XooIIB3dAYAAAAAATZKsZ-Zjucl6tGxFUc8pfM" width="402" height="327" frameborder="0" scrolling="no"></iframe>
// bierzemy stąd tylko src

// Trzeba przekzywać link do iframe tylko póki co jak jest przekazywane nie przez wartość to rozdzielczość spada

// Dodać możliwość nie wyświetlania/chowania prezentacji