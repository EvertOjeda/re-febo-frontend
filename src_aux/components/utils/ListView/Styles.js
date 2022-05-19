import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 300,
  },
  table: {
    minWidth: 650,
  },
  tdTable: {
    fontSize:     '0.68rem !important',
    padding:      '1px 1px 2px 5px !important',
    overflow:     'hidden',
    textOverflow: 'ellipsis',
    whiteSpace:   'nowrap',
  },
  body: {
    fontSize: 14,
  },
  trvacio: {
    textAlign: 'center',
    color:     '#757575',
    fontSize:  '15px',
  },
  visuallyHidden: {
    fontSize: '23px',
    margin:   '0px'
  },
  orderBy: {
    fontSize:   '15px',
    visibility: 'collapse',
    marginLeft: '2px',
  },
  hover: {
    "&:hover": {
      backgroundColor: '#1987540f',
    },
    fontSize:'12px'
  },
  selectHeader: {
    color:            'rgb(0 0 0 / 69%) !important',
    border:           '0px !important',
    fontSize:         '13px !important',
    height:           '24px !important',
    lineHeight:       '1.75 !important',
    background:       'transparent',
    padding:          '0px !important',
    borderradius:     '0px !important',
    textTransform:    'none !important'
  },
  header:{
    backgroundColor: "#c6cabf",
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
