import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarMail = async (email, asunto, mensaje) => {
    const res = await resend.emails.send({
        from: process.env.RESEND_RTE,
        to: email,
        subject: asunto,
        html: mensaje
    });
    console.log(res)
    return res;	
}