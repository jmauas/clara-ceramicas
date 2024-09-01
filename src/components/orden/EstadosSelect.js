
import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';

import { colorEstado, estadosOrden } from "@/src/services/utils/utils.ordenes.js";

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

function getStyles(estado, theme) {
    return {
      fontWeight:
            estadosOrden.indexOf(estado) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightLarge,
        backgroundColor: colorEstado(estado.value),
        border: '1px solid #dedbd2',
        borderRadius: '10px',
        margin: '4px 4px',
        padding: '5px 0px',     
    };
}


export default function EstadosSelect({ setFiltros, perfil }) {
    const [ value, setValue] = useState([]);
    const [ options, setOptions] = useState([]);
    const theme = useTheme();
    
    const handleChange = (event) => {
        const es = event.target.value;        
        setValue(es);
        setFiltros(prev => ({...prev, estado: es})); 
    };
    
    useEffect(() => {
        let opts = []
        if (perfil === 1) {
            opts = [...estadosOrden.filter(es => es.value <= 20)];
            opts = [...opts.map(es => ({...es, label: es.cliente}))];
            opts = [{value: 1000, label: `Todos`, bg: '', emoji: '💯'}, ...opts];
        } else {
            opts = [{value: 1000, label: `Todos`, bg: '', emoji: '💯'}, ...estadosOrden]
        }
        setOptions(opts);
    }, [perfil]);

    return (
        <div className="relative ml-1 xs:ml-0 overflow-hidden">
            <FormControl sx={{ m: 0, p: 0, width: '100%'}}>
                {value.length === 0 && <InputLabel id="estados-multiple-chip-label" style={{ fontSize: '0.75rem' }}>Seleccioná Estados</InputLabel>}
                <Select
                    labelId="estados-multiple-chip-label"
                    id="estados-multiple-chip"
                    multiple
                    value={value}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    style={{ fontSize: '0.5rem' }}
                    className="m-0 p-0"
                    renderValue={(selected) => (
                        <Box 
                            sx={{ display: 'flex', flexWrap: 'no-wrap', gap: 1 }}
                            className="m-0 p-0 h-1"
                        >
                            {selected.map((es) => (
                                <Chip key={es.value} label={es.emoji} className="m-0 p-0" style={{ height: '22px'}}/>
                            ))}
                        </Box>
                    )}
                >
                    {options.map((estado) => (
                        <MenuItem
                            key={estado.value}
                            value={estado}
                            style={getStyles(estado, theme)}
                        >
                            <div className="ml-3 grid grid-cols-6 gap-4 text-xs">
                                <div className="col-span-1"><div className={value.some(es => es.value === estado.value || value.some(es => es.value === 1000)) ? null : 'invisible'}>✔️</div></div>
                                <div className="col-span-5">{estado.emoji} {estado.label}</div>
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}