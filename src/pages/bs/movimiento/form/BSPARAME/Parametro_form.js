import React, { useEffect, useState , useRef} from 'react';
import Layout                               from "../../../../../components/utils/NewLayout";
import Paper                                from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}              from '../../../../../components/utils/ContenedorForm/ContainerFrom'
import FormModalSearch                      from "../../../../../components/utils/ModalForm/FormModalSearch";
import { Request }                          from "../../../../../config/request";
import ModalDialogo                         from "../../../../../components/utils/Modal/ModalDialogo";
import {RefreshBackgroundColor}             from '../../../../../components/utils/TableSearch/TableSearch';
import Main                                 from "../../../../../components/utils/Main";
import {
    Form
  , Input
  , Row
  , Col
} from 'antd';
import "moment/locale/es";
import locale from "antd/es/locale/es_ES";
import moment from "moment";
moment.locale("es_es", {
    week: {
        dow: 3
    }
});
const Titulo  = 'Parametros Generales';
// * BUSCADORES
const url_buscar_modulo = '/bs/parametros/buscar/modulo';
// * VALIDADORES
const url_valida_modulo = '/bs/parametros/valida/modulo';
const moduloColumn = [
    { ID: 'COD_MODULO'     , label: 'Código'           , width: 100    },
    { ID: 'DESCRIPCION'    , label: 'Descripcion'      , minWidth: 150 },
];
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const defaultOpenKeys     = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS','BS-BS2','BS-BS2-BS21'];
const defaultSelectedKeys = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS-BS2-BS21-BSPARAME'];
const FormName            = 'BSPARAME';
const Parametro = ({ history, location, match}) => {
    var ArrayData       = new Array;
    const { params: { id    }}  = match;
    const username                     = sessionStorage.getItem('cod_usuario');
    const dirr                         = "/bs/parametros";
    const cod_empresa                  = sessionStorage.getItem('cod_empresa');

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
    const [modalTitle       , setModalTitle     ] = useState('');
    const [searchData       , setSearchData     ] = useState({});
    const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    const [paraMetro              , setParametro                ] = useState([]);
    const [auxData                , setAuxData                  ] = useState([]);
    const [modulo                 , setModulo                   ] = useState([]);
    const [searchColumns          , setSearchColumns            ] = useState({});
    const [isNew                  , setIsNew                    ] = useState(false);
    const [stateNuevo             , setStateNuevo               ] = useState(false);
    const [shows                  , setShows                    ] = useState(false);
    const [mensaje                , setMensaje                  ] = useState();
    const [imagen                 , setImagen                   ] = useState();
    const [tituloModal            , setTituloModal              ] = useState();
    const [visibleMensaje         , setVisibleMensaje           ] = useState(false);
    const [isNewInput             , setIsNewInput               ] = useState(true);
    // ADMINISTRAR FOCUS
    const [ parametroFocus       , setparametroFocus         ] = UseFocus();
    const [ codModuloFocus       , setCodModuloFocus         ] = UseFocus();
    const [ descripcionFocus     , setDescripcionFocus       ] = UseFocus();
    const [ valorFocus           , setValorFocus             ] = UseFocus();
   
    const getModulo = async() =>{
        try {
             var url    = url_buscar_modulo;
             var method = 'POST';
             var response = await Request( url, method, {"valor":"null"} )
            .then(response => {return response})
             if( response.data.rows.length > 0){
                 setModulo(response.data.rows);
                 return response.data.rows
             }else{
                 setModulo([]);
                 return []
             }
        } catch (error) {
            console.log(error);
        }
    }
   
    useEffect(()=>{
        if(id === 'nuevo'){
            setParametro({
                ...paraMetro,     
                ['COD_EMPRESA']  :cod_empresa,
                ['TIPO']         :'I',
                 ['USERNAME']    :username
            });
            setAuxData({
                ...paraMetro,     
                ['COD_EMPRESA']  :cod_empresa,
                ['TIPO']         :'I',
                ['USERNAME']: username
            })
            
            setIsNew(false);
            setIsNewInput(false);
            setTimeout(setparametroFocus,100);  
      
        }else{
            getData();
            setTimeout(setDescripcionFocus,100);  
        
        }
        setStateNuevo(true);
    },[]);
    const getData = async() =>{
        try {
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setParametro({
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
            }
        } catch (error) {
            console.log(error);
        }
    }

    const direccionar = () =>{
        history.push(dirr);
    }
    const validarCapo = (e) =>{
       var key = window.event ? e.which : e.keyCode;
       if (key < 48 || key > 57) {
        e.preventDefault();
       }
    }
    const mayuscula = (e) => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };
    const handleInputChange = (event)=>{
        setParametro({
            ...paraMetro,
            [event.target.name] : event.target.value
        })
        setParametro({
            ...paraMetro,
            [event.target.name] : event.target.value
        })
    }
    const onFinish         = async(values) => {
        var url    = `/bs/parametros`;
        var method = 'POST';
        await Request( url, method, paraMetro )
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push(dirr);
            }else{
                showModalMensaje('ERROR!','error',rows.p_mensaje);
            }
        });
    }
    const validar = (url,campo,campoDesc,dato,foco)=>{
        var data = {[campo]:dato};
        var method = 'POST';
        Request( url, method, data )
            .then( response => {
                console.log(response)
                if( response.status == 200 ){
                    if(response.data.outBinds.ret == 1){
                        setParametro({
                            ...paraMetro,
                            [campo]: dato,
                            [campoDesc]: response.data.outBinds.p_descripcion,
                        });
                        form.setFieldsValue({
                            ...paraMetro,
                            [campo]: dato,
                            [campoDesc]: response.data.outBinds.p_descripcion,
                        });
                        foco();
                    } else {
                        setParametro({
                            ...paraMetro,
                            [campo]: dato,
                            [campoDesc]: '',
                        });
                        form.setFieldsValue({
                            ...paraMetro,
                            [campo]: dato,
                            [campoDesc]: '',
                        });
                        showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);
                    }
                } else {
                    setParametro({
                        ...paraMetro,
                        [campo]: dato,
                        [campoDesc]: '',
                    });
                    form.setFieldsValue({
                        ...paraMetro,
                        [campo]: dato,
                        [campoDesc]: '',
                    });
                    showModalMensaje('¡Error!','error','Ha ocurrido un error al validar el campo.');
                }
            RefreshBackgroundColor(true)
        })
    }
    const handleFocus = async (e) =>{ 
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if (e.target.name == 'PARAMETRO' ){
                setCodModuloFocus();
            } 
            if (e.target.name == 'COD_MODULO' ){
                validar(url_valida_modulo,e.target.name,"DESC_MODULO",e.target.value,setDescripcionFocus);
            }  
            if (e.target.name == 'DESCRIPCION' ){
                setValorFocus();
            } 
            if (e.target.name == 'VALOR' ){
                setparametroFocus();
            }  
        } 
        if(e.which === 120 && (
           e.target.name === 'COD_MODULO'   
           )){
            e.preventDefault();
            if(e.target.name === 'COD_MODULO'){
                
              var auxModulo = await getModulo();
                setSearchColumns(moduloColumn);
                setSearchData(auxModulo);
                setModalTitle('Modulos');
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
        var url   = '';
        var valor = '';
        var method = 'POST';
        var data   = {['COD_MODULO']:datos[0],['DESC_MODULO']:datos[1]}
        if( BusquedaPor === 'COD_MODULO' ){
            setParametro({
                ...paraMetro,
                ['COD_MODULO']: datos[0],
                ['DESC_MODULO']: datos[1],
            });
            form.setFieldsValue({
                ...paraMetro,
                ['COD_MODULO']: datos[0],
                ['DESC_MODULO']: datos[1],
            });
            setTimeout( ()=>{
                setDescripcionFocus();
            },100 ) 
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

        if( tipoDeBusqueda === 'COD_MODULO' ){
            if(valor == null) return setModulo(modulo);   
        }

        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor};
            await Request( url_buscar_modulo, method, data )
                .then( response => {
                    if( response.status == 200 ){
                        if(tipoDeBusqueda === 'COD_MODULO'){
                            setSearchData(response.data.rows)
                        }
                    }
                RefreshBackgroundColor(true)
            })
        }
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
                            onFinishFailed={onFinishFailed}>
                        <ButtonForm 
                            dirr={dirr} 
                            arrayAnterior={auxData} 
                            arrayActual={paraMetro} 
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
                            <Row gutter={8}>
                                <Col span={12}>
                                    <Row gutter={8}>
                                        <Col span={18}>
                                            <Form.Item
                                                label="Parametro"
                                                name="PARAMETRO"
                                                labelCol={{span:6}}
                                                wrapperCol={{span:24}} 
                                                >
                                                <Input
                                                    name="PARAMETRO"                                                  
                                                     onChange={handleInputChange}
                                                    disabled={isNewInput}
                                                    ref={parametroFocus}
                                                    onKeyDown={handleFocus}
                                                    onInput={mayuscula}
                                                    required
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                             label="Modulo"
                                                name="COD_MODULO"
                                                labelCol={{span:12}}
                                                wrapperCol={{span:12}}
                                                >
                                            <Input 
                                                name="COD_MODULO"                                                  
                                                onChange={handleInputChange}
                                                disabled={isNewInput}
                                                ref={codModuloFocus}
                                                onKeyDown={handleFocus}
                                                onInput={mayuscula}
                                                required
                                                   />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12} >
                                <Row gutter={8}>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Descripcion"
                                                name="DESCRIPCION"
                                                wrapperCol={{span:24}} 
                                                >
                                                <Input
                                                    name="DESCRIPCION"                                                  
                                                    onChange={handleInputChange}
                                                    ref={descripcionFocus}
                                                    onKeyDown={handleFocus}
                                                    required
                                                    />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row gutter={8}>
                                        <Col span={18}>
                                            <Form.Item
                                                label="Valor"
                                                name="VALOR"
                                               labelCol={{span:6}}
                                               wrapperCol={{span:24}} 
                                                >
                                                <Input
                                                    name="VALOR"                                                  
                                                    onChange={handleInputChange}
                                                    ref={valorFocus}
                                                    onKeyDown={handleFocus}
                                                    required
                                                    />
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
export default  Parametro;