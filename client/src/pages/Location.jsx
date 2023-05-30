import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@chakra-ui/react'
const Location = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [country, setCountry] = useState('');
    const [currency, setCurrency] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('');

    // use this as a function or automate it ..
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error(error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const GEOCODING_API_KEY = '4bf3635847ee4481b2d370c81232e424'

    const fetchData = async () => {

        if (latitude && longitude) {
            console.log(latitude + ' ' + longitude)
            try {
                const response = await axios.get(
                    `https://api.opencagedata.com/geocode/v1/json?q=${latitude},+${longitude}&key=${GEOCODING_API_KEY}&language=en&pretty=1`
                );
                console.log(response.data);
                setCountry(response.data.results[0].components.country);
                setCurrency(response.data.results[0].annotations.currency.iso_code);
                setCurrencySymbol(response.data.results[0].annotations.currency.symbol);
            } catch (error) {
                console.error(error.message);
            }

        }
    };

    // async function convertCurrency(from, to, amount) {

    // }

    // console.log(convertCurrency('USD', 'INR', 100));

    return (
        <div>
            <h2>Latitude: {latitude}</h2>
            <h2>Longitude: {longitude}</h2>

            {country ? <h2>Country: {country}</h2> : <h2>Loading country...</h2>}
            {currency ? <h2>Currency: {currency}</h2> : <h2>Loading currency...</h2>}
            {currencySymbol ? <h2>Currency Symbol: {currencySymbol}</h2> : <h2>Loading currency symbol...</h2>}
            <Button colorScheme='blue' onClick={fetchData}>fetch Country</Button>
            <br />
            {/* <Button colorScheme='green' onClick={() => convertCurrency('USD', 'INR', 100)}>Money converter</Button> */}

            {/* <h2>Converted Amount: {convertCurrency('USD', 'INR', 100)}</h2> */}
        </div>
    );
};

export default Location;
