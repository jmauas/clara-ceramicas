
export default function Titulo({ titulo})  {

    return (
        <div data-aos="fade-down-right" id="welcome" className="w-full lg:w-1/2 p-6 mt-5">
          <h2 style={{'WebkitTextStroke': '3px #0B2060', color: 'white'}} 
            className="text-6xl font-bold mb-2 text-white text-center font-trebu">
                {titulo}
          </h2>
        </div>
    );
}