import React, { useEffect, useState } 			from 'react';
import { Typography,Radio } 					from 'antd';
import Paper 									from '@material-ui/core/Paper';
import Table 									from '@material-ui/core/Table';
import TableBody 								from '@material-ui/core/TableBody';
import TableCell 								from '@material-ui/core/TableCell';
import TableContainer 							from '@material-ui/core/TableContainer';
import TableHead 								from '@material-ui/core/TableHead';
import TablePagination 							from '@material-ui/core/TablePagination';
import TableRow 								from '@material-ui/core/TableRow';
import IconButton 								from '@material-ui/core/IconButton';
import { BsChevronDown, BsChevronUp } 			from "react-icons/bs";
import $ 										from "jquery";
import styles 									from './Styles';
import Search 									from './Search';
import { OrderBy } 								from './OrderBy';
import Button 									from '@material-ui/core/Button';
import { TablePaginationActions } 				from './LastnextPagination';
import { BiSearchAlt } 							from "react-icons/bi";
import Checkbox 								from '@material-ui/core/Checkbox';

import {
	ArrowDown,
	ArrowUp,
	setNumeroDeFila,
	calculoPaginacion,
	setPaginacion,
	setCountData
} from './Walkrows';

import { useHotkeys } from 'react-hotkeys-hook';
const { Title } = Typography;

document.addEventListener('keydown', (e) => {
	var background = 'background:#c4c9cd2e';
	if (e.key === "ArrowUp")ArrowUp(background);
	else if (e.key === "ArrowDown") ArrowDown(background);
	else return;
});

//renderiza el scroll de la tabla
export const RefreshBackgroundColor = async (datosVacios)  => {
	var filas 			     	 	= await document.getElementsByClassName('filas');

	if ((datosVacios === true) && (datosVacios !== undefined)) {
		filas[0].classList.add("activar");
		filas[0].style.background    = '#c4c9cd2e'
		setNumeroDeFila(0);
	} else {
		if (filas.length) {
			$('tr.activar').removeAttr('style');
			$('tr.activar').removeClass('activar');
			filas[0].classList.add("activar");
			filas[0].style.background    = '#c4c9cd2e';
			setNumeroDeFila(0);
		}
	}
}

function radioRows(opcion, value) {
	var valor = "";
	if(opcion !== null && opcion !== undefined && opcion.length > 0){
		valor = opcion.filter((item)=>{
			if(item.value === value){
				return item;
			}
		})
	}

	return (
		<>
			{ valor !== "" && valor !== undefined && valor !== null  ?
				<Radio.Group value={valor[0].value}>
				{opcion.map((items) => (						
						<Radio key={items.value} value={items.value}>{items.label}</Radio>
					))}	
				</Radio.Group>
				:   
				null
			 }
		</>
	)
}

var DatosFilterEdit = {};
export const getDatosFilterEdit = ()=>{
	return DatosFilterEdit
}
export const setDatosFilterEdit = (values)=>{
	DatosFilterEdit = values;
}

var DatosEdit = {};
export const getDatosEdit = ()=>{
 return DatosEdit
}
export const setDatosEdit = (values)=>{
	DatosEdit = values;
}

