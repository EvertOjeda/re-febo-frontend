import React,{ useState,useRef}      from 'react'
import  Paper 					             from '@material-ui/core/Paper';
import Button 					             from '@material-ui/core/Button';
import styles 					             from './Styles';
import { BiSearchAlt } 	             from "react-icons/bi";
import moment                        from 'moment';
import FormModalSearch               from '../ModalForm/FormModalSearch';
import ModalDialogo                  from "../Modal/ModalDialogo";
import NewTableSearch                from '../NewTableSearch/NewTableSearch';
import Main                          from '../Main';
import { v4 as uuidID  }             from 'uuid';
// import Search,{ setFocusedRowIndex, getFocusedRowIndex }  
//                                      from './Search'  
import _                             from 'underscore';
import { Spin,message,Typography }   from 'antd';
import {getPermiso}                  from './PermisosEdit'
import DataGrid, {
  Column ,   Editing,   Paging,    Lookup,   KeyboardNavigation, LoadPanel,
	Sorting,   Pager  }                from "devextreme-react/data-grid";
import {Request}                     from '../../../config/request';
import $                             from 'jquery';
import './stylesDevExtemeComponent.css'
import "devextreme/dist/css/dx.material.blue.light.compact.css";
import CustomStore from "devextreme/data/custom_store";

const { Title }    = Typography;
const deMessages   = require('devextreme/localization/messages/de.json');;
const EsMessages   = require('devextreme/localization/messages/es.json');
const localization = require('devextreme/localization'); 
localization.loadMessages(deMessages);
localization.loadMessages(EsMessages);
localization.locale(navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage));
var DatosEdit = {}; 
export const getDatosEdit = ()=>{
 return DatosEdit
}
export const setDatosEdit = (values)=>{
	DatosEdit = values;
}
var focusGlobalEvent;
const setFocusGlobalEvent = (valor)=>{
  focusGlobalEvent = valor;
}
const getFocusGlobalEvent = ()=>{
  return focusGlobalEvent;
}
var focusedRowIndex = 0; 
const setFocusedRowIndex = (valor)=>{
    focusedRowIndex = valor;
}
export const getFocusedRowIndex = ()=>{
  return focusedRowIndex;
}
var focusedColumnName
const setFocusedColumnName = (valor)=>{
  focusedColumnName = valor;
}
const getFocusedColumnName = ()=>{
  return focusedColumnName;
}
var focusedColumnIndex;
const setFocusedColumnIndex = (valor)=>{
  focusedColumnIndex = valor;
}
const getFocusedColumnIndex = ()=>{
  return focusedColumnIndex;
}
var nameRowsEnter
const setNameRowsEnter = (keyName)=>{
  nameRowsEnter = keyName;
};
const getNameRowsEnter = ()=>{
  return nameRowsEnter
}
var rowColumnErrorModaF9 = new Array
const setRowColumnErrorModaF9 = (fila, column)=>{
  rowColumnErrorModaF9 = []
  rowColumnErrorModaF9.push({'fila':fila});
  rowColumnErrorModaF9.push({'columna':column});
};
const getRowColumnErrorModaF9 = ()=>{
  return rowColumnErrorModaF9
}
var eventValuesCheckbox
const setEventValuesCheckbox = (e)=>{
  eventValuesCheckbox = e;
};
const getEventValuesCheckbox = ()=>{
  return eventValuesCheckbox
}

var rowsDelete = new Array();
var obejto
const setRowsDelete = (e)=>{
  if(e.length === 0){
    rowsDelete = []
  }else if(JSON.stringify(obejto) !== JSON.stringify(e)){
    rowsDelete.push(e);
  } 
  obejto = e;
}
const getRowsDelete = ()=>{
  return rowsDelete
}

const arrayHeadEdit      = []
const headEdit           = []

var globalValidate       = true;
var valorAnteriorEnter   = ""; 
var valorActualEnter     = ""; 
// es un bandera se utiliza para que almacene los datos en un JSON.stringify
var Ba = 0;
var ArrayDependenciaGlobal = new Array
var dataAuxCancel = ""
var setEditarModalNew = false;


