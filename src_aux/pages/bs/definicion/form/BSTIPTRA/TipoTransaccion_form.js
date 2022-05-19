import React, { useEffect, useState , useRef} from 'react';
import { Redirect }                         from 'react-router-dom';
import Layout                               from "../../../../../components/utils/NewLayout";
import Paper                                from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}              from '../../../../../components/utils/ContenedorForm/ContainerFrom'
import FormModalSearch                      from "../../../../../components/utils/ModalForm/FormModalSearch";
import { Request }                          from "../../../../../config/request";
import ModalDialogo                         from "../../../../../components/utils/Modal/ModalDialogo";
import {RefreshBackgroundColor}             from '../../../../../components/utils/TableSearch/TableSearch';
import Main                                 from "../../../../../components/utils/Main"
import {
    Form
  , Input
  , Card
  , Checkbox
  , Row
  , Col
} from 'antd';
// import { useHotkeys } from 'react-hotkeys-hook';
import moment from "moment";
const Titulo  = 'Tipo de Transación';
// * BUSCADORES
const url_buscar_modulo = '/bs/tipotrans/buscar/modulo';
// * VALIDADORES
const url_valida_modulo = '/bs/tipotrans/valida/modulo';
const moduloColumn = [
    { ID: 'COD_MODULO'     , label: 'Código'           , width: 100    },
    { ID: 'DESCRIPCION'    , label: 'Descripcion'      , minWidth: 150 },
];

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName = 'BSTIPTRA';
const TipoTransaccion = ({ history, location, match}) => {
    var ArrayData       = new Array;
    const { params: { cod_tipo       }}  = match;
    const username                       = sessionStorage.getItem('cod_usuario');
    const dirr                           = "/bs/tipotrans";
    const cod_empresa                    = sessionStorage.getItem('cod_empresa');
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

    const [tipoTrans              , setTipoTrans                ] = useState([]);
    const [auxData                , setAuxData                  ] = useState([]);
    const [modulo                 , setModulo                   ] = useState([]);
    const [searchColumns          , setSearchColumns            ] = useState({});
    const [isNew                  , setIsNew                    ] = useState(false);
    const [shows                  , setShows                    ] = useState(false);
    const [statusEstadoCheckbox   , setStatusEstadoCheckbox     ] = useState(true);
    const [mensaje                , setMensaje                  ] = useState();
    const [imagen                 , setImagen                   ] = useState();
    const [tituloModal            , setTituloModal              ] = useState();
    const [visibleMensaje         , setVisibleMensaje           ] = useState(false);
    const [isNewInput             , setIsNewInput               ] = useState(true);

 // ADMINISTRAR FOCUS
     
    const [ codModuloFocus       , setCodModuloFocus         ] = UseFocus();
    const [ tipoTransFocus       , setTipoTransFocus         ] = UseFocus();
    const [ descripcionFocus     , setDescripcionFocus       ] = UseFocus();
    const [ estadoFocus          , setEstadoFocus            ] = UseFocus();
   
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
        if(cod_tipo === 'nuevo'){ 
            setTipoTrans(valoresNuevo());
            setAuxData(valoresNuevo());
            setIsNew(false);
            setIsNewInput(false);
            setTimeout(setCodModuloFocus,100);  
            setModulo();
            form.setFieldsValue({ });
        }else{
            getData();
            setEstadoFocus();
        }
    },[]);
    const getData = async() =>{
        try {
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setTipoTrans(valores())
                setAuxData(valores())  
                form.setFieldsValue(valores());
            }
        } catch (error) {
            console.log(error);
        }
    }
    const valoresNuevo = () => {
        return {
            ...tipoTrans,
            ['COD_EMPRESA']  : cod_empresa,
            ['TIPO_TRANS']   : ""  ,
            ['ESTADO']       :'N',
            ['TIPO']         :'I',
            ['USERNAME']     : username
        }
    }
    const valores = ()=> {
        return {
            ...location.state.rows,
            ['TIPO']: 'U',
            ['USERNAME']: username
        }
    }
    const direccionar = () =>{
        history.push(dirr);
    }
    const handleInputChange = (event)=>{
        
        console.log(event.target.name);

        setTipoTrans({
            ...tipoTrans,
            [event.target.name] : event.target.value.toUpperCase()
        })
        form.setFieldsValue({
            ...tipoTrans,
            [event.target.name] : event.target.value.toUpperCase()
        })
    }
    const onFinish = async(values) => {
        var url    = `/bs/tipotrans/` + cod_empresa;
        var method = 'POST';
        await Request( url, method, tipoTrans )
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
                        setTipoTrans({
                            ...tipoTrans,
                            [campo]: dato,
                            [campoDesc]: response.data.outBinds.p_descripcion,
                        });
                        form.setFieldsValue({
                            ...tipoTrans,
                            [campo]: dato,
                            [campoDesc]: response.data.outBinds.p_descripcion,
                        });
                        foco();
                    } else {
                        setTipoTrans({
                            ...tipoTrans,
                            [campo]: dato,
                            [campoDesc]: '',
                        });
                        form.setFieldsValue({
                            ...tipoTrans,
                            [campo]: dato,
                            [campoDesc]: '',
                        });
                        showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);
                        console.log(response.data.outBinds.p_mensaje);
                    }
                } else {
                    setTipoTrans({
                        ...tipoTrans,
                        [campo]: dato,
                        [campoDesc]: '',
                    });
                    form.setFieldsValue({
                        ...tipoTrans,
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
            if (e.target.name == 'COD_MODULO' ){
                validar(url_valida_modulo,e.target.name,"DESC_MODULO",e.target.value,setDescripcionFocus );
            } 
            // if (e.target.name == 'COD_MODULO' ){
            //     setDescripcionFocus();
            // }
            if (e.target.name == 'DESCRIPCION' ){
                setEstadoFocus();
            }  
        } 
        if(e.which === 120){
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
        showModalMensaje("Error!","error",errorInfo);
    }
    const handleCheckbox = (e) => {
        if(e.target.name === 'ESTADO' ){
            setTipoTrans({
                ...tipoTrans,
                ['ESTADO']: e.target.checked ? 'S' : 'N'
            })
            setStatusEstadoCheckbox(!statusEstadoCheckbox)
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
        if( BusquedaPor === 'COD_MODULO' ){
            setTipoTrans({
                ...tipoTrans,
                ['COD_MODULO']: datos[0],
                ['DESC_MODULO']: datos[1],
            });
            form.setFieldsValue({
                ...tipoTrans,
                ['COD_MODULO']: datos[0],
                ['DESC_MODULO']: datos[1],
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
                defaultOpenKeys={['BS','BS-BS1']} 
                defaultSelectedKeys={['BS-BS1-null-BSTIPTRA']}>
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
                        // <TableSearch
                        //     onInteractiveSearch={onInteractiveSearch}
                        //     columns={searchColumns}
                        //     dataSource={searchData}
                        //     modalSetOnClick={modalSetOnClick}
                        //     tipoDeBusqueda={tipoDeBusqueda}
                        // />
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
                                arrayActual={tipoTrans} 
                                direccionar={direccionar}
                                isNew={isNew}
                                onFinish={onFinish}
                                buttonGuardar={buttonSaveRef}
                                buttonVolver={buttonExitRef}
                                formName={FormName}/>
                            <div className="form-container">
                                <Row>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={6}>
                                                <Form.Item
                                                    label="Modulo"
                                                    name="COD_MODULO"
                                                    labelCol={{span:14}}
                                                    wrapperCol={{span:10}} 
                                                    >
                                                    <Input
                                                        name="COD_MODULO"                                                  
                                                        onChange={handleInputChange}
                                                        disabled={isNewInput}
                                                        ref={codModuloFocus}
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={18}>
                                                <Form.Item
                                                    name="DESC_MODULO"
                                                    wrapperCol={{span:24}}
                                                    >
                                                <Input 
                                                    name="DESC_MODULO" 
                                                    disabled={true}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={6}>
                                                <Form.Item
                                                    label="Tipo"
                                                    name="TIPO_TRANS"
                                                    labelCol={{span:14}}
                                                    wrapperCol={{span:9}}
                                                    >
                                                    <Input
                                                        name="TIPO_TRANS"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={tipoTransFocus}
                                                        disabled={true}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item
                                                    name="DESCRIPCION"
                                                    >
                                                    <Input
                                                        name="DESCRIPCION"                                          
                                                        onChange={handleInputChange}
                                                        // disabled={isNewInput}
                                                        onKeyDown={handleFocus}
                                                        ref={descripcionFocus}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Estado"
                                                    labelCol={{span:10}}
                                                    wrapperCol={{span:14}}>
                                                    <Card style={{height:"23px", paddingLeft:"10px"}}>
                                                        <Row gutter={[30]}>
                                                            <Checkbox  
                                                                name="ESTADO"
                                                                type="checkbox"
                                                                ref={estadoFocus}
                                                                checked={tipoTrans.ESTADO === 'S'}
                                                                onChange={handleCheckbox}
                                                                onKeyDown={handleFocus}
                                                                style={{marginTop:"2px"}}>
                                                                    {tipoTrans.ESTADO === 'S' ? 'Activo' : 'Inactivo'}     
                                                            </Checkbox>
                                                        </Row>
                                                    </Card>
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

export default  TipoTransaccion;