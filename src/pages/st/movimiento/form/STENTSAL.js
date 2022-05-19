import React, { memo, useState, useRef, useEffect } from "react";
import Main from "../../../../components/utils/Main";
import { Menu, DireccionMenu } from '../../../../components/utils/FocusDelMenu';
import { getPermisos } from '../../../../components/utils/ObtenerPermisosEspeciales';
import DevExtremeDet,{getBloqueoCabecera, setBloqueoCabecera      ,getFocusGlobalEventDet, getFocusedColumnName, 
                      setbandBloqueoGrid, getComponenteEliminarDet,getFocusGlobalEventDetAux,getbandBloqueoGrid 
              } from '../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import _ from "underscore";
import moment from "moment";
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import {Typography, Form, Input, Row, Col, Radio, Divider, Card, Button} from 'antd';
import currency     from 'currency.js'
import printer      from '../../../../assets/icons/printer.png';
import iconBuscador from '../../../../assets/icons/search-f7.svg'
import jsPDF        from 'jspdf';
import 'jspdf-autotable';
// let url_retorna_cambio_moneda = '/st/stentsal/varios/retorna_cambio_moneda';
// let url_retorna_precio_unit = '/st/stentsal/varios/retorna_precio_unit';
const { Title }    = Typography;
const { TextArea } = Input;
const TituloList = "Ajustes de Stock";
const FormName = "STENTSAL";
import nuevo            from '../../../../assets/icons/add.svg';
import deleteIcon 	    from '../../../../assets/icons/delete.svg';
import guardar          from '../../../../assets/icons/diskette.svg';
import cancelarEdit     from '../../../../assets/icons/iconsCancelar.svg';
import prev             from '../../../../assets/icons/prev.svg';
import next             from '../../../../assets/icons/next.svg';
import { v4 as uuidID } from "uuid";
import { modifico, setModifico } from "../../../../components/utils/DevExtremeGrid/ButtonCancelar"; 
import ValidarCamposRequeridos, { QuitarClaseRequerido } from "../../../../components/utils/ValidarCamposRequeridos";
// VALIDA
const url_valida_cod_articulo      = '/st/stentsal/valida/articulo';
const url_valida_cod_unidad_medida = '/st/stentsal/valida/unidad_medida';
const url_valida_cantidad          = '/st/stentsal/valida/cantidad';
// BUSCAR
const url_buscar_cod_articulo      = '/st/stentsal/buscar/articulo';
const url_buscar_cod_unidad_medida = '/st/stentsal/buscar/unidad_medida';
const columnModal = {
  urlValidar: [
      {
        COD_ARTICULO: url_valida_cod_articulo,
        COD_UNIDAD_MEDIDA: url_valida_cod_unidad_medida,
        CANTIDAD: url_valida_cantidad,
      },
  ],
  urlBuscador: [
      {
        COD_ARTICULO: url_buscar_cod_articulo,
        COD_UNIDAD_MEDIDA: url_buscar_cod_unidad_medida
      },
  ],
  title: [
      {
        COD_ARTICULO: "Artículo",
        COD_UNIDAD_MEDIDA: "Unidad Medida",
      },
  ],
  COD_ARTICULO:[
    { ID: 'COD_ARTICULO'  , label: 'Código' , width: 100      , align:'left'  },
    { ID: 'DESC_ARTICULO' , label: 'Descripción ' , minWidth: 70    , align:'left'  },
    // { ID: 'COSTO_UNITARIO' , label: 'Costo ' , minWidth: 70    , align:'left'  },
  ],
  COD_UNIDAD_MEDIDA:[
    { ID: 'COD_UNIDAD_MEDIDA' , label: 'Unidad Medida' , width: 110    , align:'left'   },
    { ID: 'DESC_UM'           , label: 'Descripción'   , minWidth: 70  , align:'left'   },
  ],
  config:{
    COD_ARTICULO:{
      depende_de:[],
      depende_ex_cab:[
        {id:'COD_SUCURSAL', label:'Sucursal'},
        {id:'COD_MONEDA', label:'Moneda'},
        {id:'TIP_CAMBIO', label:'Tipo Cambio'},
        {id:'DECIMALES', label:'Decimal'},
      ],
      dependencia_de:[
        {id: 'COD_UNIDAD_MEDIDA',label: 'Unidad Medida'},
        {id: 'CANTIDAD',label: 'Cantidad'},
        // {id: 'COSTO_UNITARIO',label: 'Costo'},
        {id: 'MONTO_TOTAL',label: 'Total'}
      ]   
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[
        {id: 'COD_ARTICULO',label: 'Articulo '},
      ],
      depende_ex_cab:[
        {id:'COD_SUCURSAL', label:'Sucursal'},
        {id:'COD_MONEDA', label:'Moneda'},
        {id:'TIP_CAMBIO', label:'Tipo Cambio'},
        {id:'DECIMALES', label:'Decimal'},
      ],
      dependencia_de:[
        {id: 'CANTIDAD',label: 'Cantidad'},
        {id: 'MONTO_TOTAL',label: 'Total'}
      ]   
    },
    CANTIDAD:{
      depende_de:[
        {id: 'COD_ARTICULO' , label: 'Articulo '},
        {id: 'COD_SUCURSAL' , label: 'Sucursal '},
        {id: 'COD_DEPOSITO' , label: 'Deposito '},
        {id: 'DESC_ARTICULO', label: 'Descripción '},
        {id: 'DESC_UM', label: 'Desc. Unidad de Medida '},
        {id: 'IND_ENT_SAL', label: 'Tipo '},
        {id: 'EMI_NEG', label: ' EMI_NEG '},
        {id: 'MULT', label: 'Mult '},
        {id: 'DIV', label: 'Div '},
        {id: 'NRO_LOTE', label: 'Nro. Lote '},
        {id: 'CANT_ANT', label: 'Cantidad anterior '}
      ],
      dependencia_de:[]   
    }
  },  
};
const columns = [
  // { ID: 'NRO_ENT_SAL'       , label: 'Nro Cab'    , width: 80    , disable :true  },
  { ID: 'COD_ARTICULO'      , label: 'Articulo'   , width: 80    , editModal:true  ,requerido:true},
  { ID: 'DESC_ARTICULO'     , label: 'Descripcion', minWidth: 75 , disable :true  },
  { ID: 'COD_UNIDAD_MEDIDA' , label: 'U.M'        , width: 65    , editModal:true  ,requerido:true},
  { ID: 'DESC_UM'           , label: 'Descripción', width: 200   , disable :true  },
  { ID: 'CANTIDAD'          , label: 'Cantidad'   , width: 100   , align:'right'  , requerido:true, isnumber:true, format:{type: "fixedPoint", precision: 2}},
  { ID: 'COSTO_UNITARIO'    , label: 'Costo'      , width: 100   , align:'right'  , requerido:true, isnumber:true, format:{type: "fixedPoint", precision: 2}},
  { ID: 'MONTO_TOTAL'       , label: 'Total'      , width: 100   , align:'right'  , isnumber:true , disable :true}
];
const notOrderByAccionDet = ["NRO_ENT_SAL","COD_ARTICULO","DESC_ARTICULO","COD_UNIDAD_MEDIDA","DESC_UM","CANTIDAD","COSTO_UNITARIO","MONTO_TOTAL"];
const operacion = {
  operac:'multiplicacion',
  valor1:'CANTIDAD',
  valor2:'COSTO_UNITARIO',
  resultado:'MONTO_TOTAL'
}
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
var ArrayPushDelete      = {}
const limpiarArrayDelete = () =>{
  ArrayPushDelete = [];
}

var DeleteCabecera      = []
const limpiarDeleteCabecera = () =>{
  DeleteCabecera = [];
}

// --
const url_base = '/st/stentsal';
const url_nro_ent_sal = '/st/stentsal/nro_ent_sal';
const url_tipo_cambio = '/st/stentsal/tipo_cambio'
// BUSCAR
const url_buscar_sucursal = '/st/stentsal/buscar/sucursal';
const url_buscar_motivo = '/st/stentsal/buscar/motivo';
const url_buscar_deposito = '/st/stentsal/buscar/deposito';
const url_buscar_proveedor = '/st/stentsal/buscar/proveedor';
const url_buscar_moneda = '/st/stentsal/buscar/moneda';
// VALIDAR
const url_validar_sucursal = '/st/stentsal/valida/sucursal';
const url_validar_motivo = '/st/stentsal/valida/motivo';
const url_validar_deposito = '/st/stentsal/valida/deposito';
const url_validar_proveedor = '/st/stentsal/valida/proveedor';
const url_validar_moneda = '/st/stentsal/valida/moneda';
// COLUMNAS
const columnSucursal = [
  { ID: 'COD_SUCURSAL', label: 'Código', width:50 },
  { ID: 'DESC_SUCURSAL', label: 'Descrición', minWidth:150 },
]
const columnMotivo = [
  { ID: 'COD_MOTIVO', label: 'Código', width:50 },
  { ID: 'DESC_MOTIVO', label: 'Descrición', minWidth:150 },
  { ID: 'IND_ENT_SAL', label: 'Tipo', width:50 },
  { ID: 'AFECTA_COSTO', label: 'Afecta Costo', width:80 },
]
const columnDeposito = [
  { ID: 'COD_DEPOSITO', label: 'Código', width:50 },
  { ID: 'DESC_DEPOSITO', label: 'Descrición', minWidth:150 },
]
const columnProveedor = [
  { ID: 'COD_PROVEEDOR', label: 'Código', width:50 },
  { ID: 'DESC_PROVEEDOR', label: 'Descrición', minWidth:150 },
]
const columnMoneda = [
  { ID: 'COD_MONEDA', label: 'Código', width:50 },
  { ID: 'DESC_MONEDA', label: 'Descrición', minWidth:150 },
  { ID: 'TIP_CAMBIO', label: 'Tip. Cambio', width:150, number: true },
  { ID: 'TIP_CAMBIO_US', label: 'Tip. Cambio Us.', width:150, number: true },
]
var VerificaValidador = {
  state: false,
  field: ''
}
const getVerificaValidador = () => {
  return VerificaValidador;
}
const setVerificaValidador = (value) => {
  VerificaValidador = value
}
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
const maxFocus = [{
	id:"GRID_DETALLE",
	hasta:"COSTO_UNITARIO",
	newAddRow:true,
  nextId:'MONTO_TOTAL'
}];

var GLOBAL_COD_SUCURSAL  = '';
var GLOBAL_COD_MOTIVO    = '';
var GLOBAL_COD_DEPOSITO  = '';
var GLOBAL_COD_PROVEEDOR = '';
var GLOBAL_COD_MONEDA    = '';
var MODO                 =  'I';
// variable global, identifica la posicion del focus para la eliminación cabecera detalle
var bandCabDet           = true;




// const calcula_costo_unitario = async(b_cabecera, b_detalle, cod_articulo) => {
//   let vprecio = 0;
//   let vcosto = 0;
//   let vmoneda = 0;
//   let vtipcambio = 0;
//   let vprecio_unitario = 0;
//   let result = await Main.Request(url_retorna_cambio_moneda,'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), cod_sucursal: b_cabecera.COD_SUCURSAL });
//   vmoneda = result.data.outBinds.MONEDA;
//   vtipcambio = result.data.outBinds.TIP_CAMBIO;
//   vprecio = await Main.Request(url_retorna_precio_unit,'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), cod_sucursal:b_cabecera.COD_SUCURSAL, cod_articulo})
//     .then(response => {
//       return response.data.outBinds.ret;
//     });
  
