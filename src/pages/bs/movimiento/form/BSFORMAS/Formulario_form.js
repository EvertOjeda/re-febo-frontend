import React, { useEffect, useState, useRef } from "react";
import Paper from '@material-ui/core/Paper';
import Main from "../../../../../components/utils/Main";
import {Form, Input, Checkbox, Row, Card, Col } from 'antd';
import ValidarCamposRequeridos, { QuitarClaseRequerido } from "../../../../../components/utils/ValidarCamposRequeridos";
const { TextArea } = Input;
const valoresCheck = ['S','N'];
const Titulo = 'Formularios del Sistema';
const url_base = '/bs/formularios';
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const searchsColumns = [
    { ID: 'CODIGO'          , label: 'Codigo'           ,align: 'center'     , width: 80        },
    { ID: 'DESCRIPCION'     , label: 'Descripcion'      , minWidth: 150             },
];
//BUSCADORES
const url_buscar_modulos    = '/bs/formularios/buscar/modulo'
const url_buscar_tipo       = '/bs/formularios/buscar/tipo'
const url_buscar_etiqueta   = '/bs/formularios/buscar/etiqueta'
//VALIDADORES
const url_valida_modulos    = '/bs/formularios/valida/modulo'
const url_valida_tipo       = '/bs/formularios/valida/tipo'
const url_valida_etiqueta   = '/bs/formularios/valida/etiqueta'
// 
const defaultOpenKeys     = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS','BS-BS2','BS-BS2-BS21'];
const defaultSelectedKeys = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS-BS2-BS21-BSFORMAS'];
const FormName            = 'BSFORMAS';
// 
const Formulario = ({ history, location, match}) =>{
    const dirr  = "/bs/formulario";    
    const buttonSaveRef = useRef();
    const buttonExitRef = useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.volver, (e) =>{ 
        e.preventDefault();
        buttonExitRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    const [formulario         , setFormulario           ] = useState({}); 
    const [state              , setState                ] = useState(false);
    const [auxData            , setAuxData              ] = useState({});  
    const [mensaje            , setMensaje              ] = useState();
    const [icono              , setIcono                ] = useState();
    const [visibleMensaje     , setVisibleMensaje       ] = useState(false);
    const [isNew              , setIsNew                ] = useState(false);
    const [tituloModal        , setTituloModal          ] = useState();
    const [modulo             , setModulo               ] = useState({});
    const [tipo               , setTipo                 ] = useState({});
    const [etiqueta           , setEtiqueta             ] = useState({});
    const [searchType         , setSearchType           ] = useState('');
    const [searchColumns      , setSearchColumns        ] = useState({});
    const [searchData         , setSearchData           ] = useState({});
    const [modalTitle         , setModalTitle           ] = useState('');
    const [shows              , setShows                ] = useState(false);
    const [tipoDeBusqueda     , setTipoDeBusqueda       ] = useState();
    const [auxTipo            , setAuxTipo              ] = useState();
    const [auxModulo          , setAuxModulo            ] = useState();
    // ADMINISTRAR FOCUS
    const [codModuloFocus       , setCodModuloFocus     ] = UseFocus();
    const [nomFormaFocus        , setNomFormaFocus      ] = UseFocus();
    const [tituloFocus          , setTituloFocus        ] = UseFocus();
    const [mostrarEnMenuFocus   , setMostrarEnMenuFocus ] = UseFocus();
    const [codTipoFocus         , setCodTipoFocus       ] = UseFocus();
    const [codDescFocus         , setCodDescFocus       ] = UseFocus();
    const [ordenEnMenuFocus     , setOrdenEnMenuFocus   ] = UseFocus();
    const [descripcionFocus     , setDescripcionFocus   ] = UseFocus();
    const [mostrarNuevoSistFocus, setMostrarNuevoSistFocus   ] = UseFocus();
    const { params: { id } } = match;
    const [form] = Form.useForm();
    useEffect(()=>{
        if(id == 'nuevo'){
            setState(false);
            setFormulario(valoresNuevo());
            setAuxData(valoresNuevo());
            form.setFieldsValue(valoresNuevo());
            setIsNew(true);
            document.getElementById('TITULO').focus();
        }else{
            setState(true);
            setIsNew(false);
            getData();
        }
    },[])
    const getData = async() =>{
        try {
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setFormulario(valores());
                setAuxData(valores());
                setAuxTipo(location.state.rows.COD_TIPO);
                form.setFieldsValue(location.state.rows);
                setTimeout(()=>setTituloFocus(),100);
            }
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
            ['ESTADO']              : 'I',
            ['MOSTRAR_EN_MENU']     : 'N',
            ['MOSTRAR_NUEVO_SIST']  : 'N',
            ['COD_EMPRESA']         : sessionStorage.getItem('cod_empresa'),
            ['USERNAME']            : sessionStorage.getItem('cod_usuario'),
        }
    }
    const getModulo = async() =>{
        let info    = [];
        try {
            var url     = url_buscar_modulos;
            var method  = 'POST';
            await Main.Request(url,method,{valor:'null'} ).then(response => {
                if( response.data.rows.length > 0){
                    setModulo(response.data.rows);
                    info = response.data.rows;
                }
            });
            return info;
        } catch (error) {
            console.log(error);
        }
    }
    const getTipo = async() =>{
        let info    = [];
        try {
            var url     = url_buscar_tipo;
            var method  = 'POST';
            var data    = {valor:'null','cod_modulo':formulario.COD_MODULO}
            await Main.Request(url,method,data).then(response => {
                if( response.data.rows.length > 0){
                    setTipo(response.data.rows);
                    info = response.data.rows;
                }
            })
            return info;
        } catch (error) {
            console.log(error);
        }
    }
    const getEtiqueta = async() =>{
        let info    = [];
        try {
            var url     = url_buscar_etiqueta;
            var method  = 'POST';
            var data    = {valor:'null',cod_modulo:formulario.COD_MODULO, cod_tipo:formulario.COD_TIPO}
            await Main.Request(url,method,data).then(response => {
                if( response.data.rows.length > 0){
                    setEtiqueta(response.data.rows);
                    info = response.data.rows;
                }
            })
            return info;
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setFormulario({
            ...formulario,
            [event.target.name] : event.target.value,
        });
    }
    const marcarCheck = (event) => {
        var estado = valoresCheck;
        if(event.target.checked){
            setFormulario({
                ...formulario,
                [event.target.name] : estado[0],
            });
        } else {
            setFormulario({
                ...formulario,
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
            if(e.target.name == 'TITULO'){
                document.getElementById('NOM_FORMA').focus();
            }
            if(e.target.name == 'NOM_FORMA'){
                document.getElementById('COD_MODULO').focus();
            }
            if(e.target.name == 'ORDEN_EN_MENU'){
                setMostrarEnMenuFocus();
            }
            if(e.target.name == 'MOSTRAR_EN_MENU'){
                setMostrarNuevoSistFocus();
            }
            if(e.target.name == 'MOSTAR_NUEVO_SIST'){
                document.getElementById('RUTA').focus();
            }
            if(e.target.name == 'RUTA'){
                document.getElementById('DESCRIPCION').focus();
            }
        }
    }
    const onFinish = async() => {
        let verificar_input_requerido = ValidarCamposRequeridos();
        if(!verificar_input_requerido) return;
        try{
            await Main.Request( url_base, 'POST', { formulario , aux: auxData})
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
    const callmodal = async(e) =>{
        var url   = '';
        setSearchType(e.target.name);
        setTipoDeBusqueda(e.target.name);
        var key = e.which;

        if( key == 120){    
            if( e.target.name == 'COD_MODULO'){
                var AuxModulo = await getModulo();                
                setSearchColumns(searchsColumns);
                setSearchData(AuxModulo);
                setModalTitle('Modulos');
                setShows(true)
            }
            if( e.target.name == 'COD_TIPO'){
                const COD_MODULO = formulario.COD_MODULO;
                if(COD_MODULO !== "" && COD_MODULO !== undefined){
                    var AuxTipo = await getTipo();        
                    setSearchColumns(searchsColumns);
                    setSearchData(AuxTipo);
                    setModalTitle('Tipo');
                    setShows(true)
                }else{
                    showModalMensaje('¡Atención!','alerta','Favor Seleccione un Modulo');
                }
            }
            if( e.target.name == 'COD_DESC'){
                const COD_MODULO = formulario.COD_MODULO;
                const COD_TIPO   = formulario.COD_TIPO;
                if((COD_MODULO !== "" && COD_MODULO !== undefined) && (COD_TIPO !== "" && COD_TIPO !== undefined)){
                    var AuxEtiqueta = await getEtiqueta();
                    setSearchColumns(searchsColumns);
                    setSearchData(AuxEtiqueta);
                    setModalTitle('Etiqueta');
                    setShows(true)
                }else{
                    showModalMensaje('¡Atención!','alerta','Favor Seleccione el campo Modulo y Tipo');
                }
            }
            
        }
        if(key !== undefined){
            if( key == 13 || key == 9 || e.type == 'blur'){
                e.preventDefault();
                var data = ''
                if( e.target.name == 'COD_MODULO' ){
                    url = url_valida_modulos;
                    data={'valor':e.target.value}
                }else 
                if( e.target.name == 'COD_TIPO' ){
                    url = url_valida_tipo;
                    data={'valor':e.target.value,'COD_MODULO':formulario.COD_MODULO}
                }else 
                if( e.target.name == 'COD_DESC' ){
                    url = url_valida_etiqueta;
                    data={'valor':e.target.value,'COD_MODULO':formulario.COD_MODULO,'COD_TIPO':formulario.COD_TIPO}
                }

                var method = 'POST';
                await Main.Request( url, method, data)
                    .then( response =>{
                        if(response.status == 200){
                            if( response.data.outBinds.ret == 1 ){
                                if( e.target.name == 'COD_MODULO' ){
                                    if(e.target.value.toUpperCase() !== auxModulo){
                                        setFormulario({...formulario,
                                            ['COD_MODULO'   ] : e.target.value.toUpperCase(),
                                            ['DESC_MODULO'  ] : response.data.outBinds.descripcion,
                                        });
                                        form.setFieldsValue({...formulario,
                                            ['COD_MODULO'    ] : e.target.value.toUpperCase(),
                                            ['DESC_MODULO'   ] : response.data.outBinds.descripcion,
                                            ['COD_TIPO'      ] : '',
                                            ['DESC_TIPO'     ] : '',
                                            ['COD_DESC'      ] : '',
                                            ['DESC_TIPO_DESC'] : ''
                                            });
                                        
                                        setAuxTipo('');
                                        setAuxModulo(e.target.value.toUpperCase())
                                        document.getElementById('COD_TIPO').focus();
                                    }else{
                                        document.getElementById('COD_TIPO').focus();
                                    }
                                }
                                if( e.target.name == 'COD_TIPO' ){
                                    if(e.target.value.toUpperCase() !== auxTipo){
                                        setFormulario({...formulario,
                                            ['COD_TIPO'      ] : e.target.value.toUpperCase(),
                                            ['DESC_TIPO'     ] : response.data.outBinds.descripcion,
                                            ['COD_DESC'      ] : '',
                                            ['DESC_TIPO_DESC'] : ''
                                        });
                                        form.setFieldsValue({...formulario,
                                            ['COD_TIPO'      ] : e.target.value.toUpperCase(),
                                            ['DESC_TIPO'     ] : response.data.outBinds.descripcion,
                                            ['COD_DESC'      ] : '',
                                            ['DESC_TIPO_DESC'] : '',
                                            });
                                        setAuxTipo(e.target.value.toUpperCase())
                                        document.getElementById('COD_DESC').focus();
                                    }else{
                                        document.getElementById('COD_DESC').focus();
                                    }
                                }
                                if( e.target.name == 'COD_DESC' ){
                                    setFormulario({...formulario,
                                        ['COD_DESC'      ] : e.target.value.toUpperCase(),
                                        ['DESC_TIPO_DESC'] : response.data.outBinds.descripcion,
                                    });
                                    form.setFieldsValue({...formulario,
                                        ['COD_DESC'      ] : e.target.value.toUpperCase(),
                                        ['DESC_TIPO_DESC'] : response.data.outBinds.descripcion,
                                        });
                                    document.getElementById('ORDEN_EN_MENU').focus();
                                }    
                        }else{
                            showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);
                        }
                    }
                })
            }
        }
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {

        if(datos !== "" || datos !== undefined){
            var url   = '';
            var valor = ''
            if( BusquedaPor === 'COD_MODULO' ){
                if(datos[0] !== auxModulo){
                    setFormulario({
                        ...formulario,
                        ['COD_MODULO'    ] :datos[0],
                        ['DESC_MODULO'   ] :datos[1],
                        ['COD_TIPO'      ] : '',
                        ['DESC_TIPO'     ] : '',
                        ['COD_DESC'      ] : '',
                        ['DESC_TIPO_DESC'] : ''
                    })
                    form.setFieldsValue({
                        ...form,
                        ['COD_MODULO'    ] :datos[0],
                        ['DESC_MODULO'   ] :datos[1],
                        ['COD_TIPO'      ] : '',
                        ['DESC_TIPO'     ] : '',
                        ['COD_DESC'      ] : '',
                        ['DESC_TIPO_DESC'] : ''
                    })
                    setModulo(datos[0])
                    setTimeout( setNomFormaFocus, 350 );
                }else{
                    setTimeout( setNomFormaFocus, 350 );
                }
            }
            if( BusquedaPor === 'COD_TIPO' ){
                if(datos[0] !== auxTipo){
                    setFormulario({
                        ...formulario,
                        ['COD_TIPO'      ] :datos[0],
                        ['DESC_TIPO'     ] :datos[1],
                        ['COD_DESC'      ] : '',
                        ['DESC_TIPO_DESC'] : ''
                    })
                    form.setFieldsValue({
                        ...form,
                        ['COD_TIPO'      ] :datos[0],
                        ['DESC_TIPO'     ] :datos[1],
                        ['COD_DESC'      ] : '',
                        ['DESC_TIPO_DESC'] : ''
                    })
                    setAuxTipo(datos[0])
                    setTimeout( setCodDescFocus, 350 );
                }else{
                    setTimeout( setCodDescFocus, 350 );
                }
            }
            if( BusquedaPor === 'COD_DESC' ){
                setFormulario({
                    ...formulario,
                    ['COD_DESC']       :datos[0],
                    ['DESC_TIPO_DESC'] :datos[1],
                })
                form.setFieldsValue({
                    ...form,
                    ['COD_DESC']       :datos[0],
                    ['DESC_TIPO_DESC'] :datos[1],
                })
                setTimeout( setOrdenEnMenuFocus, 350 );
           }
        }
        showsModal(false)
    }
    const onInteractiveSearch = async(event)=> {
        url = '';
        var valor = event.target.value;
        valor = valor.trim();

        if(valor.length == 0 ){
            valor = null;
        }

        if(searchType == 'COD_MODULO'){
            url = '/bs/formularios/buscar/modulo';
            if(valor === null){
                setSearchData(modulo);
            }
        }
        if( searchType == 'COD_TIPO' ){
            url = '/bs/formularios/buscar/tipo';
            if(valor === null){
                setSearchData(tipo);
            }
        }
        if( searchType == 'COD_DESC' ){
            url = '/bs/formularios/buscar/etiqueta';
            if(valor === null){
                setSearchData(etiqueta);
            }
        }

        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor,'cod_modulo':formulario.COD_MODULO};
            await Main.Request( url, method, data).then( response => {
                if( response.status == 200 ){
                    if(searchType == 'COD_MODULO'){
                        setSearchData(response.data.rows);
                    }
                    if(searchType == 'COD_TIPO'){
                        setSearchData(response.data.rows);
                    }
                    if(searchType == 'COD_DESC'){
                        setSearchData(response.data.rows);
                    }
                }
            })
        }
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
                <Paper className="paper-style">
                    <Main.TituloForm titulo={Titulo} />
                    <Form
                        size="small"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >   
                    <Main.ButtonForm 
                         dirr={dirr} 
                         arrayAnterior={auxData} 
                         arrayActual={formulario} 
                         direccionar={cerrar}
                         isNew={isNew}
                         onFinish={onFinish}
                         buttonGuardar={buttonSaveRef}
                         buttonVolver={buttonExitRef}
                         formName={FormName}
                        />
                        <div className="form-container">
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="TITULO" label={<label style={{width:'120px'}}><span style={{color:'red'}}>*</span> Título</label>}>
                                        <Input
                                            name="TITULO"
                                            className="search_input requerido"
                                            onChange={handleInputChange}
                                            onKeyDown={handleFocus}
                                            />
                                    </Form.Item>
                                    <Form.Item label={<label style={{width:'120px'}}><span style={{color:'red'}}>*</span> Programa</label>} name="NOM_FORMA">
                                        <Input
                                            name="NOM_FORMA"
                                            disabled={state} 
                                            className="search_input requerido"
                                            onChange={handleInputChange}
                                            onKeyDown={handleFocus}
                                            onInput={Main.mayuscula}
                                            />
                                    </Form.Item>
                                    <Form.Item label={<label style={{width:'120px'}}><span style={{color:'red'}}>*</span> Módulo</label>}>
                                        <Form.Item name="COD_MODULO" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
                                            <Input
                                                name="COD_MODULO"
                                                disabled={state} 
                                                className="search_input requerido"
                                                onChange={handleInputChange}
                                                onKeyDown={callmodal}
                                                onBlur={callmodal}
                                                onInput={Main.mayuscula}
                                                />
                                        </Form.Item>
                                        <Form.Item name="DESC_MODULO" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
                                            <Input disabled/>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item label={<label style={{width:'120px'}}><span style={{color:'red'}}>*</span> Tipo</label>}>
                                        <Form.Item name="COD_TIPO" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
                                            <Input
                                                name="COD_TIPO"
                                                type="number"
                                                className="search_input requerido"
                                                onChange={handleInputChange}
                                                onKeyDown={callmodal}
                                                onBlur={callmodal}
                                                />
                                        </Form.Item>
                                        <Form.Item name="DESC_TIPO" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
                                            <Input name="DESC_TIPO" disabled={true}/>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item label={<label style={{width:'120px'}}> Etiqueta</label>}>
                                        <Form.Item name="COD_DESC" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
                                            <Input 
                                                name="COD_DESC"
                                                className="search_input"
                                                onChange={handleInputChange}
                                                onKeyDown={callmodal}
                                                onBlur={callmodal}
                                                />
                                        </Form.Item>
                                        <Form.Item name="DESC_TIPO_DESC" style={{width:'calc(100% - 84px)', display:'inline-block'}}>
                                            <Input name="DESC_TIPO_DESC" disabled={true}/>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item label={<label style={{width:'120px'}}><span style={{color:'red'}}>*</span> Orden en menu</label>}>
                                        <Form.Item name="ORDEN_EN_MENU" style={{width:'80px',  display:'inline-block', marginRight:'4px'}}>
                                            <Input 
                                                name="ORDEN_EN_MENU"
                                                type="number"
                                                className="search_input requerido"
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                                ref={ordenEnMenuFocus}
                                                />
                                        </Form.Item>
                                    </Form.Item>
                                </Col>
                                <Col span={12} >
                                    <Form.Item label={<label style={{width:'150px'}}> Mostrar en Inventiva</label>}>
                                        <Card style={{backgroundColor:"#22000020", paddingLeft:"0px"}} onClick={marcarCheck}>
                                            <Checkbox
                                                name="MOSTRAR_EN_MENU"
                                                type="checkbox"
                                                ref={mostrarEnMenuFocus}
                                                checked={formulario.MOSTRAR_EN_MENU == 'S'}
                                                onChange={marcarCheck}
                                                style={{marginTop:"2px"}}
                                                onKeyDown={handleFocus}
                                            >
                                                {formulario.MOSTRAR_EN_MENU == 'S' ? "Mostrar en menu" : "No mostrar en menu"}
                                            </Checkbox>
                                        </Card>   
                                    </Form.Item>
                                    <Form.Item label={<label style={{width:'150px'}}> Mostrar en Febo</label>}>
                                        <Card style={{backgroundColor:"#22000020", paddingLeft:"0px"}} onClick={marcarCheck}>
                                            <Checkbox
                                                name="MOSTAR_NUEVO_SIST"
                                                type="checkbox"
                                                ref={mostrarNuevoSistFocus}
                                                checked={formulario.MOSTAR_NUEVO_SIST == 'S'}
                                                onChange={marcarCheck}
                                                style={{marginTop:"2px"}}
                                                onKeyDown={handleFocus}
                                            >
                                                {formulario.MOSTAR_NUEVO_SIST == 'S' ? "Mostrar en menu" : "No mostrar en menu"}
                                            </Checkbox>
                                        </Card>   
                                    </Form.Item>
                                    <Form.Item name="RUTA" label={<label style={{width:'150px'}}> Ruta</label>}> 
                                        <Input 
                                            name="RUTA"
                                            onChange={handleInputChange}
                                            onKeyDown={handleFocus}
                                            />
                                    </Form.Item>
                                    <Form.Item name="DESCRIPCION" label={<label style={{width:'150px'}}> Descripción</label>}>
                                        <TextArea
                                            name="DESCRIPCION"
                                            onChange={handleInputChange}
                                            onKeyDown={handleFocus}
                                            style={{widt:"100%",height:"92px",maxWidth:"100%"}}
                                            value={formulario.DESCRIPCION}/>
                                    </Form.Item>
                                </Col>                                      
                            </Row>
                        </div>
                    </Form>
                </Paper>
            </div>
        </Main.Layout>
    );
}

export default Formulario;