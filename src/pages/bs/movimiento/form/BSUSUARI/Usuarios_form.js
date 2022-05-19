import React, { useEffect, useState , useRef} from 'react';
import { Redirect }                         from 'react-router-dom';
import Layout                               from "../../../../../components/utils/NewLayout";
import Paper                                from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}              from '../../../../../components/utils/ContenedorForm/ContainerFrom'
import FormModalSearch                      from "../../../../../components/utils/ModalForm/FormModalSearch";
import TableSearch                          from "../../../../../components/utils/TableSearch/TableSearch";
import { Request }                          from "../../../../../config/request";
import ModalDialogo                         from "../../../../../components/utils/Modal/ModalDialogo";
import {RefreshBackgroundColor}             from '../../../../../components/utils/TableSearch/TableSearch';
import Main                                 from "../../../../../components/utils/Main";

import {
    Form
  , Input
  , Checkbox
  , Row
  , Col
} from 'antd';


import { useHotkeys } from 'react-hotkeys-hook';

import "moment/locale/es";
import locale from "antd/es/locale/es_ES";
import moment from "moment";
moment.locale("es_es", {
    week: {
        dow: 3
    }
});

const Titulo  = 'Usuarios';
const cod_empresa                  = sessionStorage.getItem('cod_empresa');
const url_base = `/bs/usuarios/` + cod_empresa;

// * Buscadores

const url_buscar_grupo    = '/bs/usuarios/buscar/grupo';
const url_buscar_sucursal = '/bs/usuarios/buscar/sucursal';
const url_buscar_persona  = '/bs/usuarios/buscar/persona';

// * Validación de Datos 
const url_grupo    = '/bs/usuarios/valida/grupo';
const url_sucursal = '/bs/usuarios/valida/sucursal';
const url_persona  = '/bs/usuarios/valida/persona';

// VariablesAuxiliares
var codGrupoAux = ''
var codPersonaAux = ''
var codSucursalAux=''


const GrupoColumna = [
    { ID: 'COD_GRUPO'      , label: 'Grupo'           , width: 100    },
    { ID: 'DESCRIPCION'    , label: 'Descripcion'     , minWidth: 150 },
];

const SucursalColumna = [
    { ID: 'COD_SUCURSAL'   , label: 'Sucursal'        , width: 100    },
    { ID: 'DESCRIPCION'    , label: 'Descripcion'     , minWidth: 150 },
];

const PersonaColumna = [
    { ID: 'COD_PERSONA' , label: 'Codigo'            , minWidth: 40       , align: 'center' },
    { ID: 'NOMBRE'      , label: 'Nombre y Apellido' , minWidth: 150      , align: "left"   , width:300} ,
    { ID: 'RUC'         , label: 'Ruc'               , minWidth: 60       , align: 'left'   },
];

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ]
}

