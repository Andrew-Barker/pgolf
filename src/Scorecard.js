import React, { useState, useEffect }  from 'react';
import BasicTable from './components/BasicTable';
import PlayersDropdown from './components/inputs/PlayersDropdown';
import PageTitle from './components/PageTitle';
import { getAuth } from "firebase/auth";
import { getClaims } from "./utils/helper";

function mergeCourseData(scorecards, courses) {
    return scorecards.map((scorecard) => {
      const { hole, ...rest } = scorecard;
      const courseData = courses.find((course) => course.id === hole);
      const par = courseData ? courseData.par : '';
  
      return { ...rest, hole, par };
    });
  }
  

const Scorecard = () => {
const [data, setData] = useState([]);
const [currHole, setCurrHole] = useState([]);
const [players, setPlayers] = useState([]);
const [selectedPlayerId, setSelectedPlayerId] = useState('');
const cols = ["Hole", "Par", "Strokes", "Penalty"]
const [isAdmin, setIsAdmin] = useState(false);
const [authUpdated, setAuthUpdated] = useState(false);
  const auth = getAuth();

  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {

        getClaims(auth).then((adminStatus) => {
          console.log("admin status", adminStatus, auth?.currentUser);
          setIsAdmin(adminStatus);
          if (!isAdmin || isAdmin === false) {
            getData(user.uid);
          } else {
            setSelectedPlayerId(players[0].id)
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
    const courseResponse = await fetch('http://localhost:3001/courses');
    const courseData = await courseResponse.json();

    const scoreResponse = await fetch(`http://localhost:3001/scorecards?playerId=${playerId}`);
    let scoreData = await scoreResponse.json();

    if(!isAdmin){
      scoreData = scoreData.filter((score) => score.hole <= currHole);
    }


    const mergedData = mergeCourseData(scoreData, courseData);

    setData(mergedData);
  };

  const getPlayers = async () => {
    const response = await fetch('http://localhost:3001/players');
    const data = await response.json();
    setPlayers(data);
  };

  const getCurrHole = async () => {
    const response = await fetch('http://localhost:3001/currentHoles');
    const data = await response.json();
    setCurrHole(data['currentHole']);
  };

  const handlePlayerChange = (event) => {
    setSelectedPlayerId(event.target.value);
  };

useEffect(() => {
  if(selectedPlayerId){
    getData(selectedPlayerId)
  }
}, [selectedPlayerId])

// useEffect(() => {
//   if(!isAdmin && auth.currentUser){
//     getData(auth.currentUser.uid)
//   }
// }, [isAdmin])

useEffect(() => {
    getPlayers()
    getCurrHole()
  }, []);

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
