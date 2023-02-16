// frontend/src/components/LoginFormModal/index.js
import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteUserSpot } from "../../store/spot";
import { useHistory } from 'react-router-dom';
import { getUserSpots } from '../../store/spot';
import './DeleteModal.css'

function DeleteModal({ spot }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();


  const yesDelete = (e) => {
    e.preventDefault();
    dispatch(deleteUserSpot(spot))
        .then(() => {
            history.push('/spots/current');
            closeModal();
            dispatch(getUserSpots());
        })
    }

  const doNotDelete = (e) => {
    closeModal();
  }



  return (
    <div className='delete-spot-modal'>
        <h1 className="form-text form-header">Confirm Delete</h1>
        <p>Are you sure you want to remove this spot?</p>
        <div className="delete-btn-options">
            <button className="delete-modal-yes" onClick={yesDelete}>Yes (Delete Spot)</button>
            <button className="delete-modal-keep" onClick={doNotDelete}>No (Keep Spot)</button>
        </div>
    </div>
  );
}

export default DeleteModal;
