import Image from "next/image";

export default function Servicio({ titulo, mensaje})  {

    return (
        <div className="flex flex-col justify-between bg-[#0B2060] gap-3 items-center lg:w-1/3 rounded-xl min-h-80">
            <Image src="/img/caracolT.png" width={70} height={70}  style={{marginTop: '-30px'}} alt="caracol" />
            <span className="p-5 bg-gray-200 text-[#67B4D3] font-bold text-2xl rounded-2xl shadow-lg shadow-white text-center font-trebu">
                {titulo}
            </span>
            <span className="text-white px-5 my-5 text-lg text-center flex items-center min-h-24">
                {mensaje}
            </span>
        </div>
    );
}