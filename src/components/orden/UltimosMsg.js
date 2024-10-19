import { formatoFecha } from "@/src/services/utils/auxiliaresCliente";
import { FaPaperclip } from "react-icons/fa";

export default function UltimosMsg({ orden }) {
    return (
        <div className="flex flex-col gap-5 md:w-[30%]">   
            <h2 className="m-0">Ultimos Mensajes:</h2>                            
            <div className="flex flex-col flex-wrap gap-2">
                {orden.mensajes.slice(-3).reverse().map((hist, i) => (
                    <div key={i} className={`p-0 rounded-md flex flex-row items-center ${hist.perfil === 1 ? 'bg-green-300' : 'bg-sky-200'}
                        ${hist.perfil == 1 && orden.nuevoMsgOdontologo == true && orden.estado == 10 && i== 0 &&
                            ' animate-pulse' 
                        }                    
                    `}>
                        <span className="">{hist.perfil == 1 ? '👩‍⚕️' : '⚠️'}</span>
                        {hist.perfil == 1 && orden.nuevoMsgOdontologo == true && i== 0 && orden.estado == 10 && 
                            '❗❗'}
                        <div key={i} className="p-1 flex items-center flex-wrap gap-2 text-xs">
                            <span className="">{formatoFecha(hist.fecha, false, false, false, false)}</span>
                            <span className="overflow-auto whitespace-normal text-xs font-bold">{hist.mensaje}</span>
                            <span className="">{hist.usuario}</span>
                            <span className="flex items-center">
                                {hist.adjunto && hist.adjunto.nombre && hist.adjunto.nombre !== '' &&
                                    <a
                                        href={`${hist.adjunto.externa ? hist.adjunto.url : hist.adjunto.tipo === 'img' ? '/api/files/imgs/'+hist.adjunto.nombre : '/api/files/scans/'+hist.adjunto.nombre}`}
                                        className="p-1 rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-800"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FaPaperclip size="1em" />
                                    </a>
                                }
                            </span>
                        </div>
                    </div>
                ))}
            </div>                
        </div>
    )
}