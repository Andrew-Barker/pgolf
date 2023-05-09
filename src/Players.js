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

const handlePlayersDelete = async (id) => {
  try {
    await deleteData('teams', id);
    getData()
    console.log('Data deleted successfully!');
  } catch (error) {
    console.error(error);
  }
}

const handleTeamsDelete = async (id) => {
  try {
    await deleteData('teams', id);
    getTeamData()
    console.log('Data deleted successfully!');
  } catch (error) {
    console.error(error);
  }
}

const handleEdit = (obj) => {
    console.log('edit', obj.id)
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
      <AddData title={'Hole'} endpoint={"courses"} fields={cols} onAdd={getData}/>
      <BasicTable data={data} columns={cols} onDelete={handlePlayersDelete} onEdit={handleEdit} gridHeight="35vh" footerType="Players"></BasicTable>
      <h2>Teams</h2>
      <AddData title={'Team'} endpoint={"teams"} fields={teamCols} onAdd={getTeamData}/>
      <BasicTable data={teamData} columns={teamCols} onDelete={handleTeamsDelete} onEdit={handleEdit} gridHeight="35vh" footerType="Teams"></BasicTable>
    </section>
  </main>)
};

export default Players;
