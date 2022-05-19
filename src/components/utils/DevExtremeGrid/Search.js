import React,{useRef} from "react";
import SearchIcon     from '@material-ui/icons/Search';
import Input          from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Request }    from "../../../config/request";
import { Button  }    from "antd";
import _              from 'underscore';
import { useHotkeys } from 'react-hotkeys-hook';
import nuevo          from '../../../assets/icons/add.svg';
import deleteIcon 	  from '../../../assets/icons/delete.svg';
import guardar        from '../../../assets/icons/diskette.svg';
import cancelarEdit   from '../../../assets/icons/iconsCancelar.svg';
import './styles.css';
const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}

// export var focusedRowIndex= -1; 
// export const setFocusedRowIndex = (valor)=>{
//     focusedRowIndex = valor;
// }
// export const getFocusedRowIndex = ()=>{
//   return focusedRowIndex;
// }

export  const validateSave = (funcion) => {
    var guardar = true;
    var CampoRequerido = document.getElementsByClassName('requerido');
    if(CampoRequerido !== undefined && CampoRequerido !== null){
        for(let i = 0; i < CampoRequerido.length; i++){
            if(CampoRequerido[i].value.trim().length === 0){
                guardar=false;
                CampoRequerido[i].style.border = "1px solid rgb(228 52 54)";
            }else{
                CampoRequerido[i].style.border = "1px solid #6d74863b";
            }
        }
        if(!guardar){
            var posicion = 0;
            for(let i = 0; i < CampoRequerido.length; i++){
                if(CampoRequerido[i].value.trim().length === 0){
                    posicion = i;                        
                    break
                }
            }
            setTimeout(()=>{CampoRequerido[posicion].focus();},50);
        }
    }
    if(guardar && funcion != null){
        funcion();
    }
}

var  insertar, borrar;
const Search = (props) => {

    const datosRows       = props.rows;
    const addRow          = props.addRow;
    // const modifico        = props.modifico;
    const formName        = props.formName;
    const eliminar        = props.eliminarRow;
    const guardarData     = props.guardar;
    const buttonGuardar   = props.buttonGuardar;
    const handleChange    = props.handleChange;
    const cancelarProceso = props.cancelarProceso;
    const onKeyDownBuscar = props.onKeyDownBuscar;
    
    
    const [searchInputFocus , setSearchInputFocus ] = UseFocus();
    useHotkeys('f9', (e) =>{ 
        e.preventDefault();
        setSearchInputFocus();
    },{filterPreventDefault:true});

    React.useEffect(() => {
        var permiso = JSON.parse(sessionStorage.getItem('acceso'));
        var info = _.flatten(_.filter(permiso, function(item){
            return item.NOM_FORMA === formName;
        }));
        if( info.length > 0){
            insertar   = info[0].PUEDE_INSERTAR;
            borrar     = info[0].PUEDE_BORRAR;
        }else{
            insertar   = 'N';
            borrar     = 'N';
        }
    },[]);

    // const save = () => {
    //     var guardar = true;
    //     // var CampoRequerido = document.querySelectorAll('[className=requerido]');
    //     var CampoRequerido = document.getElementsByClassName('requerido');

    //     // var test = document.getElementsByClassName('requerido');
    //     // console.log( test );


    //     // return ;

    //     if(CampoRequerido !== undefined && CampoRequerido !== null){
    //         for(let i = 0; i < CampoRequerido.length; i++){
    //             if(CampoRequerido[i].value.trim().length === 0){
    //                 guardar=false;
    //                 CampoRequerido[i].style.border = "1px solid rgb(228 52 54)";
    //             }else{
    //                 CampoRequerido[i].style.border = "1px solid #6d74863b";
    //             }
    //         }
    //         if(!guardar){
    //             var posicion = 0;
    //             for(let i = 0; i < CampoRequerido.length; i++){
    //                 if(CampoRequerido[i].value.trim().length === 0){
    //                     posicion = i;                        
    //                     break
    //                 }
    //             }
    //             setTimeout(()=>{CampoRequerido[posicion].focus();},50);
    //         }
    //     }
    //     if(guardar){
    //         guardarData();
    //     }
    // }
    const cancelar = ()=>{
        var CampoRequerido = document.getElementsByClassName('requerido');
        if(CampoRequerido !== undefined && CampoRequerido !== null){
            for(let i = 0; i < CampoRequerido.length; i++){
                if(CampoRequerido[i].value.trim().length === 0){
                    CampoRequerido[i].style.border = "1px solid #6d74863b";
                }
            }
        }
        cancelarProceso();
    }

    return (
        <>
            <div className="paper-header-menu">
                <Button 
                    icon={<img src={nuevo} width="25"/>}         
                    className="paper-header-menu-button"
                    disabled={ insertar == 'S' ? false : true }
                    onClick={()=>addRow()}/>
                <Button
                    icon={<img src={guardar} width="20" style={{ marginBottom: '3px', }} />}
                    className="paper-header-menu-button"
                    ref={buttonGuardar}
                    disabled={ (insertar == 'S' || borrar == 'S') ? false : true }
                    onClick={()=>validateSave(guardarData)}/>
                <Button 
                    style={{marginRight:'5px', marginRight:'1px'}}
                    icon={<img src={deleteIcon} width="25"/>}
                    disabled={
                        _.isUndefined(datosRows) ? true : borrar == 'S' && datosRows.length > 0 ? false : datosRows.length == 0 ? true : true
                    }
                    className="paper-header-menu-button" 
                    onClick={eliminar}
                />
                {/* { modifico ? */}
                  <Button 
                      style={{marginLeft:'10px'}}
                      icon={<img src={cancelarEdit} width="25"/>}
                      className="paper-header-menu-button button-cancelar-alternativo button-cancelar-ocultar-visible" 
                      onClick={cancelar}
                  />
                {/* : null */}
                {/* }			 */}
                <Input
                    id="DevExtreme_Grid_buscador"
                    autoComplete="off"
                    onChange={handleChange}
                    onKeyDown={onKeyDownBuscar}
                    inputRef={searchInputFocus}
                    style={{
                        marginRight: '10px',
                        float: 'right',
                    }}
                    startAdornment={
                        <InputAdornment position="start" >
                            <SearchIcon />
                        </InputAdornment>
                    }
                    // onKeyDown={keyDown}
                />
            </div>
        </>
    );
};
export default Search;