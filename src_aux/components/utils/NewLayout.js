import React, { useState,useContext, useEffect }      from "react";
import { Redirect }             from 'react-router-dom';
import $                        from "jquery";
import { Layout }               from "antd";
import Navbar                   from "./navbar";
import SidebarLeft              from "./sidebarLeft";
import SidebarRight             from "./sidebarRight";
import { useHistory }           from "react-router-dom";
import ControlaInactividad      from "./SessionTimer";

import 'antd/dist/antd.css';
import "../../assets/css/themeNew.css"; 
import "../../assets/css/header.css";
import "../../assets/css/footer.css";
import "../../assets/css/scrollbar.css";
import "../../assets/css/widget.css";
import "../../assets/css/treeView.css";
import "../../assets/css/sidebarRight.css";
import "../../assets/css/sidebarLeft.css";
import "../../assets/css/form-menu.css";
import "../../assets/css/form.css";
import "../../assets/css/buttonMaterialUi.css";
import "../../assets/css/checkboxForm.css";
import "../../assets/css/radioGroup.css";
import "../../assets/css/inputDate.css";
import "../../assets/css/radio.css";
import "../../assets/css/Date.css";
import "../../assets/css/navbarIconos.css";
import "../../assets/css/DevExtreme.css";

const { Content } = Layout;
export const MyContext = React.createContext('404');
import Context           from '../../context/User/UserContext';

const NewLayout   = (props) => {    
    const history      = useHistory();
    const [ defaultOpenKeys     ] = useState(props.defaultOpenKeys);
    const [ defaultSelectedKeys ] = useState(props.defaultSelectedKeys);
    const [ collapsed           , setCollapsed              ] = useState(false);
    const [ toggleRight         , setToggleRight            ] = useState(sessionStorage.getItem("toggle-right") );
    const [ theme               , setTheme                  ] = useState(sessionStorage.getItem("theme"));
    const [ mode                , setMode                   ] = useState(sessionStorage.getItem("mode"));

    const { setThemeState, setIsLoggedContext, ctx_is_logged }     = useContext(Context);

    const toggle = () =>{
        setCollapsed(!collapsed);
        if(collapsed){
            $('.site-layout').removeClass('toggledLeft');
            $('.site-header').removeClass('toggle');
            $('.site-footer').removeClass('toggledLeft');
        }else{
            $('.site-layout').addClass('toggledLeft');
            $('.site-header').addClass('toggle');
            $('.site-footer').addClass('toggledLeft');
        }
    }
    const toggleRightFunction = () =>{
        switch (toggleRight) {
            case 'show':
                setToggleRight('hide');
                sessionStorage.setItem("toggle-right","hide");
                break;
            case 'hide':
                setToggleRight('show');
                sessionStorage.setItem("toggle-right","show");
                break;
            default:
                console.log('no cumple con ninguno');
        }
    }
    const changeTheme = (value) =>{
        setTheme(value ? 'dark' : 'light');
        if (value === true) {
            sessionStorage.setItem("theme", "dark");
            setThemeState("dark")
        } else {
            sessionStorage.setItem("theme", "light");
            setThemeState("light")
        }
    }
    const changeMode = (value) => {
        setMode(value ? 'inline' : 'vertical');
        if (value === true) {
            sessionStorage.setItem("mode", "inline");
        } else {
            sessionStorage.setItem("mode", "vertical");
        }
    };
    const CloseSession = (e) => {
        setIsLoggedContext(false);
        sessionStorage.clear();
        history.push("/");
    };
    if (! sessionStorage.getItem("islogged") ) {
        return <Redirect to="/"/>;
    }
    return (
        <>
            <ControlaInactividad CloseSession={CloseSession}/>
            <SidebarLeft 
                collapsed={collapsed} 
                theme={theme}
                mode={mode}
                defaultOpenKeys={defaultOpenKeys}
                defaultSelectedKeys={defaultSelectedKeys}
                />
            <Layout className="site-layout" data-theme={theme} data-toggle={toggleRight} id="system-layout">
                <Navbar 
                    toggle={toggle}
                    collapsed={collapsed}
                    toggleRightFunction={toggleRightFunction} 
                    toggleRight={toggleRight} 
                    changeTheme={changeTheme}
                    theme={theme}
                    changeMode={changeMode} 
                    mode={mode}
                    CloseSession={CloseSession}
                />
                <Content
                    id="site-content"
                    className="site-layout-background"
                    data-theme={theme}
                    style={{
                        padding: 10,
                        height: 'calc(100vh - 64px)',
                        marginTop: 64,
                        marginBottom:'0px',
                        overflow:'auto',
                        scrollbarWidth: 'none',
                    }}
                >
                    <MyContext.Provider value={theme}>
                        {props.children}
                    </MyContext.Provider> 
                </Content>
                <SidebarRight theme={theme} toggle={toggleRight}/>
            </Layout>
        </>
    );
};
export default NewLayout;