import React, { useState, useEffect, useRef } from 'react';
import Main from '../../../../components/utils/Main';
// import {ValidarColumnasRequeridas} from '../../../../components/utils/DevExtremeGrid/ValidarColumnasRequeridas'
import DevExtremeCab,{limpiarArrayDelete,
					  ArrayPushDelete,
					  setcancelarCab,
					  getcancelarCab,
					  getEstablecerOperaciones,
					  getFocusedRowIndex} from "../../../../components/utils/DevExtremeGrid/DevExtremeCab";
import DevExtremeDet,{setBloqueoCabecera,} from '../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import { v4 as uuidID } from 'uuid';
import { Col, Row } 	from 'antd';
import _ 				from "underscore"
import ArrayStore 		from 'devextreme/data/array_store';
import DataSource 		from 'devextreme/data/data_source';
import {setModifico}	from '../../../../components/utils/DevExtremeGrid/ButtonCancelar'

const url_valida_tipo_cartera = '/st/stmarart/valida/tipoCartera';
const url_busca_tipo_cartera  = '/st/stmarart/buscar/tipoCartera';
var cancelarDet = ""

const setCancelarDet = (valor)=>{
  cancelarDet = valor
};
const getCancelarDet = ()=>{
  return cancelarDet;
};
const columnModalDet = {
    urlValidar:[
        { COD_TIPO : url_valida_tipo_cartera }
    ],
    urlBuscador:[
        { COD_TIPO :  url_busca_tipo_cartera }
    ],
    title:[
        { COD_TIPO : 'Tipo' },
    ],
    COD_TIPO:[
        { ID: 'COD_TIPO'     , label: 'Tipo'        , width: 110      , align:'left' },
        { ID: 'DESCRIPCION'  , label: 'Descripción' , minWidth: 70    , align:'left' },
    ],
    config:{
		// auto: [],
	},
}
const columnsDet = [
    { ID: 'COD_TIPO'     , label: 'Tipo'         , width: 80      , align:'left'   , requerido:true  , upper:true},
    { ID: 'DESCRIPCION'  , label: 'Descripción'  , minWidth: 190  , align:'left'   , disable:true}   ,
    { ID: 'CANT_PUNTO'   , label: 'Puntos'       , width: 150     , align:'center' , isNumber:true },
];
const columnModal = {
    urlValidar:[],
    urlBuscador:[],
    title:[],
    config:{},
}
const columns = [
    { ID: 'COD_MARCA'    , label: 'Marca'       , width: 100    , align:'center' , disable:true   , isNumber: true },
    { ID: 'DESCRIPCION'  , label: 'Descripción' , minWidth: 210 , align:'left'   , requerido:true , upper:true		 },
    { ID: 'ABREVIATURA'  , label: 'Abreviatura' , width: 100   },    
    { ID: 'NRO_ORDEN'    , label: 'Orden'       , width: 100    , isNumber: true , align:'right' },
    { ID: 'CARGA_META'   , label: 'Carga Meta'  , width: 100    , align:'center' , checkbox:true , checkBoxOptions:["S","N"] },
    { ID: 'ESTADO'       , label: 'Activo'      , width: 100    , align:'center' , checkbox:true , checkBoxOptions:["A","I"] },
];

const columBuscador 	  = 'DESCRIPCION'
const doNotsearch 		  = ['ESTADO','CARGA_META']
const notOrderByAccion 	  = ['']
const notOrderByAccionDet = [''];
const TituloList 		  = "Artículos - Categorías";
const defaultOpenKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
const defaultSelectedKeys = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STMARART'];
const FormName = "STMARART";
const ColumnDefaultPosition = 1;

