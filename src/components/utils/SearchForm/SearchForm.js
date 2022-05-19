
import React, { memo }       from 'react';
import {Button}              from "antd";
import nuevo                 from '../../../assets/icons/add.svg';
import Input                 from '@material-ui/core/Input';
import InputAdornment        from '@material-ui/core/InputAdornment';
import SearchIcon            from '@material-ui/icons/Search';
import Guardar               from '../../../assets/icons/diskette.svg';
import deleteIcon 	         from '../../../assets/icons/delete.svg';
import cancelarEdit          from '../../../assets/icons/iconsCancelar.svg';
import  { VerificaPermiso }  from '../VerificaPermiso';

const SearchForm = memo((props) => {

    const handleChange    =  props.handleChange;
    const GuardarRow      =  props.guardarRow;
    const eliminarRow     =  props.eliminarRow;
    const buttonGuardar   =  props.buttonGuardar;
    const cancelarProceso =  props.cancelarProceso;
    const addRow          =  props.addRow;
    const buttonAddRef    =  props.buttonAddRef;
    const formName        =  props.formName;
    const onKeyDownBuscar =  props.onKeyDownBuscar;
    
    
    return (
        <>
           <div className="paper-header-menu">
                <Button 
                    id="prueba-button-add"
                    icon={<img src={nuevo}  width="25"/>}         
                    className="paper-header-menu-button"
                    onClick={addRow}
                    ref={buttonAddRef}
                    disabled={VerificaPermiso(formName)[0].insertar == 'S' ? false : true}
                />
                <Button         
                    icon={<img src={Guardar} width="20" style={{ marginBottom: '3px', }} />}         
                    onClick={GuardarRow}
                    ref={buttonGuardar}
                    className="paper-header-menu-button"
                />
                <Button
                    style={{marginRight:'5px', marginRight:'1px'}}
                    icon={<img src={deleteIcon} width="25"/>}         
                    className="paper-header-menu-button"
                    onClick={(e)=>eliminarRow(e)} 
                    disabled={VerificaPermiso(formName)[0].borrar == 'S' ? false : true}                    
                />
                <Button 
                    style={{marginLeft:'10px'}}
                    icon={<img src={cancelarEdit} width="25" />}
                    className="paper-header-menu-button button-cancelar-alternativo button-cancelar-ocultar-visible"
                    onClick={cancelarProceso}
                />
                <Input
                    id="searchInputArticulo"
                    autoComplete="off"
                    onChange={handleChange}
                    onKeyDown={onKeyDownBuscar}
                    style={{marginRight: '10px', float: 'right'}}
                    startAdornment={
                        <InputAdornment position="start" >
                            <SearchIcon />
                        </InputAdornment>
                    }
                />
            </div>
        </>
    );
});

export default SearchForm;