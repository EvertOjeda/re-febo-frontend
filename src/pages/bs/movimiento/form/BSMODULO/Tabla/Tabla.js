import React, { useEffect, useState } 			from 'react';
import Table 									from '@material-ui/core/Table';
import TableBody 								from '@material-ui/core/TableBody';
import TableCell 								from '@material-ui/core/TableCell';
import TableContainer 							from '@material-ui/core/TableContainer';
import TableHead 								from '@material-ui/core/TableHead';
import TableRow 								from '@material-ui/core/TableRow';
import IconButton 								from '@material-ui/core/IconButton';
import DeleteIcon 								from '@material-ui/icons/Delete';
import styles 									from './Styles';
import Button 									from '@material-ui/core/Button';
import $ 										from "jquery";
import {Input} 									from 'antd';

//renderiza el scroll de la tabla
export const RefreshBackgroundColorTabla = async (datosVacios,id)  => {
	var filas 	= await document.getElementsByClassName('filaTabla');
	if (!datosVacios) {
		filas[0].classList.add("activarModuloTabla");
		filas[0].style.background  = '#a2a7abaa'
	} else {
		if (filas.length) {
			$('tr.activarModuloTabla').removeAttr('style');
			$('tr.activarModuloTabla').removeClass('activarModuloTabla');
			filas[id].classList.add("activarModuloTabla");
			filas[id].style.background    = '#a2a7abaa';
		}
	}
}
//funcion Principal
const ListViewTabla = (props) => {
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
			props.setIndexTec(idFila);
		} else {
			idFila = e;
		}
		if (idFila>-1) {
			const filas = document.getElementById(idFila);
			$('tr.activarModuloTabla').removeAttr('style');
			$('tr.activarModuloTabla').removeClass('activarModuloTabla');
			$(filas).addClass('activarModuloTabla');
			filas.style.backgroundColor    = '#a2a7abaa';
			props.setId(idFila);
		}
	}

    useEffect(() => {
		setDatosRows(props.data);
	}, [props.data]);

	// const nextFila = (e)=>{
	// 	props.callmodal(e);
	// 	// var background = 'background:#a2a7abaa';
	// 	// if (e.code === "ArrowUp")ArrowUp(background);
	// 	// else if (e.code === "ArrowDown") ArrowDown(background);
	// 	// else return
	// }
	const nextFila = async(e)=>{
		if(e.target.name){
			await props.handleFocus(e);
		} else {
			var id = props.indexTec;
			if(e.keyCode === 38){
				if(id%2!==0 && id ||(id > Datosrows.length - 4)){
					e.preventDefault();
				}
				if(parseInt(id) - 1 < 0){
					id = 0;
					props.setIndexTec(0)
				} else {
					id = parseInt(id) - 1;
					props.setIndexTec(parseInt(id))
				}
			} else {
				if(e.keyCode === 40){
					if(id%2===0 && id ||(id < 3)){
						e.preventDefault();
					}
					id = parseInt(id) + 1;
					if(id === Datosrows.length) return
					props.setIndexTec(parseInt(id))
				}
			}
			onClickRows(id);
		}
	}

    return (
		<div className="paper-container"style={{height:"170px", marginTop:"7px"}}>

			<TableContainer style={{height:"170px"}}>
				<Table  size="small" aria-label="a dense table" stickyHeader>
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
									<TableRow className="filaTabla" id={"tabla-",idUnico++} key={row.ID} onClick={(e) => onClickRows(e)} tabIndex={-1} onKeyDown={nextFila} >
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
															ref={focos[idUnico-1][column.ID]}
															type={column.type}
															className="search_input"
															// disabled={((row['DISABLED'] && column.disabled)||(column.ID === 'DESCRIPCION'))}
															onChange={props.handleOnChacge}
														/>
													</TableCell>
												);
											} else {
												return (
													<TableCell key={column.ID} align={column.align} className="table-column-action">
														<IconButton id={'delete_' + row[props.columnID]} key={'delete_' + value} 
																	aria-label="delete" 
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
								<TableCell className="filaTabla" colSpan={columns.length}>
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
export default ListViewTabla;