const MarcasList = React.memo( () => {
	const grid = useRef();
	const gridDet = useRef();
	const refCancelar = useRef();

	const idGrid = {ROWS:grid,TIPOCARTERA:gridDet, defaultFocus:{ROWS:1,TIPOCARTERA:0}}
	const url_marca     = '/st/stmarart/' + sessionStorage.getItem('cod_empresa');
	const url_Buscador  = '/st/stmarart/search';
	const url_cod_marca = '/st/stmarart/cod_marca';
	const url_abm 		= '/st/stmarart';
	const [rows 	  		, setRows 	  		  ] = useState([]);
	const [activarSpinner   , setActivarSpinner   ] = useState(false);
	// const [modifico         , setModifico         ] = useState(false);
	//-----------------------Estado Modal mensaje ----------------------------------
	const [visibleMensaje   , setVisibleMensaje   ] = useState(false);
	const [mensaje          , setMensaje          ] = useState();
	const [imagen           , setImagen           ] = useState();
	const [tituloModal      , setTituloModal      ] = useState();
	const initialRow = [
								{COD_MARCA:"COD_MARCA"}
			];	

	useEffect(async() => {
		getData();
		openCancelarComponent();
	},[]);
	// CABECERA
	const getData = async () => {
		setActivarSpinner(true);
		var content = await getInfo(url_marca,"GET",[]);
		setRows(content);
		setActivarSpinner(false);
		setTimeout( ()=>{
            if(grid.current !== null){
               grid.current.instance.focus(grid.current.instance.getCellElement(0,1));
            }
        },10);
	};
	// GET GENERICO
	const getInfo = async(url, method, data) => {
		var content = [];
		try {
			var info = await Main.Request(url,method,data);

			// console.log(info.data.rows);

			if(info.data.rows) content = info.data.rows;
			return content;
		} catch (error) {
			console.log(error);
		}
	}
	const setRowFocus = async(e)=>{
		var content = [];
		var info = await Main.Request('/st/stmarart/tipoCartera','POST',{ 
			cod_empresa: sessionStorage.getItem("cod_empresa"), 
			cod_marca: e.row.data.COD_MARCA
		});
		if(info.data.rows.length == 0){
			var newKey = uuidID();
			content = [{
				ID	      	  : newKey,
				COD_MARCA  	  : e.row.data.COD_MARCA === undefined ? e.row.data.ID : e.row.data.COD_MARCA,
				idCabecera    : e.row.data.ID,
				InsertDefault : true,
				IDCOMPONENTE  : 'TIPOCARTERA'
			}]
		}else{
			content = info.data.rows
		}
		const dataSource = new DataSource({
			store: new ArrayStore({
			  	data: content,
			}),
			keyExpr:"ID",
			key: 'ID'
		})
		gridDet.current.instance.option('dataSource', dataSource);
		// gridDet.current.instance.option('loadPanel.enabled', false);  
		// gridDet.current.instance.refresh();
      	gridDet.current.instance.refresh();
		setCancelarDet(JSON.stringify(content));
		
	}
	const guardar = async ()=>{
		var datosCab
		if(rows.length > 0){
			datosCab = await rows.filter( item => item.inserted || item.updated);
		}
		var datosDet = gridDet.current.instance.getDataSource()._items;
		if(datosDet.length > 0){
			datosDet = await datosDet.filter( item => (item.inserted || item.updated));
		}
		var datosValidar = {
			id:			 [{ ROWS:grid     , TIPOCARTERA:gridDet	   }],
			column:		 [{ ROWS:columns  , TIPOCARTERA:columnsDet }],
			datos:       [{ ROWS:datosCab , TIPOCARTERA:datosDet   }]
		}
		const valor = await Main.ValidarColumnasRequeridas(datosValidar);
		if(valor) return;
		// CABECERA
		var contentCab   = await Main.GeneraUpdateInsertCab(rows, 'COD_MARCA', url_cod_marca);
		var updateInsert = contentCab.updateInsert;
        var rowsDelete   = ArrayPushDelete.ROWS != undefined ? ArrayPushDelete.ROWS : [] ;
		// DETALLE
		// PARAMETRO PARA GENERERAR EL UPDATE Y EL INSERT DEL DETALLE
		var tiposCartera = gridDet.current.instance.getDataSource()
		var updateDependencia = [{
			'COD_TIPO': 'COD_TIPO_ANT'
		}];
		var contentDet   = await Main.GeneraUpdateInsertDet(tiposCartera._items,['COD_TIPO'],contentCab.updateInsert, updateDependencia,"COD_MARCA");
		var updateInsertTipoCartera = contentDet.updateInsert;
		var rowsDeleteTipoCartera   = ArrayPushDelete.TIPOCARTERA != undefined ? ArrayPushDelete.TIPOCARTERA : [];

		var info = [{"cod_usuario": sessionStorage.getItem('cod_usuario'),"cod_empresa":sessionStorage.getItem('cod_empresa')}]
		var data = {
			updateInsert, 
			rowsDelete,
			updateInsertTipoCartera,
			rowsDeleteTipoCartera,
			info
		}
		if(updateInsert.length > 0 || rowsDelete.length > 0 || 
		   updateInsertTipoCartera.length > 0 || rowsDeleteTipoCartera.length > 0){
			setActivarSpinner(true);
			try{
				var method = "POST"
				await Main.Request( url_abm, method, data).then(async(response) => {
					var resp = response.data;
					if(resp.ret == 1){
						Main.message.success({
							content  : `Procesado correctamente!!`,
							className: 'custom-class',
							duration : `${2}`,
							style    : {
							marginTop: '4vh',
							},
						});
						// setModifico(false)
						setModifico()
						setRows(contentCab.rowsAux); 
						setcancelarCab(JSON.stringify(contentCab.rowsAux));
						setCancelarDet(JSON.stringify(contentDet.rowsAux));
						var fila = await getFocusedRowIndex();
						if(fila == -1){
							fila = 0;
						}
						const dataSource = new DataSource({
							store: new ArrayStore({
									keyExpr:"ID",
									data: contentDet.rowsAux
							}),
							key: 'ID'
						})
						gridDet.current.instance.option('dataSource', dataSource);
						gridDet.current.instance.refresh();
						getEstablecerOperaciones();
						limpiarArrayDelete();
						//funciones Globales
						setBloqueoCabecera(false);
						grid.current.instance.focus(grid.current.instance.getCellElement( fila, columns[ColumnDefaultPosition]["ID"]));
					}else{
						showModalMensaje('ERROR!','error', resp.p_mensaje);
					}
				})
			} catch (error) {
				console.log("Error en la funcion de Guardar!",error);
			}finally{
				setActivarSpinner(false);
			}
		}else{
			setModifico();
			setBloqueoCabecera(false)
			Main.message.info({
				content  : `No encontramos cambios para guardar`,
				className: 'custom-class',
				duration : `${2}`,
				style    : {
					marginTop: '2vh',
				},
			});
			var fila = await getFocusedRowIndex();
			if(fila == -1){
				fila = 0;
			}
			setTimeout(()=>{
				grid.current.instance.focus(grid.current.instance.getCellElement( fila, columns[ColumnDefaultPosition]["ID"]));
			},5)
		}
	}
	const showModalMensaje = (titulo,imagen, mensaje) => {
		setTituloModal(titulo);
		setImagen(imagen);
		setMensaje(mensaje);
		setVisibleMensaje(true);
	};
	const handleCancelModal =()=>{
		setVisibleMensaje(false)
	};
	const openCancelarComponent = async(fila)=>{
		var indexfila = getFocusedRowIndex();
		var AuxDataCancelCab= ''
		
		if(getcancelarCab()){
			AuxDataCancelCab   = await JSON.parse(await getcancelarCab());
		}
		setRows(AuxDataCancelCab) 

		if(getCancelarDet()){
			var AuxDataCancelDet   = await JSON.parse(await getCancelarDet());    
			const dataSource = new DataSource({
				store: new ArrayStore({
						keyExpr:"ID",
						data: AuxDataCancelDet
				}),
				key: 'ID'
			})
			gridDet.current.instance.option('dataSource', dataSource);
			setCancelarDet(JSON.stringify(AuxDataCancelDet));
		}
		
		grid.current.instance.state(null)
		grid.current.instance.refresh(true);
		grid.current.instance.cancel = true
		grid.current.instance.cancelEditData();
		setBloqueoCabecera(false)
		setActivarSpinner(true)
		setModifico();
		getEstablecerOperaciones();
		if(_.isNumber(fila)) indexfila = fila
		setTimeout(()=>{ 
		  grid.current.instance.focus(grid.current.instance.getCellElement(indexfila,1));
		  setActivarSpinner(false);
		},4);
	}
  	return (      
		<>
			<Main.ModalDialogo
				positiveButton={""}
				negativeButton={"OK"}
				negativeAction={handleCancelModal}
				onClose={handleCancelModal}
				setShow={visibleMensaje}
				title={tituloModal}
				imagen={imagen}
				mensaje={mensaje}
			/>
			<Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
				<Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}` }/>
					<Main.Spin size="large" spinning={activarSpinner} >
					 <div className='paper-container'>
						 <Main.Paper className="paper-style">
								<DevExtremeCab 
									grid={grid}
									gridDet={idGrid}
									rows={rows}
									id="ROWS"
									setRows={setRows}
									title={"Marcas"}
									setRowFocus={setRowFocus}
									// modifico={modifico}
									refCancelar={refCancelar}
									cancelar
									// setModifico={setModifico}
									columns={columns}
									guardar={guardar}
									FormName={FormName}
									columnModal={columnModal}
									ColumnDefaultPosition={ColumnDefaultPosition}
									columBuscador={columBuscador}
									doNotsearch={doNotsearch}
									notOrderByAccion={notOrderByAccion}
									url_Buscador={url_Buscador}						
									openCancelar = {openCancelarComponent}
									//
									setActivarSpinner={setActivarSpinner}
									activateF10={true}
									
							/>
							<br />
							<Row gutter={[8]}>
								<Col span={24}>
									<DevExtremeDet
										gridDet={gridDet}
										id="TIPOCARTERA"
										columnDet ={columnsDet}
										initialRow={initialRow}
										notOrderByAccion={notOrderByAccionDet}
										// modifico={modifico}
										// setModifico={setModifico}
										FormName={FormName}
										guardar={guardar}
										setActivarSpinner={setActivarSpinner}
										columnModal={columnModalDet}
										//
										activateF10={true}
									/>
								</Col>
							</Row>
						</Main.Paper>
					</div>
			   </Main.Spin>
		    </Main.Layout>
		</>
  	) 
} )
export default MarcasList




// import React, { useState, useEffect, useRef } from 'react';
// import Main from '../../../../components/utils/Main';
// import {ValidarColumnasRequeridas} from '../../../../components/utils/DevExtremeGrid/ValidarColumnasRequeridas'
// import DevExtremeCab,{ArrayPushDelete,
// 					  setcancelarCab,
// 					  getcancelarCab,
// 					  getEstablecerOperaciones,
// 					  getFocusedRowIndex} from "../../../../components/utils/DevExtremeGrid/DevExtremeCab";
// import DevExtremeDet,{setBloqueoCabecera,} from '../../../../components/utils/DevExtremeGrid/DevExtremeDet';
// import { v4 as uuidID } from 'uuid';
// import { Col, Row } 	from 'antd';
// import _ 				from "underscore"
// import ArrayStore 		from 'devextreme/data/array_store';
// import DataSource 		from 'devextreme/data/data_source';
// const url_valida_tipo_cartera = '/st/stmarart/valida/tipoCartera';
// const url_busca_tipo_cartera  = '/st/stmarart/buscar/tipoCartera';
// var cancelarDet = ""

// const setCancelarDet = (valor)=>{
//   cancelarDet = valor
// };
// const getCancelarDet = ()=>{
//   return cancelarDet;
// };
// const columnModalDet = {
//     urlValidar:[
//         { COD_TIPO : url_valida_tipo_cartera }
//     ],
//     urlBuscador:[
//         { COD_TIPO :  url_busca_tipo_cartera }
//     ],
//     title:[
//         { COD_TIPO : 'Tipo' },
//     ],
//     COD_TIPO:[
//         { ID: 'COD_TIPO'     , label: 'Tipo'        , width: 110      , align:'left' },
//         { ID: 'DESCRIPCION'  , label: 'Descripción' , minWidth: 70    , align:'left' },
//     ],
//     config:{
// 		// auto: [],
// 	},
// }
// const columnsDet = [
//     { ID: 'COD_TIPO'     , label: 'Tipo'         , width: 80      , align:'left'   , requerido:true  , upper:true},
//     { ID: 'DESCRIPCION'  , label: 'Descripción'  , minWidth: 190  , align:'left'   , disable:true}   ,
//     { ID: 'CANT_PUNTO'   , label: 'Puntos'       , width: 150     , align:'center' , isNumber:true },
// ];
// const columnModal = {
//     urlValidar:[],
//     urlBuscador:[],
//     title:[],
//     config:{},
// }
// const columns = [
//     { ID: 'COD_MARCA'    , label: 'Marca'       , width: 100    , align:'center' , disable:true   , isNumber: true },
//     { ID: 'DESCRIPCION'  , label: 'Descripción' , minWidth: 210 , align:'left'   , requerido:true},
//     { ID: 'ABREVIATURA'  , label: 'Abreviatura' , width: 100   },    
//     { ID: 'NRO_ORDEN'    , label: 'Orden'       , width: 100    , isNumber: true , align:'right' },
//     { ID: 'CARGA_META'   , label: 'Carga Meta'  , width: 100    , align:'center' , checkbox:true , checkBoxOptions:["S","N"] },
//     { ID: 'ESTADO'       , label: 'Activo'      , width: 100    , align:'center' , checkbox:true , checkBoxOptions:["A","I"] },
// ];

// const columBuscador 	  = 'DESCRIPCION'
// const doNotsearch 		  = ['ESTADO','CARGA_META']
// const notOrderByAccion 	  = ['']
// const notOrderByAccionDet = [''];
// const TituloList 		  = "Artículos - Categorías";
// const defaultOpenKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
// const defaultSelectedKeys = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STMARART'];
// const FormName = "STMARART";
// const ColumnDefaultPosition = 1;

// const MarcasList = React.memo( () => {
// 	const grid = useRef();
// 	const gridDet = useRef();
// 	const idGrid = {ROWS:grid,TIPOCARTERA:gridDet, defaultFocus:{ROWS:1,TIPOCARTERA:0}}
// 	const url_marca     = '/st/stmarart/' + sessionStorage.getItem('cod_empresa');
// 	const url_Buscador  = '/st/stmarart/search';
// 	const url_cod_marca = '/st/stmarart/cod_marca';
// 	const url_abm 		= '/st/stmarart';
// 	const [rows 	  		, setRows 	  		  ] = useState([]);
// 	const [activarSpinner   , setActivarSpinner   ] = useState(false);
// 	const [modifico         , setModifico         ] = useState(false);
// 	//-----------------------Estado Modal mensaje ----------------------------------
// 	const [visibleMensaje   , setVisibleMensaje   ] = useState(false);
// 	const [mensaje          , setMensaje          ] = useState();
// 	const [imagen           , setImagen           ] = useState();
// 	const [tituloModal      , setTituloModal      ] = useState();
// 	const initialRow = [{COD_MARCA:"COD_MARCA"}];

// 	useEffect(async() => {
// 		getData();
// 	},[]);
// 	// CABECERA
// 	const getData = async () => {
// 		setActivarSpinner(true);
// 		var content = await getInfo(url_marca,"GET",[]);
// 		setRows(content);
// 		setActivarSpinner(false);
// 		setTimeout( ()=>{
//             if(grid.current !== null){
//                grid.current.instance.focus(grid.current.instance.getCellElement(0,1));
//             }
//         },10);
// 	};
// 	// GET GENERICO
// 	const getInfo = async(url, method, data) => {
// 		var content = [];
// 		try {
// 			var info = await Main.Request(url,method,data);
// 			if(info.data.rows) content = info.data.rows;
// 			return content;
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}
// 	const setRowFocus = async(e)=>{
// 		var content = [];
// 		var info = await Main.Request('/st/stmarart/tipoCartera','POST',{ 
// 			cod_empresa: sessionStorage.getItem("cod_empresa"), 
// 			cod_marca: e.row.data.COD_MARCA
// 		});
// 		if(info.data.rows.length == 0){
// 			var newKey = uuidID();
// 			content = [{
// 				ID	      	  : newKey,
// 				COD_MARCA  	  : e.row.data.COD_MARCA === undefined ? e.row.data.ID : e.row.data.COD_MARCA,
// 				idCabecera    : e.row.data.ID,
// 				InsertDefault : true,
// 			}]
// 		}else{
// 			content = info.data.rows
// 		}
// 		const dataSource = new DataSource({
// 			store: new ArrayStore({
// 			  	// keyExpr:"ID",
// 			  	data: content,
// 			}),
// 			key: 'ID'
// 		})
// 		gridDet.current.instance.option('dataSource', dataSource);
// 		gridDet.current.instance.option('loadPanel.enabled', false);  
//       	gridDet.current.instance.refresh();
// 		setCancelarDet(JSON.stringify(content));
// 		gridDet.current.instance.refresh();
// 	}
// 	const guardar = async ()=>{
// 		var datosCab
// 		if(rows.length > 0){
// 			datosCab = await rows.filter( item => item.inserted || item.updated);
// 		}
// 		var datosDet = gridDet.current.instance.getDataSource()._items;
// 		if(datosDet.length > 0){
// 			datosDet = await datosDet.filter( item => (item.inserted || item.updated));
// 		}
// 		var datosValidar = {
// 			id:			 [{ ROWS:grid     , TIPOCARTERA:gridDet	   }],
// 			column:		 [{ ROWS:columns  , TIPOCARTERA:columnsDet }],
// 			datos:       [{ ROWS:datosCab , TIPOCARTERA:datosDet   }]
// 		}
// 		const valor = await ValidarColumnasRequeridas(datosValidar);
// 		if(valor) return;
// 		// CABECERA
// 		var contentCab   = await Main.GeneraUpdateInsertCab(rows, 'COD_MARCA', url_cod_marca);
// 		var updateInsert = contentCab.updateInsert;
//         var rowsDelete   = ArrayPushDelete.ROWS != undefined ? ArrayPushDelete.ROWS : [] ;
// 		// DETALLE
// 		// PARAMETRO PARA GENERERAR EL UPDATE Y EL INSERT DEL DETALLE
// 		var tiposCartera = gridDet.current.instance.getDataSource()
// 		var updateDependencia = [{
// 			'COD_TIPO': 'COD_TIPO_ANT'
// 		}];
// 		var contentDet   = await Main.GeneraUpdateInsertDet(tiposCartera._items,['COD_TIPO'],contentCab.updateInsert, updateDependencia);
// 		var updateInsertTipoCartera = contentDet.updateInsert;
// 		var rowsDeleteTipoCartera   = ArrayPushDelete.TIPOCARTERA != undefined ? ArrayPushDelete.TIPOCARTERA : [];

// 		var info = [{"cod_usuario": sessionStorage.getItem('cod_usuario'),"cod_empresa":sessionStorage.getItem('cod_empresa')}]
// 		var data = {
// 			updateInsert, 
//             rowsDelete,
// 			updateInsertTipoCartera,
// 			rowsDeleteTipoCartera,
// 			info
// 		}
// 		if(updateInsert.length > 0 || rowsDelete.length > 0 || 
// 		   updateInsertTipoCartera.length > 0 || rowsDeleteTipoCartera.length > 0){
// 			setActivarSpinner(true);
// 			try{
// 				var method = "POST"
// 				await Main.Request( url_abm, method, data).then(async(response) => {
// 					var resp = response.data;
// 					if(resp.ret == 1){
// 						Main.message.success({
// 							content  : `Procesado correctamente!!`,
// 							className: 'custom-class',
// 							duration : `${2}`,
// 							style    : {
// 							marginTop: '4vh',
// 							},
// 						});
// 						setModifico(false)
// 						setRows(contentCab.rowsAux); 
// 						setcancelarCab(JSON.stringify(contentCab.rowsAux));
// 						setCancelarDet(JSON.stringify(contentDet.rowsAux));
// 						var fila = await getFocusedRowIndex();
// 						if(fila == -1){
// 							fila = 0;
// 						}
// 						const dataSource = new DataSource({
// 							store: new ArrayStore({
// 									keyExpr:"ID",
// 									data: contentDet.rowsAux
// 							}),
// 							key: 'ID'
// 						})
// 						gridDet.current.instance.option('dataSource', dataSource);
// 						gridDet.current.instance.refresh();
// 						getEstablecerOperaciones()
// 						//funciones Globales
// 						setBloqueoCabecera(false);
// 						grid.current.instance.focus(grid.current.instance.getCellElement( fila, columns[ColumnDefaultPosition]["ID"]));
// 					}else{
// 						showModalMensaje('ERROR!','error', resp.p_mensaje);
// 					}
// 				})
// 			} catch (error) {
// 				console.log("Error en la funcion de Guardar!",error);
// 			}finally{
// 				setActivarSpinner(false);
// 			}
// 		}else{
// 			if(modifico)setModifico(false);
// 			setBloqueoCabecera(false)
// 			Main.message.info({
// 				content  : `No encontramos cambios para guardar`,
// 				className: 'custom-class',
// 				duration : `${2}`,
// 				style    : {
// 					marginTop: '2vh',
// 				},
// 			});
// 			var fila = await getFocusedRowIndex();
// 			if(fila == -1){
// 				fila = 0;
// 			}
// 			setTimeout(()=>{
// 				grid.current.instance.focus(grid.current.instance.getCellElement( fila, columns[ColumnDefaultPosition]["ID"]));
// 			},5)
// 		}
// 	}
// 	const showModalMensaje = (titulo,imagen, mensaje) => {
// 		setTituloModal(titulo);
// 		setImagen(imagen);
// 		setMensaje(mensaje);
// 		setVisibleMensaje(true);
// 	};
// 	const handleCancelModal =()=>{
// 		setVisibleMensaje(false)
// 	};
// 	const openCancelarComponent = async(fila)=>{
// 		var indexfila = getFocusedRowIndex();
// 		var AuxDataCancelCab   = await JSON.parse(await getcancelarCab());
// 		var AuxDataCancelDet   = await JSON.parse(await getCancelarDet());    
// 		setRows(AuxDataCancelCab) 
// 		const dataSource = new DataSource({
// 			store: new ArrayStore({
// 			  	keyExpr:"ID",
// 			  	data: AuxDataCancelDet
// 			}),
// 			key: 'ID'
// 		})
// 		gridDet.current.instance.option('dataSource', dataSource);
// 		setCancelarDet(JSON.stringify(AuxDataCancelDet));
// 		grid.current.instance.state(null)
// 		grid.current.instance.refresh(true);
// 		grid.current.instance.cancel = true
// 		grid.current.instance.cancelEditData();
// 		setBloqueoCabecera(false)
// 		setActivarSpinner(true)
// 		setModifico(false);
// 		getEstablecerOperaciones();
// 		if(_.isNumber(fila)) indexfila = fila
// 		setTimeout(()=>{ 
// 		  grid.current.instance.focus(grid.current.instance.getCellElement(indexfila,1));
// 		  setActivarSpinner(false);
// 		},4);
// 	}
//   	return (      
// 		<>
// 			<Main.ModalDialogo
// 				positiveButton={""}
// 				negativeButton={"OK"}
// 				negativeAction={handleCancelModal}
// 				onClose={handleCancelModal}
// 				setShow={visibleMensaje}
// 				title={tituloModal}
// 				imagen={imagen}
// 				mensaje={mensaje}
// 			/>
// 			<Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
// 				<Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}` }/>
// 				<Main.Spin size="large" spinning={activarSpinner} >
// 					<DevExtremeCab 
// 						grid={grid}
// 						gridDet={idGrid}
// 						rows={rows}
// 						id="ROWS"
// 						setRows={setRows}
// 						title={"Marcas"}
// 						setRowFocus={setRowFocus}
// 						modifico={modifico}
// 						setModifico={setModifico}
// 						columns={columns}
// 						guardar={guardar}
// 						FormName={FormName}
// 						columnModal={columnModal}
// 						ColumnDefaultPosition={ColumnDefaultPosition}
// 						columBuscador={columBuscador}
// 						doNotsearch={doNotsearch}
// 						notOrderByAccion={notOrderByAccion}
// 						url_Buscador={url_Buscador}						
// 						openCancelar = {openCancelarComponent}						
// 					/>
// 					<br />
// 					<Row gutter={[8]}>
// 						<Col span={24}>
// 							<DevExtremeDet
// 								gridDet={gridDet}
// 								id="TIPOCARTERA"
// 								columnDet ={columnsDet}
// 								initialRow={initialRow}
// 								notOrderByAccion={notOrderByAccionDet}
// 								modifico={modifico}
// 								setModifico={setModifico}
// 								FormName={FormName}
// 								guardar={guardar}
// 								columnModal={columnModalDet}
// 							/>
// 						</Col>
// 					</Row>
// 			   </Main.Spin>
// 		    </Main.Layout>
// 		</>
//   	) 
// } )
// export default MarcasList
