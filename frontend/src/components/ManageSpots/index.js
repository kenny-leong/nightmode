import { useSelector, useDispatch } from 'react-redux';
import { getUserSpots } from '../../store/spot';
import { useEffect } from 'react';

function ManageSpots() {
    const dispatch = useDispatch();

    // populate current user's spots
    useEffect(() => {
        dispatch(getUserSpots())
    }, [dispatch])


    const userSpots = useSelector(state => state.spot.userSpots);

    if (!userSpots) return null

    const userSpotArr = Object.values(userSpots);

    console.log(userSpotArr)

    return (
        <>
            <h1>Manage Spots</h1>
        </>
    )


}

export default ManageSpots;
