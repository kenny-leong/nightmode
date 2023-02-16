import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot, addSpotImgs } from '../../store/spot';
import './CreateSpot.css';


function CreateSpot() {

    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [image2Url, setImage2Url] = useState("");
    const [image3Url, setImage3Url] = useState("");
    const [image4Url, setImage4Url] = useState("");
    const [image5Url, setImage5Url] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    const dispatch = useDispatch();
    let newDbSpot;

    useEffect(() => {
        //rerender upon form submission
    }, [hasSubmitted])


    const handleSubmit = async (e) => {
        e.preventDefault();

        setHasSubmitted(true);

        const newSpot = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price,
            Owner: {
                id: sessionUser.id,
                firstName: sessionUser.firstName,
                lastName: sessionUser.lastName
            }
        }


        // create the new spot before adding images to it

        const result = await dispatch(createSpot(newSpot))
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
        if (newDbSpot == undefined) return;



        // add images to the newly created spot in the database
        let spotImages = [];

        if (!previewUrl) {
            const urlObj = {};
            urlObj.url = 'https://us.123rf.com/450wm/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016/167492439-no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image.jpg?ver=6';
            urlObj.preview = "true";
            spotImages.push(urlObj);
        } else {
            if (!(previewUrl.includes(".png") || previewUrl.includes(".jpg") || previewUrl.includes(".jpeg"))) {
                const urlError = {}
                urlError.url = 'Image url must contain one of the following: .png, .jpg, or .jpeg';
                setErrors(urlError);
            } else {
                const urlObj = {};
                urlObj.url = previewUrl;
                urlObj.preview = "true;"
                spotImages.push(urlObj);
            }
        }

        if (image2Url) {
            const urlObj = {};
            urlObj.url = image2Url;
            urlObj.preview = "false";
            spotImages.push(urlObj);
        }

        if (image3Url) {
            const urlObj = {};
            urlObj.url = image3Url;
            urlObj.preview = "false";
            spotImages.push(urlObj);
        }

        if (image4Url) {
            const urlObj = {};
            urlObj.url = image4Url;
            urlObj.preview = "false";
            spotImages.push(urlObj);
        }

        if (image5Url) {
            const urlObj = {};
            urlObj.url = image5Url;
            urlObj.preview = "false";
            spotImages.push(urlObj);
        }

        await dispatch(addSpotImgs(newDbSpot, spotImages))
            .catch(
                async (res) => {
                    const data = await res.json();
                    const errMsg = data.message;
                    const errObj = {};
                    errObj.spotImg = errMsg;
                    setErrors(errObj);
                }
            )

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
                    <h1 className='create-spot-header'>Create a new Spot</h1>
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
                    <div className='url-div'>
                        <h2>Liven up your spot with photos</h2>
                        <h4>Submit a link to at least one photo to publish your spot</h4>
                        <input
                            type="text"
                            placeholder="Preview Image URL"
                            value={previewUrl}
                            onChange={(e) => setPreviewUrl(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image2Url}
                            onChange={(e) => setImage2Url(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image3Url}
                            onChange={(e) => setImage3Url(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image4Url}
                            onChange={(e) => setImage4Url(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image5Url}
                            onChange={(e) => setImage5Url(e.target.value)}
                        />
                    </div>
                    <div className='submit-div'>
                        <button type='submit' className='submit-btn'>Create Spot</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateSpot;
