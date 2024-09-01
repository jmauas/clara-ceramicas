import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Usuario from '@/src/components/users/Usuario.js';
import { FaUserCheck } from "react-icons/fa";
import { perfiles } from '@/src/services/utils/utils.users.js';
import { validarUser } from '@/src/services/utils/utils.users.js';
import Toast from '@/src/components/Toast.js';

export default function ModalUsuario({open, setOpen, usuario, setUsuario, actualizarUsuarios, soloOdon}) {
    const [ error, setError] = useState('');
    const [ ok, setOk] = useState('');
    const [ showPw, setShowPw] = useState(false);
    const [ toast, setToast ] = useState(false);
    const [ propsToast, setPropsToast ] = useState({});
    const [ load, setLoad ] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOnChange = (e) => {
        setUsuario({
            ...usuario,               
            [e.target.name]: e.target.value
        })
    }

    const enviarFetch = async (method) => {
        const us = {...usuario};
        us.email = usuario.email.toLowerCase();
        us.perfil =  parseInt(usuario.perfil);
        delete us.new;

        const res = await fetch('/api/usuarios', {
            body:  JSON.stringify(us),
            headers: {
                'Content-Type': 'application/json'
            },
            method
        })
        const result = await res.json();
        return result;
    }

    const submit = async (e) => {
        e.preventDefault();
        setError('')
        setOk('')
        try {
            if (!validarUser(usuario, setError, true)) return
            setLoad(true)
            const result = usuario.new ? await enviarFetch('POST') : await enviarFetch('PUT');            
            if (result.error){
                setError(result.error);
            } else {
                setPropsToast({
                    mensaje: result.message,
                    tema: 'ok',
                    titulo: 'Registro'
                });
                setToast(true)      
                setUsuario({})
                setOpen(false);
                if (actualizarUsuarios) actualizarUsuarios();
            }
            setLoad(false)
        } catch (error) {
            setError(error);
        }
        setLoad(false)
    }

    return (
        <>
        <Toast props={propsToast} show={toast} setShow={setToast} />
        <Dialog 
            onClose={handleClose} 
            open={open}
            fullWidth={true}
            maxWidth={'sm'}
            scroll={'body'}
        >
            <h1 className="font-bold ml-5 mt-5 text-xl">Registro Usuario</h1>            
            <form 
                onSubmit={submit}
                className=""
                >
                <div className="m-10 grid grid-cols-6 items-center">                    
                    <Usuario 
                        usuario={usuario} handleOnChange={handleOnChange} validado={0} 
                        email={usuario.new} password={true} showPw={showPw} setShowPw={setShowPw} cuit={true}
                    />
                    <span className={`col-span-6 md:col-span-2 ${soloOdon ? 'hidden' : ''}`}>Perfil: </span>
                    <select 
                        name="perfil"
                        value={usuario.perfil}
                        onChange={handleOnChange}
                        className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 ${soloOdon ? 'hidden' : ''}`}
                        required
                    >
                        {perfiles.map(perfil => {
                            if (!soloOdon || perfil.value == 1) {
                                return (
                                    <option 
                                        key={perfil.value} 
                                        value={perfil.value}
                                        style={{backgroundColor: perfil.bg}}
                                    >
                                        {perfil.emoji} {perfil.label}
                                    </option>
                                )
                            }
                        })}
                    </select>
                    <span className="col-span-6">
                        {error && <p className="bg-red-500 text-lg text-white font-bold p-2 m-3 rounded-xl">{error}</p>}
                        {ok && <p className="bg-green-500 text-lg text-white font-bold p-2 m-3 rounded-xl">{ok}</p>}
                    </span>
                    <button 
                        type="submit" 
                        className="flex justify-center rounded-md border border-bordes shadow-xl px-2 py-2 bg-green-200 font-medium 
                            text-black hover:bg-green-500 sm:text-sm col-span-3 sm:col-span-2"
                        disabled={load}
                        >
                        <FaUserCheck size="2em" /> 
                        <span className="self-center ml-2">Enviar</span>
                    </button>
                </div>
            </form>            
        </Dialog>
        </>
    );
};