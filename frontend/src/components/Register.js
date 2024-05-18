import React from "react";
import "./Register.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ first_name: firstname, last_name: lastname, mail: username, pass_hash: password })
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      navigate(`/login`);

      } catch (error) {
      console.error("Error during registration:", error);
      }
    };



  return (
    <div className="component-container-register">
      <div className="component-title-register">Register</div>
      <input
          type="text"
          placeholder="First name"
          id="firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
      />
      <input
          type="text"
          placeholder="Last name"
          id="lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
      />
      <input
          type="text"
          placeholder="Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
      />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit"
        onClick={handleRegister}>Confirm
      </button>
    </div>
  );
}

export default Register;


//   TODO
//   - connection with API to register user
//   - hashing the password before sending it
