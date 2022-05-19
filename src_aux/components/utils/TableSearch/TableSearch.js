








/// No seguira en vigencia esta tabla // se esta usando NewtablaSearch
















import React,{useEffect}                            from 'react';
import Table                                        from '@material-ui/core/Table';
import TableBody                                    from '@material-ui/core/TableBody';
import TableCell                                    from '@material-ui/core/TableCell';
import TableContainer                               from '@material-ui/core/TableContainer';
import TableHead                                    from '@material-ui/core/TableHead';
import TableRow                                     from '@material-ui/core/TableRow';
import InputAdornment                               from '@material-ui/core/InputAdornment';
import Input                                        from '@material-ui/core/Input';
import styles                                       from './Styles';
import SearchIcon                                   from '@material-ui/icons/Search';
import { ArrowDown, ArrowUp, setNumeroDeFila  }     from './Walkrows'
import $ 										    from "jquery";

//color de fondo de las filas
var backgroundRows = '#6c757d2e';

export const RefreshBackgroundColor = async (datosVacios) => {
	var filas = await document.getElementsByClassName('filasModal');
    
	if ((datosVacios === true) && (filas.length)) {
        $('tr.activarRowsModal').removeAttr('style');
        $('tr.activarRowsModal').removeClass('activarRowsModal');
		filas[0].classList.add("activarRowsModal");
		filas[0].style.background    = backgroundRows
		setNumeroDeFila(0);

	} else {

		if (filas.length > 0) {
			$('tr.activarRowsModal').removeAttr('style');
			$('tr.activarRowsModal').removeClass('activarRowsModal');
			filas[0].classList.add("activarRowsModal");
			filas[0].style.background    = '#6c757d2e';
			setNumeroDeFila(0);
		}
	}
}

document.addEventListener('keydown', (e) => {
    var background = 'background:#6c757d2e';
    var filas  = document.getElementsByClassName('activarRowsModal');
    if(filas.length > 0){
        if (e.key === "ArrowUp")ArrowUp(background);
        else if (e.key === "ArrowDown") ArrowDown(background);
        else return;
    }
});

document.addEventListener("click", function(){
    var filas  = document.getElementsByClassName('activarRowsModal');
    if(filas.length){
        document.getElementById("searchInput").focus();      
    }
 });

export default function TableSearch(props) {
    
    const classes =   styles();
    const [page       ] = React.useState(0);
    const [rowsPerPage] = React.useState(16);

    const onclickRows = async (ArrayData,teclado) =>{
        if(teclado){
            props.modalSetOnClick(await ArrayData,props.tipoDeBusqueda);
        }else{
            var filas = await document.getElementsByName(ArrayData[0]);
            $('tr.activarRowsModal').removeAttr('style');
            $('tr.activarRowsModal').removeClass('activarRowsModal');
            filas[0].style.background = backgroundRows;
            props.modalSetOnClick(await ArrayData,props.tipoDeBusqueda);
        }
        
    }
    const clickOnTheKeyboard  = (e) =>{        
            if (e.key === 'Enter'){
                var filas  = document.getElementsByClassName('activarRowsModal');
                if(filas.length){
                    var counTD = filas[0].cells.length
                    var ArrayData = []
                    for(var i = 0; i < counTD; i++){
                        ArrayData.push(filas[0].cells[i].innerText)
                    }
                    onclickRows(ArrayData,true)
                }
            }            
    }
    useEffect(() => {
        RefreshBackgroundColor(true);
        document.getElementById("searchInput").focus();      
	}, []);

    return (
        <div >
            <Input
                className={classes.input}
                style={{padding: '2px 0px !important',fontSize: '12px'}}
                id="searchInput"
                onChange={props.onInteractiveSearch}
                autoComplete="off"
                onKeyDown={(e)=>clickOnTheKeyboard(e)}
                value={props.searchInput}
                startAdornment={
                    <InputAdornment position="start" >
                        <SearchIcon className={classes.searchIcon} />
                    </InputAdornment>
                }
            />
            <TableContainer className={classes.container} >
                <Table onkeydown={clickOnTheKeyboard} id="mytable" className={classes.table} size="small" aria-label="a dense table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {props.columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    className={classes.header}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, width: column.width }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.columnTD} >
                    {props.dataSource.length > 0 ?
                        props.dataSource.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow name={Object.values(row)[0]}
                                    onKeyDown={(e)=>clickOnTheKeyboard(e)}
                                    onDoubleClick={()=>onclickRows(Object.values(row))} 
                                    className="filasModal"
                                    tabIndex={-1}
                                    key={Object.values(row)[0]}
                                >
                                    {props.columns.map((column) => {       
                                        const value = row[column.id];                                        
                                        return (
                                            <TableCell 
                                                className={classes.tdTable} 
                                                style={{maxWidth:100}} 
                                                key={column.ID} 
                                                align={column.align} >
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })
                     :
                        <TableRow>
                            <TableCell style={{background: `${backgroundRows}`}} colSpan={props.columns.length}>
                                <div style={{margin: '2px'}} >Registro no encontrado</div>
                            </TableCell>
                        </TableRow>
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
