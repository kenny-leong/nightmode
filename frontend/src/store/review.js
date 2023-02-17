//session.js
// frontend/src/store/session.js
import { csrfFetch } from './csrf';


// ---------------------action creators-------------------

const loadReviews = reviews => ({
    type: 'LOAD_CURRENT_REVIEWS',
    reviews
});

const deleteReview = () => ({
    type: 'DELETE_REVIEW'
});

const addReview = review => ({
    type: 'ADD_REVIEW',
    review
});

const loadSpotReviews = reviews => ({
    type: 'LOAD_SPOT_REVIEWS',
    reviews
})



// ---------------------thunk action creators-------------------

// GET CURRENT USER'S REVIEWS
export const getCurrentReviews = () => async dispatch => {
    const res = await csrfFetch(`/api/reviews/current`);

    if (res.ok) {
        const currReviews = await res.json();
        dispatch(loadReviews(currReviews));
    }
}

// GET REVIEWS BY SPOT ID
export const getSpotReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
        const spotReviews = await res.json();
        console.log(spotReviews)
        dispatch(loadSpotReviews(spotReviews.Reviews));
    }
}

// DELETE A REVIEW
export const removeReview = (reviewId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteReview());
    }
}

// POST A REVIEW BY SPOT ID
export const postReview = (spotId, newReview, sessionUser) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newReview)
    });

    if (res.ok) {
        const postedReview = await res.json();
        //add user to spotReview for formatting
        postedReview.User = {
            id: sessionUser.id,
            firstName: sessionUser.firstName,
            lastName: sessionUser.lastName
        }
        dispatch(addReview(postedReview));
    }
}



// --------------------- review reducer -------------------
const initialState = { currReviews: null}

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_CURRENT_REVIEWS':
            const currReviews = {};
            const reviewArr = Object.values(action.reviews)[0];
            reviewArr.forEach(review => {
                currReviews[review.id] = review;
            });
            return {
                ...state,
                currReviews: currReviews
            };
        case 'LOAD_SPOT_REVIEWS':
            const allReviews = {};
            const reviewsArr = Object.values(action.reviews);
            reviewsArr.forEach(review => {
                allReviews[review.id] = review;
            });
            return {
                ...state,
                spot: allReviews
            }

        case 'ADD_REVIEW':
            const spotReviews = { ...state.spot };
            spotReviews[action.review.id] = action.review
            return {
                ...state,
                spot: spotReviews
            }
        case 'DELETE_REVIEW':
            const newSpotReviews = {...state.spot};
            delete newSpotReviews[action.reviewId]
            return {
                ...state,
                spot: newSpotReviews
            }
        default:
            return state;
    }
}

export default reviewReducer;
