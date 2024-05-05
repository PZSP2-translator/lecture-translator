import React from "react";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    navigate("/register")
  };



  const handleLogin = () => {
    console.log(username, password);
  };
  return (
    <div className="component-container-login">
      <div className="component-title-login">Login</div>
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
        onClick={handleLogin}>Confirm
      </button>
      <button on onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default Login;