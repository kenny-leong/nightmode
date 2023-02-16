import { useSelector, useDispatch } from 'react-redux';
import { getUserSpots } from '../../store/spot';
import { Link } from 'react-router-dom';
import ManageSpotItem from '../ManageSpotItem';
import './ManageSpots.css';
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

    return (
        <div className='manage-spots-full-div'>
            <h2 className='manage-h2'>Manage Your Spots</h2>
            <button className='create-spot-btn'>
                <Link exact='true' to='/spots/new' className='create-spot-link-text'>
                    Create a New Spot
                </Link>
            </button>
            <div className='spot-items-div'>
                {userSpotArr.map((spot) => {
                    return (
                        <div key={spot.id} className='manage-spot-item-div'>
                            <Link key={spot.id} to={`/spots/${spot.id}`}>
                                <ManageSpotItem spot={spot}/>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )


}

export default ManageSpots;
