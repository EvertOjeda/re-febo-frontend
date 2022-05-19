import React, { useState, useRef, memo, useEffect } from 'react';
import Main            from '../../../../../components/utils/Main';
import _                             from "underscore";
import { Input, Row, Col, Form, Card, Grid, Typography }  from 'antd';
import Search                        from '../../../../../components/utils/SearchForm/SearchForm';
// import {setModifico,modifico}        from '../../../../components/utils/SearchForm/Cancelar';
// import { ValidarColumnasRequeridas } from '../../../../components/utils/DevExtremeGrid/ValidarColumnasRequeridas';
import { Menu, DireccionMenu }       from '../../../../../components/utils/FocusDelMenu';
import DataSource                    from "devextreme/data/data_source";
import ArrayStore                    from "devextreme/data/array_store";
import { v4 as uuidID }              from "uuid";


import '../../../../../assets/css/DevExtreme.css';
import './style.css';
import DevExtremeDet, { getFocusGlobalEventDet, getComponenteEliminarDet, ArrayPushHedSeled,
                        getFocusedColumnName, getRowIndex, getComponenteFocusDet } from '../../../../../components/utils/DevExtremeGrid/DevExtremeDet';

const concepto = {}

const columnsListar = [  
  { ID: 'NRO_DOCUMENTO'           , label: 'Nro documento'          , width: 80     , align:'center'   , requerido:true , Pk:true},
  { ID: 'NOMBRE'                  , label: 'Nombre y Apellido'      , width: 90     , align:'left'     , requerido:true},
  { ID: 'SEXO'                    , label: 'Sexo'                   , width: 50     , align:'center'  },
  { ID: 'ESTADO_CIVIL'            , label: 'Est. civil'             , minWidth: 50  , align:'center'  },
  { ID: 'ZONA_RESIDENCIA'         , label: 'Zona de residencia'     , width: 70     , align:'center'  },
  { ID: 'CELULAR'                 , label: 'Celular'                , minWidth: 50  , align:'center'  },
  { ID: 'EMAIL'                   , label: 'Email'                  , width: 90     , align:'center'  },
  { ID: 'SUCURSAL'                , label: 'Sucursal'               , width: 100    , align:'center'  },
  { ID: 'IND_VACANCIA_INTERES'    , label: 'Vac de interes'         , width: 75     , align:'center'   , requerido:true},
  { ID: 'CONTRATADO'              , label: 'Contratado'             , width: 60     , align:'center'   , checkbox:true  , checkBoxOptions:["S","N"]},
];


const columBuscador         = ['NOMBRE']  // ['NRO_DOCUMENTO'],
const doNotsearch           = ['NRO_DOCUMENTO','ZONA_RESIDENCIA','EMAIL','NACIONALIDAD','BARRIO','NIVEL_ESTUDIO','IND_ESTUDIA_HORARIO','IND_EX_FUNCIONARIO'
                                ,'IND_EX_FUNCIONARIO_MOT_SAL', 'SUCURSAL']
const notOrderByAccion      = ['NOMBRE','NRO_DOCUMENTO','ZONA_RESIDENCIA','EMAIL','NACIONALIDAD','BARRIO','NIVEL_ESTUDIO','IND_ESTUDIA_HORARIO','IND_EX_FUNCIONARIO'
                                ,'IND_EX_FUNCIONARIO_MOT_SAL', 'SUCURSAL']
const TituloList            = "Lista de postulantes";
var  defaultOpenKeys        = sessionStorage.getItem("mode") === 'vertical' ? [] : ['RH', 'RH-RH1'];
var  defaultSelectedKeys    = sessionStorage.getItem("mode") === 'vertical' ? [] : ['RH-RH1-null-RHPOSTUL'];
const FormName              = 'RHPOSTUL';
const { Title }          = Typography;


var DeleteForm = []
const LimpiarDelete = () =>{
    DeleteForm = [];
}
var idComponente = 'CMPROVEC_CONT'
const setIdComponente = (value)=>{
    idComponente = value;
}
const getIdComponente = ()=>{
    return idComponente;
}
var cancelar_Cab = '';
const getCancelar_Cab = ()=>{
	return cancelar_Cab;
}
// var cancelar_Det = '';
// const getCancelar_Det = ()=>{
// 	return cancelar_Det;
// }
// var cancelar_Cont = '';
// const getCancelar_Cont = ()=>{
// 	return cancelar_Cont;
// }

