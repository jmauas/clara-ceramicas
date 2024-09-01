import React, { useState, useEffect } from 'react'
import { signIn, useSession, getSession } from 'next-auth/react'
import { FaUserCheck, FaUserPlus, FaUserLock, FaCog } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import google from "@/public/img/google.svg";
import google2 from "@/public/img/google2.svg";
import Image from 'next/image';
import MenuUsuario from './MenuUsuario';

export default function LoginPage({ setShow, setForm }) {
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    let { data } = useSession();
    const router = useRouter();
   
    const singUp = () => {
        setForm(1)
    }

    const pedirIP = async () => {
        const data = await fetch('/api/agent')
        const res = data.json();
        return res
    }
    
    const recuperar = () => {
        const us = document.getElementById('email').value
        if (us == '') {
            setError('Tenés que Ingresar un Mail para poder recuperar la Contraseña.')
        } else {
            setError('')
            try {
                fetch('/api/auth/recuperar/' + us, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET'
                })
                setOk('Si el Usuario Existe, se ha Enviado un Mail a la Cuenta de Correo con las Instrucciones para Cambiar la Contraseña. Acordate de revisar la carpeta de Spam o No Deseado.')
                setTimeout(() => {
                    setOk('')
                }, 1000 * 60 * 1);
            } catch (error) {
                setError(error);
            }
        }
    }

    const submit = async (e) => {
        setError('')
        setOk('')
        try {
            e.preventDefault();
            const ip = await pedirIP();
            if (!ip.ok) {
                ip.ip = ''
                ip.agent = ''
            }
            const resSession = await signIn('credentials', {
                email: e.target.email.value,
                password: e.target.password.value,
                ip: ip.ip,
                agent: ip.agent,
                redirect: false
            })
            if (resSession.error) {
                setError(resSession.error)
            } else if (resSession.ok) {
                setOk('Login Correcto')
                const session = await getSession()
                if (session && session.user && session.user) {
                    setShow(false)
                    const params = new URLSearchParams(window.location.search);
                    const cb = params.get('callbackUrl');
                    if (cb) {
                        router.push(cb)
                    }
                }
            }
        } catch (error) {
            console.log(error)
            setError(error);
        }
    }

    useEffect(() => {
        
    }, [data])

    useEffect(() => {
        setError('')
        setOk('')
    }, [])

    return (
        <div>
            {
                data && data.user && data.user.nombre
                    ? <>
                        <MenuUsuario setForm={setForm} />
                    </>
                    : <>
                        <h1 className="font-bold mb-5">Inicio de Sesión</h1>

                        <div 
                            onClick={()=>signIn("google")} 
                            className="rounded-xl px-6 py-3 shadow hover:shadow-xl cursor-pointer bg-gray-100 mx-auto my-8 flex items-center justify-start gap-4 space-x-*"
                        >
                            <Image src={google} alt="bg" width={35} height={35} />
                            <div className="flex items-center justify-center gap-3">
                                Ingresar con <Image src={google2} alt="bg" width={100} height={100} />
                            </div>
                        </div>
                        <hr className="m-3"/>
                        <span>o Con tu Mail y Contraseña.</span>
                        <form onSubmit={submit}>
                            <input
                                type="text"
                                placeholder="Mail"
                                name="email"
                                id="email"
                                className="bg-gray-100 border-2 w-full p-4 rounded-lg my-2"
                                autoComplete="email"
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                className="bg-gray-100 border-2 w-full p-4 rounded-lg my-2"
                                autoComplete="current-password"
                            />
                            {error && <p className="bg-red-500 text-lg text-white font-bold p-2 m-3 rounded-xl">{error}</p>}
                            {ok && <p className="bg-green-500 text-lg text-white font-bold p-2 m-3 rounded-xl">{ok}</p>}
                            <div className="mt-4 grid grid-cols-1 items-center justify-self-end">
                                <button type="submit" className="flex justify-center rounded-md border border-bordes shadow-xl px-4 py-2 mt-4 bg-green-300 font-medium 
                                text-black hover:bg-green-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <FaUserCheck size="2em" />
                                    <span className="self-center ml-2">Ingresar</span>
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 items-center gap-3">
                            <span className="text-sm justify-self-end">Olvidaste tu Contraseña ? 👉 </span>
                            <button className="inline-flex justify-center rounded-md border border-bordes shadow-xl p-2 bg-violet-300 font-medium 
                                        text-black hover:bg-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={recuperar}>
                                <FaUserLock size="2em" />
                                <span className="self-center ml-2 text-sm">Recuperar Contraseña</span>
                            </button>
                            <span className="text-sm justify-self-end">No estas Registrado ? 👉 </span>
                            <button className="inline-flex justify-center rounded-md border border-bordes shadow-xl p-2 bg-yellow-300 font-medium 
                                        text-black hover:bg-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={singUp}>
                                <FaUserPlus size="2em" />
                                <span className="self-center ml-2 text-sm">Alta de Usuario</span>
                            </button>
                        </div>
                    </>
            }
        </div>
    )
} 