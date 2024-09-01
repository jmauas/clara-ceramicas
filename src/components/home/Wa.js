import { FaWhatsapp } from "react-icons/fa";

export default function Wa()  {

    return (
        <a href={`https://wa.me/549${process.env.NEXT_PUBLIC_NUMERO_WP}/?text=Hola. Te Escribimos desde la App.`}
              target="_blank" 
              className="p-2 pr-4 rounded-full text-black hover:text-white bg-transparent hover:bg-green-600 border border-4 border-green-600 flex items-center gap-5 align-start"
          >
              <FaWhatsapp size="3rem" className="bg-green-600 p-2 text-white rounded-full"/>
              <div className="text-xl font-bold flex flex-col items-start justify-center flex-wrap">
                  <span>Mensaje</span>
              </div>
        </a>
    );
}