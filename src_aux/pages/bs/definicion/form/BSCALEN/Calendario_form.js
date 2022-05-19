import React, { useEffect, useState , useRef} from 'react';
import Layout                               from "../../../../../components/utils/NewLayout";
import Paper                                from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}              from '../../../../../components/utils/ContenedorForm/ContainerFrom'
import FormModalSearch                      from "../../../../../components/utils/ModalForm/FormModalSearch";
import NewTableSearch                       from '../../../../../components/utils/NewTableSearch/NewTableSearch';
import ModalDialogo                         from "../../../../../components/utils/Modal/ModalDialogo";
import Fieldset                             from '../../../../../components/utils/Fieldset/Fieldset';
import Main                                 from '../../../../../components/utils/Main';
import { KeyboardDatePicker,
         MuiPickersUtilsProvider }          from '@material-ui/pickers';
import DateFnsUtils                         from '@date-io/date-fns';
import deLocale                             from "date-fns/locale/es";
import {
      Form
    , Input
    , Row
    , Col
    , Card
    , Checkbox
} from 'antd';
import "moment/locale/es";
import moment from "moment";
moment.locale("es_es", {
    week: {
        dow: 3
    }
});
// * BUSCADORES
const url_buscar_sucursal = '/bs/calendarios/buscar/sucursal';
const url_buscar_modulo   = '/bs/calendarios/buscar/modulo';
// * VALIDADORES
const url_valida_sucursal = '/bs/calendarios/valida/sucursal';
const url_valida_modulo   = '/bs/calendarios/valida/modulo';
const sucursalColumn = [
    { ID: 'COD_SUCURSAL'        , label: 'Código'           , width: 100    },
    { ID: 'DESC_SUCURSAL'       , label: 'Descripcion'      , minWidth: 150 },
];
const moduloColumn = [
    { ID: 'COD_MODULO'        , label: 'Código'           , width: 100    },
    { ID: 'DESC_MODULO'       , label: 'Descripcion'      , minWidth: 150 },
];
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName            = 'BSCALEN';
const Calendario = ({ history, location, match}) => {
    var ArrayData            = new Array;
    var cod_empresa = sessionStorage.getItem('cod_empresa');
    var username    = sessionStorage.getItem('cod_usuario');
    const dirr      = "/bs/calendario";    
    const Titulo    = 'Mantenimiento de Calendario';
    const { params: { id }}  = match;
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
    //State Modal
    const [modalTitle       , setModalTitle     ] = useState('');
    const [searchData       , setSearchData     ] = useState({});
    const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    //useState  Array
    const [estadoCheckbox] = useState(ArrayData);
    //State de Calendario
    const [calendario             , setCalendario               ] = useState([]);
    const [auxData                , setAuxData                  ] = useState([]);
    const [searchColumns          , setSearchColumns            ] = useState({});
    const [isNew                  , setIsNew                    ] = useState(false);
    const [shows                  , setShows                    ] = useState(false);
    const [statusEstadoCheckbox   , setStatusEstadoCheckbox     ] = useState(true);
    const [mensaje                , setMensaje                  ] = useState();
    const [imagen                 , setImagen                   ] = useState();
    const [tituloModal            , setTituloModal              ] = useState();
    const [visibleMensaje         , setVisibleMensaje           ] = useState(false);
    const [isNewInput             , setIsNewInput               ] = useState(true);
    const [fecInicialDate         , setFectInicialDate          ] = useState()
    const [fecFinalDate           , setFecFinalDate             ] = useState()
    const [fecActualDate          , setFecActualDate            ] = useState()
 // ADMINISTRAR FOCUS     
    const [ codSucursalFocus       , setCodSucursalFocus        ] = UseFocus();
    const [ moduloFocus            , setModuloFocus             ] = UseFocus();
    const [ activoFocus            , setActivoFocus             ] = UseFocus();
    const getSucursal = async() =>{
        try {
            var url    = url_buscar_sucursal;
            var method = 'POST';
            var response = await Main.Request( url, method, {cod_empresa:cod_empresa, valor:'null'} )
            .then(response => {return response})
            if( response.data.rows.length > 0){
                return response.data.rows
            }else{
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getModulo = async() =>{
        try {
            var url    = url_buscar_modulo;
            var method = 'POST';
            var response = await Main.Request( url, method, {valor:'null'} )
            .then(response => {return response});
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
            var dateSistem = moment().format('DD/MM/YYYY');
            setCalendario({
                ...calendario,     
                ['COD_EMPRESA']     : cod_empresa,
                ['TIPO']            :'I',
                ['ESTADO']          :'I',
                ['USERNAME']        : username,
                ['FEC_INICIAL']     : dateSistem,
                ['FEC_FINAL']       : dateSistem,
                ['FEC_ACTUAL']      : dateSistem,
                ['FEC_ALTA']        : dateSistem,
                ['FEC_ACTUALIZADO'] : dateSistem,
                ['ALTA_POR']        : username,
                ['ACTUALIZADO_POR'] : username,
            });
            setAuxData({
                ...calendario,     
                ['COD_EMPRESA']     : cod_empresa,
                ['TIPO']            :'I',
                ['ESTADO']          :'I',
                ['USERNAME']        : username,
                ['FEC_INICIAL']     : dateSistem,
                ['FEC_FINAL']       : dateSistem,
                ['FEC_ACTUAL']      : dateSistem,
                ['FEC_ALTA']        : dateSistem,
                ['FEC_ACTUALIZADO'] : dateSistem,
                ['ALTA_POR']        : username,
                ['ACTUALIZADO_POR'] : username,
            })
            setIsNew(false);
            setIsNewInput(false)
            document.getElementsByName('COD_SUCURSAL')[0].removeAttribute('disabled')
            setCodSucursalFocus();
        }else{
            getData();
            setcheckboxDefault();
            document.getElementById("FEC_INICIAL").focus();
        }
    },[]);
    const dateFormat = (fecha) =>{
        var dateArray = fecha.split('/')
        return moment(`"${dateArray[0]}.${dateArray[1]}.${dateArray[2]}"`, "DD.MM.YYYY").format()
    }
    const getData = async() =>{
        try {
            if(location.state === undefined){
                history.push(dirr);
            }else{
                let rowData     = location.state.rows;                
                var FEC_INICIAL = dateFormat(rowData.FEC_INICIAL)
                var FEC_FINAL   = dateFormat(rowData.FEC_FINAL)
                var FEC_ACTUAL   = dateFormat(rowData.FEC_ACTUAL)
                
                setFectInicialDate(FEC_INICIAL);
                setFecFinalDate(FEC_FINAL);
                setFecActualDate(FEC_ACTUAL);

                setCalendario({
                    ...location.state.rows,
                    ['TIPO']: 'U',
                    ['USERNAME']: username
                })
                setAuxData({
                    ...location.state.rows,
                    ['TIPO']: 'U',
                    ['USERNAME']: username
                })  
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
    const handleInputChange = (event)=>{
        setCalendario({
            ...calendario,
            [event.target.name] : event.target.value.trim()
        });
    }
    const onFinish         = async(values) => {
        var url    = `/bs/calendarios/` + cod_empresa;
        var method = 'POST';
        await Main.Request( url, method, calendario )
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
            e.preventDefault();
            
            if(e.target.name == 'COD_SUCURSAL'){
                Main.validar(
                        setCalendario           ,   calendario     ,    showModalMensaje
                    ,   url_valida_sucursal     ,   e.target.name  ,    "DESC_SUCURSAL"
                    ,   e.target.value          ,   setModuloFocus ,    "p_desc_sucursal"
                    ,   {'cod_empresa': cod_empresa,[e.target.name]:e.target.value});
            }
        
            if(e.target.name == 'COD_MODULO'){
                Main.validar(
                        setCalendario           ,   calendario        ,    showModalMensaje
                    ,   url_valida_modulo       ,   e.target.name     ,    "DESC_MODULO"
                    ,   e.target.value          ,   setActivoFocus    ,    "p_desc_modulo"
                    ,   {'cod_empresa': cod_empresa,[e.target.name]:e.target.value});
            };

            if(e.target.name == 'ACTIVO'){
                document.getElementById('FEC_INICIAL').focus()
            }
            if(e.target.name == "FEC_INICIAL"){
                document.getElementById('FEC_FINAL').focus();
            }
            if(e.target.name == "FEC_FINAL"){
                document.getElementById('FEC_ACTUAL').focus();
            }
        }

        if(e.which === 120 && (
           e.target.name === 'COD_SUCURSAL' || 
           e.target.name === 'COD_MODULO'      
        )){
            if(e.target.name === 'COD_SUCURSAL'){
                var auxSucursal = await getSucursal();
                setSearchColumns(sucursalColumn);
                setSearchData(auxSucursal);
                setModalTitle('Sucursales');
                setTipoDeBusqueda(e.target.name);

            }else if (e.target.name === 'COD_MODULO'){
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
    const setcheckboxDefault = async () => {
        if(location.state !== undefined){

            var option      = location.state.OpcionChecbox;
            var ESTADO      = location.state.rows.ACTIVO; 
                
            if(option !== undefined){
                if(option.length > 0){
                    for (let i = 0; i < option.length; i++) {
                        if(option[i].options !== undefined){
                            if(option[i].options.includes(ESTADO)){   
                                ArrayData.push('ACTIVO')
                            }
                          
                        }
                    }
                }
            }
        }
    }  
    const handleCheckbox = (e) => {
        if(e.target.name === 'ACTIVO' ){
            setCalendario({
                ...calendario,
                ['ACTIVO']: e.target.checked ? 'S' : 'N'
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
    const modalSetOnClick = async (datos, BusquedaPor) => {
        
        if( BusquedaPor === 'COD_SUCURSAL' ){
            setCalendario({
                ...calendario,
                ['COD_SUCURSAL']      : datos[0],
                ['DESC_SUCURSAL']     : datos[1],
            });
            setTimeout( setModuloFocus , 100);
        }
        if( BusquedaPor === 'COD_MODULO' ){
            setCalendario({
                ...calendario,
                ['COD_MODULO']  : datos[0],
                ['DESC_MODULO'] : datos[1],
            });
            setTimeout(()=> setActivoFocus(),100);
        }
        setShows(false);
    }
    const onInteractiveSearch = async(event)=> {
        var valor = event.target.value;
            valor = valor.trim();
        var url   = ""
        if(valor.length == 0 ){
            valor = 'null';
        }
        if( tipoDeBusqueda === 'COD_SUCURSAL' ){
            url = url_buscar_sucursal;
        }
        if( tipoDeBusqueda === 'COD_MODULO' ){
            url = url_buscar_modulo;            
        }
        try{
            var method = 'POST';
            var data   = {'cod_empresa':cod_empresa,'valor':valor};
            await Main.Request( url, method, data )
            .then( response => {
                if( response.status == 200 ){
                    setSearchData(response.data.rows);
                }
            })        
        } catch (error){
            console.log('error en la funcion onInteractiveSearch ',error)
        }
    }
    const handleDateChange = (e, nameInput) => {
        var valorFecha = moment(e).format("DD/MM/YYYY")
        if(valorFecha !== null && valorFecha !== 'Invalid date'){   
            if(nameInput == 'FEC_INICIAL'){
                formatDate(valorFecha, nameInput);
                setFectInicialDate(e);
            }else if(nameInput == 'FEC_FINAL'){
                formatDate(valorFecha, nameInput);
                setFecFinalDate(e);
            }else if(nameInput == 'FEC_ACTUAL'){
                formatDate(valorFecha, nameInput,e);
                setFecActualDate(e);
            }
        }
    } 
    const formatDate = (valor, nameValue) =>{ 
        setCalendario({
            ...calendario,
            [nameValue]:valor
        })
    }
    return (
        <>
            <Layout 
                defaultOpenKeys={['BS','BS-BS1']} 
                defaultSelectedKeys={['BS-BS1-null-BSCALEN']}>
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
                        <NewTableSearch
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
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                        <ButtonForm 
                            dirr={dirr} 
                            arrayAnterior={auxData} 
                            arrayActual={calendario} 
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
                            <Row>
                                <Col span={10}>
                                    <Row gutter={8}>
                                        <Col span={10}>
                                            <Form.Item
                                                label="Sucursal"
                                                labelCol={{span:18}}
                                                wrapperCol={{span:6}} 
                                                >
                                                <Input
                                                    name="COD_SUCURSAL"
                                                    id="requerido"
                                                    value={calendario.COD_SUCURSAL}                                                
                                                    onChange={handleInputChange}
                                                    disabled={isNewInput}
                                                    ref={codSucursalFocus}
                                                    onKeyPress={validarCapo}
                                                    onKeyDown={handleFocus}
                                                    autoComplete="off"
                                                    required
                                                    />
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item>
                                                <Input 
                                                    name="DESC_SUCURSAL" 
                                                    value={calendario.DESC_SUCURSAL}
                                                    disabled={true}
                                                    />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={10}>
                                    <Row gutter={8}>
                                        <Col span={8} >
                                            <Form.Item
                                                label="Modulo"
                                                labelCol={{span:16}}
                                                wrapperCol={{span:8}}
                                                >
                                                <Input
                                                    name="COD_MODULO"
                                                    onInput={Main.mayuscula}
                                                    id="requerido"
                                                    value={calendario.COD_MODULO}
                                                    onChange={handleInputChange}
                                                    disabled={isNewInput}
                                                    onKeyDown={handleFocus}
                                                    ref={moduloFocus}
                                                    />
                                                    
                                            </Form.Item>
                                        </Col>
                                        <Col span={16} >
                                            <Form.Item
                                                labelCol={{span:5}}
                                                wrapperCol={{span:20}}
                                                >
                                                <Input
                                                    name="DESC_MODULO"
                                                    id="DESC_MODULO"
                                                    value={calendario.DESC_MODULO}
                                                    disabled={true}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={4}>                                    
                                    <Card style={{textAlign:'center'}}>
                                        {estadoCheckbox.includes("ACTIVO") ?
                                        <Checkbox  
                                            checked={statusEstadoCheckbox} 
                                            name="ACTIVO"
                                            ref={activoFocus}
                                            onKeyDown={handleFocus}
                                            onChange={ handleCheckbox }>Activo
                                        </Checkbox>
                                        : 
                                            <Checkbox onKeyDown={handleFocus} ref={activoFocus} onChange={handleCheckbox } name="ACTIVO" >Activo</Checkbox> 
                                        } 
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Row gutter={8}>
                                        <Col span={7} style={{marginTop:'9px'}} >
                                            <Form.Item
                                                label="Fecha Inicial"
                                                labelCol={{span:10}}
                                                wrapperCol={{span:10}}>
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
                                        <Col span={9} style={{marginTop:'9px'}} >
                                            <Form.Item
                                                label="Fecha Final"
                                                labelCol={{span:15} }
                                                wrapperCol={{span:14}}  >

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
                                                        onChange={ (e) => handleDateChange(e,'FEC_FINAL')}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} style={{marginTop:'9px'}} >
                                            <Form.Item
                                                label="Fecha Cierre"
                                                labelCol={{span:16}}
                                                wrapperCol={{span:14}}
                                                >
                                                <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                                                    <KeyboardDatePicker
                                                        name="FEC_ACTUAL"
                                                        id="FEC_ACTUAL"
                                                        onKeyDown={handleFocus}
                                                        disableToolbar
                                                        variant="inline"
                                                        format={'dd/MM/yyyy'}
                                                        value={fecActualDate}
                                                        emptyLabel="__/__/___"
                                                        maxDateMessage={false}
                                                        minDateMessage={false}
                                                        invalidDateMessage={false}
                                                        disableFuture={true}
                                                        onChange={ (e) => handleDateChange(e,'FEC_ACTUAL')}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>

                                <hr style={{border: '0.-1px solid #fdffff', width:'100%',marginTop:'10px'}} />
                            
                                <Col span={12}  >
                                    <Row gutter={8} style={{justifyContent:'center'}}  >
                                       <Col span={12}>
                                            <Fieldset
                                                anchoContenedor="100%" 
                                                alineacionTitle="center"
                                                alineacionContenedor="left"
                                                margenTop="12px"
                                                tamañoTitle="15px"
                                                title="Datos de Creación"
                                                contenedor=
                                                {
                                                    <>
                                                        <Form.Item
                                                                label="Usuario:"
                                                                labelCol={{span:6} }
                                                                wrapperCol={{span:18}}
                                                        >
                                                        <Input 
                                                            name="ALTA_POR" 
                                                            value={calendario.ALTA_POR}
                                                            disabled={true}
                                                        />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Fecha"
                                                            labelCol={{span:6} }
                                                            wrapperCol={{span:18}}
                                                        >
                                                    <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                                                        <KeyboardDatePicker
                                                            name="FEC_ALTA"
                                                            disableToolbar
                                                            variant="inline"
                                                            format={'dd/MM/yyyy'}
                                                            value={calendario.FEC_ALTA}
                                                            emptyLabel="__/__/___"
                                                            maxDateMessage={false}
                                                            minDateMessage={false}
                                                            invalidDateMessage={false}
                                                            disableFuture={true}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date',
                                                            }}
                                                            disabled={true}
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                </Form.Item>
                                             </>
                                            }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                               
                                <Col span={12}  >
                                    <Row gutter={8} style={{justifyContent:'center'}}  >
                                       <Col span={12}>
                                            <Fieldset
                                                anchoContenedor="100%" 
                                                alineacionTitle="right"
                                                alineacionContenedor="center"
                                                margenTop="12px"
                                                tamañoTitle="15px"
                                                title="Datos de Actualización"
                                                contenedor=
                                                {
                                                    <>
                                                        <Form.Item
                                                                label="Usuario:"
                                                                labelCol={{span:6} }
                                                                wrapperCol={{span:18}}
                                                        >
                                                        <Input 
                                                            name="ACTUALIZADO_POR"
                                                            value={calendario.ACTUALIZADO_POR} 
                                                            disabled={true}
                                                        />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Fecha"
                                                            labelCol={{span:6} }
                                                            wrapperCol={{span:18}}
                                                        >
                                                            <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                                                                <KeyboardDatePicker
                                                                    name="FEC_ACTUALIZADO"
                                                                    value={calendario.FEC_ACTUALIZADO}
                                                                    id="FEC_ACTUALIZADO"
                                                                    disableToolbar
                                                                    variant="inline"
                                                                    format={'dd/MM/yyyy'}
                                                                    emptyLabel="__/__/___"
                                                                    maxDateMessage={false}
                                                                    minDateMessage={false}
                                                                    invalidDateMessage={false}
                                                                    disableFuture={true}
                                                                    KeyboardButtonProps={{
                                                                        'aria-label': 'change date',
                                                                    }}
                                                                    disabled={true}
                                                                />
                                                            </MuiPickersUtilsProvider>         
                                                        </Form.Item>
                                                    </>
                                                }
                                             />
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
)}

export default  Calendario;