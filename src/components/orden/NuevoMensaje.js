import React from 'react';
import { FaFileUpload, FaWhatsapp } from "react-icons/fa";
import axios from 'axios';
import UploadClouddinary from '@/src/components/orden/UploadClouddinary';


const mensaje = (orden, adjunto, perfil) => {
    const conAdj = adjunto && adjunto !== '';
    const msg = {texto: '', conAdj: conAdj, titulo: '', entrega: false, wa: ''};
    if (perfil==1) {
        msg.titulo = `👩‍⚕️ *Mensaje del Odontologo en Orden de Trabajo*`;
    } else {
        msg.titulo = `⚠️ *Mensaje del Laboratorio en Orden de Trabajo*`;
    }
    msg.texto +=  document.getElementById(`textoMsg${orden._id}`).value; 
    msg.wa = `
En Orden Nro. ${orden.orderNumber} del Paciente ${orden.paciente}.
Dr. ${orden.odontologo.nombre} ${orden.odontologo.apellido}.`
    if (conAdj) {
        msg.wa += `*Para Responderlo, hace click en este Link:*`;
    } else {
        msg.wa += `*Para ver el Mensaje y Responderlo, hace click en este Link:*`;
    } 
    return msg;
}

export const onMsgSend = async (orden, perfil, adjunto, user, updateOrder) => {
    const msg  = mensaje(orden, adjunto, perfil);
    if (perfil>1) {
        orden.estado = 10;
        orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Estado Modificado a Observada por Envio Mensaje.`, usuario: user.nombre+' '+user.apellido});
    } else {
        orden.nuevoMsgOdontologo = true;
    }
    orden.mensajes.push({
        fecha: new Date().toISOString(), 
        mensaje: msg.texto, 
        usuario: user.nombre+' '+user.apellido, 
        perfil: perfil,
        adjunto: adjunto,            
    });
    await updateOrder(orden);
    const res = await fetch('/api/wn/send', {
        body: JSON.stringify({msg: msg, userEnvia: user, orden: orden}),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    })
    let rsdo = await res.json();
    return rsdo;   
}


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
        // setPropsToast({
        //     mensaje: `Archivos Enviados.`,
        //     tema: 'ok',
        //     titulo: 'Archivos Enviados con Éxito'
        // });
        setToast(true);        
        setLoad(false)
    }

    const subirFile = async (file, ruta) => {
        try {
            const formData = new FormData()
            formData.set('file', file)            
            let rsdo = await axios.post(`/api/wn/${ruta}`, formData);

            const adjuntos = rsdo.data.nombres;
            if (adjuntos && adjuntos.length > 0) {
                for await (let adjunto of adjuntos) {
                    setLoad(true);
                    let rsdo = await onMsgSend(orden, data.user.perfil, adjunto, data.user, updateOrder)
                    // const url = adjunto.tipo === 'img' ? `/api/wn/adjuntos/img` : `/api/wn/adjuntos/scans`;
                    // rsdo = await axios.put(url, {orden: orden, adjunto: adjunto.nombre, userEnvia: data.user, mensaje: nuevoMsg});
                    setLoad(false);
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
            }
            return {ok: true, nombre: ''}
        } catch (error) {
            console.error('Error subiendo archivo:', error);
            return {ok: false, nombre: ''}
        }
    }

    return (
        <div className="flex flex-col items-start place-content-around bg-slate-100 rounded-xl p-4 shadow-xl gap-8">
            <div className="flex items-center justify-content-center flex-wrap gap-4" id="btn-msg">            
                <div className="flex flex-col gap-2">
                    <span>Nuevo Mensaje: </span>
                    <textarea className="border-2 border-black p-2 rounded-xl" id={`textoMsg${orden._id}`}>
                    </textarea>
                </div>
                < button className="p-2 border-2 border-black rounded-xl bg-green-300 hover:bg-green-500 hover:text-white flex gap-2 items-center"
                    onClick={() => onMsgSend(orden, Number(data.user.perfil), '', data.user, updateOrder)}
                    disabled={load}
                >
                    <FaWhatsapp size="2em"/>
                    Enviar Mensaje
                </button>
                {data.user.perfil > 1 && <>
                <form 
                    className="p-2 border-2 border-black rounded-xl bg-green-300 hover:bg-green-500 hover:text-white"
                    encType="multipart/form-data"
                >
                    <label id="labelUpload" htmlFor="fileUpload"
                        className=" flex gap-2 items-center">
                        <FaWhatsapp size="2em"/>
                        <FaFileUpload size="2em" />
                        Enviar Adjunto y Mensaje.
                        <input type="file" accept=".*" id="fileUpload" onChange={handleUploadChange} multiple className="hidden" disabled={load}/>
                    </label>                
                </form>
                <UploadClouddinary  texto={'NO USAR Click para Enviar Archivos'} tipo={2} orden={orden} user={data.user} />
                </>}
            </div>
        </div>
    );
}