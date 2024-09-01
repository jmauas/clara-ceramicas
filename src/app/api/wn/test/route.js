import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { options } from '@/src/app/api/auth/[...nextauth]/options.js';
import { sendNotification  } from '@/src/services/webNotificacion/webNotification.js';
import { validarYEnviarWhatsapp } from '@/src/services/whatsapp/whatsappSender.js';

const numero = process.env.NEXT_PUBLIC_NUMERO_WP;

export async function POST(request) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    
    const user = session.user;
    const mensaje = await request.json();
    
    const wa = await validarYEnviarWhatsapp(numero, mensaje.texto);
    if (!wa.ok){
      console.log(wa.msgError)
    }
    const res = await sendNotification(mensaje, user);   
    return NextResponse.json({
      message: res.message ,
      success: res.ok
    }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
