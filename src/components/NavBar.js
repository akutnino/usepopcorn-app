import Logo from './Logo';

export default function NavBar(props) {
	const { children } = props;

	return (
		<nav className='nav-bar'>
			<Logo />
			{children}
		</nav>
	);
}
