import React from 'react';
import "./Homepage.css";
import { useState } from 'react';



const HomePage = () => {
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");

        const course = {
            course_id: 0,
            name: title,
            code: 0,
            date: 0
        };

    const handleCreate = () => {
        fetch('http://localhost:5000/createCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        })
        .then(response => response.json())
.then(data => {
    navigator.clipboard.writeText(data)
    .then(() => alert(`Course code for ${title} is \n ${data} \n /it was copied to your clipboard/`))
    .catch((error) => console.error('Error:', error));
    return data;
})
.catch((error) => console.error('Error:', error));
      };

    const handleJoin = () => {
        fetch('http://localhost:5000/joinCourse', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "code": code
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.href = `/notes/${data.code}`;
        })
        .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="divider-homepage">
            <div className="element-homepage">
                <div className="component-title-homepage">Create a new Lecture</div>
                <div className="enter-box-homepage">
                    <h2>Lecuture name:</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <button type="submit"
                    onClick={handleCreate}>Create
                </button>
            </div>
            <div className="element-homepage">
                <div className="component-title-homepage">Join Lecture by code</div>
                <div className="enter-box-homepage">
                    <h2>Lecuture code:</h2>
                    <input
                        type="text"
                        placeholder="Code"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>
                <button type="submit"
                    onClick={handleJoin}>Join
                </button>
            </div>
        </div>
    );
};

export default HomePage;