// frontend/src/components/LoginFormModal/index.js
import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeReview } from '../../store/review';
import { getSpotReviews } from '../../store/spot';
import './DeleteReview.css'

function DeleteReview({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();


  const yesDelete = (e) => {
    e.preventDefault();

    dispatch(removeReview(reviewId))
        .then(() => {
            closeModal();
            dispatch(getSpotReviews(spotId));
        });
    }

  const doNotDelete = (e) => {
    e.preventDefault();
    closeModal();
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
