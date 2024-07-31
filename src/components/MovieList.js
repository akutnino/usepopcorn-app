import MovieItem from './MovieItem';

export default function MovieList(props) {
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
