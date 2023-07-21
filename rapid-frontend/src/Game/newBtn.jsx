import {useNavigate} from "react-router-dom"

const NewGameBtn = () => {
	const navigate = useNavigate();
	const backToMM = () => {
		navigate("/online");
	}
	return (
		<div>
			<button onClick={backToMM}>
				Back to Matchmaking
			</button>
		</div>
	);
}
 
export default NewGameBtn;