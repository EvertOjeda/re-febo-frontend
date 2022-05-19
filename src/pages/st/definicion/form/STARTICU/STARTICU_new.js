import React, { useState, useEffect, useRef, memo } 		 from "react";
import ValidarCamposRequeridos, { QuitarClaseRequerido } from "../../../../../components/utils/ValidarCamposRequeridos";
import DevExtremeDet, {
	getBloqueoCabecera	   , setBloqueoCabecera  , getIdComponentUpdate, 
	removeIdComponentUpdate, setColumnRequerido  , getRowIndex
} from "../../../../../components/utils/DevExtremeGrid/DevExtremeDet";
import { Row, Col, Checkbox, Radio, Form, Input, Select, Tabs, DatePicker, ConfigProvider, Typography, Card, Divider  } from "antd";
import Main			 											from "../../../../../components/utils/Main";
import  Paper 					             	from '@material-ui/core/Paper';
import { ValidarColumnasRequeridas } 	from "../../../../../components/utils/DevExtremeGrid/ValidarColumnasRequeridas";
import { v4 as uuidID } 							from "uuid";
import locale	  			  			  			from 'antd/lib/locale/es_ES';
import _ 		  			  				  			from "underscore";
import ArrayStore 			  		  			from "devextreme/data/array_store";
import DataSource 			  						from "devextreme/data/data_source";
import { Menu, DireccionMenu }				from '../../../../../components/utils/FocusDelMenu';
import { getPermisos } 		  					from '../../../../../components/utils/ObtenerPermisosEspeciales';
import currency 										  from 'currency.js';
import {objeInicial} 									from './ObjetoInicial'
import './starticu.css';
import "moment/locale/es";
const { Title }    = Typography;

Main.moment.locale("es_es", {week:{ dow: 3 }});
const { TabPane } = Tabs;

