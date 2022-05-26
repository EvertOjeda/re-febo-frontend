import rhformexp from '../pages/rh/RHFORMEXP/definicion/form/RHFORMEXP';   //agregado Evert
import rhpostul from '../pages/rh/RHFORMEXP/definicion/form/RHPOSTUL';


const Route = [{
    path:'/rh/rhformexp',                   // Exportar lista de Excel a Base de Datos
    component:rhformexp
},
{
    path:'/rh/rhpostul',                    // Postulantes Main
    component:rhpostul
},
{
    path:'/rh/rhpostul/listaentrevista',    // Lista de Entrevista
    component:rhpostul
},
{
    path:'/rh/rhpostul/listacontratado',    // Lista de Contratado
    component:rhpostul
}
]

export default Route;