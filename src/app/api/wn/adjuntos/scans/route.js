import { NextResponse } from "next/server";
import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import Orden from "@/src/models/orden.model.mjs";

import { postAdjunto  } from '@/src/services/whatsapp/whatsappSender.js';
import { guardarScan } from '@/src/services/archivos/files.js';

mongo();
const numeroLabo = process.env.NEXT_PUBLIC_NUMERO_WP;

export async function POST(req) {
  try {
        const data = await req.formData();
        const file = data.get('file');
        const idNombre = await guardarScan(file);
        return NextResponse.json({ok: true, nombres: [{tipo: 'scan', nombre: idNombre}]})    
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {  
    try {
        const data = await req.json();
        const { orden, adjunto, userEnvia } = data;
        if (adjunto) {
            let numero = '';
            if (Number(userEnvia.perfil) === 1) {
                numero = numeroLabo
            } else {
                numero = orden.odontologo.celular; 
            }
            await postAdjunto(numero, adjunto, 'scans');
            orden.estado = 10;
            orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Se envió Archivo ${adjunto} por Whatsapp`, usuario: userEnvia.nombre+' '+userEnvia.apellido});
            orden.historia.push({fecha: new Date().toISOString(), estado: orden.estado, mensaje: `Estado Modificado a Observada por Envio Archivo.`, usuario: userEnvia.nombre+' '+userEnvia.apellido});
            //orden.scans.push(adjunto);
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