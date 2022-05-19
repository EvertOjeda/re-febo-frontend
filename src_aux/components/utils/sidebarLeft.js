import React, { useState } from 'react';
import { Link }            from 'react-router-dom';
import { Layout, Menu }    from "antd";
import {
        DashboardOutlined
    ,   AppstoreOutlined
} from "@ant-design/icons";
const { Sider} = Layout;
const { SubMenu } = Menu;
const SidebarLeft = ({  collapsed, 
                        theme, 
                        mode,
                        defaultSelectedKeys, 
                        defaultOpenKeys, 
                        handleClick         }) =>{
    
    const [ modulos   ] = useState( JSON.parse(sessionStorage.getItem("menu_padre"))  );
    const [ tipos     ] = useState( JSON.parse(sessionStorage.getItem("menu_hijo_1")) );
    const [ etiquetas ] = useState( JSON.parse(sessionStorage.getItem("menu_hijo_2")) );
    const [ formas    ] = useState( JSON.parse(sessionStorage.getItem("menu_hijo_3")) );
    return (
        <Sider
            id="sidebarLeft"
            trigger={null}
            collapsible
            collapsed={collapsed}
            data-theme={theme}
            width="250"
        >
            <Menu
                id="sidebarLeftMenu"
                theme={theme}
                mode={mode}
                defaultOpenKeys={defaultOpenKeys}
                defaultSelectedKeys={defaultSelectedKeys}
                triggerSubMenuAction={"click"}
                onClick={handleClick}
            >
                <Menu.Item key="_dashboard" icon={<DashboardOutlined />}>
                    <Link to="/home">Dashboard</Link>
                </Menu.Item>
                {modulos.length > 0
                    ?   modulos.map( modulo => ( 
                            <SubMenu key={modulo.NODO_PADRE} icon={<AppstoreOutlined />} title={modulo.DESC_MODULO}>
                                {/* TIPOS */}
                                {tipos.length > 0
                                    ?   tipos.filter( tipo => tipo.NODO_PADRE.includes(modulo.NODO_PADRE)).map( tipo=>(
                                            <SubMenu key={tipo.NODO_PADRE + '-' + tipo.NODO_HIJO_1} title={tipo.DESC_MENU}>
                                                {/* ETIQUETA */}
                                                {etiquetas.length > 0
                                                    ?   etiquetas.filter( etiqueta => etiqueta.NODO_PADRE.includes(modulo.NODO_PADRE) && etiqueta.NODO_HIJO_1 == tipo.NODO_HIJO_1).map( etiqueta =>(
                                                            <SubMenu key={etiqueta.NODO_PADRE + '-' + etiqueta.NODO_HIJO_1 + '-' + etiqueta.NODO_HIJO_2} title={etiqueta.DESC_NODO}>
                                                                {/* FORMA */}
                                                                {formas.length > 0
                                                                    ?   formas.filter( forma => forma.NODO_PADRE.includes(modulo.NODO_PADRE) && forma.NODO_HIJO_1 == tipo.NODO_HIJO_1 && forma.NODO_HIJO_2 == etiqueta.NODO_HIJO_2).map( forma =>(
                                                                            <Menu.Item key={forma.NODO_PADRE + '-' + forma.NODO_HIJO_1 + '-' + forma.NODO_HIJO_2 + '-' + forma.COD_FORMA}>
                                                                                {forma.RUTA != null
                                                                                    ?   <Link to={forma.RUTA}>{forma.DESC_FORMA}</Link>
                                                                                    :   forma.DESC_FORMA
                                                                                }
                                                                            </Menu.Item>
                                                                        ))
                                                                    :   null
                                                                }
                                                            </SubMenu>
                                                        ))
                                                    :   null     
                                                }
                                                {formas.length > 0
                                                    ?   formas.filter( forma => forma.NODO_PADRE.includes(modulo.NODO_PADRE) && forma.NODO_HIJO_1 == tipo.NODO_HIJO_1 && forma.NODO_HIJO_2 == null).map( forma =>(
                                                            <Menu.Item key={forma.NODO_PADRE + '-' + forma.NODO_HIJO_1 + '-' + 'null' + '-' + forma.COD_FORMA}>
                                                                {forma.RUTA != null
                                                                    ?   <Link to={forma.RUTA}>{forma.DESC_FORMA}</Link>
                                                                    :   forma.DESC_FORMA
                                                                }
                                                            </Menu.Item>
                                                        ))
                                                    :   null
                                                }
                                            </SubMenu>
                                        ))
                                    :   null
                                }
                            </SubMenu> 
                            )) 
                    :  null
                }
            </Menu>
        </Sider>
    );
}
export default SidebarLeft;