import  { NextResponse } from 'next/server';
import { descomprimirYGuardar } from '@/src/services/archivos/files.js';

export async function POST(req) {
    const data = await req.formData();
    const file = data.get('file');
    const nombres = await descomprimirYGuardar(file);
    return NextResponse.json({ok: true, nombres: nombres})    
}

