import React, { useState, useEffect } from 'react';
import "./Question.css";
import { port, craftTitle, getMetaData} from '../Resources';
import { useNavigate, useParams } from 'react-router-dom';
import {ip} from "../Resources.js";



function getSrc(html) {
    var regex = /src="([^"]+)"/;
    return html.match(regex)[1];
}

const Question = () => {
    const [title, setTitle] = useState("Lecture");
    const [link, setLink] = useState("");
    const [questions, setQuestions] = useState([]);
    const [lastLectureID, setLastLectureID] = useState(sessionStorage.getItem("lastLectureID"));
    const [lectureID, setLectureID] = useState(useParams().id);

    const handleAnswer = async (index) => { // TODO, usunąć selected? nie aktualizuje się na czas!!!
//        setSelected(index);
        await fetch(`${ip}/question/${lectureID}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "question": questions[index]
            }),
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => console.error('Error:', error));
        const new_questions = [...questions];
        new_questions.splice(index, 1);
        console.log(new_questions)
        setQuestions(new_questions);
    };

    const handleLink = async () => {
        try {
            const requestBody = { link: getSrc(link),
                lecture_id: lectureID
             }
        const response = await fetch(`${ip}/presentation`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
          if (!response.ok) {
            throw new Error("Error fetching data");
          }

          alert(`Presentation added.`)
          setLink("");

          } catch (error) {
          console.error("Error during adding presenation:", error);
          }
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (lectureID === "-1") {
            navigate(`/question/${lastLectureID}`);
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
            try{
                const responce = await fetch(ip + `/questions/${lectureID}`);
                if (!responce.ok){
                    throw new Error("XD" + responce.statusText);
                }
                const data = await responce.json();
                setQuestions(data);
            }
            catch (error){
                console.error("ERROR", error);
            }
            // console.log(questions.length === 0)
            // console.log(questions.length)
        };

        // fetchData();
        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const response = await fetch(ip + `/lecture/${lectureID}`);
                if (!response.ok) {
                    throw new Error("XD" + response.statusText);
                }
                const data = await response.json();
                // setTitle(craftTitle(code));
            } catch (error) {
                console.error("ERROR", error);
            }
        };
        fetchLecture();
    }, []);

    const getNoQuestionsTest = () => {
        return "There are currently no questions posted"
    }

    return (
        <div className="component-container-question">
            <div className="component-title-question">{title}</div>
                {questions.length === 0 ? (
                    <div className='empty_question-list'>{
                        <div className="question-item">
                            <div className='empty_question'>
                                {getNoQuestionsTest()}
                            </div>
                        </div>}
                    </div>
                    ) : (
                    <div className='question-list'>{
                        questions.map((item, index) => (
                            <div key={index} className="question-item">
                                <div className='question'>
                                    {item}
                                </div>
                                <button onClick={() => handleAnswer(index)}>Answer</button>
                            </div>
                            ))}
                    </div>
                    )
                }
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
