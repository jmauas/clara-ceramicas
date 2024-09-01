import  { NextResponse } from 'next/server';
import { guardarScan } from '@/src/services/archivos/files.js';

export async function POST(req) {
    const data = await req.formData();
    const file = data.get('file');
    const idNombre = await guardarScan(file);    
    return NextResponse.json({ok: true, nombre: idNombre})    
}