"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatoFecha } from "@/src/services/utils/auxiliaresCliente";
import { FaChevronCircleDown, FaFilePdf, FaRegEdit, FaBell, FaFileExcel, FaChevronCircleUp } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { colorEstado, estadosOrden } from "@/src/services/utils/utils.ordenes.js";
import generarPdf from "@/src/services/utils/generarPDF.js";
import EstadosSelect from '@/src/components/orden/EstadosSelect';
import DisenadorSelect from '@/src/components/orden/DisenadorSelect';
import MaterialSelect from '@/src/components/orden/MaterialSelect';
import ImpresionSelect from '@/src/components/orden/ImpresionSelect';
import { nuevaOrden } from "@/src/services/utils/utils.ordenes.js";
import * as XLSX from 'xlsx';
import Toast from '@/src/components/Toast.js';
import Loader from '@/src/app/loading.js';
import DetalleOrden from '@/src/components/orden/DetalleOrden.js';
import Dialog from '@mui/material/Dialog';
import Switch from "react-switch";
import SelectOdontologos from '@/src/components/users/OdontologosSelect';
import UltimosMsg from '@/src/components/orden/UltimosMsg.js';
import { normalizarOrden } from "@/src/app/ordenes/utilidades.js";

const materiales = nuevaOrden.material;
const impresiones = nuevaOrden.impresion;

