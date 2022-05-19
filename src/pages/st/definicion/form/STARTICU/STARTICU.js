import React, { useState, useEffect, useRef, memo } from "react";
import Main			 								from "../../../../../components/utils/Main";
import  Paper 					             		from '@material-ui/core/Paper';
import { ValidarColumnasRequeridas } 				from "../../../../../components/utils/DevExtremeGrid/ValidarColumnasRequeridas";
import {validateSave}								from '../../../../../components/utils/DevExtremeGrid/Search'
import DevExtremeCab,
{ ArrayPushDelete	     ,  setcancelarCab		, getcancelarCab		 ,
getEstablecerOperaciones , getFocusedRowIndex	, getFocusGlobalEvent	 ,
limpiarArrayDelete		 , getTipoDeOperaciones
} from "../../../../../components/utils/DevExtremeGrid/DevExtremeCab";
import DevExtremeDet, {
	getBloqueoCabecera	   , setBloqueoCabecera  , getIdComponentUpdate, 
	removeIdComponentUpdate, setGlobalValidateDet, setColumnRequerido
} from "../../../../../components/utils/DevExtremeGrid/DevExtremeDet";
import { v4 as uuidID } from "uuid";
import { Row, Col, Checkbox, Radio, Form, Input, Select, Tabs, DatePicker, ConfigProvider  } from "antd";
import locale	  			  from 'antd/lib/locale/es_ES';
import _ 		  			  from "underscore";
import ArrayStore 			  from "devextreme/data/array_store";
import DataSource 			  from "devextreme/data/data_source";
import {setModifico,modifico} from '../../../../../components/utils/DevExtremeGrid/ButtonCancelar'
import moment 				  from "moment";
import NewTableSearch 		  from './NewTableSearchCab/NewTableSearch';
import { Menu, DireccionMenu }from '../../../../../components/utils/FocusDelMenu';
import { getPermisos } 		  from '../../../../../components/utils/ObtenerPermisosEspeciales';
import './starticu.css';
import "moment/locale/es";


moment.locale("es_es", { week: { dow: 3 } });
const { TabPane } = Tabs;

var cancelarUnidadMedida = "";
const getCancelarUnidadMedida = () => {
    return cancelarUnidadMedida;
};
var cancelarFormInput = "";
const getCancelarFormInput = () => {
    return cancelarFormInput;
};
var cancelarProveedor;
const getCancelarProveedor = ()=>{
	return cancelarProveedor
}
var cancelarLimitePorPedido;
const getCancelarLimitePorPedido = ()=>{
	return cancelarLimitePorPedido
}
var cancelarMovimientoStockCab;
const getCancelarMovimientoStockCab = ()=>{
	return cancelarMovimientoStockCab;
}
var cancelarMovimientoStockDet;
const getCancelarMovimientoStockDet = ()=>{
	return cancelarMovimientoStockDet
}
var cancelarPack;
const getCancelarPack = ()=>{
	return cancelarPack;
}
var cancelarBloqueoExistencia;
const getCancelarBloqueoExistencia = ()=>{
	return cancelarBloqueoExistencia;
}
var cancelarNormaPalet;
const getCancelarNormaPalet = ()=>{
	return cancelarNormaPalet;
}
var cancelarDireccionFija;
const getCancelarDireccionFija = ()=>{
	return cancelarDireccionFija;
}
var cancelarCantidadPicking;
const getCancelarCantidadPicking = ()=>{
	return cancelarCantidadPicking;
}
var cancelarAcuerdo;
const getCancelarAcuerdo = ()=>{
	return cancelarAcuerdo;
}
var focusIDComponent = {};
const setFocusIDComponent = (grid,nombre)=>{
	focusIDComponent = {'grid':grid,'nombre':nombre};
}
const getFocusIDComponent = ()=>{
	return focusIDComponent;
}
// VALIDA
const url_valida_familia = "/st/starticu/valida/familia";
const url_valida_marca = "/st/starticu/valida/marca";
const url_valida_articulo = "/st/starticu/valida/articulo";
const url_valida_articulo_ref = "/st/starticu/valida/articulo_ref";
const url_valida_categoria = "/st/starticu/valida/categoria";
const url_valida_segmento = "/st/starticu/valida/segmento";
const url_valida_grupo = "/st/starticu/valida/grupo";
const url_valida_iva = "/st/starticu/valida/iva";
const url_valida_almacenaje = "/st/starticu/valida/almacenaje";
const url_valida_separacion = "/st/starticu/valida/separacion";
const url_valida_sucursal = '/st/starticu/valida/sucursal';
const url_valida_unidad_medida  = '/st/starticu/valida/unidad_medida';
const url_valida_unidadMedida = '/st/starticu/valida/unidad_medida_wms' ;
const url_valida_deposito = '/st/starticu/valida/deposito';
const url_valida_zona = '/st/starticu/valida/zona';
const url_valida_direccion = '/st/starticu/valida/direccion';
const url_valida_tipo_direccion = '/st/starticu/valida/tipo_direccion';
const url_valida_proveedor = "/st/starticu/valida/Proveedor";

const url_valida_cod_unidad_medida = "/st/starticu/valida/cod_unidad_medida";

// BUSCA
const url_buscar_familia = '/st/starticu/buscar/familia';
const url_buscar_marca = '/st/starticu/buscar/marca';
const url_buscar_articulo = '/st/starticu/buscar/articulo';
const url_buscar_articulo_ref = '/st/starticu/buscar/articulo_ref';
const url_buscar_categoria = '/st/starticu/buscar/categoria';
const url_buscar_segmento = '/st/starticu/buscar/segmento';
const url_buscar_iva = '/st/starticu/buscar/iva';
const url_buscar_grupo = '/st/starticu/buscar/grupo';
const url_buscar_almacenaje = '/st/starticu/buscar/almacenaje';
const url_buscar_separacion = '/st/starticu/buscar/separacion';
const url_buscar_sucursal = '/st/starticu/buscar/sucursal';
const url_buscar_unidad_medida = '/st/starticu/buscar/unidad_medida';
const url_buscar_unidadMedida = '/st/starticu/buscar/unidad_medida_wms';
const url_buscar_deposito = '/st/starticu/buscar/deposito';
const url_buscar_zona = '/st/starticu/buscar/zona';
const url_buscar_direccion = '/st/starticu/buscar/direccion';
const url_buscar_tipo_direccion  = '/st/starticu/buscar/tipo_direccion';
const url_buscar_proveedor = "/st/starticu/buscar/proveedor";

const url_buscar_cod_unidad_medida = "/st/starticu/buscar/cod_unidad_medida";

