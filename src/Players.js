import React, { useState, useEffect }  from 'react';
import BasicTable from './components/BasicTable';
import PageTitle from './components/PageTitle';
import AddData from './components/AddData';

const Players = () => {
  const [data, setData] = useState([]);
  const cols = ["Name", "Team"]
  const teamCols = ["Name"]
  const [teamData, setTeamData] = useState([]);

const handleDelete = (id) => {
    console.log('delete', id)
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
      <BasicTable data={data} columns={cols} onDelete={handleDelete} onEdit={handleEdit} gridHeight="35vh" footerType="Players"></BasicTable>
      <h2>Teams</h2>
      <AddData title={'Team'} endpoint={"teams"} fields={teamCols} onAdd={getTeamData}/>
      <BasicTable data={teamData} columns={teamCols} onDelete={handleDelete} onEdit={handleEdit} gridHeight="35vh" footerType="Teams"></BasicTable>
    </section>
  </main>)
};

export default Players;
