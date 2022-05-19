import React, { memo, useState, useRef, useEffect } from 'react';
import { v4 as uuidID } from "uuid";
import { Typography, Form, Input, Row, Col, Radio, Divider, Button, Card} from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import _ from 'underscore';
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import Main from "../../../../components/utils/Main";
import { Menu, DireccionMenu } from '../../../../components/utils/FocusDelMenu';
import { getPermisos } from '../../../../components/utils/ObtenerPermisosEspeciales';
// import { ValidarColumnasRequeridas } from '../../../../components/utils/DevExtremeGrid/ValidarColumnasRequeridas';
import ValidarCamposRequeridos, { QuitarClaseRequerido } from "../../../../components/utils/ValidarCamposRequeridos";
import nuevo from '../../../../assets/icons/add.svg';
import deleteIcon from '../../../../assets/icons/delete.svg';
import guardar from '../../../../assets/icons/diskette.svg';
import cancelarEdit from '../../../../assets/icons/iconsCancelar.svg';
import left from '../../../../assets/icons/prev.svg';
import right from '../../../../assets/icons/next.svg';

import printer from '../../../../assets/icons/printer.png';
// import binocular from '../../../../assets/icons/binocular.svg';
import DevExtremeDet,{
  getBloqueoCabecera, 
  setBloqueoCabecera,
  getFocusGlobalEventDet, 
  getComponenteEliminarDet,
  setbandBloqueoGrid, 
  getbandBloqueoGrid
} from '../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import { modifico, setModifico } from "../../../../components/utils/DevExtremeGrid/ButtonCancelar";
import jsPDF from 'jspdf';
import currency from 'currency.js';
import 'jspdf-autotable';
const columns = [
  // { ID: 'NRO_COMPROBANTE', label: '#', width: 80, disable: true},
  { ID: 'COD_ARTICULO', label: 'Articulo', width: 80, editModal:true, requerido:true },
  { ID: 'DESC_ARTICULO', label: 'Descripción', minWidth: 75, disable :true},
  { ID: 'COD_DEPOSITO', label: 'Salida', width: 80, editModal:true, requerido:true },
  { ID: 'COD_DEPOSITO_ENT',label: 'Entrada', width: 80, editModal:true, requerido:true},
  { ID: 'COD_UNIDAD_MEDIDA', label: 'UM', width: 80, editModal:true, requerido:true },
  { ID: 'DESC_UNIDAD_MEDIDA', label: 'Descripción', minWidth: 75, disable :true},
  { ID: 'CANTIDAD', label: 'Cantidad', width: 80, align:'right', requerido:true, isnumber:true},
  { ID: 'COD_CAUSA', label: 'Causa', width: 80, editModal:true, requerido:true },
  { ID: 'DESC_CAUSA', label: 'Descripción del Estado', width: 300, disable :true }
];
const notOrderByAccionDet = ["COD_ARTICULO","DESC_ARTICULO","COD_DEPOSITO","COD_DEPOSITO_ENT","COD_UNIDAD_MEDIDA","DESC_UNIDAD_MEDIDA","CANTIDAD","DESC_CAUSA"];
const { Title, Text }    = Typography;
const { TextArea } = Input;
const TituloList = "Notas de Envios entre Depósitos";
const FormName = "STENVIO";
// URLS
const url_cabecera = '/st/stenvio/cabecera';
const url_detalle  = '/st/stenvio/detalle';
const url_tipo_cambio = '/st/stenvio/tipo_cambio';
const url_nro_comprobante = '/st/stenvio/nro_comprobante';
const url_base = '/st/stenvio';
// VALIDA
const url_validar_sucursal = '/st/stenvio/valida/sucursal';
const url_validar_motivo = '/st/stenvio/valida/motivo';
const url_validar_articulo = '/st/stenvio/valida/articulo';
const url_validar_deposito_salida = '/st/stenvio/valida/deposito/salida';
const url_validar_deposito_entrada = '/st/stenvio/valida/deposito/entrada';
const url_validar_unidad_medida = '/st/stenvio/valida/unidad_medida';
const url_validar_cantidad = '/st/stenvio/valida/cantidad';
const url_validar_causa = '/st/stenvio/valida/causa';
// BUSCAR
const url_buscar_sucursal = '/st/stenvio/buscar/sucursal';
const url_buscar_motivo = '/st/stenvio/buscar/motivo';
const url_buscar_articulo = '/st/stenvio/buscar/articulo';
const url_buscar_deposito_salida = '/st/stenvio/buscar/deposito/salida';
const url_buscar_deposito_entrada = '/st/stenvio/buscar/deposito/entrada';
const url_buscar_unidad_medida = '/st/stenvio/buscar/unidad_medida';
const url_buscar_cantidad = '/st/stenvio/buscar/cantidad';
const url_buscar_causa = '/st/stenvio/buscar/causa';
// BUSCADORES Y VALIDADRES EN EL GRID
const columnModal = {
  urlValidar: [
    {
      COD_ARTICULO: url_validar_articulo,
      COD_DEPOSITO: url_validar_deposito_salida,
      COD_DEPOSITO_ENT: url_validar_deposito_entrada,
      COD_UNIDAD_MEDIDA: url_validar_unidad_medida,
      CANTIDAD: url_validar_cantidad,
      COD_CAUSA: url_validar_causa,
    },
  ],
  urlBuscador: [
    {
      COD_ARTICULO: url_buscar_articulo,
      COD_DEPOSITO: url_buscar_deposito_salida,
      COD_DEPOSITO_ENT: url_buscar_deposito_entrada,
      COD_UNIDAD_MEDIDA: url_buscar_unidad_medida,
      COD_CAUSA: url_buscar_causa,
    },
  ],
  title: [
    {
      COD_ARTICULO: "Articulo",
      COD_DEPOSITO: "Deposito",
      COD_DEPOSITO_ENT: "Deposito",
      COD_UNIDAD_MEDIDA: "Unidad de Medida",
      COD_CAUSA: "Causa",
    },
  ],
  COD_ARTICULO:[
    { ID:'COD_ARTICULO', label: 'Articulo', width: 110, align:'left'},
    { ID:'DESC_ARTICULO', label:'Descripción', minWidth: 70, align:'left'},
  ],
  COD_DEPOSITO:[
    { ID: 'COD_DEPOSITO', label: 'Deposito', width: 110, align:'left'},
    { ID: 'DESC_DEPOSITO', label: 'Descripción', minWidth: 70, align:'left'},
  ],
  COD_DEPOSITO_ENT:[
    { ID: 'COD_DEPOSITO_ENT'  ,label: 'Deposito' , width: 110      , align:'left'  },
    { ID: 'DESC_DEPOSITO_ENT' ,label: 'Descripción ' , minWidth: 70    , align:'left'  },
  ],
  COD_UNIDAD_MEDIDA:[
    { ID:'COD_UNIDAD_MEDIDA', label: 'Unidad de Medida', width: 110, align:'left'},
    { ID:'DESC_UNIDAD_MEDIDA', label: 'Descripción', minWidth: 70, align:'left'},
  ],
  COD_CAUSA:[
    { ID:'COD_CAUSA', label: 'Causa', width: 110, align:'left'},
    { ID:'DESC_CAUSA', label: 'Descripción', minWidth: 70, align:'left'},
  ],
  config:{
    COD_ARTICULO:{
      depende_de:[],
      depende_ex_cab:[
        {id: 'COD_SUCURSAL',label: 'Sucursal '},
      ],
      dependencia_de:[
        {id: 'COD_UNIDAD_MEDIDA',label: 'Unidad Medida'},
        {id: 'CANTIDAD',label: 'Cantidad'}
      ]   
    },
    COD_DEPOSITO:{
      depende_de:[],
      depende_ex_cab:[
        {id: 'COD_SUCURSAL',label: 'Sucursal '},
      ],
      dependencia_de:[]   
    },
    COD_DEPOSITO_ENT:{
      depende_de:[],
      depende_ex_cab:[
        {id: 'COD_SUCURSAL',label: 'Sucursal '},
      ],
      dependencia_de:[]   
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[
        {id: 'COD_ARTICULO',label: 'Articulo '},
      ],
      dependencia_de:[
        {id:'CANTIDAD',label:'Cantidad'}
      ]   
    },
    CANTIDAD:{
      depende_de:[
        {id: 'COD_ARTICULO',label: 'Articulo '},
        {id: 'COD_DEPOSITO',label: 'Deposito '},
        {id: 'NRO_LOTE',label: 'Nro. Lote '},
        {id: 'DESC_ARTICULO',label: 'Descripción '},
        {id: 'DESC_UNIDAD_MEDIDA',label: 'Descripción '},
        {id: 'CANTIDAD',label: 'Cantidad '},
        {id: 'MULT',label: 'Multiplo '},
        {id: 'DIV',label: 'Div. '},
        {id: 'CANTIDAD_ANT',label: 'Cantidad Anterior '},
      ],
      depende_ex_cab:[
        {id: 'COD_SUCURSAL',label: 'Sucursal '},
      ],
      dependencia_de:[]
    },
    COD_CAUSA:{
      depende_de:[],
      dependencia_de:[]
    }
  },  
};
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
const data_len = 500;
var MODO = 'I';
// COLUMNAS
const columnSucursal = [
  { ID: 'COD_SUCURSAL', label: 'Código', width:50 },
  { ID: 'DESC_SUCURSAL', label: 'Descrición', minWidth:150 },
];
const columnMotivo = [
  { ID: 'COD_MOTIVO', label: 'Código', width:50 },
  { ID: 'DESC_MOTIVO', label: 'Descrición', minWidth:150 },
  { ID: 'IND_ENT_SAL', label: 'Tipo', width:50 },
  { ID: 'AFECTA_COSTO', label: 'Afecta Costo', width:80 },
];
// BORRADO DE LINEA
var DeleteDetalle = {}
const LimpiarDeleteDetalle = () =>{
  DeleteDetalle = [];
}
// LIMITAR EL ULTIMO FOCUS
const maxFocus = [{
	id:"GRID_DETALLE",
	hasta:"COD_CAUSA",
	newAddRow:true,
  nextId:'DESC_CAUSA'
}];
var bandPost_Cab_Det = true;
var ValidaInput = [
  {
    input: 'COD_SUCURSAL',
    url: url_validar_sucursal,
    url_buscar: url_buscar_sucursal,
    valor_ant: null,
    out:[ // RETORNO DE LA FUNCION
      'DESC_SUCURSAL'
    ],
    data:[ // DATOS DE DEPENDENCIA
      'COD_EMPRESA'
    ],
    rel:[ // DATOS RELACIONADOS

    ],
    next: 'COD_MOTIVO', // SIGUIENTE FOCUS
    band:true,
    requerido: true,
  },
  {
    input: 'COD_MOTIVO',
    url: url_validar_motivo,
    url_buscar: url_buscar_motivo,
    valor_ant: null,
    out:[
      'DESC_MOTIVO'
    ],
    data:[
      'COD_EMPRESA'
    ],
    rel:[],
    next:'COMENTARIO',
    band:true,
    requerido: true,
  }
]

