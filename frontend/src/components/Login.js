import React from "react";
import "./index.css";
import { useState } from "react";
import { Link } from 'react-router-dom';


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log(username, password);
  };
  return (
    <div className="component-container">
      <div className="component-title">Login</div>
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
      <Link to="/register">
        <button>
          Register
        </button>
      </Link>
    </div>
  );
}

export default Login;