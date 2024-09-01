import { useRouter } from 'next/navigation'
import { links } from '@/src/components/Links.js'
import { useSession } from "next-auth/react";
import { FaWindowClose } from "react-icons/fa";

const Sidebar = ({ isOpen, toggle }) => {
  const router = useRouter()
  const { data } = useSession();

  const clickHandler = (route) => {
    toggle()    
    router.push(route);
  }

  return (
      <div
        style={{
          opacity: `${isOpen ? "0.95" : "0"}`,
          top: ` ${isOpen ? "0" : "-100%"}`,
          'borderWidth': '2px',
          'borderStyle': 'solid',
          'borderRadius': '0px',
        }}
        className="fixed w-full h-full overflow-hidden flex flex-col items-center justify-start align-start pt-[120px] z-50 bg-slate-400 transition-all duration-300 ease-in-out"
        onClick={toggle}
      >
        <FaWindowClose size="3rem" className="self-start mx-10 cursor-pointer" />
        {data && data.user && data.user.perfil &&
          <ul className="sidebar-nav text-center leading-relaxed text-xl" onClick={toggle}>            
              {links.map((l) => (
                Number(data.user.perfil) >= l.perfil &&
                  <li key={l.route} onClick={() => clickHandler(l.route)} 
                      className="cursor-pointer m-4 border-0 rounded-lg p-4 opacity-[1] bg-slate-200 text-black flex items-center justify-start gap-4" 
                  >
                      {l.icon}
                      <p>{l.label}</p>
                  </li>              
              ))}
          </ul>
        }         
      </div>
  );
};

export default Sidebar;