// frontend/src/components/LoginFormModal/index.js
import React from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './DeleteModal.css'

function DeleteModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    // return dispatch(sessionActions.login({ credential, password }))
    //   .then(closeModal)
  };

  const demoUser = (e) => {
    e.preventDefault();
  }

  const closeDelete = (e) => {
    e.preventDefault();
    return closeModal();
  }



  return (
    <div className='delete-spot-modal'>
        <h1 className="form-text form-header">Confirm Delete</h1>
        <p>Are you sure you want to remove this spot?</p>
        <div className="delete-btn-options">
            <button className="delete-modal-yes" onClick={null}>Yes (Delete Spot)</button>
            <button className="delete-modal-keep" onClick={closeDelete}>No (Keep Spot)</button>
        </div>
    </div>
  );
}

export default DeleteModal;
