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

const addSpotImages = (spot, spotImages) => ({
    type: 'ADD_SPOT_IMGS',
    payload: {
        spot,
        spotImages
    }
})



// -------------------------------------- thunk action creators -----------------------------------
export const getAllSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const allSpots = await res.json();
        dispatch(loadSpots(allSpots));
    }
}

export const getSpotDetails = (id) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${id}`);

    if (res.ok) {
        const oneSpot = await res.json();
        dispatch(loadDetails(oneSpot));
    }
}

export const createSpot = (spot, spotImages) => async dispatch => {

    //Spot Creation
    const spotRes = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    });

    if (spotRes.ok) {
        const spot = await spotRes.json();
        dispatch(addSpot(spot));
    }

    // Add the images to the Spot one at a time
    const spotImgArr = [];

    for (let img of spotImages) {
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
    return spot;
}







const initialState = { allSpots: null, oneSpot: null };

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
                singleSpot: {
                    ...action.spot
                }
            }
        case 'ADD_SPOT_IMGS':
            return {
                ...state,
                singleSpot: {
                    ...action.payload.spot,
                    SpotImages: action.payload.spotImages
                }
            }
        default:
            return state;
    }
}

export default spotReducer;
