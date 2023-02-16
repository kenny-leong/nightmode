import './ManageItem.css'




function ManageSpotItem({ spot }) {


    return (
        <div className='manage-container'>
            <img className="manage-img" src={`${spot.previewImage}`} alt={`${spot.name}`} />
            <div className="manage-loc-and-rating">
                <span className='manage-loc'>{spot.city}, {spot.state}</span>
                <span className='manage-rating'>
                    <i className="fa-sharp fa-solid fa-star"></i>
                    {spot.avgRating === null ? <span className='manage-int'>New</span> : <span className='manage-int'>{parseInt(spot.avgRating).toFixed(1)}</span>}
                </span>
            </div>
            <div className="bottom-section">
                <p className='manage-price'>{`$${spot.price} /night`}</p>
                <div>
                    <button className='update-btn'>Update</button>
                    <button className='delete-btn'>Delete</button>
                </div>
            </div>
        </div>
    )
}


export default ManageSpotItem;
