import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="container">
      <div className="navbar">
        <div className="image" />
        <div className="frame">
          <div className="link">Open</div>
        </div>
        <div className="frame">
          <div className="link">Logout</div>
        </div>
        <div className="frame">
          <div className="link">Reset Pass</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