//funcion Principal
const ListView = (props) => {

	useHotkeys('ctrl+c', (e) =>{ 
        e.preventDefault();
		e.stopPropagation();
		props.history.push(formLocation + 'nuevo');
    },{filterPreventDefault:true});

	const classes 						= styles();
	const columns 						= props.columns;
	const title							= props.title;
	const formLocation 					= props.formLocation;
	const eliminar 						= props.eliminar;

	const [page, setPage] 				= React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(15);
	const handleChangePage				= (event, newPage) => {
		setPaginacion(newPage)
		setPage(newPage);
		RefreshBackgroundColor();
	};
	// const handleChangeRowsPerPage = async (event) => {
	// 	setRowsPerPage(+event.target.value);
	// 	setPage(0);
	// };

	const [Datosrows, setDatosRows] = useState(props.data);
	setCountData(Datosrows.length);
	
	const listFiltro 				= async (datos) => {
		setPage(0);
		setPaginacion(0);
		setDatosRows(datos)
		
		setDatosFilterEdit(datos)

		setDatosEdit(datos[0])
		props.setData(datos)
		props.setDeleteId(datos[0])
		
		if (datos.length === 0) {
			RefreshBackgroundColor(true)
		} else {
			RefreshBackgroundColor(false)
		}
		
	}
	var idUnico = 0;
	const onClickRows   = (e,row) => {
		const idFila 	    = e.currentTarget.id;	
	;
		if (idFila) {
			const filas = document.getElementById(idFila);
			$('tr.activar').removeAttr('style');
			$('tr.activar').removeClass('activar');
			$(filas).addClass('activar');
			filas.style.backgroundColor    = '#c4c9cd2e';
			setNumeroDeFila(idFila);
		}
		setDatosEdit(row)
		props.setDeleteId(row);
	}
	const nextPaginacion = (e, totalPerPage) => {
		setPage(calculoPaginacion(e.key, totalPerPage));
	};
	const keydownListener =  (e) => {
		if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			nextPaginacion(e, rowsPerPage)
			RefreshBackgroundColor();
		}
		if(e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight"){
			setTimeout(async()=>{
				var valorId   = document.getElementsByClassName('activar');
					if(valorId.length > 0){
						var idActivar = document.getElementById(valorId[0].id);
					if(idActivar){
						var rows =  getDatosFilterEdit().filter((item)=>{
							if(item.ID == idActivar.attributes.name.value) return item
						})
						setDatosEdit(rows[0])
						props.setDeleteId(rows[0]);
					}
				}
			},5);
		}
		// 	let tecla = e.which || e.keyCode;
		// // console.log(tecla);
		// // Evaluar si se ha presionado la tecla Ctrl:
		// if ( e.ctrlKey ) {
		// 	// Evitar el comportamiento por defecto del nevagador:
		// 	e.preventDefault();
		// 	e.stopPropagation();
			
		// 	// Mostrar el resultado de la combinación de las teclas:
		// 	if ( tecla === 85 )
		// 	console.log("Ha presionado las teclas Ctrl + U");
				
		// 	if ( tecla === 83 )
		// 	console.log("Ha presionado las teclas Ctrl + S");

		// 	if ( tecla === 78 )
		// 	console.log("Ha presionado las teclas Ctrl + N");
		// }
	}
	useEffect(() => {  
		window.addEventListener("keydown", keydownListener, true);  
		return () => window.removeEventListener("keydown", keydownListener, true);
	}, [keydownListener]);
	//esto pinta la primera fila cuando se refresca la pantalla
	useEffect(() => {
		setDatosRows(props.data);
		RefreshBackgroundColor();
		setDatosFilterEdit(props.data);
		setDatosEdit(props.data[0]);
		props.setDeleteId(props.data[0])	
		props.setData(props.data);
		setPaginacion(0);
	},[props.data]);

	const [ascDesc, setAscDesc] = React.useState(false);
	// function que ordena las columna de menor a mayor
		const datosOrderBy 		= async (columnOrderBy) => {	
		const DatosOrdenado 	= await OrderBy(columnOrderBy, Datosrows);
		RefreshBackgroundColor();
		setDatosEdit(DatosOrdenado[0]);
		props.setDeleteId(DatosOrdenado[0]);
		setDatosRows(DatosOrdenado);
		setAscDesc(!ascDesc);
	}
	//cambiar style y hacer que sea visible los iconos
	const mouseOver  = (id)=> {
		const idICon 	 = document.getElementById(id);
		// console.log(idICon);
		if(idICon != null){
			idICon.style.visibility = 'visible';
		}
	}
	//ocultamos devuelta el icono
	const onMouseOut = (id)=> {
		const idICon 	 = document.getElementById(id);
		if(idICon != null){
			idICon.style.visibility = 'collapse';
		}
	}

	const [headSeled, setheadSeled] = useState([props.columBuscador])
	const selectedHead              = async (idHead) => {

		var iconohead = await document.getElementsByName(idHead);
		var exists    = await headSeled.includes(idHead);

		if(exists){
			iconohead[0].style.visibility = 'collapse'
			const indice = headSeled.indexOf(idHead)
			headSeled.splice(indice, 1);
		}else{
			setheadSeled(await headSeled.concat(idHead));
			iconohead[0].style.visibility = 'visible';
		}
	}
	//esta funcion controla las validaciones de los checkbox
	const opcionComparar = (values, opcion) => {
		var check = false;
		if(opcion !== undefined){
			if(opcion.length > 0){
				for (let i = 0; i < opcion.length; i++) {
					if(values === opcion[i]){
						check=true;
					}
				}
			}
		}
		return check;
	}
	
	const funcionPaginacion = ({ from, to, count }) =>{
		if(count){
			return `${from}-${to} de ${count !== -1 ? count : `mas que ${to}`}`; 
		}else{
			return `${0}-${0} de ${0}`; 
		}
	}

	return (
		<div className="paper-container" >
			<Paper className="paper-style">
				<div className="paper-header">
					<Title level={4} className="title-color">{title}</Title>
				</div>
				{/* <Spin size="large" spinning={activarSpinner}>  */}
				<Search 
					datosRows={Datosrows}
					listFiltro={listFiltro} 
					formLocation={formLocation} 
					headSeled={headSeled}
					urlBuscador={props.urlBuscador}
					cod_empresa={props.cod_empresa}
					columns={columns}
					ID={props.ID}
					eliminarRows={eliminar}
					columnID={props.columnID}
					formName={props.formName}
					nameDefault={props.columBuscador}
				  />
				
				<TableContainer>
					<Table className={classes.table} size="small" aria-label="a dense table" stickyHeader>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell 
										onMouseOver = {()  => { mouseOver(column.ID)  }}
										onMouseOut  = {()  => { onMouseOut(column.ID) }}
										className   = {classes.header}
										key         = {column.ID}
										style       = {{minWidth: column.minWidth, width: column.width, textAlign:column.align}}
									>
												
										{column.alignID === "right" ?
											opcionComparar(column.ID, props.notOrderByAccion)
											?
												null
											: 
												<IconButton
													className={classes.orderBy}
													id={column.ID}
													onClick={(e) => datosOrderBy(column.ID)}
													>
													{ascDesc ?
														<BsChevronDown style={{color:'rgb(83 83 83)',marginRight:'10'}} />
													:
														<BsChevronUp   style={{color:'rgb(83 83 83)',marginRight:'10'}}  />
													}
												</IconButton>
												:
											null
										}

										{ opcionComparar(column.ID, props.doNotsearch) ?
											<Button className={classes.selectHeader} disabled >
												{column.label}
											</Button>
											:
											<Button className={classes.selectHeader} onClick={(e) => selectedHead(column.ID)} >
												{column.label}
												{column.ID === props.columBuscador && column.alignID !== "right"
													?
														<i name={column.ID} className={classes.auxIconHead}>
															<BiSearchAlt/>
														</i>
														:
														<i name={column.ID} className={classes.iconHead}>
															<BiSearchAlt/>
														</i>
												}
											</Button>
										}
										{column.alignID !== "right" ?
										opcionComparar(column.ID, props.notOrderByAccion)
											?
												null
											: 
												<IconButton
													className={classes.orderBy}
													id={column.ID}
													onClick={(e) => datosOrderBy(column.ID)}>
													{ascDesc ?
														<BsChevronDown style={{color:'rgb(83 83 83)'}} />
													:
														<BsChevronUp   style={{color:'rgb(83 83 83)'}}  />
													}
												</IconButton>
												:
											null
										}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{Datosrows.length > 0 ?
								Datosrows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
									return (
										<TableRow className="filas" id={idUnico++}  name={row.ID} key={idUnico} onClick={(e) => onClickRows(e,row)} tabIndex={-1} >
											{columns.map((column) => {
												const value = row[column.ID];
													return (
														<TableCell style={{maxWidth:100}} className={classes.tdTable} key={column.ID} align={column.align}>
															{column.checkbox && (column.options !== undefined || Array.isArray(column.options))?
															  opcionComparar(value, column.options)?
															 	 <Checkbox 
																	key={value}
																	color="default"
																	className={classes.checkbox} 
																	size="small"
																	defaultChecked={true}
																	disabled={true}/>
															 	:
																 <Checkbox
																 	className={classes.checkbox} 
																 	key={value}
																	color="default"
																	size="small"
																	defaultChecked={false}
																	disabled={true} />
																
																: column.radio && (column.options !== undefined || Array.isArray(column.options))?
																	radioRows(column.options, value)
																:
																column.format && typeof value === 'number' ? new Intl.NumberFormat("de-DE").format(value) : value
															}
														</TableCell>
														
													);
											})}
										</TableRow>
									);
								})
								:
								<TableRow>
									<TableCell className="filas" colSpan={columns.length}>
										Registro no encontrado
									</TableCell>
								</TableRow>
							}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					labelDisplayedRows={funcionPaginacion}
					count={Datosrows.length > 0 ? Datosrows.length : 0}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					// onChangeRowsPerPage={handleChangeRowsPerPage}
					ActionsComponent={TablePaginationActions}
				/>
				{/* </Spin> */}
			</Paper>
		</div>
	);
}
export default ListView;

