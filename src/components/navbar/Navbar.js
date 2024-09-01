"use client"
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { FaUser, FaAlignJustify } from "react-icons/fa";
import { useRouter } from "next/navigation";
import FormUsuarios from "@/src/components/users/FormUsuarios";
import { useSession } from "next-auth/react";
import { links } from '@/src/components/Links.js'
import Image from "next/image";
import { perfiles } from '@/src/services/utils/utils.users.js';
import { useLogueoStore } from "@/src/store/logueo.store.js";

const Navbar = ({ toggle }) => {
    const router = useRouter();
    const { data } = useSession();
    const { showLG, setShowLG, form, setForm } = useLogueoStore();

    const clickHandler = (route) => {   
      router.push(route);
    }

    const ingresar = () => {
      setShowLG(true);
      setForm(2)
    }

    useEffect(() => {
      if (data && data.user && data.user.incompleto) {
          setTimeout(() => {
            setShowLG(true);
            setForm(3)
          }, 1500);
      }
    }, [data])

    return (
    <>
      <div className={`w-full h-20 sticky top-0 z-50 bg-slate-400`}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full gap-10">
            <Logo />
            {data && data.user && data.user.perfil &&
            <>
              <button
                type="button"
                className="inline-flex items-center md:hidden ring-2 ring-black rounded-lg p-1 bg-slate-200"
                onClick={toggle}
                >
                <div className="flex flex-col items-center jutify-center">
                  <span className="text-lg font-semibold mx-2">Ingresar</span>
                  <FaAlignJustify size="1.5rem"/>
                </div>
              </button> 
              <ul className="hidden md:flex ml-2 gap-x-8">
                {links.map((l) => (
                  Number(data.user.perfil) >= l.perfil &&
                  <span key={l.route} onClick={() => clickHandler(l.route)} 
                      className="cursor-pointer flex flex-row items-center justify-center gap-1 hover:shadow-lg p-4 rounded-lg"
                      >
                      {l.icon}
                      <p>{l.label}</p>
                    </span>
                ))}
              </ul>
            </>
            }

            {data && data.user && data.user.apellido
              ?
              <div onClick={ingresar} className="cursor-pointer flex flex-col items-center">
                <div className="flex items center gap-3">
                  {data.user.picture && data.user.picture !== "" 
                  ? <Image src={data.user.picture} alt="avatar" width="150" height="150" className="rounded-full h-8 w-8" />
                  : <FaUser className="text-2xl text-green-300 hover:text-green-400" />}
                  {perfiles.find(p => p.value === data.user.perfil).emoji}
                </div>
                <span className="text-xs md:text-md text-center m-0 p-0">{data.user.nombre} {data.user.apellido}</span>
              </div>
              :
              <div onClick={ingresar} className="rounded-lg bg-white font-bold p-2 flex flex-col items-center cursor-pointer">
                <FaUser className="" />
                Ingresar
              </div>
            }
          </div>
        </div>
      </div>
      <FormUsuarios show={showLG} setShow={setShowLG} form={form} setForm={setForm} />
    </>
  );
};

export default Navbar;