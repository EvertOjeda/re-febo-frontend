import React, { useEffect,useState,useRef } from 'react';
import Main from '../../../../../components/utils/Main';
import View from './view/Barrio';
// ! =========================== URLs =============================
// * REDIRECCION A LA VISTA TIPO LISTA
const url_lista           = "/bs/barrio";
// * DIRECCION BASE 
const url_post_base       = '/bs/barrios';
// * BUSCADORES
const url_buscar_pais      = '/bs/barrios/buscar/pais';
const url_buscar_provincia = '/bs/barrios/buscar/provincia';
const url_buscar_ciudad    = '/bs/barrios/buscar/ciudad';
// * VALIDADORES
const url_valida_pais      = '/bs/barrios/valida/pais';
const url_valida_provincia = '/bs/barrios/valida/provincia';
const url_valida_ciudad    = '/bs/barrios/valida/ciudad';
const ColumnPais = [
    { ID: 'COD_PAIS'        , label: 'Código'       , width: 100    },
    { ID: 'DESC_PAIS'       , label: 'Descripción'  , minWidth: 150 },
];
const ColumnProvincia = [
    { ID: 'COD_PROVINCIA'   , label: 'Código'       , width: 100    },
    { ID: 'DESC_DPTO'       , label: 'Descripción'  , minWidth: 150 },
];
const ColumnCiudad = [
    { ID: 'COD_CIUDAD'      , label: 'Código'       , width: 100    },
    { ID: 'DESC_CIUDAD'     , label: 'Descripción'  , minWidth: 150 },
];
const Barrio = ({ history, location, match}) => {
    var cod_empresa = sessionStorage.getItem('cod_empresa');
    var username    = sessionStorage.getItem('username');
    var codPaisAux      = '';
    var codProvinciaAux = '';
    var codCiudadAux    = '';
    var codBarrioAux    = '';
    const { params: { id } } = match;
    
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

    const [modalTitle           , setModalTitle         ] = useState('');
    const [searchData           , setSearchData         ] = useState({});
    const [tipoDeBusqueda       , setTipoDeBusqueda     ] = useState();
    const [parametro            , setParametro             ] = useState({});
    const [auxData              , setAuxData            ] = useState([]);
    const [shows                , setShows              ] = useState(false);
    const [searchColumns        , setSearchColumns      ] = useState({});
    const [mensaje              , setMensaje            ] = useState("");
    const [visible              , setVisible            ] = useState(false);
    const [visibleSave          , setVisibleSave        ] = useState(false);
    const [visibleMensaje       , setVisibleMensaje     ] = useState(false);
    const [isNew                , setIsNew              ] = useState(false);
    const [imagen               , setImagen             ] = useState();
    const [tituloModal          , setTituloModal        ] = useState();
    // ADMINISTRAR FOCUS
    const [ codPaisFocus        , setCodPaisFocus       ] = Main.UseFocus();
    const [ codProvinciaFocus   , setCodProvinciaFocus  ] = Main.UseFocus();
    const [ codCiudadFocus      , setCodCiudadFocus     ] = Main.UseFocus();
    const [ codBarrioFocus      , setCodBarrioFocus     ] = Main.UseFocus();
    const [ descBarrioFocus     , setDescBarrioFocus    ] = Main.UseFocus();
    // 
    const [ editable             , setEditable          ] = useState(false);
    useEffect(()=>{
        if(id === 'nuevo'){
            setParametro( setDefault(parametro, 'I') );
            setAuxData  ( setDefault(parametro, 'I') );
            setEditable(false);
            setCodPaisFocus();
            setIsNew(true);
        }else{
            setCodBarrioFocus();
            setEditable(true);
            Init();
        }
    },[])
    const Init = async() =>{
        try {
            if(location.state === undefined){
                history.push(url_lista);
            }else{
                codBarrioAux = location.state.rows.COD_BARRIO;
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
            ['COD_EMPRESA']    : cod_empresa,
            ['TIPO']           : tipo,
            ['USERNAME']       : username,
            ['COD_BARRIO_ANT'] : codBarrioAux
        }
    }
    const handleFocus = async (e) =>{ 
        if(e.which === 13 || e.which === 9){
            e.preventDefault();
            if(e.target.name == 'COD_PAIS'){
                if(codPaisAux !== e.target.value){
                    Main.validar(setParametro, parametro , showModalMensaje, url_valida_pais, e.target.name,"DESC_PAIS",e.target.value, setCodProvinciaFocus  ,"p_desc_pais", {[e.target.name]:e.target.value})
                    parametro.COD_PROVINCIA = '';
                    parametro.DESC_DPTO     = '';
                    parametro.COD_CIUDAD    = '';
                    parametro.DESC_CIUDAD   = '';
                    codPaisAux = e.target.value;
                }else{
                    setCodProvinciaFocus();
                }
            }
            if(e.target.name == 'COD_PROVINCIA'){
                if(codProvinciaAux != e.target.value){
                    Main.validar(setParametro, parametro , showModalMensaje, url_valida_provincia,e.target.name,"DESC_DPTO",e.target.value, setCodCiudadFocus ,"p_desc_departamento",{'COD_PAIS': parametro.COD_PAIS,[e.target.name]:e.target.value});
                    setParametro({
                        ...parametro,
                        ['COD_CIUDAD']    : '',
                        ['DESC_CIUDAD']   : '',
                    });
                    codProvinciaAux = e.target.value;
                }else{
                    setCodCiudadFocus();
                }
            }
            if(e.target.name == 'COD_CIUDAD'){
                if(codCiudadAux != e.target.value){
                    Main.validar(setParametro, parametro,showModalMensaje, url_valida_ciudad,e.target.name,"DESC_CIUDAD",e.target.value, setCodBarrioFocus ,"p_desc_ciudad", {'COD_PAIS':parametro.COD_PAIS,'COD_PROVINCIA':parametro.COD_PROVINCIA,[e.target.name]:e.target.value});
                    codCiudadAux = e.target.value;
                }else{
                    setCodBarrioFocus();
                }
            }
            if(e.target.name == 'COD_BARRIO'){
                setDescBarrioFocus();
            }
        }
        if(e.which === 120){
            e.preventDefault();
            if(e.target.name === 'COD_PAIS'){
                var aux = await Main.getInfo(url_buscar_pais,'POST',{"valor":"null"});
                setSearchColumns(ColumnPais);
                setSearchData(aux);
                setModalTitle('Paises');
                setTipoDeBusqueda(e.target.name);
                setShows(true);
            }
            if(e.target.name === 'COD_PROVINCIA'){
                var aux = await Main.getInfo(url_buscar_provincia,'POST',{"COD_PAIS":parametro.COD_PAIS,"valor":"null"});
                setSearchColumns(ColumnProvincia);
                setSearchData(aux);
                setModalTitle('Deparamentos');
                setTipoDeBusqueda(e.target.name);
                setShows(true);
            }
            if(e.target.name === 'COD_CIUDAD'){
                var aux = await Main.getInfo(url_buscar_ciudad,'POST',{"COD_PAIS":parametro.COD_PAIS,"COD_PROVINCIA":parametro.COD_PROVINCIA,"valor":"null"});
                setSearchColumns(ColumnCiudad);
                setSearchData(aux);
                setModalTitle('Ciudades');
                setTipoDeBusqueda(e.target.name);
                setShows(true);
            }
        }
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if( BusquedaPor === 'COD_PAIS' ){
            if(parametro.COD_PAIS != datos[0]){
                setParametro({
                    ...parametro,
                    ['COD_PAIS']      : datos[0],
                    ['DESC_PAIS']     : datos[1],
                    ['COD_PROVINCIA'] : '',
                    ['DESC_DPTO']     : '',
                    ['COD_CIUDAD']    : '',
                    ['DESC_CIUDAD']   : '',
                });
            }
            setTimeout( setCodProvinciaFocus , 100);
        }
        if( BusquedaPor === 'COD_PROVINCIA' ){
            if(parametro.COD_PROVINCIA != datos[0]){
                setParametro({
                    ...parametro,
                    ['COD_PROVINCIA'] : datos[0],
                    ['DESC_DPTO']     : datos[1],
                    ['COD_CIUDAD']    : '',
                    ['DESC_CIUDAD']   : '',
                });
            }
            setTimeout( setCodCiudadFocus , 100 );
        }
        if( BusquedaPor === 'COD_CIUDAD' ){
            setParametro({
                ...parametro,
                ['COD_CIUDAD']: datos[0],
                ['DESC_CIUDAD']: datos[1],
            });
            setTimeout( setCodBarrioFocus , 100 );
        }
        setShows(false);
    }
    const onInteractiveSearch = async(event)=>{
        var valor = event.target.value;
        var url   = '';
        var data  = '';
        valor = valor.trim();
        if(valor.length == 0 ){
            valor = 'null';
        }
        if(tipoDeBusqueda === 'COD_PAIS'){
            url  = url_buscar_pais;
            data = {'valor':valor};
        }
        if(tipoDeBusqueda === 'COD_PROVINCIA'){
            url = url_buscar_provincia;
            data = {"COD_PAIS": parametro.COD_PAIS, 'valor':valor};
        }
        if(tipoDeBusqueda === 'COD_CIUDAD'){
            url = url_buscar_ciudad;
            data = {"COD_PAIS": parametro.COD_PAIS, "COD_PROVINCIA": parametro.COD_PROVINCIA, 'valor':valor};
        }
    
        var method = 'POST';
        await Main.Request( url, method, data )
            .then( response => {
                if( response.status == 200 ){
                    setSearchData(response.data.rows)
                }
            })
    }
    const onFinish = async() => {
        var url    = url_post_base;
        var method = 'POST';
        await Main.Request( url, method, parametro )
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    history.push(url_lista);
                }else{
                    showModalMensaje('ERROR!','error',rows.p_mensaje);
                }
            });
    }
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const handleCancel = () => {
        setVisible(false);
        setVisibleSave(false);
        setVisibleMensaje(false);
    };
    const showModalMensaje = (titulo,imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    }
    const direccionar = () =>{
        history.push(url_lista);
    }
    if(id != 'nuevo' && id != 'modificar'){
        return <Main.Redirect to={url_lista}/>
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
                        tipoDeBusqueda={tipoDeBusqueda}/>
                }
                descripcionClose=""
                descripcionButton=""
                actionAceptar=""/>
            <View 
                // PARA EL MENU DEL FORMULARIO
                dirr={url_lista}
                arrayAnterior={auxData} 
                arrayActual={parametro} 
                direccionar={direccionar}
                editable={editable}
                titleModal={"Atención"}
                mensajeModal={"Los cambios no se han guardados. Desea salir de igual forma?"}
                onFinish={onFinish}
                buttonGuardar={buttonSaveRef}
                buttonVolver={buttonExitRef} 
                isNew={isNew}
                // FOCUS
                handleFocus       = {handleFocus}
                codPaisFocus      = {codPaisFocus}
                codProvinciaFocus = {codProvinciaFocus}
                codCiudadFocus    = {codCiudadFocus}
                codBarrioFocus    = {codBarrioFocus}
                descBarrioFocus   = {descBarrioFocus}
                // ---
                parametro={parametro}
                setParametro={setParametro}/>
        </>
    )
}
export default Barrio;