// import React, { useEffect, useState } 			from 'react';
// import { Typography,Radio } 					from 'antd';
// import Paper 									from '@material-ui/core/Paper';
// import Table 									from '@material-ui/core/Table';
// import TableBody 								from '@material-ui/core/TableBody';
// import TableCell 								from '@material-ui/core/TableCell';
// import TableContainer 							from '@material-ui/core/TableContainer';
// import TableHead 								from '@material-ui/core/TableHead';
// import TablePagination 							from '@material-ui/core/TablePagination';
// import TableRow 								from '@material-ui/core/TableRow';
// import IconButton 								from '@material-ui/core/IconButton';
// import { BsChevronDown, BsChevronUp } 			from "react-icons/bs";
// import $ 										from "jquery";
// import styles 									from './Styles';
// import Search 									from './Search';
// import { OrderBy } 								from './OrderBy';
// import Button 									from '@material-ui/core/Button';
// import { TablePaginationActions } 				from './LastnextPagination';
// import { BiSearchAlt } 							from "react-icons/bi";
// import Checkbox 								from '@material-ui/core/Checkbox';
// import { Spin }                       			from 'antd';

// import {
// 	ArrowDown,
// 	ArrowUp,
// 	setNumeroDeFila,
// 	calculoPaginacion,
// 	setPaginacion,
// 	setCountData
// } from './Walkrows';

