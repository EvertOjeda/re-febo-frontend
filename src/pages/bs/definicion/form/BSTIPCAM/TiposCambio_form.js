import React, { useEffect,useState,useRef } from 'react';
import { Request }                          from "../../../../../config/request";
import {RefreshBackgroundColor}             from '../../../../../components/utils/TableSearch/TableSearch';
import DateFnsUtils                         from "@date-io/date-fns";
import deLocale                             from "date-fns/locale/es";
import Main                                 from '../../../../../components/utils/Main';
import { Form, Input , Row, Col           } from 'antd';
import { MuiPickersUtilsProvider,
         KeyboardDatePicker     ,
       }                                    from '@material-ui/pickers';
import CurrencyTextField                    from '@unicef/material-ui-currency-textfield';
// input date
import "moment/locale/es";
import moment from "moment";
moment.locale("es_es", { week: { dow: 3 }  });
var defaultOpenKeys         = localStorage.getItem("mode") === 'vertical' ? [] : ['BS', 'BS-BS1'];
var defaultSelectedKeys     = localStorage.getItem("mode") === 'vertical' ? [] : ['BS-BS1-null-BSTIPCAM'];
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ]
}
const ColumnsMoneda = [
    { ID: 'COD_MONEDA' , label: 'Codigo', width:100    , align: 'left', },
    { ID: 'DESC_MONEDA', label: 'Moneda', minWidth:150 , align: 'left', },
];

const Titulo              = 'Tipo de Cambio por Moneda';
const cod_empresa         = localStorage.getItem('cod_empresa');
const username            = localStorage.getItem('cod_usuario');

// ! =========================== URLs =============================
//  * REDIRECCION A LA VISTA TIPO LISTA
    const url_lista         = "/bs/tipcambio";
//  * DIRECCION BASE 
    const url_post_base     = '/bs/tipcambio';
//  * BUSCADORES
    const url_buscar_moneda = '/bs/tipcambio/buscar/moneda';
//  * VALIDADORES
    const url_valida_moneda = '/bs/tipcambio/valida/moneda';
    const FormName          = 'BSTIPCAM';
    var COD_MONEDA_ANTERIOR = ""

