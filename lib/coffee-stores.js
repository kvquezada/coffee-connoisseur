import { createApi} from "unsplash-js";

const unsplash = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
};

const getListOfCoffeeStoresPhotos = async () => {
	const photos = await unsplash.search.getPhotos({
		query: "coffee shop",
		page: 1,
		perPage: 30,
	});
	const unsplashResults = photos.response.results;
	return unsplashResults.map(result => result.urls['small']);
};

export const fetchCoffeeStores = async (
	latLong = '14.57005979455588%2C120.99246155074837',
	limit = 6,
) => {
	const photos = await getListOfCoffeeStoresPhotos();
	const options = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
		}
	};

	const response = await fetch(getUrlForCoffeeStores(latLong, 'coffee', limit), options);
	const data = await response.json();
	return data.results.map( (result, idx) => {
		const neighborhood = result.location.neighborhood;
		return {
			id: result.fsq_id,
			name: result.name,
			address: result.location.address || '',
			neighborhood: neighborhood?.length > 0 ? neighborhood[0] : '',
			imgUrl: photos[idx],
		}
	});
}