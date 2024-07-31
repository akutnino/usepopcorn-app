export default function WatchedMovieItem(props) {
	const { movieObject, setWatched, setSelectedMovieId, setSelectedMovieObject } = props;

	const handleViewMovie = (movieId) => {
		return () => {
			setSelectedMovieId(movieId);
			setSelectedMovieObject(movieObject);
		};
	};

	const handleDeleteMovie = (movieId) => {
		return (event) => {
			event.stopPropagation();

			setWatched((currentWatchedMovies) => {
				const updatedWatchedMovies = currentWatchedMovies.filter((movieObject) =>
					movieObject.imdbID === movieId ? false : true
				);

				const updatedWatchedMoviesLS = JSON.stringify(updatedWatchedMovies);
				localStorage.setItem('watchedMoviesArray', updatedWatchedMoviesLS);

				return updatedWatchedMovies;
			});
		};
	};

	return (
		<li onClick={handleViewMovie(movieObject.imdbID)}>
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
					onClick={handleDeleteMovie(movieObject.imdbID)}
				>
					X
				</button>
			</div>
		</li>
	);
}
