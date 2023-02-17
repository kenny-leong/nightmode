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



// ---------------------thunk action creators-------------------

// GET CURRENT USER'S REVIEWS
export const getCurrentReviews = () => async dispatch => {
    const res = await csrfFetch(`/api/reviews/current`);

    if (res.ok) {
        const currReviews = await res.json();
        dispatch(loadReviews(currReviews));
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



// --------------------- review reducer -------------------
const initialState = { currentUserReviews: null}

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
        case 'DELETE_REVIEW':
            const newState = {...state};
            return newState;
        default:
            return state;
    }
}

export default reviewReducer;
