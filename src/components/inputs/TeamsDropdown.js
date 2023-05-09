import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, FormControl, Select } from '@mui/material';

function TeamsDropdown(props) {
  const { teams, value, onChange } = props;
  console.log('teams dd', teams)

  return (
    <FormControl fullWidth>
      <Select
        value={String(value)}
        onChange={onChange}
      >
        {teams.map((team) => (
          <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

TeamsDropdown.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TeamsDropdown;
