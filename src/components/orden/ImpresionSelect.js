import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import { nuevaOrden } from "@/src/services/utils/utils.ordenes.js";

const impresiones = nuevaOrden.impresion;

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

function getStyles(impresion, theme) {
    return {
      fontWeight:
            impresiones.indexOf(impresion) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightLarge,
       
        border: '1px solid #dedbd2',
        borderRadius: '10px',
        margin: '4px 4px',
        padding: '5px 0px',     
    };
}

const options = [{value: 1000, label: `Todos`, color: '', emoji: '💯'}, ...impresiones]

export default function ImpresionSelect({ filtros, setFiltros }) {
    const [ value, setValue] = useState([]);
    
    const theme = useTheme();
    
    const handleChange = (event) => {
        const mat = event.target.value;        
        setValue(mat);
        setFiltros(prev => ({...prev, impresiones: mat}));    
    };
    
    return (
        <div className="relative ml-1 xs:ml-0 overflow-hidden">
            <FormControl sx={{ m: 0, width: '100%'}}>
                {value.length === 0 && <InputLabel id="impresions-multiple-chip-label" style={{ fontSize: '0.75rem' }}>Seleccioná Impresiones</InputLabel>}
                <Select
                    labelId="impresions-multiple-chip-label"
                    id="impresions-multiple-chip"
                    multiple
                    value={value}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    style={{ fontSize: '0.5rem', margin: '0px', padding: '0px' }}
                    renderValue={(selected) => (
                        <Box 
                            style={{ display: 'flex', flexWrap: 'no-wrap', gap: 1, margin: '0px', padding: '0px'  }}
                            className="m-0 p-0 h-0"
                        >
                            {selected.map((es) => (
                                <Chip key={es.label} label={es.emoji} className="m-0 p-0" style={{ height: '22px'}}/>
                            ))}
                        </Box>
                    )}
                >
                    {options.map((impresion) => (
                        <MenuItem
                            key={impresion.label}
                            value={impresion}
                            style={getStyles(impresion, theme)}
                        >
                            <div className="ml-3 grid grid-cols-6 gap-4 text-xs">
                                <div className="col-span-1"><div className={value.some(es => es.label === impresion.label || value.some(es => es.value === 1000)) ? null : 'invisible'}>✔️</div></div>
                                <div className="col-span-5">{impresion.emoji} {impresion.label}</div>
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}