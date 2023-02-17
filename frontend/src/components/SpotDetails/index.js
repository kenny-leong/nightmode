import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSpotDetails, getSpotReviews } from '../../store/spot';
import { getCurrentReviews } from '../../store/review';
import OpenModalButton from '../OpenModalButton';
import PostReview from '../PostReview';
import DeleteReview from '../DeleteReview';
import './SpotDetails.css';


const SpotDetails = () => {
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
        dispatch(getSpotReviews(spotId));
        dispatch(getCurrentReviews());
      }, [dispatch, spotId, sessionUser]);

    const spot = useSelector(state => state.spot.oneSpot);
    let reviews = useSelector(state => state.spot.spotReviews);
    let currReviews = useSelector(state => state.review.currReviews);


    if (!spot || !reviews || !currReviews) return null;

    currReviews = Object.values(currReviews);
    console.log(reviews, sessionUser)

    let buttonEnable;

    for (let review of currReviews) {
        if (review.spotId === parseInt(spotId)) {
            buttonEnable = false;
            break;
        } else {
            buttonEnable = true;
        }
    }

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
                        <span className='spot-rating-avg'>
                            <i className="fa-sharp fa-solid fa-star"></i>
                            {(spot.avgStarRating === null) ? <span className='avg-star-rating'>New</span> : <span className='avg-star-rating'>{parseInt(spot.avgStarRating).toFixed(1)}</span>}
                        </span>
                        {spot.numReviews > 0 && (
                            <span className='num-reviews'>
                                {spot.numReviews === 1 ? '1 review' : `${spot.numReviews} reviews`}
                            </span>
                        )}
                    </div>
                    <button className='reserve-btn' onClick={handleReserve}>Reserve</button>
                </div>
            </div>
            <div className='review-details'>
                <div className='review-rating-bottom'>
                    <div className='bottom-avg-rating'>
                        <i className="fa-sharp fa-solid fa-star"></i>
                        {(spot.avgStarRating === null) ? <span className='rating-float'>New</span> : <span className='rating-float'>{parseInt(spot.avgStarRating).toFixed(1)}</span>}
                        <span>
                            {spot.numReviews > 0 ? (
                                spot.numReviews === 1 ? '1 review' : `${spot.numReviews} reviews`
                                ) : null}
                        </span>
                    </div>
                </div>
                {(buttonEnable) && (sessionUser) && (
                    <div className='modal-post-review'>
                    <OpenModalButton
                        buttonText="Post Your Review"
                        modalComponent={<PostReview spotId={spotId}/>}
                        className='post-review-btn'
                />
                    </div>
                )}
                {(spot.numReviews === 0) ? <p className='review-describe'>Be the first to post a review!</p> : null}
            </div>
            {reviews && reviews.map((reviewObj, index) => (
                <div key={index} className='review-div-map'>
                    <h1>{reviewObj.User.firstName} {reviewObj.User.lastName}</h1>
                    <span>{new Date(reviewObj.createdAt).toISOString().split('T')[0]}</span>
                    <p>{reviewObj.review}</p>
                    {(reviewObj.userId === sessionUser.id) && (
                        <OpenModalButton
                            buttonText="Delete"
                            modalComponent={<DeleteReview reviewId={reviewObj.id} spotId={spotId}/>}
                            className='delete-review-btn'
                        />
                    )}
                </div>
            ))}
        </div>
    )


}

export default SpotDetails;