// import { useHotkeys } from 'react-hotkeys-hook';
// const { Title } = Typography;

// document.addEventListener('keydown', (e) => {
// 	var background = 'background:#c4c9cd2e';
// 	if (e.key === "ArrowUp")ArrowUp(background);
// 	else if (e.key === "ArrowDown") ArrowDown(background);
// 	else return;
// });

// //renderiza el scroll de la tabla
// export const RefreshBackgroundColor = async (datosVacios)  => {
// 	var filas 			     	 	= await document.getElementsByClassName('filas');

// 	if ((datosVacios === true) && (datosVacios !== undefined)) {
// 		filas[0].classList.add("activar");
// 		filas[0].style.background    = '#c4c9cd2e'
// 		setNumeroDeFila(0);
// 	} else {
// 		if (filas.length) {
// 			$('tr.activar').removeAttr('style');
// 			$('tr.activar').removeClass('activar');
// 			filas[0].classList.add("activar");
// 			filas[0].style.background    = '#c4c9cd2e';
// 			setNumeroDeFila(0);
// 		}
// 	}
// }

// function radioRows(opcion, value) {
// 	var valor = "";
// 	if(opcion !== null && opcion !== undefined && opcion.length > 0){
// 		valor = opcion.filter((item)=>{
// 			if(item.value === value){
// 				return item;
// 			}
// 		})
// 	}

// 	return (
// 		<>
// 			{ valor !== "" && valor !== undefined && valor !== null  ?
// 				<Radio.Group value={valor[0].value}>
// 				{opcion.map((items) => (						
// 						<Radio key={items.value} value={items.value}>{items.label}</Radio>
// 					))}	
// 				</Radio.Group>
// 				:   
// 				null
// 			 }
// 		</>
// 	)
// }

