import React, { useState, useRef, useEffect } from "react";
import _ from 'underscore';
import DataGrid, {
    Column,
    Editing,
    Paging,
    Lookup,
	KeyboardNavigation,
	Sorting,
} from "devextreme-react/data-grid";
import { Form , Input , Row , Col, Card, message } from 'antd';
import UseFocus from "../../../../../../components/utils/Focus";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
import "../devExtreme-custom.css";
export const TipoReferenciaData = [{
	ID: 'P',
	Name: "Personal",
},{
	ID: 'C',
	Name: "Comercial",
}
];

const columnLength = 4;
const TipoReferenciaColumns = [
    { ID: 'ID'   , label: 'Codigo'      , width: 80     },
    { ID: 'Name' , label: 'Descripción' , minWidth: 150 },
]

const url_buscar_tipo_referencia = '/bs/personas/buscar/tipo_referencia';

var referenceRowIndex = 0;
export const setReferenceRowIndex = (value)=>{
	referenceRowIndex = value;
}
export const getReferenceRowIndex = () => {
	return referenceRowIndex;
}

var globalId = 0;
export const setGlobalId = (value) => {
	globalId = value;
}

const DevExtreme = (props) => {

	const [focusedRowIndex      , setFocusedRowIndex ]     = useState(-1);
	const [nombreRefFocus 		, setNombreRefFocus 	 ] = UseFocus();
	const [tipoRefFocus    		, setTipoRefFocus    	 ] = UseFocus();
	const [telefonoRefFocus 	, setTelefonoRefFocus 	 ] = UseFocus();
	const [observacionRefFocus 	, setObservacionRefFocus ] = UseFocus();

	useEffect( ()=> {
		setGlobalId(0)
	},[])

	const setFormRow = (row) => {
		var desc_tipo_referencia = '';
		var tipoReferencia = TipoReferenciaData.filter((item) => (item.ID  == row.TIP_REFERENCIA));
		if(tipoReferencia.length == 0){
			desc_tipo_referencia = '';
		}else{
			desc_tipo_referencia = tipoReferencia[0].Name;
		}
		globalId = row.ID;
		
		

		props.form.setFieldsValue({
			...props.form,
			'REFERENCIA_ID'   : row.ID,
			'NOMBRE_REF'	  : row.NOMBRE_REFERENCIA,
			'TIPO_REF'		  : row.TIP_REFERENCIA,
			'DESC_TIPO_REF'	  : desc_tipo_referencia,
			'TELEFONO_REF'	  : row.TELEFONO,
			'OBSERVACION_REF' : row.OBSERVACION,
			'globalId'        : row.ID,
		});
	}
	const clearFormRow = () => {
		globalId = 0;
		props.form.setFieldsValue({
			...props.form,
			'REFERENCIA_ID'   : '',
			'NOMBRE_REF'	  : '',
			'TIPO_REF'		  : '',
			'DESC_TIPO_REF'	  : '',
			'TELEFONO_REF'	  : '',
			'OBSERVACION_REF' : '',
		});
	}
	const onFocusedCellChanging = (e) => {  
		e.isHighlighted = false;  
	}

	const onFocusedRowChanging = (e) =>{
		setReferenceRowIndex(e.newRowIndex);
		setFocusedRowIndex(e.newRowIndex);
	}

	const keydownReferencia = async (e)=> {
		var key = e.which;
		if(key == 13 || key == 9){
			e.preventDefault();
			if(e.target.name == 'NOMBRE_REF'){
				if(e.target.value.trim().length > 0){
					setTipoRefFocus();
				}else{
					setNombreRefFocus();
				}
			}
			if(e.target.name == 'TIPO_REF'){
				if(e.target.value.trim().length > 0){
					var tipoReferencia = await TipoReferenciaData.filter((item) => (item.ID  == e.target.value));
					if(tipoReferencia.length > 0){
						props.form.setFieldsValue({
							...props.form,
							['DESC_TIPO_REF']: tipoReferencia[0].Name,
						})
						setTelefonoRefFocus();
					}else{
						message.warning("Tipo de referencia no encontrado");
						props.form.setFieldsValue({
							...props.form,
							['TIPO_REF']: "",
							['DESC_TIPO_REF']: "",
						})
						setTipoRefFocus();
					}
				}else{
					setTipoRefFocus();
				}
			}
			if(e.target.name == 'TELEFONO_REF'){
				if(e.target.value.trim().length > 0){
					setObservacionRefFocus();
				}else{
					setTelefonoRefFocus();
				}
			}
			if(e.target.name == 'OBSERVACION_REF'){
				var band = true;
				var nombre_ref = props.form.getFieldsValue().NOMBRE_REF;

				if(nombre_ref == undefined){
					band = false;
					setNombreRefFocus();
				}else{
					if(nombre_ref.trim().length == 0){
						band = false;
						setNombreRefFocus();
					}
				}

				var tipo_ref = props.form.getFieldsValue().TIPO_REF;
				if(tipo_ref == undefined){
					band = false;
					setTipoRefFocus();
				}else{
					if(tipo_ref.trim().length == 0){
						band = false;
						setTipoRefFocus();
					}
				}

				var telefono_ref = props.form.getFieldsValue().TELEFONO_REF;
				if(telefono_ref == undefined){
					band = false;
					setTelefonoRefFocus();
				}else{
					if(telefono_ref.trim().length == 0){
						band = false;
						setTelefonoRefFocus();
					}
				}

				if(band){
					addReferenceRow();
				}
			}	
		}
		if(key == '38'){
			e.preventDefault();
			var index = focusedRowIndex - 1;
			if(index < 0){
				index = 0;
			}
			var row = props.referencia[index];
			setFormRow(row);
			setFocusedRowIndex(index);
		}
		if(key == '40'){
			e.preventDefault();
			var index = focusedRowIndex + 1;
			if(index > props.referencia.length - 1){
				index = props.referencia.length - 1;
			}
			var row = props.referencia[index];
			setFormRow(row);
			setFocusedRowIndex(index);
		}
		if(key == '120'){
			e.preventDefault();
			props.setSearchColumns(TipoReferenciaColumns);
			props.setSearchData(TipoReferenciaData);
			props.setModalTitle('Tipo de Referencia');
			props.setShows(true);
			props.setSearchType(e.target.name);
            props.setSearchUrl(url_buscar_tipo_referencia)
		}
	}
	const addReferenceRow = () => {

		console.log( globalId );

		if(globalId == 0){
			let aux1 = 0;
			if(props.referenciaAux.length > 0){
				aux1 = _.max(props.referenciaAux, function(item){
					return item.NRO_ORDEN; 
				});
				aux1 = aux1.NRO_ORDEN;
			}
			let aux2 = 0;
			if(props.referencia.length > 0){
				aux2 = _.max(props.referencia, function(item){
					return item.NRO_ORDEN; 
				});
				aux2 = aux2.NRO_ORDEN;
			}
			let aux = aux1;
			if(aux1 < aux2){
				aux = aux2;
			};
			let nro_orden = aux + 1;
			let row =[{
				ID				  	: props.persona.COD_PERSONA + '-' + nro_orden,
				COD_PERSONA		  	: props.persona.COD_PERSONA,
				NRO_ORDEN		  	: nro_orden,
				NOMBRE_REFERENCIA 	: props.form.getFieldsValue().NOMBRE_REF,
				TIP_REFERENCIA	  	: props.form.getFieldsValue().TIPO_REF,
				TELEFONO		  	: props.form.getFieldsValue().TELEFONO_REF,
				OBSERVACION		  	: props.form.getFieldsValue().OBSERVACION_REF,
				inserted		  	: true,
			}];
			row = row.concat(props.referencia);
			manejaPosicion(row);
		}else{
			var info = props.referencia;
			for (let index = 0; index < info.length; index++) {
				const element = info[index];
				if(element.ID == globalId){
					if(	element.NOMBRE_REFERENCIA == props.form.getFieldsValue().NOMBRE_REF      &&
						element.TIP_REFERENCIA    == props.form.getFieldsValue().TIPO_REF        && 
						element.TELEFONO          == props.form.getFieldsValue().TELEFONO_REF    &&
						element.OBSERVACION       == props.form.getFieldsValue().OBSERVACION_REF){
					
						console.log('son iguales');
					
					}else{
						info[index]['NOMBRE_REFERENCIA'] = props.form.getFieldsValue().NOMBRE_REF;
						info[index]['TIP_REFERENCIA'] 	 = props.form.getFieldsValue().TIPO_REF;
						info[index]['TELEFONO']       	 = props.form.getFieldsValue().TELEFONO_REF;
						info[index]['OBSERVACION']    	 = props.form.getFieldsValue().OBSERVACION_REF;
						info[index]['updated']    	     = true;
						props.setReferencia([]);
					}
					setTimeout( ()=>{
						manejaPosicion(info);
					}, 50);
					break;
				}
			}
		}
	}
	const manejaPosicion = (row) => {
		props.setReferencia(row);
		props.setPersona({
			...props.persona,
			['REFERENCIAS_PERSONALES']: row,
		});
		clearFormRow();
		setNombreRefFocus();
	}
	const onRowClick = (event) => {
		setFormRow(event.data);
		setNombreRefFocus();
	}
	const handleChange = (event) => {
		props.form.setFieldsValue({
			...props.form,
			[event.target.name] : event.target.value.toUpperCase()
		});
	}

    return (
        <div id="data-grid-demo">
			<Card className="cardDatagrid">
			<Row gutter={[0,0]}>
				<Col span={8}>
					<Form.Item
						name="NOMBRE_REF"
						label="Nombre"
						labelCol={{span:5}} 
						wrapperCol={{span:20}}
						>
						<Input
							name="NOMBRE_REF"
							onChange={handleChange}
							onKeyDown={keydownReferencia}
							ref={nombreRefFocus}/>
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item
						label="Tipo" 
						labelCol={{span:6}} 
						wrapperCol={{span:18}}
						>
						<Input.Group>
							<Row>
								<Col span={6}>
									<Form.Item name="TIPO_REF">
										<Input
											name="TIPO_REF"
											onChange={handleChange}
											onKeyDown={keydownReferencia}
											maxLength={1}
											ref={tipoRefFocus}/>
									</Form.Item>
								</Col>
								<Col span={18}>
									<Form.Item name="DESC_TIPO_REF">
										<Input
											name="DESC_TIPO_REF" 
											disabled={true}/>
									</Form.Item>
								</Col>
							</Row>
						</Input.Group>
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item
						name="TELEFONO_REF"
						label="Telefono" 
						labelCol={{span:10}} 
						wrapperCol={{span:14}}
						>
						<Input
							name="TELEFONO_REF"
							onChange={handleChange}
							onKeyDown={keydownReferencia}
							ref={telefonoRefFocus}/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						name="OBSERVACION_REF"
						label="Observación" 
						labelCol={{span:10}} 
						wrapperCol={{span:14}}
						>
						<Input
							name="OBSERVACION_REF"
							onChange={handleChange}
							onKeyDown={keydownReferencia}
							ref={observacionRefFocus}/>
					</Form.Item>
				</Col>
			</Row>
			</Card>
			<div className="datagridFormPerson">
				<DataGrid
					dataSource={props.referencia}
					keyExpr="ID"
					showColumnLines={false}
					showRowLines={true}
					showBorders={false}
					rowAlternationEnabled={false}
					onFocusedCellChanging={onFocusedCellChanging}
					onFocusedRowChanging={onFocusedRowChanging}
					focusedRowIndex={focusedRowIndex}
					onRowClick={onRowClick}
					focusedRowEnabled={true}
					height={95}
					ref={props.grid}
					>
					<Sorting mode="none" />
					<KeyboardNavigation
						editOnKeyPress={true}
						enterKeyAction= 'moveFocus'
						enterKeyDirection='row'
						onEnterKey/>
					<Paging enabled={false} />
					<Editing
						mode="cell"
						selectTextOnEditStart={true}/>
					<Column dataField="ID" caption="ID"          width={100} />
					<Column dataField="NOMBRE_REFERENCIA" caption="Nombre"          width={250} />
					<Column dataField="TIP_REFERENCIA"    caption="Tip. Referencia" width={110}  >
						<Lookup
							dataSource={TipoReferenciaData}
							valueExpr="ID"
							displayExpr="Name"/>
					</Column>
					<Column dataField="TELEFONO"    caption="Teléfono"    />
					<Column dataField="OBSERVACION" caption="Observación" />
				</DataGrid>
			</div>
        </div>
    );
};
export default DevExtreme;