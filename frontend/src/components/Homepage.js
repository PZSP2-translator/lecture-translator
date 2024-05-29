import React from 'react';
import "./Homepage.css";
import { useState } from 'react';
import { useUser } from "./UserContext";
import { useNavigate  } from 'react-router-dom';

const HomePage = () => {
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const { user } = useUser();
    const navigate = useNavigate();

    const handleCreate = async () => {
        try {

            const requestBody = { title: title };

            if (user) {
                requestBody.lecturer_id = user.id;
            }
        const response = await fetch("http://localhost:5000/create_lecture", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
          if (!response.ok) {
            throw new Error("Error fetching data");
          }

          const data = await response.json();
          console.log(title)
          navigator.clipboard.writeText(data).then(() => alert(`Code for ${title} is \n ${data.lecturer_code} \n /it was copied to your clipboard/`))

          navigate(`/question/${data.lecture_id}`)
          } catch (error) {
          console.error("Error during creating lecture:", error);
          }
        };

    const handleJoin = async () => {
        try {
            const requestBody = { lecture_code: code };

            if (user) {
                requestBody.user_id = user.id;
            }
        const response = await fetch("http://localhost:5000/join_lecture", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
          if (!response.ok) {
            throw new Error("Error fetching data");
          }

          const data = await response.json();
          console.log(data.lecture_id)

          navigate(`/notes/${data.lecture_id}`)
          } catch (error) {
          console.error("Error during joining lecture:", error);
          }
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