// var DatosFilterEdit = {};
// export const getDatosFilterEdit = ()=>{
// 	return DatosFilterEdit
// }
// export const setDatosFilterEdit = (values)=>{
// 	DatosFilterEdit = values;
// }

// var DatosEdit = {};
// export const getDatosEdit = ()=>{
//  return DatosEdit
// }
// export const setDatosEdit = (values)=>{
// 	DatosEdit = values;
// }

// //funcion Principal
// const ListView = (props) => {

// 	useHotkeys('ctrl+c', (e) =>{ 
//         e.preventDefault();
// 		e.stopPropagation();
// 		props.history.push(formLocation + 'nuevo');
//     },{filterPreventDefault:true});

// 	const [ activarSpinner, setActivarSpinner ] = useState(true);
// 	const classes 						= styles();
// 	const columns 						= props.columns;
// 	const title							= props.title;
// 	const formLocation 					= props.formLocation;
// 	const eliminar 						= props.eliminar;

// 	const [page, setPage] 				= React.useState(0);
// 	const [rowsPerPage, setRowsPerPage] = React.useState(15);
// 	const handleChangePage				= (event, newPage) => {
// 		setPaginacion(newPage)
// 		setPage(newPage);
// 		RefreshBackgroundColor();
// 	};
// 	const handleChangeRowsPerPage = async (event) => {
// 		setRowsPerPage(+event.target.value);
// 		setPage(0);
// 	};

// 	const [Datosrows, setDatosRows] = useState(props.data);
// 	setCountData(Datosrows.length);
// 	const listFiltro 				= async (datos) => {
// 		setPage(0);
// 		setPaginacion(0);
// 		setDatosRows(datos)
// 		setDatosFilterEdit(datos)
// 		setDatosEdit(datos[0])
// 		props.setData(datos)
// 		props.setDeleteId(datos[0])
		
// 		if (datos.length === 0) {
// 			RefreshBackgroundColor(true)
// 		} else {
// 			RefreshBackgroundColor(false)
// 		}
		
// 	}
// 	var idUnico = 0;
// 	const onClickRows   = (e,row) => {
// 		const idFila 	    = e.currentTarget.id;	
// 	// const idFila 	    = e.nativeEvent.path[1].id;
// 		if (idFila) {
// 			const filas = document.getElementById(idFila);
// 			$('tr.activar').removeAttr('style');
// 			$('tr.activar').removeClass('activar');
// 			$(filas).addClass('activar');
// 			filas.style.backgroundColor    = '#c4c9cd2e';
// 			// filas.style.backgroundColor = "rgb(13 33 52 / 8%)";
// 			setNumeroDeFila(idFila);
// 		}
// 		setDatosEdit(row)
// 		props.setDeleteId(row);
// 	}
// 	const nextPaginacion = (e, totalPerPage) => {
// 		setPage(calculoPaginacion(e.key, totalPerPage));
// 	};
// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	const keydownListener = (e) => {
// 		if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
// 			nextPaginacion(e, rowsPerPage)
// 			RefreshBackgroundColor();
// 		}
// 		if(e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight"){
// 			setTimeout(()=>{
// 				var valorId   = document.getElementsByClassName('activar');
// 					if(valorId.length > 0){
// 						var idActivar = document.getElementById(valorId[0].id);
// 					if(idActivar){
// 						var rows = getDatosFilterEdit().filter((item)=>{
// 							if(item.ID === idActivar.attributes.name.value) return item
// 						})
// 						setDatosEdit(rows[0])
// 						props.setDeleteId(rows[0]);
// 					}
// 				}
// 			},20)
// 		}
// 		// 	let tecla = e.which || e.keyCode;
// 		// // console.log(tecla);
// 		// // Evaluar si se ha presionado la tecla Ctrl:
// 		// if ( e.ctrlKey ) {
// 		// 	// Evitar el comportamiento por defecto del nevagador:
// 		// 	e.preventDefault();
// 		// 	e.stopPropagation();
			
// 		// 	// Mostrar el resultado de la combinación de las teclas:
// 		// 	if ( tecla === 85 )
// 		// 	console.log("Ha presionado las teclas Ctrl + U");
				
