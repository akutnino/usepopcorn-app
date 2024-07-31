import { useEffect, useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import NumberResults from './NumberResults';
import Main from './Main';
import Box from './Box';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import MovieList from './MovieList';
import MovieDetails from './MovieDetails';
import WatchedSummary from './WatchedSummary';
import WatchedMoviesList from './WatchedMoviesList';

export default function App() {
	const [query, setQuery] = useState('');
	const [selectedMovieId, setSelectedMovieId] = useState(null);
	const [selectedMovieObject, setSelectedMovieObject] = useState({});
	const [userRating, setUserRating] = useState(0);
	const [movies, isLoading, errorString] = useMovies(query);
	const [watched, setWatched] = useLocalStorageState([], 'watchedMoviesArray');

	useEffect(() => {
		if (selectedMovieObject.Title) {
			document.querySelector('title').textContent = `Movie: ${selectedMovieObject.Title}`;
		}

		return () => {
			document.querySelector('title').textContent = `usePopcorn | Welcome`;
		};
	}, [selectedMovieObject]);

	return (
		<>
			<NavBar>
				<SearchBar
					query={query}
					setQuery={setQuery}
					setSelectedMovieId={setSelectedMovieId}
					setSelectedMovieObject={setSelectedMovieObject}
				/>
				<NumberResults movies={movies} />
			</NavBar>
			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !errorString && (
						<MovieList
							movies={movies}
							setSelectedMovieId={setSelectedMovieId}
							setSelectedMovieObject={setSelectedMovieObject}
							setUserRating={setUserRating}
						/>
					)}
					{errorString && <ErrorMessage errorString={errorString} />}
				</Box>
				<Box>
					{selectedMovieId && (
						<MovieDetails
							selectedMovieId={selectedMovieId}
							setSelectedMovieId={setSelectedMovieId}
							selectedMovieObject={selectedMovieObject}
							setSelectedMovieObject={setSelectedMovieObject}
							watched={watched}
							setWatched={setWatched}
							userRating={userRating}
							setUserRating={setUserRating}
						/>
					)}
					{!selectedMovieId && (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								setWatched={setWatched}
								setSelectedMovieId={setSelectedMovieId}
								setSelectedMovieObject={setSelectedMovieObject}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
