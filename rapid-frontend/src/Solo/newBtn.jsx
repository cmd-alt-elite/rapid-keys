import {useNavigate} from "react-router-dom"

const NewGameBtn = () => {
	const navigate = useNavigate();
	const backToMM = () => {
		navigate("/solo");
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