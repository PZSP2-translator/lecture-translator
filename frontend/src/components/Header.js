import React from 'react';
import './Header.css';
import logoImage from './pzsp2icon.png';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='container'>
        <div className="navbar">
        <Link to="/">
          <img src={logoImage} alt="Home" className="image" />
        </Link>
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
          <Link to="/codes" className='no-underscore'>
            <div className="frame">
              <div className="link">Codes</div>
            </div>
          </Link>
          <Link to="/passwd" className='no-underscore'>
            <div className="frame">
              <div className="link">Reset Pass</div>
            </div>
          </Link>

          <Link to="/login" className='no-underscore'>
            <div className="frame">
              <div className="link">Login</div>
            </div>
          </Link>


        </div>
    </header>
  );
}

export default Header;
