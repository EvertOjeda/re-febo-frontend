import React, { useReducer }  from "react";
import UserReducer            from "./UserReducer";
import { SET_THEME }          from '../types'
import UserContext            from "./UserContext";
const UserState = (props) => {
    const initialState = {
        theme             : sessionStorage.getItem("theme"),
        ctx_desc_empresa  : sessionStorage.getItem('cod_empresa')  + ' - ' + sessionStorage.getItem('desc_empresa'),
        ctx_desc_sucursal : sessionStorage.getItem('cod_sucursal') + ' - ' + sessionStorage.getItem('desc_sucursal'),
        ctx_is_logged     : false,
    }
    const [state, distpach] = useReducer(UserReducer, initialState);
    const setEmpresaContext = (desc_empresa) =>{
        distpach({
            type: 'SET_EMPRESA',
            payload: desc_empresa
        });
    }
    const setThemeState = (value)=>{
        distpach({type:SET_THEME, payload:value })
    }

    const setSucursalContext = (desc_sucursal) =>{
        distpach({
            type: 'SET_SUCURSAL',
            payload: desc_sucursal
        });
    }

    const setIsLoggedContext = (value) =>{
        distpach({
            type: 'SET_ISLOGGED',
            payload: value
        });
    }

    return (
        <UserContext.Provider value={{
            theme:initialState.theme,
            setEmpresaContext,
            setThemeState,
            setSucursalContext,
            setIsLoggedContext,
            ctx_desc_empresa: state.ctx_desc_empresa,
            ctx_desc_sucursal: state.ctx_desc_sucursal,
            ctx_is_logged: state.ctx_is_logged,
        }}>
            {props.children}
        </UserContext.Provider>
    )
}
export default UserState;