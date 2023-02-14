import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllSpots } from '../../store/spot';
import { Link } from 'react-router-dom';
import SingleSpot from '../SingleSpot';
import './AllSpots.css';



function LoggedInLanding() {
    const dispatch = useDispatch();

    const allSpots = useSelector(state => state.spot.allSpots)
    const spotArr = Object.values(allSpots);

    //populate store with spots
    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);


    return (
        <div className='all-spots-div'>
            {spotArr.map((spot) => {
                return (
                    <div key={spot.id} className='single-spot-div'>
                        <Link key={spot.id} to={`/spots/${spot.id}`}>
                            <SingleSpot spot={spot} />
                        </Link>
                    </div>
                )
            })}
        </div>
    )

}


export default LoggedInLanding;
