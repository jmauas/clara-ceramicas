import { FaFileCirclePlus } from "react-icons/fa6";
import { RiFileSearchFill } from "react-icons/ri";
import { BiSolidUserRectangle } from "react-icons/bi";

export const links = [{
    label: 'Nueva Órden',
    route: '/nueva',
    perfil: 1,
    icon: <FaFileCirclePlus size="2rem"/>
  }, {
    label: 'Consulta Órdenes',
    route: '/ordenes',
    perfil: 1,
    icon: <RiFileSearchFill size="2rem"/>
  }, {
    label: 'Usuarios',
    route: '/usuarios',
    perfil: 3,
    icon: <BiSolidUserRectangle  size="2rem"/>
  }
]