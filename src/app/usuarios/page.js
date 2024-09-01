"use client";   
import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Modalusuario from '@/src/components/users/ModalUsuario';
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import Toast from '@/src/components/Toast.js';
import { perfiles } from '@/src/services/utils/utils.users.js';
import PerfilesSelect from '@/src/components/users/PerfilesSelect';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '@/src/app/loading.js';
import Image from 'next/image';
 
const columns = [
    { field: 'picture', headerName: 'Img', width: 80, renderCell: (params) => (params.value && <Image src={params.value}  width={60} height={60} alt="avatar" className="rounded-full"/>
      ),},
    { field: 'nombre', headerName: 'Nombre', width: 200},
    { field: 'apellido', headerName: 'Apellido', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'logs', headerName: 'Último Logueo', width: 200, renderCell: (params) => (params.value && params.value.length > 0 ? new Date(params.value[0].createdAt).toLocaleString() : 'N/A'),},
    { field: 'celular', headerName: 'Telefono', width: 180 },
    { field: 'consultorio', headerName: 'Consultorio', width: 200 },
    { field: 'perfil', headerName: 'Perfil', hide: true },
    { field: 'perfil2', headerName: 'Perfil', width: 200 },
    { field: 'cuit', headerName: 'CUIT', hide: true },
    { field: 'telefono', headerName: 'Telefono', hide: true },
    { field: 'domicilio', headerName: 'Domicilio', hide: true },
    { field: 'localidad', headerName: 'Localidad', hide: true },
    { field: 'provincia', headerName: 'Provincia', hide: true },
    { field: 'cp', headerName: 'CP', hide: true},
    { field: 'createdAt', headerName: 'Creado', width: 200},
    { field: 'updatedAt', headerName: 'Actualizado', hide: true },
    { field: 'id', headerName: 'ID', hide: true},
    { field: 'password', headerName: 'Password', hide: true },
];
  
export default function Usuarios() {
    const [ rows, setRows ] = useState([]);
    const [ open, setOpen] = useState(false);
    const [ usuario, setUsuario] = useState({});
    const [ filaSeleccionada, setFilaSeleccionada ] = useState({});
    const [ toast, setToast ] = useState(false);
    const [ propsToast, setPropsToast ] = useState({});
    const [ filtros, setFiltros ] = useState({
        nombre: '',
        email: '',
        perfiles: []
    });
    const [ load, setLoad ] = useState(false);
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFiltroChange = (e) => {
        setFiltros(prev => ({...prev, [e.target.name]: e.target.value}));        
    }
    
    const handlesearch = async () => {
        actualizarUsuarios()
    }
    
    const handleClickEditar = () => {
        if (!usuario.email || usuario.email==='') {
            setPropsToast({
                mensaje: 'No se ha seleccionado un Usuario',
                tema: 'error',
                titulo: 'Error'
            });
            setToast(true)            
            return
        }
        setOpen(true);
    };

    const handleClickAgregar = () => {
        setUsuario({new: true});
        setOpen(true);
    };
  
    const handleSelection = (newSelection) => {    
        const selectedRow = rows.find(r => r.id===newSelection[0]);    
        setFilaSeleccionada(selectedRow);
        const us = { ...selectedRow };
        delete us.password;
        delete us.perfil2;
        setUsuario(us);
        setOpen(true);
    };    

    const actualizarUsuarios = () => {
        setLoad(true);
        const params = new URLSearchParams(window.location.search);
        fetch(`/api/usuarios?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
            const users = data.users;
            setRows(users.map(user => {
                return {
                    ...user,
                    id: user._id,
                    createdAt: new Date(user.createdAt).toLocaleString(),
                    perfil2: perfiles.find(p => p.value === user.perfil).emoji+' '+perfiles.find(p => p.value === user.perfil).label
                }
            }));
            setLoad(false);
        });
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set('nombre', filtros.nombre);
        params.set('email', filtros.email);
        params.set('perfiles', filtros.perfiles.map(es => es.value).join(','));        
        replace(`${pathname}?${params.toString()}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [filtros]);

    useEffect(() => {        
        actualizarUsuarios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="m-10">
        {load && <Loader />}
        <Toast props={propsToast} show={toast} setShow={setToast} />
        <div className="flex flex-wrap items-center gap-5">
            {usuario.apellido && !usuario.new &&
            <button 
                onClick={handleClickEditar}
                className="flex justify-center items-center rounded-xl gap-3 border border-green-400 shadow-xs p-3 bg-transparent font-medium
                    hover:bg-green-400 hover:text-white hover:shadow-xl transition-all duration-500 ease-in-out m-2"
            >
                <FaUserEdit size="2rem"/>
                Editar Usuario {usuario.nombre} {usuario.apellido}
            </button>}
            <button 
                onClick={handleClickAgregar}
                className="flex justify-center items-center rounded-xl gap-3 border border-green-400 shadow-xs p-3 bg-transparent font-medium
                    hover:bg-green-400 hover:text-white hover:shadow-xl transition duration-500 ease-in-out m-2"
            >
                <FaUserPlus size="2rem"/>
                Agregar Nuevo Usuario
            </button>
        </div>

        <div className={`mt-5 border-t border-l border-r border-black shadow-2xl p-2 px-5 rounded-t-2xl 
                grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-2`}>
            <div className="grid grid-rows-2">
                <label htmlFor="fOdontologo" className="flex items-center text-sm">
                    <span>Nombre o Apellido: </span>
                </label>
                <input type="text" id="fnombre" name="nombre" value={filtros.nombre} className=" p-2 border rounded-lg overflow-hidden" onChange={handleFiltroChange} />
            </div>
            <div className="grid grid-rows-2">
                <label htmlFor="fPaciednte" className="flex items-center text-sm">
                    <span>EMail: </span>
                </label>
                <input type="text" id="fEmail" name="email" value={filtros.email} className=" p-2 border rounded-lg overflow-hidden" onChange={handleFiltroChange} />
            </div>
            <div className="grid grid-rows-2">
                <label htmlFor="fPerfil" className="flex items-center text-sm">
                    <span>Perfiles: </span>
                </label>
                <PerfilesSelect filtros={filtros} setFiltros={setFiltros} />
            </div>
            <div className="flex items-end">
                <span onClick={handlesearch} className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-200 hover:text-black cursor-pointer flex flex-row gap-2 items-center">
                    <BsSearch size='2rem'/>
                    Aplicar Filtros
                </span>
            </div>
        </div>         

        <DataGrid 
            onRowSelectionModelChange={handleSelection}
            selectionModel={filaSeleccionada} 
            rows={rows} 
            columns={columns}
            sx={{
                boxShadow: 10,
                borderBottom: 1,
                borderLeft: 1,
                borderRight: 1,
                borderRadius: '0px 0px 20px 20px',
                '& .MuiDataGrid-row': {
                    cursor: 'pointer'
                },
            }}
            initialState={{
                columns: {
                  columnVisibilityModel: {
                    cuit: false,
                    domicilio: false,
                    localidad: false,
                    provincia: false,
                    cp: false,
                    telefono: false,
                    updatedAt: false,
                    password: false,
                    id: false,
                    perfil: false
                  },
                },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { csvOptions: { allColumns: true } } }}
        />

        <Modalusuario 
            open={open} 
            setOpen={setOpen} 
            usuario={usuario} 
            setUsuario={setUsuario}
            actualizarUsuarios={actualizarUsuarios}
        />
        </div>
    );        
}