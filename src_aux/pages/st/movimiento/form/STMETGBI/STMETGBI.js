import React, { memo }         from 'react';
import Main                    from '../../../../../components/utils/Main';
import { Menu, DireccionMenu } from '../../../../../components/utils/FocusDelMenu';
import { Typography, Form, Input, Row, Col, Radio, Button} from 'antd';
import { v4 as uuidID }         from "uuid";
import DataSource               from "devextreme/data/data_source";
import ArrayStore               from "devextreme/data/array_store";
import { QuitarClaseRequerido } from "../../../../../components/utils/ValidarCamposRequeridos";
import DevExtremeDet, {getBloqueoCabecera , setBloqueoCabecera,
                       setbandBloqueoGrid ,setHabilitarDet}
                      from '../../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import TestDetalle from '../../../../test/TestDetalle';
import _ from 'underscore';
import './styles.css';

var cancelar_Stmetgbi_det = '';
const getCancelar_Stmetgbi_det = ()=>{
	return cancelar_Stmetgbi_det;
}
var cancelar_Stmetgbi_cab = '';
const getCancelar_Stmetgbi_cab = ()=>{
	return cancelar_Stmetgbi_cab;
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
// URLS
const url_cabecera = '/st/stmetgbi_cab';
const url_detalle  = '/st/stmetgbi_det';

const columnModal = {
    urlValidar : [
      {
        // SUC_PROV01: url_validar_sucursal,
        // SUC_PROV02: url_validar_sucursal,
        // SUC_PROV03: url_validar_sucursal,
        // SUC_PROV04: url_validar_sucursal,
      },
    ],
    urlBuscador: [],
    title      : [],
  	COD_LINEA  : [],    
    config     : {
      // SUC_PROV01:{
      //   depende_de:[
      //     {id: 'COD_EMPRESA' ,label: 'Empresa '},
      //   ],        
      //   dependencia_de:[]
      // },
      // SUC_PROV02:{
      //   depende_de:[
      //     {id: 'COD_EMPRESA' ,label: 'Empresa '},
      //   ],        
      //   dependencia_de:[]
      // },
      // SUC_PROV03:{
      //   depende_de:[
      //     {id: 'COD_EMPRESA' ,label: 'Empresa '},
      //   ],        
      //   dependencia_de:[]
      // },
      // SUC_PROV04:{
      //   depende_de:[
      //     {id: 'COD_EMPRESA' ,label: 'Empresa '},
      //   ],        
      //   dependencia_de:[]
      // },
    },
};
const columnsListarDet = [
  { ID: 'COD_ARTICULO'  , label: 'Código'        , width: 60      , align:'right'       , disable:true , vertical:true},
  { ID: 'DESC_ARTICULO' , label: 'Descripción'   , width: 200     , align:'left'        , disable:true},
  { ID: 'COD_CATEGORIA' , label: 'Cat.'          , width: 40      , align:'right'       , disable:true , vertical:true},
  { ID: 'TITULO_1'      , label: 'Apolo - C.D.E' , align:'center' , multiple_header:true,
    multiple_column:[
          { ID: 'SUC_PROV01'    , label: 'Suc. Prov'          , width: 40     , align:'right'   , disable:true ,  vertical:true},
          { ID: 'COLUM01'       , label: 'Media Venta'        , width: 63     , align:'right'   , disable:true},
          { ID: 'COLUM02'       , label: 'Stock Minimo'       , minWidth: 50  , align:'right'   , isnumber:true, disable:true},
          { ID: 'COLUM03'       , label: 'Sug. Stock Minimo'  , minWidth: 70  , align:'right'   , isnumber:true, formatter:'formatoDeCelda'},
    ]
  },
  { ID: 'TITULO_2'      , label: 'Apolo - Asunción' , align:'center'  , multiple_header:true,
    multiple_column:[
      { ID: 'SUC_PROV02'    , label: 'Suc. Prov'          , width: 40     , align:'right'   , disable:true,vertical:true},
      { ID: 'COLUM04'       , label: 'Media Venta'        , width: 63     , align:'right'   , disable:true},
      { ID: 'COLUM05'       , label: 'Stock Minimo'       , minWidth: 50  , align:'right'   , disable:true},
      { ID: 'COLUM06'       , label: 'Sug. Stock Minimo'  , minWidth: 70  , align:'right'   , isnumber:true,formatter:'formatoDeCelda'},
    ]
  },
  { ID: 'SUC_PROV03'    , label: 'Suc. Prov'          , width: 40     , align:'right'   , disable:true , vertical:true},
  { ID: 'COLUM07'       , label: 'Media Venta'        , width: 63     , align:'right'   , disable:true},
  { ID: 'COLUM08'       , label: 'Stock Minimo'       , minWidth: 50  , align:'right'   , disable:true},
  { ID: 'COLUM09'       , label: 'Sug. Stock Minimo'  , width: 68     , align:'right'   , isnumber:true, formatter:'formatoDeCelda'},
  { ID: 'SUC_PROV04'    , label: 'Suc. Prov'          , width: 40     , align:'right'   , disable:true, vertical:true},
  { ID: 'COLUM010'      , label: 'Media Venta'        , width: 63     , align:'right'   , disable:true},
  { ID: 'COLUM011'      , label: 'Stock Minimo'       , minWidth: 50  , align:'right'   , disable:true},
  { ID: 'COLUM012'      , label: 'Sug. Stock Minimo'  , minWidth: 70  , align:'right'   , isnumber:true, formatter:'formatoDeCelda'},
]
const notOrderBy = ['COD_ARTICULO','COD_CATEGORIA','DESC_ARTICULO','COLUM01',
                    'COLUM02','COLUM03','COLUM04','COLUM05',
                    'COLUM06','COLUM07','COLUM08','COLUM09',
                    'COLUM10','COLUM011','COLUM012',
                    'SUC_PROV01','SUC_PROV02','SUC_PROV03',
                    'SUC_PROV04'
                  ]
const FormName             = 'STMETGBI'
const TituloList           = 'Sugestión de Stock Minimo'
const { Title }            = Typography;
// la cantidad de incrementación en la cabecera
const data_limite          = 100
var MODO = 'I';
//Bandera
var bandPost_Cab_Det = true;

const STMETGBI = memo(() => {
    
    const defaultOpenKeys = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
    const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);

    const [ form ] = Form.useForm();
    const grid_det = React.useRef();

    // cerramos toggle 
    sessionStorage.setItem("toggle-right", "hide");

    //----------------------useSatate---------------------------------
    const [activarSpinner   , setActivarSpinner    ] = React.useState(true);
    const [bloqueoButton    , setBloqueoButton     ] = React.useState(false);
    const [IsInputBloqued   , setIsInputBloqued    ] = React.useState(false);
    const [isRadioBloqued   , setIsRadioBloqued    ] = React.useState(false);
    const [Data             , setData              ] = React.useState([]);
    //-----------------------Estado Modal mensaje ---------------------
    const [showMessageButton , setShowMessageButton] = React.useState(false)
    const [visibleMensaje	   , setVisibleMensaje   ] = React.useState(false);
    const [mensaje			     , setMensaje	         ] = React.useState();
    const [imagen			       , setImagen		       ] = React.useState();
    const [tituloModal		   , setTituloModal	     ] = React.useState();

    const showModalMensaje = (titulo, imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    };
    const buttonSaveRef = React.useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys('F7', (e) => {
      e.preventDefault();
    });
    Main.useHotkeys('F8', (e) => {
      e.preventDefault();
    });
    React.useEffect(()=>{
        setActivarSpinner(false)
        setTimeout( ()=>{
            initialFormData();
        },10);
    },[])
      // ESTADO DEL FORMULARIO
    const EstadoFormulario = async (value, line) => {
        if(value === 'I'){
          if(bloqueoButton)setBloqueoButton(false);
          setbandBloqueoGrid(true);
          setIsInputBloqued(false);
          setIsRadioBloqued(false)
        }else{
          if(line[getIndice()]?.ESTADO == 'P'){
            setIsInputBloqued(true);
            setBloqueoButton(true);
            setIsRadioBloqued(false)
          }else{
            setIsInputBloqued(true);
            setIsRadioBloqued(true)
            if(!bloqueoButton)setBloqueoButton(true);
          }
        }
    }
    const initialFormData = async()=>{
        var newKey = uuidID();
        var valor = {
          ['ID'               ]: newKey,
          ['COD_EMPRESA'      ]: sessionStorage.getItem('cod_empresa'),        
          ['DESC_SUCURSAL'    ]: sessionStorage.getItem('desc_sucursal'),
          ['COD_USUARIO'      ]: sessionStorage.getItem('cod_usuario'),
          ['ESTADO'           ]: 'P',
          ['ESTADO_ANT'       ]: 'P',
          ['FECHA_FORMT'      ]: Main.moment().format('DD/MM/YYYY'),
          ['COD_UNDAD_MEDIDA' ]: '',
          ['DESC_UNDAD_MEDIDA']: '',
          ['DESC_CATEGORIA'   ]: '',
          ['insertedDefault'  ]: true,
        }
        setData([valor]);
        cancelar_Stmetgbi_det = JSON.stringify([valor]);
        cancelar_Stmetgbi_cab = JSON.stringify([valor]);
        form.setFieldsValue(valor);
        MODO = 'I';
        EstadoFormulario('I');
        document.getElementById('FECHA_FORMT').focus();
        document.getElementById('FECHA_FORMT').select();
        setTimeout( ()=> {
          var content = [{
            ID	            : newKey,
            idCabecera      : newKey,
            InsertDefault   : true,
            IDCOMPONENTE    : "GRID_STMETGBI",
          }];
          const dataSource = new DataSource({
            store: new ArrayStore({
              data: content,
            }),
            key: 'ID'
          })
          grid_det.current.instance.option('dataSource', dataSource);
        },300);
        document.getElementById("indice").textContent = "1";
        document.getElementById("total_registro").textContent = "1";
        document.getElementById("mensaje").textContent = "";
        setbandBloqueoGrid(false);
    }
    const clearForm = async() =>{
        Main.setModifico(FormName);        
        var newKey = uuidID();
        form.resetFields();
        let valor = {
          ['ID'               ]: newKey,
          ['COD_EMPRESA'      ]: sessionStorage.getItem('cod_empresa'),
          ['COD_USUARIO'      ]: sessionStorage.getItem('cod_usuario'),
          ['FECHA_FORMT'      ]: '',
          ['NRO_REGISTRO'     ]: '',
          ['COD_UNDAD_MEDIDA' ]: '',
          ['DESC_UNDAD_MEDIDA']: '',
          ['DESC_CATEGORIA'   ]: '',
        }
        form.setFieldsValue(valor);
        const content = [{
          ID           : uuidID(),
          idCabecera   : newKey,
          COD_EMPRESA  : sessionStorage.getItem('cod_empresa'),
          InsertDefault: true,
        }]
        const dataSource = new DataSource({
          store: new ArrayStore({
            data: content,
          }),
          key: 'ID'
        });
          grid_det.current.instance.option('dataSource', dataSource);
        setTimeout(() => {
          grid_det.current.instance.option("focusedRowIndex",0)
          document.getElementById("total_registro").textContent = "1";
          document.getElementById("indice").textContent         = "1"
        },200);
        QuitarClaseRequerido();
        // limpiarArrayDelete();
        setbandBloqueoGrid(false)
    }
    const setLoadForm = (data) => {
        form.setFieldsValue(data[getIndice()]);
        getDataDet(data[getIndice()]);
    }
    const getDataCab = async(valor)=>{
        setActivarSpinner(true);
        try {
          var data
          if(valor !== undefined) data = valor
          else data = { COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
                        COD_USUARIO: sessionStorage.getItem('cod_usuario'),
                        INDICE: 0,
                        LIMITE: data_limite,
                        NRO_REGISTRO: form.getFieldValue('NRO_REGISTRO') != undefined ? form.getFieldValue('NRO_REGISTRO') : '',
                        ESTADO: form.getFieldValue('ESTADO') !== undefined ? form.getFieldValue('ESTADO') : '',
                        FECHA : form.getFieldValue('FECHA_FORMT') != undefined ? form.getFieldValue('FECHA_FORMT') : '',
                       };
            return await Main.Request(url_cabecera, "POST", data).then((resp) => {
            let response = resp.data.response.rows;
            if (response.length > 0) {
                    // console.table(response);
                    document.getElementById("total_registro").textContent = response.length;
                    setData(response);
                    cancelar_Stmetgbi_cab = JSON.stringify(response);
                    MODO = 'U';
                    setIndice(0);
                    setLoadForm(response);
                    setLongitud(response.length);
                    EstadoFormulario('U',response);
                    // setActivarSpinner(false);
                    return response;
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
    const AddForm = async ()=>{
      if(!getBloqueoCabecera()){
        EstadoFormulario('I');
        clearForm();
        setData([{
          ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
          ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
          ['insertedDefault']: true,
        }])
        setIndice(0);
        setTimeout(()=>document.getElementById('NRO_REGISTRO').focus(),200)
      }else{
        setShowMessageButton(true)
        showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }
    }
    const guardar = async ()=>{      
      setVisibleMensaje(false);
      setActivarSpinner(true);      
      var datosDet  = [];
      var datosCab  = [];
      var auxDataCab = JSON.parse(getCancelar_Stmetgbi_cab());
      
      if(auxDataCab.length > 0){
        if(MODO == 'U' && auxDataCab[getIndice()].ESTADO !== Data[getIndice()].ESTADO){
          datosCab.push(Data[getIndice()])
        }
        // if(MODO == 'I' && auxDataCab[getIndice()].ESTADO !== Data[getIndice()].ESTADO){
        //   datosCab.push(Data[getIndice()])
        // }
      }

      if(grid_det.current !== undefined){
        let filterExpr      = grid_det.current.instance.getCombinedFilter();
        let gridDataSource  = grid_det.current.instance.getDataSource();
        let gridLoadOptions = gridDataSource.loadOptions();
        gridDataSource.store().load({filter: filterExpr, sort:gridLoadOptions.sort}).then((res)=>{
          datosDet = res;
        });
      }
      grid_det.current.instance.saveEditData();
      var rowsDelete = []
      
      var auxDataDet = JSON.parse(getCancelar_Stmetgbi_det());
      var contentDet   = await Main.GeneraUpdateInsertCab(datosDet,[],Data,[],"NRO_REGISTRO");
      //  = ArrayPushDelete.TIPOCARTERA != undefined ? ArrayPushDelete.TIPOCARTERA : [];
      datosDet = contentDet.updateInsert
      var info = [{"cod_usuario": sessionStorage.getItem('cod_usuario'),"cod_empresa":sessionStorage.getItem('cod_empresa')}]
      var data = { datosDet, auxDataDet, datosCab ,auxDataCab,info }

      if(datosDet.length > 0 || datosCab.length > 0){
        try { 
          let method = "POST"
          let url    = '/st/stmetgbi/update';
          await Main.Request( url, method, data).then(async(resp) => {
            if(resp.data.ret == 1){
              Main.message.success({
                content  : `Procesado correctamente!!`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                marginTop: '4vh',
                },
              });
              cancelar_Stmetgbi_det = JSON.stringify(contentDet.rowsAux);
              cancelar_Stmetgbi_cab = JSON.stringify(Data[getIndice()]);
              const dataSource = new DataSource({
                store: new ArrayStore({
                  data: contentDet.rowsAux,
                }),
                key: 'ID'
              })
              grid_det.current.instance.option('dataSource', dataSource);
              Main.setModifico(FormName);
              
              // setData([]);

              setIsInputBloqued(true);
              setIsRadioBloqued(true)
              setBloqueoButton(true);

              setTimeout(()=>{
                document.getElementById('FECHA_FORMT').focus();
                setBloqueoCabecera(false)  
              },20)
            }else{
              showModalMensaje('¡Atención!','alerta', resp.data.p_mensaje);  
            }
          });
          setActivarSpinner(false);
        } catch (error) {
          setActivarSpinner(false);
          console.log(`${FormName} -`,error)
        }
      }else{
        Main.setModifico(FormName);
        setBloqueoCabecera(false)
        Main.message.info({
          content  : `No encontramos cambios para guardar`,
          className: 'custom-class',
          duration : `${2}`,
          style    : {
            marginTop: '2vh',
          },
        });
        setTimeout(()=>{
          setActivarSpinner(false);
          document.getElementById('FECHA_FORMT').focus();
        },5)
      }
    }
    const funcionCancelar = async (filaIndex)=>{
      // limpiarArrayDelete();
      setActivarSpinner(true);
      Main.setModifico(FormName);
      setBloqueoCabecera(false);
      if(MODO == 'I'){
        clearForm();
        setTimeout( ()=>{
          setActivarSpinner(false);
          initialFormData();
        },150 )
      }else{
        setData( JSON.parse(getCancelar_Stmetgbi_cab()) );
        setLoadForm(JSON.parse(getCancelar_Stmetgbi_cab()) );
        setTimeout( ()=>{
          setActivarSpinner(false);
          document.getElementById('NRO_REGISTRO').focus();
        },100 )
      }
        
    }
    const handleCancel = async() => {
		  setVisibleMensaje(false);
        if(showMessageButton){
            funcionCancelar();
      }		
	  };
    const NavigateArrow = async(e)=>{
      switch (e) {
        case "right":
          rightData()
          break;
        case "left":
          leftData()
          break;
        default:
          break;
      }
    }
    const handleEstado = (e) => {
      let valor = Data[getIndice()]
      if(!valor.insertedDefault){
        Main.modifico(FormName);
        Data[getIndice()].ESTADO = form.getFieldValue().ESTADO
        Data[getIndice()].updated = true
      }
    }
    const handleKeyDown = async(e) => {
        
        if(e.keyCode == 118){
          // f7
          e.preventDefault();
          ManejaF7();
          setTimeout( ()=> { document.getElementById(e.target.id).focus() }, 800 );
        }
        if(e.keyCode == 119){
          e.preventDefault();       
          // f8
          if(!getBloqueoCabecera()){
            Main.setModifico(FormName);
            getDataCab();
          }else{
            setShowMessageButton(true)
            showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
          }
        }
        if(e.keyCode == 13 || e.keyCode == 9){
          e.preventDefault();          
          if(e.target.id == 'FECHA_FORMT') document.getElementById('NRO_REGISTRO').focus();
          if(e.target.id == 'NRO_REGISTRO') document.getElementById('FECHA_FORMT').focus();
        }
        if(e.keyCode == 40) e.preventDefault();
        if(e.keyCode == 38) e.preventDefault();
    }
    const ManejaF7 = async() =>{
        if(!getBloqueoCabecera()){
          //  F7
          EstadoFormulario('I');
          clearForm();
          setData([{
            ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
            ['COD_USUARIO']: sessionStorage.getItem('cod_usuario'),
            ['insertedDefault']: true,
          }])
          setIndice(0);
        }else{
          setShowMessageButton(true)
          showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
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
    const rightData = async() => {
        if(!getBloqueoCabecera()){
          if(Data.length !== 1){
            setActivarSpinner(true)
            var index = getIndice() + 1;
            if(index > getLongitud()-1 ){
              index = getLongitud()-1;
              document.getElementById("mensaje").textContent = "Haz llegado al ultimo registro";
              if(bandPost_Cab_Det){
                bandPost_Cab_Det = false;
                let data = {  COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
                              ESTADO: form.getFieldValue('ESTADO') !== undefined ? form.getFieldValue('ESTADO') : '',
                              INDICE: getLongitud() + 1, 
                              LIMITE: getLongitud() + data_limite  
                           }
                await getRecursiveData(data, url_cabecera)
                  .then(resp => {
                    let response = resp.data.response.rows;
                    setLongitud( [ ...Data, ...response ].length );
                    bandPost_Cab_Det = true;
                    document.getElementById("total_registro").textContent = [ ...Data, ...response ].length;                    
                    setData([ ...Data, ...response ]);
                    // --
                    setIndice(index);
                    document.getElementById("indice").textContent = index + 1;
                    setLoadForm(Data);
                    // setActivarSpinner(false);
                    EstadoFormulario('U', Data );
                  })
              }
            }else{
              document.getElementById("mensaje").textContent = "";
              await getDataDet(Data[index]).then( resp => {
                document.getElementById("indice").textContent = index + 1;
                form.setFieldsValue(Data[index]);
                setIndice(index);
                EstadoFormulario('U', Data );
              })

             

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
    const getRecursiveData = async (data, url) => {
		try {
			return await Main.Request(url, "POST", data)
		} catch (error) {
			console.log(error);
      return [];
		}
	  };
    const leftData = async() => {
        if(!getBloqueoCabecera()){
          var index = Indice - 1;
          if(index < 0){
            index = 0;
            let valor = document.getElementById("mensaje");
            if(valor.textContent == " ")setLoadForm(Data)
            document.getElementById("mensaje").textContent = "Haz llegado al primer registro";
          }else{
            document.getElementById("mensaje").textContent = " ";
            setLoadForm(Data);
          }
          setIndice(index);
          document.getElementById("indice").textContent = index + 1;
          EstadoFormulario('U', Data);
          QuitarClaseRequerido();
        }else{
          setShowMessageButton(true)
          showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
        }
    }
    const getDataDet = async(data) => {
      try {
        if(activarSpinner) return
        setActivarSpinner(true);
        await Main.Request(url_detalle,'POST',{
          cod_empresa  : sessionStorage.getItem("cod_empresa"),
          nro_registro : data.NRO_REGISTRO,
        }).then(async(resp)=>{
          const { rows } = resp.data;
          var valor = rows;

          // console.log( data.NRO_REGISTRO , '==> ', valor);
    
          if(rows?.length === 0){
            let newKey = uuidID();
            form.setFieldsValue({
              ...form.getFieldsValue(),
              ['COD_UNDAD_MEDIDA' ]: '',
              ['DESC_UNDAD_MEDIDA']: '',
              ['DESC_CATEGORIA'   ]: '',
              ['FECHA_FORMT'      ]: '',
            })
    
            valor = [{
              ID	            : newKey,
              idCabecera      : data.NRO_REGISTRO ? data.NRO_REGISTRO : Data[getIndice()].ID,
              InsertDefault   : true,
              IDCOMPONENTE    : "GRID_STMETGBI",
            }]
          }
          cancelar_Stmetgbi_det = JSON.stringify(valor);
          const dataSource = new DataSource({
            store: new ArrayStore({
              data: valor,
            }),
            key: 'ID'
          })
          await grid_det.current.instance.option('dataSource', dataSource);
          setActivarSpinner(false);
          setTimeout(()=>{
            grid_det.current.instance.pageIndex(0);
            grid_det.current.instance.option("focusedRowIndex",0);
          },45);
          console.log('ahora libero =>', data.NRO_REGISTRO);
          return valor;
        });
      } catch (error) {
        setActivarSpinner(false)
        console.log(error)
      }

    }
    const setRowFocusDet = async(e,grid,f9)=>{
      if(e.row != undefined){
        form.setFieldsValue({
          ...form.getFieldsValue(),
          ['COD_UNIDAD_MEDIDA'  ] : e.row.data.COD_UNIDAD_MEDIDA,
          ['DESC_UNIDAD_MEDIDA' ] : e.row.data.DESC_UNIDAD_MEDIDA,
          ['DESC_CATEGORIA'     ] : e.row.data.DESC_CATEGORIA,
        })
      }else if(f9){
        form.setFieldsValue({
          ...form.getFieldsValue(),
          ['COD_UNIDAD_MEDIDA' ] : e.COD_UNIDAD_MEDIDA,
          ['DESC_UNIDAD_MEDIDA'] : e.DESC_UNIDAD_MEDIDA,
          ['DESC_CATEGORIA'    ] : e.DESC_CATEGORIA,
        })
      }
    }
    const handleInputChange = (e) =>{
      Main.modifico(FormName);
      Data[getIndice()][e.target.id] = e.target.value;      
      if(!Data[getIndice()]['updated'] && !Data[getIndice()]['inserted']){
        Data[getIndice()]['updated'] = true;
      }
    }
    const setUpdateValue = async()=>{
      Main.modifico(FormName)
    }
    const get_sug_st_min = async()=>{
      setActivarSpinner(true)
      try {
        var url_post = '/st/stmetgbi/post_sug_st_min';
        let data     = Data[getIndice()];
        var row = { COD_EMPRESA  : sessionStorage.getItem("cod_empresa"),
                    NRO_REGISTRO : data.NRO_REGISTRO,
                    FECHA        : data.FECHA_FORMT,
                    ESTADO       : 'P',
                    INDICE       : 0,
                    LIMITE       : data_limite,
                  }
        await Main.Request(url_post,'POST',row).then((resp)=>{
          if(resp.data.outBinds.ret == 1){
            row.NRO_REGISTRO = resp.data.outBinds.NRO_REGISTRO
            getDataCab(row).then((resp)=>{
              if(resp.length > 0){
                console.log(resp);
                  Main.message.success({
                  content  : `Procesado correctamente!!`,
                  className: 'custom-class',
                  duration : `${2}`,
                  style    : {
                  marginTop: '4vh',
                  },
                });
                Main.setModifico(FormName);
              }
          })          
          }else if(resp.data.outBinds){
            showModalMensaje('¡Atención!','alerta', resp.data.outBinds.p_mensaje);  
          }else{
            showModalMensaje('¡Atención!','alerta', resp.data.p_mensaje);  
          }
        });
        setActivarSpinner(false);
      } catch (error) {
        console.log(error)
        setActivarSpinner(false)
      }      
    }
    const cellRender=(e,column)=>{
            
      switch (column.formatter) {
        case "formatoDeCelda":

          // -- SUCURSAL 01 --
          if(column.ID == 'COLUM03'){
            
            var valor
            if( 
                e.data['COLUM01'] > 0 && 
                e.data['COLUM02'] < e.data['COLUM01'] 
              ){
                valor = Math.abs( ( 1 - (e.data['COLUM02'] / e.data['COLUM01']) ) * 100 );
            }else if( 
                e.data['COLUM02'] > 0 && 
                e.data['COLUM01'] <  e.data['COLUM02']
              ){
                valor = Math.abs( ( 1 - (e.data['COLUM01'] / e.data['COLUM02']) ) * 100 );
            }else{
              valor = 0;
            }
            if(valor > 50){
              return <div style={{color:'rgb(255 0 0)'}}>{e.data[column.ID]}</div>;
            }else{
              return <div >{e.data[column.ID]}</div>;
            }

            // -- SUCURSAL 02 --
          }else if(column.ID == 'COLUM06'){

            let valor
            if( 
                e.data['COLUM04'] > 0 && 
                e.data['COLUM05'] < e.data['COLUM04'] 
              ){
                valor = Math.abs( ( 1 - (e.data['COLUM05'] / e.data['COLUM04']) ) * 100 );
            }else if( 
                e.data['COLUM05'] > 0 && 
                e.data['COLUM04'] <  e.data['COLUM05']
              ){
                valor = Math.abs( ( 1 - (e.data['COLUM04'] / e.data['COLUM05']) ) * 100 );
            }else{
              valor = 0;
            }
            if(valor > 50){
              return <div style={{color:'rgb(255 0 0)'}}>{e.data[column.ID]}</div>;
            }else{
              return <div >{e.data[column.ID]}</div>;
            }

            // -- SUCURSAL 03 --
          }else if(column.ID == 'COLUM09'){

            let valor
            if( 
                e.data['COLUM07'] > 0 && 
                e.data['COLUM08'] < e.data['COLUM07'] 
              ){
                valor = Math.abs( ( 1 - (e.data['COLUM08'] / e.data['COLUM07']) ) * 100 );
            }else if( 
                e.data['COLUM08'] > 0 && 
                e.data['COLUM07'] <  e.data['COLUM08']
              ){
                valor = Math.abs( ( 1 - (e.data['COLUM07'] / e.data['COLUM08']) ) * 100 );
            }else{
              valor = 0;
            }
            if(valor > 50){
              return <div style={{color:'rgb(255 0 0)'}}>{e.data[column.ID]}</div>;
            }else{
              return <div >{e.data[column.ID]}</div>;
            }

            // -- SUCURSAL 04 --
          }else if(column.ID == 'COLUM012'){
            
            let valor
            if( 
                e.data['COLUM010'] > 0 && 
                e.data['COLUM011'] < e.data['COLUM010'] 
              ){
                valor = Math.abs( ( 1 - (e.data['COLUM011'] / e.data['COLUM010']) ) * 100 );
            }else if( 
                e.data['COLUM011'] > 0 && 
                e.data['COLUM010'] <  e.data['COLUM011']
              ){
                valor = Math.abs( ( 1 - (e.data['COLUM010'] / e.data['COLUM011']) ) * 100 );
            }else{
              valor = 0;
            }
            if(valor > 50){
              return <div style={{color:'rgb(255 0 0)'}}>{e.data[column.ID]}</div>;
            }else{
              return <div >{e.data[column.ID]}</div>;
            }

          }else{
            return <div >{e.data[column.ID]}</div>;
          }
        break;
        default:
          if(e.data.InsertDefault){
            return <div>{e.data[column.ID]}</div>
          }else{
            return <div>{e.data[column.ID]}</div>
          }
      }      
    }

    

    return (
        <>
        	<Main.ModalDialogo
            positiveButton={showMessageButton ? "SI" : ""  }
            negativeButton={showMessageButton ? "NO" : "OK"}
            positiveAction={showMessageButton ? guardar : null}
            negativeAction={handleCancel}
            onClose={handleCancel}
            setShow={visibleMensaje}
            title={tituloModal}
            imagen={imagen}
            mensaje={mensaje}
          />
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                
                <Main.Spin size="large" spinning={activarSpinner} >

                <div className="paper-container">
                  <Main.Paper className="paper-style">
                    <div className="paper-header">
                        <Title level={5} className="title-color">
                            {TituloList}
                            <div>
                                <Title level={4} style={{ float: 'right', marginTop: '-16px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</Title>
                            </div>
                        </Title>
                    </div>
                      <Main.HeaderMenu
                        AddForm={AddForm}
                        SaveForm={guardar}
                        // deleteRows={deleteRows}
                        vdelete={false}
                        cancelar={funcionCancelar}
                        NavigateArrow={NavigateArrow}
                        formName={FormName}
                        buttonSaveRef={buttonSaveRef}
                      />                    
                      <Form size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px'}}>
                        <Row gutter={[8]}>
                            <Col span={4}>
                                <Form.Item label={<label style={{width:'65px'}}>Fecha</label>} name="FECHA_FORMT">
                                <Input autoComplete="off" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} readOnly={IsInputBloqued}
                                  onChange={handleInputChange}
                                />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label={<label style={{width:'65px'}}>Registro</label>} name="NRO_REGISTRO">
                                <Input style={{textAlign:'right'}} autoComplete="off" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} 
                                  readOnly={IsInputBloqued} onChange={handleInputChange}
                                />
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item label={<label style={{width:'65px'}}>Estado</label>} name="ESTADO" onChange={handleEstado}>
                                    <Radio.Group>
                                        <Radio 
                                            value="P"
                                            onKeyDown={ handleKeyDown }
                                            disabled={ isRadioBloqued }
                                            onKeyUp={handleKeyUp}
                                        >
                                            Pendiente
                                        </Radio>
                                        <Radio 
                                            value="C"
                                            onKeyDown={ handleKeyDown }
                                            disabled={ isRadioBloqued }
                                            onKeyUp={handleKeyUp}
                                        >
                                            Cerrado
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Row gutter={[8]}>
                                  <Col style={{marginLeft:'10px'}} span={8}>
                                    <Button className='BUTTOM_STMETGB' onClick={get_sug_st_min} disabled={bloqueoButton}>
                                        Sugestión Stock Minimo
                                    </Button>
                                  </Col>
                              </Row>
                                
                            </Col>
                        </Row>
                        <Row style={{marginBottom:'10px',marginTop:'6px'}}>
                          <Col span={24}>
                           {/* <TestDetalle 
                              gridDet={grid_det}
                              columns={columnsListarDet}
                              page={10}
                              cellRender={cellRender}
                           /> */}
                            <DevExtremeDet
                                gridDet={grid_det}
                                id="GRID_STMETGBI"
                                IDCOMPONENTE="GRID_STMETGBI"
                                columnDet={columnsListarDet}
                                notOrderByAccion={notOrderBy}												
                                FormName={FormName}
                                guardar={guardar}                                
                                columnModal={columnModal}
                                deleteDisable={false}
                                activateF10={false}
                                newAddRow={false}
                                canDelete={false}
                                setActivarSpinner={setActivarSpinner}
                                altura={'400px'}
                                setRowFocusDet={setRowFocusDet}
                                smallHead={true}
                                heightHeaderClass={true}
                                setUpdateValue={setUpdateValue}
                                page={10}
                                buscadorGrid={true}
                                cellRender={cellRender}
                              />
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Row>
                              <Col style={{marginBottom:'2px'}} span={8}>
                                <Form.Item label={<label style={{width:'40px'}}>U.M.</label>}>
                                  <Form.Item name="COD_UNIDAD_MEDIDA" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                    <Input className="search_input"  disabled />
                                  </Form.Item>
                                  <Form.Item name="DESC_UNIDAD_MEDIDA" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                    <Input disabled/>
                                  </Form.Item>
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row>
                              <Col style={{marginBottom:'2px'}} span={8}>
                                <Form.Item label={<label style={{width:'40px'}}>Cat.</label>}>
                                  <Form.Item name="DESC_CATEGORIA" style={{width:'100%', display:'inline-block'}}>
                                    <Input style={{display:'inline-block'}} disabled/>
                                  </Form.Item>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form>
                      <Row style={{padding:'0px 0px 7px 11px'}}>
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

export default STMETGBI;