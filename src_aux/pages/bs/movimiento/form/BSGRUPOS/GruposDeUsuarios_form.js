import React, { useEffect, useState, useRef }   from "react";
import { Redirect }                             from 'react-router-dom';
import Paper 							        from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}                  from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import { Request }                              from "../../../../../config/request";
import Layout                                   from "../../../../../components/utils/NewLayout";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import {Form
    ,   Input
    ,   Row
    ,   Card
    ,   Col
    ,   Select
} from 'antd';
import Main                                     from "../../../../../components/utils/Main";
const Titulo        = 'Grupos de usuarios';
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const formName            = 'BSGRUPOS';
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



    const [grupo            , setGrupo              ] = useState({}); 
    const [state            , setState              ] = useState(false);
    const [auxData          , setAuxData            ] = useState({});  
    const [mensaje          , setMensaje            ] = useState();
    const [icono            , setIcono              ] = useState();
    const [visibleMensaje   , setVisibleMensaje     ] = useState(false);
    const [isNew            , setIsNew              ] = useState(false);
    const [tituloModal      , setTituloModal        ] = useState();

    const dirr  = "/bs/grupos_de_usuarios";

    // ADMINISTRAR FOCUS
    const [codGrupoFocus          , setCodGrupoFocus            ] = UseFocus();
    const [descripcionFocus       , setDescripcionFocus         ] = UseFocus();
    
    const { params: { id } } = match;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(()=>{
        if(id == 'nuevo'){
            setState(false);
            setGrupo(valoresNuevo());
            setAuxData(valoresNuevo());
            form.setFieldsValue(valoresNuevo());
            setCodGrupoFocus();
            setIsNew(true);
            setCodGrupoFocus();
        }else{
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setState(true);
                setIsNew(false);
                getData();
                setDescripcionFocus();
            }
        }
    },[])
    const getData = async() =>{
        try {
            setGrupo(valores());
            setAuxData(valores());
            form.setFieldsValue(valores());
            setTimeout(setDescripcionFocus, 100);
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
            ['COD_EMPRESA']         : sessionStorage.getItem('cod_empresa'),
            ['USERNAME']            : sessionStorage.getItem('cod_usuario'),
        }
    }
    const handleInputChange = (event)=>{
        setGrupo({
            ...grupo,
            [event.target.name] : event.target.value.toUpperCase(),
        });
        form.setFieldsValue({
            ...grupo,
            [event.target.name] : event.target.value.toUpperCase(),
        });
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'COD_GRUPO'){
                setDescripcionFocus();
            }
            if(e.target.name == 'DESCRIPCION'){
                setCodGrupoFocus();
            }
        }
    }
    const onFinish = async() => {
        var url    = `/bs/grupos_de_usuarios`;
        var method = 'POST';
        try{
            await Request( url, method, grupo )
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    history.push(dirr);
                }else{
                    if(rows.ret == 0){
                        showModalMensaje("Atención!","alerta",response.data.mensaje);
                    } else {
                        showModalMensaje("Error!","error",response.data.mensaje);
                    }
                }
            });
        } catch (error) {
            console.log("error formulario grupos de usuarios funcion onFinish ",error);
            // showModalMensaje("Error!","error",error);
        }
    };
    const onFinishFailed = (errorInfo) => {
        showModalMensaje("Error!","error",errorInfo);
    };
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
        <Layout defaultOpenKeys={['BS','BS-BS2','BS-BS2-BS21']}
                defaultSelectedKeys={['BS-BS2-BS21-BSGRUPOS']}> 
            
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
                            dirr={dirr} 
                            arrayAnterior={auxData} 
                            arrayActual={grupo} 
                            direccionar={cerrar}
                            isNew={isNew}
                            onFinish={onFinish}
                            buttonGuardar={buttonSaveRef}
                            buttonVolver={buttonExitRef}
                            formName={formName}/>
                        <div className="form-container">
                            <Card style={{paddingTop:"10px"}}>
                                <Form.Item  
                                    label="Código"
                                    name="COD_GRUPO"
                                    onChange={handleInputChange}
                                    labelCol={{span:2}}
                                    wrapperCol={{span:22}}>
                                    <Input.Group size="small">
                                        <Row gutter={8}>
                                            <Col span={3}>
                                                <Form.Item name="COD_GRUPO">
                                                    <Input 
                                                        id="requerido"
                                                        name="COD_GRUPO"
                                                        disabled={state} 
                                                        type="text"
                                                        className="search_input"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        onBlur={handleFocus}
                                                        ref={codGrupoFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={21}>
                                                <Form.Item name="DESCRIPCION">
                                                    <Input
                                                        id="requerido"
                                                        name="DESCRIPCION"
                                                        type="text"
                                                        className="search_input"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        onBlur={handleFocus}
                                                        ref={descripcionFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Input.Group>
                                </Form.Item>
                            </Card>
                        </div>
                    </Form>
                </Paper>
            </div>
        </Layout>
    );
}

export default Usuarios;