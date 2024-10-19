import { NextResponse } from "next/server";
import { send, notificationPayload  } from '@/src/services/webNotificacion/webNotification.js';
import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import User from "@/src/models/auth.model.js";
import Subscriptores from "@/src/models/subscriptores.model.js";
import { ObjectId } from "mongodb";
import { validarYEnviarWhatsapp } from '@/src/services/whatsapp/whatsappSender.js';

mongo();
const url = process.env.URL_APP;
const numeroLabo = process.env.NEXT_PUBLIC_NUMERO_WP;

export async function POST(request) {
  try {
    const { msg, userEnvia, orden } = await request.json();
    let users = [];
    let msgWa;
    if (Number(userEnvia.perfil) === 1) {
        users = await User.find({ perfil: { $gte: 2 } });
    } else {
        users.push(orden.odontologo);
    }
    msgWa = `${msg.titulo}
`;
    if (msg.conAdj) {msgWa += `${msg.texto

}`}
    msgWa += msg.wa;
    await validarYEnviarWhatsapp(orden.odontologo.celular, msgWa)
    await validarYEnviarWhatsapp(orden.odontologo.celular, `${url}/ordenes/${orden.orderNumber}`)
    //const userIds = users.map(user => (new ObjectId(user._id).valueOf()));
    //const subscriptores = await Subscriptores.find({ 'user._id': { $in: userIds } });
    //const payload = notificationPayload(msg);
    //const res = await send(subscriptores, payload);
    return NextResponse.json({
        message: true,
        ok: true,
        success: true
    }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
