import vt_rep_lista_de_precios from "../pages/vt/reporte/lista_de_precios";
import vt_rep_tacticos from "../pages/vt/reporte/tacticos/tacticos";
const Route = [{
    path: '/vt/rep/lista_de_precios',
    component: vt_rep_lista_de_precios,
},{
    path: '/vt/rep/vtreptac',
    component: vt_rep_tacticos,
}];
export default Route;