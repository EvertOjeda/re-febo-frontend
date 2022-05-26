import React, { useState, useRef, memo, useEffect } from 'react';
import Main            from '../../../../../../components/utils/Main';
import _, { defaults }                             from "underscore";
import { Input, Row, Col, Form, Card, Grid, Typography, Select, Alert, DatePicker, Tabs }  from 'antd';
import Search                        from '../../../../../../components/utils/SearchForm/SearchForm';
import {setModifico,modifico}        from '../../../../../../components/utils/SearchForm/Cancelar';

import { Menu, DireccionMenu }       from '../../../../../../components/utils/FocusDelMenu';
import DataSource                    from "devextreme/data/data_source";
import ArrayStore                    from "devextreme/data/array_store";
import { v4 as uuidID }              from "uuid";

import DevExtremeDet,{ getFocusGlobalEventDet , getComponenteEliminarDet , ArrayPushHedSeled ,
                             getFocusedColumnName   , getRowIndex , getComponenteFocusDet}
                    from '../../../../../../components/utils/DevExtremeGrid/DevExtremeDet';

import '../../../../../../assets/css/DevExtreme.css';


const columnsListar = [  
    { ID: 'NRO_DOCUMENTO'           , label: 'Nro documento'          , width: 70     , align:'center'    , requerido:true},
    { ID: 'NOMBRE'                  , label: 'Nombre y Apellido'      , width: 100    , align:'left'      , requerido:true},
    { ID: 'ESTADO_CIVIL'            , label: 'Est. civil'             , width: 60     , align:'center'    },
    { ID: 'ZONA_RESIDENCIA'         , label: 'Residencia'             , maxWidth: 125 , minWidth: 120     , align:'left'      },
    { ID: 'CELULAR'                 , label: 'Celular'                , width: 50     , align:'center'    },
    { ID: 'EMAIL'                   , label: 'Email'                  , width: 90     , align:'center'    },
    { ID: 'SUCURSAL'                , label: 'Sucursal'               , width: 100    , align:'center'    },
    { ID: 'IND_VACANCIA_INTERES'    , label: 'Vac de interes'         , width: 80     , align:'center'    , requerido:true},
    { ID: 'ESTADO'                  , label: 'Estado'                 , width: 80     , align:'center'    , isOpcionSelect:true }
  ];


  
const estado    = {
    ESTADO:  [    
        { ID:'POSTULANTE'   , NAME:'Postulante', isNew:true }, 
        { ID:'ENTREVISTA'   , NAME:'Entrevista' },
        { ID:'CONTRATADO'   , NAME:'Contratado' },
    ],
}


const columBuscador_cab     = 'NOMBRE'  // ['NRO_DOCUMENTO'],
const doNotsearch           = ['NRO_DOCUMENTO','ZONA_RESIDENCIA','EMAIL','NACIONALIDAD','BARRIO','NIVEL_ESTUDIO','IND_ESTUDIA_HORARIO','IND_EX_FUNCIONARIO'
                                ,'IND_EX_FUNCIONARIO_MOT_SAL', 'SUCURSAL']
const notOrderByAccion      = ['NOMBRE','NRO_DOCUMENTO','ZONA_RESIDENCIA','EMAIL','NACIONALIDAD','BARRIO','NIVEL_ESTUDIO','IND_ESTUDIA_HORARIO','IND_EX_FUNCIONARIO'
                                ,'IND_EX_FUNCIONARIO_MOT_SAL', 'SUCURSAL']
const title            = "Lista de postulantes";

const FormName              = 'RHPOSTUL';
const { Title }             = Typography;


var DeleteForm = []
const LimpiarDelete = () =>{
    DeleteForm = [];
}

var cancelar_Cab = '';
const getCancelar_Cab = ()=>{
	return cancelar_Cab;
}
var cancelar_Cont = '';
const getCancelar_Cont = ()=>{
	return cancelar_Cont;
}


