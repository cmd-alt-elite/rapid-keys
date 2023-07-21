const NewGameBtn = () => {
	const backToMM = () => {
		window.location.reload(false);
	}
	return (
		<div>
			<button onClick={backToMM}>
				Play Again
			</button>
		</div>
	);
}
 
export default NewGameBtn;