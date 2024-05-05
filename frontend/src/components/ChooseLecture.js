import React, { useState } from 'react';
import "./ChooseLecture.css";

const ChooseLecture = () => {
    const [selected, setSelected] = useState(null);
    const lectures = [
        ['Lecture 1', ""],
        ['Lecture 2', ""],
        ['Lecture 3', "123456"],
        ['Lecture 1', ""],
        ['Lecture 2', ""],
        ['Lecture 1', ""],
        ['Lecture 2', ""],
        ['Lecture 1', ""],
        ['Lecture 2', ""],
        ['Lecture 1', ""],
        ['Lecture 2', ""],
        ['Lecture 1', ""],
        ['Lecture 2', ""],
    ];

    const handleSelect = (index) => {
        setSelected(index);
    };

    const handleConfirm = () => {
        console.log(lectures[selected]);
    };

    return (
        <div className="component-container-chooselecture">
            <div className="component-title-chooselecture">Choose lecture</div>
            <ul className="lecture-list">
                {lectures.map((lecture, index) => (
                    <li key={index}
                        className={`lecture-item ${selected === index ? 'selected' : ''}`}
                        onClick={() => handleSelect(index)}
                    >
                        {lecture[0]} {lecture[1] && <span className="lecture-code">{lecture[1]}</span>}
                    </li>
                ))}
            </ul>
            <button type="button"
                onClick={handleConfirm}
            >
                Enter
            </button>
        </div>
    );
};

export default ChooseLecture;


// Czy nie lepiej zaznaczyć czy było się studentem czy wykładowcą zamiast wyświetlać kod?