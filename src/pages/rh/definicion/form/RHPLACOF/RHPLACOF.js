import React, { memo, useState, useRef, useEffect } from 'react';
import { v4 as uuidID }                             from "uuid";
import { Typography, Form, Input, Row, Col, 
         Button, Card}                              from 'antd';
import _                                            from 'underscore';
import ArrayStore                                   from "devextreme/data/array_store";
import DataSource                                   from "devextreme/data/data_source";
import Main                                         from '../../../../../components/utils/Main';
import { Menu, DireccionMenu }                      from '../../../../../components/utils/FocusDelMenu';
import nuevo                                        from '../../../../../assets/icons/add.svg';
import iconBuscador                                 from '../../../../../assets/icons/search-f7.svg'
import deleteIcon                                   from '../../../../../assets/icons/delete.svg';
import guardar                                      from '../../../../../assets/icons/diskette.svg';
import cancelarEdit                                 from '../../../../../assets/icons/iconsCancelar.svg';
import DevExtremeDet,{
    getBloqueoCabecera, 
    setBloqueoCabecera,
    getFocusGlobalEventDet, 
    getComponenteEliminarDet,
    setbandBloqueoGrid,
    getRowIndex
  }                                                 from '../../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import { modifico, setModifico }                    from "../../../../../components/utils/DevExtremeGrid/ButtonCancelar";
import currency                                     from 'currency.js';

  const columns = [  
    { ID: 'COD_CONCEPTO'            , label: 'Concepto'               , width: 125       , align:'left'    },
    { ID: 'DESCRIPCION'             , label: 'Descripción'            , maxWidth: 50     , align:'left'    },
    { ID: 'TIP_COLUMNA'             , label: 'Nro. de Columna'        , width: 130       , align:'left'    }
];

const { Title, Text }    = Typography;
const TituloList = "Concepto para Planillas";
const FormName = "RHPLACOF";

// URLS
const url_cabecera = '/rh/rhplacof_cab/';
const url_detalle  = '/rh/rhplacof_det/';
const url_base = '/st/stenvio';

// BUSCAR
const url_buscar_sucursal = '/st/stenvio/buscar/sucursal';
const url_buscar_motivo = '/st/stenvio/buscar/motivo';
const url_buscar_articulo = '/st/stenvio/buscar/articulo';

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
const data_len = 100;
var MODO = 'I';

// BORRADO DE LINEA
var DeleteDetalle = {}
const LimpiarDeleteDetalle = () =>{
  DeleteDetalle = [];
}
// BORRADO DE CABECERA
var DeleteCabecera      = []
const limpiarDeleteCabecera = () =>{
  DeleteCabecera = [];
}

// LIMITAR EL ULTIMO FOCUS
const maxFocus = [{
	id:"GRID_DETALLE",
	hasta:"COD_CAUSA",
	newAddRow:true,
  nextId:'DESC_CAUSA'
}];

var bandPost_Cab_Det = true;

var bandBloqueo = false

var DataAux        = "";
var DataDetalleAux = "";
// variable global, identifica la posicion del focus para la eliminación cabecera detalle
var bandCabDet     = true

