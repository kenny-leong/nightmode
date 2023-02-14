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

    const sessionUser = useSelector(state => state.session.user);




    return (
        <div className='full-div'>
            <h1>Create a new Spot</h1>
            <h2>Where's your place located?</h2>
            <h4>Guests will only get your exact address once they book a reservation.</h4>
            <div className='form-div'>
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
                </form>
            </div>
        </div>
    )
}

export default CreateSpot;
