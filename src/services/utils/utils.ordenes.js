export const estadosOrden = [
    { value: 0, label: "Recibida", bg: '#fbf8cc', emoji: '📥', cliente: 'En Revisión'},
    { value: 1, label: "Descargada", bg: '#fde4cf', emoji: '🖨️', cliente: 'En Revisión'},
    { value: 10, label: "Observada", bg: '#ffcfd2', emoji: '⚠️', cliente: 'Observada'},
    { value: 20, label: "A Diseñar", bg: '#b9fbc0', emoji: '✅', cliente: 'Confirmada'},
    { value: 30, label: "En Diseño", bg: '#dedbd2', emoji: '🖥️', cliente: 'Confirmada'},
    { value: 40, label: "En Aprobación", bg: '#cfbaf0', emoji: '🕒', cliente: 'Confirmada'},
    { value: 50, label: "En Fresado", bg: '#a3c4f3', emoji: '🛠️', cliente: 'Confirmada'},
    { value: 90, label: "En Terminación", bg: '#90dbf4', emoji: '📦', cliente: 'Confirmada'},
    { value: 91, label: "Facturada", bg: '#98f5e1', emoji: '💸', cliente: 'Confirmada'},
    { value: 95, label: "Entregada", bg: '#80ed99', emoji: '🚚', cliente: 'Confirmada'},
    { value: 99, label: "Cancelada", bg: '#f4acb7', emoji: '❌', cliente: 'Cancelada'}
];

export const colorEstado = (estado) => {
    const color = estadosOrden.find(e => e.value === estado);
    return color ? color.bg : '';   
}

export const nuevaOrden = {
    paciente: '',
    sexo: '',
    edad: 12,
    fechaSolicitada: '',
    sinAdjunto: false,
    piezasSup: [
        {label: "18", value: false},
        {label: "17", value: false},
        {label: "16", value: false},
        {label: "15", value: false},
        {label: "14", value: false},
        {label: "13", value: false},
        {label: "12", value: false},
        {label: "11", value: false},
        {label: "21", value: false},
        {label: "22", value: false},
        {label: "23", value: false},
        {label: "24", value: false},
        {label: "25", value: false},
        {label: "26", value: false},
        {label: "27", value: false},
        {label: "28", value: false},
    ],
    piezasInf: [
        {label: "48", value: false},
        {label: "47", value: false},
        {label: "46", value: false},
        {label: "45", value: false},
        {label: "44", value: false},
        {label: "43", value: false},
        {label: "42", value: false},
        {label: "41", value: false},
        {label: "31", value: false},
        {label: "32", value: false},
        {label: "33", value: false},
        {label: "34", value: false},
        {label: "35", value: false},
        {label: "36", value: false},
        {label: "37", value: false},
        {label: "38", value: false},
    ],
    trabajo: [
        {label: "Corona", value: false},
        {label: "Puente", value: false},
        {label: "Incrustación", value: false},
        {label: "Carilla", value: false},
        {label: "Férula", value: false},
        {label: "Híbrida", value: false},
        {label: "Encerado DG", value: false},
        {label: "Provisorio", value: false},
        {label: "Otros", value: false, detalle: ''},
    ],
    material: [
        {label: "Zirconio", value: false, color: '#0077b6', emoji: '🔵'},
        {label: "Di Silicato de Litio", value: false, color: '#d62828', emoji: '🔴'},
        {label: "PMMA", value: false, color: '#161a1d', emoji: '⚫'},
        {label: "Otros", value: false, detalle: '', color: '#161a1d', emoji: '⚫'},
    ],
    proceso: [
        {label: "Monolítico", value: false},
        {label: "Estratificado", value: false},
    ],
    impresion: [
        {label: "Protocolo", value: false, realizada: false, color: '#8ac926', emoji: '🟢'},
        {label: "Modelo", value: false, realizada: false, color: '#fcf300', emoji: '🟡'},
    ],
    coronas: [
        {label: "Marca", value: ''},
        {label: "Medida", value: ''},
        {label: "Scan Body", value: ''},
        {label: "Interfase", value: ''},
    ],
    color_final: '',
    remanente: '',
    descripcion: '',
    aditamentos: false,
    entrega: ''
}


export const validarOrden = (orden, scans, setPropsToast, setToast) => {
    if (!orden.odontologo || orden.odontologo == '' || orden.odontologo == null) {
        setPropsToast({
            mensaje: 'No está Asignado el Odonotologo Correctamente.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true) 
        return false;
    }
    if (scans.length === 0 && orden.sinAdjunto === false) {
        setPropsToast({
            mensaje: 'Cargá al menos un Archivo de Scan.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true) 
        return false;
    }
    if (!orden.piezasSup.some(pieza => pieza.value) && !orden.piezasInf.some(pieza => pieza.value)) {
        setPropsToast({
            mensaje: 'Seleccioná al menos una Pieza Dental.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }

    if (orden.paciente === '') {
        setPropsToast({
            mensaje: 'Completá Nombre del Paciente.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
    if (orden.sexo === '') {
        setPropsToast({
            mensaje: 'Completá Sexo del Paciente.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
    if (orden.edad === '' || orden.edad  < 10 || orden.edad > 100) {
        setPropsToast({
            mensaje: 'Completá Edad del Paciente Correctamente.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
    if (orden.fechaSolicitada === '') {
        setPropsToast({
            mensaje: 'Completá Fecha Solicitada.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
    if (!orden.trabajo.some(item => item.value)) {
        setPropsToast({
            mensaje: 'Seleccioná Alguna Opción de Trabajo.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
    if (orden.trabajo.some(item => item.label === 'Otros' && item.value && item.detalle === '')) {
        setPropsToast({
            mensaje: 'Completá Detalle de Trabajo.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
    if (!orden.material.some(item => item.value)) {
        setPropsToast({
            mensaje: 'Seleccioná Alguna Opción de Material.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
    if (orden.material.some(item => item.label === 'Otros' && item.value && item.detalle === '')) {
        setPropsToast({
            mensaje: 'Completá Detalle de Material.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
       
    if (orden.descripcion === '') {
        setPropsToast({
            mensaje: 'Completá Descripción del Trabajo.',
            tema: 'error',
            titulo: 'Error'
        });
        setToast(true)
        return false;
    }
    return true;
}