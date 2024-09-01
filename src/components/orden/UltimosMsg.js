import { formatoFecha } from "@/src/services/utils/auxiliaresCliente";


export default function UltimosMsg({ orden }) {
    return (
        <div className="flex flex-col gap-5 md:w-[30%]">   
        <h2 className="m-0">Ultimos Mensajes:</h2>                            
        <div className="flex flex-col flex-wrap gap-2">
            {orden.mensajes.slice(-3).reverse().map((hist, i) => (
                <div key={i} className="p-0 flex flex-row">
                    <span className="">{hist.perfil == 1 ? '👩‍⚕️' : '⚠️'}</span>
                    <div key={i} className="p-1 flex items-center flex-wrap gap-2 text-xs">
                        <span className="">{formatoFecha(hist.fecha, false, false, false, false)}</span>
                        <span className="overflow-auto whitespace-normal text-xs font-bold">{hist.mensaje}</span>
                        <span className="">{hist.usuario}</span>
                    </div>
                </div>
            ))}
        </div>                
    </div>
    )
}