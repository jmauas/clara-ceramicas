import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import User from "@/src/models/auth.model.js";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"

mongo();

export async function PUT(request) {
  try {
    const user = await request.json();
    let { email } = user;
    email = email.toLowerCase();
    let saved = await User.findOne({ email });
    if (!saved) {
      return NextResponse.json(
        { error: "No se Ecuentra usuario" },
        { status: 400 }
      );
    }
       
    saved.nombre = user.nombre;
    saved.apellido = user.apellido;
    saved.cuit = user.cuit;
    saved.consultorio = user.consultorio;
    saved.telefono = user.telefono;
    saved.celular = user.celular;
    saved.domicilio = user.domicilio;
    saved.localidad = user.localidad;
    saved.provincia = user.provincia;
    saved.cp = user.cp;
    saved.incompleto = false
    if (user.password && user.password !== '') {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(user.password, salt);
      saved.password = hashedPassword;
    }
    
    await saved.save();

    return NextResponse.json({
      message: "Usuario Actualizado",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}