//   console.log(' =============> ', vprecio);

//   if(b_cabecera.COD_MONEDA == vmoneda){
//     vcosto = vprecio;
//   }else{
//     vcosto = (vprecio / b_cabecera.TIP_CAMBIO * vtipcambio)
//   }
//   // console.log(vcosto);
//   // if(b_detalle.div > 1){
//   //   vprecio_unitario = (vcosto * b_detalle.MULT / b_detalle.DIV).toFixed(2);
//   // }else{
//     vprecio_unitario = vcosto//(vcosto * b_detalle.MULT);
//   // }
//   return parseFloat(vprecio_unitario);
// }




const STENTSAL = memo(() => {
  const [form]              = Form.useForm();
  const initialRow          = [{NRO_ENT_SAL:"NRO_ENT_SAL"}];
  const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
	const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
  const PermisoEspecial     = getPermisos(FormName);
  const cod_empresa         = sessionStorage.getItem('cod_empresa');
  const [activarSpinner, setActivarSpinner] = useState(false);
  const Grid                = useRef();
  const url_cabecera        = '/st/stentsal/cabecera';
  const url_detalle         = '/st/stentsal/detalle';
  const [ Data   , setData    ] = useState([]);
  const [ DataAux, setDataAux ] = useState([]);
  const codSucursalRef    = useRef();
  const nroEntSalRef      = useRef();
  const fecEntSalRef      = useRef();
  const codMotivoRef      = useRef();
  const codDepositoRef    = useRef();
  const observacionRef    = useRef();
  const codProveedorRef   = useRef();
  const codMonedaRef      = useRef();
  const serComprobanteRef = useRef();
  const nroComprobanteRef = useRef();
  // const estadoRef = useRef();
  //-----------------------Estado Modal mensaje ----------------------------------
  const [ showMessageButton    , setShowMessageButton     ] = useState(false)
  const [ visibleMensaje	     , setVisibleMensaje        ] = useState(false);
  const [ mensaje	    		 		 , setMensaje		   		      ] = useState();
  const [ imagen	    		 	 	 , setImagen		  		      ] = useState();
  const [ tituloModal	    	   , setTituloModal	   	      ] = useState();
  const [ searchColumns        , setSearchColumns         ] = useState({});
	const [ modalTitle           , setModalTitle            ] = useState('');
  const [ tipoDeBusqueda       , setTipoDeBusqueda        ] = useState();
	const [ shows                , setShows                 ] = useState(false);
  const [ searchData           , setSearchData            ] = useState([]);
  const [ IsInputBloqued       , setIsInputBloqued        ] = useState(false);
  const [ IsCommentBloqued     , setIsCommentBloqued      ] = useState(false);
  const [ IsPendienteBloqued   , setIsPendienteBloqued    ] = useState(false);
  const [ IsCondfirmadoBloqued , setIsConfirmadoBloqued   ] = useState(false);
  const [ IsAnularBloqued      , setIsAnularBloqued       ] = useState(false);

  Main.useHotkeys(Main.Guardar, (e) =>{
    e.preventDefault();
    var infoPermiso = Main.VerificaPermiso(FormName);

    SaveForm();

    // console.log('entro aqui ', infoPermiso);

  },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
  Main.useHotkeys('F7', (e) => {
    e.preventDefault();
  });
  Main.useHotkeys('F8', (e) => {
    e.preventDefault();
  });
  useEffect(() => {
    document.getElementById("form-div-stentsal").addEventListener('click', function (e){
			bandCabDet = true
		});

    document.getElementById("form-div-stentsal-grid").addEventListener('click', function (e){
			bandCabDet = false
		});

    InitialFormData();
  }, []);
  const InitialFormData = async() => {
    bandCabDet = true
    setBloqueoCabecera(false);
    clearForm();
    var tipo_cambio = await getCambioDolares();
    var moneda      = await getData({valor:null},url_buscar_moneda);
    moneda          = moneda.find(item => item.COD_MONEDA == '1');
    var newKey      = uuidID();
    var valor = {
      ['ID']: newKey,
      ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
      ['COD_SUCURSAL']: sessionStorage.getItem('cod_sucursal'),
      ['DESC_SUCURSAL']: sessionStorage.getItem('desc_sucursal'),
      ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
      ['FEC_ENT_SAL']: moment().format('DD/MM/YYYY'),
      ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'), 
      ['TIP_CAMBIO_US']: tipo_cambio.data,
      ['TIP_CAMBIO_US_FORMAT']: tipo_cambio.data ? new Intl.NumberFormat("de-DE").format( tipo_cambio.data.toFixed(0) ) : '' ,
      ['TIP_CAMBIO']: 1,
      ['TIP_CAMBIO_FORMAT']: 1,
      ['TIP_ENT_SAL']: 'AJS',
      ['SER_ENT_SAL']: 'A',
      ['NRO_ENT_SAL']: '',
      ['ESTADO']: 'P',
      ['ESTADO_ANT']: 'P',
      ['COD_MONEDA']: moneda.COD_MONEDA,
      ['DESC_MONEDA']: moneda.DESC_MONEDA,
      ['TIP_CAMBIO']: moneda.TIP_CAMBIO,
      ['insertedDefault']: true,
    }
    setData([valor]);
    setDataAux( JSON.stringify([valor]) );
    form.setFieldsValue(valor);
    GLOBAL_COD_SUCURSAL = sessionStorage.getItem('cod_sucursal');
    MODO = 'I';
    EstadoFormulario('I');

    setTimeout( ()=> {
      var content = [{
        ID	          : newKey,
        NRO_ENT_SAL   : form.getFieldValue('NRO_ENT_SAL') !== undefined ? form.getFieldValue('NRO_ENT_SAL') : newKey,
        COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
        COD_SUCURSAL  : sessionStorage.getItem('cod_sucursal'),
        idCabecera    : newKey,
        InsertDefault : true,
        IDCOMPONENTE  : "GRID_DETALLE",
        NRO_ORDEN     : 1,
        CANTIDAD      : '',
        MONTO_TOTAL   : '',
      }];
      const dataSource = new DataSource({
        store: new ArrayStore({
          data: content,
        }),
        key: 'ID'
      })
      Grid.current.instance.option('dataSource', dataSource);
      Grid.current.instance.option("FocusedRowIndex", 0);
    },50 );
    setTimeout( ()=> {
      Grid.current.instance.focus(Grid.current.instance.getCellElement(0,0));
    },90 );
    setTimeout( ()=> {
      codSucursalRef.current.focus();
    },100 );    
  }
  const getCambioDolares = async() => {
    try {
			return await Main.Request(url_tipo_cambio, "POST", {p_cod_moneda:2, p_tipo:'D', p_fecha:moment().format('DD/MM/YYYY'), p_opcion:'V' });
		} catch (error) {
			console.log(error);
		} finally {
			setActivarSpinner(false);
		}
  }
  const getDataCab = async () => {
		try {
			var data = {
        cod_empresa: sessionStorage.getItem('cod_empresa'),
        cod_sucursal: form.getFieldValue('COD_SUCURSAL') != undefined ? form.getFieldValue('COD_SUCURSAL') : '',
        nro_ent_sal: form.getFieldValue('NRO_ENT_SAL') != undefined ? form.getFieldValue('NRO_ENT_SAL') : '',
        fec_ent_sal: form.getFieldValue('FEC_ENT_SAL') != undefined ? form.getFieldValue('FEC_ENT_SAL') : '',
        cod_motivo: form.getFieldValue('COD_MOTIVO') != undefined ? form.getFieldValue('COD_MOTIVO') : '',
        cod_deposito: form.getFieldValue('COD_DEPOSITO') != undefined ? form.getFieldValue('COD_DEPOSITO') : '',
        cod_proveedor: form.getFieldValue('COD_PROVEEDOR') != undefined ? form.getFieldValue('COD_PROVEEDOR') : '',
        cod_moneda: form.getFieldValue('COD_MONEDA') != undefined ? form.getFieldValue('COD_MONEDA') : '',
        estado: form.getFieldValue('ESTADO') != undefined ? form.getFieldValue('ESTADO') : '',
        tip_comprobante_ref: form.getFieldValue('TIP_COMPROBANTE_REF') != undefined ? form.getFieldValue('TIP_COMPROBANTE_REF') : '',
        ser_comprobante_ref: form.getFieldValue('SER_COMPROBANTE_REF') != undefined ? form.getFieldValue('SER_COMPROBANTE_REF') : '',
        nro_comprobante_ref: form.getFieldValue('NRO_COMPROBANTE_REF') != undefined ? form.getFieldValue('NRO_COMPROBANTE_REF') : '',
      }
			await Main.Request(url_cabecera, "POST", data).then((resp) => {
				if (resp.data.response.rows.length > 0) {
          MODO = 'U';
          setIndice(0);
          setData(resp.data.response.rows);
          setDataAux( JSON.stringify(resp.data.response.rows));
          setLongitud(resp.data.response.rows.length );
          loadForm(resp.data.response.rows);
          EstadoFormulario('U',resp.data.response.rows);
          setTimeout( ()=> {
            document.getElementById('COD_SUCURSAL').focus();
          },200 );
				}else{
          showModalMensaje('Atencion!','atencion',`La busqueda no ha retornado ningun registro`);
        }
			});
		} catch (error) {
			console.log(error);
		} finally {
			setActivarSpinner(false);
		}
	};
  const getDataDet = async(cab) => {
    var content = [];
    var nro_ent_sal = 0;
    if(cab.length > 0) nro_ent_sal = cab[getIndice()].NRO_ENT_SAL;
    var info = await Main.Request(url_detalle,'POST',{
      cod_empresa: sessionStorage.getItem("cod_empresa"),
      nro_ent_sal: nro_ent_sal
    });
    if(info.data.response.rows.length == 0){
      var newKey = uuidID();
      content = [{
        ID	          : newKey,
        NRO_ENT_SAL   : form.getFieldValue('NRO_ENT_SAL') !== undefined ? form.getFieldValue('NRO_ENT_SAL') : newKey,
        COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
        COD_SUCURSAL  : form.getFieldValue('COD_SUCURSAL'),
        idCabecera    : cab[getIndice()].ID,
        InsertDefault : true,
        IDCOMPONENTE  : "GRID_DETALLE",
        NRO_ORDEN     : 1,
        COSTO_UB      : 0,
        COSTO_ULTIMO  : 0,
      }]
    }else{
      content = info.data.response.rows
    }
    var tot_comprobante = _.reduce(_.map(content,function(map) {
      if(map.MONTO_TOTAL != undefined ){
        return parseFloat(map.MONTO_TOTAL);
      }else{
        return 0;
      }
    }),function(memo, num) {
        return memo + num;
    },0);
    if(_.isNaN(tot_comprobante)) tot_comprobante = 0;
    form.setFieldsValue({
      ...form.getFieldsValue(),
      ['TOT_COMPROBANTE'] : new Intl.NumberFormat("de-DE").format(tot_comprobante),
      ['COSTO_UB']        : new Intl.NumberFormat("de-DE").format(content[0].COSTO_UB),
      ['COSTO_ULTIMO']    : content[0].COSTO_ULTIMO ? new Intl.NumberFormat("de-DE").format(content[0].COSTO_ULTIMO.toFixed(0) ) : 0,
    });
    const dataSource = new DataSource({
      store: new ArrayStore({
        data: content,
      }),
      key: 'ID'
    })
    Grid.current.instance.option('dataSource', dataSource);
    setTimeout(()=>Grid.current.instance.option("focusedRowIndex",0),40);
  }
  const getData = async (data, url) => {
		try {
			return await Main.Request(url, "POST", data)
        .then((resp) => {
          return resp.data.rows;
			});
		} catch (error) {
			console.log(error);
      return [];
		}
	};
  const manejaF7 =async()=>{
    setVerificaKeydown({ state: false, e: '' })
    if(!getBloqueoCabecera()){
      //  F7
      var tipo_cambio = await getCambioDolares();
      await clearForm();
      setData([{
        ['COD_EMPRESA'  ]: sessionStorage.getItem('cod_empresa'),
        ['TIP_ENT_SAL'  ]: 'AJS',
        ['SER_ENT_SAL'  ]: 'A',
        ['NRO_ENT_SAL'  ]: '',
        ['TIP_CAMBIO_US']: tipo_cambio.data,
        ['DECIMALES'    ]: 0,
        ['inserted'     ]: true,
      }]);
      setIndice(0);
      var newKey = uuidID();
      const content = [{
        ID	          : newKey,      
        COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
        InsertDefault : true,
      }]
      const dataSource = new DataSource({
        store: new ArrayStore({
          data: content,
        }),
        key: 'ID'
      });
      Grid.current.instance.option('dataSource', dataSource);
      setTimeout(() => {
        Grid.current.instance.option("focusedRowIndex",0)
      },200);
      EstadoFormulario('I',Data); 
      setTimeout( ()=> {
        document.getElementById('NRO_ENT_SAL').focus();
      },400 );
    }else{
      setShowMessageButton(true)
      showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
    }
  }
  const handleKeyDown = async(e) => {
    setVerificaKeydown({ state: true, e: e })
    if(_.contains(['COD_SUCURSAL','COD_MOTIVO','COD_DEPOSITO','COD_PROVEEDOR','COD_MONEDA'],e.target.id)){
      setVerificaValidador({
        state: true,
        field: e.target.id
      })
    }
    if(e.keyCode == 118){
      setVerificaKeydown({ state: false, e: '' })
      e.preventDefault();
      if(!getBloqueoCabecera()){
        //  F7
        var tipo_cambio = await getCambioDolares();
        await clearForm();
        setData([{
          ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
          ['TIP_ENT_SAL']: 'AJS',
          ['SER_ENT_SAL']: 'A',
          ['NRO_ENT_SAL']: '',
          ['TIP_CAMBIO_US']: tipo_cambio.data,
          ['DECIMALES']: 0,
          ['inserted']: true,
        }]);
        setIndice(0);
        var newKey = uuidID();
        const content = [{
          ID	          : newKey,      
          COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
          InsertDefault : true,
        }]
        const dataSource = new DataSource({
          store: new ArrayStore({
            data: content,
          }),
          key: 'ID'
        });
        Grid.current.instance.option('dataSource', dataSource);
        setTimeout(() => {
          Grid.current.instance.option("focusedRowIndex",0)
        },200);

        EstadoFormulario('I',Data); 
        setTimeout( ()=> {
          document.getElementById(e.target.id).focus();
        },400 );
      }else{
        setShowMessageButton(true)
        showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }
    }
    if(e.keyCode == 119){
      e.preventDefault();
      // f8
      if(!getBloqueoCabecera()){
        setModifico();
        getDataCab();
      }else{
        setShowMessageButton(true)
        showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }
    }
    if(e.keyCode == 40){
      e.preventDefault();
      if(!getBloqueoCabecera()){
        if(Data.length == 1){
          clearForm();
          getDataCab();
        }else{
          var index = Indice + 1;
          if(index > getLongitud()-1 ){
            index = getLongitud()-1;
            showMessage('Ultimo Registro => ' + getIndice() )
          }
          setIndice(index);
          loadForm(Data)
          EstadoFormulario('U', Data );
        }
        QuitarClaseRequerido();
      }else{
        setShowMessageButton(true)
        showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }
    }
    if(e.keyCode == 38){
      e.preventDefault();
      if(!getBloqueoCabecera()){
        var index = Indice - 1;
        if(index < 0){
          index = 0;
          showMessage('Primer Registro => ' + getIndice() )
        }
        setIndice(index);
        loadForm(Data);
        EstadoFormulario('U', Data );
        QuitarClaseRequerido();
      }else{
        setShowMessageButton(true)
        showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }
    }
    if(e.keyCode == 13 || e.keyCode == 9){
      e.preventDefault();
      setVerificaKeydown({
				state: false,
				e: ''
			})
      if(e.target.id == 'COD_SUCURSAL'){
        if(GLOBAL_COD_SUCURSAL != e.target.value){
          let result = await validar( url_validar_sucursal, ['DESC_SUCURSAL'], {'cod_empresa':cod_empresa,'valor':e.target.value}, codSucursalRef, nroEntSalRef )
          if(result){
            GLOBAL_COD_SUCURSAL = e.target.value;
            var gridDetalle = [];
            if(Grid.current != undefined) gridDetalle = Grid.current.instance.getDataSource()._items;
            for (let index = 0; index < gridDetalle.length; index++) {
              gridDetalle[index].COD_SUCURSAL = form.getFieldValue('COD_SUCURSAL');
            }
            form.setFieldsValue({
              ...form.getFieldsValue(),
              ['COD_DEPOSITO'] : '',
              ['DESC_DEPOSITO'] : '',
              ['IND_ENT_SAL'] : '',
              ['AFECTA_COSTO'] : '',
            });
            Data[getIndice()].COD_DEPOSITO = '';
            Data[getIndice()].DESC_DEPOSITO = '';
            Data[getIndice()].IND_ENT_SAL = '';
            Data[getIndice()].AFECTA_COSTO = '';
          }
        }else{
          document.getElementById('NRO_ENT_SAL').focus();
        }
      }
      if(e.target.id == 'NRO_ENT_SAL'){
        fecEntSalRef.current.focus();
      }
      if(e.target.id == 'FEC_ENT_SAL'){
        codMotivoRef.current.focus();
      }
      if(e.target.id == 'COD_MOTIVO'){
        let result = await validar( url_validar_motivo, ['DESC_MOTIVO','IND_ENT_SAL','AFECTA_COSTO'], {'cod_empresa':cod_empresa,cod_sucursal: form.getFieldValue('COD_SUCURSAL') ,'valor':e.target.value}, codMotivoRef, codDepositoRef )
        if(result){
          GLOBAL_COD_MOTIVO = e.target.value;
          var gridDetalle = [];
          if(Grid.current != undefined) gridDetalle = Grid.current.instance.getDataSource()._items;
          setTimeout( ()=>{
            for (let index = 0; index < gridDetalle.length; index++) {
              gridDetalle[index].IND_ENT_SAL = Data[getIndice()].IND_ENT_SAL;
            }
          },500 );
        }
      }
      if(e.target.id == 'COD_DEPOSITO'){
        var cod_sucursal = form.getFieldValue('COD_SUCURSAL');
        let result = validar( url_validar_deposito,['DESC_DEPOSITO'], {'cod_empresa':cod_empresa,'cod_sucursal':cod_sucursal,'valor':e.target.value }, codDepositoRef, observacionRef)
        if(result){
          GLOBAL_COD_DEPOSITO = e.target.value;
          var gridDetalle = [];
          if(Grid.current != undefined) gridDetalle = Grid.current.instance.getDataSource()._items;
          for (let index = 0; index < gridDetalle.length; index++) {
            gridDetalle[index].COD_DEPOSITO = form.getFieldValue('COD_DEPOSITO');
          }
        }
      }
      if(e.target.id == 'OBSERVACION'){
        codProveedorRef.current.focus();
      }
      if(e.target.id == 'COD_PROVEEDOR'){
        if(e.target.value.trim().length != 0 ){
          let result = validar( url_validar_proveedor, ['DESC_PROVEEDOR'], {'cod_empresa':cod_empresa,'valor':e.target.value}, codProveedorRef, codMonedaRef )
          if(result) GLOBAL_COD_PROVEEDOR = e.target.value;
        }else{
          GLOBAL_COD_PROVEEDOR = '';
          setValidaDato({
            state: false,
            position: '',
          })
          codMonedaRef.current.focus();
        }
      }
      if(e.target.id == 'COD_MONEDA'){
        let result = validar( url_validar_moneda, ['DESC_MONEDA','TIP_CAMBIO'], {'cod_empresa':cod_empresa,'valor':e.target.value}, codMonedaRef, serComprobanteRef )
        if(result){
          setTimeout( async()=> {
            form.setFieldsValue({
              ...form.getFieldsValue(),
              TIP_CAMBIO_FORMAT: currency(form.getFieldValue('TIP_CAMBIO'), { separator:'.',decimal:',',precision:0,symbol:'' } ).format()
            })
          },200 )
          GLOBAL_COD_MONEDA = e.target.value;
          Grid.current.instance.focus(Grid.current.instance.getCellElement(0,0));
        } 
      }
    }
    if(e.keyCode == '120'){  
      e.preventDefault();
      setTipoDeBusqueda(e.target.id);
      if(IsInputBloqued){
        return;
      }
      switch(e.target.id){
        case "COD_SUCURSAL":
          var auxSucursal = await getData( {cod_empresa: cod_empresa}, url_buscar_sucursal);
          setModalTitle("Sucursal");
          setSearchColumns(columnSucursal);
          setSearchData(auxSucursal);
          setShows(true); 
          break;
        case "COD_MOTIVO":
          var auxMotivo = await getData( {cod_empresa: cod_empresa}, url_buscar_motivo);
          setModalTitle("Motivo");
          setSearchColumns(columnMotivo);
          setSearchData(auxMotivo);
          setShows(true); 
          break;
        case "COD_DEPOSITO":
          var auxDeposito = await getData( {cod_empresa: cod_empresa, cod_sucursal: form.getFieldValue('COD_SUCURSAL') }, url_buscar_deposito);
          setModalTitle("Deposito");
          setSearchColumns(columnDeposito);
          setSearchData(auxDeposito);
          setShows(true); 
          break;
        case "COD_PROVEEDOR":
          var auxProveedor = await getData( {cod_empresa: cod_empresa}, url_buscar_proveedor);
          setModalTitle("Proveedor");
          setSearchColumns(columnProveedor);
          setSearchData(auxProveedor);
          setShows(true); 
          break;
        case "COD_MONEDA":
          var auxMoneda = await getData( {cod_empresa: cod_empresa}, url_buscar_moneda);
          setModalTitle("Moneda");
          setSearchColumns(columnMoneda);
          setSearchData(auxMoneda);
          setShows(true); 
          break;
        default:
          e.preventDefault();
          break;
			}      
    }
  }
  const validar = async( url, campos, data, posicionAct, posicionSig )=>{
    var state = true;
    var method = 'POST';
    var response = await Main.Request( url, method, data );
    if( response.status == 200 ){
      if(response.data.outBinds.ret === 1){
        var key = _.keys(_.omit(response.data.outBinds,'ret','p_mensaje') );
        for (let index = 0; index < key.length; index++) {
          const element = key[index];
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [element]: response.data.outBinds[element],
          });
          Data[getIndice()][element] = response.data.outBinds[element];
        }
        setValidaDato({
          state: false,
          position: '',
        })
        if(posicionSig){
          if(posicionSig.current) posicionSig.current.focus();
        }
        setVerificaValidador({ state: false, field: ''});
      }else{
        for (let index = 0; index < campos.length; index++) {
          const element = campos[index];
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [element]: '',
          });
          Data[getIndice()][element] = '';
        }
        showModalMensaje('¡Atención!','alerta', response.data.outBinds.p_mensaje);
        state = false;
        setValidaDato({
          state: true,
          position: posicionAct,
        })
      }
    }else{
      for (let index = 0; index < campos.length; index++) {
        const element = campos[index];
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [element]: '',
        });
        Data[getIndice()][element] = '';
      }
      showModalMensaje('¡Error!','error','Ha ocurrido un error al validar el campo.');
      state = false;
      setValidaDato({
        state: true,
        position: posicionAct,
      })
    }
    return state;
  }
  const loadForm = (content) => {
    form.setFieldsValue({
      ...content[getIndice()],
      TIP_CAMBIO_FORMAT: currency(content[getIndice()]['TIP_CAMBIO'], { separator:'.',decimal:',',precision:0,symbol:'' } ).format()
    });
    getDataDet(content);
    GLOBAL_COD_SUCURSAL = content[getIndice()].COD_SUCURSAL;
    GLOBAL_COD_MOTIVO = content[getIndice()].COD_MOTIVO;
    GLOBAL_COD_DEPOSITO = content[getIndice()].COD_DEPOSITO;
    GLOBAL_COD_PROVEEDOR = content[getIndice()].COD_PROVEEDOR;
    GLOBAL_COD_MONEDA = content[getIndice()].COD_MONEDA;
  }
  const clearForm = async() =>{
    bandCabDet = true
    GLOBAL_COD_SUCURSAL   = '';
    GLOBAL_COD_MOTIVO     = '';
    GLOBAL_COD_DEPOSITO   = '';
    GLOBAL_COD_PROVEEDOR  = '';
    GLOBAL_COD_MONEDA     = '';
    setModifico();
    var tipo_cambio = await getCambioDolares();
    tipo_cambio = tipo_cambio.data;
    let permiso_especial = _.contains(PermisoEspecial, 'CAMBIA_SUCURSAL') ? true : false;
    form.resetFields();
    var valor = { ['COD_EMPRESA'  ]: sessionStorage.getItem('cod_empresa'),
                  ['TIP_ENT_SAL'  ]: 'AJS',
                  ['SER_ENT_SAL'  ]: 'A',
                  ['NRO_ENT_SAL'  ]: '',
                  ['TIP_CAMBIO_US']: tipo_cambio,
                  ['TIP_CAMBIO_US_FORMAT']: currency(tipo_cambio, { separator:'.',decimal:',',precision:0,symbol:'' } ).format()
                }
    if(!permiso_especial) {
      valor.COD_SUCURSAL  = sessionStorage.getItem('cod_sucursal')
      valor.DESC_SUCURSAL = sessionStorage.getItem('desc_sucursal')
    }
    form.setFieldsValue(valor);
    const dataSource = new DataSource({
      store: new ArrayStore({
        data: [],
      }),
      key: 'ID'
    })
    Grid.current.instance.option('dataSource', dataSource);
    QuitarClaseRequerido();
  }
  const NavigateArrow = (e) => {
    if(e.target.id == 'next-arrow'){
      if(!getBloqueoCabecera()){
        if(Data.length == 1){
          getDataCab();
        }else{
          var index = Indice + 1;
          if(index > getLongitud()-1 ){
            index = getLongitud()-1;
            showMessage('Ultimo Registro')
          }
          setIndice(index);
          loadForm(Data);
          EstadoFormulario('U',Data);
        }
        QuitarClaseRequerido();
      }else{
        showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }
    }
    if(e.target.id == 'prev-arrow'){
      if(!getBloqueoCabecera()){
        if(Data.length == 1){
          getDataCab();
        }else{
          var index = Indice - 1;
          if(index < 0){
            index = 0;
            showMessage('Primer Registro')
          }
          setIndice(index);
          loadForm(Data);
          EstadoFormulario('U',Data);
        }
        QuitarClaseRequerido();
      }else{
        showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }
    }
  }
  const showMessage = (mensaje) =>{
    Main.message.warning({
      content  : mensaje,
      className: 'custom-class',
      duration : `${2}`,
      style    : {
        marginTop: '4vh',
      },
    });
  }
  const VerificaTest = async() => {
    var state = true;
    if(VerificaValidador.state){
      if(VerificaValidador.field == 'COD_SUCURSAL'){
        state = await validar( url_validar_sucursal, ['DESC_SUCURSAL'], {'cod_empresa':cod_empresa,'valor':form.getFieldValue('COD_SUCURSAL')}, codSucursalRef, nroEntSalRef );
      }
      if(VerificaValidador.field == 'COD_MOTIVO'){
        state = await validar( url_validar_motivo, ['DESC_MOTIVO','IND_ENT_SAL','AFECTA_COSTO'], {'cod_empresa':cod_empresa,'valor':form.getFieldValue('COD_MOTIVO')}, codMotivoRef, codDepositoRef )
      }
      if(VerificaValidador.field == 'COD_DEPOSITO'){
        state = await validar( url_validar_deposito,['DESC_DEPOSITO'], {'cod_empresa':cod_empresa,'cod_sucursal':form.getFieldValue('COD_SUCURSAL'),'valor':form.getFieldValue('COD_DEPOSITO') }, codDepositoRef, observacionRef)
      }
      if(VerificaValidador.field == 'COD_PROVEEDOR'){
        state = await validar( url_validar_proveedor, ['DESC_PROVEEDOR'], {'cod_empresa':cod_empresa,'valor':form.getFieldValue('COD_PROVEEDOR')}, codProveedorRef, codMonedaRef )
      }
      if(VerificaValidador.field == 'COD_MONEDA'){
        state = await validar( url_validar_moneda, ['DESC_MONEDA','TIP_CAMBIO','TIP_CAMBIO_US'], {'valor':form.getFieldValue('COD_MONEDA')}, codMonedaRef, serComprobanteRef )
      }
    }
    return state;
  }
  const SaveForm = async() => {

    setActivarSpinner(true);

    if(!DeleteCabecera['CABECERA']){
      var ret = await VerificaTest();
      if(!ret){
        setActivarSpinner(false);
        return;
      }
    }

    if(!DeleteCabecera['CABECERA']){
      let verificar_input_requerido = ValidarCamposRequeridos();
      if(!verificar_input_requerido){
        setActivarSpinner(false);
        return;
      } 
    }
    
    if( !_.contains(PermisoEspecial, 'CAMBIA_ESTADO') ){
      if(Data[getIndice()].ESTADO_ANT != undefined){
        if(Data[getIndice()].ESTADO != Data[getIndice()].ESTADO_ANT){
          showModalMensaje('Atencion!','atencion',`No posee permisos para actualizar el estado.`);
          setActivarSpinner(false);
          return
        }
      }
    }

    if( Data[getIndice()].inserted){
      if(Data[getIndice()].ESTADO == 'C' || Data[getIndice()].ESTADO == 'A'){
        showModalMensaje('Atencion!','atencion',`No se puede guardar un ajuste en estado Confirmado o Anulado.`);
        setActivarSpinner(false);
        return;
      }
      if(Data[getIndice()].ESTADO == undefined){
        Data[getIndice()].ESTADO = 'P';
      }
    }
    
    var nro_ent_sal = '';
    var update_insert_cabecera = Data.filter( item => (item.inserted || item.updated) );
    for (let index = 0; index < update_insert_cabecera.length; index++) {
      const element = update_insert_cabecera[index];
      // EN EL CASO DE EL CAMPO NRO_ENT_SAL ESTE VACIO, OBTIENE EL SIGUIENTE VALOR DE LA BD
      if(element.inserted){
        try {
          var nro_ent_sal = await Main.Request( url_nro_ent_sal, 'POST', {'cod_empresa':cod_empresa} )
          element.NRO_ENT_SAL = nro_ent_sal.data.rows[0].NRO_ENT_SAL;
          nro_ent_sal = nro_ent_sal.data.rows[0].NRO_ENT_SAL;
        } catch (error) {
          showModalMensaje('¡Error!','error','Ha ocurrido un error al obtener el numero');
          console.log(error);
        }
      }
    }
    var gridDetalle = [];
	  if(Grid.current != undefined) gridDetalle = Grid.current.instance.getDataSource()._items;
    for (let index = 0; index < gridDetalle.length; index++) {
      const element = gridDetalle[index];
      element.COD_SUCURSAL = Data[getIndice()].COD_SUCURSAL;
      element.COD_DEPOSITO = Data[getIndice()].COD_DEPOSITO;
      element.IND_ENT_SAL = Data[getIndice()].IND_ENT_SAL;
      element.AFECTA_COSTO = Data[getIndice()].AFECTA_COSTO;
    }
    // Detalle
    // ESTABLECE EL NRO_ENT_SAL EN EL DETALLE
    var infoDetalle = await Main.GeneraUpdateInsertDet(gridDetalle,['COD_ARTICULO'], update_insert_cabecera, [],"NRO_ENT_SAL");
    var aux_detalle = infoDetalle.rowsAux;
    var update_insert_detalle = infoDetalle.updateInsert;

    // VALIDADOR
    var datosValidar = {
      id:[{ 
        GRID_DETALLE:Grid,
      }],
      column:[{ 
          GRID_DETALLE:columns, 		
      }],
      datos:[{
         GRID_DETALLE:update_insert_detalle,
      }]
    }
    const valor = await Main.ValidarColumnasRequeridas(datosValidar);
    if(valor) {
      setActivarSpinner(false);
      return;
    }

    var info = [];
    info.push({
      cod_empresa: cod_empresa,
      cod_usuario: sessionStorage.getItem('cod_usuario')
    });
    // AJUSTA FORMATO DE FECHA ANTES DE ENVIAR AL BACKEND
    if(update_insert_detalle.length > 0){
        var arryAux = []
        update_insert_detalle.forEach(element => {
            if(!element.FEC_VENCIMIENTO){
              arryAux.push({
                ...element,
                FEC_VENCIMIENTO: Main.moment(element.FEC_VENCIMIENTO).format('DD/MM/YYYY')
              })
            }else{
              arryAux.push({
                ...element,
                FEC_VENCIMIENTO:''
              })
            }
        });
      update_insert_detalle = arryAux;
    }
    var data = {
      update_insert_cabecera,
      info,
      dataDetalle: update_insert_detalle,
      dataBorrarDetalle: ArrayPushDelete.GRID_DETALLE,
      dataBorrarCabecera: _.isUndefined(DeleteCabecera['CABECERA']) ? [] : DeleteCabecera['CABECERA'],
      aux_update_insert_cabecera: JSON.parse(DataAux)
    };
    
    if( update_insert_cabecera.length      > 0 ||
       update_insert_detalle.length        > 0 ||
       Object.keys(ArrayPushDelete).length > 0 ||
       DeleteCabecera['CABECERA'] !== undefined
      ){          
        try {
          Main.Request( url_base, 'POST', data)
          .then( response => {
            if(response.data.ret == 1){
              setBloqueoCabecera(false);
              setModifico();
              form.setFieldsValue({
                ...form.getFieldsValue(),
                ['NRO_ENT_SAL']:nro_ent_sal
              })
              Main.message.success({
                content  : `Procesado correctamente!!`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                marginTop: '4vh',
                },
              });
              if(Grid.current != undefined){
                var dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_detalle}), key:'ID'})
                Grid.current.instance.option('dataSource', dataSource);
              }
              limpiarArrayDelete();
              limpiarDeleteCabecera();
              getDataCab();
              setActivarSpinner(false);
            }else{
              setActivarSpinner(false);
              showModalMensaje('Atencion!','atencion',`${response.data.p_mensaje}`);
            }
          })
        } catch (error) {
          console.log(error);
          setActivarSpinner(false);
        }
    }else{
      setModifico();
      setVisibleMensaje(false)
      // setBandBloqueo(false)
      Main.message.info({
          content  : `No encontramos cambios para guardar`,
          className: 'custom-class',
          duration : `${2}`,
          style    : {
              marginTop: '2vh',
          },
      });
      setActivarSpinner(false);
    }
  }
  const handleInputChange = (e) =>{
    modifico();
    Data[getIndice()][e.target.id] = e.target.value;
    if(Data[getIndice()]['insertedDefault']){
			Data[getIndice()].insertedDefault = false;
			Data[getIndice()].inserted 		    = true;
		}
    if(!Data[getIndice()]['updated'] && !Data[getIndice()]['inserted']){
      Data[getIndice()]['updated'] = true;
    }
  }
  const showsModal = async (valor) => {
    setShows(valor);
  };
  const showModalMensaje = (titulo, imagen, mensaje) => {
    setTituloModal(titulo);
    setImagen(imagen);
    setMensaje(mensaje);
    setTimeout(()=>{
      setVisibleMensaje(true);
    },10)
  };
  const handleCancel = async() => {
		setVisibleMensaje(false);
		setTimeout(async()=>{
			if(showMessageButton){
        document.getElementById('COD_SUCURSAL').focus();
        cancelar()
			}
		})
	};
  const onInteractiveSearch = async(event)=> {
    var url = '';
    var valor = event.target.value;
    var data = {'cod_empresa':cod_empresa,'valor':valor}
    if(valor.trim().length === 0 ){
        valor = 'null';
    }
    if(tipoDeBusqueda == 'COD_SUCURSAL'){
      url = url_buscar_sucursal;
    }
    if(tipoDeBusqueda == 'COD_MOTIVO'){
      url = url_buscar_motivo;
    }
    if(tipoDeBusqueda == 'COD_DEPOSITO'){
      url = url_buscar_deposito;
      data.cod_sucursal = form.getFieldValue('COD_SUCURSAL')
    }
    if(tipoDeBusqueda == 'COD_PROVEEDOR'){
      url = url_buscar_proveedor;
    }
    if(tipoDeBusqueda == 'COD_MONEDA'){
      url = url_buscar_moneda;
    }
    if(valor !== null){
      var method = 'POST';
      await Main.Request( url, method, data )
        .then(response => {
          if( response.status == 200 ){
            setSearchData(response.data.rows);
          }
      });
    }
  };
  const modalSetOnClick = async (datos, BusquedaPor) => {
    if(datos !== "" || datos !== undefined){
      if( BusquedaPor === 'COD_SUCURSAL' ){
        Data[getIndice()].COD_SUCURSAL = datos[0];
        Data[getIndice()].DESC_SUCURSAL = datos[1];
        form.setFieldsValue({
          ...form.getFieldsValue(),
          'COD_SUCURSAL': datos[0],
          'DESC_SUCURSAL': datos[1]
        })
        setTimeout( ()=>{ nroEntSalRef.current.focus() },200 )
      }
      if( BusquedaPor === 'COD_MOTIVO' ){
        Data[getIndice()].COD_MOTIVO = datos[0];
        Data[getIndice()].DESC_MOTIVO = datos[1];
        Data[getIndice()].IND_ENT_SAL = datos[2];
        Data[getIndice()].AFECTA_COSTO = datos[3];
        form.setFieldsValue({
          ...form.getFieldsValue(),
          'COD_MOTIVO': datos[0],
          'DESC_MOTIVO': datos[1],
          'IND_ENT_SAL': datos[2],
          'AFECTA_COSTO': datos[3],
        })
        setTimeout( ()=>{ codDepositoRef.current.focus() },200 ) 
      }
      if( BusquedaPor === 'COD_DEPOSITO' ){
        Data[getIndice()].COD_DEPOSITO = datos[0];
        Data[getIndice()].DESC_DEPOSITO = datos[1];
        form.setFieldsValue({
          ...form.getFieldsValue(),
          'COD_DEPOSITO': datos[0],
          'DESC_DEPOSITO': datos[1]
        })
        setTimeout( ()=>{ observacionRef.current.focus() },200 )
      }
      if( BusquedaPor === 'COD_PROVEEDOR' ){
        Data[getIndice()].COD_PROVEEDOR = datos[0];
        Data[getIndice()].DESC_PROVEEDOR = datos[1];
        form.setFieldsValue({
          ...form.getFieldsValue(),
          'COD_PROVEEDOR': datos[0],
          'DESC_PROVEEDOR': datos[1]
        })
        setTimeout( ()=>{ codMonedaRef.current.focus() },200 )
      }
      if( BusquedaPor === 'COD_MONEDA' ){
        Data[getIndice()].COD_MONEDA = datos[0];
        Data[getIndice()].DESC_MONEDA = datos[1];
        form.setFieldsValue({
          ...form.getFieldsValue(),
          'COD_MONEDA': datos[0],
          'DESC_MONEDA': datos[1],
          'TIP_CAMBIO': datos[2],
          'TIP_CAMBIO_US': datos[3],
        })
        setTimeout( ()=>{ serComprobanteRef.current.focus() },200 )
      }
    }
    showsModal(false)
  };
  const handleFocus = async(event) => {

    let info_count = Grid.current.instance.getDataSource() !== undefined ? Grid.current.instance.getDataSource()._items : []
    let info = getFocusGlobalEventDet();

    if(info){
      if(info.row.data.COD_ARTICULO !== undefined && info.row.data.COD_ARTICULO !== '' || info_count.length > 1){
        setIsInputBloqued(true);
      }else{
        if(Data[getIndice()].ESTADO == 'P' || Data[getIndice()].ESTADO == ''){
          setIsInputBloqued(false);
        }
      }
    }
    if(getVerificaKeydown().state){
      setVerificaKeydown({ state: false, e: ''});
      if(!IsInputBloqued){
        if( 
          GLOBAL_COD_SUCURSAL != form.getFieldValue('COD_SUCURSAL') ||
          GLOBAL_COD_MOTIVO != form.getFieldValue('COD_MOTIVO') ||
          GLOBAL_COD_DEPOSITO != form.getFieldValue('COD_DEPOSITO') ||
          GLOBAL_COD_PROVEEDOR?.trim() != form.getFieldValue('COD_PROVEEDOR') ||
          GLOBAL_COD_MONEDA != form.getFieldValue('COD_MONEDA')
          ){
          VerificaTest();
        }
      }
    }
    if(getValidaDato().state){
      getValidaDato().position.current.focus();
			getValidaDato().position.current.select();
    }else{
      event.target.select();
    }
  };
  const addRow = ()=>{
    setModifico();
    setIndice(0);
    InitialFormData();
  };
  const setRowFocusDet = async (e)=>{
    if(e.row != undefined){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ['COSTO_UB'] : e.row.data.MULT != undefined 
          ? new Intl.NumberFormat("de-DE").format( (e.row.data.COSTO_UNITARIO / e.row.data.MULT).toFixed(Data[getIndice()].DECIMALES) ) 
          : e.row.data.COSTO_UNITARIO != undefined 
          ? new Intl.NumberFormat("de-DE").format( e.row.data.COSTO_UNITARIO)
          : '',
        ['COSTO_ULTIMO'] : e.row.data.COSTO_ULTIMO != undefined ? new Intl.NumberFormat("de-DE").format( e.row.data.COSTO_ULTIMO.toFixed(0) ) : '',
      })
    }
  };
  const setCellChanging = async (e)=> {
    let valor = form.getFieldValue()
    if(valor.COD_MONEDA == 1){
      e.cells[4].column.format = ",##0.##"
      e.cells[5].column.format = "#,##0"
      e.cells[6].column.format = "#,##0"
    }else{
      e.cells[4].column.format = ",##0.##"
      e.cells[5].column.format = ",##0.###"
      e.cells[6].column.format = ",##0.###"
    }
    // if(Data[getIndice()]){
    //   let rows      = Data[getIndice()]
    //   if( _.isUndefined(rows.COD_SUCURSAL) || _.isUndefined(rows.COD_MOTIVO) || _.isUndefined(rows.COD_DEPOSITO) || _.isUndefined(rows.COD_MONEDA)){
    //     // BLOQUEAR
    //     if(getbandBloqueoGrid())setbandBloqueoGrid(false);
    //     if(IsInputBloqued)setIsInputBloqued(false);
    //   }else if(_.isEqual(rows.COD_SUCURSAL.trim(),'') || _.isEqual(rows.COD_MOTIVO.trim(),'') || _.isEqual(rows.COD_DEPOSITO.trim(),'') || _.isEqual(rows.COD_MONEDA.trim(),'')){
    //     if(getbandBloqueoGrid())setbandBloqueoGrid(false);
    //     if(IsInputBloqued)setIsInputBloqued(false);
    //   }else if(Data[getIndice()].ESTADO == 'P'){
    //     if(!getbandBloqueoGrid())setbandBloqueoGrid(true);
    //     setIsInputBloqued(true);
    //   }
    // }
    // let tot_comprobante = Grid.current.instance.getDataSource()._items;
    // tot_comprobante = _.reduce(_.map(tot_comprobante,function(item){
    //   if(item.MONTO_TOTAL != null && item.MONTO_TOTAL != undefined){
    //     return parseFloat(item.MONTO_TOTAL);
    //   }else{
    //     return 0;
    //   }
    // }),function(memo, num){
    //   return memo + num;
    // },0);
    // if(_.isNaN(tot_comprobante)){
    //   tot_comprobante = 0;
    // }
    // form.setFieldsValue({
    //   ...form.getFieldsValue(),
    //   ['TOT_COMPROBANTE']:   new Intl.NumberFormat("de-DE").format( tot_comprobante.toFixed(Data[getIndice()].DECIMALES) )  
    // });
  }
  // const setFocusedCellChanged = async(e)=>{
    // let info = getFocusGlobalEventDet();
    // if(e.column.name == 'COD_ARTICULO'){
    //   if(info?.row.data?.COD_ARTICULO){
    //     info.row.data.COSTO = info.row.data.COSTO_UNITARIO;
    //     console.log('entro aqui ==> ');
    //     // info.row.data.COSTO_UNITARIO = await calcula_costo_unitario(form.getFieldsValue(), info.row.data, info.row.data.COD_ARTICULO);
    //     // Grid.current.instance.refresh();
    //   }
    // }

    // if(info != undefined){
    //   // info.row.data.COSTO = info.row.data.COSTO_UNITARIO * multiplo;
    //   let multiplo = info.row.data.MULT != undefined ? info.row.data.MULT : 1;
    //   info.row.data.COSTO_UNITARIO = info.row.data.COSTO * multiplo;
    // }
    
    // if(e.column.name == 'COD_ARTICULO'){
      // if(info?.row.data?.COD_ARTICULO){
      //   info.row.data.COSTO_UNITARIO = await calcula_costo_unitario(form.getFieldsValue(), info.row.data, info.row.data.COD_ARTICULO);
      //   Grid.current.instance.refresh();
      // }
    // }
    
    // info.row.data.COSTO_UNITARIO = await calcula_costo_unitario(form.getFieldsValue(), info.row.data, e.data.COD_ARTICULO);
  
  // }

  const setUpdateValue = async(value,event,f9)=>{

    if(Data[getIndice()]){
      let rows      = Data[getIndice()]
      if( _.isUndefined(rows.COD_SUCURSAL) || _.isUndefined(rows.COD_MOTIVO) || _.isUndefined(rows.COD_DEPOSITO) || _.isUndefined(rows.COD_MONEDA)){
        // BLOQUEAR
        if(getbandBloqueoGrid())setbandBloqueoGrid(false);
        if(IsInputBloqued)setIsInputBloqued(false);
      }else if(_.isEqual(rows.COD_SUCURSAL.trim(),'') || _.isEqual(rows.COD_MOTIVO.trim(),'') || _.isEqual(rows.COD_DEPOSITO.trim(),'') || _.isEqual(rows.COD_MONEDA.trim(),'')){
        if(getbandBloqueoGrid())setbandBloqueoGrid(false);
        if(IsInputBloqued)setIsInputBloqued(false);
      }else if(Data[getIndice()].ESTADO == 'P'){
        if(!getbandBloqueoGrid())setbandBloqueoGrid(true);
        setIsInputBloqued(true);
      }
    }

    // let tot_comprobante = Grid.current.instance.getDataSource()._items;
    // tot_comprobante = _.reduce(_.map(tot_comprobante,function(item){
    //   if(item.MONTO_TOTAL != null && item.MONTO_TOTAL != undefined){
    //     return parseFloat(item.MONTO_TOTAL);
    //   }else{
    //     return 0;
    //   }
    // }),function(memo, num){
    //   return memo + num;
    // },0);
    // if(_.isNaN(tot_comprobante)){
    //   tot_comprobante = 0;
    // }
    // form.setFieldsValue({
    //   ...form.getFieldsValue(),
    //   ['TOT_COMPROBANTE']:   new Intl.NumberFormat("de-DE").format( tot_comprobante.toFixed(Data[getIndice()].DECIMALES) )  
    // });

    // console.log('local',tot_comprobante);
    // console.log('datagridev',value.component.getDataSource()._items);

    setTimeout(async () => {
      
      let tot_comprobante = await Grid.current.instance.getDataSource()._items;  

      tot_comprobante = _.reduce(_.map(tot_comprobante,function(item){
        if(item.MONTO_TOTAL != null && item.MONTO_TOTAL != undefined){
          return parseFloat(item.MONTO_TOTAL);
        }else{
          return 0;
        }
      }),function(memo, num){
        return memo + num;
      },0);
      if(_.isNaN(tot_comprobante)){
        tot_comprobante = 0;
      }
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ['TOT_COMPROBANTE']:   new Intl.NumberFormat("de-DE").format( tot_comprobante.toFixed(Data[getIndice()].DECIMALES) )  
      });

    },350);
    
    // let info = getFocusGlobalEventDet();
    // setTimeout( ()=> {
    //   console.log(' ==> ', info.row.data.COSTO_UNITARIO);
    //   let costo_unitario = info.row.data.COSTO_UNITARIO;
    //   info.row.data.COSTO_UNITARIO = costo_unitario?.toFixed(Data[getIndice()].DECIMALES); 
    //   Grid.current.instance.refresh();
    // },300)    

    // if(!f9){
    //   // VALIDA;
    //   if(Object.keys(value.newData)[0] == 'COD_ARTICULO'){
    //      //await calcula_costo_unitario(Data[getIndice()], info.row.data, value.newData.COD_ARTICULO);
    //   }
    // }else{
    //   // BUSQUEDA F9
    //   if(getFocusedColumnName() == 'COD_ARTICULO'){
    // //     setTimeout( async()=> {
    // //       let costo_unitario =  await calcula_costo_unitario(Data[getIndice()], info.row.data, event.row.data.COD_ARTICULO);
    //       info.row.data.COSTO_UNITARIO = info.row.data.COSTO_UNITARIO.toFixed(Data[getIndice()].DECIMALES); 
    //       Grid.current.instance.refresh();
    // //     },200 )
    //   }
    // }
  }
  const cancelar = () => {
    bandCabDet = false;
    setShowMessageButton(false)
    limpiarArrayDelete();
    limpiarDeleteCabecera();
    QuitarClaseRequerido();
    setActivarSpinner(true);
    setModifico();
    setBloqueoCabecera(false);
    if(MODO == 'I'){
      InitialFormData();
    }else{
      setData( JSON.parse(DataAux) );
      getDataDet( JSON.parse(DataAux) );
      loadForm( JSON.parse(DataAux) );
      EstadoFormulario('U',Data);
    }

    setVerificaKeydown({
			state: false,
			e: ''
		})

    setValidaDato({
      state: false,
      position: '',
    })

    setTimeout( ()=>{
      setActivarSpinner(false);
      codSucursalRef.current.focus();
    },200 );
  }
  const EstadoFormulario = async (value, line) => {
    if(value === 'I'){
      setbandBloqueoGrid(true);
      setIsCommentBloqued(false);
      setIsPendienteBloqued(false);
      setIsConfirmadoBloqued(false);
      setIsAnularBloqued(false);
      setIsInputBloqued(false);
    }else{
      setIsInputBloqued(true);
      if( line[getIndice()]?.ESTADO == 'P' ){
        setbandBloqueoGrid(true);
        setIsCommentBloqued(false);
        setIsPendienteBloqued(true);
        setIsConfirmadoBloqued(false);
        setIsAnularBloqued(false);
      }else{
        setIsCommentBloqued(true);
        setIsPendienteBloqued(true);
        setIsConfirmadoBloqued(true);
        setIsAnularBloqued(true);
        setbandBloqueoGrid(false);
      }
    }
  }
  const handleEstado = (e) => {
    modifico();
    Data[getIndice()]["ESTADO"] = e.target.value;
    if(!Data[getIndice()]['updated']){
      Data[getIndice()]['updated'] = true;
    }
  }
  const deleteRows = async ()=>{
    if((Data[getIndice()].ESTADO === 'P') && bandCabDet){
      if(!Data[getIndice()].insertedDefault && _.isUndefined(Data[getIndice()].inserted)){
        if(!DeleteCabecera['CABECERA']){
          DeleteCabecera['CABECERA'] = [Data[getIndice()]];
          modifico();
          clearForm();
          setBloqueoCabecera(true)
        }
      }
    }else if(Data[getIndice()].ESTADO === 'P'){
      var idComponente = getComponenteEliminarDet()
      var fila         = getFocusGlobalEventDet().rowIndex;
      var indexRow     = getFocusGlobalEventDet().rowIndex;
      var countRow     = Grid.current.instance.getDataSource()._items.length
    
      if(indexRow !== undefined){
          if(indexRow == -1) indexRow =  0; 
          if(indexRow !== 0){
              indexRow = await indexRow -1;
          }
          var rowsInfo  = await Grid.current.instance.getDataSource()._items[fila];
          if(await _.isUndefined(rowsInfo.inserted) &&  await _.isUndefined(rowsInfo.InsertDefault)){
              modifico();
              rowsInfo.delete = true;
              rowsInfo.COD_EMPRESA = cod_empresa
              if( ArrayPushDelete[idComponente.id] !== undefined){
                  ArrayPushDelete[idComponente.id] = _.union(ArrayPushDelete[idComponente.id], [rowsInfo]);
              }else{
                ArrayPushDelete[idComponente.id] = [rowsInfo];
              }
              Grid.current.instance.deleteRow(fila)
              Grid.current.instance.repaintRows([indexRow])
              if(countRow == 1){
                setIsInputBloqued(false);
                setbandBloqueoGrid(false);
                var content = [];
                var newKey = uuidID();
                content = [{
                  ID	          : newKey,
                  NRO_ENT_SAL   : form.getFieldValue('NRO_ENT_SAL') !== undefined ? form.getFieldValue('NRO_ENT_SAL') : newKey,
                  COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
                  COD_SUCURSAL  : form.getFieldValue('COD_SUCURSAL'),
                  idCabecera    : Data[getIndice()].ID,
                  InsertDefault : true,
                  IDCOMPONENTE  : "GRID_DETALLE",
                  NRO_ORDEN     : 1,
                  COSTO_UB      : 0,
                  COSTO_ULTIMO  : 0,
                  CANTIDAD      : '',
                  MONTO_TOTAL   : '',
                }]
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  ['TOT_COMPROBANTE'] : 0,
                  ['COSTO_UB'] : 0,
                  ['COSTO_ULTIMO'] : 0,
                });
                const dataSource = new DataSource({
                  store: new ArrayStore({
                    data: content,
                  }),
                  key: 'ID'
                })
                Grid.current.instance.option('dataSource', dataSource);
              }
          }else{
            if(countRow !== 1){
              Grid.current.instance.deleteRow(fila)
              Grid.current.instance.repaintRows([indexRow])
            }else{
              setIsInputBloqued(false);
              Grid.current.instance.deleteRow(fila)
              Grid.current.instance.repaintRows([indexRow])
              var content = [];
              var newKey = uuidID();
              content = [{
                ID	          : newKey,
                NRO_ENT_SAL   : form.getFieldValue('NRO_ENT_SAL') !== undefined ? form.getFieldValue('NRO_ENT_SAL') : newKey,
                COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
                COD_SUCURSAL  : form.getFieldValue('COD_SUCURSAL'),
                idCabecera    : Data[getIndice()].ID,
                InsertDefault : true,
                IDCOMPONENTE  : "GRID_DETALLE",
                NRO_ORDEN     : 1,
                COSTO_UB      : 0,
                COSTO_ULTIMO  : 0,
                CANTIDAD      : '',
                MONTO_TOTAL   : '',
              }]
              form.setFieldsValue({
                ...form.getFieldsValue(),
                ['TOT_COMPROBANTE'] : 0,
                ['COSTO_UB']        : 0,
                ['COSTO_ULTIMO']    : 0,
              });
              const dataSource = new DataSource({
                store: new ArrayStore({
                  data: content,
                }),
                key: 'ID'
              })
              Grid.current.instance.option('dataSource', dataSource);
            }
          }
          setTimeout(()=>{
              var valor = Grid.current.instance.getDataSource()._items;
              if(valor.length >= 0){
                      Grid.current.instance.focus(
                      Grid.current.instance.getCellElement(indexRow,0)
                  )
              }
          },80);
      }
    }else{
      Main.message.warning({
        content  : `El registro ya no puede ser eliminado!!`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {
            marginTop: '2vh',
        },
      });
    }
  }
  const buildReport = async(data) => {
    var rows = [];
    let comprobantes = _.uniq( data, (item)=>{ return item.NRO_ENT_SAL; });
    comprobantes.sort( function(a,b){
      if ( parseInt(a.NRO_ENT_SAL) > parseInt(b.NRO_ENT_SAL) ) { return  1;}
      if ( parseInt(a.NRO_ENT_SAL) < parseInt(b.NRO_ENT_SAL) ) { return -1;}
    });
    comprobantes.map( comprobante => {
      rows = [ ...rows, 
        { 
          COD_ARTICULO: `Nro Ajuste: ${comprobante.NRO_ENT_SAL}`, 
          TIPO_AJUSTE: `Tipo Ajuste: ${comprobante.TIPO_AJUSTE}`,
          ESTADO: `Estado: ${comprobante.ESTADO}`, 
          FEC_COMPROBANTE: `Fecha: ${Main.moment(comprobante.FEC_ENT_SAL).format('DD/MM/YYYY')}`, 
        },
        { 
          COD_ARTICULO: `Depósito: ${comprobante.COD_DEPOSITO} - ${comprobante.DESC_DEPOSITO}`,
          COD_PROVEEDOR: `Proveedor: ${ comprobante.COD_PROVEEDOR != null ? comprobante.COD_PROVEEDOR : ''}`,
          USUARIO: `Usuario: ${comprobante.COD_USUARIO}`,
        },
        {
          COD_ARTICULO: `Motivo: ${comprobante.COD_MOTIVO} - ${comprobante.DESC_MOTIVO}`,
          OBSERVACION: `Observacion: ${comprobante.OBSERVACION}`,
        },
        { COD_ARTICULO: 'Artículo (Cód. Descripción)', 
          DESC_UNIDAD: 'U.M',
          NRO_LOTE:'Nro. Lote', 
          FEC_VENCIMIENTO: 'Fec. Venc.', 
          CANTIDAD: 'Cantidad', 
          COSTO_UNITARIO:'Costo', 
          MONTO_TOTAL: 'Total' 
        }
      ];
      let articulos = data.filter( item => item.NRO_ENT_SAL == comprobante.NRO_ENT_SAL );
      articulos.map( item => {
        rows = [ ...rows, {
          COD_ARTICULO: `${item.COD_ARTICULO} ${item.DESC_ARTICULO}`,
          DESC_UNIDAD: item.DESC_UNIDAD,
          NRO_LOTE: item.NRO_LOTE,
          FEC_VENCIMIENTO: item.FEC_VENCIMIENTO != null ? Main.moment(item.FEC_VENCIMIENTO).format('DD/MM/YYYY') : ' ',
          CANTIDAD: item.CANTIDAD,
          COSTO_UNITARIO:  currency(item.COSTO_UNITARIO, { separator:'.',decimal:',',precision:0,symbol:'' } ).format(),
          MONTO_TOTAL: currency(item.MONTO_TOTAL, { separator:'.',decimal:',',precision:0,symbol:'' } ).format(),
          MONTO_TOTAL_no_format: item.MONTO_TOTAL
        }]
      });
      let total = _.reduce(_.map( articulos ,function(map) {
        return parseFloat(map.MONTO_TOTAL);
      }),function(memo, num) {
          return memo + num;
      },0);
      rows = [...rows, {COSTO_UNITARIO: 'TOTAL: ', MONTO_TOTAL: currency(total, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() }];
    });
    Report(rows);
  }
  const Reporte = async() => {
    setActivarSpinner(true);
    if(
      form.getFieldValue('COD_SUCURSAL') == undefined ||
      form.getFieldValue('FEC_ENT_SAL')  == undefined ||
      form.getFieldValue('NRO_ENT_SAL')  == undefined ||
      form.getFieldValue('ESTADO')       == undefined
      ){
      return setActivarSpinner(false);
    }
    let data = {
      p_empresa: sessionStorage.getItem('cod_empresa'),
      p_sucursal: form.getFieldValue('COD_SUCURSAL'),
      p_fec_ini: form.getFieldValue('FEC_ENT_SAL'),
      p_fec_fin: form.getFieldValue('FEC_ENT_SAL'),
      p_nro_ini: form.getFieldValue('NRO_ENT_SAL'),
      p_nro_fin: form.getFieldValue('NRO_ENT_SAL'),
      p_estado: form.getFieldValue('ESTADO'),
      p_cod_motivo: null,
      p_ind_entsal: null,
      p_cod_articulo: null,
      p_cod_rubro: null,
      p_cod_familia: null,
      p_cod_proveedor: null,
      p_cod_deposito: null,
      p_cod_vehiculo: null,
    }
    await Main.Request( '/st/stentsal/report', 'POST', data)
      .then( response => {
        buildReport(response.data.rows);
      })
  }
  const Report = async(content) => {
    setActivarSpinner(false);
    let info = content;
    let sucursal = `${form.getFieldValue('COD_SUCURSAL')} - ${form.getFieldValue('DESC_SUCURSAL')}`;
    let periodo = `Desde el ${form.getFieldValue('FEC_ENT_SAL')} Hasta el ${form.getFieldValue('FEC_ENT_SAL')}`; 
    let estado = form.getFieldValue('ESTADO') == 'P' ? 'Pendiente' : form.getFieldValue('ESTADO') == 'C' ? 'Confirmado' : 'Anulado';
    let motivo = form.getFieldValue('DESC_MOTIVO');
    var columns    =  [
      { dataKey: 'COD_ARTICULO', header: 'Articulo (Cód. Descripción)' },
      { dataKey: 'DESC_UNIDAD', header: 'U.M' },
      { dataKey: 'NRO_LOTE', header: 'Nro. Lote' },
      { dataKey: 'FEC_VENCIMIENTO', header: 'Fec. Venc.' },
      { dataKey: 'CANTIDAD', header: 'Cantidad' },
      { dataKey: 'COSTO_UNITARIO', header: 'Costo' },
      { dataKey: 'MONTO_TOTAL', header: 'Total' },
    ];
    var Total = _.reduce(_.map(info,function(map) {
      if(map.MONTO_TOTAL_no_format != undefined){
        return parseFloat(map.MONTO_TOTAL_no_format);
      }else{
        return 0;
      }
    }),function(memo, num) {
      return memo + num;
    },0);
    var pdfDoc          = new jsPDF('', 'pt', 'A4');
    var totalPagesExp   = "{total_pages_count_string}";
    pdfDoc.autoTable({
      showHead: 'never',
      theme: 'plain',
      // theme: 'grid',
      columns: columns,
      body: info,
      tableWidth:'wrap',
      styles: {
          overflow: 'linebreak',
          fontSize: 7,
          cellPadding: 2,
          halign: 'right',
          cellWidth: 30,
          textColor: [40,40,40],
          overflow: 'ellipsize'
      },
      columnStyles:{
        0: {halign: 'left', cellWidth:215},
        1: {halign: 'left', cellWidth:65},
        2: {halign: 'right', cellWidth:35},
        3: {halign: 'center', cellWidth:40},
        4: {halign: 'right',  cellWidth:70},
        5: {halign: 'right',  cellWidth:70},
        6: {halign: 'right',  cellWidth:70},
      },
      margin:{top:75, left:15, right:15, bottom:25},
      didDrawPage: function (data) {
        // pdfDoc.addImage(logo_negro, 'png', 15, 15,80,30);
        // pdfDoc.addImage( process.env.REACT_APP_BASEURL + sessionStorage.getItem("ruta_logo")  , 'png', 15, 15,80,30);
        pdfDoc.setFontSize(6);
        pdfDoc.setTextColor(40);
        pdfDoc.text('Fecha: ' + Main.moment().format('DD/MM/YYYY HH:mm:ss'),15,20,'left');
        var str = "Página " + data.pageCount;
        if (typeof pdfDoc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }
        pdfDoc.setFontSize(6);
        pdfDoc.setTextColor(40);
        pdfDoc.text(str,15,27,'left');
        pdfDoc.setFontSize(7);
        pdfDoc.setTextColor(40);
        pdfDoc.text(sessionStorage.getItem("desc_empresa"),(pdfDoc.internal.pageSize.getWidth() / 2),20,'center');
        pdfDoc.setFontSize(10);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text('Ajuste de Stock ',(pdfDoc.internal.pageSize.getWidth() / 2),30,'center');
        pdfDoc.setLineWidth(1);
        pdfDoc.setDrawColor(30,30,30);
        pdfDoc.line(15, 33, pdfDoc.internal.pageSize.getWidth() - 15, 33, 'S');
        pdfDoc.setFont(undefined, 'normal');
        
        // PRIMERA COLUMNA
        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Sucursal: ',15,42, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text(sucursal, 60, 42, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Articulo: ', 15,51,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text('Todos', 60, 51, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Familia: ', 15,60,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text('Todos', 60, 60, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Proveedor: ', 15,69,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text('Todos', 60, 69, 'left');

        // SEGUNDA COLUMNA
        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Rubro: ',230,42,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text('Todos', 280, 42, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Deposito: ',230,51,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text('Todos', 280, 51, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Estado: ',230,60,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text(estado, 280, 60, 'left');

        // TERCERA COLUMNA
        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Motivo: ',380,42,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text(motivo, 430, 42, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Tipo Ajuste: ',380,51,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text('Todos', 430, 51, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Fecha: ', 380,60,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text(periodo, 430, 60, 'left');
        pdfDoc.line(15, 73, pdfDoc.internal.pageSize.getWidth() - 15, 73, 'S')
      },
      willDrawCell: function(data) {
        var rows = data.row.raw?.COD_ARTICULO;
        rows = rows?.trim();
        if(rows?.match(/Nro Ajuste:/) != null || rows?.match(/Depósito:/) != null || rows?.match(/Motivo:/) != null || rows?.match(/Artículo/) != null){
          pdfDoc.setFont(undefined, 'bold')
          pdfDoc.setTextColor(60, 60, 60)
          pdfDoc.setFontSize(7);
          if(rows?.match(/Nro Ajuste:/) != null){
            if (data.section === 'body' && data.column.index == 1) {
              pdfDoc.text(data.row.raw.TIPO_AJUSTE, 230, data.cell.y + 8);
              pdfDoc.text(data.row.raw.ESTADO, 380, data.cell.y + 8);
              pdfDoc.text(data.row.raw.FEC_COMPROBANTE, 500, data.cell.y + 8);
            }
          }
          if(rows?.match(/Depósito:/) != null){
            if (data.section === 'body' && data.column.index == 1) {
              pdfDoc.text(data.row.raw.COD_PROVEEDOR, 380, data.cell.y + 8);
              pdfDoc.text(data.row.raw.USUARIO, 500, data.cell.y + 8);
            }
          }
          if(rows?.match(/Motivo:/) != null){
            if (data.section === 'body' && data.column.index == 1) {
              pdfDoc.text(data.row.raw.OBSERVACION, 230, data.cell.y + 8);
            }
          }
          if(rows?.match(/Artículo/) != null){
            if (data.section === 'body' && data.column.index == 1) {
              pdfDoc.setLineWidth(1);
              pdfDoc.setDrawColor(30,30,30);
              pdfDoc.line(15, data.cell.y + 11, pdfDoc.internal.pageSize.getWidth() - 15, data.cell.y + 11, 'S')
            }
          }
        }
        var line = data.row?.raw?.COSTO_UNITARIO;
        if( line != undefined && (_.isNumber(line) == false) ){
          if(line?.match(/TOTAL:/) != null ){
            pdfDoc.setLineWidth(0.5);
            pdfDoc.setDrawColor(30,30,30);
            pdfDoc.line(pdfDoc.internal.pageSize.getWidth() - 135, data.cell.y, pdfDoc.internal.pageSize.getWidth() - 15, data.cell.y, 'S')
          }
        }
      },
    });

    pdfDoc.line(15, pdfDoc.previousAutoTable.finalY + 5, pdfDoc.internal.pageSize.getWidth() - 15, pdfDoc.previousAutoTable.finalY + 5, 'S')
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(40); 
    pdfDoc.text('TOTAL GENERAL: ',pdfDoc.internal.pageSize.getWidth() - 150, pdfDoc.previousAutoTable.finalY + 15, 'left');
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(40);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text( currency(Total, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() , pdfDoc.internal.pageSize.getWidth() - 15, pdfDoc.previousAutoTable.finalY + 15, 'right');

    if (typeof pdfDoc.putTotalPages === 'function') {
        pdfDoc.putTotalPages(totalPagesExp);
    }
    // pdfDoc.save('rotacion_de_stock_' + Main.moment().format('DD_MM_YYYY') + '.pdf'); 
    setTimeout( ()=>{
      window.open(pdfDoc.output('bloburl'));
    },50 )
  }
  return (
    <>
      <Main.ModalDialogo
        positiveButton={showMessageButton ? "SI" : ""  }
        negativeButton={showMessageButton ? "NO" : "OK"}
        positiveAction={showMessageButton ? SaveForm : null}
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
            <Main.NewTableSearch
              onInteractiveSearch={onInteractiveSearch}
              columns={searchColumns}
              searchData={searchData}
              modalSetOnClick={modalSetOnClick}
              tipoDeBusqueda={tipoDeBusqueda}/>
          }
          descripcionClose=""
          descripcionButton=""
          actionAceptar=""/>
      <Main.Layout
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}>
        <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`}/>
        <Main.Spin size="large" spinning={activarSpinner}>
          <div className="paper-container">
            <Main.Paper className="paper-style">
              <div className="paper-header">        
                <Title level={4} className="title-color">
                  {TituloList}
                  <div level={5} style={{ float:'right', marginTop:'5px', marginRight:'5px', fontSize:'10px'}} className="title-color">{FormName}</div> 
                </Title>
              </div>
              <div className="paper-header-menu">
                <Button 
                  icon={<img src={nuevo} width="25"/>}         
                  className="paper-header-menu-button"
                  // disabled={ insertar == 'S' ? false : true }
                  onClick={()=>addRow()}
                />
                <Button
                  icon={<img src={guardar} width="20" style={{ marginBottom: '3px', }} />}
                  className="paper-header-menu-button"
                  // disabled={ (insertar == 'S' || borrar == 'S') ? false : true }
                  onClick={SaveForm}
                  />
                <Button 
                  style={{marginRight:'5px', marginRight:'1px'}}
                  icon={<img src={deleteIcon} width="25"/>}
                  className="paper-header-menu-button" 
                  onClick={deleteRows}
                />
                <Button
                  id="prev-arrow"
                  icon={<img src={prev} width="25"  id="prev-arrow"/>}
                  className="paper-header-menu-button"
                  onClick={NavigateArrow}
                />
                <Button 
                  id="next-arrow"
                  icon={<img src={next} width="25" id="next-arrow"/>}
                  className="paper-header-menu-button"
                  onClick={NavigateArrow}
                />
                <Button 
                  id="buscador-f7"
                  icon={<img src={iconBuscador} width="25" id="right-arrow"/>}
                  className="paper-header-menu-button" 
                  onClick={manejaF7}
                />
                <Button 
                  // style={{marginBottom:'0px'}}
                  icon={<img src={printer} width="22"/>}
                  // icon={<PrinterOutlined />}
                  className="paper-header-menu-button" 
                  onClick={Reporte}
                />
                <Button 
                  style={{marginLeft:'10px'}}
                  icon={<img src={cancelarEdit} width="25"/>}
                  className="paper-header-menu-button button-cancelar-alternativo button-cancelar-ocultar-visible" 
                  onClick={cancelar}
                />
              </div>
              <Form size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px', marginRight:'20px', marginLeft:'20px'}}>
                <div id="form-div-stentsal">
                  <Row>
                    <Col span={8}>
                      <Form.Item label={<label style={{width:'60px'}}>Sucursal</label>}>
                        <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input 
                            type="number" 
                            className="requerido search_input" 
                            onChange={handleInputChange} 
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            disabled={ !_.contains(PermisoEspecial, 'CAMBIA_SUCURSAL') }
                            readOnly={IsInputBloqued}
                            ref={codSucursalRef} />
                        </Form.Item>
                        <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item label={<label style={{width:'100px'}}>Proveedor</label>}>
                        <Form.Item name="COD_PROVEEDOR" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={handleFocus} readOnly={IsInputBloqued} ref={codProveedorRef}/>
                        </Form.Item>
                        <Form.Item name="DESC_PROVEEDOR" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Row>
                        <Col span={15}>
                          <Form.Item label={<label style={{width:'60px'}}>Numero</label>} name="NRO_ENT_SAL" >
                            <Input type="number" className="search_input" onChange={handleInputChange} onKeyDown={handleKeyDown}	onFocus={handleFocus} style={{textAlign:'right'}} readOnly={IsInputBloqued} ref={nroEntSalRef}/>
                          </Form.Item>
                        </Col>
                        <Col span={9}>
                          <Form.Item label={<label style={{width:'50px'}}>Fecha</label>} name="FEC_ENT_SAL">
                            <Input className="requerido" onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={handleFocus} readOnly={IsInputBloqued} ref={fecEntSalRef}/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={16}>
                      <Row>
                        <Col span={18}>
                          <Form.Item label={<label style={{width:'100px'}}>Moneda</label>}>
                            <Form.Item name="COD_MONEDA" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input type="number" className="requerido search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={handleFocus} readOnly={IsInputBloqued} ref={codMonedaRef}/>
                            </Form.Item>
                            <Form.Item name="DESC_MONEDA" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<label style={{width:'60px'}}>Cambio</label>} name="TIP_CAMBIO_FORMAT">
                              <Input className="requerido" disabled style={{textAlign:'right'}}/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item label={<label style={{width:'60px'}}>Motivo</label>}>
                        <Form.Item name="COD_MOTIVO" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="requerido search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={handleFocus} readOnly={IsInputBloqued} ref={codMotivoRef}/>
                        </Form.Item>
                        <Form.Item name="DESC_MOTIVO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Row>
                        <Col span={12}>
                          <Form.Item label={<label style={{width:'100px'}}>Cambio U$</label>} name="TIP_CAMBIO_US_FORMAT">
                            <Input style={{textAlign:'right'}} className="requerido" disabled/>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={<label style={{width:'100px'}}>Referencias</label>}>
                            <Form.Item name="TIP_COMPROBANTE_REF" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input className="search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} readOnly={IsInputBloqued}/>
                            </Form.Item>
                            <Form.Item name="SER_COMPROBANTE_REF" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                              <Input className="search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} readOnly={IsInputBloqued}/>
                            </Form.Item>
                            <Form.Item name="NRO_COMPROBANTE_REF" style={{width:'calc(100% - 108px)', display:'inline-block'}}>
                              <Input type="number" className="search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} readOnly={IsInputBloqued}/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item label={<label style={{width:'60px'}}>Depósito</label>}>
                        <Form.Item name="COD_DEPOSITO" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="requerido search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={handleFocus} readOnly={IsInputBloqued} ref={codDepositoRef}/>
                        </Form.Item>
                        <Form.Item name="DESC_DEPOSITO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item label={<label style={{width:'100px'}}>Estado</label>} name="ESTADO" onChange={handleEstado}>
                        <Radio.Group>
                          <Radio 
                            value="P"
                            onKeyDown={ handleKeyDown }
                            disabled={ IsPendienteBloqued }
                            >
                            Pendiente
                          </Radio>
                          <Radio 
                            value="C"
                            onKeyDown={ handleKeyDown }
                            disabled={ IsCondfirmadoBloqued}
                            >
                            Confirmado
                          </Radio>
                          <Radio 
                            value="A" 
                            onKeyDown={ handleKeyDown }
                            disabled={ IsAnularBloqued }
                            // disabled={ !_.contains(PermisoEspecial, 'PERMITE_ANULAR') }
                            >
                            Anulado
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item label={<label style={{width:'60px'}}>Observ.</label>} name="OBSERVACION">
                        <TextArea onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={handleFocus} readOnly={IsCommentBloqued} ref={observacionRef}/>
                      </Form.Item>
                    </Col>
                  </Row>
                  </div>
                  <Row>
                  <div id="form-div-stentsal-grid">
                    <Col span={24}>
                      <Divider orientation="left" style={{margin:'2px 0'}}>Detalle</Divider>
                      <DevExtremeDet
                          gridDet={Grid}
                          id="GRID_DETALLE"
                          IDCOMPONENTE="GRID_DETALLE"
                          columnDet={columns}
                          initialRow={initialRow}
                          notOrderByAccion={notOrderByAccionDet}
                          FormName={FormName}
                          guardar={null}
                          columnModal={columnModal}
                          activateF10={true}
                          altura={365}
                          newAddRow={true}
                          canDelete={true}
                          setRowFocusDet={setRowFocusDet}
                          operacion={operacion}
                          setCellChanging={setCellChanging}
                          // setFocusedCellChanged={setFocusedCellChanged}
                          setUpdateValue={setUpdateValue}
                          setActivarSpinner={setActivarSpinner}
                          maxFocus={maxFocus}
                          dataCabecera={Data[getIndice()]}
                          // Este parametro sirve para limpiar los campos requeridos (que se acumulan en un array)
                          // ! si no se agrega este parametro suele perder el foco en la ultima columna y no agrega la nueva linea 
                          // Utilizar solo cuando se tiene un solo componente de datagrid 
                          limpiarColumnaRequerida={true}
                        />
                        <Row style={{paddingTop:'10px'}}>
                          <Col span={16}>
                          </Col>
                          <Col span={4}>
                            <Form.Item label={<label style={{width:'130px'}}>Costo Unidad Básica</label>} name="COSTO_UB">
                              <Input style={{textAlign:'right'}} disabled/>
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item label={<label style={{width:'60px'}}>Total</label>} name="TOT_COMPROBANTE">
                              <Input style={{textAlign:'right'}} disabled/>
                            </Form.Item>
                          </Col>
                        </Row>

                    </Col>
                  </div>
                </Row>
                <div id="form-div-stentsal">
                  <Row gutter={[8,8]}>
                    <Col span={12}>
                      <Divider orientation="left" style={{margin:'2px 0'}}>Costos</Divider>
                      <Card style={{height:'70px', padding:'10px'}}>
                        <Row>
                          <Col span={12}>
                            <Form.Item label={<label style={{width:'60px'}}>Ultimo</label>} name="COSTO_ULTIMO">
                              <Input style={{textAlign:'right'}} disabled/>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Divider orientation="left" style={{margin:'2px 0'}}>Auditoria</Divider>
                      <Card style={{height:'70px', padding:'10px'}}>
                        <Row>
                          <Col span={12}>
                            <Form.Item label={<label style={{width:'80px'}}>Creado por </label>} name="COD_USUARIO">
                              <Input disabled/>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label={<label style={{width:'120px'}}>Modificador por </label>} name="COD_USUARIO_MODI">
                              <Input disabled/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <Form.Item label={<label style={{width:'80px'}}>Fec. Alta</label>} name="FEC_ALTA">
                              <Input disabled/>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label={<label style={{width:'120px'}}>Fec. Modificado</label>} name="FEC_MODI">
                              <Input disabled/>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Main.Paper>
          </div>
        </Main.Spin>
      </Main.Layout>
    </>
  );
});
export default STENTSAL;