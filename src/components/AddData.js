import React, { useState, useEffect, useContext } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { titleCase } from '../utils/helper';
import TeamsDropdown from "./inputs/TeamsDropdown";
import { insertDB } from "../firebaseUtils";
import { SnackbarContext } from "../SnackbarContext";
import { getFromDB } from "../firebaseUtils";

function AddData(props) {
    const { title, endpoint, fields, onAdd} = props;  
    const [open, setOpen] = React.useState(false);
    const [addRow, setAddRow] = React.useState({});
    const showSnackbar = useContext(SnackbarContext);

    const [teams, setTeams] = useState([]);
    const [selectedTeamName, setSelectedTeamName] = useState("");

    const getTeams = async () => {
      getFromDB('teams', setTeams, showSnackbar, 'name')
    };

  const handleTeamChange = (event) => {
    setSelectedTeamName(event.target.value);
  };

  useEffect(() => {
    setAddRow({
      ...addRow,
      ["team"]: selectedTeamName,
    });
  }, [selectedTeamName]);

  useEffect(() => {
    getTeams()
  }, []);

    const defineEmptyFormVals = () => {
        return fields.reduce((obj, key) => ({ ...obj, [key.toLowerCase()]: '' }), {});
    }

    const handleClickOpen = () => {

        setAddRow(defineEmptyFormVals())
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setAddRow({})
      };
      
      
      const postAdd = () => {
          setOpen(false);
            setAddRow({});
            onAdd();
      }

  return (
    <><Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          <Button variant="outlined" color='success' startIcon={<AddIcon />} onClick={handleClickOpen}>
              Add {title}
          </Button>
      </Box><Dialog open={open} onClose={() => handleClose}>
              <DialogTitle>Add New {title}</DialogTitle>
              <DialogContent>
                  {Object.entries(addRow).map(([key]) => {
                    if (key === "team" && teams.length > 0) {
                      return (<TeamsDropdown
                        teams={teams}
                        value={addRow[key]}
                        onChange={handleTeamChange}
                      />)
                    } else if (key !== 'id' && key !== 'team') {
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
                  <Button onClick={() => insertDB(endpoint, addRow, showSnackbar, undefined, true, postAdd)}>Save</Button>
              </DialogActions>
          </Dialog></>
  );
}

export default AddData;
