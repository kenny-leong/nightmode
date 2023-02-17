import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from 'react';
import { postReview, getSpotReviews, getCurrentReviews } from "../../store/review";
import { getSpotDetails } from '../../store/spot';
import './PostReview.css'


function PostReview({ spot }) {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const sessionUser = useSelector(state => state.session.user);

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleStarHover = (value) => {
        setHoverRating(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newReview = {
            review: review,
            stars: rating
        }

        dispatch(postReview(spot.id, newReview, sessionUser))
            .then(() => {
                closeModal();
                dispatch(getSpotDetails(spot.id))
                dispatch(getSpotReviews(spot.id))
                getCurrentReviews()
            });
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
            <span
                    className={rating >= 1 || hoverRating >= 1 ? "star-filled" : "star-empty"}
                    onClick={() => handleStarClick(1)}
                    onMouseEnter={() => handleStarHover(1)}
                    onMouseLeave={() => handleStarHover(0)}
                >★</span>
                <span
                    className={rating >= 2 || hoverRating >= 2 ? "star-filled" : "star-empty"}
                    onClick={() => handleStarClick(2)}
                    onMouseEnter={() => handleStarHover(2)}
                    onMouseLeave={() => handleStarHover(0)}
                >★</span>
                <span
                    className={rating >= 3 || hoverRating >= 3 ? "star-filled" : "star-empty"}
                    onClick={() => handleStarClick(3)}
                    onMouseEnter={() => handleStarHover(3)}
                    onMouseLeave={() => handleStarHover(0)}
                >★</span>
                <span
                    className={rating >= 4 || hoverRating >= 4 ? "star-filled" : "star-empty"}
                    onClick={() => handleStarClick(4)}
                    onMouseEnter={() => handleStarHover(4)}
                    onMouseLeave={() => handleStarHover(0)}
                >★</span>
                <span
                    className={rating >= 5 || hoverRating >= 5 ? "star-filled" : "star-empty"}
                    onClick={() => handleStarClick(5)}
                    onMouseEnter={() => handleStarHover(5)}
                    onMouseLeave={() => handleStarHover(0)}
                >★</span>
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
