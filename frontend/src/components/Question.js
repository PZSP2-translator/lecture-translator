import React, { useState } from 'react';
import "./Question.css";

const Question = () => {
    const [selected, setSelected] = useState(null);
    const [link, setLink] = useState("");
    const questions = [
        'Question 1',
        'Question 2',
        'Question 3',
    ];

    const handleAnswer = (index) => {
        setSelected(index);
        console.log(selected, questions[selected])
    };

    const handleLink = () => {
        console.log(link)
    };


    return (
        <div className="component-container-question">
            <div className="component-title-question">Title, course_code, lecture_code, date</div>
            <div className='question-list'>
                {questions.map((item, index) => (
                <div key={index} className="question-item">
                    <div className='question'>
                        {item}
                    </div>
                    <button onClick={() => handleAnswer(index)}>Answer</button>
                </div>
                ))}
            </div>
            <div className='presentation'>
                <input
                    type="text"
                    placeholder="Paste presentation here..."
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <button onClick={() => handleLink()}>Enter</button>
            </div>
        </div>
    );
};

export default Question;
