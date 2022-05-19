import React, { useEffect,useState,useRef } from 'react';
import {ButtonForm,TituloForm}              from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import FormModalSearch                      from "../../../../../components/utils/ModalForm/FormModalSearch";
import ModalDialogo                         from "../../../../../components/utils/Modal/ModalDialogo";
import Main                                 from '../../../../../components/utils/Main';
import {
      Form       , Input       , Card
    , Checkbox   , Row         , Col
} from 'antd';
const ColumnPais = [
    { ID: 'COD_PAIS'   , label: 'Código'          , width: 100  },
    { ID: 'DESC_PAIS'  , label: 'Descripción'     , minWidth:150},
];
const ColumnProvincia = [
    { ID: 'COD_PROVINCIA'   , label: 'Código'     , width:100   },
    { ID: 'DESC_PROVINCIA'  , label: 'Descrición' ,minWidth:150 },
];
const ColumnCiudad = [
    { ID: 'COD_CIUDAD'  , label: 'Código'         ,width:100    },
    { ID: 'DESC_CIUDAD' , label: 'Descrición'     ,minWidth:150 },
];
const Titulo  = 'Sucursal';
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName            = 'BSSUCUR';
const Sucursal = ({ history, location, match}) => {
    const [form]        = Form.useForm();
    var ArrayData       = new Array;
    const { params: { cod_sucursal } } = match;
    const username                     = sessionStorage.getItem('cod_usuario');
    const dirr                         = "/bs/sucursal";
    const Titulo                       = 'Sucursal';
    const cod_empresa                  = sessionStorage.getItem('cod_empresa');
    
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
    //State de sucursal
    const [inputTextCodProv       ,setInputTextCodProv          ] = useState();
    const [inputTextCodPais       ,setInputTextCodPais          ] = useState("");
    const [sucursal               , setSucursal                 ] = useState([]);
    const [auxData                , setAuxData                  ] = useState([]);
    const [pais                   , setPais                     ] = useState([]);
    const [provincia              , setProvincia                ] = useState([]);
    const [ciudad                 , setCiudad                   ] = useState([]);
    const [searchColumns          , setSearchColumns            ] = useState({});
    const [isNew                  , setIsNew                    ] = useState(false);
    const [stateNuevo             , setStateNuevo               ] = useState(false);
    const [nuevoCodSucursal       , setNuevoCodSucursal         ] = useState(false);
    const [shows                  , setShows                    ] = useState(false);
    const [statusEstadoCheckbox   , setStatusEstadoCheckbox     ] = useState(true);
    const [statusMatrizCheckbox   , setStatusMatrizCheckbox     ] = useState(true);
    const [statusDevJaulaCheckbox , setStatusDevJaulaCheckbox   ] = useState(true);  
    const [mensaje                , setMensaje                  ] = useState();
    const [imagen                 , setImagen                   ] = useState();
    const [tituloModal            , setTituloModal              ] = useState();
    const [visibleMensaje         , setVisibleMensaje           ] = useState(false);
    // ADMINISTRAR FOCUS
    const [ inputCodSucFocus         , setinputCodSucFocus         ] = UseFocus();
    const [ inputDesSucFocus         , setinputDesSucFocus         ] = UseFocus();
    const [ inputNroDeOrdeFocus      , setInputNroDeOrdeFocus      ] = UseFocus();
    const [ inputCodPaisFocus        , setInputCodPaisFocus        ] = UseFocus();
    const [ inputCodProvinciaFocus   , setInputCodProvinciaFocus   ] = UseFocus();
    const [ inputCodCiudadFocus      , setInputCodCiudadFocus      ] = UseFocus();
    const [ inputRRHHCiudadFocus     , setInputRRHHCiudadFocus     ] = UseFocus();
    const [ inputCodPostalFocus      , setInputCodPostalFocus      ] = UseFocus();
    const [ inputTelRRHHFocus        , setInputTelRRHHFocus        ] = UseFocus();
    const [ inputNroRegistroFocus    , setInputNroRegistroFocus    ] = UseFocus();
    const [ inputNroPatronalFocus    , setInputNroPatronalFocus    ] = UseFocus();
    const [ inputDireRRHHFocus       , setInputDireRRHHFocus       ] = UseFocus();
    const getPais = async(cod_pais) =>{
        try {
            var url    = `/bs/sucursales/buscar/pais`;
            var method = 'POST';
            var response = await Main.Request( url, method, {"valor":"null"} )
            .then(response => {return response})
            if( response.data.rows.length > 0){
                setPais(response.data.rows);
                return response.data.rows
            }else{
                setPais([]);
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getProvincia = async(cod_pais) =>{
        try {
            var url      = `/bs/sucursales/buscar/provincia`;
            var method   = 'POST';
            var response = await Main.Request( url, method, {"valor":"null", cod_pais} )
            .then( response =>  { return response; })
            if(response.data.rows.length > 0){
                setProvincia(response.data.rows)
                return response.data.rows;
            }else{
                setProvincia([])
                return [];
            };
        } catch (error) {
            console.log(error);
        }
    }
    const getCiudad = async(cod_pais, cod_provincia) =>{
        try {
            var url    = `/bs/sucursales/buscar/ciudad`;
            var method = 'POST';
            var response = await Main.Request( url, method, {"valor":"null",cod_pais, cod_provincia} )
            .then(response => { return response})
            if( response.data.rows.length > 0){
                setCiudad(response.data.rows);
                return response.data.rows;
            }else{
                setCiudad([]);
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(cod_sucursal === 'nuevo'){
            setSucursal({
                ...sucursal,     
                ['COD_EMPRESA']  : cod_empresa,
                ['ESTADO']       :'I',
                ['ES_MATRIZ']    :'N',
                ['DEV_POR_JAULA']:'N',
                ['TIPO']: 'I',
                ['USERNAME']: username
            });
            setAuxData({
                ...sucursal,     
                ['COD_EMPRESA']  : cod_empresa,
                ['ESTADO']       :'I',
                ['ES_MATRIZ']    :'N',
                ['DEV_POR_JAULA']:'N',
                ['TIPO']: 'I',
                ['USERNAME']: username
            })  
            setinputCodSucFocus()
            setIsNew(true);
        }else{
            getData();
            setcheckboxDefault();
            setNuevoCodSucursal(true)
            setinputDesSucFocus()
        }
        setStateNuevo(true);
    },[]);
    const getData = async() =>{
        try {
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setSucursal({
                    ...location.state.rows,
                    ['TIPO']: 'U',
                    ['USERNAME']: username
                })
                setAuxData({
                    ...location.state.rows,
                    ['TIPO']: 'U',
                    ['USERNAME']: username
                })  
                setInputTextCodPais(location.state.rows.COD_PAIS);
                setInputTextCodProv(location.state.rows.COD_PROVINCIA);
                form.setFieldsValue(location.state.rows);
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
        if(event.target.name === "COD_PROVINCIA" || event.target.name === "COD_CIUDAD"){
            if(!isNaN(event.target.value)){
                return (
                    setSucursal({
                        ...sucursal,
                    [event.target.name] : event.target.value.trim()})
                )  
            }
        }
        setSucursal({
            ...sucursal,
            [event.target.name] : event.target.value.trim()
        })        
    }
    const onFinish         = async(values) => {
        var url    = `/bs/sucursales/` + sessionStorage.getItem('cod_empresa');
        var method = 'POST';
        await Main.Request( url, method, sucursal)
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push(dirr);
            }else{
                showModalMensaje('ERROR!','error',rows.mensaje);
            }
        });
    }
    const handleFocus = async (e) =>{ 
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if(e.target.name === 'COD_PAIS'){
                var url = '/bs/sucursales/valida/pais';
                var method = 'POST';
                var data = { 'valor': e.target.value.toUpperCase() };
                try {
                    await Main.Request( url,method, data )
                    .then( response => {
                        if(response.status == 200){
                            if(response.data.outBinds.ret == 1){
                                setSucursal({
                                    ...sucursal,
                                    ['COD_PAIS'] :e.target.value.toUpperCase(),
                                    ['DESC_PAIS']: response.data.outBinds.desc_pais
                                })
                                form.setFieldsValue({
                                    ...form,
                                    ['COD_PAIS']:e.target.value.toUpperCase(),
                                    ['DESC_PAIS']: response.data.outBinds.desc_pais
                                })
                                if(e.target.value.toUpperCase() !==  inputTextCodPais){
                                    form.setFieldsValue({
                                        ...form,
                                        ['COD_PROVINCIA']   : "",
                                        ['DESC_PROVINCIA']  : "",
                                        ['COD_CIUDAD']      : "",
                                        ['DESC_CIUDAD']     : ""
                                    })                                  
                                }
                                setInputTextCodPais(e.target.value.toUpperCase())
                                var auxProvincia = getProvincia(e.target.value)
                                setSearchData(auxProvincia);
                                setInputCodProvinciaFocus()
                            }else{
                                showModalMensaje('ERROR!','error',response.data.outBinds.mensaje);
                            }
                        }
                    })
                } catch (error) {
                    console.log('error en metodo validar Pais', error);
                }
            }
            if(e.target.name === 'COD_PROVINCIA'){
                var url = '/bs/sucursales/valida/provincia';
                var method = 'POST';
                var data = {    'cod_pais': sucursal.COD_PAIS, 
                                'cod_dpto':e.target.value,
                            };
                try {
                    await Main.Request( url,method, data )
                    .then( response => {
                        if(response.status == 200){
                            if(response.data.outBinds.ret == 1){
                                setSucursal({
                                    ...sucursal,
                                    ['DESC_PROVINCIA']: response.data.outBinds.desc_dpto
                                })
                                form.setFieldsValue({
                                    ...form,
                                    ['DESC_PROVINCIA']: response.data.outBinds.desc_dpto,
                                })

                                if(e.target.value !==  inputTextCodProv){
                                    form.setFieldsValue({
                                        ['COD_CIUDAD']      : "",
                                        ['DESC_CIUDAD']     : ""
                                    })
                                }
                                setInputTextCodProv(e.target.value)
                                setInputCodCiudadFocus()
                            }else{
                                setSucursal({
                                    ...sucursal,
                                    ['COD_PROVINCIA']  : "",
                                    ['DESC_PROVINCIA'] : "",
                                    ['COD_CIUDAD']     : "",
                                    ['DESC_CIUDAD']    : "",
                                })
                                form.setFieldsValue({
                                    ...form,
                                    ['COD_PROVINCIA']  : "",
                                    ['DESC_PROVINCIA'] : "",
                                    ['COD_CIUDAD']     : "",
                                    ['DESC_CIUDAD']    : "",
                                })
                                showModalMensaje('ERROR!','error',response.data.outBinds.mensaje);
                            }
                        }
                    })
                } catch (error) {
                    showModalMensaje('ERROR!','error','Se produjo un error al ejecutar la peticion');
                }
            }
            if(e.target.name === 'COD_CIUDAD'){
                var url = '/bs/sucursales/valida/ciudad';
                var method = 'POST';
                var data =  {   'cod_pais'   :   sucursal.COD_PAIS, 
                                'cod_dpto'   :   sucursal.COD_PROVINCIA, 
                                'cod_ciudad' :   e.target.value  
                            };
                try {
                    await Main.Request( url,method, data )
                    .then( response => {
                        if(response.status == 200){
                            if(response.data.outBinds.ret == 1){
                                setSucursal({
                                    ...sucursal,
                                    ['DESC_CIUDAD']: response.data.outBinds.desc_ciudad
                                })
                                form.setFieldsValue({
                                    ...form,
                                    ['DESC_CIUDAD']: response.data.outBinds.desc_ciudad
                                })
                                setInputRRHHCiudadFocus();
                            }else{
                                setSucursal({
                                    ...sucursal,
                                    ['COD_CIUDAD'] : "",
                                    ['DESC_CIUDAD']: "",
                                })
                                form.setFieldsValue({
                                    ...form,
                                    ['COD_CIUDAD'] : "",
                                    ['DESC_CIUDAD']: "",
                                })
                                showModalMensaje('ERROR!','error',response.data.outBinds.mensaje);
                            }
                        }
                    })
                } catch (error) {
                    showModalMensaje('ERROR!','error','Se produjo un error al ejecutar la peticion');
                }
            }
            if(e.target.name === 'COD_SUCURSAL'){
                    setinputDesSucFocus()
            }
            if(e.target.name === 'DESCRIPCION'){
                    setInputNroDeOrdeFocus()
            }
            if(e.target.name === 'NRO_ORDEN'){
                setInputCodPaisFocus()
            }
            if(e.target.name === 'CIUDAD_SUC_RRHH'){
                setInputCodPostalFocus()
            }
            if(e.target.name === 'CODIGO_POSTAL'){
                setInputTelRRHHFocus()
            }
            if(e.target.name === 'TELEFONO_RRHH'){
                setInputNroRegistroFocus()
            }
            if(e.target.name === 'NRO_REGISTRO'){
                setInputNroPatronalFocus()
            }
            if(e.target.name === 'NRO_PATRONAL'){
                setInputDireRRHHFocus();
            }
        } 
        if(e.which === 120 && (
           e.target.name === 'COD_PROVINCIA' || 
           e.target.name === 'COD_CIUDAD'    ||
           e.target.name === 'COD_PAIS'       
        )){
            if(e.target.name === 'COD_PROVINCIA' && (sucursal.COD_PAIS      === "" || sucursal.COD_PAIS  === undefined))
                return showModalMensaje('ERROR!','error','Favor seleccione el codigo Pais');

            if(e.target.name === 'COD_CIUDAD'    && (sucursal.COD_PROVINCIA === "" || sucursal.COD_PROVINCIA === undefined))
                return showModalMensaje('ERROR!','error','Favor seleccione el codigo Departamento');
           
            if(e.target.name === 'COD_PAIS'){
                var auxPais = await getPais();
                setModalTitle("Pais")
                setSearchColumns(ColumnPais)
                setSearchData(auxPais)
                setTipoDeBusqueda(e.target.name);                
            }
            if(e.target.name === 'COD_PROVINCIA'){
                var auxProvinciaCodPais = await getProvincia(sucursal.COD_PAIS)
                setModalTitle("Departamento")
                setSearchColumns(ColumnProvincia)
                setSearchData(auxProvinciaCodPais)
                setTipoDeBusqueda(e.target.name);
            }
            if(e.target.name === 'COD_CIUDAD'){
                var auxCiudad = await getCiudad(sucursal.COD_PAIS, sucursal.COD_PROVINCIA);
                setModalTitle("Ciudad")
                setSearchColumns(ColumnCiudad)
                setSearchData(auxCiudad)
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
            var ESTADO      = location.state.rows.ESTADO; 
            var MATRIZ      = location.state.rows.ES_MATRIZ; 
            var DevPorJaula = location.state.rows.DEV_POR_JAULA; 
    
            if(option !== undefined){
                if(option.length > 0){
                    for (let i = 0; i < option.length; i++) {
                        if(option[i].options !== undefined){
                            if(option[i].options.includes(ESTADO)){   
                                ArrayData.push('ESTADO')
                            }
                            if(option[i].options.includes(MATRIZ)){
                                ArrayData.push('MATRIZ')
                            }
                            if(option[i].options.includes(DevPorJaula)){
                                ArrayData.push('DEVJAULA')
                            }
                        }
                    }
                }
            }
        }
    }
    const onInteractiveSearch = async(event)=> {
        var url = '';
        var valor = event.target.value;
        var cod_pais        = sucursal.COD_PAIS;
        var cod_provincia   = sucursal.COD_PROVINCIA;
        valor = valor.trim();
        if(valor.length == 0 ){
            valor = null;
        }
        if( tipoDeBusqueda === 'COD_PAIS' ){
            url = '/bs/sucursales/buscar/pais';
            if(valor == null) return setSearchData(pais);   
        }
        if( tipoDeBusqueda === 'COD_PROVINCIA' ){
            url = '/bs/sucursales/buscar/provincia';
            if(valor == null) return setSearchData(provincia);
        }
        if( tipoDeBusqueda === 'COD_CIUDAD' ){
            url = '/bs/sucursales/buscar/ciudad';
            if(valor === null) return setSearchData(ciudad);
        }
        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor, cod_pais, cod_provincia};
            await Main.Request( url, method, data )
                .then( response => {
                    if( response.status == 200 ){
                        if(tipoDeBusqueda === 'COD_PAIS'){
                            setSearchData(response.data.rows)
                        }
                        if(tipoDeBusqueda === 'COD_PROVINCIA'){
                            setSearchData(response.data.rows)
                        }
                        if(tipoDeBusqueda === 'COD_CIUDAD'){
                            setSearchData(response.data.rows)
                        }
                    }
            });
        }
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {
        
        if(datos !== "" || datos !== undefined){

            if( BusquedaPor === 'COD_PAIS' ){
                setSucursal({
                    ...sucursal,
                    ['COD_PAIS']   : datos[0],
                    ['DESC_PAIS']  : datos[1]
                })
                form.setFieldsValue({
                    ...form,
                    ['COD_PAIS']   : datos[0],
                    ['DESC_PAIS']  : datos[1]
                })
                if(datos[0]  !==  inputTextCodPais){
                    form.setFieldsValue({
                        ...form,
                        ['COD_PROVINCIA']   : "",
                        ['DESC_PROVINCIA']  : "",
                        ['COD_CIUDAD']      : "",
                        ['DESC_CIUDAD']     : "",
                    })
                }
                setInputTextCodPais(datos[0])
                setTimeout(setInputCodProvinciaFocus, 500);

            }else if( BusquedaPor === 'COD_PROVINCIA' ){
                setSucursal({
                    ...sucursal,
                    ['COD_PROVINCIA']   : datos[0],
                    ['DESC_PROVINCIA']  : datos[1]
                })
                form.setFieldsValue({
                    ...form,
                    ['COD_PROVINCIA']   : datos[0],
                    ['DESC_PROVINCIA']  : datos[1],
                })
                if(datos[0]  !==  inputTextCodProv){
                    form.setFieldsValue({
                        ['COD_CIUDAD']      : "",
                        ['DESC_CIUDAD']     : ""
                    })
                }
                setInputTextCodProv(datos[0])
                setTimeout( setInputCodCiudadFocus, 500 )

            }else if( BusquedaPor === 'COD_CIUDAD'){
                setSucursal({
                    ...sucursal,
                    ['COD_CIUDAD']   : datos[0],
                    ['DESC_CIUDAD']  : datos[1]
                })
                form.setFieldsValue({
                    ...form,
                    ['COD_CIUDAD']   : datos[0],
                    ['DESC_CIUDAD']  : datos[1]
                })
                setTimeout(setInputRRHHCiudadFocus, 500)
            }
        }
        showsModal(false)
    }
    const handleCheckbox = (e) => {
        if(e.target.name === 'ESTADO' ){
            setSucursal({
                ...sucursal,
                ['ESTADO']: e.target.checked ? 'A' : 'I'
            })
            setStatusEstadoCheckbox(!statusEstadoCheckbox)
        }else if(e.target.name === 'ES_MATRIZ'){
            setSucursal({
                ...sucursal,
                ['ES_MATRIZ']: e.target.checked ? 'S' : 'N'
            })
            setStatusMatrizCheckbox(!statusMatrizCheckbox)
        }else if(e.target.name === 'DEV_POR_JAULA'){
            setSucursal({
                ...sucursal,
                ['DEV_POR_JAULA']: e.target.checked ? 'S' : 'N'
            })
            setStatusDevJaulaCheckbox(!statusDevJaulaCheckbox)
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
    return (
        <>
            <Main.Layout 
                defaultOpenKeys={['BS','BS-BS1']} 
                defaultSelectedKeys={['BS-BS1-null-BSSUCUR']}>
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
                    <Main.Paper className="paper-style">
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
                            dirr={dirr} 
                            arrayAnterior={auxData} 
                            arrayActual={sucursal} 
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
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Sucursal"
                                                    name="COD_SUCURSAL"
                                                    labelCol={{span:18}}
                                                    wrapperCol={{span:6}} 
                                                    >
                                                    <Input
                                                        name="COD_SUCURSAL" 
                                                        id="requerido"                            
                                                        onChange={handleInputChange}
                                                        disabled={nuevoCodSucursal}
                                                        ref={inputCodSucFocus}
                                                        onKeyPress={validarCapo}
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={16}>
                                                <Form.Item
                                                    name="DESCRIPCION"
                                                    wrapperCol={{span:24}}
                                                    >
                                                <Input 
                                                    name="DESCRIPCION" 
                                                    id="requerido"
                                                    onChange={handleInputChange} 
                                                    onKeyDown={handleFocus}
                                                    ref={inputDesSucFocus}
                                                    autoComplete="off"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Nro. Orden"
                                                    name="NRO_ORDEN"
                                                    labelCol={{span:16, offset:2} }
                                                    wrapper={ {span:8} }
                                                    >
                                                    <Input
                                                        name="NRO_ORDEN"
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleFocus}
                                                        ref={inputNroDeOrdeFocus}
                                                        autoComplete="off"
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={16}>
                                                <Card>
                                                    {estadoCheckbox.includes("ESTADO") ?
                                                        <Checkbox  
                                                            checked={statusEstadoCheckbox} 
                                                            name="ESTADO"
                                                            onChange={ handleCheckbox }>Estado
                                                        </Checkbox>
                                                        :
                                                        <Checkbox  name="ESTADO" onChange={ handleCheckbox }>Estado</Checkbox>
                                                    }

                                                    { estadoCheckbox.includes('MATRIZ') ?
                                                        <Checkbox  
                                                            checked={statusMatrizCheckbox}  
                                                            name="ES_MATRIZ" 
                                                            onChange={ handleCheckbox }>Casa Matriz
                                                            </Checkbox>
                                                    :   
                                                        <Checkbox  name="ES_MATRIZ" onChange={ handleCheckbox }>Casa Matriz</Checkbox>
                                                    }

                                                    { estadoCheckbox.includes('DEVJAULA') ?
                                                        <Checkbox 
                                                            checked={statusDevJaulaCheckbox}
                                                            name="DEV_POR_JAULA" 
                                                            onChange={ handleCheckbox }>Dev. Jaula
                                                            </Checkbox>
                                                    :
                                                        <Checkbox name="DEV_POR_JAULA" onChange={ handleCheckbox }>Dev. Jaula</Checkbox>
                                                    }
    
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={8} >
                                                <Form.Item
                                                    label="Pais"
                                                    name="COD_PAIS"
                                                    labelCol={{span:18}}
                                                    wrapperCol={{span:6}}
                                                    >
                                                    <Input
                                                        name="COD_PAIS"
                                                        id="requerido"
                                                        style={{padding:'0px 0px 0px 5px',textTransform:'uppercase'}}
                                                        onKeyDown={handleFocus}
                                                        onChange={handleInputChange}
                                                        ref={inputCodPaisFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={16}>
                                                <Form.Item
                                                    name="DESC_PAIS"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input
                                                        name="DESC_PAIS"
                                                        disabled={stateNuevo}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Departamento"
                                                    name="COD_PROVINCIA"
                                                    labelCol={{span:18}}
                                                    wrapperCol={{span:6}}
                                                    >
                                                    <Input
                                                        name="COD_PROVINCIA"
                                                        id="requerido"
                                                        style={{padding:'0px 0px 0px 5px'}}
                                                        onChange={handleInputChange}
                                                        ref={inputCodProvinciaFocus}
                                                        onKeyPress={validarCapo}
                                                        onKeyDown={handleFocus}
                                                        autoComplete="off"
                                                        size="small"
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={16}>
                                                <Form.Item
                                                    name="DESC_PROVINCIA"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input
                                                        name="DESC_PROVINCIA"
                                                        disabled={stateNuevo}
                                                        />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={8} >
                                                <Form.Item
                                                    label="Ciudad"
                                                    name="COD_CIUDAD"
                                                    labelCol={{span:18}}
                                                    wrapperCol={{span:18}}
                                                    >
                                                    <Input
                                                        name="COD_CIUDAD"
                                                        id="requerido"
                                                        style={{padding:'0px 0px 0px 5px'}}
                                                        onKeyPress={validarCapo}
                                                        onKeyDown={handleFocus}
                                                        onBlur={handleFocus}
                                                        ref={inputCodCiudadFocus}
                                                        onChange={handleInputChange}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    label=""
                                                    name="DESC_CIUDAD"
                                                    wrapperCol={{span:24}}
                                                    >
                                                    <Input
                                                        name="DESC_CIUDAD"
                                                        disabled={stateNuevo}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Ciudad RRHH"
                                                    name="CIUDAD_SUC_RRHH"
                                                    labelCol={{span:11}}
                                                    wrapperCol={{span:13}}
                                                    >
                                                    <Input
                                                        name="CIUDAD_SUC_RRHH"
                                                        onChange={handleInputChange}
                                                        ref={inputRRHHCiudadFocus}
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Cod. Postal"
                                                    name="CODIGO_POSTAL"
                                                    labelCol={{span:12}}
                                                    wrapperCol={{span:12}}>
                                                    <Input
                                                        name="CODIGO_POSTAL"
                                                        onChange={handleInputChange}
                                                        ref={inputCodPostalFocus}
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Tel. RRHH"
                                                    name="TELEFONO_RRHH"
                                                    labelCol={{span:7}}
                                                    wrapperCol={{span:17}}
                                                    >
                                                    <Input
                                                        name="TELEFONO_RRHH"
                                                        onChange={handleInputChange}
                                                        ref={inputTelRRHHFocus}
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={14}>
                                                <Form.Item
                                                    label="Nro. Registro"
                                                    name="NRO_REGISTRO"
                                                    labelCol={{span:10}}
                                                    wrapperCol={{span:13.3}}
                                                    >
                                                    <Input
                                                        name="NRO_REGISTRO"
                                                        onChange={handleInputChange}
                                                        ref={inputNroRegistroFocus}
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item
                                                    label="Nro. Patronal"
                                                    name="NRO_PATRONAL"
                                                    labelCol={{span:11}}
                                                    wrapperCol={{span:13}}
                                                    >
                                                    <Input
                                                        name="NRO_PATRONAL"
                                                        onChange={handleInputChange}
                                                        ref={inputNroPatronalFocus}
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Direccion RRHH"
                                            name="DETALLE_DIR_RRHH"
                                            labelCol={{span:6}}
                                            wrapperCol={{span:18}}
                                            >
                                            <Input
                                                name="DETALLE_DIR_RRHH"
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                                ref={inputDireRRHHFocus}
                                                />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Main.Paper>
                </div>
            </Main.Layout>
        </>
    )
}

export default Sucursal;