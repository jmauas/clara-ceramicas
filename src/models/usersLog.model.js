import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    email: {
        type: String,   
    },
    perfil: {
        type: Number,    
    },
    provider: {
        type: String,
    },
    ip: {
        type: String,
    },
    agent: {
        type: String,
    },
    tipo: {
        type: Number,
    },
}, {
  timestamps: true
});

const Log = mongoose.models.log || mongoose.model("log", Schema)

export default Log;