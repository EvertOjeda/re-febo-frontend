import React,{ useState,useRef} from 'react'
import  Paper 					        from '@material-ui/core/Paper';
import Button 					        from '@material-ui/core/Button';
import styles 					        from './Styles';
import { BiSearchAlt } 	        from "react-icons/bi";
import moment                   from 'moment';
import FormModalSearch          from '../ModalForm/FormModalSearch';
import ModalDialogo             from "../Modal/ModalDialogo";
import NewTableSearch           from '../NewTableSearch/NewTableSearch';
import Main                     from '../Main';
import { v4 as uuidID  }        from 'uuid';
import { modifico,setModifico } from './ButtonCancelar';
import Search,{ setFocusedRowIndex, 
                getFocusedRowIndex 
              }                            from './Search'  
import _                                   from 'underscore';
import { Spin,message,Typography,Radio }   from 'antd';
import {getPermiso}                        from './PermisosEdit'
import DataGrid, {
  Column ,   Editing,   Paging,    Lookup,   KeyboardNavigation, LoadPanel,
	Sorting,   Pager  }                from "devextreme-react/data-grid";
import {Request}                     from '../../../config/request';
import $                             from 'jquery';
import './stylesDevExteme.css'
import "devextreme/dist/css/dx.material.blue.light.compact.css";
const { Title }    = Typography;
const deMessages   = require('devextreme/localization/messages/de.json');;
const EsMessages   = require('devextreme/localization/messages/es.json');
const localization = require('devextreme/localization'); 
localization.loadMessages(deMessages);
localization.loadMessages(EsMessages);
localization.locale(navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage));

