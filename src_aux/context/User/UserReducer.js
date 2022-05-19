import {SET_EMPRESA, SET_ISLOGGED, SET_SUCURSAL,SET_THEME} from "../types";
export default (state, action) => {
    const {payload, type} = action;
    switch(type){
        case SET_EMPRESA:
            return {
                ...state,
                ctx_desc_empresa: payload,
            }
        case SET_SUCURSAL:
            return {
                ...state,
                ctx_desc_sucursal: payload,
            }
        case SET_THEME:
            return {
                ...state,
                theme: payload
            }
        case SET_ISLOGGED:
            return {
                ...state,
                ctx_is_logged: payload
            } 
    }
}