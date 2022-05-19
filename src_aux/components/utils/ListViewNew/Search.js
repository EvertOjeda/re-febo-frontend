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
import {setModifico}  from './ButtonCancelar'

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}

export var focusedRowIndex= -1; 
export const setFocusedRowIndex = (valor)=>{
    focusedRowIndex = valor;
}
export const getFocusedRowIndex = ()=>{
  return focusedRowIndex;
}
var  insertar, borrar;

const Search = (props) => {
    
    const [searchInputFocus , setSearchInputFocus ] = UseFocus();
    useHotkeys('f9', (e) =>{ 
        e.preventDefault();
        setSearchInputFocus();
    },{filterPreventDefault:true});

    React.useEffect(() => {
        var permiso = JSON.parse(sessionStorage.getItem('acceso'));
        var info = _.flatten(_.filter(permiso, function(item){
            return item.NOM_FORMA === props.formName;
        }));
        if( info.length > 0){
            insertar   = info[0].PUEDE_INSERTAR;
            borrar     = info[0].PUEDE_BORRAR;
        }else{
            insertar   = 'N';
            borrar     = 'N';
        }
    },[]);
    
    const urlBuscador   = props.urlBuscador;
    const eliminar      = props.showModalDelete;
    const guardarData   = props.guardar;
    const buttonGuardar = props.buttonGuardar;
    
    const setDataRows = (datosRows) =>{
        props.listFiltro(datosRows)
    }
    const handleChange = async(e) =>{
        var value = e.target.value;
        if(value.trim().length === 0){
            value = 'null'
        }
        try {
            var url            = urlBuscador;
            var method         = "POST";
            const cod_empresa  = sessionStorage.getItem('cod_empresa');        
            await Request( url,method,{'value':value, 'cod_empresa': cod_empresa, filter:props.headSeled, })
                .then( response =>{
                setDataRows(response.data.rows)
            });
        } catch (error) {
            console.log(error);
        }
    }
    const cancelarProceso = () =>{
        setModifico(props.formName)
        props.funcionCancelar();
    }
    const keyDown = async (e)=> {

        var key = e.which;
        if(key == '38'){
			e.preventDefault();
            var index = await getFocusedRowIndex() - 1;
			if(index < 0){ 
                index = 0;
			}
			setFocusedRowIndex(index);
            props.grid.current.instance.focus(props.grid.current.instance.getCellElement(index,0));
        }
		if(key == '40'){
			e.preventDefault();
            var index = await getFocusedRowIndex() + 1;
			if(index > props.setDatosRows.length - 1){
				index = props.setDatosRows.length - 1;
			}
			setFocusedRowIndex(index);
            props.grid.current.instance.focus(props.grid.current.instance.getCellElement(index,0));
		}
    }

    return (
        <>
            <div className="paper-header-menu">
                <Button 
                    icon={<img src={nuevo} width="25"/>}         
                    className="paper-header-menu-button"
                    disabled={ insertar == 'S' ? false : true }
                    onClick={()=>props.addRow()}/>
                <Button
                    icon={<img src={guardar} width="20" style={{ marginBottom: '3px', }} />}
                    className="paper-header-menu-button"
                    ref={buttonGuardar}
                    disabled={ (insertar == 'S' || borrar == 'S') ? false : true }
                    onClick={()=>guardarData()}/>
                <Button 
                    style={{marginRight:'5px', marginRight:'1px'}}
                    icon={<img src={deleteIcon} width="25"/>}
                    disabled={
                        _.isUndefined(props.datosRows) ? true : borrar == 'S' && props.datosRows.length > 0 ? false : props.datosRows.length == 0 ? true : true
                    }
                    className="paper-header-menu-button" 
                    onClick={eliminar}
                />
                {/* { props.modifico ? */}
                  <Button 
                      style={{marginLeft:'10px'}}
                      icon={<img src={cancelarEdit} width="25"/>}
                      className={`${props.formName}-cancelar button-cancelar-ocultar-visible-grid paper-header-menu-button`}
                      onClick={cancelarProceso}
                  />
                {/* : null
                }			 */}
                <Input
                    id="input-with-icon-adornment"
                    autoComplete="off"
                    onChange={handleChange}
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
                    onKeyDown={keyDown}
                />
            </div>
        </>
    );
};
export default Search;