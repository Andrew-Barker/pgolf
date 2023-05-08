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

function BasicTable(props) {
  const { data, onDelete, onEdit } = props;
  const columnKeys = Object.keys(data[0]).filter((key) => key !== "id");

  const titleCase = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <TableContainer component={Paper}>
      <StyledTable stickyHeader aria-label="simple table">
        <TableHead>
        <TableRow>
              <TableCell align="center" colSpan={columnKeys.length + 1}>
                Course
              </TableCell>
            </TableRow>
        <TableRow>
            {columnKeys.map((columnKey) => (
              <TableCell key={columnKey}>{titleCase(columnKey)}</TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columnKeys.map((columnKey) => (
                <TableCell key={`${row.id}-${columnKey}`}>
                  {row[columnKey]}
                </TableCell>
              ))}
              <TableCell>
                <WarningIconButton aria-label='Delete Hole' onClick={() => onEdit(row.id)}>
                  <EditIcon />
                </WarningIconButton>
                <IconButton color='error' aria-label='Delete Hole' onClick={() => onDelete(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}

BasicTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BasicTable