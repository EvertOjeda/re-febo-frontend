import React, { useEffect, useState, useRef} from "react";
import Main                          from "../../../../../components/utils/Main";
import {Form
    ,   Input
    ,   Checkbox
    ,   Row
    ,   Card
    ,   Col
} from 'antd';


//BUSCADORES
var url_buscar_grupo       = '/bs/acceso_de_grupos/buscar/grupo';
var url_buscar_modulo      = '/bs/acceso_de_grupos/buscar/modulo';
var url_buscar_formulario  = '/bs/acceso_de_grupos/buscar/formulario';

//VALIDADORES
var url_valida_grupo       = '/bs/acceso_de_grupos/valida/grupo';
var url_valida_modulo      = '/bs/acceso_de_grupos/valida/modulo';
var url_valida_formulario  = '/bs/acceso_de_grupos/valida/formulario';

const valoresCheck  = ['S','N'];
const Titulo        = 'Accesos de los grupos a los formularios';
const searchsColumns = [
    { ID: 'CODIGO'          , label: 'Codigo'           , align: 'center'    , width: 80 },
    { ID: 'DESCRIPCION'     , label: 'Descripcion'      , minWidth: 150                  },
];
const defaultOpenKeys     = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS','BS-BS2','BS-BS2-BS21'];
const defaultSelectedKeys = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS-BS2-BS21-BSACCGRP'];
const FormName            = 'BSACCGRP';
//Funcio Principal
const AccesoDeGrupos = ({ history, location, match}) =>{
    const [form]        = Form.useForm();
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

    const [acceso           , setAcceso             ] = useState({}); 
    const [state            , setState              ] = useState(false);
    const [auxData          , setAuxData            ] = useState({});  
    const [mensaje          , setMensaje            ] = useState();
    const [icono            , setIcono              ] = useState();
    const [visibleMensaje   , setVisibleMensaje     ] = useState(false);
    const [isNew            , setIsNew              ] = useState(false);
    const [tituloModal      , setTituloModal        ] = useState();
    const [searchColumns    , setSearchColumns      ] = useState({});
    const [searchData       , setSearchData         ] = useState({});
    const [modalTitle       , setModalTitle         ] = useState('');
    const [shows            , setShows              ] = useState(false);
    const [tipoDeBusqueda   , setTipoDeBusqueda     ] = useState();
    const [auxDescModulo    , setAuxDescModulo      ] = useState();

    const dirr  = "/bs/acceso_de_grupos";

    // ADMINISTRAR FOCUS
    const [codGrupoFocus            , setCodGrupoFocus              ] = Main.UseFocus();
    const [codModuloFocus           , setCodModuloFocus             ] = Main.UseFocus();
    const [nomFormaFocus            , setNomFormaFocus              ] = Main.UseFocus();
    const [puedeInsertarFocus       , setPuedeInsertarFocus         ] = Main.UseFocus();
    const [puedeActualizarFocus     , setPuedeActualizarFocus       ] = Main.UseFocus();
    const [puedeBorrarFocus         , setPuedeBorrarFocus           ] = Main.UseFocus();
    const [puedeConsultarFocus      , setPuedeConsultarFocus        ] = Main.UseFocus();
    
    const { params: { id } } = match;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(()=>{
        
        if(id == 'nuevo'){
            setState(false);
            setAcceso(valoresNuevo());
            setAuxData(valoresNuevo());
            form.setFieldsValue(valoresNuevo());
            setCodGrupoFocus();
            setIsNew(true);
        }else{
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setState(true);
                setIsNew(false);
                getData();
                setPuedeInsertarFocus();
                setAuxDescModulo(location.state.rows.COD_MODULO);
            }
        }

    },[])
    const getData = async() =>{
        try {
            setAcceso(valores());
            setAuxData(valores());
            form.setFieldsValue(valores());
            setTimeout(setNomFormaFocus, 100);
        } catch (error) {
            console.log(error);
        }
    }
    const valores = () => {
        return {
            ...location.state.rows,
            ['TIPO']: 'U',
            ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
            ['USERNAME']   : sessionStorage.getItem('cod_usuario'),
        }
    }
    const valoresNuevo = () => {
        return {
            ['TIPO']                : 'I',
            ['PUEDE_INSERTAR']      : 'N',
            ['PUEDE_ACTUALIZAR']    : 'N',
            ['PUEDE_BORRAR']        : 'N',
            ['PUEDE_CONSULTAR']     : 'N',
            ['COD_GRUPO']           : '',
            ['DESC_GRUPO']          : '',
            ['COD_MODULO']          : '',
            ['DESC_MODULO']         : '',
            ['NOM_FORMA']           : '',
            ['DESC_FORMA']          : '',
            ['COD_EMPRESA']         : sessionStorage.getItem('cod_empresa'),
            ['USERNAME']            : sessionStorage.getItem('cod_usuario'),
        }
    }
    const getGrupo = async() =>{
        try {
            var url     = url_buscar_grupo;
            var method  = 'POST';
            var info    = [];
            await Main.Request(url,method,{valor:'null'}).then(response => {
                if( response.data.rows.length > 0){
                    info =response.data.rows;
                }
            });
            return info;
        } catch (error) {
            console.log(error);
        }
    }
    const getModulo = async() =>{
        try {
            var url     = url_buscar_modulo;
            var method  = 'POST';
            var info    = [];
            await Main.Request(url,method,{valor:'null'}).then(response => {
                if( response.data.rows.length > 0){
                    info = response.data.rows;
                }
            })
            return info;
        } catch (error) {
            console.log(error);
        }
    }
    const getForma = async() =>{
        try {
            var url     = url_buscar_formulario;
            var method  = 'POST';
            var info    = [];
            await Main.Request(url,method,{valor:'null','COD_MODULO':acceso.COD_MODULO}).then(response => {
                if( response.data.rows.length > 0){
                    info = response.data.rows
                }
            });
            return info;
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setAcceso({
            ...acceso,
            [event.target.name] : event.target.value.toUpperCase(),
        });
        form.setFieldsValue({
            ...acceso,
            [event.target.name] : event.target.value.toUpperCase(),
        });
    }
    const marcarCheck = (event) => {
        var estado = valoresCheck;
        if(event.target.checked){
            setAcceso({
                ...acceso,
                [event.target.name] : estado[0],
            });
        } else {
            setAcceso({
                ...acceso,
                [event.target.name] : estado[1],
            });
        }
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'PUEDE_INSERTAR'){
                setPuedeActualizarFocus();
            }
            if(e.target.name == 'PUEDE_ACTUALIZAR'){
                setPuedeBorrarFocus();
            }
            if(e.target.name == 'PUEDE_BORRAR'){
                setPuedeConsultarFocus();
            }
            if(e.target.name == 'PUEDE_CONSULTAR'){
                setCodGrupoFocus();
            }
        }
    }
    const onFinish = async() => {
        var url    = `/bs/acceso_de_grupos`;
        var method = 'POST';
        try{
            await Main.Request( url, method, acceso )
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    history.push(dirr);
                }else{
                    if(rows.ret == 0){
                        showModalMensaje("Atención!","alerta",response.data.p_mensaje);
                    } else {
                        showModalMensaje("Error!","error",response.data.p_mensaje);
                    }
                    console.log(response.data);
                }
            });
        } catch (error) {
            showModalMensaje("Error!","error",error);
        }
    };
    const onFinishFailed = (errorInfo) => {
        showModalMensaje("Error!","error",errorInfo);
    };
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if(datos !== "" || datos !== undefined){
            if( BusquedaPor === 'COD_GRUPO' ){
                setAcceso({
                    ...acceso,
                    ['COD_GRUPO'] : datos[0],
                    ['DESC_GRUPO']: datos[1]
                });
                form.setFieldsValue({
                    ...acceso,
                    ['COD_GRUPO'] : datos[0],
                    ['DESC_GRUPO']: datos[1]
                });
                setTimeout( ()=>{
                    setCodModuloFocus();
                },100 );
            }
            if( BusquedaPor === 'COD_MODULO' ){
                if(datos[1] !== auxDescModulo){
                    setAcceso({
                        ...acceso,
                        ['COD_MODULO'] : datos[0],
                        ['DESC_MODULO']: datos[1],
                    });
                    form.setFieldsValue({...acceso,
                        ['COD_MODULO' ] : datos[0],
                        ['DESC_MODULO'] : datos[1],
                        ['NOM_FORMA'  ] : '',
                        ['DESC_FORMA' ] : '',
                    });
                    setAuxDescModulo(datos[0].toUpperCase())
                    setTimeout( ()=>{
                        setNomFormaFocus();
                    },100 );
                }else{
                    setNomFormaFocus();
                }
            }
            if( BusquedaPor === 'NOM_FORMA' ){
                setAcceso({
                    ...acceso,
                    ['NOM_FORMA'] : datos[0],
                    ['DESC_FORMA']: datos[1]
                });
                form.setFieldsValue({
                    ...acceso,
                    ['NOM_FORMA'] : datos[0],
                    ['DESC_FORMA']: datos[1]
                });
                setTimeout( ()=>{
                    setPuedeInsertarFocus();
                },100 );
            }
            showsModal(false)
        }
    }
    const callmodal = async(e) =>{
        var key = e.which;
        if( key == 120 ){
            e.preventDefault();
            setTipoDeBusqueda(e.target.name);
            setSearchColumns(searchsColumns);
            if( e.target.name == 'COD_GRUPO' ){
                var auxGrupo = await getGrupo();
                console.log()
                setSearchData(auxGrupo);
                setModalTitle('Grupos');
            }
            if( e.target.name == 'COD_MODULO' ){
                var auxModulo = await getModulo();
                setSearchData(auxModulo);
                setModalTitle('Modulos');
            }
            if( e.target.name == 'NOM_FORMA' ){
                var auxForma = await getForma();
                setSearchData(auxForma);
                setModalTitle('Formularios');
            }
            setShows(true);
        }
        if(key !== undefined){
            if( key == 13 || key == 9 || e.type == 'blur'){
                e.preventDefault();
                var url
                if( e.target.name == 'COD_GRUPO' ){
                    url = url_valida_grupo;
                }
                if( e.target.name == 'COD_MODULO' ){
                    url = url_valida_modulo;
                }
                if( e.target.name == 'NOM_FORMA' ){
                    url = url_valida_formulario;
                }
                var method = 'POST';
                var data   = {'valor':e.target.value,'COD_MODULO':acceso.COD_MODULO};
                await Main.Request( url, method, data )
                    .then( response =>{
                        if(response.status == 200){
                            if( response.data.outBinds.ret == 1 ){
                                if( e.target.name == 'COD_GRUPO' ){
                                        setAcceso({...acceso,
                                            ['COD_GRUPO' ]  : e.target.value.toUpperCase(),
                                            ['DESC_GRUPO']  : response.data.outBinds.p_descripcion,
                                            });
                                        form.setFieldsValue({...acceso,
                                            ['COD_GRUPO' ]  : e.target.value.toUpperCase(),
                                            ['DESC_GRUPO']  : response.data.outBinds.p_descripcion,
                                            });
                                            setCodModuloFocus()
                                    }                                    
                                if( e.target.name == 'COD_MODULO' ){
                                  if(e.target.value.toUpperCase() != auxDescModulo){
                                        setAcceso({...acceso,
                                                ['COD_MODULO' ] : e.target.value.toUpperCase(),
                                                ['DESC_MODULO'] : response.data.outBinds.p_descripcion,
                                            });
                                        form.setFieldsValue({...acceso,
                                                ['COD_MODULO' ] : e.target.value.toUpperCase(),
                                                ['DESC_MODULO'] : response.data.outBinds.p_descripcion,
                                                ['NOM_FORMA'  ] : '',
                                                ['DESC_FORMA' ] : '',
                                            });
                                            setAuxDescModulo(e.target.value.toUpperCase())
                                            setNomFormaFocus()
                                    }else{
                                        setNomFormaFocus()
                                    }
                                }
                                if( e.target.name == 'NOM_FORMA' ){    
                                    setAcceso({...acceso,
                                        ['NOM_FORMA' ]  : e.target.value.toUpperCase(),
                                        ['DESC_FORMA']  : response.data.outBinds.p_descripcion,
                                        });
                                    form.setFieldsValue({...acceso,
                                        ['NOM_FORMA' ]  : e.target.value.toUpperCase(),
                                        ['DESC_FORMA']  : response.data.outBinds.p_descripcion,
                                        });
                                    setTimeout(()=>setPuedeInsertarFocus(),300);
                                }
                        }else{
                            showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);
                        }
                    }
                })
            }
        }
    }
    const onInteractiveSearch = async(event)=>{
        var valor = event.target.value;
        var url   = '';
        var data  = '';
        valor = valor.trim();
        if(valor.length == 0 ){
            valor = 'null';
        }
        if(tipoDeBusqueda === 'COD_MODULO'){
            url  = url_buscar_modulo;
            data = {'valor':valor};
        }
        if(tipoDeBusqueda === 'COD_GRUPO'){
            url = url_buscar_grupo;
            data = {'valor':valor};
        }
        if(tipoDeBusqueda === 'NOM_FORMA'){
            url = url_buscar_formulario;
            data = {'COD_MODULO':acceso.COD_MODULO, 'valor':valor};
        }

        var method = 'POST';
        await Main.Request( url, method, data)
            .then( response => {
                if( response.status == 200 ){
                    setSearchData(response.data.rows)
                }
            })
    }
    const handleCancel = () => {
        setVisibleMensaje(false);
    };
    const showModalMensaje = (titulo, imagen, mensaje) => {
        setMensaje(mensaje);
        setIcono(imagen);
        setTituloModal(titulo);
        setVisibleMensaje(true);
    };
    const cerrar = () => {
        history.push(dirr);
    };
    return (
        <Main.Layout defaultOpenKeys={defaultOpenKeys}
                defaultSelectedKeys={defaultSelectedKeys}> 
            
            <Main.ModalDialogo 
                positiveButton={""}
                negativeButton={"OK"}
                negativeAction={handleCancel}
                onClose={handleCancel}
                setShow={visibleMensaje}
                title={tituloModal}
                imagen={icono}
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
                
            <div className="paper-container">
                <Main.Paper className="paper-style">
                    <Main.TituloForm titulo={Titulo} />
                    <Form
                        {...layout}
                        layout="horizontal"
                        size="small"
                        autoComplete="off"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >   
                    <Main.ButtonForm 
                        dirr={dirr} 
                        arrayAnterior={auxData} 
                        arrayActual={acceso} 
                        direccionar={cerrar}
                        isNew={isNew}
                        onFinish={onFinish}
                        buttonGuardar={buttonSaveRef}
                        buttonVolver={buttonExitRef}
                        formName={FormName}/>
                        <div className="form-container">
                            <Card style={{paddingTop:"10px", margin:"5px"}}>
                                <Row gutter={[4]}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Grupo"
                                            name="COD_GRUPO"
                                            type="text"
                                         >
                                            {/* <Input.Group size="small"> */}
                                                <Row gutter={8}>
                                                    <Col span={5}>
                                                        <Form.Item name="COD_GRUPO">
                                                            <Input 
                                                                id="requerido"
                                                                name="COD_GRUPO"
                                                                disabled={state}
                                                                type="text"
                                                                className="search_input"
                                                                onChange={handleInputChange}
                                                                onKeyDown={callmodal}
                                                                onBlur={callmodal}
                                                                onInput={Main.mayuscula}
                                                                ref={codGrupoFocus}
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={19}>
                                                        <Form.Item name="DESC_GRUPO">
                                                            <Input
                                                                name="DESC_GRUPO"
                                                                disabled={true} 
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            {/* </Input.Group> */}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item  
                                                label="Módulo"
                                                name="COD_MODULO"
                                                type="text"
                                                onChange={handleInputChange}>
                                            <Input.Group size="small">
                                                <Row gutter={8}>
                                                    <Col span={5}>
                                                        <Form.Item name="COD_MODULO">
                                                            <Input 
                                                                id="requerido"
                                                                name="COD_MODULO"
                                                                disabled={state} 
                                                                type="text"
                                                                className="search_input"
                                                                onChange={handleInputChange}
                                                                onKeyDown={callmodal}
                                                                onBlur={callmodal}
                                                                ref={codModuloFocus}
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={19}>
                                                        <Form.Item name="DESC_MODULO">
                                                            <Input
                                                                name="DESC_MODULO"
                                                                disabled={true} 
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Input.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item  
                                            label="Forma"
                                            name="NOM_FORMA"
                                            type="text"
                                            onChange={handleInputChange}>
                                            {/* <Input.Group size="small"> */}
                                                <Row gutter={8}>
                                                    <Col span={5}>
                                                        <Form.Item name="NOM_FORMA">
                                                            <Input 
                                                                id="requerido"
                                                                name="NOM_FORMA"
                                                                disabled={state}
                                                                className="search_input"
                                                                onChange={handleInputChange}
                                                                onKeyDown={callmodal}
                                                                onBlur={callmodal}
                                                                ref={nomFormaFocus}
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={19}>
                                                        <Form.Item name="DESC_FORMA">
                                                            <Input
                                                                name="DESC_FORMA"
                                                                disabled={true} 
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            {/* </Input.Group> */}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item
                                            label={"Insertar"} >
                                            <Card style={{height:"23px", backgroundColor:"#22000020", paddingLeft:"0px"}} onClick={marcarCheck}> 
                                                <Row>
                                                    <Checkbox
                                                        name="PUEDE_INSERTAR"
                                                        type="checkbox"
                                                        ref={puedeInsertarFocus}
                                                        checked={acceso.PUEDE_INSERTAR == 'S'}
                                                        onChange={marcarCheck}
                                                        style={{marginTop:"2px"}}
                                                        onKeyDown={handleFocus}>
                                                        {acceso.PUEDE_INSERTAR == 'S' ? "Puede insertar" : "No puede insertar"}
                                                    </Checkbox>
                                                </Row>
                                            </Card>   
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item
                                            label={"Actualizar"} >
                                            <Card style={{height:"23px", backgroundColor:"#22000020", paddingLeft:"0px"}} onClick={marcarCheck}> 
                                                <Row>
                                                    <Checkbox
                                                        name="PUEDE_ACTUALIZAR"
                                                        type="checkbox"
                                                        ref={puedeActualizarFocus}
                                                        checked={acceso.PUEDE_ACTUALIZAR == 'S'}
                                                        onChange={marcarCheck}
                                                        style={{marginTop:"2px"}}
                                                        onKeyDown={handleFocus}>
                                                        {acceso.PUEDE_ACTUALIZAR == 'S' ? "Puede actualizar" : "No puede actualizar"}
                                                    </Checkbox>
                                                </Row>
                                            </Card>   
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item
                                            label={"Borrar"} >
                                            <Card style={{height:"23px", backgroundColor:"#22000020", paddingLeft:"0px"}} onClick={marcarCheck}> 
                                                <Row>
                                                    <Checkbox
                                                        name="PUEDE_BORRAR"
                                                        type="checkbox"
                                                        ref={puedeBorrarFocus}
                                                        checked={acceso.PUEDE_BORRAR == 'S'}
                                                        onChange={marcarCheck}
                                                        style={{marginTop:"2px"}}
                                                        onKeyDown={handleFocus}>
                                                        {acceso.PUEDE_BORRAR == 'S' ? "Puede borrar" : "No puede borrar"}
                                                    </Checkbox>
                                                </Row>
                                            </Card>   
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item
                                            label={"Consultar"} >
                                            <Card style={{height:"23px", backgroundColor:"#22000020", paddingLeft:"0px"}} onClick={marcarCheck}> 
                                                <Row>
                                                    <Checkbox
                                                        name="PUEDE_CONSULTAR"
                                                        type="checkbox"
                                                        ref={puedeConsultarFocus}
                                                        checked={acceso.PUEDE_CONSULTAR == 'S'}
                                                        onChange={marcarCheck}
                                                        style={{marginTop:"2px"}}
                                                        onKeyDown={handleFocus}>
                                                        {acceso.PUEDE_CONSULTAR == 'S' ? "Puede consultar" : "No puede consultar"}
                                                    </Checkbox>
                                                </Row>
                                            </Card>   
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    </Form>
                </Main.Paper>
            </div>
        </Main.Layout>
    );
}

export default AccesoDeGrupos;