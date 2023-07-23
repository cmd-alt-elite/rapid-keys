import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const NewGameBtn = () => {
	const navigate = useNavigate();
	const backToMM = () => {
		navigate("/solo");
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