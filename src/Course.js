import BasicTable from './components/BasicTable';
import React, { useState, useEffect } from 'react';
import AddData from './components/AddData';
import PageTitle from './components/PageTitle';
import { getDatabase, ref, onValue, set } from "firebase/database";
  

  const Course = () => {
    const [holes, setHoles] = useState([]);
    const cols = ["Hole", "Bar", "Drink", "Par", "Hazard"]

    const handleDelete = (id) => {
      // Pass the id up to the parent component
      // console.log(`Hole to delete: ${id}`)
    };
  
    const handleEdit = (obj) => {
      // Pass the id up to the parent component
      const db = getDatabase();
      const holeRef = ref(db, `course/holes/${obj.id}`);
      set(holeRef, obj)
        .then(() => {
          getData();
        })
        .catch((error) => {
          console.error("Error:", error);
          getData();
        });
    };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const db = getDatabase();
    const holesRef = ref(db, "course/holes");
    onValue(holesRef, (snapshot) => {
      const data = snapshot.val();
      setHoles(data ? Object.values(data) : []);
    });
  };

  const getCourse = async () => {
    const db = getDatabase();
    const holesRef = ref(db, "/");
    onValue(holesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('course data', data)
    });
  };

  return (
    <main>
      <PageTitle title="Course Details"/>
      <section id="course">
        <h2>Course</h2>
        <button onClick={getCourse}>Get course json</button>
        <AddData title={'Hole'} endpoint={"course/holes"} fields={cols} onAdd={getData}/>
        <BasicTable data={holes} columns={cols} onDelete={handleDelete} onEdit={handleEdit}></BasicTable>
      </section>
    </main>
  );
  }

export default Course;
