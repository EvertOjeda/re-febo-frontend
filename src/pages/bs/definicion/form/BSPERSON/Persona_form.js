import React, { useEffect, useState, useRef } from "react";
import Main     from '../../../../../components/utils/Main';
import buscador from './Funciones/Buscador';
import {  Form                   , Input           , Button     
        , Row                    , Col             , Card    
        , Radio                  , Tabs            , Divider 
        , Table                  , Select          , List   
        , Avatar                 , Empty           } from 'antd';

import { EyeOutlined }          from '@ant-design/icons';
import validaSectorEconomico    from './Funciones/SectorEconomico';
import validaNivelEstudio       from './Funciones/NivelEstudio';
import validaTipoSociedad       from './Funciones/TipoSociedad';
import validaPais               from './Funciones/Pais';
import validaProvincia          from './Funciones/Provincia';
import validaCiudad             from './Funciones/Ciudad';
import validaTipoIdentificacion from './Funciones/TipoIdentificacion';
import validaDocumento          from './Funciones/DocumentoValidador'
import DigitoValidador          from "./Funciones/DigitoValidador";
import validaEstadoCivil        from './Funciones/EstadoCivil';
import validaProfesion          from './Funciones/Profesion';
import Asignar                  from './Buscadores/BuscadorSelect';
import moment from "moment";
import { KeyboardDatePicker,
    MuiPickersUtilsProvider }   from '@material-ui/pickers';
import DateFnsUtils             from '@date-io/date-fns';
import deLocale                 from "date-fns/locale/es";
import DataGrid, { Column, Editing, Paging, Lookup, Sorting, Scrolling  } from 'devextreme-react/data-grid';

import Referencia, { getReferenceRowIndex,  TipoReferenciaData, setGlobalId } from './Componentes/referencia_form';
import _ from "underscore";

const { TextArea } = Input;
const { TabPane }  = Tabs;
const { Option }   = Select;
const Titulo       = 'Persona';
function cellRender(data) {
    return <Button type="primary" icon={<EyeOutlined />} size="small" />;
}

// ! =========================== URLs =============================
// * REDIRECCION A LA VISTA TIPO LISTA
const url_lista                      = "/bs/persona";
// * DIRECCION BASE 
const url_post_base                  = '/bs/personas';
const url_post_base_detail           = '/bs/personas/detalle';

