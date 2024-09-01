import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import User from "@/src/models/auth.model.js";
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
    console.log(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}