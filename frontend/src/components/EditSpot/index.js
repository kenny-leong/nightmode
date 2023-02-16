import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editSpotDetails } from '../../store/spot';
import { getSpotDetails } from '../../store/spot';
import { useParams } from 'react-router-dom';
import './EditSpot.css';


function EditSpot() {

    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);


    const history = useHistory();
    const dispatch = useDispatch();
    let newDbSpot;
    const { spotId } = useParams();
    const spotDetails = useSelector(state => state.spot.oneSpot);

    useEffect(() => {
        //rerender upon form submission
        dispatch(getSpotDetails(spotId));
    }, [dispatch, hasSubmitted, spotId])

    useEffect(() => {
        if (spotDetails) setCountry(spotDetails.country)
        if (spotDetails) setAddress(spotDetails.address)
        if (spotDetails) setCity(spotDetails.city)
        if (spotDetails) setState(spotDetails.state)
        if (spotDetails) setLat(spotDetails.lat)
        if (spotDetails) setLng(spotDetails.lng)
        if (spotDetails) setDescription(spotDetails.description)
        if (spotDetails) setName(spotDetails.name)
        if (spotDetails) setPrice(spotDetails.price)
    }, [spotDetails])




    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        //needs ownerId
        const newSpot = {
            id: spotDetails.id,
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price,
            Owner: spotDetails.Owner,
            SpotImages: spotDetails.SpotImages
        }


        // create the new spot before adding images to it
        const result = await dispatch(editSpotDetails(newSpot))
            .catch(
                async (res) => {
                    const data = await res.json();

                    if (data && data.error) {
                        let errMsg = Object.values(data.error);
                        errMsg = errMsg.join('');
                        let errType = errMsg.split(' ');
                        errType = errType[0];
                        const type = errType.toLowerCase();
                        const errObj = {};
                        errObj[type] = errMsg;
                        setErrors(errObj)
                        setHasSubmitted(false);
                    }
                }
            )
        newDbSpot = result;
        if (newDbSpot === undefined) return;

        setHasSubmitted(false);
        history.push(`/spots/${newDbSpot.id}`)

    }

    const errMsgs = []
    const keys = Object.keys(errors);

    for (let key of keys) {
        errMsgs.push(errors[key]);
    }


    return (
        <div className='newspot-full-div'>
            {(errMsgs.length > 0) && (
                <div className='error-div'>
                    <p>Please fix the following error before submitting:</p>
                    <ul className='newspot-ul'>
                        {errMsgs.map((err) => (
                            <li key={err} className='error-item'>{err}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className='newspot-form-div'>
                <form onSubmit={handleSubmit}>
                    <h1 className='edit-spot-header'>Update your Spot</h1>
                    <div className='section-one'>
                        <h2>Where's your place located?</h2>
                        <h4>Guests will only get your exact address once they book a reservation.</h4>
                    </div>
                    <label className="form-label country">
                        <p>Country</p>
                        <input
                            type='text'
                            onChange={(e) => setCountry(e.target.value)}
                            value={country}
                            placeholder='Country'
                        />
                    </label>
                    <label className="form-label address">
                        <p>Street Address</p>
                        <input
                            type='text'
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            placeholder='Address'
                        />
                    </label>
                    <div className='city-state-div'>
                        <label className='form-label city'>
                            <p>City</p>
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className='city-input-box'
                            />
                        </label>
                        <span className='comma-one'>,</span>
                        <label className='form-label state'>
                            <p>State</p>
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className='lat-long-div'>
                        <label className='form-label lat'>
                            <p>Latitude</p>
                            <input
                                type="text"
                                placeholder="Latitude"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                            />
                        </label>
                        <span className='comma-two'>,</span>
                        <label className='form-label lng'>
                            <p>Longitude</p>
                            <input
                                type="text"
                                placeholder="Longitude"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className='describe-div'>
                        <h2>Describe your place to guests</h2>
                        <h4>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h4>
                        <textarea
                            className='description-ta'
                            placeholder='Please write at least 30 characters . . . .'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className='title-div'>
                        <h2>Create a title for your spot</h2>
                        <h4>Catch guests' attention witha  spot title that highlights what makes your place special.</h4>
                        <input
                            type="text"
                            placeholder='Name of your spot'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='price-div'>
                        <h2>Set a base price for your spot</h2>
                        <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>
                        <div className='price-input'>
                            <span className='dollar-sign'>$</span>
                            <input
                                type='text'
                                placeholder='Price per night (USD)'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='submit-div'>
                        <button type='submit' className='edit-submit-btn'>Edit Spot</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditSpot;
