// frontend/src/components/LoginFormModal/index.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeReview, getSpotReviews } from '../../store/review';
import './DeleteReview.css'

function DeleteReview({ reviewId, spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();


  useEffect(() => {
    //rerender upon spot changing
  }, [spot])

  const yesDelete = (e) => {
    e.preventDefault();

    dispatch(removeReview(reviewId))
        .then(() => {
            closeModal();
            dispatch(getSpotReviews(spot.id))
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
