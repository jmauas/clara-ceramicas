import { signOut } from 'next-auth/react'
import { FaUserAltSlash, FaUserEdit } from "react-icons/fa";


export default function MenuUsuario({ setForm }) {

    const salir = () => {
        signOut({ redirect: true });
    }

    const editar = () => {
        setForm(3)
    } 
    return (
        <>
            <h1 className="font-bold mb-5">Menú de Usuario</h1>
            <div className="my-5 flex flex-col gap-4">
                <div className="flex gap-2 justify-center align-center">
                    <button className="flex justify-center rounded-md border border-bordes shadow-xl px-4 py-2 bg-green-200 font-medium 
                        text-black hover:bg-green-500 sm:w-auto sm:text-sm"
                        onClick={editar}>
                        <FaUserEdit size="2em" />
                        <span className="self-center ml-2">Editar Datos Usuario</span>
                    </button>
                </div>

                <button className="flex justify-center rounded-md border border-bordes shadow-xl px-4 py-2 bg-red-200 font-medium 
                text-black hover:bg-red-500 sm:w-auto sm:text-sm"
                onClick={salir}>
                    <FaUserAltSlash size="2em" />
                    <span className="self-center ml-2">Cerrar Sesión</span>
                </button>
            </div>
        </>
    );
}