import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect, useState } from 'react';
import { postReview, getSpotReviews } from "../../store/review";
import { getSpotDetails } from '../../store/spot';
import './PostReview.css'


function PostReview({ spotId }) {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0)
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const sessionUser = useSelector(state => state.session.user);

    const handleStarClick = (value) => {
        setRating(value);
    };

    useEffect(() => {

    })

    const handleSubmit = (e) => {
        e.preventDefault();

        const newReview = {
            review: review,
            stars: rating
        }

        dispatch(postReview(spotId, newReview, sessionUser))
            .then(() => {
                closeModal();
                dispatch(getSpotReviews(spotId))
                dispatch(getSpotDetails(spotId))
            })
    }

    return (
        <div className="post-modal">
            <h1 className="review-header">How was your stay?</h1>
            <textarea
                className="stay-describe"
                placeholder="Leave your review here . . . . "
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <div className="star-rating">
                <span className={rating >= 1 ? "star-filled" : "star-empty"} onClick={() => handleStarClick(1)}>★</span>
                <span className={rating >= 2 ? "star-filled" : "star-empty"} onClick={() => handleStarClick(2)}>★</span>
                <span className={rating >= 3 ? "star-filled" : "star-empty"} onClick={() => handleStarClick(3)}>★</span>
                <span className={rating >= 4 ? "star-filled" : "star-empty"} onClick={() => handleStarClick(4)}>★</span>
                <span className={rating >= 5 ? "star-filled" : "star-empty"} onClick={() => handleStarClick(5)}>★</span>
                <span className="star-text">Stars</span>
            </div>
            <button
                className="submit-review"
                disabled={rating === 0 || review.length < 10}
                onClick={handleSubmit}>
                    Submit Review
            </button>
        </div>
    )
}


export default PostReview
