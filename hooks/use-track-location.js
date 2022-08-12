import {useState} from "react";

const UseTrackLocation = () => {
	const [locationErrorMsg, setLocationErrorMsg] = useState('');
	const [latLong, setLangLong] = useState('');
	const [isFindingLocation, setIsFindingLocation] = useState(false);

	const success = (position) => {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		setLangLong(`${latitude},${longitude}`);
		setLocationErrorMsg('');
		setIsFindingLocation(false);
	};

	const error = () => {
		setIsFindingLocation(false);
		setLocationErrorMsg('Unable to retrieve your location');
	};

	const handleTrackLocation = () => {
		setIsFindingLocation(true);
		if (!navigator.geolocation) {
			setLocationErrorMsg('Geolocation is not available');
			setIsFindingLocation(false);
		} else {
			// status.textContent = 'Locating...';
			navigator.geolocation.getCurrentPosition(success, error);
		}
	}

	return {
		latLong,
		handleTrackLocation,
		locationErrorMsg,
		isFindingLocation,
	}
};

export default UseTrackLocation;