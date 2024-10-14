import { formatoFecha } from "@/src/services/utils/auxiliaresCliente";

export const normalizarOrden = ({orden, setEnDetalle}) => {
    const soli = new Date(orden.fechaSolicitada);
    soli.setHours(soli.getHours() + 3);
    let esti = '';
    let esti2 = '';
    if (orden.fechaEstimada) {
        esti = new Date(orden.fechaEstimada);
        esti.setHours(esti.getHours() + 3);
        esti2 = formatoFecha(orden.fechaEstimada, false, false, false, true)
        esti = esti.toISOString().substring(0,10)
    }
    setEnDetalle(prev => prev.concat([{_id: orden._id, enDetalle: false}]));
    return {
        ...orden,
        fechaSolicitada: soli,
        fechaEstimada: esti,
        fechaEstimada2: esti2
    }
}