import React, {useRef,useEffect} from "react";
import SearchIcon                from '@material-ui/icons/Search';
import Input                     from '@material-ui/core/Input';
import InputAdornment            from '@material-ui/core/InputAdornment';
import {Request }                from "../../../config/request";
import {Button}                  from "antd";
import {getDatosEdit}            from './List'
import {useHistory }             from "react-router-dom";
import _                         from 'underscore';
import { Link }                  from 'react-router-dom';
import { useHotkeys }            from 'react-hotkeys-hook';
import nuevo                     from '../../../assets/icons/add.svg';
import deleteIcon 	             from '../../../assets/icons/delete.svg';
import editIcon 	             from '../../../assets/icons/edit.svg';

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
var consultar, insertar, actualizar, borrar;

const Search = (props) => {
    
    const [searchInputFocus , setSearchInputFocus ] = UseFocus();
    useHotkeys('f9', (e) =>{ 
        e.preventDefault();
        setSearchInputFocus();
    },{filterPreventDefault:true});

    useEffect(() => {
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
    const formLocation = props.formLocation;
    const history      = useHistory();
    var arrayHead      = props.headSeled;

    const setDataRows  = (datosRows) =>{
        props.listFiltro(datosRows)
    }
    const handleChange = async(e) =>{
        var value = e.target.value;
        if(value.trim().length === 0){
            value = 'null'
        }
        if(props.headSeled.length === 0){
            arrayHead.push(props.nameDefault);
        }
        try {
            var url     = props.urlBuscador;
            var method  = "POST";
            await Request( url,method,{'value':value, 'cod_empresa': props.cod_empresa, filter:arrayHead, } )
                .then( response =>{
                    if(response.data.rows){
                        setDataRows(response.data.rows)
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }
    const eliminarRow = (e) =>{
        props.eliminarRows(e)
    }
    const actionsLink = () =>{
        var valuesDatosEdit = getDatosEdit()
        history.push({
                        pathname:`${formLocation}modificar`,
                        state: {'column':props.ID, 
                        'rows': valuesDatosEdit !== undefined ? valuesDatosEdit : null, 
                        'OpcionChecbox':props.columns},            
                    })
    }
    return (
        <>
           <div className="paper-header-menu">
                <Link 
                    disabled={
                        insertar == 'S' ? false : true
                    }
                    to={{
                        pathname: formLocation + 'nuevo',
                    }}
                    >
                        <Button 
                            icon={<img src={nuevo} width="25"/>}         
                            className="paper-header-menu-button" 
                        />
                </Link>
               
                <Button 
                    icon={<img src={editIcon} width="25"/>}         
                    className="paper-header-menu-button"
                    disabled={props.datosRows.length == 0}
                    onClick={actionsLink}
                />
                    
                <Button 
                        // id  ={getDatosEdit() !== undefined ? 'delete_' +getDatosEdit().ID : null}
                        key ={getDatosEdit() !== undefined ? getDatosEdit().ID : null} 
                        aria-label="delete" onClick={(e)=>eliminarRow(e)} style={{
                            marginRight:'5px',
                        }}
                    disabled={
                               (borrar === 'S' && props.datosRows.length > 0) ? false : props.datosRows.length == 0 ? true : true
                             }
                    icon={<img src={deleteIcon} width="25"/>}         
                    className="paper-header-menu-button"
                />

                <Input
                    id="input-with-icon-adornment"
                    autoComplete="off"
                    onChange={handleChange}
                    inputRef={searchInputFocus}
                    style={{ marginRight: '10px', float: 'right'}}
                    startAdornment={
                        <InputAdornment position="start" >
                            <SearchIcon />
                        </InputAdornment>
                    }
                />
            </div>
            {/* <div className="paper-header-menu">
                {insertar === 'S' 
                    ?  <Link to={formLocation + 'nuevo'}>
                            <Button 
                                icon={<img src={nuevo} width="25"/>}         
                                className="paper-header-menu-button" 
                                />
                        </Link>
                    :   null
                }
               { props.datosRows.length > 0 
                    ?
                        <Button 
                            icon={<img src={editIcon} width="25"/>}         
                            className="paper-header-menu-button"
                            onClick={actionsLink}
                        />
                    : null
               }
               

                {borrar === 'S' && props.datosRows.length > 0

                    ?   
                        <Button 
                                // id  ={getDatosEdit() !== undefined ? 'delete_' +getDatosEdit().ID : null} 
                                key ={getDatosEdit() !== undefined ? 'delete_' +getDatosEdit().ID : null} 
                                aria-label="delete" onClick={(e)=>eliminarRow(e)} style={{
                                    marginRight:'5px',
                                }}
                            icon={<img src={deleteIcon} width="25"/>}         
                            className="paper-header-menu-button" 
                        />
                    :   null
                }
                <Input
                    id="input-with-icon-adornment"
                    autoComplete="off"
                    onChange={handleChange}
                    inputRef={searchInputFocus}
                    style={{ marginRight: '10px', float: 'right'}}
                    startAdornment={
                        <InputAdornment position="start" >
                            <SearchIcon />
                        </InputAdornment>
                    }
                />
            </div> */}
        </>
    );
};
export default Search;