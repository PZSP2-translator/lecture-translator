import React from "react";
import "./Register.css";
import { useState } from "react";


function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log(firstname, lastname, username, password);
  };
  return (
    <div className="component-container">
      <div className="component-title">Register</div>
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
