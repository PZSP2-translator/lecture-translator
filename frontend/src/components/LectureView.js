import React, { useState } from 'react';
import "./LectureView.css"

const LectureView = () => {
    const [title, setTitle] = useState("temp");
    const [date, setDate] = useState("01.01.2000");
    const [question, setQuestion] = useState("");

    const transcription = ""

    const handleQuestion = () => {
        console.log(question);
    }

    return (
        <div className="component-container-lectureview">
            <div className="component-title-lectureview">{title}{date}</div>
            <div className='divider-lectureview'>
                <div className="element-lectureview">
                    <div className="transcription">{transcription}</div>
                    <iframe className='presentation'
                        src="https://1drv.ms/p/c/77287afd4195c30f/IQMPw5VB_XooIIB3dAYAAAAAATZKsZ-Zjucl6tGxFUc8pfM?em=2&amp;wdAr=1.7777777777777777&amp;wdEaaCheck=1"
                        width="730px" height="270px">To jest osadzony dokument pakietu <a target="_blank" href="https://office.com">Microsoft Office</a> obsługiwany przez aplikację <a target="_blank" href="https://office.com/webapps">Office</a>.
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
// Dodać możliwość nie wyświetlania/chowania prezentacji