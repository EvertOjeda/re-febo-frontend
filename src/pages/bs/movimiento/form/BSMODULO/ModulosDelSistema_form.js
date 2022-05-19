import React, { useEffect, useState, useRef }       from "react";
import { Redirect }                                 from 'react-router-dom';
import Paper 							            from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}                      from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import { Request }                                  from "../../../../../config/request";
import FormModalSearch                              from "../../../../../components/utils/ModalForm/FormModalSearch";
import NewTableSearch                               from "../../../../../components/utils/NewTableSearch/NewTableSearch";
import Layout                                       from "../../../../../components/utils/NewLayout";
import ModalDialogo                                 from "../../../../../components/utils/Modal/ModalDialogo";
import Tabla   ,{RefreshBackgroundColorTabla}       from "./Tabla/Tabla";
import Subtabla,{RefreshBackgroundColorSubtabla}    from "./SubTabla/Subtabla";
import Main from "../../../../../components/utils/Main";
import {Form
    ,   Input
    ,   Checkbox
    ,   Row
    ,   Card
    ,   Col
} from 'antd';

// import { useHotkeys } from 'react-hotkeys-hook';
// import { AddIcon } from "@material-ui/data-grid"; 
import { PlusCircleOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { IconButton } from "@material-ui/core";
import './Styles/styles.css'
const valoresCheck  = ['S','N'];
const Titulo        = 'Módulos del sistema';

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const searchsColumns = [
    { ID: 'CODIGO'        , label: 'Código'      , width: 100     ,textAlign:"left"  },
    { ID: 'DESCRIPCION'   , label: 'Descripción' , minWidth: 150  ,textAlign:"left"  },
];
const menuColumns = [
    { ID: 'COD_TIPO'   , label: 'Codigo'     , align: 'left'  , alignID: 'left'  , minWidth:  50 , width: 50 , type:'number', disabled:true  },
    { ID: 'DESCRIPCION', label: 'Descripción', align: 'left'  , alignID: 'left'  , minWidth: 150 , width:800 , type:'text'  , disabled:true  },
    { ID: 'ORDEN'      , label: 'Orden'      , align: 'left'  , alignID: 'left'  , minWidth:  50 , width: 50 , type:'number', disabled:false },
    { ID: 'ACCION'     , label: ' '          , align: 'center', alignID: 'center', minWidth:  20 , width: 20        },
];
const etiquetaColumns = [
    { ID: 'COD_DESC'   , label: 'Codigo'     , align: 'right' , alignID: 'right' , minWidth:  50 , width: 50 , type:'number', disabled:true  },
    { ID: 'DESCRIPCION', label: 'Descripción', align: 'left'  , alignID: 'left'  , minWidth: 150 , width:800 , type:'text'  , disabled:false },
    { ID: 'ORDEN'      , label: 'Orden'      , align: 'right' , alignID: 'right' , minWidth:  50 , width: 50 , type:'number', disabled:false },
    { ID: 'ACCION'     , label: ' '          , align: 'center', alignID: 'center', minWidth:  80 , width: 80 , type:''       },
];

var codTipoAux = [];

var idMenu = '';
var indexMenu = 0;
var idEtiqueta = '';
var indexEtiqueta = 0;
const defaultOpenKeys     = ['BS','BS-BS2','BS-BS2-BS21'];
const defaultSelectedKeys = ['BS-BS2-BS21-BSMODULO'];
const FormName            = 'BSMODULO';
const Modulo = ({ history, location, match}) =>{
    const subtabla      = React.createRef();
    const username      = sessionStorage.getItem("cod_usuario");
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
    //dialogos
    const [visible          , setVisible]               = useState(false);
    const [positiveButton   , setPositiveButton]        = useState();
    const [positiveAction   , setPositiveAction]        = useState();
    const [negativeButton   , setNegativeButton]        = useState();
    const [negativeAction   , setNegativeAction]        = useState();
    const [imagen           , setImagen]                = useState();

    const [modulo           , setModulo             ] = useState({}); 
    const [state            , setState              ] = useState(false);
    const [auxData          , setAuxData            ] = useState({});  
    const [mensaje          , setMensaje            ] = useState();
    const [icono            , setIcono              ] = useState();
    const [visibleMensaje   , setVisibleMensaje     ] = useState(false);
    const [isNew            , setIsNew              ] = useState(false);
    const [tituloModal      , setTituloModal        ] = useState();
    const [tituloEtiqueta   , setTituloEtiqueta     ] = useState();
    const [menu             , setMenu               ] = useState([]);
    const [etiqueta         , setEtiqueta           ] = useState([]);
    const [menuFoco         , setMenuFoco           ] = useState([]);
    const [etiquetaFoco     , setEtiquetaFoco       ] = useState([]);
    const [menuDelete       , setMenuDelete         ] = useState([]);
    const [etiquetaDelete   , setEtiquetaDelete     ] = useState([]);
    const [tipo             , setTipo               ] = useState({});
    const [searchType       , setSearchType         ] = useState('');
    const [searchColumns    , setSearchColumns      ] = useState({});
    const [searchData       , setSearchData         ] = useState({});
    const [modalTitle       , setModalTitle         ] = useState('');
    const [shows            , setShows              ] = useState(false);
    const [tipoDeBusqueda   , setTipoDeBusqueda     ] = useState();
    const [indexEtiquetaTecl, setIndexEtiquetaTecl  ] = useState(0);
    const [indexMenuTecl    , setIndexMenuTecl      ] = useState(0);

    const dirr  = "/bs/modulo";

    // ADMINISTRAR FOCUS
    const [codModuloFocus           , setCodModuloFocus             ] = UseFocus();
    const [descripcionFocus         , setDescripcionFocus           ] = UseFocus();
    const [ordenFocus               , setOrdenFocus                 ] = UseFocus();
    const [activoFocus              , setActivoFocus                ] = UseFocus();
    
    const { params: { id } } = match;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    useEffect(()=>{
        if(id == 'nuevo'){
            setState(false);
            setModulo(valoresNuevo());
            setAuxData(valoresNuevo());
            form.setFieldsValue(valoresNuevo());
            setTimeout(setCodModuloFocus,150);
            setIsNew(true);
            setTituloEtiqueta("");
            codTipoAux[0]='';
        }else{
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setState(true);
                setIsNew(false);
                getData();
                setTimeout(setDescripcionFocus, 150);
            }
        }
        getTipo();
    },[]);
    const getData = async() =>{
        try {
            setModulo(valores());
            setAuxData(valores());
            form.setFieldsValue(valores());
            getEtiqueta(location.state.rows.COD_MODULO,'1');
            modulo.MENU = menu;
            auxData.MENU = menu;
            if(!tituloEtiqueta){setTituloEtiqueta("")}
        } catch (error) {
            console.log(error);
        }
    };
    const valores = () => {
        getMenu();
        return {
            ...location.state.rows,
            ['TIPO']: 'U',
            ['COD_EMPRESA']: sessionStorage.getItem('cod_empresa'),
            ['USERNAME']   : sessionStorage.getItem('cod_usuario'),
            ['MENU']       : menu,
        }
    };
    const valoresNuevo = () => {
        return {
            ['TIPO']                : 'I',
            ['ACTIVO']              : 'S',
            ['COD_EMPRESA']         : sessionStorage.getItem('cod_empresa'),
            ['USERNAME']            : sessionStorage.getItem('cod_usuario'),
            ['MENU']       : [],
        }
    };
    const getMenu = async() =>{
        try {
            var url     = '/bs/modulos/buscar/menu';
            var method  = 'POST';
            await Request(url,method,{valor:location.state.rows.COD_MODULO} ).then(response => {
                if( response.data.rows.length > 0){
                    setTituloEtiqueta(response.data.rows[0]['COD_TIPO'] + ' - ' + response.data.rows[0]['DESCRIPCION']);
                    var t = agregarFocoMenu(response.data.rows);
                    getEtiquetas(t);
                }
                return response.data.rows;
            })
        } catch (error) {
            console.log(error);
        }
    };
    const getTipo = async() =>{
        try {
            var url     = '/bs/modulos/buscar/tipo';
            var method  = 'POST';
            await Request(url,method,{valor:'null'} ).then(response => {
                if( response.data.rows.length > 0){
                    setTipo(response.data.rows);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };
    const getEtiqueta = async(cod_modulo,cod_tipo) =>{
        try {
            var url     = '/bs/modulos/buscar/etiqueta';
            var method  = 'POST';
            await Request(url,method,{valor:cod_tipo,'cod_modulo':cod_modulo} ).then(response => {
                if( response.data.rows.length > 0){
                    agregarFocoEtiqueta(response.data.rows);
                    setEtiqueta(response.data.rows);
                } else {
                    setEtiqueta([]);
                }
            })
        } catch (error) {
            console.log(error);
            setEtiqueta([]);
        }
    };
    const agregarFocoMenu = (dato) => {
        for(var i in dato){
            for(var j in dato[i]){
                if(j != 'ID' && j != 'COD_MODULO' && j != 'COD_TIPO_ANT' && j != 'TIPO' && j != 'ETIQUETAS'){
                    menuFoco[i] = {...menuFoco[i],[j]:React.createRef()};
                }
            }
        }
        return dato;
    };
    const agregarFocoEtiqueta = (dato) => {
        for(var i in dato){
            for(var j in dato[i]){
                if(j != 'ID' && j != 'COD_MODULO' && j != 'COD_TIPO' && j != 'TIPO' && j != 'COD_DESC_ANT'){
                    etiquetaFoco[i] = {...etiquetaFoco[i],[j]:React.createRef()};
                }
            }
        }
        return dato;
    };
    const getEtiquetas = async(datos) =>{
        try {
            var url     = '/bs/modulos/buscar/etiqueta';
            var method  = 'POST';
            for(var i in datos){
                await Request(url,method,{valor:datos[i].COD_TIPO,'cod_modulo':datos[i].COD_MODULO} ).then(response => {
                    if( response.data.rows.length > 0){
                        codTipoAux[i]=datos[i].COD_TIPO;
                        agregarFocoEtiqueta(response.data.rows);
                        datos[i]['ETIQUETAS'] = response.data.rows;
                    } else {
                        datos[i]['ETIQUETAS'] = [];
                        codTipoAux[i]=0;
                        return [];
                    }
                })
            }
            setMenu(datos);
            modulo.MENU = menu;
            auxData.MENU = menu;
            return datos;
        } catch (error) {
            console.log(error);
            return [];
        }
    };
    const handleInputChange = (event)=>{
        setModulo({
            ...modulo,
            [event.target.name] : event.target.value.toUpperCase(),
        });
        form.setFieldsValue({
            ...modulo,
            [event.target.name] : event.target.value.toUpperCase(),
        });
    };
    const marcarCheck = (event) => {
        var estado = valoresCheck;
        if(event.target.checked){
            setModulo({
                ...modulo,
                [event.target.name] : estado[0],
            });
        } else {
            setModulo({
                ...modulo,
                [event.target.name] : estado[1],
            });
        }
    };
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'COD_MODULO'){
                setDescripcionFocus();
            }
            if(e.target.name == 'DESCRIPCION'){
                setOrdenFocus();
            }
            if(e.target.name == 'ORDEN'){
                setActivoFocus();
            }
            if(e.target.name == 'ACTIVO'){
                if (menu.length>0) {
                    if (menu[0]['DISABLED']) {
                        menuFoco[0]['ORDEN'].current.focus();
                    } else {
                        menuFoco[0]['COD_TIPO'].current.focus();
                    }
                    setIdMenu(0)
                } else {
                    handleAddMenu();
                }
            }
        }
    };
    const handleFocusMenu = (e) => {
        var key = e.which;
        callmodal(e);
        const name = e.target.name.split('-')[0];
        if( key == 13 || key == 9){
            e.preventDefault();
            indexMenu = e.target.name.split('-')[1];
            if (name == 'ORDEN') {
                if(indexMenu != menu.length){
                    if(menu[indexMenu]['DISABLED']){
                        menuFoco[indexMenu]['ORDEN'].current.focus();
                    } else {
                        menuFoco[indexMenu]['COD_TIPO'].current.focus();
                    } 
                    setIdMenu(indexMenu);
                } else {
                    setIdMenu(indexMenu-1);
                    if (etiqueta.length>0) {
                        if (etiqueta[0]['DISABLED']) {
                            etiquetaFoco[0]['DESCRIPCION'].current.focus();
                        } else {
                            etiquetaFoco[0]['COD_DESC'].current.focus();
                        }
                        setIdEtiqueta(0);
                    } else {
                        handleAddEtiqueta();
                    }
                }
            } else {
                indexMenu = e.target.name.split('-')[1] - 1;
                if (name == 'COD_TIPO') {
                    menuFoco[indexMenu]['ORDEN'].current.focus();
                    setIdMenu(indexMenu);
                }
                if (name == 'DESCRIPCION') {
                    menuFoco[indexMenu]['ORDEN'].current.focus();
                    setIdMenu(indexMenu);
                }
            }
        }
        if( key == 38 || key == 40){
            e.preventDefault();
            indexMenu = e.target.name.split('-')[1];
            if (key == 40) {
                if(indexMenu >= menu.length){
                    setIdMenu(indexMenu-1);
                    return;
                } else {
                    setIdMenu(indexMenu);
                }
            }
            if (key == 38) {
                if((indexMenu-2) < 0) {
                    return;
                } else {
                    setIdMenu(indexMenu - 2);
                }
            }
            menuFoco[indexMenu][name].current.focus();
        }
    };
    const handleFocusEtiqueta = (e) => {
        var key = e.which;
        var name = ''; 
        if(e.target.name){
            name = e.target.name.split('-')[0];
        } else {
            name = e.target.id.split('-')[0];
        }
        if( key == 13 || key == 9){
            e.preventDefault();
            indexEtiqueta = e.target.name.split('-')[1];
            if(name !== 'subtabla'){
                if (name == 'ORDEN') {
                    if(indexEtiqueta != etiqueta.length){
                        if (etiqueta[indexEtiqueta]['DISABLED']) {
                            etiquetaFoco[indexEtiqueta]['DESCRIPCION'].current.focus();
                        } else {
                            etiquetaFoco[indexEtiqueta]['COD_DESC'].current.focus();
                        }
                        setIdEtiqueta(indexEtiqueta);
                    } else {
                        handleAddEtiqueta();
                        setTimeout(() => {
                            setIdEtiqueta(indexEtiqueta);
                            etiquetaFoco[indexEtiqueta]['COD_DESC'].current.focus();
                        }, 1);
                    }
                } else {
                    indexEtiqueta = e.target.name.split('-')[1] - 1;
                    if (name == 'COD_DESC') {
                        etiquetaFoco[indexEtiqueta]['DESCRIPCION'].current.focus();
                    }
                    if (name == 'DESCRIPCION') {
                        etiquetaFoco[indexEtiqueta]['ORDEN'].current.focus();
                    }
                }
            }
        }
        if( key == 38 || key == 40){
            e.preventDefault();
            if(e.target.name){
                indexEtiqueta = e.target.name.split('-')[1];
            } else {
                indexEtiqueta = parseInt(e.target.id.split('-')[1]) + 1;
            }
            if (key == 40) {
                if(indexEtiqueta == etiqueta.length){
                    indexEtiqueta = indexEtiqueta - 1;
                    RefreshBackgroundColorSubtabla(etiqueta,indexEtiqueta);
                    return;
                } else {
                    // setIdEtiqueta(indexEtiqueta);
                    RefreshBackgroundColorSubtabla(etiqueta,indexEtiqueta);
                }
            }
            if (key == 38) {
                if((indexEtiqueta-2) < 0){
                    indexEtiqueta = 0;
                    RefreshBackgroundColorSubtabla(etiqueta,indexEtiqueta);
                    // setIdEtiqueta(indexEtiqueta - 1);
                    return;
                } else {
                    indexEtiqueta=indexEtiqueta-2;
                    RefreshBackgroundColorSubtabla(etiqueta,indexEtiqueta);
                    // setIdEtiqueta(indexEtiqueta - 2);
                }
            }
            if(name !== 'subtabla'){
                etiquetaFoco[indexEtiqueta][name].current.focus();
            }
        }
    };
    const pintarEtiqueta = () => {
        RefreshBackgroundColorSubtabla(etiqueta,indexEtiqueta);
    }
    const onFinish = async() => {
        if(!validarCamposDeCodigo()){
            return;
        }
        modulo.MENU = '';
        modulo.MENUS = todosLosMenus();
        modulo.ETIQUETAS = todasLasEtiquetas();
        var url    = `/bs/modulos`;
        var method = 'POST';
        try{
            await Request( url, method, modulo )
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    history.push(dirr);
                }else{
                    if(rows.ret == 0){
                        showModalMensaje("Atención!","alerta",response.data.p_mensaje);
                    } else {
                        showModalMensaje("Error!","error",response.data.p_mensaje);
                    }
                }
            });
        } catch (error) {
            showModalMensaje("Error!","error",error);
        }
    };
    const todosLosMenus = () => {
        var datos = [];
        var cont = 0;
        for (var i in menu) {
            datos[cont] = menu[i];
            cont = cont +1;
        }
        for (var i in menuDelete){
            datos[cont] = menuDelete[i];
            cont = cont +1;
        }
        return datos;
    };
    const todasLasEtiquetas = () => {
        var datos = [];
        var cont = 0;
        for (var i in menu) {
            for (var j in menu[i].ETIQUETAS) {
                datos[cont] = menu[i].ETIQUETAS[j];
                cont = cont + 1;
            }
        }
        for (var i in etiquetaDelete){
            datos[cont] = etiquetaDelete[i];
            cont = cont +1;
        }
        return datos;
    };
    const onFinishFailed = (errorInfo) => {
        showModalMensaje("Error!","error",errorInfo);
    };
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const modalSetOnClick = async (datos, BusquedaPor) => {
        const name = BusquedaPor.split('-')[0];
        var indexAux = 0;
        if (BusquedaPor.split('-').length>1){
            indexAux = BusquedaPor.split('-')[1]-1;
        }
        if(datos !== "" || datos !== undefined){
            var url   = '';
            var valor = ''

            if( name === 'COD_TIPO' ){
                url = '/bs/modulos/valida/tipo';
                valor = datos[0];
            }
            await Request( url, 'POST', {'valor':valor} )
                .then( response =>{
                    if(response.status == 200){
                        if( response.data.outBinds.ret == 1 ){
                            if( name == 'COD_TIPO' ){
                                menu[indexAux][name] = valor;
                                menu[indexAux]['DESCRIPCION'] = response.data.outBinds.descripcion;
                                menu[indexAux]['ORDEN'] = response.data.outBinds.orden;
                                setMenu(menu.filter((item) => ( item.ID != idMenu)));
                            }
                        }else{
                            if( name == 'COD_TIPO' ){
                                menu[indexAux][name] = '';
                                menu[indexAux]['DESCRIPCION'] = '';
                                menu[indexAux]['ORDEN'] = '';
                                setMenu(menu.filter((item) => ( item.ID != idMenu)));
                                getEtiqueta(modulo.COD_MODULO,'');
                            }
                            showModalMensaje('Atención!','alerta',response.data.outBinds.mensaje);
                        }
                    }
                showsModal(false)
             })
        }
    };
    const callmodal = async(e) =>{
        const name = e.target.name.split('-')[0];
        var indexAux = 0;
        if (e.target.name.split('-').length>1){
            indexAux = e.target.name.split('-')[1]-1;
        }
        var url   = '';
        setSearchType(name);
        setSearchColumns(searchsColumns);
        if( name == 'COD_TIPO'){
            url = '/bs/modulos/buscar/tipo';
            setSearchData(tipo);
            setModalTitle('Tipo de menu');
        }
        var key = e.which;
        if( key == 120 ){
            setTipoDeBusqueda(e.target.name);
            e.preventDefault();
            setShows(true);
        }
        if(e.target.value !== undefined && e.target.value !== ''){
            if( key == 13 || key == 9 || e.type == 'blur'){
                e.preventDefault();
                if( name == 'COD_TIPO' ){
                    url = '/bs/modulos/valida/tipo';
                }
                var method = 'POST';
                var data   = {'valor':e.target.value,'cod_modulo':modulo.COD_MODULO};
                if (name != 'COD_TIPO') {
                    return;
                }
                await Request( url, method, data )
                    .then( response =>{
                        if(response.status == 200){
                            if( response.data.outBinds.ret == 1 ){
                                if( name == 'COD_TIPO' ){
                                    if(e.target.value != codTipoAux[indexAux]){
                                        menu[indexAux][name] = e.target.value.toUpperCase();
                                        menu[indexAux]['DESCRIPCION'] = response.data.outBinds.descripcion;
                                        menu[indexAux]['ORDEN'] = response.data.outBinds.orden;
                                        setMenu(menu.filter((item) => ( item.ID != idMenu)));
                                        if (e.type != 'blur') {
                                            setEtiqueta(menu[indexAux].ETIQUETAS);
                                        }
                                        codTipoAux[indexAux] = e.target.value;
                                    }
                                }
                            }else{
                                if( name == 'COD_TIPO' ){
                                    menu[indexAux][name] = e.target.value.toUpperCase();
                                    menu[indexAux]['DESCRIPCION'] = '';
                                    menu[indexAux]['ORDEN'] = '';
                                    setMenu(menu.filter((item) => ( item.ID != idMenu)));
                                    showModalMensaje('¡Atención!','alerta','El módulo no corresponde o no existe.');
                                }
                            }
                        }
                })
            }
        }
    };
    const onInteractiveSearch = async(event)=> {
        var url = '';
        var valor = event.target.value;
        valor = valor.trim();

        if(valor.length == 0 ){
            valor = null;
        }

        if(searchType == 'COD_TIPO'){
            url = '/bs/modulos/buscar/tipo';
            if(valor === null){
                setSearchData(tipo);
            }
        }

        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor,'cod_modulo':modulo.COD_MODULO};
            await Request( url, method, data ).then( response => {
                if( response.status == 200 ){
                    setSearchData(response.data.rows);
                }
            })
        }
    };
    const [form] = Form.useForm();
    const handleCancel = () => {
        setVisibleMensaje(false);
        setVisible(false);
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
    const menuNuevo = (cont) => {
        return {
                ['COD_TIPO']:'',
                ['TIPO']:'I',
                ['DESCRIPCION']:'',
                ['ORDEN']:'',
                ['COD_MODULO']:modulo.COD_MODULO,
                ['ID']:'nuevo-'+cont,
                ['ETIQUETAS']:[],
            }
    };
    const menuFocoNuevo = () => {
        return {
            ['COD_TIPO']:React.createRef(),
            ['DESCRIPCION']:React.createRef(),
            ['ORDEN']:React.createRef(),
        }
    }
    const etiquetaNueva = (cont) => {
        return {
                ['COD_MODULO']:modulo.COD_MODULO,
                ['TIPO']:'I',
                ['COD_TIPO']:menu[indexMenu].COD_TIPO,
                ['COD_DESC']:'',
                ['DESCRIPCION']:'',
                ['ORDEN']:'',
                ['ID']:'nuevo-'+cont
            }
    };
    const etiquetaFocoNuevo = () => {
        return {
            ['COD_DESC']:React.createRef(),
            ['DESCRIPCION']:React.createRef(),
            ['ORDEN']:React.createRef(),
            ['subtabla']:React.createRef(),
        }
    }
    const handleAddMenu = () => {
        if (!modulo.COD_MODULO) {
            showModalMensaje('Atención!','alerta',"Debe cargar el código del módulo para continuar.");
            return;
        }
		var cont = menu.length;
        if (!cont) {
            menu[0] = menuNuevo(0);
            menuFoco[0] = menuFocoNuevo();
        } else {
            menu[cont] = menuNuevo(cont);
            menuFoco[menuFoco.length] = menuFocoNuevo();
        }
        codTipoAux[codTipoAux.length] = '';
        setMenu(menu.filter((item) => ( item.ID != '')));
        modulo.MENU = menu;
	};
    const handleAddEtiqueta = () => {
        
        if (!modulo.COD_MODULO) {
            showModalMensaje('Atención!','alerta',"Debe cargar el código del módulo para continuar.");
            return;
        }
        if (!menu.length) {
            showModalMensaje('Atención!','alerta',"Debe cargar al menos un menu para continuar.");
            return;
        }
        if (menu[indexMenu].COD_TIPO == '') {
            showModalMensaje('Atención!','alerta',"No se ha cargado el codigo del menu.");
            return;
        }
        if (!etiqueta) {
            etiqueta[0] = etiquetaNueva(0);
            etiquetaFoco[0] = etiquetaFocoNuevo();
        } else {
            etiqueta[etiqueta.length] = etiquetaNueva(etiqueta.length);
            etiquetaFoco[etiquetaFoco.length] = etiquetaFocoNuevo();
        }
        setEtiqueta(etiqueta.filter((item) => ( item.ID != '')));
        setEtiquetaFoco(etiquetaFoco.filter((item) => ( item != '')));
        menu[indexMenu].ETIQUETAS=etiqueta;
        modulo.MENU = menu;
	};
    const showDeleteModalMenu = (e)=> {
        var id = e.currentTarget.id;
        idMenu = id.split("_")[1];
        showModal("alerta","¡Atención!","¿Estas seguro de eliminar?","SI",()=>handleDeleteMenu,"NO",()=>handleCancel)
        setVisible(true);
    };
    const showDeleteModalEtiqueta = (e)=> {
        var id = e.currentTarget.id;
        idEtiqueta = id.split("_")[1];
        showModal("alerta","¡Atención!","¿Estas seguro de eliminar?","SI",()=>handleDeleteEtiqueta,"NO",()=>handleCancel)
        setVisible(true);
    };
    const showModal = (imagen,tituloModal,mensaje,positiveButton,positiveAction,negativeButton, negativeAction) => {
        setImagen(imagen);
        setTituloModal(tituloModal);
        setMensaje(mensaje);
        setPositiveButton(positiveButton);
        setPositiveAction(positiveAction);
        setNegativeButton(negativeButton);
        setNegativeAction(negativeAction);
        setVisible(true);
    };
    const handleDeleteMenu = async() => {
        handleCancel();
        var data = menu.filter((item) => ( item.ID == idMenu ));
        var columnas     = await auditoriaColumnas(data[0]);
        var datos_viejos = await auditoriaValores(data[0]);
        data[0]['COLUMNAS']         = columnas; //await auditoriaColumnas(data[0]);
        data[0]['DATOS_VIEJOS']     = datos_viejos; //await auditoriaValores(data[0]);
        data[0]['TIPO']             = 'D'; 
        data[0]['USERNAME']         = username;
        if(data[0].COD_TIPO_ANT){
            if(menuDelete){
                menuDelete[menuDelete.length] = data[0];
            } else {
                menuDelete[0] = data[0];
            }
        }
        if (menu[indexMenu].ETIQUETAS) {
            for(var i in menu[indexMenu].ETIQUETAS){
                idEtiqueta = menu[indexMenu].ETIQUETAS[i].ID;
                handleDeleteEtiqueta();
            }
            idEtiqueta = '';
        }
        modulo.MENU = menu.filter((item) => ( item.ID != idMenu ));
        setMenu(menu.filter((item) => ( item.ID != idMenu )));
        setTimeout(actualizarEtiqueta2,150);
        setEtiqueta(etiqueta.filter((item) => ( item.TIPO != idMenu )));
        todosLosMenus();
        todasLasEtiquetas();
    };
    const handleDeleteEtiqueta = async() => {
        handleCancel();
        var data = menu[indexMenu].ETIQUETAS.filter((item) => ( item.ID == idEtiqueta));
        var columnas     = await auditoriaColumnas(data[0]);
        var datos_viejos = await auditoriaValores(data[0]);
        data[0]['COLUMNAS']         = columnas; //await auditoriaColumnas(data[0]);
        data[0]['DATOS_VIEJOS']     = datos_viejos; //await auditoriaValores(data[0]);
        data[0]['TIPO']             = 'D'; 
        data[0]['USERNAME']         = username;
        if (data[0].COD_DESC_ANT){
            if(etiquetaDelete){
                etiquetaDelete[etiquetaDelete.length] = data[0];
            } else {
                etiquetaDelete[0] = data[0];
            }
        }
        handleCancel();
        menu[indexMenu].ETIQUETAS = etiqueta.filter((item) => ( item.ID != idEtiqueta ));
        setEtiqueta(etiqueta.filter((item) => ( item.ID != idEtiqueta )));
        setEtiquetaFoco(etiquetaFoco.filter((item) => ( item.ID != idEtiqueta )));
        modulo.MENU = menu;
        todasLasEtiquetas();
    };
    const actualizarEtiqueta1 = () => {
        if(indexMenu > menu.length || indexMenu == menu.length){
            indexMenu = indexMenu - 1
        }
        setEtiqueta(menu[indexMenu]['ETIQUETAS']);
    };
    const actualizarEtiqueta = () => {
        setEtiqueta(etiqueta.filter((item) => ( item.ID != '' )));
    };
    const actualizarEtiqueta2 = () => {
        setEtiqueta(etiqueta.filter((item) => ( item.ID == '' )));
    };
    const validarCamposDeCodigo = () => {
        var validacion = etiqueta.filter((item) => item.COD_DESC == '');
        if(validacion.length>0){
            showModalMensaje('Atención!','alerta','El campo del código es obligatorio en las etiquetas.')
            return false;
        }
        validacion = menu.filter((item) => item.COD_TIPO == '');
        if(validacion.length>0){
            showModalMensaje('Atención!','alerta','El campo del código es obligatorio en los menus.')
            return false;
        }
        validacion = menu.filter((item) => item.DESCRIPCION == '');
        if(validacion.length>0){
            showModalMensaje('Atención!','alerta','El el código del menu no fue validado.')
            return false;
        }
        validacion = menu.filter((item) => item.ORDEN == '');
        if(validacion.length>0){
            showModalMensaje('Atención!','alerta','El el código del menu no fue validado.')
            return false;
        }
        for(var i in menu){
            validacion = menu.filter((item) => item.COD_TIPO == menu[i]['COD_TIPO']);
            if (validacion) {
                if (validacion.length>1) {
                    showModalMensaje('Atención!','alerta','Ha ingresado codigos de menu repetidos. Verifique y vuelva a intentar.')
                    return false;
                }
            }
        }
        for(var i in menu){
            for(var j in menu[i].ETIQUETAS){
                if(menu[i].ETIQUETAS){
                    validacion = menu[i].ETIQUETAS.filter((item) => item.COD_TIPO == menu[i]['COD_TIPO'] && 
                                                                    item.COD_DESC == menu[i].ETIQUETAS[j]['COD_DESC']);
                    if (validacion) {
                        if (validacion.length>1) {
                            showModalMensaje('Atención!','alerta','Ha ingresado codigos de etiquetas repetidos. Verifique y vuelva a intentar.')
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
    const setIdMenu = (id) => {
        if(id == menu.length){
            return;
        }
        indexMenu = id;
        if (!modulo.MENU[indexMenu]){
            modulo.MENU = menu;
        }
        try{
            setTimeout(actualizarEtiqueta1,50);
        } catch (e) {
            getEtiqueta('','');
        }
        if (etiqueta) {
            setTimeout(actualizarEtiqueta,40);
        } else {
            getEtiqueta('','');
        }
        setTituloEtiqueta(menu[indexMenu]['COD_TIPO'] + ' - ' + menu[indexMenu]['DESCRIPCION']);

        RefreshBackgroundColorTabla(menu,indexMenu);
    };
    const setIdEtiqueta = (id) => {
        // if(id == 0){
        //     console.log(subtabla)
        // }
        indexEtiqueta = id;
        setEtiqueta(menu[indexMenu].ETIQUETAS);
        setEtiqueta(etiqueta.filter((item) => item.ID != ''));
        RefreshBackgroundColorSubtabla(etiqueta,indexEtiqueta);
    };
    const auditoriaValores = async(data) =>{
        var datos_viejos = "";
        for(var i in data)
            if(i != 'ID' && i != 'TIPO'){    
                datos_viejos += data[i] + "| ";
            }
        return datos_viejos.substring(0,datos_viejos.length - 2);
    };
    const auditoriaColumnas = async(data) =>{
        var result = "";
        for(var i in data)
            if(i != 'ID' && i != 'TIPO'){  
                result += i + "| ";
            }
        return result.substring(0,result.length - 2);
    };
    const handleOnChacgeMenu = (e) => {
        if(!e.nativeEvent.inputType){
            return;
        }
		indexMenu = e.target.name.split('-')[1] - 1;
		const name = e.target.name.split('-')[0];
        if((e.target.name.split('-')[2] !== 'true') ){
            menu[indexMenu][name]=e.target.value;
            setModulo({...modulo,['MENU']:menu});
        }
        setMenu(menu.filter((item) => ( item.ID != '###')));
	}
    const handleOnChacgeEtiqueta = (e) => {
        if(!e.nativeEvent.inputType){
            return;
        }
		indexEtiqueta = e.target.name.split('-')[1] - 1;
		const name = e.target.name.split('-')[0];
        if((e.target.name.split('-')[2] !== 'true') ){
            etiqueta[indexEtiqueta][name]=e.target.value;
            menu[indexMenu]['ETIQUETAS'][indexEtiqueta][name]=e.target.value;
            modulo.MENU = menu;
            setModulo({...modulo,['MENU']:menu});
        }
        setEtiqueta(etiqueta.filter((item)=>(item.ID!='')));
	}
    return (
        <Layout defaultOpenKeys={defaultOpenKeys}
                defaultSelectedKeys={defaultSelectedKeys}
                >
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
                positiveButton={positiveButton}
                negativeButton={negativeButton}
                positiveAction={positiveAction}
                negativeAction={negativeAction}
                onClose={handleCancel}
                setShow={visible}
                title={tituloModal}
                mensaje={mensaje}
                imagen={imagen}
                />
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
                        arrayActual={modulo} 
                        direccionar={cerrar}
                        isNew={isNew}
                        onFinish={onFinish}
                        buttonGuardar={buttonSaveRef}
                        buttonVolver={buttonExitRef}
                        formName={FormName}
                        />
                        <div className="form-container">
                            <Card style={{paddingTop:"8px", margin:"1px"}}>
                                <Row gutter={[8]}>
                                    <Col span={5}>
                                        <Form.Item  
                                            label="Código"
                                            name="COD_MODULO"
                                            type="text"
                                            onChange={handleInputChange}
                                            // rules={[{ required: true, message: 'Campo obligatorio' }]}
                                        >
                                            <Input 
                                                name="COD_MODULO"
                                                id="requerido"
                                                disabled={state}
                                                type="text"
                                                className="search_input"
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                                onBlur={callmodal}
                                                ref={codModuloFocus}
                                                />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item  
                                                label="Descripción"
                                                name="DESCRIPCION"
                                                type="text"
                                                onChange={handleInputChange}
                                                // rules={[{ required: true, message: 'Campo obligatorio' }]}
                                        >
                                            <Input 
                                                name="DESCRIPCION"
                                                id="requerido"
                                                type="text"
                                                className="search_input"
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                                ref={descripcionFocus}
                                                />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item  
                                                label="Orden"
                                                name="ORDEN"
                                                type="text"
                                                onChange={handleInputChange}
                                                // rules={[{ required: true, message: 'Campo obligatorio' }]}
                                        >
                                            <Input 
                                                name="ORDEN"
                                                id="requerido"
                                                type="number"
                                                className="search_input"
                                                onChange={handleInputChange}
                                                onKeyDown={handleFocus}
                                                ref={ordenFocus}
                                                />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5} >
                                        <Form.Item
                                            label={"Estado"} >
                                            <Card style={{height:"23px", backgroundColor:"#22000020", paddingLeft:"0px"}} onClick={marcarCheck}> 
                                                <Checkbox
                                                        name="ACTIVO"
                                                        type="checkbox"
                                                        ref={activoFocus}
                                                        checked={modulo.ACTIVO == 'S'}
                                                        onChange={marcarCheck}
                                                        style={{marginTop:"0px"}}
                                                        onKeyDown={handleFocus}
                                                    >
                                                    {modulo.ACTIVO == 'S' ? "Activo" : "Inactivo"}
                                                </Checkbox>
                                            </Card>   
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                            <Card   size="small" 
                                    type="inner"
                                    id="headerCard"
                                    title={<Text>Menu</Text>} style={{paddingTop:"0px", margin:"5px",height:"230px"}}
                                    extra={<IconButton 
                                        className="paper-header-menu-button"
                                        onClick={handleAddMenu}
                                        style={{background:"green"}}
                                    >
                                        {/* <AddIcon fontSize="small"/> */}
                                        <PlusCircleOutlined />
                                    </IconButton>}>
                                <Tabla 
                                    data   ={menu}
                                    foco   ={menuFoco}
                                    columns={menuColumns}
                                    columnID="ID"
                                    idACCION="ACCION"
                                    handleAdd={handleAddMenu}
                                    eliminar={showDeleteModalMenu}
                                    setId={setIdMenu}
                                    handleFocus={handleFocusMenu}
                                    handleOnChacge={handleOnChacgeMenu}
                                    indexTec={indexMenuTecl}
                                    setIndexTec={setIndexMenuTecl}
                                    />
                            </Card>
                            <Card size="small"
                                    type="inner"
                                    id="headerCard"
                                    title={<Text>{"Etiquetas: "+tituloEtiqueta}</Text>} 
                                    style={{paddingTop:"0px", margin:"5px", height:"230px"}}
                                    extra={<IconButton 
                                        className="paper-header-menu-button"
                                        onClick={handleAddEtiqueta}
                                        style={{background:"green"}}
                                    >
                                        {/* <AddIcon fontSize="small" /> */}
                                        <PlusCircleOutlined />
                                    </IconButton>}>
                                <Subtabla 
                                    data   ={etiqueta}
                                    foco   ={etiquetaFoco}
                                    columns={etiquetaColumns}
                                    ref    ={subtabla}
                                    columnID="ID"
                                    idACCION="ACCION"
                                    handleAdd={handleAddEtiqueta}
                                    eliminar={showDeleteModalEtiqueta}
                                    setId={setIdEtiqueta}
                                    handleOnChacge={handleOnChacgeEtiqueta}
                                    handleFocus={handleFocusEtiqueta}
                                    indexTec={indexEtiquetaTecl}
                                    setIndexTec={setIndexEtiquetaTecl}
                                    />
                            </Card>
                        </div>
                        
                    </Form>
                </Paper>
            </div>
        </Layout>
    );
}
export default Modulo;