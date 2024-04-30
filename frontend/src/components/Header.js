import React from 'react';
import './Header.css';
import logoImage from './pzsp2icon.png';

const Header = () => {
  return (
    <header className='container'>
        <div className="navbar">
        <img src={logoImage} alt="Home" className="image" />
          <div className="frame">
            <div className="link">Open</div>
          </div>
          <div className="frame">
            <div className="link">Logout</div>
          </div>
          <div className="frame">
            <div className="link">Reset Pass</div>
          </div>
          <div className="frame">
            <div className="link">Reset Pass</div>
          </div>
          <div className="frame">
            <div className="link">Reset Pass</div>
          </div>
          <div className="frame">
            <div className="link">Reset Pass</div>
          </div>
          <div className="frame">
            <div className="link">Reset Pass</div>
          </div>

        </div>
    </header>
  );
}

export default Header;