const store = new CustomStore({
  key: ["ID"],

  load: (loadOptions) => {
    console.debug("store loadOptions: ", loadOptions);
    return employees;
  },

  update: (key, values) => {
    console.debug("store update args: ", { key, values });
    return;
  }
});


const DevExtremeComponent = React.memo((props) => {

  if(Ba <= 4){
    dataAuxCancel = JSON.stringify(props.data);    
    Ba++;
  }
  const username            = sessionStorage.getItem('cod_usuario');
  const cod_empresa         = sessionStorage.getItem('cod_empresa');
  const classes             = styles();
  const sizePagination      = 17;
  const buttonSaveRef       = React.useRef();
  //---------------------------  ctrl+m ---------------------------------------------------
  Main.useHotkeys(Main.nuevo, (e) =>{
        e.preventDefault();
        addRow();
  },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    //---------------------------  props ----------------------------------------------------
    const columns                 = props.columns;         
    const FormName                = props.formName;     
    const setOnChangeValue        = props.setOnChangeValue;
    const activarCancelar         = props.activarCancelar;
    const stateCancelar           = props.stateCancelar;
    const rowFocus                = props.rowFocus;
    const grid                    = props.grid; 

    // const onFocusedRowChangedTest = props.onFocusedRowChangedTest;
    // const title           = props.title;    
    // const nombreSeleccio  = props.columBuscador;    
    const optionSelect    = props.arrayOptionSelect;  
    const urlAbm          = props.urlAbm;
    const columnModal     = props.arrayColumnModal;

    //-------------------Estado DataGrid-----------------------------------------------------    
    // const [editarRows       , setEditarRows       ] = useState(false);
    const [datosrows        , setDatosRows        ] = useState(props.data);
    const [tipoDeBusqueda   , setTipoDeBusqueda   ] = useState();
    // const [headSeled        , setheadSeled        ] = useState([nombreSeleccio])
    const [modifico         , setModifico         ] = useState(false);
    const [activarSpiner    , setActivarSpiner    ] = useState(false);
    const [columnEditDisable, setColumnEditDisable] = useState([]);
    
    //---------------------------Estado Modal-------------------------------------------
    const [shows            , setShows            ] = useState(false);
    const [modalTitle       , setModalTitle       ] = useState();
    const [searchColumns    , setSearchColumns    ] = useState();
    const [searchData       , setSearchData       ] = useState({});
    //---------------------------Estado Modal mensaje ----------------------------------
    const [visibleMensaje   , setVisibleMensaje   ] = useState(false);
    const [mensaje          , setMensaje          ] = useState();
    const [imagen           , setImagen           ] = useState();
    const [tituloModal      , setTituloModal      ] = useState();
    /*---------------------------add column-------------------------------- */
    
  const establecerFocus = (fila,column,params)=>{
    setTimeout( ()=>{
      if(params){
        grid.current.instance.focus(grid.current.instance.getCellElement(fila,column));
      }else{
        grid.current.instance.focus(grid.current.instance.getCellElement(0,0));
      }
    },200);
  }
  const handleCancel = async() => {
    setVisibleMensaje(false);
    setTimeout(async()=>{
        var column = getFocusedColumnIndex();
        var fila   = getFocusedRowIndex();
        if(fila == -1) fila = 0;
        if(!globalValidate){
            fila   = await getRowColumnErrorModaF9()[0].fila;
            column = await getRowColumnErrorModaF9()[1].columna;
            grid.current.instance.focus(grid.current.instance.getCellElement(fila,column))
            await grid.current.instance.editCell(fila, column);
            await grid.current.instance.cellValue(fila, column,valorActualEnter);
        }else{
            await grid.current.instance.focus(grid.current.instance.getCellElement(fila,column))
            await grid.current.instance.editCell(fila, column);
        }        
     })
  };
  const showModalMensaje = (titulo,imagen, mensaje) => {
    setTituloModal(titulo);
    setImagen(imagen);
    setMensaje(mensaje);
    setVisibleMensaje(true);
  };
  const showsModal = async (valor) => {
    setShows(valor);
  };
  const filtradoEdicion = () =>{
    columns.filter((item)=>{
      if(item.edit == false)arrayHeadEdit.push(item.ID)
      else if((!item.disable) || (!item.edit == false))
      headEdit.push(item.ID)
    });
  }  
  
  React.useEffect(() => {

    if(props.data.length > 0){
      setDatosRows(props.data);
    }

      // if(props.addRow){
      //   if(props.defaultKeyHead){
      //     grid.current.instance.option('dataSource', []);
      //     grid.current.instance.saveEditData();
      //     addRow(props.defaultKeyHead,true);
      //     props.setAddRow(false);
      //   }
      // }

		// setDatosRows(props.data);
  //   setDatosEdit(props.data[0]);
  //   setTimeout(()=>establecerFocus(),130)
  //   filtradoEdicion()
  //   var arrayInsert = _.flatten(_.filter(columns, function(item){
  //     if(item.editModal === false || item.editModal === true || item.Pk === true) return item;
  //   }));
  //   setColumnEditDisable(arrayInsert);
  },[props.data]);

  const listFiltro = async (datos) => {
    setDatosRows(datos)
    setDatosEdit(datos[0])
  }
  const opcionComparar = (values, opcion) => {
    var check = false;
    if(opcion !== undefined){
      if(opcion.length > 0){
        for (let i = 0; i < opcion.length; i++) {
          if(values === opcion[i]){
            check=true;
            break;
          }
        }
      }
    }
    return check;
  }
	// const selectedHead = async (e,idHead) => {
  //   e.stopPropagation()
	// 	var iconohead = await document.getElementsByName(idHead);
	// 	var exists    = await headSeled.includes(idHead);

	// 	if(exists){
	// 		iconohead[0].style.visibility = 'collapse'
	// 		const indice = headSeled.indexOf(idHead)
	// 		headSeled.splice(indice, 1);
	// 	}else{
	// 		setheadSeled(await headSeled.concat(idHead));
	// 		document.getElementsByName(idHead)[0].style.visibility = 'visible';
	// 	}
	// }
  // const renderHeader = (e,column) => {
  //   return (
  //     <>
  //     { opcionComparar(column.ID, props.doNotsearch)
  //       ? 
  //         <div  id={column.vertical ? "verticalDataGridTest" : null}  key={column.ID} className={classes.selectHeader} disabled >
  //           {column.label}
  //         </div>
  //       :
  //         <div   key={column.ID}
  //                   id={column.vertical ? "verticalDataGridTest" : null}
  //                   className={classes.selectHeader} 
  //           >
  //                   {column.label}
  //       </div>
  //     }
  //     </>
  //   );
  // }
  const renderHeader = (e,column) => {
    return (
      <>
      { opcionComparar(column.ID, props.doNotsearch)
        ? 
          <div 
            id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : "horizontalDatagrid"}
            key={column.ID}
            // className={classes.selectHeader} 
            // disabled
            >
            {column.label}
          </div>
        :
          <Button   key={column.ID}
                    id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : null}
                    className={classes.selectHeader} 
                    // onClick={(e) => selectedHead(e,column.ID)} 
                    >
                    {column.label}
                    {/* { headSeled.includes(column.ID)
                      ?
                          <i name={column.ID} className={classes.auxIconHead}>
                            <BiSearchAlt/>
                          </i>
                      :
                          <i name={column.ID} className={classes.iconHead}>
                          <BiSearchAlt/>
                        </i>
                    } */}
        </Button>
      }
      </>
    );
  }
  const onFocusedRowChanged = async (e)=>{
    // onFocusedRowChangedTest(e);
    setFocusedRowIndex(e.newRowIndex);
    setFocusGlobalEvent(await e);
    if(e.row){
      if(props.rowFocus){
        rowFocus(e.row.data);
      }
      setDatosEdit(e.row.data);
    }else{ return}  
  }
  const setCellValue = async(newData, value, columnRowData, column)=>{
    var newValue       = await value ? column.checkBoxOptions[0] : column.checkBoxOptions[1];
    newData[column.ID] = await newValue;
  }
  const onFocusedRowChanging = async (e) =>{
    // setFocusedRowIndex(e.newRowIndex); 
    var rowsCount = e.component.getVisibleRows().length,
    pageCount     = e.component.pageCount(),
    pageIndex     = e.component.pageIndex(),
    key = e.event && e.event.key;
    if(key && e.prevRowIndex === e.newRowIndex) {
      if(e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
          e.component.pageIndex(pageIndex + 1).done(function() {
          e.component.option('focusedRowIndex', 0);
        });
      } else if(e.newRowIndex === 0 && pageIndex > 0) {
          e.component.pageIndex(pageIndex - 1).done(function() {
          e.component.option('focusedRowIndex', rowsCount - 1);
        });
      }
    }
  }
  const onFocusedCellChanging = async(e)=> {
    setEventValuesCheckbox(e);
    setFocusedColumnName(e.columns[e.newColumnIndex].dataField);
    setFocusedColumnIndex(e.newColumnIndex);
    let permisoEdit     = await getPermiso(FormName,'U')
    var dataColumn      = getFocusedColumnName();
    if(columnEditDisable.length > 0){
      for (let i = 0; i < columnEditDisable.length; i++) {
        const items = columnEditDisable[i];
        
        if(items.ID === dataColumn && permisoEdit && e.rows[e.newRowIndex].data.inserted){
          setEditarModalNew = true;
          e.columns[e.newColumnIndex].allowEditing = true
          // 
          break;
        }
        if(items.ID === dataColumn && permisoEdit && items.editModal == true){
          e.columns[e.newColumnIndex].allowEditing = true          
          setEditarModalNew = true
        }
        if(items.ID === dataColumn && permisoEdit && items.editModal == false){
          e.columns[e.newColumnIndex].allowEditing = false
           setEditarModalNew = false
        }
        
        if(items.ID === dataColumn && permisoEdit && items.Pk){
          e.columns[e.newColumnIndex].allowEditing = false
            setEditarModalNew = false
        }      
      }
    }
    if(e.event){
      if (e.event.key === "Enter") {
        let addNewRow  = true;
        if(props.addRow === false || _.isUndefined(!props.addRow)) addNewRow = false
        var columnLength    = columns.length;
        var rowIndex        = e.newRowIndex;
        var columnIndex     = e.newColumnIndex;
        var prevColumnIndex = e.prevColumnIndex;
        if (
          datosrows.length - 1 === rowIndex        &&
          columnLength     - 1 === columnIndex     &&
          columnLength     - 1 === prevColumnIndex &&
          addNewRow
        ) {
          addRow();
        }
      }
    }
  }
  const addRow = async(isNewHaedKey,isNewHead) => {    
      var rowIndex = 0      
      var datos = getFocusGlobalEvent();
      if(datos){
        rowIndex = await grid.current.instance.getRowIndexByKey(datos.row.data.ID);
        if(rowIndex == -1) rowIndex = 0;
        else rowIndex++;
      }
      var newKey = uuidID();
      var row    = [0]
      row = [{
        ...row[0],
        ID         : newKey,
        inserted   : true,
        COD_EMPRESA: cod_empresa,
        COD_USUARIO: username,
        Headkey    : isNewHaedKey,
      }]
      if( !_.isUndefined(props.initialRow) ){
        if(props.initialRow.length > 0){
          for (let i = 0; i < props.initialRow.length; i++) {
            const item = props.initialRow[i];
            row[0][Object.keys(item)] = item[Object.keys(item)];
          }
        }
      }
      columns.forEach(async element => {
        if(element.isdate)         row[0][element.ID] = moment();
        if(element.checkbox)       row[0][element.ID] = element.checkBoxOptions[1];  
        if(element.isOpcionSelect){
          _.flatten(_.filter(optionSelect[element.ID], function(item){
            if (item.isNew) row[0][element.ID] = item.ID;
          }));
        } 
      });
      setDatosRows(datosrows.concat(datosrows.splice(rowIndex, 0, ...row)));      
      setTimeout(()=>{
        if(!isNewHead){
          grid.current.instance.focus(grid.current .instance.getCellElement(rowIndex,columns[0]["ID"]));
        }
        grid.current.instance.repaintRows([rowIndex])
        grid.current.instance.saveEditData();
      },90);
  }
	const onRowUpdating  = async(value) =>{
    var columnNameEdit = Object.keys(value.newData);
    setNameRowsEnter(Object.keys(value.newData)[0])
    
    props.setOnChangeValue(value);

		var rowsColumn = columns.filter(item => item.ID == columnNameEdit[0]);    
		if(rowsColumn[0].upper){
		  value.newData[columnNameEdit[0]] = value.newData[columnNameEdit[0]].toUpperCase();
		}
		if(!stateCancelar)activarCancelar(true);
    
		valorAnteriorEnter  = value.oldData[columnNameEdit[0]];
		valorActualEnter    = value.newData[columnNameEdit[0]];
		
		if(columnModal){
			if(columnModal[columnNameEdit[0]]){
        grid.current.instance.option("focusedRowKey", 120);
        grid.current.instance.clearSelection();
        grid.current.instance.focus(0);

				await funcionValidacion(columnNameEdit[0], value.newData[columnNameEdit[0]], value);
			}
		}

		if(globalValidate){
		  globalValidate = true;
		  if(!value.oldData.inserted) value.oldData.updated = true
		}else{
		  value.cancel   = false
		  var filas      = grid.current.instance.getRowIndexByKey(value.key); 
		  var indexComun = grid.current.instance.getCellElement(filas,columnNameEdit[0]);
		  setRowColumnErrorModaF9(filas, indexComun.cellIndex);
		  value.component.cancelEditData();
		}
	}  
	const funcionValidacion = async (nameColumn, value, rowsData)=>{
    var ArrayDataDependencia = await validarDependencia(13);
    if( ArrayDataDependencia == true){ globalValidate = false; return}

		var valor_anterior = valorAnteriorEnter;
		var valor_actual   = await value;
		rowsData.component.navigateToRow(rowsData.key)
	  
		if(valor_anterior !== valor_actual || globalValidate == false){      
		  var valor       = await value
		  if(!_.isNumber(valor) && !_.isNull(valor) && !_.isNaN(valor) && !_.isUndefined(valor) ) valor = await value.trim();
		  var url         = columnModal.urlValidar[0][nameColumn];
		  var indexRows   = rowsData.component.getRowIndexByKey(rowsData.key)
		  var columnhead  = getFocusGlobalEvent();

      await grid.current.instance.clearSelection();
      await grid.current.instance.option("focusedRowIndex", -1);

		  try{
			var method = 'POST'        
			var data   = {'valor':valor,cod_empresa,dependencia:ArrayDataDependencia};
			await Main.Request( url, method, data)
			.then(async response => {				
			  if(response.status == 200 ){
          if(response.data.outBinds.ret == 1){
            if(Object.keys(response.data.outBinds).length > 3){
              for(var i in response.data.outBinds){
                if(i != 'ret'){
                  rowsData.oldData[i] = response.data.outBinds[i]
                }        
              }
            }else{
              var nombreColumn = columnModal[nameColumn][1].ID.toLocaleLowerCase();
              var descripcion  = response.data.outBinds[nombreColumn];
              rowsData.oldData[columnModal[nameColumn][1].ID] = await descripcion;
            }
            rowsData.component.repaintRows([indexRows]);

            if(columnModal.config[nameColumn].dependencia_de.length > 0){
              await columnDependencia(rowsData,columnModal.config[nameColumn].dependencia_de,nameColumn,true);
            }
            let indexComun = grid.current.instance.getCellElement(indexRows,nameColumn);
            var columna    = indexComun.cellIndex + 1;
            if(columnhead.row.cells[columna]){
              if(columnhead.row.cells[columna].column.name === columnModal[nameColumn][1].ID){
                columna = columna + 1;
                }
            }
            grid.current.instance.focus(grid.current.instance.getCellElement(indexRows,columna));
            globalValidate = true;
          }else{
            globalValidate = false;
            showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
          }
			  }
			});
		  } catch (error) {
			console.log("Error en funcionValidacio",error);
		  }
		} 
	}
  const getRowDataModal = async (url, tipo, data,dependencia)=>{
    let dataRows = []
    try {
        var method       = tipo;
        data.valor       = 'null'
        data.cod_empresa = sessionStorage.getItem('cod_empresa');
        data.dependencia = dependencia;
        await Main.Request(url,method,data)
        .then( response =>{
            if(response.data.rows){
              dataRows = response.data.rows;
            }                    
        });   
      return dataRows;
    } catch (error) {
        console.log("Error en el metodo getRowDataModal ",error);
    }
  }
  const onKeyDown = async (e)=>{
    if(e.event.keyCode === 120 && (columnModal)){
      if(Object.entries(columnModal).length > 0){
        var ArrayDataDependencia = await validarDependencia(120);        
        // var nameData             = await getFocusedColumnName();
        if(ArrayDataDependencia == true) return
        e.event.preventDefault();
        var columnName = await getFocusedColumnName();
        if(columnModal[columnName]){
          e.event.preventDefault();
          var url          = columnModal.urlBuscador[0][columnName]
          var AuxDatamodal = await getRowDataModal(url,'POST', {} ,ArrayDataDependencia)
          var title = await columnModal.title[0][columnName];
          setModalTitle(title)
          setSearchColumns(columnModal[columnName])
          setSearchData(AuxDatamodal);
          setTipoDeBusqueda(columnName);           
          setShows(true);
        }
      }    
    }
  }
  const onInteractiveSearch = async (event) => {
    var nameColumn  = await getFocusedColumnName();
    var valor       = event.target.value;
    var url         = columnModal.urlBuscador[0][nameColumn];
    valor           = valor.trim();
    if(valor.length === 0 ){
      valor = 'null';
    }
    var dependencia = ArrayDependenciaGlobal;
    try{
      var method = 'POST';
      var data   = {'valor':valor,cod_empresa,dependencia};
      await Request( url, method, data)
          .then( response => {
              if( response.status == 200 ){
                setSearchData(response.data.rows);
              }
      })
    } catch (error) {
      console.log("Error en onInteractiveSearch",error);
    }
  }
  
  const validarDependencia = async (key)=>{
    var ArrayDataDependencia = new Array();
    var nameData             = await getFocusedColumnName();
    if(key == 13) nameData   = getNameRowsEnter();   
    var info                 = await getFocusGlobalEvent().row.data;

    if( Object.keys(columnModal.config).length == 0 ){
      return [];
    }

    if(columnModal.config[nameData].depende_de.length > 0){

      for (let i = 0; i < columnModal.config[nameData].depende_de.length; i++){
        const items  = columnModal.config[nameData].depende_de[i];
        var dataName = items.id
          if(info[dataName] == ""){
            setTimeout(()=>{
              message.info({
                content  : `Favor complete el campo ${items.label} antes de continuar!!`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                  marginTop: '2vh',
                },
            });
            },100)            
            return true
          }else{
              var data = {[dataName]:info[dataName]}
              ArrayDataDependencia.push(data);
              ArrayDependenciaGlobal = ArrayDataDependencia;
          }
      }
    }
    return ArrayDataDependencia
  }
  const columnDependencia = async (rows,dependencia,busquedaPor,enter)=>{
    if( Object.keys(columnModal.config).length == 0 ){
      return;
    }
    var fila;
    var rowsData    =  getFocusGlobalEvent()
      dependencia.forEach(async items => {
        var key               = items.id
        var rowDelete         = columnModal[key];
        if(key !== busquedaPor && (enter)){         
          rows.oldData[rowDelete[0].ID] = ""
          rows.oldData[rowDelete[1].ID] = ""
          fila = grid.current.instance.getRowIndexByKey(rows.oldData.ID)
        }else{
          rows[rowDelete[0].ID] = ""
          rows[rowDelete[1].ID] = ""
          fila = grid.current.instance.getRowIndexByKey(rows.ID)
        }
      });
      await grid.current.instance.saveEditData();
      await rowsData.component.repaintRows([fila]);
      await grid.current.instance.option(rows)
  }
  const modalSetOnClick = async (datos, busquedaPor, datoskey) => {
    globalValidate = true; 
    await grid.current.instance.refresh(true);
    await grid.current.instance.cancelEditData();
    await grid.current.instance.saveEditData();
    if(datos !== "" || datos !== undefined){
      setModifico(true)
      var rows              = await getFocusGlobalEvent().row.data;
      var dataRow           = await getFocusGlobalEvent();
      var valor_anterior    = rows[busquedaPor];
      var valor_actual      = await datos[0];
      var codPropidadColumn = await grid.current.instance.columnOption(columnModal[busquedaPor][0].ID)
      var desPropidadColumn = await grid.current.instance.columnOption(columnModal[busquedaPor][1].ID)
      var indexRows         = grid.current.instance.getRowIndexByKey(rows.ID);
      if(indexRows == -1) indexRows = 0;
      var indexColum      = codPropidadColumn.visibleIndex;

      if( valor_anterior !== valor_actual ){

        if(columnModal.config[busquedaPor]){
          if(columnModal.config[busquedaPor].dependencia_de.length > 0){
            columnDependencia(rows,columnModal.config[busquedaPor].dependencia_de,busquedaPor,false);
          }
        }
        if(!desPropidadColumn && datos.length > 2 ){        
          for(var i in datoskey){
            if(i != 'ID'){
              getFocusGlobalEvent().row.data[i] = datoskey[i]
            }        
          }
          await grid.current.instance.option(rows);
        }else{
          getFocusGlobalEvent().row.data[codPropidadColumn.name] = await datos[0];
          getFocusGlobalEvent().row.data[desPropidadColumn.name] = await datos[1];
        }
        if(!getFocusGlobalEvent().row.data['inserted']){
          getFocusGlobalEvent().row.data['updated'] = true;
        }
        dataRow.component.repaintRows([indexRows])
      }
      showsModal(false);
      await grid.current.instance.option(rows)
      await dataRow.component.repaintRows([indexRows])
      establecerFocus(indexRows,indexColum,true);
      if(!stateCancelar)activarCancelar(true);
    }
  }
  const onEditorPreparing = async (e)=>{
    
    let columnNameEdit = e.name;
    var rowsColumn = columns.filter( item => item.ID == columnNameEdit);
    if(rowsColumn[0].isnumber){
      e.editorOptions.min = 0
    }
    if(rowsColumn[0].upper){
      e.editorElement.classList = "uppercaseInputDatagrid";
    }
    if(e.dataType === "boolean"){
      var className = $('.dx-cell-modified');
      if(className){
        $('.dx-cell-modified').removeClass("dx-cell-modified");
      }
    }
  }
  const onCellClick = (e)=>{
    if(!globalValidate){
      e.event.preventDefault();
      return;
    }
    setTimeout(()=>{
      grid.current.instance.focus(grid.current.instance.getCellElement(e.rowIndex,e.columnIndex))
    },20);
  }
  
  return (
    <div className="paper-container">
      <Paper className="paper-style">
        {/* <div className="paper-header">
          <Title level={4} className="title-color">{title}</Title>
        </div> */}
        <ModalDialogo
          positiveButton={""}
          negativeButton={"OK"}
          negativeAction={handleCancel}
          onClose={handleCancel}
          setShow={visibleMensaje}
          title={tituloModal}
          imagen={imagen}
          mensaje={mensaje}
        />
        <FormModalSearch 
            showsModal={showsModal}
            setShows={shows}
            title={modalTitle}
                componentData={
                    <NewTableSearch
                      onInteractiveSearch={onInteractiveSearch}
                      searchData={searchData}
                      columns={searchColumns}
                      modalSetOnClick={modalSetOnClick}
                      tipoDeBusqueda={tipoDeBusqueda}
                    />
                }
            descripcionClose=""
            descripcionButton=""
            actionAceptar=""
        />
        <Spin spinning={activarSpiner} size="large" >
              <DataGrid
                id="Xprueba"
                dataSource={_.isUndefined(datosrows) ? [] : datosrows.length > 0 ? datosrows : []}
                keyExpr="ID"
                showColumnLines={false}          
                repaintChangesOnly={true}
                showRowLines={true}
                showBorders={false}
                rowAlternationEnabled={false}
                autoNavigateToFocusedRow={false}
                focusedRowEnabled={true}
                focuRowEnable
                allowColumnReordering={true}
                focusRowEnabled={true}
                ref={grid}
                onFocusedRowChanged={onFocusedRowChanged}
                onFocusedRowChanging={onFocusedRowChanging}
                onFocusedCellChanging={onFocusedCellChanging}
                onRowUpdating={onRowUpdating}
                onKeyDown={onKeyDown}                
                height="130"
                onCellClick={onCellClick}
                onEditorPreparing={onEditorPreparing}                
                //----------------------------
                allowColumnResizing={false}
                errorRowEnabled={false}
                showBorders={true}
              >
              <Sorting mode="single" />
              <KeyboardNavigation
                editOnKeyPress={true}
                enterKeyAction= 'moveFocus'
                enterKeyDirection='row'
                onEnterKey/>
              <Paging enabled={false} />
              <Editing  mode="cell"
                        allowUpdating={true}
                        allowAdding={false}
                        confirmDelete={false}
                        selectTextOnEditStart="click"
              />
              {columns.map((column) => (
                  ( ( column.checkbox && (column.checkBoxOptions !== undefined && Object.entries(column.checkBoxOptions).length > 0 ))  ||
                    ( column.isOpcionSelect ) || ( column.isdate ) || (column.format === 'number') )
                  ? 
                    column.isOpcionSelect
                    ?
                      <Column
                        dataField        = {column.ID         }
                        key              = {column.ID         }
                        caption          = {column.label      }
                        width            = {column.width      } 
                        minWidth         = {column.minWidth   }
                        maxWidth         = {column.maxWidth   }
                        allowEditing     = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
                        headerCellRender = { (e)=>renderHeader(e,column)}
                      >
                        <Lookup
                          dataSource={optionSelect[column.ID]}
                          valueExpr="ID"
                          displayExpr="NAME"/>

                      </Column>
                    : column.checkbox 
                    ?
                      <Column 
                        dataType           = {"boolean"         } 
                        dataField          = {column.ID         }
                        width              = {column.width      } 
                        minWidth           = {column.minWidth   }
                        maxWidth           = {column.maxWidth   }
                        alignment          = {column.align      }
                        allowEditing       = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
                        key                = {column.ID         }
                        caption            = {column.label      }
                        setCellValue       = {(newData, value, columnData)=>setCellValue(newData, value, columnData, column)}
                        headerCellRender   = {(e)=>renderHeader(e,column)}
                        calculateCellValue = {(e)=>opcionComparar(e[column.ID], column.checkBoxOptions[0])}
                      > 
                    </Column>
                      : column.isdate 
                      ?                     
                        <Column 
                          dataType         = "date"
                          dataField        = {column.ID        }
                          key              = {column.ID        }
                          allowEditing     = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
                          caption          = {column.label     }
                          width            = {column.width     } 
                          minWidth         = {column.minWidth  }
                          maxWidth         = {column.maxWidth  }
                          alignment        = {column.align     }
                          format           = {"dd/MM/yyyy"     }
                          editorOptions    = {{ useMaskBehavior:true, showClearButton:true,}}
                          headerCellRender = {(e)=>renderHeader(e,column)}
                          >
                        </Column>
                      : column.format === 'number' 
                      ?
                      <Column 
                        dataType         = {"number"         } 
                        dataField        = {column.ID        }
                        key              = {column.ID        }
                        width            = {column.width     } 
                        minWidth         = {column.minWidth  }
                        maxWidth         = {column.maxWidth  }
                        alignment        = {column.align     }
                        allowEditing     = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
                        editorOptions    = {{showClearButton:false}}
                        caption          = {column.label     }
                        format           = "#,##0"
                        headerCellRender = {(e)=>renderHeader(e,column)}
                        > 
                    </Column>
                      : null
                    : 
                    <Column 
                      dataField         = {column.ID          }
                      key               = {column.ID          }
                      caption           = {column.label       }
                      dataType          = {column.isnumber ? 'number' :  null} 
                      allowEditing      = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
                      width             = {column.width       } 
                      minWidth          = {column.minWidth    }
                      maxWidth          = {column.maxWidth    }
                      alignment         = {column.align       }
                      allowSorting      = {!opcionComparar(column.ID, props.notOrderByAccion)}
                      // headerCellRender  = {(e)=>renderHeader(e,column)}
                    > 
                  </Column>
              ))}
                <LoadPanel enabled={false} showPane={false} visible={false} showIndicator={false} />
                {/* <Paging defaultPageSize={sizePagination} />
                <Pager
                  visible={true}
                  allowedPageSizes={false}
                  displayMode={'full'}
                  showPageSizeSelector={true}
                  showInfo={true}
                  showNavigationButtons={true} /> */}
            </DataGrid>
          </Spin>  
      </Paper>
	  </div>
  );
})
export default DevExtremeComponent;