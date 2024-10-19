"use client";
import React, { useState, useEffect, useRef, use } from 'react';
import { FaUserCheck, FaImage, FaFileUpload, FaUserPlus } from "react-icons/fa";
import { nuevaOrden, validarOrden } from '@/src/services/utils/utils.ordenes.js';
import Image from "next/image.js";
import axios from 'axios';
import Progreso from '@/src/components/Progreso.js';
import Piezas from '@/src/components/orden/Piezas.js';
import { useSession } from "next-auth/react";
import styles from './nuevaOrden.module.css';
import Switch from "react-switch";
import Toast from '@/src/components/Toast.js';
import { useRouter } from 'next/navigation';
import SelectOdontologos from '@/src/components/users/OdontologosSelect';
import Modalusuario from '@/src/components/users/ModalUsuario';
import UploadClouddinary from '@/src/components/orden/UploadClouddinary';
 
const NuevaOrdenDeTrabajo = () => {
    const [ orden, setOrden] = useState(nuevaOrden);
    const [ scans, setScans] = useState([]);
    const [ imgs, setImgs] = useState([]);
    const [ load, setLoad ] = useState(false);
    const [ uploadProgress, setUploadProgress] = useState(0);
    const [ uploadName, setUploadName] = useState('');
    const { data } = useSession();
    const [ adm, setAdm ] = useState(false);
    const [ toast, setToast ] = useState(false);
    const [ propsToast, setPropsToast ] = useState({});
    const router = useRouter();
    const listenerAdded = useRef(false);
    const [ open, setOpen] = useState(false);
    const [ usuario, setUsuario] = useState({});
    const [ fechaEntregaMinima, setFechaEntregaMinima ] = useState(new Date().setDate(new Date().getDate() + 7));
  

    const handleInputChange = (e) => {
        setOrden({
            ...orden,
            [e.target.name]: e.target.value,
        });
    };

    const handleUploadChange = async (e) => {
        e.preventDefault()
        if (e && e.target && e.target.files && e.target.files.length > 0) {            
           await subirFiles(e.target.files);
        }
        e.target.files = null;
    };

    const handleClickAgregar = () => {
        setUsuario({new: true});
        setOpen(true);
    };

    const subirFiles = async (files) => {
        setLoad(true)    
        for await (let file of files) {
            if (!file) continue
            try {
                setUploadName(file.name)
                const ext = file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
                let ruta = '';
                switch (ext) {
                    case 'zip':
                        ruta = 'zip';
                        break;
                    case 'png':
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'svg':
                    case 'webp':
                        ruta = 'imgs';
                        break;
                    default:
                        ruta = 'scans';
                        break;
                }
                const res = await subirFile(file, ruta)
                setUploadName('')
                setUploadProgress(0)
                if (res.ok) {
                    switch (ruta) {
                        case 'zip':
                            res.nombres.map(async (nombre) => {
                                if (nombre.tipo === 'img') {
                                    setImgs(prev => prev.concat(nombre.nombre))
                                } else {
                                    setScans(prev => prev.concat(nombre.nombre))
                                }
                            })
                            break;
                        case 'imgs':
                            setImgs(prev => prev.concat(res.nombre))
                            break;
                        default:
                            setScans(prev => prev.concat(res.nombre))
                            break;
                    }
                }
            } catch (error) {
                console.error('Error subiendo archivo:', error);
            }          
        }
        setLoad(false)
    }

    const subirFile = async (file, ruta) => {
        try {
            const formData = new FormData()
            formData.set('file', file)            
            const rsdo = await axios.post(`/api/uploads/${ruta}`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            setUploadName('')
            setUploadProgress(0)
            return rsdo.data               
        } catch (error) {
            console.error('Error subiendo archivo:', error);
            return {ok: false, nombre: ''}
        }
    }  

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarOrden(orden, scans, setPropsToast, setToast)) return;
        
        setLoad (true);

        let Orden = {};
        let method = '';
        if (orden._id && orden._id !== '') {
            method = 'PUT';
            if (data.user.perfil == 1) orden.nuevoMsgOdontologo = true;
            Orden = {
                ...orden,
                scans,
                imgs,
            };
            Orden.historia.push({
                fecha: new Date().toISOString(), 
                estado: orden.estado, 
                mensaje: `Orden Modificada`, 
                usuario: data.user.nombre+' '+data.user.apellido
            });
        } else {
            method = 'POST';
            Orden = {
                ...orden,
                scans,
                imgs,
                estado: 0,
                historia: [],
                mensajes: [],
            };
        }

        try {
            const res = await fetch('/api/ordenes', {
                body:  JSON.stringify(Orden),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: method
            })
            const data = await res.json()
            if (data.success) {
                setPropsToast({
                    mensaje: `Orden de Trabajo Registrada con Éxito. Número de Orden: ${data.savedOrden.orderNumber}`,
                    tema: 'ok',
                    titulo: 'Registro'
                });
                setToast(true)      
                setOrden(nuevaOrden);
                setScans([]);
                setImgs([]);
            } else {
                setPropsToast({
                    mensaje: 'Error al Registrar la Orden de Trabajo.',
                    tema: 'error',
                    titulo: 'Error'
                });
                setToast(true)       
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        }
        setLoad(false);
    };

    const fetchOrden = async (id, admin) => {
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
                if (ords[0].estado === 0 || ords[0].estado === 10 || admin) {
                    ords[0].fechaSolicitada = ords[0].fechaSolicitada.substring(0,10);
                    setOrden(ords[0]);
                    setScans(ords[0].scans);
                    setImgs(ords[0].imgs);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const labelUpload = document.getElementById('labelUpload');
        const dragUpload = (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'copy';
            labelUpload.classList.add(styles.dragging);
        };
        const dragLeaveUpload = (event) => {
            event.preventDefault();
            event.stopPropagation();
            labelUpload.classList.remove(styles.dragging);
        };
        const dropUpload = (event) => {
            event.preventDefault();
            event.stopPropagation();           
            subirFiles(event.dataTransfer.files);
            labelUpload.classList.remove(styles.dragging);
        };

        labelUpload.addEventListener('dragover', dragUpload);
        labelUpload.addEventListener('dragleave', dragLeaveUpload);
        labelUpload.addEventListener('drop', dropUpload);      
        
        listenerAdded.current = true;
        return () => {
            labelUpload.removeEventListener('dragover', dragUpload);
            labelUpload.removeEventListener('dragleave', dragLeaveUpload);
            labelUpload.removeEventListener('drop', dropUpload);           
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

   useEffect(() => {
        let admin = false
        if (data && data.user && data.user.perfil) {
            data.user.perfil = Number(data.user.perfil)
            if (data.user.perfil === 0 || data.user.perfil === '') router.push('/');
            if (data.user.perfil > 1) {
                setAdm(true);
                admin = true;
            } else {
                setOrden(prev => ({...prev, odontologo: data.user}));
            }
        }
        const dias = admin === true ? 0 : 7;
        setFechaEntregaMinima(new Date().setDate(new Date().getDate() + dias));
        const params = new URLSearchParams(window.location.search);
        const orden = params.get('orden');
        if (orden && orden !== '') {
            fetchOrden(orden, admin);
        }
    }, [data])

    return (
        <div className="m-5 md:m-10">
            <Toast props={propsToast} show={toast} setShow={setToast} />
            <Modalusuario usuario={usuario} setUsuario={setUsuario} open={open} setOpen={setOpen} soloOdon={true}/>
            {orden._id && orden._id !== ''
                ? <h1 className="text-2xl font-bold m-10">Modificación de Órden de Trabajo</h1>
                : <h1 className="text-2xl font-bold m-10">Carga de Nueva Órden de Trabajo</h1>
            }

            {adm && 
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold ml-10">Odontólogo:</h1>
                    <div className="flex flex-row items-center flex-wrap gap-10 ml-10">
                        <SelectOdontologos  odontologo={orden.odontologo} setOrden={setOrden} tipo={1} id={''}/>
                        {orden.odontologo && <h1 className="text-lg font-bold m-10">{orden.odontologo.nombre} {orden.odontologo.apellido}</h1>}
                        
                        <button
                            onClick={handleClickAgregar}
                            className="flex items-center gap-2 p-3 bg-green-200 rounded-xl shadow-xl hover:bg-green-500 sm:text-sm"
                        >
                            <FaUserPlus size="2em" /> 
                            <span className="self-center ml-2">Nuevo Odontólogo</span>
                        </button>
                    </div>
                </div>
            }
            <div className="my-5 flex items-center justify-start flex-wrap">
                <form 
                    className="w-100 md:w-1/2 xl:w-1/3"
                    encType="multipart/form-data"
                    >
                    <label id="labelUpload" htmlFor="fileUpload"
                        className="p-5 bg-green-300 border-2 rounded-xl flex items-center gap-5 hover:bg-green-600 hover:text-white text-xl">
                        <FaFileUpload size="4em" />
                        <div className="grid gap-4">
                            <span>☑️ Arrastrá los Archivos a Subir, ya sean los Escaneos, Imagenes o Archivos Zip.</span>
                            <span>☑️ Tambien podes hacer Clic para Seleccionarlos todos juntos, o de a uno:</span>
                        </div>
                        <input type="file" accept=".*" id="fileUpload" onChange={handleUploadChange} multiple className="hidden" disabled={load}/>
                    </label>                
                </form>

                <UploadClouddinary setScans={setScans} setImgs={setImgs} texto={'NO USAR Click para Subir Archivos de Diseño'} tipo={1}/>
                
                <label htmlFor={`sinAdjunto`} className="m-2 font-bold text-xl flex items-center">
                    <Switch 
                        id={`sinAdjunto`}
                        value={orden.sinAdjunto}
                        checked={orden.sinAdjunto}
                        onChange={(checked) => setOrden({ ...orden, sinAdjunto: !orden.sinAdjunto })}
                        height={20}
                        width={40}
                        className="react-switch m-5 text-xl"
                    />
                    Sin Archivos de Diseño
                </label>
            </div>
            {uploadName && uploadName != '' &&
                <Progreso nombre={uploadName} porc={uploadProgress} />
            }
            {scans.length>0 && <h1 className="font-bold my-5">Escaneos:</h1>}
            <div className="flex flex-wrap gap-2">
                {scans.map(s => (
                    <div key={s.externa ? s.url : s} className="m-2 p-2 border-2 border-black rounded-xl flex items-center justify-center gap-4">
                        <FaFileUpload size="2em" />
                        <h4 className="col-span-12 md:col-span-6 lg:col-span-3">
                            {s.externa ? s.nombre : s}
                        </h4>                        
                        <button
                            onClick={() => setScans(prev => prev.filter(i => i !== s))}
                            className="p-2 bg-red-200 rounded-xl"
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
            
            {imgs.length>0 && <h1 className="font-bold my-5">Imagenes:</h1>}
            <div className="flex flex-wrap gap-2">
                {imgs.map(img => (
                    <div key={img.externa ? img.url : img} className="m-2 p-2 border-2 border-black rounded-xl flex items-center justify-center gap-4">
                        <FaImage size="2em" />
                        {
                            img.externa
                            ?   <>
                                <h4 className="col-span-12 md:col-span-6 lg:col-span-3">{img.nombre}</h4>
                                <img
                                    src={img.url}
                                    alt={img.nombre}
                                    className="col-span-12 md:col-span-6 lg:col-span-3 rounded-lg"                                   
                                    width={100}
                                    height={100}
                                >
                                </img>
                                </>
                            :   <>
                                <h4 className="col-span-12 md:col-span-6 lg:col-span-3">{img}</h4>
                                <Image
                                    src={`/api/files/imgs/${img}`}
                                    width={100}
                                    height={100}
                                    alt={img}
                                    className="col-span-12 md:col-span-6 lg:col-span-3 rounded-lg"
                                />
                                </>
                        }
                        <button
                            onClick={() => setImgs(prev => prev.filter(i => i !== img))}
                            className="p-2 bg-red-200 rounded-xl"
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>              

            <Piezas orden={orden} setOrden={setOrden} />

            <form onSubmit={handleSubmit} className="m-2">
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>Paciente: </span>
                    <input 
                       type="text"
                        autoComplete="paciente"
                        placeholder="Nombre paciente"
                        value={orden.paciente}
                        name="paciente"
                        onChange={handleInputChange}
                        className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 `}
                    />                    
                </div>
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>Sexo: </span>
                    <div className="col-span-6 md:col-span-4 flex flex-wrap gap-3 items-center">
                        <label htmlFor="masculino" className="m-2 font-bold flex items-center">Masculino
                            <input 
                                type="radio"
                                id="masculino"
                                name="sexo"
                                value="Masculino"
                                checked={orden.sexo === 'Masculino'}
                                onChange={handleInputChange}
                                className="m-2 w-[25px] h-[25px]"
                            />
                        </label>
                        <label htmlFor="femenino" className="m-2 font-bold flex items-center">Femenino
                            <input 
                                type="radio"
                                id="femenino"
                                name="sexo"
                                value="Femenino"
                                checked={orden.sexo === 'Femenino'}
                                onChange={handleInputChange}
                                className="m-2 w-[25px] h-[25px]"
                            />
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>Edad: </span>
                    <input 
                        type="number"
                        id="edad"
                        name="edad"
                        min="12"
                        max="110"
                        value={orden.edad}
                        onChange={handleInputChange}
                        className="m-2 p-2 border rounded-lg col-span-6 md:col-span-2 lg:col-span-1"
                    />
                </div>
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>Fecha Solicitada: </span>
                    <input 
                        type="date"
                        autoComplete="fechaSolicitada"
                        value={orden.fechaSolicitada}
                        name="fechaSolicitada"
                        onChange={handleInputChange}
                        className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 `}
                        min={fechaEntregaMinima && fechaEntregaMinima !== '' ? new Date(fechaEntregaMinima).toISOString().substring(0,10) : new Date().toISOString().substring(0,10)}
                    />                    
                </div>

                <div className="my-3 p-3 grid grid-cols-12 items-center border-2 border-white rounded-xl">
                    <span className={`col-span-4 md:col-span-2 `}>Trabajo Solicitado: </span>
                    <div className="col-span-8 md:col-span-8 xl:col-span-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-center">
                        {orden.trabajo.map(trabajo => (
                            <label htmlFor={`trabajo${trabajo.label}`} key={`trabajo${trabajo.label}`} className="m-2 font-bold flex items-center">
                                <Switch 
                                    id={`trabajo${trabajo.label}`}
                                    name="trabajoRadio"
                                    value={`trabajo${trabajo.label}`}
                                    checked={trabajo.value}
                                    onChange={(checked) => setOrden({ ...orden, trabajo: orden.trabajo.map(t => t.label === trabajo.label ? { ...t, value: checked } : t) })}
                                    height={20}
                                    width={40}
                                    className="react-switch m-2"
                                />
                                {trabajo.label}
                            </label>
                        ))}
                        {orden.trabajo.find(t => t.label === 'Otros').value &&
                            <>
                                <label htmlFor="trabajoOtros">Detalle: </label>
                                <input 
                                    type="text"
                                    id="trabajoOtros"
                                    name="trabajoOtros"
                                    value={orden.trabajo.find(t => t.label === 'Otros').detalle}
                                    onChange={(e) => setOrden({ ...orden, trabajo: orden.trabajo.map(t => t.label === 'Otros' ? { ...t, detalle: e.target.value } : t) })}
                                    className="m-2 p-2 border rounded-lg"
                                />
                            </>
                        }        
                    </div>
                </div>
                <div className="my-3 p-3 grid grid-cols-12 items-center border-2 border-white rounded-xl">
                    <span className={`col-span-4 md:col-span-2 `}>Material: </span>
                    <div className="col-span-8 md:col-span-8 xl:col-span-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-center">
                    {orden.material.map(material => (
                        <label htmlFor={`material${material.label}`} key={`material${material.label}`} className="m-2 font-bold flex items-center">
                            <Switch 
                                id={`material${material.label}`}
                                name="materialRadio"
                                value={`material${material.label}`}
                                checked={material.value}
                                onChange={(checked) => setOrden({ ...orden, material: orden.material.map(m => m.label === material.label ? { ...m, value: checked } : m ) })}
                                height={20}
                                width={40}
                                className="react-switch m-2"
                            />
                            {material.label}
                        </label>
                    ))}
                    {orden.material.find(m => m.label === 'Otros').value &&
                        <>
                            <label htmlFor="materialOtros">Detalle: </label>
                            <input 
                                type="text"
                                id="materialOtros"
                                name="materialOtros"
                                value={orden.material.find(m => m.label === 'Otros').detalle}
                                onChange={(e) => setOrden({ ...orden, material: orden.material.map(m => m.label === 'Otros' ? { ...m, detalle: e.target.value } : m) })}
                                className="m-2 p-2 border rounded-lg"
                            />
                        </>
                    }                           
                    </div>
                </div>
                <div className="my-3 p-3 grid grid-cols-12 items-center border-2 border-white rounded-xl">
                    <span className={`col-span-4 md:col-span-2 `}>Proceso: </span>
                    <div className="col-span-8 md:col-span-8 xl:col-span-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-center">
                        {orden.proceso.map(pro => (
                            <label htmlFor={`proceso${pro.label}`} key={`proceso${pro.label}`} className="m-2 font-bold flex items-center">
                                <Switch 
                                    id={`proceso${pro.label}`}
                                    name="procesoRadio"
                                    value={`proceso${pro.label}`}
                                    checked={pro.value}
                                    onChange={(checked) => setOrden({ ...orden, proceso: orden.proceso.map(p => p.label === pro.label ? { ...p, value: checked } : { ...p, value: false } ) })}
                                    height={20}
                                    width={40}
                                    className="react-switch m-2"
                                />
                                {pro.label}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="my-3 p-3 grid grid-cols-12 items-center border-2 border-white rounded-xl">
                    <span className={`col-span-4 md:col-span-2 `}>Impresión 3D: </span>
                    <div className="col-span-8 md:col-span-8 xl:col-span-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-center">
                        {orden.impresion.map(impre => (
                            <label htmlFor={`impresion${impre.label}`} key={`impresion${impre.label}`} className="m-2 font-bold flex items-center">
                                <Switch 
                                    id={`impresion${impre.label}`}
                                    name="impresionRadio"
                                    value={`impresion${impre.label}`}
                                    checked={impre.value}
                                    onChange={(checked) => setOrden({ ...orden, impresion: orden.impresion.map(i => i.label === impre.label ? { ...i, value: checked } : i ) })}
                                    height={20}
                                    width={40}
                                    className="react-switch m-2"
                                />
                                {impre.label}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="my-3 p-3 grid grid-cols-12 items-center border-2 border-white rounded-xl">
                    <span className={`col-span-6 md:col-span-2 `}>Coronas o Puentes sobre Implantes: </span>
                    <div className="col-span-12 md:col-span-8 xl:col-span-4 grid grid-cols-2 gap-3 items-center">
                    {orden.coronas.map(dato => (
                        <label htmlFor={dato.label} key={dato.label} className="mx-2 font-bold">
                            {dato.label}: 
                            <input 
                                type="text"
                                id={dato.label}
                                name={dato.label}
                                value={dato.value}
                                onChange={(e) => setOrden({ ...orden, coronas: orden.coronas.map(c => c.label === dato.label ? { ...c, value: e.target.value } : c) })}
                                className="m-2 p-2 border rounded-lg"
                            />
                        </label>
                    ))}                                      
                    </div>
                </div>
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>Color Final: </span>
                    <input 
                        type="text"
                        id="color_final"
                        name="color_final"
                        value={orden.color_final}
                        onChange={handleInputChange}
                        className="m-2 p-2 border rounded-lg col-span-6 md:col-span-5 xl:col-span-4"
                    />
                </div>
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>Remanente: </span>
                    <input 
                        type="text"
                        id="remanente"
                        name="remanente"
                        value={orden.remanente}
                        onChange={handleInputChange}
                        className="m-2 p-2 border rounded-lg col-span-6 md:col-span-5 xl:col-span-4"
                    />
                </div>
                <div className="grid grid-cols-12 items-center">
                    <span className="p-2 col-span-6 md:col-span-2 font-bold">Descripción Detallada del Trabajo Solicitado: </span>
                    <textarea 
                        autoComplete="descripcion"
                        placeholder="Detalle Órden de Trabajo"
                        value={orden.descripcion}
                        name="descripcion"
                        onChange={handleInputChange}
                        className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 `}
                        style={{ minHeight: "200px" }}
                    />
                </div>
                <div className="my-4 grid grid-cols-12">
                    <label htmlFor="aditamentos" className={`p-2 col-span-12 flex items-center`}>Tiene Aditamentos para Retirar?:
                        <Switch 
                            onChange={(checked) => setOrden({ ...orden, aditamentos: checked })}
                            checked={orden.aditamentos}
                            className="react-switch m-2 ml-10"
                            id="aditamentos"
                            height={30}
                            width={60}
                        />
                    </label>
                </div>
                <div className="grid grid-cols-12 items-center">
                    <span className={`col-span-6 md:col-span-2 `}>
                        {orden.aditamentos
                         ? 'Detalle, Lugar y Horario de Retiro y Entrega.' 
                         : 'Detalle, Lugar y Horario de Retiro.'
                        }
                    </span>
                    <textarea 
                        autoComplete="entrega"
                        placeholder="Detalle, Lugar y Horario de Entrega"
                        value={orden.entrega}
                        name="entrega"
                        onChange={handleInputChange}
                        className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 `}
                    />
                </div>
                <button 
                    type="submit" 
                    className="flex justify-center rounded-md border shadow-xl p-4 m-5 bg-green-200 font-medium 
                            text-black hover:bg-green-500 sm:text-sm col-span-3 sm:col-span-2 rounded-xl"
                    disabled={load}
                >
                    <FaUserCheck size="2em" /> 
                    <span className="self-center ml-2">Registrar Orden de Trabajo</span>
                </button>
            </form>
           
        </div>
    );
};

export default NuevaOrdenDeTrabajo;