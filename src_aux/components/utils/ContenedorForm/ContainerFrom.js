import React, {useState, useEffect }    from 'react';
import guardar                          from '../../../assets/icons/diskette.svg';
import salir                            from '../../../assets/icons/logout.svg';
import eliminar                         from '../../../assets/icons/delete.svg';
import {Button, Typography }            from 'antd';
import ModalDialogo                     from "../../../components/utils/Modal/ModalDialogo"
import IconButton 		                from '@material-ui/core/IconButton';
import _                                from 'underscore';
import { Redirect, useHistory }                 from "react-router-dom";

import 'antd/dist/antd.css';
import './ContainerFrom.css';
const { Title } = Typography;


export const TituloForm = (props) => {
    return (
        <>
            <div className="paper-header">
                <Title level={4} className="title-color">{props.titulo}</Title>
            </div>
        </>
    )
}
var consultar, insertar, actualizar, borrar;

export const ButtonForm = (props) => {
    const history      = useHistory();

    const [visible          , setVisible            ] = useState(false);
    const [visibleSave      , setVisibleSave        ] = useState(false);
    const [visibleMensaje   , setVisibleMensaje     ] = useState(false);
    const [mensaje          , setMensaje            ] = useState("");
    const [imagen           , setImagen             ] = useState("");

    useEffect(()=>{
        var permiso = JSON.parse(sessionStorage.getItem('acceso'));
        var info = _.flatten(_.filter(permiso, function(item){
            return item.NOM_FORMA === props.formName;
        }));
        if( info.length > 0){
            consultar  = info[0].PUEDE_CONSULTAR;
            insertar   = info[0].PUEDE_INSERTAR;
            actualizar = info[0].PUEDE_ACTUALIZAR;
            borrar     = info[0].PUEDE_BORRAR;
        }else{
            consultar  = 'N';
            insertar   = 'N';
            actualizar = 'N';
            borrar     = 'N';
        }
    },[]);

    const handleCancel = () => {
        setVisible(false);
        setVisibleSave(false);
        setVisibleMensaje(false);
    };
    function isIqual() {
        if (JSON.stringify(props.arrayAnterior) === JSON.stringify(props.arrayActual)) 
        return true
        else
        return false
    }
    const showModal = () => {
        setMensaje("Hay cambios pendientes. ¿Desea guardar los cambios?");
        setVisible(true);
    };
    const showModalSave = () => {
        setMensaje("No se han realizado cambios. ¿Desea cerrar el formulario?");
        setVisibleSave(true);
    }
    const cerrar = () => {
        props.direccionar(props.dirr)
    }
    const save = () => {
        var guardar = true;
        var CampoRequerido = document.querySelectorAll('[id=requerido]');
        if(CampoRequerido !== undefined && CampoRequerido !== null){
            for(let i = 0; i < CampoRequerido.length; i++){
                if(CampoRequerido[i].value.trim().length === 0){
                    guardar=false;
                    CampoRequerido[i].style.border = "1px solid rgb(228 52 54)";
                }
            }
            if(!guardar){
                var posicion = 0;
                for(let i = 0; i < CampoRequerido.length; i++){
                    if(CampoRequerido[i].value.trim().length === 0){
                        handleCancel();
                        posicion = i;                        
                        break
                    }    
                }
                setTimeout(()=>{CampoRequerido[posicion].focus();},50);
            }
        }
        if(guardar){
            props.onFinish();
            handleCancel();
        }
    }
    const Atras = () => {
        if(actualizar === 'S'){
            if (props.isNew && isIqual()) {
                props.direccionar(props.dirr)
            } else if (props.isNew) {
                showModal();
            } else {
                if (isIqual()) {
                    props.direccionar(props.dirr)
                } else {
                    showModal();
                }
            }
        }else{
            props.direccionar(props.dirr)
        }
    }
    const validar = () => {
        if (props.isNew && isIqual()) {
            showModalSave();
        } else if (props.isNew) {
            save();
        } else {
            if (isIqual()) {
                showModalSave();
            } else {
                save();
            }
        }
    }

   return ( 
        <>
            <div className="paper-header-menu">
                <ModalDialogo 
                    positiveButton={""}
                    negativeButton={"OK"}
                    negativeAction={handleCancel}
                    onClose={handleCancel}
                    setShow={visibleMensaje}
                    title={"ERROR!"}
                    imagen={imagen}
                    mensaje={mensaje}
                    /> 
                <ModalDialogo 
                    positiveButton={"SI"} 
                    negativeButton={"NO"}
                    positiveAction={cerrar}
                    negativeAction={handleCancel}
                    onClose={handleCancel}
                    setShow={visibleSave}
                    title={"¡Atención!"}
                    mensaje={mensaje}
                    />
                <ModalDialogo 
                    positiveButton={"SI"} 
                    negativeButton={"NO"}
                    positiveAction={save}
                    negativeAction={cerrar}
                    onClose={handleCancel}
                    setShow={visible}
                    title={"¡Atención!"}
                    mensaje={mensaje}
                />
                <Button
                    icon={<img src={guardar} width="20" style={{ marginBottom: '3px', }} />}
                    className="paper-header-menu-button"
                    ref={props.buttonGuardar}
                    disabled={
                            (actualizar == 'S' && ! props.isNew ) ? false 
                         : 
                            (insertar   == 'S' && props.isNew ) ? false 
                         :  true
                        }
                    onClick={validar} 
                />
                {
                    props.visibleDeleteButton && borrar === 'S' ?
                        <Button
                            onClick={props.FunctionNameButtonDelete}
                            icon={<img src={eliminar} width="20" style={{ marginBottom: '3px', }}/>}         
                            className="paper-header-menu-button" 
                        />
                    : null
                }
                <Button
                    icon={<img src={salir} width="20" style={{ marginBottom: '3px', }} />}
                    className="paper-header-menu-button"
                    ref={props.buttonVolver}
                    autoFocus={false}
                    onClick={Atras}
                />
            </div>
        </>
    );
};
