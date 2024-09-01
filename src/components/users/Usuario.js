import { Provincias } from '@/src/components/Provincias.js';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


export default function Usuario({ usuario, handleOnChange, validado, email, password, showPw, setShowPw, passwordError, cuit }) {

    return (
        <>
            {email && <>
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Mail: </span>
            <input 
                type="text" 
                placeholder="Mail"
                autoComplete="email"
                name="email" 
                value={usuario.email}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 ${validado!==0 && 'hidden'}`}
                required
            /></>}
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Apellido <span className="text-xs">(o Razón Social)</span>: </span>
            <input 
                type="text" 
                autoComplete="apellido"
                placeholder="Apellido"
                name="apellido" 
                value={usuario.apellido}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 ${validado!==0 && 'hidden'}`}
                required
            />
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Nombre: </span>
            <input 
                type="text" 
                autoComplete="nombre"
                placeholder="Nombre"
                name="nombre" 
                value={usuario.nombre}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 ${validado!==0 && 'hidden'}`}
                required
            />
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Nombre Consultorio: </span>
            <input 
                type="text" 
                autoComplete="consultorio"
                placeholder="Nombre Consultorio"
                name="consultorio" 
                value={usuario.consultorio}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 ${validado!==0 && 'hidden'}`}
                required
            />
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Celular <span className="text-xs">(sin 0, 15 ni guión. Ejemplo 1143219876)</span> : </span>
            <input 
                type="tel" 
                autoComplete="celular"
                placeholder="Celular"
                name="celular"
                value={usuario.celular}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 col-span-6 md:col-span-4 ${validado!==0 && 'hidden'}`}
                required
            />
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Domicilio: </span>
            <input 
                type="text" 
                autoComplete="domicilio"
                placeholder="Domicilio"
                name="domicilio"
                value={usuario.domicilio}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 p-4 rounded-lg my-2 ${validado!==0 && 'hidden'} col-span-6 md:col-span-4`}
                required
            />
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Cod. Postal: </span>
            <input 
                type="tel" 
                autoComplete="cp"
                placeholder="CP"
                name="cp"
                value={usuario.cp}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 ${validado!==0 && 'hidden'} col-span-6 md:col-span-4`}
                required
            />
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Localidad: </span>
            <input 
                type="text" 
                autoComplete="localidad"
                placeholder="Localidad"
                name="localidad"
                value={usuario.localidad}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 ${validado!==0 && 'hidden'} col-span-6 md:col-span-4`}
                required
            />
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Provincia: </span>
            <select 
                name="provincia"
                value={usuario.provincia}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 ${validado!==0 && 'hidden'} col-span-6 md:col-span-4`}
                required
            >
                <Provincias />
            </select>
            {cuit && <>
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>CUIT: </span>
            <input
                type="number"
                autoComplete="cuit"
                placeholder="CUIT"
                name="cuit"
                value={usuario.cuit}
                onChange={handleOnChange}
                className={`bg-gray-100 border-2 w-full p-4 rounded-lg my-2 ${validado!==0 && 'hidden'} col-span-6 md:col-span-4`}
                required
            /></>}
            {password && <>
            <span className={`col-span-6 md:col-span-2 ${validado!==0 && 'hidden'}`}>Contraseña: </span>
            <div className="relative col-span-6 md:col-span-4 ">
                <input 
                    type={showPw ? "text" : "password"} 
                    autoComplete="password"
                    placeholder="Password"
                    name="password"
                    value={usuario.password}
                    onChange={handleOnChange}
                    className={`bg-gray-100 ${passwordError && 'border-rose-600'} border-2 w-full p-4 rounded-lg my-2 ${validado!==0 && 'hidden'}`}
                    required={email}
                />
                <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)}
                    className={`absolute inset-y-5 right-2 text-gray-400`}
                >
                    {showPw ? <FaRegEyeSlash size="2rem"/> : <FaRegEye size="2rem" />}                        
                </button>
            </div></>}
        </>
    )
};