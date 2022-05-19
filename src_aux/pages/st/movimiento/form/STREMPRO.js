import React, { memo, useState, useRef, useEffect } from 'react';
import { v4 as uuidID } from "uuid";
import { Typography, Form, Input, Row, Col, Radio, Divider, Button, Tabs } from 'antd';
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import _ from 'underscore';
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import Main from "../../../../components/utils/Main";
import { Menu, DireccionMenu } from '../../../../components/utils/FocusDelMenu';
import ValidarCamposRequeridos, { QuitarClaseRequerido } from "../../../../components/utils/ValidarCamposRequeridos";
import nuevo from '../../../../assets/icons/add.svg';
import deleteIcon from '../../../../assets/icons/delete.svg';
import guardar from '../../../../assets/icons/diskette.svg';
import cancelarEdit from '../../../../assets/icons/iconsCancelar.svg';
import left from '../../../../assets/icons/prev.svg';
import right from '../../../../assets/icons/next.svg';

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
const { TabPane } = Tabs;
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
const TituloList = "Procesar Remisiones entre sucursales";
const FormName = "STREMPRO";
// URLS
const url_cabecera = '/st/strempro/cabecera';
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

const STREMPRO = memo(() => {
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


  useEffect( ()=> {
    getDataCab();
  },[] )

  const getDataCab = async() => {
    // setActivarSpinner(true);
    try {
      // let data = {
      //   cod_empresa: cod_empresa,
      //   nro_comprobante: form.getFieldValue('NRO_COMPROBANTE') != undefined ? form.getFieldValue('NRO_COMPROBANTE') : '',
      //   fec_comprobante: form.getFieldValue('FEC_COMPROBANTE') != undefined ? form.getFieldValue('FEC_COMPROBANTE') : '',
      //   cod_sucursal: form.getFieldValue('COD_SUCURSAL') != undefined ? form.getFieldValue('COD_SUCURSAL') : '',
      //   cod_motivo: form.getFieldValue('COD_MOTIVO') != undefined ? form.getFieldValue('COD_MOTIVO') : '',
      //   cod_sucursal_ent: form.getFieldValue('COD_SUCURSAL_ENT') != undefined ? form.getFieldValue('COD_SUCURSAL_ENT') : '',
      //   cod_deposito_ent: form.getFieldValue('COD_DEPOSITO_ENT') != undefined ? form.getFieldValue('COD_DEPOSITO_ENT') : '',
      //   estado: form.getFieldValue('ESTADO') != undefined ? form.getFieldValue('ESTADO') : '',
      //   indice: 0,
      //   limite: data_len
      // }
			return await Main.Request(url_cabecera, "POST", {}).then((resp) => {

        console.log('===>', resp);

        // let response = resp.data.response.rows;
				// if (response.length > 0) {

        //   console.log('entro aqui ===> ', response);

        //   document.getElementById("total_registro").textContent = response.length;
        //   setData(response);
        //   DataAux = JSON.stringify(response);
        //   MODO = 'U';
        //   setIndice(0);
        //   loadForm(response);
        //   setLongitud(response.length);
        //   EstadoFormulario('U',response);
        //   setActivarSpinner(false);
				// }else{
        //   // setActivarSpinner(false);
        //   Main.message.info({
        //     content  : `No se han encontrado registros`,
        //     className: 'custom-class',
        //     duration : `${2}`,
        //     style    : {
        //       marginTop: '2vh',
        //     },
        //   });
        // }
			});
		} catch (error) {
			console.log(error);
		} 
  }
  
  return (
    <>
      {/* MENSAJES */}
      {/* <Main.ModalDialogo
        positiveButton={showMessageButton ? "SI" : ""  }
        negativeButton={showMessageButton ? "NO" : "OK"}
        positiveAction={showMessageButton ? SaveForm : null}
        negativeAction={handleCancel}
        onClose={handleCancel}
        setShow={visibleMensaje}
        title={tituloModal}
        imagen={imagen}
        mensaje={mensaje}
      /> */}
      {/* BUSCADOR */}
      {/* <Main.FormModalSearch
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
      /> */}
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
                    // onClick={ ManageNewButton }
                  />
                  <Button
                    icon={<img src={guardar} width="20" style={{ marginBottom: '3px', }} />}
                    className="paper-header-menu-button"
                    // onClick={SaveForm}
                    />
                  <Button 
                    style={{marginRight:'5px', marginRight:'1px'}}
                    icon={<img src={deleteIcon} width="25"/>}
                    className="paper-header-menu-button" 
                    // onClick={deleteRows}
                  />
                  <Button
                    id="left-arrow"
                    icon={<img src={left} width="25"  id="left-arrow"/>}
                    className="paper-header-menu-button"
                    // onClick={NavigateArrow}
                  />
                  <Button 
                    id="right-arrow"
                    icon={<img src={right} width="25" id="right-arrow"/>}
                    className="paper-header-menu-button"
                    // onClick={NavigateArrow}
                  />
                  <Button 
                    style={{marginLeft:'10px'}}
                    icon={<img src={cancelarEdit} width="25"/>}
                    className="paper-header-menu-button button-cancelar-alternativo button-cancelar-ocultar-visible" 
                    // onClick={cancelar}
                  />
                </div>
                <Form size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px', marginRight:'20px', marginLeft:'20px'}}>
                  <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab={ <span> <AppleOutlined /> Remisiones Provisorias </span> } key="1">
                      <Row>
                        <Col span={8}>
                          <Form.Item label={<label style={{width:'65px'}}>Comp.</label>}>
                            <Form.Item name="SER_COMPROBANTE" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input
                                // onChange={handleInputChange} 
                                // onKeyDown={handleKeyDown} 
                                // onKeyUp={handleKeyUp} 
                                // onFocus={handleFocus} 
                                // readOnly={IsInputBloqued} 
                                />
                            </Form.Item>
                            <Form.Item name="NRO_COMPROBANTE" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input 
                                // onChange={handleInputChange} 
                                // onKeyDown={handleKeyDown} 
                                // onKeyUp={handleKeyUp} 
                                // onFocus={handleFocus} 
                                // readOnly={IsInputBloqued} 
                                />
                            </Form.Item>
                          </Form.Item>
                          <Form.Item label={<label style={{width:'65px'}}>Fecha</label>} name="FEC_COMPROBANTE">
                            <Input 
                              // onKeyDown={handleKeyDown} 
                              // onKeyUp={handleKeyUp} 
                              // onFocus={handleFocus} 
                              // readOnly={IsInputBloqued}
                              />
                          </Form.Item>
                          <Row>
                            <Col span={12}>
                              <Form.Item label={<label style={{width:'65px'}}>Inicio</label>} name="FEC_INICIO">
                                <Input 
                                  // onKeyDown={handleKeyDown} 
                                  // onKeyUp={handleKeyUp} 
                                  // onFocus={handleFocus} 
                                  // readOnly={IsInputBloqued}
                                  />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item label={<label style={{width:'65px'}}>Fin</label>} name="FEC_FIN">
                                <Input 
                                  // onKeyDown={handleKeyDown} 
                                  // onKeyUp={handleKeyUp} 
                                  // onFocus={handleFocus} 
                                  // readOnly={IsInputBloqued}
                                  />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Form.Item label={<label style={{width:'65px'}}>Cam U$</label>} name="TIP_CAMBIO_US">
                            <Input className="requerido" style={{textAlign:'right'}} disabled />
                          </Form.Item>
                          <Form.Item 
                            label={<label style={{width:'65px'}}>Estado</label>} 
                            name="ESTADO" 
                            // onChange={handleEstado}
                            >
                            <Radio.Group>
                              <Radio 
                                value="P"
                                // onKeyDown={ handleKeyDown }
                                // disabled={ IsPendienteBloqued }
                                >
                                Pendiente
                              </Radio>
                              <Radio 
                                value="C"
                                // onKeyDown={ handleKeyDown }
                                // disabled={ IsCondfirmadoBloqued }
                                >
                                Confirmado
                              </Radio>
                              <Radio 
                                value="A" 
                                // onKeyDown={ handleKeyDown }
                                // disabled={ IsAnularBloqued }
                                >
                                Anulado
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Row>
                            <Col span={12}>
                              <Form.Item label={<label style={{width:'65px'}}>Sucursal</label>}>
                                <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                  <Input 
                                    type="number" 
                                    className="search_input requerido" 
                                    // onChange={handleInputChange} 
                                    // onKeyDown={handleKeyDown} 
                                    // onKeyUp={handleKeyUp} 
                                    // onFocus={handleFocus} 
                                    // readOnly={IsInputBloqued} 
                                    />
                                </Form.Item>
                                <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                  <Input disabled/>
                                </Form.Item>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item label={<label style={{width:'65px'}}>Dirección</label>} name="DIR_SALIDA">
                                <Input disabled/>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Form.Item label={<label style={{width:'65px'}}>Deposito</label>}>
                            <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input 
                                type="number" 
                                className="search_input requerido" 
                                // onChange={handleInputChange} 
                                // onKeyDown={handleKeyDown} 
                                // onKeyUp={handleKeyUp} 
                                // onFocus={handleFocus} 
                                // readOnly={IsInputBloqued} 
                                />
                            </Form.Item>
                            <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                          <Row>
                            <Col span={16}>
                              <Form.Item label={<label style={{width:'65px'}}>Vehiculo</label>}>
                                <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                  <Input 
                                    type="number" 
                                    className="search_input requerido" 
                                    // onChange={handleInputChange} 
                                    // onKeyDown={handleKeyDown} 
                                    // onKeyUp={handleKeyUp} 
                                    // onFocus={handleFocus} 
                                    // readOnly={IsInputBloqued} 
                                    />
                                </Form.Item>
                                <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                  <Input disabled/>
                                </Form.Item>
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label={<label style={{width:'65px'}}>Chapa</label>} name="DIR_SALIDA">
                                <Input disabled/>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Form.Item label={<label style={{width:'65px'}}>Chofer</label>}>
                            <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input 
                                type="number" 
                                className="search_input requerido" 
                                // onChange={handleInputChange} 
                                // onKeyDown={handleKeyDown} 
                                // onKeyUp={handleKeyUp} 
                                // onFocus={handleFocus} 
                                // readOnly={IsInputBloqued} 
                                />
                            </Form.Item>
                            <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                          <Row>
                            <Col span={16}>
                              <Form.Item label={<label style={{width:'65px'}}>Dirección</label>}>
                                <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                  <Input 
                                    type="number" 
                                    className="search_input requerido" 
                                    // onChange={handleInputChange} 
                                    // onKeyDown={handleKeyDown} 
                                    // onKeyUp={handleKeyUp} 
                                    // onFocus={handleFocus} 
                                    // readOnly={IsInputBloqued} 
                                    />
                                </Form.Item>
                                <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                  <Input disabled/>
                                </Form.Item>
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label={<label style={{width:'65px'}}>Cedula</label>} name="DIR_SALIDA">
                                <Input disabled/>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={16}>
                              <Form.Item label={<label style={{width:'65px'}}>Transp</label>}>
                                <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                  <Input 
                                    type="number" 
                                    className="search_input requerido" 
                                    // onChange={handleInputChange} 
                                    // onKeyDown={handleKeyDown} 
                                    // onKeyUp={handleKeyUp} 
                                    // onFocus={handleFocus} 
                                    // readOnly={IsInputBloqued} 
                                    />
                                </Form.Item>
                                <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                  <Input disabled/>
                                </Form.Item>
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label={<label style={{width:'65px'}}>RUC</label>} name="DIR_SALIDA">
                                <Input disabled/>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Form.Item label={<label style={{width:'65px'}}>Motivo</label>}>
                            <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input 
                                type="number" 
                                className="search_input requerido" 
                                // onChange={handleInputChange} 
                                // onKeyDown={handleKeyDown} 
                                // onKeyUp={handleKeyUp} 
                                // onFocus={handleFocus} 
                                // readOnly={IsInputBloqued} 
                                />
                            </Form.Item>
                            <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                          <Form.Item label={<label style={{width:'65px'}}>Planilla</label>}>
                            <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input 
                                type="number" 
                                className="search_input requerido" 
                                // onChange={handleInputChange} 
                                // onKeyDown={handleKeyDown} 
                                // onKeyUp={handleKeyUp} 
                                // onFocus={handleFocus} 
                                // readOnly={IsInputBloqued} 
                                />
                            </Form.Item>
                            <Form.Item name="DESC_SUCURSAL" style={{width:'70px', marginRight:'4px', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                            <Form.Item name="DESC_SUCURSAL" style={{width:'70px', marginRight:'4px', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                            <Form.Item name="DESC_SUCURSAL" style={{width:'70px', marginRight:'4px', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                            <Form.Item name="DESC_SUCURSAL" style={{width:'70px', marginRight:'4px', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                          <Divider>Datos de destino de la mercaderia</Divider>
                          <Row>
                            <Col span={16}>
                              <Form.Item label={<label style={{width:'65px'}}>Sucursal</label>}>
                                <Form.Item name="COD_SUCURSAL_ENT" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                  <Input 
                                    type="number" 
                                    className="search_input requerido" 
                                    // onChange={handleInputChange} 
                                    // onKeyDown={handleKeyDown} 
                                    // onKeyUp={handleKeyUp} 
                                    // onFocus={handleFocus} 
                                    // readOnly={IsInputBloqued} 
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
                                    // onChange={handleInputChange} 
                                    // onKeyDown={handleKeyDown} 
                                    // onKeyUp={handleKeyUp} 
                                    // onFocus={handleFocus} 
                                    // readOnly={IsInputBloqued} 
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
                                // onClick={CargaTransferencia} 
                                // disabled={isButtonBloqued}
                                >
                                Transferencia Entre Sucursal
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row style={{marginBottom:'10px', marginTop:'10px'}}>
                        <Col span={24}>
                          {/* <DevExtremeDet
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
                              altura={250}
                              newAddRow={true}
                              canDelete={true}
                              setRowFocusDet={setRowFocusDet}
                              setCellChanging={setCellChanging}
                              setActivarSpinner={setActivarSpinner}
                              maxFocus={maxFocus}
                              dataCabecera={Data[getIndice()]}
                              buscadorGrid={true}
                              page={10}
                            /> */}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={6}>
                          <Form.Item label={<label style={{width:'70px'}}>Dep. Salida</label>} name="DESC_DEPOSITO">
                            <Input disabled/>
                          </Form.Item>
                          <Form.Item label={<label style={{width:'70px'}}>Categoria</label>} name="DESC_CATEGORIA">
                            <Input disabled/>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<label style={{width:'70px'}}>Promedio</label>} name="COSTO_PROMEDIO">
                            <Input style={{textAlign:'right'}} disabled/>
                          </Form.Item>
                          <Form.Item label={<label style={{width:'70px'}}>Ultimo</label>} name="COSTO_ULTIMO">
                            <Input style={{textAlign:'right'}} disabled />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<label style={{width:'70px'}}>Cant. Ub.</label>} name="CANTIDAD_UB">
                            <Input style={{textAlign:'right'}} disabled/>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<label style={{width:'70px'}}>Total Peso</label>} name="SUM_PESO">
                            <Input style={{textAlign:'right'}} disabled/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane  tab={ <span> <AndroidOutlined /> Carga Distribución </span> } key="2">
                      Tab 2
                    </TabPane>
                    <TabPane tab={ <span> <AndroidOutlined /> Conferencias </span> } key="3">
                      Tab 3
                    </TabPane>
                  </Tabs>
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
        </Main.Layout>
      </Main.Spin>
    </>
  );
});

export default STREMPRO;