var DataAux = "";
var DataDetalleAux = "";

const STENVIO = memo(() => {
  const defaultOpenKeys = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
	const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
  // const infoPermiso = Main.VerificaPermiso(FormName);
  const PermisoEspecial = getPermisos(FormName);
  const cod_empresa = sessionStorage.getItem('cod_empresa');
  const [ activarSpinner, setActivarSpinner ] = useState(false);
  const [ form ] = Form.useForm();
  const Grid = useRef();
  // STATE
  // CABECERA
  const [ Data, setData ] = useState([]);
  // MENSAJES
  const [ showMessageButton, setShowMessageButton ] = useState(false);
  const [ visibleMensaje, setVisibleMensaje ] = useState(false);
  const [ mensaje, setMensaje ] = useState();
  const [ imagen, setImagen ] = useState();
  const [ tituloModal, setTituloModal ] = useState();
  // BUSCADORES
  const [ shows, setShows ] = useState(false);
  const [ modalTitle, setModalTitle ] = useState('');
  const [ searchColumns, setSearchColumns ] = useState({});
  const [ searchData, setSearchData ] = useState([]);
  const [ tipoDeBusqueda, setTipoDeBusqueda ] = useState();
  // REFERENCIAS
  const nroComprobante = useRef();
  const fecComprobante = useRef();
  const codSucursal = useRef();
  const codMotivo = useRef();
  const comentario = useRef();
  // ESTADO FORMULARIO
  const [ IsInputBloqued, setIsInputBloqued ] = useState(false);
  const [ IsCommentBloqued, setIsCommentBloqued ] = useState(false);
  const [ IsPendienteBloqued, setIsPendienteBloqued ] = useState(false);
  const [ IsCondfirmadoBloqued, setIsConfirmadoBloqued ] = useState(false);
  const [ IsAnularBloqued, setIsAnularBloqued ] = useState(false);
  // LINEA POR DEFECTO DEL GRID
  const initialRow = [
    { NRO_COMPROBANTE: "NRO_COMPROBANTE" },
    { COD_SUCURSAL: form.getFieldValue('COD_SUCURSAL') },
    { TIP_COMPROBANTE: 'ENV' },
    { SER_COMPROBANTE: 'A' },
  ];
  Main.useHotkeys(Main.Guardar, (e) =>{
    e.preventDefault();
    SaveForm();
  },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
  Main.useHotkeys('F7', (e) => {
    e.preventDefault();
  });
  Main.useHotkeys('F8', (e) => {
    e.preventDefault();
  });
  useEffect(() => {
    clearForm();
    setTimeout( ()=>{
      initialFormData();
    },100);
  }, []);
  const initialFormData = async()=>{
    setBloqueoCabecera(false);
    var tipo_cambio = await getCambioDolares();
    var newKey = uuidID();
    var valor = {
      ['ID']: newKey,
      ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
      ['COD_SUCURSAL']: sessionStorage.getItem('cod_sucursal'),
      ['DESC_SUCURSAL']: sessionStorage.getItem('desc_sucursal'),
      ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
      ['FEC_COMPROBANTE']: Main.moment().format('DD/MM/YYYY'),
      ['TIP_CAMBIO_US']: tipo_cambio.data.rows[0]?.VAL_VENTA,
      ['TIP_CAMBIO_US_FORMAT']: tipo_cambio.data.rows[0]?.VAL_VENTA ? new Intl.NumberFormat("de-DE").format( tipo_cambio.data.rows[0].VAL_VENTA.toFixed(0) ) : '' ,
      ['TIP_COMPROBANTE']: 'ENV',
      ['SER_COMPROBANTE']: 'A',
      ['NRO_COMPROBANTE']: '',
      ['ESTADO']: 'P',
      ['ESTADO_ANT']: 'P',
      ['insertedDefault']: true,
    }
    setData([valor]);
    DataAux = JSON.stringify([valor]);
    form.setFieldsValue(valor);
    MODO = 'I';
    EstadoFormulario('I');
    setTimeout( ()=> {
      var content = [{
        ID	            : newKey,
        TIP_COMPROBANTE : 'ENV',
        SER_COMPROBANTE : 'A',
        NRO_COMPROBANTE : form.getFieldValue('NRO_COMPROBANTE') !== undefined ? form.getFieldValue('NRO_COMPROBANTE') : newKey,
        COD_EMPRESA     : sessionStorage.getItem('cod_empresa'),
        idCabecera      : newKey,
        InsertDefault   : true,
        IDCOMPONENTE    : "GRID_DETALLE",
        NRO_ORDEN       : 1,
      }];
      const dataSource = new DataSource({
        store: new ArrayStore({
          data: content,
        }),
        key: 'ID'
      })
      Grid.current.instance.option('dataSource', dataSource);
      codSucursal.current.focus();
    },500);
    document.getElementById("indice").textContent = "1";
    document.getElementById("total_registro").textContent = "1";
    document.getElementById("mensaje").textContent = "";
  }
  const getDataCab = async() => {
    setActivarSpinner(true);
    try {
      let data = {
        cod_empresa: cod_empresa,
        nro_comprobante: form.getFieldValue('NRO_COMPROBANTE') != undefined ? form.getFieldValue('NRO_COMPROBANTE') : '',
        fec_comprobante: form.getFieldValue('FEC_COMPROBANTE') != undefined ? form.getFieldValue('FEC_COMPROBANTE') : '',
        cod_sucursal: form.getFieldValue('COD_SUCURSAL') != undefined ? form.getFieldValue('COD_SUCURSAL') : '',
        cod_motivo: form.getFieldValue('COD_MOTIVO') != undefined ? form.getFieldValue('COD_MOTIVO') : '',
        nro_planilla: form.getFieldValue('NRO_PLANILLA') != undefined ? form.getFieldValue('NRO_PLANILLA') : '',
        estado: form.getFieldValue('ESTADO') != undefined ? form.getFieldValue('ESTADO') : '',
        indice: 0,
        limite: data_len
      }
			return await Main.Request(url_cabecera, "POST", data).then((resp) => {
        let response = resp.data.response.rows;
				if (response.length > 0) {
          document.getElementById("total_registro").textContent = response.length;
          setData(response);
          DataAux = JSON.stringify(response);
          MODO = 'U';
          setIndice(0);
          loadForm(response);
          setLongitud(response.length);
          EstadoFormulario('U',response);
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
  const getDataDet = async(data) => {
    const info = await Main.Request(url_detalle,'POST',{
      cod_empresa: sessionStorage.getItem("cod_empresa"),
      tip_comprobante: data.TIP_COMPROBANTE,
      ser_comprobante: data.SER_COMPROBANTE,
      nro_comprobante: data.NRO_COMPROBANTE
    });
    const { rows } = info.data.response;
    DataDetalleAux = JSON.stringify(rows);
    const dataSource = new DataSource({
      store: new ArrayStore({
        data: rows,
      }),
      key: 'ID'
    })
    await Grid.current.instance.option('dataSource', dataSource);
    if(rows?.length > 0){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        DESC_DEPOSITO: rows[0].DESC_DEPOSITO,
        DESC_DEPOSITO_ENT: rows[0].DESC_DEPOSITO_ENT,
        COSTO_ULTIMO: rows[0].COSTO_ULTIMO != undefined ? new Intl.NumberFormat("de-DE").format( parseFloat(rows[0].COSTO_ULTIMO).toFixed(2) ) : '', 
        CANTIDAD_UB: rows[0].CANTIDAD_UB
      })
    }
    setActivarSpinner(false);
    setTimeout(()=>{
      Grid.current.instance.option("focusedRowIndex",0);
    },40);
    return rows;
  }
  const getCambioDolares = async() => {
    try {
			return await Main.Request(url_tipo_cambio, "POST", {});
		} catch (error) {
			console.log(error);
		} finally {
			setActivarSpinner(false);
		}
  }
  const getData = async (data, url) => {
		try {
			return await Main.Request(url, "POST", data).then( resp => { return resp.data.rows });
		} catch (error) {
			console.log(error);
      return [];
		}
	};
  const getRecursiveData = async (data, url) => {
		try {
			return await Main.Request(url, "POST", data)
		} catch (error) {
			console.log(error);
      return [];
		}
	};
  const handleKeyDown = async(e) => {
    if(e.keyCode == 118){
      e.preventDefault();
      ManejaF7();

      console.log(' ===> ', e.target.id);

      setTimeout( ()=> { document.getElementById(e.target.id).focus() }, 800 );
    }
    if(e.keyCode == 119){
      e.preventDefault();
      // f8
      if(!getBloqueoCabecera()){
        // setActivarSpinner(true)
        setModifico();
        getDataCab();
      }else{
        setShowMessageButton(true)
        showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }
    }
    // if(e.keyCode == 40){
    //   e.preventDefault();
    //   if(e.repeat){
    //     console.log('Matiene precionado',e.nativeEvent)
    //   }else{
    //     rightData();
    //   }
    // }
    // if(e.keyCode == 38){
    //   e.preventDefault();
    //   if(e.repeat){
    //     console.log('Matiene precionado',e.nativeEvent)
    //   }else{
    //     leftData();
    //   }
    // }
    if(e.keyCode == 13 || e.keyCode == 9){
      e.preventDefault();
      if(e.target.id == 'NRO_COMPROBANTE') document.getElementById('FEC_COMPROBANTE').focus();
      if(e.target.id == 'FEC_COMPROBANTE') document.getElementById('COD_SUCURSAL').focus();
      if(e.target.id == 'COD_SUCURSAL' || e.target.id == 'COD_MOTIVO') ValidarUnico(e.target.id);
      if(e.target.id == 'COMENTARIO') Grid.current.instance.focus(Grid.current.instance.getCellElement(0,0));
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
        default:
          console.log('No existe codicion de f9');
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
  const loadForm = (data) => {
    form.setFieldsValue(data[getIndice()]);
    getDataDet(data[getIndice()]);
  }
  const clearForm = async() =>{
    
    setModifico();
    var tipo_cambio = await getCambioDolares();
    var newKey = uuidID();
    form.resetFields();
    form.setFieldsValue({
      ['ID']: newKey,
      ['TIP_ENT_SAL']: 'ENV',
      ['SER_ENT_SAL']: 'A',
      ['NRO_ENT_SAL']: '',
      ['TIP_CAMBIO_US']: tipo_cambio.data.rows[0]?.VAL_VENTA,
      ['TIP_CAMBIO_US_FORMAT']: tipo_cambio.data.rows[0]?.VAL_VENTA ? new Intl.NumberFormat("de-DE").format( tipo_cambio.data.rows[0].VAL_VENTA.toFixed(0) ) : '' ,
      ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
      ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
      ['COD_SUCURSAL']:'',
      ['COD_MOTIVO']:'',
      // ['insertedDefault']: true,
    });
    const content = [{
      ID: newKey,      
      COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
      TIP_COMPROBANTE: 'ENV',
      SER_COMPROBANTE: 'A',
      NRO_COMPROBANTE: '',
      InsertDefault: true,
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
    QuitarClaseRequerido();
    LimpiarDeleteDetalle();
  }
  // const showMessage = (mensaje) =>{
  //   Main.message.warning({
  //     content  : mensaje,
  //     className: 'custom-class',
  //     duration : `${2}`,
  //     style    : {
  //       marginTop: '4vh',
  //     },
  //   });
  // }
  const handleInputChange = (e) =>{
    modifico();
    Data[getIndice()][e.target.id] = e.target.value;
    if(Data[getIndice()]['insertedDefault']){
      Data[getIndice()]['insertedDefault'] = false;
      Data[getIndice()]['inserted'] = true;
    }
    if(!Data[getIndice()]['updated'] && !Data[getIndice()]['inserted']){
      Data[getIndice()]['updated'] = true;
    }
  }
  const handleEstado = (e) => {
    modifico();
    Data[getIndice()]["ESTADO"] = e.target.value;
    if(!Data[getIndice()]['updated']){
      Data[getIndice()]['updated'] = true;
    }
    setIsPendienteBloqued(false);
  }
  const ValidarUnico = async(input) => {
    let item = await ValidaInput.find( item => item.input == input);
    if(!_.isObject(item)) return;
    if( form.getFieldValue(item.input).trim().length == 0 ){
      item.valor_ant = null;
      item.band = false;
      item.out.map( x => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [x]: ''
        });
        Data[getIndice()][x] = '';
      });
      item.rel.map( x => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [x]: ''
        });
        Data[getIndice()][x] = '';
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
                Data[getIndice()][x] = response.data.outBinds[x];
              });
              item.rel.map( x => {
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  [x]: ''
                });
                Data[getIndice()][x] = '';
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
                Data[getIndice()][x] = '';
              });
              item.rel.map( x => {
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  [x]: ''
                });
                Data[getIndice()][x] = '';
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
  const testValidar = async() => {
    ValidaInput.map( async item => {
      if( form.getFieldValue(item.input) != item.valor_ant){
        if(!item.band){
          item.band = true;
          return;
        }
        if( form.getFieldValue(item.input).trim().length == 0 ){
          item.valor_ant = null;
          item.band = false;
          item.out.map( x => {
            form.setFieldsValue({
              ...form.getFieldsValue(),
              [x]: ''
            });
            Data[getIndice()][x] = '';
          });
          item.rel.map( x => {
            form.setFieldsValue({
              ...form.getFieldsValue(),
              [x]: ''
            });
            Data[getIndice()][x] = '';
          });
          if(!item.requerido){
            document.getElementById(item.next).focus();
          }
          return;
        }
        try {
          let data = {}
          item.data.map( x => {
            data = { ...data, [x.toLowerCase()]:form.getFieldValue(x) }
          });
          data = {...data, valor:form.getFieldValue(item.input)};
          await Main.Request( item.url, 'POST', data )
            .then( response => {
              if(response.data.outBinds.ret == 1){
                item.valor_ant = form.getFieldValue(item.input);
                item.out.map( x => {
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    [x]: response.data.outBinds[x]
                  });
                  Data[getIndice()][x] = response.data.outBinds[x];
                });
                item.rel.map( x => {
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    [x]: ''
                  });
                  Data[getIndice()][x] = '';
                });
                item.band = true;
              }else{
                item.valor_ant = null;
                item.out.map( x => {
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    [x]: ''
                  });
                  Data[getIndice()][x] = '';
                });
                item.rel.map( x => {
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    [x]: ''
                  });
                  Data[getIndice()][x] = '';
                });
                document.getElementById(item.input).focus();
                document.getElementById(item.input).select();
                item.band = false;
                showModalMensaje('¡Atención!','alerta', response.data.outBinds.p_mensaje);
              }
            });
        } catch (error) {
          console.log(error);
        }
      }
    })
  }
  const handleFocus = async(e) => {
    e.preventDefault();
    await testValidar();
    let info = getFocusGlobalEventDet();
    if(info){
      if(info.row.data.COD_ARTICULO !== undefined && info.row.data.COD_ARTICULO !== ''){
        setIsInputBloqued(true);
      }else if(Data[getIndice()].ESTADO == 'P'){
        setIsInputBloqued(false);
        console.log('habilitar cabecera')
      }
    }
    e.target.select();
  };
  const SaveForm = async() => {
    setActivarSpinner(true);

    let verificar_input_requerido = ValidarCamposRequeridos();
    if(!verificar_input_requerido){
      setActivarSpinner(false);
      return;
    }


    if(Data[getIndice()].ESTADO == 'C'){
      if( !_.contains(PermisoEspecial, 'CONFIRMA_ENVIO') ){
        showModalMensaje('Atencion!','atencion',`No posee permisos para confirmar envios`);
        setActivarSpinner(false);
        return;
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
      if(Data[getIndice()].FEC_COMPROBANTE == undefined){
        Data[getIndice()].FEC_COMPROBANTE = Main.moment().format('DD/MM/YYYY');
      }
    }
    // CABECERA
    let update_insert_cabecera = Data.filter( item => (item.inserted || item.updated) );
    for (let index = 0; index < update_insert_cabecera.length; index++) {
      const element = update_insert_cabecera[index]; 
      try {
        if(element.inserted){
          let info = await Main.Request( url_nro_comprobante, 'POST', {'cod_empresa':cod_empresa} )
          element.NRO_COMPROBANTE = info.data.rows[0].NRO_COMPROBANTE;
        }
      } catch (error) {
        showModalMensaje('¡Error!','error','Ha ocurrido un error al obtener el numero');
        console.log(error);
      }
    }
    // DETALLE
    var gridDetalle = [];
	  if(Grid.current != undefined) gridDetalle = Grid.current.instance.getDataSource()._items;

    gridDetalle.map( (item,i) => {
      item.COD_SUCURSAL = form.getFieldValue('COD_SUCURSAL');
      if(item.FEC_VENCIMIENTO != undefined){
        item.FEC_VENCIMIENTO = Main.moment(item.FEC_VENCIMIENTO).format('DD/MM/YYYY');
      }
    })

    var infoDetalle = await Main.GeneraUpdateInsertDet(gridDetalle,['COD_ARTICULO'], update_insert_cabecera, [],"NRO_COMPROBANTE");
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
    var delete_cabecera = [];
    var delete_detalle = DeleteDetalle.GRID_DETALLE ? DeleteDetalle.GRID_DETALLE : [];

    let aux_update_insert_detalle = DataDetalleAux.length > 0 ? JSON.parse(DataDetalleAux) : [];

    var data = {
      update_insert_cabecera,
      aux_update_insert_cabecera: JSON.parse(DataAux),
      delete_cabecera,
      info,
      update_insert_detalle,
      aux_update_insert_detalle,
      delete_detalle
    };

    let lineas = aux_detalle.filter( item => !item.InsertDefault );
    if(lineas.length == 0){
      Main.message.info({
        content  : `No se puede guardar un registro sin detalles`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {
          marginTop: '2vh',
        },
      });
      setActivarSpinner(false);
      return;
    }

    let rows = [];
    Data.map( ( item ) => { rows = [ ...rows, _.omit(item, 'inserted', 'updated', 'insertedDefault') ] });
    
    // if(activarSpinner ==  false) setActivarSpinner(true);

    if( update_insert_cabecera.length > 0 ||
        delete_cabecera.length > 0        ||
        update_insert_detalle.length > 0  ||
        delete_detalle.length > 0 ){
        try {
          Main.Request( url_base, 'POST', data)
          .then( response => {
            if(response.data.ret == 1){
              setBloqueoCabecera(false);
              setModifico();
              LimpiarDeleteDetalle();
              Main.message.success({
                content  : `Procesado correctamente!!`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                marginTop: '4vh',
                },
              });
              document.getElementById("total_registro").textContent = rows.length;
              setData(rows);
              DataAux = JSON.stringify(rows);
              MODO = 'U';
              setIndice(0);
              loadForm(rows);
              setLongitud(rows);
              EstadoFormulario('U',rows);
              setBloqueoCabecera(false)
              setTimeout( ()=> {
                setActivarSpinner(false);
              },150 );
            }else{
              setActivarSpinner(false);
              showModalMensaje('Atencion!','atencion',`${response.data.p_mensaje}`);
            }
          })
        } catch (error) {
          setActivarSpinner(false);
          showModalMensaje('Atencion!','atencion',`${response.data.p_mensaje}`);
          console.log(error);
        }
    }else{
      setModifico();
      setVisibleMensaje(false);
      // setBandBloqueo(false);
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
  const ManejaF7 = async() =>{
    if(!getBloqueoCabecera()){
      //  F7
      EstadoFormulario('I');
      var tipo_cambio = await getCambioDolares();
      clearForm();
      setData([{
        ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
        ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
        ['TIP_COMPROBANTE']: 'ENV',
        ['SER_COMPROBANTE']: 'A',
        ['NRO_COMPROBANTE']: '',
        ['TIP_CAMBIO_US']: tipo_cambio.data.rows[0]?.VAL_VENTA,
        ['TIP_CAMBIO_US_FORMAT']: tipo_cambio.data.rows[0]?.VAL_VENTA ? new Intl.NumberFormat("de-DE").format( tipo_cambio.data.rows[0].VAL_VENTA.toFixed(0) ) : '' ,
        ['insertedDefault']: true,
      }])
      setIndice(0);
    }else{
      setShowMessageButton(true)
      showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
    }
  }
  // CANCELAR
  const cancelar = async() => {
    LimpiarDeleteDetalle();
    setActivarSpinner(true);
    setModifico();
    setBloqueoCabecera(false);
    await ValidaInput.map( item => {
      item.valor_ant = null;
    });
    if(MODO == 'I'){
      clearForm();
      setTimeout( ()=>{
        setActivarSpinner(false);
        initialFormData();
      },150 )
    }else{
      setData( JSON.parse(DataAux) );
      loadForm( JSON.parse(DataAux) );
      setTimeout( ()=>{
        setActivarSpinner(false);
        document.getElementById('COD_SUCURSAL').focus();
      },100 )
    }
  }
  // DELETE
  const deleteRows = async() =>{
    if(Data[getIndice()].ESTADO != 'P') return;
    var idComponente = getComponenteEliminarDet()
    var fila         = getFocusGlobalEventDet().rowIndex;
    var indexRow     = getFocusGlobalEventDet().rowIndex;
    var countRow     = Grid.current.instance.getDataSource()._items.length;

    if(indexRow !== undefined){
      if(indexRow == -1) indexRow =  0; 
      if(indexRow !== 0){
          indexRow = await indexRow -1;
      }
      
      var rowsInfo  = await Grid.current.instance.getDataSource()._items[fila];
      if(_.isUndefined(rowsInfo) || (_.isUndefined(rowsInfo.inserted) && _.isUndefined(rowsInfo.InsertDefault))){

        console.log('primera condicion 1',rowsInfo)

        modifico();
        // rowsInfo.delete = true;
        // rowsInfo.COD_EMPRESA = cod_empresa;
        if( DeleteDetalle[idComponente.id] !== undefined){
          DeleteDetalle[idComponente.id] = _.union(DeleteDetalle[idComponente.id], [rowsInfo]);
        }else if(DeleteDetalle.length > 0){
          DeleteDetalle[idComponente.id] = [rowsInfo];
        }else if(DeleteDetalle.length == 0){
          DeleteDetalle[idComponente.id] = [rowsInfo];
        }
        Grid.current.instance.deleteRow(fila);
        Grid.current.instance.repaintRows([indexRow]);
        if(countRow == 1){
          setIsInputBloqued(false);
          setbandBloqueoGrid(false);
          var content = [];
          var newKey = uuidID();
          content = [{
            ID: newKey,
            TIP_COMPROBANTE: 'ENV',
            SER_COMPROBANTE: 'A',
            NRO_COMPROBANTE: form.getFieldValue('NRO_COMPROBANTE') !== undefined ? form.getFieldValue('NRO_COMPROBANTE') : newKey,
            COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
            COD_SUCURSAL: form.getFieldValue('COD_SUCURSAL'),
            idCabecera: Data[getIndice()].ID,
            InsertDefault: true,
            IDCOMPONENTE: "GRID_DETALLE",
            NRO_ORDEN: 1
          }];
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
          console.log('segunda condicion 2',rowsInfo)

          // rowdelete.component.deleteRow(fila);
          Grid.current.instance.deleteRow(fila);
          Grid.current.instance.repaintRows([indexRow]);
        }else{
          
          console.log('Tercera condicion 3',rowsInfo)

          // console.log('Entro en eliminar delete insert default')
          setIsInputBloqued(false);
          await Grid.current.instance.deleteRow(fila);
          await Grid.current.instance.repaintRows([indexRow]);
          var content = [];
          var newKey = uuidID();
          content = [{
            ID: newKey,
            TIP_COMPROBANTE: 'ENV',
            SER_COMPROBANTE: 'A',
            NRO_COMPROBANTE: form.getFieldValue('NRO_COMPROBANTE') !== undefined ? form.getFieldValue('NRO_COMPROBANTE') : newKey,
            COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
            COD_SUCURSAL: form.getFieldValue('COD_SUCURSAL'),
            idCabecera: Data[getIndice()].ID,
            InsertDefault : true,
            IDCOMPONENTE: "GRID_DETALLE",
            NRO_ORDEN: 1
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
          // Grid.current.instance.option('dataSource', dataSource);
          setTimeout(()=>{
            Grid.current.instance.option('dataSource', dataSource);
          },10);
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
  }
  // MANEJA DIRECCIONES
  const NavigateArrow = (e) => {
    if(e.target.id == 'left-arrow') leftData();
    if(e.target.id == 'right-arrow') rightData(); 
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
      setIndice(index);
      document.getElementById("indice").textContent = index + 1;
      loadForm(Data);
      EstadoFormulario('U', Data );
      QuitarClaseRequerido();
    }else{
      setShowMessageButton(true)
      showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
    }
  }
  const rightData = async() => {
    if(!getBloqueoCabecera()){
      if(Data.length == 1){
        clearForm();
        getDataCab();
      }else{
        var index = Indice + 1;
        if(index > getLongitud()-1 ){
          index = getLongitud()-1;
          document.getElementById("mensaje").textContent = "Haz llegado al ultimo registro";
          setActivarSpinner(true)
          if(bandPost_Cab_Det){
            bandPost_Cab_Det = false;
            await getRecursiveData( { cod_empresa: cod_empresa, indice: getLongitud() + 1, limite: getLongitud() + data_len  }, url_cabecera)
              .then(resp => {
                let response = resp.data.response.rows;
                setLongitud( [ ...Data, ...response ].length );
                bandPost_Cab_Det = true;
                document.getElementById("total_registro").textContent = [ ...Data, ...response ].length;
                document.getElementById("mensaje").textContent = "";
                setData([ ...Data, ...response ]);
                // --
                setIndice(index);
                document.getElementById("indice").textContent = index + 1;
                loadForm(Data);
                EstadoFormulario('U', Data );
              })
          }
        }else{
          await getDataDet(Data[index]).then( resp => {
            document.getElementById("indice").textContent = index + 1;
            form.setFieldsValue(Data[index]);
            setIndice(index);
            EstadoFormulario('U', Data );
          })
        }
      }
      QuitarClaseRequerido();
    }else{
      setShowMessageButton(true)
      showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
    }
  }
  // ESTADO DEL FORMULARIO
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
      if(line[getIndice()]?.ESTADO == 'P'){
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
  // MANEJA LINEAS
  const setRowFocusDet = (e,grid,f9)=>{
    if(e.row != undefined){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ['COSTO_ULTIMO'] : e.row.data.COSTO_ULTIMO != undefined ? new Intl.NumberFormat("de-DE").format( parseFloat(e.row.data.COSTO_ULTIMO).toFixed(2) ) : '',
        ['DESC_DEPOSITO'] : e.row.data.DESC_DEPOSITO,
        ['DESC_DEPOSITO_ENT'] : e.row.data.DESC_DEPOSITO_ENT,
        ['CANTIDAD_UB'] : e.row.data.CANTIDAD_UB
      })
    }else if(f9){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ['COSTO_ULTIMO'] : e.COSTO_ULTIMO != undefined ? new Intl.NumberFormat("de-DE").format( parseFloat(e.COSTO_ULTIMO).toFixed(2) ) : '',
        ['DESC_DEPOSITO'] : e.DESC_DEPOSITO,
        ['DESC_DEPOSITO_ENT'] : e.DESC_DEPOSITO_ENT,
        ['CANTIDAD_UB'] : e.CANTIDAD_UB
      })
    }
  };
  // MANEJA CELDAS
  const setCellChanging = async (e)=> {

    if(Data[getIndice()]){
      let rows = Data[getIndice()];
      await testValidar();
      if( _.isUndefined(rows.COD_SUCURSAL) || _.isUndefined(rows.COD_MOTIVO)){
        // BLOQUEAR
        console.log('----->if 1 BLOQUEAR');
        if(getbandBloqueoGrid())setbandBloqueoGrid(false);
        if(IsInputBloqued)setIsInputBloqued(false);
      }else if(_.isEqual(rows.COD_SUCURSAL.trim(),'') || _.isEqual(rows.COD_MOTIVO.trim(),'') ){
        console.log('----->else 2 BLOQUEAR');
        if(getbandBloqueoGrid())setbandBloqueoGrid(false);
        if(IsInputBloqued)setIsInputBloqued(false);
      }else if(Data[getIndice()].ESTADO == 'P'){
        console.log('----->Habilitar detalle');
        if(!getbandBloqueoGrid())setbandBloqueoGrid(true);
        setIsInputBloqued(true);
      }
    }
  }
  // MENSAJES
  const showModalMensaje = (titulo, imagen, mensaje) => {
    setTituloModal(titulo);
    setImagen(imagen);
    setMensaje(mensaje);
    setVisibleMensaje(true);
  };
  const handleCancel = async() => {
		setVisibleMensaje(false);
	};
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
          Data[getIndice()][item] = datos[index];
        });
        // LIMPIAR DATOS RELACIONADOS
        info.rel.map(( item ) => {
          // FORM
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [item]: '' 
          });
          // MODIFICACION DEL STATE
          Data[getIndice()][item] = datos[index];
        });
      }
      setTimeout( ()=>{ document.getElementById(info.next).focus() }, 200 )
    }
    showsModal(false)
  }
  const onInteractiveSearch = async(event) => {
    let valor = event.target.value;
    let data = {'cod_empresa':cod_empresa,'valor':valor}
    if(valor.trim().length === 0 ) valor = 'null';
    let info = ValidaInput.find( item => item.input == tipoDeBusqueda );
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

  const Reporte = async() => {
    let data = {
      p_cod_empresa: sessionStorage.getItem('cod_empresa'),
      p_sucursal: form.getFieldValue('COD_SUCURSAL'),
      p_fec_ini: form.getFieldValue('FEC_COMPROBANTE'),
      p_fec_fin: form.getFieldValue('FEC_COMPROBANTE'),
      p_nro_ini: form.getFieldValue('NRO_COMPROBANTE'),
      p_nro_fin: form.getFieldValue('NRO_COMPROBANTE'),
      p_estado: form.getFieldValue('ESTADO'),
      p_cod_articulo: null,
      p_dep_ent: null,
      p_dep_sal: null,
    }
    await Main.Request( '/st/stenvio/report', 'POST', data)
      .then( response => {
        setActivarSpinner(true);
        buildReport(response.data.rows)
      })
  }

  const buildReport = async(data) => {
    var rows = [];
    let sucursales = _.uniq( data, (item)=>{ return item.COD_SUCURSAL; });
    sucursales.sort( function(a,b){
      if ( parseInt(a.COD_SUCURSAL) > parseInt(b.COD_SUCURSAL) ) { return  1;}
      if ( parseInt(a.COD_SUCURSAL) < parseInt(b.COD_SUCURSAL) ) { return -1;}
    });
    sucursales.map( sucursal => {
      rows = [ ...rows, { COD_ARTICULO: `Sucursal: ${sucursal.COD_SUCURSAL} ${sucursal.DESC_SUCURSAL}` } ];
      let motivos = data.filter( item => item.COD_SUCURSAL = sucursal.COD_SUCURSAL );
      motivos = _.uniq( motivos, (item)=>{ return item.COD_MOTIVO; });
      motivos.sort( function(a,b){
        if ( parseInt(a.COD_MOTIVO) > parseInt(b.COD_MOTIVO) ) { return  1;}
        if ( parseInt(a.COD_MOTIVO) < parseInt(b.COD_MOTIVO) ) { return -1;}
      });
      motivos.map( motivo => {
        rows = [ ...rows, { COD_ARTICULO: `Motivo: ${motivo.DESC_MOTIVO}` }];
        let comprobantes = data.filter( item => item.COD_SUCURSAL == sucursal.COD_SUCURSAL && item.COD_MOTIVO == motivo.COD_MOTIVO);
        comprobantes = _.uniq( comprobantes, (item)=>{ return item.NRO_COMPROBANTE; });
        comprobantes.sort( function(a,b){
          if ( parseInt(a.NRO_COMPROBANTE) > parseInt(b.NRO_COMPROBANTE) ) { return  1;}
          if ( parseInt(a.NRO_COMPROBANTE) < parseInt(b.NRO_COMPROBANTE) ) { return -1;}
        });
        comprobantes.map( comprobante => {
          rows = [ ...rows, 
            { COD_ARTICULO: `Comprobante Nro: ${comprobante.NRO_COMPROBANTE}`, FEC_COMPROBANTE: `Fecha: ${Main.moment(comprobante.FEC_COMPROBANTE).format('DD/MM/YYYY')}`, ESTADO: `Estado: ${comprobante.ESTADO}` },
            { COD_ARTICULO: 'Artículo (Cód. Descripción)', DESC_UNIDAD: 'U.M', FEC_VENCIMIENTO: 'Fec. Venc.', CANTIDAD: 'Cantidad', DESCRIPCION:'Descripción', DESC_DEP_SAL: 'Salida', DESC_DEP_ENT: 'Entrada', MONTO_TOTAL: 'Total' }
          ];
          let articulos = data.filter( item => item.COD_SUCURSAL == sucursal.COD_SUCURSAL && item.COD_MOTIVO == motivo.COD_MOTIVO && item.NRO_COMPROBANTE == comprobante.NRO_COMPROBANTE );
          articulos.map( item => {
            rows = [ ...rows, {
              COD_ARTICULO: `${item.COD_ARTICULO} ${item.DESC_ARTICULO}`,
              DESC_UNIDAD: item.DESC_UNIDAD,
              FEC_VENCIMIENTO: Main.moment(item.FEC_VENCIMIENTO).format('DD/MM/YYYY'),
              CANTIDAD: item.CANTIDAD,
              DESCRIPCION: item.DESCRIPCION,
              DESC_DEP_SAL: item.DESC_DEP_SAL,
              DESC_DEP_ENT: item.DESC_DEP_ENT,
              MONTO_TOTAL: currency(item.MONTO_TOTAL, { separator:'.',decimal:',',precision:0,symbol:'' } ).format(),
              MONTO_TOTAL_no_format: item.MONTO_TOTAL
            }]
          });
          let total = _.reduce(_.map( articulos ,function(map) {
            return parseFloat(map.MONTO_TOTAL);
          }),function(memo, num) {
              return memo + num;
          },0);
          rows = [...rows, {DESC_DEP_ENT: 'TOTAL: ', MONTO_TOTAL: currency(total, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() }];
        });
      });
    });
    Report(rows);
  }

  const Report = async(content) => {
    setActivarSpinner(false);
    let info = content;

    let sucursal = `${form.getFieldValue('COD_SUCURSAL')} - ${form.getFieldValue('DESC_SUCURSAL')}`;
    let periodo = `Desde el ${form.getFieldValue('FEC_COMPROBANTE')} Hasta el ${form.getFieldValue('FEC_COMPROBANTE')}`; 
    let estado = form.getFieldValue('ESTADO') == 'P' ? 'Pendiente' : form.getFieldValue('ESTADO') == 'C' ? 'Confirmado' : 'Anulado';
    let numero = `Desde el ${form.getFieldValue('NRO_COMPROBANTE')} Hasta el ${form.getFieldValue('NRO_COMPROBANTE')}`;

    var columns    =  [
      { dataKey: 'COD_ARTICULO', header: 'Articulo (Cód. Descripción)' },
      { dataKey: 'DESC_UNIDAD', header: 'U.M' },
      { dataKey: 'FEC_VENCIMIENTO', header: 'Fec. Venc.' },
      { dataKey: 'CANTIDAD', header: 'Cantidad' },
      { dataKey: 'DESCRIPCION', header: 'Descripción' },
      { dataKey: 'DESC_DEP_SAL', header: 'Salida' },
      { dataKey: 'DESC_DEP_ENT', header: 'Entrada' },
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
        0: {halign: 'left', cellWidth:160},
        1: {halign: 'left', cellWidth:60},
        2: {halign: 'left', cellWidth:40},
        3: {halign: 'right', cellWidth:40},
        4: {halign: 'left',  cellWidth:70},
        5: {halign: 'left',  cellWidth:75},
        6: {halign: 'left',  cellWidth:75},
        7: {halign: 'right',  cellWidth:46},
      },
      margin:{top:65, left:15, right:15, bottom:25},
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
        pdfDoc.text('Listado de Notas de Envio ',(pdfDoc.internal.pageSize.getWidth() / 2),30,'center');
        pdfDoc.setLineWidth(1);
        pdfDoc.setDrawColor(30,30,30);
        pdfDoc.line(15, 32, pdfDoc.internal.pageSize.getWidth() - 15, 32, 'S');
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
        pdfDoc.text('Periodo: ', 15,51,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text(periodo, 60, 51, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Estado: ',300,42,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text(estado, 350, 42, 'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'normal');
        pdfDoc.text('Números: ',300,51,'left');

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(40);
        pdfDoc.setFont(undefined, 'bold');
        pdfDoc.text(numero, 350, 51, 'left');

        pdfDoc.line(15, 55, pdfDoc.internal.pageSize.getWidth() - 15, 55, 'S')
      },
      willDrawCell: function(data) {
        var rows = data.row.raw?.COD_ARTICULO;
        rows = rows?.trim();
        if(rows?.match(/Motivo:/) != null || rows?.match(/Comprobante Nro:/) != null || rows?.match(/Artículo/) != null){
          pdfDoc.setFont(undefined, 'bold')
          pdfDoc.setTextColor(60, 60, 60)
          pdfDoc.setFontSize(7);
          if(rows?.match(/Motivo:/) != null){
            if (data.section === 'body' && data.column.index == 5) {
              pdfDoc.setLineWidth(0.5);
              pdfDoc.setDrawColor(30,30,30);
              pdfDoc.setFillColor(210, 210, 210);
              pdfDoc.rect(15, data.cell.y, pdfDoc.internal.pageSize.getWidth() - 30,  12, 'F');
              pdfDoc.text(data.row.raw.COD_ARTICULO, 18, data.cell.y + 8);
            }
          }
          if(rows?.match(/Comprobante Nro:/) != null){
            if (data.section === 'body' && data.column.index == 5) {
              pdfDoc.text(data.row.raw.FEC_COMPROBANTE, 140, data.cell.y + 8);
              pdfDoc.text(data.row.raw.ESTADO, 220, data.cell.y + 8);
              pdfDoc.text('Depósito', 440, data.cell.y + 8);
              pdfDoc.setLineWidth(0.5);
              pdfDoc.setDrawColor(30,30,30);
              pdfDoc.line(385, data.cell.y + 10, 535, data.cell.y + 10, 'S')
            }
          }
          if(rows?.match(/Artículo/) != null){
            if (data.section === 'body' && data.column.index == 5) {
              pdfDoc.setLineWidth(1);
              pdfDoc.setDrawColor(30,30,30);
              pdfDoc.line(15, data.cell.y + 11, pdfDoc.internal.pageSize.getWidth() - 15, data.cell.y + 11, 'S')
            }
          }
        }
        var line = data.row.raw?.DESC_DEP_ENT;
        line = line?.trim();
        if(line?.match(/TOTAL:/) != null ){
          pdfDoc.setLineWidth(0.5);
          pdfDoc.setDrawColor(30,30,30);
          pdfDoc.line(pdfDoc.internal.pageSize.getWidth() - 135, data.cell.y, pdfDoc.internal.pageSize.getWidth() - 15, data.cell.y, 'S')
        }
      },
      // didParseCell: function (data) {
      //   var rows = data.row.raw?.COD_ARTICULO;
      //   if( ( rows?.match(/Sucursal:/) == null && rows?.match(/Motivo:/) == null)  && rows?.match(/Comprobante Nro:/) == null && rows?.match(/Artículo:/) == null && data.row.raw?.DESC_DEP_ENT?.match(/TOTAL/) == null ){
      //     let s = data.cell.styles;
      //     s.lineColor = [30,30,30];
      //     s.lineWidth = 0.5;
      //   }
      // }
    });

    pdfDoc.line(15, pdfDoc.previousAutoTable.finalY + 5, pdfDoc.internal.pageSize.getWidth() - 15, pdfDoc.previousAutoTable.finalY + 5, 'S')
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(40);
    // pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text('TOTAL GENERAL: ',pdfDoc.internal.pageSize.getWidth() - 150, pdfDoc.previousAutoTable.finalY + 15, 'left');
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(40);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text( currency(Total, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() , pdfDoc.internal.pageSize.getWidth() - 15, pdfDoc.previousAutoTable.finalY + 15, 'right');

    if (typeof pdfDoc.putTotalPages === 'function') {
        pdfDoc.putTotalPages(totalPagesExp);
    }
    // pdfDoc.save('rotacion_de_stock_' + Main.moment().format('DD_MM_YYYY') + '.pdf'); 
    window.open(pdfDoc.output('bloburl'));
   
  }


  return (
    <>
      {/* MENSAJES */}
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
                  onClick={ () => {
                    clearForm();
                    initialFormData();
                  }}
                />
                <Button
                  icon={<img src={guardar} width="20" style={{ marginBottom: '3px', }} />}
                  className="paper-header-menu-button"
                  onClick={SaveForm}
                  />
                <Button 
                  style={{marginRight:'5px', marginRight:'1px'}}
                  icon={<img src={deleteIcon} width="25"/>}
                  className="paper-header-menu-button" 
                  onClick={deleteRows}
                />
                <Button
                  id="left-arrow"
                  icon={<img src={left} width="25"  id="left-arrow"/>}
                  className="paper-header-menu-button"
                  onClick={NavigateArrow}
                />
                <Button 
                  id="right-arrow"
                  icon={<img src={right} width="25" id="right-arrow"/>}
                  className="paper-header-menu-button"
                  onClick={NavigateArrow}
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
                <Row>
                  <Col span={8}>
                    <Form.Item label={<label style={{width:'65px'}}>Numero</label>} name="NRO_COMPROBANTE">
                      <Input style={{textAlign:'right'}} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsInputBloqued} ref={nroComprobante}/>
                    </Form.Item>
                    <Form.Item label={<label style={{width:'65px'}}>Fecha</label>} name="FEC_COMPROBANTE">
                      <Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsInputBloqued} ref={fecComprobante}/>
                    </Form.Item>
                    <Form.Item label={<label style={{width:'65px'}}>Cambio U$</label>} name="TIP_CAMBIO_US_FORMAT">
                      <Input disabled={true} className="requerido" style={{textAlign:'right'}}/>
                    </Form.Item>
                    <Form.Item label={<label style={{width:'65px'}}>Estado</label>} name="ESTADO" onChange={handleEstado}>
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
                          disabled={ IsCondfirmadoBloqued }
                          >
                          Confirmado
                        </Radio>
                        <Radio 
                          value="A" 
                          onKeyDown={ handleKeyDown }
                          disabled={ IsAnularBloqued }
                          >
                          Anulado
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item label={<label style={{width:'100px'}}>Sucursal</label>}>
                      <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                        <Input type="number" className="search_input requerido" onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsInputBloqued} ref={codSucursal}/>
                      </Form.Item>
                      <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                        <Input disabled/>
                      </Form.Item>
                    </Form.Item>
                    <Form.Item label={<label style={{width:'100px'}}>Motivo</label>}>
                      <Form.Item name="COD_MOTIVO" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                        <Input type="number" className="search_input requerido" onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsInputBloqued} ref={codMotivo}/>
                      </Form.Item>
                      <Form.Item name="DESC_MOTIVO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                        <Input disabled/>
                      </Form.Item>
                    </Form.Item>
                    <Form.Item label={<label style={{width:'100px'}}>Comentario</label>} name="COMENTARIO">
                      <TextArea type="number" className="search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsCommentBloqued} ref={comentario}/>
                    </Form.Item>
                    <Row>
                      <Col span={8}>
                        <Form.Item label={<label style={{width:'100px'}}>Nro. Planilla</label>} name="NRO_PLANILLA">
                          <Input disabled/>
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item label={<label style={{width:'100px'}}>Comp. Ref</label>}>
                          <Form.Item name="TIP_COMPROBANTE_REF" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                            <Input disabled/>
                          </Form.Item>
                          <Form.Item name="SER_COMPROBANTE_REF" style={{width:'100px',  display:'inline-block', marginRight:'4px'}}>
                            <Input disabled/>
                          </Form.Item>
                          <Form.Item name="NRO_COMPROBANTE_REF" style={{width:'calc(100% - 160px)', display:'inline-block'}}>
                            <Input disabled/>
                          </Form.Item>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={{marginBottom:'10px'}}>
                  <Col span={24}>
                    <Divider orientation="left">Detalle</Divider>
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
                        altura={200}
                        newAddRow={true}
                        canDelete={true}
                        setRowFocusDet={setRowFocusDet}
                        // operacion={operacion}
                        setCellChanging={setCellChanging}
                        // setFocusedCellChanged={setFocusedCellChanged}
                        // setUpdateValue={setUpdateValue}
                        setActivarSpinner={setActivarSpinner}
                        maxFocus={maxFocus}
                        // onFocusChangedF9={onFocusChangedF9}
                        dataCabecera={Data[getIndice()]}
                      />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item label={<label style={{width:'100px'}}>Dep. Salida</label>} name="DESC_DEPOSITO">
                      <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item label={<label style={{width:'100px'}}>Dep. Entrada</label>} name="DESC_DEPOSITO_ENT">
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label={<label style={{width:'100px'}}>Ultimo</label>} name="COSTO_ULTIMO">
                      <Input disabled={true} style={{textAlign:'right'}}/>
                    </Form.Item>
                    <Form.Item label={<label style={{width:'100px'}}>Unid. Básicas</label>} name="CANTIDAD_UB">
                      <Input disabled={true} style={{textAlign:'right'}}/>
                    </Form.Item>
                  </Col>
                  <Col span={8}> 
                    <Form.Item label={<label style={{width:'100px'}}>Creado por</label>} name="COD_USUARIO">
                      <Input disabled={true}/>
                    </Form.Item> 
                    <Form.Item label={<label style={{width:'100px'}}>Fec. Alta</label>} name="FEC_ALTA">
                      <Input disabled={true}/>
                    </Form.Item> 
                  </Col>
                </Row>
              </Form>
              <Row style={{padding:'10px'}}>
                <Col span={24}>
                  <div className='total_registro_pg'>
                    Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
                  </div>
                </Col>
              </Row>
            </Main.Paper>
          </div>
        </Main.Spin>
      </Main.Layout>
    </>
  );
});
export default STENVIO;