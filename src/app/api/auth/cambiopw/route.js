import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import User from "@/src/models/auth.model.js";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

mongo();

export async function POST(request) {
  try {
    const pass = await request.json();
    const { token, password } = pass;
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json(
        { error: "No se Ecuentra usuario" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;      
    user.token = '';      
       
    await user.save();

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