const infoColumns  = [{
        title: 'Tipo',
        dataIndex: 'TIPO',
        key: 'TIPO',
    },
    {
        title: 'Codigo',
        dataIndex: 'CODIGO',
        key: 'CODIGO',
    },
    {
        title: '',
        key: 'action',
        width: 30,
        render: (text, record) => (
            <Button type="primary" icon={<EyeOutlined />} size="small" />
        ),
    }
];
var defaultOpenKeys     = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS','BS-BS1'];
var defaultSelectedKeys = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS-BS1-null-BSPERSON'];
// --- REFERENCIAS
const referenciaBase = [];
const FormName = 'BSPERSON';
const Persona = ({ history, location, match}) =>{
    const { params: { cod_persona } } = match;
    const username = sessionStorage.getItem("cod_usuario");
    // --- FORMULARIO
    const [form]                                                  = Form.useForm();
    // --- BUSCADOR
    const [searchInput              , setSearchInput            ] = useState('');
    const [searchData               , setSearchData             ] = useState([]);
    const [searchColumns            , setSearchColumns          ] = useState([]);
    const [searchType               , setSearchType             ] = useState('');
    const [searchUrl                , setSearchUrl              ] = useState('');
    // --- PRINCIPAL
    const [persona                  , setPersona                ] = useState({});
    const [tipo                     , setTipo                   ] = useState([]); 
    const [referencia               , setReferencia             ] = useState([]);
    const [referenciaAux            , setReferenciaAux          ] = useState([]);
    const [referenciaBorrada        , setReferenciaBorrada      ] = useState([]);
    // --- ADMINISTRAR EL ESTADO
    const [disableState             , setDisabledState          ] = useState(false);
    const [isNew                    , setIsNew                  ] = useState(false);
    const [auxData                  , setAuxData                ] = useState([]); 
    const [fecActualDate            , setFecActualDate          ] = useState("")
    // --- ADMINISTRAR FOCUS
    
    const [nombreFocus              , setNombreFocus            ] = Main.UseFocus();
    const [esFisicaFocus            , setEsFisicaFocus          ] = Main.UseFocus();
    const [nombFantasiaFocus        , setNombFantasiaFocus      ] = Main.UseFocus();
    const [tipoSociedadFocus        , setTipoSociedadFocus      ] = Main.UseFocus();
    const [codSectorFocus           , setCodSectorFocus         ] = Main.UseFocus();
    const [codpaisFocus             , setCodPaisFocus           ] = Main.UseFocus();
    const [codProvinciaFocus        , setCodProvinciaFocus      ] = Main.UseFocus();
    const [codCiudadFocus           , setCodCiudadFocus         ] = Main.UseFocus();
    const [direccionFocus           , setDireccionFocus         ] = Main.UseFocus();
    const [codIdentFocus            , setCodIdentFocus          ] = Main.UseFocus();
    const [nroDocumentoFocus        , setNroDocumentoFocus      ] = Main.UseFocus();
    const [nroDigVerFocus           , setNroDigVerFocus         ] = Main.UseFocus();
    const [rucFocus                 , setRucFocus               ] = Main.UseFocus();
    const [nroCiFocus               , setNroCiFocus             ] = Main.UseFocus();
    const [telefonoFocus            , setTelefonoFocus          ] = Main.UseFocus();
    const [direcElectronicaFocus    , setDirecElectronicaFocus  ] = Main.UseFocus();
    const [paginaWebFocus           , setPaginaWebFocus         ] = Main.UseFocus();
    const [profesionFocus           , setProfesionFocus         ] = Main.UseFocus();
    const [nivelEstudiosFocus       , setNivelEstudiosFocus     ] = Main.UseFocus();
    const [nacionalidadFocus        , setNacionalidadFocus      ] = Main.UseFocus();
    const [tiempoResidenciaFocus    , setTiempoResidenciaFocus  ] = Main.UseFocus();
    const [ciudadResidenciaFocus    , setCiudadResidenciaFocus  ] = Main.UseFocus();
    const [personaResidenciaFocus   , setPersonaResidenciaFocus ] = Main.UseFocus();
    const [referenciaFocus          , setReferenciaFocus        ] = Main.UseFocus();
    const [fecNacimientoFocus       , setFecNacimientoFocus     ] = Main.UseFocus();
    const [sexoFocus                , setSexoFocus              ] = Main.UseFocus();
    const [lugarNacimientoFocus     , setLugarNacimientoFocus   ] = Main.UseFocus();
    const [codEstadoCivilFocus      , setCodEstadoCivilFocus    ] = Main.UseFocus();
    const [conyugueFocus            , setConyugueFocus          ] = Main.UseFocus();
    const [totalIngresosFocus       , setTotalIngresosFocus     ] = Main.UseFocus();
    const [numDependientesFocus     , setNumDependientesFocus   ] = Main.UseFocus();
    const [numHijosFocus            , setNumHijosFocus          ] = Main.UseFocus();
    // --- Para el componente 
    const [tableRowData             , setTableRowData           ] = useState({});
	const [tableRowIndex            , setTableRowIndex          ] = useState();
    // --- MODAL DE MENSAJE
    const [mensaje                  , setMensaje                ] = useState();
    const [imagen                   , setImagen                 ] = useState();
    const [tituloModal              , setTituloModal            ] = useState();
    const [visibleMensaje           , setVisibleMensaje         ] = useState(false);
    // --- MODAL DEL BUSCADOR
    const [modalTitle               , setModalTitle             ] = useState('');
    const [shows                    , setShows                  ] = useState(false);
    // --- AUXILIARES
    const [paisAux                  , setPaisAux                ] = useState();
    const [provinciaAux             , setProvinciaAux           ] = useState();

    var pruebaX = [];
    
    // const layout = {
    //     labelCol: { span: 8 },
    //     wrapperCol: { span: 16 },
    // };

    const handleCancel = () => {
        setVisibleMensaje(false);
    };
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    }
    const showsModal = async (valor) => {
        setShows(valor);
        setSearchInput('');
    };
    useEffect(()=>{
        if(cod_persona == 'nuevo'){
            setPersona({
                ...persona,
                ['TIPO']: 'I',
                ['ES_FISICA']: 'S',
                ['SEXO']: 'M',
                ['FEC_NACIMIENTO']: moment().format('DD/MM/YYYY'),
                ['USERNAME']: username
            });
            setAuxData({
                ...persona,
                ['TIPO']: 'I',
                ['ES_FISICA']: 'S',
                ['SEXO']: 'M',
                ['FEC_NACIMIENTO']: moment().format('DD/MM/YYYY'),
                ['USERNAME']: username
            });
            setIsNew(true);
            setDisabledState(true);
            setNombreFocus();
            setFecActualDate(moment());
        }else{
            if(location.state !== undefined){
                getData();    
            }else{
                history.push(url_lista);
            }
        }
    },[])
    const getData = async() =>{
        setDisabledState(true);
        getBsvPersonaTipo(location.state.rows.COD_PERSONA);
        pruebaX = await getHrReferenciaPersonal(location.state.rows.COD_PERSONA);
        if(pruebaX.length > 0){
            setReferencia(await getHrReferenciaPersonal(location.state.rows.COD_PERSONA));
            setReferenciaAux(await getHrReferenciaPersonal(location.state.rows.COD_PERSONA));
        }else{
            setReferencia(referenciaBase);
            setReferenciaAux(referenciaBase);
        }
        try {
            form.setFieldsValue( await valores());
            setPersona( await valores());
            setAuxData( await valores());
            
            setPaisAux(location.state.rows.COD_PAIS);
            setProvinciaAux(location.state.rows.COD_PROVINCIA); 
            setNombreFocus()
        } catch (error) {
            console.log(error);
        }
    }
    const dateFormat = (fecha) =>{
        if(fecha !== null && fecha.trim() !== ""){
            var dateArray = fecha.split('/')
            return moment(`"${dateArray[0]}.${dateArray[1]}.${dateArray[2]}"`, "DD.MM.YYYY").format()    
        }else{
            return "";
        }
        
    }
    const valores = async() => {
        //seteamos la fecha formateada al formulario cuando es editable
        let fechaDeNacimiento = dateFormat(location.state.rows.FEC_NACIMIENTO)
        setFecActualDate(fechaDeNacimiento);

        return {
            ...location.state.rows,
            ['TIPO']:'U',
            ['USERNAME']:username,
            ['FEC_NACIMIENTO']:location.state.rows.FEC_NACIMIENTO,
            ['REFERENCIAS_PERSONALES']:pruebaX,
        }
    }
    const onInteractiveSearch = async(event)=> {
        setSearchInput(event.target.value);
        var valor = event.target.value;
        if(valor.trim().length === 0 ){
            valor = 'null';
        }
        var data   = {'valor':valor,'cod_pais':persona.COD_PAIS, 'cod_provincia': persona.COD_PROVINCIA};
        buscador( data, setSearchData, searchUrl );
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if(datos !== "" || datos !== undefined){
            const focus = { ['TIPO_SOCIEDAD']           :setCodSectorFocus,
                            ['COD_SECTOR']              :setCodPaisFocus,
                            ['COD_PAIS']                :setCodProvinciaFocus,
                            ['COD_PROVINCIA']           :setCodCiudadFocus,
                            ['COD_CIUDAD']              :setDireccionFocus,
                            ['COD_IDENT']               :setNroDocumentoFocus,
                            ['PROFESION']               :setNivelEstudiosFocus,
                            ['NIVEL_ESTUDIOS']          :setNacionalidadFocus,
                            ['COD_ESTADO_CIVIL']        :setConyugueFocus,
                        }
            
            Asignar(    persona
                    ,   setPersona
                    ,   form
                    ,   BusquedaPor
                    ,   datos
                    ,   showsModal
                    ,   paisAux
                    ,   setPaisAux
                    ,   provinciaAux
                    ,   setProvinciaAux
                    ,   focus
                    )
            
            if(BusquedaPor == 'TIPO_REF'){
                setTimeout( ()=>{
                    document.getElementById('TELEFONO_REF').focus();
                },300 )
            }
            
        }
    }
    const getBsvPersonaTipo = async(id) =>{
        try {
            var cod_empresa = sessionStorage.getItem('cod_empresa');
            var data ={cod_persona:id,cod_empresa}
            var url    = `/bs/personas/tipo`;
            var method = 'POST';
            await Main.Request( url, method,data)
                .then(response => {
                    if( response.data.rows.length > 0){
                        
                        console.log('-->',response)

                        setTipo(response.data.rows);
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }
    const getHrReferenciaPersonal = async(id) =>{
        try {
            var url     = '/bs/personas/referencia';
            var method  = 'POST';
            return await Main.Request(url,method,{cod_persona:id})
                .then(response => {
                    if( response.data.rows.length > 0){
                        return response.data.rows;
                    }else{
                        return [];
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChangeDate = (e)=>{
        var valorFecha = moment(e).format("DD/MM/YYYY")
        if(valorFecha !== null && valorFecha !== 'Invalid date'){ 
            setPersona({
                ...persona,
                ['FEC_NACIMIENTO']:valorFecha
            })
            setFecActualDate(e);
        }
    }
    const handleInputChange = (event)=>{
        if (event.target.name == 'COD_PAIS' || event.target.name == 'COD_IDENT' || event.target.name == 'TIPO_REF'){
            setPersona({
                ...persona,
                [event.target.name] : event.target.value.toUpperCase()
            })
            form.setFieldsValue({
                ...persona,
                [event.target.name] : event.target.value.toUpperCase()
            })
            return;
        }
        setPersona({
            ...persona,
            [event.target.name] : event.target.value
        })
    }
    const handleSelectChange = (value) =>{
        setPersona({
            ...persona,
            ['SEXO'] : value
        })

    }
    const handleFocus = async (e) => {
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if(e.target.name === 'NOMBRE'){
                setEsFisicaFocus();
            }
            if(e.target.name === 'ES_FISICA'){
                setNombFantasiaFocus();
            }
            if(e.target.name === 'NOMB_FANTASIA'){
                setTipoSociedadFocus();
            }
            if(e.target.name === 'DIRECCION'){
                // setCodIdentFocus();
                setTelefonoFocus();
            }
            if(e.target.name === 'TELEFONO'){
                // setDirecElectronicaFocus();
                setCodIdentFocus();
            }  
            // if(e.target.name === 'NRO_DOCUMENTO'){
            //     setNroDigVerFocus();
            // }
            // if(e.target.name === 'NRO_DIG_VER'){
            //     setRucFocus();
            // }
            // if(e.target.name === 'RUC'){
            //     setNroCiFocus();
            // }
            // if(e.target.name === 'NRO_CI'){
            //     setDirecElectronicaFocus();
            // }
                      
            if(e.target.name === 'DIREC_ELECTRONICA'){
                setPaginaWebFocus();
            }
            if(e.target.name === 'NACIONALIDAD'){
                setTiempoResidenciaFocus();
            }
            if(e.target.name === 'TIEMPO_RESIDENCIA'){
                setCiudadResidenciaFocus();
            }
            if(e.target.name === 'CIUDAD_RESIDENCIA'){
                setPersonaResidenciaFocus();
            }
            if(e.target.name === 'PERSONA_RESIDENCIA'){
                setReferenciaFocus();
            }
            if(e.target.name === 'REFERENCIA'){
                document.getElementById('FEC_NACIMIENTO').focus();
            }
            if(e.target.name === 'FEC_NACIMIENTO'){
                setSexoFocus();
            }
            if(e.target.name === 'LUGAR_NACIMIENTO'){
                setCodEstadoCivilFocus();
            }
            if(e.target.name === 'CONYUGUE'){
                setTotalIngresosFocus();
            }
            if(e.target.name === 'TOTAL_INGRESOS'){
                setNumDependientesFocus();
            }
            if(e.target.name === 'NUM_DEPENDIENTES'){
                setNumHijosFocus();
            }
        }
    }

    const grid = useRef();
    const onRowDelete = async() =>{
        let lineaBorrada = await referencia.filter((item) => ( item.ID == form.getFieldValue('globalId') ));
        console.log('Borrado ==> ', lineaBorrada);
        if(lineaBorrada.length > 0){
            setReferenciaBorrada([
                ...referenciaBorrada,
                lineaBorrada[0],
            ]);
            let info = await referencia.filter((item) => ( item.ID != form.getFieldValue('globalId') ));
            setReferencia(info);
            setPersona({
                ...persona,
                ['REFERENCIAS_PERSONALES']: info 
            });
            setTimeout( async()=>{
                var index = await getReferenceRowIndex();
                if(info.length - 1  < index){
                    index = info.length - 1;
                }
                // console.log('Este es el index',index);
                // console.log( await getReferenceRowIndex() )
                var key = await grid.current.instance.getKeyByRowIndex(index);
                var data = referencia.filter((item) => (item.ID == key));
                if(data.length > 0){
                    setGlobalId(key);
                    var desc_tipo_referencia = '';
                    var tipoReferencia = TipoReferenciaData.filter((item) => (item.ID  == data[0].TIP_REFERENCIA));
                    if(tipoReferencia.length == 0){
                        desc_tipo_referencia = '';
                    }else{
                        desc_tipo_referencia = tipoReferencia[0].Name;
                    }
                    form.setFieldsValue({
                        ...form,
                        'REFERENCIA_ID'   : data[0].ID,
                        'NOMBRE_REF'	  : data[0].NOMBRE_REFERENCIA,
                        'TIPO_REF'		  : data[0].TIP_REFERENCIA,
                        'DESC_TIPO_REF'	  : desc_tipo_referencia,
                        'TELEFONO_REF'	  : data[0].TELEFONO,
                        'OBSERVACION_REF' : data[0].OBSERVACION,
                        'globalId' : key,
                    })
                }else{
                    setGlobalId(0);
                    form.setFieldsValue({
                        'REFERENCIA_ID'   : '',
                        'NOMBRE_REF'	  : '',
                        'TIPO_REF'		  : '',
                        'DESC_TIPO_REF'	  : '',
                        'TELEFONO_REF'	  : '',
                        'OBSERVACION_REF' : '',
                    })
                }
            },100 )
        }
    }

    const onChangePersonaFisica = e => {
        setPersona({
            ...persona,
            ['ES_FISICA']: e.target.value
        })
    };
    const onFinish = async() => {
        var url    = url_post_base;
        var method = 'POST';
        try{
            await Main.Request( url, method, persona )
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    if (JSON.stringify(referencia) === JSON.stringify(referenciaAux)){                        
                        direccionar();
                    }else{
                        setPersona({
                            ...persona,
                            ['COD_PERSONA']:rows.p_cod_personaNuevo
                        })
                        insertDetail(rows.p_cod_personaNuevo);
                    }
                }else{
                    showModalMensaje("Error!","error",response.data.p_mensaje);
                }
            });
        } catch (error) {
            showModalMensaje("Error!","error",error);
        }
    };
    const ModificarIdReferencia = async(info,codigo) => {
        if(info.length > 0){
            for (let i = 0; i < info.length; i++) {
                info[i]['ID']          = codigo + '-' + info[i].NRO_ORDEN;
                info[i]['COD_PERSONA'] = codigo;
            }
        }
        return info;
    }
    const insertDetail = async(cod_persona) => {
        var url        = url_post_base_detail;
        var method     = 'POST';
        var codigo     = cod_persona
        if(persona.TIPO == 'U'){
            codigo = persona.COD_PERSONA;
        }
        
        // console.log('entro aqui ****    ==> ', codigo);
        console.log('Referencia Borrada ==> ', referenciaBorrada);

        var Referecias = await ModificarIdReferencia(referencia, codigo);
        var Borrados   = await ModificarIdReferencia(referenciaBorrada, codigo);
        var data       = {
                persona
            ,   Referecias
            ,   Borrados
        }
        try{
            await Main.Request( url, method, data )
            .then(async(response) => {
                var rows = response.data;
                for (let i = 0; i < rows.length; i++) {
                    const element = rows[i];
                    if(element.ret == 0){
                        showModalMensaje("Error!","error",element.p_mensaje);
                        break;
                    }
                    if(rows.length -1 == i){
                        direccionar();
                    }
                }
            });
        } catch (error) {
            showModalMensaje("Error!","error",error);
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const formularioReferencia = () => {
        setPersona({
            ...persona,
            ['REFERENCIA_ID']   : '',
            ['NOMBRE_REF']      : '',
            ['TIPO_REF']        : '',
            ['DESC_TIPO_REF']   : '',
            ['TELEFONO_REF']    : '',
            ['OBSERVACION_REF'] : '',
        })
    }

    const buttonGuardar = useRef();
    const buttonVolver  = useRef();
    
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        var infoPermiso = Main.VerificaPermiso(FormName);
        var band = true;
        var mensaje = ''

        console.log(infoPermiso);
        console.log(persona.TIPO);
    
        if(persona.TIPO === 'I'){
            if(infoPermiso[0].insertar != 'S'){
                band = false;
                mensaje = 'No tienes permiso para insertar'
            }
        }
        if(persona.TIPO === 'U'){
            if(infoPermiso[0].actualizar != 'S'){
                band = false;
                mensaje = 'No tienes permiso para actualizar'
            }
        }
        if(band){
            buttonGuardar.current.click();
        }else{
            Main.message.warning({
              content  : mensaje,
              className: 'custom-class',
              duration : `${2}`,
              style    : {
              marginTop: '4vh',
              },
            });
        }
        return;
        // buttonGuardar.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.Volver, (e) =>{ 
        e.preventDefault();
        buttonVolver.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPDUT','TEXTAREA']});
    
    const direccionar = () =>{
        history.push(url_lista);
    }

    const onFocusedCellChanging = (e) => {  
		e.isHighlighted = false;  
	}
    
    return (
        <>
            <Main.ModalDialogo 
                positiveButton={""}
                negativeButton={"OK"}
                negativeAction={handleCancel}
                onClose={handleCancel}
                setShow={visibleMensaje}
                title={tituloModal}
                imagen={imagen}
                mensaje={mensaje}/>
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
                        tipoDeBusqueda={searchType}/>
                }
                descripcionClose=""
                descripcionButton=""
                actionAceptar=""/>
        <Main.Layout defaultOpenKeys={defaultOpenKeys}
                defaultSelectedKeys={defaultSelectedKeys}>
            
            <div className="paper-container" >
                <Main.Paper className="paper-style" >
                    <Main.TituloForm titulo={Titulo} />
                    <Form
                        // {...layout}
                        layout="horizontal"
                        size="small"
                        autoComplete="off"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >   
                        <Main.ButtonForm  
                            dirr={url_lista} 
                            arrayAnterior={auxData} 
                            arrayActual={persona} 
                            direccionar={direccionar}
                            isNew={isNew}
                            titleModal={"Atención"}
                            mensajeModal={"Los cambios no se han guardados. Desea salir de igual forma?"}
                            onFinish={onFinish}
                            buttonGuardar={buttonGuardar}
                            buttonVolver={buttonVolver}
                            //
                            visibleDeleteButton={true}
                            FunctionNameButtonDelete={onRowDelete}
                            // 
                            formName={FormName}
                            /> 
                        <div className="form-container">
                        <Row>
                            <Col span={3}>
                                <Card>
                                    <label>Codigo</label>
                                    <Form.Item 
                                        name="COD_PERSONA"
                                        type="text"
                                        wrapperCol={{span:"24"}}>
                                        <Input 
                                            name="COD_PERSONA"
                                            disabled={disableState}/>
                                    </Form.Item>
                                </Card>
                            </Col>
                            <Col span={21}>
                                <Row>
                                    <Col span={19}>
                                        <Form.Item 
                                            name="NOMBRE"
                                            label="Nombre" 
                                            labelCol={{span:5}} 
                                            wrapperCol={{span:20}}>
                                            <Input 
                                                name="NOMBRE"
                                                id="requerido"
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                                ref={nombreFocus} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5} style={{
                                        textAlign: 'center',
                                    }}>
                                        <Radio.Group 
                                            name="ES_FISICA"
                                            onChange={onChangePersonaFisica}
                                            value={persona.ES_FISICA}>
                                            <Radio 
                                                value={'S'} 
                                                onKeyDown={handleFocus}
                                                ref={esFisicaFocus}>Fisica</Radio>
                                            <Radio 
                                                value={'N'}
                                                onKeyDown={handleFocus}>Juridica</Radio>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item 
                                            name="NOMB_FANTASIA" 
                                            label="Nombre Fantasia"
                                            labelCol={{span:4}} 
                                            wrapperCol={{span:20}} >
                                            <Input 
                                                name="NOMB_FANTASIA"
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                                ref={nombFantasiaFocus}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Tabs> 
                            <TabPane tab="Datos Personales" key="1">
                                <Row gutter={8}>
                                    <Col span={8}>
                                        <Row >
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Tip. Sociedad"
                                                    name="TIPO_SOCIEDAD"
                                                    labelCol={{span:15}}
                                                    wrapperCol={{span:9}}
                                                    >
                                                    <Input 
                                                        name="TIPO_SOCIEDAD"
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> validaTipoSociedad(   e, 
                                                                                                persona, 
                                                                                                setPersona, 
                                                                                                form, 
                                                                                                setTipoSociedadFocus, 
                                                                                                setCodSectorFocus,
                                                                                                showModalMensaje,
                                                                                                setSearchColumns,
                                                                                                setSearchData,
                                                                                                setModalTitle,
                                                                                                setShows,
                                                                                                setSearchType,
                                                                                                setSearchUrl,
                                                                                                )}
                                                        type="number"
                                                        className="search_input"
                                                        id="requerido"
                                                        ref={tipoSociedadFocus}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={14}>
                                                <Form.Item
                                                    label=""
                                                    name="DESC_TIPO_SOCIEDAD"
                                                    type="text"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input name="DESC_TIPO_SOCIEDAD" disabled/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Sector"
                                                    name="COD_SECTOR"
                                                    labelCol={{span:15}}
                                                    wrapperCol={{span:9}}
                                                    >
                                                    <Input 
                                                        name="COD_SECTOR"
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> validaSectorEconomico(    e, 
                                                                                                    persona, 
                                                                                                    setPersona,
                                                                                                    form, 
                                                                                                    setCodSectorFocus, 
                                                                                                    setCodPaisFocus,
                                                                                                    showModalMensaje,
                                                                                                    setSearchColumns,
                                                                                                    setSearchData,
                                                                                                    setModalTitle,
                                                                                                    setShows,
                                                                                                    setSearchType,
                                                                                                    setSearchUrl
                                                                                                    )}
                                                        type="number"
                                                        className="search_input"
                                                        id="requerido"
                                                        ref={codSectorFocus}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={14}>
                                                <Form.Item
                                                    label=""
                                                    name="DESC_SECTOR"
                                                    type="text"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input
                                                        name="DESC_SECTOR" disabled/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item
                                                    name="COD_PAIS"
                                                    label="Pais"
                                                    labelCol={{span:15}}
                                                    wrapperCol={{span:9}}
                                                    >
                                                    <Input 
                                                        name="COD_PAIS"
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> validaPais(   e, 
                                                                                        persona, 
                                                                                        setPersona,
                                                                                        paisAux,
                                                                                        setPaisAux,
                                                                                        setProvinciaAux,
                                                                                        form, 
                                                                                        setCodPaisFocus, 
                                                                                        setCodProvinciaFocus,
                                                                                        showModalMensaje,
                                                                                        setSearchColumns,
                                                                                        setSearchData,
                                                                                        setModalTitle,
                                                                                        setShows,
                                                                                        setSearchType,
                                                                                        setSearchUrl
                                                                                        )}
                                                        id="requerido"
                                                        ref={codpaisFocus}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={14}>
                                                <Form.Item
                                                    label=""
                                                    name="DESC_PAIS"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input name="DESC_PAIS" disabled/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Dpto."
                                                    name="COD_PROVINCIA"
                                                    labelCol={{span:15}}
                                                    wrapperCol={{span:9}}
                                                    >
                                                    <Input 
                                                        name="COD_PROVINCIA" 
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> validaProvincia(  e, 
                                                                                            persona, 
                                                                                            setPersona, 
                                                                                            provinciaAux,
                                                                                            setProvinciaAux,
                                                                                            paisAux,
                                                                                            form, 
                                                                                            setCodProvinciaFocus, 
                                                                                            setCodCiudadFocus,
                                                                                            showModalMensaje,
                                                                                            setSearchColumns,
                                                                                            setSearchData,
                                                                                            setModalTitle,
                                                                                            setShows,
                                                                                            setSearchType,
                                                                                            setSearchUrl
                                                                                            )}
                                                        type="number"
                                                        className="search_input"
                                                        id="requerido"
                                                        ref={codProvinciaFocus}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={14}>
                                                <Form.Item
                                                    label=""
                                                    name="DESC_PROVINCIA"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input name="DESC_PROVINCIA" disabled/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Ciudad"
                                                    name="COD_CIUDAD"
                                                    labelCol={{span:15}}
                                                    wrapperCol={{span:9}}
                                                    >
                                                    <Input 
                                                        name="COD_CIUDAD" 
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> validaCiudad( e, 
                                                                                        persona, 
                                                                                        setPersona,
                                                                                        form, 
                                                                                        setCodCiudadFocus, 
                                                                                        setDireccionFocus,
                                                                                        showModalMensaje,
                                                                                        setSearchColumns,
                                                                                        setSearchData,
                                                                                        setModalTitle,
                                                                                        setShows,
                                                                                        setSearchType,
                                                                                        setSearchUrl
                                                                                        )}
                                                        type="number"
                                                        className="search_input"
                                                        id="requerido"
                                                        ref={codCiudadFocus}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={14}>
                                                <Form.Item
                                                    label=""
                                                    name="DESC_CIUDAD"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input name="DESC_CIUDAD" disabled/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Direccion"
                                                    name="DIRECCION"
                                                    labelCol={{span:6}}
                                                    wrapperCol={{span:18}}
                                                    >
                                                    <Input
                                                        name="DIRECCION" 
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        // rows={4}
                                                        ref={direccionFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Telefono"
                                                    name="TELEFONO"
                                                    labelCol={{span:6}}
                                                    wrapperCol={{span:18}}
                                                    >
                                                    <Input 
                                                        name="TELEFONO"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={telefonoFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={8} style={{marginTop:'-25px'}} >
                                        <Divider orientation="left">
                                            Identificación
                                        </Divider>
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Tipo"
                                                    name="COD_IDENT"
                                                    labelCol={{span:14, offset:3}}
                                                    wrapperCol={{span:10}}
                                                    >
                                                    <Input 
                                                        name="COD_IDENT"
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> validaTipoIdentificacion( e, 
                                                                                                    persona, 
                                                                                                    setPersona,
                                                                                                    form, 
                                                                                                    setCodIdentFocus, 
                                                                                                    setNroDocumentoFocus,
                                                                                                    showModalMensaje,
                                                                                                    setSearchColumns,
                                                                                                    setSearchData,
                                                                                                    setModalTitle,
                                                                                                    setShows,
                                                                                                    setSearchType,
                                                                                                    setSearchUrl
                                                                                                    )}
                                                        id="requerido"
                                                        ref={codIdentFocus}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={14}>
                                                <Form.Item
                                                    label=""
                                                    name="DESC_IDENT"
                                                    type="text"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input name="DESC_IDENT" disabled/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Documento"
                                                    name="NRO_DOCUMENTO"
                                                    labelCol={{span:6, offset:1}}
                                                    wrapperCol={{span:18}}
                                                    >
                                                    <Input 
                                                        name="NRO_DOCUMENTO"
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> validaDocumento( e, 
                                                                                           persona, 
                                                                                           setPersona,
                                                                                           form, 
                                                                                           setNroDocumentoFocus, 
                                                                                           setNroDigVerFocus,
                                                                                           showModalMensaje,
                                                                                        )}
                                                        id="requerido"
                                                        ref={nroDocumentoFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Digito Verif."
                                                    name="NRO_DIG_VER"
                                                    labelCol={{span:6, offset:1}}
                                                    wrapperCol={{span:18}}
                                                    >
                                                    <Input
                                                        name="NRO_DIG_VER"
                                                        type="number"
                                                        className="search_input"
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> DigitoValidador( e, 
                                                                                           persona, 
                                                                                           setNroDigVerFocus, 
                                                                                           setDirecElectronicaFocus,
                                                                                           showModalMensaje,
                                                        )}
                                                        ref={nroDigVerFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Email"
                                                    name="DIREC_ELECTRONICA"
                                                    labelCol={{span:7}}
                                                    wrapperCol={{span:17}}
                                                    >
                                                    <Input 
                                                        name="DIREC_ELECTRONICA"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={direcElectronicaFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Web"
                                                    name="PAGINA_WEB"
                                                    labelCol={{span:7}}
                                                    wrapperCol={{span:17}}
                                                    >
                                                    <Input
                                                        name="PAGINA_WEB"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={paginaWebFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={8} style={{marginTop:'-25px'}} >
                                        <Divider orientation="left">La persona esta definida como</Divider>
                                        <Row gutter={8}>
                                            <Col span={1}></Col>
                                            <Col span={23}>
                                            <div className="datagridPersona">
                                                <DataGrid
                                                    dataSource={tipo}
                                                    keyExpr={"ID"}
                                                    height="152px"
                                                    focusedRowEnabled={true}
                                                    autoNavigateToFocusedRow={false}
                                                    onFocusedCellChanging={onFocusedCellChanging}
                                                    style={{
                                                        marginBottom: '8px',
                                                    }}
                                                    >
                                                        <Sorting mode="none" />
                                                        <Scrolling mode="infinite" />
                                                        <Column dataField="CODIGO" caption="Código" width={60} alignment="left"/>
                                                        <Column dataField="TIPO"   caption="Tipo" />
                                                        <Column caption=" "        cellRender={cellRender} width={50}/>
                                                    </DataGrid>
                                                </div>
                                         </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Referencia
                                    referencia={referencia}
                                    referenciaAux={referenciaAux}
                                    referenciaBorrada={referenciaBorrada}
                                    tableRowData={tableRowData}
                                    setTableRowData={setTableRowData}
                                    tableRowIndex={tableRowIndex}
                                    setTableRowIndex={setTableRowIndex}
                                    setReferencia={setReferencia}
                                    setReferenciaBorrada={setReferenciaBorrada}
                                    persona={persona}
                                    setPersona={setPersona}
                                    cod_persona={persona.COD_PERSONA}
                                    form={form}
                                    handleInputChange={handleInputChange}
                                    formularioReferencia={formularioReferencia}
                                    grid={grid}
                                    //---
                                    setSearchColumns={setSearchColumns}
                                    setSearchData={setSearchData}
                                    setModalTitle={setModalTitle}
                                    setShows={setShows}
                                    setSearchType={setSearchType}
                                    setSearchUrl={setSearchUrl}
                                    />
                            </TabPane>
                            <TabPane tab="Otros Datos Personales" key="2">
                                <Row>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item label={<label style={{width:'130px'}}>Profesión</label>} >
                                                    <Form.Item name="PROFESION" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                                        <Input 
                                                            name="PROFESION"
                                                            type="number"
                                                            className="search_input"
                                                            onChange={handleInputChange}
                                                            onKeyDown={ (e)=> validaProfesion(  e, 
                                                                                                persona, 
                                                                                                setPersona, 
                                                                                                form, 
                                                                                                setProfesionFocus, 
                                                                                                setNivelEstudiosFocus,
                                                                                                showModalMensaje,
                                                                                                setSearchColumns,
                                                                                                setSearchData,
                                                                                                setModalTitle,
                                                                                                setShows,
                                                                                                setSearchType,
                                                                                                setSearchUrl
                                                                                                )}
                                                            ref={profesionFocus}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item name="DESC_PROFESION" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                                        <Input name="DESC_PROFESION"/>
                                                    </Form.Item>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item label={<label style={{width:'130px'}}>Nivel de Estudios</label>}>
                                                    <Form.Item name="NIVEL_ESTUDIOS" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                                        <Input 
                                                            name="NIVEL_ESTUDIOS"
                                                            type="number"
                                                            className="search_input"
                                                            onChange={handleInputChange}
                                                            onKeyDown={ (e)=> validaNivelEstudio(   e, 
                                                                                                    persona, 
                                                                                                    setPersona, 
                                                                                                    form, 
                                                                                                    setNivelEstudiosFocus, 
                                                                                                    setNacionalidadFocus,
                                                                                                    showModalMensaje,
                                                                                                    setSearchColumns,
                                                                                                    setSearchData,
                                                                                                    setModalTitle,
                                                                                                    setShows,
                                                                                                    setSearchType,
                                                                                                    setSearchUrl
                                                                                                )}
                                                            ref={nivelEstudiosFocus}/>
                                                    </Form.Item>
                                                    <Form.Item name="DESC_NIVEL_ESTUDIOS" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                                        <Input name="DESC_NIVEL_ESTUDIOS" disabled/>
                                                    </Form.Item>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item name="NACIONALIDAD" label={<label style={{width:'130px'}}>Nacionalidad</label>}>
                                                    <Input 
                                                        name="NACIONALIDAD"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={nacionalidadFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item name="TIEMPO_RESIDENCIA" label={<label style={{width:'130px'}}>Tiempo Residencia</label>}>
                                                    <Input 
                                                        name="TIEMPO_RESIDENCIA"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={tiempoResidenciaFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item name="CIUDAD_RESIDENCIA" label={<label style={{width:'130px'}}>Lugar Recidencia</label>}>
                                                    <Input 
                                                        name="CIUDAD_RESIDENCIA"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={ciudadResidenciaFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item name="PERSONA_RESIDENCIA" label={<label style={{width:'130px'}}>Casa/Local</label>}>
                                                    <Input
                                                        name="PERSONA_RESIDENCIA"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={personaResidenciaFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item name="REFERENCIA" label={<label style={{width:'130px'}}>Observaciones</label>}>
                                                    <TextArea
                                                        name="REFERENCIA"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        rows={3}
                                                        ref={referenciaFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={14}>
                                                <Form.Item
                                                    label="Fecha Nacimiento"
                                                    name="FEC_NACIMIENTO"
                                                    labelCol={{span:12}}
                                                    wrapperCol={{span:12}}
                                                    >
                                                <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                                                    <KeyboardDatePicker
                                                        name="FEC_NACIMIENTO"
                                                        id="FEC_NACIMIENTO"
                                                        onKeyDown={handleFocus}
                                                        disableToolbar
                                                        variant="inline"
                                                        format={'dd/MM/yyyy'}
                                                        value={fecActualDate === "" ? null : fecActualDate }
                                                        emptyLabel="__/__/___"
                                                        maxDateMessage={false}
                                                        minDateMessage={false}
                                                        invalidDateMessage={false}
                                                        disableFuture={true}
                                                        onChange={ (e) => handleInputChangeDate(e)}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                </MuiPickersUtilsProvider>
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Sexo"
                                                    labelCol={{span:6}}
                                                    wrapperCol={{span:18}}
                                                    >
                                                    <Select defaultValue={persona.SEXO} style={{ width: '100%' }} 
                                                            ref={sexoFocus}
                                                            onChange={handleSelectChange}>
                                                        <Option value="M">Masculino</Option>
                                                        <Option value="F">Femenino</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Lug. Nacimiento"
                                                    name="LUGAR_NACIMIENTO"
                                                    labelCol={{span:6, offset:1}}
                                                    wrapperCol={{span:18}}
                                                    >
                                                    <Input 
                                                        name="LUGAR_NACIMIENTO"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={lugarNacimientoFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={8}>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Estado Civil"
                                                    name="COD_ESTADO_CIVIL"
                                                    labelCol={{span:13, offset:4}}
                                                    wrapperCol={{span:10}}
                                                    >
                                                    <Input
                                                        name="COD_ESTADO_CIVIL"
                                                        type="number"
                                                        className="search_input"
                                                        onChange={handleInputChange}
                                                        onKeyDown={ (e)=> validaEstadoCivil(e, 
                                                                                            persona, 
                                                                                            setPersona,
                                                                                            form, 
                                                                                            setCodEstadoCivilFocus, 
                                                                                            setConyugueFocus,
                                                                                            showModalMensaje,
                                                                                            setSearchColumns,
                                                                                            setSearchData,
                                                                                            setModalTitle,
                                                                                            setShows,
                                                                                            setSearchType,
                                                                                            setSearchUrl
                                                                                            )}
                                                        ref={codEstadoCivilFocus}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={14}>
                                                <Form.Item
                                                    label=""
                                                    name="DESC_ESTADO_CIVIL"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input name="DESC_ESTADO_CIVIL" disabled/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={8}>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Conyugue"
                                                    name="CONYUGUE"
                                                    labelCol={{span:7}}
                                                    wrapperCol={{span:17}}
                                                    >
                                                    <Input
                                                        name="CONYUGUE"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={conyugueFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}></Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Total Ingreso"
                                                    name="TOTAL_INGRESOS"
                                                    labelCol={{span:10}}
                                                    wrapperCol={{span:14}}
                                                    >
                                                    <Input
                                                        name="TOTAL_INGRESOS"
                                                        type="number"
                                                        className="search_input"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={totalIngresosFocus}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}></Col>
                                            <Col span={12}>
                                                <Row>
                                                    <Col span={16}>
                                                    <Form.Item
                                                        label="Dependientes"
                                                        name="NUM_DEPENDIENTES"
                                                        labelCol={{span:14, offset:1}}
                                                        wrapperCol={{span:6}}
                                                        >
                                                        <Input
                                                            name="NUM_DEPENDIENTES"
                                                            type="number"
                                                            className="search_input"
                                                            onChange={handleInputChange}
                                                            onKeyDown={handleFocus}
                                                            ref={numDependientesFocus}/>
                                                    </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                    <Form.Item
                                                        label="Hijos"
                                                        name="NUM_HIJOS"
                                                        labelCol={{span:12}}
                                                        wrapperCol={{span:12}}
                                                        >
                                                        <Input
                                                            name="NUM_HIJOS"
                                                            type="number"
                                                            className="search_input"
                                                            onChange={handleInputChange}
                                                            onKeyDown={handleFocus}
                                                            ref={numHijosFocus}/>
                                                    </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Divider orientation="left" plain>LUGAR DE TRABAJO</Divider>
                                        <Row>
                                            <Col span={14}>
                                                <Form.Item name="LUGAR_TRABAJO" label={<label style={{width:'130px'}}>Empresa</label>}>
                                                    <Input name="LUGAR_TRABAJO" onChange={handleInputChange}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item name="TELEFONO_TRAB" label={<label style={{width:'80px'}}>Teléfono</label>}>
                                                    <Input name="TELEFONO_TRAB" onChange={handleInputChange}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {/* <Row>
                                            <Col span={14}>
                                                <Form.Item label={<label style={{width:'130px'}}>Sector</label>}>
                                                    <Form.Item name="COD_SECTOR_TRAB" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                                        <Input name="COD_SECTOR_TRAB" onChange={handleInputChange}/>
                                                    </Form.Item>
                                                    <Form.Item name="DESC_SECTOR_TRAB" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                                        <Input disabled/>
                                                    </Form.Item>
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item name="CARGO" label={<label style={{width:'80px'}}>Cargo</label>}>
                                                    <Input name="CARGO" onChange={handleInputChange}/>
                                                </Form.Item>
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col span={14}>
                                                <Form.Item name="DIRECCION_TRAB" label={<label style={{width:'130px'}}>Dirección</label>}>
                                                    <Input name="DIRECCION_TRAB" onChange={handleInputChange}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item name="ANTIGUEDAD" label={<label style={{width:'80px'}}>Atigüedad</label>}>
                                                    <Input name="ANTIGUEDAD" onChange={handleInputChange}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        
                                        
                                        
                                        
                                    </Col>
                                </Row>
                                
                            </TabPane>
                        </Tabs>
                        </div>
                    </Form>
                </Main.Paper>
            </div>
        </Main.Layout>
        </>
    );
}

export default Persona;