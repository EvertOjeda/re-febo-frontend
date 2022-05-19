import React, { useEffect, useState, useRef }   from "react";
import { Redirect }                             from 'react-router-dom';
import Paper 							        from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}                  from '../../../../../components/utils/ContenedorForm/ContainerFrom';
// import { Request }                              from "../../../../config/request";
import FormModalSearch                          from "../../../../../components/utils/ModalForm/FormModalSearch";
// import TableSearch,{RefreshBackgroundColor}     from "../../../../components/utils/TableSearch/TableSearch";
import Layout                                   from "../../../../../components/utils/NewLayout";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import Main                                     from "../../../../../components/utils/Main";
import {Form
    ,   Input
    ,   Checkbox
    ,   Row
    ,   Card
    ,   Col
} from 'antd';

const valoresCheck  = ['A','I'];
const Titulo        = 'Usuarios sin restricción de sucursal';

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const searchsColumns = [
    { ID: 'CODIGO'          , label: 'Codigo'           , align: 'left'    , width: 80        },
    { ID: 'DESCRIPCION'     , label: 'Descripcion'      , minWidth: 150         },
];


const defaultOpenKeys     = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS','BS-BS2','BS-BS2-BS21'];
const defaultSelectedKeys = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS-BS2-BS21-BSSINLIM'];
const FormName            = 'BSSINLIM';

