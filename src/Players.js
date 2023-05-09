import React, { useState, useEffect }  from 'react';
import BasicTable from './components/BasicTable';

const Players = () => {
  const [data, setData] = useState([]);
const cols = ["Name", "Team"]

const handleDelete = (id) => {
    console.log('delete', id)
}

const handleEdit = (obj) => {
    console.log('delete', obj.id)
}

const getData = async () => {
    const response = await fetch('http://localhost:3001/players');
    const data = await response.json();
    setData(data);
  };

useEffect(() => {
    getData();
  }, []);

  return (<main>
    <section id="players">
      <h2>Players</h2>
      <BasicTable data={data} columns={cols} onDelete={handleDelete} onEdit={handleEdit}></BasicTable>
    </section>
  </main>)
};

export default Players;
