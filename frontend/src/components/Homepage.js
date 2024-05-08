import React from 'react';
import "./Homepage.css";
import { useState } from 'react';

const HomePage = () => {
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");

    const handleCreate = () => {
        console.log(title);
      };

    const handleJoin = () => {
        console.log(code);
      };

    return (
        <div className="divider-homepage">
            <div className="element-homepage">
                <div className="component-title-homepage">Create a new Lecture</div>
                <div className="enter-box-homepage">
                    <h2>Lecture name:</h2>
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
                    <h2>Lecture code:</h2>
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