var cancelarUnidadMedida = "";
const getCancelarUnidadMedida = () => {
    return cancelarUnidadMedida;
};
var cancelarLeadTime = "";
const getCancelarLeadTime = () => {
    return cancelarLeadTime;
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
var componenteEliminar = {id:"UNIDAD_MEDIDA",delete:false};
const setComponenteEliminarDet = (e)=>{
  componenteEliminar = e;
};

// VALIDA
const url_valida_articulo	 	   	   = "/st/starticu_new/valida/articulo";
const url_valida_articulo_ref 	   = "/st/starticu_new/valida/articulo_ref";
const url_valida_pais 			       = "/st/starticu_new/valida/pais";
const url_valida_proveedor 		     = "/st/starticu_new/valida/proveedor";
const url_valida_proveedor_dflt    = "/st/starticu_new/valida/proveedor_dflt";
const url_valida_rubro 			  	   = "/st/starticu_new/valida/rubro";
const url_valida_familia		  	   = "/st/starticu_new/valida/familia";
const url_valida_marca 			   	   = "/st/starticu_new/valida/marca";
const url_valida_categoria  	     = "/st/starticu_new/valida/categoria";
const url_valida_segmento   	     = "/st/starticu_new/valida/segmento";
const url_valida_grupo      	     = "/st/starticu_new/valida/grupo";
const url_valida_impuesto   	     = "/st/starticu_new/valida/impuesto";
const url_valida_almacenaje 	     = "/st/starticu_new/valida/almacenaje";
const url_valida_separacion 	     = "/st/starticu_new/valida/separacion";
const url_valida_sucursal 		     = '/st/starticu_new/valida/sucursal';
const url_valida_deposito 		     = '/st/starticu_new/valida/deposito';
const url_valida_zona			  		   = '/st/starticu_new/valida/zona';
const url_valida_unidad_medida     = '/st/starticu_new/valida/unidad_medida';
const url_valida_unidadMedida 	   = '/st/starticu_new/valida/unidad_medida_wms' ;
const url_valida_cod_unidad_medida = "/st/starticu_new/valida/cod_unidad_medida";
const url_valida_direccion 			   = '/st/starticu_new/valida/direccion';
const url_valida_tipo_direccion    = '/st/starticu_new/valida/tipo_direccion';
// BUSCA
const url_buscar_articulo	 	  		 = '/st/starticu_new/buscar/articulo';
const url_buscar_articulo_ref 	   = '/st/starticu_new/buscar/articulo_ref';
const url_buscar_pais 			   		 = '/st/starticu_new/buscar/pais';
const url_buscar_proveedor 		   	 = '/st/starticu_new/buscar/proveedor';
const url_buscar_proveedor_dflt    = '/st/starticu_new/buscar/proveedor_dflt';
const url_buscar_rubro 			   		 = '/st/starticu_new/buscar/rubro';
const url_buscar_familia 		   		 = '/st/starticu_new/buscar/familia';
const url_buscar_marca 			       = '/st/starticu_new/buscar/marca';
const url_buscar_categoria 		     = '/st/starticu_new/buscar/categoria';
const url_buscar_segmento		       = '/st/starticu_new/buscar/segmento';
const url_buscar_grupo 			       = '/st/starticu_new/buscar/grupo';
const url_buscar_impuesto 		     = '/st/starticu_new/buscar/iva';
const url_buscar_almacenaje 	     = '/st/starticu_new/buscar/almacenaje';
const url_buscar_separacion 	     = '/st/starticu_new/buscar/separacion';
const url_buscar_sucursal 		     = '/st/starticu_new/buscar/sucursal';
const url_buscar_deposito 		     = '/st/starticu_new/buscar/deposito';
const url_buscar_zona 			       = '/st/starticu_new/buscar/zona';
const url_buscar_unidad_medida     = '/st/starticu_new/buscar/unidad_medida';
const url_buscar_unidadMedida 	   = '/st/starticu_new/buscar/unidad_medida_wms';
const url_buscar_cod_unidad_medida = "/st/starticu_new/buscar/cod_unidad_medida";
const url_buscar_direccion 		     = '/st/starticu_new/buscar/direccion';
const url_buscar_tipo_direccion    = '/st/starticu_new/buscar/tipo_direccion';
// URL ABM
const url_abm 		   	 = "/st/starticu_new/abm";
// URL CABECERA
const url_cabecera 	   = '/st/starticu_new';
const url_cod_articulo = '/st/starticu_new/cod_articulo';

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
// UNIDAD DE MEDIDA
const columns_UnidadMedida = [
    { ID: 'COD_UNIDAD_REL' , label: 'U.M'             , width: 70     , align:'right'    , editModal:true  ,requerido:true},
    { ID: 'REFERENCIA'     , label: 'Referencia'      , minWidth: 190 , align:'left'     , upper:true     },
    { ID: 'MULT'           , label: 'Cantidad'        , width: 80     , align:'right'    , isnumber:true   ,requerido:true},    
    { ID: 'KG_PESO_NETO'   , label: 'Peso(kg)'        , width: 80     , align:'right'    , isnumber:true },
    { ID: 'COD_BARRA_ART'  , label: 'Código de Barra' , width: 120    , align:'left'   } ,
    { ID: 'LARGO_M'        , label: 'Largo(M)'        , width: 70     , align:'right'    , isnumber:true },
    { ID: 'ANCHO_M'        , label: 'Ancho(M)'        , width: 70     , align:'right'    , isnumber:true },
    { ID: 'ALTO_M'         , label: 'Alto(M)'         , width: 70     , align:'right'    , isnumber:true },
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
			{ ID: 'REFERENCIA'  		 , label: 'Descripción'  , minWidth: 70    , align:'left'   },
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
                // {id: 'COD_ARTICULO',label: 'Articulo '},
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
    { ID: 'COD_ARTICULO_REF'  , label: 'Código (Articulo)'  , width: 150    , align:'right'  , editModal:true ,requerido:true},
    { ID: 'DESC_ARTICULO_REF' , label: 'Descripción' , minWidth: 190 , align:'left'   , disabled: true },
    { ID: 'CANTIDAD'          , label: 'Cantidad'    , width: 100    , align:'right'  , isnumber: true ,requerido:true},
    { ID: 'COSTO_PROM_GS'     , label: 'Promedio Gs' , width: 100    , align:'right'  , disabled: true },
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
        { ID: 'DESC_ARTICULO_REF'      , label: 'Descripción' , minWidth: 70    , align:'left'  },
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
    { ID: 'COD_DIRECCION'      , label: 'Dirección'   , width: 100    , align:'left'  , editModal:true },
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
		COD_UNIDAD_MEDIDA:{
			depende_de:[],
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
    { ID: 'FEC_VIGENCIA'   , label: 'Fecha Vigencia' , width: 150    , align:'right'  	   , isdate:true   },
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
const ColumnArticulo = [
	{ ID: 'COD_ORIGEN_ART', label: 'Código', width: 50 },
	{ ID: 'DESC_ORIGEN_ART', label: 'Descripción', minWidth: 150 },
];
const ColumnPais = [
	{ ID: 'COD_PAIS_ORIGEN', label: 'Código', width: 50 },
	{ ID: 'DESC_PAIS_ORIGEN', label: 'Descripción', minWidth: 150 },
];
const ColumnProveedor = [
	{ ID: 'COD_PROVEEDOR_DFLT', label: 'Código'		, width: 50  ,requerido:true},
	{ ID: 'DESC_PROVEEDOR'    , label: 'Descripción', minWidth: 150 },
];
const ColumnRubro = [
	{ ID: 'COD_RUBRO', label: 'Código', width: 50 },
	{ ID: 'DESC_RUBRO', label: 'Descripción', minWidth: 150 },
];
const ColumnFamilia = [
	{ ID: 'COD_FAMILIA', label: 'Código', width: 50 },
	{ ID: 'DESC_FAMILIA', label: 'Descripción', minWidth: 150 },
];
const ColumnMarca = [
	{ ID: 'COD_MARCA', label: 'Código', width: 50 },
	{ ID: 'DESC_MARCA', label: 'Descripción', minWidth: 150 },
];
const ColumnCategoria = [
	{ ID: 'COD_LINEA', label: 'Código', width: 50 },
	{ ID: 'DESC_LINEA', label: 'Descripción', minWidth: 150 },
];
const ColumnSegmento = [
	{ ID: 'COD_CATEGORIA', label: 'Código', width: 50 },
	{ ID: 'DESC_CATEGORIA', label: 'Descripción', minWidth: 150 },
];
const ColumnGrupo = [
	{ ID: 'COD_GRUPO', label: 'Código', width: 50 },
	{ ID: 'DESC_GRUPO', label: 'Descripción', minWidth: 150 },
];
const ColumnImpuesto = [
	{ ID: 'COD_IVA', label: 'Código', width: 50 },
	{ ID: 'DESC_IVA', label: 'Descripción', minWidth: 150 },
];
const ColumnAlmacenaje = [
	{ ID: 'COD_CAT_ALM', label: 'Código', width: 50 },
	{ ID: 'DESC_CAT_ALM', label: 'Descripción', minWidth: 150 },
];
const ColumnSeparacion = [
    { ID: 'COD_CAT_SEP', label: 'Código', width: 50 },
    { ID: 'DESC_CAT_SEP', label: 'Descripción', minWidth: 150 },
];
const notOrderByAccionDet 	= [""];
const TituloList 						= "Artículos";
const FormName 							= "STARTICU";

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

const limpiarBandComponent  = ()=>{
	band_lead_time 		    	= true;
	band_unidad_medida 	    = true;
	band_proveedor 		    	= true;
	band_limite_predido   	= true;
	band_movimiento_stock 	= true;
	band_pack 			   	 		= true;
	band_bloqueo_existencia = true;
	band_norma_palet 				= true;
	band_direccion_fija 		= true;
	band_cantidad_picking 	= true;
	band_acuerdo 		    		= true;
}
const controlaBandera = async () => {
	band_lead_time 	    		= true;
	band_unidad_medida    	= true;
	band_proveedor 	   			= true;
	band_limite_predido			= true;
	band_movimiento_stock 	= true;
	band_pack 			    		= true;
	band_bloqueo_existencia = true;
	band_norma_palet 	    	= true;
	band_direccion_fija 		= true;
	band_cantidad_picking 	= true;
	band_acuerdo 						= true;
}
const maxFocus = [{
	id:"LEAD_TIME",
	hasta:"DIAS_MAXIMO",
	newAddRow:false
}];
const operacion = {
	operac		  : 'suma',
	idSuma		  : ['DIAS_PREV','DIAS_PROD','DIAS_LOG','DIAS_STOCK'],
	resultado	  : 'DIAS_TOTAL',
	IDCOMPONENTE: 'LEAD_TIME'
}
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

var bandPost_Cab_Det = true;
var Indice = 0;
const setIndice = (value) => {
  Indice = value
}
const getIndice = () => {
  return Indice;
}
var Longitud = 0;
const setLongitud = (value) =>{
  Longitud = value;
}
const getLongitud = () => {
  return Longitud;
}
var DataAux  = "";
const setDataAux = (e)=>{
	DataAux = e
}
const data_len = 100;
var banDeleteMoviminetoDet = false

var ValidaInput = [
  {
    input: 'COD_ORIGEN_ART',
    url: url_valida_articulo,
    url_buscar: url_buscar_articulo,
    valor_ant: null,
    out:[
      'DESC_ORIGEN_ART'
    ],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_PAIS_ORIGEN', 
    band:true,
    requerido: false,
  },
  {
    input: 'COD_PAIS_ORIGEN',
    url: url_valida_pais,
    url_buscar: url_buscar_pais,
    valor_ant: null,
    out:[ 'DESC_PAIS_ORIGEN' ],
    data:[],
    rel:[],
    next:'COD_PROVEEDOR_DFLT',
    band:true,
    requerido: false,
  },
	{
    input: 'COD_PROVEEDOR_DFLT',
    url: url_valida_proveedor_dflt,
    url_buscar: url_buscar_proveedor_dflt,
    valor_ant: null,
    out:['DESC_PROVEEDOR'],
    data:['COD_EMPRESA'],
    rel:[],
    next:'COD_RUBRO',
    band:true,
    requerido: false,
  },
	{
    input: 'COD_RUBRO',
    url: url_valida_rubro,
    url_buscar: url_buscar_rubro,
    valor_ant: null,
    out:['DESC_RUBRO'],
    data:['COD_EMPRESA'],
    rel:[],
    next:'COD_FAMILIA',
    band:true,
    requerido: true,
  },
	{
    input: 'COD_FAMILIA',
    url: url_valida_familia,
    url_buscar: url_buscar_familia,
    valor_ant: null,
    out:['DESC_FAMILIA'],
    data:['COD_EMPRESA','COD_RUBRO'],
    rel:[],
    next:'COD_MARCA',
    band:true,
    requerido: true,
  },
	{
    input: 'COD_MARCA',
    url: url_valida_marca,
    url_buscar: url_buscar_marca,
    valor_ant: null,
    out:[
      'DESC_MARCA'
    ],
    data:[
			'COD_EMPRESA'
		],
    rel:[],
    next:'COD_LINEA',
    band:true,
    requerido: true,
  },
	{
    input: 'COD_LINEA',
    url: url_valida_categoria,
    url_buscar: url_buscar_categoria,
    valor_ant: null,
    out:[
      'DESC_LINEA'
    ],
    data:[
			'COD_EMPRESA', 'COD_MARCA'
		],
    rel:[],
    next:'COD_CATEGORIA',
    band:true,
    requerido: true,
  },
	{
    input: 'COD_CATEGORIA',
    url: url_valida_segmento,
    url_buscar: url_buscar_segmento,
    valor_ant: null,
    out:[
      'DESC_CATEGORIA'
    ],
    data:[
			'COD_EMPRESA', 'COD_LINEA'
		],
    rel:[],
    next:'COD_GRUPO',
    band:true,
    requerido: true,
  },
	{
    input: 'COD_GRUPO',
    url: url_valida_grupo,
    url_buscar: url_buscar_grupo,
    valor_ant: null,
    out:[
      'DESC_GRUPO'
    ],
    data:[
			'COD_EMPRESA'
		],
    rel:[],
    next:'COD_BARRA_ART',
    band:true,
    requerido: false,
  },
	{
    input: 'COD_IVA',
    url: url_valida_impuesto,
    url_buscar: url_buscar_impuesto,
    valor_ant: null,
    out:[
      'DESC_IVA'
    ],
    data:[
			'COD_EMPRESA'
		],
    rel:[],
    next:'TIP_PRODUCTO',
    band:true,
    requerido: true,
  },
	{
    input: 'COD_CAT_ALM',
    url: url_valida_almacenaje,
    url_buscar: url_buscar_almacenaje,
    valor_ant: null,
    out:[
      'DESC_CAT_ALM'
    ],
    data:[
			'COD_EMPRESA'
		],
    rel:[],
    next:'COD_CAT_SEP',
    band:true,
    requerido: false,
  },
	{
    input: 'COD_CAT_SEP',
    url: url_valida_separacion,
    url_buscar: url_buscar_separacion,
    valor_ant: null,
    out:[
      'DESC_CAT_SEP'
    ],
    data:[
			'COD_EMPRESA'
		],
    rel:[],
    next:'ESTADO',
    band:true,
    requerido: false,
  },
];
var ArrayPushDelete      = []
const limpiarArrayDelete = () =>{
  ArrayPushDelete = [];
}
var bandNew = false;

const Articulo = memo(() => {

	const buttonSaveRef = React.useRef();
	Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
	Main.useHotkeys('F7', (e) => {
		e.preventDefault();
	});
	
	// cerramos toggle 
	sessionStorage.setItem("toggle-right", "hide");

	const [form] = Form.useForm();
	const defaultOpenKeys 		   = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
	const defaultSelectedKeys    = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
	const PermisoEspecial 		   = getPermisos(FormName);
	const PermisoEspecialWMS 	   = getPermisos('STARTICW');
	// REFERENCIA
	const grid 			   		   		   = useRef();
	const inscripcionRef 	         = useRef();
	const GridUnidadMedida 	 	     = useRef();
	const GridProveedor 		   	   = useRef();
	const GridLimitePedido 		     = useRef();
	const GridMovimientoStockCab   = useRef();
	const GridMovimientoStockDet   = useRef();
	const GridPack 				   			 = useRef();
	const GridBloqueoExistencia    = useRef();
	const GridNormaPalet 		   		 = useRef();
	const GridDireccionFija  	     = useRef();
	const GridCantidadPiking 	     = useRef();
	const GridAcuerdo 			   		 = useRef();
	const GridLeadTime 			   		 = useRef();
	// MENSAJES
	const [ showMessageButton , setShowMessageButton ] = useState(false);
	const [ visibleMensaje    , setVisibleMensaje    ] = useState(false);
	const [ mensaje			  		, setMensaje 		     	 ] = useState();
	const [ imagen			  		, setImagen 		       ] = useState();
	const [ tituloModal		  	, setTituloModal 	     ] = useState();
	// BUSCADORES
	const [ shows			  		  , setShows			 			 ] = useState(false);
	const [ modalTitle		    , setModalTitle		     ] = useState('');
	const [ searchColumns	    , setSearchColumns 	   ] = useState({});
	const [ searchData		    , setSearchData 	     ] = useState([]);
	const [ tipoDeBusqueda	  , setTipoDeBusqueda    ] = useState();
	// ESTADO FORMULARIO
	const [ IsInputBloqued	  , setIsInputBloqued    ] = useState(false);
	const [activarSpinner 	  , setActivarSpinner	   ] = useState(false);
	const [openDatePicker 	  , setdatePicker	       ] = useState(true);
  const initialRow 					   					 = [ { COD_ARTICULO: "COD_ARTICULO" },];
	const initialRowUnidadMedida 		   		 = [ { COD_ARTICULO: "COD_ARTICULO" }, { IND_BASICO: "N" },];
	const initialRowMovimientoDeStockDet   = [ { COD_ARTICULO: "COD_ARTICULO" }, { COD_SUC_REF: "COD_SUC_REF" }];

	const idGrid = {
		ROWS		 		 				 : grid, 
		UNIDAD_MEDIDA 			 : GridUnidadMedida,
		PROVEEDOR			       : GridProveedor,
		LIMITE_PEDIDO		 		 : GridLimitePedido,
		MOVIMIENTO_STOCK_CAB : GridMovimientoStockCab,
		MOVIMIENTO_STOCK_DET : GridMovimientoStockDet,
		PACK				 				 : GridPack,
		BLOQUEO_EXISTENCIA   : GridBloqueoExistencia,
		NORMA_PALET			 		 : GridNormaPalet,
		DIRECCION_FIJA		 	 : GridDireccionFija,
		CANTIDAD_PICKING		 : GridCantidadPiking,
		ACUERDO				 			 : GridAcuerdo, 
		LEAD_TIME			 			 : GridLeadTime,
		columna:{
			UNIDAD_MEDIDA 		   : columns_UnidadMedida,
			PROVEEDOR			 			 : columns_Proveedor,			
			MOVIMIENTO_STOCK_CAB : columns_MovimientoStockCab,
			MOVIMIENTO_STOCK_DET : columns_MovimientoStockDet,
			PACK								 : columns_Pack,
			NORMA_PALET			 		 : columns_NormaPalet,
			DIRECCION_FIJA		 	 : columns_DireccionFija,
			CANTIDAD_PICKING	 	 : columns_CantidadPicking,
			ACUERDO				 			 : columns_Acuerdo, 
		},
		newAdd:{
			UNIDAD_MEDIDA 			 : [{ IND_BASICO  	: "N", IND_VENTA:"N",  MEN_UN_VTA:"N", IDCOMPONENTE:"UNIDAD_MEDIDA",}], 
			PROVEEDOR	  			   : [{ IDCOMPONENTE  : "PROVEEDOR"}],
			MOVIMIENTO_STOCK_CAB : [{ IDCOMPONENTE  : "MOVIMIENTO_STOCK_CAB"}],		
			PACK				 				 : [{ IDCOMPONENTE  : "PACK"}],
			NORMA_PALET			 		 : [{ IDCOMPONENTE  : "NORMA_PALET"}],
			DIRECCION_FIJA		 	 : [{ IDCOMPONENTE  : "DIRECCION_FIJA"}],
			CANTIDAD_PICKING	 	 : [{ IDCOMPONENTE  : "CANTIDAD_PICKING"}],
			ACUERDO				 			 : [{ TIPO		    	: 'M', FEC_VIGENCIA  : Main.moment(), IDCOMPONENTE  : "ACUERDO",}], 
		},
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

	const [tabKey			, setTabKey	  ] = useState("1");
	const [tabKeyWMS	, setTabKeyWMS] = useState("71");
	// CABECERA
	const dataRef = React.useRef({data:[]})
  	
	useEffect(async () => {
		document.getElementById("form-div-1").addEventListener('click', function (e){
			bandNew = false
		});
		
		document.getElementById("form-div-2").addEventListener('click', function (e){
			bandNew = true
		});
		clearForm();
		setTimeout( ()=>{
			initialFormData();
		},10);
	}, []);
	const initialFormData = async ()=>{
		setBloqueoCabecera(false);
		limpiarBandComponent();
		setTabKey("1");
		setTabKeyWMS("71");
		setIndice(0);
		var newKey = uuidID();
		let valor  = {...objeInicial};
		valor.ID								= newKey;
		valor.COD_EMPRESA 			= sessionStorage.getItem('cod_empresa');
		valor.COD_USUARIO 			= sessionStorage.getItem('cod_usuario');
		valor.COD_USUARIO_ALTA	= sessionStorage.getItem('cod_usuario');
		valor.COND_COMPRA				= 'N';
		valor.IND_MED_COMP			= 'N';
		valor.IND_MES						= 'N';
		valor.FEC_ALTA					= Main.moment().format('DD/MM/YYYY H:mm:ss');
		valor.FEC_MODI					= '';
		valor.ESTADO		 				= 'I';
		valor.IND_MANEJA_STOCK	= 'N';
		valor.IND_MANEJA_VTO		= 'N';
		valor.IND_REGIMEN				= 'N';
		valor.IND_COND_VTA			= 'N';
		valor.IND_INPASA				= 'N';
		valor.IND_ESPECIAL			= 'N';
		valor.IND_JNJ					  = 'N';
		valor.ART_ADICIONAL			= 'N';
		valor.ES_PESABLE				= 'N';
		valor.VER_CATASTRO	    = 'N';
		valor.TIP_PRODUCTO	    = 'CVT';		
		valor.insertedDefault   = true;
		
		dataRef.current.data = [valor]
    	setDataAux(JSON.stringify([{...valor}]));
    	form.setFieldsValue({
			...valor,
			ESTADO 			 : valor.ESTADO		 						== 'I' ? false : true,
			IND_MANEJA_STOCK : valor.IND_MANEJA_STOCK	== 'N' ? false : true,
			IND_MANEJA_VTO   : valor.IND_MANEJA_VTO		== 'N' ? false : true,
			IND_REGIMEN      : valor.IND_REGIMEN			== 'N' ? false : true,
			IND_COND_VTA     : valor.IND_COND_VTA			== 'N' ? false : true,
			IND_INPASA       : valor.IND_INPASA				== 'N' ? false : true,
			IND_ESPECIAL     : valor.IND_ESPECIAL			== 'N' ? false : true,
			IND_JNJ          : valor.IND_JNJ					== 'N' ? false : true,
			ART_ADICIONAL    : valor.ART_ADICIONAL		== 'N' ? false : true,
			ES_PESABLE       : valor.ES_PESABLE				== 'N' ? false : true,
			VER_CATASTRO     : valor.VER_CATASTRO	    == 'N' ? false : true,
		});
		
		setTimeout( ()=> {	
			if(tabKey !== '7'){
				manageTabs(tabKey);
			}else{
				manageTabs(tabKeyWMS);
			}
			document.getElementById('DESCRIPCION').focus();
		},30);
		document.getElementById("indice").textContent = "1";
		document.getElementById("total_registro").textContent = "1";
		document.getElementById("mensaje").textContent = "";
	}
	const getDataCab = async() => {
		setActivarSpinner(true);
		try {
			let data = {
				cod_empresa: sessionStorage.getItem('cod_empresa') ,
				cod_articulo       : form.getFieldValue('COD_ARTICULO')       != undefined ? form.getFieldValue('COD_ARTICULO') 	  : '',
				descripcion	       : form.getFieldValue('DESCRIPCION')        != undefined ? form.getFieldValue('DESCRIPCION')  	  : '',
				cod_origen_art 	   : form.getFieldValue('COD_ORIGEN_ART')     != undefined ? form.getFieldValue('COD_ORIGEN_ART')   : '',
				cod_pais_origen    : form.getFieldValue('COD_PAIS_ORIGEN')    != undefined ? form.getFieldValue('COD_PAIS_ORIGEN')  : '',
				cod_proveedor_dflt : form.getFieldValue('COD_PROVEEDOR_DFLT') != undefined ? form.getFieldValue('COD_PROVEEDOR_DFLT') : '',
				cod_rubro 		   	 : form.getFieldValue('COD_RUBRO') 		  		!= undefined ? form.getFieldValue('COD_RUBRO')  		  : '',
				cod_familia 	  	 : form.getFieldValue('COD_FAMILIA') 		  	!= undefined ? form.getFieldValue('COD_FAMILIA')  	  : '',
				cod_marca 		  	 : form.getFieldValue('COD_MARCA') 		  		!= undefined ? form.getFieldValue('COD_MARCA')  	  	: '',
				cod_linea		       : form.getFieldValue('COD_LINEA') 		  		!= undefined ? form.getFieldValue('COD_LINEA')  	  	: '',
				cod_categoria	  	 : form.getFieldValue('COD_CATEGORIA')      != undefined ? form.getFieldValue('COD_CATEGORIA')  	: '',
				cod_grupo	  	   	 : form.getFieldValue('COD_GRUPO') 		  		!= undefined ? form.getFieldValue('COD_GRUPO')  	  	: '',
				cod_barra_art	   	 : form.getFieldValue('COD_BARRA_ART') 	  	!= undefined ? form.getFieldValue('COD_BARRA_ART')  	: '',
				comentario	   	   : form.getFieldValue('COMENTARIO') 	 	  	!= undefined ? form.getFieldValue('COMENTARIO')  	  	: '',
				cantidad_cont	   	 : form.getFieldValue('CANTIDAD_CONT') 	  	!= undefined ? form.getFieldValue('CANTIDAD_CONT')  	: '',
				nro_registro	   	 : form.getFieldValue('NRO_REGISTRO') 	  	!= undefined ? form.getFieldValue('NRO_REGISTRO')  	  : '',
				cod_nomen	 	   		 : form.getFieldValue('COD_NOMEN') 	  	  	!= undefined ? form.getFieldValue('COD_NOMEN')  	    : '',
				inscripcion	   	   : dataRef.current.data[getIndice()]['INSCRIPCION'] 		!= undefined ? dataRef.current.data[getIndice()]['INSCRIPCION'] : '',
				cod_iva			   		 : form.getFieldValue('COD_IVA') 	  	  	  != undefined ? form.getFieldValue('COD_IVA')  	      : '',
				tip_producto	   	 : form.getFieldValue('TIP_PRODUCTO') 	  	!= undefined ? form.getFieldValue('TIP_PRODUCTO')  	  : '',
				cond_compra	   	   : form.getFieldValue('COND_COMPRA') 	  	  != undefined ? form.getFieldValue('COND_COMPRA')  	  : '',
				ind_med_comp	     : form.getFieldValue('IND_MED_COMP') 	  	!= undefined ? form.getFieldValue('IND_MED_COMP')  	  : '',
				ind_mes	   	   	   : form.getFieldValue('IND_MES') 	  	  	  != undefined ? form.getFieldValue('IND_MES')  	  	  : '',
				cant_ped		   		 : form.getFieldValue('CANT_PED') 	  	  	!= undefined ? form.getFieldValue('CANT_PED')  	  	  : '',
				cant_base		   		 : form.getFieldValue('CANT_BASE') 	  	  	!= undefined ? form.getFieldValue('CANT_BASE')  	  	: '',
				cant_volumne	   	 : form.getFieldValue('CANT_VOLUMEN') 	  	!= undefined ? form.getFieldValue('CANT_VOLUMEN')  	  : '',
				cod_cat_alm		   	 : form.getFieldValue('COD_CAT_ALM') 	  	  != undefined ? form.getFieldValue('COD_CAT_ALM')  	  : '',
				cod_cat_sep		   	 : form.getFieldValue('COD_CAT_SEP') 	  	  != undefined ? form.getFieldValue('COD_CAT_SEP')  	  : '',
				estado		  	   	 : form.getFieldValue('ESTADO') 					== true ? 'S' : null,
				ind_maneja_stock   : form.getFieldValue('IND_MANEJA_STOCK') == true ? 'S' : null,
				ind_maneja_vto     : form.getFieldValue('IND_MANEJA_VTO') 	== true ? 'S' : null,
				ind_cond_vta       : form.getFieldValue('IND_COND_VTA') 		== true ? 'S' : null,
				ind_inpasa		   	 : form.getFieldValue('IND_INPASA') 			== true ? 'S' : null,
				ind_especial	   	 : form.getFieldValue('IND_ESPECIAL') 		== true ? 'S' : null,
				ind_jnj			   		 : form.getFieldValue('IND_JNJ') 					== true ? 'S' : null,
				art_adicional	   	 : form.getFieldValue('ART_ADICIONAL') 		== true ? 'S' : null,
				es_pesable		   	 : form.getFieldValue('ES_PESABLE') 			== true ? 'S' : null,
				ver_catastro	   	 : form.getFieldValue('VER_CATASTRO') 		== true ? 'S' : null,

				indice: 0,
				limite: data_len
			}
			return await Main.Request(url_cabecera, "POST", data).then((resp) => {
				let response = resp.data.response.rows;
				if (response.length > 0) {
					// DataAux = JSON.stringify([response[getIndice()]]);
					document.getElementById("total_registro").textContent = response.length;
					if(response.length == 1) document.getElementById("indice").textContent = "1";
					dataRef.current.data = response;
					setDataAux(JSON.stringify([...response]));
					setIndice(0);
					loadForm(response);
					setLongitud(response.length);
					EstadoFormulario('U');
					setActivarSpinner(false);
				}else{
					setActivarSpinner(false);
					Main.message.info({
						content  : `No se han encontrado registros`,
						className: 'custom-class',
						duration : `${2}`,
						style    : {
							marginTop: '2vh',
						},
					});
				}
			});
		} catch (error) {
			console.log(error);
		} 
	}
	const getRecursiveData = async (data, url) => {
		try {
			return await Main.Request(url, "POST", data)
		} catch (error) {
			console.log(error);
      return [];
		}
	}
	const loadForm = async(data) => {
		let Value = data[getIndice()]
		if(Value == undefined) Value = await data[0]
		var fecha = null;
	
		if(Value.INSCRIPCION !== null && Value.INSCRIPCION !== undefined && Value.INSCRIPCION !== ""){
			let result = Main.moment(Value.INSCRIPCION, 'DD/MM/YYYY',true).isValid();
			if(result){
				fecha  = Main.moment(Value.INSCRIPCION,'DD/MM/YYYY').format('DD/MM/YYYY')
			}else{
				fecha  = Main.moment(Value.INSCRIPCION,'DD/MM/YYYY')
			}
		}		
		form.setFieldsValue({
			...Value,
			["ESTADO"		  		 ]: Value.ESTADO 					 == "A" ? true : false,
			["IND_MANEJA_STOCK"]: Value.IND_MANEJA_STOCK == "S" ? true : false,
			["IND_MANEJA_VTO"  ]: Value.IND_MANEJA_VTO 	 == "S" ? true : false,
			["IND_COND_VTA"	   ]: Value.IND_COND_VTA 		 == "S" ? true : false,
			["IND_INPASA"	     ]: Value.IND_INPASA 		   == "S" ? true : false,
			["IND_ESPECIAL"	   ]: Value.IND_ESPECIAL 		 == "S" ? true : false,
			["IND_JNJ"		     ]: Value.IND_JNJ 		 		 == "S" ? true : false,
			["ART_ADICIONAL"   ]: Value.ART_ADICIONAL 	 == "S" ? true : false,
			["IND_REGIMEN"     ]: Value.IND_REGIMEN      == "S" ? true : false,
			["ES_PESABLE"      ]: Value.ES_PESABLE 		   == "S" ? true : false,
			["VER_CATASTRO"    ]: Value.VER_CATASTRO 	   == "S" ? true : false,
			["INSCRIPCION"     ]: fecha == null ? fecha : Main.moment(fecha, 'DD/MM/YYYY'),
			["COSTO_ULTIMO_GS" ]: currency(Value.COSTO_ULTIMO_GS, { separator:'.',decimal:',',precision:0,symbol:'' } ).format(),
			["COSTO_PROM_GS"   ]: currency(Value.COSTO_PROM_GS  , { separator:'.',decimal:',',precision:0,symbol:'' } ).format(),
			["FEC_ALTA"		     ]: Value.FEC_ALTA 		 != null || Value.FEC_ALTA != undefined ? Main.moment(Value.FEC_ALTA).format('DD/MM/YYYY H:mm:ss') : "",
			["FEC_MODI"		     ]: Value.FEC_MODI 		 != null || Value.FEC_MODI != undefined ? Main.moment(Value.FEC_MODI).format('DD/MM/YYYY H:mm:ss') : "",
		});
		
		if(tabKey !== "7"){
			var row = data[getIndice()]
			if( id_cabecera !== row.ID ){
				id_cabecera = row.ID;
				await controlaBandera();
			}
			manageTabs(tabKey);
		}else{
			var row = data[getIndice()]
			if( id_cabecera !== row.ID ){
				id_cabecera  = row.ID;
				controlaBandera();
			}
			manageTabs(tabKeyWMS);
		}
	}
	const handleKeyDown = async(e) => {
		// f7
		if(e.keyCode == 118){
			e.preventDefault();
			setIndice(0);
			ManejaF7();
			setTimeout( ()=> { document.getElementById(e.target.id).focus() }, 800 );
		}
		// f8
		if(e.keyCode == 119){
			e.preventDefault();
			if(!getBloqueoCabecera()){
				controlaBandera();
				Main.setModifico(FormName);
				getDataCab();
			}else{
				setShowMessageButton(true)
				showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
			}
		}

		if(e.keyCode == 40 && e.target.id =="INSCRIPCION") e.preventDefault(), rightData();
		else if(e.keyCode == 40) e.preventDefault()
		if(e.keyCode == 38 && e.target.id =="INSCRIPCION") e.preventDefault(), leftData();
		else if(e.keyCode == 38) e.preventDefault()

		if(e.keyCode == 13 || e.keyCode == 9){
			e.preventDefault();
			if(e.target.id == 'COD_ARTICULO')  document.getElementById('DESCRIPCION').focus();
			if(e.target.id == 'DESCRIPCION')   if(e.target.value !== "") document.getElementById('COD_ORIGEN_ART').focus();
			if(e.target.id == 'COD_BARRA_ART') document.getElementById('CANTIDAD_CONT').focus();
			if(e.target.id == 'CANTIDAD_CONT') document.getElementById('COMENTARIO').focus();
			if(e.target.id == 'COMENTARIO')    document.getElementById('NRO_REGISTRO').focus();
			if(e.target.id == 'NRO_REGISTRO'){		
				let res = document.getElementsByClassName('ant-picker-dropdown');
				res[0].classList.remove(Ocultar_classDataPiker_1);
				res[0].classList.remove(Ocultar_classDataPiker_2);
				inscripcionRef.current.focus();
			}
			if(e.target.id == 'INSCRIPCION') document.getElementById('COD_NOMEN').focus();
			if(e.target.id == 'COD_NOMEN') document.getElementById('IND_REGIMEN').focus();
			if(e.target.id == 'IND_REGIMEN') document.getElementById('COD_IVA').focus();
			if(e.target.id == 'TIP_PRODUCTO') document.getElementById('COND_COMPRA_N').focus();
			if(e.target.id == 'COND_COMPRA_N' || e.target.id == 'COND_COMPRA_E' || e.target.id == 'COND_COMPRA_I')document.getElementById('IND_MED_COMP_N').focus();
			if(e.target.id == 'IND_MED_COMP_N' || e.target.id == 'IND_MED_COMP_P' || e.target.id == 'IND_MED_COMP_T' || e.target.id == 'IND_MED_COMP_V') document.getElementById('IND_MES_N').focus();
			if(e.target.id == 'IND_MES_N' || e.target.id == 'IND_MES_P' || e.target.id == 'IND_MES_I') document.getElementById('CANT_PED').focus();
			if(e.target.id == 'CANT_PED') document.getElementById('CANT_BASE').focus();
			if(e.target.id == 'CANT_BASE') document.getElementById('CANT_VOLUMEN').focus();
			if(e.target.id == 'CANT_VOLUMEN') document.getElementById('COD_CAT_ALM').focus();
			if(e.target.id == 'ESTADO') document.getElementById('IND_MANEJA_STOCK').focus();
			if(e.target.id == 'IND_MANEJA_STOCK') document.getElementById('IND_MANEJA_VTO').focus();
			if(e.target.id == 'IND_MANEJA_VTO') document.getElementById('IND_COND_VTA').focus();
			if(e.target.id == 'IND_COND_VTA') document.getElementById('IND_INPASA').focus();
			if(e.target.id == 'IND_INPASA') document.getElementById('IND_ESPECIAL').focus();
			if(e.target.id == 'IND_ESPECIAL') document.getElementById('IND_JNJ').focus();
			if(e.target.id == 'IND_JNJ') document.getElementById('ART_ADICIONAL').focus();
			if(e.target.id == 'ART_ADICIONAL') document.getElementById('ES_PESABLE').focus();
			if(e.target.id == 'ES_PESABLE') document.getElementById('VER_CATASTRO').focus();
			if(e.target.id == 'VER_CATASTRO') document.getElementById('COD_ALTERNO').focus();
			if(e.target.id == 'COD_ALTERNO') document.getElementById('NRO_ORDEN').focus();
			if(e.target.id == 'NRO_ORDEN'){
				var idComponetFocus = await componenteEliminar;
				idGrid[idComponetFocus.id].current?.instance.focus(idGrid[idComponetFocus.id].current?.instance.getCellElement(0,0))
			} 
			
			if(	
				e.target.id == 'COD_ORIGEN_ART'     || 
				e.target.id == 'COD_PAIS_ORIGEN'    ||
				e.target.id == 'COD_PROVEEDOR_DFLT' ||
				e.target.id == 'COD_RUBRO'          ||
				e.target.id == 'COD_FAMILIA'        ||          
				e.target.id == 'COD_MARCA'          ||          
				e.target.id == 'COD_LINEA'          ||          
				e.target.id == 'COD_CATEGORIA'      ||          
				e.target.id == 'COD_GRUPO'          ||
				e.target.id == 'COD_IVA'            ||
				e.target.id == 'COD_CAT_ALM'        ||
				e.target.id == 'COD_CAT_SEP'
			) ValidarUnico(e.target.id);
		}
		if(e.keyCode == '120'){
			e.preventDefault();
			setTipoDeBusqueda(e.target.id);
			let aux = '';
			switch(e.target.id){
				case "COD_ORIGEN_ART":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_articulo );
					setModalTitle("Articulo");
					setSearchColumns(ColumnArticulo);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_PAIS_ORIGEN":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_pais);
					setModalTitle("Pais");
					setSearchColumns(ColumnPais);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_PROVEEDOR_DFLT":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_proveedor_dflt);
					setModalTitle("Proveedor");
					setSearchColumns(ColumnProveedor);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_RUBRO":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_rubro);
					setModalTitle("Rubro");
					setSearchColumns(ColumnRubro);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_FAMILIA":
					aux = await getData( {'cod_empresa':sessionStorage.getItem('cod_empresa'), 
										  'cod_rubro'  :form.getFieldValue('COD_RUBRO')
										 }, url_buscar_familia);
					setModalTitle("Familia");
					setSearchColumns(ColumnFamilia);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_MARCA":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_marca);
					setModalTitle("Marca");
					setSearchColumns(ColumnMarca);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_LINEA":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa'), cod_marca: form.getFieldValue('COD_MARCA') }, url_buscar_categoria);
					setModalTitle("Categoria");
					setSearchColumns(ColumnCategoria);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_CATEGORIA":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa'), cod_linea: form.getFieldValue('COD_LINEA') }, url_buscar_segmento);
					setModalTitle("Segmento");
					setSearchColumns(ColumnSegmento);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_GRUPO":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_grupo);
					setModalTitle("Grupo");
					setSearchColumns(ColumnGrupo);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_IVA":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_impuesto);
					setModalTitle("Impuesto");
					setSearchColumns(ColumnImpuesto);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_CAT_ALM":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_almacenaje);
					setModalTitle("Almacenaje");
					setSearchColumns(ColumnAlmacenaje);
					setSearchData(aux);
					setShows(true);
				break;
				case "COD_CAT_SEP":
					aux = await getData( {cod_empresa: sessionStorage.getItem('cod_empresa')}, url_buscar_separacion);
					setModalTitle("Separación");
					setSearchColumns(ColumnSeparacion);
					setSearchData(aux);
					setShows(true);
				break;
				default:
					break;
			}
		}
	}
	const handleKeyUp = async(e) => {
		if(e.keyCode == 40){
			e.preventDefault();
			rightData();
		}
		if(e.keyCode == 38){
			e.preventDefault();
			leftData();
		}
	}
	const clearForm = async() =>{ 
		Main.setModifico(FormName)
		form.resetFields();
		form.setFieldsValue(objeInicial);
		QuitarClaseRequerido();
		limpiarArrayDelete();
	}
	const EstadoFormulario = async (value) => {
		if(value === 'I'){
		  setIsInputBloqued(false);
		}else{
		  setIsInputBloqued(true);
		}
	}
	const ManejaF7 = async(eventband) =>{
		if(!getBloqueoCabecera()){
			//  F7
			dataRef.current.data = await []
			await controlaBandera();
			limpiarBandComponent();
			limpiarArrayDelete();
			banDeleteMoviminetoDet = false;
			EstadoFormulario('I');
			clearForm();
			var newKey = uuidID();
			let valor  = {...objeInicial};
			valor.ID 			    		= newKey;
			valor.COD_ARTICULO		= '';
			valor.COD_EMPRESA 		= sessionStorage.getItem('cod_empresa');
			valor.COD_USUARIO 		= sessionStorage.getItem('cod_usuario');
			valor.inserted				= true;
			dataRef.current.data 	= [valor]
			setDataAux(JSON.stringify([{...valor}]))			
			form.setFieldsValue({
				...valor,
				ESTADO: 						valor.ESTADO 		       == '' || valor.ESTADO == null ? false : true,
				IND_MANEJA_STOCK: 	valor.IND_MANEJA_STOCK == '' || valor.IND_MANEJA_STOCK == null ? false : true,
				IND_MANEJA_VTO:	 		valor.IND_MANEJA_VTO   == '' || valor.IND_MANEJA_VTO == null ? false : true,
				IND_COND_VTA: 			valor.IND_COND_VTA 	   == '' || valor.IND_COND_VTA == null ? false : true,
				IND_INPASA: 				valor.IND_INPASA       == '' || valor.IND_INPASA == null ? false : true,
				IND_ESPECIAL: 			valor.IND_ESPECIAL     == '' || valor.IND_ESPECIAL == null ? false : true,
				IND_JNJ: 						valor.IND_JNJ 		     == '' || valor.IND_JNJ == null ? false : true,
				ART_ADICIONAL: 			valor.ART_ADICIONAL    == '' || valor.ART_ADICIONAL == null ? false : true,
				ES_PESABLE: 				valor.ES_PESABLE 	   	 == '' || valor.ES_PESABLE == null ? false : true,
				VER_CATASTRO: 		  valor.VER_CATASTRO 	   == '' || valor.VER_CATASTRO == null ? false : true,
				VER_CATASTRO: 			valor.VER_CATASTRO 	   == '' || valor.VER_CATASTRO == null ? false : true
			});	
			document.getElementById("indice").textContent 		   = 1;
			document.getElementById("total_registro").textContent = 1;
			setLongitud(1);
			bandNew = false;
			setTimeout( ()=> {
				if(tabKey !== '7'){
					manageTabs(tabKey,true)
				}else{
					manageTabs(tabKeyWMS)
				} 
			},15);
			if(eventband){
				setIndice(0)
				setTimeout(()=>document.getElementById('DESCRIPCION').focus(),110);
			}
		}else{
			setTimeout(() => {
				setShowMessageButton(true)
				showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');	
			},15);
		}
	}
	// MANEJA DIRECCIONES
	const NavigateArrow = (id) => {
		if(id == 'left'){
			if(dataRef.current.data.length > 1) leftData();
		}else{
			if(dataRef.current.data.length > 1) rightData();
		} 
	}
	const leftData = async() => {
		if(!getBloqueoCabecera()){
			var index = Indice - 1;
			if(index < 0){
				index = 0;
				document.getElementById("mensaje").textContent = "Haz llegado al primer registro";
			}else{
				document.getElementById("mensaje").textContent = "";
			}
			document.getElementById("indice").textContent = index + 1;
			setIndice(index);
			var row = dataRef.current.data[getIndice()]
			if( id_cabecera !== row.ID ){
				id_cabecera = row.ID;
				await controlaBandera();
			}
			loadForm(dataRef.current.data);
			EstadoFormulario('U');
			QuitarClaseRequerido();
		}else{
			setShowMessageButton(true)
			showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
		}
	}
	const rightData = async() => {
		if(!getBloqueoCabecera()){
			if(dataRef.current.data.length !== 1){
				var index = Indice + 1;
				if(index > getLongitud()-1 ){
					index 	 = getLongitud()-1;
					document.getElementById("mensaje").textContent = "Haz llegado al ultimo registro";
					setActivarSpinner(true)
					if(bandPost_Cab_Det){
						bandPost_Cab_Det = false;
						await getRecursiveData( { cod_empresa: sessionStorage.getItem('cod_empresa'), indice: getLongitud() + 1, limite: getLongitud() + data_len  }, url_cabecera)
						.then(resp => {
							let response = resp.data.response.rows;
							setLongitud( [ ...dataRef.current.data, ...response ].length );
							bandPost_Cab_Det = true;
							document.getElementById("total_registro").textContent = [ ...dataRef.current.data, ...response ].length;
							document.getElementById("mensaje").textContent = "";
							dataRef.current.data = [ ...dataRef.current.data, ...response ]
							setDataAux(JSON.stringify([...dataRef.current.data]));
							setIndice(index);
							document.getElementById("indice").textContent = index + 1;
							loadForm(dataRef.current.data);
							EstadoFormulario('U');
							// ***
							setActivarSpinner(false);
						})
					}
				}else{
					document.getElementById("indice").textContent = index + 1;
					setIndice(index);
					
					var row = dataRef.current.data[getIndice()]
					if( id_cabecera !== row.ID ){
						id_cabecera  = row.ID;
						await controlaBandera();
					}
					loadForm(dataRef.current.data);
					setActivarSpinner(false);
					EstadoFormulario('U');
					
				}
			}else{
				document.getElementById("mensaje").textContent = "";
			}
			QuitarClaseRequerido();
		}else{
			setShowMessageButton(true)
		showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
		}
	}
	// CABECERA
	const getData = async (data, url) => {
		try {
			return await Main.Request(url, "POST", data).then( resp => { return resp.data.rows });
		} catch (error) {
			console.log(error);
      return [];
		}
	};
	const manageTabs = async(value,f7) =>{
		switch (value) {
			case "1":
				setComponenteEliminarDet({id:"UNIDAD_MEDIDA",delete:false})
				if(band_unidad_medida || f7){
					var content = [];
					var info = await Main.Request('/st/starticu_new/unidad_medida','POST',{
						cod_empresa : sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});		
					
					if(info.data.rows?.length == 0 || info.data.rows == undefined){
					
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : form.getFieldValue('ID'),
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							IND_BASICO    : "N",
							IND_VENTA     : "N",
							MEN_UN_VTA    : "N",
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
							InsertDefault : true,
							IDCOMPONENTE  : "UNIDAD_MEDIDA",
						}]
					}else{
						content = info.data.rows;
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
					setTimeout(()=>{
						GridUnidadMedida.current?.instance.option('focusedRowIndex', 0);
					},30)
				}else{
					setFocusIDComponent(GridUnidadMedida,"UNIDAD_MEDIDA")
					setColumnRequerido(columns_UnidadMedida)
				}
				// LEAD TIME
				if(band_lead_time || f7){
					let content2 = [];
					let info2 = await Main.Request('/st/starticu_new/lead_time','POST',{
						cod_empresa : sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info2.data.rows?.length == 0 || info2.data.rows == undefined){
						var newKey = uuidID();
						content2 = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : form.getFieldValue('ID'),
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
							InsertDefault : true,
							IDCOMPONENTE  : "LEAD_TIME",
						}]
					}else{
						content2 = info2.data.rows
					}
					const dataSource_LeadTime = new DataSource({
						store: new ArrayStore({
							data: content2,
						}),
						key: 'ID'
					})
					GridLeadTime.current.instance.option('dataSource', dataSource_LeadTime);
					cancelarLeadTime = JSON.stringify(content2);
					band_lead_time = false;
				}
				break;
			case "2":
				setComponenteEliminarDet({id:"PROVEEDOR",delete:true})
				if(band_proveedor){
					// BUSCAR PROVEEDOR
					var content = [];
					var info = await Main.Request('/st/starticu_new/proveedor','POST',{
						cod_empresa : sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){

						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
							InsertDefault : true,
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
					setTimeout(()=>{
						GridProveedor.current?.instance.option('focusedRowIndex', 0);
					},30)
				}else{
					setFocusIDComponent(GridProveedor,"PROVEEDOR")
					setColumnRequerido(columns_Proveedor)
				}
			break;
			case "3":
				setComponenteEliminarDet({id:"LIMITE_PEDIDO",delete:false})
				if(band_limite_predido || f7){
					// BUSCAR LIMITE POR PEDIDO
					var content = [];
					var info = await Main.Request('/st/starticu_new/limite_pedido','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length !== 0){
						setFocusIDComponent(GridLimitePedido,"LIMITE_PEDIDO")
						cancelarLimitePorPedido = JSON.stringify(info.data.rows);
						const dataSource_LimitePedido = new DataSource({
							store: new ArrayStore({
								data: info.data.rows,
							}),
							key: 'ID'
						})
						GridLimitePedido.current.instance.option('dataSource', dataSource_LimitePedido);
						setTimeout(()=>{
							GridLimitePedido.current?.instance.option('focusedRowIndex', 0);
						},30)
					}else{
						const dataSource_LimitePedido = new DataSource({
							store: new ArrayStore({
								data: [],
							}),
							key: 'ID'
						})
						GridLimitePedido.current.instance.option('dataSource', dataSource_LimitePedido);
					}
					band_limite_predido = false;
				}else{
					setFocusIDComponent(GridLimitePedido,"LIMITE_PEDIDO")
					setColumnRequerido(columns_LimitePedido)
				}
				break;
			case "4":
				setComponenteEliminarDet({id:"MOVIMIENTO_STOCK_CAB",delete:true})
				if(band_movimiento_stock){
					var content = [];
					var info = await Main.Request('/st/starticu_new/movimiento_stock_cab','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
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
						GridMovimientoStockCab.current?.instance.option('focusedRowIndex', 0);
					},100)
					band_movimiento_stock = false;
				}else{
					setFocusIDComponent(GridMovimientoStockCab,"MOVIMIENTO_STOCK_CAB")
					setColumnRequerido(columns_MovimientoStockCab)
				}
				break;
			case "5":
				setComponenteEliminarDet({id:"PACK",delete:true})
				if(band_pack){
					// BUSCAR PACK
					var content = [];
					var info = await Main.Request('/st/starticu_new/pack','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
							InsertDefault : true,
							IDCOMPONENTE  : "PACK",
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
					setTimeout(()=>{
						GridPack.current?.instance.option('focusedRowIndex', 0);
					},30)
				}else{
					setFocusIDComponent(GridPack,"PACK")
					setColumnRequerido(columns_Pack)
				}
				break;
			case "6":
				setComponenteEliminarDet({id:"BLOQUEO_EXISTENCIA",delete:false})
				if(band_bloqueo_existencia || f7){
					// BUSCAR BLOQUEO DE EXISTENCIA
					var content = [];
					var info = await Main.Request('/st/starticu_new/bloqueo_existencia','POST',{
						cod_empresa : sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});

					if(!info.data.rows.length == 0){
						content = info.data.rows

						setFocusIDComponent(GridBloqueoExistencia,"BLOQUEO_EXISTENCIA")
						cancelarBloqueoExistencia = JSON.stringify(content)
						const dataSource_BloqueoExistencia = new DataSource({
							store: new ArrayStore({
								data: content,
							}),
							key: 'ID'
						})
						GridBloqueoExistencia.current.instance.option('dataSource', dataSource_BloqueoExistencia);
						setTimeout(()=>{
							GridBloqueoExistencia.current?.instance.option('focusedRowIndex', 0);
						},30)
					}else{
						const dataSource_BloqueoExistencia = new DataSource({
							store: new ArrayStore({
								data: [],
							}),
							key: 'ID'
						})
						GridBloqueoExistencia.current.instance.option('dataSource', dataSource_BloqueoExistencia);
					}
					band_bloqueo_existencia= false;
				}else{
					setFocusIDComponent(GridBloqueoExistencia,"BLOQUEO_EXISTENCIA")
					setColumnRequerido(columns_BloqueoExistencia)
				}
				break;
			case "7":
				setComponenteEliminarDet({id:"NORMA_PALET",delete:true})
				if(band_norma_palet){
					// BUSCAR NORMA PALET
					var content = [];
					var info = await Main.Request('/st/starticu_new/norma_palet','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var newKey = uuidID();
						content = [ {
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
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
					setTimeout(()=>{
						GridNormaPalet.current?.instance.option('focusedRowIndex', 0);
					},30)
					band_norma_palet = false;
				}else{
					setFocusIDComponent(GridNormaPalet,"NORMA_PALET")
					setColumnRequerido(columns_NormaPalet)
				}
			break;
			case "71":
				setComponenteEliminarDet({id:"NORMA_PALET",delete:true})
				if(band_norma_palet ){
					// BUSCAR NORMA PALET
					var content = [];
					var info = await Main.Request('/st/starticu_new/norma_palet','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var newKey = uuidID();
						content = [ {
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID ,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
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
					setTimeout(()=>{
						GridNormaPalet.current?.instance.option('focusedRowIndex', 0);
					},30)
				}else{
					setFocusIDComponent(GridNormaPalet,"NORMA_PALET")
					setColumnRequerido(columns_NormaPalet)
				}
				break;
			case "72":
				setComponenteEliminarDet({id:"DIRECCION_FIJA",delete:true})
				if(band_direccion_fija){
					// BUSCAR DIRECCION FIJA
					var content = [];
					var info = await Main.Request('/st/starticu_new/direccion_fija','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});					
					if(info.data.rows.length == 0){
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
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
					setTimeout(()=>{
						GridDireccionFija.current?.instance.option('focusedRowIndex', 0);
					},30)
					band_direccion_fija = false;
				}else{
					setFocusIDComponent(GridDireccionFija,"DIRECCION_FIJA")
					setColumnRequerido(columns_DireccionFija)
				}			
				break;
			case "73":
				setComponenteEliminarDet({id:"CANTIDAD_PICKING",delete:true})
				 if(band_cantidad_picking){
					// BUSCAR CANTIDAD PICKING
					var content = [];
					var info = await Main.Request('/st/starticu_new/cantidad_picking','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){						
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
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
					setTimeout(()=>{
						GridCantidadPiking.current?.instance.option('focusedRowIndex', 0);
					},50)
					band_cantidad_picking = false;
				}else{
					setFocusIDComponent(GridCantidadPiking,"CANTIDAD_PICKING")
					setColumnRequerido(columns_CantidadPicking)
				}
				break;
			case "74":
				setComponenteEliminarDet({id:"ACUERDO",delete:true})
				if(band_acuerdo){
					// BUSCAR ACUERDO
					var content = [];
					var info = await Main.Request('/st/starticu_new/acuerdo','POST',{
						cod_empresa: sessionStorage.getItem("cod_empresa"),
						cod_articulo: form.getFieldValue('COD_ARTICULO')
					});
					if(info.data.rows.length == 0){
						var newKey = uuidID();
						content = [{
							ID	          : newKey,
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : row.ID,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
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
					setTimeout(()=>{
						GridAcuerdo.current?.instance.option('focusedRowIndex', 0);
					},30)
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
	const guardar = async () => {
		var exitInsertedBand 	   = false;
		var permisoActualizacion = false;

		// GET ARTICULO
		var articuloData = dataRef.current.data;
		articuloData	 = articuloData.filter( item =>{
			if(item.inserted || item.updated){
				if(item.inserted){
					exitInsertedBand = true
					if(item.COND_COMPRA  == ''  || item.COND_COMPRA  == undefined || item.COND_COMPRA  == null) item.COND_COMPRA  = 'N';
					if(item.IND_MED_COMP == ''  || item.IND_MED_COMP == undefined || item.IND_MED_COMP == null) item.IND_MED_COMP = 'N';
					if(item.IND_MES 		 == ''  || item.IND_MES 		 == undefined || item.IND_MES      == null) item.IND_MES			= 'N';
				} 
				return item
			}
		});
		
		// UNIDAD DE MEDIDA
		var UnidadMedidaData = []
		if(GridUnidadMedida.current !== undefined) UnidadMedidaData = GridUnidadMedida.current.instance.getDataSource()?._items;
		var band = false
		for (let index = 0; index < articuloData.length; index++) {
			const element = articuloData[index];
			if(band) break
			if(element.inserted == true){
				for (let i = 0; i < UnidadMedidaData.length; i++) {
					const items = UnidadMedidaData[i];
					if(items.InsertDefault || items.inserted){
					   items.InsertDefault = false;
					   items.inserted 	   = true;
					   band = true;
					   break
					}
				}
			}
		}

		// LEADTIME
		var LeadTimeData = [];
		if(GridLeadTime.current !== undefined) LeadTimeData = GridLeadTime.current.instance.getDataSource()._items;

		// PROVEEDOR
		var ProveedorData = []
		if(GridProveedor.current !== undefined) ProveedorData = GridProveedor.current.instance.getDataSource()?._items;

		//	LIMITE POR PEDIDO
		var limitePorPedidoData = [];
		if(GridLimitePedido.current != undefined){
			GridLimitePedido.current.instance.getDataSource() !== null ? limitePorPedidoData = GridLimitePedido.current.instance.getDataSource()._items : [];
		}

		// MOVIMIENTO DE STOCK CAB
		var MovimientoStockCabData = [];
		if(GridMovimientoStockCab.current != undefined) MovimientoStockCabData = GridMovimientoStockCab.current.instance.getDataSource()._items;

		// MOVIMIENTO DE STOCK DET
		var MovimientoStockDetData = [];
		if(GridMovimientoStockDet.current !== undefined){
			GridMovimientoStockDet.current.instance.getDataSource() !== null ? MovimientoStockDetData = GridMovimientoStockDet.current.instance.getDataSource()._items : [];
		}

		// PACK
		var PackData = []
		if(GridPack.current !== undefined) PackData = GridPack.current.instance.getDataSource()._items;

		// BLOQUEO DE EXISTENCIA
		var BloqueoDeExistenciaData = []
		if(GridBloqueoExistencia.current != undefined){
			GridBloqueoExistencia.current.instance.getDataSource() !== null ? BloqueoDeExistenciaData = GridBloqueoExistencia.current.instance.getDataSource()._items : []
		};

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

		// -------------------------------------- VALIDADOR -----------------------------------------------------------------
		QuitarClaseRequerido();
		let verificar_input_requerido = ValidarCamposRequeridos();
		if(!verificar_input_requerido)return

		var datosValidar = {
			id:[{ 
				ROWS:grid, 
				UNIDAD_MEDIDA:GridUnidadMedida,
				PROVEEDOR:GridProveedor,
				LIMITE_PEDIDO: GridLimitePedido, 
				PACK: GridPack,
				BLOQUEO_EXISTENCIA: GridBloqueoExistencia,
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
				NORMA_PALET: columns_NormaPalet,
				DIRECCION_FIJA: columns_DireccionFija,
				CANTIDAD_PICKING: columns_CantidadPicking,
				ACUERDO: columns_Acuerdo, 
			}],
			datos:[{ 
				ROWS:articuloData, 
				UNIDAD_MEDIDA:UnidadMedidaData,
				PROVEEDOR:ProveedorData,
				PACK: PackData,
				NORMA_PALET: NormaPaletData,
				DIRECCION_FIJA: DireccionFijaData,
				CANTIDAD_PICKING: CantidadPikingData,
				ACUERDO: AcuerdoData, 
			}],
			adicionalRequerido:['COD_RUBRO','COD_FAMILIA','COD_MARCA','COD_LINEA','COD_CATEGORIA','COD_IVA']
		}
		const valor = await ValidarColumnasRequeridas(datosValidar);
		if(valor) return;

		// ------------------------------------------------------------------------------------------------------------------

		// FILTER DE ARTICULO
		let infoCabecera 		   = await Main.GeneraUpdateInsertCab(dataRef.current.data, 'COD_ARTICULO', url_cod_articulo,false,true);
		var aux_Cabecera 		   = infoCabecera.rowsAux;
		var update_insert_cabecera = infoCabecera.updateInsert;
		permisoActualizacion       = infoCabecera.actualizar;
		
		// FILTER UNIDADA DE MEDIA
		
		var unidad_medida = UnidadMedidaData
		var dependencia_unidad_medida = [{'COD_UNIDAD_REL':'COD_UNIDAD_REL_ANT'},{'IND_BASICO':'IND_BASICO_ANT'}];
		var infoUnidadMedida 			= await Main.GeneraUpdateInsertDet(unidad_medida,['COD_UNIDAD_REL'], update_insert_cabecera, dependencia_unidad_medida,"COD_ARTICULO");
		var aux_unidad_medida  			= infoUnidadMedida.rowsAux;
		if(!permisoActualizacion) permisoActualizacion = infoUnidadMedida.actualizar;
		var update_insert_unidad_medida = infoUnidadMedida.updateInsert;
		
		// FILTER LEADTIME
		var lead_time = LeadTimeData
		var dependencia_lead_time = [];
		var infoTimeData 			= await Main.GeneraUpdateInsertDet(lead_time,['DIAS_TOTAL'],update_insert_cabecera, dependencia_lead_time,"COD_ARTICULO");
		var aux_lead_time 			= infoTimeData.rowsAux;
		if(!permisoActualizacion) permisoActualizacion = infoTimeData.actualizar;
		var update_insert_lead_time = infoTimeData.updateInsert;
		
		// FILTER PROVEEDOR
		var Proveedor = ProveedorData
		var dependencia_proveedor 	= [{'COD_PROVEEDOR': 'COD_PROVEEDOR_ANT'}];
		var infoProveedor			= await Main.GeneraUpdateInsertDet(Proveedor,['COD_PROVEEDOR'], update_insert_cabecera, dependencia_proveedor,"COD_ARTICULO");
		var aux_proveedor 			= infoProveedor.rowsAux;
		var update_insert_proveedor = infoProveedor.updateInsert;
		if(!permisoActualizacion) 	permisoActualizacion = infoProveedor.actualizar;
		var delete_proveedor 		= ArrayPushDelete.PROVEEDOR != undefined ? ArrayPushDelete.PROVEEDOR : [];
			
		// FILTER LIMITE POR PEDIDO
		var limite_pedido = limitePorPedidoData
		var infolimitePorPedido 		= await Main.GeneraUpdateInsertDet(limite_pedido,['COD_DEPOSITO'], update_insert_cabecera, [],"COD_ARTICULO");
		var aux_limite_pedido           = infolimitePorPedido.rowsAux;
		var update_insert_limite_pedido = infolimitePorPedido.updateInsert;

		// FILTER MOVIMIENTO DE STOCK CAB
		let movimiento_stock_cab = MovimientoStockCabData
		var dependencia_movimiento_stock_cab = [{ 'COD_SUCURSAL': 'COD_SUCURSAL_ANT'}];
		let info_movimiento_stock_cab 		   = await Main.GeneraUpdateInsertDet(movimiento_stock_cab,['COD_SUCURSAL'],update_insert_cabecera, dependencia_movimiento_stock_cab,"COD_ARTICULO");
		var aux_movimiento_stock_cab 		   = info_movimiento_stock_cab.rowsAux;
		var update_insert_movimiento_stock_cab = info_movimiento_stock_cab.updateInsert;
		if(!permisoActualizacion) permisoActualizacion = info_movimiento_stock_cab.actualizar;
		var delete_movimiento_stock_cab 	   = ArrayPushDelete.MOVIMIENTO_STOCK_CAB != undefined ? ArrayPushDelete.MOVIMIENTO_STOCK_CAB : [];

		// FILTER MOVIMIENTO DE STOCK DET
		var movimiento_stock_det = MovimientoStockDetData
		var dependencia_movimiento_stock_det   = [ {'COD_SUCURSAL':'COD_SUCURSAL_ANT'}, {'COD_SUC_REF':'COD_SUC_REF_ANT'}];
		let info_movimiento_stock_det 		   = await Main.GeneraUpdateInsertDet(movimiento_stock_det,['COD_SUCURSAL'],update_insert_cabecera, dependencia_movimiento_stock_det,"COD_ARTICULO");
		var aux_movimiento_stock_det 		   = info_movimiento_stock_det.rowsAux;
		var update_insert_movimiento_stock_det = info_movimiento_stock_det.updateInsert;
		if(!permisoActualizacion) permisoActualizacion = info_movimiento_stock_det.actualizar;
		var delete_movimiento_stock_det 	   = ArrayPushDelete.MOVIMIENTO_STOCK_DET != undefined ? ArrayPushDelete.MOVIMIENTO_STOCK_DET : [];
	
		// FILTER PACK
		var pack 			   = PackData
		var dependencia_pack   = [{'COD_ARTICULO_REF': 'COD_ARTICULO_REF_ANT'}];
		var infoPack 		   = await Main.GeneraUpdateInsertDet(pack,['COD_ARTICULO_REF'],update_insert_cabecera, dependencia_pack,"COD_ARTICULO");
		var aux_pack 		   = infoPack.rowsAux;
		var update_insert_pack = infoPack.updateInsert;
		var delete_pack 	   = ArrayPushDelete.PACK != undefined ? ArrayPushDelete.PACK : [];

		// FILTER BLOQUEO DE EXISTENCIA
		var bloqueo_existencia = BloqueoDeExistenciaData
		var dependencia_bloqueo_existencia = [];
		var infoBloqueo_existencia 			 = await Main.GeneraUpdateInsertDet(bloqueo_existencia,['COD_DEPOSITO'],update_insert_cabecera, dependencia_bloqueo_existencia,"COD_ARTICULO");
		var aux_bloqueo_existencia 			 = infoBloqueo_existencia.rowsAux;
		if(!permisoActualizacion) permisoActualizacion = infoBloqueo_existencia.actualizar;
		var update_insert_bloqueo_existencia = infoBloqueo_existencia.updateInsert;
	

		// FILTER NORMAL PALET
		var normal_palet = NormaPaletData
		var dependencia_normal_palet  = [{'COD_SUCURSAL':'COD_SUCURSAL_ANT'},{'COD_UNIDAD_REL': 'COD_UNIDAD_REL_ANT'}];
		var infoNormaPalet		      = await Main.GeneraUpdateInsertDet(normal_palet,['COD_UNIDAD_REL'],update_insert_cabecera, dependencia_normal_palet,"COD_ARTICULO");
		var aux_norma_palet			  = infoNormaPalet.rowsAux;
		var update_insert_norma_palet = infoNormaPalet.updateInsert;
		if(!permisoActualizacion) permisoActualizacion = infoNormaPalet.actualizar;
		var delete_norma_palet 		  = ArrayPushDelete.NORMA_PALET != undefined ? ArrayPushDelete.NORMA_PALET : [];
	
		// FILTER DIRECCION FIJA
		var direccion_fija = DireccionFijaData
		var dependencia_direccion_fija = [
			{'COD_SUCURSAL' : 'COD_SUCURSAL_ANT' },
			{'COD_DEPOSITO' : 'COD_DEPOSITO_ANT' },
			{'COD_ZONA'     : 'COD_ZONA_ANT'	 },
			{'COD_DIRECCION': 'COD_DIRECCION_ANT'},
		];
		var infoDireccion_fija 			 = await Main.GeneraUpdateInsertDet(direccion_fija,['COD_SUCURSAL'],update_insert_cabecera, dependencia_direccion_fija,"COD_ARTICULO");
		var aux_direccion_fija 			 = infoDireccion_fija.rowsAux;
		var update_insert_direccion_fija = infoDireccion_fija.updateInsert;
		if(!permisoActualizacion) permisoActualizacion = infoDireccion_fija.actualizar;
		var delete_direccion_fija        = ArrayPushDelete.DIRECCION_FIJA != undefined ? ArrayPushDelete.DIRECCION_FIJA : [];

		// FILTER CANTIDAD PIKING
		var cantidad_picking = CantidadPikingData
		var dependencia_cantidad_picking = [
			{'COD_SUCURSAL'  :'COD_SUCURSAL_ANT'  },
			{'COD_TIPO'      :'COD_TIPO_ANT'      },
			{'COD_UNIDAD_REL':'COD_UNIDAD_REL_ANT'},
		];
		var infoCantidad_picking 			= await Main.GeneraUpdateInsertDet(cantidad_picking,['COD_TIPO'],update_insert_cabecera, dependencia_cantidad_picking,"COD_ARTICULO");
		var aux_cantidad_picking 			= infoCantidad_picking.rowsAux;
		var update_insert_cantidad_picking 	= infoCantidad_picking.updateInsert;
		if(!permisoActualizacion) permisoActualizacion = infoCantidad_picking.actualizar;
		var delete_cantidad_picking         = ArrayPushDelete.CANTIDAD_PICKING != undefined ? ArrayPushDelete.CANTIDAD_PICKING : [];
		
		// FILTER ACUERDO
		var acuerdo = AcuerdoData
		var dependencia_acuerdo   = [{'COD_UNIDAD_REL': 'COD_UNIDAD_REL_ANT'}];
		var infoAcuerdo 		  = await Main.GeneraUpdateInsertDet(acuerdo,['COD_UNIDAD_REL'],update_insert_cabecera, dependencia_acuerdo,"COD_ARTICULO");
		var aux_acuerdo 		  = infoAcuerdo.rowsAux;
		var update_insert_acuerdo = infoAcuerdo.updateInsert;
		if(!permisoActualizacion) permisoActualizacion = infoAcuerdo.actualizar;
		var delete_acuerdo 		  = ArrayPushDelete.ACUERDO != undefined ? ArrayPushDelete.ACUERDO : [];
		if(delete_acuerdo.length > 0){
			for (let i = 0; i < delete_acuerdo.length; i++) {
				const item = delete_acuerdo[i];
				if(item.FEC_VIGENCIA) delete_acuerdo[i].FEC_VIGENCIA = Main.moment(item.FEC_VIGENCIA).format('DD/MM/YYYY');
			}
		}
		if(update_insert_acuerdo.length > 0){
			for (let i = 0; i < update_insert_acuerdo.length; i++) {
				const item = update_insert_acuerdo[i];
				if(item.FEC_VIGENCIA) update_insert_acuerdo[i].FEC_VIGENCIA = Main.moment(item.FEC_VIGENCIA).format('DD/MM/YYYY');
			}
		}
		
		if(permisoActualizacion){
			// FormName
			let Permiso  = Main.VerificaPermiso(FormName)
			if(Permiso[0].actualizar !== 'S'){
				Main.message.info({
					content  : `No cuentas con los permisos para Actualizar!`,
					className: 'custom-class',
					duration : `${2}`,
					style    : {marginTop: '2vh'},
				});
				return
			}
		}

		// INFO
		var AditionalData = [{"cod_usuario": sessionStorage.getItem('cod_usuario'),"cod_empresa":sessionStorage.getItem('cod_empresa')}];
		// if(valor) return
		var data = {
			update_insert_cabecera						,
			aux_update_insert_cabecera:   	    	DataAux !== undefined ? JSON.parse(DataAux) : []  ,
		
			update_insert_unidad_medida				,
			aux_update_insert_unidad_medida:  		getCancelarUnidadMedida()	   !== undefined ? JSON.parse(getCancelarUnidadMedida())    : [],
		
			update_insert_lead_time					  ,
			aux_update_insert_LeadTime: 	  		getCancelarLeadTime() 	   !== undefined ? JSON.parse(getCancelarLeadTime()) 	: [] ,

			update_insert_proveedor					  ,
			aux_update_insert_proveedor: 	  		getCancelarProveedor() 	   !== undefined ? JSON.parse(getCancelarProveedor()) 	    : [] ,
			delete_proveedor						      ,

			update_insert_limite_pedido				,
			aux_update_limite_pedido: 		        getCancelarLimitePorPedido() !== undefined ? JSON.parse(getCancelarLimitePorPedido()) : [],

			update_insert_movimiento_stock_cab,
			aux_update_insert_movimiento_stock_cab:	getCancelarMovimientoStockCab() !== undefined ? JSON.parse(getCancelarMovimientoStockCab()) : [],
			delete_movimiento_stock_cab				,

			update_insert_movimiento_stock_det,
			aux_update_insert_movimiento_stock_det:	getCancelarMovimientoStockDet() !== undefined ? JSON.parse(getCancelarMovimientoStockDet()) : [],
			delete_movimiento_stock_det				,
			
			update_insert_pack					      ,
			aux_update_insert_pack:				 	getCancelarPack() !== undefined ? JSON.parse(getCancelarPack()) : [],
			delete_pack												,
			
			update_insert_bloqueo_existencia	,
			aux_update_insert_bloqueo_existencia:	getCancelarBloqueoExistencia() !== undefined ? JSON.parse(getCancelarBloqueoExistencia()) : [],

			update_insert_norma_palet				  ,
			aux_update_insert_norma_palet:			getCancelarNormaPalet() !== undefined ? JSON.parse(getCancelarNormaPalet()) : [],
			delete_norma_palet					    	,

			update_insert_direccion_fija			,
			aux_update_insert_direccion_fija:		getCancelarDireccionFija() !== undefined ? JSON.parse(getCancelarDireccionFija()) : [],
			delete_direccion_fija		    		  ,

			update_insert_cantidad_picking		,
			aux_update_insert_cantidad_picking:		getCancelarCantidadPicking() !== undefined ? JSON.parse(getCancelarCantidadPicking()) : [],
			delete_cantidad_picking						,

			update_insert_acuerdo							,
			aux_update_insert_acuerdo:				getCancelarAcuerdo()	!== undefined	? JSON.parse(getCancelarAcuerdo()) : [],
			delete_acuerdo										,
			
			AditionalData
		}
		if( update_insert_cabecera.length > 0 			   || 

			update_insert_unidad_medida.length > 0 		   ||
		
			update_insert_lead_time.length > 0  		   ||

			update_insert_proveedor.length > 0      	   ||
			delete_proveedor.length > 0					   ||

			update_insert_limite_pedido.length > 0		   ||			

			update_insert_movimiento_stock_cab.length > 0  ||			
			delete_movimiento_stock_cab.length > 0		   ||

			update_insert_movimiento_stock_det.length > 0  ||
			delete_movimiento_stock_det.length > 0		   ||
			
			update_insert_pack.length > 0				   ||
			delete_pack.length > 0						   ||

			update_insert_bloqueo_existencia.length > 0	   ||
			
			update_insert_norma_palet.length > 0  		   ||
			delete_norma_palet.length > 0  				   ||

			update_insert_direccion_fija.length > 0 	   ||
			delete_direccion_fija.length > 0  		       ||

			update_insert_cantidad_picking.length > 0  	   ||
			delete_cantidad_picking.length > 0  		   ||

			update_insert_acuerdo.length > 0  			   ||
			delete_acuerdo.length > 0
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
						
						// BOTON MODIFICAR
						Main.setModifico(FormName)

						// SETEA EL STATE PRINCIPAL
						dataRef.current.data = aux_Cabecera
						if(exitInsertedBand){
							setIsInputBloqued(true);
							setRowView(dataRef.current.data)
						}

						var dataSource = '';
						// SETEA UNIDAD MEDIDA
						if(GridUnidadMedida.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_unidad_medida}), key:'ID'})
							GridUnidadMedida.current.instance.option('dataSource', dataSource);
						}

						// SETEA LEAD TIME
						if(GridLeadTime.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_lead_time}), key: 'ID'})
							GridLeadTime.current.instance.option('dataSource', dataSource);
						}

						// SETEA PROVEEDOR
						if(GridProveedor.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_proveedor}), key: 'ID'})
							GridProveedor.current.instance.option('dataSource', dataSource);
						}

						// LIMITE POR PEDIDO
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

						// DataAux 		     		= ;
						setDataAux(JSON.stringify([...aux_Cabecera]))
						cancelarUnidadMedida 		= JSON.stringify(aux_unidad_medida);
						cancelarLeadTime	 		= JSON.stringify(aux_lead_time);
						cancelarProveedor 			= JSON.stringify(aux_proveedor);
						cancelarLimitePorPedido 	= JSON.stringify(aux_limite_pedido);
						cancelarMovimientoStockCab  = JSON.stringify(aux_movimiento_stock_cab);
						cancelarMovimientoStockDet  = JSON.stringify(aux_movimiento_stock_det);
						cancelarPack 				= JSON.stringify(aux_pack);
						cancelarBloqueoExistencia	= JSON.stringify(aux_bloqueo_existencia);
						cancelarNormaPalet 			= JSON.stringify(aux_norma_palet);
						cancelarDireccionFija 		= JSON.stringify(aux_direccion_fija);
						cancelarCantidadPicking 	= JSON.stringify(aux_cantidad_picking);
						cancelarAcuerdo 			= JSON.stringify(aux_acuerdo);
					
						removeIdComponentUpdate();
						setBloqueoCabecera(false);
						limpiarBandComponent();
						limpiarArrayDelete();
						banDeleteMoviminetoDet = false
						setTimeout(()=>{
							document.getElementById('DESCRIPCION').focus();
						},12)
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
			Main.setModifico(FormName)
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
	//SET VISTA DEL FORMULARIO
	const setRowView = async (valorRow)=>{
		var fecha = null;
		if(valorRow[getIndice()].INSCRIPCION !== null 	  && 
			valorRow[getIndice()].INSCRIPCION !== undefined && 
			valorRow[getIndice()].INSCRIPCION !== ""){
			let result = Main.moment(valorRow[getIndice()].INSCRIPCION, 'DD/MM/YYYY',true).isValid();
			if(result){
				fecha  = Main.moment(valorRow[getIndice()].INSCRIPCION,'DD/MM/YYYY').format('DD/MM/YYYY')
			}else{
				fecha  = Main.moment(valorRow[getIndice()].INSCRIPCION,'DD/MM/YYYY')
			}
		}		
		form.setFieldsValue({...valorRow[getIndice()],
			COD_ARTICULO:     valorRow[getIndice()].COD_ARTICULO,
			INSCRIPCION: 	  fecha == null ? fecha : Main.moment(fecha, 'DD/MM/YYYY'),
			ESTADO:			  valorRow[getIndice()].ESTADO 		     			 == 'I' || valorRow[getIndice()].ESTADO  		  == "" || _.isNull(valorRow[getIndice()].ESTADO) 			 ? false : true,
			IND_MANEJA_STOCK: valorRow[getIndice()].IND_MANEJA_STOCK == 'N' || valorRow[getIndice()].IND_MANEJA_STOCK == "" || _.isNull(valorRow[getIndice()].IND_MANEJA_STOCK)  ? false : true,
			IND_MANEJA_VTO:	  valorRow[getIndice()].IND_MANEJA_VTO   == 'N' || valorRow[getIndice()].IND_MANEJA_VTO   == "" || _.isNull(valorRow[getIndice()].IND_MANEJA_VTO)	 ? false : true,
			IND_COND_VTA:	  valorRow[getIndice()].IND_COND_VTA 			 == 'N' || valorRow[getIndice()].IND_COND_VTA 	  == "" || _.isNull(valorRow[getIndice()].IND_COND_VTA)	 	 ? false : true,
			IND_INPASA:		  valorRow[getIndice()].IND_INPASA     	  == 'N' || valorRow[getIndice()].IND_INPASA       == "" || _.isNull(valorRow[getIndice()].IND_INPASA)		 ? false : true,
			IND_ESPECIAL:	  valorRow[getIndice()].IND_ESPECIAL     == 'N' || valorRow[getIndice()].IND_ESPECIAL     == "" || _.isNull(valorRow[getIndice()].IND_ESPECIAL)	 	 ? false : true,
			IND_REGIMEN:	  valorRow[getIndice()].IND_REGIMEN      == 'N' || valorRow[getIndice()].IND_REGIMEN      == "" || _.isNull(valorRow[getIndice()].IND_REGIMEN)		 ? false : true,
			IND_JNJ:		  valorRow[getIndice()].IND_JNJ 	     == 'N' || valorRow[getIndice()].IND_JNJ 	      == "" || _.isNull(valorRow[getIndice()].IND_JNJ)			 ? false : true,
			ART_ADICIONAL:	  valorRow[getIndice()].ART_ADICIONAL    == 'N' || valorRow[getIndice()].ART_ADICIONAL    == "" || _.isNull(valorRow[getIndice()].ART_ADICIONAL)	 ? false : true,
			ES_PESABLE:		  valorRow[getIndice()].ES_PESABLE 	     == 'N' || valorRow[getIndice()].ES_PESABLE 	  == "" || _.isNull(valorRow[getIndice()].ES_PESABLE)		 ? false : true,
			VER_CATASTRO:	  valorRow[getIndice()].VER_CATASTRO     == 'N' || valorRow[getIndice()].VER_CATASTRO     == "" || _.isNull(dataRef.current.data[getIndice()].VER_CATASTRO) ? false : true
		});
	}
	// VALIDADORES
	const ValidarUnico = async(input) => {
		let item = await ValidaInput.find( item => item.input == input);
		if(!_.isObject(item)) return;
		if( form.getFieldValue(item.input)?.trim()?.length == 0 ){
			item.valor_ant = null;
			item.band = false;
			item.out.map( x => {
				form.setFieldsValue({
				...form.getFieldsValue(),
				[x]: ''
				});
				dataRef.current.data[getIndice()][x] = '';
			});
			item.rel.map( x => {
				form.setFieldsValue({
				...form.getFieldsValue(),
				[x]: ''
				});
				dataRef.current.data[getIndice()][x] = '';
			});
			if(!item.requerido){
				document.getElementById(item.next).focus();
			}
			return;
		}
		if( form.getFieldValue(item.input) != item.valor_ant){
			try {
				let data = {}
				item.data.map( x => {
				data = { ...data, [x.toLowerCase()]:form.getFieldValue(x) }
				});
				data = {...data, valor:form.getFieldValue(item.input)};
				return await Main.Request( item.url, 'POST', data )
				.then( response => {
					if(response.data.outBinds.ret == 1){
					item.valor_ant = form.getFieldValue(item.input);
					item.out.map( x => {
						form.setFieldsValue({
						...form.getFieldsValue(),
						[x]: response.data.outBinds[x]
						});
						dataRef.current.data[getIndice()][x] = response.data.outBinds[x];
					});
					item.rel.map( x => {
						form.setFieldsValue({
						...form.getFieldsValue(),
						[x]: ''
						});
						dataRef.current.data[getIndice()][x] = '';
					});
					document.getElementById(item.next).focus();
					document.getElementById(item.next).select();
					}else{
					item.valor_ant = null;
					item.band = false;
					item.out.map( x => {
						form.setFieldsValue({
						...form.getFieldsValue(),
						[x]: ''
						});
						dataRef.current.data[getIndice()][x] = '';
					});
					item.rel.map( x => {
						form.setFieldsValue({
						...form.getFieldsValue(),
						[x]: ''
						});
						dataRef.current.data[getIndice()][x] = '';
					});
					document.getElementById(item.input).focus();
					document.getElementById(item.input).select();
					showModalMensaje('¡Atención!','alerta', response.data.outBinds.p_mensaje);
					}
				});
			} catch (error) {
				console.log(error);
			}
		}else{
			document.getElementById(item.next).focus();
			document.getElementById(item.next).select();
		}
	}
	const handleInputChange = (e) => {
		Main.modifico(FormName)
		dataRef.current.data[getIndice()][e.target.id] = e.target.value;

		if(dataRef.current.data[getIndice()]['insertedDefault']){
			dataRef.current.data[getIndice()].insertedDefault = false;
			dataRef.current.data[getIndice()].inserted 		    = true;
		}
		
		if(!dataRef.current.data[getIndice()]['updated'] && !dataRef.current.data[getIndice()]['inserted']){
			dataRef.current.data[getIndice()]['updated'] 				  = true;
			dataRef.current.data[getIndice()]['FEC_MODI'] 		    = Main.moment().format('DD/MM/YYYY h:mm:ss');
			dataRef.current.data[getIndice()]['COD_USUARIO_MODI'] = sessionStorage.getItem('cod_usuario');
			if(!getBloqueoCabecera())setBloqueoCabecera(true);
		}
		
	}
	const handleCheckbox = async(e, options) => {
		dataRef.current.data[getIndice()][e.target.id] = form.getFieldValue(e.target.id) == true ? options[0] : options[1];
		if(dataRef.current.data[getIndice()].insertedDefault){
			dataRef.current.data[getIndice()].inserted = true;
		}else if(!dataRef.current.data[getIndice()].inserted){
			dataRef.current.data[getIndice()].updated = true;
			if(!getBloqueoCabecera())setBloqueoCabecera(true);
		}
		Main.modifico(FormName)
	}
	const handleTabChange = (value) => {
		setTabKey(value);
		manageTabs(value);
	}
	const handleTabWMSChange = (value) => {
		setTabKeyWMS(value);
		manageTabs(value);
	}
	const activateButtonCancelar = async(e,nameInput)=>{
		
		if(e)dataRef.current.data[getIndice()][nameInput] = Main.moment(e._d).format("DD/MM/YYYY");
		else dataRef.current.data[getIndice()][nameInput] = ''
		
		if(!dataRef.current.data[getIndice()].inserted){ 
			dataRef.current.data[getIndice()].updated = true;
		} 
		Main.modifico(FormName);
		document.getElementById('COD_NOMEN').focus();
	}
	const stateOpenDate = (e)=>{
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
	const setRowFocusDet = async (e)=>{
		var valor = await getIdComponentUpdate()
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
		if(banDeleteMoviminetoDet){
			setShowMessageButton(true);
			showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
			return
		}
		var cod_sucursal = e.row !== undefined ? e.row.data.COD_SUCURSAL : '';
		var content = [];
		var info    = []
		var addBand = false
		let data    = e.row ? e.row.data : e ? e : []
		if(data.COD_SUCURSAL){
			info = await Main.Request('/st/starticu_new/movimiento_stock_det','POST',{
				COD_EMPRESA	 : sessionStorage.getItem("cod_empresa"),
				COD_ARTICULO : form.getFieldValue('COD_ARTICULO'),
				COD_SUC_REF  : cod_sucursal,		
			});
			if(info.data.rows.length > 0) addBand = true
		}
		if(!addBand){
			var row = await dataRef.current.data[getIndice()];
			var newKey = uuidID();
			content = [{
				ID	         	: newKey,
				COD_EMPRESA		: sessionStorage.getItem("cod_empresa"),
				COD_ARTICULO 	: form.getFieldValue('COD_ARTICULO'),
				idCabecera      : row.ID,
				COD_SUC_REF		: cod_sucursal,
				InsertDefault   : true,
				IDCOMPONENTE	: 'MOVIMIENTO_STOCK_DET'
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
	const setCellChanging =async(e)=>{
		setComponenteEliminarDet({id:'MOVIMIENTO_STOCK_DET',delete:true });
	}
	const setRowFocusDet_MovimientoStockDet=()=>{
		setColumnRequerido(columns_MovimientoStockDet);
	}
	// MENSAJES
	const showModalMensaje = (titulo, imagen, mensaje) => {
		setTituloModal(titulo);
		setImagen(imagen);
		setMensaje(mensaje);
		setVisibleMensaje(true);
	};
	const handleCancel = async ()=> {
		setVisibleMensaje(false);
		setShowMessageButton(false)
		//se realiza una valizacion para que no afecte en la hora de validar y no cancele los procesos
		if(showMessageButton)funcionCancelar()
	};
	const save =()=>{
		setVisibleMensaje(false)
		setShowMessageButton(false)
		guardar();
	}
	// BUSCADORES
	const modalSetOnClick = async (datos, BusquedaPor) => {
		if(datos !== "" || datos !== undefined){
			let info = ValidaInput.find( item => item.input == BusquedaPor );
			if(info.valor_ant != datos[0]){
				// JUNTAR EL CODIGO, CON EL RETORNO DEL VALIDA
				let keys = [ info.input, ...info.out ];
				keys.map(( item, index) => {
					// FORM
					form.setFieldsValue({
						...form.getFieldsValue(),
						[item]: datos[index] 
					});
					// MODIFICACION DEL STATE
					dataRef.current.data[getIndice()][item] = datos[index];
				});
				// LIMPIAR DATOS RELACIONADOS
				info.rel.map(( item ) => {
					// FORM
					form.setFieldsValue({
						...form.getFieldsValue(),
						[item]: '' 
					});
					// MODIFICACION DEL STATE
					dataRef.current.data[getIndice()][item] = datos[index];
				});
			}
			showsModal(false)
			setTimeout( ()=>{ document.getElementById(info.next).focus() }, 250 )
		}
		if(dataRef.current.data[getIndice()]['insertedDefault']){
			dataRef.current.data[getIndice()].insertedDefault = false;
			dataRef.current.data[getIndice()].inserted 		  = true;
		}
		if(!dataRef.current.data[getIndice()]['updated'] && !dataRef.current.data[getIndice()]['inserted']){
			dataRef.current.data[getIndice()]['updated'] 					= true;
			dataRef.current.data[getIndice()]['FEC_MODI'] 		   	= Main.moment().format('DD/MM/YYYY h:mm:ss');
			dataRef.current.data[getIndice()]['COD_USUARIO_MODI'] = sessionStorage.getItem('cod_usuario');
		}
		Main.modifico(FormName);
		showsModal(false)
	}
	const onInteractiveSearch = async(event) => {
		let valor = event.target.value;
		var data = {}
		let info = ValidaInput.find( item => item.input == tipoDeBusqueda );
		for (let i = 0; i < info.data.length; i++) {
			const element = info.data[i];
			let key = element.toLowerCase()
			data = {...data,[key]:form.getFieldValue(`${element}`)}
		}
		if(valor.trim().length === 0 ) valor = 'null';
		data.valor = valor
		let url = info.url_buscar;
		if(valor !== null){
			try {
				await Main.Request(url,'POST',data).then(response => { if( response.status == 200 ) setSearchData(response.data.rows) });
			} catch (error) {
				console.log(error);
			}
		}
	}
	const showsModal = async (valor) => {
		setShows(valor);
	};
	const AddForm = async()=>{
		let Permiso  = Main.VerificaPermiso(FormName)
		if(Permiso[0].insertar == 'S'){
			if(!bandNew){
				ManejaF7(true);
			}else{
				var idComponetFocus = await componenteEliminar;
				let valor = await Main.add_dataRequerido(idGrid,idComponetFocus.id)
				if(valor.Addband){  
					idGrid[idComponetFocus.id].current.instance.option("focusedRowKey", 120);
					idGrid[idComponetFocus.id].current.instance.clearSelection();            
					setTimeout(()=>{
						idGrid[idComponetFocus.id].current.instance.focus(
							idGrid[idComponetFocus.id].current.instance.getCellElement(valor.columnaRequerido.indexRow,valor.columnaRequerido.ID)
						),100
					})
					return
				}else{
					if( idComponetFocus.id !== 'LIMITE_PEDIDO'			&& 
							idComponetFocus.id !== 'BLOQUEO_EXISTENCIA' && 
							idComponetFocus.id !== 'LEAD_TIME'					&&
							idComponetFocus.id !== 'MOVIMIENTO_STOCK_DET'){
						
						Main.modifico(FormName);
						var	indexRow = getRowIndex();
						var newKey = uuidID();
						var row    = idGrid.newAdd[idComponetFocus.id]
							row = [{
							...row[0],
							ID            : newKey,
							COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
							COD_USUARIO   : sessionStorage.getItem('cod_usuario'),
							COD_ARTICULO  : form.getFieldValue('COD_ARTICULO') !== undefined ? form.getFieldValue('COD_ARTICULO') : form.getFieldValue('ID'),
							idCabecera    : dataRef.current.data[getIndice()]['ID'],
							inserted      : true,
						}]
						let rows = await idGrid[idComponetFocus.id].current.instance.getDataSource() !== null ? 
										idGrid[idComponetFocus.id].current.instance.getDataSource()._items : []
						idGrid.columna[idComponetFocus.id].forEach(async element => {
							if(element.isdate)         row[0][element.ID] = Main.moment();
							if(element.checkbox)       row[0][element.ID] = element.checkBoxOptions[1];
							if(element.isOpcionSelect){
								_.flatten(_.filter(concepto[element.ID], function(item){
								if (item.isNew) row[0][element.ID] = item.ID;
							}));
							}
						});
						let resp = rows.concat(rows.splice(indexRow, 0, ...row));					
						const dataSource_LeadTime = new DataSource({
							store: new ArrayStore({
								data: resp,
							}),
							key: 'ID'
						})
						idGrid[idComponetFocus.id].current.instance.option('dataSource', dataSource_LeadTime);
						setTimeout(()=>{
							setBloqueoCabecera(true)
							idGrid[idComponetFocus.id].current.instance.focus(
								idGrid[idComponetFocus.id].current.instance.getCellElement(indexRow,idGrid.defaultFocus[idComponetFocus.id])
							);
						},30);
					}
				}
				
			
			}
		}else{
			Main.message.info({
				content  : `No cuentas con los permisos para Agregar`,
				className: 'custom-class',
				duration : `${2}`,
				style    : {marginTop: '2vh'},
			});
		}
	}
	const deleteRows = async ()=>{
		let Permiso  = Main.VerificaPermiso(FormName)
		if(Permiso[0].borrar == 'S'){
			var idComponetFocus = await componenteEliminar;
			if(idComponetFocus.delete  && idGrid[idComponetFocus.id].current.instance.getDataSource !== null){
				var	indexRow = getRowIndex();
				var rowsInfo = await idGrid[idComponetFocus.id].current.instance.getDataSource()._items[indexRow];
				if(_.isUndefined(rowsInfo)) return
				if(!rowsInfo.inserted && !rowsInfo.InsertDefault){
					Main.modifico(FormName)
					rowsInfo.delete      = true;
					rowsInfo.COD_EMPRESA = sessionStorage.getItem('cod_empresa');
					if( ArrayPushDelete[idComponetFocus.id] !== undefined){
						ArrayPushDelete[idComponetFocus.id] = _.union(ArrayPushDelete[idComponetFocus.id], [rowsInfo]);
					}else{
					  ArrayPushDelete[idComponetFocus.id] = [rowsInfo];
					}
					idGrid[idComponetFocus.id].current.instance.deleteRow(indexRow)
					if(idComponetFocus.id == 'MOVIMIENTO_STOCK_DET') banDeleteMoviminetoDet = true;
					setBloqueoCabecera(true)
				}else{
					idGrid[idComponetFocus.id].current.instance.deleteRow(indexRow)
				}
				setTimeout(()=>{
					if(indexRow !== 0 && indexRow !== -1) indexRow = indexRow -1;
					var valor = idGrid[idComponetFocus.id].current.instance.getDataSource()._items;
					if(valor.length > 0){
							idGrid[idComponetFocus.id].current.instance.focus(
							idGrid[idComponetFocus.id].current.instance.getCellElement(indexRow,idGrid.defaultFocus[idComponetFocus.id])
					  	)
					}
				},30);
			}
		}else{
			Main.message.info({
				content  : `No cuentas con los permisos para Eliminar`,
				className: 'custom-class',
				duration : `${2}`,
				style    : {marginTop: '2vh'},
			});
		}
	}
	const funcionCancelar = async () => {
		var AuxDataCancelCab;
		if(DataAux.length > 0){
			AuxDataCancelCab 	 	 = await JSON.parse(DataAux);
			dataRef.current.data = AuxDataCancelCab;
			if(getIndice() == 0 && (AuxDataCancelCab[getIndice()].insertedDefault ||  AuxDataCancelCab[getIndice()].inserted)){
				AuxDataCancelCab[getIndice()].DESC_PAIS_ORIGEN = ''
				AuxDataCancelCab[getIndice()].DESC_ORIGEN_ART  = ''
				AuxDataCancelCab[getIndice()].DESC_GRUPO  		 = ''
				AuxDataCancelCab[getIndice()].DESC_PROVEEDOR   = ''
				AuxDataCancelCab[getIndice()].DESC_RUBRO       = ''
				AuxDataCancelCab[getIndice()].DESC_FAMILIA     = ''
				AuxDataCancelCab[getIndice()].DESC_MARCA 	     = ''
				AuxDataCancelCab[getIndice()].DESC_LINEA 	     = ''
				AuxDataCancelCab[getIndice()].DESC_CATEGORIA   = ''
				AuxDataCancelCab[getIndice()].DESC_IVA 		 	   = ''
			}
			setRowView(AuxDataCancelCab);
			loadForm(AuxDataCancelCab);
			DataAux = JSON.stringify(AuxDataCancelCab)
		}
		
		// UNIDAD DE MEDIDA
		if(getCancelarUnidadMedida()){
			var AuxDataCancel_UnidadMedida = await JSON.parse(await getCancelarUnidadMedida());
			if(AuxDataCancel_UnidadMedida.length > 0){
				const dataSource_UnidadMedida = new DataSource({
					store: new ArrayStore({
						  keyExpr:"ID",
						  data: AuxDataCancel_UnidadMedida
					}),
					key: 'ID'
				})
				GridUnidadMedida.current.instance.option('dataSource', dataSource_UnidadMedida);
				cancelarUnidadMedida = JSON.stringify(AuxDataCancel_UnidadMedida);	
			}
		}
		// Lead Time
		if(getCancelarLeadTime()){
			var AuxDataCancel_LeadTime = await JSON.parse(await getCancelarLeadTime());

			if(AuxDataCancel_LeadTime.length > 0){
				const dataSource_LeadTime = new DataSource({
					store: new ArrayStore({
						  keyExpr:"ID",
						  data: AuxDataCancel_LeadTime
					}),
					key: 'ID'
				})
				GridLeadTime.current.instance.option('dataSource', dataSource_LeadTime);
				cancelarLeadTime = JSON.stringify(AuxDataCancel_LeadTime);	
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
		setActivarSpinner(true)
		removeIdComponentUpdate();
		QuitarClaseRequerido()
		limpiarArrayDelete()
		limpiarBandComponent()
		Main.setModifico(FormName);
		setBloqueoCabecera(false);
		banDeleteMoviminetoDet = false
		setTimeout( ()=> {
			if(tabKey != 7){
				manageTabs(tabKey);
			}else{
				manageTabs(tabKeyWMS);
			}
			setActivarSpinner(false);
			document.getElementById('DESCRIPCION').focus();
		},4);
		bandNew = false;
	};
	const handleUpperCase = (e) => {
        e.target.value = ("" + e.target.value).toUpperCase();
	};
	const setUpdateValue_Unidad_Medida = async(e)=>{		
		var row   = []
		if(e == "")return
		if(Object.keys(e.newData)[0] == 'MULT' || Object.keys(e.newData)[0] == 'KG_PESO_NETO'){
			if(GridUnidadMedida.current.instance.getDataSource !== null){
				row = GridUnidadMedida.current.instance.getDataSource()._items
				if(row.length > 1){
						row[0].KG_PESO_NETO = row[0].KG_PESO_NETO !== null && 
																	row[0].KG_PESO_NETO !== ""   && 
																	row[0].KG_PESO_NETO !== undefined 
															 ?  row[0].KG_PESO_NETO : 0
						var rowIndex   = e.component.getRowIndexByKey(e.oldData)
						if(_.isNumber(row[0].KG_PESO_NETO) && rowIndex > 0){
								e.oldData.KG_PESO_NETO = (e.newData.MULT * row[0].KG_PESO_NETO)
						}else if(rowIndex == 0 && Object.keys(e.newData)[0] == 'KG_PESO_NETO'){
							let new_value = e.newData.KG_PESO_NETO == null ? 0 : e.newData.KG_PESO_NETO;
							for (let index = 1; index < row.length; index++) {
								const element = row[index];
								element.KG_PESO_NETO = element.MULT * new_value;
								if(element.InsertDefault){
									element.inserted 			= true;
									element.InsertDefault = false;
								}else if(!element.inserted){
									element.updated  		  = true;
								}
							}
						}
				}
			}
		}
	}
    return (
		<>
			{/* MENSAJES */}
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
			{/* BUSCADOR */}
			<Main.FormModalSearch
				showsModal={showsModal}
				setShows={shows}
				title={modalTitle}
				componentData={
					<Main.NewTableSearch
						onInteractiveSearch={onInteractiveSearch}
						columns={searchColumns}
						searchData={searchData}
						modalSetOnClick={modalSetOnClick}
						tipoDeBusqueda={tipoDeBusqueda}/>
				}
				descripcionClose=""
				descripcionButton=""
				actionAceptar=""
			/>
			{/* LAYOUT */}
			<Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
				<Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`}/>
				<Main.Spin size="large" spinning={activarSpinner}>
					<div className="paper-container">
						<Paper className="paper-style">
							<div className="paper-header">        
								<Title level={4} className="title-color">
									{TituloList}
									<div level={5} style={{ float:'right', marginTop:'5px', marginRight:'5px', fontSize:'10px'}} className="title-color">{FormName}</div> 
								</Title>
							</div>
							<Main.HeaderMenu
								AddForm={AddForm}
								SaveForm={guardar}
								deleteRows={deleteRows}
								// vdelete={false}
								vprinf={false}
								cancelar={funcionCancelar}
								NavigateArrow={NavigateArrow}
								formName={FormName}
								buttonSaveRef={buttonSaveRef}
								funcionBuscar={()=>ManejaF7(true)}
							/>
							<Form size="small" autoComplete="off" form={form} style={{marginTop:'10px', paddingLeft:'20px', paddingRight:'20px'}}>
								<Col span={24}>
									<div id="form-div-1">
										<Row gutter={16}>
											<Col span={9}>
												<Form.Item label={<label style={{width:'80px'}}><span style={{color:'red'}}>*</span> Codigo</label>}>
													<Form.Item name="COD_ARTICULO" style={{width:'80px',  display:'inline-block',  marginRight:'4px'}} required >
														<Input type="number" className="search_input" readOnly={IsInputBloqued} onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
													</Form.Item>
													<Form.Item name="DESCRIPCION" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className="requerido"  />
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}>Sustituto</label>}>
													<Form.Item name="COD_ORIGEN_ART" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input min={1} type="number" className="search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
													</Form.Item>
													<Form.Item name="DESC_ORIGEN_ART" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}>Pais/Origen</label>}>
													<Form.Item name="COD_PAIS_ORIGEN" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="text" className="search_input" 
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown} 
															onKeyUp={handleKeyUp} 
															onInput={handleUpperCase}
														/>
													</Form.Item>
													<Form.Item name="DESC_PAIS_ORIGEN" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}>Proveedor</label>}>
													<Form.Item name="COD_PROVEEDOR_DFLT" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="number" className="search_input"
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown} 
															onKeyUp={handleKeyUp} 
															/>
													</Form.Item>
													<Form.Item name="DESC_PROVEEDOR" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}><span style={{color:'red'}}>*</span> Rubro</label>}>
													<Form.Item name="COD_RUBRO" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="number" className="search_input requerido" 
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown} 
															onKeyUp={handleKeyUp}
														/>
													</Form.Item>
													<Form.Item name="DESC_RUBRO" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}><span style={{color:'red'}}>*</span> Familia</label>}>
													<Form.Item name="COD_FAMILIA" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="number" className="search_input requerido" 
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown} 
															onKeyUp={handleKeyUp} 
														/>
													</Form.Item>
													<Form.Item name="DESC_FAMILIA" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}><span style={{color:'red'}}>*</span> Marca</label>}>
													<Form.Item name="COD_MARCA" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="number" className="search_input requerido" 
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown} 
															onKeyUp={handleKeyUp} 
														/>
													</Form.Item>
													<Form.Item name="DESC_MARCA" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}><span style={{color:'red'}}>*</span> Categoria</label>}>
													<Form.Item name="COD_LINEA" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="number" className="search_input requerido" 
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown} 
															onKeyUp={handleKeyUp} 
														/>
													</Form.Item>
													<Form.Item name="DESC_LINEA" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}><span style={{color:'red'}}>*</span> Segmento</label>}>
													<Form.Item name="COD_CATEGORIA" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="number" className="search_input requerido" 
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown} 
															onKeyUp={handleKeyUp} 
														/>
													</Form.Item>
													<Form.Item name="DESC_CATEGORIA" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Form.Item label={<label style={{width:'80px'}}>Grupo</label>}>
													<Form.Item name="COD_GRUPO" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="number" className="search_input" 
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown} 
															onKeyUp={handleKeyUp} 
														/>
													</Form.Item>
													<Form.Item name="DESC_GRUPO" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Row>
													<Col span={12}>
														<Form.Item name="COD_BARRA_ART" label={<label style={{width:'80px'}}>Cód. Barra</label>}>
															<Input type="number" className="search_input" 
																onChange={handleInputChange} 
																onKeyDown={handleKeyDown} 
																onKeyUp={handleKeyUp} 
															/>
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item name="CANTIDAD_CONT" label={<label style={{width:'90px'}}>Cant. Cont.</label>}>
															<Input type="number" className="search_input" 
																onChange={handleInputChange} 
																onKeyDown={handleKeyDown} 
																onKeyUp={handleKeyUp} 
																/>
														</Form.Item>
													</Col>
												</Row>
												<Form.Item name="COMENTARIO" label={<label style={{width:'80px'}}>Observ.</label>}>
													<Input type="text" className="search_input" 
														onChange={handleInputChange} 
														onKeyDown={handleKeyDown} 
														onKeyUp={handleKeyUp} 
													/>
												</Form.Item>
											</Col>
											<Col span={10}>
												<Row>
													<Col span={12}>
														<Form.Item name="NRO_REGISTRO" label={<label style={{width:'100px'}}>RSPA/DNVS</label>}>
															<Input type="number" className="search_input" 
																onChange={handleInputChange} 
																onKeyDown={handleKeyDown} 
																onKeyUp={handleKeyUp} 
																/>
														</Form.Item>
													</Col>
													<Col span={12}>
														<ConfigProvider locale={locale}>
															<Form.Item name="INSCRIPCION" label={<label style={{width:'90px'}}>Inscripción</label>}>
																<DatePicker 
																	onKeyDown={(e)=>handleKeyDown(e)}
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
													<Col span={12}>
														<Form.Item name="COD_NOMEN" label={<label style={{width:'100px'}}>Nomenclat</label>}>
															<Input type="number" className="search_input" 
																onChange={handleInputChange} 
																onKeyDown={handleKeyDown} 
																onKeyUp={handleKeyUp} 
															/>
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item name="IND_REGIMEN" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) }
															label={<label style={{width:'90px'}}>Reg/Turismo</label>}>
															<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown} />
														</Form.Item>
													</Col>
												</Row>
												<Form.Item label={<label style={{width:'100px'}}><span style={{color:'red'}}>*</span> Impuesto</label>}>
													<Form.Item name="COD_IVA" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
														<Input type="number" className="search_input requerido" 
															onChange={handleInputChange} 
															onKeyDown={handleKeyDown}
															onKeyUp={handleKeyUp}
														/>
													</Form.Item>
													<Form.Item name="DESC_IVA" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
														<Input disabled/>
													</Form.Item>
												</Form.Item>
												<Row>
													<Col span={14}>
														<Form.Item name="TIP_PRODUCTO" label={<label style={{width:'100px'}}>Tip. Prod.</label>}>
															<Select allowClear defaultValue="CVT"
																onChange={ async(e)=>{
																	Main.modifico(FormName)
																	var row = await dataRef.current.data[getIndice()]
																	if(row.InsertDefault){
																		row.inserted = true;
																		row.InsertDefault = false;
																	}else if(!row.inserted){
																		row.updated  		 = true;
																		row.FEC_MODI 		 = Main.moment().format('DD/MM/YYYY h:mm:ss');
																		row.COD_USUARIO_MODI = sessionStorage.getItem('cod_usuario');
																		if(!getBloqueoCabecera())setBloqueoCabecera(true);
																	}
																	row.TIP_PRODUCTO = e;
																	document.getElementById('COND_COMPRA_N').focus();
																}}
																>
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
													<Col span={10}>
														<Form.Item name="VENCIMIENTO" label={<label style={{width:'90px'}}>Vencimiento</label>}>
															<Input type="text" className="search_input" 
																onChange={handleInputChange} 
																onKeyDown={handleKeyDown} 
																onKeyUp={handleKeyUp}
																disabled={true}
															/>
														</Form.Item>
													</Col>
												</Row>
													<Main.Fieldset
														anchoContenedor="100%"
														alineacionTitle="center"
														alineacionContenedor="left"
														margenTop="0px"
														tamañoTitle="13px"
														title="Compras"
														contenedor={
															<>
																<div className="radioArticulo">
																	<Form.Item
																		label={<label style={{width:'80px'}}>Tipo Compra</label>}
																		name="COND_COMPRA"
																		onChange={async(e)=>{
																			Main.modifico(FormName)																
																			if(!dataRef.current.data[getIndice()].inserted){
																				dataRef.current.data[getIndice()].updated 				 = true;
																				dataRef.current.data[getIndice()].FEC_MODI 		     = Main.moment().format('DD/MM/YYYY h:mm:ss');
																				dataRef.current.data[getIndice()].COD_USUARIO_MODI = sessionStorage.getItem('cod_usuario');
																				if(!getBloqueoCabecera())setBloqueoCabecera(true);
																			} 
																			dataRef.current.data[getIndice()].COND_COMPRA = e.target.value;
																		}}
																	>
																		<Radio.Group >
																			<Radio value="N" id="COND_COMPRA_N" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Ninguno
																			</Radio>
																			<Radio value="E" id="COND_COMPRA_E" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Estadística
																			</Radio>
																			<Radio value="I" id="COND_COMPRA_I" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Innovación
																			</Radio>
																		</Radio.Group>
																	</Form.Item>
																</div>
																<div className="radioArticulo">
																	<Form.Item label={<label style={{width:'80px'}}>Med. Compra</label>} 
																		name="IND_MED_COMP"
																		onChange={async(e)=>{
																			Main.modifico(FormName)
																			if(!dataRef.current.data[getIndice()].inserted){
																				dataRef.current.data[getIndice()].updated 				 = true;
																				dataRef.current.data[getIndice()].FEC_MODI 		     = Main.moment().format('DD/MM/YYYY h:mm:ss');
																				dataRef.current.data[getIndice()].COD_USUARIO_MODI = sessionStorage.getItem('cod_usuario');
																				if(!getBloqueoCabecera())setBloqueoCabecera(true);
																			}
																			dataRef.current.data[getIndice()].IND_MED_COMP = e.target.value;
																		}}
																	>
																		<Radio.Group>
																			<Radio value="N" id="IND_MED_COMP_N" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Ninguno
																			</Radio>
																			<Radio value="P" id="IND_MED_COMP_P" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Peso
																			</Radio>
																			<Radio value="T" id="IND_MED_COMP_T" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Palet/Batch
																			</Radio>
																			<Radio value="V" id="IND_MED_COMP_V" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Volumen
																			</Radio>
																		</Radio.Group>	
																	</Form.Item>
																</div>
																<div className="radioArticulo">
																	<Form.Item label={<label style={{width:'80px'}}>Mes</label>} name="IND_MES"
																		onChange={async(e)=>{
																			Main.modifico(FormName)
																			if(!dataRef.current.data[getIndice()].inserted){
																				dataRef.current.data[getIndice()].updated 			   = true;
																				dataRef.current.data[getIndice()].FEC_MODI 		     = Main.moment().format('DD/MM/YYYY h:mm:ss');
																				dataRef.current.data[getIndice()].COD_USUARIO_MODI = sessionStorage.getItem('cod_usuario');
																				if(!getBloqueoCabecera())setBloqueoCabecera(true);
																			} 
																			dataRef.current.data[getIndice()].IND_MES = e.target.value;
																		}}
																	>
																		<Radio.Group>
																			<Radio value="N" id="IND_MES_N" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Ninguno
																			</Radio>
																			<Radio value="P" id="IND_MES_P" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Par
																			</Radio>
																			<Radio value="I" id="IND_MES_I" onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
																				Impar
																			</Radio>
																		</Radio.Group>
																	</Form.Item>
																</div>
																<Row>
																	<Col span={8}>
																		<Form.Item name="CANT_PED" label={<label style={{width:'80px'}} >Cantidad</label>}>
																			<Input type="number" className="search_input" 
																				onChange={handleInputChange} 
																				onKeyDown={handleKeyDown} 
																				onKeyUp={handleKeyUp} 
																			/>
																		</Form.Item>
																	</Col>
																	<Col span={8}>
																		<Form.Item name="CANT_BASE" label={<label style={{width:'80px'}}>Cant. Base</label>}>
																			<Input type="number" className="search_input" 
																				onChange={handleInputChange} 
																				onKeyDown={handleKeyDown} 
																				onKeyUp={handleKeyUp} 
																			/>
																		</Form.Item>
																	</Col>
																	<Col span={8}>
																		<Form.Item name="CANT_VOLUMEN" label={<label style={{width:'80px'}}>Cant. Vol.</label>}>
																			<Input type="number" className="search_input" 
																				onChange={handleInputChange} 
																				onKeyDown={handleKeyDown} 
																				onKeyUp={handleKeyUp} 
																			/>
																		</Form.Item>
																	</Col>
																</Row>
															</>
														}
													/>
													<Main.Fieldset
														anchoContenedor="100%"
														alineacionTitle="center"
														alineacionContenedor="left"
														margenTop="0px"
														tamañoTitle="13px"
														title="Categoría de WMS"
														contenedor={
															<Row>
																<Col span={24}>
																	<Form.Item label={<label style={{width:'80px'}}>Almacenaje:</label>}>
																		<Form.Item name="COD_CAT_ALM" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
																			<Input type="number" className="search_input" 
																				onChange={handleInputChange} 
																				onKeyDown={handleKeyDown} 
																				onKeyUp={handleKeyUp} 
																			/>
																		</Form.Item>
																		<Form.Item name="DESC_CAT_ALM" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
																			<Input disabled/>
																		</Form.Item>
																	</Form.Item>
																</Col>
																<Col span={24}>
																	<Form.Item label={<label style={{width:'80px'}}>Separación:</label>}>
																		<Form.Item name="COD_CAT_SEP" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
																			<Input type="number" className="search_input" 
																				onChange={handleInputChange} 
																				onKeyDown={handleKeyDown} 
																				onKeyUp={handleKeyUp}
																			/>
																		</Form.Item>
																		<Form.Item name="DESC_CAT_SEP" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
																			<Input disabled/>
																		</Form.Item>
																	</Form.Item>
																</Col>
															</Row>
														}
													/>
											</Col>
											<Col span={5}>
												<Card className="checkboxArticulo">
													<Form.Item name="ESTADO" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["A","I"]) }>
													<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Esta Activo </Checkbox>
													</Form.Item>
													<Form.Item name="IND_MANEJA_STOCK" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) }>
														<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Control de Stock	</Checkbox>
													</Form.Item>
													<Form.Item  name="IND_MANEJA_VTO" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) } >
														<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Control de Vencimiento </Checkbox>
													</Form.Item>
													<Form.Item name="IND_COND_VTA" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) }>
														<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Condicionar Venta </Checkbox>
													</Form.Item>
													<Form.Item name="IND_INPASA" valuePropName="checked"onChange={ (e)=> handleCheckbox(e,["S","N"]) }>
														<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Ventas por INPASA </Checkbox>
													</Form.Item>
													<Form.Item name="IND_ESPECIAL" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) }>
														<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Producto Especial </Checkbox>
													</Form.Item>
													<Form.Item name="IND_JNJ" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) }>
														<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Producto JNJ </Checkbox>
													</Form.Item>
													<Form.Item name="ART_ADICIONAL" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) }>
														<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Tiene articulo Adicional </Checkbox>
													</Form.Item>
													<Form.Item name="ES_PESABLE" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) }>
														<Checkbox onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}> Es Pesable </Checkbox>
													</Form.Item>
													<Form.Item name="VER_CATASTRO" valuePropName="checked" onChange={ (e)=> handleCheckbox(e,["S","N"]) }>
														<Checkbox disabled={ !_.contains(PermisoEspecialWMS, 'AUTORIZADO_CATASTRO') } onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
															Catastro Verificado ?
														</Checkbox>
													</Form.Item>
												</Card>
												<Form.Item name="COD_ALTERNO" label={<label style={{width:'80px'}}>Cód. Alterno</label>}>
													<Input type="number" className="search_input" 
														onChange={handleInputChange} 
														onKeyDown={handleKeyDown} 
														onKeyUp={handleKeyUp} 														
													/>
												</Form.Item>
												<Form.Item name="NRO_ORDEN" label={<label style={{width:'80px'}}>Nro. Ord.</label>}>
													<Input type="number" className="search_input"
														onChange={handleInputChange} 
														onKeyDown={handleKeyDown} 
														onKeyUp={handleKeyUp} 
													
													/>
												</Form.Item>
											</Col>
										</Row>
									</div>
									<Row>
										<Col span={24}>
											<div className="card-container" style={{marginTop:'1px'}}>
												<div id="form-div-2">
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
																columnModal={columnModal_UnidadMedida}
																activateF10={false}
																setActivarSpinner={setActivarSpinner}
																newButtonCancelar={true}
																altura={130}
																setUpdateValue={setUpdateValue_Unidad_Medida}
															/>

															<Row gutter={16}>
																<Col span={16}>
																	<Divider style={{margin:'2px 0'}}>Lead Time</Divider>
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
																		activateF10={false}
																		setActivarSpinner={setActivarSpinner}
																		newButtonCancelar={true}
																		operacion={operacion}
																		altura={83}
																	/>
																</Col>
																<Col span={8}>
																	<Main.Fieldset
																		anchoContenedor="100%"
																		alineacionTitle="center"
																		alineacionContenedor="center"
																		margenTop="10px"
																		tamañoTitle="15px"
																		title="Costos Sin IVA"
																		contenedor={
																			<div style={{ paddingBottom: "10px" }}>
																				<Row>
																					<Col span={12}>
																						<Form.Item label={<label style={{width:'80px'}}>Costo Ult.</label>} name="COSTO_ULTIMO_GS">
																							<Input style={{ textAlign: "right" }} disabled/>
																						</Form.Item>
																					</Col>
																					<Col span={12}>
																						<Form.Item label={<label style={{width:'80px'}}>Promedio</label>} name="COSTO_PROM_GS">
																							<Input style={{ textAlign: "right" }} disabled />
																						</Form.Item>
																					</Col>
																				</Row>
																			</div>
																		}
																	/>
																	<Row>
																		<Col span={12}>
																			<Form.Item label={<label style={{width:'80px'}}>Creado por.</label>} name="COD_USUARIO_ALTA">
																				<Input disabled/>
																			</Form.Item>
																		</Col>
																		<Col span={12}>
																			<Form.Item  label={<label style={{width:'80px'}}>Fecha</label>} name="FEC_ALTA">
																				<Input disabled/>
																			</Form.Item>
																		</Col>
																	</Row>
																	<Row>
																		<Col span={12}>
																			<Form.Item label={<label style={{width:'80px'}}>Modificado</label>} name="COD_USUARIO_MODI" >
																				<Input disabled/>
																			</Form.Item>
																		</Col>
																		<Col span={12}>
																			<Form.Item label={<label style={{width:'80px'}}>Fecha</label>} name="FEC_MODI">
																				<Input disabled/>
																			</Form.Item>
																		</Col>
																	</Row>
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
																activateF10={false}
																setActivarSpinner={setActivarSpinner}
																maxFocus={maxFocus_proveedor}
																newButtonCancelar={true}
																altura={150}
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
																activateF10={false}
																setActivarSpinner={setActivarSpinner}
																newButtonCancelar={true}
																altura={150}
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
																		activateF10={false}
																		setActivarSpinner={setActivarSpinner}
																		// ------
																		// BloqueaLinea={[{"MOVIMIENTO_STOCK_CAB":false}]} // true - false
																		// gridBloqueaLinea={GridMovimientoStockDet}

																		newButtonCancelar={true}
																		altura={150}
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
																		activateF10={false}
																		setActivarSpinner={setActivarSpinner}
																		setCellChanging={setCellChanging}
																		newButtonCancelar={true}
																		altura={150}
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
																activateF10={false}
																setActivarSpinner={setActivarSpinner}
																newButtonCancelar={true}
																altura={150}
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
																	columnModal={columnModal_BloqueoExistencia}
																	activateF10={false}
																	setActivarSpinner={setActivarSpinner}
																	newButtonCancelar={true}
																	altura={150}
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
																				activateF10={false}
																				setActivarSpinner={setActivarSpinner}
																				newButtonCancelar={true}
																				altura={150}
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
																				activateF10={false}
																				setActivarSpinner={setActivarSpinner}
																				newButtonCancelar={true}
																				altura={150}
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
																				activateF10={false}
																				setActivarSpinner={setActivarSpinner}
																				newButtonCancelar={true}
																				altura={150}
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
																				activateF10={false}
																				setActivarSpinner={setActivarSpinner}
																				newButtonCancelar={true}
																				altura={150}
																			/>
																		</TabPane>
																	</Tabs>
																</Col>
															</Row>
														</TabPane>
													</Tabs>
												</div>
											</div>
										</Col>
									</Row>
								</Col>
							</Form>
							<Row style={{padding:'10px'}}>
							<Col span={24}>
								<div className='total_registro_pg'>
									Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
								</div>
							</Col>
							</Row>
						</Paper>
					</div>
				</Main.Spin>
			</Main.Layout>
		</>
  );
});
export default Articulo;