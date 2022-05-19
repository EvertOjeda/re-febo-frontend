import React, { useEffect,useState,useRef } from 'react'
import { Redirect, Link }                   from 'react-router-dom';
import Layout                               from "../../../../../components/utils/NewLayout";
import Paper                                from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}              from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import FormModalSearch                      from "../../../../../components/utils/ModalForm/FormModalSearch";
import { Request }                          from "../../../../../config/request";
import ModalDialogo                         from "../../../../../components/utils/Modal/ModalDialogo";
import Main                                 from '../../../../../components/utils/Main';
import {
      Form
    , Input
    , Card
    , Checkbox
    , Row
    , Col
} from 'antd';
var defaultOpenKeys      = sessionStorage.getItem("mode") === 'vertical' ? [] : ['BS', 'BS-BS1'];
var defaultSelectedKeys  = sessionStorage.getItem("mode") === 'vertical' ? [] : ['BS-BS1-null-BSREGIIP'];
const Titulo             = 'Configuración de Reclamo';
const url_lista          = `/bs/confreclamo/`;

const url_valida_usuario = `/bs/confreclamos/valida/usuario`;
const url_buscar_usuario = `/bs/confreclamos/buscar/usuario`;
const ColumnUsuario = [
    { ID: 'COD_USUARIO'   , label: 'Usuario'      ,  width:100     },
    { ID: 'DESC_USUARIO'  , label: 'Descripción'  ,  minWidth: 300 },
];
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName            = 'BSREGIIP';

