import { useEffect, useState } from 'react';

const KEY = '3494c38';

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errorString, setErrorString] = useState('');

	useEffect(() => {
		const controller = new AbortController();

		const fetchMovies = async () => {
			try {
				setErrorString('');
				setIsLoading(true);

				const fetchURL = `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`;
				const fetchOptions = { signal: controller.signal };

				const response = await fetch(fetchURL, fetchOptions);
				if (response.ok === false) throw new Error('Fetch Request Failed');

				const data = await response.json();
				if (data.Response === 'False') throw new Error('Movie Not Found');

				setMovies(data.Search);
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error(error);
					setErrorString(error.message);
				}
			} finally {
				setIsLoading(false);
			}
		};

		if (query.length < 3) {
			setMovies([]);
			setErrorString('');
			return;
		}

		fetchMovies();
		return () => {
			controller.abort();
		};
	}, [query]);

	return [movies, isLoading, errorString];
}
