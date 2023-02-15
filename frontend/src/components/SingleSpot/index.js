import './SingleSpot.css'


function SingleSpot({ spot }) {
    return (
        <div className='spot-container'>
            <img className="spot-img" src={`${spot.previewImage}`} alt={`${spot.name}`} />
            <div className="spot-loc-and-rating">
                <span className='loc'>{spot.city}, {spot.state}</span>
                <span className='rating'>
                    <i className="fa-sharp fa-solid fa-star"></i>
                    {!isNaN(spot.avgRating) ? <span>{parseInt(spot.avgRating).toFixed(1)}</span> : <span>New</span>}
                </span>
            </div>
            <div className="spot-price-div">
                <p className='price'>{`$${spot.price} /night`}</p>
            </div>
        </div>
    )
}


export default SingleSpot;
