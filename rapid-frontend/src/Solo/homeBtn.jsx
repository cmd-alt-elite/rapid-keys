import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const HomeBtn = () => {
	const navigate = useNavigate();
	const backToHome = () => {
		navigate("/");
	}
	return (
		<Button variant="primary" onClick={backToHome} className="matchmakingBtn">Back to Home</Button>
	);
}
 
export default HomeBtn;