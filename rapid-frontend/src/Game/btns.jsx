import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Btns = () => {
	const navigate = useNavigate();
	const goHome = ()=>{
		navigate("/");
	}
	const goBack = ()=>{
		navigate('/online');
	}
	return (
		<div>
			<Button onClick={goHome} style={{margin:10}}> Home </Button>
			<Button onClick={goBack}> Back </Button>
		</div>
	);
}
 
export default Btns;