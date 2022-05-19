import React, { useEffect, useState, useRef }   from "react";
import { Redirect, Link }                       from 'react-router-dom';
import Paper 							        from '@material-ui/core/Paper';
import {ButtonForm,TituloForm}                  from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import { Request}                               from "../../../../../config/request";
import Layout                                   from "../../../../../components/utils/NewLayout";
import FormModalSearch                          from "../../../../../components/utils/ModalForm/FormModalSearch";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import Main                                     from "../../../../../components/utils/Main";
import {
        Form
    ,   Input
    ,   Row
    ,   Col
} from 'antd';
const Titulo        = 'Ciudad';
const paisColumns = [
    { ID: 'COD_PAIS'        , label: 'Codigo'           , width: 100    },
    { ID: 'DESC_PAIS'       , label: 'Descripción'      , minWidth: 150 },
];
const departamentoColumns = [
    { ID: 'COD_PROVINCIA'       , label: 'Codigo'        , width: 80     },
    { ID: 'DESC_DEPARTAMENTO'   , label: 'Descripcion'   ,minWidth: 150  },
];
const zonaColumns = [
    { ID: 'COD_ZONA'            , label: 'Codigo'        , width:80       },
    { ID: 'DESC_ZONA'           , label: 'Descripcion'   , minWidth: 150  },
];
const frecuenciaColumns = [
    { ID: 'FRECUENCIA'          , label: 'Codigo'        , width: 80      },
    { ID: 'DESC_FRECUENCIA'     , label: 'Descripcion'   , minWidth: 150  },
];
const valoresEstado       = ['S','N']
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName            = 'BSCIUDAD';
const Ciudad = ({ history, location, match}) =>{
    
    const [form] = Form.useForm();
    const dirr  = "/bs/ciudad";
    
    const showsModal = async (valor) => {
        setShows(valor);
        setSearchInput('');
    };

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

    const [ciudad           , setCiudad         ] = useState({}); 
    const [searchColumns    , setSearchColumns  ] = useState({});
    const [searchData       , setSearchData     ] = useState({});
    const [pais             , setPais           ] = useState({});
    const [departamento     , setDepartamento   ] = useState({});
    const [zona             , setZona           ] = useState({});
    const [frecuencia       , setFrecuencia     ] = useState({});
    const [state            , setState          ] = useState(false);
    const [auxData          , setAuxData        ] = useState({});  
    const [shows            , setShows          ] = useState(false);
    const [tipoDeBusqueda   , setTipoDeBusqueda ] = useState();
    const [mensaje          , setMensaje        ] = useState();
    const [imagen           , setImagen         ] = useState();
    const [tituloModal      , setTituloModal    ] = useState();
    const [visibleMensaje   , setVisibleMensaje ] = useState(false);
    const [isNew            , setIsNew          ] = useState(false);
    const [searchType       , setSearchType     ] = useState('');
    const [modalTitle       , setModalTitle     ] = useState('');
    const [searchInput      , setSearchInput    ] = useState('');
    const [codPaisAux       , setCodPaisAux     ] = useState('');
    // ADMINISTRAR FOCUS
    const [searchInputFocus         , setSearchInputFocus           ] = UseFocus();
    const [codCiudadFocus           , setCodCiudadFocus             ] = UseFocus();
    const [descripcionFocus         , setDescripcionFocus           ] = UseFocus();
    const [abreviaturaFocus         , setAbreviaturaFocus           ] = UseFocus();
    const [codPaisFocus             , setCodPaisFocus               ] = UseFocus();
    const [codProvinciaFocus        , setCodProvinciaFocus          ] = UseFocus();
    const [codZonaFocus             , setCodZonaFocus               ] = UseFocus();
    const [frecuenciaFocus          , setFrecuenciaFocus            ] = UseFocus();
    const [indTarCredFocus          , setIndTarCredFocus            ] = UseFocus();
    const { params: { cod_ciudad } } = match;
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(()=>{
        getFrecuencia();
        if(cod_ciudad == 'nuevo'){
            setState(false);
            setCiudad({...ciudad,['TIPO']       : 'I',
                                 ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                                 ['USERNAME']   :sessionStorage.getItem('cod_usuario'),});
            setAuxData({...auxData,['TIPO']     : 'I',
                                 ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                                 ['USERNAME']   :sessionStorage.getItem('cod_usuario'),});
            setCodCiudadFocus();
            setIsNew(true);
        }else{
            if(location.state === undefined){
                history.push(dirr);
            }else{
                setState(true);
                getData();
            }
        }
    },[])
    const getData = async() =>{
        try {
            setCiudad({...location.state.rows,['TIPO']       :'U',
                                              ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                                              ['USERNAME']   :sessionStorage.getItem('cod_usuario'),})
            setAuxData({...location.state.rows,['TIPO']      :'U',
                                              ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                                              ['USERNAME']   :sessionStorage.getItem('cod_usuario'),})
            form.setFieldsValue(location.state.rows);
            setCodPaisAux(location.state.rows['COD_PAIS']);
            setAbreviaturaFocus();
        } catch (error) {
            console.log(error);
        }
    }
    const getPais = async() =>{
        var auxData = []
        try {
            var url     = '/bs/ciudades/buscar/pais';
            var method  = 'POST';
            auxData     = await Request(url,method,{valor:'null'} )
                .then(response => {
                    if( response.data.rows.length > 0){
                        setPais(response.data.rows);
                        return response.data.rows;
                    }
                })
            return auxData;
        } catch (error) {
            console.log(error);
        }
    }
    const getDepartamento = async() =>{
        var auxData = []        
        try {
            var url     = '/bs/ciudades/buscar/departamento';
            var method  = 'POST';
            auxData     = await Request(url,method,{valor:'null',cod_pais:ciudad.COD_PAIS} ).then(response => {
                if( response.data.rows.length > 0){
                    setDepartamento(response.data.rows);
                    return response.data.rows;
                }
            })
            return auxData
        } catch (error) {
            console.log(error);
        }
    }
    const getZona = async() =>{
        var auxData = []
        try {
            var url     = '/bs/ciudades/buscar/zona';
            var method  = 'POST';
            auxData     = await Request(url,method,{valor:'null'}).then(response => {
                if( response.data.rows.length > 0){
                    setZona(response.data.rows);
                    return response.data.rows
                }
            })
            return auxData;
        } catch (error) {
            console.log(error);
        }
    }
    const getFrecuencia = async() =>{
        var auxData= []
        try {
            var url     = '/bs/ciudades/buscar/frecuencia';
            var method  = 'POST';
            auxData     = await Request(url,method,{valor:'null'} ).then(response => {
                if( response.data.rows.length > 0){
                    setFrecuencia(response.data.rows);
                    return response.data.rows;
                }
            })
            return auxData;
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        if(event.target.name == 'COD_PAIS'){
            setCiudad({...ciudad,
                [event.target.name] : event.target.value.toUpperCase(),
            });
            form.setFieldsValue({...ciudad,
                ['COD_PAIS'] : event.target.value.toUpperCase(),
            });
            return;
        }
        setCiudad({
            ...ciudad,
            [event.target.name] : event.target.value,
        });
        form.setFieldsValue({...ciudad,
            [event.target.name] : event.target.value,
        });
    }
    const marcarCheck = (event) => {
        if(event.target.checked){
            setCiudad({
                ...ciudad,
                [event.target.name] : valoresEstado[0],
            });
        } else {
            setCiudad({
                ...ciudad,
                [event.target.name] : valoresEstado[1],
            });
        }
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'COD_CIUDAD'){
                setAbreviaturaFocus();
            }
            if(e.target.name == 'ABREVIATURA'){
                setDescripcionFocus();
            }
            if(e.target.name == 'DESCRIPCION'){
                if (state) {
                    setCodZonaFocus();
                } else {
                    setCodPaisFocus();
                }
            }
            if(e.target.name == 'COD_PAIS'){
                setCodProvinciaFocus();
            }
            if(e.target.name == 'COD_PROVINCIA'){
                setCodZonaFocus();
            }
            if(e.target.name == 'COD_ZONA'){
                setFrecuenciaFocus();
            }
            if(e.target.name == 'FRECUENCIA'){
                setIndTarCredFocus();
            }   
        }
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {

        if(datos !== "" || datos !== undefined){
            var url   = '';
            var valor = ''

            if( BusquedaPor === 'COD_PAIS' ){
                url = '/bs/ciudades/valida/pais';
                valor = datos[0];
            }
            if( BusquedaPor === 'COD_PROVINCIA' ){
                url = '/bs/ciudades/valida/departamento';
                valor = datos[0];
            }
            if( BusquedaPor === 'COD_ZONA' ){
                url = '/bs/ciudades/valida/zona';
                valor = datos[0];
            }
            if( BusquedaPor === 'FRECUENCIA' ){
                url = '/bs/ciudades/valida/frecuencia';
                valor = datos[0];
            }
            var method = 'POST';
            var data   = {'valor':valor,'cod_pais':ciudad.COD_PAIS};
            await Request( url, method, data )
                .then( response =>{
                    if(response.status == 200){
                        if( response.data.outBinds.ret == 1 ){
                            if( BusquedaPor == 'COD_PAIS' ){
                                if(valor.toUpperCase() != codPaisAux.toUpperCase()){
                                    setCiudad({
                                        ...ciudad,
                                        ['DESC_PAIS'] : response.data.outBinds.desc_pais,
                                        ['COD_PAIS']: valor,
                                        ['COD_PROVINCIA']: '',
                                        ['DESC_DEPARTAMENTO']:'',
                                    });
                                    form.setFieldsValue({
                                        ...ciudad,
                                        ['DESC_PAIS'] : response.data.outBinds.desc_pais,
                                        ['COD_PAIS']: valor,
                                        ['COD_PROVINCIA']: '',
                                        ['DESC_DEPARTAMENTO']:'',
                                    });
                                    setCodPaisAux(valor.toUpperCase());
                                }
                                setTimeout( setCodProvinciaFocus, 300 );
                            }
                            if( BusquedaPor == 'COD_PROVINCIA' ){
                                setCiudad({...ciudad,
                                        ['COD_PROVINCIA']: valor,
                                        ['DESC_DEPARTAMENTO']: response.data.outBinds.desc_departamento,
                                    });
                                form.setFieldsValue({...ciudad,
                                        ['COD_PROVINCIA']: valor,
                                        ['DESC_DEPARTAMENTO']: response.data.outBinds.desc_departamento,
                                    });
                                    
                                setTimeout( setCodZonaFocus, 300 ) 
                            }
                            if( BusquedaPor == 'COD_ZONA' ){
                                setCiudad({...ciudad,
                                        ['COD_ZONA']: valor,
                                        ['DESC_ZONA']: response.data.outBinds.desc_zona,
                                    });
                                form.setFieldsValue({...ciudad,
                                        ['COD_ZONA']: valor,
                                        ['DESC_ZONA']: response.data.outBinds.desc_zona,
                                    });
                                setTimeout( setFrecuenciaFocus, 300 ) 
                            }
                            if( BusquedaPor == 'FRECUENCIA' ){
                                setCiudad({...ciudad,
                                        ['FRECUENCIA']: valor,
                                        ['DESC_FRECUENCIA']: response.data.outBinds.desc_frecuencia,
                                    });
                                form.setFieldsValue({...ciudad,
                                        ['FRECUENCIA']: valor,
                                        ['DESC_FRECUENCIA']: response.data.outBinds.desc_frecuencia,
                                    });
                                    setTimeout( setIndTarCredFocus, 300 ) 
                            }
                        }else{
                            if( BusquedaPor == 'COD_PAIS' ){
                                setCiudad({
                                    ...ciudad,
                                    ['DESC_PAIS'] : '',
                                    ['COD_PAIS']: ''
                                });
                                form.setFieldsValue({
                                    ...ciudad,
                                    ['DESC_PAIS'] : '',
                                    ['COD_PAIS']: ''
                                });
                            }
                            if( BusquedaPor == 'COD_PROVINCIA' ){
                                setPais({
                                    ...departamento,
                                    ['COD_PROVINCIA']   : '',
                                    ['DESC_DEPARTAMENTO']  : '',
                                });
                                
                                form.setFieldsValue({
                                    ...departamento,
                                    ['COD_PROVINCIA']   : '',
                                    ['DESC_DEPARTAMENTO']  : '',
                                });
                            }
                            if( BusquedaPor == 'COD_ZONA' ){
                                setPais({
                                    ...zona,
                                    ['COD_ZONA']   : '',
                                    ['DESC_ZONA']  : '',
                                });
                                form.setFieldsValue({
                                    ...zona,
                                    ['COD_ZONA']   : '',
                                    ['DESC_ZONA']  : '',
                                });                                
                            }
                            if( BusquedaPor == 'FRECUENCIA' ){
                                setCiudad({...frecuencia,
                                        ['FRECUENCIA']: '',
                                        ['DESC_FRECUENCIA']: '',
                                    });
                                form.setFieldsValue({...frecuencia,
                                        ['FRECUENCIA']: '',
                                        ['DESC_FRECUENCIA']: '',
                                    });
                            }
                            showModalMensaje('Atención!','alerta',response.data.outBinds.p_mensaje);
                        }
                    }
                showsModal(false)
             })
        }
    }
    const onFinish = async(values) => {
        var url    = `/bs/ciudades`;
        var method = 'POST';
        if (ciudad.IND_TAR_CRED!='S') {
            ciudad.IND_TAR_CRED = 'N';
        }
        await Request( url, method, ciudad )
        .then(async(response) => {
            var rows = response.data;
            if(rows.ret == 1){
                history.push('/bs/ciudad');
            }else{
                showModalMensaje('ERROR!','error',rows.p_mensaje);
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
        mensaje = errorInfo;
        setVisibleMensaje(true);
    };
    const callmodal = async(e) =>{
        var url   = '';
        var key = e.which;
        if( key == 120){  
            e.preventDefault();
            setSearchType(e.target.name);
            setTipoDeBusqueda(e.target.name);

            if( e.target.name == 'COD_PAIS'){
                let auxPais = await getPais()
                setSearchColumns(paisColumns);
                setSearchData(auxPais);
                setModalTitle('Paises');
                setShows(true);
            }else if( e.target.name == 'COD_PROVINCIA'){
                let auxProvincia = await getDepartamento();
                setSearchColumns(departamentoColumns);
                setSearchData(auxProvincia);
                setModalTitle('Departamentos');
                setShows(true);

            }else if( e.target.name == 'COD_ZONA'){
                let auxZona = await getZona()
                setSearchColumns(zonaColumns);
                setSearchData(auxZona);
                setModalTitle('Zonas');
                setShows(true);
            }else if( e.target.name == 'FRECUENCIA'){
                let auxFrecuencia = await getFrecuencia();
                setSearchColumns(frecuenciaColumns);
                setSearchData(auxFrecuencia);
                setModalTitle('Frecuencia');
                setShows(true);
            }   
            if (e.target.name == 'COD_PROVINCIA' && (ciudad.COD_PAIS == null || ciudad.COD_PAIS == '')) {
                setShows(false);
                showModalMensaje('¡Atención!','alerta','Seleccione un país.');
            }
        }
        if(key !== undefined){
            if( key == 13 || key == 9 || e.type == 'blur'){
                e.preventDefault();
                if( e.target.name == 'COD_PAIS' ){
                    url = '/bs/ciudades/valida/pais';
                }
                if( e.target.name == 'COD_PROVINCIA' ){
                    url = '/bs/ciudades/valida/departamento';
                }
                if( e.target.name == 'COD_ZONA' ){
                    url = '/bs/ciudades/valida/zona';
                }
                if( e.target.name == 'FRECUENCIA' ){
                    url = '/bs/ciudades/valida/frecuencia';
                }
                var method = 'POST';
                var data   = {'valor':e.target.value,'cod_pais':ciudad.COD_PAIS};
                await Request( url, method, data )
                    .then( response =>{
                        if(response.status == 200){
                            if( response.data.outBinds.ret == 1 ){
                                if( e.target.name == 'COD_PAIS' ){
                                    if(e.target.value.toUpperCase() != codPaisAux.toUpperCase()){
                                        setCiudad({...ciudad,
                                                ['COD_PAIS']: e.target.value.toUpperCase(),
                                                ['DESC_PAIS']: response.data.outBinds.desc_pais,
                                                ['COD_PROVINCIA']: '',
                                                ['DESC_DEPARTAMENTO']: '',
                                            });
                                        form.setFieldsValue({...ciudad,
                                                ['COD_PAIS']: e.target.value.toUpperCase(),
                                                ['DESC_PAIS']: response.data.outBinds.desc_pais,
                                                ['COD_PROVINCIA']: '',
                                                ['DESC_DEPARTAMENTO']: '',
                                            });
                                        setCodPaisAux(e.target.value.toUpperCase());
                                    }
                                    setCodProvinciaFocus();
                                }
                                if( e.target.name == 'COD_PROVINCIA' ){
                                    setCiudad({...ciudad,
                                            ['DESC_DEPARTAMENTO']: response.data.outBinds.desc_departamento,
                                        });
                                    form.setFieldsValue({...ciudad,
                                            ['DESC_DEPARTAMENTO']: response.data.outBinds.desc_departamento,
                                        });
                                    setCodZonaFocus();
                                }
                                if( e.target.name == 'COD_ZONA' ){
                                    setCiudad({...ciudad,
                                            ['DESC_ZONA']: response.data.outBinds.desc_zona,
                                        });
                                    form.setFieldsValue({...ciudad,
                                            ['DESC_ZONA']: response.data.outBinds.desc_zona,
                                        });
                                    if(e.type != 'blur')
                                         setFrecuenciaFocus();
                                }
                                if( e.target.name == 'FRECUENCIA' ){
                                    setCiudad({...ciudad,
                                            ['DESC_FRECUENCIA']: response.data.outBinds.desc_frecuencia,
                                        });
                                    form.setFieldsValue({...ciudad,
                                            ['DESC_FRECUENCIA']: response.data.outBinds.desc_frecuencia,
                                        });
                                    if(e.type != 'blur')
                                         setIndTarCredFocus();
                                }
                        }else{
                            showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);                  
                        }
                    }
                })
            }
        }
    }
    const onInteractiveSearch = async(event)=> {
        setSearchInput(event.target.value);
        var url = '';
        var valor = event.target.value;
        var data  =''
        valor = valor.trim();

        if(valor.length == 0 ){
            valor = 'null';
        }
        if(searchType == 'COD_PAIS'){
            url = '/bs/ciudades/buscar/pais';
            data = {'valor':valor};
        }
        if( searchType == 'COD_PROVINCIA' ){
            url  = '/bs/ciudades/buscar/departamento';
            data = {'valor':valor,'cod_pais':ciudad.COD_PAIS};
        }
        if( searchType == 'COD_ZONA' ){
            url = '/bs/ciudades/buscar/zona';
            data = {'valor':valor};
        }
        if( searchType == 'FRECUENCIA' ){
            url = '/bs/ciudades/buscar/frecuencia';
            data = {'valor':valor};
        }
        var method = 'POST';
        await Request( url, method, data).then( response => {
            if( response.status == 200 ){
                if(searchType == 'COD_PAIS'){
                    setSearchData(response.data.rows);
                }
                if(searchType == 'COD_PROVINCIA'){
                    setSearchData(response.data.rows);
                }
                if(searchType == 'COD_ZONA'){                        
                    setSearchData(response.data.rows);
                }
                if(searchType == 'FRECUENCIA'){
                    setSearchData(response.data.rows);
                }
            }
        })
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
    const cerrar = () => {
        history.push('/bs/ciudad');
    }
    
    if(cod_ciudad != 'nuevo' && cod_ciudad != 'modificar'){
        return <Redirect to={'/bs/ciudad'}/>
    }

    return (
        <Layout 
            defaultOpenKeys={'BS','BS-BS1'}
            defaultSelectedKeys={"BS-BS1-null-BSCIUDAD"}>
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
                        arrayActual={ciudad} 
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
                            <Row gutter={[8]}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Código"
                                        labelCol={{span:4}} 
                                        wrapperCol={{span:20}}
                                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                                        >
                                        <Row gutter={[8]}>
                                            <Col span={3}>
                                                <Form.Item
                                                    name="COD_CIUDAD"
                                                    onChange={handleInputChange}
                                                    >
                                                    <Input 
                                                        id="requerido"
                                                        name="COD_CIUDAD" 
                                                        disabled={state} 
                                                        ref={codCiudadFocus} 
                                                        onKeyDown={handleFocus}
                                                        />
                                                </Form.Item>
                                            </Col>
                                            <Col span={21}>
                                                <Form.Item 
                                                    label="Abreviatura"
                                                    name="ABREVIATURA"
                                                    onChange={handleInputChange}
                                                    >
                                                        <Input autoComplete="off" 
                                                        name="ABREVIATURA" 
                                                        ref={abreviaturaFocus} 
                                                        onKeyDown={handleFocus}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item 
                                        label="Descripción"
                                        name="DESCRIPCION"
                                        onChange={handleInputChange}
                                        labelCol={{span:5}} 
                                        wrapperCol={{span:19}}
                                        >
                                            <Input 
                                                id="requerido"
                                                name="DESCRIPCION" 
                                                ref={descripcionFocus} 
                                                onKeyDown={handleFocus}
                                            />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item  
                                        label="Pais"
                                        labelCol={{span:4}} 
                                        wrapperCol={{span:20}}
                                    >
                                        <Input.Group size="small">
                                            <Row gutter={8}>
                                                <Col span={3}>     
                                                    <Form.Item name="COD_PAIS">
                                                        <Input 
                                                            name="COD_PAIS"
                                                            disabled={state} 
                                                            type="text"
                                                            className="search_input"
                                                            onKeyDown={callmodal}
                                                            onChange={handleInputChange}
                                                            onBlur={callmodal}
                                                            ref={codPaisFocus}
                                                            />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={21}>
                                                    <Form.Item name="DESC_PAIS">
                                                        <Input
                                                            name="DESC_PAIS"
                                                            disabled={true} 
                                                            />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item  
                                        label="Departamento"
                                        labelCol={{span:5}} 
                                        wrapperCol={{span:19}}
                                    >
                                        <Input.Group size="small">
                                            <Row gutter={8}>
                                                <Col span={3}>
                                                    <Form.Item name="COD_PROVINCIA">
                                                        <Input 
                                                            name="COD_PROVINCIA"
                                                            disabled={state} 
                                                            type="number"
                                                            className="search_input"
                                                            onKeyDown={callmodal}
                                                            onChange={handleInputChange}
                                                            onBlur={callmodal}
                                                            ref={codProvinciaFocus}
                                                            />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={21}>
                                                    <Form.Item name="DESC_DEPARTAMENTO">
                                                        <Input
                                                            name="DESC_DEPARTAMENTO"
                                                            disabled={true} 
                                                            />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item  
                                        label="Zona"
                                        labelCol={{span:4}} 
                                        wrapperCol={{span:20}}
                                    >
                                        <Input.Group size="small">
                                            <Row gutter={8}>
                                                <Col span={3}>
                                                    <Form.Item name="COD_ZONA">
                                                        <Input 
                                                            name="COD_ZONA"
                                                            type="number"
                                                            className="search_input"
                                                            onKeyDown={callmodal}
                                                            onChange={handleInputChange}
                                                            // onBlur={callmodal}
                                                            ref={codZonaFocus}
                                                            />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={21}>
                                                    <Form.Item name="DESC_ZONA">
                                                        <Input
                                                            name="DESC_ZONA"
                                                            disabled={true} 
                                                            />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item  
                                        label="Frecuencia"
                                        labelCol={{span:5}} 
                                        wrapperCol={{span:19}}
                                    >
                                        <Input.Group size="small">
                                            <Row gutter={8}>
                                                <Col span={3}>
                                                    <Form.Item name="FRECUENCIA">
                                                        <Input 
                                                            name="FRECUENCIA"
                                                            className="search_input"
                                                            onKeyDown={callmodal}
                                                            onChange={handleInputChange}
                                                            onBlur={callmodal}
                                                            ref={frecuenciaFocus}
                                                            />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={21}>
                                                    <Form.Item name="DESC_FRECUENCIA">
                                                        <Input
                                                            name="DESC_FRECUENCIA"
                                                            disabled={true} 
                                                            />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Sol. Traj."
                                        name="IND_TAR_CRED"
                                        onChange={marcarCheck}
                                        labelCol={{span:4}} 
                                        wrapperCol={{span:20}}
                                        >
                                            <Input autoComplete="off"
                                                name="IND_TAR_CRED"
                                                type="checkbox"
                                                ref={indTarCredFocus}
                                                checked={ciudad.IND_TAR_CRED === 'S'}
                                            />
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

export default Ciudad;