import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, FormControl, Select } from '@mui/material';

function PlayersDropdown(props) {
  const { players, value, onChange } = props;

  return (
    <FormControl fullWidth>
      <Select
        value={String(value)}
        onChange={onChange}
      >
        {players.map((player) => (
          <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

PlayersDropdown.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PlayersDropdown;
