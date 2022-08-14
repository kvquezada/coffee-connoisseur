import {createContext, useReducer} from "react";

export const StoreContext = createContext();

export const ACTION_TYPES = {
	SET_LAT_LONG: 'SET_LAT_LONG',
	SET_COFFEE_STORES: 'SET_COFFEE_STORES',
}

const storeReducer = (state, action) => {
	const { latLong, coffeeStores} = action.payload;
	switch (action.type) {
		case ACTION_TYPES.SET_LAT_LONG: {
			return {...state, latLong};
		}
		case ACTION_TYPES.SET_COFFEE_STORES: {
			return {...state, coffeeStores};
		}
		default:
			throw new Error('Unhandled action type: ' + action.type);
	}
}

const StoreProvider = ({children}) => {
	const initialState = {
		latLong: "",
		coffeeStores: [],
	};

	const [state, dispatch] = useReducer(storeReducer, initialState);

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	);
}

export default StoreProvider;