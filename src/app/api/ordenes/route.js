import mongo from "@/src/services/mongoDb/config.mongoDb.mjs";
import Orden from "@/src/models/orden.model.mjs";
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { options } from '@/src/app/api/auth/[...nextauth]/options.js';
import { notificarNuevaOrden } from '@/src/services/webNotificacion/webNotification.js';
import { formatoFecha } from "@/src/services/utils/auxiliaresCliente";

mongo();

export async function POST(request) {
  try {
    const orden = await request.json();

    const newOrden = new Orden({
      ...orden
    });

    const savedOrden = await newOrden.save();

    notificarNuevaOrden(savedOrden);
        
    return NextResponse.json({
      message: "created successfully",
      success: true,
      savedOrden,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
    try {
      const session = await getServerSession(options);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const user = session.user;
      const {searchParams} = new URL(req.url);
      const fecha1 = searchParams.get('fecha1')
      const fecha2 = searchParams.get('fecha2')
      const odontologo = searchParams.get('odontologo')
      const paciente = searchParams.get('paciente')
      const orderNumber = searchParams.get('orderNumber')
      const estado = searchParams.get('estado')
      const material = searchParams.get('material')
      const impresion = searchParams.get('impresion')
      const impresionPendiente = searchParams.get('impresionPendiente')
      const asignada = searchParams.get('asignada')
      const disenador = searchParams.get('disenador')
      const id = searchParams.get('id')
      let query = {};
      
      if (user.perfil == 1) {
        query['odontologo._id'] = user._id;
      }
      if (id && id !== '') {
        query._id = id;
      }

      if (fecha1 && fecha2) {
        let fechaInicio = new Date(fecha1);
        let fechaFin = new Date(fecha2);
        fechaInicio.setHours(fechaInicio.getHours() + 3);
        fechaFin.setHours(fechaFin.getHours() + 3);
        fechaFin.setDate(fechaFin.getDate() + 1);          
        query.createdAt = { $gte: fechaInicio, $lte: fechaFin };
      }
      if (odontologo && odontologo !== '') {
        query.$or = [
          { 'odontologo.nombre': { $regex: new RegExp(odontologo), $options: 'i' } },
          { 'odontologo.apellido': { $regex: new RegExp(odontologo), $options: 'i' } }
        ];
      }
      if (paciente && paciente !== '') {
          query.paciente = { $regex: new RegExp(paciente), $options: 'i' };;
      }
      if (estado && estado !== '') {
        let estados = estado.split(',');
        if (!estados.includes('1000')) {
          query.estado = { $in: estados };
        }
      }
      if (disenador && disenador !== '') {
        let disenadores = disenador.split(',');
        if (!disenadores.includes('1000')) {
          query['asignada._id'] = { $in: disenadores };
        }
      }
      if (material && material !== '') {
        let materiales = material.split(',');
        if (!materiales.includes('Todos')) {
          query.material = { 
            $elemMatch: { 
                value: true, 
                label: { $in: materiales } 
            } 
          };
        }
      }
      if (impresion && impresion !== '') {
        let impresiones = impresion.split(',');
        if (!impresiones.includes('Todos')) {
          query.impresion = { 
            $elemMatch: { 
                value: true, 
                label: { $in: impresiones } 
            } 
          };
        } else {
          query.impresion = { 
            $exists: true,
            $ne: [] // Verifica que el array no esté vacío
          } 
        }
      }

      if (impresionPendiente && impresionPendiente == 'true') {
        query.impresion = { 
          $elemMatch: { 
            value: true,
            realizada: false,
          } 
        } 
      }
      if (asignada && asignada == 'true') {
        query['asignada._id'] = user._id;
      }

      if (orderNumber !== '' && orderNumber !== null && orderNumber !== undefined && orderNumber != '0') {
          query.orderNumber = Number(orderNumber);
      }
      let ordenes = await Orden.find(query).sort({ createdAt: -1 });
      ordenes = ordenes.map((orden) => {
          return {
            ...orden._doc,
            slices: orden.imgs.map((img) => {
              return {
                src: '/api/files/imgs/'+img
              }}),
          };
      })
      return NextResponse.json({
          message: "successfully",
          success: true,
          ordenes,
      });
    } catch (error) {
      console.log(error.message)
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
  try {
    const orden = await request.json();

    const originalOrden = await Orden.findById(orden._id);

    if (orden.fechaEstimada === null) orden.fechaEstimada = originalOrden.fechaEstimada;

    let updatedOrden = await Orden.findByIdAndUpdate(orden._id, orden, { new: true });

    for (let key in originalOrden._doc) {
      await analizoTipos(originalOrden[key], updatedOrden[key], key, orden._id);
    }    
    
    return NextResponse.json({
      message: "created successfully",
      success: true,
      savedOrden: updatedOrden,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const analizoTipos = async (original, actual, key, _id) => {
  if (actual === undefined) return;
  if (original === undefined) original = '';
  if (key === 'piezasSup' || key === 'piezasInf') {
    if (JSON.stringify(original) !== JSON.stringify(actual)) {
      await analizoPiezas('Piezas', original, actual, key, _id);
    }
    return;
  };
  if (key === 'trabajo') {
    if (JSON.stringify(original) !== JSON.stringify(actual)) {
      await analizoPiezas('Trabajo', original, actual, key, _id);
    }
    return;
  };
  if (key === 'material') {
    if (JSON.stringify(original) !== JSON.stringify(actual)) {
      await analizoPiezas('Material', original, actual, key, _id);
    }
    return;
  };
  if (key === 'proceso') {
    if (JSON.stringify(original) !== JSON.stringify(actual)) {
      await analizoPiezas('Proceso', original, actual, key, _id);
    }
    return;
  };
  if (key === 'impresion') {
    if (JSON.stringify(original) !== JSON.stringify(actual)) {
      await analizoPiezas('Impresión', original, actual, key, _id);
    }
    return;
  };
  if (key === 'coronas') {
    if (JSON.stringify(original) !== JSON.stringify(actual)) {      
      for (let valor in original) {
        await analizoValores('Coronas. ', original[valor], actual[valor], valor, _id);
      } 
    }
    return;
  };

  if (original === null) original = '';
  if (actual === null) actual = '';
  if (typeof original === 'object' && original !== null) {
    for (let valor in original[key]) {
      await analizoTipos(original[valor], actual[valor], valor, _id);
    }          
  } else if (Array.isArray(original[key])) {
  } else {
    await analizoValores('', original, actual, key, _id);
  }   
}

const analizoValores = async (titulo, original, actual, key, _id) => {
  try {
      if (key === 'historia') return;
      if (key === 'mensajes') return;
      if (key === '_id') return;
      if (key === 'createdAt') return;
      if (key === 'updatedAt') return;
      if (key === '__v') return;
      if (original !== actual) {
        const orden = await Orden.findById(_id);
        if (original === null) original = '';
        if (actual === null) actual = '';
        if (orden.historia === undefined) orden.historia = [];
        if (original instanceof Date) original = formatoFecha(original, true, false, false, true);
        if (actual instanceof Date) actual = formatoFecha(actual, true, false, false, true);
        orden.historia.push({
          mensaje:`${titulo}Campo: ${key}. Anterior: ${original}. Modificado: ${actual}`,
          fecha: new Date(),
        });
        await Orden.findByIdAndUpdate(_id, orden, { new: true });
      } 
    } catch (error) {
      console.log(error)
    }
  }
  
  const analizoPiezas = async (tipo, original, actual, key, _id) => {
    try {
      let txt = tipo+' Original: ';
      original.map(pieza => { 
        if (pieza.value === true) {
          txt += pieza.label+' - ';
        }
      })
      txt += tipo+' Actual: ';
      actual.map(pieza => { 
        if (pieza.value === true) {
          txt += pieza.label+' - ';
        }
      })
        
      const orden = await Orden.findById(_id);
      orden.historia.push({
        mensaje:`Campo: ${key}. ${txt}`,
        fecha: new Date(),
      });
      await Orden.findByIdAndUpdate(_id, orden, { new: true });
    } catch (error) {
      console.log(error)
    }
}