import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    subscriptor: {
        type: Object,
    },
    errores: {
        type: Number,
    },
    user: {
        type: Object,
    },
}, {
  timestamps: true
});

/**
 * Represents a collection of subscribers.
 * @typedef {import('mongoose').Model} Subscriptores
 */
const Subscriptores = mongoose.models.subscriptores || mongoose.model("subscriptores", Schema)

export default Subscriptores;