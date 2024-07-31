import { useState } from 'react';

export function useLocalStorageState(initialValue, key) {
	const [value, setValue] = useState(() => {
		const getWatchedMovies = JSON.parse(localStorage.getItem(key));
		return getWatchedMovies ? getWatchedMovies : initialValue;
	});

	return [value, setValue];
}