const CONCEPTOPLANILLAS = memo(() => {

    const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
    const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);  
    // const PermisoEspecial     = getPermisos(FormName);
    const cod_empresa         = sessionStorage.getItem('cod_empresa');
    const cod_usuario         = sessionStorage.getItem('cod_usuario');
    const cod_sucursal        = sessionStorage.getItem('cod_sucursal');
    // const cod_sucursal        = 1;


    const [ form ]            = Form.useForm();

    const Grid                = useRef();

    
    // STATE
    const [ activarSpinner, setActivarSpinner        ] = useState(false);
    // CABECERA
    const [ Data , setData                           ] = useState([]);
    // MENSAJES
    const [ showMessageButton , setShowMessageButton ] = useState(false);
    const [ visibleMensaje    , setVisibleMensaje    ] = useState(false);
    const [ mensaje           , setMensaje           ] = useState();
    const [ imagen            , setImagen            ] = useState();
    const [ tituloModal       , setTituloModal       ] = useState();

    // BUSCADORES
    const [ shows             , setShows             ] = useState(false);
    const [ modalTitle        , setModalTitle        ] = useState('');
    const [ searchColumns     , setSearchColumns     ] = useState({});
    const [ searchData        , setSearchData        ] = useState([]);
    const [ tipoDeBusqueda    , setTipoDeBusqueda    ] = useState();

    // REFERENCIAS
    const nroPlanilla = useRef();

    // ESTADO FORMULARIO
    const [ IsInputBloqued        , setIsInputBloqued      ] = useState(false);
    const [ IsCommentBloqued      , setIsCommentBloqued    ] = useState(false);
    const [ IsPendienteBloqued    , setIsPendienteBloqued  ] = useState(false);
    const [ IsCondfirmadoBloqued  , setIsConfirmadoBloqued ] = useState(false);
    const [ IsAnularBloqued       , setIsAnularBloqued     ] = useState(false);
    // LINEA POR DEFECTO DEL GRID
    const initialRow = [
        { COD_PLANILLA: "COD_PLANILLA"  },
        { TITULO      : "TITULO"        },

    ];

    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        SaveForm();
      },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    useEffect(() => {
        getDataCab();
        document.getElementById("form-div-rhplacof").addEventListener('click', function (e){
                bandCabDet = true
            });
        document.getElementById("form-div-rhplacof-grid").addEventListener('click', function (e){
                bandCabDet = false
            });
        // clearForm();
        // getDataDet();

        // setTimeout( ()=>{
        //   initialFormData();
        // },100);
      }, []);

      const initialFormData = async(isNew)=>{
        bandCabDet = true
        setBloqueoCabecera(false);
        var newKey = uuidID();
        var valor = {
          ['ID']: newKey,

          ['COD_CONCEPTO'                 ] : '',
          ['DESCRIPCION'                  ] : '',
          ['TIP_COLUMNA'                  ] : '',

          ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
          ['COD_SUCURSAL']: sessionStorage.getItem('cod_sucursal'),
          ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),

          ['insertedDefault']: true,

        }
        if(isNew){
          valor = 
           {...valor,
              ['inserted'                 ] :true,
              // ['COD_PLANILLA'             ] : '',
              // ['TITULO'                   ] : '',

              ['COD_CONCEPTO'                 ] : '',
              ['DESCRIPCION'                  ] : '',
              ['TIP_COLUMNA'                  ] : '',

          }
          return valor
          }else{
              valor.insertDefault = true
              form.setFieldsValue([valor]);
          };
        // setData([valor]);
        DataAux = JSON.stringify([valor]);
        // form.setFieldsValue(valor);
        MODO = 'I';
        EstadoFormulario('I');
        var newKeyDet = uuidID();
        setTimeout( ()=> {
          var content = [{
            ID	            : newKeyDet,

            
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
        },500);
        document.getElementById("indice").textContent = "1";
        document.getElementById("total_registro").textContent = "1";
        document.getElementById("mensaje").textContent = "";
      }
    

    const getDataCab = async() => {
        setActivarSpinner(true);
        try {
          let data = {
            // cod_empresa: cod_empresa,
            COD_PLANILLA:   form.getFieldValue('COD_PLANILLA') != undefined ? form.getFieldValue('COD_PLANILLA') : '',
            TITULO:         form.getFieldValue('TITULO') != undefined ? form.getFieldValue('TITULO') : '',

            tip_comprobante_ref: form.getFieldValue('TIP_COMPROBANTE_REF') != undefined ? form.getFieldValue('TIP_COMPROBANTE_REF') : '',
            ser_comprobante_ref: form.getFieldValue('SER_COMPROBANTE_REF') != undefined ? form.getFieldValue('SER_COMPROBANTE_REF') : '',
            nro_comprobante_ref: form.getFieldValue('NRO_COMPROBANTE_REF') != undefined ? form.getFieldValue('NRO_COMPROBANTE_REF') : '',

            indice: 0,
            limite: data_len,

          }
            return await Main.Request(url_cabecera+[cod_empresa, cod_sucursal], "POST", data).then((resp) => {

            let response =  resp.data.rows;
            console.log('variable response ==> ', response)
            console.log('el length de response ==> ',response.length)

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

    const loadForm = (data) => {
        form.setFieldsValue({
          ...data[getIndice()],
          TIP_CAMBIO_US_FORMAT: currency(data[getIndice()]['TIP_CAMBIO_US'], { separator:'.',decimal:',',precision:0,symbol:'' } ).format() 
        });
        getDataDet(data[getIndice()]);
     }

    /////////////////////////////////////////////////////////////////////////////////////////

    const clearForm = async(limp_D_Cab = true) =>{
        bandCabDet = true
        setModifico();
        var newKey = uuidID();
        // form.resetFields();
        form.setFieldsValue({
        ['COD_PLANILLA']: newKey,
        // ['TITULO'      ]: 'TITULO',

        ['COD_EMPRESA'  ]: sessionStorage.getItem('cod_empresa'),
        ['COD_USUARIO'  ]: sessionStorage.getItem('cod_usuario'),
        ['COD_SUCURSAL' ]: sessionStorage.getItem('cod_sucursal'),
        // ['insertedDefault']: true,
        });
        const content = [{
        ID: newKey,      
        COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
        // COD_PLANILLA:   '',
        // TITULO:         '',

        InsertDefault: true,
        }]
        const dataSource = new DataSource({
        store: new ArrayStore({
            data: content,
        }),
        key: 'COD_PLANILLA'
        });
        Grid.current.instance.option('dataSource', dataSource);
        setTimeout(() => {
        Grid.current.instance.option("focusedRowIndex",0)
        },200);
        // QuitarClaseRequerido();
        // LimpiarDeleteDetalle();
        if(limp_D_Cab) limpiarDeleteCabecera()
    }


    const getDataDet = async(data) => {
      // console.log('data ==> ', data)
      const info = await Main.Request(url_detalle+[cod_empresa, cod_sucursal],'POST',{ 
        
        nroPlanilla: data.COD_PLANILLA
      
      });

      // console.log('esto es ROWS => ', info.data.rows)
      const { rows } = info.data;

      var newKey = uuidID();
      var content = rows;
      // console.log('content.length ==> ',content.length)
      document.getElementById("total_registrogrid").textContent = content.length;

      if(content.length == 0){
        console.log('leng es cero')
        content = [{
          ID	            : newKey,
          COD_CONCEPTO    : form.getFieldValue('COD_CONCEPTO') !== undefined ? form.getFieldValue('COD_CONCEPTO') : '',
          COD_EMPRESA     : sessionStorage.getItem('cod_empresa'),
          idCabecera      : form.getFieldValue('ID') !== undefined ? form.getFieldValue('ID') : '',
          InsertDefault   : true,
          IDCOMPONENTE    : "GRID_DETALLE",
          NRO_ORDEN       : 1,
        }];
      }
      DataDetalleAux = JSON.stringify(content);
      const dataSource = new DataSource({
        store: new ArrayStore({
          data: content,
        }),
        key: 'ID'
      })
      await Grid.current.instance.option('dataSource', dataSource);
      if(rows?.length > 0){
        form.setFieldsValue({
          ...form.getFieldsValue()
        })
      }
      setActivarSpinner(false);
      setTimeout(()=>{
        Grid.current.instance.option("focusedRowIndex",0);
      },40);
      return rows;
    }
      


    const SaveForm = async() => {
        console.log("Boton no configurado");
    }

    // DELETE
    const deleteRows = async() =>{
        console.log("Boton no configurado");
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

    const getRecursiveData = async (data, url) => {
		try {
			return await Main.Request(url, "POST", data)
		} catch (error) {
			console.log(error);
      return [];
		}
	};

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


    const rightData = async() => {
            if(!getBloqueoCabecera()){
            if(Data.length == 1){
                clearForm();
                getDataCab();
            }else{


                var index = Indice + 1;
                if(index > getLongitud()-1 ){
                index = getLongitud()-1;
                document.getElementById("mensaje").textContent = "Has llegado al último registro";


                }else{

                  await getDataDet(Data[index]).then( resp => {
                      document.getElementById("indice").textContent = index + 1;
                      form.setFieldsValue({
                      ...Data[index],
                      TIP_CAMBIO_US_FORMAT: currency(Data[index]['TIP_CAMBIO_US'], { separator:'.',decimal:',',precision:0,symbol:'' } ).format() 
                      });
                      setIndice(index);
                      EstadoFormulario('U', Data );
                      document.getElementById("mensaje").textContent = "";

                  })
               
                }
            }
            // QuitarClaseRequerido();
            }else{
            setShowMessageButton(true)
            showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
            }
    }

    const leftData = async() => {
        if(!getBloqueoCabecera()){
          var index = Indice - 1;
          if(index < 0){
            index = 0;
            document.getElementById("mensaje").textContent = "Has llegado al primer registro";
          }else{
            document.getElementById("mensaje").textContent = "";
          }
          setIndice(index);
          document.getElementById("indice").textContent = index + 1;
          loadForm(Data);
          EstadoFormulario('U', Data );
        //   QuitarClaseRequerido();
        }else{
          setShowMessageButton(true)
          showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
        }
      }

      const addRow = async()=>{
        if(!bandBloqueo){
            let idComponent = getComponenteEliminarDet().id
            let indexRow  = getRowIndex()
            if(indexRow == -1) indexRow = 0
            if(idComponent !== 'RHPLACOF_CAB') indexRow = 0    
            modifico();
            let initialInput = await initialFormData(true)
            let data = Grid.current.instance.getDataSource();
            var newKey = uuidID();
            var row    = [0]

            row = [{
                ...initialInput,
                ID	          : newKey,
                IDCOMPONENTE  : "RHPLACOF_CAB",
            }]
            let rows    = data._items;
            let info = rows.concat(rows.splice(indexRow, 0, ...row))

            const dataSource_cab = new DataSource({
                store: new ArrayStore({
                    data: info,
                }),
                key: 'ID'
            });
            Grid.current.instance.option('dataSource', dataSource_cab);
            setTimeout(()=>{
              Grid.current.instance.focus(Grid.current.instance.getCellElement(indexRow,1))
            },110)
        }else{
            Grid.current.instance.option("focusedRowKey", 120);
            Grid.current.instance.clearSelection();
            Grid.current.instance.focus(0);
            setShowMessageButton(true);
            showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
        }

    }

      return (
        <>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`}/>
                <Main.Spin size="large" spinning={activarSpinner}>
                <Main.Paper className="paper-style">
                    <div className="paper-header">
                    <Title level={5} className="title-color"> {TituloList}
                        <div>
                            <Title level={4}  style={{ float: 'right', marginTop: '-16px', marginRight: '5px',  fontSize: '10px'}} className="title-color">{FormName}</Title>
                        </div>
                    </Title>
                    </div>

                    <div className="paper-header-menu">
                        <Button 
                            icon={<img src={nuevo} width="25"/>}         
                            className="paper-header-menu-button"
                            onClick={ () => {
                              // initialFormData();
                              addRow();

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
                    </div>

                    <Form autoComplete="off" size="small" form={form} style={{marginTop:'10px', paddingBottom:'20px', marginRight:'4px', marginLeft:'4px'}}>
                        <div id="form-div-rhplacof">
                            <Row gutter={[4, 4]}>
                                <Col span={8} xs={{ order: 1 }} style={{ paddingTop: "4px"}}>
                                    <Form.Item  label       = {<label style={{width:'65px'}}>Planilla</label>} 
                                                name        = "COD_PLANILLA"
                                                labelCol    = {{ span: 7 }}
                                                wrapperCol  = {{ span: 6 }}>
                                        <Input
                                            style     = {{textAlign:'right'}}
                                            type      = "number" onKeyUp={handleKeyUp}
                                            readOnly  = {IsInputBloqued}
                                            ref       = {nroPlanilla}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12} xs={{ order: 2 }} style={{ paddingTop: "4px"}}>
                                    <Form.Item  label={<label style={{width:'65px'}}>Titulo</label>} 
                                                name="TITULO"
                                                labelCol={{ span: 5 }}
                                                wrapperCol={{ span: 24 }}>
                                        <Input/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        <div style={{paddingTop: '15px'  }} id='form-div-rhplacof-grid'>
                            <DevExtremeDet
                                gridDet             = {Grid}
                                id                  = "GRID_DETALLE"
                                IDCOMPONENTE        = "GRID_DETALLE"
                                columnDet           = {columns}
                                // initialRow          = {initialRow}
                                // notOrderByAccion    = {notOrderByAccionDet}
                                FormName            = {FormName}
                                guardar             = {null}
                                // columnModal         = {columnModal}
                                activateF10         = {true}
                                altura              = {498}
                                // newAddRow           = {true}
                                // canDelete           = {true}
                                // setRowFocusDet      = {setRowFocusDet}
                                // operacion={operacion}
                                // setCellChanging     = {setCellChanging}
                                // setFocusedCellChanged={setFocusedCellChanged}
                                // setUpdateValue={setUpdateValue}
                                setActivarSpinner   = {setActivarSpinner}
                                // maxFocus            = {maxFocus}
                                // onFocusChangedF9={onFocusChangedF9}
                                // dataCabecera        = {Data[getIndice()]}
                                // limpiarColumnaRequerida = {true}
                                
                                // doNotsearch         = {doNotsearch}
                                // columBuscador       = {columBuscador_pos}
                            />
                        </div>

                    </Form>
                    
                    <div>

                    <Form>

                        <Row gutter={[2, 2]}>
                              <Col span={20} xs={{ order: 1 }} style={{ paddingLeft: '40px', paddingBottom:'10px', paddingRight: '50px'}}>
                                <div className='total_registro_pg' >
                                    Planilla: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
                                </div>
                              </Col>

                              <Col span={3} xs={{ order: 2 }} style={{ paddingLeft: '10px', paddingBottom:'10px', paddingRight: '20px'}}>
                                <div className='total_registro_pg'>
                                    Registros: <span id="total_registrogrid"></span> 
                                </div>
                          </Col>
                        </Row>

                    </Form>
                      

                    </div>


                </Main.Paper>
                </Main.Spin>

            </Main.Layout>

            
        </>
        )
    });



export default CONCEPTOPLANILLAS;