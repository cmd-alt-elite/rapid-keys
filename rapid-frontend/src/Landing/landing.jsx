import styles from "./landing.module.css";
import online from "../Assets/online.svg";
import solo from "../Assets/solo.svg";
import leader from "../Assets/leader.png";
import leaderSolo from "../Assets/leader-solo.png";

import { useNavigate } from "react-router-dom";
import Leaderboard from "../Leaderboard/leaderboard";

const Landing = () => {
	const navigate = useNavigate();
	const handleSolo = ()=>{
		navigate("/solo");
	}
	const handleOnline = ()=>{
		navigate("/online");
	}

	const handleLeaderboard = () => {
		navigate("/leaderboard");
	}

	const handleSoloLeaderboard = () => {
		navigate("/solo-leaderboard");
	}

	return (
		<div className={styles.homeWrap}>
			<div className={styles.headWrap}>
				<div className={styles.heading}>
					<h3>rapid keys</h3>
				</div>
			</div>
			<div className={styles.modeSelect}>
				<div className={styles.soloBtn} onClick={handleSolo}><img src={solo} alt="" /><br />Play Solo</div>
				<div className={styles.onlineBtn} onClick={handleOnline}><img src={online} alt="" /><br />Play Online</div>
			</div>

			<div className={styles.leaderSelect}>
			<div className={styles.leader} onClick={handleSoloLeaderboard}><img src={leaderSolo} alt="" /><br />Leaderboard (Solo)</div>
			<div className={styles.leader} onClick={handleLeaderboard}><img src={leader} alt="" /><br />Leaderboard</div>
			</div>
			{/* <div className={styles.leaderboardWrapper}>
			<div className={styles.leaderboardBtn} onClick={handleLeaderboard}><img src={leader} alt="" /><br />Leaderboard</div>
			<div className= {styles.leaderboardWrapper}>
			<div className={styles.leaderboardBtn} onClick={handleSoloLeaderboard}><img src={leader} alt="" /><br />Leaderboard - Practice Mode</div> */}
			 {/* </div> */}
{/* </div> */}
		</div>
	);
}
 
export default Landing;