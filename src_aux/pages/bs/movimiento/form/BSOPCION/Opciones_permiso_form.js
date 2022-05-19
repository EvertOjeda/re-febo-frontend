import React, { useEffect, useState , useRef} from 'react';
import Layout                                 from "../../../../../components/utils/NewLayout";
import Paper                                  from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}                from '../../../../../components/utils/ContenedorForm/ContainerFrom'
import FormModalSearch                        from "../../../../../components/utils/ModalForm/FormModalSearch";
import ModalDialogo                           from "../../../../../components/utils/Modal/ModalDialogo";
import Main                                   from '../../../../../components/utils/Main'; 
import { Form, Input , Row , Col }            from 'antd'

import "moment/locale/es";
import moment from "moment";
moment.locale("es_es", {
    week: {
        dow: 3
    }
});

const Titulo  = 'Opciones de Permisos';
// * BUSCADORES
const url_buscar_forma   = '/bs/opcionespermisos/buscar/forma';
// * VALIDADORES
const url_opcion_permiso = '/bs/opcionespermisos/valida/forma';
const FormaColumna = [
    { ID: 'NOM_FORMA'      , label: 'Forma'           , width: 100    },
    { ID: 'DESCRIPCION'    , label: 'Descripcion'     , minWidth: 150 },
];
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const defaultOpenKeys     = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS','BS-BS2','BS-BS2-BS21'];
const defaultSelectedKeys = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS-BS2-BS21-BSOPCION'];
const FormName            = 'BSOPCION';

