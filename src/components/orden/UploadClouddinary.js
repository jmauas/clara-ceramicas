import { CldUploadWidget } from 'next-cloudinary';
import { FaFileUpload } from 'react-icons/fa';
import { onMsgSend } from '@/src/components/orden/NuevoMensaje.js';
import { useSession } from "next-auth/react";
import { actualizarOrden } from "@/src/app/ordenes/utilidades.js";


const updateOrder = async (orden) => {
    try {
        const datos = await actualizarOrden(orden);
        return datos;
    } catch (error) {
        console.log(error);
    }
}  


export default function UploadClouddinary({ setScans, setImgs, texto, tipo, orden, user }) {
    const { data } = useSession();

    const uploadHandler = async (result, { widget }) => {
        if (result.event === 'success') {            
            console.log(result.info)
            let {original_filename, format, secure_url, public_id } = result.info;
            if (!original_filename) original_filename = secure_url.substring(secure_url.lastIndexOf('/')+1);
            if (!format) format = secure_url.substring(secure_url.lastIndexOf('.')+1);
            if (tipo == 1) {
                const adjunto = {externa: true, nombre: original_filename, url: secure_url, public_id: public_id}
                if (format === 'png' || format === 'jpg' || format === 'jpeg' || format === 'gif' || format === 'webp' || format === 'svg' || format === 'bmp' || format === 'tiff' || format === 'ico') {
                    setImgs(prev => prev.concat(adjunto))
                } else {
                    setScans(prev => prev.concat(adjunto))
                }
            } else {
                let tipo = 'scan';
                if (format === 'png' || format === 'jpg' || format === 'jpeg' || format === 'gif' || format === 'webp' || format === 'svg' || format === 'bmp' || format === 'tiff' || format === 'ico') {
                    tipo = 'img';
                }
                const adjunto = {externa: true, nombre: original_filename, url: secure_url, tipo: tipo};
                await onMsgSend(orden, user.perfil, adjunto, data.user, updateOrder)
            }
        }       
    }

    return (
        <label className={`p-2 bg-green-300 border-2 rounded-xl flex items-center gap-5 hover:bg-green-600 hover:text-white shadow-xl ${tipo=='1' && 'text-xl p-5'}`}>
            <FaFileUpload size={`${tipo=='1' ? '4em' : '2em'}`} />
            {/* https://upload-widget.cloudinary.com/2.19.33/global/text.json */}
            <CldUploadWidget 
                uploadPreset="imgClara"
                onSuccess={uploadHandler}
                options={{
                    sources: ['local', 'camera', 'google_drive', 'url', 'dropbox', 'instagram', 'one_drive'],
                    multiple: true,
                    folder: 'imgs',
                    language: 'es',
                    showPoweredBy: false,
                    text: {
                        es: {
                            OR: 'O',
                            menu: {
                                files: 'Subir desde tu dispositivo'
                            },
                            local: {
                                browse: 'Buscar',
                                dd_title_multi: 'Arrastrá los Archivos Acá.',
                                drop_title_multiple: 'Soltá los Archivos Acá.',                                       
                            },
                            "camera": {
                                "capture": "Capturar",
                                "cancel": "Cancelar",
                                "take_pic": "Tamar Foto y Subirla",
                                "explanation": "Asegurate que tu Cámara está conectada y que tu explorador permita acceder a la Cámara. Cuando estás listo, hacé click para capturar y subir.",
                                "camera_error": "Error al Acceder a la Cámara.",
                                "retry": "Reintentar Acceso a la Cámara",
                                "file_name": "Camera_{{time}}"
                            },
                            "dropbox": {
                                "no_auth_title": "Subir Archivos desde Dropbox.",
                                "no_auth_action": "Conectar a Dropbox",
                                "no_photos": "Sin Fotos",
                                "no_files": "Sin Archivos",
                                "root_crumb": "Root",
                                "list_headers": {
                                    "select": "Seleccionar",
                                    "name": "Nombre",
                                    "modified": "Modificado"
                                },
                                "menu": {
                                    "browse": "Explorar",
                                    "recent": "Reciente"
                                },
                                "authenticating": "Autenticando..."
                            },
                            "google_drive": {
                                "no_auth_title": "Subir Archivos desde Google Drive.",
                                "no_auth_action": "Conectar a Google Drive",
                                "search": {
                                    "placeholder": "Buscando...",
                                    "reset": "Reset Buscar"
                                },
                                "grid": {
                                    "folders": "Carpetas",
                                    "files": "Archivos",
                                    "empty_folder": "Carpeta Vacía",
                                },
                                "recent": "Reciente",
                                "starred": "Favoritos",
                                "my_drive": "Mi Unidad",
                                "shared_drive": "Unidades Compartidas",
                                "search_results": "Resultados de la Búsqueda",
                                "shared_with_me": "Compartido Conmigo",
                                "name": "Nombre",
                                "modifiedTime": "Modificado",
                                "modifiedByMeTime": "Modificado por Mí",
                                "viewedByMeTime": "Visto por Mí",
                                "notifications": {
                                    "retrieve_failed": "Error al Recuperar Archivos subidos a Google Drive.",
                                }
                            },                               
                        }
                    }
                }}
            >
                {({ open }) => {
                    return (
                    <button onClick={() => open()}>
                        {texto}
                    </button>
                    );
                }}
            </CldUploadWidget>    
        </label>          
    )
}