const Usuarios = ({ history, location, match}) =>{
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
    
    const url_buscar_usuario = '/bs/usuarios_sin_restriccion/buscar/usuario/' + sessionStorage.getItem('cod_empresa');

    const [usuario          , setUsuario            ] = useState({}); 
    const [state            , setState              ] = useState(false);
    const [auxData          , setAuxData            ] = useState({});  
    const [mensaje          , setMensaje            ] = useState();
    const [icono            , setIcono              ] = useState();
    const [visibleMensaje   , setVisibleMensaje     ] = useState(false);
    const [isNew            , setIsNew              ] = useState(false);
    const [tituloModal      , setTituloModal        ] = useState();
    const [usuarioNombre    , setUsuarioNombre      ] = useState({});
    const [searchType       , setSearchType         ] = useState('');
    const [searchColumns    , setSearchColumns      ] = useState({});
    const [searchData       , setSearchData         ] = useState({});
    const [modalTitle       , setModalTitle         ] = useState('');
    const [shows            , setShows              ] = useState(false);
    const [tipoDeBusqueda   , setTipoDeBusqueda     ] = useState();
    const dirr  = "/bs/usuarios_sin_restriccion";
    // ADMINISTRAR FOCUS
    const [codUsuarioFocus          , setCodUsuarioFocus            ] = UseFocus();
    const [estadoFocus              , setEstadoFocus                ] = UseFocus();
    const { params: { id } } = match;
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };


    useEffect(()=>{
        if(id == 'nuevo'){
            setState(false);
            setUsuario(valoresNuevo());
            setAuxData(valoresNuevo());
            form.setFieldsValue(valoresNuevo());
            setCodUsuarioFocus();
            setIsNew(true);
        }else{
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setState(true);
                setIsNew(false);
                getData();
            }
        }
    },[])
    const getData = async() =>{
        try {
            setUsuario(valores());
            setAuxData(valores());
            form.setFieldsValue(valores());
            setTimeout(setEstadoFocus, 100);
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
            ['COD_EMPRESA']         : sessionStorage.getItem('cod_empresa'),
            ['USERNAME']            : sessionStorage.getItem('cod_usuario'),
        }
    }
    const getUsuarioNombre = async() =>{
        let valorNombre = []
        try {
            var url     = url_buscar_usuario
            var method  = 'POST';
            valorNombre = await Main.Request(url,method,{valor:'null'}).then(response => {
                if( response.data.rows.length > 0){
                    
                    setUsuarioNombre(response.data.rows);
                    return response.data.rows
                }
            })
            return valorNombre
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setUsuario({
            ...usuario,
            [event.target.name] : event.target.value.toUpperCase(),
        });
        form.setFieldsValue({
            ...usuario,
            [event.target.name] : event.target.value.toUpperCase(),
        });
    }
    const marcarCheck = (event) => {
        var estado = valoresCheck;
        if(event.target.checked){
            setUsuario({
                ...usuario,
                [event.target.name] : estado[0],
            });
        } else {
            setUsuario({
                ...usuario,
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
            if(e.target.name == 'COD_USUARIO'){
                setEstadoFocus();
            }
            if(e.target.name == 'ESTADO'){
                setCodUsuarioFocus();
            }
        }
    }
    const onFinish = async() => {
        var url    = `/bs/usuarios_sin_restriccion/` + sessionStorage.getItem('cod_empresa');
        var method = 'POST';
        try{
            await Main.Request( url, method, usuario )
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
            if( BusquedaPor === 'COD_USUARIO' ){
                setUsuario({
                    ...usuario,
                    ['COD_USUARIO'] : datos[0],
                    ['NOMBRE']      : datos[1],
                });
                form.setFieldsValue({
                    ...usuario,
                    ['COD_USUARIO'] : datos[0],
                    ['NOMBRE']      : datos[1],
                });
                setTimeout( setEstadoFocus, 150 );
            }
        }
        setShows(false);
    }
    const callmodal = async(e) =>{
        var url   = '';
        setSearchType(e.target.name);
        setTipoDeBusqueda(e.target.name);
        var key = e.which;
        if( key == 120){        
            if( e.target.name == 'COD_USUARIO' ){
                var auxNombre = await getUsuarioNombre();
                url = url_buscar_usuario;
                setSearchColumns(searchsColumns);
                setSearchData(auxNombre);
                setModalTitle('Usuario');
                setShows(true)
            }
        }
        if(key !== undefined){
            if( key == 13 || key == 9 || e.type == 'blur'){
                e.preventDefault();
                if( e.target.name == 'COD_USUARIO' ){
                    url = '/bs/usuarios_sin_restriccion/valida/usuario' + sessionStorage.getItem('cod_empresa');
                }
                var method = 'POST';
                var data   = {'valor':e.target.value,'cod_empresa':usuario.COD_EMPRESA};
                await Main.Request( url, method, data)
                    .then( response =>{
                        if(response.status == 200){
                            if( response.data.outBinds.ret == 1 ){
                                if( e.target.name == 'COD_USUARIO' ){
                                    setUsuario({...usuario,
                                            ['COD_USUARIO']: e.target.value.toUpperCase(),
                                            ['NOMBRE']: response.data.outBinds.descripcion,
                                        });
                                    form.setFieldsValue({...usuario,
                                        ['COD_USUARIO']: e.target.value.toUpperCase(),
                                        ['NOMBRE']: response.data.outBinds.descripcion,
                                        });
                                    if(e.type != 'blur')
                                         setEstadoFocus();
                                }
                        }else{
                            if( e.target.name == 'COD_USUARIO' ){
                                setUsuario({
                                    ...usuario,
                                    ['COD_USUARIO']: '',
                                    ['NOMBRE']: '',
                                });
                                form.setFieldsValue({
                                    ...usuario,
                                    ['COD_USUARIO']: '',
                                    ['NOMBRE']: '',
                                });
                                showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);
                            }
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
        if(searchType == 'COD_USUARIO'){
            url = '/bs/usuarios_sin_restriccion/buscar/usuario' + sessionStorage.getItem('cod_empresa');
            if(valor === null){
                setSearchData(usuarioNombre);
            }
        }
        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor,'cod_modulo':usuario.COD_USUARIO};
            await Request( url, method, data ).then( response => {
                if( response.status == 200 ){
                    if(searchType == 'COD_USUARIO'){
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
    const [form] = Form.useForm();
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
        <Layout defaultOpenKeys={defaultOpenKeys}
                defaultSelectedKeys={ defaultSelectedKeys}> 
            <ModalDialogo 
                positiveButton={""}
                negativeButton={"OK"}
                negativeAction={handleCancel}
                onClose={handleCancel}
                setShow={visibleMensaje}
                title={tituloModal}
                imagen={icono}
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
                actionAceptar=""/>
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
                        onFinishFailed={onFinishFailed}>   
                    <ButtonForm 
                        dirr={dirr} 
                        arrayAnterior={auxData} 
                        arrayActual={usuario} 
                        direccionar={cerrar}
                        isNew={isNew}
                        onFinish={onFinish}
                        buttonGuardar={buttonSaveRef}
                        buttonVolver={buttonExitRef}
                        formName={FormName}/>
                        <div className="form-container">
                            <Card style={{paddingTop:"10px", margin:"5px"}}>
                                <Row gutter={[8]}>
                                    <Col span={18}>
                                        <Form.Item  
                                            label="Usuario"
                                            name="COD_USUARIO"
                                            onChange={handleInputChange}
                                            labelCol={{span:2}}
                                            wrapperCol={{span:22}}>
                                            <Input.Group size="small">
                                                <Row gutter={8}>
                                                    <Col span={4}>
                                                        <Form.Item name="COD_USUARIO">
                                                            <Input 
                                                                id="requerido"
                                                                name="COD_USUARIO"
                                                                disabled={state}
                                                                className="search_input"
                                                                onChange={handleInputChange}
                                                                onKeyDown={callmodal}
                                                                onBlur={callmodal}
                                                                ref={codUsuarioFocus}
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item name="NOMBRE">
                                                            <Input
                                                                name="NOMBRE"
                                                                disabled={true} 
                                                                />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Input.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} >
                                        <Form.Item
                                            label={"Estado"} >
                                            <Card style={{height:"23px", backgroundColor:"#22000020", paddingLeft:"0px"}} onClick={marcarCheck}> 
                                                <Row>
                                                    <Checkbox
                                                        name="ESTADO"
                                                        type="checkbox"
                                                        ref={estadoFocus}
                                                        checked={usuario.ESTADO == 'A'}
                                                        onChange={marcarCheck}
                                                        style={{marginTop:"2px"}}
                                                        onKeyDown={handleFocus}
                                                    >
                                                        {usuario.ESTADO == 'A' ? "Activo" : "Inactivo"}
                                                    </Checkbox>
                                                </Row>
                                            </Card>   
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    </Form>
                </Paper>
            </div>
        </Layout>
    );
}
export default Usuarios;