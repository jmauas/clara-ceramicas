import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  nombre: {
    type: String,
  },
  apellido: {
    type: String,
    required: [true, "Por Favor, Ingresá tu Apellido o Razón Social."],
  },
  email: {
    type: String,
    required: [true, "Por favor, ingresá un EMail Válido."],
    unique: true,
  },
  password: {
    type: String,
  },
  perfil: {
    type: Number,
    default: 1,
  },
  consultorio: {
    type: String,
  },
  celular: {
    type: String,
  },
  cuit: {
    type: Number,
  },
  telefono: {
    type: String,
  },
  domicilio: {
    type: String,
  },
  localidad: {
    type: String,
  },
  provincia: {
    type: String,
  },
  cp: {
    type: String,
  },
  codigo: {
    type: String,
  },
  picture: {
    type: String,
  },
  token: {
    type: String,    
  },
  incompleto: {
    type: Boolean,
    default: false,
  },
  logs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'log',
  }],
}, {
  timestamps: true
});

/**
 * User model represents a user in the application.
 * @typedef {import('mongoose').Model} User
 */
const User = mongoose.models.user || mongoose.model("user", Schema)

export default User;