export default function Servicio({ paso, titulo, mensaje1, mensaje2})  {

    return (
        <div className="flex flex-col bg-[#0B2060] gap-3 items-center justify-center lg:w-1/3 h-[400px] rounded-xl mt-12 md:mt-2">
            <label className="rounded-xl bg-purple-600 px-6 py-1 text-white text-bold text-8xl" style={{marginTop: '-50px'}}>{paso}</label>
            <span className="p-5 bg-gray-200 text-[#67B4D3] font-bold text-md xl:text-3xl rounded-2xl shadow-lg shadow-white text-center">
                {titulo}
            </span>
            <span className="text-white mx-4 px-4 my-5 text-sm xl:text-xl">
                {mensaje1}
            </span>
            <span className="p-5 bg-transparent text-[#67B4D3] font-bold text-md xl:text-3xl text-center h-32">
                {mensaje2}
            </span>
        </div>
    );
}