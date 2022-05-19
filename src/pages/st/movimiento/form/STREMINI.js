import React, { memo, useState, useRef, useEffect } from 'react';
import { v4 as uuidID } from "uuid";
import { Typography, Form, Input, Row, Col, Radio, Divider, Button } from 'antd';
import _ from 'underscore';
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import Main from "../../../../components/utils/Main";
import { Menu, DireccionMenu } from '../../../../components/utils/FocusDelMenu';
import ValidarCamposRequeridos, { QuitarClaseRequerido } from "../../../../components/utils/ValidarCamposRequeridos";
import nuevo        from '../../../../assets/icons/add.svg';
import iconBuscador from '../../../../assets/icons/search-f7.svg'
import deleteIcon   from '../../../../assets/icons/delete.svg';
import guardar      from '../../../../assets/icons/diskette.svg';
import cancelarEdit from '../../../../assets/icons/iconsCancelar.svg';
import left         from '../../../../assets/icons/prev.svg';
import right        from '../../../../assets/icons/next.svg';
import DevExtremeDet,{
  getBloqueoCabecera, 
  setBloqueoCabecera,
  getFocusGlobalEventDet, 
  getComponenteEliminarDet,
  setbandBloqueoGrid, 
  getbandBloqueoGrid
} from '../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import { modifico, setModifico } from "../../../../components/utils/DevExtremeGrid/ButtonCancelar";
import currency from 'currency.js';
const columns = [
  { ID: 'COD_ARTICULO', label: 'Articulo', width: 80, editModal:true, requerido:true },
  { ID: 'DESC_ARTICULO', label: 'Descripción', minWidth: 90, disable :true},
  { ID: 'COD_DEPOSITO', label: 'Salida', width: 80, editModal:true, requerido:true },
  { ID: 'COD_UNIDAD_MEDIDA', label: 'UM', width: 80, editModal:true, requerido:true },
  { ID: 'DESC_UM', label: 'Descripción', width: 120, disable :true},
  { ID: 'NORMA', label: 'Norma', width: 130, disable:true},
  { ID: 'COD_CATEGORIA', label: 'Categoria', width: 80, disable :true},
  { ID: 'CANTIDAD', label: 'Cantidad', width: 80,isnumber:true, requerido:true },
  { ID: 'GRUPO_NRO', label: 'Grupo', width: 80 },
  { ID: 'CANT_PESO', label: 'Peso', width: 80, isnumber:true, disable :true},
  { ID: 'CANT_SUC_ORIG', label: 'Stock Oriden', width: 100, isnumber:true, disable :true },
  { ID: 'CANT_SUC_DES', label: 'Stock Destino', width: 100, isnumber:true, disable :true }
];
const notOrderByAccionDet = [
  "NRO_COMPROBANTE" , "COD_ARTICULO"      , "DESC_ARTICULO",
  "COD_DEPOSITO"    , "COD_UNIDAD_MEDIDA" , "DESC_UM",
  "NORMA"           , "COD_CATEGORIA"     , "CANTIDAD",
  "GRUPO_NRO"       , "CANT_PESO"         , "CANT_SUC_ORIG",
  "CANT_SUC_DES"
];
const { Title } = Typography;
const TituloList = "Remisión de Sucursal Proveedora";
const FormName = "STREMINI";
// URLS
const url_cabecera = '/st/stremini/cabecera';
const url_detalle  = '/st/stremini/detalle';
const url_tipo_cambio = '/st/stremini/tipo_cambio';
const url_nro_comprobante = '/st/stremini/nro_comprobante';
const url_base = '/st/stremini';
// VALIDA
const url_validar_sucursal_salida = '/st/stremini/valida/sucursal_salida';
const url_validar_motivo = '/st/stremini/valida/motivo';
const url_validar_sucursal_entrada = '/st/stremini/valida/sucursal_entrada';
const url_validar_deposito_entrada = '/st/stremini/valida/deposito_entrada';
const url_validar_articulo = '/st/stremini/valida/articulo';
const url_validar_deposito_salida = '/st/stremini/valida/deposito_salida';
const url_validar_unidad_medida = '/st/stremini/valida/unidad_medida';
const url_validar_cantidad = '/st/stremini/valida/cantidad';
// BUSCAR
const url_buscar_sucursal_salida = '/st/stremini/buscar/sucursal_salida';
const url_buscar_motivo = '/st/stremini/buscar/motivo';
const url_buscar_sucursal_entrada = '/st/stremini/buscar/sucursal_entrada';
const url_buscar_deposito_entrada = '/st/stremini/buscar/deposito_entrada';
const url_buscar_articulo = '/st/stremini/buscar/articulo';
const url_buscar_deposito_salida = '/st/stremini/buscar/deposito_salida';
const url_buscar_unidad_medida = '/st/stremini/buscar/unidad_medida';
// CARGA
const url_carga_transferencia = '/st/stremini/carga_transferencia';
// BUSCADORES Y VALIDADRES EN EL GRID
const columnModal = {
  urlValidar: [
    {
      COD_ARTICULO: url_validar_articulo,
      COD_DEPOSITO: url_validar_deposito_salida,
      COD_UNIDAD_MEDIDA: url_validar_unidad_medida,
      CANTIDAD: url_validar_cantidad,
    },
  ],
  urlBuscador: [
    {
      COD_ARTICULO: url_buscar_articulo,
      COD_DEPOSITO: url_buscar_deposito_salida,
      COD_UNIDAD_MEDIDA: url_buscar_unidad_medida,
    },
  ],
  title: [
    {
      COD_ARTICULO: "Articulo",
      COD_DEPOSITO: "Deposito",
      COD_UNIDAD_MEDIDA: "U.M"
    },
  ],
  COD_ARTICULO:[
    { ID:'COD_ARTICULO', label: 'Codigo', width: 80, align:'left'},
    { ID:'DESC_ARTICULO', label:'Descripción', minWidth: 120, align:'left'}
  ],
  COD_DEPOSITO:[
    { ID:'COD_DEPOSITO', label: 'Codigo', width: 110, align:'left'},
    { ID:'DESC_DEPOSITO', label:'Descripción', minWidth: 70, align:'left'},
  ],
  COD_UNIDAD_MEDIDA:[
    { ID:'COD_UNIDAD_MEDIDA', label: 'Codigo', width: 110, align:'left'},
    { ID:'DESC_UM', label:'Descripción', minWidth: 70, align:'left'},
  ],
  config:{
    COD_ARTICULO:{
      depende_de:[],
      depende_ex_cab:[
        {id: 'COD_SUCURSAL',label: 'Sucursal '},
      ],
      dependencia_de:[
        {id: 'COD_DEPOSITO',label: 'Deposito'},
        {id: 'COD_UNIDAD_MEDIDA',label: 'Unidad Medida'},
        {id: 'CANTIDAD',label: 'Cantidad'}
      ]   
    },
    COD_DEPOSITO:{
      depende_de:[
        {id: 'COD_ARTICULO',label: 'Articulo '},
      ],
      depende_ex_cab:[
        {id: 'COD_SUCURSAL',label: 'Sucursal '},
        {id: 'COD_SUCURSAL_ENT',label: 'Sucursal '},
      ],
      dependencia_de:[
        {id: 'COD_UNIDAD_MEDIDA',label: 'Unidad Medida'},
        {id: 'CANTIDAD',label: 'Cantidad'}
      ]   
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[
        {id: 'COD_ARTICULO',label: 'Articulo '},
      ],
      depende_ex_cab:[],
      dependencia_de:[
        {id: 'CANTIDAD',label: 'Cantidad'}
      ]   
    },
    CANTIDAD:{
      depende_de: [
        {id: 'COD_ARTICULO', label: 'Articulo '},
        {id: 'COD_DEPOSITO', label: 'Deposito '},
        {id: 'NRO_LOTE', label: 'Lote '},
        {id: 'DESC_ARTICULO', label: 'Articulo '},
        {id: 'DESC_UM', label: 'Unidad de Medida '},
        {id: 'MULT', label: 'Multiplo '},
        {id: 'DIV', label: 'Div '},
        {id: 'PESO', label: 'Peso '},
      ],
      depende_ex_cab: [
        {id: 'COD_SUCURSAL', label: 'Sucursal '},
      ],
      dependencia_de: [
        {id: 'PESO', label: 'Peso '},
      ]
    },
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
  { ID: 'DESC_SUCURSAL', label: 'Descrición', width:120 },
  { ID: 'DIR_SALIDA', label: 'Dirección', minWidth:150 },
];
const columnMotivo = [
  { ID: 'COD_MOTIVO', label: 'Código', width:50 },
  { ID: 'DESC_MOTIVO', label: 'Descrición', minWidth:150 },
  { ID: 'GENERA_DEUDA', label: 'Genera Deuda', width:80 },
  { ID: 'ACTIVO', label: 'Activo', width:80 },
];
const columnDeposito = [
  { ID: 'COD_DEPOSITO', label: 'Código', width:50 },
  { ID: 'DESC_DEPOSITO', label: 'Descrición', minWidth:150 }
];

// BORRADO DE LINEA
var DeleteDetalle = {}
const LimpiarDeleteDetalle = () =>{
  DeleteDetalle = [];
}
// LIMITAR EL ULTIMO FOCUS
const maxFocus = [{
	id:"GRID_DETALLE",
	hasta:"GRUPO_NRO",
	newAddRow:true,
  nextId:'CANT_PESO'
}];
var ValidaInput = [
  {
    input: 'COD_SUCURSAL',
    url: url_validar_sucursal_salida,
    url_buscar: url_buscar_sucursal_salida,
    valor_ant: null,
    out:[ // RETORNO DE LA FUNCION
      'DESC_SUCURSAL', 'DIR_SALIDA','USA_WMS','COD_DEPOSITO'
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
      'DESC_MOTIVO','TIPO_REMI','GENERA_DEUDA'
    ],
    data:[
      'COD_EMPRESA'
    ],
    rel:[],
    next:'COD_SUCURSAL_ENT',
    band:true,
    requerido: true,
  },
  {
    input: 'COD_SUCURSAL_ENT',
    url: url_validar_sucursal_entrada,
    url_buscar: url_buscar_sucursal_entrada,
    valor_ant: null,
    out:[ // RETORNO DE LA FUNCION
      'DESC_SUCURSAL_ENT', 'DIR_LLEGADA'
    ],
    data:[ // DATOS DE DEPENDENCIA
      'COD_EMPRESA'
    ],
    rel:[ // DATOS RELACIONADOS

    ],
    next: 'COD_DEPOSITO_ENT', // SIGUIENTE FOCUS
    band:true,
    requerido: true,
  },
  {
    input: 'COD_DEPOSITO_ENT',
    url: url_validar_deposito_entrada,
    url_buscar: url_buscar_deposito_entrada,
    valor_ant: null,
    out:[ // RETORNO DE LA FUNCION
      'DESC_DEPOSITO_ENT'
    ],
    data:[ // DATOS DE DEPENDENCIA
      'COD_EMPRESA','COD_SUCURSAL_ENT'
    ],
    rel:[ // DATOS RELACIONADOS

    ],
    next: 'carga_remision', // SIGUIENTE FOCUS
    band:true,
    requerido:true,
    grid_next:false,
  },
]
var DataAux = "";
var DataDetalleAux = "";
var bandNew = false;
const STREMINI = memo(() => {
  const defaultOpenKeys = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
	const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
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
  // ESTADO FORMULARIO
  const [ IsInputBloqued, setIsInputBloqued ] = useState(false);
  const [ IsCommentBloqued, setIsCommentBloqued ] = useState(false);
  const [ IsPendienteBloqued, setIsPendienteBloqued ] = useState(false);
  const [ IsCondfirmadoBloqued, setIsConfirmadoBloqued ] = useState(false);
  const [ IsAnularBloqued, setIsAnularBloqued ] = useState(false);
  const [ isButtonBloqued, setIsButtonBloqued ] = useState(false);
  // LINEA POR DEFECTO DEL GRID
  const initialRow = [
    { NRO_COMPROBANTE: "NRO_COMPROBANTE" },
    { COD_SUCURSAL: form.getFieldValue('COD_SUCURSAL') },
    { TIP_COMPROBANTE: 'PRT' },
    { SER_COMPROBANTE: 'A' },
  ];
  Main.useHotkeys(Main.Guardar, (e) =>{
    e.preventDefault();
    SaveForm();
  },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
  Main.useHotkeys(Main.Nuevo, (e) => {
    e.preventDefault();
    ManageNewButton()
  },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
  Main.useHotkeys('F7', (e) => {
    e.preventDefault();
  });
  Main.useHotkeys('F8', (e) => {
    e.preventDefault();
  });
  useEffect( ()=> {

    document.getElementById("form-div-1").addEventListener('click', function (e){
      bandNew = false
    });
    document.getElementById("form-div-2").addEventListener('click', function (e){
      bandNew = false
    });
    document.getElementById("GRID_DETALLE").addEventListener('click', function (){
      bandNew = true
    });


    // setActivarSpinner(true);    
    // setTimeout( ()=>{
    //   document.getElementsByClassName('ant-spin-blur')[0].style.cursor = 'wait';
    // },100 )
        
    // setTimeout( ()=>{
    //   // document.getElementByID('thingtoclick').click();
    //   // document.getElementsByClassName('ant-spin-blur')[0].style.cursor = 'default';
    //   setActivarSpinner(false); 
    //     console.log('entro aqui ');
    // },5000 )
    
    clearForm();
    setTimeout( () => initialFormData(), 100 );
  },[])
  const initialFormData = async()=>{
    setBloqueoCabecera(false);
    var tipo_cambio = await getCambioDolares();

    console.log(tipo_cambio);

    var newKey = uuidID();
    var valor = {
      ['ID']: newKey,
      ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
      ['COD_SUCURSAL']: sessionStorage.getItem('cod_sucursal'),
      ['DESC_SUCURSAL']: sessionStorage.getItem('desc_sucursal'),
      ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
      ['FEC_COMPROBANTE']: Main.moment().format('DD/MM/YYYY'),
      ['FEC_INICIO']:  Main.moment().format('DD/MM/YYYY'),
      ['FEC_FIN']:  Main.moment().add(7,'day').format('DD/MM/YYYY'),
      ['TIP_CAMBIO_US']: tipo_cambio ,
      ['TIP_CAMBIO_US_FORMAT']: tipo_cambio ? currency(tipo_cambio, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() : '' ,
      ['TIP_COMPROBANTE']: 'PRT',
      ['SER_COMPROBANTE']: 'A',
      ['NRO_COMPROBANTE']: '',
      ['IND_TRANSLADO']: 'N',
      ['IND_RESERVA']:'S',
      ['IND_COSTO']:'P',
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
        TIP_COMPROBANTE : 'PRT',
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
      document.getElementById('COD_SUCURSAL').focus();
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
        cod_sucursal_ent: form.getFieldValue('COD_SUCURSAL_ENT') != undefined ? form.getFieldValue('COD_SUCURSAL_ENT') : '',
        cod_deposito_ent: form.getFieldValue('COD_DEPOSITO_ENT') != undefined ? form.getFieldValue('COD_DEPOSITO_ENT') : '',
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
    setActivarSpinner(false);
    setTimeout(async()=>{
      Grid.current.instance.option("focusedRowIndex",0);
      var gridDetalle = [];
      if(Grid.current != undefined){
        let filterExpr      = Grid.current.instance.getCombinedFilter();
        let gridDataSource  = Grid.current.instance.getDataSource();
        let gridLoadOptions = gridDataSource.loadOptions();
        gridDataSource.store().load({filter: filterExpr, sort:gridLoadOptions.sort}).then((res)=>{
          gridDetalle = res
        });
      }
      let SUM_PESO = await _.reduce(_.map(gridDetalle,function(map) {
        if(map.CANT_PESO != undefined){
          return parseFloat(map.CANT_PESO);
        }else{
          return 0;
        }
      }),function(memo, num) {
          return memo + num;
      },0);
      form.setFieldsValue({...form.getFieldsValue(),['SUM_PESO']: currency(SUM_PESO, {separator: '.', decimal: ',', precision: 0, symbol: ''} ).format() });
    },100);
    return rows;
  }
  const getCambioDolares = async() => {
    try {
			const info = await Main.Request(url_tipo_cambio, "POST", {p_cod_moneda:2, p_fecha:Main.moment().format('DD/MM/YYYY'), p_tipo:'D',p_opcion:'V' } );
      return info.data;
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
      ['TIP_COMPROBANTE']: 'PRT',
      ['SER_COMPROBANTE']: 'A',
      ['NRO_COMPROBANTE']: '',
      ['TIP_CAMBIO_US']: tipo_cambio,
      ['TIP_CAMBIO_US_FORMAT']: tipo_cambio ? currency(tipo_cambio, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() : '' ,
      ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
      ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
      ['COD_SUCURSAL']:'',
      ['COD_MOTIVO']:'',
      ['IND_TRANSLADO']: 'N',
      ['IND_RESERVA']:'S',
      ['IND_COSTO']:'P',
      ['insertedDefault']: true,
    });
    ValidaInput.map( item => {
      item.valor_ant = null; 
    });
    const content = [{
      ID: newKey,      
      COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
      TIP_COMPROBANTE: 'PRT',
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
  const handleKeyDown = async(e) => {
    if(e.keyCode == 118){
      e.preventDefault();
      ManejaF7();
      setTimeout( ()=> { document.getElementById(e.target.id).focus() }, 800 );
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
    if(e.keyCode == 40) e.preventDefault();
    if(e.keyCode == 38) e.preventDefault();
    if(e.keyCode == 13 || e.keyCode == 9){
      e.preventDefault();
      if(e.target.id == 'SER_COMPROBANTE') document.getElementById('NRO_COMPROBANTE').focus();
      if(e.target.id == 'NRO_COMPROBANTE') document.getElementById('FEC_COMPROBANTE').focus();
      if(e.target.id == 'FEC_COMPROBANTE') document.getElementById('FEC_INICIO').focus();
      if(e.target.id == 'FEC_INICIO') document.getElementById('FEC_FIN').focus();
      if(e.target.id == 'FEC_FIN') document.getElementById('COD_SUCURSAL').focus();
      if(e.target.id == 'COD_SUCURSAL' || e.target.id == 'COD_MOTIVO' || e.target.id == 'COD_SUCURSAL_ENT' || e.target.id == 'COD_DEPOSITO_ENT' ) ValidarUnico(e.target.id);
    }
    if(e.keyCode == '120'){
      e.preventDefault();
      setTipoDeBusqueda(e.target.id);
      if(IsInputBloqued){
        return;
      }
      switch(e.target.id){
        case "COD_SUCURSAL":
          var auxSucursal = await getData( {cod_empresa: cod_empresa}, url_buscar_sucursal_salida );
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
        case "COD_SUCURSAL_ENT":
          var auxSucursal = await getData( {cod_empresa: cod_empresa }, url_buscar_sucursal_entrada );
          setModalTitle("Sucursal");
          setSearchColumns(columnSucursal);
          setSearchData(auxSucursal);
          setShows(true);
          break;
        case "COD_DEPOSITO_ENT":
          var auxSucursal = await getData( {cod_empresa: cod_empresa, cod_sucursal: form.getFieldValue('COD_SUCURSAL_ENT') }, url_buscar_deposito_entrada );
          setModalTitle("Sucursal");
          setSearchColumns(columnDeposito);
          setSearchData(auxSucursal);
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
  const ManejaF7 = async(focus) =>{
    if(!getBloqueoCabecera()){
      clearForm();
      let tipo_cambio = await getCambioDolares();
      //  F7
      setTimeout( ()=> {
        EstadoFormulario('I');
        setData([{
          ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
          ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
          ['TIP_COMPROBANTE']: 'PRT',
          ['SER_COMPROBANTE']: 'A',
          ['NRO_COMPROBANTE']: '',
          ['TIP_CAMBIO_US']: tipo_cambio,
          ['TIP_CAMBIO_US_FORMAT']: tipo_cambio ? currency(tipo_cambio, { separator:'.',decimal:',',precision:0,symbol:'' } ).format() : '' ,
          ['IND_TRANSLADO']: 'N',
          ['IND_RESERVA']:'S',
          ['IND_COSTO']:'P',
          ['insertedDefault']: true,
        }]);
        document.getElementById("indice").textContent = 1;
        document.getElementById("total_registro").textContent = 1;
        setLongitud(1);
        setIndice(0);
        if(focus)document.getElementById('COD_SUCURSAL').focus();
      },500 )
    }else{
      setShowMessageButton(true)
      showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
    }
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
      }
    }
    e.target.select();
  };
  // CARGA TRANSFERENCIA
  const CargaTransferencia = async() => {
    setIsButtonBloqued(true);
    setActivarSpinner(true);
    await testValidar();
    if(Data[getIndice()].COD_SUCURSAL?.trim().length == 0 ||  Data[getIndice()].COD_SUCURSAL == undefined){
      showModalMensaje('Atencion!','atencion',`Favor completar la sucursal de salida`);
      setIsButtonBloqued(false);
      return;
    }
    if(Data[getIndice()].COD_SUCURSAL_ENT?.trim().length == 0 || Data[getIndice()].COD_SUCURSAL_ENT == undefined ){
      showModalMensaje('Atencion!','atencion',`Favor completar la sucursal de entrada`);
      setIsButtonBloqued(false);
      return;
    }
    let params = { cod_empresa: cod_empresa, cod_sucursal: form.getFieldValue('COD_SUCURSAL'), cod_sucursal_ent: form.getFieldValue('COD_SUCURSAL_ENT') };
    let rows = await Main.Request(url_carga_transferencia, "POST",params).then( resp => { return resp.data.rows });
    await rows.map( item => {
      item.TIP_COMPROBANTE = form.getFieldValue('TIP_COMPROBANTE');
      item.SER_COMPROBANTE = form.getFieldValue('SER_COMPROBANTE');
      item.NRO_COMPROBANTE = '';
      item.inserted = true;
    })
    DataDetalleAux = JSON.stringify(rows);
    const dataSource = new DataSource({
      store: new ArrayStore({
        data: rows,
      }),
      key: 'ID'
    })
    await Grid.current.instance.option('dataSource', dataSource);
    setActivarSpinner(false);
    setTimeout( () => Grid.current.instance.option("focusedRowIndex",0), 150);
  }
  // VALIDADORES
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
        if(!item.grid_next) document.getElementById(item.next).focus(); else Grid.current.instance.focus(Grid.current.instance.getCellElement(0,0)); 
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
              if(!item.grid_next){
                document.getElementById(item.next).focus();
                document.getElementById(item.next).select();
              }else{
                Grid.current.instance.focus(Grid.current.instance.getCellElement(0,0));
              }
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
        if( form.getFieldValue(item.input)?.trim().length == 0 ){
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
  // GUARDAR
  const SaveForm = async() => { 
    let button_cancelar  = document.getElementsByClassName('button-cancelar-ocultar-visible');
    if(button_cancelar.length > 0) return
    else console.log('Esta activo');
    setActivarSpinner(true);
    await testValidar();
    let verificar_input_requerido = ValidarCamposRequeridos();
    if(!verificar_input_requerido){
      setActivarSpinner(false);
      return;
    }
    if( Data[getIndice()].inserted){
      if(Data[getIndice()].ESTADO == 'C' || Data[getIndice()].ESTADO == 'A'){
        showModalMensaje('Atencion!','atencion',`No se puede guardar un ajuste en estado Confirmado o Anulado.`);
        setActivarSpinner(false);
        return;
      }
      if(Data[getIndice()].SER_COMPROBANTE == undefined){
        Data[getIndice()].SER_COMPROBANTE = 'A';
      }
      if(Data[getIndice()].ESTADO == undefined){
        Data[getIndice()].ESTADO = 'P';
      }
      if(Data[getIndice()].FEC_COMPROBANTE == undefined){
        Data[getIndice()].FEC_COMPROBANTE = Main.moment().format('DD/MM/YYYY');
      }
      if(Data[getIndice()].FEC_INICIO == undefined){
        Data[getIndice()].FEC_INICIO = Main.moment().format('DD/MM/YYYY');
        Data[getIndice()].FEC_INICIO = Main.moment().add(7,'days').format('DD/MM/YYYY');
      }
    }
    if(Data[getIndice()].ESTADO_ANT == 'P' && Data[getIndice()].ESTADO == 'C'){
      Data[getIndice()].FEC_ESTADO = Main.moment().format('DD/MM/YYYY H:mm:ss');
    }
    if(Data[getIndice()].ESTADO_ANT == 'P' && Data[getIndice()].ESTADO == 'A'){
      Data[getIndice()].FEC_ESTADO = Main.moment().format('DD/MM/YYYY H:mm:ss');
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
    if(Grid.current != undefined){
      let filterExpr      = Grid.current.instance.getCombinedFilter();
      let gridDataSource  = Grid.current.instance.getDataSource();
      let gridLoadOptions = gridDataSource.loadOptions();
      gridDataSource.store().load({filter: filterExpr, sort:gridLoadOptions.sort}).then((res)=>{ 
        gridDetalle = res
      });
    }
    gridDetalle.map( (item,i) => {
      item.COD_SUCURSAL = form.getFieldValue('COD_SUCURSAL');
      item.COD_SUCURSAL_ENT = form.getFieldValue('COD_SUCURSAL_ENT');
      item.COD_DEPOSITO_ENT = form.getFieldValue('COD_DEPOSITO_ENT');
      item.IND_RESERVA = Data[getIndice()]['IND_RESERVA'];
      item.IND_TRANSLADO = Data[getIndice()]['IND_TRANSLADO'];
      item.idCabecera = Data[getIndice()]['ID'];
    });
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
            setBloqueoCabecera(false);
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
  const deleteRows = async() =>{
    if(Data[getIndice()].ESTADO != 'P') return;
    var idComponente = getComponenteEliminarDet();
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
        modifico();
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
            TIP_COMPROBANTE: 'PRT',
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
          Grid.current.instance.deleteRow(fila);
          Grid.current.instance.repaintRows([indexRow]);
        }else{
          setIsInputBloqued(false);
          await Grid.current.instance.deleteRow(fila);
          await Grid.current.instance.repaintRows([indexRow]);
          var content = [];
          var newKey = uuidID();
          content = [{
            ID: newKey,
            TIP_COMPROBANTE: 'PRT',
            SER_COMPROBANTE: 'A',
            NRO_COMPROBANTE: form.getFieldValue('NRO_COMPROBANTE') !== undefined ? form.getFieldValue('NRO_COMPROBANTE') : newKey,
            COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
            COD_SUCURSAL: form.getFieldValue('COD_SUCURSAL'),
            idCabecera: Data[getIndice()].ID,
            InsertDefault : true,
            IDCOMPONENTE: "GRID_DETALLE",
            NRO_ORDEN: 1,
            TIP_COMPROBANTE: 'PRT',
            SER_COMPROBANTE: 'A',
          }]
          const dataSource = new DataSource({
            store: new ArrayStore({
              data: content,
            }),
            key: 'ID'
          })
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
  // MANEJA LINEAS
  const setRowFocusDet = async(e,grid,f9)=>{
    var gridDetalle = [];
    if(Grid.current != undefined){
      let filterExpr      = Grid.current.instance.getCombinedFilter();
      let gridDataSource  = Grid.current.instance.getDataSource();
      let gridLoadOptions = gridDataSource.loadOptions();
      gridDataSource.store().load({filter: filterExpr, sort:gridLoadOptions.sort}).then((res)=>{
        gridDetalle = res
      });
    }
    let SUM_PESO = await _.reduce(_.map(gridDetalle,function(map) {
      if(map.CANT_PESO != undefined){
        return parseFloat(map.CANT_PESO);
      }else{
        return 0;
      }
    }),function(memo, num) {
      return memo + num;
    },0);
    if(e.row != undefined){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ['DESC_DEPOSITO'] : e.row.data.DESC_DEPOSITO,
        ['DESC_CATEGORIA'] : e.row.data.DESC_CATEGORIA,
        ['COSTO_PROMEDIO'] : currency(e.row.data.COSTO_PROMEDIO, {separator: '.', decimal: ',', precision: 2, symbol: ''} ).format(),
        ['COSTO_ULTIMO'] : currency(e.row.data.COSTO_ULTIMO, {separator: '.', decimal: ',', precision: 2, symbol: ''} ).format(),
        ['CANTIDAD_UB'] : currency(e.row.data.CANTIDAD_UB, {separator: '.', decimal: ',', precision: 0, symbol: ''} ).format(),
        ['SUM_PESO'] : currency(SUM_PESO, {separator: '.', decimal: ',', precision: 0, symbol: ''} ).format()
      })
    }else if(f9){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ['DESC_DEPOSITO'] : e.DESC_DEPOSITO,
        ['DESC_CATEGORIA'] : e.DESC_CATEGORIA,
        ['COSTO_PROMEDIO'] : currency(e.COSTO_PROMEDIO, {separator: '.', decimal: ',', precision: 2, symbol: ''} ).format(),
        ['COSTO_ULTIMO'] : currency(e.COSTO_ULTIMO, {separator: '.', decimal: ',', precision: 2, symbol: ''} ).format(),
        ['CANTIDAD_UB'] : currency(e.CANTIDAD_UB, {separator: '.', decimal: ',', precision: 0, symbol: ''} ).format(),
        ['SUM_PESO'] : currency(SUM_PESO, {separator: '.', decimal: ',', precision: 0, symbol: ''} ).format()
      })
    }
  };
  // MANEJA CELDAS
  const setCellChanging = async (e)=> {
    bandNew = true
    if(Data[getIndice()]){
      let rows = Data[getIndice()];
      await testValidar();
      if( _.isUndefined(rows.COD_SUCURSAL) || _.isUndefined(rows.COD_MOTIVO)){
        // BLOQUEAR
        if(getbandBloqueoGrid())setbandBloqueoGrid(false);
        if(IsInputBloqued)setIsInputBloqued(false);
      }else if(_.isEqual(rows.COD_SUCURSAL.trim(),'') || _.isEqual(rows.COD_MOTIVO.trim(),'') ){
        if(getbandBloqueoGrid())setbandBloqueoGrid(false);
        if(IsInputBloqued)setIsInputBloqued(false);
      }else if(Data[getIndice()].ESTADO == 'P'){
        if(!getbandBloqueoGrid())setbandBloqueoGrid(true);
        setIsInputBloqued(true);
      }
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ['DESC_DEPOSITO'] : e.data.DESC_DEPOSITO,
        ['DESC_CATEGORIA'] : e.data.DESC_CATEGORIA,
        ['COSTO_PROMEDIO'] : currency(e.data.COSTO_PROMEDIO, {separator: '.', decimal: ',', precision: 2, symbol: ''} ).format(),
        ['COSTO_ULTIMO'] : currency(e.data.COSTO_ULTIMO, {separator: '.', decimal: ',', precision: 2, symbol: ''} ).format(),
        ['CANTIDAD_UB'] : currency(e.data.CANTIDAD_UB, {separator: '.', decimal: ',', precision: 0, symbol: ''} ).format()
      });
    }
  }
  // MANEJA DIRECCIONES
  const NavigateArrow = (e) => {
    if(e.target.id == 'left-arrow') leftData();
    if(e.target.id == 'right-arrow') rightData(); 
  }
  const leftData = async() => {
    if(!getBloqueoCabecera()){
      setActivarSpinner(true);
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
      setActivarSpinner(true);
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
      setIsButtonBloqued(false);
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
      setIsButtonBloqued(true);
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
    setActivarSpinner(false);
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
  // MANEJA EL BOTON NUEVO
  const ManageNewButton = async() => { 
    if(bandNew){
      // AGREGA LINEA
      if(getbandBloqueoGrid()){
        var indexRow         = await getFocusGlobalEventDet().rowIndex;
        var info             = await getFocusGlobalEventDet();
        var Addband          = false
        let rowDet           = await Grid.current.instance.getDataSource();
        var columnaRequerido = []      
        if(columns.length){
          for (let index = 0; index < columns.length; index++) {
            const element = columns[index];
              if(element.requerido){
                for (let i = 0; i < rowDet._items.length; i++) {
                  const items = rowDet._items[i];
                  if(items[element.ID]){
                    if(items[element.ID] === ''){
                      Addband  = true;
                      var filas      = Grid.current.instance.getRowIndexByKey(items); 
                      if(filas == -1) filas = 0 
                      var indexComun = Grid.current.instance.getCellElement(filas,element.ID);
                      columnaRequerido = {'label':element.label,'ID':element.ID, indexRow:filas, indexComun:indexComun?.cellIndex}
                      break
                    }
                  }else{
                    Addband  = true;
                    var filas      = Grid.current.instance.getRowIndexByKey(items); 
                    if(filas == -1) filas = 0 
                    var indexComun = Grid.current.instance.getCellElement(filas,element.ID);
                    columnaRequerido = {'label':element.label,'ID':element.ID, indexRow:filas, indexComun:indexComun?.cellIndex}
                    break
                  }
                }
                if(Addband) break
              }
           }
        }
        if(Addband){  
          Grid.current.instance.option("focusedRowKey", 120);
          Grid.current.instance.clearSelection();            
          setTimeout(()=>{
            Grid.current.instance.focus(Grid.current.instance.getCellElement(columnaRequerido.indexRow,columnaRequerido.ID)),100
          })
          return
        }
        modifico();
        if(rowDet._items.length == 0) indexRow = rowDet._items.length
        var id_cabecera = rowDet._items.length > 0 ? rowDet._items[0].idCabecera : newKey
        var newKey = uuidID();
        var row    = [0]
        row = [{
          ...row[0],
          ID          : newKey,
          inserted    : true,
          COD_EMPRESA : sessionStorage.getItem('cod_empresa'),
          COD_USUARIO : sessionStorage.getItem('cod_usuario'),
          idCabecera  : id_cabecera,
          TIP_COMPROBANTE:'PRT',
          SER_COMPROBANTE:'A'
        }];
        let rows    = await rowDet._items;
        let content = await rows.concat(rows.splice(indexRow, 0, ...row))
        const addNewRow = new DataSource({
            store: new ArrayStore({
                data: content,
            }),
            key: 'ID'
        })
        Grid.current.instance.option('dataSource', addNewRow);
        setTimeout(()=>{
            if(rowDet._items.length >= 0){
                    Grid.current.instance.focus(
                    Grid.current.instance.getCellElement(indexRow,0)
                );
            }
        },200);
      }
    }else{
      // AGREGA NUEVO REGISTRO
      clearForm();
      setTimeout( ()=> initialFormData(), 100 );
    }
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
      <Main.Spin id="thingtoclick" size="large" spinning={activarSpinner}>
        <Main.Layout
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}>
          <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`}/>
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
                    // id="test_button"
                    onClick={ ManageNewButton }
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
                    id="buscador-f7"
                    icon={<img src={iconBuscador} width="25" id="right-arrow"/>}
                    className="paper-header-menu-button" 
                    onClick={()=>ManejaF7(true)}
                  />
                  <Button 
                    style={{marginLeft:'10px'}}
                    icon={<img src={cancelarEdit} width="25"/>}
                    className="paper-header-menu-button button-cancelar-alternativo button-cancelar-ocultar-visible" 
                    onClick={cancelar}
                  />
                </div>
                <Form size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px', marginRight:'20px', marginLeft:'20px'}}>
                  <div id="form-div-1">
                  <Row gutter={[8]}>
                    <Col span={8}>
                      <Form.Item label={<label style={{width:'65px'}}>Comp.</label>}>
                        <Form.Item name="SER_COMPROBANTE" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input
                            onChange={handleInputChange} 
                            onKeyDown={handleKeyDown} 
                            onKeyUp={handleKeyUp} 
                            onFocus={handleFocus} 
                            readOnly={IsInputBloqued} 
                            />
                        </Form.Item>
                        <Form.Item name="NRO_COMPROBANTE" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input 
                            onChange={handleInputChange} 
                            onKeyDown={handleKeyDown} 
                            onKeyUp={handleKeyUp} 
                            onFocus={handleFocus} 
                            readOnly={IsInputBloqued} 
                            />
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'65px'}}>Fecha</label>} name="FEC_COMPROBANTE">
                        <Input 
                          onKeyDown={handleKeyDown} 
                          onKeyUp={handleKeyUp} 
                          onFocus={handleFocus} 
                          readOnly={IsInputBloqued}
                          />
                      </Form.Item>
                      <Row>
                        <Col span={12}>
                          <Form.Item label={<label style={{width:'65px'}}>Inicio</label>} name="FEC_INICIO">
                            <Input 
                              onKeyDown={handleKeyDown} 
                              onKeyUp={handleKeyUp} 
                              onFocus={handleFocus} 
                              readOnly={IsInputBloqued}
                              />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={<label style={{width:'65px'}}>Fin</label>} name="FEC_FIN">
                            <Input 
                              onKeyDown={handleKeyDown} 
                              onKeyUp={handleKeyUp} 
                              onFocus={handleFocus} 
                              readOnly={IsInputBloqued}
                              />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label={<label style={{width:'65px'}}>Cam U$</label>} name="TIP_CAMBIO_US_FORMAT">
                        <Input className="requerido" style={{textAlign:'right'}} disabled />
                      </Form.Item>
                      <Form.Item 
                        label={<label style={{width:'65px'}}>Estado</label>} 
                        name="ESTADO" 
                        onChange={handleEstado}
                        >
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
                      <Form.Item label={<label style={{width:'65px'}}>Sucursal</label>}>
                        <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input 
                            type="number" 
                            className="search_input requerido" 
                            onChange={handleInputChange} 
                            onKeyDown={handleKeyDown} 
                            onKeyUp={handleKeyUp} 
                            onFocus={handleFocus} 
                            readOnly={IsInputBloqued} 
                            />
                        </Form.Item>
                        <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'65px'}}>Dirección</label>} name="DIR_SALIDA">
                        <Input disabled/>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'65px'}}>Motivo</label>}>
                        <Form.Item name="COD_MOTIVO" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input 
                            type="number" 
                            className="search_input requerido" 
                            onChange={handleInputChange} 
                            onKeyDown={handleKeyDown} 
                            onKeyUp={handleKeyUp} 
                            onFocus={handleFocus} 
                            readOnly={IsInputBloqued} 
                            />
                        </Form.Item>
                        <Form.Item name="DESC_MOTIVO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Divider style={{margin:'2px 0'}}>Datos de destino de la mercaderia</Divider>
                      <Row>
                        <Col span={16}>
                          <Form.Item label={<label style={{width:'65px'}}>Sucursal</label>}>
                            <Form.Item name="COD_SUCURSAL_ENT" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input 
                                type="number" 
                                className="search_input requerido" 
                                onChange={handleInputChange} 
                                onKeyDown={handleKeyDown} 
                                onKeyUp={handleKeyUp} 
                                onFocus={handleFocus} 
                                readOnly={IsInputBloqued} 
                                />
                            </Form.Item>
                            <Form.Item name="DESC_SUCURSAL_ENT" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                          <Form.Item label={<label style={{width:'65px'}}>Dirección</label>} name="DIR_LLEGADA">
                            <Input disabled/>
                          </Form.Item>
                          <Form.Item label={<label style={{width:'65px'}}>Depósito</label>}>
                            <Form.Item name="COD_DEPOSITO_ENT" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input 
                                type="number" 
                                className="search_input requerido" 
                                onChange={handleInputChange} 
                                onKeyDown={handleKeyDown} 
                                onKeyUp={handleKeyUp} 
                                onFocus={handleFocus} 
                                readOnly={IsInputBloqued} 
                                />
                            </Form.Item>
                            <Form.Item name="DESC_DEPOSITO_ENT" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={8} style={{textAlign:'center'}}>
                          <Button 
                            id="carga_remision"
                            type="primary" 
                            size="large" 
                            style={{boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} 
                            onClick={CargaTransferencia} 
                            disabled={isButtonBloqued}>
                            Transferencia Entre Sucursal
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  </div>
                  <Row style={{marginBottom:'10px', marginTop:'10px'}}>
                    <Col span={24}>
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
                          activateF6={false}
                          funcionNuevo={ManageNewButton}
                          altura={350}
                          newAddRow={true}
                          canDelete={true}
                          setRowFocusDet={setRowFocusDet}
                          setCellChanging={setCellChanging}
                          setActivarSpinner={setActivarSpinner}
                          maxFocus={maxFocus}
                          dataCabecera={Data[getIndice()]}
                          buscadorGrid={true}
                          page={10}
                        />
                    </Col>
                  </Row>
                  <div id="form-div-2">
                  <Row>
                    <Col span={4}>
                      <Form.Item label={<label style={{width:'70px'}}>Dep. Salida</label>} name="DESC_DEPOSITO">
                        <Input disabled/>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={<label style={{width:'70px'}}>Categoria</label>} name="DESC_CATEGORIA">
                        <Input disabled/>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={<label style={{width:'70px'}}>Promedio</label>} name="COSTO_PROMEDIO">
                        <Input style={{textAlign:'right'}} disabled/>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={<label style={{width:'70px'}}>Ultimo</label>} name="COSTO_ULTIMO">
                        <Input style={{textAlign:'right'}} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={<label style={{width:'70px'}}>Cant. Ub.</label>} name="CANTIDAD_UB">
                        <Input style={{textAlign:'right'}} disabled/>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={<label style={{width:'70px'}}>Total Peso</label>} name="SUM_PESO">
                        <Input style={{textAlign:'right'}} disabled/>
                      </Form.Item>
                    </Col>
                  </Row>
                  </div>
                </Form>
                <Row>
                  <Col span={24}>
                    <div className='total_registro_pg' style={{margin:'0px 0px 10px 10px'}}>
                      Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
                    </div>
                  </Col>
                </Row>
              </Main.Paper>
            </div>
        </Main.Layout>
      </Main.Spin>
    </>
  );
});
export default STREMINI;