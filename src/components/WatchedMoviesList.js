import WatchedMovieItem from './WatchedMovieItem';

export default function WatchedMoviesList(props) {
	const { watched, setWatched, setSelectedMovieId, setSelectedMovieObject } = props;

	return (
		<ul className='list list-movies'>
			{watched.map((movieObject) => (
				<WatchedMovieItem
					movieObject={movieObject}
					setWatched={setWatched}
					setSelectedMovieId={setSelectedMovieId}
					setSelectedMovieObject={setSelectedMovieObject}
					key={movieObject.imdbID}
				/>
			))}
		</ul>
	);
}
