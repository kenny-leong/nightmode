import './ManageItem.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteUserSpot } from '../../store/spot';
import { useHistory } from 'react-router-dom';
import { getUserSpots } from '../../store/spot';
import OpenModalButton from '../OpenModalButton';
import DeleteModal from '../DeleteModal';



function ManageSpotItem({ spot }) {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteUserSpot(spot))
            .then(() => {
                history.push('/spots/current');
                dispatch(getUserSpots());
            })
    }

    if (spot.previewImage === 'Image not set.') {
        spot.previewImage = 'https://us.123rf.com/450wm/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016/167492439-no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image.jpg?ver=6';
    }

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
                    <button className='update-btn'>
                        <Link className='manage-update-text' exact='true' to={`/spots/${spot.id}/edit`}>Update</Link>
                    </button>
                    <button className='delete-btn' onClick={handleDelete}>Delete</button>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteModal />}
                    />
                </div>
            </div>
        </div>
    )
}


export default ManageSpotItem;
