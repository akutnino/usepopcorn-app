import { useState } from 'react';

export default function Box(props) {
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
