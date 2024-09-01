"use client";
import React, { use, useEffect } from "react";
import Image from 'next/image';
import Servicio from '@/src/components/home/Servicio.js';
import Titulo from '@/src/components/home/Titulo.js';
import Paso from '@/src/components/home/Paso.js';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSession } from "next-auth/react";
import Wa from "../components/home/Wa";

const Mensaje1 = () => {
  return (
    <>
      <p>Con un clic accedes a</p>
      <p>tus carpetas o arrastrá</p>
      <p>archivos directamente.</p>
    </>
  );
}

const Mensaje2 = () => {
  return (
    <>
      <p>El Formulario te guia</p>
      <p>para enviar la</p>
      <p>Información necesaria</p>
    </>
  );
}

const Mensaje3 = () => {
  return (
    <ul>
      <li>✅ Trabajo Aceptado (fecha)</li>
      <li>✅ Trabajo Observado (consulta) </li>
      <li>✅ Trabajo Entregado (fecha)</li>
    </ul>
  );
}

export default function Home() {
  const { data } = useSession();
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
    <div className="font-sans min-h-screen antialiased text-gray-900 leading-normal tracking-wider bg-cover">      
      {(!data || !data.user) &&
        <span className="absolute -right-10 md:right-5 xl:right-20 font-bold text-lg animate__animated animate__slideOutDown animate__infinite text-center z-40">
          <p>☝️☝️ Iniciá Sesión  ☝️☝️</p>
          <p>desde Aqui</p>
        </span>
      }
      
      <div className="flex flex-col items-center justify-center h-auto ">
        <Image  data-aos="fade-down-left"  data-aos-duration="2000" src="/img/logo2.jpg" alt="logo" width={300} height={300} 
          className="border-2 border-gray-200 rounded-2xl shadow-2xl mt-8"
        />

        <Titulo titulo={'Bienvenidos a Nuestra App'} className=" "/>

        <div data-aos="fade-down-left"  
          className="m-10 flex flex-row flex-wrap md:flex-nowrap items-start justify-center gap-5 md:mx-32"
        >
          <Servicio titulo={'Un Servicio para Vos'} mensaje={'Te ofrecemos que puedas enviar y ordenar tus trabajos digitales en solo tres sencillos pasos.'} />
          <Servicio titulo={'Historial de Trabajos Enviados'} mensaje={'Se creará un registro de las órdenes enviadas en tu usuario, al cual tendrás acceso, para tu organización y control'} />
          <Servicio titulo={'Canal de Comunicación'} mensaje={'Te llegarán notificaciones sobre el estado del trabajo y podrás contestar desde la misma app de manera inmediata'} />
        </div>

        <br />
        <br />
        <Titulo titulo={'En solo 3 Pasos'} />

        <div data-aos="fade-down-left"  data-aos-duration="2000" id="services" 
          className="m-10 flex flex-row flex-wrap md:flex-nowrap items-center justify-center gap-5"
        >
          <Paso paso={'1'} titulo={'Subir los Archivos'} mensaje1={<Mensaje1 />} mensaje2={'Subir Archivos y Fotos'}/>
          <Paso paso={'2'} titulo={'Completar la Órden'} mensaje1={<Mensaje2 />} mensaje2={'Describir todo lo Solicitado'}/>
          <Paso paso={'3'} titulo={'Notificación'} mensaje1={<Mensaje3 />} mensaje2={'Contestar las Notificaciones'} />
        </div>

        <div data-aos="fade-down-right"  data-aos-duration="2000"  id="contact" className="p-6 flex flex-col gap-4 items-center text-lg">
          <h2 className="text-3xl font-bold text-xl text-black">
            Contáctanos
          </h2>
          <p className="text-gray-600">
            ¿Interesado en nuestros servicios? ¿Dudas sobre la App.?
          </p>
          <Wa />
        </div>
      </div>
      <div className="p-6 flex flex-col gap-4 items-start text-xs">
        <a href={`/pp`} target="_blank">
          <div className="text-sm">
            <span>Politica de Privacidad</span>
          </div>
        </a>
      </div>
    </div>
    </>
  );
}


