import React from "react";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";
import {ip} from "../Resources.js";



function Login() {
  var bcrypt = require('bcryptjs');
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
    const response = await fetch(`${ip}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mail: username, pass_hash: bcrypt.hashSync(password, "$2a$04$AWG3GZ5xC83uLrcnbp6whu") })
    });

    if (!response.ok) {
      throw new Error("Error fetching data");
    }

    const data = await response.json();
    login({ username, id: data.user_id });

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