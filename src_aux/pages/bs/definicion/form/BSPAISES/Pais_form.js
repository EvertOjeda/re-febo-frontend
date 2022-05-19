import React, { useEffect, useState, useRef }   from "react";
import { Redirect }                             from 'react-router-dom';
import {ButtonForm,TituloForm}                  from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import Paper 							        from '@material-ui/core/Paper';
import { Request }                              from "../../../../../config/request";
import Layout                                   from "../../../../../components/utils/NewLayout";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import {
        Form
    ,   Input
    ,   Row
    ,   Col
} from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';
const Titulo        = 'Pais';
const valoresEstado = ['A','I'];
const dirr          = "/bs/pais";

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName            = 'BSPAISES';
const Pais = ({ history, location, match}) =>{
    const [form]        = Form.useForm();
    const buttonSaveRef = useRef();
    const buttonExitRef = useRef();
    useHotkeys('f10', (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    useHotkeys('ctrl+a', (e) =>{ 
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    const [pais             , setPais           ] = useState({});
    const [auxData          , setAuxData        ] = useState({});  
    const [imagen           , setImagen         ] = useState();
    const [mensaje          , setMensaje        ] = useState();    
    const [tituloModal      , setTituloModal    ] = useState();
    const [visibleMensaje   , setVisibleMensaje ] = useState(false);
    const [state            , setState          ] = useState(false);
    const [isNew            , setIsNew          ] = useState(false);
    // ADMINISTRAR FOCUS
    const [codPaisFocus             , setCodPaisFocus               ] = UseFocus();
    const [descripcionFocus         , setDescripcionFocus           ] = UseFocus();
    const [nacionalidadFocus        , setNacionalidadFocus          ] = UseFocus();
    const [codigoAreaFocus          , setCodigoAreaFocus            ] = UseFocus();
    const [abreviaturaFocus         , setAbreviaturaFocus           ] = UseFocus();
    const [siglasFocus              , setSiglasFocus                ] = UseFocus();
    const [estadoFocus              , setEstadoFocus                ] = UseFocus();
    const { params: { cod_pais } } = match;
    const layout = {
        labelCol  : { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(()=>{
        if(cod_pais == 'nuevo'){
            setState(false);
            setPais({
                ...pais,
                ['TIPO']: 'I',
                ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
                ['USERNAME']   : sessionStorage.getItem('cod_usuario'),
            });
            setAuxData({
                ...auxData,['TIPO']: 'I',
                ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                ['USERNAME']:sessionStorage.getItem('cod_usuario')
            });
            setCodPaisFocus()
            setIsNew(true)
        }else{
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setState(true);
                getData();
            }
        }
    },[])
    const getData = async() =>{
        try {
            setPais({
                ...location.state.rows,
                ['TIPO']: 'U',
                ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
                ['USERNAME']   : sessionStorage.getItem('cod_usuario'),
            });
            setAuxData({...location.state.rows,
                ['TIPO']:'U',
                ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                ['USERNAME']:sessionStorage.getItem('cod_usuario')
            })
            setSiglasFocus()
            form.setFieldsValue(location.state.rows);
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setPais({
            ...pais,
            [event.target.name] : event.target.value.toUpperCase(),
        });
        if(event.target.name == 'COD_PAIS'){
            setPais({
                ...pais,
                [event.target.name] : event.target.value.toUpperCase(),
            });
            pais.COD_PAIS = event.target.value.toUpperCase();
        }
    }
    const marcarCheck = (event) => {
        if(event.target.checked){
            setPais({
                ...pais,
                [event.target.name] : valoresEstado[0],
            });
        } else {
            setPais({
                ...pais,
                [event.target.name] : valoresEstado[1],
            });
        }
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'COD_PAIS'){
                setSiglasFocus();
            }
            if(e.target.name == 'SIGLAS'){
                setDescripcionFocus();
            }
            if(e.target.name == 'DESCRIPCION'){
                setNacionalidadFocus();
            }
            if(e.target.name == 'NACIONALIDAD'){
                setCodigoAreaFocus();
            }
            if(e.target.name == 'CODIGO_AREA'){
                setAbreviaturaFocus();
            }
            if(e.target.name == 'ABREVIATURA'){
                setEstadoFocus();
            }
        }
    }
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    }
    const onFinish = async(values) => {
        var url    = `/bs/paises`;
        var method = 'POST';
        if (pais.ESTADO!='A') {
            pais.ESTADO = 'I';
        }
        await Request( url, method, pais)
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push('/bs/pais');
            }else{
                showModalMensaje("Atención!",'alerta',rows.p_mensaje);
                setVisibleMensaje(true);
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleCancel = () => {
        setVisibleMensaje(false);
    };
    const cerrar = () => {
        history.push('/bs/pais');
    }
    return (
        <Layout defaultOpenKeys={'BS','BS-BS1'} defaultSelectedKeys={"BS-BS1-null-BSPAISES"}>             
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
                            arrayActual={pais} 
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
                            <Row gutter={[8]} style={{paddingRight:'10px'}}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Código"
                                        >
                                        <Row gutter={8}>
                                            <Col span={10}>
                                                <Form.Item
                                                    name="COD_PAIS"
                                                    type="text"
                                                    onChange={handleInputChange}
                                                    >
                                                    <Input 
                                                        id="requerido"
                                                        name="COD_PAIS"
                                                        disabled={state} 
                                                        ref={codPaisFocus} 
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={14}>
                                                <Form.Item
                                                    label="Siglas"
                                                    name="SIGLAS"
                                                    onChange={handleInputChange}
                                                    >
                                                    <Input autoComplete="off"
                                                        name="SIGLAS"
                                                        type="text"
                                                        onKeyDown={handleFocus}
                                                        ref={siglasFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item 
                                        label="Descripción"
                                        name="DESCRIPCION"
                                        onChange={handleInputChange}
                                        >
                                            <Input  
                                                id="requerido"
                                                name="DESCRIPCION" 
                                                ref={descripcionFocus} 
                                                onKeyDown={handleFocus}
                                            />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Nacionalidad"
                                        name="NACIONALIDAD"
                                        onChange={handleInputChange}
                                        >
                                            <Input 
                                                name="NACIONALIDAD"
                                                ref={nacionalidadFocus}
                                                onKeyDown={handleFocus}
                                                />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item 
                                        label="Codigo de area"
                                        name="CODIGO_AREA"
                                        onChange={handleInputChange}
                                        >
                                            <Input 
                                                name="CODIGO_AREA"
                                                ref={codigoAreaFocus}
                                                onKeyDown={handleFocus}
                                                />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Abreviatura"
                                        name="ABREVIATURA"
                                        onChange={handleInputChange}
                                        >
                                        <Input
                                            name="ABREVIATURA"
                                            onKeyDown={handleFocus}
                                            ref={abreviaturaFocus}
                                            />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Estado"
                                        name="ESTADO"
                                        onChange={marcarCheck}
                                        >
                                            <Input
                                                name="ESTADO"
                                                type="checkbox"
                                                value={pais.ESTADO}
                                                ref={estadoFocus}
                                                checked={pais.ESTADO === 'A'}
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

export default Pais;