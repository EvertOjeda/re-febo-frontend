import React, { useEffect, useState, useRef }   from "react";
import { Redirect }                             from 'react-router-dom';
import Paper 							        from '@material-ui/core/Paper';
import { ButtonForm, TituloForm }               from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import { Request, RequestImg }                  from "../../../../../config/request";
import Layout                                   from "../../../../../components/utils/NewLayout";
import FormModalSearch                          from "../../../../../components/utils/ModalForm/FormModalSearch";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import Main                                     from '../../../../../components/utils/Main';
import NewTableSearch                           from '../../../../../components/utils/NewTableSearch/NewTableSearch';

import {
        Form
    ,   Input
    ,   Button
    ,   Row
    ,   Col
    ,   Image
    ,   Upload
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import { useHotkeys } from 'react-hotkeys-hook';

const { TextArea }  = Input;
const Titulo        = 'Empresa';
// ! =========================== URLs =============================
// * REDIRECCION A LA VISTA TIPO LISTA
const url_lista           = "/bs/empresa";
// * DIRECCION BASE 
const url_post_base       = '/bs/empresas';
// * BUSCADORES
const url_buscar_persona  = '/bs/empresas/buscar/persona';
const url_buscar_moneda   = '/bs/empresas/buscar/moneda';
// * VALIDADORES
const url_valida_persona  = '/bs/empresas/valida/persona';
const url_valida_moneda   = '/bs/empresas/valida/moneda';
const personaColumns = [
    { ID: 'COD_PERSONA' , label: 'Codigo'            , align: 'center'     , minWidth: 40    },
    { ID: 'NOMBRE'      , label: 'Nombre y Apellido' , minWidth: 150      , width:300        ,align: "left" },
    { ID: 'RUC'         , label: 'Ruc'               , minWidth: 60       , align: 'left'   },
];
const monedaColumns = [
    { ID: 'COD_MONEDA'  , label: 'Codigo' , minWidth: 15 , align: 'left' , },
    { ID: 'DESC_MONEDA' , label: 'Moneda' , minWidth: 35 , align: 'left' , },
];
const FormName            = 'BSEMPRES';
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}

