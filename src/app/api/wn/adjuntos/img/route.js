import { NextResponse } from "next/server";
import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import Orden from "@/src/models/orden.model.mjs";

import { postAdjunto  } from '@/src/services/whatsapp/whatsappSender.js';
import { guardarImg } from '@/src/services/archivos/files.js';

mongo();
const numeroLabo = process.env.NEXT_PUBLIC_NUMERO_WP;

export async function POST(req) {
  try {
        const data = await req.formData();
        const file = data.get('file');
        const idNombre = await guardarImg(file);
        return NextResponse.json({ok: true, nombres: [{tipo: 'img', nombre: idNombre}]})    
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {  
    try {
        const data = await req.json();
        const { orden, adjunto, userEnvia, externa, url, mensaje } = data;
        if (adjunto) {
            let numero = '';
            if (Number(userEnvia.perfil) === 1) {
                numero = numeroLabo
            } else {
                numero = orden.odontologo.celular; 
            }
            await postAdjunto(numero, adjunto, 'imgs', externa, url, mensaje);
            orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Se envió Imagen ${adjunto} por Whatsapp`, usuario: userEnvia.nombre+' '+userEnvia.apellido});
            //orden.imgs.push(adjunto);
            const updatedOrden = await Orden.findByIdAndUpdate(orden._id, orden, { new: true });
        }        
        return NextResponse.json({            
            success: true           
        }, { status: 200});

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}