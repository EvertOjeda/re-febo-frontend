import React, { useEffect, useState, useRef }   from 'react';
import { Redirect, Link }                       from 'react-router-dom';
import Layout                                   from "../../../../../components/utils/NewLayout";
import Paper                                    from '@material-ui/core/Paper';
import { ButtonForm, TituloForm }               from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import FormModalSearch                          from "../../../../../components/utils/ModalForm/FormModalSearch";
import { Request }                              from "../../../../../config/request";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";

import Main                                     from "../../../../../components/utils/Main";

// import { useHotkeys } from "react-hotkeys-hook";
import {
    Form
    , Input
    , Card
    , Checkbox
    , Row
    , Col
    , Radio
} from 'antd';
const defaultOpenKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['BS', 'BS-BS1'];
const defaultSelectedKeys = sessionStorage.getItem("mode") === 'vertical' ? [] : ['BS-BS1-null-BSMONEDA'];
const Titulo              = 'Moneda';
const cod_empresa         = sessionStorage.getItem('cod_empresa');
const username            = sessionStorage.getItem('cod_usuario');
// ! =========================== URLs =============================
// * REDIRECCION A LA VISTA TIPO LISTA
const url_lista           = "/bs/moneda";
// * DIRECCION BASE 
const url_post_base       = '/bs/monedas';
// * BUSCADORES
const url_buscar_pais     = '/bs/monedas/buscar/pais';
// * VALIDADORES
const url_valida_pais     = '/bs/monedas/valida/pais';
const ColumnPais = [
    { ID: 'COD_PAIS'   , label: 'Cod Pais'  ,  minWidth: 150      , width:300 , align: 'left', },
    { ID: 'DESC_PAIS'  , label: 'Pais'      ,  minWidth: 150      , width:300 , align: 'left', },
];
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef, setFocus ] 
}
const FormName            = 'BSMONEDA';
const Moneda_Form = ({ history, location, match }) => {
   
    // const buttonNameRef = useRef();

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
    

    var ArrayData                 = new Array
    const [estadoCheckbox]        = useState(ArrayData);
    const { params:{cod_moneda }} = match;
    const [form]                  = Form.useForm();
    const [tipoDeBusqueda       , setTipoDeBusqueda        ] = useState();
    const [modalTitle           , setModalTitle            ] = useState('');
    const [shows                , setShows                 ] = useState(false);
    const [searchColumns        , setSearchColumns         ] = useState({});
    const [searchData           , setSearchData            ] = useState({});
    const [mensaje              , setMensaje               ] = useState();
    const [visible              , setVisible               ] = useState(false);
    const [visibleSave          , setVisibleSave           ] = useState(false);
    const [visibleMensaje       , setVisibleMensaje        ] = useState(false);
    const [isNew                , setIsNew                 ] = useState(false);
    const [imagen               , setImagen                ] = useState();
    const [tituloModal          , setTituloModal           ] = useState();
    //Status del Metodo Atras
    const [auxData              , setAuxData               ] = useState([]);
    const [moneda               , setMoneda                ] = useState([]);
    const [pais                 , setPais                  ] = useState([]);
    const [statusEstadoCheckbox , setStatusEstadoCheckbox  ] = useState(true);
    const [bloqueoInput         , setBloqueoInput          ] = useState(true);
    const [option               , setOption                ] = useState("");
    // ADMINISTRAR FOCUS
    const [ inputCodMoneda      , setInputCodMonedaFocus   ] = UseFocus();
    const [ inputDesMonedaFocus , setInputDesMonedaFocus   ] = UseFocus();
    const [ inputCodPais        , setInputCodPaisFocus     ] = UseFocus();
    
    const [ inputSiglas         , setInputSiglasFocus      ] = UseFocus();
    const [ inputDecimal        , setInputDecimalFocus     ] = UseFocus();
    const [ inputDecimalVtas    , setInputDecimalVtasFocus ] = UseFocus();
    const [ estadoFocus         , setEstadoFocus           ] = UseFocus();
    useEffect(()=>{
        if(cod_moneda === 'nuevo'){
            setMoneda({
                ...moneda,
                ['TIPO']        : 'I',
                ['USERNAME']    : username,
                ['COD_EMPRESA'] : cod_empresa,
            })
            setAuxData({
                ...auxData,
                ['TIPO']        : 'I',
                ['USERNAME']    : username,
                ['COD_EMPRESA'] : cod_empresa,
            })
            
            setIsNew(true);
            setBloqueoInput(false);

            setTimeout( ()=>{
                setInputCodMonedaFocus();
            }, 100 );

        }else{
            if(location.state === undefined){
                history.push(url_lista);
            }
            getData();
        }
    },[]);
    const getData = () =>{
        try {
            setMoneda({
                ...location.state.rows,
                ['TIPO']        : 'U',
                ['COD_EMPRESA'] : cod_empresa,
                ['USERNAME']    : username
            })
            setAuxData({
                ...location.state.rows,
                ['TIPO']        : 'U',
                ['COD_EMPRESA'] : cod_empresa,
                ['USERNAME']    : username
            })
            setcheckboxDefault()
            setOption(location.state.rows.IND_MONEDA)
            form.setFieldsValue(location.state.rows);

            setTimeout( ()=>{
                setInputDesMonedaFocus();
            }, 100 );

        } catch (error) {
            console.log(error);
        }
    };
    const getPais = async() =>{
        try {
            var url    = url_buscar_pais;
            var method = 'POST';
            var response = await Request( url, method, {"valor":"null"} )
            .then(response => {return response})
                if( response.data.rows.length > 0){
                    setPais(response.data.rows);
                    return response.data.rows
                }else{
                    return []
                }
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setMoneda({
            ...moneda,
            [event.target.name] : event.target.value.trim()
        })        
    }
    const onFinish = async (values) => {
        var url    = url_post_base;
        var method = 'POST';
        await Request( url, method, moneda )
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push(url_lista);
            }else{
                setMensaje(rows.p_mensaje);
                setVisibleMensaje(true);
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
        mensaje = errorInfo;
        setVisibleMensaje(true);
    };
    const setcheckboxDefault = async () => {
        if(location.state !== undefined){

            var option      = location.state.OpcionChecbox;
            var ESTADO      = location.state.rows.ESTADO; 
                
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
    };
    const handleFocus = async (e) => {
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if(e.target.name === 'COD_PAIS'){
                var url = url_valida_pais;
                var method = 'POST';
                var data = { 'valor': e.target.value.toUpperCase() };
                try {
                    await Request( url,method, data )
                    .then( response => {
                        if(response.status == 200){
                            if(response.data.outBinds.ret == 1){
                                setMoneda({
                                    ...moneda,
                                    ['COD_PAIS'] :e.target.value.toUpperCase(),
                                    ['DESC_PAIS']: response.data.outBinds.desc_pais
                                })
                                form.setFieldsValue({
                                    ...form,
                                    ['COD_PAIS']:e.target.value.toUpperCase(),
                                    ['DESC_PAIS']: response.data.outBinds.desc_pais
                                })
                                // setInputSiglasFocus()

                                setEstadoFocus();

                            }else{
                                showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                            }
                        }
                    })
                } catch (error) {
                    console.log('error en metodo validar Pais', error);
                }
            }
            if(e.target.name === 'COD_MONEDA'){
                setInputDesMonedaFocus()
            }
            if(e.target.name === 'DESCRIPCION'){
                setInputCodPaisFocus()
            }
            if(e.target.name === 'SIGLAS'){
                setInputDecimalFocus()
            }
            if(e.target.name === 'DECIMALES'){
                setInputDecimalVtasFocus()
            }
        }
        if(e.which === 120 && (e.target.name === 'COD_PAIS')){
            if(e.target.name === 'COD_PAIS'){
                var auxPais = await getPais();
                setModalTitle("Pais")
                setSearchColumns(ColumnPais)
                setSearchData(auxPais)
                setTipoDeBusqueda(e.target.name);                
            }
            setShows(true);
        }
    };
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const onInteractiveSearch = async (event) => {
        var url         = '';
        var valor       = event.target.value;
        var cod_pais    = moneda.COD_PAIS;
        valor           = valor.trim();

        if(valor.length == 0 ){
            valor = null;
        }

        if( tipoDeBusqueda === 'COD_PAIS' ){
            url = url_buscar_pais;
            if(valor == null) return setSearchData(pais);   
        }

        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor};
            await Request( url, method, data )
                .then( response => {
                    if( response.status == 200 ){
                        if(tipoDeBusqueda === 'COD_PAIS'){
                            setSearchData(response.data.rows)
                        }
                    }
            })
        }
    };
    const modalSetOnClick = async (datos, BusquedaPor) => {

        if(datos !== "" || datos !== undefined){

            if( BusquedaPor === 'COD_PAIS' ){
                setMoneda({
                    ...moneda,
                    ['COD_PAIS']   : datos[0],
                    ['DESC_PAIS']  : datos[1]
                })
                form.setFieldsValue({
                    ...form,
                    ['COD_PAIS']   : datos[0],
                    ['DESC_PAIS']  : datos[1]
                })
                setTimeout(setInputSiglasFocus, 200);
                showsModal(false)
            }
        }
    };
    const handleCheckbox = (e) => {
        if(e.target.name === 'ESTADO' ){
            setMoneda({
                ...moneda,
                ['ESTADO']: e.target.checked ? 'A' : 'I'
            })
            setStatusEstadoCheckbox(!statusEstadoCheckbox)
        }
    };
    const handleSelecChange = (valor) =>{
        setMoneda({
            ...moneda,
            ['IND_MONEDA']: valor.target.value
        })
        setOption(valor.target.value)
    };
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
    };
    const cerrar = () => {
        history.push(url_lista);
    };
    if(cod_moneda != 'nuevo' && cod_moneda != 'modificar'){
        return <Redirect to={url_lista}/>
    };
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
                    mensaje={mensaje}
                    />
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
                            onFinishFailed={onFinishFailed}
                        >
                            <ButtonForm 
                                dirr={url_lista} 
                                arrayAnterior={auxData} 
                                arrayActual={moneda} 
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
                                        <Row gutter={8}>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Moneda"
                                                    name="COD_MONEDA"
                                                    labelCol={{ span: 18 }}
                                                    wrapperCol={{ span: 6 }}
                                                >
                                                    <Input
                                                        name="COD_MONEDA"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        disabled={bloqueoInput}
                                                        ref={inputCodMoneda}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={16}>
                                                <Form.Item
                                                    name="DESCRIPCION"
                                                    wrapperCol={{ span: 24 }}
                                                >
                                                    <Input
                                                        name="DESCRIPCION"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={inputDesMonedaFocus}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={7}>
                                                <Form.Item
                                                    label="Cod Pais"
                                                    name="COD_PAIS"
                                                    labelCol={{ span: 16 }}
                                                    wrapperCol={{ span: 8 }}
                                                >
                                                    <Input
                                                        name="COD_PAIS"
                                                        style={{textTransform:'uppercase'}}
                                                        onChange={handleInputChange}
                                                        ref={inputCodPais}
                                                        onKeyDown={handleFocus}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={9}>
                                                <Form.Item
                                                    name="DESC_PAIS"
                                                    wrapperCol={{ span: 24 }}
                                                >
                                                    <Input
                                                        name="DESC_PAIS"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        disabled={true}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={8}>
                                                <Card style={{textAlign:'center'}}>
                                                     {estadoCheckbox.includes("ESTADO") ?
                                                        <Checkbox  
                                                            checked={statusEstadoCheckbox} 
                                                            name="ESTADO"
                                                            onChange={ handleCheckbox }
                                                            ref={estadoFocus}>Estado
                                                        </Checkbox>
                                                        : 
                                                          <Checkbox onChange={handleCheckbox } name="ESTADO" >Estado</Checkbox> 
                                                     } 

                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={8}>
                                                <Form.Item 
                                                    // style={{background:'green'}}
                                                    label="Siglas"
                                                    name="SIGLAS"
                                                    labelCol={{ span: 18 }}
                                                    wrapperCol={{ span: 6 }}
                                                >
                                                    <Input
                                                        name="SIGLAS"
                                                        onChange={handleInputChange}
                                                        disabled={bloqueoInput}
                                                        ref={inputSiglas}
                                                        // onKeyPress={validarCapo}
                                                        onKeyDown={handleFocus}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>                                            
                                                <Form.Item
                                                    label="Decimal"
                                                    name="DECIMALES"
                                                    labelCol={{ span: 9 }}
                                                    wrapperCol={{ span: 15 }}
                                                >
                                                    <Input
                                                        name="DECIMALES"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={inputDecimal}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Decimal vtas"
                                                    name="DECIMALES_VTAS"
                                                    labelCol={{ span: 13 }}
                                                    wrapperCol={{ span: 11 }}
                                                >
                                                    <Input
                                                        name="DECIMALES_VTAS"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        disabled={bloqueoInput}
                                                        ref={inputDecimalVtas}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={12}>                                
                                                <Form.Item
                                                    label="Ind Moneda "
                                                    name="IND_MONEDA"
                                                    labelCol={{span: 9, offset:0} }
                                                    wrapperCol={{ span: 15 }}
                                                >
                                                    <Card style={{textAlign:'center', padding:'0px'}}>
                                                        <Radio.Group onChange={handleSelecChange} value={option}>
                                                        <Radio value="S">Si</Radio>
                                                        <Radio value="N">No</Radio>
                                                        </Radio.Group>
                                                    </Card>
                                                </Form.Item>
                                            </Col>
                                        </Row>
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
export default Moneda_Form;