var focusGlobalEvent;
export const setFocusGlobalEvent = (valor)=>{
  focusGlobalEvent = valor;
}
export const getFocusGlobalEvent = ()=>{
  return focusGlobalEvent;
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
// es un bandera se utiliza para que almacene los datos en un JSON.stringify;
var ArrayDependenciaGlobal = new Array
var dataAuxCancel          = ""
var setEditarModalNew = false;

var insert   = false
var update   = false
var eliminar = false

 export const getEstablecerOperaciones = ()=>{
  insert = false, update= false, eliminar=false;
}

const DevExpressList = React.memo((props) => {

  const username         = sessionStorage.getItem('cod_usuario');
  const cod_empresa      = sessionStorage.getItem('cod_empresa');
  const classes          = styles();
  
  //---------------------------  ctrl+m ---------------------------------------------------
  Main.useHotkeys(Main.nuevo, (e) =>{
        e.preventDefault();
        addRow();
  },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    //---------------------------  props ----------------------------------------------------
    
    const columns         = props.columns;          const FormName      = props.formName;           const title   = props.title;    
    const columBuscador   = props.columBuscador;    const optionSelect  = props.arrayOptionSelect;  const urlAbm  = props.urlAbm;
    const columnModal     = props.arrayColumnModal; const defaultFocusColumn = props.defaultFocusColumn; 
    const sizePagination  = props.sizePagination;   const codDependenciaAnt  = props.codDependenciaAnt;


    //-------------------Estado DataGrid-----------------------------------------------------
    const [datosrows        , setDatosRows        ] = useState(props.data);
    const [tipoDeBusqueda   , setTipoDeBusqueda   ] = useState();
    const [headSeled        , setheadSeled        ] = useState([columBuscador])
    // const [modifico         , setModifico         ] = useState(false);
    const [activarSpiner    , setActivarSpiner    ] = useState(false);
    const [columnEditDisable, setColumnEditDisable] = useState([]);
    
    //---------------------------Estado Modal------------------------------------------------
    const [shows            , setShows            ] = useState(false);
    const [modalTitle       , setModalTitle       ] = useState();
    const [searchColumns    , setSearchColumns    ] = useState();
    const [searchData       , setSearchData       ] = useState({});
    //---------------------------Estado Modal mensaje ----------------------------------
    const [visibleMensaje   , setVisibleMensaje   ] = useState(false);
    const [mensaje          , setMensaje          ] = useState();
    const [imagen           , setImagen           ] = useState();
    const [tituloModal      , setTituloModal      ] = useState();
    /*---------------------------focus Modal mensaje -------------------------------- */
  
  const establecerFocus = (fila,column,params)=>{
      if(params){
        setTimeout( ()=>{
          grid.current.instance.focus(grid.current.instance.getCellElement(fila,column));
        },100);
      }else{
        setTimeout( ()=>{
          var indexColun = defaultFocusColumn !== undefined  ? defaultFocusColumn : 0
          grid.current.instance.focus(grid.current.instance.getCellElement(0,indexColun));
        },200);
      }
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
    },45)
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
  const grid = useRef(); 
  React.useEffect(() => {
		setDatosRows(props.data);  
    setTimeout(()=>establecerFocus())
    filtradoEdicion()
    var arrayInsert = _.flatten(_.filter(columns, function(item){
      if(item.editModal === false || item.editModal === true || item.Pk === true) return item;
    }));
    setColumnEditDisable(arrayInsert);
    if(props.data.length > 0){
      dataAuxCancel = JSON.stringify(props.data);
    }
  },[props.data]);
  const listFiltro = async (datos) => {
    setDatosRows(datos)
    setTimeout(()=>{
      grid.current.instance.option("focusedRowIndex",0)
    },10)
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
	const selectedHead = async (e,idHead) => {
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
      { opcionComparar(column.ID, props.doNotsearch)
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
  const onFocusedRowChanged = async (e)=>{
    setFocusGlobalEvent(e);
    if(props.rowFocus){
      props.rowFocus(e);
    }
  }
  const setCellValue = async(newData, value, columnRowData, column)=>{
    var newValue       = await value ? column.checkBoxOptions[0] : column.checkBoxOptions[1];
    newData[column.ID] = await newValue;
  }
  const onFocusedRowChanging = async (e) =>{
    if(props.setRowChanging){
      props.setRowChanging(e);
    }
    setFocusedRowIndex(e.newRowIndex);
    var rowsCount = e.component.getVisibleRows().length,
    pageCount     = e.component.pageCount(),
    pageIndex     = e.component.pageIndex(),
    key = e.event && e.event.key;
    if(key && e.prevRowIndex === e.newRowIndex) {
      if(e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
          e.component.pageIndex(pageIndex + 1).done(function() {
          e.component.option('focusedRowIndex', 0);
        });
      }else if(key !== "ArrowUp" && pageIndex === pageCount - 1){
        e.component.option('focusedRowIndex', rowsCount);
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
  const addRow = async() => {
    insert = true;
    let permisoEdit  = await getPermiso(FormName,'I')
    if(permisoEdit){  
      var rowIndex  
      var paginacion
      // if (!modifico)setModifico(true)
      modifico(FormName)

      let data = grid.current.instance.getDataSource();
      if(getFocusGlobalEvent()){
        rowIndex    = await getFocusedRowIndex();
        if(rowIndex == -1) rowIndex = 0;
          paginacion = data.pageIndex();
      }else{
        rowIndex   = 0;
        paginacion = 0;
      }
      if( paginacion > 0 ) rowIndex = (sizePagination * paginacion) + rowIndex;
    
      var newKey   = uuidID();
      var row      = props.modeloAuditoria !== undefined ? props.modeloAuditoria : [];
      row = [{
        ...row[0],
        ID         : newKey     ,
        inserted   : true       ,
        COD_EMPRESA: cod_empresa,
        COD_USUARIO: username
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
        
      setDatosRows(datosrows.concat(datosrows.splice(rowIndex, 0, ...row)));      
      setTimeout(()=>{
        grid.current.instance.repaintRows([rowIndex])
        let indexColumn = defaultFocusColumn !== undefined ? defaultFocusColumn : 0
        // establecerFocus(rowIndex,indexColumn,true);
        grid.current.instance.focus(grid.current.instance.getCellElement(rowIndex,indexColumn));
      },25.3);
    }else{
      message.info('Puede que no tengas los permiso para realizar esta accion');
      establecerFocus();
    }
  }
  const deleteRows = async (e)=>{
    if(getFocusGlobalEvent().row){
      eliminar = true
      // if(!modifico)setModifico(true);
        modifico(FormName)
        var info        = await getFocusGlobalEvent().row.data;
        var fila        = getFocusedRowIndex();
        const indexRows = grid.current.instance.getRowIndexByKey(info.ID);
        if(fila == -1) fila = await 0; 
        if(indexRows == fila){
          if(fila !== 0){
            fila = await indexRows -1;
            setFocusedRowIndex(fila)
          }
        }
        var rowsInfo = await grid.current.instance.getDataSource()._items;
        if(!rowsInfo[fila].inserted){
          rowsInfo.delete      = true;
          rowsInfo.COD_EMPRESA = cod_empresa;
          setRowsDelete(rowsInfo[indexRows]);
          await grid.current.instance.deleteRow(indexRows);
        }else{
          await grid.current.instance.deleteRow(indexRows);
        }
        setTimeout(()=>{
          let indexColmn = defaultFocusColumn !== undefined ? defaultFocusColumn : 0
          establecerFocus(fila,indexColmn,true);
          // grid.current.instance.focus(grid.current.instance.getCellElement(fila,defaultFocusColumn))          
        },45);
    }
  }
  const funcionGuardar = async()=>{
    var nameFormatDate = [];  
    var updateInsert   = [];
    var cod_auto       = -1;
    var key            = ""
    var rowsAux        = []
    var validaDatos    = []
    columns.filter(element =>{if(element.isdate) nameFormatDate.push(element.ID)});    
    var auxBan = false
    
    _.flatten(_.filter(datosrows, function(item){
      if(item.inserted == true || item.updated){
        validaDatos.push(item)
        updateInsert.push(item)
      }
    }));
  
    // Valida que todos los campos requeridos esten cargado
    var validaCampo = await ValidarDatosRequerido(validaDatos)
    if(validaCampo){
      
      var bandRowAux = false
      if(codDependenciaAnt !== undefined && codDependenciaAnt !== '' && codDependenciaAnt !== null){
        if(updateInsert.length > 0){
          auxBan = true
          var key  = Object.keys(codDependenciaAnt[0])[0]
          var info = await Main.GeneraUpdateInsert(datosrows, codDependenciaAnt);
          rowsAux      =  info.rowsAux;
          if(rowsAux.length > 0) bandRowAux = true
          updateInsert =  info.updateInsert;  
        }
      }

      var content = datosrows.filter(item => item.inserted == true);
      if(columnModal.config.auto.length > 0){
        key       = Object.keys(columnModal.config.auto[0])[0];
        let resul = await Main.Request(columnModal.config.auto[0][key], 'GET', {});
        cod_auto  = resul.data.rows[0][key]
        cod_auto  = cod_auto + (content.length - 1);
        updateInsert = []
        
        for (let i = 0; i < datosrows.length; i++) {
          const element = datosrows[i];
          if(element.updated == true){
            updateInsert.push(element);
          }
          if(element.inserted == true ){
            if(!element[key]){
              if(cod_auto !== -1){
                element[key]    = cod_auto;
                if(bandRowAux){
                  bandRowAux = true
                  rowsAux[i][key] = cod_auto
                }
                updateInsert.push(element);
                cod_auto--;
              }  
            }else{
              updateInsert.push(element);
            }
          }
          if(!bandRowAux){
            rowsAux.push(_.omit(element,['inserted','updated']))
          }
        }
      }else if(!auxBan){
        for (let i = 0; i < datosrows.length; i++) {
          const element = datosrows[i];
          rowsAux.push(_.omit(element,['inserted','updated']))
        }
      }         
      // console.table(updateInsert)
      // return

      var info      = []
      const columna = getFocusedColumnIndex();
      var fila      = getFocusedRowIndex();
      if(fila == -1) fila = 0;
      let auxData = await JSON.parse(dataAuxCancel);
      info.push({"cod_usuario":username,"cod_empresa":cod_empresa})
      rowsDelete = await getRowsDelete();
      var data = {updateInsert, rowsDelete, nameFormatDate, info, auxData}
      if(updateInsert.length > 0 || rowsDelete.length > 0){   
          setActivarSpiner(true);
          try{
            var method = "POST"
            await Request( urlAbm, method, data)
            .then(async(response) => {
              var resp = response.data;
                  if(resp.ret == 1){
                        message.success({
                          content  : `Procesado correctamente!!`,
                          className: 'custom-class',
                          duration : `${2}`,
                          style    : {
                            marginTop: '4vh',
                          },
                        });
                    
                    // console.log(rowsAux);
                    setDatosRows(rowsAux); 
                    dataAuxCancel = await JSON.stringify(rowsAux);  
                    // setModifico(false); 
                    setModifico(FormName)
                    setActivarSpiner(false); setRowsDelete([]);
                    getEstablecerOperaciones();
                    setTimeout( ()=>grid.current.instance.focus(grid.current.instance.getCellElement(fila,columna)) );
                  }else{
                    setActivarSpiner(false)
                    showModalMensaje('ERROR!','error',resp.p_mensaje); 
                  }
              });
          } catch (error) {
            setActivarSpiner(false)
            console.log("Error en la funcion de Guardar!",error);
          } 
      }else{
        message.info({
          content  : `No encontramos cambios para guardar`,
          className: 'custom-class',
          duration : `${2}`,
          style    : {
            marginTop: '2vh',
          },
        });
        // setModifico(false);
        setModifico(FormName)
        setTimeout( ()=>grid.current.instance.focus(grid.current.instance.getCellElement(fila,columna)) );
      }
    }
  }
  const funcionSaveChange = async()=>{
    await grid.current.instance.saveEditData();
    var fila = getFocusedRowIndex();
    if(fila == -1) fila = 0;
    await grid.current.instance.repaintRows([fila])
    setActivarSpiner(true)
    setTimeout(async()=>{
      if(globalValidate){
        await funcionGuardar();
      }
      setActivarSpiner(false)
    },75);
  }
  const ValidarDatosRequerido = async(insertUpdate) =>{    
    var arrayHeadRequerid = new Array();
    columns.forEach(items => {
      if(items.requerido){
        arrayHeadRequerid.push({ID:`${items.ID}`,label:`${items.label}`})
      }
    });
    let interrutor  = false;  let columna = "";  let indexRows  = "";
    let valorReturn = true;

    for (let i = 0; i < insertUpdate.length; i++) {
      const itemsData = insertUpdate[i];
      if((itemsData.inserted || itemsData.updated) && (!interrutor)){
        for (let y = 0; y < arrayHeadRequerid.length; y++) {
          const itemsColumn = arrayHeadRequerid[y]; 
          var valorString = itemsData[itemsColumn.ID];
          if(valorString == null || valorString == undefined) valorString = ""
          if(((!_.isNumber(valorString)) && (_.isEqual(valorString.trim(), "")))){
            valorReturn = await false;
            columna     = itemsColumn.ID;
            indexRows   = grid.current.instance.getRowIndexByKey(itemsData.ID);
            message.info({
                content  : `Favor complete los campos de ${itemsColumn.label} antes de continuar!!`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                  marginTop: '2vh',
                },
            });
            interrutor = true
            break
          }
        }
      }else{
        break
      }
    }
    if(interrutor){
      setTimeout(()=>{
        grid.current.instance.focus(grid.current.instance.getCellElement(indexRows, columna))
        grid.current.instance.editCell(indexRows, columna)
      },150);
    }
    return valorReturn;
  }
  const onRowUpdating  = async(value) =>{
    update = true
    var columnNameEdit = Object.keys(value.newData);    
    var rowsColumn = columns.filter(item => item.ID == columnNameEdit[0]);    
    if(rowsColumn[0].upper){
      value.newData[columnNameEdit[0]] = value.newData[columnNameEdit[0]].toUpperCase();
    }
    // setModifico(true);
    modifico(FormName)
    if(props.setOnRowUpdating){
      props.setOnRowUpdating(value);
    }
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
      // var indexComun  = grid.current.instance.getCellElement(indexRows,nameColumn);
      var columnhead  = getFocusGlobalEvent();      

      var classNameCheckbox          = $('.dx-cell-modified');
      var classNameInput             = $('.dx-focused');
      if(classNameInput.length > 0)    $('.dx-focused').removeClass("dx-focused");
      if(classNameCheckbox.length > 0) $('.dx-cell-modified').removeClass("dx-cell-modified");

      try{
        var method = 'POST'        
        var data   = {'valor':valor,cod_empresa,dependencia:ArrayDataDependencia};
        await Request( url, method, data)
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
              showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
            }
          }
        });
      } catch (error) {
        console.log("Error en funcionValidacio",error);
      }
    }
    
     
  }
  const getRowModal = async(dependencia, url) =>{
    let dataRows = []
    try {
        var method = 'POST';
        var data   = {"valor":"null",cod_empresa, dependencia}
        await Request(url,method,data)
        .then( response =>{
            if(response.data.rows){
              dataRows = response.data.rows;
            }                    
        });   
      return dataRows;
    } catch (error) {
        console.log("Error en el metodo getMoneda ",error);
    }
  }
  const onKeyDown = async(e) =>{ 
    if(e.event.key == "F10"){
      e.event.preventDefault();
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
        // guardar();
        funcionSaveChange();
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
    
    if((e.event.keyCode === 120 && (setEditarModalNew)) && (columnModal)){
      if(Object.entries(columnModal).length > 0){
        var ArrayDataDependencia = await validarDependencia(120);        
        var nameData             = await getFocusedColumnName();
        if(ArrayDataDependencia == true) return
        if(columnModal[nameData]){
          e.event.preventDefault();
          var url          = columnModal.urlBuscador[0][nameData]
          var AuxDatamodal = await getRowModal(ArrayDataDependencia,url)
          var title = await columnModal.title[0][nameData];
          setModalTitle(title)
          setSearchColumns(columnModal[nameData])
          setSearchData(AuxDatamodal);
          setTipoDeBusqueda(nameData);           
          setShows(true);
        }
        // setEditarModalNew = false;
      }else{return}
    }else{return}    
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
                setSearchData(response.data.rows)
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
  const modalSetOnClick = async (datos, busquedaPor) => {
    globalValidate = true; 
    await grid.current.instance.refresh(true);
    await grid.current.instance.cancelEditData();
    await grid.current.instance.saveEditData();

    if(datos !== "" || datos !== undefined){
      // setModifico(true)
      modifico(FormName)
      var rows              = await getFocusGlobalEvent().row.data;
      var dataRow           = await getFocusGlobalEvent();
      var valor_anterior    = rows[busquedaPor];
      var valor_actual      = await datos[0];
      var codPropidadColumn = await grid.current.instance.columnOption(columnModal[busquedaPor][0].ID)
      var desPropidadColumn = await grid.current.instance.columnOption(columnModal[busquedaPor][1].ID)
      
      var indexRows         = grid.current.instance.getRowIndexByKey(rows.ID);
      if(indexRows == -1) indexRows = 0;
      var indexColum        = codPropidadColumn.visibleIndex;
      
      if( valor_anterior !== valor_actual ){
        
        if(columnModal.config[busquedaPor]){
          if(columnModal.config[busquedaPor].dependencia_de.length > 0){
            columnDependencia(rows,columnModal.config[busquedaPor].dependencia_de,busquedaPor,false);
          }
        }
        // if(columnModal['DEPENDENCIA'].length > 0){
        //   columnDependencia(rows,columnModal['DEPENDENCIA'],busquedaPor,false);
        // }
        getFocusGlobalEvent().row.data[codPropidadColumn.name]           = await datos[0];
        if(desPropidadColumn){
          getFocusGlobalEvent().row.data[desPropidadColumn.name]         = await datos[1];
        }else{
          getFocusGlobalEvent().row.data[columnModal[busquedaPor][1].ID] = await datos[1];
        }
        if(!getFocusGlobalEvent().row.data['inserted']){
          getFocusGlobalEvent().row.data['updated'] = true;
        }
        dataRow.component.repaintRows([indexRows])
      }
      showsModal(false);
      await grid.current.instance.option(rows)
      if(props.rowFocus) props.rowFocus('',true,rows);
      await dataRow.component.repaintRows([indexRows])
      establecerFocus(indexRows,indexColum,true);
      // grid.current.instance.focus(grid.current.instance.getCellElement(indexRows,indexColum))
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
  const funcionCancelar = async ()=>{
    var AuxDataCancel   = await JSON.parse(dataAuxCancel);
    setDatosRows(AuxDataCancel)
    grid.current.instance.state(null)
    grid.current.instance.refresh(true);
    grid.current.instance.cancel = true
    grid.current.instance.cancelEditData();
    getEstablecerOperaciones();
    // setModifico(false)   
    setModifico(FormName)
    setRowsDelete([])    ; setActivarSpiner(true) ; 
    setFocusedRowIndex(0); globalValidate = true  ;
   setTimeout(()=>{    
    establecerFocus();
    setActivarSpiner(false);
    grid.current.instance.saveEditData();
   },2);
  }
  const onCellClick     =(e)=>{
    if(!globalValidate){
      e.event.preventDefault();
      return;
    }
    if(e.rowType){
      if(e.rowType !== "header"){
        setTimeout(()=>{
          let fila    = getFocusedRowIndex();
          let columna = e.columnIndex;
          if(fila === '-1') fila = 0;
          grid.current.instance.focus(grid.current.instance.getCellElement(fila,columna))
        },20);
        setFocusedColumnName(e.column.dataField);
      }
    }
  }
  const cancelarModal =() =>{
    showsModal(false)    
    setTimeout(()=>{
      var column = getFocusedColumnIndex();
      var fila   = getFocusedRowIndex();
      if(fila == -1) fila = 0;
      grid.current.instance.focus(grid.current.instance.getCellElement(fila,column));
    },10);
  }
  return (
    <div className="paper-container">
      <Paper className="paper-style">
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
                      cancelarModal={cancelarModal}
                    />
                }
            descripcionClose =""
            descripcionButton=""
            actionAceptar    =""
        />
        <Spin spinning={activarSpiner} size="large" >
            <div className="paper-header">
                <Title level={5} className="title-color">
                    {title}
                    <div>
                        <Title level={4} style={{ float: 'right', marginTop: '-16px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</Title>
                    </div>
                </Title>
            </div>
           <Search 
              setDatosRows={setDatosRows}
              datosRows={datosrows}
              formName={FormName}
              funcionCancelar={funcionCancelar}
              // modifico={modifico}
              listFiltro={listFiltro}
              headSeled={headSeled}
              urlBuscador={props.urlBuscador}
              columns={columns}
              showModalDelete={deleteRows}
              addRow={addRow}
              guardar={funcionSaveChange}
              grid={grid}
            />
              {!_.isUndefined(props.activateheadRadio) && !_.isUndefined(props.arraykeyRadio) && 
                !_.isUndefined(props.accionChange)     && !_.isUndefined(props.valueState)
              ?              
                props.arraykeyRadio.length > 0 
                ? <div className="ArtCateDevExtreme">
                    <Radio.Group onChange={props.accionChange} value={props.valueState} >
                      <Radio className="labelArt_Categoria" value={'A'}>{props.arraykeyRadio[0].descripcion1}</Radio>
                      <Radio className="labelArt_Categoria" value={'I'}>{props.arraykeyRadio[1].descripcion2}</Radio>
                    </Radio.Group>
                  </div>
                : null
              : null
              }
              <DataGrid
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
                height={props.height}
                onCellClick={onCellClick}
                onEditorPreparing={onEditorPreparing}                
                //----------------------------
                allowColumnResizing={false}
                errorRowEnabled={true}
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
                        allowSorting     = {!opcionComparar(column.ID, props.notOrderByAccion)}
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
                        allowSorting       = {!opcionComparar(column.ID, props.notOrderByAccion)}
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
                          allowSorting      = {!opcionComparar(column.ID, props.notOrderByAccion)}
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
                        precision        = "2"
                        format           = {"#,##0"}
                        allowSorting      = {!opcionComparar(column.ID, props.notOrderByAccion)}
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
                      headerCellRender  = {(e)=>renderHeader(e,column)}
                    > 
                  </Column>
                ))}
                <LoadPanel enabled={false} showPane={false} visible={false} showIndicator={false} />
                <Paging defaultPageSize={sizePagination} />
                <Pager
                  visible={true}
                  allowedPageSizes={false}
                  displayMode={'full'}
                  showPageSizeSelector={true}
                  showInfo={true}
                  showNavigationButtons={true} />
            </DataGrid>
          </Spin>  
      </Paper>
	  </div>
  );
})
export default DevExpressList;

// import React,{ useState,useRef}      from 'react'
// import  Paper 					             from '@material-ui/core/Paper';
// import Button 					             from '@material-ui/core/Button';
// import styles 					             from './Styles';
// import { BiSearchAlt } 	             from "react-icons/bi";
// import moment                        from 'moment';
// import FormModalSearch               from '../ModalForm/FormModalSearch';
// import ModalDialogo                  from "../Modal/ModalDialogo";
// import NewTableSearch                from '../NewTableSearch/NewTableSearch';
// import Main                          from '../Main';
// import { v4 as uuidID  }             from 'uuid';
// import Search,{ setFocusedRowIndex, 
//                 getFocusedRowIndex 
//               }                            from './Search'  
// import _                                   from 'underscore';
// import { Spin,message,Typography,Radio }   from 'antd';
// import {getPermiso}                        from './PermisosEdit'
// import DataGrid, {
//   Column ,   Editing,   Paging,    Lookup,   KeyboardNavigation, LoadPanel,
// 	Sorting,   Pager  }                from "devextreme-react/data-grid";
// import {Request}                     from '../../../config/request';
// import $                             from 'jquery';
// import './stylesDevExteme.css'
// import "devextreme/dist/css/dx.material.blue.light.compact.css";
// const { Title }    = Typography;
// const deMessages   = require('devextreme/localization/messages/de.json');;
// const EsMessages   = require('devextreme/localization/messages/es.json');
// const localization = require('devextreme/localization'); 
// localization.loadMessages(deMessages);
// localization.loadMessages(EsMessages);
// localization.locale(navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage));

// var focusGlobalEvent;
// export const setFocusGlobalEvent = (valor)=>{
//   focusGlobalEvent = valor;
// }
// export const getFocusGlobalEvent = ()=>{
//   return focusGlobalEvent;
// }
// var focusedColumnName
// const setFocusedColumnName = (valor)=>{
//   focusedColumnName = valor;
// }
// const getFocusedColumnName = ()=>{
//   return focusedColumnName;
// }
// var focusedColumnIndex;
// const setFocusedColumnIndex = (valor)=>{
//   focusedColumnIndex = valor;
// }
// const getFocusedColumnIndex = ()=>{
//   return focusedColumnIndex;
// }
// var nameRowsEnter
// const setNameRowsEnter = (keyName)=>{
//   nameRowsEnter = keyName;
// };
// const getNameRowsEnter = ()=>{
//   return nameRowsEnter
// }
// var rowColumnErrorModaF9 = new Array
// const setRowColumnErrorModaF9 = (fila, column)=>{
//   rowColumnErrorModaF9 = []
//   rowColumnErrorModaF9.push({'fila':fila});
//   rowColumnErrorModaF9.push({'columna':column});
// };
// const getRowColumnErrorModaF9 = ()=>{
//   return rowColumnErrorModaF9
// }
// var eventValuesCheckbox
// const setEventValuesCheckbox = (e)=>{
//   eventValuesCheckbox = e;
// };
// const getEventValuesCheckbox = ()=>{
//   return eventValuesCheckbox
// }

// var rowsDelete = new Array();
// var obejto
// const setRowsDelete = (e)=>{
//   if(e.length === 0){
//     rowsDelete = []
//   }else if(JSON.stringify(obejto) !== JSON.stringify(e)){
//     rowsDelete.push(e);
//   } 
//   obejto = e;
// }
// const getRowsDelete = ()=>{
//   return rowsDelete
// }

// const arrayHeadEdit      = []
// const headEdit           = []

// var globalValidate       = true;
// var valorAnteriorEnter   = ""; 
// var valorActualEnter     = "";
// // es un bandera se utiliza para que almacene los datos en un JSON.stringify;
// var ArrayDependenciaGlobal = new Array
// var dataAuxCancel          = ""
// var setEditarModalNew = false;

// var insert   = false
// var update   = false
// var eliminar = false

//  export const getEstablecerOperaciones = ()=>{
//   insert = false, update= false, eliminar=false;
// }

// const DevExpressList = React.memo((props) => {

//   const username         = sessionStorage.getItem('cod_usuario');
//   const cod_empresa      = sessionStorage.getItem('cod_empresa');
//   const classes          = styles();
  
//   //---------------------------  ctrl+m ---------------------------------------------------
//   Main.useHotkeys(Main.nuevo, (e) =>{
//         e.preventDefault();
//         addRow();
//   },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

//     //---------------------------  props ----------------------------------------------------
    
//     const columns         = props.columns;          const FormName      = props.formName;           const title   = props.title;    
//     const columBuscador   = props.columBuscador;    const optionSelect  = props.arrayOptionSelect;  const urlAbm  = props.urlAbm;
//     const columnModal     = props.arrayColumnModal; const defaultFocusColumn = props.defaultFocusColumn; 
//     const sizePagination  = props.sizePagination;   const codDependenciaAnt  = props.codDependenciaAnt;


//     //-------------------Estado DataGrid-----------------------------------------------------
//     const [datosrows        , setDatosRows        ] = useState(props.data);
//     const [tipoDeBusqueda   , setTipoDeBusqueda   ] = useState();
//     const [headSeled        , setheadSeled        ] = useState([columBuscador])
//     const [modifico         , setModifico         ] = useState(false);
//     const [activarSpiner    , setActivarSpiner    ] = useState(false);
//     const [columnEditDisable, setColumnEditDisable] = useState([]);
    
//     //---------------------------Estado Modal------------------------------------------------
//     const [shows            , setShows            ] = useState(false);
//     const [modalTitle       , setModalTitle       ] = useState();
//     const [searchColumns    , setSearchColumns    ] = useState();
//     const [searchData       , setSearchData       ] = useState({});
//     //---------------------------Estado Modal mensaje ----------------------------------
//     const [visibleMensaje   , setVisibleMensaje   ] = useState(false);
//     const [mensaje          , setMensaje          ] = useState();
//     const [imagen           , setImagen           ] = useState();
//     const [tituloModal      , setTituloModal      ] = useState();
//     /*---------------------------focus Modal mensaje -------------------------------- */
  
//   const establecerFocus = (fila,column,params)=>{
//       if(params){
//         setTimeout( ()=>{
//           grid.current.instance.focus(grid.current.instance.getCellElement(fila,column));
//         },100);
//       }else{
//         setTimeout( ()=>{
//           var indexColun = defaultFocusColumn !== undefined  ? defaultFocusColumn : 0
//           grid.current.instance.focus(grid.current.instance.getCellElement(0,indexColun));
//         },200);
//       }
//   }
//   const handleCancel = async() => {
//     setVisibleMensaje(false);
//     setTimeout(async()=>{
//       var column = getFocusedColumnIndex();
//       var fila   = getFocusedRowIndex();
//       if(fila == -1) fila = 0;

//       if(!globalValidate){
//         fila   = await getRowColumnErrorModaF9()[0].fila;
//         column = await getRowColumnErrorModaF9()[1].columna;
//         grid.current.instance.focus(grid.current.instance.getCellElement(fila,column))
//         await grid.current.instance.editCell(fila, column);
//         await grid.current.instance.cellValue(fila, column,valorActualEnter);
//       }else{
//         await grid.current.instance.focus(grid.current.instance.getCellElement(fila,column))
//         await grid.current.instance.editCell(fila, column);
//       }        
//     },45)
//   };
//   const showModalMensaje = (titulo,imagen, mensaje) => {
//     setTituloModal(titulo);
//     setImagen(imagen);
//     setMensaje(mensaje);
//     setVisibleMensaje(true);
//   };
//   const showsModal = async (valor) => {
//     setShows(valor);
//   };
//   const filtradoEdicion = () =>{
//     columns.filter((item)=>{
//       if(item.edit == false)arrayHeadEdit.push(item.ID)
//       else if((!item.disable) || (!item.edit == false))
//       headEdit.push(item.ID)
//     });
//   }  
//   const grid = useRef(); 
//   React.useEffect(() => {
// 		setDatosRows(props.data);  
//     setTimeout(()=>establecerFocus())
//     filtradoEdicion()
//     var arrayInsert = _.flatten(_.filter(columns, function(item){
//       if(item.editModal === false || item.editModal === true || item.Pk === true) return item;
//     }));
//     setColumnEditDisable(arrayInsert);
//     if(props.data.length > 0){
//       dataAuxCancel = JSON.stringify(props.data);
//     }
//   },[props.data]);
//   const listFiltro = async (datos) => {
//     setDatosRows(datos)
//     // setDatosEdit(datos[0])
//   }
//   const opcionComparar = (values, opcion) => {
//     var check = false;
//     if(opcion !== undefined){
//       if(opcion.length > 0){
//         for (let i = 0; i < opcion.length; i++) {
//           if(values === opcion[i]){
//             check=true;
//             break;
//           }
//         }
//       }
//     }
//     return check;
//   }
// 	const selectedHead = async (e,idHead) => {
//     e.stopPropagation()
// 		var iconohead = await document.getElementsByName(idHead);
// 		var exists    = await headSeled.includes(idHead);

// 		if(exists){
// 			iconohead[0].style.visibility = 'collapse'
// 			const indice = headSeled.indexOf(idHead)
// 			headSeled.splice(indice, 1);
// 		}else{
// 			setheadSeled(await headSeled.concat(idHead));
// 			document.getElementsByName(idHead)[0].style.visibility = 'visible';
// 		}
// 	}
//   const renderHeader = (e,column) => {
//     return (
//       <>
//       { opcionComparar(column.ID, props.doNotsearch)
//         ? 
//           <div 
//             id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : "horizontalDatagrid"}
//             key={column.ID}
//             className={classes.selectHeader} 
//             disabled>
//             {column.label}
//           </div>
//         :
//           <Button   key={column.ID}
//                     id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : null}
//                     className={classes.selectHeader} 
//                     onClick={(e) => selectedHead(e,column.ID)} >
//                     {column.label}
//                     { headSeled.includes(column.ID)
//           ?
//               <i name={column.ID} className={classes.auxIconHead}>
//                 <BiSearchAlt/>
//               </i>
//           :
//               <i name={column.ID} className={classes.iconHead}>
//               <BiSearchAlt/>
//             </i>
//           }
//         </Button>
//       }
//       </>
//     );
//   }
//   const onFocusedRowChanged = async (e)=>{
//     setFocusGlobalEvent(e);
//     if(props.rowFocus){
//       props.rowFocus(e);
//     }
//   }
//   const setCellValue = async(newData, value, columnRowData, column)=>{
//     var newValue       = await value ? column.checkBoxOptions[0] : column.checkBoxOptions[1];
//     newData[column.ID] = await newValue;
//   }
//   const onFocusedRowChanging = async (e) =>{
//     if(props.setRowChanging){
//       props.setRowChanging(e);
//     }
//     setFocusedRowIndex(e.newRowIndex);
//     var rowsCount = e.component.getVisibleRows().length,
//     pageCount     = e.component.pageCount(),
//     pageIndex     = e.component.pageIndex(),
//     key = e.event && e.event.key;
//     if(key && e.prevRowIndex === e.newRowIndex) {
//       if(e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
//           e.component.pageIndex(pageIndex + 1).done(function() {
//           e.component.option('focusedRowIndex', 0);
//         });
//       } else if(e.newRowIndex === 0 && pageIndex > 0) {
//           e.component.pageIndex(pageIndex - 1).done(function() {
//           e.component.option('focusedRowIndex', rowsCount - 1);
//         });
//       }
//     }
//   }
//   const onFocusedCellChanging = async(e)=> {    
//     setEventValuesCheckbox(e);
//     setFocusedColumnName(e.columns[e.newColumnIndex].dataField);
//     setFocusedColumnIndex(e.newColumnIndex);
//     let permisoEdit     = await getPermiso(FormName,'U')
//     var dataColumn      = getFocusedColumnName();
//     if(columnEditDisable.length > 0){
//       for (let i = 0; i < columnEditDisable.length; i++) {
//         const items = columnEditDisable[i];
        
//         if(items.ID === dataColumn && permisoEdit && e.rows[e.newRowIndex].data.inserted){
//           setEditarModalNew = true;
//           e.columns[e.newColumnIndex].allowEditing = true
//           break;
//         }
//         if(items.ID === dataColumn && permisoEdit && items.editModal == true){
//           e.columns[e.newColumnIndex].allowEditing = true          
//           setEditarModalNew = true
//         }
//         if(items.ID === dataColumn && permisoEdit && items.editModal == false){
//           e.columns[e.newColumnIndex].allowEditing = false
//            setEditarModalNew = false
//         }
        
//         if(items.ID === dataColumn && permisoEdit && items.Pk){
//           e.columns[e.newColumnIndex].allowEditing = false
//             setEditarModalNew = false
//         }      
//       }
//       if(e.columns[e.newColumnIndex].dataType == 'boolean'){
//         e.columns[e.newColumnIndex].allowEditing = true
//       }
//     }
//   }
//   const addRow = async() => {
//     insert = true;
//     let permisoEdit  = await getPermiso(FormName,'I')
//     if(permisoEdit){  
//       var rowIndex  
//       var paginacion
//       if (!modifico)setModifico(true)

//       let data = grid.current.instance.getDataSource();
//       if(getFocusGlobalEvent()){
//         rowIndex    = await getFocusedRowIndex();
//         if(rowIndex == -1) rowIndex = 0;
//           paginacion = data.pageIndex();
//       }else{
//         rowIndex   = 0;
//         paginacion = 0;
//       }
//       if( paginacion > 0 ) rowIndex = (sizePagination * paginacion) + rowIndex;
    
//       var newKey   = uuidID();
//       var row      = props.modeloAuditoria !== undefined ? props.modeloAuditoria : [];
//       row = [{
//         ...row[0],
//         ID         : newKey     ,
//         inserted   : true       ,
//         COD_EMPRESA: cod_empresa,
//         COD_USUARIO: username
//       }]
//       columns.forEach(async element => {
//         if(element.isdate)         row[0][element.ID] = moment();
//         if(element.checkbox)       row[0][element.ID] = element.checkBoxOptions[1];  
//         if(element.isOpcionSelect){
//           _.flatten(_.filter(optionSelect[element.ID], function(item){
//             if (item.isNew) row[0][element.ID] = item.ID;
//           }));
//         }
//       });
        
//       setDatosRows(datosrows.concat(datosrows.splice(rowIndex, 0, ...row)));      
//       setTimeout(()=>{
//         grid.current.instance.repaintRows([rowIndex])
//         let indexColumn = defaultFocusColumn !== undefined ? defaultFocusColumn : 0
//         // establecerFocus(rowIndex,indexColumn,true);
//         grid.current.instance.focus(grid.current.instance.getCellElement(rowIndex,indexColumn));
//       },25.3);
//     }else{
//       message.info('Puede que no tengas los permiso para realizar esta accion');
//       establecerFocus();
//     }
//   }
//   const deleteRows = async (e)=>{
//     if(getFocusGlobalEvent().row){
//       eliminar = true
//       if(!modifico)setModifico(true);
//         var info        = await getFocusGlobalEvent().row.data;
//         var fila        = getFocusedRowIndex();
//         const indexRows = grid.current.instance.getRowIndexByKey(info.ID);
//         if(fila == -1) fila = await 0; 
//         if(indexRows == fila){
//           if(fila !== 0){
//             fila = await indexRows -1;
//             setFocusedRowIndex(fila)
//           }
//         }
//         var rowsInfo = await grid.current.instance.getDataSource()._items;
//         if(!rowsInfo[fila].inserted){
//           rowsInfo.delete      = true;
//           rowsInfo.COD_EMPRESA = cod_empresa;
//           setRowsDelete(rowsInfo[0]);
//           await grid.current.instance.deleteRow(indexRows);
//         }else{
//           await grid.current.instance.deleteRow(indexRows);
//         }
//         setTimeout(()=>{
//           let indexColmn = defaultFocusColumn !== undefined ? defaultFocusColumn : 0
//           establecerFocus(fila,indexColmn,true);
//           // grid.current.instance.focus(grid.current.instance.getCellElement(fila,defaultFocusColumn))          
//         },45);
//     }
//   }
//   const funcionGuardar = async()=>{
//     var nameFormatDate = [];  
//     var updateInsert   = [];
//     var cod_auto       = -1;
//     var key            = ""
//     var rowsAux        = []
//     var validaDatos    = []
//     columns.filter(element =>{if(element.isdate) nameFormatDate.push(element.ID)});    
//     var auxBan = false
    
//     _.flatten(_.filter(datosrows, function(item){
//       if(item.inserted == true || item.updated){
//         validaDatos.push(item)
//         updateInsert.push(item)
//       }
//     }));
  
//     // Valida que todos los campos requeridos esten cargado
//     var validaCampo = await ValidarDatosRequerido(validaDatos)
//     if(validaCampo){

//       if(codDependenciaAnt !== undefined && codDependenciaAnt !== '' && codDependenciaAnt !== null){
//         if(updateInsert.length > 0){
//           auxBan = true
//           var key  = Object.keys(codDependenciaAnt[0])[0]
//           var info = await Main.GeneraUpdateInsert(datosrows, codDependenciaAnt);
//           rowsAux      =  info.rowsAux;
//           updateInsert =  info.updateInsert;  
//         }
//       }

//       var content = datosrows.filter(item => item.inserted == true);
//       if(columnModal.config.auto.length > 0){
//           key       = Object.keys(columnModal.config.auto[0])[0];
//           let resul = await Main.Request(columnModal.config.auto[0][key], 'GET', {});
//           cod_auto  = resul.data.rows[0][key]
//           cod_auto  = cod_auto + (content.length - 1);
//           updateInsert.pop()
          
//           for (let i = 0; i < datosrows.length; i++) {
//             const element = datosrows[i];
//             if(element.updated == true){
//               updateInsert.push(element);
//             }
//             if(element.inserted == true ){
//               if(cod_auto !== -1){
//                 element[key]    = cod_auto;
//                 updateInsert.push(element);
//                 cod_auto--;
//               }
//             }
//             rowsAux.push(_.omit(element,['inserted','updated']))
//           }
//       }else if(!auxBan){
//         for (let i = 0; i < datosrows.length; i++) {
//           const element = datosrows[i];
//           rowsAux.push(_.omit(element,['inserted','updated']))
//         }
//       }    
//       var info      = []
//       const columna = getFocusedColumnIndex();
//       var fila      = getFocusedRowIndex();
//       if(fila == -1) fila = 0;
  
//       info.push({"cod_usuario":username,"cod_empresa":cod_empresa})
//       rowsDelete = await getRowsDelete();
//       var data = {updateInsert, rowsDelete, nameFormatDate, info}
//       if(updateInsert.length > 0 || rowsDelete.length > 0){      
//           setActivarSpiner(true);
//           try{
//             var method = "POST"
//             await Request( urlAbm, method, data)
//             .then(async(response) => {
//               var resp = response.data;
//                   if(resp.ret == 1){
//                         message.success({
//                           content  : `Procesado correctamente!!`,
//                           className: 'custom-class',
//                           duration : `${2}`,
//                           style    : {
//                             marginTop: '4vh',
//                           },
//                         });
//                     setDatosRows(rowsAux); dataAuxCancel = JSON.stringify(rowsAux);  
//                     setModifico(false); setActivarSpiner(false); setRowsDelete([]);
//                     getEstablecerOperaciones();
//                     setTimeout( ()=>grid.current.instance.focus(grid.current.instance.getCellElement(fila,columna)) );
//                   }else{
//                     setActivarSpiner(false)
//                     showModalMensaje('ERROR!','error',resp.p_mensaje); 
//                   }
//               });
//           } catch (error) {
//             setActivarSpiner(false)
//             console.log("Error en la funcion de Guardar!",error);
//           } 
//       }else{
//         message.info({
//           content  : `No encontramos cambios para guardar`,
//           className: 'custom-class',
//           duration : `${2}`,
//           style    : {
//             marginTop: '2vh',
//           },
//         });
//         setModifico(false);
//         setTimeout( ()=>grid.current.instance.focus(grid.current.instance.getCellElement(fila,columna)) );
//       }
//     }
//   }
//   const funcionSaveChange = async()=>{
//     await grid.current.instance.saveEditData();
//     var fila = getFocusedRowIndex();
//     if(fila == -1) fila = 0;
//     await grid.current.instance.repaintRows([fila])
//     setActivarSpiner(true)
//     setTimeout(async()=>{
//       if(globalValidate){
//         await funcionGuardar();
//       }
//       setActivarSpiner(false)
//     },75);
//   }
//   const ValidarDatosRequerido = async(insertUpdate) =>{    
//     var arrayHeadRequerid = new Array();
//     columns.forEach(items => {
//       if(items.requerido){
//         arrayHeadRequerid.push({ID:`${items.ID}`,label:`${items.label}`})
//       }
//     });
//     let interrutor  = false;  let columna = "";  let indexRows  = "";
//     let valorReturn = true;

//     for (let i = 0; i < insertUpdate.length; i++) {
//       const itemsData = insertUpdate[i];
//       if((itemsData.inserted || itemsData.updated) && (!interrutor)){
//         for (let y = 0; y < arrayHeadRequerid.length; y++) {
//           const itemsColumn = arrayHeadRequerid[y]; 
//           var valorString = itemsData[itemsColumn.ID];
//           if(valorString == null || valorString == undefined) valorString = ""
//           if(((!_.isNumber(valorString)) && (_.isEqual(valorString.trim(), "")))){
//             valorReturn = await false;
//             columna     = itemsColumn.ID;
//             indexRows   = grid.current.instance.getRowIndexByKey(itemsData.ID);
//             message.info({
//                 content  : `Favor complete los campos de ${itemsColumn.label} antes de continuar!!`,
//                 className: 'custom-class',
//                 duration : `${2}`,
//                 style    : {
//                   marginTop: '2vh',
//                 },
//             });
//             interrutor = true
//             break
//           }
//         }
//       }else{
//         break
//       }
//     }
//     if(interrutor){
//       setTimeout(()=>{
//         grid.current.instance.focus(grid.current.instance.getCellElement(indexRows, columna))
//         grid.current.instance.editCell(indexRows, columna)
//       },150);
//     }
//     return valorReturn;
//   }
//   const onRowUpdating  = async(value) =>{
//     update = true
//     var columnNameEdit = Object.keys(value.newData);    
//     var rowsColumn = columns.filter(item => item.ID == columnNameEdit[0]);    
//     if(rowsColumn[0].upper){
//       value.newData[columnNameEdit[0]] = value.newData[columnNameEdit[0]].toUpperCase();
//     }
//     setModifico(true);
//     if(props.setOnRowUpdating){
//       props.setOnRowUpdating(value);
//     }
//     setNameRowsEnter(Object.keys(value.newData)[0])
//     valorAnteriorEnter  = value.oldData[columnNameEdit[0]];
//     valorActualEnter    = value.newData[columnNameEdit[0]];

//     if(columnModal){
//       if(columnModal[columnNameEdit[0]]){        
//         grid.current.instance.option("focusedRowKey", 120);
//         grid.current.instance.clearSelection();
//         grid.current.instance.focus(0);

//         await funcionValidacion(columnNameEdit[0], value.newData[columnNameEdit[0]], value);
//       }
//     }
//     if(globalValidate){
//       globalValidate = true;
//       if(!value.oldData.inserted) value.oldData.updated = true
//     }else{
//       value.cancel   = false
//       var filas      = grid.current.instance.getRowIndexByKey(value.key); 
//       var indexComun = grid.current.instance.getCellElement(filas,columnNameEdit[0]);
//       setRowColumnErrorModaF9(filas, indexComun.cellIndex);
//       value.component.cancelEditData();
//     }
//   }  
//   const funcionValidacion = async (nameColumn, value, rowsData)=>{
//     var ArrayDataDependencia = await validarDependencia(13);
//     if( ArrayDataDependencia == true){ globalValidate = false; return}
    
//     var valor_anterior = valorAnteriorEnter;
//     var valor_actual   = await value;
//     rowsData.component.navigateToRow(rowsData.key)
  
//     if(valor_anterior !== valor_actual || globalValidate == false){      
//       var valor       = await value
//       if(!_.isNumber(valor) && !_.isNull(valor) && !_.isNaN(valor) && !_.isUndefined(valor) ) valor = await value.trim();
//       var url         = columnModal.urlValidar[0][nameColumn];
//       var indexRows   = rowsData.component.getRowIndexByKey(rowsData.key)
//       // var indexComun  = grid.current.instance.getCellElement(indexRows,nameColumn);
//       var columnhead  = getFocusGlobalEvent();      

//       var classNameCheckbox          = $('.dx-cell-modified');
//       var classNameInput             = $('.dx-focused');
//       if(classNameInput.length > 0)    $('.dx-focused').removeClass("dx-focused");
//       if(classNameCheckbox.length > 0) $('.dx-cell-modified').removeClass("dx-cell-modified");

//       try{
//         var method = 'POST'        
//         var data   = {'valor':valor,cod_empresa,dependencia:ArrayDataDependencia};
//         await Request( url, method, data)
//         .then(async response => {
//           if(response.status == 200 ){
//             if(response.data.outBinds.ret == 1){
//               if(Object.keys(response.data.outBinds).length > 3){
//                 for(var i in response.data.outBinds){
//                   if(i != 'ret'){
//                     rowsData.oldData[i] = response.data.outBinds[i]
//                   }        
//                 }
//               }else{
//                 var nombreColumn = columnModal[nameColumn][1].ID.toLocaleLowerCase();
//                 var descripcion  = response.data.outBinds[nombreColumn];
//                 rowsData.oldData[columnModal[nameColumn][1].ID] = await descripcion;
//               }
//               rowsData.component.repaintRows([indexRows]);
              
//               if(columnModal.config[nameColumn] !== undefined){
//                 if(columnModal.config[nameColumn].dependencia_de.length > 0){
//                   await columnDependencia(rowsData,columnModal.config[nameColumn].dependencia_de,nameColumn,true);
//                 }
//               }

//               let indexComun = grid.current.instance.getCellElement(indexRows,nameColumn);
//               var columna    = indexComun.cellIndex + 1;
//               if(columnhead.row.cells[columna]){
//                 if(columnhead.row.cells[columna].column.name === columnModal[nameColumn][1].ID){
//                   columna = columna + 1;
//                   }
//               }
//               grid.current.instance.focus(grid.current.instance.getCellElement(indexRows,columna));
//               globalValidate = true;

//             }else{
//               globalValidate = false;
//               showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
//             }
//           }
//         });
//       } catch (error) {
//         console.log("Error en funcionValidacio",error);
//       }
//     }
    
     
//   }
//   const getRowModal = async(dependencia, url) =>{
//     let dataRows = []
//     try {
//         var method = 'POST';
//         var data   = {"valor":"null",cod_empresa, dependencia}
//         await Request(url,method,data)
//         .then( response =>{
//             if(response.data.rows){
//               dataRows = response.data.rows;
//             }                    
//         });   
//       return dataRows;
//     } catch (error) {
//         console.log("Error en el metodo getMoneda ",error);
//     }
//   }
//   const onKeyDown = async(e) =>{ 
//     if(e.event.key == "F10"){
//       e.event.preventDefault();
//       var infoPermiso = await Main.VerificaPermiso(FormName);
//       var band = true;
//       var mensaje = ''
//       if(insert){
//         if(infoPermiso[0].insertar != 'S'){
//           band = false;
//           mensaje = 'No tienes permiso para insertar'
//         }
//       }
//       if(update){
//         if(infoPermiso[0].actualizar != 'S'){
//           band = false;
//           mensaje = 'No tienes permiso para actualizar'
//         }
//       }
//       if(eliminar){
//         if(infoPermiso[0].borrar != 'S'){
//           band = false;
//           mensaje = 'No tienes permiso para eliminar'
//         }
//       }
//       if(band){
//         // guardar();
//         funcionSaveChange();
//       }else{
//         Main.message.warning({
//           content  : mensaje,
//           className: 'custom-class',
//           duration : `${2}`,
//           style    : {
//           marginTop: '4vh',
//           },
//         });
//       }
//       return;
//     }    
    
//     var columnName    = await getFocusedColumnName();
//     var columnDetalle = await grid.current.instance.columnOption(columnName);
//     if(columnDetalle){
//       if(e.event.code == "Space" && columnDetalle.userDataType == "boolean" && columnDetalle.allowEditing){  
//         e.event.preventDefault();
//         var rowsCheckbox    = await getEventValuesCheckbox();
//         var fila            = rowsCheckbox.newRowIndex;
//         if(fila == -1) fila = 0;

//         let eliminarFocusActivo          = document.getElementsByClassName("dx-cell-modified");
//         if(eliminarFocusActivo.length > 0){
//           document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
//         } 
        
//         let cambioCellInput = document.getElementsByClassName("dx-state-focused");
//         if(cambioCellInput.length === 0){
//           var valorCheckbox = !rowsCheckbox.rows[fila].values[columnDetalle.index]
//           grid.current.instance.cellValue(fila, columnDetalle.index,valorCheckbox);        
//         }else if(cambioCellInput.length === 2){
//           document.getElementsByClassName("dx-state-focused")[0].classList.remove("dx-state-focused")     
//         }
//         await grid.current.instance.saveEditData();
//       }
//      }
    
//     if(e.event.keyCode === 40 || e.event.keyCode === 38 || 
//       e.event.keyCode === 39 || e.event.keyCode === 37 ||
//       e.event.keyCode === 13 || e.event.keyCode === 9){
//        let eliminarFocusActivo = document.getElementsByClassName("dx-cell-modified");
//        if(eliminarFocusActivo.length > 0) document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
//     }
    
//     if((e.event.keyCode === 120 && (setEditarModalNew)) && (columnModal)){
//       if(Object.entries(columnModal).length > 0){
//         var ArrayDataDependencia = await validarDependencia(120);        
//         var nameData             = await getFocusedColumnName();
//         if(ArrayDataDependencia == true) return
//         if(columnModal[nameData]){
//           e.event.preventDefault();
//           var url          = columnModal.urlBuscador[0][nameData]
//           var AuxDatamodal = await getRowModal(ArrayDataDependencia,url)
//           var title = await columnModal.title[0][nameData];
//           setModalTitle(title)
//           setSearchColumns(columnModal[nameData])
//           setSearchData(AuxDatamodal);
//           setTipoDeBusqueda(nameData);           
//           setShows(true);
//         }
//         // setEditarModalNew = false;
//       }else{return}
//     }else{return}    
//   }
//   const onInteractiveSearch = async (event) => {
//     var nameColumn  = await getFocusedColumnName();
//     var valor       = event.target.value;
//     var url         = columnModal.urlBuscador[0][nameColumn];
//     valor           = valor.trim();
    
//     if(valor.length === 0 ){
//       valor = 'null';
//     }
//     var dependencia = ArrayDependenciaGlobal;
//     try{
//       var method = 'POST';
//       var data   = {'valor':valor,cod_empresa,dependencia};
//       await Request( url, method, data)
//           .then( response => {
//               if( response.status == 200 ){
//                 setSearchData(response.data.rows)
//                 // establecerFocus();
//               }
//       })
//     } catch (error) {
//       console.log("Error en onInteractiveSearch",error);
//     }
//   }
//   const validarDependencia = async (key)=>{
//     var ArrayDataDependencia = new Array();
//     var nameData             = await getFocusedColumnName();
//     if(key == 13) nameData   = getNameRowsEnter();   
//     var info                 = await getFocusGlobalEvent().row.data;

//     if( (Object.keys(columnModal.config).length == 0) || (columnModal.config[nameData]  === undefined)){
//       return [];
//     }
//     if(columnModal.config[nameData].depende_de.length > 0){

//       for (let i = 0; i < columnModal.config[nameData].depende_de.length; i++){
//         const items  = columnModal.config[nameData].depende_de[i];
//         var dataName = items.id
//           if(info[dataName] == ""){
//             setTimeout(()=>{
//               message.info({
//                 content  : `Favor complete el campo ${items.label} antes de continuar!!`,
//                 className: 'custom-class',
//                 duration : `${2}`,
//                 style    : {
//                   marginTop: '2vh',
//                 },
//             });
//             },100)            
//             return true
//           }else{
//               var data = {[dataName]:info[dataName]}
//               ArrayDataDependencia.push(data);
//               ArrayDependenciaGlobal = ArrayDataDependencia;
//           }
//       }
//     }
//     return ArrayDataDependencia
//   }
//   const columnDependencia = async (rows,dependencia,busquedaPor,enter)=>{
//     if( Object.keys(columnModal.config).length == 0 || (columnModal.config[busquedaPor] === undefined)){
//       return;
//     }
//     var fila;
//     var rowsData    =  getFocusGlobalEvent()
//       dependencia.forEach(async items => {
//         var key               = items.id
//         var rowDelete         = columnModal[key];
//         if(key !== busquedaPor && (enter)){         
//           rows.oldData[rowDelete[0].ID] = ""
//           rows.oldData[rowDelete[1].ID] = ""
//           fila = grid.current.instance.getRowIndexByKey(rows.oldData.ID)
//         }else{
//           rows[rowDelete[0].ID] = ""
//           rows[rowDelete[1].ID] = ""
//           fila = grid.current.instance.getRowIndexByKey(rows.ID)
//         }
//       });
//       await grid.current.instance.saveEditData();
//       await rowsData.component.repaintRows([fila]);
//       await grid.current.instance.option(rows)
//   }
//   const modalSetOnClick = async (datos, busquedaPor) => {
//     globalValidate = true; 
//     await grid.current.instance.refresh(true);
//     await grid.current.instance.cancelEditData();
//     await grid.current.instance.saveEditData();

//     if(datos !== "" || datos !== undefined){
//       setModifico(true)
//       var rows              = await getFocusGlobalEvent().row.data;
//       var dataRow           = await getFocusGlobalEvent();
//       var valor_anterior    = rows[busquedaPor];
//       var valor_actual      = await datos[0];
//       var codPropidadColumn = await grid.current.instance.columnOption(columnModal[busquedaPor][0].ID)
//       var desPropidadColumn = await grid.current.instance.columnOption(columnModal[busquedaPor][1].ID)
      
//       var indexRows         = grid.current.instance.getRowIndexByKey(rows.ID);
//       if(indexRows == -1) indexRows = 0;
//       var indexColum        = codPropidadColumn.visibleIndex;
      
//       if( valor_anterior !== valor_actual ){
        
//         if(columnModal.config[busquedaPor]){
//           if(columnModal.config[busquedaPor].dependencia_de.length > 0){
//             columnDependencia(rows,columnModal.config[busquedaPor].dependencia_de,busquedaPor,false);
//           }
//         }
//         // if(columnModal['DEPENDENCIA'].length > 0){
//         //   columnDependencia(rows,columnModal['DEPENDENCIA'],busquedaPor,false);
//         // }
//         getFocusGlobalEvent().row.data[codPropidadColumn.name]           = await datos[0];
//         if(desPropidadColumn){
//           getFocusGlobalEvent().row.data[desPropidadColumn.name]         = await datos[1];
//         }else{
//           getFocusGlobalEvent().row.data[columnModal[busquedaPor][1].ID] = await datos[1];
//         }
//         if(!getFocusGlobalEvent().row.data['inserted']){
//           getFocusGlobalEvent().row.data['updated'] = true;
//         }
//         dataRow.component.repaintRows([indexRows])
//       }
//       showsModal(false);
//       await grid.current.instance.option(rows)
//       await dataRow.component.repaintRows([indexRows])
//       establecerFocus(indexRows,indexColum,true);
//       // grid.current.instance.focus(grid.current.instance.getCellElement(indexRows,indexColum))
//     }
//   }
//   const onEditorPreparing = async (e)=>{
//     let columnNameEdit = e.name;
//     var rowsColumn = columns.filter( item => item.ID == columnNameEdit);
    
//     if(rowsColumn[0].isnumber){
//       e.editorOptions.min = 0
//     }
//     if(rowsColumn[0].upper){
//       e.editorElement.classList = "uppercaseInputDatagrid";
//     }
//     if(e.dataType === "boolean"){
//       var className = $('.dx-cell-modified');
//       if(className){
//         $('.dx-cell-modified').removeClass("dx-cell-modified");
//       }
//     }
//   }
//   const funcionCancelar = async ()=>{
//     var AuxDataCancel   = await JSON.parse(dataAuxCancel);
//     setDatosRows(AuxDataCancel)
//     grid.current.instance.state(null)
//     grid.current.instance.refresh(true);
//     grid.current.instance.cancel = true
//     grid.current.instance.cancelEditData();
//     getEstablecerOperaciones();
//     setModifico(false)   
//     setRowsDelete([])    ; setActivarSpiner(true) ; 
//     setFocusedRowIndex(0); globalValidate = true  ;
//    setTimeout(()=>{    
//     establecerFocus();
//     setActivarSpiner(false);
//     grid.current.instance.saveEditData();
//    },2);
//   }
//   const onCellClick     =(e)=>{
//     if(!globalValidate){
//       e.event.preventDefault();
//       return;
//     }
//     if(e.rowType !== "header"){
//       setTimeout(()=>{
//         let fila    = getFocusedRowIndex();
//         let columna = e.columnIndex;
//         if(fila === '-1') fila = 0;
//         grid.current.instance.focus(grid.current.instance.getCellElement(fila,columna))
//       },20);
//       setFocusedColumnName(e.column.dataField);
//     }
//   }
//   const cancelarModal =() =>{
//     showsModal(false)    
//     setTimeout(()=>{
//       var column = getFocusedColumnIndex();
//       var fila   = getFocusedRowIndex();
//       if(fila == -1) fila = 0;
//       grid.current.instance.focus(grid.current.instance.getCellElement(fila,column));
//     },10);
//   }
//   return (
//     <div className="paper-container">
//       <Paper className="paper-style">
//         <ModalDialogo
//           positiveButton={""}
//           negativeButton={"OK"}
//           negativeAction={handleCancel}
//           onClose={handleCancel}
//           setShow={visibleMensaje}
//           title={tituloModal}
//           imagen={imagen}
//           mensaje={mensaje}
//         />
//         <FormModalSearch 
//             showsModal={showsModal}
//             setShows={shows}
//             title={modalTitle}
//                 componentData={
//                     <NewTableSearch
//                       onInteractiveSearch={onInteractiveSearch}
//                       searchData={searchData}
//                       columns={searchColumns}
//                       modalSetOnClick={modalSetOnClick}
//                       tipoDeBusqueda={tipoDeBusqueda}
//                       cancelarModal={cancelarModal}
//                     />
//                 }
//             descripcionClose =""
//             descripcionButton=""
//             actionAceptar    =""
//         />
//         <Spin spinning={activarSpiner} size="large" >
//             <div className="paper-header">
//                 <Title level={5} className="title-color">
//                     {title}
//                     <div>
//                         <Title level={4} style={{ float: 'right', marginTop: '-16px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</Title>
//                     </div>
//                 </Title>
//             </div>
//            <Search 
//               setDatosRows={setDatosRows}
//               datosRows={datosrows}
//               formName={FormName}
//               funcionCancelar={funcionCancelar}
//               modifico={modifico}
//               listFiltro={listFiltro}
//               headSeled={headSeled}
//               urlBuscador={props.urlBuscador}
//               columns={columns}
//               showModalDelete={deleteRows}
//               addRow={addRow}
//               guardar={funcionSaveChange}
//               grid={grid}
//             />
//               {!_.isUndefined(props.activateheadRadio) && !_.isUndefined(props.arraykeyRadio) && 
//                 !_.isUndefined(props.accionChange)     && !_.isUndefined(props.valueState)
//               ?              
//                 props.arraykeyRadio.length > 0 
//                 ? <div className="ArtCateDevExtreme">
//                     <Radio.Group onChange={props.accionChange} value={props.valueState} >
//                       <Radio className="labelArt_Categoria" value={'A'}>{props.arraykeyRadio[0].descripcion1}</Radio>
//                       <Radio className="labelArt_Categoria" value={'I'}>{props.arraykeyRadio[1].descripcion2}</Radio>
//                     </Radio.Group>
//                   </div>
//                 : null
//               : null
//               }
//               <DataGrid
//                 dataSource={_.isUndefined(datosrows) ? [] : datosrows.length > 0 ? datosrows : []}
//                 keyExpr="ID"
//                 showColumnLines={false}
//                 repaintChangesOnly={true}
//                 showRowLines={true}
//                 showBorders={false}
//                 rowAlternationEnabled={false}
//                 autoNavigateToFocusedRow={false}
//                 focusedRowEnabled={true}
//                 focuRowEnable
//                 allowColumnReordering={true}
//                 focusRowEnabled={true}
//                 ref={grid}
//                 onFocusedRowChanged={onFocusedRowChanged}
//                 onFocusedRowChanging={onFocusedRowChanging}
//                 onFocusedCellChanging={onFocusedCellChanging}
//                 onRowUpdating={onRowUpdating}
//                 onKeyDown={onKeyDown}
//                 height={props.height}
//                 onCellClick={onCellClick}
//                 onEditorPreparing={onEditorPreparing}                
//                 //----------------------------
//                 allowColumnResizing={false}
//                 errorRowEnabled={true}
//               >
//               <Sorting mode="single" />
//               <KeyboardNavigation
//                 editOnKeyPress={true}
//                 enterKeyAction= 'moveFocus'
//                 enterKeyDirection='row'
//                 onEnterKey/>
//               <Paging enabled={false} />
//               <Editing  mode="cell"
//                         allowUpdating={true}
//                         allowAdding={false}
//                         confirmDelete={false}
//                         selectTextOnEditStart="click"
//               />
//               {columns.map((column) => (
//                   ( ( column.checkbox && (column.checkBoxOptions !== undefined && Object.entries(column.checkBoxOptions).length > 0 ))  ||
//                     ( column.isOpcionSelect ) || ( column.isdate ) || (column.format === 'number') )
//                   ? 
//                     column.isOpcionSelect
//                     ?
//                       <Column
//                         dataField        = {column.ID         }
//                         key              = {column.ID         }
//                         caption          = {column.label      }
//                         width            = {column.width      } 
//                         minWidth         = {column.minWidth   }
//                         maxWidth         = {column.maxWidth   }
//                         allowEditing     = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
//                         allowSorting     = {!opcionComparar(column.ID, props.notOrderByAccion)}
//                         headerCellRender = { (e)=>renderHeader(e,column)}
//                       >
//                         <Lookup
//                           dataSource={optionSelect[column.ID]}
//                           valueExpr="ID"
//                           displayExpr="NAME"/>

//                       </Column>
//                     : column.checkbox 
//                     ?
//                       <Column 
//                         dataType           = {"boolean"         } 
//                         dataField          = {column.ID         }
//                         width              = {column.width      } 
//                         minWidth           = {column.minWidth   }
//                         maxWidth           = {column.maxWidth   }
//                         alignment          = {column.align      }
//                         allowEditing       = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
//                         key                = {column.ID         }
//                         caption            = {column.label      }
//                         setCellValue       = {(newData, value, columnData)=>setCellValue(newData, value, columnData, column)}
//                         headerCellRender   = {(e)=>renderHeader(e,column)}
//                         allowSorting       = {!opcionComparar(column.ID, props.notOrderByAccion)}
//                         calculateCellValue = {(e)=>opcionComparar(e[column.ID], column.checkBoxOptions[0])}
//                       > 
//                     </Column>
//                       : column.isdate 
//                       ?                     
//                         <Column 
//                           dataType         = "date"
//                           dataField        = {column.ID        }
//                           key              = {column.ID        }
//                           allowEditing     = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
//                           caption          = {column.label     }
//                           width            = {column.width     } 
//                           minWidth         = {column.minWidth  }
//                           maxWidth         = {column.maxWidth  }
//                           alignment        = {column.align     }
//                           format           = {"dd/MM/yyyy"     }
//                           editorOptions    = {{ useMaskBehavior:true, showClearButton:true,}}
//                           allowSorting      = {!opcionComparar(column.ID, props.notOrderByAccion)}
//                           headerCellRender = {(e)=>renderHeader(e,column)}
//                           >
//                         </Column>
//                       : column.format === 'number' 
//                       ?
//                       <Column 
//                         dataType         = {"number"         }
//                         dataField        = {column.ID        }
//                         key              = {column.ID        }
//                         width            = {column.width     } 
//                         minWidth         = {column.minWidth  }
//                         maxWidth         = {column.maxWidth  }
//                         alignment        = {column.align     }
//                         allowEditing     = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
//                         editorOptions    = {{showClearButton:false}}
//                         caption          = {column.label     }
//                         precision        = "2"
//                         format           = {"#,##0"}
//                         allowSorting      = {!opcionComparar(column.ID, props.notOrderByAccion)}
//                         headerCellRender = {(e)=>renderHeader(e,column)}
//                       > 
//                     </Column>
//                       : null
//                     : 
//                     <Column 
//                       dataField         = {column.ID          }
//                       key               = {column.ID          }
//                       caption           = {column.label       }
//                       dataType          = {column.isnumber ? 'number' :  null} 
//                       allowEditing      = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
//                       width             = {column.width       } 
//                       minWidth          = {column.minWidth    }
//                       maxWidth          = {column.maxWidth    }
//                       alignment         = {column.align       }
//                       allowSorting      = {!opcionComparar(column.ID, props.notOrderByAccion)}
//                       headerCellRender  = {(e)=>renderHeader(e,column)}
//                     > 
//                   </Column>
//                 ))}
//                 <LoadPanel enabled={false} showPane={false} visible={false} showIndicator={false} />
//                 <Paging defaultPageSize={sizePagination} />
//                 <Pager
//                   visible={true}
//                   allowedPageSizes={false}
//                   displayMode={'full'}
//                   showPageSizeSelector={true}
//                   showInfo={true}
//                   showNavigationButtons={true} />
//             </DataGrid>
//           </Spin>  
//       </Paper>
// 	  </div>
//   );
// })
// export default DevExpressList;