import rhformexp from '../pages/rh/definicion/form/RHPOSTUL/RHFORMEXP'; 
import rhpostul from '../pages/rh/definicion/form/RHPOSTUL';
import LISTAPOSTULANTE from '../pages/rh/definicion/form/RHPOSTUL/LISTAPOSTULANTE';
import LISTAENTREVISTA from '../pages/rh/definicion/form/RHPOSTUL/LISTAENTREVISTA';
import LISTACONTRATADO from '../pages/rh/definicion/form/RHPOSTUL/LISTACONTRATADO';
import CONCEPTOS from '../pages/rh/definicion/form/RHPLACOF/RHPLACOF';

const Route = [{
    path:'/rh/rhpostul/rhformexp',          // Exportar lista de Excel a Base de Datos
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
},
{
    path:'/rh/rhplacof',           // Conceptos para Planillas
    component:CONCEPTOS
}
]

export default Route;