const TiposCambio_form = ({ history, location, match}) => {
    const { params: { cod_tipcambio } } = match;
    const [form]                        = Form.useForm();

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

    //Atributos del Modal
    const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    const [mensaje          , setMensaje        ] = useState();
    const [imagen           , setImagen         ] = useState();
    const [tituloModal      , setTituloModal    ] = useState();
    const [modalTitle       , setModalTitle     ] = useState('');
    const [shows            , setShows          ] = useState(false);
    const [visibleMensaje   , setVisibleMensaje ] = useState(false);
    const [searchColumns    , setSearchColumns  ] = useState({});
    const [searchData       , setSearchData     ] = useState({});
    
    //State de tipo de Cambio por moneda
    const [tipoCambio       , setTipoCambio     ] = useState([]);
    const [auxData          , setAuxData        ] = useState([]);
    const [moneda           , setMoneda         ] = useState([]);
    const [isNew            , setIsNew          ] = useState(false);
    const [bloqueoInput     , setBloqueoInput   ] = useState(true);
    const [selectedDate     , setSelectedDate   ] = useState();

    // ADMINISTRAR FOCUS
    const [ inputCodMonedaFocus     , setInputCodMonedaFocus ] = UseFocus();
    //STATE INPUTMONEDA
    const [ valorVenta              , setValorVenta          ] = useState(0);
    const [ valorCompra             , setValorCompra         ] = useState(0);

    
    const getMoneda = async() =>{
        try {
            var url    = url_buscar_moneda;
            var method = 'POST';
            var response = await Request( url, method, {"valor":"null"} )
            .then(response => {return response})
            if( response.data.rows.length > 0){
                setMoneda(response.data.rows);
                return response.data.rows
            }else{
                setMoneda([]);
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{        
        if(cod_tipcambio === 'nuevo'){
            setTipoCambio({
                ...tipoCambio,     
                ['COD_EMPRESA']    : cod_empresa,
                ['TIPO']           : 'I',
                ['USERNAME']       : username,
                ['VAL_COMPRA']     : 0,
                ['VAL_VENTA']      : 0,
                ['FEC_TIPO_CAMBIO']: moment().format("DD/MM/YYYY")
            });
            setAuxData({
                ...tipoCambio,     
                ['COD_EMPRESA']     : cod_empresa,
                ['TIPO']            : 'I',
                ['USERNAME']        : username,
                ['VAL_COMPRA']      : 0,
                ['VAL_VENTA']       : 0,
                ['FEC_TIPO_CAMBIO'] : moment().format("DD/MM/YYYY")
            })
            setIsNew(true);
            setBloqueoInput(false)
            document.getElementsByName('COD_MONEDA')[0].removeAttribute('disabled')
            setInputCodMonedaFocus()
            setSelectedDate(new Date())
        }else{
            getTipoCambio();
        }
    },[]);
    const dateFormat = (fecha) =>{
        var dateArray = fecha.split('/')
        return moment(`"${dateArray[0]}.${dateArray[1]}.${dateArray[2]}"`, "DD.MM.YYYY").format()
    }
    const getTipoCambio = async() =>{
        try {
            if(location.state === undefined){
                history.push(url_lista);
            }else{
                setTipoCambio({
                    ...location.state.rows,
                    ['TIPO']                 : 'U',
                    ['COD_EMPRESA']          : cod_empresa,
                    ['USERNAME']             : username,
                    ['FEC_TIPO_CAMBIO_ANT']  : location.state.rows.FEC_TIPO_CAMBIO
                })
                setAuxData({
                    ...location.state.rows,
                    ['TIPO']                : 'U',
                    ['COD_EMPRESA']         : cod_empresa,
                    ['USERNAME']            : username,
                    ['FEC_TIPO_CAMBIO_ANT'] : location.state.rows.FEC_TIPO_CAMBIO
                })
                let FEC_TIPO_CAMBIO  = dateFormat(location.state.rows.FEC_TIPO_CAMBIO);
                setSelectedDate(FEC_TIPO_CAMBIO);

                setValorVenta(location.state.rows.VAL_VENTA);
                setValorCompra(location.state.rows.VAL_COMPRA);
                form.setFieldsValue(location.state.rows);
                document.getElementById('VAL_VENTA').focus()
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        
    //    if(event.target.name == 'VAL_VENTA'){
    //     setValueDecimalesVtas(event.target.value);
    //    }
    //    if(event.target.name == 'VAL_COMPRA'){
    //     setValueDecimalesComp(event.target.value);
    //    }
    
        setTipoCambio({
            ...tipoCambio,
            [event.target.name] : event.target.value.trim()
        })
    }
    const direccionar = () => {
        history.push(url_lista);
    }
    const validacionesDeCodigo = async (value,url)=>{
        var method = 'POST';
        var data = {    
                        'valor'        : value, 
                        'cod_moneda'   : moneda.COD_MONEDA,  
                    };
        try {
            var response =  await Request( url,method, data ).then( response => {return response })
            if(response.status === 200){
                if(response.data.outBinds.ret === 1){
                    return true
                }else{
                    showModalMensaje('ERROR!','error',response.data.p_outBinds.mensaje);
                    return false
                }
            }
        } catch (error) {
            console.log('error en metodo validacionesDeCodigo', error);
        }
    }
    const onFinish = async (values) => {
        var cod_Pais   = await validacionesDeCodigo(tipoCambio.COD_MONEDA,  url_valida_moneda)
        if(cod_Pais){
            if (JSON.stringify(auxData) !== JSON.stringify(tipoCambio)) {
                try{
                    var url    =  url_post_base;
                    var method = 'POST';
                    await Request( url, method, tipoCambio )
                    .then(async(response) => {
                        var rows = response.data;
                        if(rows.ret === 1){
                            history.push(url_lista);
                        }else{
                            showModalMensaje('ERROR!','error',rows.p_mensaje);
                        }
                    });
                }catch(error){
                    console.log('Error en el metodo onFinish: ',error);
                }
            }else{
                direccionar(url_lista);
            }
        }
    }
    const onFinishFailed = (errorInfo) => {
        showModalMensaje('ERROR!','error','Error en el formulario');
    }
    const handleFocus = async (e) => {
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if (tipoCambio.COD_MONEDA !== undefined && COD_MONEDA_ANTERIOR !== e.target.value){
                if(e.target.name === 'COD_MONEDA'){                    
                    var url = url_valida_moneda;
                    var method = 'POST';
                    var data = { 'valor': e.target.value};
                    try {
                        await Request( url,method, data )
                        .then( response => {
                            if(response.status == 200){
                                if(response.data.outBinds.ret == 1){
                                    setTipoCambio({
                                        ...tipoCambio,
                                        ['COD_MONEDA' ] : e.target.value,
                                        ['DESC_MONEDA'] : response.data.outBinds.p_desc_moneda,
                                    })
                                    form.setFieldsValue({
                                        ...form,
                                        ['COD_MONEDA '] : e.target.value,
                                        ['DESC_MONEDA'] : response.data.outBinds.p_desc_moneda,
                                    })
                                    
                                    // let decimalesVentas = parseInt(response.data.outBinds.p_decimales_vtas);
                                    // refDecimalesVtas.current.autonumeric.options.decimalPlaces(decimalesVentas);

                                    // let decimalesCompra = parseInt(response.data.outBinds.p_decimales);
                                    // refDecimalesCompra.current.autonumeric.options.decimalPlaces(decimalesCompra);
                                    // setSiglas(response.data.outBinds.p_siglas);
                                    
                                    COD_MONEDA_ANTERIOR = e.target.value;
                                    document.getElementById('FEC_TIPO_CAMBIO').focus();

                                }else{
                                    showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                                }
                            }
                        })
                    } catch (error) {
                        console.log('error en metodo validar Pais', error);
                    }
                }
            }else{
                document.getElementById('FEC_TIPO_CAMBIO').focus();
            }
            if(e.target.name === 'FEC_TIPO_CAMBIO'){
                document.getElementById('VAL_VENTA').focus();
            }

            if(e.target.name === 'VAL_VENTA'){
                document.getElementById('VAL_COMPRA').focus();
            }
        }
        if(e.which === 120 && (e.target.name === 'COD_MONEDA')){

            if(e.target.name === 'COD_MONEDA'){
                var auxPais = await getMoneda();
                setModalTitle("Monedas")
                setSearchColumns(ColumnsMoneda)
                setSearchData(auxPais)
                setTipoDeBusqueda(e.target.name);                
             }
             setShows(true);
         }
    }
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const onInteractiveSearch = async (event) => {
        var url         = '';
        var valor       = event.target.value;
        valor           = valor.trim();

        if(valor.length == 0 ){
            valor = null;
            RefreshBackgroundColor(true)
        }

        if( tipoDeBusqueda === 'COD_MONEDA' ){
            url = url_buscar_moneda;
            if(valor == null) return setSearchData(moneda);   
        }

        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor};
            await Request( url, method, data )
                .then( response => {
                    if( response.status == 200 ){
                        if(tipoDeBusqueda === 'COD_MONEDA'){
                            setSearchData(response.data.rows)
                        }
                    }
                RefreshBackgroundColor(true)
            })
        }
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {
        
        if(datos !== "" || datos !== undefined){

            if( BusquedaPor === 'COD_MONEDA' ){
                setTipoCambio({
                    ...tipoCambio,
                    ['COD_MONEDA']  : datos[0],
                    ['DESC_MONEDA'] : datos[1]
                })
                form.setFieldsValue({
                    ...form,
                    ['COD_MONEDA']  : datos[0],
                    ['DESC_MONEDA'] : datos[1]
                })
                setTimeout(()=>document.getElementById('FEC_TIPO_CAMBIO').focus(), 100);
                showsModal(false)
            }
        }
    }    
    const handleCancel = () => {
        // setVisible(false);
        // setVisibleSave(false);
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
    const handleDateChange = (e) => {
        var valorFecha = moment(e).format("DD/MM/YYYY")
        if(valorFecha !== null && valorFecha !== 'Invalid date'){   
            setTipoCambio({
                ...tipoCambio,
                ['FEC_TIPO_CAMBIO']:valorFecha
            })
            setSelectedDate(e)
        }
    };
    const handleNumberChange = async(e, value) =>{
        setTipoCambio({
            ...tipoCambio,
            [e.target.name] : value
        })
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
            <Main.FormModalSearch
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
                <Main.Paper className="paper-style">
                    <Main.TituloForm titulo={Titulo} />
                    <Form
                        layout="horizontal"
                        size="small"
                        autoComplete="off"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}>
                            <Main.ButtonForm 
                                dirr={url_lista} 
                                arrayAnterior={auxData} 
                                arrayActual={tipoCambio} 
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
                                <Row gutter={[16, 8]} >
                                    <Col span={9}>
                                        <Row gutter={8}>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Moneda"
                                                    name="COD_MONEDA"
                                                    labelCol={{ span: 18 }}
                                                    wrapperCol={{ span: 6 }}>
                                                    <Input
                                                        name="COD_MONEDA"
                                                        ref={inputCodMonedaFocus}
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        autoComplete="off"
                                                        required
                                                        disabled={bloqueoInput}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={16}>
                                                <Form.Item
                                                    name="DESC_MONEDA"
                                                    wrapperCol={{ span: 24 }}>
                                                    <Input
                                                        name="DESC_MONEDA"
                                                        disabled={true}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>   
                                    <Col span={15} >      
                                        <Row gutter={8} >
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Tipo"
                                                    labelCol={{ span: 6 }}
                                                    wrapperCol={{ span: 17 }}>
                                                     <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                                                       <KeyboardDatePicker
                                                            name="FEC_TIPO_CAMBIO"
                                                            id="FEC_TIPO_CAMBIO"
                                                            onKeyDown={handleFocus}
                                                            style={{marginTop:'-3px'}}
                                                            disableToolbar
                                                            variant="inline"
                                                            format={'dd/MM/yyyy'}
                                                            value={selectedDate}
                                                            emptyLabel="__/__/___"
                                                            maxDateMessage={false}
                                                            minDateMessage={false}
                                                            invalidDateMessage={false}
                                                            disableFuture={true}
                                                            onChange={(e)=>handleDateChange(e)}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date',
                                                            }}
                                                            disabled={bloqueoInput}
                                                        />
                                                    </MuiPickersUtilsProvider> 
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} >
                                                <Form.Item
                                                    label="Venta"
                                                    labelCol={{ span: 6 }}
                                                    wrapperCol={{ span: 17 }}>
                                                    <CurrencyTextField
                                                        name="VAL_VENTA"
                                                        id="VAL_VENTA"
                                                        value={ valorVenta }
                                                        style={{marginTop:'-7px',with:'20px',fontSize:'13px',paddingLeft:'1px'}}
                                                        decimalCharacter=","
                                                        digitGroupSeparator="."
                                                        decimalPlaces={0}
                                                        currencySymbol={""}
                                                        // ref={refDecimalesVtas}
                                                        onKeyDown={handleFocus}
                                                        onChange={ (e, val)=> { handleNumberChange(e,val); setValorVenta(val) }  }
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} >
                                            <Form.Item
                                                label="Compra"
                                                labelCol={{ span: 6 }}
                                                wrapperCol={{ span: 17 }}>
                                                    <CurrencyTextField
                                                        name="VAL_COMPRA"
                                                        id="VAL_COMPRA"
                                                        value={valorCompra}
                                                        style={{marginTop:'-7px',with:'20px',fontSize:'13px',paddingLeft:'1px'}}
                                                        decimalCharacter=","
                                                        digitGroupSeparator="."
                                                        decimalPlaces={0}
                                                        currencySymbol={""}
                                                        // ref={refDecimalesCompra}
                                                        onKeyDown={handleFocus}
                                                        onChange={ (e, val)=> { handleNumberChange(e,val); setValorCompra(val) }  }                                                    
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>   
                                </Row>
                            </div>
                    </Form>
                </Main.Paper>
            </div>
        </Main.Layout>
    )
}
export default TiposCambio_form;