import React, { useState, useEffect }  from 'react';
import BasicTable from './components/BasicTable';
import PageTitle from './components/PageTitle';
import AddData from './components/AddData';
import { deleteData } from './utils/helper';

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

const handlePlayersEdit = (obj) => {
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
      getData()
    })
    .catch((error) => {
      console.error('Error:', error);
      getData()
    });
}

const handleTeamEdit = (obj) => {
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
  const response = await fetch('http://localhost:3001/teams');
    const data = await response.json();
    setTeamData(data);
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
