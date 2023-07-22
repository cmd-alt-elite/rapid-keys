import { Button } from "react-bootstrap";
const NewGameBtn = () => {
	const backToMM = () => {
		window.location.reload(false);
	}
	return (
		<div>
			<Button onClick={backToMM}>
				Play Again
			</Button>
		</div>
	);
}
 
export default NewGameBtn;