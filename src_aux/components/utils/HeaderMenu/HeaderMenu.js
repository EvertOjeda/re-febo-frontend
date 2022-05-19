import React, { memo }   from 'react';
import { Button }        from 'antd';
import nuevo             from '../../../assets/icons/add.svg';
import deleteIcon        from '../../../assets/icons/delete.svg';
import guardarIcon       from '../../../assets/icons/diskette.svg';
import cancelarEdit      from '../../../assets/icons/iconsCancelar.svg';
import left              from '../../../assets/icons/prev.svg';
import right             from '../../../assets/icons/next.svg';
import {VerificaPermiso} from '../VerificaPermiso';

var per_Insert = '', per_Delete = '';
const HeaderMenu = memo(({AddForm, SaveForm , deleteRows    , cancelar, 
                          NavigateArrow     , buttonSaveRef , formName,
                          vdelete,
                         }) => {
    React.useEffect(()=>{    
        let permisos = VerificaPermiso(formName)
        per_Delete  = permisos[0].borrar;
        per_Insert  = permisos[0].insertar;
    },[])

    return (
        <div className="paper-header-menu">
            <Button
                icon={<img src={nuevo} width="25"/>}         
                className="paper-header-menu-button"
                disabled={per_Insert == 'S' ? false : true}
                onClick={AddForm}
            />
            <Button
                icon={<img src={guardarIcon} width="20" style={{ marginBottom: '3px' }} />}
                className="paper-header-menu-button"
                ref={buttonSaveRef}
                style={{padding:'0px',height:"33px"}}
                disabled={per_Delete == 'S' || per_Insert == 'S' ? false : true}
                onClick={SaveForm}
            />
            {
                vdelete == false ? null : 
                <Button 
                    style={{marginRight:'5px', marginRight:'1px'}}
                    icon={<img src={deleteIcon} width="25"/>}
                    className="paper-header-menu-button" 
                    disabled={per_Delete == 'S' ? false : true}
                    onClick={deleteRows}
                />
            }
            
            <Button
                id="left-arrow"
                icon={<img src={left} width="25"  id="left-arrow"/>}
                className="paper-header-menu-button"
                onClick={()=>NavigateArrow('left')}
            />
            <Button 
                id="right-arrow"
                icon={<img src={right} width="25" id="right-arrow"/>}
                className="paper-header-menu-button"
                onClick={()=>NavigateArrow('right')}
            />
            <Button 
                style={{marginLeft:'10px'}}
                icon={<img src={cancelarEdit} width="25"/>}
                className={`${formName}-cancelar button-cancelar-ocultar-visible-grid paper-header-menu-button`}
                onClick={cancelar}
            />
      </div>
    );
});

export default HeaderMenu;