//session.js
// frontend/src/store/session.js
import { csrfFetch } from './csrf';


// action creators
const loadSpots = spots => ({
    type: 'LOAD_SPOTS',
    spots
});



// thunk action creators
export const getAllSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const allSpots = await res.json();
        dispatch(loadSpots(allSpots));
    }
}

const initialState = { allSpots: null, spot: null };

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
        default:
            return state;
    }
}

export default spotReducer;