const LISTAENTREVISTA = memo((props) => {

    const cod_empresa         = sessionStorage.getItem('cod_empresa');
    const cod_usuario         = sessionStorage.getItem('cod_usuario');

        //URL CABECERA
        const url_getcabecera    = '/rh/rhpostul_ent/';
        //URL ABM
        const url_abm            = '/rh/rhpostul' ;
    ///////////////////////////////////////////////////////////////////////////////
    var banSwitch   = false
    var bandBloqueo = false

    const setBandBloqueo =(e)=>{
        bandBloqueo = e;
    }

    ///////////////////////////////////////////////////////////////////////////////

    const [form]              = Form.useForm();
    const gridCab             = React.useRef();
    const gridDet             = React.useRef();
    const gridCont            = React.useRef();


    const [ activarSpinner   , setActivarSpinner   ] = useState(false);
    const [showMessageButton , setShowMessageButton] = React.useState(false)


    const idGrid = {
        RHPOSTUL_CAB:gridCab,
        RHPOSTUL_DET:gridDet,
        defaultFocus:{
			RHPOSTUL_CAB:1,
            RHPOSTUL_DET:0
        }
    }
       /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

       useEffect ( () => {
        getData();

        setActivarSpinner(false);
    },[])

    const buttonSaveRef   = React.useRef();
    const buttonAddRowRef = React.useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        console.log("guardar")
        e.preventDefault();
        buttonSaveRef.current.click();
    },
    {filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.Nuevo, (e) => {
        e.preventDefault();
        buttonAddRowRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // GET GENERICO
    const getInfo = async (url, method, data) => {
        var content = [];        
        try {
            var info = await Main.Request(url, method, data);
            if (info.data.rows) {
                content = info.data.rows;

            }
            return content;
        }  catch (error) {
            console.log(error);
            }
    };

    const getData = async()=>{
                try {
                    setActivarSpinner(true);
                    var content = await getInfo(url_getcabecera, "GET", []);
                    if(_.isUndefined(content)) content = []
                } catch (error) {
                    console.log(error)
                }finally{
                    setActivarSpinner(false);
                }
                if(content.length == 0){
                    var newKey = uuidID();
                    content = [{
                        ID	          : newKey,
                        COD_EMPRESA   : cod_empresa,
                        InsertDefault : true,
                        COD_USUARIO   : sessionStorage.getItem('cod_usuario'),
                        IDCOMPONENTE  : "RHPOSTUL_CAB",

                    }]
                }
                const dataSource_Cab = new DataSource({
                    store: new ArrayStore({
                        data: content,
                    }),
                    key: 'ID'
                })
                gridCab.current.instance.option('dataSource', dataSource_Cab);
                cancelar_Cab = JSON.stringify(content);
                setTimeout(()=>{
                    gridCab.current.instance.focus(gridCab.current.instance.getCellElement(0,1))
                },100)
            }
            /////////////////////GETDATA PARA DESPUES DE LIMPIAR CUADRO DE BUSQUEDA ////////////////////////////////////////

            const getDataB = async()=>{
                try {
                    setActivarSpinner(true);
                    var content = await getInfo(url_getcabecera, "GET", []);
                    if(_.isUndefined(content)) content = []
                } catch (error) {
                    console.log(error)
                }finally{
                    setActivarSpinner(false);
                }
                if(content.length == 0){
                    var newKey = uuidID();
                    content = [{
                        ID	          : newKey,
                        COD_EMPRESA   : cod_empresa,
                        InsertDefault : true,
                        COD_USUARIO   : sessionStorage.getItem('cod_usuario'),
                        IDCOMPONENTE  : "RHPOSTUL_CAB",

                    }]
                }
                const dataSource_Cab = new DataSource({
                    store: new ArrayStore({
                        data: content,
                    }),
                    key: 'ID'
                })
                gridCab.current.instance.option('dataSource', dataSource_Cab);
                cancelar_Cab = JSON.stringify(content);
                setTimeout(()=>{
                    gridCab.current.instance.focus(gridCab.current.instance.getCellElement())
                },100)
            }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const addRow = async()=>{
        if(!bandBloqueo){
            let idComponent = getComponenteEliminarDet().id
            let indexRow  = getRowIndex()
            if(indexRow == -1) indexRow = 0
            if(idComponent !== 'RHPOSTUL_CAB') indexRow = 0    
            modifico();
            let initialInput = await initialFormData(true)
            let data = gridCab.current.instance.getDataSource();
            var newKey = uuidID();
            var row    = [0]

            row = [{
                ...initialInput,
                ID	          : newKey,
                IDCOMPONENTE  : "RHPOSTUL_CAB",
            }]
            let rows    = data._items;
            let info = rows.concat(rows.splice(indexRow, 0, ...row))

            const dataSource_cab = new DataSource({
                store: new ArrayStore({
                    data: info,
                }),
                key: 'ID'
            });
            gridCab.current.instance.option('dataSource', dataSource_cab);
            setTimeout(()=>{
                gridCab.current.instance.focus(gridCab.current.instance.getCellElement(indexRow,1))
            },110)
        }else{
            gridCab.current.instance.option("focusedRowKey", 120);
            gridCab.current.instance.clearSelection();
            gridCab.current.instance.focus(0);
            setShowMessageButton(true);
            showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
        }

    }
     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        
     const initialFormData = async(isNew)=>{

        
        var valor = {
    
            ['NRO_DOCUMENTO'                ] : '',
            ['NOMBRE'                       ] : '',
            ['SEXO'                         ] : 'Masculino',
            ['ESTADO_CIVIL'                 ] : '',
            ['ZONA_RESIDENCIA'              ] : '',
            ['CELULAR'                      ] : '',
            ['EMAIL'                        ] : '',
            ['SUCURSAL'                     ] : '',
            ['IND_VACANCIA_INTERES'         ] : '',
            ['ESTADO'                       ] : 'ENTREVISTA',
            ['CONTRATADO'                   ] : 'N',
            
            ['APTITUDES'                    ] : '',
            ['PRETENCION_SALARIAL'          ] : '',
            ['NACIONALIDAD'                 ] : '',
            ['IND_TIENE_HIJO'               ] : '',
            ['DIRECCION'                    ] : '',
            ['BARRIO'                       ] : '',      
            ['IND_HORARIO_ROTATIVO'         ] : '',
            ['TELEFONO'                     ] : '',
            ['NIVEL_ESTUDIO'                ] : '',
            ['IND_ESTUDIA'                  ] : '',
            ['IND_ESTUDIA_HORARIO'          ] : '',
            ['IND_TIPO_MOVILIDAD'           ] : '',
            ['IND_MOVILIDAD_PROPIA'         ] : '',
            ['IND_MOTIVO_SALIDA'            ] : '',
            ['IND_EX_FUNCIONARIO'           ] : '',
            ['IND_EX_FUNCIONARIO_MOT_SAL'   ] : '',
            ['IND_TRABAJA'                  ] : '',
            ['MEDIO_CON_OFERTA_LABORAL'     ] : '',
    
            ['EXPERIENCIA_LABORAL'          ] : '',
            
        }        
        if(isNew){
            valor = 
             {...valor,
                ['inserted'                 ] :true,
                ['APTITUDES'                    ] : '',
                ['PRETENCION_SALARIAL'          ] : '',
                ['NACIONALIDAD'                 ] : '',
                ['IND_TIENE_HIJO'               ] : 'NO',
                ['DIRECCION'                    ] : '',
                ['BARRIO'                       ] : '',
                ['IND_HORARIO_ROTATIVO'         ] : 'NO',
                ['TELEFONO'                     ] : '',
                ['NIVEL_ESTUDIO'                ] : '',
                ['IND_ESTUDIA'                  ] : 'NO',
                ['IND_ESTUDIA_HORARIO'          ] : '',
                ['IND_TIPO_MOVILIDAD'           ] : '',
                ['IND_MOVILIDAD_PROPIA'         ] : 'NO',
                ['IND_MOTIVO_SALIDA'            ] : '',
                ['IND_EX_FUNCIONARIO'           ] : 'NO',
                ['IND_EX_FUNCIONARIO_MOT_SAL'   ] : '',
                ['IND_TRABAJA'                  ] : 'NO',
                ['MEDIO_CON_OFERTA_LABORAL'     ] : '',
    
                ['EXPERIENCIA_LABORAL'          ] : '',
            }
            return valor
        }else{
            valor.insertDefault = true
            form.setFieldsValue(valor);
        };
    
        
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const deleteRows = async()=>{
        const componente = await getComponenteEliminarDet();
        componente.id = 'RHPOSTUL_CAB';
        console.log("Componente ==> ",componente)
        if(componente.delete){
            let indexRow =  await getRowIndex();
            if(indexRow == -1) indexRow = 0
            console.log(" esto es componete ==> ",componente)
            let data    = idGrid[componente.id].current.instance.getDataSource()._items
            // console.log('idGrid[componete.id].current ==> ', idGrid[componete.id].current)
            let info    = data[indexRow]
            
            if(_.isUndefined(info) || (_.isUndefined(info.inserted) && _.isUndefined(info.InsertDefault))){
                modifico();
    
                var nameColumn = await getFocusedColumnName()
                var comunIndex = idGrid[componente.id].current.instance.getCellElement(indexRow,nameColumn).cellIndex;
                if (comunIndex == -1) comunIndex = 0;
    
                if(DeleteForm[componente.id] !== undefined){
                    DeleteForm[componente.id] = _.union(DeleteForm[componente.id], [info]);
                }else if(DeleteForm.length > 0){
    
                    DeleteForm[componente.id] = [info];
    
                }else if(DeleteForm.length == 0){
                    
                    DeleteForm[componente.id] = [info];
                }
                if(indexRow == -1) indexRow = 0
    
                idGrid[componente.id].current.instance.deleteRow(indexRow);
                idGrid[componente.id].current.instance.repaintRows([indexRow]);
            }else{
                idGrid[componente.id].current.instance.deleteRow(indexRow);
                idGrid[componente.id].current.instance.repaintRows([indexRow]);
            }
            setTimeout(()=>{
                indexRow = indexRow - 1;
                idGrid[componente.id].current.instance.focus(idGrid[componente.id].current.instance.getCellElement(indexRow == -1 ? 0 : indexRow ,idGrid.defaultFocus[componente.id]))
            },50);
        }
        }


    const funcionCancelar =async()=>{
            setActivarSpinner(true)
            var e = getFocusGlobalEventDet();
            if(getCancelar_Cab()){
                var AuxDataCancelCab = await JSON.parse(await getCancelar_Cab());
    
                if(AuxDataCancelCab.length > 0 && gridCab.current){
                    const dataSource_cab = new DataSource({
                        store: new ArrayStore({
                              keyExpr:"ID",
                              data: AuxDataCancelCab
                        }),
                        key: 'ID'
                    })
                    gridCab.current.instance.option('dataSource', dataSource_cab);
                    cancelar_Cab = JSON.stringify(AuxDataCancelCab);
                    // setInputData(e.row.data);
                    // console.log('esto es erowdata =>', e.row.data)              
                }
            }
            if(getCancelar_Cont()){
                var AuxDataCancelCont = await JSON.parse(await getCancelar_Cont());
                if(AuxDataCancelCont.length > 0 && gridCont.current){
                    const dataSource_cont = new DataSource({
                        store: new ArrayStore({
                              keyExpr:"ID",
                              data: AuxDataCancelCont
                        }),
                        key: 'ID'
                    })
                    gridCont.current.instance.option('dataSource', dataSource_cont);
                    cancelar_Cont = JSON.stringify(AuxDataCancelCont);
                }
            }
            // LimpiarDelete();
            // QuitarClaseRequerido();
            banSwitch = false;
            setBandBloqueo(false);
            setShowMessageButton(false)
            setTimeout(()=>{
                setModifico();
                setActivarSpinner(false)
                gridCab.current.instance.focus(gridCab.current.instance.getCellElement(0,1));
    
            },50);
        }


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const guardar = async(e)=>{

        setActivarSpinner(true);
        // GENERAMOS EL PK AUTOMATICO
        var datosCab    = gridCab.current.instance.getDataSource()._items;
        console.log("datosCab ====>> ",datosCab);
        var info_cab = await Main.GeneraUpdateInsertCab(datosCab,'', '', [],false);
                                                        // rows, key, url ,updateDependencia,autoCodigo,cod_Not_null
    
        var aux_cab             = info_cab.rowsAux;
        var update_insert_cab   = info_cab.updateInsert;
        var delete_cab          = DeleteForm.RHPOSTUL_CAB != undefined ? DeleteForm.RHPOSTUL_CAB : [];
        // console.log("delete_cab ===> ", delete_cab)
        console.log("update ===> ", update_insert_cab)
        let valorAuxiliar_cab  = getCancelar_Cab()  !== '' ? JSON.parse(getCancelar_Cab())  : [];
        var data = {
            // Cabecera
                update_insert_cab,  delete_cab, valorAuxiliar_cab ,
            // Adicional
            "cod_usuario": sessionStorage.getItem('cod_usuario'),
            "cod_empresa": sessionStorage.getItem('cod_empresa')
        }
        console.log("insert_cab.length ===>>> ",update_insert_cab.length, "delete_cab.length ===>>> ",delete_cab.length )
    
        if(update_insert_cab.length > 0){
            for (let i = 0; i < update_insert_cab.length; i++) {
                const items = update_insert_cab[i];
                if(items.FEC_NACIMIENTO !== '' && !_.isUndefined(items.FEC_NACIMIENTO)){
                    let fecha = Main.moment(items.FEC_NACIMIENTO).format('DD/MM/YYYY')
                    if(fecha !== 'Invalid date') items.FEC_NACIMIENTO = fecha;
                }
            }
        }
    
    
    
        if(update_insert_cab.length > 0 || delete_cab.length > 0  ){
              try{
                  var method = "POST"
                  await Main.Request( url_abm, method, data).then(async(response) => {
                      var resp = response.data;
                      console.log("ESTO ES RESPONSE ===>>> ",response)
                    //   console.log("ESTO ES RESP ==>> ", resp.ret);
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
                          setModifico();
    
                          var dataSource = '';
                          if(gridCab.current != undefined){
                              dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_cab}), key:'ID'})
                              gridCab.current.instance.option('dataSource', dataSource);
                          }
                          cancelar_Cab =  JSON.stringify(aux_cab);
    
                          // ---------------------------------------------
                          if(gridCont.current != undefined){
                              dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_cont}), key:'ID'})
                              gridCont.current.instance.option('dataSource', dataSource);
                          }
                          cancelar_Cab =  JSON.stringify(aux_cab);
    
                          setShowMessageButton(false)
                          banSwitch = false;
                          setTimeout(()=>{
                              // RHPOSTUL_CAB
                              let info = getComponenteFocusDet()
                              let fila = info.RHPOSTUL_CAB.rowIndex ? info.RHPOSTUL_CAB.rowIndex : 0
                              gridCab.current.instance.focus(gridCab.current.instance.getCellElement(fila,1))
                          },60);
                      }else{
                          setActivarSpinner(false);
                        //   Alert('Atencion!','atencion',`${response.data.p_mensaje}`);
                          console.log("ENTRO EN EL ELSE!!")
                      }
                  });
              } catch (error) {
                  console.log("Error en la funcion de Guardar!",error);
              }
              setActivarSpinner(false);
          }else{
              setModifico();
              setActivarSpinner(false);
              Main.message.info({
                  content  : `No encontramos cambios para guardar`,
                  className: 'custom-class',
                  duration : `${2}`,
                  style    : {
                      marginTop: '2vh',
                  },
              });
          }
    
          setActivarSpinner(false);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleChange = async(e)=>{
        var BuscadorRow = []
        var value = e.target.value;
        if(value.trim() == '') value = 'null'
        var url   = '/rh/rhpostul/search'
        if(value == 'null'){
            const index = await ArrayPushHedSeled.indexOf(undefined);
            if (index > -1) {
            ArrayPushHedSeled.splice(index, 1); 
            }

            try {
                var method         = "POST";
                const cod_empresa  = sessionStorage.getItem('cod_empresa');        
                await Main.Request(url,method,{'value':value, 'cod_empresa': cod_empresa, filter:ArrayPushHedSeled })
                    .then( response =>{
                        if( response.status == 200 ){
                        BuscadorRow = new DataSource({
                            store: new ArrayStore({
                                data: response.data.rows,
                            }),
                            key: 'ID'
                        }) 
                        gridCab.current.instance.option('dataSource', BuscadorRow);
                        cancelar_Cab = JSON.stringify(response.data.rows);
                        }
                    setTimeout(()=>{
                        gridCab.current.instance.option('focusedRowIndex', 0);
                    },70)
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const onKeyDownBuscar = async(e)=>{
        var BuscadorRow = []
        var value = e.target.value;
        // console.log("esto es valueTrim ===>> ",value.trim())
        if(value.trim() == ''){
            // value = 'null'
            getDataB();
        }
    
        var url   = '/rh/rhpostul/search'
        if(e.keyCode == 13){
    
                const index = await ArrayPushHedSeled.indexOf(undefined);
                if (index > -1) {
                ArrayPushHedSeled.splice(index, 1); 
                }
    
                try {
                    var method         = "POST";
                    const cod_empresa  = sessionStorage.getItem('cod_empresa');        
                    await Main.Request(url,method,{'value':value, 'cod_empresa': cod_empresa, filter:ArrayPushHedSeled })
                        .then( response =>{
                            if( response.status == 200 ){
                            BuscadorRow = new DataSource({
                                store: new ArrayStore({
                                    data: response.data.rows,
                                }),
                                key: 'ID'
                            }) 
                            gridCab.current.instance.option('dataSource', BuscadorRow);
                            cancelar_Cab = JSON.stringify(response.data.rows);
                            }
                        setTimeout(()=>{
                            gridCab.current.instance.option('focusedRowIndex', 0);
                        },70)
                    });
                } catch (error) {
                    console.log(error);
                }
            }
    
        }
            //FILA QUE QUEDA EN FOCUS
    const setRowFocus = async(e,grid,f9)=>{
        
        if(e.row){

            console.log(e.row.data);
            form.setFieldsValue(e.row.data);
            
        }else{
            console.log("Error al seteo de información", error)
            alert("Error al seteo de información", error);
        }

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleInputChange = async(e)=>{
        modifico();
        let info = await getFocusGlobalEventDet()
        if(info){
            info.row.data[e.target.id] = e.target.value
            if(info.row.data.InsertDefault){
                info.row.data['inserted']      = true;
                info.row.data['InsertDefault'] = false;
            }else if(info.row.data.inserted){
                info.row.data['InsertDefault'] = false;
            }else{
                info.row.data['updated'] = true;
                info.row.data['FEC_MODIFICACION'] = Main.moment().format('DD/MM/YYYY');
                info.row.data['MODIFICADO_POR'  ] = cod_usuario;    
            }
            gridCab.current.instance.repaintRows(info.rowIndex);
        }        
    }


    return (
    <>

        <Main.Paper className="paper-style">
                                <Search
                                    addRow            = {addRow}
                                    eliminarRow       = {deleteRows}
                                    cancelarProceso   = {funcionCancelar}
                                    formName          = {FormName}
                                    guardarRow        = {guardar}
                                    handleChange      = {handleChange}
                                    onKeyDownBuscar   = {onKeyDownBuscar}
                                    buttonGuardar     = {buttonSaveRef}
                                    buttonAddRef      = {buttonAddRowRef} 
                                 />

                                <div style={{padding:'10px'}}>
                                    <DevExtremeDet
                                        gridDet             = {gridCab}
                                        id                  = "RHPOSTUL_CAB"
                                        IDCOMPONENTE        = "RHPOSTUL_CAB"
                                        columnDet           = {columnsListar}
                                        notOrderByAccion    = {notOrderByAccion}
                                        FormName            = {FormName}
                                        guardar             = {guardar}
                                        newAddRow           = {false}
                                        deleteDisable       = {false}
                                        setRowFocusDet      = {setRowFocus}
                                        optionSelect        = {estado}
                                        activateF10         = {false}
                                        activateF6          = {false}
                                        setActivarSpinner   = {setActivarSpinner}
                                        altura              = {'200px'}
                                        doNotsearch         = {doNotsearch}
                                        columBuscador       = {columBuscador_cab}
                                        // nextFocusNew        = {"APTITUDES"}

                                        // initialRow          = {initialRow}
                                    />


<Form autoComplete="off" size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px'}}>
                                        <div style={{ padding: "1px" }}> 
                                            <Card>
                                                <Col style={{ paddingTop: "2px"}}>
                                                    <Row gutter={[3, 3]}>

                                                        {/* <Col span={12} xs={{ order: 1 }} style={{ paddingTop: "2px"}}>
                                                            <Form.Item 
                                                                name="FEC_NACIMIENTO"
                                                                label= "Fecha de Nac."
                                                                labelCol={{ span: 7 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <DatePicker />
                                                            </Form.Item>
                                                        </Col> */}

                                                        <Col span={12} xs={{ order: 2 }} style={{ paddingTop: "2px"}}>    
                                                            <Form.Item 
                                                                name="SEXO"
                                                                label= "Sexo"
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                <Select initialvalues="Masculino" 
                                                                    onChange={ async(e)=>{
                                                                    modifico();
                                                                        var row = await gridCab.current.instance.getDataSource()._items[getRowIndex()];
                                                                        if(row.InsertDefault){
                                                                            row.inserted = true;
                                                                            row.InsertDefault = false;
                                                                        }else if(!row.inserted) row.updated = true;
                                                                            row.SEXO = e;
                                                                }}>
                                                                    <Select.Option value="Masculino">Masculino</Select.Option>
                                                                    <Select.Option value="Femenino">Femenino</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 3 }} style={{ paddingTop: "2px"}}>    
                                                            <Form.Item 
                                                                name="APTITUDES"
                                                                label= "Aptitudes"
                                                                labelCol={{ span: 7 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange}/>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 4 }} style={{ paddingTop: "2px"}}>
                                                            <Form.Item 
                                                                name="PRETENCION_SALARIAL"
                                                                label= "Pretención"
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 5 }}>
                                                            <Form.Item
                                                                name="NACIONALIDAD"
                                                                label= "Nacionalidad"
                                                                labelCol={{ span: 7}}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>                                                

                                                        <Col span={12} xs={{ order: 6 }}>
                                                            <Form.Item 
                                                                name="IND_TIENE_HIJO"
                                                                label= "Tiene hijos?"
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                <Select initialvalues="NO" 
                                                                    onChange={ async(e)=>{
                                                                    modifico();
                                                                        var row = await gridCab.current.instance.getDataSource()._items[getRowIndex()];
                                                                        if(row.InsertDefault){
                                                                            row.inserted = true;
                                                                            row.InsertDefault = false;
                                                                        }else if(!row.inserted) row.updated = true;
                                                                            row.IND_TIENE_HIJO = e;
                                                                }}>
                                                                    <Select.Option value="NO">No</Select.Option>
                                                                    <Select.Option value="SI">Si</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 7 }}>
                                                            <Form.Item 
                                                                name="DIRECCION"
                                                                label= "Dirección"
                                                                labelCol={{ span: 7 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 8 }}>
                                                            <Form.Item 
                                                                name="BARRIO"
                                                                label= "Barrio"
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        
                                                        <Col span={12} xs={{ order: 9 }}>
                                                            <Form.Item 
                                                                name="IND_HORARIO_ROTATIVO"
                                                                label= "Disp. Horario Rotativo?"
                                                                labelCol={{ span: 7 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                <Select initialvalues="NO" 
                                                                    onChange={ async(e)=>{
                                                                    modifico();
                                                                        var row = await gridCab.current.instance.getDataSource()._items[getRowIndex()];
                                                                        if(row.InsertDefault){
                                                                            row.inserted = true;
                                                                            row.InsertDefault = false;
                                                                        }else if(!row.inserted) row.updated = true;
                                                                            row.IND_HORARIO_ROTATIVO = e;
                                                                }}>
                                                                    <Select.Option value="NO">No</Select.Option>
                                                                    <Select.Option value="SI">Si</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 10 }}>
                                                            <Form.Item 
                                                                name="IND_ESTUDIA"
                                                                label= "Estudiando? "
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                <Select initialvalues="NO" 
                                                                    onChange={ async(e)=>{
                                                                    modifico();
                                                                        var row = await gridCab.current.instance.getDataSource()._items[getRowIndex()];
                                                                        if(row.InsertDefault){
                                                                            row.inserted = true;
                                                                            row.InsertDefault = false;
                                                                        }else if(!row.inserted) row.updated = true;
                                                                            row.IND_ESTUDIA = e;
                                                                }}>
                                                                    <Select.Option value="NO">No</Select.Option>
                                                                    <Select.Option value="SI">Si</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 11 }}>
                                                            <Form.Item 
                                                                name="TELEFONO"
                                                                label= "Teléfono"
                                                                labelCol={{ span: 7 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 12 }}>
                                                            <Form.Item 
                                                                name="NIVEL_ESTUDIO"
                                                                label= "Nivel de estudio"
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 13 }}>
                                                            <Form.Item 
                                                                name="IND_ESTUDIA_HORARIO"
                                                                label= "Hora de clases"
                                                                labelCol={{ span: 7 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        

                                                        <Col span={12} xs={{ order: 14 }}>
                                                            <Form.Item 
                                                                name="IND_MOVILIDAD_PROPIA"
                                                                label= "Movilidad Propia"
                                                                labelCol={{ span: 8  }}
                                                                wrapperCol={{ span: 20 }}
                                                                >
                                                                <Select initialvalues="NO" 
                                                                    onChange={ async(e)=>{
                                                                    modifico();
                                                                        var row = await gridCab.current.instance.getDataSource()._items[getRowIndex()];
                                                                        if(row.InsertDefault){
                                                                            row.inserted = true;
                                                                            row.InsertDefault = false;
                                                                        }else if(!row.inserted) row.updated = true;
                                                                            row.IND_MOVILIDAD_PROPIA = e;
                                                                }}>
                                                                    <Select.Option value="NO">No</Select.Option>
                                                                    <Select.Option value="SI">Si</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 15 }}>
                                                            <Form.Item 
                                                                name="IND_TIPO_MOVILIDAD"
                                                                label= "Tipo de movilidad"
                                                                labelCol={{ span: 7  }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 16 }}>
                                                            <Form.Item 
                                                                name="IND_MOTIVO_SALIDA"
                                                                label= "Motivo de salida"
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 17 }}>
                                                            <Form.Item 
                                                                name="IND_EX_FUNCIONARIO"
                                                                label= "Ex Funcionario?"
                                                                labelCol={{ span: 7 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                <Select initialvalues="NO" 
                                                                    onChange={ async(e)=>{
                                                                    modifico();
                                                                        var row = await gridCab.current.instance.getDataSource()._items[getRowIndex()];
                                                                        if(row.InsertDefault){
                                                                            row.inserted = true;
                                                                            row.InsertDefault = false;
                                                                        }else if(!row.inserted) row.updated = true;
                                                                            row.IND_EX_FUNCIONARIO = e;
                                                                }}>
                                                                    <Select.Option value="NO">No</Select.Option>
                                                                    <Select.Option value="SI">Si</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 18 }}>
                                                            <Form.Item 
                                                                name="IND_TRABAJA"
                                                                label= "Trabaja actualmente?"
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                <Select initialvalues="NO" 
                                                                    onChange={ async(e)=>{
                                                                    modifico();
                                                                        var row = await gridCab.current.instance.getDataSource()._items[getRowIndex()];
                                                                        if(row.InsertDefault){
                                                                            row.inserted = true;
                                                                            row.InsertDefault = false;
                                                                        }else if(!row.inserted) row.updated = true;
                                                                            row.IND_TRABAJA = e;
                                                                }}>
                                                                    <Select.Option value="NO">No</Select.Option>
                                                                    <Select.Option value="SI">Si</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>


                                                        <Col span={12} xs={{ order: 19 }}>
                                                            <Form.Item 
                                                                name="IND_EX_FUNCIONARIO_MOT_SAL"
                                                                label= "Mot. Sal. de Empresa"
                                                                labelCol={{ span: 7 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={12} xs={{ order: 20 }}>
                                                            <Form.Item 
                                                                name="MEDIO_CON_OFERTA_LABORAL"
                                                                label= "Conocimiento de Oferta"
                                                                labelCol={{ span: 8 }}
                                                                wrapperCol={{ span: 20 }}>
                                                                    <Input onChange={handleInputChange} />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                
                                                </Col>

                                                

                                            </Card>
                                        </div>


                                        <div style={{ padding: "1px" }}>
                                            <Card>
                                            
                                                <Col span={24} style={{paddingLeft:5}}>
                                                        <Form.Item 
                                                            label= "Experiencia Laboral" 
                                                            name="EXPERIENCIA_LABORAL">
                                                            <Input  onChange={handleInputChange}/>
                                                        </Form.Item>
                                                </Col>

                                            </Card>
                                        </div>
    

                                    </Form>
                                </div>
        </Main.Paper>

    </>
    
    )

});

export default LISTAENTREVISTA;