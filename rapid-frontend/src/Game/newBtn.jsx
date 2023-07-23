import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import styles from "./game.module.css";
import crown from "../Assets/crown.svg";

const NewGameBtn = () => {
	const navigate = useNavigate();

	const backToMM = () => {
		navigate("/online");
	}

	const backHome = () => {
		navigate('/');
	}

	const leaderboard = () => {
		navigate('/leaderboard');
	}

	return (
		<div className={styles.btnWrap}>
			<Button onClick={backHome}>
				Home
			</Button>
			<Button onClick={backToMM}>
				Back to Matchmaking
			</Button>
			<Button onClick={leaderboard} className={styles.leaderbtn}>
				<img src={crown} alt="" width={25}/>
				&nbsp; Leaderboard
			</Button>
		</div>
	);
}
 
export default NewGameBtn;