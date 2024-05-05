import React from 'react';
import "./CreateLecture.css";
import { useState } from 'react';

const CreateLecture = () => {
    const [title, SetTitle] = useState("Temp");
    const [studentCode, SetStudentCode] = useState("23132");
    const [lectureCode, SetLectureCode] = useState("12312");

    return (
        <div className="component-container-createlecture">
            <div className="component-title-createlecture">{title}</div>
                <div className="divider-createlecture">
                    <div className="element-createlecture">
                        <div className="enter-box-createlecture">
                            <h2>Student code:</h2>
                            {studentCode}
                        </div>
                    </div>
                    <div className="element-createlecture">
                        <div className="enter-box-createlecture">
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