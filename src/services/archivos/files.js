import fs from 'fs/promises';
import path from 'path';
import uniqid from 'uniqid';
import AdmZip from 'adm-zip';

export const guardarScan = async (file) => {   
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const root = process.cwd();
    const nombre = file.name.substring(0, file.name.lastIndexOf('.'));
    let ext = file.name.substring(file.name.lastIndexOf('.')+1);
    const idNombre = nombre+'-'+uniqid()+'.'+ext
    const filePath = path.join(root, 'locales', 'scans', idNombre);    
    await fs.writeFile(filePath, buffer)
    return idNombre;
}

export const guardarImg = async (file) => { 
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const root = process.cwd();
    const nombre = file.name.substring(0, file.name.lastIndexOf('.'));
    let ext = file.name.substring(file.name.lastIndexOf('.')+1);
    const idNombre = nombre+'-'+uniqid()+'.'+ext
    const filePath = path.join(root, 'locales', 'imgs', idNombre);    
    await fs.writeFile(filePath, buffer);
    return idNombre;
}

export const descomprimirYGuardar = async (file) => {
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    const root = process.cwd();      
    const unZipped = new AdmZip(buffer);
    const elements = unZipped.getEntries();
    let nombres = [];
    elements.forEach((element) => {
        if (!element.isDirectory) {
            const file = extraerArchivo(element, root)
            nombres.push(file);
        }         
    });
    return nombres;
}

const extraerArchivo = (archivo, root) => {
    let nombre = archivo.entryName.substring(0, archivo.entryName.lastIndexOf('.'));
    nombre = nombre.substring(nombre.lastIndexOf('/')+1);
    const ext = archivo.entryName.substring(archivo.entryName.lastIndexOf('.')+1);
    const idNombre = nombre+'-'+uniqid()+'.'+ext
    const buffer = archivo.getData();
    let tipo;
    let dir;
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'svg' || ext === 'webp') {
        dir = 'imgs';
        tipo = 'img';
    } else {
        dir = 'scans';
        tipo = 'scan';                
    }
    const filePath = path.join(root, 'locales', dir, idNombre);    
    fs.writeFile(filePath, buffer);
    return {tipo: tipo, nombre: idNombre};    
}