//Funcion Principal
const Opciones = ({ history, location, match}) => {

    const { params: { id }}  = match;
    const username           = sessionStorage.getItem('cod_usuario');
    const cod_empresa        = sessionStorage.getItem('cod_empresa');
    const dirr               = "/bs/opcionespermiso";

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

    //State Modal
    const [modalTitle        , setModalTitle     ] = useState('');
    const [searchData        , setSearchData     ] = useState({});
    const [tipoDeBusqueda    , setTipoDeBusqueda ] = useState();
    //useState  Array    
    const [parametro         , setParametro      ] = useState([]);
    const [auxData           , setAuxData        ] = useState([]);
    const [searchColumns     , setSearchColumns  ] = useState({});
    const [isNew             , setIsNew          ] = useState(false);
    const [shows             , setShows          ] = useState(false);
    const [mensaje           , setMensaje        ] = useState();
    const [imagen            , setImagen         ] = useState();
    const [tituloModal       , setTituloModal    ] = useState();
    const [visibleMensaje    , setVisibleMensaje ] = useState(false);
    const [isNewInput        , setIsNewInput     ] = useState(true);
    // ADMINISTRAR FOCUS
    const [ parametroFocus       , setParametroFocus         ] = UseFocus();
    const [ codFormaFocus        , setCodFormaFocus          ] = UseFocus();
    const [ descripcionFocus     , setDescripcionFocus       ] = UseFocus(); 
    const getForma = async() =>{
        try {
            var url    = url_buscar_forma;
            var method = 'POST';
            var response = await Main.Request( url, method, {"valor":"null"})
            .then(response => {
                return response
            })
            if( response.data.rows.length > 0){
                return response.data.rows
            }else{
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(id === 'nuevo'){
            setParametro({
                ...parametro,     
                ['COD_EMPRESA']  :cod_empresa,
                ['TIPO']         :'I',
                ['USERNAME']     :username
            });
            setAuxData({
                ...parametro,     
                ['COD_EMPRESA']  :cod_empresa,
                ['TIPO']         :'I',
                ['USERNAME']     : username
            })
            setIsNew(false);
            setIsNewInput(false);
            setTimeout(setParametroFocus,100);  
        }else{
            getData();
            setTimeout(setDescripcionFocus,100);  
        }
    },[]);
    const getData = async() =>{
        try {
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setParametro({
                    ...location.state.rows,
                    ['COD_EMPRESA'] : cod_empresa,
                    ['TIPO']        : 'U',
                    ['USERNAME']    : username
                })
                setAuxData({
                    ...location.state.rows,
                    ['COD_EMPRESA'] :cod_empresa,
                    ['TIPO']        : 'U',
                    ['USERNAME']    :username
                })  
                form.setFieldsValue({
                    ...location.state.rows,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    const cerrar = () =>{
        history.push(dirr);
    }
    const mayuscula = (e) => {
        e.target.value = ("" + e.target.value).toUpperCase();
    }
    const handleInputChange = (event)=>{
        setParametro({
            ...parametro,
            [event.target.name] : event.target.value
        })
        setParametro({
            ...parametro,
            [event.target.name] : event.target.value
        })       
    }
    const onFinish = async(values) => {
        var url    = `/bs/opcionespermisos`;
        var method = 'POST';
        await Main.Request( url, method, parametro)
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push(dirr);
            }else{
                showModalMensaje('ERROR!','error',rows.p_mensaje);
            }
        });
    }
    const handleFocus = async (e) =>{ 
        if(e.which === 13 || e.which === 9){
            if (e.target.name == 'PARAMETRO' ){
                setCodFormaFocus();
            } 
            if (e.target.name == 'NOM_FORMA' ){
                e.preventDefault();
                var url    = url_opcion_permiso
                var method = 'POST'
                var data = {'valor':e.target.value}
                Main.Request(url, method, data)
                .then( response => {
                    if( response.status == 200 ){
                        if(response.data.outBinds.ret == 1){
                            setParametro({
                                ...parametro,
                                ['NOM_FORMA'] :e.target.value.toUpperCase(),
                            })
                            form.setFieldsValue({
                                ...form,
                                ['NOM_FORMA'] :e.target.value.toUpperCase(),
                            })
                            setDescripcionFocus();
                        }else{
                            showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                        }
                    }
                });
            } 
        } 
        if(e.which === 120){
            e.preventDefault();
            if(e.target.name === 'NOM_FORMA'){
                var auxForma= await getForma();
                setSearchColumns(FormaColumna);
                setSearchData(auxForma);
                setModalTitle('Formulario');
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
        if( BusquedaPor === 'NOM_FORMA' ){
            setParametro({
                ...parametro,
                ['NOM_FORMA']: datos[0],
            });
            form.setFieldsValue({
                ...parametro,
                ['NOM_FORMA']: datos[0],
            });
            setTimeout( setDescripcionFocus, 100 );
        }
        setShows(false);
    }
    const onInteractiveSearch = async(event)=> {
        var valor = event.target.value;
        valor = valor.trim();
        if(valor.length == 0 ){
            valor = null;
        }
        var method = 'POST';
        var data   = {'valor':valor};
        await Main.Request( url_buscar_forma, method, data)
        .then( response => {
            if( response.status == 200 ){
                if(tipoDeBusqueda === 'NOM_FORMA'){
                    setSearchData(response.data.rows)
                }
            }
        })
    }
    return (
        <>
            <Layout 
                defaultOpenKeys={defaultOpenKeys} 
                defaultSelectedKeys={defaultSelectedKeys}>
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
                                arrayActual={parametro} 
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
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Parametro"
                                                    name="PARAMETRO"
                                                    labelCol={{span:6}}
                                                    wrapperCol={{span:18}} >
                                                    <Input
                                                        id="requerido"
                                                        name="PARAMETRO"                                                  
                                                        onChange={handleInputChange}
                                                        disabled={isNewInput}
                                                        ref={parametroFocus}
                                                        onKeyDown={handleFocus}
                                                        onInput={mayuscula}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Forma"
                                                    name="NOM_FORMA"
                                                    labelCol={{span:6}}
                                                    wrapperCol={{span:18}}>
                                                    <Input 
                                                        name="NOM_FORMA"
                                                        id="requerido"                                               
                                                        onChange={handleInputChange}
                                                        disabled={isNewInput}
                                                        ref={codFormaFocus}
                                                        onKeyDown={handleFocus}
                                                        onInput={mayuscula}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Descripcion"
                                            name="DESCRIPCION"
                                            labelCol={{span:4}}
                                            wrapperCol={{span:20}} 
                                            >
                                            <Input
                                                name="DESCRIPCION"                                                  
                                                onChange={handleInputChange}
                                                ref={descripcionFocus}
                                                onKeyDown={handleFocus}
                                                onInput={mayuscula}/>
                                        </Form.Item>
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

export default  Opciones;