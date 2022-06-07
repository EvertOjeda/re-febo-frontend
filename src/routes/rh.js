import rhformexp from '../pages/rh/RHFORMEXP/definicion/form/RHPOSTUL/RHFORMEXP'; 
import rhpostul from '../pages/rh/RHFORMEXP/definicion/form/RHPOSTUL';
import LISTAPOSTULANTE from '../pages/rh/RHFORMEXP/definicion/form/RHPOSTUL/LISTAPOSTULANTE';
import LISTAENTREVISTA from '../pages/rh/RHFORMEXP/definicion/form/RHPOSTUL/LISTAENTREVISTA';
import LISTACONTRATADO from '../pages/rh/RHFORMEXP/definicion/form/RHPOSTUL/LISTACONTRATADO';
import LISTAPRUEBA from '../pages/rh/RHFORMEXP/definicion/form/RHPOSTUL/LISTAPRUEBA';

const Route = [{
    path:'/rh/rhpostul/rhformexp',                   // Exportar lista de Excel a Base de Datos
    component:rhformexp
},
{
    path:'/rh/rhpostul',                    // Postulantes Main
    component:rhpostul
},
{
    path:'/rh/rhpostul/listapostulante',    // Lista de Postulante
    component:LISTAPOSTULANTE
},
{
    path:'/rh/rhpostul/listaentrevista',    // Lista de Entrevista
    component:LISTAENTREVISTA
},
{
    path:'/rh/rhpostul/listacontratado',    // Lista de Contratado
    component:LISTACONTRATADO
}
]

export default Route;