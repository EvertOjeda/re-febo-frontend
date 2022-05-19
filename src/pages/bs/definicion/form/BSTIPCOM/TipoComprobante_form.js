import React, { useEffect, useState, useRef }   from "react";
import { Redirect }                             from 'react-router-dom';
import Paper 							        from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}                  from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import { Request }                              from "../../../../../config/request";
import Layout                                   from "../../../../../components/utils/NewLayout";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import Main from '../../../../../components/utils/Main';
import {Form
    ,   Input
    ,   Checkbox
    ,   Row
    ,   Card
    ,   Col
    ,   Select
} from 'antd';

// import { useHotkeys } from 'react-hotkeys-hook';

const { Option } = Select;

const valoresCheck  = ['S','N'];
const valoresEstado = ['A','I'];
const Titulo        = 'Tipos de comprobantes';

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName            = 'BSTIPCOM';
const Timbrado = ({ history, location, match}) =>{

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

    const [tipo             , setTipo           ] = useState({}); 
    const [state            , setState          ] = useState(false);
    const [auxData          , setAuxData        ] = useState({});  
    const [mensaje          , setMensaje        ] = useState();
    const [icono            , setIcono          ] = useState();
    const [visibleMensaje   , setVisibleMensaje ] = useState(false);
    const [isNew            , setIsNew          ] = useState(false);
    const [tituloModal      , setTituloModal    ] = useState();
    const [selectFocus      , setSelectFocus    ] = useState();

    const dirr  = "/bs/tipocomp";

    // ADMINISTRAR FOCUS
    const [tipComprobanteFocus      , setTipComprobanteFocus        ] = UseFocus();
    const [codModuloFoucus          , setCodModuloFocus             ] = UseFocus();
    const [descripcionFocus         , setDescripcionFocus           ] = UseFocus();
    const [abreviaturaFucus         , setAbreviaturaFocus           ] = UseFocus();
    const [lineasFocus              , setLineasFocus                ] = UseFocus();
    const [estadoFocus              , setEstadoFocus                ] = UseFocus();
    const [saldosFocus              , setSaldosFocus                ] = UseFocus();
    const [stockFocus               , setStockFocus                 ] = UseFocus();
    const [tipOrigenFocus           , setTipOrigenFocus             ] = UseFocus();
    const [indimportacionFocus      , setIndImportacionFocus        ] = UseFocus();
    const [ivaIncluidoFocus         , setIvaIncluidoFocus           ] = UseFocus();
    const [libroIvaFocus            , setLibroIvaFocus              ] = UseFocus();
    const [indExentoFocus           , setIndExentoFocus             ] = UseFocus();
    const [indChequeFocus           , setIndChequeFocus             ] = UseFocus();
    const [indAsientosFocus         , setIndAsientosFocus           ] = UseFocus();
    const [aplicableEnCajaFocus     , setAplicableEnCaja            ] = UseFocus();
    
    const { params: { id } } = match;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(()=>{
        if(id == 'nuevo'){
            tipo.TIPO = "I"
            setState(false);
            setTipo(valoresNuevo());
            setAuxData(valoresNuevo());
            form.setFieldsValue(valoresNuevo());
            setTipComprobanteFocus();
            setIsNew(true);
        }else{
            if(location.state == undefined){    
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
            setTipo(valores());
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
            ['ESTADO']              : 'I',
            ['IND_IMPORTACION']     : 'N',
            ['IVA_INCLUIDO']        : 'N',
            ['LIBRO_IVA']           : 'N',
            ['IND_EXENTO']          : 'N',
            ['IND_CHEQUE']          : 'N',
            ['IND_ASIENTOS']        : 'N',
            ['APLICABLE_EN_CAJA']   : 'N',
            ['SALDOS']              : 'N',
            ['STOCK']               : 'N',
            ['COD_EMPRESA']         : sessionStorage.getItem('cod_empresa'),
            ['USERNAME']            : sessionStorage.getItem('cod_usuario'),
        }
    }
    const handleInputChange = (event)=>{
        setTipo({
            ...tipo,
            [event.target.name] : event.target.value.toUpperCase(),
        });
        form.setFieldsValue({
            ...tipo,
            [event.target.name] : event.target.value.toUpperCase(),
        });
    }
    const handleInputSelect = (e,option)=>{
        console.log(option)
        const name  = option.key.split("-")[0];
        const value = e;
        const desc  = option.children;
        setTipo({
            ...tipo,
            [name] : value,
            ["DESC_"+name] : desc,
        });
        if (name == "SALDOS") {
            setTimeout(setStockFocus,100);
        }
        if (name == "STOCK") {
            setTimeout(setTipOrigenFocus,100);
        }
        if (name == "TIP_ORIGEN") {
            setTimeout(setTipComprobanteFocus,100);
        }
    }
    const handleInputNotSelect = (e)=>{
        if (!e) {
            if (selectFocus == "SALDOS") {
                setStockFocus();
            }
            if (selectFocus == "STOCK") {
                setTipOrigenFocus();
            }
            if (selectFocus == "TIP_ORIGEN") {
                if (state) {
                    setDescripcionFocus();
                } else {
                    setTipComprobanteFocus();
                }
            }
            console.log("open",e);
            console.log("name",selectFocus);
        }
    }
    const marcarCheck = (event) => {
        var estado = valoresCheck;
        if (event.target.name === "ESTADO") {
            estado = valoresEstado;
        }
        if(event.target.checked){
            setTipo({
                ...tipo,
                [event.target.name] : estado[0],
            });
        } else {
            setTipo({
                ...tipo,
                [event.target.name] : estado[1],
            });
        }
        console.log(tipo)
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'TIP_COMPROBANTE'){
                setCodModuloFocus();
            }
            if(e.target.name == 'COD_MODULO'){
                setDescripcionFocus();
            }
            if(e.target.name == 'DESCRIPCION'){
                setAbreviaturaFocus();
            }
            if(e.target.name == 'ABREVIATURA'){
                setLineasFocus();
            }
            if(e.target.name == 'LINEAS'){
                setIndImportacionFocus();
            }
            if(e.target.name == 'IND_IMPORTACION'){
                setIvaIncluidoFocus();
            }
            if(e.target.name == 'IVA_INCLUIDO'){
                setIndExentoFocus();
            }
            if(e.target.name == 'IND_EXENTO'){
                setIndChequeFocus();
            }
            if(e.target.name == 'IND_CHEQUE'){
                setLibroIvaFocus();
            }
            if(e.target.name == 'LIBRO_IVA'){
                setIndAsientosFocus();
            }
            if(e.target.name == 'IND_ASIENTOS'){
                setAplicableEnCaja();
            }
            if(e.target.name == 'APLICABLE_EN_CAJA'){
                setEstadoFocus();
            }
            if(e.target.name == 'ESTADO'){
                setSaldosFocus();
            }
        }
    }
    const onFinish = async() => {
        var url    = "/bs/tipocomp/" + sessionStorage.getItem('cod_empresa');
        var method = 'POST';
        tipo.COD_EMPRESA = await sessionStorage.getItem("cod_empresa");
        try{
            await Request( url, method, tipo )
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    history.push(dirr);
                }else{
                    showModalMensaje("Error!","error",response.data.p_mensaje);
                }
            });
        } catch (error) {
            console.log("Enrror en Tipos comprobante onFinish ",error);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
        <Layout defaultOpenKeys={'BS','BS-BS1'}
                defaultSelectedKeys={"BS-BS1-null-BSTIPCOM"}> 
            
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
                        arrayActual={tipo} 
                        direccionar={cerrar}
                        isNew={isNew}
                        onFinish={onFinish}
                        buttonGuardar={buttonSaveRef}
                        buttonVolver={buttonExitRef}
                        formName={FormName}
                        />
                    <div className="form-container" >
                        <Row>
                            <Col span={18}>
                                <Card style={{paddingTop:"10px", margin:"5px"}}>
                                    <Row gutter={[4]}>
                                        <Col span={6}>
                                            <Form.Item
                                                    label="Código"
                                                    name="TIP_COMPROBANTE"
                                                    type="text"
                                                    onChange={handleInputChange}
                                                >
                                                <Input 
                                                    name="TIP_COMPROBANTE" 
                                                    disabled={state} 
                                                    ref={tipComprobanteFocus} 
                                                    onKeyDown={handleFocus}
                                                    id="requerido"
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                label="Módulo"
                                                name="COD_MODULO"
                                                type="text"
                                                onChange={handleInputChange}
                                                >
                                                <Input 
                                                        name="COD_MODULO" 
                                                        disabled={state} 
                                                        ref={codModuloFoucus} 
                                                        onKeyDown={handleFocus}
                                                        id="requerido"
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Descripción"
                                                name="DESCRIPCION"
                                                type="text"
                                                onChange={handleInputChange}
                                                >
                                                <Input 
                                                    name="DESCRIPCION" 
                                                    ref={descripcionFocus} 
                                                    onKeyDown={handleFocus}
                                                    id="requerido"
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Abreviatura"
                                                name="ABREVIATURA"
                                                type="text"
                                                onChange={handleInputChange}
                                                >
                                                <Input 
                                                    name="ABREVIATURA" 
                                                    ref={abreviaturaFucus} 
                                                    onKeyDown={handleFocus}
                                                    id="requerido"
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Líneas"
                                                name="LINEAS"
                                                type="text"
                                                onChange={handleInputChange}
                                                >
                                                <Input 
                                                    name="LINEAS" 
                                                    type="number"
                                                    className="search_input"
                                                    ref={lineasFocus} 
                                                    onKeyDown={handleFocus}
                                                    id="requerido"
                                                    />
                                            </Form.Item>
                                        </Col>
                                        
                                    </Row>
                                </Card>
                                    <Card style={{paddingTop:"7px", paddingBottom:"3px", margin:"5px"}}>
                                        <Row gutter={[8]}>
                                            <Col span={6} >
                                                <Card style={{height:"23px"}} onClick={marcarCheck}> 
                                                    <Row>
                                                        <Checkbox
                                                            name="IND_IMPORTACION"
                                                            type="checkbox"
                                                            ref={indimportacionFocus}
                                                            checked={tipo.IND_IMPORTACION === 'S'}
                                                            onChange={marcarCheck}
                                                            style={{marginTop:"2px"}}
                                                            onKeyDown={handleFocus}
                                                        >
                                                            {"Afec. Gasto Imp."}
                                                        </Checkbox>
                                                    </Row>
                                                </Card>   
                                            </Col>
                                            <Col span={6} >
                                                <Card style={{height:"23px"}} onClick={marcarCheck}> 
                                                    <Row>
                                                        <Checkbox
                                                            name="IVA_INCLUIDO"
                                                            type="checkbox"
                                                            ref={ivaIncluidoFocus}
                                                            checked={tipo.IVA_INCLUIDO === 'S'}
                                                            onChange={marcarCheck}
                                                            style={{marginTop:"2px"}}
                                                            onKeyDown={handleFocus}
                                                        >
                                                            {"I.V.A. Incluido"}
                                                        </Checkbox>
                                                    </Row>
                                                </Card>   
                                            </Col>
                                            <Col span={6} >
                                                <Card style={{height:"23px"}} onClick={marcarCheck}> 
                                                    <Row>
                                                        <Checkbox
                                                            name="IND_EXENTO"
                                                            type="checkbox"
                                                            ref={indExentoFocus}
                                                            checked={tipo.IND_EXENTO === 'S'}
                                                            onChange={marcarCheck}
                                                            style={{marginTop:"2px"}}
                                                            onKeyDown={handleFocus}
                                                        >
                                                            {"Exento"}
                                                        </Checkbox>
                                                    </Row>
                                                </Card>   
                                            </Col>
                                            <Col span={6} >
                                                <Card style={{height:"23px"}} onClick={marcarCheck}> 
                                                    <Row>
                                                        <Checkbox
                                                            name="IND_CHEQUE"
                                                            type="checkbox"
                                                            ref={indChequeFocus}
                                                            checked={tipo.IND_CHEQUE === 'S'}
                                                            onChange={marcarCheck}
                                                            style={{marginTop:"2px"}}
                                                            onKeyDown={handleFocus}
                                                        >
                                                            {"Es Cheque"}
                                                        </Checkbox>
                                                    </Row>
                                                </Card>   
                                            </Col>
                                            <Col span={12} >
                                                <Card style={{height:"23px"}} onClick={marcarCheck}> 
                                                    <Row>
                                                        <Checkbox
                                                            name="LIBRO_IVA"
                                                            type="checkbox"
                                                            ref={libroIvaFocus}
                                                            checked={tipo.LIBRO_IVA === 'S'}
                                                            onChange={marcarCheck}
                                                            style={{marginTop:"2px"}}
                                                            onKeyDown={handleFocus}
                                                        >
                                                            {"Imprime en libro de I.V.A."}
                                                        </Checkbox>
                                                    </Row>
                                                </Card>   
                                            </Col>
                                            <Col span={6} >
                                                <Card style={{height:"23px"}} onClick={marcarCheck}> 
                                                    <Row>
                                                        <Checkbox
                                                            name="IND_ASIENTOS"
                                                            type="checkbox"
                                                            ref={indAsientosFocus}
                                                            checked={tipo.IND_ASIENTOS === 'S'}
                                                            onChange={marcarCheck}
                                                            style={{marginTop:"2px"}}
                                                            onKeyDown={handleFocus}
                                                        >
                                                            {"Incluye en Asientos"}
                                                        </Checkbox>
                                                    </Row>
                                                </Card>   
                                            </Col>
                                            <Col span={6} >
                                                <Card style={{height:"23px"}} onClick={marcarCheck}> 
                                                    <Row>
                                                        <Checkbox
                                                            name="APLICABLE_EN_CAJA"
                                                            type="checkbox"
                                                            ref={aplicableEnCajaFocus}
                                                            checked={tipo.APLICABLE_EN_CAJA === 'S'}
                                                            onChange={marcarCheck}
                                                            style={{marginTop:"2px"}}
                                                            onKeyDown={handleFocus}
                                                        >
                                                            {"Aplicable en Caja"}
                                                        </Checkbox>
                                                    </Row>
                                                </Card>   
                                            </Col>
                                        </Row>
                                    </Card>
                            </Col>                        
                            <Col span={6}>
                                    <Card style={{paddingTop:"10px", paddingBottom:"10px", margin:"5px"}}>
                                        <Row gutter={[8]}>
                                            <Col span={24} >
                                                <Form.Item
                                                    label={"Estado"}
                                                    name="ESTADO"
                                                    onChange={marcarCheck}
                                                    >
                                                    <Card style={{height:"23px", backgroundColor:"#22000020"}} onClick={marcarCheck}> 
                                                        <Row>
                                                            <Checkbox
                                                                name="ESTADO"
                                                                type="checkbox"
                                                                ref={estadoFocus}
                                                                checked={tipo.ESTADO === 'A'}
                                                                onChange={marcarCheck}
                                                                style={{marginTop:"2px"}}
                                                                onKeyDown={handleFocus}
                                                            >
                                                                {tipo.ESTADO === 'A' ? "Activo" : "Inactivo"}
                                                            </Checkbox>
                                                        </Row>
                                                    </Card>   
                                                </Form.Item>
                                            </Col>
                                            <Col span={24} >
                                                <Form.Item
                                                    label="Saldos"
                                                    name="DESC_SALDOS"
                                                    >
                                                    <Select 
                                                        onChange={handleInputSelect}
                                                        onSelect={setStockFocus}
                                                        onFocus={()=>setSelectFocus("SALDOS")}
                                                        onDropdownVisibleChange={handleInputNotSelect}
                                                        ref={saldosFocus}
                                                        >
                                                        <Option key="SALDOS-S" value="S">Suma</Option>
                                                        <Option key="SALDOS-R" value="R">Resta</Option>
                                                        <Option key="SALDOS-N" value="N">Ninguno</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Stock"
                                                    name="DESC_STOCK"
                                                    >
                                                    <Select 
                                                        onChange={handleInputSelect}
                                                        onSelect={handleInputSelect}
                                                        onFocus={()=>setSelectFocus("STOCK")}
                                                        onDropdownVisibleChange={handleInputNotSelect}
                                                        ref={stockFocus}
                                                        >
                                                        <Option key="STOCK-S" value="S">Suma</Option>
                                                        <Option key="STOCK-R" value="R">Resta</Option>
                                                        <Option key="STOCK-A" value="A">Suma y Resta</Option>
                                                        <Option key="STOCK-N" value="N">Ninguno</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Origen"
                                                    name="DESC_TIP_ORIGEN"
                                                    >
                                                    <Select onChange={handleInputSelect}
                                                            onSelect={handleInputSelect}
                                                            onFocus={()=>setSelectFocus("TIP_ORIGEN")}
                                                            onDropdownVisibleChange={handleInputNotSelect}
                                                            ref={tipOrigenFocus}
                                                            >
                                                        <Option key="TIP_ORIGEN-F" value="F">Factura</Option>
                                                        <Option key="TIP_ORIGEN-R" value="R">Recibo</Option>
                                                        <Option key="TIP_ORIGEN-H" value="H">Cheque</Option>
                                                        <Option key="TIP_ORIGEN-C" value="C">Compra</Option>
                                                        <Option key="TIP_ORIGEN-S" value="S">Ajuste de Stock</Option>
                                                        <Option key="TIP_ORIGEN-E" value="E">Envío</Option>
                                                        <Option key="TIP_ORIGEN-D" value="D">Débito y Crédito</Option>
                                                        <Option key="TIP_ORIGEN-G" value="G">Pagaré</Option>
                                                        <Option key="TIP_ORIGEN-N" value="N">Notas de crédito</Option>
                                                        <Option key="TIP_ORIGEN-V" value="V">Boleta de venta</Option>
                                                        <Option key="TIP_ORIGEN- " value=" ">Ninguno</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                {/* </div> */}
                            </Col>
                        </Row>
                        </div>
                    </Form>
                </Paper>
            </div>
        </Layout>
    );
}

export default Timbrado;