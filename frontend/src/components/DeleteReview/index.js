// frontend/src/components/LoginFormModal/index.js
import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';
import { getUserSpots } from '../../store/spot';
import './DeleteReview.css'

function DeleteReview({ reviewId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();


  const yesDelete = (e) => {
    e.preventDefault();
    // dispatch(deleteUserSpot(spot))
    //     .then(() => {
    //         history.push('/spots/current');
    //         closeModal();
    //         dispatch(getUserSpots());
    //     })
    }

  const doNotDelete = (e) => {
    closeModal();
    history.push('/spots/current');
  }



  return (
    <div className='delete-review-modal'>
        <h1 className="delete-review-header">Confirm Delete</h1>
        <p>Are you sure you want to remove this review?</p>
        <div className="delete-review-options">
            <button className="delete-review-yes" onClick={yesDelete}>Yes (Delete Review)</button>
            <button className="delete-review-keep" onClick={doNotDelete}>No (Keep Review)</button>
        </div>
    </div>
  );
}

export default DeleteReview;
