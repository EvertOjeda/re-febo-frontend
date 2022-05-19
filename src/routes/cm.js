import Proveedores from "../pages/cm/definiciones/form/CMPROVEC";
import Aduanas     from "../pages/cm/definiciones/form/CMADUANA";
const Route = [
    {
        path: '/cm/cmprovec',
        component: Proveedores,
    },
    {
        path: '/cm/cmaduana',
        component: Aduanas,
    },
]

export default Route;