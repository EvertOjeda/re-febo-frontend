import React, { useEffect, useState, useRef } from 'react';
import Layout                                 from "../../../../../components/utils/NewLayout";
import Paper                                  from '@material-ui/core/Paper';
import { ButtonForm, TituloForm }             from '../../../../../components/utils/ContenedorForm/ContainerFrom'
import FormModalSearch                        from "../../../../../components/utils/ModalForm/FormModalSearch";
import TableSearch                            from "../../../../../components/utils/TableSearch/TableSearch";
import { RefreshBackgroundColor }             from '../../../../../components/utils/TableSearch/TableSearch';
import ModalDialogo                           from "../../../../../components/utils/Modal/ModalDialogo";
// import ContenedorText                         from '../../../../components/utils/Fieldset/Fieldset';
import Main                                   from '../../../../../components/utils/Main'
import {
    Form
    , Input
    , Card
    , Row
    , Col
    , Radio
    , Checkbox
} from 'antd';


var defaultOpenKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['BS', 'BS-BS1'];
var defaultSelectedKeys = sessionStorage.getItem("mode") === 'vertical' ? [] : ['BS-BS1-null-BSSUBTRA'];

const UseFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus  = () => { htmlElRef.current && htmlElRef.current.focus() }
    return [htmlElRef, setFocus]
}

const Titulo      = 'Sub-Tipo de Transaccion';
const cod_empresa = sessionStorage.getItem('cod_empresa');
const username    = sessionStorage.getItem('cod_usuario');


const ColumnModulo = [
    { ID: 'COD_MODULO'   , label: 'Cod Modulo'  , width:100       },
    { ID: 'DESC_MODULO'  , label: 'Modulo'      , minWidth: 150   },
];

const ColumnTipoTrans = [
    { ID: 'TIPO_TRANS'       , label: 'Cod tipo transacción' ,  width: 150    ,align:'left'},
    { ID: 'DESC_TIPO_TRANS'  , label: 'Tipo transacción'     ,  minWidth: 150 ,align:'left'},
];


// ! =========================== Modal opcion atras =============================
var titleModal   = "Atención"
var mensajeModal = "Los cambios no se han guardados. Desea salir de igual forma?"

// ! =========================== URLs =============================
//  * REDIRECCION A LA VISTA TIPO LISTA
const url_lista              = "/bs/subtipotrans";

//  * BUSCADORES
const url_buscar_modulo      = '/bs/subtipotrans/buscar/modulo';
//  * VALIDADORES
const url_valida_modulo      = '/bs/subtipotrans/valida/modulo';
//  * BUSCADORES
const url_buscar_tipo_trans  = '/bs/subtipotrans/buscar/tipo_trans';
//  * VALIDADORES
const url_valida_tipo_trans  = '/bs/subtipotrans/valida/tipo_trans';
     
