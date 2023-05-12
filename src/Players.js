import React, { useState, useEffect, useContext }  from 'react';
import BasicTable from './components/BasicTable';
import PageTitle from './components/PageTitle';
import AddData from './components/AddData';
import { removeFromDB, updateDB, getFromDB } from "./firebaseUtils";
import db from "./firebase";
import { ref, onValue } from "firebase/database";
import { SnackbarContext } from './SnackbarContext';

const TEAMS_ENDPOINT = 'teams'
const PLAYERS_ENDPOINT = 'players'

const Players = () => {
  const [data, setData] = useState([]);
  const cols = ["Name", "Team"]
  const teamCols = ["Name"]
  const [teamData, setTeamData] = useState([]);
  const showSnackbar = useContext(SnackbarContext);


const handlePlayersEdit = (obj, triggerGetData = true) => {
  fetch(`http://localhost:3001/players/${obj.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if(triggerGetData){
        getData()
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      getData()
    });
}

const handleTeamEdit = async (obj, previousTeamName) => {
  const pathsRef = ref(db, `players`);
  onValue(pathsRef, (snapshot) => {
    let players = Object.values(snapshot.val());
    console.log('all players after team update', players)
    if(players && players.length > 0) {
      players = players.filter(player => player.team === previousTeamName);
    console.log(`should only be players from ${previousTeamName}`, players)
    players.forEach((player) => {
      player.team = obj.name
      updateDB(`players`, player, showSnackbar,false)
    })
    }
  })
}

const getData = async () => {
    getFromDB(PLAYERS_ENDPOINT, setData, showSnackbar, 'name')
  };

const getTeamData = async () => {
  getFromDB(TEAMS_ENDPOINT, setTeamData, showSnackbar, 'name')
}

const removeStaleScorecards = (playerId) => {
  removeFromDB('scorecards', playerId, () => ({}), showSnackbar)
}

const handleDelete = (playerId) => {
  removeStaleScorecards(playerId)
  getData()
}


useEffect(() => {
    getData();
    getTeamData()
  }, []);

  return (<main>
    <section id="players">
      <PageTitle title="Players"/>
      <h2>Players</h2>
      <AddData title={'Player'} endpoint={"players"} fields={cols} onAdd={getData}/>
      <BasicTable data={data} columns={cols} onDelete={(id) => removeFromDB(PLAYERS_ENDPOINT, id, showSnackbar, true, handleDelete, )} onEdit={(obj) => updateDB(PLAYERS_ENDPOINT, obj, showSnackbar, true, getData)} gridHeight="35vh" footerType="Players"></BasicTable>
      <h2>Teams</h2>
      <AddData title={'Team'} endpoint={"teams"} fields={teamCols} onAdd={getTeamData}/>
      <BasicTable data={teamData} columns={teamCols} onDelete={(id) => removeFromDB(TEAMS_ENDPOINT, id, showSnackbar, true, getData)} onEdit={(obj) => updateDB(TEAMS_ENDPOINT, obj, showSnackbar, true, getData)} gridHeight="35vh" footerType="Teams"></BasicTable>
    </section>
  </main>)
};

export default Players;
