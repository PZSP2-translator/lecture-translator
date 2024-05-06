import React, { useState } from 'react';
import "./LectureView.css"

function getSrc(html) {
    var regex = /src="([^"]+)"/;
    return html.match(regex)[1];
}

const LectureView = () => {
    const [title, setTitle] = useState("temp");
    const [date, setDate] = useState("01.01.2000");
    const [question, setQuestion] = useState("");

    const transcription = ""

    const handleQuestion = () => {
        console.log(question);
    }

    const htmllink = '<iframe src="https://1drv.ms/p/c/77287afd4195c30f/IQMPw5VB_XooIIB3dAYAAAAAATZKsZ-Zjucl6tGxFUc8pfM" width="402" height="327" frameborder="0" scrolling="no"></iframe>'
    const link = getSrc(htmllink) + "?em=2&amp;wdAr=1.7777777777777777&amp;wdEaaCheck=1"

    return (
        <div className="component-container-lectureview">
            <div className="component-title-lectureview">{title}{date}</div>
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