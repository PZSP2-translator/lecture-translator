import React, { useState, useEffect } from 'react';
import "./Question.css";
import { port, craftTitle, getMetaData} from '../Resources';
import { useParams } from 'react-router-dom';


function getSrc(html) {
    var regex = /src="([^"]+)"/;
    return html.match(regex)[1];
}

const Question = () => {
    let { id } = useParams();
//    const [selected, setSelected] = useState(null);
    const [title, setTitle] = useState("Lecture");
    // const [lastCode, setLastCode] = useState(sessionStorage.getItem("lastCode"))
    const [link, setLink] = useState("");
    const [questions, setQuestions] = useState([])

    const handleAnswer = (index) => { // TODO, usunąć selected? nie aktualizuje się na czas!!!
//        setSelected(index);
        fetch(`http://localhost:${port}/question/${id}`, {
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
                lecture_id: id
             }
        const response = await fetch("http://localhost:5000/presentation", {
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

    // useEffect(() => {
    //     (async () => {
    //         const result = await craftTitle(lastCode);
    //         setTitle(result);
    //     })();
    // }, [lastCode]);

    useEffect(() => {
        const fetchData = async()=>{
            try{
                const responce = await fetch(`http://localhost:${port}/questions/${id}`);
                if (!responce.ok){
                    throw new Error("XD" + responce.statusText);
                }
                const data = await responce.json();
                setQuestions(data);
                // console.log("Received data:", data);
            }
            catch (error){
                console.error("ERROR", error);
            }
            console.log(questions.length === 0)
            console.log(questions.length)
        };

    // fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
}, []);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const response = await fetch(`http://localhost:${port}/lecture/${id}`);
                if (!response.ok) {
                    throw new Error("XD" + response.statusText);
                }
                const data = await response.json();
                setTitle(`${data[1]}-${data[2]}-${data[3]}`);
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
