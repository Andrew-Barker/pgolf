import BasicTable from './components/BasicTable';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useState, useEffect } from 'react';
  

  
  

  const Course = () => {
    const [holes, setHoles] = useState([]);

    const handleDelete = (id) => {
      // Pass the id up to the parent component
      console.log(`Hole to delete: ${id}`)
    };
  
    const handleEdit = (obj) => {
      // Pass the id up to the parent component
      console.log(`Hole to edit: ${obj.id}`)
      fetch(`http://localhost:3001/course/${obj.id}`, {
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
        console.log('Data updated successfully');
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
    const response = await fetch('http://localhost:3001/course');
    const data = await response.json();
    setHoles(data);
  };
  return (
    <main>
      <section id="course">
        <h2>Course</h2>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          <Button variant="outlined" color='success' startIcon={<AddIcon />}>
            Add Hole
          </Button>
        </Box>
        <BasicTable data={holes} columns={["Hole", "Bar", "Drink", "Par", "Hazard"]} onDelete={handleDelete} onEdit={handleEdit}></BasicTable>
      </section>
    </main>
  );
  }

export default Course;
