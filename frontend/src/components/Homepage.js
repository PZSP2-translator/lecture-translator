import React from 'react';
import "./index.css";
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
        <div className="divider">
            <div className="element">
                <div className="component-title">Create a new Lecture</div>
                <div className="enter-box">
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
            <div className="element">
                <div className="component-title">Join Lecture by code</div>
                <div className="enter-box">
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