// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();

          if (data && data.message) {
            let errMsg = Object.values(data.message);
            errMsg = errMsg.join('');
            errMsg = [errMsg];
            setErrors(errMsg);
          }
        }
      );
  };

  const demoUser = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ "credential": "Demo-lition", "password": "password" }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  }



  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <h1 className="login-text">Log In</h1>
        <ul className="login-errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label className="email-text">
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
        </label>
        <label className="pw-text">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="login-submit-btn" type="submit" disabled={credential.length < 4 || password.length < 6} >Log In</button>
        <button className="demo-user-btn" onClick={demoUser}>Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
