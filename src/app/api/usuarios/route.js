import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import User from "@/src/models/auth.model.js";
import Log from "@/src/models/usersLog.model.js";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

mongo();

export async function POST(request) {
  try {
    const user = await request.json();
    let { email, password } = user;
    email = email.toLowerCase();
    const exist = await User.findOne({ email });
    if (exist) {
      return NextResponse.json(
        { error: "El Usuario Ya Existe ¡¡¡¡" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      ...user,
      password: hashedPassword,
      incompleto: false,
    });

    const savedUser = await newUser.save();
        
    return NextResponse.json({
      message: "Usuario Creado con Éxito",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const email = searchParams.get('email');
        const nombre = searchParams.get('nombre');
        const perfil = searchParams.get('perfiles');
        let query = {};
        if (nombre && nombre !== '') {
          query.$or = [
            { 'nombre': { $regex: new RegExp(nombre), $options: 'i' } },
            { 'apellido': { $regex: new RegExp(nombre), $options: 'i' } },
            { 'consultorio': { $regex: new RegExp(nombre), $options: 'i' } }
        ];
        }
        if (email && email !== '') {
            query.email = { $regex: new RegExp(email), $options: 'i' };
        }
        if (perfil && perfil !== '') {
          let perfiles = perfil.split(',');
          if (!perfiles.includes('1000')) {
            query.perfil = { $in: perfiles };
          }
        }
        const users = await User.find(query, '-password').sort({ createdAt: -1 })
          .populate({path: 'logs', perDocumentLimit: 1, options: { sort: { createdAt: -1 }}, match: { tipo: 1 },
                      select: {
                        tipo: 1,
                        provider: 1,
                        ip: 1,
                        agent: 1,
                        createdAt: 1,
                        _id: 0
                      }
                    });
       
        return NextResponse.json({
            message: "Ok",
            success: true,
            users,
        });
    } catch (error) {
      console.log(error.message)
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

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
    if (user.password && user.password !== "") {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(user.password, salt);
        saved.password = hashedPassword;
    }
    saved.perfil = user.perfil;
    saved.incompleto = false
    
    await saved.save();

    return NextResponse.json({
      message: "Usuario Actualizado",
      success: true,
      saved,
    });
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}