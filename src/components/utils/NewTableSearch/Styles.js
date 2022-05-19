import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
    root: {
        width: '100%',
    },
    container: {    
        maxHeight: 330,
        boxShadow: '-7px 6px 20px 0px rgb(113 117 116 / 65%) !important',
        borderRadius:'2px'
    },
    table: {
        minWidth: 500,
    },
    header:{
        backgroundColor: '#717574',
        color: '#e7e7e7 !important'
    },
    input: {
        float: 'right',
        margin: '0px 60px 10px',
        width: "40%",
        marginRight: '1px'
    },
    searchIcon: {
        fontSize: '18px',
        marginBottom:'0px'
    },
    Pagination:{
        "& .MuiToolbar-regular": {
            minHeight: '35px',
        },"& .MuiTablePagination-caption":{
            color: '#717574 !important',
            fontSize:'13px'
        }
    },
    columnTD:{
        "& .MuiTableCell-root": {
            color: '#717574 !important',
            fontSize: '11.6px !important',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
        },"& .MuiTableCell-body":{
            borderColor: '#94949459 !important',
        }
    },
    tdTable: {
        fontSize: '0.68rem !important',
        padding:'2px !important',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
});
