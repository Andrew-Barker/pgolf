import React, { useState, useEffect }  from 'react';
import BasicTable from './components/BasicTable';
import PageTitle from './components/PageTitle';
import AddData from './components/AddData';
import { deleteData } from './utils/helper';
import { removeFromDB, updateDB, getFromDB } from "./firebaseUtils";

const TEAMS_ENDPOINT = 'teams'
const PLAYERS_ENDPOINT = 'players'

const Players = () => {
  const [data, setData] = useState([]);
  const cols = ["Name", "Team"]
  const teamCols = ["Name"]
  const [teamData, setTeamData] = useState([]);

const updatePlayersTeamName = (prevTeamName) => {
  console.log('previous team name')
}

const handlePlayersDelete = async (id) => {
  try {
    await deleteData('players', id);
    getData()
  } catch (error) {
    console.error(error);
  }
}

const handleTeamsDelete = async (id) => {
  try {
    await deleteData('teams', id);
    getTeamData()
  } catch (error) {
    console.error(error);
  }
}

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
  const response = await fetch(`http://localhost:3001/players?team=${previousTeamName}`);
  const playersOnTeam = await response.json();
  fetch(`http://localhost:3001/teams/${obj.id}`, {
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
        getTeamData()
      }).then(() =>{
        playersOnTeam.forEach((player) => {
          const updatedPlayer = { ...player, team: obj.name };
          handlePlayersEdit(updatedPlayer, false)
        })
      }).then(() => {
        getData()
      })
      .catch((error) => {
        console.error('Error:', error);
        getTeamData()
      });
}

const getData = async () => {
    const response = await fetch('http://localhost:3001/players');
    const data = await response.json();
    setData(data);
  };

const getTeamData = async () => {
  getFromDB(TEAMS_ENDPOINT, setTeamData)
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
      <BasicTable data={data} columns={cols} onDelete={handlePlayersDelete} onEdit={handlePlayersEdit} gridHeight="35vh" footerType="Players"></BasicTable>
      <h2>Teams</h2>
      <AddData title={'Team'} endpoint={"teams"} fields={teamCols} onAdd={getTeamData}/>
      <BasicTable data={teamData} columns={teamCols} onDelete={handleTeamsDelete} onEdit={handleTeamEdit} gridHeight="35vh" footerType="Teams"></BasicTable>
    </section>
  </main>)
};

export default Players;
