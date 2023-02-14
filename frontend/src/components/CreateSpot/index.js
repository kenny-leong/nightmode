import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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

    const sessionUser = useSelector(state => state.session.user);




    return (
        <div className='full-div'>
            <div className='form-div'>
                <h1>Create a new Spot</h1>
                <h2 className='section-one'>Where's your place located?</h2>
                <h4 className='section-one'>Guests will only get your exact address once they book a reservation.</h4>
                <form>
                    <div className='country'>
                        <label className="form-label">
                            Country
                            <input
                                type='text'
                                onChange={(e) => setCountry(e.target.value)}
                                value={country}
                                placeholder='Country'
                                required
                            />
                        </label>
                    </div>
                    <div className='address'>
                        <label className="form-label">
                            Street Address
                            <input
                                type='text'
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                                placeholder='Address'
                                required
                            />
                        </label>
                    </div>
                    <div className='city-state-div'>
                        <label className='form-label city'>
                            City
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                className='city-input-box'
                            />
                        </label>
                        <span className='comma-one'>,</span>
                        <label className='form-label state'>
                            State
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className='lat-long-div'>
                        <label className='form-label lat'>
                            Latitude
                            <input
                                type="text"
                                placeholder="Latitude"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                required
                            />
                        </label>
                        <span className='comma-two'>,</span>
                        <label className='form-label lng'>
                            Longitude
                            <input
                                type="text"
                                placeholder="Longitude"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className='describe-div'>
                        <h2>Describe your place to guests</h2>
                        <h4>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h4>
                        <textarea
                            className='description-ta'
                            placeholder='Please write at least 30 characters'
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
                            required
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
                                required
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
                            required
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
