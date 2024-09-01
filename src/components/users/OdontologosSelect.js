import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { debounce } from '@mui/material/utils';
import Image from 'next/image';

export default function SelectOdontologos({odontologo, setOrden, tipo, orden, updateOrder, user}) {

    const [ odontologos, setOdontologos ] = useState([]);

    const buscarOdontologos = async (b) => {
        fetch(`/api/usuarios?nombre=${b}&perfiles=${tipo}`)
            .then((res) => res.json())
            .then((data) => {
            const users = data.users;
            setOdontologos(users)        
        });
    }

    const onChange = async (newValue) => {
        if (!newValue) return;
        if (tipo === 1) {
            setOrden(prev => ({...prev, odontologo: newValue}));
        }
        if (tipo === 2) {
            cambiarAsignada(newValue);
        }
    }

    const cambiarAsignada = async (asignada) => {
        orden.asignada = asignada;       
        orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Orden Asignada a ${asignada.nombre} ${asignada.apellido}`, usuario: user.nombre+' '+user.apellido});
        await updateOrder(orden);
    }
    
    const onInputChange = async (newInputValue) => {
        if (newInputValue.length > 2 && newInputValue.length < 20) {
            buscarOdontologos(newInputValue)
        }
    }

    return (
        <Autocomplete
            id={`buscador-cliente-${orden && orden._id}`}
            className="border border-bordes rounded-xl pl-0 w-32 md:w-48 lg:w-72"
            PaperComponent={({ children }) =>
                <Paper
                sx={{
                    width: window.innerWidth < 700 ? window.innerWidth * 0.8 + 'px' : '350px'
                    
                }}
                >{children}</Paper>
            }
            ListboxProps={{
                style: {
                maxHeight: 600,
                overflow: 'auto',
                scrollbarWidth: 'none',
                '::WebkitScrollbar': { display: 'none' },
                }
            }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.nombre
            }
            filterOptions={(x) => x}
            options={odontologos}
            value={odontologo}
            autoComplete
            autoHighlight
            includeInputInList
            filterSelectedOptions
            noOptionsText="Sin Resultados ..."
            onChange={(event, newValue) => {
                onChange(newValue)
            }}
            onInputChange={debounce(async (event, newInputValue) => {                
                onInputChange(newInputValue)
            }, 500)}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label={tipo===1 ? 'Ingresá Odontologo...' : 'Ingresá Diseñador...'}
                    fullWidth 
                    sx={{ 
                        '.MuiInputBase-input': {
                        fontFamily: 'inherit', // Hereda la fuente del elemento padre
                        },
                    }}
                />
            )}
            renderOption={(props, cli) => (                  
                <>
                { delete props.key }
                <Box
                    key={cli._id}
                    {...props}
                    component="li" 
                    className="cursor-pointer"
                >
                    <Grid container alignItems="center"
                        key={`${cli._id}-grid`}
                    >
                        <Grid 
                            key={`${cli._id}-grid-2`}
                            item
                            sx={{ width: '100%', wordWrap: 'break-word', whiteSpace: 'normal'}}
                            className="m-2 p-2 grid grid-cols-12 gap-1 border border-gray-200 hover:bg-gray-200 rounded-xl"
                        >
                            <div className="col-span-3">
                                {cli.picture && cli.picture != '' && <Image src={cli.picture}  width={60} height={60} alt="avatar" className="rounded-full" />}
                            </div>
                            <div className="col-span-9 grid grid-cols-1 gap-1">
                                <span className="text-md font-bold">
                                    {cli.nombre} {cli.apellido}
                                </span>
                                <span className="text-xs font-normal ml-3">
                                    {cli.consultorio}
                                </span>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                </>
            )}
        />
    )
}