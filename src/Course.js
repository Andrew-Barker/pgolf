import BasicTable from './components/BasicTable';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useState, useEffect } from 'react';
  

  const handleDelete = (id) => {
    // Pass the id up to the parent component
    console.log(`Hole to delete: ${id}`)
  };

  const handleEdit = (id) => {
    // Pass the id up to the parent component
    console.log(`Hole to edit: ${id}`)
  };
  

  const Course = () => {
    const [holes, setHoles] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch('http://localhost:3001/holes');
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
        <BasicTable data={holes} onDelete={handleDelete} onEdit={handleEdit}></BasicTable>
      </section>
    </main>
  );
  }

export default Course;
