import React, { useState, useEffect } from 'react';
import { useUser } from "./UserContext";
import "./History.css";
import { useNavigate  } from 'react-router-dom';

const History = () => {
    const [selected, setSelected] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const response = await fetch("http://localhost:5000/userLectures", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_id: user.id })
                });

                if (!response.ok) {
                    throw new Error("Error fetching lectures");
                }

                const data = await response.json();
                console.log("Fetched lectures:", data);

                if (Array.isArray(data)) {
                    setLectures(data);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (error) {
                console.error("Error during fetching lectures:", error);
                setError(error.message);
            }
        };

        fetchLectures();
    }, [user.id]);

    const handleSelect = (index) => {
        setSelected(index);
    };

    const handleConfirm = () => {
        if (selected !== null) {
            console.log("Selected lecture:", lectures[selected]);
            navigate(`/notes/${lectures[selected]['lecture_id']}`)
        } else {
            alert("Please select a lecture");
        }
    };

    return (
        <div className="component-container-history">
            <div className="component-title-history">Choose lecture</div>
            {error && <div className="error-message">{error}</div>}
            <ul className="lecture-list">
                {lectures.map((lecture, index) => (
                    <li key={index}
                        className={`lecture-item ${selected === index ? 'selected' : ''}`}
                        onClick={() => handleSelect(index)}
                    >
                        {lecture.title} - {lecture.date.substring(0,11)} {/* Title and Date */}
                        <span className="lecture-code">
                        {lecture.user_type === 'S' ? 'student' : lecture.user_type === 'L' ? 'lecturer' : 'unknown'}
                        </span> {/* User Type */}
                    </li>
                ))}
            </ul>
            <button type="button" onClick={handleConfirm}>
                Enter
            </button>
        </div>
    );
};

export default History;



// Czy nie lepiej zaznaczyć czy było się studentem czy wykładowcą zamiast wyświetlać kod?