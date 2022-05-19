import React, { useEffect, useState, useRef }   from "react";
import {ButtonForm,TituloForm}                  from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import Paper 							        from '@material-ui/core/Paper';
import { Request }                              from "../../../../../config/request";
import Layout                                   from "../../../../../components/utils/NewLayout";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import Main from '../../../../../components/utils/Main';
import {
        Form ,   Input  ,   Checkbox
    ,   Row  ,   Card   ,   Col
} from 'antd';

// import { useHotkeys } from 'react-hotkeys-hook';
import { KeyboardDatePicker,
    MuiPickersUtilsProvider }          from '@material-ui/pickers';
import DateFnsUtils                    from '@date-io/date-fns';
import deLocale                        from "date-fns/locale/es";
import moment from "moment";
moment.locale("es_es", {
    week: {
        dow: 3
    }
});
const Titulo        = 'Timbrado';
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName            = 'BSTIMBRA';
const Timbrado = ({ history, location, match}) =>{
    
    
    const [form] = Form.useForm();
    // const showsModal = async (valor) => {
    //     setShows(valor);
    //     setSearchInput('');
    // };    
    
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
    

    const [timbrado         , setTimbrado       ] = useState({}); 
    // const [searchColumns    , setSearchColumns  ] = useState({});
    // const [searchData       , setSearchData     ] = useState({});
    const [state            , setState          ] = useState(false);
    const [auxData          , setAuxData        ] = useState({});  
    // const [shows            , setShows          ] = useState(false);
    const [focused          , setFocused        ] = useState(false);
    // const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    const [mensaje          , setMensaje        ] = useState();
    const [tituloModal      , setTituloModal    ] = useState();
    const [isNew            , setIsNew          ] = useState(false);
    const [icono            , setIcono          ] = useState();
    const [visible          , setVisible        ] = useState(false);
    const [visibleSave      , setVisibleSave    ] = useState(false);
    const [visibleMensaje   , setVisibleMensaje ] = useState(false);
    const [fecInicialDate   , setFecInicialDate ] = useState()
    const [fecFinalDate     , setFecFinalDate   ] = useState()
    const [activo           , setActivo         ] = useState(true);
    const dirr  = "/bs/timbrado";
    // ADMINISTRAR FOCUS
    // const [searchInputFocus         , setSearchInputFocus           ] = UseFocus();
    const [nroTimbradoFocus         , setNroTimbradoFocus           ] = UseFocus();
    const [nroInicialFocus          , setnroInicialFocus            ] = UseFocus();
    const [nroFinalFocus            , setNroFinalFocus              ] = UseFocus();
    const [activoFocus              , setActivoFocus                ] = UseFocus();
    const [positiveFocus            , setPositiveFocus              ] = UseFocus();
    
    const { params: { nro_timbrado } } = match;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    useEffect(()=>{
        if(nro_timbrado == 'nuevo'){
            setState(false);
            var dateSistem = moment().format('DD/MM/YYYY');
            setTimbrado({
                ...timbrado,
                ['TIPO']: 'I',
                ['COD_EMPRESA']     : sessionStorage.getItem('cod_empresa'),
                ['USERNAME']        : sessionStorage.getItem('cod_usuario'),
                ['NRO_TIMBRADO_ANT']: '',
                ['FEC_INICIAL']     : dateSistem,
                ['FEC_FINAL']       : dateSistem,
                ['ACTIVO']          : "S",
            });
            setAuxData({
                ...timbrado,
                ['TIPO']: 'I',
                ['COD_EMPRESA']     : sessionStorage.getItem('cod_empresa'),
                ['USERNAME']        : sessionStorage.getItem('cod_usuario'),
                ['NRO_TIMBRADO_ANT']: '',
                ['FEC_INICIAL']     : dateSistem,
                ['FEC_FINAL']       : dateSistem,
                ['ACTIVO']          : "S",
            });
            setNroTimbradoFocus();
        }else{
            if(location.state == undefined){
                history.push(dirr);
            }else{
                setState(true);
                getData();
            }
        }
    },[])
    const dateFormat = (fecha) =>{
        var dateArray = fecha.split('/')
        return moment(`"${dateArray[0]}.${dateArray[1]}.${dateArray[2]}"`, "DD.MM.YYYY").format()
    }
    const getData = async() =>{
        try {
            setTimbrado(valores());
            setAuxData(valores());
            form.setFieldsValue(valores());
            setTimeout(setnroInicialFocus, 100);
            let FEC_INICIAL = dateFormat(location.state.rows.FEC_INICIAL);
            let FEC_FINAL   = dateFormat(location.state.rows.FEC_FINAL);
            setFecInicialDate(FEC_INICIAL);
            setFecFinalDate(FEC_FINAL);
            setState( location.state.rows.ACTIVO == "S" ? true : false );
        } catch (error) {
            console.log(error);
        }
    }
    const valores = () => {
        return {
            ...location.state.rows,
            ['TIPO']             : 'U',
            ['COD_EMPRESA']      : sessionStorage.getItem('cod_empresa'),
            ['USERNAME']         : sessionStorage.getItem('cod_usuario'),
            ['NRO_TIMBRADO_ANT'] : location.state.rows['NRO_TIMBRADO'],
            ['FEC_INICIAL']      : location.state.rows['FEC_INICIAL'],
            ['FEC_FINAL']        : location.state.rows['FEC_FINAL'],
        }
    }
    const handleInputChange = (event)=>{
        setTimbrado({
            ...timbrado,
            [event.target.name] : event.target.value.toUpperCase(),
        });
        form.setFieldsValue({
            ...timbrado,
            [event.target.name] : event.target.value.toUpperCase(),
        });
    }
    const handleState = () => {
        setTimbrado({
            ...timbrado,
            ["ACTIVO"] : !activo ? "S" : "N",
        });
        form.setFieldsValue({
            ...timbrado,
            ["ACTIVO"] : !activo ? "S" : "N",
        });
        setActivo( !activo );
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'NRO_TIMBRADO'){
                setnroInicialFocus();
            }
            if(e.target.name == 'NRO_INICIAL'){
                setNroFinalFocus();
            }
            if(e.target.name == 'NRO_FINAL'){
                document.getElementById('FEC_INICIAL').focus()
            }
            if(e.target.name == 'FEC_INICIAL'){
                document.getElementById('FEC_FINAL').focus()
            }
            if(e.target.name == 'FEC_FINAL'){
                setActivoFocus()
            }
        }
    }
    const onFinish = async(values) => {
        var url    = `/bs/timbrados/` + sessionStorage.getItem('cod_empresa');
        var method = 'POST';
        if (timbrado.ACTIVO!='S') {
            timbrado.ACTIVO = 'N';
        }
        try{
            await Request( url, method, timbrado )
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    history.push('/bs/timbrado');
                }else{
                    showModalMensaje("Error!","error",response.data.p_mensaje);
                }
            });
        } catch (error) {
            console.log(error.response.data.message);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleCancel = () => {
        setVisible(false);
        setVisibleSave(false);
        setVisibleMensaje(false);
    };
    const showModalMensaje = (titulo, imagen, mensaje) => {
        setMensaje(mensaje);
        setIcono(imagen);
        setTituloModal(titulo);
        setVisibleMensaje(true);
    };
    const cerrar = () => {
        history.push('/bs/timbrado');
    };
    const handleDateChange = (e, nameInput) => {
        var valorFecha = moment(e).format("DD/MM/YYYY")
        if(valorFecha !== null && valorFecha !== 'Invalid date'){
            if(nameInput == 'FEC_INICIAL'){
                formatDate(valorFecha, nameInput);
                setFecInicialDate(e);
            }else if(nameInput == 'FEC_FINAL'){
                formatDate(valorFecha, nameInput);
                setFecFinalDate(e);
            }
        }
    }
    const formatDate = (valor, nameValue) =>{ 
        setTimbrado({
            ...timbrado,
            [nameValue]:valor
        })
    } 

    return (
        <Layout defaultOpenKeys={'BS','BS-BS1'}
                defaultSelectedKeys={"BS-BS1-null-BSTIMBRA"}> 
            
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

            <ModalDialogo 
                positiveButton={"SI"} 
                negativeButton={"NO"}
                positiveAction={cerrar}
                negativeAction={handleCancel}
                onClose={handleCancel}
                setShow={visibleSave}
                title={"¡Atención!"}
                mensaje={mensaje}
                />

            <ModalDialogo 
                positiveButton={"SI"} 
                negativeButton={"NO"}
                positiveAction={onFinish}
                negativeAction={cerrar}
                onClose={handleCancel}
                setShow={visible}
                title={"¡Atención!"}
                mensaje={mensaje}
                positiveFocus={positiveFocus}
                setPositiveFocus={setPositiveFocus}
                focused={focused}
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
                            arrayActual={timbrado} 
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
                                <Col span={6}>
                                    <Form.Item
                                        label="Código"
                                        name="NRO_TIMBRADO"
                                        onChange={handleInputChange}
                                        >
                                        <Input 
                                            id="requerido"
                                            name="NRO_TIMBRADO"
                                            type="number"
                                            className="search_input"
                                            onKeyDown={handleFocus}
                                            disabled={state}
                                            ref={nroTimbradoFocus} 
                                            />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item 
                                        label="Nro. Inicial"
                                        name="NRO_INICIAL"
                                        onChange={handleInputChange}
                                        >
                                        <Input 
                                            id="requerido"
                                            name="NRO_INICIAL"
                                            type="number"
                                            className="search_input"
                                            ref={nroInicialFocus}
                                            onKeyDown={handleFocus}
                                            />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label="Nro. Final"
                                        name="NRO_FINAL"
                                        onChange={handleInputChange}
                                        >
                                        <Input 
                                            id="requerido"
                                            name="NRO_FINAL"
                                            type="number"
                                            className="search_input"
                                            onKeyDown={handleFocus}
                                            ref={nroFinalFocus}
                                            />
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Fecha Inicial">
                                        <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                name="FEC_INICIAL"
                                                id="FEC_INICIAL"
                                                onKeyDown={handleFocus}
                                                disableToolbar
                                                variant="inline"
                                                format={'dd/MM/yyyy'}
                                                value={fecInicialDate}
                                                emptyLabel="__/__/___"
                                                maxDateMessage={false}
                                                minDateMessage={false}
                                                invalidDateMessage={false}
                                                disableFuture={true}
                                                onChange={(e)=>handleDateChange(e,'FEC_INICIAL')}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Fecha Final">
                                        <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                name="FEC_FINAL"
                                                id="FEC_FINAL"
                                                onKeyDown={handleFocus}
                                                disableToolbar
                                                variant="inline"
                                                format={'dd/MM/yyyy'}
                                                value={fecFinalDate}
                                                emptyLabel="__/__/___"
                                                maxDateMessage={false}
                                                minDateMessage={false}
                                                invalidDateMessage={false}
                                                disableFuture={true}
                                                onChange={(e)=>handleDateChange(e,'FEC_FINAL')}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label={"Estado"}
                                        name="ACTIVO">
                                        <Card style={{height:"23px",paddingTop:"2px"}}> 
                                            <Row>
                                                <Checkbox
                                                    name="ACTIVO"
                                                    type="checkbox"
                                                    ref={activoFocus}
                                                    checked={timbrado.ACTIVO === 'S'}
                                                    onChange={handleState}
                                                >
                                                    {timbrado.ACTIVO === 'S' ? "Activo" : "Inactivo"}
                                                </Checkbox>
                                            </Row>
                                        </Card>   
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

export default Timbrado;