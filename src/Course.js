import BasicTable from './components/BasicTable';
import React, { useState, useEffect } from 'react';
import AddData from './components/AddData';
import PageTitle from './components/PageTitle';
  

  const Course = () => {
    const [holes, setHoles] = useState([]);
    const cols = ["Hole", "Bar", "Drink", "Par", "Hazard"]

    const handleDelete = (id) => {
      // Pass the id up to the parent component
      // console.log(`Hole to delete: ${id}`)
    };
  
    const handleEdit = (obj) => {
      // Pass the id up to the parent component
      fetch(`http://localhost:3001/courses/${obj.id}`, {
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
    };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch('http://localhost:3001/courses');
    const data = await response.json();
    setHoles(data);
  };
  return (
    <main>
      <PageTitle title="Course Details"/>
      <section id="course">
        <h2>Course</h2>
        <AddData title={'Hole'} endpoint={"courses"} fields={cols} onAdd={getData}/>
        <BasicTable data={holes} columns={cols} onDelete={handleDelete} onEdit={handleEdit}></BasicTable>
      </section>
    </main>
  );
  }

export default Course;
