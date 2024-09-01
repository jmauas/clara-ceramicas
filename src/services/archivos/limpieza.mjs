import fs from 'fs/promises';
import path from "path";
import mongo from "../mongoDb/config.mongoDb.mjs";
import Orden from "../../models/orden.model.mjs";
import cron from 'node-cron';

mongo();

let tareas = [];

export const agendarLimpieza = async () => {
    console.log('Agendando Limpieza');
    try {
        if (tareas.length > 0) {
            console.log('Tarea Ya Agendadas. Se aborta la creación de nueva tarea');
            console.log(tareas[0].options.name)
            return;
        }
        const sc = {
            scheduled: true,
            timezone: 'America/Argentina/Buenos_Aires',
            name: 'Limpieza Adjuntos 16 Hs.'
        }
        // SEG MIN HORAS DIA_MES MES DIA_SEMANA
        // * TODOS LOS VALORES
        // ? CUALQUIER VALOR
        // , VALORES DE UNA LISTA
        // - RANGO DE VALORES
        // / INCREMENTOS DE UN INTERVALO
        //
        let tarea = cron.schedule(`* 0 16 * * *`, () => {
            analizarImgs();
            analizarScans();
        }, sc);
        tareas.push(tarea);
        console.log('Tarea Agendada');
    } catch (error) {
        console.log(error)
    }
}


const getImages = async () => {
    const root = process.cwd();
    const url = path.join(root, 'locales', 'imgs');
    const imgs = await fs.readdir(url);
    return imgs.map(img => path.join(url, img));
}

const getScans = async () => {
    const root = process.cwd();
    const url = path.join(root, 'locales', 'scans');
    const scans = await fs.readdir(url);
    return scans.map(scan => path.join(url, scan));
}

const analizarImgs = async () => {
    console.log('analizando imagenes');
    const imgs = await getImages();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);    
    await recorrer(imgs, 'imgs', fechaLimite);
}

const analizarScans = async () => {
    console.log('analizando Scans');
    const scans = await getScans();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);    
    await recorrer(scans, 'scans', fechaLimite);
}

const recorrer = async (items, prop, fechaLimite) => {
    for await (let item of items) {
        const nombre = item.split('\\').pop();
        const ordenes = await Orden.find({ [prop]: { $in: [nombre] } });
        if (ordenes.length == 0) {
            await fs.unlink(item);
        } else {
            let fh = new Date('2000-01-01');
            let es = 99
            ordenes.map(async (orden) => {
                if (orden.createdAt > fh) {
                    fh = orden.updatedAt;
                }
                if (orden.estado < es) {
                    es = orden.estado;
                }
            })
            if (es >= 95 && fh < fechaLimite) {
                await fs.unlink(item);
            }
        }
    }
}
