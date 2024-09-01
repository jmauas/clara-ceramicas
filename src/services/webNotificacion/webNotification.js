import webpush from "web-push";
import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import User from "@/src/models/auth.model.js";
import Subscriptores from "@/src/models/subscriptores.model.js";
import { ObjectId } from "mongodb";
import { validarYEnviarWhatsapp } from '@/src/services/whatsapp/whatsappSender.js';

const numeroLabo = process.env.NEXT_PUBLIC_NUMERO_WP;

mongo();

const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
    'mailto:j@estudiomq.com.ar',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

export const subscribirse = async (subscriptor, user) => {
    try {
        const existe = await Subscriptores.findOne({ subscriptor: subscriptor, user: user});
        if (existe) {
            return { ok: false, message: "Ya está suscripto" }
        }
        const subs = new Subscriptores({
            subscriptor: subscriptor,
            user: user,
            errores: 0,
        });
        await subs.save();
        return {ok: true, message: "Registrado con Éxito. Gracias por suscribirte a nuestro servicio de notificaciones."};
    } catch (error) {
        console.log(error)
        return { error: error.message }
    }
};


export const notificarNuevaOrden = async (orden) => {
    const user = orden.odontologo;
    const users = await User.find({ perfil: { $gte: 2 } });
    users.push(user);
    const userIds = users.map(user => (new ObjectId(user._id).valueOf()));
    const subscriptores = await Subscriptores.find({ 'user._id': { $in: userIds } });
    const msg = {
        titulo: `Nueva Orden Trabajo Nro. ${orden.orderNumber}`,
        texto: `Nueva Orden de Trabajo Nro. ${orden.orderNumber} del Odontologo ${orden.odontologo.nombre} ${orden.odontologo.apellido}
        para Paciente ${orden.paciente}`,
    }
    await validarYEnviarWhatsapp(numeroLabo, `*${msg.texto}*`); 
    
    const payload = notificationPayload(msg);
    return await send(subscriptores, payload);
}

export const notificationPayload = (msg) =>   {
    return {
        title: msg.titulo,
        body: msg.texto,
        icon: "/img/logo.png",
        data: {
          url: "https://estudiomq.com.ar",
        },
    };
}

export const sendNotification  = async (msg, user) => {
    const payload = notificationPayload(msg);
    let subscriptions = [];
    if (user) {
        subscriptions = await Subscriptores.find({ user: user });
    } else {
        subscriptions = await Subscriptores.find();
    }
    return await send(subscriptions, payload)
}


export const send = async (subscriptions, notificationPayload) => {
    try {
        await Promise.all(
            subscriptions.map(async (subscription) => {
                try {
                    const res = await webpush.sendNotification(subscription.subscriptor, JSON.stringify(notificationPayload));
                    console.log(res.statusCode)
                    if (res.statusCode == '201' || res.statusCode == '200' ) {
                        console.log('Push Enviado');
                    } else {
                        await errorEnPush(subscription)
                    }
                } catch (error) {
                    await errorEnPush(subscription)
                }
            })
        )
        return { message: "Notification sent successfully.", ok: true }
    } catch (error) {
        console.error("Error sending notification");
        return { error: error.message, ok: true }
    }
}

const errorEnPush = async (subscE) => {
    const subs = await Subscriptores.findOne({ _id: subscE._id});
    if (subs) {
        subs.errores += 1;
        await subs.save();
        if (subs.errores > 10) {
            await subs.remove();
        }
    }    
}