import styles from './orden.module.css';

export default function Piezas({ orden, setOrden })  {
    return (
        <div className="m-2">
            <h3 className="font-bold">Piezas Superiores</h3>
            <div className={`my-2 border border-slate-200 rounded-lg p-3 flex items-center flex-wrap gap-1.5`}>
            {
                orden.piezasSup.map(pieza => (
                    renderPieza(pieza, orden, setOrden, true)
                ))
            }
            </div> 

            <h3 className="font-bold">Piezas Inferiores</h3>
            <div className="my-2 border border-slate-200 rounded-lg p-3 flex items-center flex-wrap gap-1.5">
            {
                orden.piezasInf.map(pieza => (
                    renderPieza(pieza, orden, setOrden, false)
                ))
                }
            </div> 
        </div>
    )
}


const renderPieza = (pieza, orden, setOrden, superior) => (

    <label 
        htmlFor={pieza.label} key={pieza.label}
        className={
            `hover:bg-slate-400 text-sm ${(pieza.label === "11" || pieza.label === "41") && 'mr-5'}  ${pieza.value && 'bg-blue-300'}  ${styles.tachado}`}
        >
        <div
            className={
                `border border-black rounded w-[4rem] h-[4rem] flex items-center justify-center`}
                >
            <div
                className={
                    `border border-black rounded w-[3rem] h-[3rem] hover:bg-slate-300 ${pieza.value ? 'bg-blue-200' : 'bg-slate-100'} 
                    flex items-center justify-center z-10 shadow-md`}
                    
                    >
                <strong>{pieza.label}</strong>
                <input
                    type="checkbox"
                    id={pieza.label}
                    name={pieza.label}
                    checked={pieza.value}
                    className="m-1"
                    onChange={superior 
                        ? (e) => setOrden({ ...orden, piezasSup: orden.piezasSup.map(p => p.label === pieza.label ? { ...p, value: e.target.checked } : p)})
                        : (e) => setOrden({ ...orden, piezasInf: orden.piezasInf.map(p => p.label === pieza.label ? { ...p, value: e.target.checked } : p)})
                    }
                />
            </div>
        </div>
    </label> 
)