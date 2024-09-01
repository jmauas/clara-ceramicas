import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';

import { perfiles } from "@/src/services/utils/utils.users.js";

const ITEM_HEIGHT = 148;
const ITEM_PADDING_TOP = 2;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 'auto',
    },
  },
};

function getStyles(perfil, theme) {
    return {
      fontWeight:
            perfiles.indexOf(perfil) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightLarge,
        backgroundColor: perfil.bg,
        border: '1px solid #dedbd2',
        borderRadius: '10px',
        margin: '4px 4px',
        padding: '10px 0px',     
    };
}

const options = [{value: 1000, label: `Todos`, bg: '', emoji: '💯'}, ...perfiles]

export default function PerfilesSelect({ filtros, setFiltros }) {
    const [ value, setValue] = useState([]);
    
    const theme = useTheme();
    
    const handleChange = (event) => {
        const es = event.target.value;
        console.log(es)     
        setValue(es);
        setFiltros(prev => ({...prev, perfiles: es}));    
    };
    
    return (
        <div className="relative ml-1 xs:ml-0 overflow-hidden">
            <FormControl sx={{ m: 0, width: '100%'}}>
                {value.length === 0 && <InputLabel id="perfiles-multiple-chip-label">Seleccioná perfiles</InputLabel>}
                <Select
                    labelId="perfiles-multiple-chip-label"
                    id="perfiles-multiple-chip"
                    multiple
                    value={value}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box 
                            sx={{ display: 'flex', flexWrap: 'no-wrap', gap: 1 }}
                            className="m-0 p-0"
                        >
                            {selected.map((es) => (
                                <Chip key={es.value} label={es.emoji} className="m-0 p-0"/>
                            ))}
                        </Box>
                    )}
                >
                    {options.map((perfil) => (
                        <MenuItem
                            key={perfil.value}
                            value={perfil}
                            style={getStyles(perfil, theme)}
                        >
                            <div className="ml-3 grid grid-cols-6 gap-4">
                                <div className="col-span-1"><div className={value.some(es => es.value === perfil.value || value.some(es => es.value === 1000)) ? null : 'invisible'}>✔️</div></div>
                                <div className="col-span-5">{perfil.emoji} {perfil.label}</div>
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}