const POSTULANTES = memo(() => {

    ///////////////////////////////////////////////////////////////////////////////
    const cod_empresa           =  sessionStorage.getItem('cod_empresa');
    const url_lista             = `/rh/rhpostul/${cod_empresa}`;
    const url_buscador          = `/rh/rhpostul/search`;
    const url_abm               = "/rh/rhpostul";
    ///////////////////////////////////////////////////////////////////////////////
    var banSwitch   = false
    var bandBloqueo = false
    const setBandBloqueo =(e)=>{
        bandBloqueo = e;
    }

    ///////////////////////////////////////////////////////////////////////////////
    //URLs NUEVOS
            // URL CABCERA
    const url_getcabecera    = '/rh/rhpostul/:cod_empresa/';
    //URL DETALLE
    const url_getDetalle     = '/rh/rhpostul_det';


    const gridCab             = React.useRef();
    const gridDet             = React.useRef();
    const gridCont            = React.useRef();
    
    
    const [form]                = Form.useForm();
    //REFERENCIAS
    const aptitudesRef              = React.useRef();
    const pretencionRef             = React.useRef();
    const nacionalidadRef           = React.useRef();
    const tienehijoRef              = React.useRef();
    const direccionRef              = React.useRef();
    const barrioRef                 = React.useRef();
    const telefonoRef               = React.useRef();
    const nivelestudioRef           = React.useRef();
    const estudiaRef                = React.useRef();
    const estudiahoraRef            = React.useRef();
    const movilpropiaRef            = React.useRef();
    const tipomovilRef              = React.useRef();
    const trabajaRef                = React.useRef();
    const motivsalidaRef            = React.useRef();
    const horariorotaRef            = React.useRef();
    const experienciaRef            = React.useRef();
    const exfuncionarioRef          = React.useRef();
    const exfuncionariomotsalRef    = React.useRef();
    const medioconoofertalaboral    = React.useRef(); 

    const [ activarSpinner   , setActivarSpinner  ] = useState(false);

    useEffect ( () => {
        getData();
    },[])

    const buttonSaveRef   = React.useRef();
    const buttonAddRowRef = React.useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.Nuevo, (e) => {
        e.preventDefault();
        buttonAddRowRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    // const getData = async() =>{
    //     try {
    //         var url     = `${url_lista}`;
    //         var method  = "GET";
    //         await Main.Request( url,method,[])
    //         .then( response =>{
    //             if(response){

    //                  setDatosListar(response.data.rows);
                    
    //                 console.log(response.data.rows)
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }finally{
    //         setActivarSpinner(false)
    //     }

    // }

    const {TextArea} = ''

        // GET GENERICO
        const getInfo = async (url, method, data) => {
            var content = [];        
            try {
                var info = await Main.Request(url, method, data);
                if (info.data.rows) {
                    content = info.data.rows;
                    
                    // console.log('this is info.data.rows ==> ' , info.data.rows)
                }
                return content;
            } catch (error) {
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
                InsertDefault : true,
                IDCOMPONENTE  : "NRO_DOCUMENTO",
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
        console.log(content)
    }


    const nextFocus = async(e)=>{
        switch (e.target.id) {            
            case 'APTITUDES_REF':
                ValidarUnico(e.target.id);
                break;
            case 'PRETENCION_SALARIAL_REF':
                ValidarUnico(e.target.id);
                break;
            case 'NACIONALIDAD_REF':
                ValidarUnico(e.target.id);
                break;
            case 'IND_TIENE_HIJO_REF':
                ValidarUnico(e.target.id);
                break;
            case 'DIRECCION_REF':
                ValidarUnico(e.target.id);
                break;
            case 'BARRIO_REF':
                ValidarUnico(e.target.id);
                break;                                
            case 'TELEFONO_REF':
                refCantDiaAnt.current.focus();
                break;
            case 'NIVEL_ESTUDIO_REF':
                ValidarUnico(e.target.id);
                break;
            case 'IND_ESTUDIA_REF':
                refExento.current.focus();
                break;
            case 'IND_ESTUDIA_HORARIO_REF':
                refIndTransportista.current.focus();
                break;
            case 'IND_MOVILIDAD_PROPIA_REF':
                refDirector.current.focus();
                break;
            case 'IND_TIPO_MOVILIDAD_REF':
                refIndespachante.current.focus();
                break;
            case 'IND_TRABAJA_REF':
                refIndLocal.current.focus();
                break;
            case 'IND_MOTIVO_SALIDA_REF':
                refIndCajaChica.current.focus();
                break;
            case 'IND_HORARIO_ROTATIVO_REF':
                refIndRetencionIva.current.focus();
                break;
            case 'IND_EX_FUNCIONARIO_REF':
                refIndReparto.current.focus();
                break;
            case 'IND_EX_FUNCIONARIO_MOT_SAL_REF':
                refIndExportador.current.focus();
                break;
            case 'MEDIO_CON_OFERTA_LABORAL_REF':
                refIndOdc.current.focus();
                break;
            case 'EXPERIENCIA_LABORAL_REF':
                let idComponente = getIdComponente()
                if(idComponente == 'NRO_DOCUMENTO'){
                    setTimeout(()=>{
                        gridDet.current.instance.focus(gridDet.current.instance.getCellElement(0,0))
                    },80);
                }else{
                    setTimeout(()=>{
                        gridCont.current.instance.focus(gridCont.current.instance.getCellElement(0,0))
                    },80);
                }
                break;    
            default:
                break;
        }        
    }

    const ValidarUnico = async(input) => {
        let item    = await ValidaInput.find( item => item.input == input);
        var dataRow = await getFocusGlobalEventDet().row.data;
        if(!_.isObject(item)) return;
        let valor = form.getFieldValue(item.input);
        if(valor == null) valor = '';
    }

    // const setInputData = async (data)=>{
    //     // console.log('setInputData!!!! ======> ', data.BARRIO)
    //     form.setFieldsValue({
    //         ...data,
    //           ["NOMBRE"]             : data.NOMBRE             == "S" ? true : false,
    //           ["CELULAR"]            : data.CELULAR            == "S" ? true : false,
    //         //   ["IND_TRANSPORTISTA"] : data.IND_TRANSPORTISTA == "S" ? true : false,
    //         //   ["DIRECTO"]           : data.DIRECTO           == "S" ? true : false,
    //         //   ["IND_DESPACHANTE"]   : data.IND_DESPACHANTE   == "S" ? true : false,
    //         //   ["IND_LOCAL"]         : data.IND_LOCAL         == "S" ? true : false,
    //         //   ["IND_CAJA_CHICA"]    : data.IND_CAJA_CHICA    == "S" ? true : false,
    //         //   ["IND_RETENCION_IVA"] : data.IND_RETENCION_IVA == "S" ? true : false,
    //         //   ["IND_REPARTO"]       : data.IND_REPARTO       == "S" ? true : false,
    //         //   ["IND_EXPORTADOR"]    : data.IND_EXPORTADOR    == "S" ? true : false,
    //         //   ["IND_ODC"]           : data.IND_ODC           == "S" ? true : false,
    //       });
    //     let url    = url_getDetalle
    //     let params = {'cod_empresa':cod_empresa, NRO_DOCUMENTO : data.NRO_DOCUMENTO} 
    //     let id     = getIdComponente()
    //     //   if (id == 'CMPROVEC_CONT') url = await url_getContacto;
    //     getDetalle(url,params,data);
    // }

    // const getDetalle = async(url,params,data)=>{
    //     var content = []
    //     try {
    //         content = await Main.Request(url, "POST", params);
    //     } catch (error) {
    //         console.log(error)
    //     }
        
    //     if(content.data.rows.length == 0){
    //         let newKey = uuidID();
    //         content = [{
    //             ID	           : newKey,
    //             // COD_EMPRESA    : cod_empresa,
    //             idCabecera     : data.ID,
    //             NRO_DOCUMENTO   : getIdComponente(),
    //             InsertDefault  : true,
    //         }]
    //     }else{
    //         content = content.data.rows
    //     }

    //     const dataSource_det = new DataSource({
    //         store: new ArrayStore({
    //             data: content,
    //         }),
    //         key: 'ID'
    //     })

    //     // if(getIdComponente() == 'CMPROVEC_CONT'){
    //         banSwitch = false
    //         gridCont.current.instance.option('dataSource', dataSource_det);
    //         cancelar_Cont = JSON.stringify(content)
    //     // }else{
    //     //     banSwitch = false
    //     //     gridDet.current.instance.option('dataSource', dataSource_det);
    //     //     cancelar_Det = JSON.stringify(content)
    //     // }
    // }   

    
    var textoexperiencia = '';

    //FILA QUE QUEDA EN FOCUS
    const setRowFocus = async(e,grid,f9)=>{
        if(f9){
            aptitudesRef.current.input.value            = row['APTITUDES']
            pretencionRef.current.input.value           = row['PRETENCION_SALARIAL']
            nacionalidadRef.current.input.value         = row['NACIONALIDAD']
            tienehijoRef.current.input.value            = row['IND_TIENE_HIJO']
            direccionRef.current.input.value            = row['DIRECCION']
            barrioRef.current.input.value               = row['BARRIO']
            telefonoRef.current.input.value             = row['TELEFONO']
            nivelestudioRef.current.input.value         = row['NIVEL_ESTUDIO']
            estudiaRef.current.input.value              = row['IND_ESTUDIA']
            estudiahoraRef.current.input.value          = row['IND_ESTUDIA_HORARIO']
            movilpropiaRef.current.input.value          = row['IND_MOVILIDAD_PROPIA']
            tipomovilRef.current.input.value            = row['IND_TIPO_MOVILIDAD']
            trabajaRef.current.input.value              = row['IND_TRABAJA']
            motivsalidaRef.current.input.value          = row['IND_MOTIVO_SALIDA']
            horariorotaRef.current.input.value          = row['IND_HORARIO_ROTATIVO']
            experienciaRef.current.input.value          = row['EXPERIENCIA_LABORAL']
            exfuncionarioRef.current.input.value        = row['IND_EX_FUNCIONARIO']
            exfuncionariomotsalRef.current.input.value  = row['IND_EX_FUNCIONARIO_MOT_SAL']
            medioconoofertalaboral.current.input.value  = row['MEDIO_CON_OFERTA_LABORAL']

            console.log("ENTRO EN IF F9");
            

            
        }else if(e.row){
            if(e.row.data){                
                aptitudesRef.current.input.value            = e.row.data['APTITUDES']
                pretencionRef.current.input.value           = e.row.data['PRETENCION_SALARIAL']
                nacionalidadRef.current.input.value         = e.row.data['NACIONALIDAD']
                tienehijoRef.current.input.value            = e.row.data['IND_TIENE_HIJO']
                direccionRef.current.input.value            = e.row.data['DIRECCION']
                barrioRef.current.input.value               = e.row.data['BARRIO']
                telefonoRef.current.input.value             = e.row.data['TELEFONO']
                nivelestudioRef.current.input.value         = e.row.data['NIVEL_ESTUDIO']
                estudiaRef.current.input.value              = e.row.data['IND_ESTUDIA']
                estudiahoraRef.current.input.value          = e.row.data['IND_ESTUDIA_HORARIO']
                movilpropiaRef.current.input.value          = e.row.data['IND_MOVILIDAD_PROPIA']
                tipomovilRef.current.input.value            = e.row.data['IND_TIPO_MOVILIDAD']
                trabajaRef.current.input.value              = e.row.data['IND_TRABAJA']
                motivsalidaRef.current.input.value          = e.row.data['IND_MOTIVO_SALIDA']
                horariorotaRef.current.input.value          = e.row.data['IND_HORARIO_ROTATIVO']
                experienciaRef.current.input.value          = e.row.data['EXPERIENCIA_LABORAL']
                exfuncionarioRef.current.input.value        = e.row.data['IND_EX_FUNCIONARIO']
                exfuncionariomotsalRef.current.input.value  = e.row.data['IND_EX_FUNCIONARIO_MOT_SAL']
                medioconoofertalaboral.current.input.value  = e.row.data['MEDIO_CON_OFERTA_LABORAL']

                
            console.log("ENTRO EN ELSE IF E");


            }else{
                aptitudesRef.current.input.value            = "";
                pretencionRef.current.input.value           = "";
                nacionalidadRef.current.input.value         = "";  
                tienehijoRef.current.input.value            = ""; 
                direccionRef.current.input.value            = "";
                barrioRef.current.input.value               = "";
                telefonoRef.current.input.value             = "";
                nivelestudioRef.current.input.value         = "";
                estudiaRef.current.input.value              = "";
                estudiahoraRef.current.input.value          = "";
                movilpropiaRef.current.input.value          = "";
                tipomovilRef.current.input.value            = "";
                trabajaRef.current.input.value              = "";
                motivsalidaRef.current.input.value          = "";
                horariorotaRef.current.input.value          = "";
                experienciaRef.current.input.value          = "";
                exfuncionarioRef.current.input.value        = "";
                exfuncionariomotsalRef.current.input.value  = "";
                medioconoofertalaboral.current.input.value  = "";

                
                console.log("ENTRO EN ELSE E");

            }
        }else{
            aptitudesRef.current.input.value            = "";
            pretencionRef.current.input.value           = "";
            nacionalidadRef.current.input.value         = "";
            tienehijoRef.current.input.value            = "";
            direccionRef.current.input.value            = "";
            barrioRef.current.input.value               = "";
            telefonoRef.current.input.value             = "";
            nivelestudioRef.current.input.value         = "";
            estudiaRef.current.input.value              = "";
            estudiahoraRef.current.input.value          = "";
            movilpropiaRef.current.input.value          = "";
            tipomovilRef.current.input.value            = "";
            trabajaRef.current.input.value              = "";
            motivsalidaRef.current.input.value          = "";
            horariorotaRef.current.input.value          = "";
            experienciaRef.current.input.value          = "";
            exfuncionarioRef.current.input.value        = "";
            exfuncionariomotsalRef.current.input.value  = "";
            medioconoofertalaboral.current.input.value  = "";

            console.log("ENTRO EN ELSE FINAL");
        }

        textoexperiencia = experienciaRef
    }


    const addRow = async()=>{
        if(!bandBloqueo){
            let idComponent = getComponenteEliminarDet().id
            let indexRow  = getRowIndex()
            if(indexRow == -1) indexRow = 0
            if(idComponent !== 'NRO_DOCUMENTO') indexRow = 0    
            modifico();
            let initialInput = await initialFormData(true)
            let data = gridCab.current.instance.getDataSource();
            var newKey = uuidID();
            var row    = [0]

            row = [{
                ...initialInput,
                ID	          : newKey,
                IDCOMPONENTE  : "NRO_DOCUMENTO",
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



    return (
        <>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}` }/>
                <div className="paper-header">
                    <Title level={5} className="title-color">
                        {TituloList}
                        <div>
                            <Title level={4} style={{ float: 'right', marginTop: '-16px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</Title>
                        </div>
                    </Title>
                </div>

                <div className='paper-container'>
                        <Main.Paper className="paper-style">
                            <Search
                                addRow={addRow}
                                // eliminarRow={deleteForm}
                                // cancelarProceso={funcionCancelar}
                                formName={FormName}
                                // guardarRow={guardar}
                                // handleChange={handleChange}
                                // onKeyDownBuscar={onKeyDownBuscar}
                                buttonGuardar={buttonSaveRef}
                                buttonAddRef={buttonAddRowRef}
                            />

                            <div style={{padding:'10px'}}>
                                <DevExtremeDet
                                    gridDet             = {gridCab}
                                    columnDet           = {columnsListar}
                                    notOrderByAccion    = {notOrderByAccion}
                                    FormName            = {FormName}
                                    setRowFocusDet      = {setRowFocus}
                                    activateF10         = {false}
                                    activateF6          = {false}
                                    altura              = {'200px'}
                                    columBuscador       = {columBuscador}
                                    doNotsearch         = {doNotsearch}
                                    showBorders         = {false}
                                    nextFocusNew        = {"APTITUDES_REF"}
                                    
                                    // sizePagination      = {10}

                                />

                                <Form autoComplete="off" size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px'}}>
                                    <div style={{ padding: "1px" }}>
                                        <Card>
                                            <Col>
                                                <Row gutter={[3, 3]}>
                                                    <Col span={12} xs={{ order: 1 }}>    
                                                        <Form.Item 
                                                            label= "Aptitudes"
                                                            labelCol={{ span: 7 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="APTITUDES_REF" >
                                                                    <Input
                                                                        ref={aptitudesRef}
                                                                        disabled={false}
                                                                        // autoComplete="off"
                                                                        // className="inputArticuloFamilia"
                                                                        // onChange={handleInputChange}
                                                                        // onKeyDown={handleKeydown}
                                                                    />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 2 }}>
                                                        <Form.Item 
                                                            label= "Pretención"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="PRETENCION_SALARIAL_REF" >
                                                                <Input
                                                                    ref={pretencionRef}
                                                                    autoComplete="off"
                                                                    // disabled={true}
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 3 }}>
                                                        <Form.Item 
                                                            label= "Nacionalidad"
                                                            labelCol={{ span: 7}}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="NACIONALIDAD_REF">
                                                                <Input
                                                                    ref={nacionalidadRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>                                                

                                                    <Col span={12} xs={{ order: 4 }}>
                                                        <Form.Item 
                                                            label= "Tiene hijos?"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_TIENE_HIJO_REF" >
                                                                <Input 
                                                                    ref={tienehijoRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 5 }}>
                                                        <Form.Item 
                                                            label= "Dirección"
                                                            labelCol={{ span: 7 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="DIRECCION_REF" >
                                                                <Input
                                                                    ref={direccionRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 6 }}>
                                                        <Form.Item 
                                                            label= "Barrio"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="BARRIO_REF" >
                                                                <Input
                                                                    ref={barrioRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    
                                                    <Col span={12} xs={{ order: 7 }}>
                                                        <Form.Item 
                                                            label= "Disp. Horario Rotativo?"
                                                            labelCol={{ span: 7 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_HORARIO_ROTATIVO_REF" >
                                                                <Input
                                                                    ref={horariorotaRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 8 }}>
                                                        <Form.Item 
                                                            label= "Teléfono"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="TELEFONO_REF" >
                                                                <Input
                                                                    ref={telefonoRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 9 }}>
                                                        <Form.Item 
                                                            label= "Nivel de estudio"
                                                            labelCol={{ span: 7 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="NIVEL_ESTUDIO_REF" >
                                                                <Input
                                                                    ref={nivelestudioRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 10 }}>
                                                        <Form.Item 
                                                            label= "Estudiando? "
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_ESTUDIA_REF" >
                                                                <Input
                                                                    ref={estudiaRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 11 }}>
                                                        <Form.Item 
                                                            label= "Hora de clases"
                                                            labelCol={{ span: 7 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_ESTUDIA_HORARIO_REF" >
                                                                <Input
                                                                    ref={estudiahoraRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 12 }}>
                                                        <Form.Item 
                                                            label= "Movilidad propia?"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_MOVILIDAD_PROPIA_REF">
                                                                <Input
                                                                    ref={movilpropiaRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 13 }}>
                                                        <Form.Item 
                                                            label= "Tipo de movilidad"
                                                            labelCol={{ span: 7  }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_TIPO_MOVILIDAD_REF" >
                                                                <Input
                                                                    ref={tipomovilRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 14 }}>
                                                        <Form.Item 
                                                            label= "Motivo de salida"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_MOTIVO_SALIDA_REF">
                                                                <Input
                                                                    ref={motivsalidaRef }
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 15 }}>
                                                        <Form.Item 
                                                            label= "Ex Funcionario?"
                                                            labelCol={{ span: 7 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_EX_FUNCIONARIO_REF" >
                                                                <Input
                                                                    ref={exfuncionarioRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 16 }}>
                                                        <Form.Item 
                                                            label= "Trabaja actualmente?"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_TRABAJA_REF" >
                                                                <Input
                                                                    ref={trabajaRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>


                                                    <Col span={12} xs={{ order: 17 }}>
                                                        <Form.Item 
                                                            label= "Mot. de Salida de Empresa"
                                                            labelCol={{ span: 7 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="IND_EX_FUNCIONARIO_MOT_SAL_REF" >
                                                                <Input
                                                                    ref={exfuncionariomotsalRef}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={12} xs={{ order: 18 }}>
                                                        <Form.Item 
                                                            label= "Conocimiento de Oferta"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 20 }}>
                                                            <Form.Item name="MEDIO_CON_OFERTA_LABORAL_REF" >
                                                                <Input
                                                                    ref={medioconoofertalaboral}
                                                                    // disabled={true}
                                                                    autoComplete="off"
                                                                    // className="inputArticuloFamilia"
                                                                />
                                                            </Form.Item>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            
                                            </Col>

                                            

                                        </Card>
                                    </div>

        

                                    <div style={{ padding: "1px" }}>
                                        <Card>
                                          
                                            <Col span={24} style={{paddingLeft:5}}>
                                                <Form.Item label= "Experiencia Laboral" name="EXPERIENCIA_LABORAL_REF">
                                                    <Input value={experienciaRef}
                                                        ref={experienciaRef}
                                                        
                                                        // defaultValue={textoexperiencia}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Card>
                                    </div>
 

                                </Form>
                            </div>



                        </Main.Paper>
                </div>



            </Main.Layout>
        
        
        </>
    )

});

export default POSTULANTES;