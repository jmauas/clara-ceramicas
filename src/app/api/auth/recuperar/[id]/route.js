import  { NextResponse } from 'next/server';
import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import User from "@/src/models/auth.model.js";
import { generateToken } from '@/src/services/utils/utils';
import { enviarMail } from '@/src/services/resend/sendMail';

const url = process.env.URL_APP;

export async function GET(req, { params }) {
    let email = params.id;
    if (!email) return NextResponse.json({ok: false});
    email = email.replace(/%40/g, '@');
    email = email.toLowerCase();
    await mongo();
    const user = await User.findOne({ email });
    user.token = generateToken(120);
    user.save();
    const html = `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&amp;family=Roboto&amp;display=swap" rel="stylesheet">
            <style>a:link, :visited{color: #019BF2; background-color: transparent; text-decoration: underline;}</style> 
        </head> 
        <body style="margin:0 auto;">
            <div style="font-family:Roboto, sans-serif; font-weight: 400; font-size: 16px; line-height: 19px; color: #6C6E72; margin: 16px 25px 31px 25px;">
                <p>Hola ${user.nombre} ${user.apellido}</p>
                <p>Hemos recibido tu solicitud de cambio de contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
                <p>
                    <a href="${url}/cambiopw?token=${encodeURIComponent(user.token)}">
                        Cambiar contraseña
                    </a>
                </p>
                <p>Laboratorio Clara Cerámicas</p>
                <hr style="border: 1px solid #DDDEDD; margin: 32px 0 32px 0;"> 
                <p>Por favor, no respondas a este correo.</p>
                <p>Si no reconoces esta actividad, simplemente ignoralo.</p>
            </div>
        </body>
    </html>
    `;
    await enviarMail(email, 'Solicitud Cambio Contraseña Clara Cerámicas', html);
    return NextResponse.json({ok: true})
}