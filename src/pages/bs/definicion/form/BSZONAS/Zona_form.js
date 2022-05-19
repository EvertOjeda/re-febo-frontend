import React, { useEffect, useState, useRef }   from "react";
import { Redirect }                             from "react-router-dom";
import Paper 							        from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}                  from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import Layout                                   from "../../../../../components/utils/NewLayout";
import FormModalSearch                          from "../../../../../components/utils/ModalForm/FormModalSearch";
import TableSearch,{RefreshBackgroundColor}     from "../../../../../components/utils/TableSearch/TableSearch";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import { Form, Input, Row, Col, message }       from 'antd';
import Main                                     from '../../../../../components/utils/Main';
const { TextArea }  = Input;
const Titulo        = "Zona Geográfica";
// ! =========================== URLs =============================
// * REDIRECCION A LA VISTA TIPO LISTA
const url_lista           = "/bs/zona_geografica";
// * DIRECCION BASE 
const url_post_base       = '/bs/zonas_geograficas/' + sessionStorage.getItem('cod_empresa');
// * BUSCADORES
const url_buscar_empresa  = '/bs/zonas_geograficas/buscar/empresa';
const url_buscar_sucursal = '/bs/zonas_geograficas/buscar/sucursal';
const url_buscar_region   = '/bs/zonas_geograficas/buscar/regiao';
// * VALIDADORES
const url_valida_empresa  = '/bs/zonas_geograficas/valida/empresa';
const url_valida_sucursal = '/bs/zonas_geograficas/valida/sucursal';
const url_valida_region   = '/bs/zonas_geograficas/valida/regiao';
const regiaoColumns = [
    { ID: 'COD_REGIAO'          , label: 'Código'           , width: 100    },
    { ID: 'DESC_REGIAO'         , label: 'Descripcion'      , minWidth: 150 },
];
const sucursalColumns = [
    { ID: 'COD_SUCURSAL'        , label: 'Código'           , width: 100    },
    { ID: 'DESC_SUCURSAL'       , label: 'Descripcion'      , minWidth: 150 },
];
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
var codEmpresaAux   = '';
var codSucursalAux  = '';
var codRegiaoAux    = '';
const FormName      = 'BSZONAS';
const Zona = ({ history, location, match}) =>{
    const username      = sessionStorage.getItem('cod_usuario');
    const cod_empresa   = sessionStorage.getItem('cod_empresa');
    const showsModal = async (valor) => {
        setShows(valor);
        setSearchInput('');
    };
    const buttonSaveRef = useRef();
    const buttonExitRef = useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.Volver, (e) =>{ 
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    const [zona             , setZona           ] = useState({}); 
    // const [datoAux          , setDatoAux        ] = useState({});
    const [searchColumns    , setSearchColumns  ] = useState({});
    const [searchData       , setSearchData     ] = useState({});
    const [state            , setState          ] = useState(false);
    const [auxData          , setAuxData        ] = useState({});  
    const [shows            , setShows          ] = useState(false);
    const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    const [empresa          , setEmpresa        ] = useState({});
    const [sucursal         , setSucursal       ] = useState({});
    const [regiao           , setRegiao         ] = useState({});
    const [mensaje          , setMensaje        ] = useState();
    const [visible          , setVisible        ] = useState(false);
    const [visibleSave      , setVisibleSave    ] = useState(false);
    const [visibleMensaje   , setVisibleMensaje ] = useState(false);
    const [isNew            , setIsNew          ] = useState(false);
    const [imagen           , setImagen         ] = useState();
    const [tituloModal      , setTituloModal    ] = useState();
    const [searchType, setSearchType  ] = useState('');
    const [modalTitle, setModalTitle  ] = useState('');
    const [searchInput, setSearchInput] = useState('');
    // ADMINISTRAR FOCUS
    const [codSucursalFocus         , setCodSucursalFocus           ] = UseFocus();
    const [codRegiaoFocus           , setCodRegiaoFocus             ] = UseFocus();
    const [codZonaFocus             , setCodZonaFocus               ] = UseFocus();
    const [ordenFocus               , setOrdenFocus                 ] = UseFocus();
    const [descripcionFocus         , setDescripcionFocus           ] = UseFocus();
    const [barrioFocus              , setBarrioFocus                ] = UseFocus();
    const [comentarioFocus          , setComentarioFocus            ] = UseFocus();
    const { params: { id } } = match;
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(async()=>{
        getEmpresa();
        if(id == 'nuevo'){
            codEmpresaAux   = '';
            codSucursalAux  = '';
            codRegiaoAux    = '';
            setState(false);
            setZona({
                ...zona,
                ['TIPO']       : 'I',
                ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                ['USERNAME']   :sessionStorage.getItem('cod_usuario')
            });
            setAuxData({
                ...zona, 
                ['TIPO']       : 'I',
                ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                ['USERNAME']   :sessionStorage.getItem('cod_usuario')
            });
            setIsNew(true);
            setCodSucursalFocus();
            let valorEmpresa = await getEmpresa()
            form.setFieldsValue(valorEmpresa[0]);
        }else{
            if(location.state === undefined){
                history.push(url_lista);
            }
            setState(true);
            getData();
            setOrdenFocus();
        }
    },[])
    const getData = async() =>{
        try {
            setZona({
                ...location.state.rows,
                ['TIPO']:'U',
                ['USERNAME'] :sessionStorage.getItem('cod_usuario')
            });
            setAuxData({
                ...location.state.rows,
                ['TIPO']:'U',
                ['USERNAME'] :sessionStorage.getItem('cod_usuario')
            });
            form.setFieldsValue(location.state.rows);      
        } catch (error) {
            console.log(error);
        }
    }
    const getEmpresa = async() =>{
        var respValor =  null;
        try {
            var url     = url_buscar_empresa;
            var method  = 'POST';
            await Main.Request(url,method,{['valor']:'null'})
                .then(async response => {
                    if( response.data.rows.length > 0){
                        respValor = await response.data.rows.filter((item)=>{
                            if(item.COD_EMPRESA == cod_empresa){
                                return item;
                            }
                        });
                    }
                })
        return respValor
        } catch (error) {
            console.log(error);
        }
    }
    const getSucursal = async() =>{
        var valorRegiao = []
        try {
            var url     = url_buscar_sucursal;
            var method  = 'POST';
            var data    = {['valor']:'null',['cod_empresa']: zona.COD_EMPRESA};
            valorRegiao = await Main.Request(url,method,data)
                .then(response => { 
                    if( response.data.rows.length > 0){
                        setSucursal(response.data.rows);
                        zona.COD_SUCURSAL  = codSucursalAux;
                        return valorRegiao = response.data.rows
                    }                   
                })
            return valorRegiao;
        } catch (error) {
            console.log(error);
        }
    }
    const getRegiao = async() =>{
        var valorRegiao = []
        try {
            var url     = url_buscar_region;
            var method  = 'POST';
            valorRegiao = await Main.Request(url,method,
                {['valor']:'null',['cod_sucursal']:zona.COD_SUCURSAL,['cod_empresa']:zona.COD_EMPRESA}
             ).then(response => {
                if( response.data.rows.length > 0){
                    setRegiao(response.data.rows);
                   return response.data.rows
                }
            })
            return valorRegiao;
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setZona({
            ...zona,
            [event.target.name] : event.target.value,
        });
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            
            if(e.target.name == 'COD_ZONA'){
                setOrdenFocus();
            }
            if(e.target.name == 'ORDEN'){
                setDescripcionFocus();
            }
            if(e.target.name == 'DESCRIPCION'){
                setBarrioFocus();
            }
            if(e.target.name == 'BARRIOS'){
                setComentarioFocus();
            }   
        }
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if(datos !== "" || datos !== undefined){           
            if( BusquedaPor == 'COD_SUCURSAL' ){
                if (datos[0] != codSucursalAux) {                    
                    setZona({
                        ...zona,
                        ['COD_SUCURSAL']   : datos[0],
                        ['DESC_SUCURSAL']  : datos[1],
                        ['COD_REGIAO']     : '',
                        ['DESC_REGIAO']    : '',
                    });
                    form.setFieldsValue({
                        ...zona,
                        ['COD_SUCURSAL']   : datos[0],
                        ['DESC_SUCURSAL']  : datos[1],
                        ['COD_REGIAO']     : '',
                        ['DESC_REGIAO']    : '',
                    });
                    setCodRegiaoFocus();
                    codSucursalAux  = datos[0];
                    codRegiaoAux    = '';
                }
                setTimeout( setCodRegiaoFocus, 150 );
            }
            if( BusquedaPor == 'COD_REGIAO' ){
                if (datos[0] != codRegiaoAux) {
                    setZona({...zona,
                            ['COD_REGIAO'] : datos[0],
                            ['DESC_REGIAO']: datos[1],
                        });
                    form.setFieldsValue({...zona,
                        ['COD_REGIAO'] : datos[0],
                        ['DESC_REGIAO']: datos[1],
                    });
                    codRegiaoAux = datos[0];
                }
                setTimeout( setCodZonaFocus, 150 );
            }                
        }
        showsModal(false)
    }    
  
    const onFinish = async(values) => {
        setZona({...zona,
            ['USERNAME']:username
        });
        var url    = url_post_base;
        var method = 'POST';
        try {
            await Main.Request( url, method, zona)
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    history.push(url_lista);
                }else{
                    showModalMensaje('¡Atención!','alerta',rows.p_mensaje);
                    setVisibleMensaje(true);
                }
            });    
        } catch (error) {
            console.log("Error - formulario Zona",error)
        }
        
    };
    const onFinishFailed = (errorInfo) => {
        mensaje = errorInfo;
        setVisibleMensaje(true);
    };
    const callmodal = async(e) =>{
        var url   = '';        
        setSearchType(e.target.name);
        setTipoDeBusqueda(e.target.name);
        var key = e.which;

        if(e.target.value !== undefined && e.target.value !== ''){
            

            if( key == 13 || key == 9){
                e.preventDefault();
   
                if( e.target.name == 'COD_SUCURSAL' ){
                    url = url_valida_sucursal;
                }
                if( e.target.name == 'COD_REGIAO' ){
                    url = url_valida_region;
                }
                var method = 'POST';
                var data   = {['valor']:e.target.value,['cod_empresa']:zona.COD_EMPRESA,['cod_sucursal']:zona.COD_SUCURSAL,};
                
                await Main.Request( url, method, data)
                .then( response =>{
                    if(response.status == 200){
                        if( response.data.outBinds.ret == 1 ){
                            if( e.target.name == 'COD_SUCURSAL' ){
                                if (zona.COD_SUCURSAL != codSucursalAux) {
                                    setZona({...zona,
                                            ['DESC_SUCURSAL']   : response.data.outBinds.desc_sucursal,
                                            ['COD_REGIAO']      : '',
                                            ['DESC_REGIAO']     : '',
                                        });
                                    form.setFieldsValue({...zona,
                                            ['DESC_SUCURSAL']   : response.data.outBinds.desc_sucursal,
                                            ['COD_REGIAO']      : '',
                                            ['DESC_REGIAO']     : '',
                                        });
                                    codSucursalAux = e.target.value;
                                    codRegiaoAux   = '';
                                }
                                // if(e.type != 'blur')
                                    setCodRegiaoFocus();
                            }
                            if( e.target.name == 'COD_REGIAO' ){
                                if (e.target.value != codRegiaoAux) {
                                    setZona({...zona,
                                            ['DESC_REGIAO']: response.data.outBinds.desc_regiao,
                                        });
                                    form.setFieldsValue({...zona,
                                        ['DESC_REGIAO']: response.data.outBinds.desc_regiao,
                                    });
                                }
                                if(e.type != 'blur')
                                        setCodZonaFocus();
                            }
                        }else{
                            if( e.target.name == 'COD_SUCURSAL' ){
                                setZona({...zona,
                                        ['DESC_SUCURSAL']   : response.data.outBinds.desc_sucursal,
                                        ['COD_REGIAO']      : '',
                                        ['DESC_REGIAO']     : '',
                                    });
                                codSucursalAux = e.target.value;
                            }
                            if( e.target.name == 'COD_REGIAO' ){
                                setZona({
                                    ...zona,
                                    ['COD_REGIAO']   : '',
                                    ['DESC_REGIAO']  : '',
                                });
                            }
                            showModalMensaje('¡Atención!','alerta',response.data.outBinds.mensaje);
                        }
                    }
                })
            }
        }

        if( key == 120){
            e.preventDefault();
            if( e.target.name == 'COD_SUCURSAL'){
                var auxSucursal = await getSucursal();
                url             = url_buscar_sucursal;
                setSearchColumns(sucursalColumns);
                setSearchData(auxSucursal);
                setModalTitle('Sucursales');
                setShows(true);
            }
            if( e.target.name == 'COD_REGIAO'){
                if (zona.COD_SUCURSAL != null && zona.COD_SUCURSAL != '') {
                    var auxRegion =await getRegiao();
                    
                    console.log("auxRegion ",auxRegion)

                    url           = url_buscar_region;
                    setSearchColumns(regiaoColumns);
                    setSearchData(auxRegion);
                    setModalTitle('Región');
                    setShows(true);
                }else{
                    message.warning("Favor introduzca COD_SUCURSAL antes de continuar!!")
                }
            }    
        }
        
    }

    const onInteractiveSearch = async(event)=> {
        setSearchInput(event.target.value);
        var url = '';
        var valor = event.target.value;
        valor = valor.trim();
        if(valor.length == 0 ){
            valor = null;
        }
        if(searchType == 'COD_EMPRESA'){
            url = url_buscar_empresa;
            if(valor === null){
                setSearchData(empresa);
            }
        }
        if( searchType == 'COD_SUCURSAL' ){
            url = url_buscar_sucursal;
            if(valor === null){
                setSearchData(sucursal);
            }
        }
        if( searchType == 'COD_REGIAO' ){
            url = url_buscar_region;
            if(valor === null){
                setSearchData(regiao);
            }
        }
        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor,'cod_empresa':zona.COD_EMPRESA,'cod_sucursal': zona.COD_SUCURSAL};
            
            await Main.Request( url, method, data).then( response => {
                if( response.status == 200 ){
                    if(searchType == 'COD_SUCURSAL'){
                        setSearchData(response.data.rows);
                    }
                    if(searchType == 'COD_EMPRESA'){
                        setSearchData(response.data.rows);
                    }
                    if(searchType == 'COD_REGIAO'){
                        setSearchData(response.data.rows);
                    }
                }
                RefreshBackgroundColor(true);
            })
        }else{
            RefreshBackgroundColor(true);
        }
    }
    const handleCancel = () => {
        setVisible(false);
        setVisibleSave(false);
        setVisibleMensaje(false);
    };
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    }
    const cerrar = () => {
        history.push(url_lista);
    }
    const [form] = Form.useForm();
    

    return (
        <Layout defaultOpenKeys={'BS','BS-BS1'}
                defaultSelectedKeys={"BS-BS1-null-BSZONAS"}> 
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
                            arrayActual={zona} 
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
                                    <Col span={12}>
                                        <Form.Item  
                                            label="Empresa"
                                            name="COD_EMPRESA"
                                            labelCol={{span:5}} 
                                            wrapperCol={{span:19}}>
                                            <Input.Group size="small">
                                                <Row gutter={8}>
                                                    <Col span={4}>
                                                        <Form.Item
                                                            name="COD_EMPRESA"
                                                            >
                                                            <Input 
                                                                name="COD_EMPRESA"
                                                                    disabled={true} 
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name="DESC_EMPRESA">
                                                            <Input
                                                                name="DESC_EMPRESA"
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
                                            label="Sucursal"
                                            labelCol={{span:4}} 
                                            wrapperCol={{span:20}}>
                                            <Input.Group size="small">
                                                <Row>
                                                    <Col span={4}>
                                                        <Form.Item
                                                            name="COD_SUCURSAL"
                                                            labelCol={{span:4}} 
                                                            wrapperCol={{span:20}}
                                                            >
                                                            <Input 
                                                                name="COD_SUCURSAL"
                                                                disabled={state}
                                                                onKeyDown={callmodal}
                                                                onChange={handleInputChange}
                                                                onBlur={callmodal}
                                                                ref={codSucursalFocus}
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name="DESC_SUCURSAL"
                                                            >
                                                            <Input
                                                                name="DESC_SUCURSAL"
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
                                            label="Región"
                                            name="COD_REGIAO"
                                            labelCol={{span:5}} 
                                            wrapperCol={{span:19}}
                                        >
                                            <Input.Group size="small">
                                                <Row gutter={8}>
                                                    <Col span={4}>
                                                        <Form.Item
                                                            name="COD_REGIAO">
                                                        <Input 
                                                            name="COD_REGIAO"
                                                            disabled={state}
                                                            onKeyDown={callmodal}
                                                            onChange={handleInputChange}
                                                            onBlur={callmodal}
                                                            ref={codRegiaoFocus}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name="DESC_REGIAO"
                                                            >
                                                            <Input
                                                                name="DESC_REGIAO"
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
                                            label="Codigo"
                                            name="COD_ZONA"
                                            labelCol={{span:4}} 
                                            wrapperCol={{span:20}}>
                                            <Input.Group size="small">
                                                <Row>
                                                    <Col span={4}>
                                                        <Form.Item
                                                            name="COD_ZONA"
                                                            labelCol={{span:4}} 
                                                            wrapperCol={{span:20}}
                                                            >
                                                            <Input 
                                                                name="COD_ZONA"
                                                                disabled={state}
                                                                onKeyDown={handleFocus}
                                                                onChange={handleInputChange}
                                                                ref={codZonaFocus}
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            label="Orden"
                                                            name="ORDEN"
                                                            labelCol={{span:4}} 
                                                            wrapperCol={{span:20}}
                                                            >
                                                            <Input
                                                                name="ORDEN"
                                                                type="number"
                                                                className="search_input"
                                                                ref={ordenFocus} 
                                                                onChange={handleInputChange}
                                                                onKeyDown={handleFocus}
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Input.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item 
                                            label="Descripción"
                                            name="DESCRIPCION"
                                            labelCol={{span:5}} 
                                            wrapperCol={{span:19}}                                                
                                            >
                                                <Input 
                                                    id="requerido"
                                                    name="DESCRIPCION" 
                                                    ref={descripcionFocus} 
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item 
                                            label="Barrio"
                                            name="BARRIOS"
                                            labelCol={{span:4}} 
                                            wrapperCol={{span:20}}
                                            >
                                                <Input 
                                                    name="BARRIOS" 
                                                    onKeyDown={handleFocus}
                                                    onChange={handleInputChange}
                                                    ref={barrioFocus} 
                                                    />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Observación"
                                            name="COMENTARIO"
                                            labelCol={{span:5}} 
                                            wrapperCol={{span:19}}
                                            >
                                                <TextArea 
                                                    name="COMENTARIO"
                                                    onChange={handleInputChange}
                                                    ref={comentarioFocus}
                                                />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            
                    </Form>
                </Paper>
            </div>
        </Layout>
    );
}

export default Zona;