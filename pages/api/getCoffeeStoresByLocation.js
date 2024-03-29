import { fetchCoffeeStores} from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
	// configure latLong and limit
	try {
		const { latLong, limit } = req.query;
		const response = await fetchCoffeeStores(latLong, limit);
		res.status(200);
		res.json(response);
	} catch (err) {
		console.error("There is an error", err);
		res.status(500);
		res.json({ meessage: 'Oh no! Something went wrong', err});
	}
}

export default getCoffeeStoresByLocation;