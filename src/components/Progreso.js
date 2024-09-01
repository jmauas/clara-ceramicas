


export default function Progreso({ nombre, porc})  {

    return (
        <div className="m-2 border-slate-300 rounded-lg">
            <div className="m-2 flex items-center gap-5">
                <span className="font-bold">Subiendo Archivo {nombre}</span>
                <span className="text-3xl font-bold">{porc} %</span>
            </div>
            <div className="h-2 bg-gray-200 border-slate-300">
                <div style={{ width: `${porc}%` }} className="h-full bg-green-500"></div>
            </div>
        </div>
    )
}