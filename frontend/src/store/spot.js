//session.js
// frontend/src/store/session.js
import { csrfFetch } from './csrf';


// ----------------------------------- action creators ----------------------------------------
const loadSpots = spots => ({
    type: 'LOAD_SPOTS',
    spots
});

const loadDetails = spot => ({
    type: 'LOAD_DETAILS',
    spot
});

const addSpot = spot => ({
    type: 'ADD_SPOT',
    spot
});

const deleteSpot = () => ({
    type: 'DELETE_SPOT'
});

const editSpot = (spot) => ({
    type: 'EDIT_SPOT',
    spot
});

const addSpotImages = (spot, spotImages) => ({
    type: 'ADD_SPOT_IMGS',
    payload: {
        spot,
        spotImages
    }
});

const loadUserSpots = userSpots => ({
    type: 'LOAD_USER_SPOTS',
    userSpots
});

const loadSpotReviews = (spotReviews) => ({
    type: 'LOAD_SPOT_REVIEWS',
    spotReviews
})

const addReview = review => ({
    type: 'ADD_REVIEW',
    review
});



// -------------------------------------- thunk action creators -----------------------------------

// GET ALL SPOTS
export const getAllSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const allSpots = await res.json();
        dispatch(loadSpots(allSpots));
    }
}

// GET SPOT DETAILS
export const getSpotDetails = (id) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${id}`);

    if (res.ok) {
        const oneSpot = await res.json();
        dispatch(loadDetails(oneSpot));
    }
}

// CREATE A NEW SPOT
export const createSpot = (spot) => async dispatch => {

    const spotRes = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    });

    let newSpot;

    if (spotRes.ok) {
        newSpot = await spotRes.json();
        newSpot.Owner = spot.Owner;
        dispatch(addSpot(newSpot));
    }

    return newSpot;
}

// ADD SPOT IMAGES TO AN EXISTING SPOT
export const addSpotImgs = (spot, imgArr) => async dispatch => {

    const spotImgArr = [];

    for (let img of imgArr) {
        const imgRes = await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(img)
        });

        if (imgRes.ok) {
            const spotImg = await imgRes.json();
            spotImgArr.push(spotImg);
        }
    }

    dispatch(addSpotImages(spot, spotImgArr));
}

// UPDATE EXISTING SPOT
export const editSpotDetails = (spot) => async dispatch => {

    const spotRes = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    });

    let newSpot;

    if (spotRes.ok) {
        newSpot = await spotRes.json();
        newSpot.Owner = spot.Owner;
        newSpot.SpotImages = spot.SpotImages;
        dispatch(editSpot(newSpot));
    }

    return newSpot;
}


// GET SPOTS OF LOGGED IN USER
export const getUserSpots = () => async dispatch => {
    const res = await csrfFetch(`/api/spots/current`);

    if (res.ok) {
        const userSpots = await res.json()
        dispatch(loadUserSpots(userSpots));
    }
}

// DELETE A SPOT
export const deleteUserSpot = (spot) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteSpot(spot.id))
    }
}

// GET REVIEWS BY SPOT ID
export const getSpotReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
        const spotReviews = await res.json();
        dispatch(loadSpotReviews(spotReviews.Reviews));
    }
}

// POST A REVIEW BY SPOT ID
export const postReview = (spotId, newReview) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newReview)
    });

    if (res.ok) {
        const postedReview = await res.json();
        postedReview.User = newReview.User;
        dispatch(addReview(postedReview));
        console.log(postedReview)
    }
}





// --------------------- SPOT REDUCER ----------------------------------------
const initialState = { allSpots: null, oneSpot: null, userSpots: null };

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_SPOTS':
            const allSpots = {};
            const spotsArr = Object.values(action.spots)[0];
            spotsArr.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            return {
                ...state,
                allSpots: allSpots
            };
        case 'LOAD_DETAILS':
            const oneSpot = action.spot;
            return {
                ...state,
                oneSpot: oneSpot
            }
        case 'ADD_SPOT':
            return {
                ...state,
                oneSpot: {
                    ...action.spot
                }
            }
        case 'ADD_SPOT_IMGS':
            return {
                ...state,
                oneSpot: {
                    ...action.payload.spot,
                    SpotImages: action.payload.spotImages
                }
            }
        case 'LOAD_USER_SPOTS':
            const currentUserSpots = {};
            const userSpotsArr = action.userSpots.Spots
            userSpotsArr.forEach(spot => {
                currentUserSpots[spot.id] = spot;
            });
            return {
                ...state,
                userSpots: currentUserSpots
            }
        case 'DELETE_SPOT':
            const newState = {...state};
            return newState;
        case 'EDIT_SPOT':
            return {
                ...state,
                oneSpot: {
                    ...action.spot
                }
            }
        case 'LOAD_SPOT_REVIEWS':
            return {
                ...state,
                spotReviews: action.spotReviews
            }
        case 'ADD_REVIEW':
            const newReview = {};
            newReview[action.review.id] = action.review;
            return {
                ...state,
                spotReviews: {
                    Reviews: [newReview, state.spotReviews.Reviews]
                }
            }
        default:
            return state;
    }
}

export default spotReducer;
