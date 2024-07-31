import { useState, useEffect, useRef } from 'react';
import Loader from './Loader';
import StarRating from './StarRating';

const KEY = '3494c38';

export default function MovieDetails(props) {
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
	const ratingChangesCount = useRef(0);

	const isMovieRated =
		watched
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
			runtime: Number(runtime.split(' ').at()),
			userRatingDecisions: Number(ratingChangesCount.current)
		};

		const updatedWatchedMoviesLS = JSON.stringify([...watched, watchedMovieObject]);
		localStorage.setItem('watchedMoviesArray', updatedWatchedMoviesLS);

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

	useEffect(() => {
		if (userRating) ratingChangesCount.current += 1;

		return () => {};
	}, [userRating]);

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
							{isMovieRated && (
								<p>You Rated this Movie: {currentMovieObject.userRating} ⭐</p>
							)}

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
