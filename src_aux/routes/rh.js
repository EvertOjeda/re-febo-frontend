import rhformexp from '../pages/rh/RHFORMEXP/definicion/form/RHFORMEXP';   //agregado Evert
import rhpostul from '../pages/rh/RHFORMEXP/definicion/form/RHPOSTUL';


const Route = [{
    path:'/rh/rhformexp',   // Exportar lista de Excel a Base de Datos
    component:rhformexp
},
{
    path:'/rh/rhpostul',    // Lista de Postulantes
    component:rhpostul
}
]

export default Route;