// CABECERA
const url_cod_articulo = "/st/starticu/cod_articulo";
const url_buscar_pais_origen = "/st/starticu/buscar/pais_origen";
const url_valida_pais_origen = "/st/starticu/valida/pais_origen";
const url_buscar_proveedor_dflt = "/st/starticu/buscar/proveedor_dflt";
const url_valida_proveedor_dflt = "/st/starticu/valida/Proveedor_dflt";
const url_buscar_rubro = "/st/starticu/buscar/rubro";
const url_valida_rubro = "/st/starticu/valida/rubro";
const columns = [{
				ID: "COD_ARTICULO",
				label: "Articulo",
				width: 100,
				// align: "right",
				// isnumber: true,
				disable: true,
				Pk:true
    },
    {
        ID: "DESCRIPCION",
        label: "Descripción",
        minWidth: 500,
        align: "left",
        requerido: true,
        upper: true,
    },{
        ID: "COD_PAIS_ORIGEN",
        label: "País",
        width: 80,
        align: "left",
        upper: true,
    },
    {
        ID: "DESC_PAIS_ORIGEN",
        label: "Desc. Pais",
        width: 100,
        align: "left",
        disable: true,
    },
    {
        ID: "COD_PROVEEDOR_DFLT",
        label: "Proveedor",
        width: 100,
        align: "right",
    },
    {
        ID: "DESC_PROVEEDOR",
        label: "Desc. Proveedor",
        minWidth: 120,
        align: "left",
        disable: true,
    },
    { 
				ID: "COD_RUBRO", 
				label: "Rubro", 
				width: 90, 
				align: "right" },
    {
        ID: "DESC_RUBRO",
        label: "Desc. Rubro",
        minWidth: 100,
        align: "left",
        disable: true,
    },
    {
        ID: "COD_BARRA_ART",
        label: "Cod. Barras",
        width: 120,
        align: "left",
        upper: true,
    },
];
const columnModal = {
    urlValidar: [
        {
            COD_PAIS_ORIGEN: url_valida_pais_origen,
            COD_PROVEEDOR_DFLT: url_valida_proveedor_dflt,
            COD_RUBRO: url_valida_rubro,
        },
    ],
    urlBuscador: [
        {
            COD_PAIS_ORIGEN: url_buscar_pais_origen,
            COD_PROVEEDOR_DFLT: url_buscar_proveedor_dflt,
            COD_RUBRO: url_buscar_rubro,
        },
    ],
    title: [
        {
            COD_PAIS_ORIGEN: "Pais",
            COD_PROVEEDOR_DFLT: "Proveedor",
            COD_RUBRO: "Rubro",
        },
    ],
	COD_PAIS_ORIGEN:[
        { ID: 'COD_PAIS_ORIGEN'   , label: 'Pais'         , width: 110      , align:'left'  },
    		{ ID: 'DESC_PAIS_ORIGEN'  , label: 'Descripción ' , minWidth: 70    , align:'left'   },
    ],
	COD_PROVEEDOR_DFLT:[
        { ID: 'COD_PROVEEDOR_DFLT'   , label: 'Proveedor'      , width: 110      , align:'left'  },
    	{ ID: 'DESC_PROVEEDOR'  , label: 'Nombre'         , minWidth: 70    , align:'left'   },
    ],
	COD_RUBRO:[
        { ID: 'COD_RUBRO'   , label: 'Rubro'              , width: 110      , align:'left'  },
    	{ ID: 'DESC_RUBRO'  , label: 'Descripción'        , minWidth: 70    , align:'left'   },
    ],
    config: {},
};
// UNIDAD DE MEDIDA
const columns_UnidadMedida = [
    { ID: 'COD_UNIDAD_REL' , label: 'U.M'             , width: 70     , align:'right'    , editModal:true  ,requerido:true},
    { ID: 'REFERENCIA'     , label: 'Referencia'      , minWidth: 190 , align:'left'     , upper:true     },
    { ID: 'MULT'           , label: 'Cantidad'        , width: 80     , align:'right'    , isnumber:true   ,requerido:true},    
    { ID: 'KG_PESO_NETO'   , label: 'Peso(kg)'        , width: 80     , align:'right'    , isnumber:false },
    { ID: 'COD_BARRA_ART'  , label: 'Código de Barra' , width: 120    , align:'left'   } ,
    { ID: 'LARGO_M'        , label: 'Largo(M)'        , width: 70     , align:'right'    , isnumber:false },
    { ID: 'ANCHO_M'        , label: 'Ancho(M)'        , width: 70     , align:'right'    , isnumber:false },
    { ID: 'ALTO_M'         , label: 'Alto(M)'         , width: 70     , align:'right'    , isnumber:false },
    { ID: 'IND_BASICO'     , label: 'Basica'          , width: 80     , align:'center'   , checkbox:true   , checkBoxOptions:["S","N"] , vertical:false },
    { ID: 'IND_PORC_VTA'   , label: '% Vta.'          , width: 80     , align:'center'   , checkbox:true   , checkBoxOptions:["S","N"] , vertical:false },
    { ID: 'IND_VENTA'      , label: 'P. Venta'        , width: 80     , align:'center'   , checkbox:true   , checkBoxOptions:["S","N"] , vertical:false },
    { ID: 'MEN_UN_VTA'     , label: 'Men.Vta.'        , width: 80     , align:'center'   , checkbox:true   , checkBoxOptions:["S","N"] , vertical:false },
];
const columnModal_UnidadMedida = {
    urlValidar: [
			{ COD_UNIDAD_REL : url_valida_cod_unidad_medida }
		],
    urlBuscador: [
			{ COD_UNIDAD_REL : url_buscar_cod_unidad_medida }
		],
    title: [
			{ COD_UNIDAD_REL : 'Unidad de Medida' }
		],
    COD_UNIDAD_REL:[
			{ ID: 'COD_UNIDAD_REL'   , label: 'Unid. Medida' , width: 110      , align:'left'  },
			{ ID: 'REFERENCIA'  , label: 'Descripción'  , minWidth: 70    , align:'left'   },
		],
    config: {},
};
// PROVEEDOR
const columns_Proveedor = [
    { ID: 'COD_PROVEEDOR'  , label: 'Proveedor'   , width: 100     , editModal:true , align:'right'   , requerido:true},
    { ID: 'DESC_PROVEEDOR' , label: 'Descripción' , minWidth: 190  , align:'left'   , disable:true   },
];
const columnModal_Proveedor = {
    urlValidar:[
        { COD_PROVEEDOR : url_valida_proveedor }
    ],
    urlBuscador:[
        { COD_PROVEEDOR : url_buscar_proveedor }
    ],
    title:[
        { COD_PROVEEDOR : 'Proveedor' }
    ],
    COD_PROVEEDOR:[
        { ID: 'COD_PROVEEDOR'   , label: 'Proveedor'      , width: 110      , align:'left'  },
        { ID: 'DESC_PROVEEDOR'  , label: 'Nombre'         , minWidth: 70    , align:'left'   },
    ],
    config:{},
}
// LIMITE POR PEDIDO
const columns_LimitePedido =[
    { ID: 'COD_DEPOSITO' , label: 'Deposito'                , width: 80      , disable:true  },
    { ID: 'DESCRIPCION'  , label: 'Descripción'             , minWidth: 190  , disable:true  },
    { ID: 'CANT_LIMITE'  , label: 'Cant Limite por Pedido'  , width: 200     , align:'right' , isnumber:true    },
];
const columnModal_LimitePedido ={
    urlValidar:[],
    urlBuscador:[],
    title:[],
    DEPENDENCIA:[],
 	  config:{},
}
// MOVIMIENTO DE STOCK CABECERA
const columns_MovimientoStockCab =[
    { ID: 'COD_SUCURSAL'  , label: 'Sucursal'     , width: 100    , align:'left'   , editModal:true , requerido:true},
    { ID: 'DESC_SUCURSAL' , label: 'Descripción'  , minWidth: 190 , disable:true  },
    { ID: 'CANT_MINIMA'   , label: 'Cant. Minima' , width: 100    , align:'right'  , isnumber:true },
];
const columnModal_MovimientoStockCab ={
    urlValidar:[
        { COD_SUCURSAL : url_valida_sucursal }
    ],
    urlBuscador:[
        { COD_SUCURSAL : url_buscar_sucursal }
    ],
    title:[
        { COD_SUCURSAL : 'Sucursal' }
    ],
    COD_SUCURSAL:[
        { ID: 'COD_SUCURSAL'  , label: 'Sucursal' , width: 80    , align:'left'  },
        { ID: 'DESC_SUCURSAL' , label: 'Descripcion '      , minWidth: 70 , align:'left'  },
    ],
    config:{
        COD_SUCURSAL:{
            depende_de:[
                {id: 'COD_ARTICULO',label: 'Articulo '},
            ],
            dependencia_de:[]   
        }
    },
}
// MOVIMIENTO DE STOCK DETALLE
const columns_MovimientoStockDet =[
    { ID: 'COD_SUCURSAL'  , label: 'Sucursal'     , width: 100    , editModal:true , align:'left' , requerido:true },
    { ID: 'DESC_SUCURSAL' , label: 'Descripción'  , minWidth: 190 , disable:true  },
    { ID: 'CANT_MINIMA'   , label: 'Cant. Minima' , width: 100    , align:'right' },
];
const columnModal_MovimientoStockDet ={
    urlValidar:[
        { COD_SUCURSAL : url_valida_sucursal }
    ],
    urlBuscador:[
        { COD_SUCURSAL : url_buscar_sucursal }
    ],
    title:[
        { COD_SUCURSAL : 'Sucursal' }
    ],
    COD_SUCURSAL:[
        { ID: 'COD_SUCURSAL'  , label: 'Sucursal'     , width: 80    , align:'left'  },
        { ID: 'DESC_SUCURSAL' , label: 'Descripcion ' , minWidth: 70 , align:'left'  },
    ],
    config:{},
}
// PACK
const columns_Pack = [
    { ID: 'COD_ARTICULO_REF' , label: 'Código'      , width: 100    , align:'right'	 , editModal:true ,requerido:true},
    { ID: 'DESC_ARTICULO'    , label: 'Descripción' , minWidth: 190 , align:'left'   , disabled: true },
    { ID: 'CANTIDAD'         , label: 'Cantidad'    , width: 100    , align:'right'  , isnumber: true ,requerido:true},
    { ID: 'COSTO_PROM_GS'    , label: 'Promedio Gs' , width: 100    , align:'right'  , disabled: true },
];
const columnModal_Pack = {
    urlValidar:[
        { COD_ARTICULO_REF : url_valida_articulo_ref }
    ],
    urlBuscador:[
        { COD_ARTICULO_REF : url_buscar_articulo_ref }
    ],
    title:[
        { COD_ARTICULO_REF : 'Articulo' }
    ],
    COD_ARTICULO_REF:[
        { ID: 'COD_ARTICULO_REF'   , label: 'Articulo'    , width: 80      , align:'left'  },
        { ID: 'DESC_ARTICULO'      , label: 'Descripción' , minWidth: 70    , align:'left'  },
    ],
    config:{},
}
// BLOQUEO DE EXISTENCIA
const columns_BloqueoExistencia = [
    { ID: 'COD_DEPOSITO'   , label: 'Código'           , width: 100    , disable:true },
    { ID: 'DESCRIPCION'    , label: 'Descripción'      , minWidth: 190 , disable:true },
    { ID: 'CANT_DISPON'    , label: 'Cantidad Dispon'  , width: 150    , align:'right' , isnumber:true  },
    { ID: 'CANT_RESERVADA' , label: 'Cantidad Reserv.' , width: 150    , align:'right' , isnumber:true  },
    { ID: 'CANT_BLOQUEADA' , label: 'Cantidad Bloq.'   , width: 150    , align:'right' , isnumber:true  },
];
const columnModal_BloqueoExistencia ={
	urlValidar:[],
	urlBuscador:[],
	title:[],
	config:{},
}
// NORMA PALET
const columns_NormaPalet = [
    { ID: 'COD_SUCURSAL'    , label: 'Sucursal'     , width: 100     , align:'right'  , editModal:true  , requerido:true    },
    { ID: 'DESC_SUCURSAL'   , label: 'Descripción'  , minWidth: 190  , align:'left'   , disable:true   },
    { ID: 'COD_UNIDAD_REL'  , label: 'U.M'          , width: 100     , align:'right'  , requerido:true },
    { ID: 'REFERENCIA'      , label: 'Referencia'   , minWidth: 100  , align:'left'   , disable:true   },
    { ID: 'LASTRO'          , label: 'Lastro'       , width: 80      , align:'right'  , isnumber:true  },
    { ID: 'CAPAS'           , label: 'Capas'        , width: 80      , align:'right'  , isnumber:true  },
    { ID: 'IND_BASICO'      , label: 'Basico'       , width: 80      , align:'center' , checkbox:true  , checkBoxOptions:["S","N"], vertical:false    },
];
const columnModal_NormaPalet = {
    urlValidar:[
        {
            COD_SUCURSAL   : url_valida_sucursal,
            COD_UNIDAD_REL : url_valida_unidad_medida
        }
    ],
    urlBuscador:[
        { 
            COD_SUCURSAL   : url_buscar_sucursal,
            COD_UNIDAD_REL : url_buscar_unidad_medida
        }
    ],
    title:[
        { 
            COD_SUCURSAL   : 'Sucursal',
            COD_UNIDAD_REL : 'Unidad de medida'
        }
    ],
    COD_SUCURSAL:[
        { ID: 'COD_SUCURSAL'   , label: 'sucursal'     , width: 110      , align:'left'  },
        { ID: 'DESC_SUCURSAL'  , label: 'Descripción'  , minWidth: 70    , align:'left'  },
    ],
    COD_UNIDAD_REL:[
        { ID: 'COD_UNIDAD_REL'  , label: 'Unidad de medida' , width: 110      , align:'left'  },
        { ID: 'REFERENCIA'      , label: 'Descripción'      , minWidth: 70    , align:'left'  },
    ],
    config:{
		COD_SUCURSAL:{
			depende_de:[],
			dependencia_de:[]
		},
        COD_UNIDAD_REL:{
            depende_de:[
                {id: 'COD_ARTICULO',label: 'Articulo '},
            ],
            dependencia_de:[]       
        }
    },
}
// DIRECCION FIJA
const columns_DireccionFija = [
    { ID: 'COD_SUCURSAL'       , label: 'Sucursal'    , width: 100    , align:'left'  , editModal:true  ,requerido:true},
    { ID: 'DESC_SUCURSAL'      , label: 'Descripción' , minWidth: 190 , align:'left'  , disable:true   },
    { ID: 'COD_DEPOSITO'       , label: 'Depósito'    , width: 100    , align:'left'  , editModal:true  ,requerido:true},
    { ID: 'DESC_DEPOSITO'      , label: 'Descripción' , minWidth: 100 , align:'left'  , disable:true   },
    { ID: 'COD_ZONA'           , label: 'Zona'        , width: 100    , align:'left'  , editModal:true  ,requerido:true},
    { ID: 'DESC_ZONA'          , label: 'Descripción' , minWidth: 100 , align:'left'  , disable:true   },
    { ID: 'COD_UNIDAD_MEDIDA'  , label: 'U.M.'        , width: 100    , align:'left'  , editModal:true  ,requerido:true},
    { ID: 'DESC_UNIDAD_MEDIDA' , label: 'Descripción' , minWidth: 100 , align:'left'  , disable:true   },
    { ID: 'COD_DIRECCION'      , label: 'Dirección'   , width: 100    , align:'left' },
];
const columnModal_DireccionFija = {
    urlValidar:[   { 
                        COD_SUCURSAL      : url_valida_sucursal     ,
                        COD_UNIDAD_MEDIDA : url_valida_unidadMedida ,
                        COD_DEPOSITO      : url_valida_deposito     ,
                        COD_ZONA          : url_valida_zona         ,
                        COD_DIRECCION     : url_valida_direccion    ,
                    }
    ],
    urlBuscador:[   {
                        COD_SUCURSAL      : url_buscar_sucursal      ,
                        COD_UNIDAD_MEDIDA : url_buscar_unidadMedida  ,
                        COD_DEPOSITO      : url_buscar_deposito      ,
                        COD_ZONA          : url_buscar_zona          ,
                        COD_DIRECCION     : url_buscar_direccion
                    }
    						],
    title:[         {
                        COD_SUCURSAL      : 'Sucursal'              ,
                        COD_UNIDAD_MEDIDA : 'Unidad de medida'      ,
                        COD_DEPOSITO      : 'Deposito'              ,
                        COD_ZONA          : 'Zona'                  ,
                        COD_DIRECCION     : 'Dirección'
                    }
    ],
    COD_SUCURSAL:[
        { ID: 'COD_SUCURSAL'        , label: 'Sucursal'      , width: 110      , align:'left'  },
        { ID: 'DESC_SUCURSAL'       , label: 'Descripción'   , minWidth: 70    , align:'left'  },
    ],
    COD_UNIDAD_MEDIDA:[
        { ID: 'COD_UNIDAD_MEDIDA'   , label: 'Unidad medida' , width: 110      , align:'left'  },
        { ID: 'DESC_UNIDAD_MEDIDA'  , label: 'Descripción'   , minWidth: 70    , align:'left'  },
    ],
    COD_DEPOSITO:[
        { ID: 'COD_DEPOSITO'        , label: 'Deposito'      , width: 110      , align:'left'  },
        { ID: 'DESC_DEPOSITO'       , label: 'Descripción'   , minWidth: 70    , align:'left'  },
    ],
    COD_ZONA:[
        { ID: 'COD_ZONA'             , label: 'Zona'         , width: 110      , align:'left'  },
        { ID: 'DESC_ZONA'            , label: 'Descripción'  , minWidth: 70    , align:'left'  },
    ],
    COD_DIRECCION:[
        { ID: 'COD_DIRECCION'   , label: 'Dirección' , align:'left'  },
        { ID: 'COD_CALLE'       , label: 'Calle'     , align:'left'  },
        { ID: 'COD_PREDIO'      , label: 'Predio'    , align:'left'  },
        { ID: 'COD_PISO'        , label: 'Piso'      , align:'left'  },
    ],
    config:{
        COD_SUCURSAL:{
            depende_de:[],
            dependencia_de:[
                {id: 'COD_DEPOSITO',label: 'Deposito'},
                {id: 'COD_ZONA'    ,label: 'Zona'},
            ]
        },
        COD_DEPOSITO:{
            depende_de:[
                {id: 'COD_SUCURSAL', label: 'Sucursal'}
            ],
            dependencia_de:[
                {id: 'COD_ZONA'    ,label: 'Zona'},
            ]
        },
        COD_ZONA:{
            depende_de:[
                {id: 'COD_SUCURSAL', label: 'Sucursal'},
                {id: 'COD_DEPOSITO', label: 'Deposito'}
            ],
            dependencia_de:[]
        },
        COD_DIRECCION:{
            depende_de:[
                {id: 'COD_SUCURSAL' , label: 'Sucursal' },
                {id: 'COD_DEPOSITO' , label: 'Deposito' },                
            ],
            dependencia_de:[]
        },
    }
}
// CANTIDAD PICKING 
const columns_CantidadPicking = [
    { ID: 'COD_SUCURSAL'   , label: 'Sucursal'     , width: 100    , align:'left'    , editModal:true ,requerido:true},
    { ID: 'DESC_SUCURSAL'  , label: 'Descripción'  , minWidth: 190 , align:'left'    , disable:true  },
    { ID: 'COD_UNIDAD_REL' , label: 'U.M'          , width: 100    , align:'left'    , editModal:true ,requerido:true},
    { ID: 'REFERENCIA'     , label: 'Referencia'   , minWidth: 190 , align:'left'    , disable:true  },
    { ID: 'COD_TIPO'       , label: 'Tipo'         , width: 100    , align:'left'    , editModal:true ,requerido:true},
    { ID: 'DESC_TIPO'      , label: 'Descripción'  , minWidth: 190 , align:'left'    , disable:true  },
    { ID: 'IND_BASICO'     , label: 'Basico'       , width: 120    , align:'center'  , checkbox:true  , checkBoxOptions:["S","N"], vertical:false    },
];
const columnModal_CantidadPicking = {
    urlValidar:[
        {
            COD_SUCURSAL    : url_valida_sucursal,
            COD_UNIDAD_REL  : url_valida_unidad_medida,
            COD_TIPO        : url_valida_tipo_direccion
        }
    ],
    urlBuscador:[
        { 
            COD_SUCURSAL    : url_buscar_sucursal,
            COD_UNIDAD_REL  : url_buscar_unidad_medida,
            COD_TIPO        : url_buscar_tipo_direccion
        }
    ],
    title:[
        { 
            COD_SUCURSAL    : 'Sucursal',
            COD_UNIDAD_REL  : 'Unidad de medida',
            COD_TIPO        : 'Tipo'
        }
    ],
    COD_SUCURSAL:[
        { ID: 'COD_SUCURSAL'    , label: 'sucursal'         , width: 110      , align:'left'  },
        { ID: 'DESC_SUCURSAL'   , label: 'Descripción'      , minWidth: 70    , align:'left'  },
    ],
    COD_UNIDAD_REL:[
        { ID: 'COD_UNIDAD_REL'  , label: 'Unidad de medida' , width: 110      , align:'left'  },
        { ID: 'REFERENCIA'      , label: 'Descripción'      , minWidth: 70    , align:'left'  },
    ],
    COD_TIPO:[
        { ID: 'COD_TIPO'        , label: 'Tipo'             , width: 110      , align:'left'  },
        { ID: 'DESC_TIPO'       , label: 'Descripción'      , minWidth: 70    , align:'left'  },
    ],
    config:{
		COD_SUCURSAL:{
			depende_de:[
				{id: 'COD_UNIDAD_REL',label: 'Cod Unidad'},
            ],
            dependencia_de:[]
		},
        COD_UNIDAD_REL:{
            depende_de:[
                {id: 'COD_ARTICULO',label: 'Articulo '},
            ],
            dependencia_de:[]
        },
        COD_TIPO:{
            depende_de:[
                {id: 'COD_SUCURSAL',label: 'Sucursal '},
            ],
            dependencia_de:[]
        }
    },
}
// ACUERDO
const columns_Acuerdo = [
    { ID: 'COD_UNIDAD_REL' , label: 'U.M'            , width: 80     , align:'left'   	   ,editModal:true  ,requerido:true},
    { ID: 'REFERENCIA'     , label: 'Referencia'     , minWidth: 190 , disable:true  	  },
    { ID: 'TIPO'           , label: 'Tipo'           , width: 100    , isOpcionSelect:true},
    { ID: 'FEC_VIGENCIA'   , label: 'Fecha Vigencia' , width: 100    , align:'right'  	   , isdate:true   },
    { ID: 'MONTO_VALOR'    , label: 'Porc/Valor'     , width: 100    , align:'right'  	   , requerido:true , isnumber:true },
];
const columnModal_Acuerdo = {
    urlValidar:[
        { COD_UNIDAD_REL : url_valida_unidad_medida }
    ],
    urlBuscador:[
        { COD_UNIDAD_REL : url_buscar_unidad_medida }
    ],
    title:[
        { COD_UNIDAD_REL : 'Unidad de Medida' }
    ],
    COD_UNIDAD_REL:[
        { ID: 'COD_UNIDAD_REL' , label: 'Unidad de Medida' , width: 80    , align:'left'  },
        { ID: 'REFERENCIA'     , label: 'Referencia '      , minWidth: 70 , align:'left'  },
    ],
    config:{
        auto: [],
        COD_UNIDAD_REL:{
            depende_de:[
                {id: 'COD_ARTICULO',label: 'Articulo '},
            ],
            dependencia_de:[], 
        }
    },
}
const concepto = {  
	TIPO:  [    
		{ ID:'M' , NAME:'Monto'    , isNew:true}, 
		{ ID:'P' , NAME:'Porcentaje'}, 
	],
}
// LEADTIME 
const columns_LeadTime = [
    { ID: 'DIAS_PREV'   , label: 'Previos'    , minWidth: 40 , align:'right'  , isnumber:true},
    { ID: 'DIAS_PROD'   , label: 'Producción' , minWidth: 75 , align:'right'  , isnumber:true},
    { ID: 'DIAS_LOG'    , label: 'Logistica'  , minWidth: 65 , align:'right'  , isnumber:true},    
    { ID: 'DIAS_STOCK'  , label: 'Stock'      , minWidth: 40 , align:'right'  , isnumber:true},
    { ID: 'DIAS_MAXIMO' , label: 'Maximo'     , minWidth: 40 , align:'right'  , isnumber:true},
    { ID: 'DIAS_TOTAL'  , label: 'Total'      , minWidth: 40 , align:'right'  , disable :true}
];
const columnModal_LeadTime ={
	urlValidar:[],
	urlBuscador:[],
	title:[],
	DEPENDENCIA:[],
	config:{},
}
// COLUMNAS DE BUSQUEDA
const ColumnFamilia = [
    { ID: 'COD_FAMILIA'     , label: 'Código'      , width: 50     },
    { ID: 'DESC_FAMILIA'    , label: 'Descripción' , minWidth: 150 },
];
const ColumnMarca = [
    { ID: 'COD_MARCA'       , label: 'Código'      , width: 50     },
    { ID: 'DESC_MARCA'      , label: 'Descripción' , minWidth: 150 },
];
const ColumnArticulo = [
    { ID: 'COD_ORIGEN_ART' 	, label: 'Código'      , width: 50     },
    { ID: 'DESC_ORIGEN_ART'	, label: 'Descripción' , minWidth: 150 },
];
const ColumnCategoria = [
    { ID: 'COD_LINEA'  		, label: 'Código'      , width: 50     },
    { ID: 'DESC_LINEA' 		, label: 'Descripción' , minWidth: 150 },
];
const ColumnSegmento = [
    { ID: 'COD_CATEGORIA'   , label: 'Código'      , width: 50     },
    { ID: 'DESC_CATEGORIA'  , label: 'Descripción' , minWidth: 150 },
];
const ColumnIva = [
    { ID: 'COD_IVA'        , label: 'Código'      , width: 50     },
    { ID: 'DESC_IVA'       , label: 'Descripción' , minWidth: 150 },
];
const ColumnGrupo = [
    { ID: 'COD_GRUPO'      , label: 'Código'      , width: 50     },
    { ID: 'DESC_GRUPO'     , label: 'Descripción' , minWidth: 150 },
];
const ColumnAlmacenaje = [
    { ID: 'COD_CAT_ALM'    , label: 'Código'      , width: 50     },
    { ID: 'DESC_CAT_ALM'   , label: 'Descripción' , minWidth: 150 },
];
const ColumnSeparacion = [
    { ID: 'COD_CAT_SEP'    , label: 'Código'      , width: 50     },
    { ID: 'DESC_CAT_SEP'   , label: 'Descripción' , minWidth: 150 },
];
const columBuscador = "DESCRIPCION";
const doNotsearch = [];
const notOrderByAccion = ['COD_PAIS_ORIGEN','DESCRIPCION','DESC_PAIS_ORIGEN','COD_PROVEEDOR_DFLT','DESC_PROVEEDOR','COD_RUBRO','DESC_RUBRO','COD_BARRA_ART'];
const notOrderByAccionDet = [""];
const TituloList = "Artículos";

const FormName = "STARTICU";

const ColumnDefaultPosition = 0;

var id_cabecera    			    = '';
var band_lead_time 			    = true;
var band_unidad_medida 		  = true;
var band_proveedor 		      = true;
var band_limite_predido     = true;
var band_movimiento_stock   = true;
var band_pack 			        = true;
var band_bloqueo_existencia = true;
var band_norma_palet 				= true;
var band_direccion_fija 		= true;
var band_cantidad_picking 	= true;
var band_acuerdo 		    		= true;

const limpiarBandComponet = ()=>{
	band_lead_time 		      = true;
	band_unidad_medida 	    = true;
	band_proveedor 		      = true;
	band_limite_predido   	= true;
	band_movimiento_stock 	= true;
	band_pack 			        = true;
	band_bloqueo_existencia = true;
	band_norma_palet 		    = true;
	band_direccion_fija 	  = true;
	band_cantidad_picking 	= true;
	band_acuerdo 		        = true;
}
// operaciones
var insert   = false;
var update   = false;

const maxFocus = [{
	id:"LEAD_TIME",
	hasta:"DIAS_MAXIMO",
	newAddRow:false
}]
var validaDato = {
	state: false,
	position: ''
}
const setValidaDato = (value) => {
	validaDato = value;
}
const getValidaDato = () => {
	return validaDato;
}
var verificaKeydown = {
	state: false,
	e: ''
}
const setVerificaKeydown = (value) => {
	verificaKeydown = value;
}
const getVerificaKeydown = () => {
	return verificaKeydown;
}
var cod_marca_ant = '';
var cod_linea_ant = '';

const Ocultar_classDataPiker_1 = "ant-picker-dropdown-hidden";
const Ocultar_classDataPiker_2 = "ant-picker-dropdown-placement-bottomLeft";
const mostrar_classDataPiker_3 = "ant-picker-dropdown-placement-bottomLeft-aux";

// LIMITAR EL ULTIMO FOCUS
const maxFocus_proveedor = [{
	id:"PROVEEDOR",
	hasta:"COD_PROVEEDOR",
	newAddRow:true,
    nextId:'DESC_PROVEEDOR'
}];

