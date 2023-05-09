import * as React from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { amber } from "@mui/material/colors";
import {
  DataGrid,
  GridActionsCellItem,
  GridOverlay,
  GridToolbarContainer,
  GridPagination,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { titleCase } from "../utils/helper";

const StyledTable = styled(Table)({
  minWidth: 650,
  "& th, td": {
    whiteSpace: "nowrap",
  },
  overflowX: "auto",
});

const WarningIconButton = styled(IconButton)({
  color: amber["400"],
});

const getTotals = (data) => {
  let totals = {};

  if (data && data.length > 0) {
    const keys = Object.keys(data[0]);
    keys.forEach((key) => {
      if (key.toLowerCase() === "par") {
        totals.par = data.reduce((total, obj) => {
          return total + parseInt(obj[key]);
        }, 0);
      }
      if (key.toLowerCase() === "strokes") {
        totals.strokes = data.reduce((total, obj) => {
          return total + parseInt(obj[key]);
        }, 0);
      }
    });
  }

  return totals;
};

function BasicTable(props) {
  const { data, columns, onDelete, onEdit } = props;

  const CustomFooter = (props) => {
    const { data } = props;
    const totals = getTotals(data);
    return (
      <GridOverlay
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 52, // Adjust the height to match the default footer height
          borderTop: "1px solid rgba(224, 224, 224, 1)", // Add a border to match the default footer
        }}
      >
        <div>
          {/* Your custom text */}
          <p sx={{ display: 'flex', alignItems: 'center' }}>
  {totals.par && (
    <Box component="span" marginRight={2}>
      <strong>Total Par: {totals.par}</strong>
    </Box>
  )}
  {totals.strokes && (
    <Box component="span" marginRight={2}>
      <strong>Total Strokes: {totals.strokes}</strong>
    </Box>
  )}
  {totals.strokes && totals.par && (
    <Box component="span" marginRight={2}>
      <strong>Total Score: {totals.strokes - totals.par}</strong>
    </Box>
  )}
</p>




        </div>
      </GridOverlay>
    );
  };

  const getColumnWidth = (columnName) => {
    if (data && data.length > 0) {
      const columnData = data.map((row) => row[columnName]);

      const longestValue = columnData.reduce((a, b) => {
        return a.toString().length > b.toString().length
          ? a.toString()
          : b.toString();
      });

      const maxLength = Math.max(
        longestValue.toString().length,
        columnName.toString().length
      );

      return maxLength * 10; // assuming 10 pixels per character
    } else {
      return 75;
    }
  };

  const createColumnObjs = (columns) => {
    let cols = columns.map((column) => {
      return {
        field: column.toLowerCase(),
        headerName: titleCase(column),
        width: getColumnWidth(column.toLowerCase()),
      };
    });
    cols.push({
      field: "actions",
      type: "actions",
      getActions: (params) => [
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
      ],
    });
    return cols;
  };

  const [open, setOpen] = React.useState(false);
  const [editingRow, setEditingRow] = React.useState({});

  const handleClickOpen = (rowId) => {
    setEditingRow(data.find((obj) => obj.id === Number(rowId)));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRow({});
  };

  const triggerEdit = () => {
    onEdit(editingRow);
    handleClose();
  };

  return (
    <>
      <Box sx={{ height: "70vh", width: "100%" }}>
        <DataGrid
          rows={data}
          columns={createColumnObjs(columns)}
          getRowId={(row) => `${row.id}`}
          hideFooterSelectedRowCount
          components={{
            Toolbar: GridToolbarContainer,
            Footer: () => <CustomFooter data={data} />,
          }}
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingRow?.bar}</DialogTitle>
        <DialogContent>
          {Object.entries(editingRow).map(([key]) => {
            if (key !== "id") {
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
                  onChange={(event) =>
                    setEditingRow({
                      ...editingRow,
                      [key]: event.target.value,
                    })
                  }
                />
              );
            } else {
              return null;
            }
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => triggerEdit(editingRow)}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

BasicTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BasicTable;
