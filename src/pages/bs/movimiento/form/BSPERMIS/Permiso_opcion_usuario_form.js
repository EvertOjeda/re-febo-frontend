import React,{ useEffect, useState, useRef} from 'react';
import Main                                 from '../../../../../components/utils/Main';
import View                                 from './view/Permiso_opcion_usuario_form.jsx';
// * BUSCADORES
const url_buscar_usuario   = '/bs/permisosOpcionesUsuarios/buscar/usuario';
const url_buscar_forma     = '/bs/permisosOpcionesUsuarios/buscar/forma';
const url_buscar_parametro = '/bs/permisosOpcionesUsuarios/buscar/parametro';
// * VALIDADORES
const url_valida_usuario   = '/bs/permisosOpcionesUsuarios/valida/usuario';
const url_valida_forma     = '/bs/permisosOpcionesUsuarios/valida/forma';
const url_valida_parametro = '/bs/permisosOpcionesUsuarios/valida/parametro';
const UsuarioColumna = [
    { ID: 'COD_USUARIO' , label: 'Codigo'            , width: 100 },
    { ID: 'NOMBRE'      , label: 'Nombre y Apellido'              },
    { ID: 'NRO_CI'      , label: 'C.I'               , width:  60 },
];
const FormaColumna = [
    { ID: 'NOM_FORMA'   , label: 'Codigo'            , width: 200 },
    { ID: 'DESCRIPCION' , label: 'Descripcion'                    },
];
const ParametroColumna = [
    { ID: 'PARAMETRO'      , label: 'Codigo'         , width: 200 },
    { ID: 'DESCRIPCION'    , label: 'Descripcion'                 },
];
const dirr     = "/bs/permisosOpcionesUsuarios";
const url_base = '/bs/permisosOpcionesUsuarios/' + sessionStorage.getItem('cod_empresa');
const Form = ({ history, location, match}) => {
    var ArrayData           = new Array;
    // const buttonNameRef     = useRef();
    const { params: { id }} = match;

    const buttonExitRef = useRef();
    const buttonSaveRef = useRef();

    Main.useHotkeys(Main.Volver, (e) =>{
        e.preventDefault();
        buttonExitRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click(); 
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    //State Modal
    const [modalTitle       , setModalTitle     ] = useState('');
    const [searchData       , setSearchData     ] = useState({});
    const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    //useState  Array
    const [estadoCheckbox] = useState(ArrayData);
    const [parametro              , setParametro                ] = useState([]);
    const [auxData                , setAuxData                  ] = useState([]);
    const [opcion                 , setOpcion                   ] = useState([]);
    const [searchColumns          , setSearchColumns            ] = useState({});
    const [isNew                  , setIsNew                    ] = useState(false);
    const [stateNuevo             , setStateNuevo               ] = useState(false);
    const [shows                  , setShows                    ] = useState(false);
    // const [setPermisoCheckbox     , permisoCheckbox             ] = useState(true);
    const [mensaje                , setMensaje                  ] = useState();
    const [imagen                 , setImagen                   ] = useState();
    const [tituloModal            , setTituloModal              ] = useState();
    const [visibleMensaje         , setVisibleMensaje           ] = useState(false);
    const [isNewInput             , setIsNewInput               ] = useState(true);
    // ADMINISTRAR FOCUS
    const [ codUsuarioFocus       , setCodUsuarioFocus          ] = Main.UseFocus();
    const [ nomFormaFocus         , setNomFormaFocus            ] = Main.UseFocus();
    const [ parametroFocus        , setParametroFocus           ] = Main.UseFocus(); 
    const [ permisoFocus          , setPermisoFocus             ] = Main.UseFocus();
    useEffect(()=>{
        if(id === 'nuevo'){
            setParametro({
                ['COD_EMPRESA'] : sessionStorage.getItem('cod_empresa'),
                ['TIPO']        : 'I',
                ['USERNAME']    : sessionStorage.getItem('cod_usuario'),
                ['PERMISO']     : 'S'
            });
            setAuxData({
                ['COD_EMPRESA'] : sessionStorage.getItem('cod_empresa'),
                ['TIPO']        : 'I',
                ['USERNAME']    : sessionStorage.getItem('cod_usuario'),
                ['PERMISO']     : 'S'
            });
            setIsNew(false);
            setIsNewInput(false);
        }else{
            Init();
        }
        setStateNuevo(true);
        setTimeout(setCodUsuarioFocus,100);
    },[]);
    const Init = async() =>{
        try {
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setParametro( await setDefault(location.state.rows, 'U'));
                setAuxData( await setDefault(location.state.rows, 'U'));
            }
        } catch (error) {
            console.log(error);
        }
    }
    const setDefault = (data, tipo) => {
        return {
            ...data,
            ['COD_EMPRESA'] : sessionStorage.getItem('cod_empresa'),
            ['TIPO']        : tipo,
            ['USERNAME']    : sessionStorage.getItem('cod_usuario')
        }
    }
    const handleCheckbox = (e) => {
        if(e.target.name === 'PERMISO' ){
            setParametro({
                ...parametro,
                ['PERMISO']: e.target.checked ? 'S' : 'N'
            })
        }
    }
    const handleFocus = async (e) =>{ 
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if(e.target.name == 'COD_USUARIO'){
                Main.validar(setParametro, parametro,showModalMensaje, url_valida_usuario,e.target.name,"DESC_USUARIO",e.target.value,setNomFormaFocus,"p_desc_usuario", {[e.target.name]:e.target.value});
            }
            if(e.target.name == 'NOM_FORMA'){
                Main.validar(setParametro, parametro,showModalMensaje, url_valida_forma,e.target.name,"DESC_FORMA",e.target.value,setParametroFocus,"p_desc_forma",{[e.target.name]:e.target.value});
            }
            if(e.target.name == 'PARAMETRO'){
                Main.validar(setParametro, parametro,showModalMensaje, url_valida_parametro,e.target.name,"DESC_PARAMETRO",e.target.value,setPermisoFocus,"p_desc_parametro", {'NOM_FORMA':parametro.NOM_FORMA,[e.target.name]:e.target.value});
            }
        } 
        if(e.which === 120){
            e.preventDefault();
            setTipoDeBusqueda(e.target.name);
            if(e.target.name === 'COD_USUARIO'){
                var aux = await Main.getInfo(url_buscar_usuario,'POST',{"valor":"null"});
                setSearchColumns(UsuarioColumna);
                setSearchData(aux);
                setModalTitle('Usuarios');
            }
            if(e.target.name === 'NOM_FORMA'){
                var aux = await Main.getInfo(url_buscar_forma,'POST',{"valor":"null"});
                setSearchColumns(FormaColumna);
                setSearchData(aux);
                setModalTitle('Formularios');
            }
            if(e.target.name === 'PARAMETRO'){
                var aux = await Main.getInfo(url_buscar_parametro,'POST',{'NOM_FORMA':parametro.NOM_FORMA,"valor":"null"});
                setSearchColumns(ParametroColumna);
                setSearchData(aux);
                setModalTitle('Parametros');
            }
            setShows(true);
        }
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if( BusquedaPor === 'COD_USUARIO' ){
            setParametro({
                ...parametro,
                ['COD_USUARIO']: datos[0],
                ['DESC_USUARIO']: datos[1],
            });
            setTimeout( setNomFormaFocus , 100 );
        }
        if( BusquedaPor === 'NOM_FORMA' ){
            setParametro({
                ...parametro,
                ['NOM_FORMA']: datos[0],
                ['DESC_FORMA']: datos[1],
            });
            setTimeout( setParametroFocus , 100 );
        }
        if( BusquedaPor === 'PARAMETRO' ){
            setParametro({
                ...parametro,
                ['PARAMETRO']: datos[0],
                ['DESC_PARAMETRO']: datos[1],
            });
            setTimeout( setPermisoFocus , 100 );
        }
        setShows(false);
    }
    const onInteractiveSearch = async(event)=>{
        var valor = event.target.value;
        var url   = '';
        valor = valor.trim();
        if(valor.length == 0 ){
            valor = 'null';
            Main.RefreshBackgroundColor(true)
        }
        if(tipoDeBusqueda === 'COD_USUARIO'){
            url = url_buscar_usuario;
        }
        if(tipoDeBusqueda === 'NOM_FORMA'){
            url = url_buscar_forma;
        }
        if(tipoDeBusqueda === 'PARAMETRO'){
            url = url_buscar_parametro;
        }
        if(valor !== 'null'){
            var method = 'POST';
            var data   = {'valor':valor};
            await Main.Request( url, method, data )
                .then( response => {
                    if( response.status == 200 ){
                        setSearchData(response.data.rows)
                    }
                })
        }
    }
    const onFinish = async() => {
        var url    = url_base;
        var method = 'POST';
        await Main.Request( url, method, parametro )
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push(dirr);
            }else{
                showModalMensaje('ERROR!','error',rows.p_mensaje);
            }
        });
    }
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const handleCancel = () => {
        setVisibleMensaje(false);
    };
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    }
    const direccionar = () =>{
        history.push(dirr);
    }
    return (
        <>
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
                actionAceptar=""/>
            <View
                // PARA EL MENU DEL FORMULARIO
                dirr={dirr}
                arrayAnterior={auxData} 
                arrayActual={parametro} 
                direccionar={direccionar}
                isNew={isNew}
                titleModal={"Atención"}
                mensajeModal={"Los cambios no se han guardados. Desea salir de igual forma?"}
                onFinish={onFinish}
                buttonGuardar={buttonSaveRef}
                buttonVolver={buttonExitRef}
                // PARA EL FORMULARIO
                isNewInput={isNewInput}
                handleFocus={handleFocus}
                handleCheckbox={handleCheckbox}
                codUsuarioFocus={codUsuarioFocus}
                nomFormaFocus={nomFormaFocus}
                parametroFocus={parametroFocus}
                permisoFocus={permisoFocus}
                // ---
                parametro={parametro}
                setParametro={setParametro}/>
        </>
    )
}
export default Form;