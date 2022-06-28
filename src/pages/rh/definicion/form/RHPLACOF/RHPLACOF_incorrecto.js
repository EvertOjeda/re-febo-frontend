import React                        from 'react';
import Main                         from '../../../../../components/utils/Main';
import _                            from "underscore";
import { Card, Typography, Input, Col, Row, Form }               from 'antd';
import { Menu, DireccionMenu }      from '../../../../../components/utils/FocusDelMenu';
import DevExtremeDet, { ArrayPushHedSeled,  getFocusGlobalEventDet, getComponenteEliminarDet,
                        getRowIndex, getFocusedColumnName, getComponenteFocusDet  } from '../../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import {setModifico,modifico}       from '../../../../../components/utils/SearchForm/Cancelar';
import Search from '../../../../../components/utils/SearchForm/SearchForm';
import DataSource                   from "devextreme/data/data_source";
import ArrayStore                   from "devextreme/data/array_store";
import { v4 as uuidID }             from "uuid";
import moment                       from 'moment';

import '../../../../../assets/css/DevExtreme.css';
import './style.css';



const title                 = "Conceptos para Planillas";

const FormName              = 'RHPLACOF';
const { Title }             = Typography;

var banSwitch   = false
var bandBloqueo = false

var ValidaInput = [
    {
        input: 'COD_PLANILLA',
        out : ['COD_PLANILLA'],// RETORNO DE LA FUNCION
        valor_ant: null,
        out : ['TITULO', 'DESCRIPCION'],// RETORNO DE LA FUNCION
        data: ['COD_EMPRESA'], // DATOS DE DEPENDENCIA
        rel : [],
        band:true,
        requerido: false,
    }
]



var DeleteForm = []
const LimpiarDelete = () =>{
    DeleteForm = [];
}

var cancelar = '';
const getCancelar = ()=>{
	return cancelar;
}
const setBandBloqueo =(e)=>{
    bandBloqueo = e;
}

const columnsListar = [  
    { ID: 'COD_CONCEPTO'            , label: 'Concepto'               , width: 125       , align:'left'    },
    { ID: 'DESCRIPCION'             , label: 'Descripción'            , maxWidth: 50     , align:'left'    },
    { ID: 'TIP_COLUMNA'             , label: 'Nro. de Columna'        , width: 130       , align:'left'    }
];

const columnPlanillas = [
    { ID: 'COD_PLANILLA'    , label: 'Cod Planilla'     , width:100    },
    { ID: 'TITULO'          , label: 'Titulo'           , minWidth:120 },
];



