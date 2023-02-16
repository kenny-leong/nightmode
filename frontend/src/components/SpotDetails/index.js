import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSpotDetails } from '../../store/spot';
import './SpotDetails.css';


const SpotDetails = () => {
    const { spotId } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
    }, [dispatch, spotId]);


    const spot = useSelector(state => state.spot.oneSpot);

    if (!spot) return null;

    const spotImgArr = spot.SpotImages;
    let mainUrlImg;

    const noPhoto = 'https://us.123rf.com/450wm/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016/167492439-no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image.jpg?ver=6'

    if (spot.SpotImages[0]) mainUrlImg = spot.SpotImages[0].url;
    else mainUrlImg = noPhoto;

    const smallImgArr = spotImgArr.slice(1, 5); //grab the first 4 images after the main img
    const smallUrlArr = []; //grab existing data urls

    if (smallImgArr.length) {
        for (let img of smallImgArr) {
            smallUrlArr.push(img.url)
        }
    }

    const dupesNeeded = 4 - smallUrlArr.length;

    for (let i=0; i<dupesNeeded; i++) {
        smallUrlArr.push(noPhoto);
    }

    const inlineDivOne = (
        <div className='inline-div-one'>
            <img src={smallUrlArr[0]} className='sub-img' alt={spot.name}></img>
            <img src={smallUrlArr[1]} className='sub-img' alt={spot.name}></img>
        </div>
    );

    const inlineDivTwo = (
        <div className='inline-div-two'>
            <img src={smallUrlArr[2]} className='sub-img' alt={spot.name}></img>
            <img src={smallUrlArr[3]} className='sub-img' alt={spot.name}></img>
        </div>
    );

    const handleReserve = (e) => {
        e.preventDefault();
        window.alert('Feature Coming Soon...');
      }

    return (
        <div className='full-div'>
            <div className='name-city-div'>
                <h2>{spot.name}</h2>
                <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
            </div>
            <div className='imgs-div'>
                <img src={mainUrlImg} className='main-img' alt={spot.name}></img>
                <div className='quad-square'>
                    {inlineDivOne}
                    {inlineDivTwo}
                </div>
            </div>
            <div className='middle-section'>
                <div className='description'>
                    <h2>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
                    <p>{spot.description}</p>
                </div>
                <div className='reserve-div'>
                    <div className='pricing-and-review'>
                        <span className='price-per-night'>{`$${spot.price} /night`}</span>
                        <span className='review'>
                            <i className="fa-sharp fa-solid fa-star"></i>
                            {(spot.avgStarRating === null) ? <span>New</span> : <span>{parseInt(spot.avgStarRating).toFixed(1)}</span>}
                        </span>
                    </div>
                    <button className='reserve-btn' onClick={handleReserve}>Reserve</button>
                </div>
            </div>
        </div>
    )


}

export default SpotDetails;
