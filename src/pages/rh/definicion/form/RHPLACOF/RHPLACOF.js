import React                        from 'react';
import Main                         from '../../../../../components/utils/Main';
import _                            from "underscore";
import { Card, Typography, Input, Col, Row, Form }               from 'antd';
import { Menu, DireccionMenu }      from '../../../../../components/utils/FocusDelMenu';
import DevExtremeDet, { ArrayPushHedSeled } from '../../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import Search from '../../../../../components/utils/SearchForm/SearchForm';
import DataSource                   from "devextreme/data/data_source";
import ArrayStore                   from "devextreme/data/array_store";


import '../../../../../assets/css/DevExtreme.css';
import './style.css';



const title                 = "Conceptos para Planillas";

const FormName              = 'RHPLACOF';
const { Title }             = Typography;


var DeleteForm = []
const LimpiarDelete = () =>{
    DeleteForm = [];
}

var cancelar_con = '';
const getCancelar_con = ()=>{
	return cancelar_con;
}


const columnsListar = [  
    { ID: 'COD_CONCEPTO'            , label: 'Concepto'               , width: 125       , align:'left'    },
    { ID: 'DESCRIPCION'             , label: 'Descripción'            , maxWidth: 50     , align:'left'    },
    { ID: 'TIP_COLUMNA'             , label: 'Nro. de Columna'        , width: 130       , align:'left'    }
];



const CONCEPTOPLANILLAS = () => {

    const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
    const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(false);

    const cod_empresa = sessionStorage.getItem('cod_empresa');
    const cod_usuario = sessionStorage.getItem('cod_usuario');


    const url_getcabecera           = `/rh/rhplacof_cab/`;
    //    const url_getcabecera    = '/rh/rhpostul_con/';
    const url_getdetalle           = `/rh/rhplacon_det/`;


    const url_abm                   = '/rh/rhplacon' ;

    const [form]                    = Form.useForm();

    const gridCab                   = React.useRef();
    const gridDet                   = React.useRef();

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
        console.log('esto es codempresa==> ',cod_empresa)
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
            cancelar_con = JSON.stringify(content);
            setTimeout(()=>{
                gridCab.current.instance.focus(gridCab.current.instance.getCellElement(0,0))
            },100)
    }


    const getData = async(e) =>{
        var BuscadorRow = []
        var value = e.target.value;
        var url   = '/rh/rhplacon_det/'
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
                            // cancelar_pos = JSON.stringify(response.data.rows);
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
        // const componente = await getComponenteEliminarDet();
        // componente.id = 'RHPLACOF_CAB';
        // console.log("Componente ==> ",componente)
        // if(componente.delete){
        //     let indexRow =  await getRowIndex();
        //     if(indexRow == -1) indexRow = 0
        //     console.log(" esto es componete ==> ",componente)
        //     let data    = idGrid[componente.id].current.instance.getDataSource()._items
        //     // console.log('idGrid[componete.id].current ==> ', idGrid[componete.id].current)
        //     let info    = data[indexRow]
            
        //     if(_.isUndefined(info) || (_.isUndefined(info.inserted) && _.isUndefined(info.InsertDefault))){
        //         modifico();
    
        //         var nameColumn = await getFocusedColumnName()
        //         var comunIndex = idGrid[componente.id].current.instance.getCellElement(indexRow,nameColumn).cellIndex;
        //         if (comunIndex == -1) comunIndex = 0;
    
        //         if(DeleteForm[componente.id] !== undefined){
        //             DeleteForm[componente.id] = _.union(DeleteForm[componente.id], [info]);
        //         }else if(DeleteForm.length > 0){
    
        //             DeleteForm[componente.id] = [info];
    
        //         }else if(DeleteForm.length == 0){
                    
        //             DeleteForm[componente.id] = [info];
        //         }
        //         if(indexRow == -1) indexRow = 0
    
        //         idGrid[componente.id].current.instance.deleteRow(indexRow);
        //         idGrid[componente.id].current.instance.repaintRows([indexRow]);
        //     }else{
        //         idGrid[componente.id].current.instance.deleteRow(indexRow);
        //         idGrid[componente.id].current.instance.repaintRows([indexRow]);
        //     }
        //     setTimeout(()=>{
        //         indexRow = indexRow - 1;
        //         idGrid[componente.id].current.instance.focus(idGrid[componente.id].current.instance.getCellElement(indexRow == -1 ? 0 : indexRow ,idGrid.defaultFocus[componente.id]))
        //     },50);
        // }

        console.log('eliminado!')
        Main.message.info({
            content  : `Este boton todavia no fue configurado`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '10vh',
            },
        });

    }


    const guardar = async(e)=>{

        console.log('guardado!')
        Main.message.info({
            content  : `Este boton todavia no fue configurado`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '10vh',
            },
        });
    }






    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const funcionCancelar = async()=>{
        setActivarSpinner(true)
        if(getCancelar_pos()){
            var AuxDataCancelCab = await JSON.parse(await getCancelar_pos());

            if(AuxDataCancelCab.length > 0 && gridCab.current){
                const dataSource_cab = new DataSource({
                    store: new ArrayStore({
                        keyExpr:"ID",
                        data: AuxDataCancelCab
                    }),
                    key: 'ID'
                })
                gridCab.current.instance.option('dataSource', dataSource_cab);
                cancelar_pos = JSON.stringify(AuxDataCancelCab);
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
            // value = 'null'
            // getData();
            // getDataB();
        }

        var url   = '/rh/rhplacon_det/'
        if(e.keyCode == 13){
                console.log('tecleado ==> ', value)
                // const index = await ArrayPushHedSeled.indexOf(undefined);
                // if (index > -1) {
                // ArrayPushHedSeled.splice(index, 1); 
                // }

                // try {
                //     var method         = "POST";
                //     const cod_empresa  = sessionStorage.getItem('cod_empresa');        
                //     await Main.Request(url,method,{'value':value, 'cod_empresa': cod_empresa, filter:ArrayPushHedSeled })
                //         .then( response =>{
                //             console.log('esto es response ==> ',response)
                //             if( response.status == 200 ){
                //             BuscadorRow = new DataSource({
                //                 store: new ArrayStore({
                //                     data: response.data.rows,
                //                 }),
                //                 key: 'ID'
                //             }) 
                //             gridCab.current.instance.option('dataSource', BuscadorRow);
                //             // cancelar_pos = JSON.stringify(response.data.rows);
                //             }
                //         setTimeout(()=>{
                //             gridCab.current.instance.option('focusedRowIndex', 0);
                //         },70)
                //     });
                // } catch (error) {
                //     console.log(error);
                // }
            }else{
                console.log('buscador vacio')
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
                        cancelar_pos = JSON.stringify(response.data.rows);
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
                    // cancelar_pos = JSON.stringify(response.data.rows);
                    }
                setTimeout(()=>{
                    gridCab.current.instance.option('focusedRowIndex', 0);
                },70)
            });
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${title}` }/>
                    <Main.Spin size="large" spinning={activarSpinner} >
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
                                                        onPressEnter={ tecladovalor }
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
                                                    <Input/>

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