// 		// 	if ( tecla === 83 )
// 		// 	console.log("Ha presionado las teclas Ctrl + S");

// 		// 	if ( tecla === 78 )
// 		// 	console.log("Ha presionado las teclas Ctrl + N");
// 		// }
// 	}
// 	useEffect(() => {  
// 		window.addEventListener("keydown", keydownListener, true);  
// 		return () => window.removeEventListener("keydown", keydownListener, true);
// 	}, [keydownListener]);
// 	//esto pinta la primera fila cuando se refresca la pantalla
// 	useEffect(() => {
// 		setDatosRows(props.data);
// 		RefreshBackgroundColor();
// 		setDatosFilterEdit(props.data);
// 		setDatosEdit(Datosrows[0]);
// 		props.setDeleteId(props.data[0])
// 		props.setData(Datosrows);	
// 		setActivarSpinner(false);
// 		setPaginacion(0);
// 	},[props.data]);

// 	const [ascDesc, setAscDesc] = React.useState(false);
// 	// function que ordena las columna de menor a mayor
// 		const datosOrderBy 		= async (columnOrderBy) => {	
// 		const DatosOrdenado 	= await OrderBy(columnOrderBy, Datosrows);
// 		setDatosRows(DatosOrdenado);
// 		setAscDesc(!ascDesc);
// 	}
// 	//cambiar style y hacer que sea visible los iconos
// 	const mouseOver  = (id)=> {
// 		const idICon 	 = document.getElementById(id);
// 		// console.log(idICon);
// 		if(idICon != null){
// 			idICon.style.visibility = 'visible';
// 		}
// 	}
// 	//ocultamos devuelta el icono
// 	const onMouseOut = (id)=> {
// 		const idICon 	 = document.getElementById(id);
// 		if(idICon != null){
// 			idICon.style.visibility = 'collapse';
// 		}
// 	}

// 	const [headSeled, setheadSeled] = useState([props.columBuscador])
// 	const selectedHead              = async (idHead) => {

// 		var iconohead = await document.getElementsByName(idHead);
// 		var exists    = await headSeled.includes(idHead);

// 		if(exists){
// 			iconohead[0].style.visibility = 'collapse'
// 			const indice = headSeled.indexOf(idHead)
// 			headSeled.splice(indice, 1);
// 		}else{
// 			setheadSeled(await headSeled.concat(idHead));
// 			iconohead[0].style.visibility = 'visible';
// 		}
// 	}
// 	//esta funcion controla las validaciones de los checkbox
// 	const opcionComparar = (values, opcion) => {
// 		var check = false;
// 		if(opcion !== undefined){
// 			if(opcion.length > 0){
// 				for (let i = 0; i < opcion.length; i++) {
// 					if(values === opcion[i]){
// 						check=true;
// 					}
// 				}
// 			}
// 		}
// 		return check;
// 	}

// 	return (
// 		<div className="paper-container" >
// 			<Paper className="paper-style">
// 				<div className="paper-header">
// 					<Title level={4} className="title-color">{title}</Title>
// 				</div>
// 				<Spin size="large" spinning={activarSpinner}>
// 				<Search 
// 			     setDatosRows={props.data} 
// 				 listFiltro={listFiltro} 
// 				 formLocation={formLocation} 
// 				 headSeled={headSeled}
// 				 urlBuscador={props.urlBuscador}
// 				 cod_empresa={props.cod_empresa}
// 				 columns={columns}
// 				 ID={props.ID}
// 				 eliminarRows={eliminar}
// 				 columnID={props.columnID}
// 				 formName={props.formName}
// 				  />
				
// 				<TableContainer>
// 					<Table className={classes.table} size="small" aria-label="a dense table" stickyHeader>
// 						<TableHead>
// 							<TableRow>
// 								{columns.map((column) => (
// 									<TableCell 
// 										onMouseOver = {()  => { mouseOver(column.ID)  }}
// 										onMouseOut  = {()  => { onMouseOut(column.ID) }}
// 										className   = {classes.header}
// 										key         = {column.ID}
// 										style       = {{minWidth: column.minWidth, width: column.width, textAlign:column.align}}
// 									>
												
