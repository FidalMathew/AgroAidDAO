import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@chakra-ui/react'

const useCurrentLocation = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [country, setCountry] = useState('');
    const [currency, setCurrency] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('');

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
            // console.log(latitude + ' ' + longitude)
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

    useEffect(() => {
        fetchData()
    }, [latitude, longitude])


    return {
        latitude,
        longitude,
        country,
        currency,
        currencySymbol,
    }
}

export default useCurrentLocation
