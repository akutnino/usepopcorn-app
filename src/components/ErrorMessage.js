export default function ErrorMessage(props) {
	const { errorString } = props;

	return <p className='error'>⛔ {errorString}</p>;
}
