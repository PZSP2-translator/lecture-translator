import React, { useState, useEffect } from 'react';
import "./ChooseLecture.css";

const ChooseLecture = () => {
    const [selected, setSelected] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [error, setError] = useState(null);
    
    const userId = 1; // Replace with actual user ID

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const response = await fetch("http://localhost:5000/userLectures", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_id: userId })
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
    }, [userId]);

    const handleSelect = (index) => {
        setSelected(index);
    };

    const handleConfirm = () => {
        if (selected !== null) {
            console.log("Selected lecture:", lectures[selected]);
        } else {
            alert("Please select a lecture");
        }
    };

    return (
        <div className="component-container-chooselecture">
            <div className="component-title-chooselecture">Choose lecture</div>
            {error && <div className="error-message">{error}</div>}
            <ul className="lecture-list">
                {lectures.map((lecture, index) => (
                    <li key={index}
                        className={`lecture-item ${selected === index ? 'selected' : ''}`}
                        onClick={() => handleSelect(index)}
                    >
                        {lecture.title} - {lecture.date} {/* Title and Date */}
                        <span className="lecture-code">{lecture.user_type}</span> {/* User Type */}
                    </li>
                ))}
            </ul>
            <button type="button" onClick={handleConfirm}>
                Enter
            </button>
        </div>
    );
};

export default ChooseLecture;



// Czy nie lepiej zaznaczyć czy było się studentem czy wykładowcą zamiast wyświetlać kod?