export default function Page({ }) {
    const { data } = useSession();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [ enDetalle, setEnDetalle ] = useState([]);
    const [ ordenes, setOrdenes ] = useState([]);
    const [ filtros, setFiltros ] = useState({
        fecha1: '2023-01-01', 
        fecha2: formatoFecha(new Date(), false, true, false, false),
        odontologo: '',
        paciente: '',
        orderNumber: '',
        estado: [],
        materiales: [],
        impresiones: [],
        impresionPendiente: false,
        asignada: false,
        disenador: []
    });
    const [ load, setLoad ] = useState(false);
    const [ toast, setToast ] = useState(false);
    const [ propsToast, setPropsToast ] = useState({});

    const handleFiltroChange = (e) => {
        setFiltros(prev => ({...prev, [e.target.name]: e.target.value}));        
    }

    const handleClose = (id) => {
        setEnDetalle(ordenes => ordenes.map(or => or._id === id ? {...or, enDetalle: false} : or));
    };
    
    const handleSearch = async () => {
        await fetchData()
    }

    const handleExcel = async () => {
        setLoad(true);
        let ordenes = await fetchData();
        ordenes = ordenes.map(orden => {
            return {
                'Nro. Orden': orden.orderNumber,
                'Odontologo': orden.odontologo|+' '+orden.odontologo.apellido,
                'Paciente': orden.paciente,
                'Edad': orden.edad,
                'Sexo': orden.sexo,
                'Fecha Ingreso': formatoFecha(orden.createdAt, true, false, false, false),
                'Fecha Solicitada': formatoFecha(orden.fechaSolicitada, false, false, false, false),
                'Fecha Estimada': orden.fechaEstimada2,
                'Estado': estadosOrden.find(es => es.value === orden.estado) && estadosOrden.find(es => es.value === orden.estado).label,
                'Piezas Superiores': orden.piezasSup.filter(cond => cond.value).map(pieza => pieza.label).join(', '),
                'Piezas Inferiores': orden.piezasInf.filter(cond => cond.value).map(pieza => pieza.label).join(', '),
                'Trabajo': orden.trabajo.filter(cond => cond.value).map(trab => trab.label).join(', '),
                'Trabajo Otros': orden.trabajo.filter(cond => cond.value && cond.lable === 'Otros').map(trab => trab.detalle).join(', '), 
                'Materiales': orden.material.filter(cond => cond.value).map(mat => mat.label).join(', '),
                'Materiales Otros': orden.material.filter(cond => cond.value && cond.label === 'Otros').map(mat => mat.detalle).join(', '),
                'Proceso': orden.proceso.filter(cond => cond.value).map(proc => proc.label).join(', '),
                'Impresiones': orden.impresion.filter(cond => cond.value).map(imp => imp.label).join(', '),
                'Implantes': orden.coronas.map(cor => (cor.label+': '+cor.value)).join(', '),
                'Color Final': orden.colorFinal,
                'Remanente': orden.remanente,
                'Descripción': orden.descripcion,
                'Aditamentos': orden.aditamentos,
                'Entrega': orden.entrega,
                'Mensajes': orden.mensajes.map(msg => msg.mensaje).join(', '),
                'Historia': orden.historia.map(hist => `${formatoFecha(hist.fecha, false, false, false, false)}: ${hist.mensaje} por ${hist.usuario}`).join(', ')
            }
        })
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(ordenes);
        XLSX.utils.book_append_sheet(wb, ws, "Ordenes");
        XLSX.writeFile(wb, "Ordenes.xlsx")
        setLoad(false);
    }
    
    const verDetalle = (id) => {
        return () => {
            setEnDetalle(ordenes.map(orden => orden._id === id ? {...orden, enDetalle: !orden.enDetalle} : orden));
        }
    }

    const actualizarDetalle = async (id) => { 
        try {
            const res = await fetch(`/api/ordenes?id=${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            })
            const data = await res.json();
            const ords = data.ordenes;
            if (ords && ords.length > 0) {
                setOrdenes(ordenes.map(orden => orden._id === id ? normalizarOrden({orden: ords[0], setEnDetalle: setEnDetalle}) : orden));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const cambiarEstado = async (orden) => {
        const nuevoEstado = document.getElementById(`cambioEstado${orden.orderNumber}`);
        orden.estado = Number(nuevoEstado.value);
        if (orden.estado != 10) orden.nuevoMsgOdontologo = false;
        const texto = nuevoEstado.options[nuevoEstado.selectedIndex].text;
        orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Estado Modificado a ${texto}`, usuario: data.user.nombre+' '+data.user.apellido});
        await updateOrder(orden);
    }


    const subirEstado = async (orden, nuevoEstado) => {
        orden.estado = Number(nuevoEstado);
        const es = estadosOrden.find(es => es.value === orden.estado);
        orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Estado Modificado a ${es.emoji} ${es.label}`, usuario: data.user.nombre+' '+data.user.apellido});
        await updateOrder(orden);
    }   
    
    const updateOrder = async (orden) => {
        try {
            const res = await fetch('/api/ordenes', {
                body:  JSON.stringify(orden),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            })
            const datos = await res.json();
            if (datos.success) {
                setOrdenes(ordenes.map(ord => ord._id === orden._id ? normalizarOrden({orden: datos.savedOrden, setEnDetalle: setEnDetalle}) : ord));
            }
        } catch (error) {
            console.log(error);
        }
    }    
    
    const generarPDFOrden = async (orden, perfil) => {
        await generarPdf(orden, data.user);
        if (orden.estado === 0 && perfil>1) orden.estado = 1;
        orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: 'Orden Impresa.', usuario: data.user.nombre+' '+data.user.apellido});
        await updateOrder(orden);
    }

    const fetchData = async () => {
        setLoad(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const res = await fetch(`/api/ordenes?${params.toString()}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            })
            const data = await res.json();
            setEnDetalle([]);
            const ords = data.ordenes.map(orden => {
                return normalizarOrden({orden: orden, setEnDetalle: setEnDetalle});
            });
            setOrdenes(ords);
            return ords;
        } catch (error) {
            console.log(error);
        } finally {
            setLoad(false);
        }
    }

    // const testNoti = async () => {
    //     try {
    //         const res = await fetch('/api/wn/test', {
    //             body: JSON.stringify({titulo: 'Nuevo Mensaje', texto: 'Mensaje de Prueba Enviado desde la App de Clara Cerámicas'}),
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             method: 'POST'
    //         })
    //         const data = await res.json();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set('fecha1', filtros.fecha1);
        params.set('fecha2', filtros.fecha2);
        params.set('odontologo', filtros.odontologo);
        params.set('paciente', filtros.paciente);
        params.set('orderNumber', filtros.orderNumber);
        params.set('estado', filtros.estado.map(es => es.value).join(','));      
        params.set('material', filtros.materiales.map(es => es.label).join(','));      
        params.set('impresion', filtros.impresiones.map(es => es.label).join(','));      
        params.set('impresionPendiente', filtros.impresionPendiente);      
        params.set('asignada', filtros.asignada);      
        params.set('disenador', filtros.disenador.map(d => d.value).join(','));      
        replace(`${pathname}?${params.toString()}`)
     }, [filtros]);

    useEffect(() => {        
        fetchData();       
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
              .register("/sw.js")
              .then((registration) => {
                console.log("Registration successful");
              })
              .catch((error) => {
                console.log("Service worker registration failed");
            });

            const handleServiceWorker = async () => {
                try {
                    const register = await navigator.serviceWorker.register("/sw.js");
                    const subscription = await register.pushManager.subscribe({
                      userVisibleOnly: true,
                      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                    });            
                    const res = await fetch("/api/wn", {
                      method: "POST",
                      body: JSON.stringify(subscription),
                      headers: {
                        "content-type": "application/json",
                      },
                    });              
                    const data = await res.json();
                    console.log(data);
                } catch (error) {
                     console.log(error);
                }
            };
            //handleServiceWorker();
        }  
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (data && data.user && data.user.perfil === 2) {
            setFiltros(prev => ({...prev, asignada: true}));
            setTimeout(() => {
                fetchData();
            }, 500);
        }  
    }, [data])

    return (
        <>{data && data.user && Number(data.user.perfil) > 0 && 
            <div className="mx-5 mt-1 md:mx-10 md:mt-3">
            {load && <Loader />}
            <Toast props={propsToast} show={toast} setShow={setToast} />
            <h1 className="text-2xl font-bold m-0">Detalle de Órdenes Registradas</h1>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 text-xs">
                <div className="grid grid-rows-2 h-20">
                    <label htmlFor="fecha1" className="flex items-center text-sm h-8">
                        <span>Fecha Inicio: </span>
                    </label>
                    <input type="date" id="fecha1" name="fecha1" value={filtros.fecha1} className="p-4 h-8 border rounded-lg" onChange={handleFiltroChange} />
                </div>
                <div className="grid grid-rows-2 h-20">
                    <label htmlFor="fecha2" className="flex items-center text-sm h-8">
                        <span>Fecha Fin: </span>
                    </label>
                    <input type="date" id="fecha2" name="fecha2" value={filtros.fecha2} className="p-4 h-8 border rounded-lg" onChange={handleFiltroChange} />
                </div>
                <div className={`grid grid-rows-2 ${Number(data.user.perfil)==1 && `hidden`} h-20`}>
                    <label htmlFor="fOdontologo" className="flex items-center text-sm h-8">
                        <span>Odontologo: </span>
                    </label>
                    <input type="text" id="fOdontologo" name="odontologo" value={filtros.odontologo} className="p-4 h-8 border rounded-lg overflow-hidden" onChange={handleFiltroChange} />
                </div>
                <div className="grid grid-rows-2 h-20">
                    <label htmlFor="fPaciednte" className="flex items-center text-sm h-8">
                        <span>Paciente: </span>
                    </label>
                    <input type="text" id="fPaciente" name="paciente" value={filtros.paciente} className="p-4 h-8 border rounded-lg overflow-hidden" onChange={handleFiltroChange} />
                </div>
                <div className="grid grid-rows-2 h-20">
                    <label htmlFor="fOrderNumber" className="flex items-center text-sm h-8">
                        <span>Nro. Orden: </span>
                    </label>
                    <input type="text" id="fOrderNumber" name="orderNumber" value={filtros.orderNumber} className="p-4 h-8 border rounded-lg overflow-hidden" onChange={handleFiltroChange} />
                </div>
                <div className="flex flex-col">
                    <label className="h-8 flex items-center text-sm">
                        <span>Estados: </span>
                    </label>
                    <EstadosSelect setFiltros={setFiltros} perfil={Number(data.user.perfil)}/>
                </div>
                {Number(data.user.perfil) > 1 &&
                <><div className="flex flex-col">
                    <label className="h-8 flex items-center text-sm">
                        <span>Materiales: </span>
                    </label>
                    <MaterialSelect filtros={filtros} setFiltros={setFiltros}/>
                </div>
                <div className="flex flex-col">
                    <label className="h-8 flex items-center text-sm">
                        <span>Impresion 3D: </span>
                    </label>
                    <ImpresionSelect filtros={filtros} setFiltros={setFiltros}/>
                </div>                
                <div className="flex flex-col justify-center items-center h-20">
                    <label className="h-8 flex items-center text-sm">
                        <span>Impresion Pendiente: </span>
                    </label>                    
                    <Switch 
                        checked={filtros.impresionPendiente}
                        onChange={(checked) => setFiltros(prev => ({...prev, 'impresionPendiente': checked}))}
                        height={40}
                        width={80}
                        className="react-switch m-2 h-8"
                    />                   
                </div>
                {Number(data.user.perfil) === 3 &&
                    <div className="flex flex-col">
                        <label className="h-8 flex items-center text-sm">
                            <span>Diseñador: </span>
                        </label>
                        <DisenadorSelect setFiltros={setFiltros} />
                    </div>
                }
                {Number(data.user.perfil) === 2 &&
                    <div className="flex flex-col justify-center items-center h-20">
                        <label className="h-8 flex items-center text-sm">
                            <span>Asignadas a Mi: </span>
                        </label>                    
                        <Switch 
                            checked={filtros.asignada}
                            onChange={(checked) => setFiltros(prev => ({...prev, 'asignada': checked}))}
                            height={40}
                            width={80}
                            className="react-switch m-2 h-8"
                        />                   
                    </div>}
                </>}
                <div className="flex items-end gap-2 flex-wrap">
                    <span onClick={handleSearch} className="p-4 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-200 hover:text-black cursor-pointer flex flex-row gap-2 items-center">
                        <BsSearch size='1rem'/>
                        Buscar
                    </span>
                    {/* <button 
                        onClick={() => testNoti()} 
                        className="p-4 m-5 bg-blue-600 text-white rounded-lg hover:bg-blue-200 hover:text-black cursor-pointer flex flex-row items-center"
                    >
                        <FaBell />
                    </button> */}
                    <span onClick={handleExcel} className="p-4 h-10 bg-green-600 text-white rounded-lg hover:bg-green-200 hover:text-black cursor-pointer flex flex-row gap-2 items-center">
                        <FaFileExcel size='1rem'/>
                        Excel
                    </span>
                </div>
            </div>            
            {
            ordenes && 
            ordenes.map((orden, i) => {
                return (
                <div key={i} className="my-5 border border-black rounded-lg">
                    <div className={`flex flex-row flex-wrap gap-5 place-content-between p-5 ${orden.estado==0 ? 'bg-red-100' : orden.nuevoMsgOdontologo === true && orden.estado == 10 ? 'bg-green-100' : null}`}>                       
                        <div className="flex flex-col gap-5 text-sm">
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
                                <button 
                                    className="p-2 text-sm rounded-lg bg-teal-300 hover:bg-teal-600 hover:text-white ease-in-out duration-500 font-bold flex items-center gap-4"
                                    onClick={verDetalle(orden._id)}
                                >                                    
                                    Ver Detalle
                                    <FaChevronCircleDown size="2rem" />                                    
                                </button>
                            </div>
                            <div className="flex items-center flex-wrap gap-5 my-0">
                                {orden.fechaEstimada2!= '' &&
                                <div className="flex items-center gap-3 m-0">
                                    <h2 className="2xl:text-md">Estimada: </h2>
                                    <h2 className="2xl:text-md font-bold">{orden.fechaEstimada2}</h2>
                                </div>}
                                <div className="flex items-center gap-3 m-0">
                                    {orden.material.map(m => {
                                        if (m.value) {
                                            return (
                                                <div key={m.label} 
                                                    className={`border border-black rounded-xl p-1 text-white text-sm`}
                                                    style={{backgroundColor: materiales.find(mat => mat.label === m.label) && materiales.find(mat => mat.label === m.label).color}}
                                                >
                                                    <strong>{m.label}</strong>
                                                </div>
                                            )
                                        }
                                    })} 
                                     {orden.impresion.map(m => {
                                        if (m.value) {
                                            return (
                                                <div key={m.label} 
                                                    className={`border border-black rounded-xl p-1 text-black text-sm`}
                                                    style={{backgroundColor: impresiones.find(mat => mat.label === m.label) && impresiones.find(mat => mat.label === m.label).color}}
                                                >
                                                    <strong>{m.label}</strong>
                                                </div>
                                            )
                                        }
                                    })} 
                                </div>
                            </div>
                        </div>

                        {orden.mensajes.length > 0 &&
                            <UltimosMsg orden={orden} />
                        }

                        <div className="md:w-[45%] lg:w-[40%] xl:w-[25%] flex flex-col gap-2 text-sm">
                            <div className="grid grid-cols-12 gap-2 text-sm">
                            {data && data.user && 
                                Number(data.user.perfil) === 1
                                ?    <div className={`col-span-12 sm:col-span-6 flex flex-col gap-2`}>
                                        <span className={`flex items-center gap-2 float-right p-2 rounded-xl font-bold text-sm`} style={{backgroundColor: colorEstado(orden.estado, data.user.perfil)}}>
                                            {estadosOrden.find(es => es.value === orden.estado) && 
                                                <><div className="text-2xl">{estadosOrden.find(es => es.value === orden.estado).emojiCliente}</div>
                                                <div className="col-span-9 text-sm">{estadosOrden.find(es => es.value === orden.estado).cliente || 'Indeterminado'}</div></>}
                                        </span>
                                        <button 
                                            className="p-2 rounded-xl bg-red-500 hover:bg-red-100 text-white hover:text-black font-bold flex items-center gap-2"
                                            onClick={() => generarPDFOrden(orden, Number(data.user.perfil))}
                                        >
                                            <FaFilePdf  size="1rem"/>
                                            <span className="text-sm">Descargar PDF</span>
                                        </button>
                                    </div>
                                :   <div className={`col-span-12 sm:col-span-6 flex flex-col gap-5`}>
                                        <span className={`flex items-center gap-4 float-right p-1 rounded-xl font-bold `} style={{backgroundColor: colorEstado(orden.estado, data.user.perfil)}}>
                                            {estadosOrden.find(es => es.value === orden.estado) && 
                                                <><div className="text-2xl">{estadosOrden.find(es => es.value === orden.estado).emoji}</div>
                                                <div className="col-span-9 text-sm">{estadosOrden.find(es => es.value === orden.estado).label}</div></>}
                                        </span>
                                        <button 
                                            className="p-2 rounded-xl bg-red-500 hover:bg-red-100 text-white hover:text-black font-bold flex items-center gap-2"
                                            onClick={() => generarPDFOrden(orden, Number(data.user.perfil))}
                                        >
                                             <FaFilePdf  size="1rem"/>
                                             <span className="text-sm">Descargar PDF</span>
                                        </button>
                                    </div>
                                }
                                {data && Number(data.user.perfil) >= 3
                                ? 
                                    <div className={`col-span-12 sm:col-span-6 flex flex-col content-start justify-items-center overflow-hidden`}>
                                        <label htmlFor={`cambioEstado${orden.orderNumber}`} className="ml-2 py-2">
                                            <span className="text-sm"> Cambiar Estado A: </span>
                                            <select id={`cambioEstado${orden.orderNumber}`} className="py-1 border rounded-lg">
                                                {estadosOrden.map((estado, i) => (
                                                    <option key={i} value={estado.value} style={{backgroundColor: estado.bg}}>{estado.emoji} {estado.label}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <button 
                                            className="ml-2 p-2 rounded-xl bg-yellow-200 hover:bg-yellow-100 text-black hover:text-black font-bold flex items-center gap-2"
                                            onClick={() => cambiarEstado(orden)}
                                        >
                                            <FaRegEdit size="1rem"/>
                                            <span className="text-sm">Modificar Estado</span>
                                        </button>
                                    </div>
                                : data && Number(data.user.perfil) === 2 &&
                                    orden.estado<95 &&
                                        <div className={`col-span-12 sm:col-span-6 flex flex-col content-start justify-items-center overflow-hidden`}>                                    
                                            <button 
                                                className="ml-2 p-2 rounded-xl bg-yellow-200 hover:bg-yellow-100 text-black hover:text-black font-bold flex items-center gap-2"
                                                onClick={
                                                    orden.estado === 1
                                                    ? () => subirEstado(orden, 20)
                                                    : () => subirEstado(orden, estadosOrden[estadosOrden.indexOf(estadosOrden.find(es => es.value === orden.estado)) + 1].value)
                                                }
                                            >
                                                <FaRegEdit size="2rem"/>
                                                <span className="flex flex-col">
                                                    <span className="text-sm">Pasar a Estado</span> 
                                                    <span className="text-sm">{
                                                        orden.estado === 1
                                                        ? <>{estadosOrden[3].emoji} {estadosOrden[3].label}</>
                                                        : orden.estado<95 && <>{estadosOrden[estadosOrden.indexOf(estadosOrden.find(es => es.value === orden.estado)) + 1].emoji} {estadosOrden[estadosOrden.indexOf(estadosOrden.find(es => es.value === orden.estado)) + 1].label}</>
                                                    }
                                                    </span>
                                                </span>
                                            </button>
                                        </div>
                                }
                            </div>
                            <div className="flex flex-row items-center flex-wrap gap-3">
                                {data && Number(data.user.perfil) >= 3 &&
                                    <SelectOdontologos  odontologo={orden.asignada} tipo={2} orden={orden} user={data.user} updateOrder={updateOrder} />
                                }                
                                {orden.asignada && data && Number(data.user.perfil) >= 2 &&
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
                    <Dialog 
                        onClose={handleClose} 
                        open={enDetalle.find(o => o._id === orden._id) ? enDetalle.find(o => o._id === orden._id).enDetalle : false}
                        fullWidth={true}
                        maxWidth={'xl'}
                        scroll={'body'}
                    >                        
                        <DetalleOrden 
                            orden={orden} 
                            updateOrder={updateOrder}
                            handleClose={handleClose}ç
                            enDetalle={enDetalle}
                            actualizarDetalle={actualizarDetalle}
                        />
                    </Dialog>
                </div>
            )})
        }
        </div>
        }</>    
    );
}
