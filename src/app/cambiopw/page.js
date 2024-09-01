"use client";
import React, { useEffect, useState } from 'react';
import { FaUserCheck } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function ChangePasswordPage() {
    const [ token, setToken ] = useState('');
    const [ password, setPassword] = useState('');
    const [ confirmPassword, setConfirmPassword] = useState('');
    const [ showPassword1, setShowPassword1] = useState(false);
    const [ showPassword2, setShowPassword2] = useState(false);
    const [ error, setError] = useState('');
    const [ ok, setOk] = useState('');
    const [ load, setLoad ] = useState(false);
    const [ passwordError, setPasswordError] = useState(false);

    const handleSubmit = async (e) => {
        setError('');
        setOk('');
        e.preventDefault();

        if (!token) {
            setError('No Existe Token.');
            return;
        }

        if (!password || !confirmPassword || password !== confirmPassword) {
            setError('Las Constraseñas No Coinicden.');      
            return;
        }

        try {
            const pass =  {
                password: password,
                token: token
            }
            const res = await fetch('/api/auth/cambiopw', {
                body:  JSON.stringify(pass),
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
                setOk('Contraseña Cambiada.');
                setLoad(false)
            }
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    useEffect(() => {
        if (password === confirmPassword) {
            setPasswordError(false)
        } else {
            setPasswordError(true)
        }
    }, [password, confirmPassword])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        setToken(token);
    }, []); 
    
    return (
        <div className="h-screen">
            <h1 className="text-2xl font-bold m-10">Modificación de Contraseña</h1>
            <form onSubmit={handleSubmit} className="m-10">
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>Nueva Contraseña: </span>
                    <div className="relative col-span-6 md:col-span-4">
                        <input 
                        type={showPassword1 ? 'text' : 'password'}
                            autoComplete="off"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 ${passwordError && 'border-rose-600'}`}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword1(!showPassword1)}
                            className={`absolute inset-y-5 right-2 text-gray-400`}
                        >
                            {showPassword1 ? <FaRegEyeSlash size="2rem"/> : <FaRegEye size="2rem" />}                        
                        </button>                        
                    </div>    
                </div>    
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>Nombre: </span>
                    <div className="relative col-span-6 md:col-span-4">
                        <input 
                            type={showPassword2 ? 'text' : 'password'}
                            autoComplete="off"
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 ${passwordError && 'border-rose-600'}`}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword2(!showPassword2)}
                            className={`absolute inset-y-5 right-2 text-gray-400`}
                        >
                            {showPassword2 ? <FaRegEyeSlash size="2rem"/> : <FaRegEye size="2rem" />}                        
                        </button>                    
                    </div>
                </div>
                <span className="grid grid-cols-12 items-center">
                    {error && <p className="bg-red-500 text-lg text-white font-bold p-2 m-3 rounded-xl col-span-6 md:col-span-4">{error}</p>}
                    {ok && <p className="bg-green-500 text-lg text-white font-bold p-2 m-3 rounded-xl col-span-6 md:col-span-4">{ok}</p>}
                </span>
                <button 
                    type="submit" 
                    className="flex justify-center rounded-md border border-bordes shadow-xl px-2 py-2 bg-green-200 font-medium 
                            text-black hover:bg-green-500 sm:text-sm col-span-3 sm:col-span-2 rounded-xl"
                    disabled={load}
                >
                    <FaUserCheck size="2em" /> 
                    <span className="self-center ml-2">Modificar Contraseña</span>
                </button>
            </form>
        </div>
  );
}