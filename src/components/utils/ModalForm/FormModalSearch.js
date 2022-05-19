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
    background: 'linear-gradient(45deg, #717574  30%, #650608d4 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    fontSize: '11px',
    margin: '5px 3px 3px',
    height: 25,
    padding: '5px 9px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  ButtonAceptar:{
    background: 'linear-gradient(45deg, #717574  30%, #053c11 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    fontSize: '11px',
    margin: '5px 3px 3px',
    height: 25,
    padding: '5px 11px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },    
}));

export default function FormModalSearch(props) {

  const classes          = styles();
  const theme            = useTheme();
  const fullScreen       = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    props.showsModal(false);
  };

  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            width:'45%'
          },
        }}
        className={classes.root}
        fullScreen={fullScreen}
        open={props.setShows}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        >
        <DialogTitle style={{padding:'5px 20px', background: '#d9d9d9a1'}}>
          <div className={classes.title}>{props.title}</div>
        </DialogTitle>
    
        <DialogContent style={{height:'380px', padding:'0px 20px 13px'}}>          
            {props.componentData}
        </DialogContent>

        <DialogActions style={{height: '1.9rem',background: '#d9d9d9a1'}}>

          {props.descripcionClose === "" || props.descripcionClose === null ?
                null
            :
            <Button className={clsx(classes.ButtonCancelar)} onClick={handleClose} >
              {props.descripcionClose}
            </Button>
          }
          {props.descripcionButton === "" || props.descripcionButton === null ?
                null
            :
             props.actionAceptar === "" || props.actionAceptar === null || props.actionAceptar === undefined ?           
              <Button className={clsx(classes.ButtonAceptar)} onClick={handleClose} autoFocus>
                {props.descripcionButton}
              </Button> 
            :
              <Button className={clsx(classes.ButtonAceptar)} onClick={props.actionAceptar} autoFocus>
                {props.descripcionButton}
              </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}