// 										{column.alignID === "right" ?
// 											opcionComparar(column.ID, props.notOrderByAccion)
// 											?
// 												null
// 											: 
// 												<IconButton
// 													className={classes.orderBy}
// 													id={column.ID}
// 													onClick={(e) => datosOrderBy(column.ID)}
// 													>
// 													{ascDesc ?
// 														<BsChevronDown style={{color:'rgb(83 83 83)',marginRight:'10'}} />
// 													:
// 														<BsChevronUp   style={{color:'rgb(83 83 83)',marginRight:'10'}}  />
// 													}
// 												</IconButton>
// 												:
// 											null
// 										}

// 										{ opcionComparar(column.ID, props.doNotsearch) ?
// 											<Button className={classes.selectHeader} disabled >
// 												{column.label}
// 											</Button>
// 											:
// 											<Button className={classes.selectHeader} onClick={(e) => selectedHead(column.ID)} >
// 												{column.label}
// 												{column.ID === props.columBuscador && column.alignID !== "right"
// 													?
// 														<i name={column.ID} className={classes.auxIconHead}>
// 															<BiSearchAlt/>
// 														</i>
// 														:
// 														<i name={column.ID} className={classes.iconHead}>
// 															<BiSearchAlt/>
// 														</i>
// 												}
// 											</Button>
// 										}
// 										{column.alignID !== "right" ?
// 										opcionComparar(column.ID, props.notOrderByAccion)
// 											?
// 												null
// 											: 
// 												<IconButton
// 													className={classes.orderBy}
// 													id={column.ID}
// 													onClick={(e) => datosOrderBy(column.ID)}>
// 													{ascDesc ?
// 														<BsChevronDown style={{color:'rgb(83 83 83)'}} />
// 													:
// 														<BsChevronUp   style={{color:'rgb(83 83 83)'}}  />
// 													}
// 												</IconButton>
// 												:
// 											null
// 										}
// 									</TableCell>
// 								))}
// 							</TableRow>
// 						</TableHead>
// 						<TableBody>
// 							{Datosrows.length > 0 ?
// 								Datosrows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
// 									return (
// 										<TableRow className="filas" id={idUnico++}  name={row.ID} key={idUnico} onClick={(e) => onClickRows(e,row)} tabIndex={-1} >
// 											{columns.map((column) => {
// 												const value = row[column.ID];
// 													return (
// 														<TableCell style={{maxWidth:100}} className={classes.tdTable} key={column.ID} align={column.align}>
// 															{column.checkbox && (column.options !== undefined || Array.isArray(column.options))?
// 															  opcionComparar(value, column.options)?
// 															 	 <Checkbox 
// 																	key={value}
// 																	color="default"
// 																	className={classes.checkbox} 
// 																	size="small"
// 																	defaultChecked={true}
// 																	disabled={true}/>
// 															 	:
// 																 <Checkbox
// 																 	className={classes.checkbox} 
// 																 	key={value}
// 																	color="default"
// 																	size="small"
// 																	defaultChecked={false}
// 																	disabled={true} />
																
// 																: column.radio && (column.options !== undefined || Array.isArray(column.options))?
// 																	radioRows(column.options, value)
// 																:
// 																column.format && typeof value === 'number' ? value : value
// 															}
// 														</TableCell>
														
// 													);
// 											})}
// 										</TableRow>
// 									);
// 								})
// 								:
// 								<TableRow>
// 									<TableCell className="filas" colSpan={columns.length}>
// 										Registro no encontrado
// 									</TableCell>
// 								</TableRow>
// 							}
// 						</TableBody>
// 					</Table>
// 				</TableContainer>
// 				<TablePagination
// 					rowsPerPageOptions={[]}
// 					component="div"
// 					count={Datosrows.length}
// 					rowsPerPage={rowsPerPage}
// 					page={page}
// 					onChangePage={handleChangePage}
// 					onChangeRowsPerPage={handleChangeRowsPerPage}
// 					ActionsComponent={TablePaginationActions}
// 				/>
// 				</Spin>
// 			</Paper>
// 		</div>
// 	);
// }
// export default ListView;