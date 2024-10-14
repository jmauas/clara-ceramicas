import React from 'react';
import { FaFileUpload } from "react-icons/fa";
import axios from 'axios';
import UploadClouddinary from '@/src/components/orden/UploadClouddinary';

export default function NuevoMensaje({orden, data, load, setLoad, setPropsToast, setToast, updateOrder}) {

    const handleUploadChange = async (e) => {
        e.preventDefault();
        if (e && e.target && e.target.files && e.target.files.length > 0) {            
           await subirFiles(e.target.files);
        }
        e.target.files = null;
    };
    
    const subirFiles = async (files) => {
        setLoad(true)    
        for await (let file of files) {
            if (!file) continue
            try {
                let ext = file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
                let ruta = '';
                switch (ext) {
                    case 'zip':
                        ruta = 'adjuntos/zip';
                        break;
                    case 'png':
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'svg':
                    case 'webp':
                        ruta = 'adjuntos/img';
                        break;
                    default:
                        ruta = 'adjuntos/scans';
                        break;
                }
                const res = await subirFile(file, ruta);
            } catch (error) {
                console.error('Error subiendo archivo:', error);
            }          
        }       
        setPropsToast({
            mensaje: `Archivos Enviados.`,
            tema: 'ok',
            titulo: 'Archivos Enviados con Éxito'
        });
        setToast(true);        
        setLoad(false)
        document.getElementById('btn-msg').classList.add('hidden');
        document.getElementById('btn-msgAdj').classList.remove('hidden');
    }

    const subirFile = async (file, ruta) => {
        try {
            const formData = new FormData()
            formData.set('file', file)            
            let rsdo = await axios.post(`/api/wn/${ruta}`, formData);
            
            const adjuntos = rsdo.data.nombres;
            if (adjuntos && adjuntos.length > 0) {
                for await (let adjunto of adjuntos) {
                    const url = adjunto.tipo === 'img' ? `/api/wn/adjuntos/img` : `/api/wn/adjuntos/scans`;
                    rsdo = await axios.put(url, {orden: orden, adjunto: adjunto.nombre, userEnvia: data.user});
                }
            }
            return rsdo.data
        } catch (error) {
            console.error('Error subiendo archivo:', error);
            return {ok: false, nombre: ''}
        }
    }


    const onMsgSend = async (orden, perfil, conAdj) => {
        setLoad(true);
        const nuevoMsg = document.getElementById(`${conAdj ? 'textoMsgAdj' : 'textoMsg'}${orden._id}`).value;
        if (nuevoMsg && nuevoMsg !== '') {
            if (perfil>1) {
                if (!conAdj)  {
                    orden.estado = 10;
                    orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Estado Modificado a Observada por Envio Mensaje.`, usuario: data.user.nombre+' '+data.user.apellido});
                }
            } else {
                orden.nuevoMsgOdontologo = true;
            }
            orden.mensajes.push({fecha: new Date().toISOString(), mensaje: nuevoMsg, usuario: data.user.nombre+' '+data.user.apellido, perfil: perfil});
            await updateOrder(orden);
            
            const msg = {
                texto: `${nuevoMsg}.
En Orden Nro. ${orden.orderNumber} del Paciente ${orden.paciente}.
Dr. ${orden.odontologo.nombre} ${orden.odontologo.apellido}.`
            }
            msg.conAdj = conAdj;
            if (perfil>1) {
                msg.titulo = 'Mensaje del Laboratorio en Orden de Trabajo';
            } else {
                msg.titulo = 'Mensaje del Odontologo en Orden de Trabajo';
            }
            
            const res = await fetch('/api/wn/send', {
                body: JSON.stringify({msg: msg, userEnvia: data.user, orden: orden}),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            })
            let rsdo = await res.json();
            if (rsdo.ok) {
                setPropsToast({
                    mensaje: `Mensaje Enviado con Éxito.`,
                    tema: 'ok',
                    titulo: 'Mensaje Enviado'
                });
                setToast(true);
            } else {
                setPropsToast({
                    mensaje: rsdo.message,
                    tema: 'error',
                    titulo: 'Error'
                });
                setToast(true);
            }
        }
        setLoad(false);
        document.getElementById('btn-msg').classList.remove('hidden');
        if (document.getElementById('btn-msgAdj')) document.getElementById('btn-msgAdj').classList.add('hidden');
    }

    return (
        <div className="flex flex-col items-start place-content-around bg-slate-100 rounded-xl p-4 shadow-xl gap-8">
            <div className="flex items-center justify-content-center flex-wrap gap-4" id="btn-msg">            
                <div className="flex flex-col gap-2">
                    <span>Nuevo Mensaje: </span>
                    <textarea className="border-2 border-black p-2 rounded-xl" id={`textoMsg${orden._id}`}>
                    </textarea>
                </div>
                <button className="p-2 border-2 border-black rounded-xl bg-green-300 hover:bg-green-500 hover:text-white"
                    onClick={() => onMsgSend(orden, Number(data.user.perfil), false)}
                    disabled={load}
                    >Enviar Mensaje
                </button>
            </div>
            {Number(data.user.perfil)>1 &&
                <div className="flex flex-col gap-2">
                    <span>Nuevo Adjunto: </span>
                    <form 
                        className="grid grid-cols-12 items-center"
                        encType="multipart/form-data"
                    >
                        <label id="labelUpload" htmlFor="fileUpload"
                            className="p-3 bg-green-300 border-2 rounded-xl col-span-12 flex items-center gap-5 hover:bg-green-600 hover:text-white">
                            <FaFileUpload size="4em" />
                            <div className="grid gap-4">
                                <span>☑️ Arrastrá los Archivos a Subir.</span>
                                <span>☑️ Tambien podes hacer Clic para Seleccionarlos.</span>
                            </div>
                            <input type="file" accept=".*" id="fileUpload" onChange={handleUploadChange} multiple className="hidden" disabled={load}/>
                        </label>                
                    </form>

                    <UploadClouddinary  texto={'Click para Enviar Archivos'} tipo={2} orden={orden} user={data.user} />

                    <div className="flex items-center justify-content-center flex-wrap gap-4 hidden" id="btn-msgAdj">            
                        <div className="flex flex-col gap-2">
                            <span>Mensaje que Acompaña al Adjunto: </span>
                            <textarea className="border-2 border-black p-2 rounded-xl" id={`textoMsgAdj${orden._id}`}>
                            </textarea>
                        </div>
                        <button className="p-2 border-2 border-black rounded-xl bg-green-300 hover:bg-green-500 hover:text-white"
                            onClick={() => onMsgSend(orden, Number(data.user.perfil), true)}
                            disabled={load}
                            >Enviar Mensaje
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}