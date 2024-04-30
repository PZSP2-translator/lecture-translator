import React from 'react';
import "./index.css";
import { useState } from 'react';

const CreateLecture = () => {
    const [title, SetTitle] = useState("Temp");
    const [studentCode, SetStudentCode] = useState("23132");
    const [lectureCode, SetLectureCode] = useState("12312");

    return (
        <div className="component-container">
            <div className="component-title">{title}</div>
                <div className="divider">
                    <div className="element">
                        <div className="enter-box">
                            <h2>Student code:</h2>
                            {studentCode}
                        </div>
                    </div>
                    <div className="element">
                        <div className="enter-box">
                        <h2>Lecture code:</h2>
                            {lectureCode}
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default CreateLecture;

// TODO
// zftechować kody po utworzeniu przez useEffect
// Może dać przycisk do kopiowania obok kodu wykładu