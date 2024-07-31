import { useState } from 'react';
import PropTypes from 'prop-types';

const containerStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '16px'
};

const starContainerStyle = {
	display: 'flex',
	gap: '2px'
};

StarRating.propTypes = {
	maxRating: PropTypes.number,
	starColor: PropTypes.string,
	starSize: PropTypes.number,
	className: PropTypes.string,
	messages: PropTypes.array,
	defaultRating: PropTypes.number,
	onSetRating: PropTypes.func
};

export default function StarRating(props) {
	const {
		maxRating = 5,
		starColor = '#fcc419',
		starSize = 48,
		className = '',
		messages = [],
		defaultRating = 0,
		onSetRating = () => {}
	} = props;
	const [userRating, setUserRating] = useState(defaultRating);
	const [hoverRating, setHoverRating] = useState(0);

	const handleRating = (rating) => {
		return () => {
			setUserRating(rating);
			onSetRating(rating);
		};
	};

	const handleHoverEnter = (rating) => {
		return () => setHoverRating(rating);
	};

	const handleHoverLeave = () => {
		setHoverRating(0);
	};

	const textStyle = {
		lineHeight: '1',
		margin: '0',
		color: starColor,
		fontSize: `${starSize / 1.5}px`
	};

	// prettier-ignore
	return (
		<div
			style={containerStyle}
			className={className}
		>
			<div style={starContainerStyle}>
				{Array.from(Array(maxRating)).map((value, index) => (
					<Star
						key={index}
						onClick={handleRating(index + 1)}
						isStarUserRating={hoverRating >= index + 1 || userRating >= index + 1}
						onMouseEnter={handleHoverEnter(index + 1)}
						onMouseLeave={handleHoverLeave}
						starColor={starColor}
						starSize={starSize}
					/>
				))}
			</div>
			<p style={textStyle}>
				{messages.length === maxRating
					? messages[hoverRating ? hoverRating - 1 : userRating - 1]
					: hoverRating || userRating || ''}
			</p>
		</div>
	);
}

function Star(props) {
	const {
		onClick,
		isStarUserRating,
		onMouseEnter,
		onMouseLeave,
		starColor,
		starSize
	} = props;

	const starStyle = {
		width: `${starSize}px`,
		height: `${starSize}px`,
		display: 'block',
		cursor: 'pointer'
	};

	return (
		<span
			role={'button'}
			style={starStyle}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{isStarUserRating ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill={starColor}
					stroke={starColor}
				>
					<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
				</svg>
			) : (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					stroke={starColor}
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='{2}'
						d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
					/>
				</svg>
			)}
		</span>
	);
}
