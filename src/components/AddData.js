import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { titleCase } from '../utils/helper';

function convertKeysToLower(obj) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key.toLowerCase()] = value;
    }
    return newObj;
  }
  

function AddData(props) {
    const { title, endpoint, fields, onAdd} = props;  
    const [open, setOpen] = React.useState(false);
    const [addRow, setAddRow] = React.useState({});

    const defineEmptyFormVals = () => {
        return fields.reduce((obj, key) => ({ ...obj, [key]: '' }), {});
    }

    const handleClickOpen = () => {

        setAddRow(defineEmptyFormVals())
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setAddRow({})
      };

    const addRecord = (newRecord) => {
        newRecord = convertKeysToLower(newRecord)
        fetch(`http://localhost:3001/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newRecord)
        })
          .then(response => response.json())
          .then(setOpen(false))
          .then(setAddRow({}))
          .then(onAdd)
          .catch(error => console.error(error));
      }


  return (
    <><Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          <Button variant="outlined" color='success' startIcon={<AddIcon />} onClick={handleClickOpen}>
              Add {title}
          </Button>
      </Box><Dialog open={open} onClose={handleClose}>
              <DialogTitle>Add New {title}</DialogTitle>
              <DialogContent>
                  {Object.entries(addRow).map(([key]) => {
                      if (key !== 'id') {
                          return (
                              <TextField
                                  key={key.toLowerCase()}
                                  margin="dense"
                                  id={key.toLowerCase()}
                                  label={titleCase(key)}
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  value={addRow[key.toLowerCase()]}
                                  onChange={(event) => setAddRow({
                                      ...addRow,
                                      [key]: event.target.value
                                  })} />
                          );
                      } else {
                          return null;
                      }
                  })}
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={() => addRecord(addRow)}>Save</Button>
              </DialogActions>
          </Dialog></>
  );
}

export default AddData;