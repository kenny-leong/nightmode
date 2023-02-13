import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [showModals, setShowModals] = useState(false);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        {showModals && (
          <div className='modals'>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </li>
    );
  }

  return (
    <ul className='nav-bar'>
      <li>
        <i class="fa-brands fa-airbnb icon-logo"></i>
        <NavLink exact to="/" className='navbar-text'>airbnb</NavLink>
      </li>
      {isLoaded && (
        <li>
          <button className='upper-right-btn' onClick={() => setShowModals(!showModals)}>
            <i className="fas fa-bars" />
            <i className="fas fa-user-circle" />
          </button>
        </li>
      )}
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
