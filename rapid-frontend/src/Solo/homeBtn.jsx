import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomeBtn = () => {
	const navigate = useNavigate();
	const goHome = () => {
		navigate("/");
	}
	return  (
		<div>
			<Button onClick={goHome}>Home</Button>
		</div>
	);
}
 
export default HomeBtn;