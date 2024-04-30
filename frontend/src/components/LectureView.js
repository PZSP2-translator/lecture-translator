import React, { useState } from 'react';
import "./index.css";
import "./lecture.css";

const LectureView = () => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");


    return (
        <div className="outer-container">
            <div className="component-container">
                <div className="component-title">{title}{date}</div>

            </div>
        </div>
    );
};

export default LectureView;
