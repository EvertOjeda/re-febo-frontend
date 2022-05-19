import React, { useEffect, useState, useRef }   from "react";
// import Paper 							        from '@material-ui/core/Paper';
// import {ButtonForm,TituloForm}                  from '../../../../components/utils/ContenedorForm/ContainerFrom';
// import { Request }                              from "../../../../config/request";
// import Layout                                   from "../../../../components/utils/NewLayout";
// import ModalDialogo                             from "../../../../components/utils/Modal/ModalDialogo";
import Main from "../../../../../components/utils/Main";
import {
        Form
    ,   Input
    ,   Row
    ,   Col
} from 'antd';
const Titulo    = 'Sector Económico';
const dirr      = "/bs/sector_economico";
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const defaultOpenKeys     = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS','BS-BS1'];
const defaultSelectedKeys = sessionStorage.getItem("mode") == 'vertical' ? [] : ["BS-BS1-null-BSSECECO"];
const FormName            = 'BSSECECO';
const SectorEconomico = ({ history, location, match}) =>{

    const [form]        = Form.useForm();
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
    const [sector           , setSector         ] = useState({}); 
    const [auxData          , setAuxData        ] = useState({});
    const [mensaje          , setMensaje        ] = useState();
    const [imagen           , setImagen         ] = useState();
    const [tituloModal      , setTituloModal    ] = useState();
    const [state            , setState          ] = useState(false);
    const [visibleMensaje   , setVisibleMensaje ] = useState(false);
    const [isNew            , setIsNew          ] = useState(false); 
    // ADMINISTRAR FOCUS    
    const [descripcionFocus , setDescripcionFocus ] = UseFocus();
    const { params: { cod_sector } } = match;
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(()=>{
        if(cod_sector == 'nuevo'){
            setState(true);
            setIsNew(true);
            setSector({
                ...sector,
                ['TIPO']: 'I',
                ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
                ['USERNAME']: sessionStorage.getItem('cod_usuario'),
            });
            setAuxData({
                ...auxData,
                ['TIPO']: 'I',
                ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
                ['USERNAME']: sessionStorage.getItem('cod_usuario'),
            });
            setDescripcionFocus();
        }else{
            if(location.state == undefined){
                history.push(dirr);
            }else{
                setState(true);
                getData();
            }
        }
    },[]);
    const getData = async() =>{
        try {
            setSector({
                ...location.state.rows,
                ['TIPO']       : 'U',
                ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
                ['USERNAME']   : sessionStorage.getItem('cod_usuario'),
            })
            setAuxData({
                ...location.state.rows,
                ['TIPO']       : 'U',
                ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
                ['USERNAME']   : sessionStorage.getItem('cod_usuario'),
            })
            form.setFieldsValue(location.state.rows);
            setDescripcionFocus();
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setSector({
            ...sector,
            [event.target.name] : event.target.value.toUpperCase(),
        });
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'COD_SECTOR'){
                setDescripcionFocus();
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
        var url    = `/bs/sectores_economicos`;
        var method = 'POST';
        await Main.Request( url, method, sector )
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push('/bs/sector_economico');
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
        history.push('/bs/sector_economico');
    }
    return (
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
            <Main.ModalDialogo 
                positiveButton={""}
                negativeButton={"OK"}
                negativeAction={handleCancel}
                onClose={handleCancel}
                setShow={visibleMensaje}
                title={tituloModal}
                imagen={imagen}
                mensaje={mensaje}/>
            <div className="paper-container">
                <Main.Paper className="paper-style">
                    <Main.TituloForm titulo={Titulo} />
                    <Form
                        {...layout}
                        layout="horizontal"
                        size="small"
                        autoComplete="off"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >   
                        <Main.ButtonForm 
                            dirr={dirr} 
                            arrayAnterior={auxData} 
                            arrayActual={sector} 
                            direccionar={cerrar}
                            isNew={isNew}
                            titleModal={"Atención"}
                            mensajeModal={"Los cambios no se han guardados. Desea salir de igual forma?"} 
                            onFinish={onFinish}
                            buttonGuardar={buttonSaveRef}
                            buttonVolver={buttonExitRef}
                            formName={FormName}/>
                        <div className="form-container">
                            <Row>
                                <Col span={4}>
                                    <Form.Item
                                        label="Código"
                                        name="COD_SECTOR"
                                        labelCol={{span:8}} 
                                        wrapperCol={{span:16}}
                                        onChange={handleInputChange}
                                        >
                                        <Input 
                                            name="COD_SECTOR" 
                                            disabled={state}
                                            onKeyDown={handleFocus}
                                            />
                                    </Form.Item>
                                </Col>
                                <Col span={20}>
                                    <Form.Item
                                        label="Descripción"
                                        name="DESCRIPCION"
                                        labelCol={{span:4}} 
                                        wrapperCol={{span:20}}
                                        onChange={handleInputChange}
                                        >
                                            <Input
                                                id="requerido"
                                                name="DESCRIPCION"
                                                type="text"
                                                value={sector.DESCRIPCION}
                                                ref={descripcionFocus}
                                            />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Main.Paper>
            </div>
        </Main.Layout>
    );
}

export default SectorEconomico;