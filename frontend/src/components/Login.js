import React from "react";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useUser();
  const handleRegister = () => {
    navigate("/register")
  };

  // Dodać hashowanie hasła jako funkcja w module utils
  const handleLogin = async () => {
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mail: username, pass_hash: password })
    });

    if (!response.ok) {
      throw new Error("Error fetching data");
    }

    const data = await response.json();
    login({ username, id: data });

    } catch (error) {
    console.error("Error during logging in:", error);
    }
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