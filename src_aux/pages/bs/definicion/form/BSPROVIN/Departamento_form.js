import React, { useEffect, useState, useRef }   from "react";
import { Redirect }                             from 'react-router-dom';
import Paper 							        from '@material-ui/core/Paper';
import { Request }                              from "../../../../../config/request";
import Layout                                   from "../../../../../components/utils/NewLayout";
import FormModalSearch                          from "../../../../../components/utils/ModalForm/FormModalSearch";
import ModalDialogo                             from "../../../../../components/utils/Modal/ModalDialogo";
import { useHotkeys }                           from 'react-hotkeys-hook';
import {ButtonForm,TituloForm}                  from '../../../../../components/utils/ContenedorForm/ContainerFrom';
import Main                                     from '../../../../../components/utils/Main';
import {
        Form
    ,   Input
    ,   Row
    ,   Col
} from 'antd';
const Titulo        = 'Departamentos';
const paisColumns = [
    { ID: 'COD_PAIS'  , label: 'Codigo'      , align: 'center' , width: 80 },
    { ID: 'DESC_PAIS' , label: 'Descripcion' },
];
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
const FormName            = 'BSPROVIN';
const Departamento = ({ history, location, match}) =>{
    const [form] = Form.useForm();
    const dirr   = "/bs/departamento";
    const showsModal = async (valor) => {
        setShows(valor);
        setSearchInput('');
    };
    const buttonSaveRef = useRef();
    const buttonExitRef = useRef();
    useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    useHotkeys(Main.Volver, (e) =>{ 
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    const [departamento      , setDepartamento      ] = useState({}); 
    const [searchColumns     , setSearchColumns     ] = useState({});
    const [searchData        , setSearchData        ] = useState({});
    const [state             , setState             ] = useState(false);
    const [auxData           , setAuxData           ] = useState({});  
    const [shows             , setShows             ] = useState(false);
    const [tipoDeBusqueda    , setTipoDeBusqueda    ] = useState();
    const [pais              , setPais              ] = useState({});
    const [visibleMensaje    , setVisibleMensaje    ] = useState(false);
    const [isModalVisible    , setIsModalVisible    ] = useState(false);
    const [mensaje           , setMensaje           ] = useState('');
    const [imagen            , setImagen            ] = useState('');
    const [tituloModal       , setTituloModal       ] = useState('');
    const [searchType        , setSearchType        ] = useState('');
    const [modalTitle        , setModalTitle        ] = useState('');
    const [searchInput       , setSearchInput       ] = useState('');
    const [isNew            , setIsNew          ] = useState(false);
    const [searchInputFocus  , setSearchInputFocus  ] = UseFocus();
    const [codProvinciaFocus , setCodProvinciaFocus ] = UseFocus();
    const [descripcionFocus  , setDescripcionFocus  ] = UseFocus();
    const [abreviaturaFocus  , setAbreviaturaFocus  ] = UseFocus();
    const [codPaisFocus      , setCodPaisFocus      ] = UseFocus();
    const { params: { cod_provincia } } = match;
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(()=>{
        getPais();
        if(cod_provincia == 'nuevo'){
            setState(false);
            setDepartamento({...departamento,
                                ['USERNAME']:sessionStorage.getItem('cod_usuario'),
                                ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                                ['TIPO']: 'I',});
            setAuxData({...auxData,
                                ['USERNAME']:sessionStorage.getItem('cod_usuario'),
                                ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                                ['TIPO']: 'I',});
            setCodPaisFocus();
            setIsNew(true);
        }else{
            if(location.state == undefined){
                history.push(dirr);
            }else{
                setState(true);
                getData();
            }
        }
    },[]);
    const getData = async() =>{
        try {
            setDepartamento({...location.state.rows,
                                ['USERNAME']:sessionStorage.getItem('cod_usuario'),
                                ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                                ['TIPO']:'U',});
            setAuxData({...location.state.rows,
                                ['USERNAME']:sessionStorage.getItem('cod_usuario'),
                                ['COD_EMPRESA']:sessionStorage.getItem('cod_empresa'),
                                ['TIPO']:'U',});
            form.setFieldsValue(location.state.rows);
            setDescripcionFocus();
        } catch (error) {
            console.log(error);
        }
    }
    const getPais = async() =>{
        try {
            var url     = '/bs/provincias/buscar/pais';
            var method  = 'POST';
            await Request(url,method,{valor:'null'})
                .then(response => {
                    if( response.data.rows.length > 0){
                        setPais(response.data.rows);
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }
    const handleInputChange = (event)=>{
        setDepartamento({
            ...departamento,
            [event.target.name] : event.target.value,
        });
        form.setFieldsValue({...departamento,
            [event.target.name] : event.target.value,
        });
        if(event.target.name == 'COD_PAIS'){
            setDepartamento({
                ...departamento,
                [event.target.name] : event.target.value.toUpperCase(),
            });
            form.setFieldsValue({...departamento,
                ['COD_PAIS'] : event.target.value.toUpperCase(),
            });
        }
    }
    const handleFocus = (e) =>{ 
        if(e.which == 18){
            e.preventDefault();
        }
        if(e.which == 13 || e.which == 9){
            e.preventDefault();
            if(e.target.name == 'COD_PAIS'){
                setCodProvinciaFocus();
            }
            if(e.target.name == 'COD_PROVINCIA'){
                setDescripcionFocus();
            }
            if(e.target.name == 'DESCRIPCION'){
                setAbreviaturaFocus();
            }
        }
    }
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if(datos !== "" || datos !== undefined){
            var url   = '';
            var valor = ''
            if( BusquedaPor === 'COD_PAIS' ){
                url = '/bs/provincias/valida/pais';
                valor = datos[0];
            }
            var method = 'POST';
            var data   = {'valor':valor,'cod_pais':departamento.COD_PAIS};
            await Request( url, method, data )
                .then( response =>{
                    if(response.status == 200){
                        if( response.data.outBinds.ret == 1 ){
                            if( BusquedaPor == 'COD_PAIS' ){
                                setDepartamento({...departamento,
                                        ['DESC_PAIS'] : response.data.outBinds.desc_pais,
                                        ['COD_PAIS']: valor
                                    });
                                form.setFieldsValue({...departamento,
                                        ['DESC_PAIS'] : response.data.outBinds.desc_pais,
                                        ['COD_PAIS']: valor
                                    });
                                setTimeout( setCodProvinciaFocus, 300 );
                            }
                        }else{
                            if( BusquedaPor == 'COD_PAIS' ){
                                setPais({
                                    ...pais,
                                    ['COD_PAIS']   : '',
                                    ['DESC_PAIS']  : '',
                                })
                            }
                            showModalMensaje('Atención!','alerta',response.data.outBinds.mensaje);
                        }
                    }
                showsModal(false)
             })
        }
    }
    const onFinish = async(values) => {
        var url    = '/bs/provincias';
        var method = 'POST';
        setDepartamento({...departamento,['DATOS_VIEJOS']:'',['COLUMNAS']:'',});
        await Request( url, method, departamento)
            .then(async(response) => {
                var rows = response.data;
                if(rows.ret == 1){
                    history.push('/bs/departamento');
                }else{
                    showModalMensaje('ERROR!','error',rows.mensaje);
                }
            });
    };
    const onFinishFailed = (errorInfo) => {
        setMensaje(errorInfo);
        setVisibleMensaje(true);
    };
    const callmodal = async(e) =>{
        var url   = '';
        setSearchType(e.target.name);
        if( e.target.name == 'COD_PAIS'){
            url = '/bs/provincias/buscar/pais';
            setSearchColumns(paisColumns);
            setSearchData(pais);
            setModalTitle('Paises');
        }
        var key = e.which;
        if( key == 120){
            setTipoDeBusqueda(e.target.name);
            e.preventDefault();
            setSearchData(auxData);            
            setShows(true);
        }
        if(key !== undefined){
            if( key == 13 || key == 9 || e.type == 'blur'){
                e.preventDefault();
                if( e.target.name == 'COD_PAIS' ){
                    url = '/bs/provincias/valida/pais';
                }
                var method = 'POST';
                var data   = {'valor':e.target.value,'cod_pais':departamento.COD_PAIS};
                await Request( url, method, data )
                    .then( response =>{
                        if(response.status == 200){
                            if( response.data.outBinds.ret == 1 ){
                                if( e.target.name == 'COD_PAIS' ){
                                    setDepartamento({...departamento,
                                        ['DESC_PAIS'] : response.data.outBinds.desc_pais,
                                    });
                                    form.setFieldsValue({...departamento,
                                        ['DESC_PAIS'] : response.data.outBinds.desc_pais,
                                    });
                                    if(e.type != 'blur')
                                        setTimeout( setCodProvinciaFocus, 300 );
                                }
                        }else{
                            if( e.target.name == 'COD_PAIS' ){
                                setDepartamento({
                                    ...departamento,
                                    ['COD_PAIS']   : '',
                                    ['DESC_PAIS']  : '',
                                })
                                form.setFieldsValue({...departamento,
                                    ['COD_PAIS']   : '',
                                    ['DESC_PAIS']  : '',
                                });
                                showModalMensaje('Atención!', 'alerta','El pais no corresponde o no existe.');
                            }
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
        valor = valor.trim();
        if(valor.length == 0 ){
            valor = null;
        }
        if(searchType == 'COD_PAIS'){
            url = '/bs/provincias/buscar/pais';
            if(valor === null){
                setSearchData(pais);
            }
        }
        if(valor !== null){
            var method = 'POST';
            var data   = {'valor':valor,'cod_pais':departamento.COD_PAIS};
            await Request( url, method, data ).then( response => {
                if( response.status == 200 ){
                    if(searchType == 'COD_PAIS'){
                        setSearchData(response.data.rows);
                    }
                }
            })
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
    const cerrar = () => {
        history.push('/bs/departamento');
    }
    return (
        <Layout defaultOpenKeys={'BS','BS-BS1'}
                defaultSelectedKeys={"BS-BS1-null-BSPROVIN"}> 
            <ModalDialogo 
                positiveButton={""}
                negativeButton={"OK"}
                negativeAction={handleCancel}
                onClose={handleCancel}
                setShow={visibleMensaje}
                title={tituloModal}
                mensaje={mensaje}
                imagen={imagen}

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
                            arrayActual={departamento} 
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
                                        label="País"
                                        // name="COD_PAIS"      
                                        labelCol={{span:4}} 
                                        wrapperCol={{span:20}}
                                        >
                                        <Input.Group size="small">
                                            <Row gutter={8}>
                                                <Col span={3}>
                                                    <Form.Item
                                                        name="COD_PAIS"
                                                        >
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
                                                    <Form.Item
                                                        name="DESC_PAIS"
                                                        >
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
                                        label="Codigo"
                                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                                        labelCol={{span:4}} 
                                        wrapperCol={{span:20}}
                                        >
                                        <Input.Group size="small">
                                            <Row gutter={8}>
                                                <Col span={4}>
                                                    <Form.Item
                                                        name="COD_PROVINCIA"
                                                        >
                                                        <Input 
                                                            name="COD_PROVINCIA" 
                                                            disabled={state}
                                                            ref={codProvinciaFocus} 
                                                            onChange={handleInputChange}
                                                            onKeyDown={handleFocus}/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={20}>
                                                    <Form.Item
                                                        name="DESCRIPCION"
                                                        >
                                                        <Input
                                                            name="DESCRIPCION"
                                                            ref={descripcionFocus} 
                                                            onChange={handleInputChange}
                                                            onKeyDown={handleFocus}
                                                            />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Abreviatura"
                                        name="ABREVIATURA"
                                        labelCol={{span:4}} 
                                        wrapperCol={{span:20}}
                                        >
                                            <Input
                                                name="ABREVIATURA"
                                                onChange={handleInputChange}
                                                ref={abreviaturaFocus}
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
export default Departamento;