const FormName            = 'BSUSUARI'; 
const Usuario = ({ history, location, match}) => {
    var ArrayData       = new Array;
    // const buttonNameRef = useRef();
    const { params: { id }}              = match;
    const username                       = sessionStorage.getItem('cod_usuario');
    const dirr                           = "/bs/usuarios";

    const buttonSaveRef = useRef();
    const buttonExitRef = useRef();
    Main.useHotkeys('f10', (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys('ctrl+a', (e) =>{ 
        e.preventDefault();
        buttonExitRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});


    //State Modal
    const [modalTitle       , setModalTitle     ] = useState('');
    const [searchData       , setSearchData     ] = useState({});
    const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    //useState  Array
    const [estadoCheckbox] = useState(ArrayData);

    //State de Calendario

    const [usuario                , setUsuario                  ] = useState([]);
    const [auxData                , setAuxData                  ] = useState([]);
    const [grupo                  , setGrupo                    ] = useState([]);
    const [sucursal               , setSucursal                 ] = useState([]);
    const [persona                , setPersona                  ] = useState([]);
    const [searchColumns          , setSearchColumns            ] = useState({});
    const [isNew                  , setIsNew                    ] = useState(false);
    const [shows                  , setShows                    ] = useState(false);
    const [EstadoCheckbox         , setEstadoCheckbox           ] = useState(true);
    const [mensaje                , setMensaje                  ] = useState();
    const [imagen                 , setImagen                   ] = useState();
    const [tituloModal            , setTituloModal              ] = useState();
    const [visibleMensaje         , setVisibleMensaje           ] = useState(false);
    const [isNewInput             , setIsNewInput               ] = useState(true);

 // ADMINISTRAR FOCUS
    const [ inputCodSucFocus       , setinputCodSucFocus  ] = UseFocus();
    const [ codPersonaFocus        , setCodPersonaFocus   ] = UseFocus();
    const [ codGrupoFocus          , setCodGrupoFocus     ] = UseFocus();
    const [ estadoFocus            , setEstadoFocus       ] = UseFocus();
    const [ usuarioFocus           , setUsuarioFocus      ] = UseFocus();
    const [ claveFocus             , setClaveFocus        ] = UseFocus();

    const getGrupo = async() =>{
         try {
            var url    = url_buscar_grupo;
            var method = 'POST';
            var response = await Request( url, method, {"valor":"null"} )
            .then(response => {return response})
                if( response.data.rows.length > 0){
                    setGrupo(response.data.rows);
                    return response.data.rows
                }else{
                    setGrupo([]);
                    return []
                }
         } catch (error) {
             console.log(error);
         }
    }
     const getSucursal = async() =>{
        try {
           var url    = url_buscar_sucursal;
           var method = 'POST';
           var response = await Request( url, method, {"valor":"null", "COD_EMPRESA" :cod_empresa } )
           .then(response => {return response})
               if( response.data.rows.length > 0){
                   setSucursal(response.data.rows);
                   return response.data.rows
               }else{
                setSucursal([]);
                   return []
               }
        } catch (error) {
            console.log(error);
        }
    }
    const getPersona = async() =>{
        try {
           var url    = url_buscar_persona;
           var method = 'POST';
           var response = await Request( url, method, {"valor":"null"} )
           .then(response => {return response})
               if( response.data.rows.length > 0){
                   setPersona(response.data.rows);
                   return response.data.rows
               }else{
                setPersona([]);
                   return []
               }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(id === 'nuevo'){
            setUsuario({
                ...usuario,
                ['COD_EMPRESA']  :cod_empresa,
                ['TIPO']         :'I',
                ['USERNAME']    :username,
                ['ESTADO']    :'A',
            });
            setAuxData({
                ...usuario,
                ['COD_EMPRESA']  :cod_empresa,
                ['TIPO']         :'I',
                ['USERNAME']    :username,
                ['ESTADO']    :'A',
            })
            setIsNew(false);
            setIsNewInput(false);
  
            setTimeout(setUsuarioFocus,100);

        }else{
            getData();
            setinputCodSucFocus();

        }
    },[]);
    const getData = async() =>{
        try {
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setUsuario({
                    ...location.state.rows,
                    ['COD_EMPRESA']  :cod_empresa,
                    ['TIPO']: 'U',
                    ['USERNAME']: username
                })
                setAuxData({
                    ...location.state.rows,
                    ['COD_EMPRESA']  :cod_empresa,
                    ['TIPO']: 'U',
                    ['USERNAME'] :username
                })
                form.setFieldsValue({
                    ...location.state.rows,
                });

                if( location.state.rows.ESTADO == 'A' ){
                    setEstadoCheckbox(true);
                }else{
                    setEstadoCheckbox(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const direccionar = () =>{
        history.push(dirr);
    }
    const mayuscula = (e) => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };
    const handleInputChange = (event)=>{
        setUsuario({
            ...usuario,
            [event.target.name] : event.target.value
        })
        setUsuario({
            ...usuario,
            [event.target.name] : event.target.value
        })
    }
    const onFinish = async(values) => {
        var url    = url_base;
        var method = 'POST';
        try {
            await Request( url, method, usuario )
                .then(async(response) => {
                    var rows = response.data;
                    if(rows.ret == 1){
                        history.push(dirr);
                    }else{
                        if(rows.ret == 0){
                            showModalMensaje('Atención!','alerta',rows.p_mensaje);
                        } else {
                            showModalMensaje('ERROR!','error',rows.p_mensaje);
                        }
                    }
                });
        } catch (error) {
            console.log(error.response.data);
        }
        
    }
    const validar = (url,campo,campoDesc,dato,foco,p_descripcion,focoFailed,aux)=>{
        var data = {[campo]:dato,'COD_EMPRESA': cod_empresa};
        var method = 'POST';
        if (dato == aux) {
            return;
        }
        Request( url, method, data )
            .then( response => {
                if( response.status == 200 ){
                    if(response.data.outBinds.ret == 1){
                        setUsuario({
                            ...usuario,
                            [campo]: dato,
                            [campoDesc]: response.data.outBinds[p_descripcion],
                        });
                        form.setFieldsValue({
                            ...usuario,
                            [campo]: dato,
                            [campoDesc]: response.data.outBinds[p_descripcion],
                        });
                        foco();
                    } else {
                        setUsuario({
                            ...usuario,
                            
                            [campoDesc]: '',
                        });
                        form.setFieldsValue({
                            ...usuario,
                         
                            [campoDesc]: '',
                        });
                        focoFailed();
                        showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);
                    }
                } else {
                    setUsuario({
                        ...usuario,
                        [campo]: dato,
                        [campoDesc]: '',
                    });
                    form.setFieldsValue({
                        ...usuario,
                        [campo]: dato,
                        [campoDesc]: '',
                    });
                    focoFailed();
                    showModalMensaje('¡Error!','error','Ha ocurrido un error al validar el campo.');
                }
            RefreshBackgroundColor(true)
        })
    }
    const handleFocus = async (e) =>{
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if (e.target.name == 'COD_USUARIO' ){
                setCodPersonaFocus();
            }
            if (e.target.name == 'CLAVE' ){
                setCodGrupoFocus();
            }
            if (e.target.name == 'ESTADO' ){
                setUsuarioFocus();
             }        
        }

        if(e.target.value !== '' && e.target.value !== undefined){
            if(e.which === 13 || e.which === 9 || e.type == 'blur'){
                e.preventDefault();
                if (e.target.name == 'COD_PERSONA' ){
                    if (e.target.value == codPersonaAux) {
                        return;
                    }
                    validar(url_persona,e.target.name,"DESC_USUARIO",e.target.value,setinputCodSucFocus,'p_desc_persona',setCodPersonaFocus);
                    codPersonaAux = e.target.value;
                }
                if (e.target.name == 'COD_SUCURSAL' ){
                    if (e.target.value == codSucursalAux) {
                        return;
                    }
                    validar(url_sucursal,e.target.name,"DESC_SUCURSAL",e.target.value,setClaveFocus,'p_desc_sucursal',setinputCodSucFocus);
                    codSucursalAux = e.target.value;
                }
                if (e.target.name == 'COD_GRUPO'){
                    if (e.target.value == codGrupoAux) {
                        return;
                    }
                    validar(url_grupo,e.target.name,"DESC_GRUPO",e.target.value,setEstadoFocus,'p_desc_grupo',setCodGrupoFocus);
                    codGrupoAux = e.target.value;
                }
            }
        }

        if(e.which === 120 && ( e.target.name === 'COD_GRUPO'    ||
                                e.target.name === 'COD_SUCURSAL' ||
                                e.target.name === 'COD_PERSONA'  )) {
            e.preventDefault();

            if(e.target.name === 'COD_SUCURSAL'){
                var auxSucursal= await getSucursal(cod_empresa);
                setSearchColumns(SucursalColumna);
                setSearchData(auxSucursal);
                setModalTitle('Sucursal');
                setTipoDeBusqueda(e.target.name);
            }

            if(e.target.name === 'COD_GRUPO'){
                var auxForma= await getGrupo();
                setSearchColumns(GrupoColumna);
                setSearchData(auxForma);
                setModalTitle('Grupo');
                setTipoDeBusqueda(e.target.name);
            }
            if(e.target.name === 'COD_PERSONA'){
                var auxPersona = await getPersona();
                setSearchColumns(PersonaColumna);
                setSearchData(auxPersona);
                setModalTitle('Persona');
                setTipoDeBusqueda(e.target.name);
            }


            setShows(true);
        }
    }
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const onFinishFailed = (errorInfo) => {
        mensaje = errorInfo;
        setVisibleMensaje(true);
    }
    const handleCheckbox = (e) => {
        if(e.target.name === 'ESTADO' ){
            setUsuario({
                ...usuario,
                ['ESTADO']: e.target.checked ? 'A' : 'I'
            })
            setEstadoCheckbox(!EstadoCheckbox)
        }

    }
    const handleCancel = () => {
        setVisibleMensaje(false);
    };
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    }
    const [form] = Form.useForm();
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if( BusquedaPor === 'COD_SUCURSAL' ){
            setUsuario({
                ...usuario,
                ['COD_SUCURSAL']: datos[0],
                ['DESC_SUCURSAL']: datos[1],
            });
            form.setFieldsValue({
                ...usuario,
                ['COD_SUCURSAL']: datos[0],
                ['DESC_SUCURSAL']: datos[1],

            });
        }

        if( BusquedaPor === 'COD_GRUPO' ){
            setUsuario({
                ...usuario,
                ['COD_GRUPO']: datos[0],
                ['DESC_GRUPO']: datos[1],
            });
            form.setFieldsValue({
                ...usuario,
                ['COD_GRUPO']: datos[0],
                ['DESC_GRUPO']: datos[1],

            });
        }

        if( BusquedaPor === 'COD_PERSONA' ){
            setUsuario({
                ...usuario,
                ['COD_PERSONA']: datos[0],
                ['DESC_USUARIO']: datos[1],
            });
            form.setFieldsValue({
                ...usuario,
                ['COD_PERSONA']: datos[0],
                ['DESC_USUARIO']: datos[1],

            });
        }

        setShows(false);
    }
    const onInteractiveSearch = async(event)=> {
        var valor = event.target.value;
        valor = valor.trim();

        if(valor.length == 0 ){
            valor = null;
            RefreshBackgroundColor(true)
        }

        if( tipoDeBusqueda === 'COD_GRUPO' ){
            var url = url_buscar_grupo;
            if(valor == null) return getGrupo(grupo);
       
        }

       if( tipoDeBusqueda === 'COD_SUCURSAL' ){
            url = url_buscar_sucursal;
            if(valor == null) return getSucursal(sucursal);
        }

        if( tipoDeBusqueda === 'COD_PERSONA' ){
            url = url_buscar_persona;
            if(valor == null) return getPersona(persona);
        }

        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor,  "COD_EMPRESA":cod_empresa };
            await Request( url, method, data )
                .then( response => {
                    if( response.status == 200 ){
                         
                            setSearchData(response.data.rows)
                      
                    }
                RefreshBackgroundColor(true)
            })
        }
    }
    return (
        <>
            <Layout
                defaultOpenKeys={['BS','BS-BS2','BS-BS2-BS21']}
                defaultSelectedKeys={['BS-BS2-BS21-BSUSUARI']}> 
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
                    actionAceptar=""
                    />
                <div className="paper-container">
                    <Paper className="paper-style">
                        <TituloForm titulo={Titulo} />
                        <Form
                            layout="horizontal"
                            size="small"
                            autoComplete="off"
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                        <ButtonForm
                            dirr={dirr}
                            arrayAnterior={auxData}
                            arrayActual={usuario}
                            direccionar={direccionar}
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
                                <Col span={24}>
                                    <Row gutter={4}>
                                        <Col span={5}>
                                            <Form.Item
                                                label="Usuario"
                                                name="COD_USUARIO"
                                                labelCol={{span:12}}
                                                wrapperCol={{span:12}}
                                                >
                                                <Input
                                                    id="requerido"
                                                    name="COD_USUARIO"
                                                    onChange={handleInputChange}
                                                    disabled={isNewInput}
                                                    ref={usuarioFocus}
                                                    onKeyDown={handleFocus}
                                                    onInput={mayuscula}
                                                    required
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                             label="Persona"
                                                name="COD_PERSONA"
                                                labelCol={{span:12}}
                                                wrapperCol={{span:12}}
                                                onBlur={handleFocus}
                                                >
                                            <Input
                                                id="requerido"
                                                name="COD_PERSONA"
                                                onChange={handleInputChange}
                                                disabled={isNewInput}
                                                ref={codPersonaFocus}
                                                onKeyDown={handleFocus}
                                                onInput={mayuscula}
                                                required
                                                   />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} >
                                            <Form.Item
                                                name="DESC_USUARIO"
                                                wrapperCol={{span:24}}
                                                >
                                                <Input
                                                    name="DESC_USUARIO"
                                                    onChange={handleInputChange}
                                                    disabled={true}
                                                    onKeyDown={handleFocus}
                                                    required
                                                    />
                                            </Form.Item>
                                        </Col>

                                        <Col span={3} >
                                            <Form.Item
                                                label="Sucursal"
                                                name="COD_SUCURSAL"
                                                labelCol={{span:16}}
                                                wrapperCol={{span:8}}
                                                >
                                                <Input
                                                    id="requerido"
                                                    name="COD_SUCURSAL"
                                                    onChange={handleInputChange}
                                                    ref={inputCodSucFocus}
                                                    onKeyDown={handleFocus}
                                                    onBlur={handleFocus}
                                                    onInput={mayuscula}
                                                    required
                                                    />
                                            </Form.Item>
                                        </Col>

                                        <Col span={4} >
                                            <Form.Item
                                                name="DESC_SUCURSAL"
                                                wrapperCol={{span:24}}
                                                >
                                                <Input
                                                    name="DESC_SUCURSAL"
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    disabled={true}
                                                    required
                                                    />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                </Col>
                                <Col span={24}>
                                    <Row gutter={4}>
                                        <Col span={5}>
                                            <Form.Item
                                                label="Seña"
                                                name="CLAVE"
                                                labelCol={{span:12}}
                                                wrapperCol={{span:12}}
                                                >
                                                <Input
                                                    id="requerido"
                                                    name="CLAVE"
                                                    type="password"
                                                    onChange={handleInputChange}
                                                    ref={claveFocus}
                                                    onKeyDown={handleFocus}
                                                    onInput={mayuscula}
                                                    required
                                                    />
                                            </Form.Item>
                                        </Col>

                                        <Col span={4}>
                                            <Form.Item
                                                label="Grupo"
                                                name="COD_GRUPO"
                                                labelCol={{span:12}}
                                                wrapperCol={{span:12}}
                                                >
                                                <Input
                                                    id="requerido"
                                                    name="COD_GRUPO"
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleFocus}
                                                    onBlur={handleFocus}
                                                    onInput={mayuscula}
                                                    ref={codGrupoFocus}
                                                    />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8}>
                                            <Form.Item
                                                name="DESC_GRUPO"
                                                wrapperCol={{span:24}}
                                                >
                                            <Input
                                                name="DESC_GRUPO"
                                                onChange={handleInputChange}
                                                disabled={true}
                                                onKeyDown={handleFocus}
                                                onInput={mayuscula}
                                                required
                                                   />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item  label="Estado"
                                                        name="ESTADO"
                                                        labelCol={{span:8}}
                                                        wrapperCol={{span:12}}>
                                                <Checkbox name="ESTADO"
                                                checked={EstadoCheckbox}
                                                onChange={ handleCheckbox }
                                                ref={estadoFocus}
                                                >
                                                    {usuario.ESTADO == 'A' ? 'Activo' : 'Inactivo'}
                                                </Checkbox>
                                            </Form.Item>

                                            </Col>
                                    </Row>

                                </Col>

                             <hr style={{border: '0.-1px solid #fdffff', width:'100%',marginTop:'10px'}} />

                         </Row>

                        </div>

                       </Form>

                    </Paper>
                </div>
            </Layout>
        </>
    )
}

export default  Usuario;