//Funcion Principal
const Empresa = ({ history, location, match}) =>{

    const [form]   = Form.useForm();
    const username = sessionStorage.getItem("cod_usuario");
    
    const showsModal = async (valor) => {
        setShows(valor);
    };

    const buttonSaveRef = useRef();
    const buttonExitRef = useRef();
    
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.Volver, (e) =>{ 
        e.preventDefault();
        buttonExitRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    const [empresa          , setEmpresa        ] = useState({}); 
    const [searchColumns    , setSearchColumns  ] = useState({});
    const [searchData       , setSearchData     ] = useState({});
    const [persona          , setPersona        ] = useState({});
    const [moneda           , setMoneda         ] = useState({}); 
    const [state            , setState          ] = useState(false);
    const [auxData          , setAuxData        ] = useState({});  
    const [shows            , setShows          ] = useState(false);
    const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    const [searchType       , setSearchType     ] = useState('');
    const [modalTitle       , setModalTitle     ] = useState('');
    
    const [mensaje          , setMensaje        ] = useState();
    const [visibleMensaje   , setVisibleMensaje ] = useState(false);
    const [isNew            , setIsNew          ] = useState(false);
    const [imagen           , setImagen         ] = useState();
    const [tituloModal      , setTituloModal    ] = useState();

    // ADMINISTRAR FOCUS
    const [codEmpresaFocus          , setCodEmpresaFocus            ] = UseFocus();
    const [descripcionFocus         , setDescripcionFocus           ] = UseFocus();
    const [codMonedaOrigenFocus     , setCodMonedaOrigenFocus       ] = UseFocus();
    const [codPerJuridicaFocus      , setCodPerJuridicaFocus        ] = UseFocus();
    const [tituloReportesFocus      , setTituloReportesFocus        ] = UseFocus();
    const [direccionFocus           , setDireccionFocus             ] = UseFocus();
    // const [rucEmpresaFocus          , setRucEmpresaFocus            ] = UseFocus();
    const [nomRepLegalFocus         , setNomRepLegalFocus           ] = UseFocus();
    const [rucRepLegalFocus         , setRucRepLegalFocus           ] = UseFocus();
    const [nomApoderadoFocus        , setNomApoderadoFocus          ] = UseFocus();
    const [telefonoFocus            , setTelefonoFocus              ] = UseFocus();
    const [encargadoRRHHFocus       , setEncargadoRRHH              ] = UseFocus();
    const [comentarioFocus          , setComentarioFocus            ] = UseFocus();
    const [actividadFocus           , setActividadFocus             ] = UseFocus();
    
    const { params: { id } } = match;
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 }, };

    useEffect(()=>{
        if(id == 'nuevo'){
            setEmpresa({
                ...empresa,
                ['TIPO']: 'I',
                ['USERNAME']: username
            });
            setAuxData({
                ...empresa,
                ['TIPO']: 'I',
                ['USERNAME']: username
            })
            setIsNew(true);
            setTimeout(()=>setCodEmpresaFocus(),500)
        }else{
            if(location.state === undefined){
                history.push(url_lista);
            }else{
                setState(true);
                getData();
            }
        }
    },[]);
    const getData = async() =>{
        try {
            setEmpresa({
                ...location.state.rows,
                ['TIPO']: 'U',
                ['USERNAME']: username
            })
            setAuxData({
                ...location.state.rows,
                ['TIPO']: 'U',
                ['USERNAME']: username
            })
            form.setFieldsValue(location.state.rows);
            setLogo( process.env.REACT_APP_BASEURL + location.state.rows.RUTA_LOGO);
            setTimeout(()=>setDescripcionFocus(),500)         
        } catch (error) {
            console.log(error);
        }
    }
    const getPersona = async() =>{
        let persona
        try {
            var url    = url_buscar_persona;
            var method = 'POST';
            persona    = await Request( url, method,{valor:'null'})
            .then(response => {
                if( response.data.rows.length > 0){
                    setPersona(response.data.rows);
                    return response.data.rows;
                }
            })
            return persona;
        } catch (error) {
            console.log(error);
        }
    }
    const getMoneda = async() =>{
        let moneda
        try {
            var url     = url_buscar_moneda;
            var method  = 'POST';
            moneda      = await Request(url,method,{valor:'null'})
                .then(response => {
                    if( response.data.rows.length > 0){
                        setMoneda(response.data.rows);
                        return response.data.rows;
                    }
                })
            return moneda;
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setEmpresa({
            ...empresa,
            [event.target.name] : event.target.value
        });
    }

    const [ logo   , setLogo    ] = useState('');
    const [ logoAux, setLogoAux ] = useState('');

    const modalSetOnClick = async (datos, BusquedaPor) => {
        if(datos !== "" || datos !== undefined){
            var url   = '';
            var valor = '';
            if( BusquedaPor === 'COD_MONEDA_ORIGEN' ){
                url = url_valida_moneda;
                valor = datos[0]
            }else if( BusquedaPor === 'COD_PER_JURIDICA' ){
                url = url_valida_persona;
                valor = datos[0]
            }
            var method = 'POST';
            var data   = {'valor':valor};
            await Request( url, method, data)
                .then( response =>{
                    if(response.status == 200){
                        if( response.data.outBinds.ret == 1 ){
                            if( BusquedaPor == 'COD_MONEDA_ORIGEN' ){
                                setEmpresa({
                                    ...empresa,
                                    ['DESC_MONEDA'] : response.data.outBinds.desc_moneda,
                                    ['COD_MONEDA_ORIGEN']: valor
                                })
                                setTimeout(()=>setCodPerJuridicaFocus(),100);
                            }
                            if( BusquedaPor === 'COD_PER_JURIDICA' ){
                                setEmpresa({
                                    ...empresa,
                                    ['COD_PER_JURIDICA']        : valor,
                                    ['NOMBRE_PERSONA_JURIDICA'] : response.data.outBinds.desc_persona,
                                    ['RUC_EMPRESA']             : response.data.outBinds.ruc,
                                })
                                setTimeout(()=>setTituloReportesFocus(),100)
                                if(BusquedaPor !== 'blur')
                                    setTituloReportesFocus();
                            }
                        }else{
                            if( BusquedaPor == 'COD_MONEDA_ORIGEN' ){
                                setEmpresa({
                                    ...empresa,
                                    ['COD_MONEDA_ORIGEN']   : '',
                                    ['DESC_MONEDA']         : '',
                                })
                            }
                            if( BusquedaPor == 'COD_PER_JURIDICA' ){
                                setEmpresa({
                                    ...empresa,
                                    ['COD_PER_JURIDICA']        : '',
                                    ['NOMBRE_PERSONA_JURIDICA'] : '',
                                    ['RUC_EMPRESA']             : '',
                                })
                            }
                            showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                        }
                    }
                showsModal(false)
             })
        }
    }
    const callmodal = async(e) =>{
        var url   = '';
        setSearchType(e.target.name);
        if( e.target.name == 'COD_MONEDA_ORIGEN' ){
            url    = url_buscar_moneda;
            var AuxMoneda = await getMoneda();
            setSearchColumns(monedaColumns);
            setSearchData(AuxMoneda);
            setModalTitle('Monedas');
        }
        if( e.target.name == 'COD_PER_JURIDICA' ){
            url    = url_buscar_persona;
            var AuxPersona = await getPersona();
            setSearchColumns(personaColumns);
            setSearchData(AuxPersona);
            setModalTitle('Personas Juridicas');
        }
        var key = e.which;
        if( key == 120){
            setTipoDeBusqueda(e.target.name);
            e.preventDefault();
            setSearchData(await auxData);            
            setShows(true)      
        }
        if(key !== undefined){
            if( key == 13 || key == 9 || e.type == 'blur'){
                e.preventDefault();
                if( e.target.name == 'COD_MONEDA_ORIGEN' ){
                    url = url_valida_moneda;
                }
                if( e.target.name == 'COD_PER_JURIDICA' ){
                    url = url_valida_persona;
                }
                var method = 'POST';
                var data   = {'valor':e.target.value};
                await Request( url, method, data)
                    .then( response =>{
                        if(response.status == 200){
                            if( response.data.outBinds.ret == 1 ){
                                if( e.target.name == 'COD_MONEDA_ORIGEN' ){
                                    setEmpresa({
                                        ...empresa,
                                        ['DESC_MONEDA'] : response.data.outBinds.desc_moneda
                                    })
                                    if(e.type != 'blur')
                                        setCodPerJuridicaFocus();
                                }
                                if( e.target.name == 'COD_PER_JURIDICA' ){
                                    setEmpresa({
                                        ...empresa,
                                        ['NOMBRE_PERSONA_JURIDICA'] : response.data.outBinds.desc_persona,
                                        ['RUC_EMPRESA']             : response.data.outBinds.ruc,
                                    })
                                    if(e.type != 'blur')
                                        setTituloReportesFocus();
                                }
                        }else{
                            if( e.target.name == 'COD_MONEDA_ORIGEN' ){
                                setEmpresa({
                                    ...empresa,
                                    ['COD_MONEDA_ORIGEN']   : '',
                                    ['DESC_MONEDA']         : '',
                                })
                            }
                            if( e.target.name == 'COD_PER_JURIDICA' ){
                                setEmpresa({
                                    ...empresa,
                                    ['COD_PER_JURIDICA']        : '',
                                    ['NOMBRE_PERSONA_JURIDICA'] : '',
                                    ['RUC_EMPRESA']             : '',
                                })
                            }
                            showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                        }
                    }
                })
            }
        }
    }
    const onInteractiveSearch = async(event)=> {
        var url = '';
        var valor = event.target.value;
        valor = valor.trim();

        if(valor.length == 0 ){
            valor = null;
        }

        if( searchType == 'COD_PER_JURIDICA' ){
            url = url_buscar_persona;
            if(valor === null){
                setSearchData(persona);
            }
        }
        if( searchType == 'COD_MONEDA_ORIGEN' ){
            url = url_buscar_moneda;
            if(valor === null){
                setSearchData(moneda);
            }
        }

        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor};
            await Request( url, method, data)
            .then( response => {
                if( response.status == 200 ){
                    if(searchType == 'COD_MONEDA_ORIGEN'){
                        setSearchData(response.data.rows);
                    }
                    if(searchType == 'COD_PER_JURIDICA'){
                        setSearchData(response.data.rows);
                    }
                }
            })
        }
    }
    const handleupload = async(file, fileList) => {
        setEmpresa({
            ...empresa,
            ['RUTA_LOGO'] : file.name,
        });
        setLogo(file);
        setLogoAux(file);
        var files = file,
            imageType = /image.*/;
        if (!files.type.match(imageType)) return;
        var reader = new FileReader();
        reader.onload = fileOnload;
        reader.readAsDataURL(files);
        return false;
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'COD_EMPRESA'){
                setDescripcionFocus();
            }
            if(e.target.name == 'DESCRIPCION'){
                setCodMonedaOrigenFocus();
            }
            if(e.target.name == 'TITULO_REPORTES'){
                setDireccionFocus();
            }
            if(e.target.name == 'DIRECCION'){
                setNomRepLegalFocus();
            }
            if(e.target.name == 'NOM_REP_LEGAL'){
                setRucRepLegalFocus();
            }
            if(e.target.name == 'RUC_REP_LEGAL'){
                setNomApoderadoFocus();
            }
            if(e.target.name == 'NOM_APODERADO'){
                setTelefonoFocus();
            }
            if(e.target.name == 'TELEFONO'){
                setEncargadoRRHH();
            }
            if(e.target.name == 'ENCARGADO_RRHH'){
                setComentarioFocus();
            }
            if(e.target.name == 'COMENTARIO'){
                setActividadFocus();
            }
        }
    }
    function fileOnload(e) {
        var result = e.target.result;
        setLogo(result);
    }
    const onFinish = async() => {
        var url    = url_post_base;
        var method = 'POST';
        await Request( url, method, empresa)
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                if(logoAux.name != undefined ){
                    url = `/bs/empresas/logo/${empresa.COD_EMPRESA}`;
                    await RequestImg( url, method, logoAux )
                    .then( response =>{
                        console.log(response);
                    });
                }
                history.push(url_lista);
            }else{
                showModalMensaje('ERROR!','error',rows.p_mensaje); 
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleCancel = () => {
        setVisibleMensaje(false);
    };
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    };
    const cerrar = () => {
        history.push(url_lista);
    };
    if(id != 'nuevo' && id != 'modificar'){
        return <Redirect to={url_lista}/>
    }

    return (
        <Layout defaultOpenKeys={'BS','BS-BS1'}
                defaultSelectedKeys={"BS-BS1-null-BSEMPRES"}> 
            
            <ModalDialogo 
                    positiveButton={""}
                    negativeButton={"OK"}
                    negativeAction={handleCancel}
                    onClose={handleCancel}
                    setShow={visibleMensaje}
                    title={tituloModal}
                    imagen={imagen}
                    mensaje={mensaje}
                    />

            <FormModalSearch
                showsModal={showsModal}
                setShows={shows}
                title={modalTitle}
                componentData={
                    <NewTableSearch 
                        onInteractiveSearch={onInteractiveSearch}
                        columns={searchColumns}
                        searchData={searchData}
                        modalSetOnClick={modalSetOnClick}
                        tipoDeBusqueda={tipoDeBusqueda}
                    />
                }
                descripcionClose=""
                descripcionButton=""
                actionAceptar=""
            />
            <div className="paper-container">
                <Paper className="paper-style">
                    <TituloForm titulo={Titulo} />
                    <Form
                        {...layout}
                        layout="horizontal"
                        size="small"
                        autoComplete="off"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >   
                        <ButtonForm 
                            dirr={url_lista} 
                            arrayAnterior={auxData} 
                            arrayActual={empresa} 
                            direccionar={cerrar}
                            isNew={isNew}
                            titleModal={"Atención"}
                            mensajeModal={"Los cambios no se han guardados. Desea salir de igual forma?"} 
                            onFinish={onFinish}
                            buttonGuardar={buttonSaveRef}
                            buttonVolver={buttonExitRef}
                            formName={FormName}
                            />
                        <div className="form-container">
                        <Row>
                            <Col span={4}>
                                <div style={{
                                    margin:'15px',
                                    height:"480px",
                                    overflow: "scroll",
                                }}>
                                    {logo
                                        ?   <Image
                                                id="imgSalida"
                                                src={logo}
                                                style={{
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
                                                }}/>
                                        :   <Image
                                                src="error"
                                                fallback="data:image/png;base64,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"
                                            />
                                    }
                                </div>
                            </Col>
                            <Col span={20}>
                                <div style={{
                                            maxHeight:'500px',
                                            overflowY:'auto',
                                            overflowX:'hidden',
                                            padding:'20px'
                                        }}>
                                    <Row gutter={[8]} style={{paddingRight:'10px'}}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Código"
                                                name="COD_EMPRESA"
                                                type="text"
                                                onChange={handleInputChange}
                                                >
                                                <Input 
                                                    name="COD_EMPRESA"
                                                    id="requerido"
                                                    disabled={state} 
                                                    ref={codEmpresaFocus} 
                                                    onKeyDown={handleFocus}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item 
                                                label="Descripción"
                                                name="DESCRIPCION"
                                                onChange={handleInputChange}
                                                >
                                                    <Input 
                                                        name="DESCRIPCION" 
                                                        id="requerido"
                                                        autoComplete="off" 
                                                        ref={descripcionFocus} 
                                                        onKeyDown={handleFocus}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Moneda">
                                                <Input.Group size="small">
                                                    <Row gutter={8}>
                                                        <Col span={6}>
                                                            <Input 
                                                                name="COD_MONEDA_ORIGEN"
                                                                type="number"
                                                                className="search_input"
                                                                value={empresa.COD_MONEDA_ORIGEN}
                                                                onKeyDown={callmodal}
                                                                onChange={handleInputChange}
                                                                onBlur={callmodal}
                                                                ref={codMonedaOrigenFocus}
                                                                />
                                                        </Col>
                                                        <Col span={18}>
                                                            <Input
                                                                disabled={true} 
                                                                value={empresa.DESC_MONEDA}
                                                                />
                                                        </Col>
                                                    </Row>
                                                </Input.Group>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Persona Juridica">
                                                <Input.Group size="small">
                                                    <Row gutter={8}>
                                                        <Col span={6}>
                                                            <Input 
                                                                name="COD_PER_JURIDICA"
                                                                type="number"
                                                                className="search_input"
                                                                value={empresa.COD_PER_JURIDICA}
                                                                onKeyDown={callmodal}
                                                                onChange={handleInputChange}
                                                                onBlur={callmodal}
                                                                ref={codPerJuridicaFocus}
                                                                />
                                                        </Col>
                                                        <Col span={18}>
                                                            <Input
                                                                disabled={true} 
                                                                value={empresa.NOMBRE_PERSONA_JURIDICA}
                                                                />
                                                        </Col>
                                                    </Row>
                                                </Input.Group>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Titulo para reportes"
                                                >
                                                <Input
                                                    name="TITULO_REPORTES"
                                                    type="text"
                                                    value={empresa.TITULO_REPORTES}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    autoComplete="off"
                                                    ref={tituloReportesFocus}
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Dirección"
                                                >
                                                <Input 
                                                    name="DIRECCION"
                                                    type="text"
                                                    value={empresa.DIRECCION}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    ref={direccionFocus}
                                                    autoComplete="off"
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="R.U.C"
                                                >
                                                <Input 
                                                    name="RUC_EMPRESA"
                                                    type="text"
                                                    disabled={true}
                                                    value={empresa.RUC_EMPRESA}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    // ref={rucEmpresaFocus}
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Nom. Rep. Legal"
                                                >
                                                <Input 
                                                    name="NOM_REP_LEGAL"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={empresa.NOM_REP_LEGAL}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    ref={nomRepLegalFocus}
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="RUC Rep. Legal"
                                                >
                                                <Input 
                                                    name="RUC_REP_LEGAL"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={empresa.RUC_REP_LEGAL}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    ref={rucRepLegalFocus}
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Nom. Apoderado"
                                                >
                                                <Input 
                                                    name="NOM_APODERADO"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={empresa.NOM_APODERADO}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    ref={nomApoderadoFocus}
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Telefono"
                                                >
                                                <Input
                                                    name="TELEFONO"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={empresa.TELEFONO}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    ref={telefonoFocus}
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Encargado RRHH"
                                                >
                                                <Input 
                                                    name="ENCARGADO_RRHH"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={empresa.ENCARGADO_RRHH}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    ref={encargadoRRHHFocus}
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item 
                                                label="Logo">
                                                <Upload
                                                    action="#"
                                                    listType="picture"
                                                    maxCount={1}
                                                    beforeUpload={handleupload}
                                                    action="#"
                                                >
                                                    <Button icon={<UploadOutlined />}>Subir</Button>
                                                </Upload>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[8]} style={{paddingRight:'10px'}}>
                                        <Col span={12}>
                                            <Form.Item  label="Comentario:">
                                                <TextArea
                                                    name="COMENTARIO"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={empresa.COMENTARIO}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    ref={comentarioFocus}
                                                    rows={4} 
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item  label="Actividad:">
                                                <TextArea
                                                    name="ACTIVIDAD"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={empresa.ACTIVIDAD}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    ref={actividadFocus}
                                                    rows={4} 
                                                    />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        </div>
                    </Form>
                </Paper>
            </div>
        </Layout>
    );
}

export default Empresa;