const CONCEPTOPLANILLAS = () => {

    const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
    const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(false);

    const cod_empresa  = sessionStorage.getItem('cod_empresa');
    const cod_usuario  = sessionStorage.getItem('cod_usuario');
    const cod_sucursal = sessionStorage.getItem('cod_sucursal');
    


    const [showMessageButton , setShowMessageButton] = React.useState(false);
    const [visibleMensaje	 , setVisibleMensaje   ] = React.useState(false);
    const [tituloModal		 , setTituloModal	   ] = React.useState();
    const [mensaje			 , setMensaje	       ] = React.useState();
    const [imagen			 , setImagen		   ] = React.useState();
    const [ tipoDeBusqueda   , setTipoDeBusqueda   ] = React.useState();
    const [ modalTitle       , setModalTitle       ] = React.useState('');
    const [ shows            , setShows            ] = React.useState(false);

    const [ searchColumns    , setSearchColumns    ] = React.useState({});
    const [ searchData       , setSearchData       ] = React.useState([]);




    const url_getcabecera           = `/rh/rhplacof_cab/`;
    //    const url_getcabecera    = '/rh/rhpostul_con/';
    const url_getdetalle            = `/rh/rhplacon_det/`;

    //URL BUSCADOR MODAL
    const url_buscar_planilla       = '/rh/rhplacon/buscar/planilla' ;


    const url_abm                   = '/rh/rhplacon' ;

    const [form]                    = Form.useForm();

    const gridCab                   = React.useRef();
    const gridDet                   = React.useRef();

    // Input
    const refCodPlanilla            = React.useRef();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const idGrid = {
        RHPLACOF_CAB:gridCab,
        RHPLACON_DET:gridDet,

        defaultFocus:{
			RHPLACOF_CAB:0,
            RHPLACON_DET:0,

        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    React.useEffect(()=>{
        getDataCab();

    },[])


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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const getDataCab = async() =>{
         try {
                setActivarSpinner(true);
                var content = await getInfo(url_getcabecera+cod_empresa, "GET", []);
                console.log(content)
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
                    IDCOMPONENTE  : "RHPLACOF_CAB",
                }]
            }
            const dataSource_Cab = new DataSource({
                store: new ArrayStore({
                    data: content,
                }),
                key: 'ID'
            })
            gridCab.current.instance.option('dataSource', dataSource_Cab);
            cancelar = JSON.stringify(content);
            setTimeout(()=>{
                gridCab.current.instance.focus(gridCab.current.instance.getCellElement(0,0))
            },100)
    }


    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const addRow = async()=>{
        if(!bandBloqueo){
            let idComponent = getComponenteEliminarDet().id
            let indexRow  = getRowIndex()
            if(indexRow == -1) indexRow = 0
            if(idComponent !== 'RHPLACOF_CAB') indexRow = 0    
            modifico();
            let initialInput = await initialFormData(true)
            let data = gridCab.current.instance.getDataSource();
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
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const initialFormData = async(isNew)=>{

        const fechahoycompleto = new Date();
        const fechacorta = moment(fechahoycompleto).format('DD/MM/YYYY');
        
        var valor = {
    
            ['COD_CONCEPTO'                 ] : '',
            ['DESCRIPCION'                  ] : '',
            ['TIP_COLUMNA'                  ] : '',
            
        }        
        if(isNew){
            valor = 
             {...valor,
                ['inserted'                 ] :true,
                ['COD_PLANILLA'             ] : '',
                ['TITULO'                   ] : '',

            }
            return valor
        }else{
            valor.insertDefault = true
            form.setFieldsValue(valor);
        };
    
        
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const setRowFocus = async(e,grid,f9)=>{
        if(e.row){
            form.setFieldsValue(e.row.data);
            console.log(e.row.data);
            
        }else{
            console.log("Error al seteo de información", error)
            alert("Error al seteo de información", error);
        }
    }


    const deleteRows = async()=>{
        const componente = await getComponenteEliminarDet();
        componente.id = 'RHPLACOF_CAB';
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

        // console.log('eliminado!')
        // Main.message.info({
        //     content  : `Fila eliminado`,
        //     className: 'custom-class',
        //     duration : `${2}`,
        //     style    : {
        //         marginTop: '10vh',
        //     },
        // });

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const guardar = async(e)=>{

        setActivarSpinner(true);
        
        const fechahoycompleto = new Date();
        const fechacorta = moment(fechahoycompleto).format('DD/MM/YYYY');

        var datosCab = []
        if(gridCab.current != undefined){
            datosCab    = gridCab.current.instance.getDataSource()._items;
        }

        var info_cab = await Main.GeneraUpdateInsertCab(datosCab,'', '', [],false);
                                                        // rows, key, url ,updateDependencia,autoCodigo,cod_Not_null
    
        var aux_cab             = info_cab.rowsAux;
        var update_insert_cab   = info_cab.updateInsert;
        var delete_cab          = DeleteForm.RHPLACOF_CAB != undefined ? DeleteForm.RHPLACOF_CAB : [];
        console.log("update ===> ", update_insert_cab)
        
        if(update_insert_cab.length > 0){
            for (let i = 0; i < update_insert_cab.length; i++) {
                const items = update_insert_cab[i];
                // if(items.FEC_NACIMIENTO !== '' && !_.isUndefined(items.FEC_NACIMIENTO)){
                //     let fecha = Main.moment(items.FEC_NACIMIENTO).format('DD/MM/YYYY')
                //     if(fecha !== 'Invalid date') items.FEC_NACIMIENTO = fecha;
                // }
                //PARA REGISTRAR ULTIMA ACTUALIZACION
                if(items){
                   items.FEC_INICIO     = fechacorta;
                   items.COD_EMPRESA    = 1;
                }
            }
        }
        let valorAuxiliar_cab  = getCancelar_pos()  !== '' ? JSON.parse(getCancelar_pos())  : [];

        var data = {
            // Cabecera
                update_insert_cab,  delete_cab, valorAuxiliar_cab ,
            // Adicional
            "cod_usuario": sessionStorage.getItem('cod_usuario'),
            "cod_empresa": sessionStorage.getItem('cod_empresa')
        }
        console.log("insert_cab.length ===>>> ",update_insert_cab.length, "delete_cab.length ===>>> ",delete_cab.length )
    
    
    
    
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

                          cancelar_pos =  JSON.stringify(aux_cab);
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
    
        //   getDataB();
          setActivarSpinner(false);
    }





    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const funcionCancelar = async()=>{
        setActivarSpinner(true);
        var e = getFocusGlobalEventDet();
        if(getCancelar()){
            var AuxDataCancelCab = await JSON.parse(await getCancelar());

            if(AuxDataCancelCab.length > 0 && gridCab.current){
                const dataSource_cab = new DataSource({
                    store: new ArrayStore({
                        keyExpr:"ID",
                        data: AuxDataCancelCab
                    }),
                    key: 'ID'
                })
                gridCab.current.instance.option('dataSource', dataSource_cab);
                cancelar = JSON.stringify(AuxDataCancelCab);
                // setInputData(e.row.data);  
            }
        }

        LimpiarDelete();
        // QuitarClaseRequerido();
        banSwitch = false;
        setBandBloqueo(false);
        setShowMessageButton(false)
        setTimeout(()=>{
            setModifico();
            setActivarSpinner(false)
            gridCab.current.instance.focus(gridCab.current.instance.getCellElement(0,0));

        },50);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const onKeyDownBuscar = async(e)=>{
        var BuscadorRow = []
        var value = e.target.value;
        // console.log("esto es valueTrim ===>> ",value.trim())
        if(value.trim() == ''){
            value = 'null'
            getDataCab();

        }

        var url   = '/rh/rhplacon/search'
        if(e.keyCode == 13){
                console.log('tecleado ==> ', value)
                const index = await ArrayPushHedSeled.indexOf(undefined);
                if (index > -1) {
                ArrayPushHedSeled.splice(index, 1); 
                }

                try {
                    var method         = "POST";
                    const cod_empresa  = sessionStorage.getItem('cod_empresa');        
                    await Main.Request(url,method,{'value':value, 'cod_empresa': cod_empresa, filter:ArrayPushHedSeled })
                        .then( response =>{
                            console.log('esto es response ==> ',response)
                            if( response.status == 200 ){
                            BuscadorRow = new DataSource({
                                store: new ArrayStore({
                                    data: response.data.rows,
                                }),
                                key: 'ID'
                            }) 
                            gridCab.current.instance.option('dataSource', BuscadorRow);
                            // cancelar = JSON.stringify(response.data.rows);
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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                        cancelar = JSON.stringify(response.data.rows);
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

    const tecladovalor = async (e) => {
        var BuscadorRow = [];
        var value = e.target.value;
        console.log(value);

        try {
            var method         = "POST";
            const cod_empresa  = sessionStorage.getItem('cod_empresa');
            var url = '/rh/rhplacofdetalle/';
            await Main.Request(url+cod_empresa,method,{'value':value, 'cod_empresa': cod_empresa, filter:ArrayPushHedSeled })
                .then( response =>{
                    if( response.status == 200 ){
                        console.log('response ==> ',response)
                        BuscadorRow = new DataSource({
                        store: new ArrayStore({
                            data: response.data.rows,
                        }),
                        key: 'ID'
                    }) 
                    gridCab.current.instance.option('dataSource', BuscadorRow);
                    // cancelar = JSON.stringify(response.data.rows);
                    }
                setTimeout(()=>{
                    gridCab.current.instance.option('focusedRowIndex', 0);
                },70)
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancel = async()=>{
        setVisibleMensaje(false);
        if(showMessageButton){
            funcionCancelar();
        }
    }


    const handleKeydown = async (e)=>{
        
        if(e.keyCode == 13 || e.keyCode == 9){
            e.preventDefault()   
            // nextFocus(e);
        }

        if(e.keyCode == 120){
            e.preventDefault();
            setActivarSpinner(true)
            setTipoDeBusqueda(e.target.id);
            switch(e.target.id){
              case "COD_PLANILLA":
                var auxCuenta = await getInfo(url_buscar_planilla,'POST',{cod_empresa: cod_empresa});
                setModalTitle("Cuenta Contable");
                setSearchColumns(columnPlanillas);
                setSearchData(auxCuenta);
                setShows(true);
                break;            
                
              default:
                break;
             }
            setActivarSpinner(false)
          }

          () => {document.getElementById(info.next).focus('COD_PLANILLA')};
    }


    const showsModal = async (valor) => {
        setShows(valor);
    };


    const onInteractiveSearch = async(event) => {
        let valor = event.target.value;
        let data = {'cod_empresa':cod_empresa,'valor':valor}
        if(valor.trim().length === 0 ) valor = 'null';
        let info = ValidaInput.find( item => item.input == tipoDeBusqueda );
        // let url = info.url_buscar
        if(valor !== null){
        try {
            await Main.Request(url,'POST',data).then(response => { 
                if( response.status == 200 ){
                    setSearchData(response.data.rows)   
                } 
            });
        } catch (error) {
            console.log(error);
        }
        }
    }



        // BUSCADORES
    const modalSetOnClick = async (datos, BusquedaPor, e) => {
        if(datos !== "" || datos !== undefined){
            modifico();
            let info    = await ValidaInput.find( item => item.input == BusquedaPor );
            var dataRow = await getFocusGlobalEventDet().row.data;
            if(info.valor_ant != datos[0]){
                // JUNTAR EL CODIGO, CON EL RETORNO DEL VALIDA
                let keys = [ info.input, ...info.out ];
                keys.map(( item, index) => {
                // FORM
                    form.setFieldsValue({
                        ...form.getFieldsValue()
                        ,[item]: datos[index] 
                    });
                    dataRow[item] = datos[index]
                    console.log('esto es datarow==> ',dataRow)
                });
                // LIMPIAR DATOS RELACIONADOS
                info.rel.map(( item ) => {
                // FORM
                    form.setFieldsValue({
                        ...form.getFieldsValue(),
                        [item]: '' 
                    });
                    dataRow[item] = datos[index]
                });
            }
            showsModal(false)
            let rowsData = await getFocusGlobalEventDet()
            if(rowsData){
                rowsData.row.data[BusquedaPor] = datos[0]

                if(rowsData.row.data.InsertDefault){
                    rowsData.row.data['inserted']      = true;
                    rowsData.row.data['InsertDefault'] = false;
                }else if(rowsData.row.data.inserted){
                    rowsData.row.data['InsertDefault'] = false;
                }else{
                    rowsData.row.data['updated'] = true;
                    rowsData.row.data['FEC_MODIFICACION'] = Main.moment().format('DD/MM/YYYY');
                    rowsData.row.data['MODIFICADO_POR'  ] = cod_usuario;
                }
            }
            // setTimeout( ()=>{ document.getElementById(info.next).focus(gridCab.current.instance.getCellElement(0,0)) }, 200 );
        }

    }

    const handleInputChange = async(e)=>{
        modifico();
        tecladovalor();

            console.log('ahora buscaria el nuevo')

        let info = await getFocusGlobalEventDet()
        //  console.log("info => ", info)      
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
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${title}` }/>
                    <Main.Spin size="large" spinning={activarSpinner} >

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


                        <Main.Paper>
                            <div className="paper-header">

                                <Title level={5} className="title-color">
                                    {title}
                                    <div>
                                        <Title 
                                            level={4} 
                                            style={{ 
                                                    float: 'right', 
                                                    marginTop: '-16px', 
                                                    marginRight: '5px', 
                                                    fontSize: '10px' 
                                                }} 
                                            className="title-color">{FormName}
                                        </Title>
                                    </div>
                                </Title>
                            </div>

                            <Form>
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

                            </Form>

                            <Form autoComplete="off" size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px'}}>
                                <Card style={{ boxShadow: '3px 2px 20px 2px #262626'}}>
                                    <Col style={{ paddingTop: "10px"}}>
                                        <Row gutter={[4, 4]}>
                                            <Col span={8} xs={{ order: 1 }} style={{ paddingTop: "2px"}}>
                                                <Form.Item
                                                    name={'COD_PLANILLA'}
                                                    label='Planilla: '
                                                    labelCol={{ span: 7 }}
                                                    wrapperCol={{ span: 6 }}
                                                    >
                                                    <Input 
                                                        onKeyDown       = {handleKeydown}
                                                        onChange        = {handleInputChange}
                                                        onPressEnter    = {tecladovalor}
                                                        maxLength       = '0'
                                                        ref             = {refCodPlanilla}
                                                    />

                                                </Form.Item>
                                            </Col>

                                            <Col span={12} xs={{ order: 2 }} style={{ paddingTop: "2px"}}>
                                                <Form.Item
                                                    name={'TITULO'}
                                                    label='Titulo: '
                                                    labelCol={{ span: 5 }}
                                                    wrapperCol={{ span: 24 }}
                                                    
                                                >
                                                    <Input />

                                                </Form.Item>
                                            </Col>

                                        </Row>
                                    </Col>
                                </Card>
                                {/* style={{ boxShadow: '3px 2px 20px 2px #262626'}} */}
                                <div style={{paddingTop: '10px' ,boxShadow: '3px 2px 20px 2px #262626'}}>
                                    <DevExtremeDet
                                        gridDet             = {gridCab}
                                        id                  = "ID"
                                        IDCOMPONENTE        = "RHPLACOF_CAB"
                                        columnDet           = {columnsListar}
                                        altura              = {'498px'}
                                        setRowFocusDet      = {setRowFocus}
                                        // doNotsearch         = {doNotsearch}
                                        // columBuscador       = {columBuscador_pos}
                                    />

                                </div>

                            </Form>

                        </Main.Paper>    
                    </Main.Spin>
            </Main.Layout>
        
        
        </>
    )

};

export default CONCEPTOPLANILLAS;