import { Redirect }                             from 'react-router-dom';
import ListView                                 from '../utils/ListView/List';
import Paper 				                    from '@material-ui/core/Paper';
import Helmet                                   from 'react-helmet';
import { useHotkeys }                           from 'react-hotkeys-hook';
import Layout                                   from './NewLayout';
import { Request }                              from '../../config/request';
import UseFocus                                 from './Focus';
import FormModalSearch                          from "./ModalForm/FormModalSearch";
import { ButtonForm,TituloForm }                from './ContenedorForm/ContainerFrom';
import ModalDialogo                             from "./Modal/ModalDialogo";
import NewTableSearch                           from './NewTableSearch/NewTableSearch';
import { Guardar, Volver, Nuevo }               from './shortcuts';
import { message, Spin }                        from 'antd';
import Fieldset                                 from '../../components/utils/Fieldset/Fieldset';
import { VerificaPermiso }                      from './VerificaPermiso';
import { GeneraUpdateInsertCab,
         GeneraUpdateInsertDet,
         GeneraUpdateInsert }                   from './DevExtremeGrid/GeneraUpdateInsert';
import {ValidarColumnasRequeridas}              from '../utils/validaRequeridoGRid/ValidarColumnasRequeridas'
import HeaderMenu                               from './HeaderMenu/HeaderMenu';
import moment from 'moment'
import {modifico,setModifico}                   from './ListViewNew/ButtonCancelar'
import {add_dataRequerido}                     from  './../utils/add_dataRequerido/add_dataRequerido'

var deletedId;
const setDeletedId = (valor)=>{deletedId = valor}
const getDeletedId = ()=>{return deletedId;}
const mayuscula    = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
};

const validar  = ( setState, state, showModalMensaje, url, campo, campoDesc, dato, posicion, desc_retorno, data )=>{
    var method = 'POST';
    Request( url, method, data )
        .then( response => {
            if( response.status === 200 ){
                if(response.data.outBinds.ret === 1){                
                    setState({
                        ...state,
                        [campo]: dato,
                        [campoDesc]: response.data.outBinds[desc_retorno],
                    });
                    if(posicion){
                        posicion();
                    }
                } else {
                    setState({
                        ...state,
                        [campo]: '',
                        [campoDesc]: '',
                    });
                    showModalMensaje('¡Atención!','alerta',response.data.outBinds.p_mensaje);
                }
            } else {
                setState({
                    ...state,
                    [campo]: '',
                    [campoDesc]: '',
                });
                showModalMensaje('¡Error!','error','Ha ocurrido un error al validar el campo.');
            }
    })
}
const handleInputChange = (event, setData, data)=>{
    setData({
        ...data,
        [event.target.name] : event.target.value
    });
}
const getInfo = async(url, method, data ) => {
    try {
        var response = await Request( url, method, data)
        .then(response => {
            return response
        })
        if( response.data.rows.length > 0){
            return response.data.rows
        }else{
            return []
        }
    } catch (error) {
        console.log(error);
    }
}
export default {
    Redirect,
    Helmet,
    ListView,
    Paper,
    useHotkeys,
    Layout,
    Request,
    UseFocus,
    FormModalSearch,
    ButtonForm,
    TituloForm,
    ModalDialogo,
    NewTableSearch,
    Guardar,
    Volver,
    Nuevo,
    setDeletedId,
    getDeletedId,
    mayuscula,
    validar,
    handleInputChange,
    getInfo,
    message,
    Spin,
    Fieldset,
    VerificaPermiso,
    GeneraUpdateInsertCab,
    GeneraUpdateInsertDet,
    GeneraUpdateInsert,
    moment,
    ValidarColumnasRequeridas,
    HeaderMenu,
    modifico,
    setModifico,
    add_dataRequerido
}