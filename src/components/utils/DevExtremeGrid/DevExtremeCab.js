import React, { memo, useState,useEffect,useRef } from "react";
import Search            from './Search'  
import { v4 as uuidID  } from 'uuid';
import Button            from '@material-ui/core/Button';
import { BiSearchAlt }   from "react-icons/bi";
import styles            from './Styles';
import Main              from "../Main";
import $                 from 'jquery'
import _                 from "underscore";
import {Typography}      from 'antd';
import {validateSave}    from './Search'
import {  getBloqueoCabecera     , setBloqueoCabecera,
          getBloqueButtonGuardar , setBloqueButtonGuardar, getFocusGlobalEventDet,
          getDeleteDisable       , globalValidateDet } from './DevExtremeDet'
import DataGrid, {
Column ,   Editing,   Paging , LoadPanel,   
Lookup,   KeyboardNavigation , Sorting} from "devextreme-react/data-grid";
import {modifico}       from './ButtonCancelar';
import {getPermiso} from './PermisosEdit'
const { Title, Text }    = Typography;

var focusGlobalEvent;
const setFocusGlobalEvent = (valor)=>{
	focusGlobalEvent = valor;
}
export const getFocusGlobalEvent = ()=>{
	return focusGlobalEvent;
}
var focusedColumnIndex;
const setFocusedColumnIndex = (valor)=>{
  focusedColumnIndex = valor;
}
const getFocusedColumnIndex = ()=>{
  return focusedColumnIndex;
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
var nameRowsEnter
const setNameRowsEnter = (keyName)=>{
  nameRowsEnter = keyName;
};
const getNameRowsEnter = ()=>{
  return nameRowsEnter
}
export var ArrayPushDelete      = {}
export const limpiarArrayDelete = () =>{
    ArrayPushDelete = [];
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
var cancelarCab = "";
export const setcancelarCab = (valor)=>{
  cancelarCab = valor
};
export const getcancelarCab = ()=>{
  return cancelarCab;
};

// eliminacion: de acuerdo a los rows de los componente seleccionado
// 'cabecera' = true
// 'detalle'  = false
var componenteEliminar = true;
export const setComponenteEliminar = (e)=>{
  componenteEliminar = e;
};
export const getComponenteEliminar = ()=>{
  return componenteEliminar;
}

//operaciones
var insert   = false
var update   = false
var eliminar = false
export const getTipoDeOperaciones = ()=>{
  return [insert,update,eliminar]
}
export const setTipoDeOperacion = (valor, tipo)=>{
   switch (tipo) {
     case 'insert':
      insert = valor
       break;
    case 'update':
      update = valor
    break;
     default:
       break;
   }
 
}
export const getEstablecerOperaciones = ()=>{
  insert = false, update= false, eliminar=false;
}
// Variable Globales
var globalValidate      = true;
var valorAnteriorEnter  = ""; 
var valorActualEnter    = "";
var cancelarBa          = 0;
var valorEventGlobalAnterior
var setEditarModalNew   = false;
var rowCab = []
var ArrayDependenciaGlobal = new Array

const DevExtremeCab = memo(({   rows         , setRows          , FormName          ,
                                grid         , setRowFocus      , columBuscador     ,
                                doNotsearch  , notOrderByAccion , url_Buscador      ,
                                columns      , guardar          , nextFocusNew      ,
                                openCancelar , columnModal      ,  id               ,
					                    	ColumnDefaultPosition           , gridDet           ,    
                                title        , heightDatagrid   , refCancelar       ,
                                activateF10  , canDelete        , setActivarSpinner ,
                                IDCOMPONETFOCUS
                              }) => {
  const classes        = styles();
  const buttonSaveRef  = useRef();
  //--------------------------   State  ----------------------------------------------
  const [tipoDeBusqueda   , setTipoDeBusqueda   ] = useState();
  const [headSeled        , setheadSeled  	    ] = useState([columBuscador])
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
  const [showMessageButton, setShowMessageButton] = useState(false)
  
  Main.useHotkeys(Main.nuevo, (e) =>{
    e.preventDefault();
    addRow();
  },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
  useEffect(() => {
    if(rows.length > 0){
      if(cancelarBa == 0){
        cancelarCab = JSON.stringify(rows)
        cancelarBa = -1;
      }
      var arrayInsert = _.flatten(_.filter(columns, function(item){
        if(item.editModal === false || item.editModal === true || item.Pk === true) return item;
      }));
      setColumnEditDisable(arrayInsert);
    }
    setBloqueoCabecera(false)
  },[rows]);
  const establecerFocus = (fila,column,params)=>{
    setTimeout( ()=>{
      if(params){
        grid.current.instance.focus(grid.current.instance.getCellElement(fila,column));
      }else{
        grid.current.instance.focus(grid.current.instance.getCellElement(0,0));
      }
    },200);
  }
  const showsModal = async (valor) => {
    setShows(valor);
  };
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
          if(showMessageButton){
            funcionCancelar(fila,column);
          }else{
            await grid.current.instance.focus(grid.current.instance.getCellElement(fila,column))
            await grid.current.instance.editCell(fila, column);
          }
            
            
        }        
     })
  };
  const selectedHead = async (e,idHead) =>{
      e.stopPropagation()
      var iconohead = await document.getElementsByName(idHead);
      var exists    = await headSeled.includes(idHead);

      if(exists){
          iconohead[0].style.visibility = 'collapse'
          const indice = headSeled.indexOf(idHead)
          headSeled.splice(indice, 1);
      }else{
          setheadSeled(await headSeled.concat(idHead));
          document.getElementsByName(idHead)[0].style.visibility = 'visible';
      }
  }
  const renderHeader = (e,column) => {
      return (
        <>
        { opcionComparar(column.ID, doNotsearch)
          ? 
            <div 
              id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : "horizontalDatagrid"}
              key={column.ID}
              className={classes.selectHeader} 
              disabled>
              {column.label}
            </div>
          :
            <Button   key={column.ID}
                      id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : null}
                      className={classes.selectHeader} 
                      onClick={(e) => selectedHead(e,column.ID)} >
                      {column.label}
                      { headSeled.includes(column.ID)
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
        </>
      );
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
  const onFocusedRowChanged = async(e) => {
    //activar focus cabecera

    if(e.row != undefined){
      setComponenteEliminar({"id":e.row.data.IDCOMPONENTE ? e.row.data.IDCOMPONENTE : id,
                         "delete":canDelete ==  false ? false : true })
    }

    if(e.row){
      if(getBloqueoCabecera()){
          grid.current.instance.option("focusedRowKey", 120);
          grid.current.instance.clearSelection();
          grid.current.instance.focus(0);
          setShowMessageButton(true)
          showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
      }else if(JSON.stringify(valorEventGlobalAnterior) !== JSON.stringify(e.row.data)){
        setRowFocus(await e);
        setFocusGlobalEvent(await e);
        valorEventGlobalAnterior = e.row.data;
      }
    }
	}
  const funcionCancelar = async (fila)=>{
    setBloqueButtonGuardar(false)
    setShowMessageButton(false)
    openCancelar(fila)
	}
  const deleteRows = async() =>{

    if(!getFocusGlobalEvent().row) return
    var info; var fila; var rowdelete;
    var idComponetFocus = getComponenteEliminar();
    if(idComponetFocus.id == id){
      if(!idComponetFocus.delete) return
      info =  getFocusGlobalEvent().row.data;
      fila =  getFocusGlobalEvent().rowIndex;
      rowdelete = getFocusGlobalEvent();
    }else{
      if(getFocusGlobalEventDet().row == undefined ) return
      if(!idComponetFocus.delete) return
      setBloqueoCabecera(true)
      info =  getFocusGlobalEventDet().row.data;
      fila =  gridDet[idComponetFocus.id].current.instance.getRowIndexByKey(info)
      rowdelete = getFocusGlobalEventDet();
    }
    if(fila == -1) fila = 0;       
    var rowsInfo = await gridDet[idComponetFocus.id].current.instance.getDataSource()._items[fila];
    if(!rowsInfo.inserted && !rowsInfo.InsertDefault){
      // setBloqueoCabecera(true);
      // if(!modifico)setModifico(true);
      modifico();
      eliminar = true
      rowsInfo.delete      = true;
      rowsInfo.COD_EMPRESA = sessionStorage.getItem('cod_empresa');
      if( ArrayPushDelete[idComponetFocus.id] !== undefined){
          ArrayPushDelete[idComponetFocus.id] = _.union(ArrayPushDelete[idComponetFocus.id], [rowsInfo]);
      }else{
        ArrayPushDelete[idComponetFocus.id] = [rowsInfo];
      }
      rowdelete.component.deleteRow(fila)
    }else{
      rowdelete.component.deleteRow(fila)
    }
    if(fila !== 0 && fila !== -1) fila = fila -1;
    setTimeout(()=>{
      var valor = gridDet[idComponetFocus.id].current.instance.getDataSource()._items;
      if(valor.length > 0){
        gridDet[idComponetFocus.id].current.instance.focus(
          gridDet[idComponetFocus.id].current.instance.getCellElement(fila,gridDet.defaultFocus[idComponetFocus.id])
        )
      }
    },30);
  }
  const addRow = async() => {
    insert = true;
    var rowIndex = 0;
    if(!getBloqueoCabecera()){
      // if (!modifico)setModifico(true)
      modifico();
      if(getFocusGlobalEvent()){
          // rowIndex = await getFocusedRowIndex().rowIndex;
           rowIndex  =  getFocusGlobalEvent().rowIndex;
        if(rowIndex == -1 || rowIndex == undefined) rowIndex = 0;
      }else{
        rowIndex   = 0;
      }
  
      var newKey = uuidID();
      var row    = [0]
      row = [{
        ...row[0],
        ID         : newKey,
        inserted   : true,
        COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
        COD_USUARIO: sessionStorage.getItem('cod_usuario')
      }]  
      columns.forEach(async element => {
        if(element.isdate)         row[0][element.ID] = moment();
        if(element.checkbox)       row[0][element.ID] = element.checkBoxOptions[1];
        if(element.isOpcionSelect){
        _.flatten(_.filter(optionSelect[element.ID], function(item){
          if (item.isNew) row[0][element.ID] = item.ID;
        }));
        }
      }); 
      setRows(rows.concat(rows.splice(rowIndex, 0, ...row)));      
      setTimeout(()=>{
          grid.current.instance.repaintRows([rowIndex])
          grid.current.instance.focus(grid.current.instance.getCellElement(rowIndex,columns[ColumnDefaultPosition]["ID"]));
      },350);
    }else{
      setShowMessageButton(true)
      showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
    }
  }
  const onRowUpdating = async(value) =>{
    update = true
    var columnNameEdit = Object.keys(value.newData);    
    var rowsColumn     = columns.filter(item => item.ID == columnNameEdit[0]);    
    if(rowsColumn[0].upper){
      value.newData[columnNameEdit[0]] = value.newData[columnNameEdit[0]].toUpperCase();
    }    
    // if(!modifico)setModifico(true);
    // refCancelar.current.click();
    // refCancelar.current.style[1].replace('visibility','')
    
    modifico();

    // if(document.getElementsByClassName('button-cancelar-ocultar-visible')[0]){}
    // document.getElementsByClassName("button-cancelar-ocultar-visible")[0].classList.remove("button-cancelar-ocultar-visible")

    setNameRowsEnter(Object.keys(value.newData)[0])
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
      setRowColumnErrorModaF9(filas, indexComun?.cellIndex);
      value.component.cancelEditData();
    }
  }  
  const funcionValidacion = async (nameColumn, value, rowsData)=>{
    
    var valor_anterior = valorAnteriorEnter;
    var valor_actual   = await value;
    rowsData.component.navigateToRow(rowsData.key)
  
    if(valor_anterior !== valor_actual || globalValidate == false){      
      var valor       = await value
      if(!_.isNumber(valor) && !_.isNull(valor) && !_.isNaN(valor) && !_.isUndefined(valor) ) valor = await value.trim();
      var url         = columnModal.urlValidar[0][nameColumn];
      var indexRows   = rowsData.component.getRowIndexByKey(rowsData.key)      
      var columnhead  = getFocusGlobalEvent();
      try{
        var method = 'POST'        
        var data   = {'valor':valor, cod_empresa:sessionStorage.getItem('cod_empresa')};
        await Main.Request( url, method, data)
        .then(async response => {
          if(response.status == 200 ){
            if(response.data.outBinds.ret == 1){
              
              if(Object.keys(response.data.outBinds).length > 2){
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
              
              if(columnModal.config[nameColumn] !== undefined){
                if(columnModal.config[nameColumn].dependencia_de.length > 0){
                  await columnDependencia(rowsData,columnModal.config[nameColumn].dependencia_de,nameColumn,true);
                }
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
              if(!getBloqueButtonGuardar())setBloqueButtonGuardar(true)
              showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
            }

          }
        });
      } catch (error) {
        console.log("Error en funcionValidacio",error);
      }
    } 
  }
  const validarDependencia = async (key)=>{
    var ArrayDataDependencia = new Array();
    var nameData             = await getFocusedColumnName();
    if(key == 13) nameData   = getNameRowsEnter();   
    var info                 = await getFocusGlobalEvent().row.data;

    if( (Object.keys(columnModal.config).length == 0) || (columnModal.config[nameData]  === undefined)){
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
    if( Object.keys(columnModal.config).length == 0 || (columnModal.config[busquedaPor] === undefined)){
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
  const onFocusedRowChanging =(e)=>{
    if(e.newRowIndex == -1) setFocusedRowIndex(0);
    setFocusedRowIndex(e.newRowIndex);
  }
  const onFocusedCellChanging = async(e)=> {  
    let fila = e.prevRowIndex == -1 ? 0 : e.prevRowIndex
    if(e.rows[fila]){
      setComponenteEliminar({"id":e.rows[fila].data.IDCOMPONENTE ? e.rows[fila].data.IDCOMPONENTE : id
                            ,"delete":canDelete == false ? false : true })
    }
      
    setEventValuesCheckbox(e);
    setFocusedColumnName(e.columns[e.newColumnIndex].dataField);
    setFocusedColumnIndex(e.newColumnIndex);


    if(e.event){
      var columnLength    = columns.length - 1;
      var prevColumnIndex = e.prevColumnIndex;
      
      if(columnLength == prevColumnIndex){
        if ((e.event.key === "Enter" || e.event.key === "Tab") && nextFocusNew) {
            rowCab = grid.current.instance.getDataSource();
            // grid.current.instance.option("focusedRowKey", 120);
            e.cancel = true;
            setTimeout(()=>{
              // grid.current.instance.option("focusedRowKey", e.rows[e.prevRowIndex].data.ID);
              document.getElementById(nextFocusNew).focus();
            },50);
            return
        }
     }
    }
    // if(e.event){
    //   if (e.event.key === "Enter" && nextFocusNew) {
    //     rowCab              = grid.current.instance.getDataSource();
    //     var columnLength    = columns.length - 1;
    //     var prevColumnIndex = e.prevColumnIndex;
    //     if ( columnLength == prevColumnIndex) {
    //        e.cancel = true;
    //       setTimeout(()=>{
    //         document.getElementById(nextFocusNew).focus();
    //       },95);
    //     }
    //   }
    // }

    let permisoEdit     = await getPermiso(FormName,'U')
    var dataColumn      = getFocusedColumnName();
    if(columnEditDisable.length > 0){
      for (let i = 0; i < columnEditDisable.length; i++) {
        const items = columnEditDisable[i];
        
        if(items.ID === dataColumn && permisoEdit && e.rows[e.newRowIndex].data.inserted){
          setEditarModalNew = true;
          e.columns[e.newColumnIndex].allowEditing = true
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
      if(e.columns[e.newColumnIndex].dataType == 'boolean'){
        e.columns[e.newColumnIndex].allowEditing = true
      }
    }
  }
  const handleChange = async(e)=>{
    var value = e.target.value;
    if(value.trim().length === 0){
        value = 'null';
    }
    if(value === 'null'){
      try {
        var url            = url_Buscador;
        var method         = "POST";
        const cod_empresa  = sessionStorage.getItem('cod_empresa');        
        await Main.Request( url,method,{'value':value, 'cod_empresa': cod_empresa, filter:headSeled, })
            .then( response =>{
              setRows(response.data.rows)
              setTimeout(async()=>{ 
                await grid.current.instance.focus(grid.current.instance.getCellElement(0,0));
                document.getElementById('DevExtreme_Grid_buscador').focus();
              },5);
        });
      } catch (error) {
          console.log(error);
      }
    }
  }
  const onKeyDownBuscar = async (e)=>{
    var value = e.target.value;
    if(value.trim().length === 0){
        value = 'null'
    }
    if(e.keyCode == 13){
      try {
        var url            = url_Buscador;
        var method         = "POST";
        const cod_empresa  = sessionStorage.getItem('cod_empresa');        
        await Main.Request( url,method,{'value':value, 'cod_empresa': cod_empresa, filter:headSeled, })
            .then( response =>{
              setRows(response.data.rows)
              setTimeout(async()=>{ 
                await grid.current.instance.focus(grid.current.instance.getCellElement(0,0));
                document.getElementById('DevExtreme_Grid_buscador').focus();
              },5);
        });
      } catch (error) {
          console.log(error);
      }
    }
  }
  const setCellValue = React.useCallback(async(newData, value, columnRowData, column)=>{
    var newValue       = await value ? column.checkBoxOptions[0] : column.checkBoxOptions[1];
    newData[column.ID] = await newValue;
  },[]);
  const showModalMensaje = (titulo,imagen, mensaje) => {
    setTituloModal(titulo);
    setImagen(imagen);
    setMensaje(mensaje);
    setVisibleMensaje(true);
  };
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
      var data   = {'valor':valor,'cod_empresa':sessionStorage.getItem('cod_empresa'),dependencia};
      await Main.Request( url, method, data)
          .then( response => {
              if( response.status == 200 ){
                setSearchData(response.data.rows);
              }
      })
    } catch (error) {
      console.log("Error en onInteractiveSearch",error);
    }
  }
  const modalSetOnClick = async (datos, busquedaPor, datoskey) => {
    globalValidate = true; 
    await grid.current.instance.refresh(true);
    await grid.current.instance.cancelEditData();
    await grid.current.instance.saveEditData();
    if(datos !== "" || datos !== undefined){
      // if(!modifico)setModifico(true)
      modifico()
      // if(!getBloqueoCabecera())setBloqueoCabecera(true)
      
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
    }
  }
  const save = async()=>{
    setVisibleMensaje(false)
    setShowMessageButton(false)
    if(!getBloqueButtonGuardar()){

      var fila = getFocusedRowIndex();
      if(fila == -1) fila = 0;

      var idComponetFocus = getComponenteEliminar();

      if(idComponetFocus.id == id){
        await grid.current.instance.saveEditData();
        await grid.current.instance.repaintRows([fila])
        
        setActivarSpinner(true)
        setTimeout(async()=>{
          if(globalValidate){
            await validateSave(guardar);
          }else{
            setActivarSpinner(false)
            return
          }
          setActivarSpinner(false)
        },90);

      }else{
        if(getFocusGlobalEventDet().row == undefined ) return
        // console.log(idComponetFocus.id)
        await gridDet[idComponetFocus.id].current.instance.saveEditData()
        await gridDet[idComponetFocus.id].current.instance.repaintRows([fila])
        setActivarSpinner(true)
        setTimeout(async()=>{
          globalValidate = await globalValidateDet;
          if(globalValidate){
            await validateSave(guardar);
          }else{
            setActivarSpinner(false)
            return
          }
          setActivarSpinner(false)
        },120);
      }
    
    }else{
      console.log('Hay Cambios pendiente que resultaron con error');
      // Main.message.info("H")
    }
    
  }
  const saveButton = async ()=>{
    var idComponetFocus = await getComponenteEliminar();
    var fila = getFocusedRowIndex();
    if(fila == -1) fila = 0;
    if(idComponetFocus.id == id){
      await grid.current.instance.saveEditData();
      await grid.current.instance.repaintRows([fila])
      setActivarSpinner(true)
        setTimeout(async()=>{
          validateSave(guardar);
          setActivarSpinner(false)
        },90);
    }else{
      await gridDet[idComponetFocus.id].current.instance.saveEditData()
      await gridDet[idComponetFocus.id].current.instance.repaintRows([fila])
        setTimeout(async()=>{
          validateSave(guardar);
        setActivarSpinner(false)
      },90);
     
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
  const getRowDataModal = async (url, tipo, data,dependencia)=>{
    let dataRows = []
    try {
        var method       = tipo;
        data.valor       = 'null'
        data.cod_empresa = sessionStorage.getItem('cod_empresa');
        data.dependencia = dependencia;
        await Main.Request(url,method,data)
        .then((response)=>{
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
    if(e.event.repeat){
      e.event.preventDefault();
    }
    if(e.event.key == "F10"){
      e.event.preventDefault();
      if(activateF10){
        var infoPermiso = await Main.VerificaPermiso(FormName);
        var band = true;
        var mensaje = ''
        if(insert){
          if(infoPermiso[0].insertar != 'S'){
            band = false;
            mensaje = 'No tienes permiso para insertar'
          }
        }
        if(update){
          if(infoPermiso[0].actualizar != 'S'){
            band = false;
            mensaje = 'No tienes permiso para actualizar'
          }
        }
        if(eliminar){
          if(infoPermiso[0].borrar != 'S'){
            band = false;
            mensaje = 'No tienes permiso para eliminar'
          }
        }
        if(band){
          var fila = getFocusedRowIndex();
          if(fila == -1) fila = 0;
          await grid.current.instance.saveEditData();
          await grid.current.instance.repaintRows([fila])
          setActivarSpinner(true)
          setTimeout(async()=>{
            if(globalValidate){
                validateSave(guardar);
            }
            setActivarSpinner(false)
          },35);
        }else{
          Main.message.warning({
            content  : mensaje,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
            marginTop: '4vh',
            },
          });
        }
        return;
      } 
    }
    var columnName    = await getFocusedColumnName();
    var columnDetalle = await grid.current.instance.columnOption(columnName);
    if(columnDetalle){
      if(e.event.code == "Space" && columnDetalle.userDataType == "boolean" && columnDetalle.allowEditing){  
        e.event.preventDefault();
        var rowsCheckbox    = await getEventValuesCheckbox();
        var fila            = rowsCheckbox.newRowIndex;
        if(fila == -1) fila = 0;

        let eliminarFocusActivo          = document.getElementsByClassName("dx-cell-modified");
        if(eliminarFocusActivo.length > 0){
          document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
        } 
        
        let cambioCellInput = document.getElementsByClassName("dx-state-focused");
        if(cambioCellInput.length === 0){
          var valorCheckbox = !rowsCheckbox.rows[fila].values[columnDetalle.index]
          grid.current.instance.cellValue(fila, columnDetalle.index,valorCheckbox);        
        }else if(cambioCellInput.length === 2){
          document.getElementsByClassName("dx-state-focused")[0].classList.remove("dx-state-focused")     
        }
        await grid.current.instance.saveEditData();
      }
     }
    
    if(e.event.keyCode === 40 || e.event.keyCode === 38 || 
      e.event.keyCode === 39 || e.event.keyCode === 37 ||
      e.event.keyCode === 13 || e.event.keyCode === 9){
       let eliminarFocusActivo = document.getElementsByClassName("dx-cell-modified");
       if(eliminarFocusActivo.length > 0) document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
    }

    //  if(columnDetalle){
    //   if(e.event.code == "Space" && columnDetalle.userDataType == "boolean" && columnDetalle.allowEditing){  
    //     e.event.preventDefault();
    //     var rowsCheckbox    = await getEventValuesCheckbox();
    //     var fila            = rowsCheckbox.newRowIndex;
    //     if(fila == -1) fila = 0;
        
    //     let eliminarFocusActivo          = document.getElementsByClassName("dx-cell-modified");
    //     if(eliminarFocusActivo.length > 0){
    //       document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
    //       await rowsCheckbox.component.repaintRows([fila]);
    //       await grid.current.instance.saveEditData();  
    //     } 

    //     let cambioCellInput = document.getElementsByClassName("dx-state-focused");
    //     if(cambioCellInput.length === 0){
    //       if(checkboxValue !== rowsCheckbox.rows[fila].values[columnDetalle.index]){
    //         var valorCheckbox
    //         // grid.current.instance.saveEditData();
    //         if(checkboxValue === '') valorCheckbox = !rowsCheckbox.rows[fila].values[columnDetalle.index];
    //         else valorCheckbox = !valorCheckbox
    //         let eliminarFocusActivo          = document.getElementsByClassName("dx-cell-modified");
    //         if(eliminarFocusActivo.length > 0) document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
    //         await grid.current.instance.cellValue(fila, columnDetalle.index, valorCheckbox);
    //         grid.current.instance.saveEditData();
    //       }
    //     }else{
    //         grid.current.instance.saveEditData();
    //         document.getElementsByClassName("dx-state-focused")[0].classList.remove("dx-state-focused")     
    //         // let eliminarFocusActivo          = document.getElementsByClassName("dx-cell-modified");
    //         // if(eliminarFocusActivo.length > 0) document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
    //         // await grid.current.instance.cellValue(fila, columnDetalle.index, valorCheckbox);            
    //         rowsCheckbox.component.repaintRows([fila]);
    //         // await grid.current.instance.saveEditData();
    //     }
    //     checkboxValue = rowsCheckbox.rows[fila].values[columnDetalle.index]
    //   }
    //  } 
    if(e.event.keyCode === 120 && (columnModal)){
      if(Object.entries(columnModal).length > 0){
        var ArrayDataDependencia = await validarDependencia(120);        
        if(ArrayDataDependencia  == true) return
        e.event.preventDefault();
        var columnName = await getFocusedColumnName();
        if(columnModal[columnName]){
          e.event.preventDefault();
          var url          = columnModal.urlBuscador[0][columnName]
          var AuxDatamodal = await getRowDataModal(url,'POST',{},ArrayDataDependencia)
          var title = await columnModal.title[0][columnName];
          setModalTitle(title)
          setSearchColumns(columnModal[columnName])
          setSearchData(AuxDatamodal);
          setTipoDeBusqueda(columnName);           
          setShows(true);
        }
      }    
    }
    // if(e.event.keyCode === 40 || e.event.keyCode === 38 || 
    //    e.event.keyCode === 39 || e.event.keyCode === 37 ||
    //    e.event.keyCode === 13 || e.event.keyCode === 9){
    //    checkboxValue = ''
    //    let eliminarFocusActivo = document.getElementsByClassName("dx-cell-modified");
    //    if(eliminarFocusActivo.length > 0) document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
    // }
  }
  const onCellClick = async (e)=>{
    
    if(!globalValidate){
      e.event.preventDefault();
      return;
    }
    if(e.rowType !== "header"){        

      if(e.row !== undefined){
        setComponenteEliminar({'id':e.row.data.IDCOMPONENTE,'delete':canDelete === false ? false : true});
      } 

      if(e.column){
       setTimeout(()=>{
         var row     =  getFocusGlobalEvent()
         let fila    = row.rowIndex;
         let columna = e.columnIndex;
         if(fila === '-1') fila = 0;
         grid.current.instance.focus(grid.current.instance.getCellElement(fila,columna))
       },14);
       setFocusedColumnName(e.column.dataField);
     }
   }
  }
  
  return (
    <>
      <div className="paper-header">        
        <Title level={4} className="title-color">
          {title}
          <div>
            <Title level={5} style={{ float:'right', marginTop:'-18px', marginRight:'5px', fontSize:'10px'}} className="title-color">{FormName}</Title> 
          </div>
        </Title>
      </div>
      <Main.ModalDialogo
          positiveButton={showMessageButton ? "SI" : ""  }
          negativeButton={showMessageButton ? "NO" : "OK"}
          positiveAction={showMessageButton ? save : null}
          negativeAction={handleCancel}
          onClose={handleCancel}
          setShow={visibleMensaje}
          title={tituloModal}
          imagen={imagen}
          mensaje={mensaje}
        />
        <Main.FormModalSearch 
          showsModal={showsModal}
          setShows={shows}
          title={modalTitle}
              componentData={
                  <Main.NewTableSearch
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
      <Search
        rows={rows}
        addRow={addRow}
        eliminarRow={deleteRows}
        cancelarProceso={funcionCancelar}
        formName={FormName}
        guardar={saveButton}
        handleChange={handleChange}
        onKeyDownBuscar={onKeyDownBuscar}
        modifico={modifico}
        refCancelar={refCancelar}
        buttonGuardar={buttonSaveRef}
      />
      <DataGrid
        id={id}
        keyExpr={"ID"}
        dataSource={rows}
        ref={grid}      
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
        allowColumnResizing={false}
        errorRowEnabled={true}
        
        height={heightDatagrid !== undefined ? heightDatagrid : "280"}
        onKeyDown={onKeyDown}
        onCellClick={onCellClick}
        onRowUpdating={onRowUpdating}
        onFocusedRowChanging={onFocusedRowChanging}
        onFocusedRowChanged={onFocusedRowChanged}
        onFocusedCellChanging={onFocusedCellChanging}
        onEditorPreparing={onEditorPreparing} 
      >
      <Sorting mode="single" />
      <KeyboardNavigation
        editOnKeyPress={true}
        enterKeyAction= 'moveFocus'
        enterKeyDirection='row'
        onEnterKey
      />
      <Paging enabled={false} />
      <Editing  mode="cell"
        allowUpdating={true}
        allowAdding={false}
        confirmDelete={false}
        selectTextOnEditStart="click"
      />
      {columns.map((column) => (

        column.checkbox 
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
              headerCellRender   = {(e)=>renderHeader(e,column)}
              allowSorting       = {!opcionComparar(column.ID, notOrderByAccion)}
              setCellValue       = {(newData, value, columnData)=>setCellValue(newData, value, columnData, column)}
              calculateCellValue = {(e)=>opcionComparar(e[column.ID], column.checkBoxOptions[0])}
           /> 
         :
        <Column 
          dataField          = {column.ID          }
          key                = {column.ID          }
          caption            = {column.label       }
          dataType           = {column.isnumber ? 'number' :  column.isdate ? 'date' : null }
          allowEditing       = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
          width              = {column.width       } 
          minWidth           = {column.minWidth    }
          maxWidth           = {column.maxWidth    }
          alignment          = {column.align       }
          allowSorting       = {!opcionComparar(column.ID, notOrderByAccion)}
          editorOptions      = {column.isnumber ? {showClearButton:false} : column.isdate ?  { useMaskBehavior:true, showClearButton:true}
          : {valueChangeEvent: "input" } }
          format             = {column.isnumber ? "#,##0" : column.isdate ? 'dd/MM/yyyy' : ''}
          headerCellRender   = {(e)=>renderHeader(e,column)}
        > 
        {
          column.isOpcionSelect ?
              <Lookup
                  dataSource={optionSelect[column.ID]}
                  valueExpr="ID"
                  displayExpr="NAME"
              />
          : null
        }
        </Column>
      ))}
        <LoadPanel enabled={false} showPane={false} visible={false} showIndicator={false} />
      </DataGrid>
    </>
  );
});

export default DevExtremeCab;