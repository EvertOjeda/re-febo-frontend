import Articulo from '../pages/st/definicion/form/STARTICU/STARTICU';
import STARTICU_new from '../pages/st/definicion/form/STARTICU/STARTICU_new';
import MovDeAjustDeStock from '../pages/st/definicion/form/STMOENSA';
import Categoria from '../pages/st/definicion/form/STLINART/STLINART';
import Marcas from '../pages/st/definicion/form/STMARART';
import Rubro from '../pages/st/definicion/form/STRUBRO';
import Grupo from '../pages/st/definicion/form/STGRUPO';
import Familia from '../pages/st/definicion/form/STFAMART/STFAMART';
import FacturaEnOtraSucursal from '../pages/st/definicion/form/STSUCFAC';
import Deposito from '../pages/st/definicion/form/STDEPOSI';
import Segmentos from '../pages/st/definicion/form/STCATEGO/STCATEGO';
import Startreg from '../pages/st/definicion/form/STARTREG/STARREG';
import stcatemo from '../pages/st/definicion/form/STCATEMO';
import stcautra from '../pages/st/definicion/form/STCAUTRA/STCAUTRA'


// MOVIMIENTO
import STENTSAL from '../pages/st/movimiento/form/STENTSAL';
import STENVIO  from '../pages/st/movimiento/form/STENVIO';
import STREMINI from '../pages/st/movimiento/form/STREMINI';
import STMETGBI from '../pages/st/movimiento/form/STMETGBI/STMETGBI';
import STREMPRO from '../pages/st/movimiento/form/STREMPRO';

// REPORTE
import STCOMPRA from '../pages/st/reporte/form/STCOMPRA';

const Route = [{
    path: '/st/starticu',
    component: Articulo,
},{
    path: '/st/stmoensa',
    component: MovDeAjustDeStock,
},{
    path: '/st/stlinart',
    component:Categoria,
},{
    path: '/st/stmarart',
    component:Marcas,
},{
    path: '/st/strubro',
    component:Rubro,
},{
    path: '/st/stgrupo',
    component:Grupo,
},{
    path: '/st/stfamilia',
    component:Familia,
},{
    path: '/st/stsucfac',
    component:FacturaEnOtraSucursal,
},{
    path: '/st/stdeposi',
    component:Deposito,
},{
    path: '/st/stcatego/',
    component:Segmentos,
},{
    path: '/st/stentsal',
    component:STENTSAL,
},{
    path: '/st/stenvio',
    component:STENVIO,
},{
    path: '/st/startreg',
    component:Startreg,
},{
    path: '/st/stcatemo',
    component:stcatemo,
},{
    path: '/st/stcautra',
    component:stcautra,
},{
    path: '/st/stremini',
    component:STREMINI,
},{
    path:'/st/stmetgbi',
    component:STMETGBI
},{
    path:'/st/strempro',
    component:STREMPRO
},{
    path:'/st/stcompra',
    component:STCOMPRA
}
,{
    path:'/st/starticu_new',
    component:STARTICU_new
}
];
export default Route;




/* 
    {
    path:'/rh/rhformexp',   //Agregado Evert
    component:rhformexp
},

*/