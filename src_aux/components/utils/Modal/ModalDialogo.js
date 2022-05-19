import React                                from 'react';
import clsx                                 from 'clsx';
import Button                               from '@material-ui/core/Button';
import Dialog                               from '@material-ui/core/Dialog';
import DialogActions                        from '@material-ui/core/DialogActions';
import DialogContent                        from '@material-ui/core/DialogContent';
import DialogTitle                          from '@material-ui/core/DialogTitle';
import useMediaQuery                        from '@material-ui/core/useMediaQuery';
import { useTheme }                         from '@material-ui/core/styles';
import { makeStyles }                       from '@material-ui/core/styles';


import alerta  from '../../../assets/icons/advertencia.svg';
import error   from '../../../assets/icons/error.svg';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const styles = makeStyles(theme => ({
  root: {
    "& .MuiPaper-root": {
      backgroundColor: '#ffffff !important;' 
    },
  },
  title: {
    maxWidth: '50%',
    fontSize: '15px',
    fontFamily: 'system-ui',
    color: '#717574',
  },
  ButtonCancelar:{
    background: '#BB1111',
    borderRadius: 3,
    border: 0,
    color: 'white',
    fontSize: '11px',
    margin: '5px 3px 3px',
    height: 30,
    padding: '5px 9px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  ButtonAceptar:{
    background: '#115511',
    borderRadius: 3,
    border: 0,
    color: 'white',
    fontSize: '11px',
    margin: '5px 3px 3px',
    height: 30,
    padding: '5px 11px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },      
}));

const FocusButton = (props) => {
  const { handleClose, focusVisible, classes, descripcionButton} = props;
  const classesName                  = styles();
  const actionRef                    = React.createRef();

  React.useLayoutEffect(() => {
    if(actionRef.current !== null){
      if (focusVisible && actionRef.current) {
        // actionRef.current.focusVisible();
        setTimeout(()=>actionRef.current?.focusVisible(),140);
      } 
    }
  }, [focusVisible,actionRef]); 
  return (
    <Button className={classesName[classes]} action={actionRef} onClick={handleClose}>
      {descripcionButton}
    </Button>
  );
}

export default function ModalDialogo(props) {

  const classes             = styles();
  const theme               = useTheme();
  const fullScreen          = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            width:'30%'
          },
        }}
        className={classes.root}
        fullScreen={fullScreen}
        open={props.setShow}
        onClose={props.onClose}
        aria-labelledby="responsive-dialog-title"
        >
        <DialogTitle style={{padding:'5px 20px', background: '#d9d9d9a1'}}>
          <div className={classes.title}>{props.title}</div>
        </DialogTitle>
    
        <DialogContent style={{padding:'10px 20px 13px'}}>          
            <div>
              {!(props.imagen === "" || props.imagen === null || props.imagen === undefined ) ?
                props.imagen === "error" ?
                  <img src={error} width="25" style={{margin:"0px 15px 0px 0px"}}/>
                : 
                  props.imagen === 'alerta' ?
                    <img src={alerta} width="25" style={{margin:"0px 15px 0px 0px"}}/>
                :
                null
              :
              null
              }
              {props.mensaje}
            </div>
        </DialogContent>

        <DialogActions style={{height: '3rem',background: '#d9d9d9a1'}}>
          {props.positiveButton === "" || props.positiveButton === null || props.positiveButton === undefined ? 
              <div className={clsx(classes.BotonAceptar)}>
                <Button className={clsx(classes.ButtonAceptar)} onClick={props.positiveAction} hidden>
                  {props.positiveButton}
                </Button> 
              </div>  
            : 
            <div className={clsx(classes.BotonAceptar)}>   
              <FocusButton 
                classes={"ButtonAceptar"} 
                handleClose={props.positiveAction}
                focusVisible={props.setShow}
                descripcionButton={props.positiveButton}
              />
            </div>
          }
          {props.negativeButton === "" || props.negativeButton === null || props.negativeButton === undefined ?
                null
            :
            !(props.positiveButton === "" || props.positiveButton === null || props.positiveButton === undefined) ?
                <Button className={clsx(classes.ButtonCancelar)} onClick={props.negativeAction}>
                  {props.negativeButton}
                </Button>
            :
            
            <FocusButton 
              classes={"ButtonCancelar"} 
              handleClose={props.negativeAction}
              focusVisible={props.setShow}
              descripcionButton={props.negativeButton}
            />
          }
        </DialogActions>
     
      </Dialog>
    </div>
  );
}