const FormName            = 'BSSUBTRA';
const Subtipos_trans_form = ({ history, location, match }) => {
    
    const { params: { cod_subtipotrans } } = match;

    //  * DIRECCION BASE 
    const url_post_base          = '/bs/subtipotrans/' + sessionStorage.getItem('cod_empresa');
    
    // const buttonNameRef       = useRef();
    const [form]              = Form.useForm();
    var ArrayData             = new Array;

    const buttonSaveRef = useRef();
    const buttonExitRef = useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.Guardar, (e) =>{ 
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    //useState  Array
    const [estadoCheckbox] = useState(ArrayData);
    //useState del moodal
    const [mensaje              , setMensaje               ] = useState();
    const [imagen               , setImagen                ] = useState();
    const [tituloModal          , setTituloModal           ] = useState();
    const [tipoDeBusqueda       , setTipoDeBusqueda        ] = useState();
    const [modalTitle           , setModalTitle            ] = useState('');
    const [searchColumns        , setSearchColumns         ] = useState({});
    const [searchData           , setSearchData            ] = useState({});
    const [visibleMensaje       , setVisibleMensaje        ] = useState(false);
    const [shows                , setShows                 ] = useState(false);
    //State de tipo de sub-tipo de transacción
    const [inputTextModulo          , setInputTextModulo          ] = useState("");
    const [opcionConcepto           , setOpcionConcepto           ] = useState('D');
    const [subTiposTrans            , setSubTipostrans            ] = useState([]);
    const [auxData                  , setAuxData                  ] = useState([]);
    const [modulo                   , setModulo                   ] = useState([]);
    const [tipoTrans                , setTipoTrans                ] = useState([]);
    const [isNew                    , setIsNew                    ] = useState(false);
    const [bloqueoInput             , setBloqueoInput             ] = useState(true);
    const [cargaValoresCheckbox     , setCargaValoresCheckbox     ] = useState(true);
    const [cargaBancoCliCheckbox    , setCargaBancoCliCheckbox    ] = useState(true);
    const [cargaCuentaCliCheckbox   , setCargaCuentaCliCheckbox   ] = useState(true);
    const [cargaDepositoCheckbox    , setCargaDepositoCheckbox    ] = useState(true);
    const [cargaVencCheckbox        , setCargaVencCheckbox        ] = useState(true);
    const [cargaClieCheckbox        , setCargaClieCheckbox        ] = useState(true);
    const [usarDineroCheckbox       , setUsarDineroCheckbox       ] = useState(true);
    const [indTransCheckbox         , setIndTransCheckbox         ] = useState(true);
    const [verificarValCheckbox     , setVerificarValCheckbox     ] = useState(true);
    const [ cargaOtrosCheckbox      , setCargaOtrosCheckbox       ] = useState(true);
    const [ cargaCobradorCheckbox   , setCargaCobradorCheckbox    ] = useState(true);
    const [ indElectCheckbox        , setIndElectCheckbox         ] = useState(true);
    const [ indCancelarCheckbox     , setIndCancelarCheckbox      ] = useState(true);
    // ADMINISTRAR FOCUS
    const [ inputCodModuloFocus     , setInputCodModuloFocus     ] = UseFocus();
    const [ inputSubtipoTransFocus  , setInputSubtipoTransFocus  ] = UseFocus();
    const [ inputDescripcionFocus   , setInputDescripcionFocus   ] = UseFocus();
    const [ inputAbreviaturaFocus   , setInputAbreviaturaFocus   ] = UseFocus();
    const [ inputTipo_transFocus    , setInputTipo_transFocus    ] = UseFocus();
    const [ inputDocumentoFocus     , setInputDocumentoFocus     ] = UseFocus();
    const [ inputCodCuentaFocus     , setInputCodCuentaFocus     ] = UseFocus();
    
    const getModulo = async()=>{   
        try {
            var url    = url_buscar_modulo;
            var method = 'POST';
            var response = await Main.Request( url, method, {"valor":"null"} )
            .then(response => {return response})
                if( response.data.rows.length > 0){
                    setModulo(response.data.rows);
                    return response.data.rows
                }else{
                    return []
                }
        } catch (error) {
            console.log(error);
        }
    }
    const getTipoTrans = async(cod_modulo)=>{   
        try {
            var url    = url_buscar_tipo_trans;
            var method = 'POST';
            var response = await Main.Request( url, method, {"valor":"null",cod_modulo, cod_empresa: sessionStorage.getItem('cod_empresa')} )
            .then(response => {return response})
                if( response.data.rows.length > 0){
                    setTipoTrans(response.data.rows);
                    return response.data.rows
                }else{
                    return []
                }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(cod_subtipotrans === 'nuevo'){
            setSubTipostrans({
                ...subTiposTrans,     
                ['COD_EMPRESA']    : cod_empresa,
                ['TIPO']           : 'I',
                ['CONCEPTO']       : opcionConcepto,
                ['USERNAME']       : username
            });
            setAuxData({
                ...subTiposTrans,     
                ['COD_EMPRESA']    : cod_empresa,
                ['TIPO']           : 'I',
                ['CONCEPTO']       : opcionConcepto,
                ['USERNAME']       : username
            })
            setIsNew(true);
            setBloqueoInput(false)
            document.getElementsByName('COD_MODULO')[0].removeAttribute('disabled')
           setTimeout(()=>setInputSubtipoTransFocus(),50) ;
        }else{
            getTipoCambio();
            setcheckboxDefault();
        }
    },[])
    const getTipoCambio = async() =>{
        try {
            if(location.state === undefined){
                history.push(url_lista);
            }else{
                setSubTipostrans({
                    ...location.state.rows,
                    ['TIPO']                 : 'U',
                    ['COD_EMPRESA']          : cod_empresa,
                    ['USERNAME']             : username,
                })
                setAuxData({
                    ...location.state.rows,
                    ['TIPO']                : 'U',
                    ['COD_EMPRESA']         : cod_empresa,
                    ['USERNAME']            : username,
                })
                setOpcionConcepto(location.state.rows.CONCEPTO)
                setInputTextModulo(location.state.rows.COD_MODULO)
                form.setFieldsValue(location.state.rows);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const onFinish = async (values) => {
        try {
            var url = url_post_base;
            var method = 'POST';
            await Main.Request(url, method, subTiposTrans )
                .then(async (response) => {
                    var rows = response.data;
                    if (rows.ret === 1) {
                        history.push(url_lista);
                    } else {
                        showModalMensaje('ERROR!', 'error', rows.p_mensaje);
                    }
            });
        } catch (error) {
            console.log('Error en el metodo onFinish: ', error);
        }
    }
    const handleInputChange = (event)=>{
        var  valor = ""
        if(event.target.name === 'DESCRIPCION'){
            valor = event.target.value.trim()
        }else{
            valor = event.target.value.toUpperCase().trim()
        }
        setSubTipostrans({
            ...subTiposTrans,
            [event.target.name] : valor
        })        
    }
    const onFinishFailed = (errorInfo) => {
        showModalMensaje('ERROR!','error','Error en el formulario ',errorInfo);
    }
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    };
    const direccionar = () => {
        history.push(url_lista);
    }
    const handleFocus = async (e) => {
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
           if(e.target.name === 'COD_MODULO'){
                let method = 'POST';
                let data = { 'valor': e.target.value.toUpperCase()};
                try {
                    await Main.Request( url_valida_modulo,method, data )
                        .then( response => {
                            if(response.status === 200){
                                if(response.data.outBinds.ret === 1){
                                    setSubTipostrans({
                                        ...subTiposTrans,
                                        ['DESC_MODULO']: response.data.outBinds.p_desc_modulo
                                    })
                                    form.setFieldsValue({
                                        ...form,
                                        ['DESC_MODULO']: response.data.outBinds.p_desc_modulo
                                    })
                                    if(e.target.value.toUpperCase() !==  inputTextModulo){
                                        form.setFieldsValue({
                                            ...form,
                                            ['TIPO_TRANS']        : "",
                                            ['DESC_TIPO_TRANS']  : ""
                                        })                                  
                                    }
                                    setInputTextModulo(e.target.value.toUpperCase())
                                    var auxProvincia = getTipoTrans(e.target.value.toUpperCase())
                                    setSearchData(auxProvincia);
                                    setInputDescripcionFocus()
                                }else{
                                    showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                                }
                            }
                        })
                } catch (error) {
                        console.log('error en metodo validar Pais', error);
                }
           }
           if(e.target.name === 'TIPO_TRANS'){

                let COD_MODULO  =  subTiposTrans.COD_MODULO;
                if(COD_MODULO === "" || COD_MODULO === undefined)
                return showModalMensaje('ERROR!','error','Favor seleccione el codigo modulo');
                var cod_modulo    = subTiposTrans.COD_MODULO.toUpperCase();
                let method = 'POST';
                let data = { 'tipo_trans': e.target.value, cod_modulo, cod_empresa};
                try {
                    await Main.Request(url_valida_tipo_trans,method, data )
                    .then( response => {
                        if(response.status === 200){
                            if(response.data.outBinds.ret === 1){
                                setSubTipostrans({
                                    ...subTiposTrans,
                                    ['DESC_TIPO_TRANS']: response.data.outBinds.p_desc_tipo_trans
                                })
                                form.setFieldsValue({
                                    ...form,
                                    ['DESC_TIPO_TRANS']: response.data.outBinds.p_desc_tipo_trans
                                })
                                setInputDocumentoFocus()
                            }else{
                                showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                            }
                        }
                    })
                } catch (error) {
                    console.log('error en metodo validar Pais', error);
                }
           }
           if(e.target.name === 'SUBTIPO_TRANS'){
                setInputCodModuloFocus()
           }
           if(e.target.name === 'DESCRIPCION'){
                setInputAbreviaturaFocus()
           }
           if(e.target.name === 'ABREVIATURA'){
                setInputTipo_transFocus()
           }
           if(e.target.name === 'TIP_DOCUMENTO'){
            setInputCodCuentaFocus()
        }
           
        }
        if(e.which === 120){
            // && (e.target.name === 'COD_MODULO' || e.target.name === 'TIPO_TRANS')
            e.preventDefault();
            if(e.target.name === 'COD_MODULO'){
                var auxModulo = await getModulo();
                setModalTitle("Modulos")
                setSearchColumns(ColumnModulo)
                setSearchData(auxModulo)
                setTipoDeBusqueda(e.target.name);                
                setShows(true);                
            } else  if(e.target.name === 'TIPO_TRANS'){
                let COD_MODULO  =  subTiposTrans.COD_MODULO;
                if(COD_MODULO  === "" || COD_MODULO === undefined)
                return showModalMensaje('ERROR!','error','Favor seleccione el codigo modulo');
                var auxtipoTrans = await getTipoTrans(COD_MODULO);
                setModalTitle("Tipo Transacción")
                setSearchColumns(ColumnTipoTrans)
                setSearchData(auxtipoTrans)
                setTipoDeBusqueda(e.target.name);                
                setShows(true);
            }
        }
    }
    const handleCancel = () => {
        setVisibleMensaje(false);
    };
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const onInteractiveSearch = async (event) => {
        var url         = '';
        var valor       = event.target.value;
        valor           = valor.trim();
    
        if(valor.length === 0 ){
            valor = null;
            RefreshBackgroundColor(true)
        }

        if( tipoDeBusqueda === 'COD_MODULO' ){
            url = url_buscar_modulo;
            if(valor == null) return setSearchData(modulo);   
        }

        if( tipoDeBusqueda === 'TIPO_TRANS' ){
            url = url_buscar_tipo_trans;
            if(valor == null) return setSearchData(tipoTrans);   
        }

        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor};
            await Main.Request( url, method, data )
                .then( response => {
                    if( response.status == 200 ){
                        if(tipoDeBusqueda === 'COD_MODULO'){
                            setSearchData(response.data.rows)
                        }else if(tipoDeBusqueda === 'TIPO_TRANS'){
                            setSearchData(response.data.rows)
                        }
                    }
                RefreshBackgroundColor(true)
            })
        }
    };
    const modalSetOnClick = async (datos, BusquedaPor) => {

        if(datos !== "" || datos !== undefined){

            if( BusquedaPor === 'COD_MODULO' ){
                setSubTipostrans({
                    ...subTiposTrans,
                    ['COD_MODULO']   : datos[0],
                    ['DESC_MODULO']  : datos[1]
                })
                form.setFieldsValue({
                    ...form,
                    ['COD_MODULO']   : datos[0],
                    ['DESC_MODULO']  : datos[1]
                })
                if(datos[0] !== inputTextModulo){
                    form.setFieldsValue({
                        ...form,
                        ['TIPO_TRANS']      : "",
                        ['DESC_TIPO_TRANS'] : ""
                    })
                }
                setInputTextModulo(datos[0])
                setTimeout(setInputDescripcionFocus, 200);
                showsModal(false)
            }
            if( BusquedaPor === 'TIPO_TRANS' ){
                setSubTipostrans({
                    ...subTiposTrans,
                    ['TIPO_TRANS']   : datos[0],
                    ['DESC_TIPO_TRANS']  : datos[1]
                })
                form.setFieldsValue({
                    ...form,
                    ['TIPO_TRANS']   : datos[0],
                    ['DESC_TIPO_TRANS']  : datos[1]
                })
                setTimeout(setInputDocumentoFocus, 200);
                showsModal(false)
            }
        }
    };
    const validarCampo = (e) =>{
        var key = window.event ? e.which : e.keyCode;
        if (key < 48 || key > 57) {
            e.preventDefault();
        }
    }
    const handleSelecChange = (valor) =>{
        setSubTipostrans({
            ...subTiposTrans,
            ['CONCEPTO']: valor.target.value
        })
        setOpcionConcepto(valor.target.value)
    };
    const setcheckboxDefault = async () => {
        if(location.state !== undefined){
            var CARGA_VALORES        = location.state.rows.CARGA_VALORES; 
            var CARGA_BANCO_CLI      = location.state.rows.CARGA_BANCO_CLI; 
            var CARGA_CUENTA_CLI     = location.state.rows.CARGA_CUENTA_CLI; 
            var CARGA_DEPOSITO       = location.state.rows.CARGA_DEPOSITO; 
            var CARGA_VENC           = location.state.rows.CARGA_VENC; 
            var CARGA_CLIENTE        = location.state.rows.CARGA_CLIENTE;
            var USA_DINERO           = location.state.rows.USA_DINERO;
            var IND_TRANSFERIR       = location.state.rows.IND_TRANSFERIR;
            var VERIFICA_VALORES     = location.state.rows.VERIFICA_VALORES;
            var CARGA_OTROS          = location.state.rows.CARGA_OTROS;
            var CARGA_COBRADOR       = location.state.rows.CARGA_COBRADOR;
            var IND_ELECT            = location.state.rows.IND_ELECT;
            var IND_CANCELA          = location.state.rows.IND_CANCELA;
            
            if(CARGA_VALORES === 'S'){ 
                ArrayData.push('CARGA_VALORES')
            }
            if(CARGA_BANCO_CLI === 'S'){ 
                ArrayData.push('CARGA_BANCO_CLI')
            }
            if(CARGA_CUENTA_CLI === 'S'){ 
                ArrayData.push('CARGA_CUENTA_CLI')
            }
            if(CARGA_DEPOSITO === 'S'){ 
                ArrayData.push('CARGA_DEPOSITO')
            }
            if(CARGA_VENC === 'S'){
                ArrayData.push('CARGA_VENC')
            }
            if(CARGA_CLIENTE === 'S'){
               ArrayData.push('CARGA_CLIENTE')
            }
            if(USA_DINERO === 'S'){
                ArrayData.push('USA_DINERO')
            }
            if(IND_TRANSFERIR === 'S'){
                ArrayData.push('IND_TRANSFERIR')
            }
            if(VERIFICA_VALORES === 'S'){
                ArrayData.push('VERIFICA_VALORES')
            }
            if(CARGA_OTROS === 'S'){
                ArrayData.push('CARGA_OTROS')
            }
            if(CARGA_COBRADOR === 'S'){
                ArrayData.push('CARGA_COBRADOR')
            }
            if(IND_ELECT === 'S'){
                ArrayData.push('IND_ELECT')
            }
            if(IND_CANCELA === 'S'){
                ArrayData.push('IND_CANCELA')
            }
        }
    }
    const handleCheckbox = (e) => {
        if(e.target.name === 'CARGA_VALORES' ){
            setSubTipostrans({
                ...subTiposTrans,
                ['CARGA_VALORES']: e.target.checked ? 'S' : 'N'
            })
            setCargaValoresCheckbox(!cargaValoresCheckbox)
            console.log(subTiposTrans.CARGA_VALORES)
        }else if(e.target.name === 'CARGA_BANCO_CLI'){
            setSubTipostrans({
                ...subTiposTrans,
                ['CARGA_BANCO_CLI']: e.target.checked ? 'S' : 'N'
            })
            setCargaBancoCliCheckbox(!cargaBancoCliCheckbox)
        }else if(e.target.name === 'CARGA_CUENTA_CLI'){
            setSubTipostrans({
                ...subTiposTrans,
                ['CARGA_CUENTA_CLI']: e.target.checked ? 'S' : 'N'
            })
            setCargaCuentaCliCheckbox(!cargaCuentaCliCheckbox)
        }else if(e.target.name === 'CARGA_DEPOSITO'){
            setSubTipostrans({
                ...subTiposTrans,
                ['CARGA_DEPOSITO']: e.target.checked ? 'S' : 'N'
            })
            setCargaDepositoCheckbox(!cargaDepositoCheckbox)
        }else if(e.target.name === 'CARGA_VENC'){
            setSubTipostrans({
                ...subTiposTrans,
                ['CARGA_VENC']: e.target.checked ? 'S' : 'N'
            })
            setCargaVencCheckbox(!cargaVencCheckbox)
        }else if(e.target.name === 'CARGA_CLIENTE'){
            setSubTipostrans({
                ...subTiposTrans,
                ['CARGA_CLIENTE']: e.target.checked ? 'S' : 'N'
            })
            setCargaClieCheckbox(!cargaClieCheckbox)
        }else if(e.target.name === 'USA_DINERO'){
            setSubTipostrans({
                ...subTiposTrans,
                ['USA_DINERO']: e.target.checked ? 'S' : 'N'
            })
            setUsarDineroCheckbox(!usarDineroCheckbox)
        }else if(e.target.name === 'IND_TRANSFERIR'){
            setSubTipostrans({
                ...subTiposTrans,
                ['IND_TRANSFERIR']: e.target.checked ? 'S' : 'N'
            })
            setIndTransCheckbox(!indTransCheckbox)
        }else if(e.target.name === 'VERIFICA_VALORES'){
            setSubTipostrans({
                ...subTiposTrans,
                ['VERIFICA_VALORES']: e.target.checked ? 'S' : 'N'
            })
            setVerificarValCheckbox(!verificarValCheckbox)
        }else if(e.target.name === 'CARGA_OTROS'){
            setSubTipostrans({
                ...subTiposTrans,
                ['CARGA_OTROS']: e.target.checked ? 'S' : 'N'
            })
            setCargaOtrosCheckbox(!cargaOtrosCheckbox)
        }else if(e.target.name === 'CARGA_COBRADOR'){
            setSubTipostrans({
                ...subTiposTrans,
                ['CARGA_COBRADOR']: e.target.checked ? 'S' : 'N'
            })
            setCargaCobradorCheckbox(!cargaCobradorCheckbox)
        }else if(e.target.name === 'IND_ELECT'){
            setSubTipostrans({
                ...subTiposTrans,
                ['IND_ELECT']: e.target.checked ? 'S' : 'N'
            })
            setIndElectCheckbox(!indElectCheckbox)
        }else if(e.target.name === 'IND_CANCELA'){
            setSubTipostrans({
                ...subTiposTrans,
                ['IND_CANCELA']: e.target.checked ? 'S' : 'N'
            })
            setIndCancelarCheckbox(!indCancelarCheckbox)
        }
        console.log(subTiposTrans)
    }

  return (
  <>
    <Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
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
                    <Main.NewTableSearch
                        onInteractiveSearch={onInteractiveSearch}
                        columns={searchColumns}
                        searchData={searchData}
                        modalSetOnClick={modalSetOnClick}
                        tipoDeBusqueda={tipoDeBusqueda}/>

                    // <TableSearch
                    //     onInteractiveSearch={onInteractiveSearch}
                    //     columns={searchColumns}
                    //     dataSource={searchData}
                    //     modalSetOnClick={modalSetOnClick}
                    //     tipoDeBusqueda={tipoDeBusqueda}
                    // />
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
                        dirr={url_lista} 
                        arrayAnterior={auxData} 
                        arrayActual={subTiposTrans} 
                        direccionar={direccionar}
                        isNew={isNew}
                        titleModal={"Atención"}
                        mensajeModal={"Los cambios no se han guardados. Desea salir de igual forma?"}
                        onFinish={onFinish}
                        buttonGuardar={buttonSaveRef}
                        buttonVolver={buttonExitRef}
                        formName={FormName}
                        // visibleDeleteButton={false}
                        // FunctionNameButtonDelete=""
                    />
                    <div className="form-container">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Row gutter={8}>
                                    <Col span={9}>
                                        <Form.Item
                                            label="Operación"
                                            name ="SUBTIPO_TRANS"
                                            labelCol={{span:17}}
                                            wrapperCol={{span:7}}>

                                            <Input
                                                name="SUBTIPO_TRANS"
                                                ref={inputSubtipoTransFocus}
                                                onChange={handleInputChange}
                                                onKeyPress={validarCampo}
                                                onKeyDown={handleFocus}
                                                disabled={bloqueoInput}
                                            />                                        
                                        </Form.Item>                                    
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Módulo"
                                            name ="COD_MODULO"

                                            labelCol={{span:11}}
                                            wrapperCol={{span:13}}>
                                           
                                            <Input
                                            name="COD_MODULO"
                                            id="requerido"
                                            style={{textTransform:'uppercase'}}
                                            ref={inputCodModuloFocus}
                                            onChange={handleInputChange}
                                            onKeyDown={handleFocus}
                                            disabled={bloqueoInput}
                                            />                                        
                                        </Form.Item>
                                    </Col>
                                    <Col span={9}>
                                        <Form.Item
                                            name ="DESC_MODULO"
                                            labelCol={{span:24}}>

                                            <Input
                                            name="DESC_MODULO"
                                            disabled={true}/>                                        
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Form.Item
                                            label="Descripcion"
                                            name ="DESCRIPCION"
                                            labelCol={{span:6}}
                                            wrapperCol={{span:18}}>

                                            <Input
                                                name="DESCRIPCION"
                                                id="requerido"
                                                ref={inputDescripcionFocus}
                                                onKeyDown={handleFocus}
                                                onChange={handleInputChange}
                                            />                                        
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Abreviatura"
                                            name="ABREVIATURA"
                                            labelCol={{span:11}}
                                            wrapperCol={{span:13}}>

                                            <Input
                                                name="ABREVIATURA"
                                                style={{textTransform:'uppercase'}}
                                                onChange={handleInputChange}
                                                ref={inputAbreviaturaFocus}
                                                onKeyDown={handleFocus}
                                            />                                        
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={8}>
                                    <Col span={9}>
                                        <Form.Item
                                            label="Tipo Transacción"
                                            name ="TIPO_TRANS"
                                            labelCol={{span:17}}
                                            wrapperCol={{span:7}}
                                        >

                                            <Input
                                                name="TIPO_TRANS"
                                                id="requerido"
                                                ref={inputTipo_transFocus}
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                                onKeyPress={validarCampo}
                                                disabled={bloqueoInput}
                                            />                                        
                                        </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item
                                            name ="DESC_TIPO_TRANS"
                                            labelCol={{span:24}}>

                                            <Input
                                                name="DESC_TIPO_TRANS"
                                                disabled={true}/>                                        
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Documento"
                                            name ="TIP_DOCUMENTO"
                                            labelCol={{span:12}}
                                            wrapperCol={{span:12}}>

                                            <Input
                                                name="TIP_DOCUMENTO"
                                                style={{textTransform:'uppercase'}}
                                                ref={inputDocumentoFocus}
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                            />                                        
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={8}>
                                    <Col span={11}>
                                        <Form.Item
                                            label="Cuenta Contable"
                                            name ="COD_CUENTA"
                                            labelCol={{span:11}}
                                            wrapperCol={{span:13}}>

                                            <Input
                                                name="COD_CUENTA"
                                                ref={inputCodCuentaFocus}
                                                onChange={handleInputChange}
                                            />                                        
                                        </Form.Item>
                                    </Col>
                                    <Col span={13}>                 
                                        <Form.Item
                                            label="Concepto"
                                            name="CONCEPTO"
                                            labelCol={{span: 6, offset:0} }
                                            wrapperCol={{ span: 18 }}>
                                            <Card style={{textAlign:'center', padding:'0px'}}>
                                                <Radio.Group onChange={handleSelecChange} value={opcionConcepto}>
                                                <Radio value="D">Débito</Radio>
                                                <Radio value="C">Crédito</Radio>
                                                </Radio.Group>
                                            </Card>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Card style={{marginTop:'10px'}}>
                                    <Row>
                                        <Col span={4}>
                                                {estadoCheckbox.includes("CARGA_VALORES") ?
                                                    <Checkbox name="CARGA_VALORES"
                                                        checked={cargaValoresCheckbox}
                                                        onChange={ handleCheckbox }>
                                                        Carga Valores
                                                    </Checkbox>
                                                :
                                                    <Checkbox  name="CARGA_VALORES" onChange={ handleCheckbox }>Carga Valores</Checkbox>
                                                }
                                            </Col>
                                        <Col span={4}>
                                                { estadoCheckbox.includes("CARGA_BANCO_CLI") ?
                                                    <Checkbox name="CARGA_BANCO_CLI"
                                                        checked={cargaBancoCliCheckbox}
                                                        onChange={ handleCheckbox }
                                                        >Carga Banco Cliente
                                                    </Checkbox>
                                                :
                                                    <Checkbox  name="CARGA_BANCO_CLI" onChange={ handleCheckbox }>Carga Banco Cliente</Checkbox>
                                                }
                                            </Col>
                                        <Col span={4}>
                                                { estadoCheckbox.includes("CARGA_CUENTA_CLI") ?
                                                    <Checkbox name="CARGA_CUENTA_CLI"
                                                        checked={cargaCuentaCliCheckbox}
                                                        onChange={ handleCheckbox }
                                                        >Carga Cuenta Cliente
                                                    </Checkbox>
                                                :
                                                    <Checkbox name="CARGA_CUENTA_CLI" onChange={ handleCheckbox } >Carga Cuenta Cliente</Checkbox>
                                                }
                                            </Col>
                                        <Col span={4}>
                                            { estadoCheckbox.includes("CARGA_DEPOSITO") ?
                                                <Checkbox name="CARGA_DEPOSITO"
                                                    checked={cargaDepositoCheckbox}
                                                    onChange={ handleCheckbox }
                                                    >Carga Deposito
                                                </Checkbox>
                                                :
                                                <Checkbox name="CARGA_DEPOSITO" onChange={ handleCheckbox } >Carga Deposito</Checkbox>
                                            }
                                            </Col>
                                        <Col span={4}>
                                                { estadoCheckbox.includes("CARGA_VENC") ?
                                                    <Checkbox name="CARGA_VENC"
                                                        checked={cargaVencCheckbox}
                                                        onChange={ handleCheckbox }
                                                        >Carga Vencimiento
                                                    </Checkbox>
                                                    :
                                                    <Checkbox name="CARGA_VENC" onChange={ handleCheckbox } >Carga Vencimiento</Checkbox>
                                                }
                                            </Col>
                                        <Col span={4}>
                                                { estadoCheckbox.includes("CARGA_CLIENTE") ?
                                                    <Checkbox name="CARGA_CLIENTE" 
                                                        checked={cargaClieCheckbox}
                                                        onChange={ handleCheckbox }
                                                        >Carga Cliente
                                                    </Checkbox>
                                                  :
                                                    <Checkbox name="CARGA_CLIENTE" onChange={ handleCheckbox } >Carga Cliente</Checkbox>
                                                }
                                            </Col>
                                        <Col span={4}>
                                                {  estadoCheckbox.includes("USA_DINERO") ?
                                                    <Checkbox name="USA_DINERO"
                                                        checked={usarDineroCheckbox}
                                                        onChange={ handleCheckbox }
                                                        >Usar Dinero
                                                    </Checkbox>
                                                    :
                                                    <Checkbox name="USA_DINERO" onChange={ handleCheckbox } >Usar Dinero</Checkbox>
                                                }
                                            </Col>
                                        <Col span={4}>
                                                { estadoCheckbox.includes("IND_TRANSFERIR") ?
                                                    <Checkbox name="IND_TRANSFERIR"
                                                        checked={indTransCheckbox}
                                                        onChange={ handleCheckbox }
                                                        >Transferir Valores
                                                    </Checkbox>
                                                    :
                                                    <Checkbox name="IND_TRANSFERIR" onChange={ handleCheckbox } >Transferir Valores</Checkbox>
                                                }
                                            </Col>
                                        <Col span={4}>
                                                { estadoCheckbox.includes("VERIFICA_VALORES") ?
                                                    <Checkbox name="VERIFICA_VALORES"
                                                        checked={verificarValCheckbox}
                                                        onChange={ handleCheckbox }
                                                        >Transferir Valores
                                                    </Checkbox>                                                    
                                                    :
                                                    <Checkbox name="VERIFICA_VALORES" onChange={ handleCheckbox } >Verifica Valores</Checkbox>
                                                }
                                                
                                            </Col>
                                        <Col span={4}>
                                                {
                                                    estadoCheckbox.includes("CARGA_OTROS") ?
                                                    <Checkbox name="CARGA_OTROS" 
                                                        checked={cargaOtrosCheckbox}
                                                        onChange={ handleCheckbox } 
                                                        >Carga Otros Datos
                                                    </Checkbox>
                                                    :
                                                    <Checkbox name="CARGA_OTROS" onChange={ handleCheckbox } >Carga Otros Datos</Checkbox>
                                                }
                                            </Col>
                                        <Col span={4}>
                                                { estadoCheckbox.includes("CARGA_COBRADOR") ?
                                                    <Checkbox name="CARGA_COBRADOR"
                                                        checked={cargaCobradorCheckbox}
                                                        onChange={ handleCheckbox }
                                                        >Carga Cobrador
                                                    </Checkbox>
                                                    :
                                                    <Checkbox name="CARGA_COBRADOR" onChange={ handleCheckbox } >Carga Cobrador</Checkbox>
                                                }
                                                
                                            </Col>
                                        <Col span={4}>
                                                {   estadoCheckbox.includes("IND_ELECT") ?
                                                    <Checkbox name="IND_ELECT"
                                                    checked={indElectCheckbox}
                                                    onChange={ handleCheckbox }                                                    
                                                    >Pago Electronico</Checkbox>
                                                    :
                                                    <Checkbox name="IND_ELECT" onChange={ handleCheckbox } >Pago Electronico</Checkbox>
                                                }
                                                
                                            </Col>
                                        <Col span={4}>
                                                {   estadoCheckbox.includes("IND_CANCELA") ?
                                                    <Checkbox name="IND_CANCELA"
                                                    checked={indCancelarCheckbox}
                                                    onChange={ handleCheckbox }                                               
                                                    >Cancelar Saldo</Checkbox>
                                                    :
                                                    <Checkbox  name="IND_CANCELA" onChange={ handleCheckbox } >Cancelar Saldo</Checkbox>
                                                }
                                            </Col>
                                    </Row>
                                </Card>
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
export default Subtipos_trans_form;