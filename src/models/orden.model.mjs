import mongoose from "mongoose";
import mongooseSecuence from "mongoose-sequence";

const OrderSchema = new mongoose.Schema({
    odontologo: {
        type: Object,
    },
    paciente: {
        type: String,
    },
    sexo: {
        type: String,
    },
    edad: {
        type: Number,
    },
    fechaSolicitada: {
        type: Date,
    },
    fechaEstimada: {
        type: Date,
    },
    piezasSup: {
        type: Array,
    },
    piezasInf: {
        type: Array,
    },
    scans: {
        type: Array,
    },
    imgs: {
        type: Array,
    },
    trabajo: {
        type: Array,
    },
    material: {
        type: Array,
    },
    proceso: {
        type: Array,
    },
    impresion: {
        type: Array,
    },    
    coronas: {
        type: Array,
    },
    color_final: {
        type: String,
    },
    remanente: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    entrega: {
        type: String,
    },
    aditamentos: {
        type: Boolean,
    },
    estado: {
        type: Number,
    },
    historia: {
        type: Array,
    },
    mensajes: {
        type: Array,
    },
    asignada: {
        type: Object,
    },
    nuevoMsgOdontologo: {
        type: Boolean,
    },
}, {
  timestamps: true
});

OrderSchema.plugin(mongooseSecuence(mongoose), {
    inc_field: 'orderNumber',
    start_seq: 1
});
const Orden = mongoose.models.order || mongoose.model("order", OrderSchema)

export default Orden;