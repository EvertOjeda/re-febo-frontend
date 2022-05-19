import React, { useState, useContext }  from "react";
import UserContext from "../../context/User/UserContext";
import { Request }          from "../../config/request";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from "@ant-design/icons";
import cotizacionIcono  from "../../assets/icons/money.svg";
import empresaIcono     from "../../assets/icons/company.svg";
import sucursalIcono    from "../../assets/icons/shops.svg";
import reclamo          from "../../assets/icons/claim.svg";
import { useHistory }   from "react-router-dom";
import _                from "underscore";
import {    Layout  ,   Menu    ,   Button  ,      
            Switch  ,   message ,   List    ,    
            Table   ,   Row     ,   Col     ,      
            Tooltip ,   Modal   ,   Steps   ,   
            Divider
} from "antd";
import '../../assets/css/navbar.css'
const { Step }    = Steps;
const { Header  } = Layout;
const { SubMenu } = Menu;
const columns = [
    {
        title: 'Descripción',
        dataIndex: 'name',
        key: 'name',
    },{
        title: 'Valor',
        dataIndex: 'valor',
        key: 'valor',
        align: 'right',
        render: text => <a>{text}</a>
    },
    {
        title: 'Estado',
        dataIndex: 'estado',
        key: 'estado',
        align: 'center',
        width: 100,
        render: text => <a>{text}</a>
    },
    {
        title: 'Variación',
        dataIndex: 'variacion',
        key: 'variacion',
        align: 'right',
        width: 100,
    },
];
const Navbar = ({
    toggleRightFunction,
    toggleRight,
    changeTheme,
    theme,
    CloseSession
}) => { 

    const { setEmpresaContext, setSucursalContext  } = useContext(UserContext);

    const history = useHistory();
    const [ isModalVisible   , setIsModalVisible   ] = useState(false);
    const [ isTitleVisible   , setIsTitleVisible   ] = useState(false);
    const [ isFooterVisible  , setIsFooterVisible  ] = useState(false);
    const [ isCurrencyModal  , setIsCurrencyModal  ] = useState(false);
    const [ titleEmpresa     , setTitleEmpresa     ] = useState("");    
    const [ titulo           , setTitulo           ] = useState("");
    const [ empresa          , setEmpresa          ] = useState([]);
    const [ cotizacion       , setCotizacion       ] = useState([]);
    const [ estado           , setEstado           ] = useState(0);
    const [ cotizacionEstado , setCotizacionEstado ] = useState(0);
    const [ cotizacionTitulo , setCotizacionTitulo ] = useState(0);
    const [ codEmpresa       , setCodEmpresa       ] = useState();
    const [ Logo             , setLogo             ] = useState( process.env.REACT_APP_BASEURL + sessionStorage.getItem("ruta_logo") );
    const [ tipoMoneda       , setTipoMoneda       ] = useState(0);
    const getInfo = async (url, method, data ) => {
        try {
            var response = await Request(
                url,
                method,
                data
            ).then((response) => {
                return response;
            });
            if (response.data.rows.length > 0) {
                return response.data.rows;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    };
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const prueba = async (e) => {
        if (estado === 0) {
            var cod_empresa = e.target.id;
            const info = await getInfo("/navbar/sucursal", "POST", { filter: [], value: cod_empresa} );
            if (info.length > 0) {
                setEmpresa(info);
                setTitulo("Sucursal");
                setEstado(1);
                setIsTitleVisible(true);
                setIsFooterVisible(true);
                setTitleEmpresa(
                    info[0].DESC_EMPRESA
                    // info[0].COD_EMPRESA + " - " + 
                );
                setCodEmpresa(cod_empresa);
                sessionStorage.setItem('cod_empresa', cod_empresa);
            } else {
                warning('La empresa seleccionada no tiene sucursales asignadas.', 1);
            }
        } else {
            establecerCookie(e.target.id);
        }
    };
    const showEmpresa = async () => {
        var info = await getInfo("/navbar/empresa", "POST", {
            filter: [],
            value: "null",
        });
        setEmpresa(info);
        setTitulo("Empresa");
        setEstado(0);
        showModal();
        setIsTitleVisible(false); 
        setIsFooterVisible(true);
        setIsCurrencyModal(false);
    };
    const showSucursal = async () => {
        var info = await getInfo("/navbar/sucursal", "POST", {
            filter: [],
            value: sessionStorage.getItem("cod_empresa"),
        });
        setEmpresa(info);
        setTitulo("Sucursal");
        setEstado(1);
        showModal();
        setIsTitleVisible(false);
        setIsFooterVisible(false);
        setIsCurrencyModal(false);
    };
    const onChange = async (current) => {
        if (current === 0) {
            var info = await getInfo("/navbar/empresa", "POST", {
                filter: [],
                value: "null",
            });
            setEmpresa(info);
            setTitulo("Empresa");
            setEstado(current);
            setIsTitleVisible(false);
            setCodEmpresa(""); 
        }
    };
    const establecerCookie = (id) => {
        var info = _.flatten( _.filter(empresa,function(item){
            return item.CODIGO == id;
        }));
        setLogo( process.env.REACT_APP_BASEURL + info[0].RUTA_LOGO  );
        sessionStorage.setItem("cod_empresa"   , sessionStorage.getItem('cod_empresa'));
        sessionStorage.setItem("desc_empresa"  , info[0].DESC_EMPRESA );
        sessionStorage.setItem("cod_sucursal"  , id                   );
        sessionStorage.setItem("desc_sucursal" , info[0].DESCRIPCION  );
        sessionStorage.setItem("ruta_logo"     , info[0].RUTA_LOGO    );
        setEmpresaContext( info[0].COD_EMPRESA + ' - ' + info[0].DESC_EMPRESA);
        setSucursalContext( info[0].CODIGO + ' - ' + info[0].DESCRIPCION);
        handleCancel();
        history.push("/home");
    };
    const warning = (text, duration) => {
        message.warning(text, duration);
    };
    const showCotizacion = async(e) => {
        var rows = await showDataCotizacion(0);
        setTitulo("Tipos del cambio del dia");
        setIsTitleVisible(false);
        setIsCurrencyModal(true);
        setIsFooterVisible(false);
        setCotizacion(rows);
        setCotizacionEstado(0);
        showModal();
    }
    const onChangeCurrency = async(current) => {
        var rows = await showDataCotizacion(current);
        setCotizacion(rows);
        setCotizacionEstado(current);
    }
    const showDataCotizacion = async( current ) => {
        var rows = [];
        var info = await getInfo("/navbar/cotizacion", "POST", {
            filter: [],
            value: "null",
        });
        var tipo = _.unique( info, function(item){
            return item.COD_MONEDA;
        });
        setTipoMoneda(tipo);
        setCotizacionTitulo(tipo[current].DESC_MONEDA);
        rows.push({
            key:'venta',
            name:'Venta',
            valor: tipo[current].VAL_VENTA,
            variacion: tipo[current].VARIACION_VENTA,
            estado: tipo[current].VARIACION_VENTA > 0 ? '+' : ' - '
        })
        rows.push({
            key:'compra',
            name:'Compra',
            valor: tipo[current].VAL_COMPRA,
            variacion: tipo[current].VARIACION_COMPRA,
            estado: tipo[current].VARIACION_COMPRA > 0 ? '+' : ' - '
        })
        return rows;
    }

    return (
        <>
            <Modal
                title={titulo}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={false}
                wrapProps={{
                    'data-theme': [theme]
                }}
            >
                {isTitleVisible ? (
                    <>
                    <h3 style={{
                        padding: '0px',
                        margin: '0px',
                    }}>{titleEmpresa}</h3>
                    <hr></hr>
                    </>
                ) : null}
                {isCurrencyModal
                    ?   <>
                            <Divider>{cotizacionTitulo}</Divider>
                                <Table dataSource={cotizacion} columns={columns} pagination={false}/>
                            <Divider/>
                            <Steps progressDot current={cotizacionEstado} onChange={onChangeCurrency}>
                                {tipoMoneda.length > 0
                                    ?   tipoMoneda.map( item => (
                                            <Step title={item.DESC_MONEDA}/>
                                        ))
                                    :   null
                                }
                            </Steps>
                        </>
                    :   <List
                            itemLayout="horizontal"
                            dataSource={empresa}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <a onClick={prueba} id={item.CODIGO}>
                                                {item.CODIGO + " - " + item.DESCRIPCION}
                                            </a>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                }
                {isFooterVisible ? (
                    <>
                        <Divider />
                        <Steps current={estado} onChange={onChange}>
                            <Step title="Empresa" />
                            <Step title="Sucursal" />
                        </Steps>
                    </>
                ) : null}
            </Modal>
            <Header
                className="site-layout-background site-header"
                data-theme={theme}>
                <Row>
                    <Col span={3}>
                        <Switch
                            checked={theme === "dark"}
                            onChange={changeTheme}
                            checkedChildren="Dark"
                            unCheckedChildren="Light"
                            style={{ marginLeft: "10px", marginRight: "5px" }}
                        />
                        <Button
                            type="primary"
                            size="small"
                            onClick={toggleRightFunction}
                            style={{ marginLeft: "5px", marginRight: "10px" }}
                        >
                            {React.createElement(
                                toggleRight
                                    ? MenuUnfoldOutlined
                                    : MenuFoldOutlined
                            )}
                        </Button>
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }} >
                        <Tooltip placement="bottom" title={"Cotizaciones"}>
                            <Button
                                type="text"
                                icon={<img src={cotizacionIcono} width="30" />}
                                size="large"
                                className="header-nabvar-icon"
                                onClick={showCotizacion}
                            />
                        </Tooltip>
                        {/* <Tooltip placement="bottom" title={"Empresas"}>
                            <Button
                                name="button_cod_empresa"
                                type="text"
                                icon={<img src={empresaIcono} width="30" />}
                                size="large"
                                className="header-nabvar-icon"
                                onClick={showEmpresa}
                            />
                        </Tooltip> */}
                        <Tooltip placement="bottom" title={"Sucursales"}>
                            <Button
                                type="text"
                                icon={<img src={sucursalIcono} width="30" />}
                                size="large"
                                className="header-nabvar-icon"
                                onClick={showSucursal}
                            />
                        </Tooltip>
                        <Tooltip
                            placement="bottom"
                            title={"Reclamos de Informatica"}
                        >
                            <Button
                                type="text"
                                icon={<img src={reclamo} width="30" />}
                                size="large"
                                className="header-nabvar-icon"
                            />
                        </Tooltip>
                    </Col>
                    <Col span={11}>
                        <Menu mode="horizontal" className="header-navbar-menu">
                            <SubMenu 
                                style={{position: 'absolute', top: 0, right: 0}}
                                key="_usuario"
                                icon={<UserOutlined />}
                                title={`${sessionStorage.getItem("nombre_usuario")} (${sessionStorage.getItem("cod_usuario")})`}
                            >
                                <Menu.ItemGroup >
                                    <Menu.Item key="perfil">
                                        Editar perfil
                                    </Menu.Item>
                                    <Menu.Item
                                        id="close_session_and_window"
                                        key="cerrar_sesion"
                                        onClick={(e) => {
                                            CloseSession();
                                        }}
                                    >
                                        Cerrar Sesión
                                    </Menu.Item>
                                </Menu.ItemGroup>
                            </SubMenu>
                        </Menu>
                    </Col>
                    <Col span={2}>
                            <img
                                src={ Logo }
                                className="img-Empresa"
                                style={{ width: "100px", marginTop:"10px", float: "right", marginRight: "10px",cursor: 'pointer',}}
                                onClick={showEmpresa}
                            />
                    </Col>
                </Row>
            </Header>
        </>
    );
};
export default Navbar;