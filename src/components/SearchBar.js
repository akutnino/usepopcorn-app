import { useRef, useEffect } from 'react';

export default function SearchBar(props) {
	const { query, setQuery, setSelectedMovieId, setSelectedMovieObject } = props;
	const inputElement = useRef(null);

	const handleSearchInput = (event) => {
		setQuery(event.target.value);
	};

	useEffect(() => {
		inputElement.current.focus();

		const keypressCallback = (event) => {
			if (document.activeElement === inputElement.current) return;

			if (event.key === 'Enter') {
				inputElement.current.focus();
				setQuery('');
				setSelectedMovieId(null);
				setSelectedMovieObject({});
			}
		};

		document.addEventListener('keypress', keypressCallback);

		return () => {
			document.removeEventListener('keypress', keypressCallback);
		};
	}, [setQuery, setSelectedMovieId, setSelectedMovieObject]);

	return (
		<input
			className='search'
			type='text'
			placeholder='Search movies...'
			value={query}
			onChange={handleSearchInput}
			ref={inputElement}
		/>
	);
}
