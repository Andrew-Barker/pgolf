import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material';
import { amber } from '@mui/material/colors';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

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

  const createColumnObjs = (columns) => {
    let cols = columns.map((column) => {
      return {
        field: column.toLowerCase(),
        headerName: titleCase(column),
      };
    });
    cols.push({field: 'actions', type: 'actions', 'getActions': (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        onClick={() => onEdit(params.id)}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => onDelete(params.id)}
      />,
    ],})
    return cols
  }

  

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
      rows={data}
      columns={createColumnObjs(columns)}
      getRowId={row => `${row.id}`}
      /> 
    </Box>
  );
}

BasicTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BasicTable