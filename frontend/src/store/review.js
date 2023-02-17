//session.js
// frontend/src/store/session.js
import { csrfFetch } from './csrf';


// ---------------------action creators-------------------

const loadReviews = reviews => ({
    type: 'LOAD_CURRENT_REVIEWS',
    reviews
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
        default:
            return state;
    }
}

export default reviewReducer;
