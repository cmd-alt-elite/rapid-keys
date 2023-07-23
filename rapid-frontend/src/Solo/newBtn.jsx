import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import crown from "../Assets/crown.svg";
import styles from "./solo.module.css";
const NewGameBtn = () => {
	const navigate = useNavigate();
	const backToMM = () => {
		navigate("/solo");
	}
	const leaderboard = () => {
		navigate("/solo-leaderboard");
	}
	return (
		<div className={styles.btnWrap}>
			<Button onClick={backToMM}>
				Play Again
			</Button>
			<Button onClick={leaderboard}>
				<img src={crown} alt="" width={25}/>
				&nbsp; Leaderboard
			</Button>
		</div>
	);
}
 
export default NewGameBtn;