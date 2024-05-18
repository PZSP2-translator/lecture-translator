import React from "react";
import "./Password.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";


function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();


  const handleChange = async () => {
    console.log(user.id)
    console.log(password)
    if (password === confirm){
      try {
        const response = await fetch("http://localhost:5000/change_pass", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user_id: user.id, password: password})
        });

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        navigate(`/`);

        } catch (error) {
        console.error("Error during registration:", error);
        }
    }
    else{
        console.log("Different")
    }
    };

  return (
    <div className="component-container-password">
      <div className="component-title-password">Change password</div>
      <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
      />
        <input
          type="password"
          placeholder="Confirm Password"
          id="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
      />
      <button type="submit"
        onClick={handleChange}>Confirm
      </button>
    </div>
  );
}

export default ChangePassword;