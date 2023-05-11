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
const [filteredScoreCardData, setFilteredScoreCardData] = useState([]);
const cols = ["Hole", "Par", "Strokes", "Penalty"]
const [isAdmin, setIsAdmin] = useState(false);
const showSnackbar = useContext(SnackbarContext);
const auth = getAuth();

  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {

        getClaims(auth).then((adminStatus) => {
          console.debug("admin status", adminStatus, auth?.currentUser);
          setIsAdmin(adminStatus);
          if (!adminStatus || adminStatus === false) {
            console.debug('admin triggered as false')
            getFromDB('players', setLoggedInPlayer, showSnackbar, null, {'uuid': user.uid})
          }
        });
      }
    });
    return () => unsubscribe();
  }, [auth]);
  
  

const handleDelete = (id) => {
    // console.log('delete', id)
}

const handleEdit = (obj) => {
    // console.log('delete', obj.id)
}

const getData = async (playerId) => {
  if(playerId){
    console.debug('start of get player data', playerId)
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
    console.debug('get player from selection in DD', selectedPlayerId)
    getData(selectedPlayerId)
  }
}, [selectedPlayerId])

useEffect(() => {
  if(loggedInPlayer){
    getData(loggedInPlayer[0].id)
  }
}, [loggedInPlayer])

useEffect(() => {
  console.debug('scoreCardData changed', scoreCardData)
  if(scoreCardData && scoreCardData.length > 0){
    const holeNum = !isAdmin || isAdmin === false ? currHole : 18
    console.debug('holeNum', holeNum)
    const mergedData = mergeCourseData(scoreCardData.filter((score) => parseInt(score.hole) <= holeNum), courseData);
    setData(mergedData);
  }
}, [scoreCardData])

useEffect(() => {
    getPlayers()
    getCurrHole(setCurrHole, showSnackbar)
  }, []);

  useEffect(() => {
  }, [currHole]);

  // useEffect(() => {
  //   console.debug('scorecard data filtered', filteredScoreCardData, 'course data', courseData)
  //   const mergedData = mergeCourseData(filteredScoreCardData, courseData);

  //   setData(mergedData);
  // }, [filteredScoreCardData])

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
      <BasicTable data={data} columns={cols} onDelete={handleDelete} onEdit={handleEdit}></BasicTable>
    </section>
  </main>)
};

export default Scorecard;
