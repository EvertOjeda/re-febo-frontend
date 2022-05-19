import React, { useEffect, useState, useRef } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import _ from 'underscore';
import { Request } from "../../config/request";
import Apolo from '../../assets/img/login/apolo.png';
import Sun from '../../assets/img/login/sun.png';
import Logipar from '../../assets/img/login/logipar.png';
import Inpasa from '../../assets/img/login/Inpasa.jpg';
import Ducheff from '../../assets/img/login/DuCheff.png';
import axios from 'axios';
import Main from "../../components/utils/Main";
import "../../assets/css/login.css";
import { Row, Col, Card, Button, message, Input, Typography ,Spin } from 'antd';
import { UserOutlined, SafetyOutlined } from '@ant-design/icons';
const { Title } = Typography;
const getMenu = async(cod_usuario) =>{
    var url = `/api/auth/menu/${cod_usuario}`;
    return await Request( url, 'GET', []);
}
const setMenu = async(result) => {
    // MENU
    sessionStorage.setItem("menu", JSON.stringify(result.data.rows) );
    // MENU PADRE
    var menu_padre = [];
    menu_padre = _.uniq( result.data.rows, function(item){
        return item.NODO_PADRE;
    });
    menu_padre.sort(function (a, b) {
        if (parseInt(a.ORDEN_PADRE) > parseInt(b.ORDEN_PADRE)) { return  1;}
        if (parseInt(a.ORDEN_PADRE) < parseInt(b.ORDEN_PADRE)) { return -1;}
        return 0;
    });
    sessionStorage.setItem("menu_padre", JSON.stringify(menu_padre) );
    // NODO HIJO 1
    var menu_hijo_1 = [];
    menu_hijo_1 = _.uniq( result.data.rows, function(item){
        return item.NODO_HIJO_1;
    });
    menu_hijo_1.sort(function (a, b) {
        if (parseInt(a.ORDEN_MENU) > parseInt(b.ORDEN_MENU)) { return  1;}
        if (parseInt(a.ORDEN_MENU) < parseInt(b.ORDEN_MENU)) { return -1;}
        return 0;
    });
    sessionStorage.setItem("menu_hijo_1", JSON.stringify(menu_hijo_1) );
    // NODO HIJO 2
    var menu_hijo_2 = [];
    menu_hijo_2 = _.uniq( result.data.rows, function(item){
        if(item.NODO_HIJO_2 != null){
            return item.NODO_HIJO_2;
        }
    });
    menu_hijo_2 = _.flatten(_.filter( menu_hijo_2, function(item){
        return item.NODO_HIJO_2 != null;
    }));
    menu_hijo_2.sort(function (a, b) {
        if (parseInt(a.ORDEN_NODO) > parseInt(b.ORDEN_NODO)) { return  1;}
        if (parseInt(a.ORDEN_NODO) < parseInt(b.ORDEN_NODO)) { return -1;}
        return 0;
    });
    sessionStorage.setItem("menu_hijo_2", JSON.stringify(menu_hijo_2) );
    // NODO HIJO 3
    var menu_hijo_3 = [];
    menu_hijo_3 = _.uniq( result.data.rows, function(item){
        return item.COD_FORMA;
    });
    menu_hijo_3.sort(function (a, b) {
        if (parseInt(a.ORDEN_FORMA) > parseInt(b.ORDEN_FORMA)) { return  1;}
        if (parseInt(a.ORDEN_FORMA) < parseInt(b.ORDEN_FORMA)) { return -1;}
        return 0;
    });
    sessionStorage.setItem("menu_hijo_3", JSON.stringify(menu_hijo_3) );
}
const getPermisoGrupo = async(cod_usuario) =>{
    var url = `/api/auth/permiso-grupo/${cod_usuario}`;
    return await Request( url, 'GET', [])
}
const setPermisoGrupo = async(result) => {
    await sessionStorage.setItem("acceso", JSON.stringify(result.data.rows) );
    return true;
}
const getPermisoEspecial = async(cod_empresa,cod_usuario) => {
    var url = `/api/auth/permiso-especial/${cod_empresa}/${cod_usuario}`;
    return await Request( url, 'GET', [])
}
const setPermisoEspecial = async(result) => {
    await sessionStorage.setItem("permiso_especial", JSON.stringify(result.data.rows) );
    return true;
}
const getHrBirthday = async() =>{
    var url = `/widget/hrbirthdays`
    await Request( url, 'GET', [])
    .then(response => {
        sessionStorage.setItem("hrbirthday", JSON.stringify(response.data.rows) );
    });
}
const Titulo = "Login";
export default () => {
    const [ data          , setData          ] = useState({});
    const [ loading       , setLoading       ] = useState(false);
    const history      = useHistory();
    const usuarioFocus = useRef();
    useEffect( ()=>{
        if(usuarioFocus.current != undefined){
            usuarioFocus.current.focus();
        }
    },[]);
    const handleInputChange = (event)=>{
        setData({
            ...data,
            [event.target.name] : event.target.value,
        });
    };
    const handleKeyDown = (event) => {
        if(event.keyCode == 13){
            submitForm(event);
        }
    };
    const handleUpperCase = (e) => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };
    const submitForm = async(e) => {
        setLoading(true);
        var resp = [];
        var url = `/api/auth/login?in_username=${data.username}&in_password=${data.password}`;
        try {
            resp = await axios({
                method: "GET",
                url: process.env.REACT_APP_BASEURL + url
            })
            .then( response =>{
                return response;
            })
            const { token } = resp.data;
            sessionStorage.setItem("token"            , token                   );
            sessionStorage.setItem("hash"             , resp.data.PRUEBA        );
            sessionStorage.setItem("cod_empresa"      , resp.data.COD_EMPRESA   );
            sessionStorage.setItem("desc_empresa"     , resp.data.DESC_EMPRESA  );
            sessionStorage.setItem("cod_sucursal"     , resp.data.COD_SUCURSAL  );
            sessionStorage.setItem("desc_sucursal"    , resp.data.DESC_SUCURSAL );
            sessionStorage.setItem("cod_usuario"      , resp.data.COD_USUARIO   );
            sessionStorage.setItem("nombre_usuario"   , resp.data.NOMBRE        );
            await getHrBirthday();
            // PERMISOS
            await getMenu(resp.data.COD_USUARIO)
                .then( async(result) => {
                    setMenu(result);
                    await getPermisoGrupo(resp.data.COD_USUARIO)
                        .then( async(result) => {
                            setPermisoGrupo(result);
                            await getPermisoEspecial(resp.data.COD_EMPRESA, resp.data.COD_USUARIO)
                            .then( async(result) => {
                                await setPermisoEspecial(result);
                                sessionStorage.setItem("mode", "inline");
                                sessionStorage.setItem("theme", "dark");
                                sessionStorage.setItem("toggle-right", "show");
                                sessionStorage.setItem("ruta_logo",resp.data.RUTA_LOGO);
                                sessionStorage.setItem('islogged',true);
                                history.push("/home");
                            });
                        });
                })
        } catch (error) {
            if(error.response != undefined){
                if(error.response.status == 401){
                    errorMessage(error.response.data.message);
                };
            }else{
                errorMessage('No se ha obtenido respuesta del backend');
            }
            usuarioFocus.current.focus();
            setLoading(false);
        }
    }
    const errorMessage = (text) => {
        message.info(text);
    };
    if(sessionStorage.getItem("islogged")){
        return <Redirect to="/home"/>
    }
    return (
        <Row>
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${Titulo}` }/>
            <Col span={12} offset={6}>
                <br /><br /><br /><br /><br />
                <Card 
                    style={{
                        textAlign: 'center',
                        border: 0,
                        borderRadius: '10.5px',
                        boxShadow: '6px 2px 20px 2px #6c757d85',
                        overflow: 'hidden',
                        background:'#fefefe'
                        }}>
                        <Spin size="large"  spinning={loading}> 
                        <div style={{marginBottom:'30px'}}>
                            <img src={Apolo}   alt="logo" className="logo1" />
                            <img src={Inpasa}  alt="logo" className="logo1" />
                            <img src={Sun}     alt="logo" className="logo" />
                            <img src={Logipar} alt="logo" className="logo" />
                            <img src={Ducheff} alt="logo" className="logo" />
                        </div>
                        <Title level={3}>Iniciar sesión en su cuenta</Title>
                        <Row style={{background:'#fefefe'}}>
                            <Col span={12} offset={6}>
                            <Input
                                name="username"
                                autoComplete="off"
                                onChange={handleInputChange}
                                onInput={handleUpperCase}
                                prefix={<UserOutlined />}
                                style={{marginTop:'30px'}}
                                ref={usuarioFocus}/>
                            <Input
                                name="password"
                                autoComplete="off"
                                className="key"
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onInput={handleUpperCase}
                                prefix={<SafetyOutlined />}
                                style={{marginTop:'15px'}}/>
                            <Button 
                                block 
                                onClick={submitForm}
                                style={{marginTop:'15px',border:'1px solid #1890ff', color: '#1890ff'  }}>Ingresar</Button>
                            </Col>
                        </Row>
                        <br /><br />
                        <a href="#!" className="forgot-password-link">¿se te olvidó tu contraseña?</a>
                        <br />
                        <a href="#!">Términos de Uso. Política de privacidad Apolo Import S.A</a>
                    </Spin>
                </Card>
            </Col>
        </Row>
    );
};