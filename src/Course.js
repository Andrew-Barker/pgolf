import BasicTable from './components/BasicTable';
import React, { useState, useEffect, useContext } from 'react';
import AddData from './components/AddData';
import PageTitle from './components/PageTitle';
import { getDatabase, ref, onValue } from "firebase/database";
import { removeFromDB, updateDB, getFromDB } from "./firebaseUtils";
import { SnackbarContext } from './SnackbarContext';
  
const ENDPOINT = 'course/holes'

  const Course = () => {
    const [holes, setHoles] = useState([]);
    const cols = ["Hole", "Bar", "Drink", "Par", "Hazard"]
    const showSnackbar = useContext(SnackbarContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    getFromDB(ENDPOINT, setHoles, showSnackbar, 'hole')
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
    <main className="container mx-auto px-4 py-8">
      <PageTitle title="Course Details"/>
      <section className="max-w-3xl mx-auto" id="course">
        <h2 className="text-3xl font-bold mb-4">Course</h2>
        {/* <button onClick={getCourse}>Get course json</button> */}
        <AddData title={'Hole'} endpoint={ENDPOINT} fields={cols} onAdd={getData}/>
        <BasicTable data={holes} columns={cols} onDelete={(id) => removeFromDB(ENDPOINT, id, showSnackbar, true, getData)} onEdit={(obj) => updateDB(ENDPOINT, obj, showSnackbar, true, getData)}></BasicTable>
      </section>
    </main>
  );
  }

export default Course;
