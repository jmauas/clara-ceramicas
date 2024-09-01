"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatoFecha } from "@/src/services/utils/auxiliaresCliente";
import DetalleOrden from '@/src/components/orden/DetalleOrden.js';
import { useLogueoStore } from "@/src/store/logueo.store.js";

export default function Page(params) {
    const { data } = useSession();
    const [ ordenes, setOrdenes ] = useState([]);
    const [ orderNumber ] = useState(params.params.nro);
    const { setShowLG, setForm } = useLogueoStore();
    const [ enDetalle, setEnDetalle ] = useState([]);

    const updateOrder = async (orden) => {
        try {
            const res = await fetch('/api/ordenes', {
                body:  JSON.stringify(orden),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            })
            const datos = await res.json();
            if (datos.success) {
                setOrdenes(ordenes.map(ord => ord._id === orden._id ? datos.savedOrden : ord));
            }
        } catch (error) {
            console.log(error);
        }
    }   
    
    const fetchData = async (id) => {
        try {
            const res = await fetch(`/api/ordenes?orderNumber=${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            })
            const data = await res.json();
            if (!data.success) {
                return;
            }
            const ords = data.ordenes.map(orden => {
                const soli = new Date(orden.fechaSolicitada);
                soli.setHours(soli.getHours() + 3);
                let esti = '';
                let esti2 = '';
                if (orden.fechaEstimada) {
                    esti = new Date(orden.fechaEstimada);
                    esti.setHours(esti.getHours() + 3);
                    esti2 = formatoFecha(orden.fechaEstimada, false, false, false, true)
                    esti = esti.toISOString().substring(0,10)
                }
                setEnDetalle(prev => prev.concat([{_id: orden._id, enDetalle: true}]));
                return {
                    ...orden,
                    fechaSolicitada: soli,
                    fechaEstimada: esti,
                    fechaEstimada2: esti2,
                }
            });
            setOrdenes(ords);
            return ords;
        } catch (error) {
            console.log(error);
        } 
    }

    useEffect(() => {
        if (orderNumber && orderNumber !== '') {
            fetchData(orderNumber);
            if (!data || !data.user || !data.user.perfil) {
                setShowLG(false);
                setTimeout(() => {
                    setShowLG(true);
                    setForm(2);
                }, 500);  
            } else {
                setTimeout(() => {
                    setShowLG(false);
                }, 500); 
            }
        }
    }, [orderNumber, data])


    return (
        <>{data && data.user && Number(data.user.perfil) > 0 && 
            ordenes && ordenes.length > 0 &&
                <div className="m-o md:m-5">
                    <h1 className="mx-5 mt-5 mb-0 text-xl font-bold">Detalle Órden de Trabajo</h1>
                    <DetalleOrden 
                        orden={ordenes[0]} 
                        updateOrder={updateOrder}
                        setOrdenes={setOrdenes}
                        enDetalle={enDetalle}
                        actualizarDetalle={updateOrder}
                    />
                </div>
        }</>    
    );
}
