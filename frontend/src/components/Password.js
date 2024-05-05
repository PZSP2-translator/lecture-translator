import React from "react";
import "./Password.css";
import { useState } from "react";


function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleChange = () => {
    if (password === confirm){
        console.log("Same")
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