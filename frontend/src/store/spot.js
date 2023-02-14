//session.js
// frontend/src/store/session.js
import { csrfFetch } from './csrf';


// action creators
const loadSpots = spots => ({
    type: 'LOAD_SPOTS',
    spots
});

const loadDetails = spot => ({
    type: 'LOAD_DETAILS',
    spot
});



// thunk action creators
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
        default:
            return state;
    }
}

export default spotReducer;
