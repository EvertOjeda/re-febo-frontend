import fv_rep_comision_vendedor from "../pages/fv/reporte/comision_vendedor";
import fv_rep_comision_supervisor from "../pages/fv/reporte/comision_supervisor";
import fv_rep_resumen_visita from "../pages/fv/reporte/resumen_visitas";
const Route = [{
    path: '/fv/rep/comision_vendedor',
    component: fv_rep_comision_vendedor,
},{
    path: '/fv/rep/comision_supervisor',
    component: fv_rep_comision_supervisor,
},{
    path: '/fv/rep/resumen_visita',
    component: fv_rep_resumen_visita,
}];
export default Route;