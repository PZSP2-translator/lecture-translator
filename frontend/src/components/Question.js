import React, { useState } from 'react';
import "./index.css";
import "./lecture.css";

const Question = () => {
    const [selected, setSelected] = useState(null);
    const questions = [
        'Question 1',
        'Question 2',
        'Question 3'
    ];

    const handleSelect = (index) => {
        setSelected(index);
        console.log(selected, questions[selected])
    };


    return (
        <div className="outer-container">
            <div className="component-container">
                <div className="component-title">Title, course_code, lecture_code, date</div>
                {questions.map((item, index) => (
                <div key={index} className="list-item">
                    <span>{item}</span>
                    <button onClick={() => handleSelect(index)}>Button</button>
                </div>
                ))}
                <input placeholder='Paste presentation link here...'/>
                <button>Enter</button>
            </div>
        </div>
    );
};

export default Question;
