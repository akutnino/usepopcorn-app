import StarRating from './StarRating';
import { useEffect, useState } from 'react';

const KEY = '3494c38';

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [query, setQuery] = useState('');
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errorString, setErrorString] = useState('');
	const [selectedMovieId, setSelectedMovieId] = useState(null);
	const [selectedMovieObject, setSelectedMovieObject] = useState({});
	const [userRating, setUserRating] = useState(0);

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
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function NavBar(props) {
	const { children } = props;

	return (
		<nav className='nav-bar'>
			<Logo />
			{children}
		</nav>
	);
}

function Logo(props) {
	return (
		<div className='logo'>
			<span role='img'>🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function SearchBar(props) {
	const { query, setQuery } = props;

	const handleSearchInput = (event) => {
		setQuery(event.target.value);
	};

	return (
		<input
			className='search'
			type='text'
			placeholder='Search movies...'
			value={query}
			onChange={handleSearchInput}
		/>
	);
}

function NumberResults(props) {
	const { movies } = props;

	return (
		<p className='num-results'>
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Main(props) {
	const { children } = props;

	return <main className='main'>{children}</main>;
}

function Box(props) {
	const { children } = props;
	const [isOpen, setIsOpen] = useState(true);

	const handleToggle = () => {
		setIsOpen((currentState) => !currentState);
	};

	return (
		<div className='box'>
			<button
				className='btn-toggle'
				onClick={handleToggle}
			>
				{isOpen ? '–' : '+'}
			</button>
			{isOpen && children}
		</div>
	);
}

function Loader(props) {
	return <p className='loader'>Loading...</p>;
}

function ErrorMessage(props) {
	const { errorString } = props;

	return <p className='error'>⛔ {errorString}</p>;
}

function MovieList(props) {
	const { movies, setSelectedMovieId, setSelectedMovieObject, setUserRating } = props;

	const handleSelectedMovie = (movieId) => {
		return () => {
			setSelectedMovieId((currentId) => (currentId === movieId ? null : movieId));
			setSelectedMovieObject((currentObject) =>
				currentObject?.imdbID === movieId ? {} : currentObject
			);
			setUserRating(0);
		};
	};

	return (
		<ul className='list list-movies'>
			{movies?.map((movie) => (
				<MovieItem
					movie={movie}
					onClick={handleSelectedMovie(movie.imdbID)}
					key={movie.imdbID}
				/>
			))}
		</ul>
	);
}

function MovieItem(props) {
	const { movie, onClick } = props;

	return (
		<li onClick={onClick}>
			<img
				src={movie.Poster}
				alt={`${movie.Title} poster`}
			/>
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

// prettier-ignore
function MovieDetails(props) {
	const {
		selectedMovieId,
		setSelectedMovieId,
		selectedMovieObject,
		setSelectedMovieObject,
		watched,
		setWatched,
		userRating,
		setUserRating
	} = props;
	const [isLoading, setIsLoading] = useState(false);

	const isMovieRated = watched
		.filter((movieObject) => (movieObject?.imdbID === selectedMovieId ? true : false))
		.at(0)?.userRating > 0;

	const currentMovieObject = watched
		.filter((movieObject) => (movieObject?.imdbID === selectedMovieId ? true : false))
		.at(0);

	const {
		Title: title,
		Poster: poster,
		Released: released,
		Runtime: runtime,
		Genre: genre,
		imdbRating,
		Plot: plot,
		Actors: actors,
		Director: director
	} = selectedMovieObject;

	const handleCloseMovieDetails = () => {
		setSelectedMovieId(null);
		setSelectedMovieObject({});
	};

	const handleAddWatchedMovie = () => {
		const watchedMovieObject = {
			imdbID: selectedMovieId,
			poster,
			title,
			userRating,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(' ').at())
		};

		setWatched((currentWatchedMovies) => [...currentWatchedMovies, watchedMovieObject]);
		setSelectedMovieObject({});
		setSelectedMovieId(null);
		setUserRating(0);
	};

	useEffect(() => {
		const fetchMovieDetails = async () => {
			try {
				setIsLoading(true);

				const fetchURL = `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`;
				const fetchOptions = {};

				const response = await fetch(fetchURL, fetchOptions);
				if (response.ok === false) throw new Error('Fetch Request Failed');

				const data = await response.json();
				if (data.Response === 'False') throw new Error('Response Data Failed');

				setSelectedMovieObject(data);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		if (!selectedMovieId) return;

		fetchMovieDetails();
		return () => {};
	}, [selectedMovieId, setSelectedMovieObject]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				setSelectedMovieId(null);
				setSelectedMovieObject({});
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [setSelectedMovieId, setSelectedMovieObject]);

	return (
		<div className='details'>
			{isLoading && <Loader />}
			{!isLoading && (
				<>
					<header>
						<button
							className='btn-back'
							onClick={handleCloseMovieDetails}
						>
							&larr;
						</button>
						<img
							src={poster}
							alt={`Poster of ${title}`}
						/>
						<div className='details-overview'>
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>⭐ {imdbRating} IMDb rating</p>
						</div>
					</header>

					<section>
						<div className='rating'>
							{isMovieRated && <p>You Rated this Movie: {currentMovieObject.userRating} ⭐</p>}

							{!isMovieRated && (
								<StarRating
									maxRating={10}
									starSize={25}
									onSetRating={setUserRating}
								/>
							)}

							{userRating > 0 && (
								<button
									className='btn-add'
									onClick={handleAddWatchedMovie}
								>
									Add to List +
								</button>
							)}
						</div>

						<p>
							<em>{plot}</em>
						</p>
						<p>Starring : {actors}</p>
						<p>Directed by : {director}</p>
					</section>
				</>
			)}
		</div>
	);
}

function WatchedSummary(props) {
	const { watched } = props;
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));

	return (
		<div className='summary'>
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{Number(avgImdbRating.toFixed(1))}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{Number(avgUserRating.toFixed(1))}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{Number(avgRuntime.toFixed(1))} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMoviesList(props) {
	const { watched, setWatched } = props;

	const handleDeleteMovie = (movieId) => {
		return () => {
			setWatched((currentWatchedMovies) =>
				currentWatchedMovies.filter((movieObject) =>
					movieObject.imdbID === movieId ? false : true
				)
			);
		};
	};

	return (
		<ul className='list'>
			{watched.map((movieObject) => (
				<WatchedMovieItem
					movieObject={movieObject}
					onClick={handleDeleteMovie(movieObject.imdbID)}
					key={movieObject.imdbID}
				/>
			))}
		</ul>
	);
}

function WatchedMovieItem(props) {
	const { movieObject, onClick } = props;

	return (
		<li>
			<img
				src={movieObject.poster}
				alt={`${movieObject.title} poster`}
			/>
			<h3>{movieObject.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movieObject.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movieObject.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movieObject.runtime} min</span>
				</p>

				<button
					className='btn-delete'
					onClick={onClick}
				>
					X
				</button>
			</div>
		</li>
	);
}
