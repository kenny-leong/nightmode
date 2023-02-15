import './SingleSpot.css'


function SingleSpot({ spot }) {

    if (spot.previewImage === 'Image not set.') {
        spot.previewImage = 'https://us.123rf.com/450wm/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016/167492439-no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image.jpg?ver=6';
    }

    return (
        <div className='spot-container'>
            <img className="spot-img" src={`${spot.previewImage}`} alt={`${spot.name}`} />
            <div className="spot-loc-and-rating">
                <span className='loc'>{spot.city}, {spot.state}</span>
                <span className='rating'>
                    <i className="fa-sharp fa-solid fa-star"></i>
                    {!isNaN(spot.avgRating) ? <span className='int'>{parseInt(spot.avgRating).toFixed(1)}</span> : <span className='int'>New</span>}
                </span>
            </div>
            <div className="spot-price-div">
                <p className='price'>{`$${spot.price} /night`}</p>
            </div>
        </div>
    )
}


export default SingleSpot;
