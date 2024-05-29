import React from 'react';
import './Header.css';
import logoImage from './pzsp2icon.png';
import { Link, useNavigate  } from 'react-router-dom';
import {useUser} from './UserContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout()
    navigate("/")
  };

  return (
    <header className='container'>
        <div className="navbar">
        <Link to="/">
          <img src={logoImage} alt="Home" className="image" />
        </Link>
          <Link to="/notes/-1" className='no-underscore'>
            <div className="frame">
              <div className="link">Notes</div>
            </div>
          </Link>
          <Link to="/question" className='no-underscore'>
            <div className="frame">
              <div className="link">Questions</div>
            </div>
          </Link>
          {user && (
            <>
              <Link to="/history" className='no-underscore'>
              <div className="frame">
                <div className="link">History</div>
              </div>
            </Link>
            </>
          )
          }
          {!user && (
            <>
              <Link to="/login" className='no-underscore'>
              <div className="frame">
                <div className="link">Login</div>
              </div>
              </Link>
            </>
          )}
            {user && (
            <>
              <Link to="/passwd" className='no-underscore'>
              <div className="frame">
                <div className="link">Reset Pass</div>
              </div>
              </Link>
              <div className="frame">
              <div className="link" onClick={handleLogout}>Logout</div>
              </div>
              </>
          )}


        </div>
    </header>
  );
}

export default Header;