const Articulo = memo(() => {
	
	const [form] = Form.useForm();
	const defaultOpenKeys 		   = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
	const defaultSelectedKeys    = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
	const PermisoEspecial 		   = getPermisos(FormName);
	const PermisoEspecialWMS 	   = getPermisos('STARTICW');
	const grid 			   		 		   = useRef();
	const GridUnidadMedida 	 	   = useRef();
	const GridProveedor 		     = useRef();
	const GridLimitePedido 		   = useRef();
	const GridMovimientoStockCab = useRef();
	const GridMovimientoStockDet = useRef();
	const GridPack 				 			 = useRef();
	const GridBloqueoExistencia  = useRef();
	const GridNormaPalet 			   = useRef();
	const GridDireccionFija  	   = useRef();
	const GridCantidadPiking 	   = useRef();
	const GridAcuerdo 			     = useRef();
	const GridLeadTime 			     = useRef();
	
  const idGrid = { 
		ROWS: grid, 
		UNIDAD_MEDIDA: GridUnidadMedida,
		PROVEEDOR: GridProveedor,
		LIMITE_PEDIDO: GridLimitePedido,
		MOVIMIENTO_STOCK_CAB:GridMovimientoStockCab,
		MOVIMIENTO_STOCK_DET:GridMovimientoStockDet,
		PACK: GridPack,
		BLOQUEO_EXISTENCIA: GridBloqueoExistencia,
		NORMA_PALET: GridNormaPalet,
		DIRECCION_FIJA: GridDireccionFija,
		CANTIDAD_PICKING: GridCantidadPiking,
		ACUERDO: GridAcuerdo, 
		LEAD_TIME: GridLeadTime,
		defaultFocus:{
			ROWS:1,
			UNIDAD_MEDIDA:0,
			PROVEEDOR:0,
			LIMITE_PEDIDO:0,
			MOVIMIENTO_STOCK_CAB:0,
			MOVIMIENTO_STOCK_DET:0,
			PACK:0,
			BLOQUEO_EXISTENCIA:0,
			NORMA_PALET:0,
			DIRECCION_FIJA:0,
			CANTIDAD_PICKING:0,
			ACUERDO:0,
			LEAD_TIME:0
		}
	};
    const url_articulo = "/st/starticu/" + sessionStorage.getItem("cod_empresa");
    const url_Buscador = "/st/starticu/search";
    const url_abm 	   = "/st/starticu";

    const [rows			  		, setRows			 		 ] = useState([]);
    const [activarSpinner , setActivarSpinner] = useState(false);
  	const [openDatePicker , setdatePicker	   ] = useState(true);

    //-----------------------Estado Modal mensaje ----------------------------------
  const [showMessageButton , setShowMessageButton] = useState(false)
  const [visibleMensaje	   , setVisibleMensaje   ] = useState(false);
  const [mensaje			 		 , setMensaje		 		   ] = useState();
  const [imagen			 			 , setImagen		  		 ] = useState();
  const [tituloModal		 	 , setTituloModal	   	 ] = useState();

  const initialRow = [
			{ COD_ARTICULO: "COD_ARTICULO" },
	];
	const initialRowUnidadMedida = [
		{ COD_ARTICULO: "COD_ARTICULO" },
		{ IND_BASICO: "N" },
	];
	const initialRowMovimientoDeStockDet = [
		{ COD_ARTICULO: "COD_ARTICULO" },
		{ COD_SUC_REF: "COD_SUC_REF" }
	];

	const [tabKey		  , setTabKey	  ] = useState("1");
	const [tabKeyWMS	, setTabKeyWMS] = useState("71");
	// MODAL
	const [ searchColumns  , setSearchColumns   ] = useState({});
	const [ modalTitle     , setModalTitle      ] = useState('');
  const [ tipoDeBusqueda , setTipoDeBusqueda  ] = useState();
	const [ shows          , setShows           ] = useState(false);

	// REFERENCIA
	const codFamiliaRef 	  = useRef();
	const codMarcaRef 		  = useRef();
	const tipProductoRef 	  = useRef();
	const codOrigenArtRef   = useRef();
	const inscripcionRef 	  = useRef();
	const codCategoriaRef   = useRef();
	const codSegmentoRef 	  = useRef();
	const codGrupoRef 		  = useRef();
	const nroRegistroRef 	  = useRef();
	const codNomenRef 		  = useRef();
	const indRegimenRef 	  = useRef();
	const comentarioRef 	  = useRef();
	const codIvaRef 		  	= useRef();
	const codAlternoRef 	  = useRef();
	const vencimientoRef 	  = useRef();
	const nroOrdenRef 		  = useRef();
	const tipoCompraRef 	  = useRef();
	const indMedCompRef 	  = useRef();
	const indMesRef 		  	= useRef();
	const cantPedRef 		  	= useRef();
	const cantBaseRef 		  = useRef();
	const cantVolumenRef 	  = useRef();
	const codCatAlmRef 		  = useRef();
	const codCatSepRef 		  = useRef();	
	const indManejaStockRef = useRef();
	const verCatastroRef 	  = useRef();

	const grid_Search_modal = useRef();
	useEffect(async () => {
		getData();
		openCancelarComponent();
	}, []);
	// CABECERA
	const getData = async () => {
			setActivarSpinner(true);
			var content = await getInfo(url_articulo, "GET", []);
			setRows(content);		
			setActivarSpinner(false);
			setTimeout(() => {
				if (grid.current !== null) {
						grid.current.instance.focus(
								grid.current.instance.getCellElement(0, 1)
						);
				}
			}, 10);
	};
	// GET GENERICO
	const getInfo = async (url, method, data) => {
			var content = [];
			try {
					var info = await Main.Request(url, method, data);
					if (info.data.rows) {
							content = info.data.rows;
					}
					return content;
			} catch (error) {
					console.log(error);
			}
	};
	const controlaBandera = async() => {
		band_lead_time = true;
		band_unidad_medida = true;
		band_proveedor = true;
		band_limite_predido = true;
		band_movimiento_stock = true;
		band_pack = true;
		band_bloqueo_existencia = true;
		band_norma_palet = true;
		band_direccion_fija = true;
		band_cantidad_picking = true;
		band_acuerdo = true;
	}
	const setRowFocus = async(e) => {
	if(await getFocusGlobalEvent() != undefined ){
		var row = await getFocusGlobalEvent().row.data;
		if( id_cabecera != row.ID ){
			id_cabecera = row.ID;
			controlaBandera();
		}
	}
	if(!e.row.data.inserted){
		SetFormValues(e.row.data);
	}else{
		form.resetFields();
		SetFormValues({
			...e.row.data,
			TIP_PRODUCTO: "CVT",
			COND_COMPRA : "N",
			IND_MES: "N",
			IND_MED_COMP: "N",
			VER_CATASTRO: "N",
			IND_MANEJA_STOCK: "N",
			IND_MANEJA_VTO:"N"
		});
		var row = await getFocusGlobalEvent().row.data;
		row.TIP_PRODUCTO = "CVT";
		row.COND_COMPRA = "N";
		row.IND_MES = "N";
		row.IND_MED_COMP = "N";
		row.VER_CATASTRO = "N";
		row.IND_MANEJA_STOCK = "N";
		row.IND_MANEJA_VTO = "N";
	}

		if(tabKey != "7"){
			manageTabs(tabKey);
		}else{
			manageTabs(tabKeyWMS);
		}
		if(band_lead_time){
			// LEADTIME
			var content = [];
			var info = await Main.Request('/st/starticu/lead_time','POST',{
				cod_empresa: sessionStorage.getItem("cod_empresa"),
				cod_articulo: form.getFieldValue('COD_ARTICULO')
			});
			if(info.data.rows.length == 0){
				var row = await getFocusGlobalEvent().row.data;
				var newKey = uuidID();
				content = [{
					ID	         : newKey,
					COD_ARTICULO : form.getFieldValue('COD_ARTICULO'),
					COD_EMPRESA  : sessionStorage.getItem('cod_empresa'),
					idCabecera   : row.ID,
					InsertDefault : true,
				}]
			}else{
				content = info.data.rows
			}
			const dataSource_LeadTime = new DataSource({
				store: new ArrayStore({
					data: content,
				}),
				key: 'ID'
			})
			GridLeadTime.current.instance.option('dataSource', dataSource_LeadTime);
		}
	};
	const manageTabs = async(value) =>{
		switch (value) {
			case "1":
				if(band_unidad_medida){
					// BUSCAR UNIDAD DE MEDIDA
					var content = [];
					var info = await Main.Request('/st/starticu/unidad_medida','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							IND_BASICO    : "N",
							IND_VENTA     : "N",
							MEN_UN_VTA    : "N",
							idCabecera    : row.ID,
							InsertDefault : true,
							IDCOMPONENTE  : "UNIDAD_MEDIDA",
						}]
					}else{
						content   = info.data.rows;
					}
					setFocusIDComponent(GridUnidadMedida,"UNIDAD_MEDIDA")
					cancelarUnidadMedida = JSON.stringify(content);
					const dataSource_UnidadMedida = new DataSource({
						store: new ArrayStore({
								data: content,
						}),
						key: 'ID'
					})
					GridUnidadMedida.current.instance.option('dataSource', dataSource_UnidadMedida);
					band_unidad_medida = false;
				}else{
					setFocusIDComponent(GridUnidadMedida,"UNIDAD_MEDIDA")
					setColumnRequerido(columns_UnidadMedida)
				}
				break;
			case "2":
				if(band_proveedor){
					// BUSCAR PROVEEDOR
					var content = [];
					var info = await Main.Request('/st/starticu/proveedor','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	         : newKey,
							COD_ARTICULO : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA  : sessionStorage.getItem('cod_empresa'),
							idCabecera   : row.ID,
							InsertDefault: true,
							IDCOMPONENTE  : "PROVEEDOR",
						}]
					}else{
						content = info.data.rows
					}
					setFocusIDComponent(GridProveedor,"PROVEEDOR")
					cancelarProveedor = JSON.stringify(content);
					const dataSource_Proveedor = new DataSource({
						store: new ArrayStore({
							data: content,
						}),
						key: 'ID'
					})
					GridProveedor.current.instance.option('dataSource', dataSource_Proveedor);
					band_proveedor = false;
				}else{
					setFocusIDComponent(GridProveedor,"PROVEEDOR")
					setColumnRequerido(columns_Proveedor)
				}
			break;
			case "3":
				if(band_limite_predido){
					// BUSCAR LIMITE POR PEDIDO
					var content = [];
					var info = await Main.Request('/st/starticu/limite_pedido','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : row.ID,
							InsertDefault : true,
							IDCOMPONENTE  : "LIMITE_PEDIDO",
						}]
					}else{
						content = info.data.rows				
					}
					setFocusIDComponent(GridLimitePedido,"LIMITE_PEDIDO")
					cancelarLimitePorPedido = JSON.stringify(content);
					const dataSource_LimitePedido = new DataSource({
						store: new ArrayStore({
							data: content,
						}),
						key: 'ID'
					})
					GridLimitePedido.current.instance.option('dataSource', dataSource_LimitePedido);
					band_limite_predido = false;
				}else{
					setFocusIDComponent(GridLimitePedido,"LIMITE_PEDIDO")
					setColumnRequerido(columns_LimitePedido)
				}
				break;
			case "4":
				if(band_movimiento_stock){
					var content = [];
					var info = await Main.Request('/st/starticu/movimiento_stock_cab','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : row.ID,
							InsertDefault : true,
							IDCOMPONENTE  : "MOVIMIENTO_STOCK_CAB",
						}]
					}else{
						content = info.data.rows
					}
					setFocusIDComponent(GridMovimientoStockCab,"MOVIMIENTO_STOCK_CAB")
					cancelarMovimientoStockCab = JSON.stringify(content);
					const dataSource_MovimientoStockCab = new DataSource({
						store: new ArrayStore({
							data: content,
						}),
						key: 'ID'
					})
					GridMovimientoStockCab.current.instance.option('dataSource', dataSource_MovimientoStockCab);
					setTimeout(()=>{
						GridMovimientoStockCab.current.instance.option('focusedRowIndex', 0);
					},1)
					band_movimiento_stock = false;
				}else{
					setFocusIDComponent(GridMovimientoStockCab,"MOVIMIENTO_STOCK_CAB")
					setColumnRequerido(columns_MovimientoStockCab)
				}
				break;
			case "5":
				if(band_pack){
					// BUSCAR PACK
					var content = [];
					var info = await Main.Request('/st/starticu/pack','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	         : newKey,
							COD_ARTICULO : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA  : sessionStorage.getItem('cod_empresa'),
							idCabecera   : row.ID,
							InsertDefault: true,
							IDCOMPONENTE : "PACK",
						}]
					}else{
						content = info.data.rows
					}
					setFocusIDComponent(GridPack,"PACK")
					cancelarPack = JSON.stringify(content);
					const dataSource_Pack = new DataSource({
						store: new ArrayStore({
								data: content,
						}),
						key: 'ID'
					})
					GridPack.current.instance.option('dataSource', dataSource_Pack);
					band_pack = false;
				}else{
					setFocusIDComponent(GridPack,"PACK")
					setColumnRequerido(columns_Pack)
				}
				break;
			case "6":
				if(band_bloqueo_existencia){
					// BUSCAR BLOQUEO DE EXISTENCIA
					var content = [];
					var info = await Main.Request('/st/starticu/bloqueo_existencia','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	         : newKey,
							COD_ARTICULO : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA  : sessionStorage.getItem('cod_empresa'),
							idCabecera   : row.ID,
							InsertDefault: true,
							IDCOMPONENTE : "BLOQUEO_EXISTENCIA",
						}]
					}else{
						content = info.data.rows
					}
					setFocusIDComponent(GridBloqueoExistencia,"BLOQUEO_EXISTENCIA")
					cancelarBloqueoExistencia = JSON.stringify(content)
					const dataSource_BloqueoExistencia = new DataSource({
						store: new ArrayStore({
							data: content,
						}),
						key: 'ID'
					})
					GridBloqueoExistencia.current.instance.option('dataSource', dataSource_BloqueoExistencia);
					band_bloqueo_existencia= false;
				}else{
					setFocusIDComponent(GridBloqueoExistencia,"BLOQUEO_EXISTENCIA")
					setColumnRequerido(columns_BloqueoExistencia)
				}
				break;
			case "7":
				if(band_norma_palet ){
					// BUSCAR NORMA PALET
					var content = [];
					var info = await Main.Request('/st/starticu/norma_palet','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [ {
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : row.ID,
							InsertDefault : true,
							IDCOMPONENTE  : "NORMA_PALET",
						}]
					}else{
						content = info.data.rows				
					}
					setFocusIDComponent(GridNormaPalet,"NORMA_PALET")
					cancelarNormaPalet = JSON.stringify(content)
					const dataSource_NormaPalet= new DataSource({
						store: new ArrayStore({
							data: content,
						}),
						key: 'ID'
					})
					GridNormaPalet.current.instance.option('dataSource', dataSource_NormaPalet);
					band_norma_palet = false;
				}else{
					setFocusIDComponent(GridNormaPalet,"NORMA_PALET")
					setColumnRequerido(columns_NormaPalet)
				}
				break;
			case "71":
				if(band_norma_palet ){
					// BUSCAR NORMA PALET
					var content = [];
					var info = await Main.Request('/st/starticu/norma_palet','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [ {
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : row.ID,
							InsertDefault : true,
							IDCOMPONENTE  : "NORMA_PALET",
						}]
					}else{
						content = info.data.rows				
					}
					setFocusIDComponent(GridNormaPalet,"NORMA_PALET")
					cancelarNormaPalet = JSON.stringify(content)
					const dataSource_NormaPalet= new DataSource({
						store: new ArrayStore({
							data: content,
						}),
						key: 'ID'
					})
					GridNormaPalet.current.instance.option('dataSource', dataSource_NormaPalet);
					band_norma_palet = false;
				}else{
					setFocusIDComponent(GridNormaPalet,"NORMA_PALET")
					setColumnRequerido(columns_NormaPalet)
				}
				break;
			case "72":
				if(band_direccion_fija){
					// BUSCAR DIRECCION FIJA
					var content = [];
					var info = await Main.Request('/st/starticu/direccion_fija','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : row.ID,
							InsertDefault : true,
							IDCOMPONENTE  : "DIRECCION_FIJA",
						}]
					}else{
						content = info.data.rows
					}
					setFocusIDComponent(GridDireccionFija,"DIRECCION_FIJA")
					cancelarDireccionFija = JSON.stringify(content)
					const dataSource_DireccionFija = new DataSource({
						store: new ArrayStore({
							data: content,
						}),
						key: 'ID'
					})
					GridDireccionFija.current.instance.option('dataSource', dataSource_DireccionFija );
					band_direccion_fija = false;
				}else{
					setFocusIDComponent(GridDireccionFija,"DIRECCION_FIJA")
					setColumnRequerido(columns_DireccionFija)
				}			
				break;
			case "73":
				 if(band_cantidad_picking){
					// BUSCAR CANTIDAD PICKING
					var content = [];
					var info = await Main.Request('/st/starticu/cantidad_picking','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : row.ID,
							InsertDefault : true,
							IDCOMPONENTE  : "CANTIDAD_PICKING",
						}]
					}else{
						content = info.data.rows
					}
					setFocusIDComponent(GridCantidadPiking,"CANTIDAD_PICKING")
					cancelarCantidadPicking = JSON.stringify(content)
					const dataSource_CantidadPicking = new DataSource({
						store: new ArrayStore({
								data: content,
						}),
						key: 'ID'
					})
					GridCantidadPiking.current.instance.option('dataSource', dataSource_CantidadPicking );
					band_cantidad_picking = false;
				}else{
					setFocusIDComponent(GridCantidadPiking,"CANTIDAD_PICKING")
					setColumnRequerido(columns_CantidadPicking)
				}
				break;
			case "74":
				if(band_acuerdo){
					// BUSCAR ACUERDO
					var content = [];
					var info = await Main.Request('/st/starticu/acuerdo','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var row = await getFocusGlobalEvent().row.data;
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : row.ID,
							TIPO		  : 'M',
							FEC_VIGENCIA  : Main.moment(),
							InsertDefault : true,
							IDCOMPONENTE  : "ACUERDO",
						}]
					}else{
						content = info.data.rows
						setFocusIDComponent(GridCantidadPiking,"ACUERDO")
					}
					setFocusIDComponent(GridAcuerdo,"ACUERDO")
					cancelarAcuerdo = JSON.stringify(content);
					const dataSource_Acuerdo = new DataSource({
						store: new ArrayStore({
								data: content,
								IDCOMPONENTE: "ACUERDO",
						}),
						key: 'ID'
					})
					GridAcuerdo.current.instance.option('dataSource', dataSource_Acuerdo );
					band_acuerdo = false;
				}else{
					setFocusIDComponent(GridAcuerdo,"ACUERDO")
					setColumnRequerido(columns_Acuerdo)
				}
				break;
			default:
				break;
		}
	}
	const openCancelarComponent = async (fila) => {
    	var indexfila = getFocusedRowIndex();
		setGlobalValidateDet(true);
		
    	var AuxDataCancelCab;
		if(getcancelarCab()){
			AuxDataCancelCab = await JSON.parse(getcancelarCab());
			setRows(AuxDataCancelCab);
		}
   
		//FormInput
		if(getCancelarFormInput()){
			var AuxDataCancelarFormInput = await JSON.parse(getCancelarFormInput());
			cancelarFormInput = JSON.stringify(AuxDataCancelarFormInput)
		}

		// Unidad de Medida
		if(getCancelarUnidadMedida()){
			var AuxDataCancelUnidadMedida = await JSON.parse(await getCancelarUnidadMedida());

			if(AuxDataCancelUnidadMedida.length > 0){
				const dataSource_UnidadMedida = new DataSource({
					store: new ArrayStore({
						  keyExpr:"ID",
						  data: AuxDataCancelUnidadMedida
					}),
					key: 'ID'
				})
				GridUnidadMedida.current.instance.option('dataSource', dataSource_UnidadMedida);
					cancelarUnidadMedida = JSON.stringify(AuxDataCancelUnidadMedida);	
			}
		}

		// Proveedor
		if(getCancelarProveedor()){
			var AuxDataCancelProveedor  = await JSON.parse(await getCancelarProveedor());
			if(AuxDataCancelProveedor.length > 0){
				const dataSource_Proveedor = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelProveedor
					}),
					key: 'ID'
				})
				GridProveedor.current.instance.option('dataSource', dataSource_Proveedor);
				cancelarProveedor = JSON.stringify(AuxDataCancelProveedor);
			}
		}

		//Limite por Pedido
		if(getCancelarLimitePorPedido()){
			var AuxDataCancelLimitePorPedido  = await JSON.parse(await getCancelarLimitePorPedido());
			if(AuxDataCancelLimitePorPedido.length > 0){
				const dataSource_limitePorPedido = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelLimitePorPedido
					}),
					key: 'ID'
				})
				GridLimitePedido.current.instance.option('dataSource', dataSource_limitePorPedido);
				cancelarLimitePorPedido = JSON.stringify(AuxDataCancelLimitePorPedido);
			}
		}

		//Movimiento de Stock Cab
		if(getCancelarMovimientoStockCab()){
			var AuxDataCancelMovimientoStockCab  = await JSON.parse(await getCancelarMovimientoStockCab());
			if(AuxDataCancelMovimientoStockCab.length > 0){
				const dataSource_movimiento_stock_cab = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelMovimientoStockCab
					}),
					key: 'ID'
				})
				GridMovimientoStockCab.current.instance.option('dataSource', dataSource_movimiento_stock_cab);
				cancelarMovimientoStockCab = JSON.stringify(AuxDataCancelMovimientoStockCab);
			}
		}

		//Movimiento de Stock Det
		if(getCancelarMovimientoStockDet()){
			var AuxDataCancelMovimientoStockDet  = await JSON.parse(await getCancelarMovimientoStockDet());
			if(AuxDataCancelMovimientoStockDet.length > 0){
				const dataSource_movimiento_stock_det = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelMovimientoStockDet
					}),
					key: 'ID'
				})
				GridMovimientoStockDet.current.instance.option('dataSource', dataSource_movimiento_stock_det);
				cancelarMovimientoStockDet = JSON.stringify(AuxDataCancelMovimientoStockDet);
			}
		}

		//Pack
		if(getCancelarPack()){
			var AuxDataCancelPack  = await JSON.parse(await getCancelarPack());
			if(AuxDataCancelPack.length > 0){
				const dataSource_Pack = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelPack
					}),
					key: 'ID'
				})
				GridPack.current.instance.option('dataSource', dataSource_Pack);
				cancelarPack = JSON.stringify(AuxDataCancelPack);
			}
		}

		//Bloqueo de Existencia
		if(getCancelarBloqueoExistencia()){
			var AuxDataCancelBloqueoExistencia  = await JSON.parse(await getCancelarBloqueoExistencia());
			if(AuxDataCancelBloqueoExistencia.length > 0){
				const dataSource_BloqueoExistencia = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelBloqueoExistencia
					}),
					key: 'ID'
				})
				GridBloqueoExistencia.current.instance.option('dataSource', dataSource_BloqueoExistencia);
				cancelarBloqueoExistencia = JSON.stringify(AuxDataCancelBloqueoExistencia);
			}
		}

		//Norma Palet
		if(getCancelarNormaPalet()){
			var AuxDataCancelNormalPalet  = await JSON.parse(await getCancelarNormaPalet());
			if(AuxDataCancelNormalPalet.length > 0){
				const dataSource_NormaPalet = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelNormalPalet
					}),
					key: 'ID'
				})
				GridNormaPalet.current.instance.option('dataSource', dataSource_NormaPalet);
				cancelarNormaPalet = JSON.stringify(AuxDataCancelNormalPalet);
			}
		}

		//Direccion Fija
		if(getCancelarDireccionFija()){
			var AuxDataCancelDireccionFija  = await JSON.parse(await getCancelarDireccionFija());
			if(AuxDataCancelDireccionFija.length > 0){
				const dataSource_DireccionFija = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelDireccionFija
					}),
					key: 'ID'
				})
				GridDireccionFija.current.instance.option('dataSource', dataSource_DireccionFija);
				cancelarDireccionFija = JSON.stringify(AuxDataCancelDireccionFija);
			}
		}

		// Cantidad Picking	
		if(getCancelarCantidadPicking()){
			var AuxDataCancelarCantidadPicking  = await JSON.parse(await getCancelarCantidadPicking());
			if(AuxDataCancelarCantidadPicking.length > 0){
				const dataSource_cantidadPikinga = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelarCantidadPicking
					}),
					key: 'ID'
				})
				GridCantidadPiking.current.instance.option('dataSource', dataSource_cantidadPikinga);
				cancelarCantidadPicking = JSON.stringify(AuxDataCancelarCantidadPicking);
			}
		}

		// Acuerdo
		if(getCancelarAcuerdo()){
			var AuxDataCancelarAcuerdo  = await JSON.parse(await getCancelarAcuerdo());
			if(AuxDataCancelarAcuerdo.length > 0){
				const dataSource_Acuerdo = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelarAcuerdo
					}),
					key: 'ID'
				})
				GridAcuerdo.current.instance.option('dataSource', dataSource_Acuerdo);
				cancelarAcuerdo = JSON.stringify(AuxDataCancelarAcuerdo);
			}
		}

        grid.current.instance.state(null)
        grid.current.instance.refresh(true);
        grid.current.instance.cancel = true
        grid.current.instance.cancelEditData();
		removeIdComponentUpdate();
		limpiarBandComponet()
        setActivarSpinner(true)
        getEstablecerOperaciones();
		setBloqueoCabecera(false);
        if(_.isNumber(fila)) indexfila = fila
        setTimeout(()=>{
			if(AuxDataCancelCab){
				grid.current.instance.focus(grid.current.instance.getCellElement(indexfila,1));
				SetFormValues(AuxDataCancelCab[indexfila]);
			}
			setModifico();
			setActivarSpinner(false);
			if(getBloqueoCabecera())setBloqueoCabecera(false)
        },4);
	};
	const guardar = async () => {
	var info = [];

	// CABECERA
	var ArticuloData = grid.current.instance.getDataSource();
	ArticuloData	 = ArticuloData._items.filter( item => (item.inserted || item.updated) );

	// UNIDAD DE MEDIDA
	var UnidadMedidaData = []
	if(GridUnidadMedida.current !== undefined) UnidadMedidaData = GridUnidadMedida.current.instance.getDataSource()?._items;
	
	var band = false
	for (let index = 0; index < ArticuloData.length; index++) {
		const element = ArticuloData[index];
		if(band) break
		if(element.inserted == true){
			for (let i = 0; i < UnidadMedidaData.length; i++) {
				const items = UnidadMedidaData[i];
				if(items.InsertDefault || items.inserted){
					items.InsertDefault = false;
					items.inserted 			= true;
					band = true;
					break
				}
			}
		}
		
	}

	// PROVEEDOR
	var ProveedorData = []
	if(GridProveedor.current !== undefined) ProveedorData = GridProveedor.current.instance.getDataSource()._items;
			
	//LIMITE POR PEDIDO
	var LimitePorPedidoData = [];
	if(GridLimitePedido.current != undefined) LimitePorPedidoData = GridLimitePedido.current.instance.getDataSource()._items;

	// MOVIMIENTO DE STOCK CAB
	var MovimientoStockCabData = [];
	if(GridMovimientoStockCab.current != undefined) MovimientoStockCabData = GridMovimientoStockCab.current.instance.getDataSource()._items;

	// MOVIMIENTO DE STOCK DET
	var MovimientoStockDetData = [];
	if(GridMovimientoStockDet.current != undefined) MovimientoStockDetData = GridMovimientoStockDet.current.instance.getDataSource()._items;

	//PACK
	var PackData = []
	if(GridPack.current !== undefined) PackData = GridPack.current.instance.getDataSource()._items;
	
	//BLOQUEO DE EXISTENCIA
	var BloqueoDeExistenciaData = []
	if(GridBloqueoExistencia.current != undefined) BloqueoDeExistenciaData = GridBloqueoExistencia.current.instance.getDataSource()._items;

	


	// NORMAL PALET
	var NormaPaletData = []
	if(GridNormaPalet.current !== undefined) NormaPaletData = GridNormaPalet.current.instance.getDataSource()._items;
	
	// DIRECCION FIJA
	var DireccionFijaData = []
	if(GridDireccionFija.current != undefined) DireccionFijaData = GridDireccionFija.current.instance.getDataSource()._items;
	
	// CANTIDAD PIKING
	var CantidadPikingData = []
	if(GridCantidadPiking.current != undefined) CantidadPikingData = GridCantidadPiking.current.instance.getDataSource()._items;
	
	// ACUERDO
	var AcuerdoData = [];
	if(GridAcuerdo.current !== undefined) AcuerdoData = GridAcuerdo.current.instance.getDataSource()._items;

	// LEADTIME 
	var LeadTimeData = [];
	if(GridLeadTime.current !== undefined) LeadTimeData = GridLeadTime.current.instance.getDataSource()._items;
	
	// VALIDADOR
	var datosValidar = {
		id:[{ 
			ROWS:grid, 
			UNIDAD_MEDIDA:GridUnidadMedida,
			PROVEEDOR:GridProveedor,
			LIMITE_PEDIDO: GridLimitePedido, 
			PACK: GridPack,
			BLOQUEO_EXISTENCIA: GridBloqueoExistencia,
			//
			NORMA_PALET: GridNormaPalet,
			DIRECCION_FIJA: GridDireccionFija,
			CANTIDAD_PICKING: GridCantidadPiking,
			ACUERDO: GridAcuerdo
		}],
		column:[{ 
			ROWS:columns, 
			UNIDAD_MEDIDA:columns_UnidadMedida,
			PROVEEDOR:columns_Proveedor,
			LIMITE_PEDIDO: columns_LimitePedido,					
			PACK: columns_Pack,
			BLOQUEO_EXISTENCIA: columns_BloqueoExistencia,
			//
			NORMA_PALET: columns_NormaPalet,
			DIRECCION_FIJA: columns_DireccionFija,
			CANTIDAD_PICKING: columns_CantidadPicking,
			ACUERDO: columns_Acuerdo, 
		}],
		datos:[{ 
			ROWS:ArticuloData, 
			UNIDAD_MEDIDA:UnidadMedidaData,
			PROVEEDOR:ProveedorData,
			LIMITE_PEDIDO:LimitePorPedidoData,
			PACK: PackData,
			BLOQUEO_EXISTENCIA: BloqueoDeExistenciaData,
			//
			NORMA_PALET: NormaPaletData,
			DIRECCION_FIJA: DireccionFijaData,
			CANTIDAD_PICKING: CantidadPikingData,
			ACUERDO: AcuerdoData, 
		}]
	}

	const valor = await ValidarColumnasRequeridas(datosValidar);
	if(valor) return;

	// ARTICULO
	info = await Main.GeneraUpdateInsertCab(rows, 'COD_ARTICULO', url_cod_articulo);
	var aux_articulo = info.rowsAux;
	var update_insert_articulo = info.updateInsert;
	var delete_articulo = ArrayPushDelete.ROWS != undefined ? ArrayPushDelete.ROWS : [] ;
	
// UNIDAD DE MEDIDA
	var unidad_medida = UnidadMedidaData
	var dependencia_unidad_medida = [{
		'COD_UNIDAD_REL': 'COD_UNIDAD_REL_ANT'
	}];
	info = await Main.GeneraUpdateInsertDet(unidad_medida,['COD_UNIDAD_REL'], update_insert_articulo, dependencia_unidad_medida,"COD_ARTICULO");
	var aux_unidad_medida  = info.rowsAux;
	var update_insert_unidad_medida = info.updateInsert;
	var delete_unidad_medida = ArrayPushDelete.UNIDAD_MEDIDA != undefined ? ArrayPushDelete.UNIDAD_MEDIDA : [];
 
	// PROVEEDOR
	var proveedor = ProveedorData
	var dependencia_proveedor = [{
		'COD_PROVEEDOR': 'COD_PROVEEDOR_ANT'
	}];
	info = await Main.GeneraUpdateInsertDet(proveedor,['COD_PROVEEDOR'], update_insert_articulo, dependencia_proveedor,"COD_ARTICULO");
	var aux_proveedor = info.rowsAux;
	var update_insert_proveedor = info.updateInsert;
	var delete_proveedor = ArrayPushDelete.PROVEEDOR != undefined ? ArrayPushDelete.PROVEEDOR : [];

	//LIMITE POR PEDIDO
	var limite_pedido = LimitePorPedidoData
	var dependencia_limite_pedido = [];
	info = await Main.GeneraUpdateInsertDet(limite_pedido,['COD_DEPOSITO'], update_insert_articulo, dependencia_limite_pedido,"COD_ARTICULO");
	var aux_limite_pedido = info.rowsAux;
	var update_insert_limite_pedido = info.updateInsert;
	var delete_limite_pedido = ArrayPushDelete.LIMITE_PEDIDO != undefined ? ArrayPushDelete.LIMITE_PEDIDO : [];

	//MOVIMIENTO DE STOCK CABECERA
	var movimiento_stock_cab = MovimientoStockCabData
	var dependencia_movimiento_stock_cab = [{
		'COD_SUCURSAL': 'COD_SUCURSAL_ANT'
	}];
	info = await Main.GeneraUpdateInsertDet(movimiento_stock_cab,['COD_SUCURSAL'],update_insert_articulo, dependencia_movimiento_stock_cab,"COD_ARTICULO");
	var aux_movimiento_stock_cab = info.rowsAux;
	var update_insert_movimiento_stock_cab = info.updateInsert;
	var delete_movimiento_stock_cab = ArrayPushDelete.MOVIMIENTO_STOCK_CAB != undefined ? ArrayPushDelete.MOVIMIENTO_STOCK_CAB : [];
	
	//MOVIMIENTO DE STOCK DETALLE
	var movimiento_stock_det = MovimientoStockDetData
	var dependencia_movimiento_stock_det = [
		{'COD_SUCURSAL': 'COD_SUCURSAL_ANT'},
		{'COD_SUC_REF' : 'COD_SUC_REF_ANT'}
	];
	info = await Main.GeneraUpdateInsertDet(movimiento_stock_det,['COD_SUCURSAL'],update_insert_articulo, dependencia_movimiento_stock_det,"COD_ARTICULO");
	var aux_movimiento_stock_det = info.rowsAux;
	var update_insert_movimiento_stock_det = info.updateInsert;
	var delete_movimiento_stock_det = ArrayPushDelete.MOVIMIENTO_STOCK_DET != undefined ? ArrayPushDelete.MOVIMIENTO_STOCK_DET : [];

	//PACK
	var pack = PackData
	var dependencia_pack = [
		{'COD_ARTICULO_REF': 'COD_ARTICULO_REF_ANT'}
	];
	info = await Main.GeneraUpdateInsertDet(pack,['COD_ARTICULO_REF'],update_insert_articulo, dependencia_pack,"COD_ARTICULO");
	var aux_pack = info.rowsAux;
	var update_insert_pack = info.updateInsert;
	var delete_pack = ArrayPushDelete.PACK != undefined ? ArrayPushDelete.PACK : [];

	//BLOQUEO DE EXISTENCIA
	var bloqueo_existencia = BloqueoDeExistenciaData
	var dependencia_bloqueo_existencia = [];
	info = await Main.GeneraUpdateInsertDet(bloqueo_existencia,['COD_DEPOSITO'],update_insert_articulo, dependencia_bloqueo_existencia,"COD_ARTICULO");

	console.log(info);

	var aux_bloqueo_existencia = info.rowsAux;
	var update_insert_bloqueo_existencia = info.updateInsert;
	var delete_bloqueo_existencia = ArrayPushDelete.BLOQUEO_EXISTENCIA != undefined ? ArrayPushDelete.BLOQUEO_EXISTENCIA : [];

	//NORMAL PALET
	var normal_palet = NormaPaletData
	var dependencia_normal_palet = [
		{'COD_SUCURSAL'  : 'COD_SUCURSAL_ANT'  },
		{'COD_UNIDAD_REL': 'COD_UNIDAD_REL_ANT'}
	];
	info = await Main.GeneraUpdateInsertDet(normal_palet,['COD_UNIDAD_REL'],update_insert_articulo, dependencia_normal_palet,"COD_ARTICULO");
	var aux_norma_palet = info.rowsAux;
	var update_insert_norma_palet = info.updateInsert;
			var delete_norma_palet = ArrayPushDelete.NORMA_PALET != undefined ? ArrayPushDelete.NORMA_PALET : [];

	// DIRECCION FIJA
	var direccion_fija = DireccionFijaData
	var dependencia_direccion_fija = [
		{'COD_SUCURSAL' : 'COD_SUCURSAL_ANT' },
		{'COD_DEPOSITO' : 'COD_DEPOSITO_ANT' },
		{'COD_ZONA '    : 'COD_ZONA_ANT'	 },
		{'COD_DIRECCION': 'COD_DIRECCION_ANT'},
	];

	info = await Main.GeneraUpdateInsertDet(direccion_fija,['COD_SUCURSAL'],update_insert_articulo, dependencia_direccion_fija,"COD_ARTICULO");
	var aux_direccion_fija = info.rowsAux;
	var update_insert_direccion_fija = info.updateInsert;
	var delete_direccion_fija        = ArrayPushDelete.DIRECCION_FIJA != undefined ? ArrayPushDelete.DIRECCION_FIJA : [];

	//CANTIDAD PICKING
	var cantidad_picking = CantidadPikingData
		var dependencia_cantidad_picking = [
		{'COD_SUCURSAL'  :'COD_SUCURSAL_ANT'  },
		{'COD_TIPO'      :'COD_TIPO_ANT'      },
		{'COD_UNIDAD_REL':'COD_UNIDAD_REL_ANT'},
	];
			info = await Main.GeneraUpdateInsertDet(cantidad_picking,['COD_TIPO'],update_insert_articulo, dependencia_cantidad_picking,"COD_ARTICULO");
	var aux_cantidad_picking = info.rowsAux;
	var update_insert_cantidad_picking 	= info.updateInsert;
	var delete_cantidad_picking = ArrayPushDelete.CANTIDAD_PICKING != undefined ? ArrayPushDelete.CANTIDAD_PICKING : [];

	//ACUERDO
	var acuerdo = AcuerdoData
	var dependencia_acuerdo = [{
			'COD_UNIDAD_REL': 'COD_UNIDAD_REL_ANT'
		}];
	info = await Main.GeneraUpdateInsertDet(acuerdo,['COD_UNIDAD_REL'],update_insert_articulo, dependencia_acuerdo,"COD_ARTICULO");
	var aux_acuerdo = info.rowsAux;
	var update_insert_acuerdo = info.updateInsert;
	var delete_acuerdo = ArrayPushDelete.ACUERDO != undefined ? ArrayPushDelete.ACUERDO : [];

	//LEADTIME
	var lead_time = LeadTimeData
	var dependencia_lead_time = [];
	info = await Main.GeneraUpdateInsertDet(lead_time,['COD_ARTICULO'],update_insert_articulo, dependencia_lead_time,"COD_ARTICULO");
	var aux_lead_time = info.rowsAux;
	var update_insert_lead_time = info.updateInsert;
	var delete_lead_time = ArrayPushDelete.LEAD_TIME != undefined ? ArrayPushDelete.LEAD_TIME : [];

	// INFO
	var AditionalData = [{"cod_usuario": sessionStorage.getItem('cod_usuario'),"cod_empresa":sessionStorage.getItem('cod_empresa')}];
	if(valor) return
	var data = {
		update_insert_articulo				,
		delete_articulo						,
		update_insert_unidad_medida 		,
		delete_unidad_medida				,
		update_insert_proveedor				,
		delete_proveedor					,
		update_insert_limite_pedido			,
		delete_limite_pedido				,
		update_insert_movimiento_stock_cab 	,
		delete_movimiento_stock_cab			,
		update_insert_movimiento_stock_det	,
		delete_movimiento_stock_det			,
		update_insert_pack					,
		delete_pack							,
		update_insert_bloqueo_existencia	,
		delete_bloqueo_existencia			,
		update_insert_norma_palet			,
		delete_norma_palet					,
		update_insert_direccion_fija		,
		delete_direccion_fija		    	,
		update_insert_cantidad_picking		,
		delete_cantidad_picking				,
		update_insert_acuerdo				,
		delete_acuerdo						,
		update_insert_lead_time             ,
		delete_lead_time                    ,
				AditionalData
			}
	if( update_insert_articulo.length > 0 				|| 
		delete_articulo.length > 0   					||

		update_insert_unidad_medida.length > 0 			||
		delete_unidad_medida.length > 0	 				||

		update_insert_proveedor.length > 0      		||
		delete_proveedor.length > 0						||

		update_insert_limite_pedido.length > 0			||			
		delete_limite_pedido.length > 0					||

		update_insert_movimiento_stock_cab.length > 0	||			
		delete_movimiento_stock_cab.length > 0			||

		update_insert_movimiento_stock_det.length > 0	||			
		delete_movimiento_stock_det.length > 0			||
		
		update_insert_pack.length > 0					||
		delete_pack.length > 0							||

		update_insert_bloqueo_existencia.length > 0		||
		delete_bloqueo_existencia.length > 0			||
		
		update_insert_norma_palet.length > 0  			||
		delete_norma_palet.length > 0  					||

		update_insert_direccion_fija.length > 0 		||
		delete_direccion_fija.length > 0  		    	||

		update_insert_cantidad_picking.length > 0  		||
		delete_cantidad_picking.length > 0  			||

		update_insert_acuerdo.length > 0  				||
		delete_acuerdo.length > 0                       ||

		update_insert_lead_time.length > 0  			||
		delete_lead_time.length > 0  
		){
			setActivarSpinner(true);
			try{
				var method = "POST"
				await Main.Request( url_abm, method, data).then(async(response) => {
					var resp = response.data;
					if(resp.ret == 1){
						Main.message.success({
							content  : `Procesado correctamente!!`,
							className: 'custom-class',
							duration : `${2}`,
							style    : {
							marginTop: '4vh',
							},
						});
						
						limpiarBandComponet();

						// BOTON MODIFICAR
						setModifico();
						// SETEA EL STATE PRINCIPAL
								setRows([]);
						setRows(aux_articulo);
						var dataSource = '';
						
						// SETEA UNIDAD MEDIDA
						if(GridUnidadMedida.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_unidad_medida}), key:'ID'})
							GridUnidadMedida.current.instance.option('dataSource', dataSource);
						}
						// SETEA PROVEEDOR
						if(GridProveedor.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_proveedor}), key: 'ID'})
							GridProveedor.current.instance.option('dataSource', dataSource);
						}
						// SETEA LIMITE POR PEDIDO
						if(GridLimitePedido.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_limite_pedido}), key: 'ID'})
							GridLimitePedido.current.instance.option('dataSource', dataSource);
						}

						//LIMITE POR PEDIDO
						if(GridLimitePedido.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_limite_pedido}), key: 'ID'})
							GridLimitePedido.current.instance.option('dataSource', dataSource);
						}
											
						// MOVIMIENTO DE STOCK CAB
						if(GridMovimientoStockCab.current !== undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_movimiento_stock_cab}), key: 'ID'})
							GridMovimientoStockCab.current.instance.option('dataSource', dataSource);
						}

						// MOVIMIENTO DE STOCK DET
						if(GridMovimientoStockDet.current !== undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_movimiento_stock_det}), key: 'ID'})
							GridMovimientoStockDet.current.instance.option('dataSource', dataSource);
						}
						
						// SETEA PACK
						if(GridPack.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_pack}), key: 'ID'})
							GridPack.current.instance.option('dataSource', dataSource);
						}

						// SETEA BLOQUEO DE EXISTENCIA
						if(GridBloqueoExistencia.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_bloqueo_existencia}), key: 'ID'})
							GridBloqueoExistencia.current.instance.option('dataSource', dataSource);
						}

						// SETEA NORMA PALET
						if(GridNormaPalet.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_norma_palet}), key: 'ID'})
							GridNormaPalet.current.instance.option('dataSource', dataSource);
						}

						// SETEA DIRECCION FIJA
						if(GridDireccionFija.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_direccion_fija}), key: 'ID'})
							GridDireccionFija.current.instance.option('dataSource', dataSource);
						}

						// SETEA CANTIDAD PICKING
						if(GridCantidadPiking.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_cantidad_picking}), key: 'ID'})
							GridCantidadPiking.current.instance.option('dataSource', dataSource);
						}

						// SETEA ACUERDO
						if(GridAcuerdo.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_acuerdo}), key: 'ID'})
							GridAcuerdo.current.instance.option('dataSource', dataSource);
						}

						// SETEA LEAD TIME
						if(GridLeadTime.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_lead_time}), key: 'ID'})
							GridLeadTime.current.instance.option('dataSource', dataSource);
						}
						limpiarArrayDelete();

						setcancelarCab(JSON.stringify(aux_articulo));
						cancelarUnidadMedida = JSON.stringify(aux_unidad_medida);
						cancelarProveedor = JSON.stringify(aux_proveedor);
						cancelarLimitePorPedido = JSON.stringify(aux_limite_pedido);
						cancelarMovimientoStockCab = JSON.stringify(aux_movimiento_stock_cab);
						cancelarMovimientoStockDet = JSON.stringify(aux_movimiento_stock_det);
						cancelarPack = JSON.stringify(aux_pack);
						cancelarNormaPalet = JSON.stringify(aux_norma_palet);
						cancelarDireccionFija = JSON.stringify(aux_direccion_fija);
						cancelarCantidadPicking = JSON.stringify(aux_cantidad_picking);
						cancelarAcuerdo = JSON.stringify(aux_acuerdo);
					
						var fila = await getFocusedRowIndex();
						if(fila == -1){
							fila = 0;
						}
						getEstablecerOperaciones();
						removeIdComponentUpdate();
						setBloqueoCabecera(false);
						setTimeout(()=>{
							grid.current.instance.focus(grid.current.instance.getCellElement( fila, columns[ColumnDefaultPosition]["ID"]));
						},12)
						grid.current.instance.saveEditData();
						grid.current.instance.refresh(true);
					}else{
						showModalMensaje('ERROR!','error', resp.p_mensaje);
					}
				})
			} catch (error) {
				console.log("Error en la funcion de Guardar!",error);
			}finally{
				setActivarSpinner(false);
			}
		}else{
		setModifico();
		setBloqueoCabecera(false)
				Main.message.info({
					content  : `No encontramos cambios para guardar`,
					className: 'custom-class',
					duration : `${2}`,
					style    : {
						marginTop: '2vh',
					},
				});
			}
	};
	const showModalMensaje = (titulo, imagen, mensaje) => {
			setTituloModal(titulo);
			setImagen(imagen);
			setMensaje(mensaje);
			setVisibleMensaje(true);
	};
	const SetFormValues = (data) => {
		var fecha = '';
		if(data.INSCRIPCION !== null && data.INSCRIPCION !== undefined){
			let result = moment(data.INSCRIPCION, 'DD/MM/YY',true).isValid();
			if(result){
				fecha = moment(data.INSCRIPCION,'DD/MM/YYYY').format('DD/MM/YYYY')
			}else{
				fecha = moment(data.INSCRIPCION,'DD/MM/YYYY')
			}
		}else{
			fecha = moment();
		};

		form.setFieldsValue({
			...data,
			["ESTADO"]: data.ESTADO == "A" ? true : false,
			["IND_MANEJA_STOCK"]: data.IND_MANEJA_STOCK == "S" ? true : false,
			["IND_MANEJA_VTO"]: data.IND_MANEJA_VTO == "S" ? true : false,
			["IND_COND_VTA"]: data.IND_COND_VTA == "S" ? true : false,
			["IND_INPASA"]: data.IND_INPASA == "S" ? true : false,
			["IND_ESPECIAL"]: data.IND_ESPECIAL == "S" ? true : false,
			["IND_JNJ"]: data.IND_JNJ == "S" ? true : false,
			["ART_ADICIONAL"]: data.ART_ADICIONAL == "S" ? true : false,
			["IND_REGIMEN"]: data.IND_REGIMEN == "S" ? true : false,
			["VER_CATASTRO"]: data.VER_CATASTRO == "S" ? true : false,
			["INSCRIPCION"]: moment(fecha, 'DD/MM/YYYY'),
			["COSTO_ULTIMO_GS"]: data.COSTO_ULTIMO_GS != undefined ? new Intl.NumberFormat("de-DE").format(data.COSTO_ULTIMO_GS.toFixed(0)) : 0,
			["COSTO_PROM_GS"]: data.COSTO_PROM_GS != undefined ? new Intl.NumberFormat("de-DE").format(data.COSTO_PROM_GS.toFixed(0)) : 0,
			["FEC_ALTA"]: data.FEC_ALTA != null || data.FEC_ALTA != undefined ? moment(data.FEC_ALTA).format('DD/MM/YYYY H:mm:ss') : "",
			["FEC_MODI"]: data.FEC_MODI != null || data.FEC_MODI != undefined ? moment(data.FEC_MODI).format('DD/MM/YYYY H:mm:ss') : "",
		});

		cod_marca_ant = data.COD_MARCA;
		cod_linea_ant = data.COD_LINEA;

		cancelarFormInput = JSON.stringify(data);
	}
	const saveKeydown =() =>{
		var infoPermiso = Main.VerificaPermiso(FormName);
		var operaciones = getTipoDeOperaciones()
		var band 	= true;
		var mensaje = ''

		if(operaciones[0] || insert){
		  if(infoPermiso[0].insertar != 'S'){
			band = false;
			mensaje = 'No tienes permiso para insertar'
		  }
		}
		if(operaciones[1] || update){
		  if(infoPermiso[0].actualizar != 'S'){
			band = false;
			mensaje = 'No tienes permiso para actualizar'
		  }
		}
		if(operaciones[2]){
		  if(infoPermiso[0].borrar != 'S'){
			band = false;
			mensaje = 'No tienes permiso para eliminar'
		  }
		}
		if(band){
		   validateSave(guardar);
		}else{
		  Main.message.warning({
			content  : mensaje,
			className: 'custom-class',
			duration : `${2}`,
			style    : {
			marginTop: '4vh',
			},
		  });
		}
		return;
	}
	const handleKeydown = async (e) => {

		if(e.keyCode == 121){
			e.preventDefault();
			saveKeydown();
			return
		}

		setVerificaKeydown({
			state: true,
			e: e
		})
		if(e.which === 13 || e.which === 9){
			setVerificaKeydown({
				state: false,
				e: ''
			})
			var row = await getFocusGlobalEvent().row.data; 
			var valor = e.target.value;
			e.preventDefault();
			switch(e.target.id){
				case "COD_FAMILIA":
					if(valor.trim().length == 0){
						showModalMensaje('¡Atención!','alerta',"Favor ingresar un valor");
						form.setFieldsValue({
							...form.getFieldsValue(),
							["DESC_FAMILIA"]: ""
						});
					}else{
						valida(
							showModalMensaje,
							url_valida_familia,
							e.target.id,
							"DESC_FAMILIA",
							e.target.value,
							codMarcaRef.current,
							"p_desc_familia",
							{
								cod_empresa: sessionStorage.getItem("cod_empresa"),
								cod_rubro: row.COD_RUBRO, //form.getFieldValue('COD_RUBRO'),
								[e.target.id]:e.target.value
							},
							codFamiliaRef.current
						)
					}
					break;
				case "COD_MARCA":
					if(valor.trim().length == 0){
						showModalMensaje('¡Atención!','alerta',"Favor ingresar un valor");
						form.setFieldsValue({
							...form.getFieldsValue(),
							["DESC_MARCA"]: "",
							["COD_LINEA"]: "",
							["DESC_LINEA"]: "",
							["COD_CATEGORIA"]: "",
							["DESC_CATEGORIA"]: "",
						});
						row.DESC_MARCA = '';
						row.COD_LINEA = '';
						row.DESC_LINEA = '';
						row.COD_CATEGORIA = '';
						row.DESC_CATEGORIA = '';
					}else{
						if(valor.trim() != cod_marca_ant){
							valida(
								showModalMensaje,
								url_valida_marca,
								e.target.id,
								"DESC_MARCA",
								e.target.value,
								tipProductoRef.current,
								"p_desc_marca",
								{
									cod_empresa: sessionStorage.getItem("cod_empresa"),
									[e.target.id]:e.target.value
								},
								codMarcaRef.current
							)
							form.setFieldsValue({
								...form.getFieldsValue(),
								["COD_LINEA"]: "",
								["DESC_LINEA"]: "",
								["COD_CATEGORIA"]: "",
								["DESC_CATEGORIA"]: "",
							});
							row.COD_LINEA = '';
							row.DESC_LINEA = '';
							row.COD_CATEGORIA = '';
							row.DESC_CATEGORIA = '';
						}else{
							tipProductoRef.current.focus();
						}
					}
					break;
				case "COD_ORIGEN_ART":
					var valor = e.target.value;
					if(valor.trim().length == 0){
						nroRegistroRef.current.focus();
						form.setFieldsValue({
							...form.getFieldsValue(),
							['DESC_ORIGEN_ART']: '',
						})
						var row = await getFocusGlobalEvent().row.data; 
						row['DESC_ORIGEN_ART'] = '';
					}else{
						valida(
							showModalMensaje,
							url_valida_articulo,
							e.target.id,
							"DESC_ORIGEN_ART",
							e.target.value,
							nroRegistroRef.current,
							"p_desc_articulo",
							{
								cod_empresa: sessionStorage.getItem("cod_empresa"),
								cod_articulo: form.getFieldValue("COD_ARTICULO"),
								[e.target.id]:e.target.value
							},
							codOrigenArtRef.current
						)
					}
					break;
				case "NRO_REGISTRO":
					let res = await document.getElementsByClassName('ant-picker-dropdown');
					res[0].classList.remove(Ocultar_classDataPiker_1);
					res[0].classList.remove(Ocultar_classDataPiker_2);
					setTimeout(()=>{
						e.preventDefault();
						inscripcionRef.current.focus();
					},10);
				
					break;
				case "INSCRIPCION":
					setTimeout(async()=>{
						await codCategoriaRef.current.focus();
					},10);
						break;
				case "COD_NOMEN":
					codSegmentoRef.current.focus()
					break;
				case "COD_LINEA":
					if(valor.trim().length == 0){
						showModalMensaje('¡Atención!','alerta',"Favor ingresar un valor");
						form.setFieldsValue({
							...form.getFieldsValue(),
							["DESC_LINEA"]:'',
							["COD_CATEGORIA"]:'',
							["DESC_CATEGORIA"]:'',
						});
						row.DESC_LINEA = '';
						row.COD_CATEGORIA = '';
						row.DESC_CATEGORIA = '';
					}else{
						if(valor.trim() != cod_linea_ant){
							valida(
								showModalMensaje,
								url_valida_categoria,
								e.target.id,
								"DESC_LINEA",
								e.target.value,
								codNomenRef.current,
								"p_desc_categoria",
								{
									cod_empresa: sessionStorage.getItem("cod_empresa"),
									cod_marca: form.getFieldValue("COD_MARCA"),
									[e.target.id]:e.target.value
								},
								codCategoriaRef.current
							)
							form.setFieldsValue({
								...form.getFieldsValue(),
								["COD_CATEGORIA"]:'',
								["DESC_CATEGORIA"]:'',
							});
							row.COD_CATEGORIA = '';
							row.DESC_CATEGORIA = '';
						}else{
							codNomenRef.current.focus();
						}
					}
					break;
				case "COD_CATEGORIA":
					if(valor.trim().length == 0){
						showModalMensaje('¡Atención!','alerta',"Favor ingresar un valor");
						form.setFieldsValue({
							...form.getFieldsValue(),
							["DESC_CATEGORIA"]: ""
						});
					}else{
						valida(
							showModalMensaje,
							url_valida_segmento,
							e.target.id,
							"DESC_CATEGORIA",
							e.target.value,
							codIvaRef.current,
							"p_desc_segmento",
							{
								cod_empresa: sessionStorage.getItem("cod_empresa"),
								cod_linea: form.getFieldValue("COD_LINEA"),
								[e.target.id]:e.target.value
							},
							codSegmentoRef.current
						)
					}
					break;
				case "COD_IVA":
					var valor = e.target.value;
					if(valor.trim().length == 0){
						showModalMensaje('¡Atención!','alerta',"Favor ingresar un valor");
						// form.setFieldsValue({
						// 	...form.getFieldsValue(),
						// 	["DESC_CATEGORIA"]: ""
						// });
						// codAlternoRef.current.focus();
						form.setFieldsValue({
							...form.getFieldsValue(),
							['DESC_IVA']: '',
						})
						var row = await getFocusGlobalEvent().row.data; 
						row['DESC_IVA'] = '';
					}else
						valida(
							showModalMensaje,
							url_valida_iva,
							e.target.id,
							"DESC_IVA",
							e.target.value,
							codAlternoRef.current,
							"p_desc_iva",
							{
								cod_empresa: sessionStorage.getItem("cod_empresa"),
								[e.target.id]:e.target.value
							},
							codIvaRef.current
						)
						break;
				case "COD_ALTERNO":
					setTimeout( ()=>{
						codGrupoRef.current.focus()
					}, 100);
						break;
				case "COD_GRUPO":
					if(valor.trim().length == 0){
						tipoCompraRef.current.focus();
						form.setFieldsValue({
							...form.getFieldsValue(),
							['DESC_GRUPO']: '',
						})
						setValidaF9({
							state:false,
							posicion:'',
						})
					}else
						valida(
							showModalMensaje,
							url_valida_grupo,
							e.target.id,
							"DESC_GRUPO",
							e.target.value,
							tipoCompraRef.current,
							"p_desc_grupo",
							{
								cod_empresa: sessionStorage.getItem("cod_empresa"),
								[e.target.id]: e.target.value,
							},
							codGrupoRef.current
						)
						break;
				case "COMENTARIO":
					setTimeout( ()=>{
						nroOrdenRef.current.focus();
					}, 100);
						break;
				case "NRO_ORDEN":
					setTimeout( ()=>{
						indMesRef.current.focus()
					}, 100);
						break;
				case "CANT_PED":
					setTimeout( ()=>{
						cantBaseRef.current.focus()
					}, 100);
						break;
				case "CANT_BASE":
					setTimeout( ()=>{
						cantVolumenRef.current.focus()
					}, 100);
						break;
				case "CANT_VOLUMEN":
					setTimeout( ()=>{
						codCatAlmRef.current.focus()
					}, 100);
						break;
				case "COD_CAT_ALM":
					var valor = e.target.value;
						if(valor.trim().length == 0){
							codCatSepRef.current.focus();
							form.setFieldsValue({
								...form.getFieldsValue(),
								['DESC_CAT_ALM']: '',
							})
							var row = await getFocusGlobalEvent().row.data; 
							row['DESC_CAT_ALM'] = '';
						}else
							valida(
								showModalMensaje,
								url_valida_almacenaje, 
								e.target.id,
								"DESC_CAT_ALM",
								e.target.value, 
								codCatSepRef.current,
								"p_desc_cat_alm", 
								{
										cod_empresa: sessionStorage.cod_empresa,
										[e.target.id]:e.target.value
								},
								codCatAlmRef.current
							)
						break;
				case "COD_CAT_SEP":
					setTimeout(()=>{
						var xvalor = getFocusIDComponent();
						xvalor.grid.current.instance.focus(xvalor.grid.current.instance.getCellElement(0,0))
					},220);
					var valor = e.target.value;
					if(valor.trim().length == 0){
						codCatSepRef.current.focus();
						form.setFieldsValue({
							...form.getFieldsValue(),
							['DESC_CAT_SEP']: '',
						})
						var row = await getFocusGlobalEvent().row.data; 
						row['DESC_CAT_SEP']= '';
					}else
						valida(
							showModalMensaje,
							url_valida_separacion, 
							e.target.id,
							"DESC_CAT_SEP",
							e.target.value, 
							codCatSepRef.current,
							"p_desc_cat_sep", 
							{
								cod_empresa: sessionStorage.cod_empresa,
								[e.target.id]:e.target.value
							},
							codCatSepRef.current
						)
						break;
				default:
		
			}
		}
		if(e.which === 120){
            e.preventDefault();
            switch(e.target.id){
				case "COD_FAMILIA":
					var info =  await getFocusGlobalEvent();
                    var aux = await Main.getInfo(url_buscar_familia,'POST', { 
                        "cod_empresa": sessionStorage.getItem("cod_empresa"), 
                        "cod_rubro"  : info.row.data.COD_RUBRO,
                        "valor":"null"
                    });
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_familia = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
                    setSearchColumns(ColumnFamilia);
                    setModalTitle('Familia');
                    setTipoDeBusqueda(e.target.id);
                    setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_familia);
                	break;
				case "COD_MARCA":
					var aux = await Main.getInfo(url_buscar_marca ,'POST', { 
						"cod_empresa": sessionStorage.getItem("cod_empresa"),
						"valor":"null"
					});
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_marca = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					setSearchColumns(ColumnMarca);
					setModalTitle('Marca');
					setTipoDeBusqueda(e.target.id);
					setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_marca);
					break;
				case "COD_ORIGEN_ART":
					var info =  await getFocusGlobalEvent();
					var aux = await Main.getInfo(url_buscar_articulo ,'POST', {
						"cod_empresa": sessionStorage.getItem("cod_empresa"),
						"cod_articulo": info.row.data.COD_ARTICULO == undefined ? 'null' : form.getFieldValue("COD_ARTICULO"),
						"valor":"null"
					});
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_articulo = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					setSearchColumns(ColumnArticulo);
					setModalTitle('Articulo');
					setTipoDeBusqueda(e.target.id);
					setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_articulo);
					break;
				case "COD_LINEA":
					var aux = await Main.getInfo(url_buscar_categoria,'POST', { 
						"cod_empresa": sessionStorage.getItem("cod_empresa"),
						"cod_marca": form.getFieldValue("COD_MARCA"),
						"valor":"null"
					});
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_categoria = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					setSearchColumns(ColumnCategoria);
					setModalTitle('Categoria');
					setTipoDeBusqueda(e.target.id);
					setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_categoria);
					break;
				case "COD_CATEGORIA":
					var aux = await Main.getInfo(url_buscar_segmento,'POST', { 
						"cod_empresa": sessionStorage.getItem("cod_empresa"),
						"cod_linea": form.getFieldValue("COD_LINEA"),
						"valor":"null"
					});
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_segmento = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					setSearchColumns(ColumnSegmento);
					setModalTitle('Segmento');
					setTipoDeBusqueda(e.target.id);
					setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_segmento);
					break;
				case "COD_IVA":
					var aux = await Main.getInfo(url_buscar_iva ,'POST', { 
						"cod_empresa": sessionStorage.getItem("cod_empresa"),
						"valor":"null"
					});
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_iva = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					setSearchColumns(ColumnIva);
					setModalTitle('Impuestos');
					setTipoDeBusqueda(e.target.id);
					setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_iva);
					break;
				case "COD_GRUPO":
					var aux = await Main.getInfo(url_buscar_grupo,'POST', { 
						"cod_empresa": sessionStorage.getItem("cod_empresa"),
						"valor":"null"
					});
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_grupo = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					setSearchColumns(ColumnGrupo);
					setModalTitle('Grupo');
					setTipoDeBusqueda(e.target.id);
					setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_grupo);
					break;
				case "COD_CAT_ALM":
					var aux = await Main.getInfo(url_buscar_almacenaje,'POST', { 
						"cod_empresa": sessionStorage.getItem("cod_empresa"),
						"valor":"null"
					});
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_almacenaje = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					setSearchColumns(ColumnAlmacenaje);
					setModalTitle('Almacenaje');
					setTipoDeBusqueda(e.target.id);
					setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_almacenaje);
					break;
				case "COD_CAT_SEP":
					var aux = await Main.getInfo(url_buscar_separacion,'POST', { 
						"cod_empresa": sessionStorage.getItem("cod_empresa"),
						"valor":"null"
					});
					var content;
					if(aux.length == 0){ content = [] } else { content = aux }
					const dataSource_separacion = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					setSearchColumns(ColumnSeparacion);
					setModalTitle('Separacion');
					setTipoDeBusqueda(e.target.id);
					setShows(true);
					grid_Search_modal.current.instance.option('dataSource', dataSource_separacion);
					break;
				default:
					break;
			}
		}
	}
	const valida = ( showModalMensaje, url, campo, campoDesc, dato, posicion, desc_retorno, data, posicionAct ) => {
		var method = 'POST';
		Main.Request( url, method, data )
            .then( async(response) => {
                if( response.status === 200 ){
					var aux = form.getFieldsValue();
					var row = await getFocusGlobalEvent().row.data; 
					if(response.data.outBinds.ret === 1){
						form.setFieldsValue({
							...aux,
							[campo]:dato,
							[campoDesc]: response.data.outBinds[desc_retorno]
						})

						setValidaDato({
							state: false,
							position: '',
						})

						if(posicion){
							posicion.focus();
						}
					} else {
						form.setFieldsValue({
							...aux,
							[campoDesc]: ""
						})
						row[campoDesc] = "";
          				  showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);

						setValidaDato({
							state: true,
							position: posicionAct,
						})

          }
					row[campoDesc] = response.data.outBinds[desc_retorno]
					if(!row.inserted){
						row.updated = true;
					}
				} else {
					form.setFieldsValue({
						...aux,
						[campoDesc]: ""
					})
					row[campoDesc] = "";
                    showModalMensaje('¡Error!','error','Ha ocurrido un error al validar el campo.');
                }
			});
	}
	const handleInputChange = async(e) => {
		var row = await grid.current.instance.getDataSource()._items[getFocusGlobalEvent().rowIndex]
		row[e.target.id] = e.target.value;
		if(!row.inserted){
		 	row.updated = true;
			update      = true;
		}
		if(row.inserted) insert = true;
		// if(!getBloqueoCabecera())setBloqueoCabecera(true);
		modifico()
	}
	const handleCheckbox = async(e, options) => {
		var row = await getFocusGlobalEvent().row.data;
		row[e.target.id] = form.getFieldValue(e.target.id) == true ? options[0] : options[1];
		if(!row.inserted){
			row.updated = true;
		}
		modifico()
	}
	const handleTabChange = (value) => {
		setTabKey(value);
		manageTabs(value);
	}
	const handleTabWMSChange = (value) => {
		setTabKeyWMS(value);
		manageTabs(value);
	}
	const showsModal = async (valor) => {
        setShows(valor);
	};
	const onInteractiveSearch = async(event)=>{
		var row = await getFocusGlobalEvent().row.data; 
		var valor = event.target.value;
        var url   = '';
        var data  = '';
        valor = valor.trim();
        if(valor.length == 0 ) valor = 'null';
        if(tipoDeBusqueda === 'COD_FAMILIA'){
            url  = url_buscar_familia;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'), 
                "cod_rubro": row.COD_RUBRO,//form.getFieldValue("COD_RUBRO"), 
                "valor":valor
            };
        }
		if(tipoDeBusqueda === 'COD_MARCA'){
            url  = url_buscar_marca;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'), 
                "valor":valor
            };
        }
		if(tipoDeBusqueda === 'COD_ORIGEN_ART'){
            url  = url_buscar_articulo;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'), 
				"cod_articulo": form.getFieldValue("COD_ARTICULO"),
                "valor":valor
            };
        }
		if(tipoDeBusqueda === 'COD_LINEA'){
            url  = url_buscar_categoria;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'), 
				"cod_marca": form.getFieldValue("COD_MARCA"),
                "valor":valor
            };
        }
		if(tipoDeBusqueda === 'COD_CATEGORIA'){
            url  = url_buscar_segmento;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'), 
				"cod_linea": form.getFieldValue("COD_LINEA"),
                "valor":valor
            };
        }
		if(tipoDeBusqueda === 'COD_IVA'){
            url  = url_buscar_iva;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'),
                "valor":valor
            };
        }
		if(tipoDeBusqueda === 'COD_GRUPO'){
            url  = url_buscar_grupo;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'),
                "valor":valor
            };
        }
		if(tipoDeBusqueda === 'COD_CAT_ALM'){
            url  = url_buscar_almacenaje;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'),
                "valor":valor
            };
        }
		if(tipoDeBusqueda === 'COD_CAT_SEP'){
            url  = url_buscar_separacion;
            data = {
                "cod_empresa": sessionStorage.getItem('cod_empresa'),
                "valor":valor
            };
        }
		var method = 'POST';
        await Main.Request( url, method, data )
            .then( response => {
                if( response.status == 200 ){
					var content = [];
					if( response.data.rows.length > 0 ) content = response.data.rows;
					const dataSource_search = new DataSource({ store: new ArrayStore({ data: content }), key: 'ID' })
					grid_Search_modal.current.instance.option('dataSource', dataSource_search);
                }
            })
	}
	const modalSetOnClick = async (datos, BusquedaPor, nameColumn ) => {
		form.setFieldsValue({
			...form.getFieldsValue(),
			[nameColumn[1]] : datos[0],
			[nameColumn[2]] : datos[1],
		})
		var row = await grid.current.instance.getDataSource()._items[getFocusGlobalEvent().rowIndex];
		if(row[BusquedaPor] != datos[0]){
			modifico()
			row[nameColumn[1]] = datos[0];
			row[nameColumn[2]] = datos[1];
			if(!row.inserted){
				row.updated = true;
			}
		}
		if( BusquedaPor === 'COD_FAMILIA' ) setTimeout( ()=>{ codMarcaRef.current.focus()}, 850);
		else if( BusquedaPor === 'COD_MARCA' ) setTimeout( ()=>{ tipProductoRef.current.focus()}, 850);
		else if( BusquedaPor === 'COD_ORIGEN_ART' ) setTimeout( ()=>{ nroRegistroRef.current.focus()}, 850);
		else if( BusquedaPor === 'COD_LINEA' ) setTimeout( ()=>{ codNomenRef.current.focus()}, 850);
		else if( BusquedaPor === 'COD_CATEGORIA' ) setTimeout( ()=>{ codIvaRef.current.focus()}, 850);
		else if( BusquedaPor === 'COD_IVA' ) setTimeout( ()=>{ codAlternoRef.current.focus()}, 850);
		else if( BusquedaPor === 'COD_GRUPO' ) setTimeout( ()=>{ tipoCompraRef.current.focus()}, 850);
		else if( BusquedaPor === 'COD_CAT_ALM' ) setTimeout( ()=>{ codCatSepRef.current.focus()}, 850);
		else if( BusquedaPor === 'COD_CAT_SEP' ) setTimeout( ()=>{ codCatSepRef.current.focus()}, 850);
		setShows(false);
	}
	const save =()=>{
		setVisibleMensaje(false)
		setShowMessageButton(false)
		guardar();		
	}
	const handleCancel = async() => {
		setVisibleMensaje(false);
		setTimeout(async()=>{
			if(showMessageButton){
				var fila   = getFocusedRowIndex();
				if(fila == -1) fila = 0;
				openCancelarComponent(fila);
			}
		 })
	};
	const activateButtonCancelar = async(e,nameInput)=>{
		var row  = await grid.current.instance.getDataSource()._items[getFocusGlobalEvent().rowIndex]
		if(e)row[nameInput] = moment(e._d).format("DD/MM/YYYY");
		else row[nameInput] = ''
		
		if(!row.inserted){ row.updated = true;
			update = true;
		} 
		modifico()
	}
	const stateOpenDate= (e)=>{
		let res = document.getElementsByClassName('ant-picker-dropdown');
		if(e){
			res[0].classList.remove(Ocultar_classDataPiker_1);
			res[0].classList.remove(Ocultar_classDataPiker_2);
			res[0].classList.add(mostrar_classDataPiker_3);
		}else{
			res[0].classList.add(Ocultar_classDataPiker_1);
			res[0].classList.add(Ocultar_classDataPiker_2);
			res[0].classList.remove(mostrar_classDataPiker_3);
		}
	}
	const clickDataPicket = async(e)=>{
		let res   = await document.getElementsByClassName('ant-picker-dropdown');
		let resul = res[0].classList.value.split(' ');
		if(resul.indexOf(Ocultar_classDataPiker_2) !== -1){
			res[0].classList.remove(Ocultar_classDataPiker_1);
			res[0].classList.remove(Ocultar_classDataPiker_2);
			res[0].classList.add(mostrar_classDataPiker_3);
		}
	}
	const handleFocus = async(event) => {

		if(getVerificaKeydown().state){
			var e = getVerificaKeydown().e;
			setVerificaKeydown({ state: false, e: ''})
			var row = await getFocusGlobalEvent().row.data;
			switch(e.target.id){
				case "COD_FAMILIA":
					valida( 
									showModalMensaje, url_valida_familia, e.target.id, "DESC_FAMILIA", e.target.value, codMarcaRef.current, "p_desc_familia",
									{ cod_empresa: sessionStorage.getItem("cod_empresa"), cod_rubro: row.COD_RUBRO, [e.target.id]:e.target.value }, codFamiliaRef.current
								)
					break;
				case "COD_MARCA":
					valida(
									showModalMensaje, url_valida_marca, e.target.id, "DESC_MARCA", e.target.value, tipProductoRef.current, "p_desc_marca",
									{ cod_empresa: sessionStorage.getItem("cod_empresa"), [e.target.id]:e.target.value }, codMarcaRef.current
								)
					form.setFieldsValue({
						...form.getFieldsValue(),
						["COD_LINEA"]: "",
						["DESC_LINEA"]: "",
						["COD_CATEGORIA"]: "",
						["DESC_CATEGORIA"]: "",
					});
					row.COD_LINEA = '';
					row.DESC_LINEA = '';
					row.COD_CATEGORIA = '';
					row.DESC_CATEGORIA = '';
					break;
				case "COD_ORIGEN_ART":
					valida(
									showModalMensaje, url_valida_articulo, e.target.id, "DESC_ORIGEN_ART", e.target.value, nroRegistroRef.current, "p_desc_articulo",
									{ cod_empresa: sessionStorage.getItem("cod_empresa"), cod_articulo: form.getFieldValue("COD_ARTICULO"), [e.target.id]:e.target.value }, codOrigenArtRef.current
								)
					break;
				case "COD_LINEA":
					if(e.target.value.trim() != cod_linea_ant){
						valida(
							showModalMensaje, url_valida_categoria, e.target.id, "DESC_LINEA", e.target.value, codNomenRef.current, "p_desc_categoria",
							{ cod_empresa: sessionStorage.getItem("cod_empresa"), cod_marca: form.getFieldValue("COD_MARCA"), [e.target.id]:e.target.value }, codCategoriaRef.current
						)
						form.setFieldsValue({
							...form.getFieldsValue(),
							["COD_CATEGORIA"]:'',
							["DESC_CATEGORIA"]:'',
						});
						row.COD_CATEGORIA = '';
						row.DESC_CATEGORIA = '';
					}
					break;
				case "COD_CATEGORIA":
					valida( 
									showModalMensaje, url_valida_segmento, e.target.id, "DESC_CATEGORIA", e.target.value, codIvaRef.current, "p_desc_segmento",
									{ cod_empresa: sessionStorage.getItem("cod_empresa"), cod_linea: form.getFieldValue("COD_LINEA"), [e.target.id]:e.target.value }, codSegmentoRef.current
								)
					break;
				case "COD_GRUPO":
					valida(
									showModalMensaje, url_valida_grupo, e.target.id, "DESC_GRUPO", e.target.value, tipoCompraRef.current, "p_desc_grupo",
									{ cod_empresa: sessionStorage.getItem("cod_empresa"), [e.target.id]: e.target.value, }, codGrupoRef.current
								)
					break;
				case "COD_IVA":
					valida(
									showModalMensaje, url_valida_iva, e.target.id, "DESC_IVA", e.target.value, codAlternoRef.current, "p_desc_iva",
									{ cod_empresa: sessionStorage.getItem("cod_empresa"), [e.target.id]:e.target.value }, codIvaRef.current
								)
					break;
				case "COD_CAT_ALM":
					valida(
									showModalMensaje, url_valida_almacenaje, e.target.id, "DESC_CAT_ALM", e.target.value, codCatSepRef.current, "p_desc_cat_alm", 
									{ cod_empresa: sessionStorage.cod_empresa, [e.target.id]:e.target.value }, codCatAlmRef.current
								)
					break
				case "COD_CAT_SEP":
					valida(
									showModalMensaje, url_valida_separacion, e.target.id, "DESC_CAT_SEP", e.target.value, codCatSepRef.current, "p_desc_cat_sep", 
									{ cod_empresa: sessionStorage.cod_empresa, [e.target.id]:e.target.value }, codCatSepRef.current
								)
					break;
				default:
					// null
			}

			

		}
		if( getValidaDato().state ){
			getValidaDato().position.focus();
			getValidaDato().position.select();
		}else{
			event.target.select();
		}
	}
	const setRowFocusDet = async (e)=>{
	
		var valor = await  getIdComponentUpdate()
		var ban = false
		if(valor.length > 0){
			for (let i = 0; i < valor.length; i++) {
				const element = valor[i];
				if(element.MOVIMIENTO_STOCK_DET){
					ban = true;
					break
				}
			}
			if(ban){
				setShowMessageButton(true);
				showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
				return
			}
		}
		var cod_sucursal = e.row !== undefined ? e.row.data.COD_SUCURSAL : '';
		var content = [];
		var info    = []
		var addBand = false
		if(e.row.data.COD_SUCURSAL){
			info = await Main.Request('/st/starticu/movimiento_stock_det','POST',{
				COD_EMPRESA	 : sessionStorage.getItem("cod_empresa"),
				COD_ARTICULO : form.getFieldValue('COD_ARTICULO'),
				COD_SUC_REF  : cod_sucursal,			
			});
			if(info.data.rows.length > 0) addBand = true
		}
		if(!addBand){
			var row = await getFocusGlobalEvent().row.data;
			var newKey = uuidID();
			content = [{
				ID	         	: newKey,
				COD_EMPRESA		: sessionStorage.getItem("cod_empresa"),
				COD_ARTICULO 	: form.getFieldValue('COD_ARTICULO'),
				idCabecera      : row.ID,
				COD_SUC_REF		: cod_sucursal,
				InsertDefault   : true,
				IDCOMPONENTE	: 'MOVIMIENTO_STOCK_CAB'
			}]
		}else{
			content = info.data.rows
		}
		cancelarMovimientoStockDet = JSON.stringify(content);
		const dataSource_MovimientoStockDet = new DataSource({
			store: new ArrayStore({
				data: content,
			}),
			key: 'ID'
		})
		GridMovimientoStockDet.current.instance.option('dataSource', dataSource_MovimientoStockDet);
	}
	const setRowFocusDet_MovimientoStockDet=()=>{
		setColumnRequerido(columns_MovimientoStockDet);
	}
    return (
        <>
			<Main.ModalDialogo
				positiveButton={showMessageButton ? "SI" : ""  }
				negativeButton={showMessageButton ? "NO" : "OK"}
				positiveAction={showMessageButton ? save : null}
				negativeAction={handleCancel}
				onClose={handleCancel}
				setShow={visibleMensaje}
				title={tituloModal}
				imagen={imagen}
				mensaje={mensaje}
			/>
			<Main.FormModalSearch
                showsModal={showsModal}
                setShows={shows}
                title={modalTitle}
                componentData={
                    <NewTableSearch
												grid={grid_Search_modal}
                        onInteractiveSearch={onInteractiveSearch}
                        columns={searchColumns}
                        modalSetOnClick={modalSetOnClick}
                        tipoDeBusqueda={tipoDeBusqueda}
										/>
                }
                descripcionClose=""
                descripcionButton=""
                actionAceptar=""/>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`}/>
                <Main.Spin size="large" spinning={activarSpinner}>
									<div className="paper-container">
										<Paper className="paper-style">
											<DevExtremeCab
												grid={grid}
												gridDet={idGrid}
												rows={rows}
												id="ROWS"
												IDCOMPONENTE="ROWS"
												setRows={setRows}
												title={`Catastro de articulos`}
												setRowFocus={setRowFocus}
												columns={columns}
												guardar={guardar}
												FormName={FormName}
												columnModal={columnModal}
												ColumnDefaultPosition={ColumnDefaultPosition}
												heightDatagrid={'150px'}
												columBuscador={columBuscador}
												doNotsearch={doNotsearch}
												notOrderByAccion={notOrderByAccion}
												url_Buscador={url_Buscador}
												openCancelar={openCancelarComponent}
												nextFocusNew={"COD_FAMILIA"}
												activateF10={true}
												setActivarSpinner={setActivarSpinner}
												canDelete={false}
											/>
									<Form size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px'}}>
										<Col span={24}>
											<Row>
												<Col span={16}>
													<Row>
														<Col span={8}>
															<Form.Item label="Familia" 
																labelCol={{ span: 6 }} 
																wrapperCol={{ span: 18 }}>
																<Form.Item
																	name="COD_FAMILIA"
																	className="form-input-group-cod"
																>
																	<Input  
																		className="requerido"
																		onKeyDown={handleKeydown}
																		onChange={handleInputChange}
																		onFocus={handleFocus}
																		ref={codFamiliaRef}/>
																</Form.Item>
																<Form.Item
																	name="DESC_FAMILIA"
																	className="form-input-group-desc"
																>
																	<Input disabled/>
																</Form.Item>
															</Form.Item>
														</Col>
														<Col span={8}>
															<Form.Item
																label="Marca"
																labelCol={{ span: 10 }}
																wrapperCol={{ span: 14 }}
															>
																<Form.Item
																	name="COD_MARCA"
																	className="form-input-group-cod">
																	<Input
																		className="requerido"
																		onKeyDown={handleKeydown}
																		onChange={handleInputChange}
																		onFocus={handleFocus}
																		ref={codMarcaRef}
																	/>
																</Form.Item>
																<Form.Item
																	name="DESC_MARCA"
																	className="form-input-group-desc">
																	<Input disabled/>
																</Form.Item>
															</Form.Item>
														</Col>
														<Col span={8}>
															<Form.Item 
																name="TIP_PRODUCTO" 
																label="Tipo Producto" 
																labelCol={{ span: 10 }} 
																wrapperCol={{ span: 14 }}
																>
																<Select 
																	ref={tipProductoRef} allowClear
																	defaultValue="CVT"
																	onChange={ async(e)=>{
																		modifico();
																		var row = await grid.current.instance.getDataSource()._items[getFocusGlobalEvent().rowIndex]
																		if(row.InsertDefault){
																			row.inserted = true;
																			row.InsertDefault = false;
																		}else if(!row.inserted) row.updated = true;
																		row.TIP_PRODUCTO = e;
																	}}>
																	<Select.Option value="CVT">Compra Venta</Select.Option>
																	<Select.Option value="CON">Consumo</Select.Option>
																	<Select.Option value="ADM">Administrativo</Select.Option>
																	<Select.Option value="MKT">Marketing</Select.Option>
																	<Select.Option value="COA">Consumo de Aceite</Select.Option>
																	<Select.Option value="VA">Varios</Select.Option>
																	<Select.Option value="DES">Descontinuados</Select.Option>
																	<Select.Option value="RH">Recursos Humanos</Select.Option>
																</Select>
															</Form.Item>
														</Col>
													</Row>
													<Row>
														<Col span={8}>
															<Form.Item
																label="Sustituto"
																labelCol={{ span: 6 }}
																wrapperCol={{ span: 18 }}
																size="small"
															>
																<Form.Item
																	name="COD_ORIGEN_ART"
																	className="form-input-group-cod"
																>
																	<Input		
																		onKeyDown={handleKeydown}
																		onChange={handleInputChange}
																		onFocus={handleFocus}
																		ref={codOrigenArtRef}
																	/>
																</Form.Item>
																<Form.Item
																	name="DESC_ORIGEN_ART"
																	className="form-input-group-desc"
																>
																	<Input disabled/>
																</Form.Item>
															</Form.Item>
														</Col>
														<Col span={8}>
															<Form.Item
																label="RSPA/DNVS"
																name="NRO_REGISTRO"
																labelCol={{ span: 10 }}
																wrapperCol={{ span: 14 }}
															>
																<Input
																	onKeyDown={handleKeydown}
																	onChange={handleInputChange}
																	onFocus={handleFocus}
																	ref={nroRegistroRef}
																/>
															</Form.Item>
														</Col>
														<Col span={8}>
															<ConfigProvider locale={locale}>
																<Form.Item
																	label="Inscripción"
																	name="INSCRIPCION"
																	labelCol={{ span: 10 }}
																	wrapperCol={{ span: 14 }}
																	>
																		<DatePicker 
																			onKeyDown={handleKeydown}
																			onChange={(e)=>activateButtonCancelar(e,"INSCRIPCION")}
																			format={"DD/MM/YYYY"}
																			ref={inscripcionRef}																			
																			open={openDatePicker}
																			onOpenChange={stateOpenDate}
																			onClick={clickDataPicket}
																		/>
																</Form.Item>
															</ConfigProvider>
														</Col>
													</Row>
													<Row>
														<Col span={8}>
															<Form.Item
																label="Categoría"
																labelCol={{ span: 6 }}
																wrapperCol={{ span: 18 }}
																size="small"
															>
																<Form.Item
																	name="COD_LINEA"
																	className="form-input-group-cod"
																>
																	<Input
																		className="requerido"
																		onKeyDown={handleKeydown}
																		onChange={handleInputChange}
																		onFocus={handleFocus}
																		ref={codCategoriaRef}
																	/>
																</Form.Item>
																<Form.Item
																	name="DESC_LINEA"
																	className="form-input-group-desc"
																>
																	<Input disabled/>
																</Form.Item>
															</Form.Item>
														</Col>
														<Col span={8}>
															<Form.Item
																label="Nomenclat"
																name="COD_NOMEN"
																labelCol={{ span: 10 }}
																wrapperCol={{ span: 14 }}
															>
																<Input
																	onKeyDown={handleKeydown}
																	onChange={handleInputChange}
																	onFocus={handleFocus}
																	ref={codNomenRef}
																/>
															</Form.Item>
														</Col>
														<Col span={8}>
															<Form.Item
																label="Vencimiento"
																name="VENCIMIENTO"
																labelCol={{ span: 10 }}
																wrapperCol={{ span: 14 }}
															>
																<Input
																	onKeyDown={handleKeydown}
																	onChange={handleInputChange}
																	disabled={true}
																	ref={vencimientoRef}
																/>
															</Form.Item>
														</Col>
													</Row>
													<Row>
														<Col span={8}>
															<Form.Item
																label="Segmento"
																labelCol={{ span: 6 }}
																wrapperCol={{ span: 18 }}
																size="small"
															>
																<Form.Item
																	name="COD_CATEGORIA"
																	className="form-input-group-cod"
																>
																	<Input		
																		className="requerido"
																		onKeyDown={handleKeydown}
																		onChange={handleInputChange}
																		onFocus={handleFocus}
																		ref={codSegmentoRef}
																	/>
																</Form.Item>
																<Form.Item
																	name="DESC_CATEGORIA"
																	className="form-input-group-desc"
																>
																	<Input disabled/> 
																</Form.Item>
															</Form.Item>
														</Col>
														<Col span={8}>
															<Form.Item
																label="Impuesto"
																labelCol={{ span: 10 }}
																wrapperCol={{ span: 14 }}
															>
																<Form.Item
																	name="COD_IVA"
																	className="form-input-group-cod"
																>
																	<Input
																		onKeyDown={handleKeydown}
																		onChange={handleInputChange}
																		onFocus={handleFocus}
																		ref={codIvaRef}
																	/>
																</Form.Item>
																<Form.Item
																	name="DESC_IVA"
																	className="form-input-group-desc"
																>
																	<Input disabled/>
																</Form.Item>
															</Form.Item>
														</Col>
														<Col span={8}>
															<Form.Item
																label="Cod. Alterno"
																name="COD_ALTERNO"
																labelCol={{ span: 10 }}
																wrapperCol={{ span: 14 }}
															>
																<Input
																	onKeyDown={handleKeydown}
																	onChange={handleInputChange}
																	onFocus={handleFocus}
																	ref={codAlternoRef}
																/>
															</Form.Item>
														</Col>
													</Row>
													<Row>
														<Col span={8}>
															<Form.Item
																label="Grupo"
																labelCol={{ span: 6 }}
																wrapperCol={{ span: 18 }}
															>
																<Form.Item
																	name="COD_GRUPO"
																	className="form-input-group-cod"
																>
																	<Input
																		onKeyDown={handleKeydown}
																		onChange={handleInputChange}
																		onFocus={handleFocus}
																		ref={codGrupoRef}
																	/>
																</Form.Item>
																<Form.Item
																	name="DESC_GRUPO"
																	className="form-input-group-desc"
																>
																	<Input disabled/>
																</Form.Item>
															</Form.Item>
														</Col>
														<Col span={16} style={{ textAlign: "left" }}>
															<Form.Item
																label="Tipo Compra"
																name="COND_COMPRA"
																labelCol={{ span: 5 }}
																wrapperCol={{ span: 19 }}
																onChange={async(e)=>{
																	modifico();
																	var row  = await grid.current.instance.getDataSource()._items[getFocusGlobalEvent().rowIndex]
																	if(!row.inserted) row.updated = true;
																	row.COND_COMPRA = e.target.value;
																}}
															>
																<Radio.Group>
																	<Radio value="N" ref={tipoCompraRef}>
																		Ninguno
																	</Radio>
																	<Radio value="E">
																		Por Estadística
																	</Radio>
																	<Radio value="I">
																		Por Innovación
																	</Radio>
																</Radio.Group>
															</Form.Item>
														</Col>
													</Row>
													<Row>
														<Col span={8}>
															<Form.Item
																label="Observ."
																name="COMENTARIO"
																labelCol={{ span: 6 }}
																wrapperCol={{ span: 18 }}
															>
																<Input
																	onKeyDown={handleKeydown}
																	onChange={handleInputChange}
																	onFocus={handleFocus}
																	ref={comentarioRef}
																/>
															</Form.Item>
														</Col>
														<Col span={16} style={{ textAlign: "left" }}>
															<Form.Item
																label="Med. Compra"
																name="IND_MED_COMP"
																labelCol={{ span: 5 }}
																wrapperCol={{ span: 19 }}
																onChange={async(e)=>{
																	modifico();
																	var row  = await grid.current.instance.getDataSource()._items[getFocusGlobalEvent().rowIndex]
																	if(!row.inserted) row.updated = true;
																	row.IND_MED_COMP = e.target.value;
																}}
															>
																<Radio.Group>
																	<Radio value="N" ref={indMedCompRef}>
																		Ninguno
																	</Radio>
																	<Radio value="P">
																		Peso
																	</Radio>
																	<Radio value="T">
																		Palet/Batch
																	</Radio>
																	<Radio value="V">
																		Volumen
																	</Radio>
																</Radio.Group>
															</Form.Item>
														</Col>
													</Row>
													<Row>
														<Col span={8}>
															<Form.Item
																label="Nro. Ord."
																name="NRO_ORDEN"
																labelCol={{ span: 6 }}
																wrapperCol={{ span: 18 }}
															>
																<Input
																	onKeyDown={handleKeydown}
																	onChange={handleInputChange}
																	onFocus={handleFocus}
																	ref={nroOrdenRef}
																/>
															</Form.Item>
														</Col>
														<Col span={16}>
															<Row>
																<Col span={24}>
																	<Form.Item
																		label="Mes"
																		name="IND_MES"
																		labelCol={{ span: 5 }}
																		wrapperCol={{ span: 20 }}
																		onChange={async(e)=>{
																			modifico();
																			var row  = await grid.current.instance.getDataSource()._items[getFocusGlobalEvent().rowIndex]
																			if(!row.inserted) row.updated = true;
																			row.IND_MES = e.target.value;
																		}}
																	>
																		<Radio.Group>
																			<Radio value="N" ref={indMesRef}>
																				Ninguno
																			</Radio>
																			<Radio value="P">
																				Par
																			</Radio>
																			<Radio value="I">
																				Impar
																			</Radio>
																		</Radio.Group>
																	</Form.Item>
																</Col>
																<Col span={8}>
																	<Form.Item
																		label="Cantidad."
																		name="CANT_PED"
																		labelCol={{ span: 15 }}
																		wrapperCol={{ span: 9 }}
																	>
																		<Input
																			onKeyDown={handleKeydown}
																			onChange={handleInputChange}
																			onFocus={handleFocus}
																			ref={cantPedRef}
																		/>
																	</Form.Item>
																</Col>
																<Col span={8}>
																	<Form.Item
																		label="Cant. Base"
																		name="CANT_BASE"
																		labelCol={{ span: 16 }}
																		wrapperCol={{ span: 8 }}
																	>
																		<Input
																			onKeyDown={handleKeydown}
																			onChange={handleInputChange}
																			onFocus={handleFocus}
																			ref={cantBaseRef}
																		/>
																	</Form.Item>
																</Col>
																<Col span={8}>
																	<Form.Item
																		label="Cant Volumen"
																		name="CANT_VOLUMEN"
																		labelCol={{ span: 16 }}
																		wrapperCol={{ span: 8 }}
																	>
																		<Input
																			onKeyDown={handleKeydown}
																			onChange={handleInputChange}
																			onFocus={handleFocus}
																			ref={cantVolumenRef}
																		/>
																	</Form.Item>
																</Col>
															</Row>
														</Col>
													</Row>
													<Row>
														<Col span={12}>
															<Main.Fieldset
																anchoContenedor="100%"
																alineacionTitle="center"
																alineacionContenedor="left"
																margenTop="0px"
																tamañoTitle="15px"
																title="Categoría de WMS"
																contenedor={
																	<Row>
																		<Col span={24}>
																			<Form.Item
																				label="Almacenaje"
																				labelCol={{ span: 6 }}
																				wrapperCol={{ span: 18 }}
																			>
																				<Form.Item
																					name="COD_CAT_ALM"
																					className="form-input-group-cod"
																				>
																					<Input
																						onKeyDown={handleKeydown}
																						onChange={handleInputChange}
																						onFocus={handleFocus}
																						ref={codCatAlmRef}
																					/>
																				</Form.Item>
																				<Form.Item
																					name="DESC_CAT_ALM"
																					className="form-input-group-desc">
																					<Input 
																						disabled
																					/>
																				</Form.Item>
																			</Form.Item>
																		</Col>
																		<Col span={24}>
																			<Form.Item
																				label="Separación"
																				labelCol={{ span: 6 }}
																				wrapperCol={{ span: 18 }}
																			>
																				<Form.Item
																					name="COD_CAT_SEP"
																					className="form-input-group-cod">
																					<Input
																						onKeyDown={handleKeydown}
																						onChange={handleInputChange}
																						onFocus={handleFocus}
																						ref={codCatSepRef}
																					/>
																				</Form.Item>
																				<Form.Item
																					name="DESC_CAT_SEP"
																					className="form-input-group-desc"
																				>
																					<Input
																						disabled
																					/>
																				</Form.Item>
																			</Form.Item>
																		</Col>
																	</Row>
																}
															/>
														</Col>
														<Col span={12}>
															<div style={{ marginLeft: "5px" }}>
																<Main.Fieldset
																	anchoContenedor="100%"
																	alineacionTitle="center"
																	alineacionContenedor="center"
																	margenTop="0px"
																	tamañoTitle="15px"
																	title="Costos Sin IVA"
																	contenedor={
																		<div style={{ paddingBottom: "10px" }}>
																			<Row>
																				<Col span={12}>
																					<Form.Item
																						label="Costo Ult."
																						name="COSTO_ULTIMO_GS"
																						labelCol={{ span: 10 }}
																						wrapperCol={{ span: 14 }}
																					>
																						<Input style={{ textAlign: "right" }}
																							disabled
																						/>
																					</Form.Item>
																				</Col>
																				<Col span={12}>
																					<Form.Item
																						label="Promedio"
																						name="COSTO_PROM_GS"
																						labelCol={{ span: 10 }}
																						wrapperCol={{ span: 14 }}
																					>
																						<Input style={{ textAlign: "right" }} disabled />
																					</Form.Item>
																				</Col>
																			</Row>
																		</div>
																	}
																/>
															</div>
														</Col>
													</Row>
												</Col>
												<Col span={8}>
													<div style={{ paddingLeft: "10px" }}>
														<Row>
															<Col span={12}>
																<Form.Item
																	name="ESTADO"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["A","I"]) }
																>
																	<Checkbox> Esta Activo </Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="IND_MANEJA_STOCK"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox ref={indManejaStockRef} >
																		Control de Stock
																	</Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="IND_MANEJA_VTO"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox>
																		Ctrl. de Vencimiento
																	</Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="IND_COND_VTA"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox>
																		Condicionar Venta
																	</Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="IND_INPASA"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox>
																		Ventas por INPASA
																	</Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="IND_ESPECIAL"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox>
																		Producto Especial
																	</Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="IND_JNJ"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox>
																		Producto JNJ
																	</Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="ART_ADICIONAL"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox>
																		Tiene Art. Adicional ?
																	</Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="IND_REGIMEN"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox ref={indRegimenRef}>
																		Régimen/Turismo
																	</Checkbox>
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name="VER_CATASTRO"
																	valuePropName="checked"
																	onChange={ (e)=> handleCheckbox(e,["S","N"]) }
																>
																	<Checkbox ref={verCatastroRef} disabled={ !_.contains(PermisoEspecialWMS, 'AUTORIZADO_CATASTRO') }>
																		Catastro Verificado ?
																	</Checkbox>
																</Form.Item>
															</Col>
															
														</Row>
													</div>
													<div className="" style={{marginLeft:'10px'}}>
														<Main.Fieldset
															anchoContenedor="100%" 
															alineacionTitle="center"
															alineacionContenedor="center"
															margenTop="0px"
															tamañoTitle="15px"
															title="Lead Time"
															contenedor=
															{
																<div className="" style={{paddingBottom:'10px', paddingTop:'10px'}}>
																	<DevExtremeDet
																		gridDet={GridLeadTime}
																		id="LEAD_TIME"
																		columnDet={columns_LeadTime}
																		initialRow={initialRow}
																		notOrderByAccion={notOrderByAccionDet}
																		FormName={FormName}
																		guardar={guardar}
																		newAddRow={ false }
																		canDelete={ false }
																		columnModal={columnModal_LeadTime}
																		maxFocus={maxFocus}
																		activateF10={true}
																		setActivarSpinner={setActivarSpinner}
																	/>
																</div>
															}
														/>
													</div>
												</Col>
											</Row>
											<Row>
												<Col span={24}>
												<div className="card-container">
													<Tabs 
														activeKey={tabKey}
														onChange={handleTabChange}
														type="card"
														size={"small"}>
														<TabPane tab="Unidad de Medida" key="1">
															<DevExtremeDet
																gridDet={GridUnidadMedida}
																id="UNIDAD_MEDIDA"
																columnDet={columns_UnidadMedida}
																initialRow={initialRowUnidadMedida}
																notOrderByAccion={notOrderByAccionDet}												
																FormName={FormName}
																guardar={guardar}
																newAddRow={ true } // newAddRow={ _.contains(PermisoEspecial,'CAMBIO_UNID_BASICA') }
																canDelete={ false } // canDelete={ _.contains(PermisoEspecial,'CAMBIO_UNID_BASICA') }
																permisos_especiales={["CAMBIO_UNID_BASICA"]}
																datos_disable_edit={["COD_UNIDAD_REL","MULT"]}
																deleteDisable={false}
																columnModal={columnModal_UnidadMedida}
																activateF10={true}
																setActivarSpinner={setActivarSpinner}
															/>
															<Row style={{
																marginTop:'10px'
															}}>
																<Col span={4}>
																		<Form.Item
																			label="Creado por."
																			name="COD_USUARIO_ALTA"
																			labelCol={{ span: 10 }}
																			wrapperCol={{ span: 14 }}
																		>
																			<Input disabled/>
																		</Form.Item>
																</Col>
																<Col span={4}>
																		<Form.Item
																			label="Fecha"
																			name="FEC_ALTA"
																			labelCol={{ span: 10 }}
																			wrapperCol={{ span: 14 }}
																		>
																			<Input disabled/>
																		</Form.Item>
																</Col>
																<Col span={4}>
																		<Form.Item
																			label="Modificado"
																			name="COD_USUARIO_MODI"
																			labelCol={{ span: 10 }}
																			wrapperCol={{ span: 14 }}
																		>
																			<Input disabled/>
																		</Form.Item>
																</Col>
																<Col span={4}>
																		<Form.Item
																			label="Fecha"
																			name="FEC_MODI"
																			labelCol={{ span: 10 }}
																			wrapperCol={{ span: 14 }}
																		>
																			<Input disabled/>
																		</Form.Item>
																</Col>
															</Row>
														</TabPane>
														<TabPane tab="Proveedor" key="2">
															<DevExtremeDet
																gridDet={GridProveedor}
																id="PROVEEDOR"
																columnDet={columns_Proveedor}
																initialRow={initialRow}
																notOrderByAccion={notOrderByAccionDet}
																FormName={FormName}
																guardar={guardar}
																columnModal={columnModal_Proveedor}
																activateF10={true}
																setActivarSpinner={setActivarSpinner}
																maxFocus={maxFocus_proveedor}
															/>
														</TabPane>
														<TabPane tab="Límite por Pedido" key="3">
															<DevExtremeDet
																gridDet={GridLimitePedido}
																id="LIMITE_PEDIDO"
																columnDet={columns_LimitePedido}
																initialRow={initialRow}
																notOrderByAccion={notOrderByAccionDet}
																FormName={FormName}
																guardar={guardar}
																newAddRow={false}
																canDelete={false}
																columnModal={columnModal_LimitePedido}
																activateF10={true}
																setActivarSpinner={setActivarSpinner}
															/>
														</TabPane>
														<TabPane tab="Movimiento de Stock" key="4">
															<Row gutter={[8,8]}>
																<Col span={12}>
																	<DevExtremeDet
																		gridDet={GridMovimientoStockCab}
																		id="MOVIMIENTO_STOCK_CAB"
																		columnDet={columns_MovimientoStockCab}
																		initialRow={initialRow}
																		notOrderByAccion={notOrderByAccionDet}
																		setRowFocusDet={setRowFocusDet}
																		FormName={FormName}
																		guardar={guardar}
																		columnModal={columnModal_MovimientoStockCab}
																		activateF10={true}
																		setActivarSpinner={setActivarSpinner}
																		// ------
																		// BloqueaLinea={[{"MOVIMIENTO_STOCK_CAB":false}]} // true - false
																		// gridBloqueaLinea={GridMovimientoStockDet}
																	/>
																</Col>
																<Col span={12}>
																	<DevExtremeDet
																		gridDet={GridMovimientoStockDet}
																		id="MOVIMIENTO_STOCK_DET"
																		columnDet={columns_MovimientoStockDet}
																		initialRow={initialRowMovimientoDeStockDet}
																		notOrderByAccion={notOrderByAccionDet}
																		FormName={FormName}
																		guardar={guardar}
																		setRowFocusDet={setRowFocusDet_MovimientoStockDet}
																		columnModal={columnModal_MovimientoStockDet}
																		activateF10={true}
																		setActivarSpinner={setActivarSpinner}
																	/>
																</Col>
															</Row>
														</TabPane>
														<TabPane tab="Pack" key="5">
															<DevExtremeDet
																gridDet={GridPack}
																id="PACK"
																columnDet={columns_Pack}
																initialRow={initialRow}
																notOrderByAccion={notOrderByAccionDet}
																FormName={FormName}
																guardar={guardar}
																columnModal={columnModal_Pack}
																activateF10={true}
																setActivarSpinner={setActivarSpinner}
															/>
														</TabPane>
														{ _.contains(PermisoEspecial, 'CARGA_BLOQUEOS') && 
															<TabPane tab="Bloqueo de existencia" key="6">
																<DevExtremeDet
																	gridDet={GridBloqueoExistencia}
																	id="BLOQUEO_EXISTENCIA"
																	columnDet={columns_BloqueoExistencia}
																	initialRow={initialRow}
																	notOrderByAccion={notOrderByAccionDet}
																	FormName={FormName}
																	guardar={guardar}
																	newAddRow={false}
																	canDelete={false}
																	// columnModal={columnModal_BloqueoExistencia}
																	activateF10={true}
																	setActivarSpinner={setActivarSpinner}
																/>
															</TabPane>
														}
														<TabPane tab="Configuración WMS" key="7">
															<Row>
																<Col span={24}>
																	<Tabs activeKey={tabKeyWMS} onChange={handleTabWMSChange} type="card" size="small">
																		<TabPane tab="Norma Palet" key="71">
																			<DevExtremeDet
																				gridDet={GridNormaPalet}
																				id="NORMA_PALET"
																				columnDet={columns_NormaPalet}
																				initialRow={initialRow}
																				notOrderByAccion={notOrderByAccionDet}
																				FormName={FormName}
																				guardar={guardar}
																				columnModal={columnModal_NormaPalet}
																				activateF10={true}
																				setActivarSpinner={setActivarSpinner}
																			/>
																		</TabPane>
																		<TabPane tab="Dirección Fija" key="72">
																			<DevExtremeDet
																				gridDet={GridDireccionFija}
																				id="DIRECCION_FIJA"
																				columnDet={columns_DireccionFija}
																				initialRow={initialRow}
																				notOrderByAccion={notOrderByAccionDet}
																				FormName={FormName}
																				guardar={guardar}
																				columnModal={columnModal_DireccionFija}
																				activateF10={true}
																				setActivarSpinner={setActivarSpinner}
																			/>
																		</TabPane>
																		<TabPane tab="Cantidad Picking" key="73">
																			<DevExtremeDet
																				gridDet={GridCantidadPiking}
																				id="CANTIDAD_PICKING"
																				columnDet={columns_CantidadPicking}
																				initialRow={initialRow}
																				notOrderByAccion={notOrderByAccionDet}
																				FormName={FormName}
																				guardar={guardar}
																				columnModal={columnModal_CantidadPicking}
																				activateF10={true}
																				setActivarSpinner={setActivarSpinner}
																			/>
																		</TabPane>
																		<TabPane tab="Acuerdo" key="74">
																			<DevExtremeDet
																				gridDet={GridAcuerdo}
																				id="ACUERDO"
																				columnDet={columns_Acuerdo}
																				initialRow={initialRow}
																				notOrderByAccion={notOrderByAccionDet}
																				optionSelect={concepto}
																				FormName={FormName}
																				guardar={guardar}
																				columnModal={columnModal_Acuerdo}
																				activateF10={true}
																				setActivarSpinner={setActivarSpinner}
																			/>
																		</TabPane>
																	</Tabs>
																</Col>
															</Row>
														</TabPane>
													</Tabs>
													</div>
												</Col>
											</Row>
										</Col>
									</Form>
										</Paper>
									</div>
                </Main.Spin>
            </Main.Layout>
        </>
    );
});
export default Articulo;