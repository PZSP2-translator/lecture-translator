import React, { useState, useEffect } from 'react';
import "./Question.css";
import { port, craftTitle, getMetaData} from '../Resources';


const Question = () => {
    const [selected, setSelected] = useState(null);
    const [title, setTitle] = useState("Lecture");
    const [lastCode, setLastCode] = useState(sessionStorage.getItem("lastCode"))
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

    useEffect(() => {
        (async () => {
            const result = await craftTitle(lastCode);
            setTitle(result);
        })();
    }, [lastCode]);


    return (
        <div className="component-container-question">
            <div className="component-title-question">{title}</div>
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
