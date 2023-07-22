import styles from './leaderboard.module.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from 'react-bootstrap';

const Leaderboard = () => {

    const navigate = useNavigate();
    const [allEntries, setAllEntries] = useState(null);

    useEffect(()=>{
        axios.get('https://rapid-keys-back.onrender.com/multiplayer/leaderboard')
        .then(function (response) {
            setAllEntries(response.data.leaderboard);
        })   
    }, [])

    const goHome = ()=>{
        navigate("/");
      }

    return ( 
        <div>
            <h1 className={styles.head}>Leaderboard</h1>
                    <Button variant="primary" onClick = {goHome} className="matchmakingBtn">Back to Home</Button>
                    {allEntries  &&
                        allEntries.map(leaderboard => {
                            return (
                              <div className={styles.flexWrapper}>   
                                <div className={styles.entryWrapper}>
                                    <div className={styles.username}>
                                        {leaderboard.username}
                                        <div className={styles.wpm}>
                                            WPM : {leaderboard.wpm}
                                        </div>
                                    </div>
                                </div>
                                </div>
                            )
                        })
                    }
            </div>
    );
}

export default Leaderboard;