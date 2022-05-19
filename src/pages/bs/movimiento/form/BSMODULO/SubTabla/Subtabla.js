import React, { useEffect, useState }  	from 'react';
import Table 						 	from '@material-ui/core/Table';
import TableBody 					 	from '@material-ui/core/TableBody';
import TableCell 					 	from '@material-ui/core/TableCell';
import TableContainer 				 	from '@material-ui/core/TableContainer';
import TableHead 					 	from '@material-ui/core/TableHead';
import TableRow 					 	from '@material-ui/core/TableRow';
import IconButton 					 	from '@material-ui/core/IconButton';
import DeleteIcon 					 	from '@material-ui/icons/Delete';
import $ 							 	from "jquery";
import styles 						 	from './Styles';
import Button 						 	from '@material-ui/core/Button';
import {Input} 	   					 	from 'antd';

export const RefreshBackgroundColorSubtabla = async (datos,id)  => {
	var filas = await document.getElementsByClassName('subTablaFila');
	if (!datos) {
		filas[0].classList.add("activarModuloSubtabla");
		filas[0].style.background    = '#a2a7abaa';
	} else {
		if (filas.length) {
			$('tr.activarModuloSubtabla').removeAttr('style');
			$('tr.activarModuloSubtabla').removeClass('activarModuloSubtabla');
			filas[id].classList.add("activarModuloSubtabla");
			filas[id].style.background    = '#a2a7abaa';
		}
	}
}
var indexTecl = 0;
//funcion Principal
const ListViewSubtabla = (props) => {
 
	const classes 					= styles();
	const columns 					= props.columns;
	const focos 					= props.foco;
	const eliminar 					= props.eliminar;
	const [Datosrows, setDatosRows] = useState(props.data);
	var idUnico = 0;

	const onClickRows   = (e) => {
		var idFila 	    = 0;
		if(e.type === 'click')	{
			e.preventDefault();
			idFila = e.currentTarget.id;
			// props.setIndexTec(idFila.split('-')[1]);
			indexTecl = idFila.split('-')[1];
		} else {
			idFila = 'subtabla-'+e;
		}
		if (idFila) {
			const filas = document.getElementById(idFila);
			$('tr.activarModuloSubTabla').removeAttr('style');
			$('tr.activarModuloSubTabla').removeClass('activarModuloSubTabla');
			$(filas).addClass('activarModuloSubTabla');
			filas.style.backgroundColor    = `#a2a7abaa`;
			props.setId(idFila.split('-')[1]);
		}
	}
	//esto pinta la primera fila cuando se refresca la pantalla
	useEffect(() => {
		setDatosRows(props.data);
	}, [props.data]);

	const nextFila = async(e)=>{
		if(e.target.name){
			await props.handleFocus(e);
		} else {
			var id = indexTecl;
			if(e.keyCode === 38){
				if(id%2!==0 && id ||(id > Datosrows.length - 3)){
					e.preventDefault();
				}
				if(parseInt(id) - 1 < 0){
					id = 0;
					indexTecl = parseInt(0);
					RefreshBackgroundColorSubtabla(true,id);
				} else {
					id = parseInt(id) - 1;
					indexTecl = parseInt(id);
					RefreshBackgroundColorSubtabla(true,id);
				}
			} else {
				if(e.keyCode === 40){
					if(id%2!==0 && id ||(id < 2)){
						e.preventDefault();
					}
					id = parseInt(id) + 1;
					if(id === Datosrows.length) return
					indexTecl = parseInt(id);
					RefreshBackgroundColorSubtabla(true,id);
				}
			}
			// onClickRows(id);
		}
	}
	return (
		<div className="paper-container"style={{height:"170px", marginTop:"7px"}}>
			<TableContainer style={{height:"170px"}}>
				<Table className={classes.table} size="small" aria-label="a dense table"
					   stickyHeader title={true}  scroll={{ y: "1000px" }} >
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell 
									className   = {classes.header}
									key         = {column.ID}
									style       = {{minWidth: column.minWidth, 
													width: column.width, 
													textAlign:column.alignID,
													padding:"0px"}}
								>
									<Button className={classes.selectHeader}  disabled >
										{column.label}
									</Button>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{Datosrows.length > 0 ?
							Datosrows.map((row) => {
								return (
									<TableRow className="subTablaFila" id={"subtabla-"+idUnico++} key={row.ID} onClick={(e) => onClickRows(e)} tabIndex={-1} onKeyDown={nextFila} ref={focos[idUnico-1]['subtabla']}>
										{columns.map((column) => {
											var value = row[column.ID];
											if (column.ID !== props.idACCION) {
												return (
													<TableCell style={{maxWidth:100}} className={classes.tdTable} key={column.ID} align={column.align}>
														<Input 
															name={column.ID+'-'+idUnico+'-'+(row['DISABLED'] && column.disabled)}
															value= {column.format && typeof value === 'number' 
																	? 
																		column.format(value) 
																	: 
																		value
																	}
															size="small"
															onKeyDown={nextFila}
															onFocus={nextFila}
															ref={focos[idUnico-1][column.ID]}
															type={column.type}
															className="search_input"
															onChange={props.handleOnChacge}
														/>
													</TableCell>													
												);
											} else {
												return (
													<TableCell key={column.ID} align={column.align} className="table-column-action">
														
														<IconButton id={'delete_' + row[props.columnID]} key={'delete_' + value} aria-label="delete" 
																	onClick={(e) => { eliminar(e) }} style={{
																	marginRight:'5px',
														}}>
															<DeleteIcon className="deleteIcon" fontSize="small" />
														</IconButton>
													</TableCell>
												);
											}
										})}
									</TableRow>
								);
							})
							:
							<TableRow>
								<TableCell className="subTablaFila" colSpan={columns.length}>
									Registro no encontrado
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</TableContainer>
	
		</div>
	);
}
export default ListViewSubtabla;