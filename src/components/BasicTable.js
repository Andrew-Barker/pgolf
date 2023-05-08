import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material';
import { amber } from '@mui/material/colors';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const StyledTable = styled(Table)({
  minWidth: 650,
  '& th, td': {
    whiteSpace: 'nowrap',
  },
  overflowX: 'auto',
});

const WarningIconButton = styled(IconButton)({
  color: amber["400"]
});

const titleCase = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  

function BasicTable(props) {
  const { data, columns, onDelete, onEdit } = props;  

  const getColumnWidth = (columnName) => {
    if(data && data.length > 0 ) {
      const columnData = data.map((row) => row[columnName]);
  
    const longest = columnData.reduce((a, b) => {
      return a.toString().length > b.toString().length ? a.toString() : b.toString();
    });
  
    const width = longest.length * 8; // assuming 8 pixels per character
  
    return width.toString();
    } else {
      return '75'
    }
  }

  const createColumnObjs = (columns) => {
    let cols = columns.map((column) => {
      return {
        field: column.toLowerCase(),
        headerName: titleCase(column),
        width: getColumnWidth(column.toLowerCase())
      };
    });
    cols.push({field: 'actions', type: 'actions', 'getActions': (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        onClick={() => handleClickOpen(params.id)}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => onDelete(params.id)}
      />,
    ],})
    return cols
  }


  const [open, setOpen] = React.useState(false);
  const [editingRow, setEditingRow] = React.useState({});

  const handleClickOpen = (rowId) => {
    setEditingRow(data.find(obj => obj.id === Number(rowId)))
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRow({})
  };
  

  return (
    <><Box sx={{ height: '70vh', width: '100%' }}>
      <DataGrid
        rows={data}
        columns={createColumnObjs(columns)}
        getRowId={row => `${row.id}`} />
    </Box><Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingRow?.bar}</DialogTitle>
        <DialogContent>
  {Object.entries(editingRow).map(([key]) => {
    if (key !== 'id') {
      return (
        <TextField
          key={key}
          margin="dense"
          id={key}
          label={titleCase(key)}
          type="text"
          fullWidth
          variant="standard"
          value={editingRow[key]}
        />
      )
    } else {
      return null;
    }
  })}
</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => onEdit(editingRow.id)}>Save</Button>
        </DialogActions>
      </Dialog></>
  );
}

BasicTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BasicTable