import React, { useState, useEffect, useContext }  from 'react';
import BasicTable from './components/BasicTable';
import PlayersDropdown from './components/inputs/PlayersDropdown';
import PageTitle from './components/PageTitle';
import { getAuth } from "firebase/auth";
import { getClaims } from "./utils/helper";
import { removeFromDB, updateDB, getFromDB, getCurrHole } from "./firebaseUtils";
import { SnackbarContext } from './SnackbarContext';

function mergeCourseData(scorecards, courses) {
    return scorecards.map((scorecard) => {
      const { hole, ...rest } = scorecard;
      const courseData = courses.find((course) => course.hole === hole);
      const par = courseData ? courseData.par : '';
  
      return { ...rest, hole, par };
    });
  }
  

const Scorecard = () => {
const [data, setData] = useState([]);
const [currHole, setCurrHole] = useState([]);
const [players, setPlayers] = useState([]);
const [selectedPlayerId, setSelectedPlayerId] = useState('');
const [loggedInPlayer, setLoggedInPlayer] = useState(null);
const [courseData, setCourseData] = useState(null);
const [scoreCardData, setScorecardData] = useState([]);
const cols = ["Hole", "Par", "Strokes", "Penalty"]
const [isAdmin, setIsAdmin] = useState(false);
const showSnackbar = useContext(SnackbarContext);
const auth = getAuth();

  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {

        getClaims(auth).then((adminStatus) => {
          setIsAdmin(adminStatus);
          if (!adminStatus || adminStatus === false) {
            getFromDB('players', setLoggedInPlayer, showSnackbar, null, {'uuid': user.uid})
          }
        });
      }
    });
    return () => unsubscribe();
  }, [auth]);
  
  

const getData = async (playerId) => {
  if(playerId){
    getFromDB(`course/holes`, setCourseData, showSnackbar, 'hole')
    getFromDB(`scorecards/${playerId}`, setScorecardData, showSnackbar, 'hole')
  }
  };

  const getPlayers = async () => {
    getFromDB('players', setPlayers, showSnackbar, 'name')
  };

  const handlePlayerChange = (event) => {
    setSelectedPlayerId(event.target.value);
  };

useEffect(() => {
  if(selectedPlayerId){
    getData(selectedPlayerId)
  }
}, [selectedPlayerId])

useEffect(() => {
  if(loggedInPlayer && loggedInPlayer.length > 0){
    getData(loggedInPlayer[0].id)
  }
}, [loggedInPlayer])

useEffect(() => {
  if(scoreCardData && scoreCardData.length > 0){
    const holeNum = !isAdmin || isAdmin === false ? currHole : 18
    const strokeMin = !isAdmin || isAdmin === false ? 0 : -1
    const mergedData = mergeCourseData(scoreCardData.filter((score) => parseInt(score.hole) <= holeNum && score.strokes > strokeMin), courseData);
    setData(mergedData);
  }
}, [scoreCardData])

useEffect(() => {
    getPlayers()
    getCurrHole(setCurrHole, showSnackbar)
  }, []);

  useEffect(() => {
  }, [currHole]);

  const reloadData = () => {
    getData(selectedPlayerId)
  }

  return (<main>
    <section id="scorecard">
    <PageTitle title="Scorecard"/>
      <h2>Scorecard</h2>
      {isAdmin && (
        <PlayersDropdown
        players={players}
        value={selectedPlayerId}
        onChange={handlePlayerChange}
      />
      )}
      <BasicTable data={data} columns={cols} onDelete={() => {console.log('do nothing')}} onEdit={(obj) => updateDB(`scorecards/${selectedPlayerId}`, obj, showSnackbar, true, reloadData)} dataType="scorecards"></BasicTable>
    </section>
  </main>)
};

export default Scorecard;
