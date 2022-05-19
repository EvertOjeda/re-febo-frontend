// DEFINICION
import Persona from "../pages/bs/definicion/form/BSPERSON/Persona_lista";
import PersonaForm from "../pages/bs/definicion/form/BSPERSON/Persona_form";
import Barrio from "../pages/bs/definicion/form/BSBARRIO/Barrio_lista";
import BarrioForm from "../pages/bs/definicion/form/BSBARRIO/Barrio_form";
import Ciudad from "../pages/bs/definicion/form/BSCIUDAD/Ciudad_lista";
import CiudadForm from "../pages/bs/definicion/form/BSCIUDAD/Ciudad_form";
import Departamento from "../pages/bs/definicion/form/BSPROVIN/Departamento_lista";
import DepartamentoForm from "../pages/bs/definicion/form/BSPROVIN/Departamento_form";
import Pais from "../pages/bs/definicion/form/BSPAISES/Pais_lista";
import PaisForm from "../pages/bs/definicion/form/BSPAISES/Pais_form";
import SectorEconomico from "../pages/bs/definicion/form/BSSECECO/Sector_economico_lista";
import SectorEconomicoForm from "../pages/bs/definicion/form/BSSECECO/Sector_economico_form";
import Sucursal from "../pages/bs/definicion/form/BSSUCUR/Sucursal_lista";
import SucursalForm from "../pages/bs/definicion/form/BSSUCUR/Sucursal_form";
import ZonaGeografica from "../pages/bs/definicion/form/BSZONAS/Zona_lista";
import ZonaGeograficaForm from "../pages/bs/definicion/form/BSZONAS/Zona_form";
import Calendario from "../pages/bs/definicion/form/BSCALEN/Calendario_lista";
import CalendarioForm from "../pages/bs/definicion/form/BSCALEN/Calendario_form";
import SubtiposTrans from "../pages/bs/definicion/form/BSSUBTRA/Subtipos_trans_list";
import SubtipodeTransform from "../pages/bs/definicion/form/BSSUBTRA/Subtipos_trans_form";
import TiposCambiolista from "../pages/bs/definicion/form/BSTIPCAM/TiposCambio_lista";
import TiposCambioform from "../pages/bs/definicion/form/BSTIPCAM/TiposCambio_form";
import TipoComprobante from "../pages/bs/definicion/form/BSTIPCOM/TipoComprobante_lista";
import TipoComprobanteForm from "../pages/bs/definicion/form/BSTIPCOM/TipoComprobante_form";
import TipoTransaccion from '../pages/bs/definicion/form/BSTIPTRA/TipoTransaccion_lista';
import TipoTransaccionForm from '../pages/bs/definicion/form/BSTIPTRA/TipoTransaccion_form';
import ConfReclamo from "../pages/bs/definicion/form/BSREGIIP/ConfReclamo_lista";
import ConfReclamoForm from "../pages/bs/definicion/form/BSREGIIP/ConfReclamo_form";
import Moneda from "../pages/bs/definicion/form/BSMONEDA/Moneda_lista";
import MonedaForm from "../pages/bs/definicion/form/BSMONEDA/Moneda_form";
import Empresa from "../pages/bs/definicion/form/BSEMPRES/Empresa_lista";
import EmpresaForm from "../pages/bs/definicion/form/BSEMPRES/Empresa_form";
import TimbradoLista from "../pages/bs/definicion/form/BSTIMBRA/Timbrado_lista";
import TimbradoForm from "../pages/bs/definicion/form/BSTIMBRA/Timbrado_form";
// MOVIMIENTO
import Usuario from '../pages/bs/movimiento/form/BSUSUARI/Usuarios_lista';
import UsuarioForm from '../pages/bs/movimiento/form/BSUSUARI/Usuarios_form';
import GrupoDeUsuario from '../pages/bs/movimiento/form/BSGRUPOS/GruposDeUsuarios_lista';
import GrupoDeUsuarioForm from '../pages/bs/movimiento/form/BSGRUPOS/GruposDeUsuarios_form';
import Formulario from '../pages/bs/movimiento/form/BSFORMAS/Formulario_lista';
import FormularioForm from '../pages/bs/movimiento/form/BSFORMAS/Formulario_form';
import AccesoDeGrupo from '../pages/bs/movimiento/form/BSACCGRP/AccesoDeGrupos_lista';
import AccesoDeGrupoForm from '../pages/bs/movimiento/form/BSACCGRP/AccesoDeGrupos_form';
import UsuarioSinRestriccion from '../pages/bs/movimiento/form/BSSINLIM/UsuariosSinRestriccion_lista';
import UsuarioSinRestriccionForm from '../pages/bs/movimiento/form/BSSINLIM/UsuariosSinRestriccion_form';
import ModulosDelSistema from '../pages/bs/movimiento/form/BSMODULO/ModulosDelSistema_lista';
import ModulosDelSistemaForm from '../pages/bs/movimiento/form/BSMODULO/ModulosDelSistema_form';
import OpcionesPermiso from '../pages/bs/movimiento/form/BSOPCION/Opciones_permiso_lista';
import OpcionesPermisoForm from '../pages/bs/movimiento/form/BSOPCION/Opciones_permiso_form';
import PermisoOpcionUsuario from '../pages/bs/movimiento/form/BSPERMIS/Permiso_opcion_usuario_lista';
import PermisoOpcionUsuarioForm from '../pages/bs/movimiento/form/BSPERMIS/Permiso_opcion_usuario_form';
import Parametros from '../pages/bs/movimiento/form/BSPARAME/Parametro_lista';
import ParametrosForm from '../pages/bs/movimiento/form/BSPARAME/Parametro_form';
const Route = [
    // DEFINICION
{
    path: '/bs/persona',
    component: Persona,
},{
    path: '/bs/persona/:cod_persona',
    component: PersonaForm,
},{
    path: '/bs/barrio',
    component: Barrio,
},{
    path: '/bs/barrio/:id',
    component: BarrioForm,
},{
    path: '/bs/ciudad',
    component: Ciudad,
},{
    path: '/bs/ciudad/:cod_ciudad',
    component: CiudadForm,
},{
    path: '/bs/departamento',
    component: Departamento,
},{
    path: '/bs/departamento/:cod_provincia',
    component: DepartamentoForm,
},{
    path: '/bs/pais',
    component: Pais,
},{
    path: '/bs/pais/:cod_pais',
    component: PaisForm,
},{
    path: '/bs/sector_economico',
    component: SectorEconomico,
},{
    path: '/bs/sector_economico/:cod_sector',
    component: SectorEconomicoForm,
},{
    path: '/bs/sucursal',
    component: Sucursal,
},{
    path: '/bs/sucursal/:cod_sucursal',
    component: SucursalForm,
},{
    path: '/bs/zona_geografica',
    component: ZonaGeografica,
},{
    path: '/bs/zona_geografica/:id',
    component: ZonaGeograficaForm,
},{
    path: '/bs/calendario',
    component: Calendario,
},{
    path: '/bs/calendario/:id',
    component: CalendarioForm,
},{
    path: '/bs/subtipotrans',
    component: SubtiposTrans,
},{
    path: '/bs/subtipotrans/:cod_subtipotrans',
    component: SubtipodeTransform,
},{
    path: '/bs/tipcambio',
    component: TiposCambiolista,
},{
    path: '/bs/tipcambio/:cod_tipcambio',
    component: TiposCambioform,
},{
    path: '/bs/tipocomp',
    component: TipoComprobante,
},{
    path: '/bs/tipocomp/:id',
    component: TipoComprobanteForm,
},{
    path: '/bs/tipotrans',
    component: TipoTransaccion,
},{
    path: '/bs/tipotrans/:cod_tipo',
    component: TipoTransaccionForm,
},{
    path: '/bs/confreclamo',
    component: ConfReclamo,
},{
    path: '/bs/confreclamo/:cod_usuario',
    component: ConfReclamoForm,
},{
    path: '/bs/moneda',
    component: Moneda,
},{
    path: '/bs/moneda/:cod_moneda',
    component: MonedaForm,
},{
    path: '/bs/empresa',
    component: Empresa,
},{
    path: '/bs/empresa/:id',
    component: EmpresaForm,
},{
    path: '/bs/timbrado',
    component: TimbradoLista,
},{
    path: '/bs/timbrado/:nro_timbrado',
    component: TimbradoForm,
},
// MOVIMIENTO
{
    path: '/bs/usuarios',
    component: Usuario,
},{
    path: '/bs/usuarios/:id',
    component: UsuarioForm, 
},{
    path: '/bs/grupos_de_usuarios',
    component: GrupoDeUsuario, 
},{
    path: '/bs/grupos_de_usuarios/:id',
    component: GrupoDeUsuarioForm, 
},{
    path: '/bs/formulario',
    component: Formulario, 
},{
    path: '/bs/formulario/:id',
    component: FormularioForm, 
},{
    path: '/bs/acceso_de_grupos',
    component: AccesoDeGrupo, 
},{
    path: '/bs/acceso_de_grupos/:id',
    component: AccesoDeGrupoForm, 
},{
    path: '/bs/usuarios_sin_restriccion',
    component: UsuarioSinRestriccion, 
},{
    path: '/bs/usuarios_sin_restriccion/:id',
    component: UsuarioSinRestriccionForm, 
},{
    path: '/bs/modulo',
    component: ModulosDelSistema, 
},{
    path: '/bs/modulo/:id',
    component: ModulosDelSistemaForm, 
},{
    path: '/bs/opcionespermiso',
    component: OpcionesPermiso, 
},{
    path: '/bs/opcionespermiso/:id',
    component: OpcionesPermisoForm,
},{
    path: '/bs/permisosOpcionesUsuarios',
    component: PermisoOpcionUsuario, 
},{
    path: '/bs/permisosOpcionesUsuarios/:id',
    component: PermisoOpcionUsuarioForm,
},{
    path: '/bs/parametros',
    component: Parametros, 
},{
    path: '/bs/parametros/:id',
    component: ParametrosForm,
}
];
export default Route;