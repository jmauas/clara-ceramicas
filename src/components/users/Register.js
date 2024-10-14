import React, { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { FaUserCheck, FaBackspace } from "react-icons/fa";
import { validarUser } from '@/src/services/utils/utils.users.js';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Usuario from '@/src/components/users/Usuario.js';

export default function RegisterPage({ setShow, setForm}) {
    const { data } = useSession();
    const [ error, setError] = useState('');
    const [ ok, setOk] = useState('');
    const [ adm, setAdm] = useState(false);
    const [ validado, setValidado] = useState(0);
    const [ load, setLoad ] = useState(false);
    const [ passwordError, setPasswordError] = useState(false);
    const [ showPw, setShowPw] = useState(false);
    const [ usuario, setUsuario] = useState({
        email: '',
        nombre: '',
        apellido: '',
        consultorio: '',
        cuit: 0,
        celular: '',
        password: '',                    
        perfil: 1,
        telefono: '',
        domicilio: '',
        cp: '',
        localidad: '',
        provincia: 'C.A.B.A.',
        codigo: '',
    });

    const submit = async (e) => {
        setLoad(true)
        setError('')
        setOk('')
        try {
            e.preventDefault();
            if (validado===0) {
                if (!validarUser(usuario, setError, false, passwordError)) return
                const res = await fetch('/api/auth/signup', {
                    body:  JSON.stringify(usuario),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                })
                const result = await res.json();
                if (result.error){
                    setError(result.error);
                    setLoad(false)
                } else {
                    if (adm) {
                        setValidado(0)
                        setShow(false)
                    } else {
                        const resdata = await signIn('credentials', {
                            email: usuario.email,
                            password: usuario.password,
                            redirect: false
                       })
                       setValidado(0)
                       setShow(false)
                       setLoad(false)
                    }
                }
            } else if (validado===1) {
                const res = await fetch('/api/auth/confirmar', {
                    body: JSON.stringify({
                        usuario: usuario.usuario,
                        password: usuario.password,
                        codigo: usuario.codigo
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                })
                const result = await res.json();
                if (!result.ok){
                    setError(result.message);
                    setLoad(false)
                } else {
                    const resdata = await signIn('credentials', {
                         email: usuario.usuario,
                         password: usuario.password,
                         redirect: false
                    })
                    setValidado(0)
                    setShow(false)
                    setLoad(false)
                }
            }
        } catch (error) {
            setError(error);
        }
        setLoad(false)
    }


    const handleOnChange = (e) => {
        setUsuario({
            ...usuario,               
            [e.target.name]: e.target.value
        });
        if (e.target.name === 'password') {
            handleOnConfirmChange(e)
        }
    }

    const handleOnConfirmChange = (e) => {
        if (e.target.value !== usuario.password) {
            setPasswordError(true)
        } else {
            setPasswordError(false)
        }
    }

    useEffect(() => {
        if (data && data.user && data.user.perfil && data.user.perfil === 1) {
            setAdm(true)
        } else {
            setAdm(false)
        }
    }, [data])

    return (
        <div>
            <h1 className="font-bold mb-5">Registro de Nuevo Usuario</h1>
            <form onSubmit={submit}>
                <div className="grid grid-cols-6 items-center">
                    
                    <Usuario 
                        usuario={usuario} handleOnChange={handleOnChange} validado={validado} 
                        email={true} password={true} showPw={showPw} setShowPw={setShowPw} passwordError={passwordError}
                    />
                    
                    <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Confirmar Contraseña: </span>
                    <div className="relative col-span-6 md:col-span-4 ">
                        <input 
                            type={showPw ? "text" : "password"} 
                            autoComplete="password"
                            placeholder="Repetir Password"
                            name="password"                        
                            onChange={handleOnConfirmChange}
                            className={`bg-gray-100 ${passwordError && 'border-rose-600'} border-2 w-full p-4 rounded-lg my-2 ${validado!==0 && 'hidden'}`}
                            required
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPw(!showPw)}
                            className={`absolute inset-y-5 right-2 text-gray-400`}
                        >
                            {showPw ? <FaRegEyeSlash size="2rem"/> : <FaRegEye size="2rem" />}                        
                        </button>
                    </div>
                    <span className={`col-span-6 font-bold ${validado!==1 && 'hidden'}`}>Ingresá el Código de 6 Dígitos que te Enviamos a tu Celular por WhatsApp: </span>
                    {/* <input 
                        type="tel" 
                        autoComplete="codigo"
                        placeholder="Código"
                        name="codigo"
                        value={usuario.codigo}
                        onChange={handleOnChange}
                        className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 ${validado!==1 && 'hidden'}`}
                        required
                    /> */}
                    
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
                    
                    <button 
                        className="flex justify-center rounded-md border border-bordes shadow-xl px-2 py-2 bg-red-200 font-medium 
                                text-black hover:bg-red-500 sm:text-sm col-span-3 col-start-4 md:col-span-2 md:col-start-5"
                        onClick={() => setForm(2)}
                        disabled={load}
                    >
                        <FaBackspace size="2em" /> 
                        <span className="self-center ml-2">Volver</span>
                    </button>
                </div>
            </form>
        </div>
      )
} 