//Funcion Principal
const ConfReclamo = ({ history, location, match}) => {
    const cod_empresa        = sessionStorage.getItem('cod_empresa');
    const username           = sessionStorage.getItem('cod_usuario');
    const url_post_base      = `/bs/confreclamos/` + cod_empresa;
    
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
    


    var ArrayData                     = new Array;
    const { params: { cod_usuario } } = match;
    const [form]                      = Form.useForm();
    //State Modal
    const [ modalTitle     , setModalTitle     ] = useState('');
    const [ searchData     , setSearchData     ] = useState({});
    const [ tipoDeBusqueda , setTipoDeBusqueda ] = useState();
    const [ isNew          , setIsNew          ] = useState(false);
    const [ reclamo        , setReclamo        ] = useState([]);
    const [ usuario        , setUsuario        ] = useState([]);
    const [ state          , setState          ] = useState(false);
    const [ shows          , setShows          ] = useState(false);
    const [ searchColumns  , setSearchColumns  ] = useState({});
    const [ estadoCheckbox                     ] = useState(ArrayData);
    const [ statusEstadoCheckbox , setStatusEstadoCheckbox ] = useState(true);
    const [visibleMensaje       , setVisibleMensaje        ] = useState(false);
    const [imagen               , setImagen                ] = useState();
    const [tituloModal          , setTituloModal           ] = useState();
    const [mensaje              , setMensaje               ] = useState();
    const [auxData              , setAuxData               ] = useState([]);
    //focus
    const [codUsuarioFocus      , setCodUsuarioFocus       ] = UseFocus()
    const [estadoFocus          , setEstadoFocus           ] = UseFocus() 
    
    useEffect(()=>{
        if(cod_usuario === 'nuevo'){
            setReclamo({
                ...reclamo,
                ['TIPO']        : 'I',
                ['COD_EMPRESA'] : cod_empresa,
                ['USERNAME']    : username,
            });
            setAuxData({
                ...reclamo,
                ['TIPO']        : 'I',
                ['COD_EMPRESA'] : cod_empresa,
                ['USERNAME']    : username,
            });
            setIsNew(true);
            setState(false);
            setCodUsuarioFocus();
        }else{
            if(location.state === undefined){
                history.push(url_lista);
            }
            setState(true);
            getData();
        }
    },[]);
    const getData = async() =>{
        try {
            setReclamo({
                 ...location.state.rows,
                ['TIPO']: 'U',
                ['USERNAME']: username,
                ['COD_USUARIO_ANT']: location.state.rows.COD_BARRIO,
            })
            setAuxData({
                 ...location.state.rows,
                ['TIPO']: 'U',
                ['USERNAME']: username,
                ['COD_USUARIO_ANT']: location.state.rows.COD_BARRIO,
            })
    
            form.setFieldsValue(location.state.rows);
            setcheckboxDefault();
            setTimeout(()=>setEstadoFocus(),50);
        } catch (error) {
            console.log(error);
        }
    };
    const getUsuario = async() =>{    
        var url    = url_buscar_usuario;
        var method = 'POST';
        return await Request( url, method, {"valor":"null"} )
            .then(response => {
                return response.data.rows;
            }) 
    };
    const handleInputChange = (event)=>{
        setReclamo({
            ...reclamo,
            [event.target.name] : event.target.value
        })
    };
    const handleFocus = async(e) =>{
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if(e.target.name === 'COD_USUARIO'){
                var url = url_valida_usuario;
                var method = 'POST';
                var data = { 'valor': e.target.value.toUpperCase() };
                try {
                    await Request( url,method, data )
                    .then( response => {
                        if(response.status == 200){
                            if(response.data.outBinds.ret == 1){
                                setUsuario({
                                    ...usuario,
                                    ['COD_USUARIO']  : e.target.value.toUpperCase(),
                                    ['DESC_USUARIO'] : response.data.outBinds.p_desc_usuario
                                })
                                form.setFieldsValue({
                                    ...form,
                                    ['COD_USUARIO']  : e.target.value.toUpperCase(),
                                    ['DESC_USUARIO'] : response.data.outBinds.p_desc_usuario
                                })
                                setTimeout(setEstadoFocus(),50);
                            }else{
                                showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                            }
                        }
                    })
                } catch (error) {
                    showModalMensaje('ERROR!','error','Error al realizar la peticion');
                }
            }
        }
        if(e.which === 120){
            if(e.target.name === 'COD_USUARIO'){
                var auxUsuario = await getUsuario();
                setModalTitle("Usuarios")
                setSearchColumns(ColumnUsuario)
                setSearchData(auxUsuario)
                setTipoDeBusqueda(e.target.name);       
                setShows(true);         
            }
        }
    };
    const showsModal = async (valor) => {
        setShows(valor);
    };
   
    const onInteractiveSearch = async(event)=> {
        var url   = '';
        var valor = event.target.value; 
        valor     = valor.trim();
        if(valor.length == 0 ){
            valor = 'null';
        }
        if( tipoDeBusqueda === 'COD_USUARIO' ){
            url = url_buscar_usuario;   
            if(valor == null){
                setSearchData(reclamo);
            }
        }
        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor};
            await Request( url, method, data)
                .then( response => {
                    if( response.status == 200 ){
                        if(tipoDeBusqueda === 'COD_USUARIO'){
                            setSearchData(response.data.rows)
                        }
                    }
                })
            }
    };
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if(datos !== "" || datos !== undefined){
            if( BusquedaPor === 'COD_USUARIO' ){
                setReclamo({
                    ...reclamo,
                    ['COD_USUARIO']   : datos[0],
                    ['DESC_USUARIO']  : datos[1]
                })
                form.setFieldsValue({
                    ...form,
                    ['COD_USUARIO']   : datos[0],
                    ['DESC_USUARIO']  : datos[1]
                })
                showsModal(false)
                setTimeout(()=>setEstadoFocus(),50)
            }
        }
    };
    
    const setcheckboxDefault = async () => {
        var option = location.state.OpcionChecbox;
        var ESTADO = location.state.rows.ESTADO;
        if(option !== undefined){
            if(option.length > 0){
                for (let i = 0; i < option.length; i++) {
                    if(option[i].options !== undefined){
                        if(option[i].options.includes(ESTADO)){   
                            ArrayData.push('ESTADO')
                        }
                    }
                }
            }
        }
    }

    const handleCancel = () => {
        setVisibleMensaje(false);
    };
    const handleCheckbox = (e) => {
        if(e.target.name === 'ESTADO' ){
            setReclamo({
                ...reclamo,
                ['ESTADO']: e.target.checked ? 'S' : 'N'
            })
            setStatusEstadoCheckbox(!statusEstadoCheckbox)
        }
    }
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    };
    const onFinish = async(values) => {
        var url    = url_post_base;
        var method = 'POST';
        await Request( url, method, reclamo )
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push(url_lista);
            }else{
                showModalMensaje('ERROR!','error',rows.p_mensaje);
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
        showModalMensaje('ERROR!','error','Ocurrio un error');
    };
    const cerrar = () => {
        history.push(url_lista);
    };
    if(cod_usuario != 'nuevo' && cod_usuario != 'modificar'){
        return <Redirect to={url_lista}/>
    };

    return (
        <>
            <Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <ModalDialogo 
                    positiveButton={""}
                    negativeButton={"OK"}
                    negativeAction={handleCancel}
                    onClose={handleCancel}
                    setShow={visibleMensaje}
                    title={tituloModal}
                    imagen={imagen}
                    mensaje={mensaje}/>
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
                            layout="horizontal"
                            size="small"
                            autoComplete="off"
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}>
                            <ButtonForm 
                                dirr={url_lista} 
                                arrayAnterior={auxData} 
                                arrayActual={reclamo} 
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
                                <Row gutter={8}>
                                    <Col span={14} style={{background:'grren'}}>
                                        <Row gutter={8}>
                                            <Col span={6} >
                                                <Form.Item
                                                    label="Usuario"
                                                    name="COD_USUARIO"
                                                    labelCol={{span:10}}
                                                    wrapperCol={{span:14}}
                                                    >
                                                    <Input
                                                        name="COD_USUARIO"
                                                        style={{padding:'0px 0px 0px 5px',textTransform:'uppercase'}}
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        onBlur={handleFocus}
                                                        disabled={state}
                                                        ref={codUsuarioFocus}
                                                        />
                                                        
                                                </Form.Item>
                                            </Col>
                                            <Col span={18}>
                                                <Form.Item
                                                    name="DESC_USUARIO"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input
                                                        name="DESC_USUARIO" disabled/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={3}>
                                        <Card>
                                            {estadoCheckbox.includes("ESTADO") ?
                                                <Checkbox  
                                                    checked={statusEstadoCheckbox} 
                                                    name="ESTADO"
                                                    ref={estadoFocus}
                                                    onChange={ handleCheckbox }>Estado
                                                </Checkbox>
                                                :
                                                <Checkbox ref={estadoFocus} name="ESTADO" onChange={ handleCheckbox }>Estado</Checkbox>
                                            }
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Paper>
                </div>
            </Layout>
        </>
    )
}

export default ConfReclamo;