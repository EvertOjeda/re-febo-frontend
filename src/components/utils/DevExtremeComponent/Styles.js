import { makeStyles } from '@material-ui/core/styles';

// estilos de las tablas y los iconos
export default makeStyles({
  selectHeader: {
    // justifyContent:   'flex-start !important',
    color:          'rgb(0 0 0 / 69%) !important',
    border:         '0px !important',
    fontSize:       '13px !important',
    height:         '24px !important',
    lineHeight:     '1.75 !important',
    borderRadius:   '1px',
    width:          '100%',
    background:     'transparent',
    padding:        '0px !important',
    borderradius:   '0px !important',
    textTransform:  'none !important',
    margin:         '0px',
  },
  orderBy: {
    fontSize:   '15px',
    visibility: 'collapse',
    marginLeft: '2px',
  },
  iconHead:{
    visibility:'collapse',
    fontSize:'15px', 
    marginTop:'5px', 
    marginLeft:'3px'
  },
  auxIconHead:{
    visibility:'visible',
    fontSize:'15px', 
    marginTop:'5px', 
    marginLeft:'3px'
  },
  checkbox: {
    color: '#c6cabf87 !important',
  },
});
