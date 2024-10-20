import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Toast from '@/src/components/Toast.js';
import { useSession } from "next-auth/react";
import { formatoFecha } from "@/src/services/utils/auxiliaresCliente.js";
import Slide from "@/src/components/orden/Slide";
import { FaCloudDownloadAlt, FaCalendarAlt, FaCheckCircle, FaWindowClose, FaPaperclip } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { nuevaOrden } from "@/src/services/utils/utils.ordenes.js";
import { colorEstado, estadosOrden } from "@/src/services/utils/utils.ordenes.js";
import Loader from '@/src/app/loading.js';
import UltimosMsg from '@/src/components/orden/UltimosMsg.js';
import generarPdf from "@/src/services/utils/generarPDF.js";
import NuevoMensaje from '@/src/components/orden/NuevoMensaje.js';
import { FaRegEdit, FaTimesCircle } from "react-icons/fa";
import Link from 'next/link';

const materiales = nuevaOrden.material;
const impresiones = nuevaOrden.impresion;

export default function ModalOrden({orden, updateOrder, handleClose, enDetalle, actualizarDetalle}) {
    const [ toast, setToast ] = useState(false);
    const [ propsToast, setPropsToast ] = useState({});
    const { data } = useSession();
    const [ width, setWidth ] = useState(0);
    const [ load, setLoad ] = useState(false);
    
    const handleResize = () => {
        setWidth(window ? window.innerWidth : 0);
    };
   
    const actualizarVista = async (id) => {
        actualizarDetalle(id);
    }

    const descargarScan = (scan) => {
        if (scan.externa) {
            crearLink(scan.url, scan.nombre, true);
        } else {
            crearLink(`/api/files/scans/`, scan);
        }
    }
    
    const crearLink = async (url, id, externa) => {
        try {
            const link = document.createElement('a');
            if (!externa) {
                link.href = url+id;
                link.download = id;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                const res = await fetch(url);
                const blob = await res.blob();
                url = URL.createObjectURL(blob);
                link.href = url;
                link.download = id
                link.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const cancelarOrden = async (orden) => {
        let texto;
        if (orden.estado == 99) {
            orden.estado = 0;
            texto = '📥 Recibida';
        } else {
            orden.estado = 99;
            texto = '❌ Cancelada';
        }
        orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Estado Modificado a ${texto}`, usuario: data.user.nombre+' '+data.user.apellido});
        await updateOrder(orden);
    }

   
    const modificarEstimada = async (orden) => {
        setLoad(true);
        orden.fechaEstimada = new Date(document.getElementById(`fechaEstimada${orden._id}`).value);
        orden.fechaEstimada.setHours(orden.fechaEstimada.getHours()+3);
        orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Fecha Estimada Modificada a ${formatoFecha(orden.fechaEstimada, false, false, false, true)}`, usuario: data.user.nombre+' '+data.user.apellido});
        await updateOrder(orden);
        const msg = {
            titulo: `⚠️ *Mensaje del Laboratorio en Orden de Trabajo*`,
            wa: `Te Notificamos la *fecha* estimada de *Entrega* de la Orden Nro. ${orden.orderNumber} del Paciente *${orden.paciente}*.
Para el *${formatoFecha(orden.fechaEstimada, false, false, false, true)}*.`,
            entrega: true,
            usuario: data.user.nombre+' '+data.user.apellido,
            perfil: data.user.perfil
        }        
        const res = await fetch('/api/wn/send', {
            body: JSON.stringify({msg: msg, userEnvia: data.user, orden: orden}),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
        await res.json();       
        setPropsToast({
            mensaje: `Fecha Modificada.`,
            tema: 'ok',
            titulo: 'Fecha Modificada, y Mensaje Enviado'
        });
        setToast(true);       
        setLoad(false);
    }

    const impresion = async (orden, label) => {
        orden.impresion = orden.impresion.map(imp => imp.label === label ? {...imp, realizada: true} : imp);
        orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Impresión de ${label} Realizada`, usuario: data.user.nombre+' '+data.user.apellido});
        await updateOrder(orden);
    }

    const descargarTodo = async (orden, perfil) => {
        try {   
            const scans = orden.scans;
            const imgs = orden.imgs;     
            if (scans && scans.length > 0) {
                scans.forEach(async scan => {
                    if (scan.externa) {
                        await crearLink(scan.url, scan.nombre, true);
                    } else {
                        await crearLink(`/api/files/scans/`, scan);
                    }
                })
            }
            if (imgs && imgs.length > 0) {
                imgs.forEach(async img => { 
                    if (img.externa) {
                        await crearLink(img.url, img.nombre, true);
                    } else {               
                        await crearLink(`/api/files/imgs/`, img);
                    }
                }
            )}
            await generarPdf(orden, data.user);
            if (orden.estado === 0 && perfil>1) orden.estado = 1;
            orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: 'Orden Descargada e Impresa', usuario: data.user.nombre+' '+data.user.apellido});
            await updateOrder(orden);
        } catch (error) {
            console.log(error);
        }
    }    

    useEffect(() => {
        setWidth(window ? window.innerWidth : 0);
        handleResize();
        window.addEventListener('resize', handleResize);
        const idTextArea = `textoMsg${orden._id}`;
        const textArea = document.getElementById(idTextArea);
        if (textArea) {
            textArea.focus();
            textArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return () => {
            window.removeEventListener('resize', handleResize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);       


    return (
        <>
        <Toast props={propsToast} show={toast} setShow={setToast} />  
        {load && <Loader />}     
        <div id={orden._id} className="animate-fadeIn p-5">
            <div key={orden._id} className="my-5 border border-black rounded-lg">
                <div className={`flex flex-row flex-wrap gap-5 place-content-between p-5 ${orden.estado==0 ? 'bg-red-100' : orden.nuevoMsgOdontologo === true && orden.estado == 10 ? 'bg-green-100' : null}`}>                       
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center flex-wrap gap-5 my-0">
                            <div className="flex items-center gap-3 m-1">
                                <h2 className="2xl:text-md">Odontologo: </h2>
                                <h2 className="2xl:text-md font-bold">{orden.odontologo.nombre} {orden.odontologo.apellido}</h2>
                            </div>
                            <div className="flex items-center gap-3 m-1">
                                <h2 className="2xl:text-md">Paciente: </h2>
                                <h2 className="2xl:text-md font-bold">{orden.paciente}</h2>
                            </div>
                        </div>
                        <div className="flex items-center flex-wrap gap-5 my-0">
                            <div className="flex items-center gap-3 m-1">
                                <h2 className="2xl:text-md">Orden Nro: </h2>
                                <h2 className="2xl:text-md font-bold">{orden.orderNumber}</h2>
                            </div>
                            <div className="flex items-center gap-3 m-1">
                                <h2 className="2xl:text-md">Fecha Ingreso: </h2>
                                <h2 className="2xl:text-md font-bold">{formatoFecha(orden.createdAt, true, false, false, true)}</h2>
                            </div>
                        </div>
                        <div className="flex items-center flex-wrap gap-5 my-0">
                            {orden.fechaEstimada2!= '' &&
                            <div className="flex items-center gap-3 m-0">
                                <h2 className="2xl:text-md">Estimada: </h2>
                                <h2 className="2xl:text-md font-bold">{orden.fechaEstimada2}</h2>
                            </div>}                                
                        </div>
                    </div>                       
                    {!handleClose &&
                        <UltimosMsg orden={orden} />
                    }

                    <div className="grid grid-cols-12 gap-2 text-sm">
                        {data && data.user && 
                            Number(data.user.perfil) === 1
                            ?    <div className={`col-span-12 sm:col-span-6 flex flex-col gap-5`}>
                                    <span className={`flex items-center gap-4 float-right p-2 rounded-xl font-bold `} style={{backgroundColor: colorEstado(orden.estado, data.user.perfil)}}>
                                        {estadosOrden.find(es => es.value === orden.estado) && 
                                            <><div className="text-2xl">{estadosOrden.find(es => es.value === orden.estado).emojiCliente}</div>
                                            <div className="col-span-9">{estadosOrden.find(es => es.value === orden.estado).cliente || 'Indeterminado'}</div></>}
                                    </span>                                       
                                </div>
                            :   <div className={`col-span-12 sm:col-span-6 flex flex-col gap-5`}>
                                    <span className={`flex items-center gap-4 float-right p-2 rounded-xl font-bold `} style={{backgroundColor: colorEstado(orden.estado, data.user.perfil)}}>
                                        {estadosOrden.find(es => es.value === orden.estado) && 
                                            <><div className="text-2xl">{estadosOrden.find(es => es.value === orden.estado).emoji}</div>
                                            <div className="col-span-9">{estadosOrden.find(es => es.value === orden.estado).label}</div></>}
                                    </span>                                       
                                </div>
                            }                                
                    </div>
                    <div className="flex flex-row items-center flex-wrap gap-3">
                        {orden.asignada && 
                            <div className="flex items-center justify-center gap-4">
                                <h1 className="text-sm">Asignada A:</h1>
                                {orden.asignada.picture && orden.asignada.picture != '' && 
                                    <Image 
                                        src={orden.asignada.picture}  
                                        width={30} 
                                        height={30} 
                                        alt="avatar" 
                                        className="rounded-full"
                                    />
                                }
                                <h1 className="text-sm font-bold">{orden.asignada.nombre} {orden.asignada.apellido}</h1>
                            </div>
                        }  
                    </div>
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-5 my-5">
                <div className="flex items-center gap-3 m-1">
                    <h2 className="2xl:text-md">Datos Paciente: </h2>
                    <h2 className="2xl:text-md font-bold">Edad: {orden.edad}</h2>
                    <h2 className="2xl:text-md font-bold">Sexo: {orden.sexo}</h2>
                </div>
            </div>
            {handleClose &&
                <button 
                    className="md:fixed right-10 top-[320px] m-3 p-4 bg-red-500 text-white rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-red-200 hover:text-black"
                    onClick={() => handleClose(orden._id)}
                >
                    <FaWindowClose size="2rem"/>
                    Cerrar
                </button>
            }
            <button 
                className="md:fixed right-10 top-[400px] m-3 p-4 bg-green-500 text-white rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-green-200 hover:text-black"
                onClick={() => actualizarVista(orden._id)}
            >
                <GrUpdate size="2rem"/>
                Actualizar
            </button>
            <div className="flex items-center flex-wrap gap-5 my-3">
                <div className="flex items-center gap-3 m-1">
                    <h2 className="2xl:text-md">Fecha Solicitada: </h2>
                    <h2 className="2xl:text-md font-bold">{formatoFecha(orden.fechaSolicitada, false, false, false, true)}</h2>
                </div>
            </div>

            <div className="my-0 flex items-center flex-wrap gap-5 my-2">
                <h3 className="text font-bold">Piezas Superiores: </h3>
                <div className="my-0 border border-white rounded-lg p-3 flex items-center flex-wrap gap-3">
                {
                    orden.piezasSup.map(item => {
                        if (item.value) {
                            return (
                                <label htmlFor={item.label} key={item.label}
                                    className="border border-black border-dashed p-2 rounded-xl"
                                >
                                <strong>{item.label}</strong>
                                </label>
                            )
                        }
                    })
                }
                </div> 
            </div> 
            
            <div className="my-2 flex items-center flex-wrap gap-5">
                <h3 className="text font-bold">Piezas Inferiores: </h3>
                <div className="my-0 border border-white rounded-lg p-3 flex items-center flex-wrap gap-3">
                {
                    orden.piezasInf.map(item => {
                        if (item.value) {
                            return (
                                <label htmlFor={item.label} key={item.label}
                                    className="border border-black border-dashed p-2 rounded-xl"
                                >
                                <strong>{item.label}</strong>
                                </label>
                            )
                        }
                    })
                }
                </div> 
            </div>
            
            <div className="my-0 flex items-center flex-wrap gap-5 my-2">
                <h3 className="text font-bold">Trabajo Solicitado: </h3>
                <div className="my-0 border border-white rounded-lg p-3 flex items-center flex-wrap gap-3">
                {
                    orden.trabajo.map(item => {
                        if (item.value) {
                            return (
                                <label htmlFor={item.label} key={item.label}
                                    className="border border-black border-dashed p-2 rounded-xl"
                                >
                                    <strong>{item.label}</strong>
                                    {item.detalle && item.detalle !== '' && <strong>: {item.detalle}</strong>}
                                </label>
                            )
                        }
                    })
                }
                </div> 
            </div>

            <div className="my-0 flex items-center flex-wrap gap-5 my-2">
                <h3 className="text font-bold">Material Solicitado: </h3>
                <div className="my-0 border border-white rounded-lg p-3 flex items-center flex-wrap gap-3">
                {
                    orden.material.map(item => {
                        if (item.value) {
                            return (
                                <label htmlFor={item.label} key={item.label}
                                    className="border border-black border-dashed p-2 rounded-xl"
                                >
                                    {materiales.find(m => m.label===item.label) && materiales.find(m => m.label===item.label).emoji} 
                                    <strong>{item.label}</strong>
                                    {item.detalle && item.detalle !== '' && <strong>: {item.detalle}</strong>}
                                </label>
                            )
                        }
                    })
                }
                </div> 
            </div>
            <div className="my-0 flex items-center flex-wrap gap-5 my-2">
                <h3 className="text font-bold">Proceso Elegido: </h3>
                <div className="my-0 border border-white rounded-lg p-3 flex items-center flex-wrap gap-3">
                {
                    orden.proceso.map(item => {
                        if (item.value) {
                            return (
                                <label htmlFor={item.label} key={item.label}
                                    className="border border-black border-dashed p-2 rounded-xl"
                                >
                                    <strong>{item.label}</strong>
                                </label>
                            )
                        }
                    })
                }
                </div> 
            </div>
            <div className="my-0 flex items-center flex-wrap gap-5 my-2">
                <h3 className="text font-bold">Impresión 3 D:</h3>
                <div className="my-0 border border-white rounded-lg p-3 flex items-center flex-wrap gap-3">
                {
                    orden.impresion.map(item => {
                        if (item.value) {
                            return (
                                <label htmlFor={item.label} key={item.label}
                                    className="border border-black border-dashed p-2 rounded-xl flex flex-row items-center gap-2"
                                >
                                    {impresiones.find(i => i.label===item.label) && impresiones.find(i => i.label===item.label).emoji} 
                                    <strong>{item.label}</strong>
                                    <span>: {item.realizada ? '✅ Realizada' : '❌ Pendiente'}</span>
                                </label>
                            )
                        }
                    })
                }
                </div> 
            </div>

            <div className="my-0 flex items-center flex-wrap gap-5 my-2">
                <h3 className="text font-bold">Implantes: </h3>
                <div className="my-0 border border-white rounded-lg p-3 flex items-center flex-wrap gap-3">
                {
                    orden.coronas.map(item => {                                        
                        return (
                            <label htmlFor={item.label} key={item.label}
                                className="border border-black border-dashed p-2 rounded-xl"
                            >
                            <strong>{item.label}: {item.value}</strong>
                            </label>
                        )
                    })
                }
                </div> 
            </div> 

            <div className="my-0 flex items-center flex-wrap gap-5 my-2">
                <h3 className="text font-bold">Color: </h3>
                <div className="my-0 border border-white rounded-lg p-3 flex items-center flex-wrap gap-3">                                
                    <label htmlFor="colorFinal"
                        className="border border-black border-dashed p-2 rounded-xl"
                    >
                    <strong>Color Final: {orden.color_final}</strong>
                    </label>
                    <label htmlFor="remanente"
                        className="border border-black border-dashed p-2 rounded-xl"
                    >
                    <strong>Remanente: {orden.remanente}</strong>
                    </label>
                        
                </div> 
            </div>

            <div className="flex items-center flex-wrap gap-5">
                <div className="flex items-center gap-3 m-1">
                    <h2 className="md:text">Descripción: </h2>
                    <h2 className="md:text font-bold">{orden.descripcion}</h2>
                </div>
            </div>
            <div className="my-5 flex items-center flex-wrap gap-5">
                <div className="flex items-center gap-3 m-1">
                    <h2 className="md:text">Aditamentos: {orden.aditamentos ? '✅ SI' : '❌ NO'}</h2>
                    <h2 className="md:text font-bold">{orden.entrega}</h2>
                </div>
            </div>                            
            <button 
                className="p-4 my-2 ring-2 ring-slate-400 rounded-lg flex items-center gap-2 cursor-pointer bg-black text-white hover:bg-white hover:text-black font-semibold"
                onClick={() => descargarTodo(orden, Number(data.user.perfil))}
            >
                <FaCloudDownloadAlt size="2rem"/>
                Descargar Todo
            </button>

            <div className="my-5 flex items-center flex-wrap gap-5">            
                <h2 className="md:text">Escaneos: </h2>
                <h2 className="md:text font-bold flex flex-wrap gap-2">
                    {orden.scans.map((scan, i) => (
                        <div key={scan.externa ? scan.url : scan} className="p-4 my-2 border-2 border-white rounded-xl flex items-center gap-2 cursor-pointer hover:bg-slate-300 hover:text-white text-sm"
                            onClick={() => descargarScan(scan)}
                        >
                            <FaCloudDownloadAlt size="2rem"/>
                            <span key={i}>{scan.externa ? scan.nombre : scan} </span>                                            
                        </div>
                    )
                )}
                </h2>                                
            </div>
            <div className="m-5 flex justify-start flex-wrap gap-16 ">                               
                {
                    enDetalle.find(o => o._id === orden._id).enDetalle && orden.slices && orden.slices.length > 0 &&
                    <Slide slides={orden.slices} width={width}/>
                }
                <div>
                {
                     ((orden.estado === 0 || orden.estado === 10 || orden.estado === 99) && Number(data.user.perfil)>=2) && 
                     <div className="my-5 flex items-center flex-wrap gap-5">
                        <button 
                            className={`ml-2 p-2 rounded-xl text-black hover:text-white font-bold flex items-center gap-2 ${orden.estado === 99 ? 'bg-green-300 hover:bg-green-500' : 'bg-red-200 hover:bg-red-500'}`}
                            onClick={() => cancelarOrden(orden)}
                            >
                            <FaTimesCircle size="2rem"/>
                            {orden.estado === 99 ? 'Re Activar Órden' : 'Cancelar Órden'}
                        </button>         
                    </div>
                }
                {
                    ((orden.estado === 0 || orden.estado === 10 || orden.estado === 99) || Number(data.user.perfil)>=3) && 
                    <Link 
                        href={`/nueva?orden=${orden._id}`} 
                        target="_blank"
                        className="ml-2 p-2 rounded-xl bg-yellow-200 hover:bg-yellow-100 text-black hover:text-black font-bold flex items-center gap-2"
                    >
                        <FaRegEdit size="2rem"/>
                        Modificar Orden
                    </Link>
                }
                </div>
            </div>
            <div>
                {Number(data.user.perfil)>=3 &&
                    <div className="m-5 flex flex-rows items-center justify-start gap-5 flex-wrap border-2 border-white rounded-xl p-3">
                        <span className={``}>Fecha Entrega Estimada: </span>
                        <input 
                            type="date"
                            autoComplete="fechaEstimada"
                            id={`fechaEstimada${orden._id}`}
                            className={`bg-gray-100 border-2 p-3 rounded-lg`}
                            defaultValue={orden.fechaEstimada}
                        />
                        <button 
                            className="p-2 rounded-xl bg-green-200 hover:bg-green-500 text-black hover:text-white font-bold flex items-center gap-2"
                            onClick={() => modificarEstimada(orden)}
                            disabled={load}
                        >
                            <FaCalendarAlt />
                            Modificar Fecha
                        </button>                
                    </div>
                }
                {Number(data.user.perfil)>1 && orden.impresion && orden.impresion.find(imp => (!imp.realizada && imp.value)) &&
                    <div className="m-5 flex flex-rows items-center justify-start gap-5 flex-wrap border-2 border-white rounded-xl p-3">
                        <span className={``}>Impresiones 3D Pendientes: </span>
                        {orden.impresion.map((imp, i) => (
                            !imp.realizada && imp.value &&
                                <div className="flex flex-col gap-2 items-center justify-center" key={i}>
                                    <span className="font-bold text-lg">{imp.label}</span>
                                    <button 
                                        className="p-2 rounded-xl bg-green-200 hover:bg-green-500 text-black hover:text-white flex items-center gap-2"
                                        onClick={() => impresion(orden, imp.label)}
                                    >
                                        <FaCheckCircle />
                                        Confirmar Impresión
                                    </button>   
                                </div>
                        ))}
                    </div>          
                }
            </div>
            <div className="font-bold flex flex-col flex-wrap gap-2 mx-0 p-2 md:mx-5 md:p-5 border border-black rounded-xl shadow">
                <h2 className="md:text">Mensajes del Trabajo: </h2>
                {orden.mensajes.map((hist, i) => (
                    <div key={i} className={`p-2 mx-1 md:mx-4 rounded-md grid grid-cols-12 gap-5 text-xs items-center
                     ${hist.perfil === 1 ? 'bg-green-200' : 'bg-sky-200'}`}
                    >
                        <span className="col-span-1">{hist.perfil == 1 ? '👩‍⚕️' : '⚠️'}</span>
                        <span className="col-span-6 md:col-span-2">{formatoFecha(hist.fecha, true, false, false, true)}</span>
                        <span className="col-span-5 md:col-span-1">{hist.usuario}</span>
                        <span className="col-span-10 md:col-span-7 flex items-center gap-2">{hist.mensaje}
                            {hist.adjunto && hist.adjunto.nombre && hist.adjunto.nombre !== '' &&
                                <a
                                    href={`${hist.adjunto.externa ? hist.adjunto.url : hist.adjunto.tipo === 'img' ? '/api/files/imgs/'+hist.adjunto.nombre : '/api/files/scans/'+hist.adjunto.nombre}`}
                                    className="p-1 ring-2 ring-slate-400 rounded-lg flex items-center gap-2 cursor-pointer bg-red-500 text-white hover:bg-red-800 font-semibold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaPaperclip size="1.5rem" />
                                    {hist.adjunto.nombre.substring(0, hist.adjunto.nombre.indexOf('$') > 0 ? hist.adjunto.nombre.indexOf('$') : hist.adjunto.nombre.length)}
                                </a>
                            }
                        </span>
                    </div>
                ))}
                <NuevoMensaje 
                    orden={orden} 
                    data={data}
                    load={load}
                    setLoad={setLoad}
                    cancelarOrden={cancelarOrden}
                    updateOrder={updateOrder} 
                    setPropsToast={setPropsToast} 
                    setToast={setToast} 
                />
            </div>
            {handleClose &&
                <button 
                    className="md:hidden m-3 p-4 bg-red-500 text-white rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-red-200 hover:text-black"
                    onClick={() => handleClose(orden._id)}
                >
                    <FaWindowClose size="2rem"/>
                    Cerrar
                </button>
            }
            <button 
                className="md:hidden m-3 p-4 bg-green-500 text-white rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-green-200 hover:text-black"
                onClick={() => actualizarVista(orden._id)}
            >
                <GrUpdate size="2rem"/>
                Actualizar
            </button>
            {Number(data.user.perfil)>1 &&
            <div className="my-5 flex flex-col items-start flex-wrap gap-5">            
                <h2 className="md:text">Historial: </h2>
                <div className="font-bold flex flex-col flex-wrap gap-2">
                    {orden.historia.map((hist, i) => (
                        <div key={i} className="p-2 border-2 border-white rounded-xl grid grid-cols-12 gap-5 text-sm">
                            <span className="col-span-3">{formatoFecha(hist.fecha, true, false, false, true)}</span>
                            <span className="col-span-3">{hist.mensaje}</span>
                            {hist.usuario && <span className="col-span-3">{hist.usuario}</span>}
                        </div>
                    ))}
                </div>
            </div>}
        </div>
        </>
    );
};