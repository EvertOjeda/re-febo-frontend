import React, { memo,useEffect,useState }  from "react";
import { v4 as uuidID } from "uuid";
import _                from "underscore";
import  Paper 					from '@material-ui/core/Paper';
import Button           from "@material-ui/core/Button";
import styles           from "./Styles";
import Main             from "../Main";
import ArrayStore       from 'devextreme/data/array_store';
import {validateSave}   from './Search'
import { BiSearchAlt } 	from "react-icons/bi";
import {setComponenteEliminar,
        setTipoDeOperacion   ,
        getTipoDeOperaciones ,
        getFocusGlobalEvent } from './DevExtremeCab';
import DataGrid, { Column, Editing , Paging ,LoadPanel,
      Lookup, KeyboardNavigation, Sorting,Scrolling,Pager,SearchPanel} from "devextreme-react/data-grid";
import $ from 'jquery';
import { modifico } from "./ButtonCancelar";
// import { add } from "ol/coordinate";
import { getPermisos } from '../../utils/ObtenerPermisosEspeciales';
import './styles.css';

var getHabilitar = false;
export const setHabilitarDet = (valor) => {
  getHabilitar = valor;
};
export const getHabilitarDet = () => {
  return getHabilitar;
};
var focusGlobalEvent;
const setFocusGlobalEventDet = (valor) => {
    focusGlobalEvent = valor;
};
export const getFocusGlobalEventDet = () => {
    return focusGlobalEvent;
};
var focusGlobalEventAux;
const setFocusGlobalEventAux = (valor) => {
  focusGlobalEventAux = valor;
};
export const getFocusGlobalEventDetAux = () => {
    return focusGlobalEventAux;
};
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
var focusedRowIndex = 0; 
const setFocusedRowIndex = (valor)=>{
    focusedRowIndex = valor;
}
export const getFocusedRowIndex = ()=>{
  return focusedRowIndex;
}
var focusedColumnNameActual
const setFocusedColumnNameActual = (valor)=>{
  focusedColumnNameActual = valor;
}
export const getFocusedColumnNameActual = ()=>{
  return focusedColumnNameActual;
}
var focusedColumnName
const setFocusedColumnName = (valor)=>{
  focusedColumnName = valor;
}
export const getFocusedColumnName = ()=>{
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
var bloqueoCabecera = false
export const setBloqueoCabecera = (valor)=>{
  bloqueoCabecera = valor
};
export const getBloqueoCabecera = ()=>{
  return bloqueoCabecera;
};
var bloqueButtonGuardar = false
export const setBloqueButtonGuardar = (valor)=>{
  bloqueButtonGuardar = valor
};
export const getBloqueButtonGuardar = ()=>{
  return bloqueButtonGuardar;
};
var bloqueo = [];
export const removeIdComponentUpdate = (id)=>{
  bloqueo = []
};
export const setIdComponentUpdate = (id)=>{
  if( bloqueo[0] != undefined){
    bloqueo[0][id] = true
  }else{
    bloqueo.push({
      [id]:true,
    })
  }
  
};
export const getIdComponentUpdate = ()=>{
  return bloqueo;
};
export var deleteDisable        = false
export const getDeleteDisable = () =>{
  return deleteDisable;
}
var eventValuesCheckbox
const setEventValuesCheckbox = (e)=>{
  eventValuesCheckbox = e;
};
const getEventValuesCheckbox = ()=>{
  return eventValuesCheckbox
}
var bandBloqueoGrid = true
export const setbandBloqueoGrid = (e)=> {
  bandBloqueoGrid = e
}
export const getbandBloqueoGrid = ()=> {
  return bandBloqueoGrid
}
export var globalValidateDet       = true;
export const setGlobalValidateDet = (e)=>{
  globalValidateDet = e;
}
var componenteEliminar = true;
export const setComponenteEliminarDet = (e)=>{
  componenteEliminar = e;
};
export const getComponenteEliminarDet = ()=>{
  return componenteEliminar;
}

var insert   = false
var update   = false

export const getTipoDeOperacionesDet = ()=>{
  return [insert,update]
}
export const getEstablecerOperacionesDet = ()=>{
  insert = false, update= false;
}
export var ArrayPushHedSeled    = []
export const setArrayHedSeled = (e) =>{
  var valor = document.querySelectorAll("#iconoLupa")
 setTimeout(()=>{
  if(valor?.length > 1){
    valor.forEach(element => {
      let nombre    = element.attributes[0].value
      let iconohead = document.getElementsByName(nombre);
      iconohead[0].style.visibility = 'collapse'
    });
  }
  var resul = document.getElementsByName(e)
  if(resul?.length){
    resul[0].style.visibility = 'visible';
  }
 },66);
  ArrayPushHedSeled = [];
  ArrayPushHedSeled.push(e);
}

var columnIndex = 0; 
const setColumnIndex = (valor)=>{
  columnIndex = valor;
}
const getColumnIndex = ()=>{
  return columnIndex;
}

var rowIndex = 0; 
const setRowIndex = (valor)=>{
  rowIndex = valor;
}
export const getRowIndex = ()=>{
  return rowIndex;
}

var valorAnteriorEnter   = ""; 
var valorActualEnter     = ""; 
var ArrayDependenciaGlobal = new Array
var rowDet = []
var setEditarModalNew  = false;
var banderaAddTabEnter = ''
export var ArrayDetecteComponent = [];
export const limpiarArrayDetecteComponent = ()=>{
  ArrayDetecteComponent = []
}
var columnRequerido   = []
var columnEditDisable = []
export const setColumnRequerido = async(column)=>{
  columnEditDisable = []
  columnRequerido   = []
    var arrayInsert = await _.flatten(_.filter(column, function(item){
      if(item.requerido) columnRequerido.push(item);
      if(item.editModal === false || item.editModal === true || item.Pk === true) return item;
    }));
  columnEditDisable = await arrayInsert
}

var activarBandF9 = false;
var addRowBand    = false;

var bandera       = true;
var spinnerband   = false;

const DevExtremeDet = memo(({ gridDet   , initialRow         , notOrderByAccion     ,
                              FormName  , columnModal        , setUpdateValue       ,
                              id        , setRowFocusDet     , optionSelect         ,
                              columnDet , guardar            , newAddRow            ,
                              canDelete , activateF10        , activateF6           , 
                              maxFocus                       , altura               ,
                              datos_disable_edit             , permisos_especiales  ,
                              setActivarSpinner              , operacion            ,
                              setCellChanging                , setFocusedCellChanged,
                              doNotsearch                    , columBuscador        ,
                              setFocusedRowChanged           , dataCabecera         ,
                              ScrollingMode                  , smallHead            ,
                              funcionNuevo                   , page                 ,
                              heightHeaderClass              , buscadorGrid         ,
                              cellRender                     , nextFocusNew         ,
                            }) => {
    
    const PermisoEspecial = getPermisos(FormName);
    const classes = styles();
    //--------------------------   State  ----------------------------------------------
    const [tipoDeBusqueda  , setTipoDeBusqueda   ] = useState();
    const [stockEntrer     , setStockEntrer        ]  = useState('row')


    //---------------------------Estado Modal-------------------------------------------
    const [shows            , setShows              ] = useState(false);
    const [modalTitle       , setModalTitle         ] = useState();
    const [searchColumns    , setSearchColumns      ] = useState();
    const [searchData       , setSearchData         ] = useState({});
    const [headSeled        , setheadSeled          ] = useState([columBuscador]);
    //---------------------------Estado Modal mensaje ----------------------------------
    const [visibleMensaje   , setVisibleMensaje     ] = useState(false);
    const [mensaje          , setMensaje            ] = useState();
    const [imagen           , setImagen             ] = useState();
    const [tituloModal      , setTituloModal        ] = useState();

    useEffect(()=>{      
      // columnEditDisable = []
      // columnRequerido   = []
    
      _.flatten(_.filter(columnDet, function(item){
        if(item.requerido){
          item.IDCOMPONENTE = id
          columnRequerido.push(item)
        };
        if(item.editModal === false || item.editModal === true || item.Pk === true)  columnEditDisable.push(item);
      }));
      // columnEditDisable    = arrayInsert
      deleteDisable        = canDelete === false ? true : false
      ArrayPushHedSeled.push(columBuscador);

      // restauramos por defecto las variables globales para que no afecte a los demas formulario
      setHabilitarDet(false)
      setbandBloqueoGrid(true)
    },[]);
    const establecerFocus = (fila,column,params)=>{
      setTimeout( ()=>{
        if(params){
          gridDet.current.instance.focus(gridDet.current.instance.getCellElement(fila,column));
        }else{
          gridDet.current.instance.focus(gridDet.current.instance.getCellElement(0,0));
        }
      },200);
    }
    const selectedHead = async (e,idHead) => {
      e.stopPropagation()
      var iconohead = await document.getElementsByName(idHead);
      var exists    = await headSeled.includes(idHead);

      if(exists){
        iconohead[0].style.visibility = 'collapse'
        const indice = headSeled.indexOf(idHead)
        headSeled.splice(indice, 1);
        ArrayPushHedSeled.splice(indice, 1)
      }else{
        setheadSeled(await headSeled.concat(idHead));
        document.getElementsByName(idHead)[0].style.visibility = 'visible';
        ArrayPushHedSeled = headSeled.concat(idHead)
      }
    }
    //en caso de que cuente con buscador 
    const renderHeaderAux = (e,column) => {
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
                <i name={column.ID} id="iconoLupa" className={classes.auxIconHead}>
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
    const renderHeader = (e,column) => {
      return (
        <>
        { opcionComparar(column.ID)
          ? 
            <div  id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid_det" : "horizontalDatagrid"}
                  key={column.ID}
              >
              {column.label}
            </div>
          :
            <Button   
                  key={column.ID}
                  id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid_det" : null}
                  className={ smallHead ? classes.selectHeaderAux : classes.selectHeader}
                  disabled={true}
                  >
                {column.label}
          </Button>
        }
        </>
      );
    }
    const onFocusedRowChanged = async(e)=>{
      if(setFocusedRowChanged)setFocusedRowChanged(e);

      if(e.row != undefined){
        setComponenteEliminar({"id":e.row.data.IDCOMPONENTE,"delete":canDelete == false ? false : true })
        setComponenteEliminarDet({"id":e.row.data.IDCOMPONENTE,"delete":canDelete == false ? false : true })
      }
      setFocusGlobalEventDet(await e);
      if(setRowFocusDet) setRowFocusDet(e)
    }
    const onFocusedCellChanging = async(e) =>{
      
      var fila = e.prevRowIndex == -1 ? 0 : e.prevRowIndex
      if(setCellChanging)setCellChanging(e.rows[fila])
      if(e.rows[fila]){
        setComponenteEliminar({"id":e.rows[fila].data.IDCOMPONENTE,"delete":canDelete == false ? false : true })
        setComponenteEliminarDet({"id":e.rows[fila].data.IDCOMPONENTE,"delete":canDelete == false ? false : true })
      }

      if(e.event){
        var columnLength    = columnDet.length - 1;
        var prevColumnIndex = e.prevColumnIndex;
        
        if(columnLength == prevColumnIndex){
          if ((e.event.key === "Enter" || e.event.key === "Tab") && nextFocusNew) {
              e.cancel = true;
              setTimeout(()=>{
                document.getElementById(nextFocusNew).focus();
              },50);
              return
          }
       }
      }

      setFocusGlobalEventAux(e);
      setEventValuesCheckbox(e);
      setFocusedColumnName(e.columns[e.newColumnIndex].dataField);      
      setFocusedColumnNameActual(e);

      setFocusedColumnIndex(e.prevRowIndex);
      setFocusedRowIndex(e.prevRowIndex);

      setColumnIndex(e.newColumnIndex);
      setRowIndex(e.newRowIndex);

      let permisoEdit     = await Main.VerificaPermiso(FormName)
      var dataColumn      = getFocusedColumnName();
      
      if(columnEditDisable.length > 0){
        for (let i = 0; i < columnEditDisable.length; i++) {
          const items = columnEditDisable[i];
          if(!getbandBloqueoGrid()){
            e.columns[e.newColumnIndex].allowEditing = false
            setEditarModalNew = false;
          }else{
            if(e.rows[e.newRowIndex]){
              if(items.ID === dataColumn && permisoEdit[0].actualizar == 'S' && e.rows[e.newRowIndex].data.inserted){
                setEditarModalNew = true;
                e.columns[e.newColumnIndex].allowEditing = true
                break;
              }
            }

            if(items.ID === dataColumn && permisoEdit[0].actualizar == 'S' && items.editModal == true){
              e.columns[e.newColumnIndex].allowEditing = true          
              setEditarModalNew = true
            }
            if(items.ID === dataColumn && permisoEdit[0].actualizar == 'S' && items.editModal == false){
              e.columns[e.newColumnIndex].allowEditing = false
              setEditarModalNew = false
            }
            
            if(items.ID === dataColumn && permisoEdit[0].actualizar == 'S' && items.Pk){
              e.columns[e.newColumnIndex].allowEditing = false
              setEditarModalNew = false
            }
          }
          
        }
      }
      
      if(permisos_especiales){
        if(datos_disable_edit){
          for (let index = 0; index < datos_disable_edit.length; index++) {
            const items = datos_disable_edit[index];
            if(items == e.columns[e.newColumnIndex].dataField && !_.contains(PermisoEspecial,permisos_especiales[0])){
              if(e.rows[0].data){
                if(e.rows[e.newRowIndex].data.InsertDefault || e.rows[e.newRowIndex].data.inserted) e.columns[e.newColumnIndex].allowEditing = true;
                else e.columns[e.newColumnIndex].allowEditing = false;
                break
              }else{
                if(_.contains(PermisoEspecial,permisos_especiales[0])) e.columns[e.newColumnIndex].allowEditing = true;
                else e.columns[e.newColumnIndex].allowEditing = false;
                break
              }
            }
          }
        }
      }
      if(e.event){
        if(maxFocus){
          if(e.event.code == "ArrowRight" && e.columns[e.prevColumnIndex].name === maxFocus[0].hasta){
            let rowindex = e.prevColumnIndex == - 1 ? 0 : e.prevColumnIndex
            e.cancel = true
            gridDet.current.instance.focus(gridDet.current.instance.getCellElement(e.prevRowIndex,rowindex))
          }
        }
        
        let rowNew  = true;
        if(newAddRow === false || _.isUndefined(!newAddRow)) rowNew = false
        if(permisos_especiales)if(_.contains(PermisoEspecial,permisos_especiales[0])) rowNew = true;
        
        if(e.event.key === "ArrowDown"){
          let count      = gridDet.current.instance.getDataSource()._items;
          let totalRows  = count.length - 1;
          if(totalRows === fila && rowNew && getbandBloqueoGrid()){
            var Addband = false
            var columnaRequerido = ''
            if(columnRequerido.length){
              for (let index = 0; index < columnRequerido.length; index++) {
                  const element = columnRequerido[index];
                  if(e.rows[e.newRowIndex].data[element.ID]){
                    if(e.rows[e.newRowIndex].data[element.ID] === ''){
                      Addband  = true;
                      columnaRequerido = {'label':element.label,'ID':element.ID}
                      break
                    }
                  }else{
                    Addband  = true;
                    columnaRequerido = {'label':element.label,'ID':element.ID}
                    break
                  }
              }
            }
            if(!Addband){
              banderaAddTabEnter = 0
              addRow();
            }else{
              setTimeout(()=>
                gridDet.current.instance.focus(gridDet.current.instance.getCellElement(e.newRowIndex,columnaRequerido.ID)),50
              )
            }
          }
        }
        
        // console.log(bandAgregar)

        if ((e.event.key === "Enter" || e.event.key === "tab") && !e.event.shiftKey) {
          e.event.preventDefault()
          var Addband = false;
          var columnaRequerido = ''

          if(columnRequerido.length){
            for (let index = 0; index < columnRequerido.length; index++) {
              const element = columnRequerido[index];

              if(element.IDCOMPONENTE == id){

                if(e.rows[e.newRowIndex].data[element.ID]){
                  if(e.rows[e.newRowIndex].data[element.ID] === ''){
                    Addband  = true;
                    columnaRequerido = {'label':element.label,'ID':element.ID}
                    break
                  }
                }else if(element.IDCOMPONENTE == id){
                  Addband  = true;
                  columnaRequerido = {'label':element.label,'ID':element.ID}
                  break
                }
              }
            }
          }

          let rowNew  = true;
          if(newAddRow === false || _.isUndefined(!newAddRow)) rowNew = false
          if(permisos_especiales)if(_.contains(PermisoEspecial,permisos_especiales[0])) rowNew = true;

          rowDet              = gridDet.current.instance.getDataSource();
          var columnLength    = columnDet.length;
          var rowIndex        = e.newRowIndex;
          var columnIndex     = e.newColumnIndex;
          var prevColumnIndex = e.prevColumnIndex;
          if (
            rowDet._items.length - 1 === rowIndex        &&
            columnLength         - 1 === columnIndex     &&
            columnLength         - 1 === prevColumnIndex &&
            rowNew                                       &&
            getbandBloqueoGrid()
          ) {
            
            let addNewRowAux = newAddRow
            if(_.isUndefined(addNewRowAux)) addNewRowAux = true
            if(permisos_especiales)if(_.contains(PermisoEspecial,permisos_especiales[0])) addNewRowAux = true;      
            
            if(Addband && addNewRowAux && getbandBloqueoGrid()){ 
              gridDet.current.instance.option("focusedRowKey", 120);
              gridDet.current.instance.clearSelection();
              e.event.preventDefault();        
              banderaAddTabEnter = 0
              setTimeout(()=>{
                gridDet.current.instance.focus(gridDet.current.instance.getCellElement(e.newRowIndex,columnaRequerido.ID)),100
              })
              return
            }

            addRow();
          }
        }
      }
    }
    const addRow = async() => {
        setTipoDeOperacion('insert',true) 
        var rowIndex = 0
        rowDet       = gridDet.current.instance.getDataSource();        
        modifico();
        if(!getBloqueoCabecera())setBloqueoCabecera(true)

        if(rowDet) rowIndex = rowDet._items.length
        else rowIndex = 0;
        
        var newKey = uuidID();
        var row    = [0]
        row = [{
          ...row[0],
          ID          : newKey,
          inserted    : true,
          IDCOMPONENTE:id,
          COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
          COD_USUARIO: sessionStorage.getItem('cod_usuario'),
          idCabecera : rowDet._items[0].idCabecera
        }];
        
        if( !_.isUndefined(initialRow) ){
          if(initialRow.length > 0){
            for (let i = 0; i < initialRow.length; i++) {
              const item    = initialRow[i];
              row[0][Object.keys(item)[0]] = rowDet._items[0][Object.keys(item)[0]];
            }
          }
        }

        columnDet.forEach(async element => {
          if(element.isdate)    row[0][element.ID] = Main.moment();
          if(element.checkbox)  row[0][element.ID] = element.checkBoxOptions[1];  
          if(element.isOpcionSelect){
          _.flatten(_.filter(optionSelect[element.ID], function(item){
            if (item.isNew) row[0][element.ID] = item.ID;
          }));
          } 
        });
        
        const dataSource = new ArrayStore({
          data: rowDet._items,
        });

        dataSource.push([{
          type: 'insert',
          ID  : row[0].ID,
          data: row[0],
        }]);

        gridDet.current.instance.option('loadPanel.enabled', false);  
        gridDet.current.instance.refresh();
        gridDet.current.instance.option('dataSource', dataSource);
       
        setTimeout(()=>{
          var grid = gridDet.current.instance.getDataSource();		  
          var filaIndex;
          if(grid) filaIndex = grid._items.length - 1
          gridDet.current.instance.focus(gridDet.current.instance.getCellElement(filaIndex,columnDet[0]["ID"]));
        },100);
    }
    const onRowUpdating  = async(value) =>{
      setTipoDeOperacion('update',true) 
      var columnNameEdit = Object.keys(value.newData);
      setNameRowsEnter(Object.keys(value.newData)[0])      
      if(setUpdateValue)setUpdateValue(value,'',false);
      setIdComponentUpdate(id);
      modifico();
      if(!getBloqueoCabecera())setBloqueoCabecera(true)


      console.log('Entro aquiii',value.newData[columnNameEdit[0]]);

      valorAnteriorEnter  = value.oldData[columnNameEdit[0]];
      valorActualEnter    = value.newData[columnNameEdit[0]];

      if(!ArrayDetecteComponent[id]){
        ArrayDetecteComponent[id] = _.union(ArrayDetecteComponent[id],[{'update':true}]);
      }

      var rowsColumn = columnDet.filter(item => item.ID == columnNameEdit[0]);
      if(rowsColumn[0]){
        if(rowsColumn[0].upper){
          value.newData[columnNameEdit[0]] = value.newData[columnNameEdit[0]].toUpperCase();
        }
      }
      
      if(columnModal){
        if(columnModal[columnNameEdit[0]]){
          if(!activarBandF9){
            gridDet.current.instance.option("FocusedRowIndex", -1);
            setStockEntrer('none')
            await funcionValidacion(columnNameEdit[0], value.newData[columnNameEdit[0]], value);
          }else{
            activarBandF9 = false
          }
        }else if(columnModal.urlValidar[0][columnNameEdit]){
          if(!activarBandF9){
            await funcionValidacion(columnNameEdit[0], value.newData[columnNameEdit[0]], value);
          }else{
            activarBandF9 = false
          }
        }
      }      

      if(operacion){
        if(operacion.valor1 === columnNameEdit[0] || operacion.valor2 == columnNameEdit[0]){
          switch (operacion.operac) {
            case 'multiplicacion':
              var valor1,valor2
              
              if(columnNameEdit[0] === operacion.valor1){
                valor1 = value.newData[columnNameEdit[0]];  
              }else{
                valor1 = value.oldData[operacion.valor1];
              }
              
              if(columnNameEdit[0] === operacion.valor2){
                valor2 = value.newData[columnNameEdit[0]];
              }else{
                valor2 = value.oldData[operacion.valor2];
              } 
              
              if(valor2){
                var rowIndex   = gridDet.current.instance.getRowIndexByKey(value.key); 
                var comunIndex = gridDet.current.instance.getCellElement(rowIndex,operacion.resultado);

                value.component.cellValue(rowIndex,comunIndex?.cellIndex, valor1 * valor2)
                // value.component.saveEditData()
                // value.oldData[operacion.resultado] = await valor1 * valor2
              } 
              break;
            default:
              break;
          }  
        }
      }

      if(globalValidateDet){
        globalValidateDet = true;
        if(value.oldData.InsertDefault){
          value.oldData.inserted = true;
          value.oldData.InsertDefault = false;
        }else if(!value.oldData.inserted) value.oldData.updated = true;
        
      }else{
        value.cancel   = false
        var filas      = gridDet.current.instance.getRowIndexByKey(value.key); 
        var indexComun = gridDet.current.instance.getCellElement(filas,columnNameEdit[0]);
        setRowColumnErrorModaF9(filas, indexComun?.cellIndex);
        value.component.cancelEditData();
      }
    }
    const funcionValidacion = async (nameColumn, value, rowsData)=>{
      var ArrayDataDependencia = await validarDependencia(13);
      if( ArrayDataDependencia == true){ globalValidateDet = false; return}
  
      var valor_actual   = await value;
      rowsData.component.navigateToRow(rowsData.key)
      
      if(valorAnteriorEnter !== valor_actual || globalValidateDet == false){      
        var valor       = value
        if(!_.isNumber(valor) && !_.isNull(valor) && !_.isNaN(valor) && !_.isUndefined(valor) ) valor = await value.trim();
        var url         = columnModal.urlValidar[0][nameColumn];
        var indexRows   = rowsData.component.getRowIndexByKey(rowsData.key)
        if(indexRows == -1) indexRows = 0
        var columnhead  = getFocusGlobalEventDet();

        try{
        var method = 'POST'        
        var data   = {'valor':valor,'cod_empresa':sessionStorage.getItem('cod_empresa'),dependencia:ArrayDataDependencia};
        await Main.Request( url, method, data)
        .then(async response => {				
          
          if(response.status == 200 ){
            if(response.data.outBinds.ret == 1){
              
              if(getBloqueButtonGuardar())setBloqueButtonGuardar(false)

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

              if(Object.keys(columnModal.config).length !== 0 ){
                if(columnModal.config[nameColumn].dependencia_de.length > 0){
                  await columnDependencia(rowsData,columnModal.config[nameColumn].dependencia_de,nameColumn,true);
                }
              }
              
              let indexComun = gridDet.current.instance.getCellElement(indexRows,nameColumn);
              var columna    = indexComun.cellIndex + 1;
              if(columnhead.row.cells[columna] && columnModal[nameColumn]){
                if(columnhead.row.cells[columna].column.name === columnModal[nameColumn][1].ID){
                  columna = columna + 1;
                  }
              }
              if(!maxFocus){
                if(rowsData.component.getVisibleColumns().length == columna){
                  if(rowsData.component.getVisibleRows().length == indexRows + 1){
                    let newAdd = newaddRow == undefined ? true : newAddRow
                    if(newAdd && getbandBloqueoGrid()){
                      if(!addRowBand)addRow('funcionValidacion');
                      else addRowBand = false
                    }
                  }
                }else{
                  gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRows,columna));
                }
              }else{
                var e  = getFocusGlobalEventDetAux();
                if(maxFocus[0].id === id && e.component.getVisibleColumns().length === columna){
                  if(e.prevRowIndex == -1) e.prevRowIndex = 0
                  if(e.component.getVisibleRows().length == e.prevRowIndex + 1){
                    gridDet.current.instance.option("focusedRowKey", 120);
                    addRow('funcionValidacion');
                  }else{
                    gridDet.current.instance.focus(gridDet.current.instance.getCellElement(e.newRowIndex,0));
                  }
                }
              }                
              setStockEntrer('row')
              globalValidateDet = true;
            }else{              
              
              globalValidateDet = false;
              rowsData.component.saveEditData();
              gridDet.current.instance.option("focusedRowKey", 120);
              gridDet.current.instance.clearSelection();
              gridDet.current.instance.focus(0);

              if(!getBloqueButtonGuardar())setBloqueButtonGuardar(true)
              showModalMensaje('Atención!','alerta',response.data.outBinds.p_mensaje);
            }
          }
        });
        } catch (error) {
          console.log("Error en funcionValidacio",error);
        }
      }else{
        setStockEntrer('row')
      }
    }
    const validarDependencia = async (key)=>{
      var ArrayDataDependencia = new Array();
      var nameData             = await getFocusedColumnName();
      if(key == 13) nameData   = getNameRowsEnter();  
      var info                 = await getFocusGlobalEventDet().row.data;

      if((Object.keys(columnModal.config).length == 0) || !columnModal.config[nameData]){
        return [];
      }
      if(columnModal.config[nameData]?.depende_ex_cab !== undefined){
        for (let i = 0; i < columnModal.config[nameData].depende_ex_cab.length; i++){
          const items  = columnModal.config[nameData].depende_ex_cab[i];
          var dataName = items.id
            if(dataCabecera[dataName] == ""){
              setTimeout(()=>{
                Main.message.info({
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
                var data = {[dataName]:dataCabecera[dataName]}
                ArrayDataDependencia.push(data);
                ArrayDependenciaGlobal = ArrayDataDependencia;
            }
        }
      }
      if(columnModal.config[nameData].depende_de.length > 0){
  
        for (let i = 0; i < columnModal.config[nameData].depende_de.length; i++){
          const items  = columnModal.config[nameData].depende_de[i];
          var dataName = items.id
            if(info[dataName] == ""){
              setTimeout(()=>{
                Main.message.info({
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
      var rowsData    =  getFocusGlobalEventDet()
        dependencia.forEach(async items => {
          var key               = items.id
          var rowDelete         = columnModal[key];
          if(key !== busquedaPor && (enter)){
            if(rowDelete){
              rows.oldData[rowDelete[0].ID] = "";
              rows.oldData[rowDelete[1].ID] = "";
            }else{
              rows.oldData[key] = "";
            }
            fila = gridDet.current.instance.getRowIndexByKey(rows.oldData.ID)
          }else{
            if(rowDelete){
              rows[rowDelete[0].ID] = "";
              rows[rowDelete[1].ID] = "";
            }else{
              rows[key] = "";
            }
            // rows[rowDelete[0].ID] = ""
            // rows[rowDelete[1].ID] = ""
            fila = gridDet.current.instance.getRowIndexByKey(rows.ID)
          }
        });
        await gridDet.current.instance.saveEditData();
        await rowsData.component.repaintRows([fila]);
        await gridDet.current.instance.option(rows)
    }
    const handleCancel = async() => {
      setVisibleMensaje(false);
      setTimeout(async()=>{
          var column = getFocusedColumnIndex();
          var fila   = getFocusedRowIndex();
          if(fila == -1) fila = 0;
          if(!globalValidateDet){              
            fila   = await getRowColumnErrorModaF9()[0].fila;
            column = await getRowColumnErrorModaF9()[1].columna;
            gridDet.current.instance.focus(gridDet.current.instance.getCellElement(fila,column))
            await gridDet.current.instance?.editCell(fila, column);
            await gridDet.current.instance?.cellValue(fila, column,valorActualEnter);
            // gridDet.current.instance.saveEditData()
          }else{
            await gridDet.current.instance.focus(gridDet.current.instance.getCellElement(fila,column))
            await gridDet.current.instance.editCell(fila, column);
            // gridDet.current.instance.saveEditData()
          }        
       })
    };
    const showModalMensaje = (titulo,imagen, mensaje) => {
      setTituloModal(titulo);
      setImagen(imagen);
      setMensaje(mensaje);
      setVisibleMensaje(true);
    };
    const modalSetOnClick = async (datos, busquedaPor, datoskey) => {
      globalValidateDet = true; 
      rowDet            = gridDet.current.instance.getDataSource();
      await gridDet.current.instance.refresh(true);
      await gridDet.current.instance.cancelEditData();
      await gridDet.current.instance.saveEditData();

      if(!ArrayDetecteComponent[id]){
        ArrayDetecteComponent[id] = _.union(ArrayDetecteComponent[id],[{'update':true}]);
      }      

      if(datos !== "" || datos !== undefined){
        
        modifico()
        if(!getBloqueoCabecera())setBloqueoCabecera(true)
        if(getBloqueButtonGuardar())setBloqueButtonGuardar(false)
        var rows              = await getFocusGlobalEventDet().row.data;
        if(setUpdateValue)setUpdateValue('',getFocusGlobalEventDet(),true);

        var valor_anterior     = rows[busquedaPor];
        var valor_actual       = await datos[0];
        var codPropiedadColumn = await gridDet.current.instance.columnOption(busquedaPor)

        var desPropiedadColumn = await gridDet.current.instance.columnOption(columnModal[busquedaPor][1].ID)
        var indexRows          = await getFocusGlobalEventDet().rowIndex
        if(indexRows == -1 || indexRows == undefined) indexRows = 0;
        var indexColum         = codPropiedadColumn.visibleIndex;
        
          if(columnModal.config[busquedaPor]){
            if(columnModal.config[busquedaPor].dependencia_de.length > 0){
              columnDependencia(rows,columnModal.config[busquedaPor].dependencia_de,busquedaPor,false);
            }
          }
          if(columnModal.config[busquedaPor]){
            if(columnModal.config[busquedaPor].dependencia_de.length > 0){
              columnDependencia(rows,columnModal.config[busquedaPor].dependencia_de,busquedaPor,false);
            }
          }
          if(!desPropiedadColumn && datos.length > 2 ){
            var band = false
            for(var i in datoskey){
              if(!band){
                band = true;
                await gridDet.current.instance?.editCell(indexRows, indexColum);
                await gridDet.current.instance?.cellValue(indexRows, indexColum,datos[0]); 
              }else{
                if(i != 'ID'){
                  getFocusGlobalEventDet().row.data[i] = datoskey[i]
                }  
              }
            }
            await gridDet.current.instance.option(rows);
          }else if(!desPropiedadColumn){
            let key    = Object.keys(datoskey)[0];
            let auxKey = parseInt(key)

            if(_.isNaN(auxKey)){
              var ban = false
              var valor= ''
              for(var i in datoskey){
                if(i != 'ID'){
                  if(!ban){
                    ban = true;
                    valor = datoskey[i]
                    await gridDet.current.instance?.editCell(indexRows, indexColum);
                    await gridDet.current.instance?.cellValue(indexRows, indexColum,datoskey[i]);
                  }else{
                    getFocusGlobalEventDet().row.data[i] = datoskey[i]
                  }
                }
              }
            }else{
              for(var i in datoskey){
                  if(datoskey[i]!== 'ID'){
                    if(i == 0){
                      await gridDet.current.instance?.editCell(indexRows, indexColum);
                      await gridDet.current.instance?.cellValue(indexRows, indexColum, datos[i]);
                    }else{
                      getFocusGlobalEventDet().row.data[datoskey[i]] = datos[i]
                    }
                  }
                }
            }
          }else if(datos.length == 3){
            await gridDet.current.instance?.editCell(indexRows, indexColum);
            await gridDet.current.instance?.cellValue(indexRows, indexColum,datos[0]);
            getFocusGlobalEventDet().row.data[desPropiedadColumn.name] = await datos[1]
          }else{
            let key    = Object.keys(datoskey)[0];
            let auxKey = parseInt(key)

            if(_.isNaN(auxKey)){
              var ban = false
              var valor= ''
              for(var i in datoskey){
                if(i != 'ID'){
                  if(!ban){
                    ban = true;
                    valor = datoskey[i]
                    await gridDet.current.instance?.editCell(indexRows, indexColum);
                    await gridDet.current.instance?.cellValue(indexRows, indexColum,datoskey[i]);
                  }else{
                    getFocusGlobalEventDet().row.data[i] = datoskey[i]
                  }
                }
              }
            }else{
              var posicion = 0
              for(var i in datoskey){
                  if(datoskey[i]!= 'ID'){
                    if(i == 0){
                      await gridDet.current.instance?.editCell(indexRows, indexColum);
                      await gridDet.current.instance?.cellValue(indexRows, indexColum,datos[i]);
                    }else{
                      // getFocusGlobalEventDet().row.data[datoskey[i]] = datos[posicion]
                      var comunIndex = gridDet.current.instance.getCellElement(rowIndex,datoskey[i]);
                      gridDet.current.instance?.cellValue(indexRows, comunIndex.cellIndex ,datos[posicion])
                      posicion = posicion + 1;
                    }
                  }
                  await gridDet.current.instance?.editCell(indexRows, indexColum);
                }
            }
          }
          if(getFocusGlobalEventDet().row.data['InsertDefault']){
            getFocusGlobalEventDet().row.data['inserted']         = true;
            getFocusGlobalEventDet().row.data['InsertDefault']    = false; 
          }else if(!getFocusGlobalEventDet().row.data['inserted']) 
            getFocusGlobalEventDet().row.data['updated'] = true;

        showsModal(false);
        activarBandF9 = true;
        setStockEntrer('row')

        gridDet.current.instance.saveEditData();        
        establecerFocus(indexRows,indexColum,true);
        if(setRowFocusDet)setRowFocusDet(rows,id,true);
      }
    }    
    const showsModal = async (valor) => {
      setShows(valor);
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
    const getRowDataModal = async (url, tipo, data,dependencia)=>{
      let dataRows = []
      if(setActivarSpinner)setActivarSpinner(true)
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
        if(setActivarSpinner)setActivarSpinner(false)
        return dataRows;
      } catch (error) {
        if(setActivarSpinner)setActivarSpinner(false)
          console.log("Error en el metodo getRowDataModal ",error);
      }
    }
    const cambiaFocus = async(tipo,e) => {
      let indexColumn = await getColumnIndex(); 
      let indexRow;
    
      if(tipo == 'Abajo'){
        indexRow    = await getRowIndex() + 1;

        if(!_.isUndefined(page)){
          var rowsCount = e.component.getVisibleRows().length, 
            pageCount = e.component.pageCount(), 
            pageIndex = e.component.pageIndex(),
            key  = e.event && e.event.key,
            info = await getFocusGlobalEventDetAux();
            spinnerband = false

            if(key && info.newRowIndex === rowsCount -1) {
              spinnerband = true
              setActivarSpinner(true)
              if(info.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
                  info.newRowIndex = 0;
                  setRowIndex(info.newRowIndex);
                  await e.component.saveEditData();
                  e.component.pageIndex(pageIndex + 1).done(function() {
                  e.component.option('focusedRowIndex', 0);
                });
              }
            }
        }

        
      } 
      if(tipo == 'Arriba'){
        indexRow    = await getRowIndex() - 1;

        if(!_.isUndefined(page)){
          var rowsCount = e.component.getVisibleRows().length, 
          pageCount = e.component.pageCount(), 
          pageIndex = e.component.pageIndex(),
          key  = e.event && e.event.key,
          info = await getFocusGlobalEventDetAux();
          spinnerband = false

          if(info.newRowIndex === 0 && pageIndex > 0) {
              spinnerband = true
              setActivarSpinner(true)

              info.newRowIndex = rowsCount - 1;
              setRowIndex(info.newRowIndex);
              indexRow = info.newRowIndex;
              e.component.pageIndex(pageIndex - 1).done(function() {
              e.component.option('focusedRowIndex', rowsCount - 1);
            });
          }
        }  
      }
      if(indexRow == -1) indexRow = 0;
      if(indexColumn == -1) indexColumn = 0;
          
      gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRow,indexColumn));
    }
    const onKeyDown = async (e)=>{
      if(e.event.repeat){
        e.event.preventDefault();
        if(e.event.keyCode == 38){
          if(bandera){
            bandera = false;
            await cambiaFocus('Arriba',e);
            setTimeout( ()=>{
              bandera = true
              if(spinnerband)setActivarSpinner(false)
            }, 40 );
          }
        }else if(e.event.keyCode == 40){
          if(bandera){
            bandera = false;
            await cambiaFocus('Abajo',e);
            setTimeout( ()=>{
              bandera = true
              if(spinnerband)setActivarSpinner(false)
            }, 40 );
          }
        }
      }
      if(e.event.code == 'F7') e.event.preventDefault(); 
      if(e.event.code == 'Escape' && !globalValidateDet){
        setStockEntrer('row')
      }

      if(e.event.key == "Tab" ||e.event.key == "Enter"){
        if(!e.event.repeat){
          // bandAgregar = true

          let indexColumn   = await getColumnIndex();    
          let indexRow      = await getRowIndex(); 
          var visibleColumn = await gridDet.current.instance.getVisibleColumns()
          var visiblerow    = await gridDet.current.instance.getVisibleRows()
          if(visiblerow == undefined) visiblerow = []
          if(indexColumn == -1) indexColumn = await 0;
          if(indexRow    == -1) indexRow    = await 0;
          if(!globalValidateDet) return
          var columnaRequerido = ''
          var Addband  = false
          var AddRowban= newAddRow

          if(maxFocus){
            if(((visiblerow.length -1) == indexRow) && visibleColumn[indexColumn].name == maxFocus[0].hasta){
              // element.IDCOMPONENTE == id
              if(columnRequerido.length){
                for (let index = 0; index < columnRequerido.length; index++) {
                  const element = columnRequerido[index];

                  // identificamos los componentes para el buen funcionamiento
                  if(element.IDCOMPONENTE == id){

                    if(Addband) break  
                    for (let i = 0; i < visiblerow.length; i++) {
                      const row = visiblerow[i].data;
                      if(row[element.ID]){
                        if(row[element.ID] === ''){
                          Addband = true;
                          columnaRequerido = {'label':element.label,'ID':element.ID}
                          break
                        }
                      }else{
                        Addband  = true;
                        columnaRequerido = {'label':element.label,'ID':element.ID}
                        break
                      } 
                    }

                  }

                }
              }
            }
          }else{
            if(((visiblerow.length -1) == indexRow) && indexColumn== (visibleColumn.length -1)){
                if(columnRequerido.length){
                  for (let index = 0; index < columnRequerido.length; index++) {
                    const element = columnRequerido[index];

                    if(element.IDCOMPONENTE == id){

                      if(visiblerow[indexRow].data[element.ID]){
                        if(visiblerow[indexRow].data[element.ID] === ''){
                          Addband  = true;
                          columnaRequerido = {'label':element.label,'ID':element.ID}
                          // bandAgregar = false
                          break
                        }
                      }else if(element.IDCOMPONENTE == id){
                        Addband  = true;
                        // bandAgregar = false
                        columnaRequerido = {'label':element.label,'ID':element.ID}
                        break
                      }

                    }

                  }
                }
              }
          }

          
          let addNewRowAux = newAddRow
          if(_.isUndefined(addNewRowAux)) addNewRowAux = true
          if(permisos_especiales)if(_.contains(PermisoEspecial,permisos_especiales[0])) addNewRowAux = true;      
          if(Addband && addNewRowAux && getbandBloqueoGrid()){  
            gridDet.current.instance.option("focusedRowKey", 120);
            gridDet.current.instance.clearSelection();
            e.event.preventDefault();        
            banderaAddTabEnter = 0
            setTimeout(()=>{
              gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRow,columnaRequerido.ID)),100
            })
            return
          }

          if ((e.event.key === "Enter" || e.event.key == "Tab") && !e.event.shiftKey) {
            if(maxFocus){
              if(maxFocus[0].id === id && (visiblerow.length -1) == indexRow ){
                if(visibleColumn[indexColumn].name == maxFocus[0].hasta && (e.event.key == "Enter" || e.event.key == "Tab")){
                  if(maxFocus[0].newAddRow && getbandBloqueoGrid()){
                    if(!columnModal[maxFocus[0].hasta]){
                      e.event.preventDefault();
                      gridDet.current.instance.option("focusedRowKey", 120);
                      gridDet.current.instance.clearSelection();
                      AddRowban   = false
                      banderaAddTabEnter = 0
                      addRow();
                    }  else if(e.event.target.classList.value == "" || (e.event.key == "Tab" && e.event.target.classList.value == 'dx-texteditor-input')){                      
                      e.event.preventDefault();
                      gridDet.current.instance.option("focusedRowKey", 120);
                      gridDet.current.instance.clearSelection();
                      addRowBand = true
                      addRow();
                    }
                  }else{
                    setTimeout(()=>{		  
                        gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRow, indexColumn));
                    },10)
                  }
                }
              }else if(visibleColumn[indexColumn].name == maxFocus[0].hasta){
                if(!e.component.hasEditData()) indexRow = indexRow + 1
                setTimeout(()=>{
                  gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRow,0));
                },10)
              }
            } 
            // else if(e.event.key == "Enter" || e.event.key == "Tab"){

              // bandAgregar = true
              
              // let rowNew  = true;
              // if(AddRowban === false || _.isUndefined(!AddRowban)) rowNew = false
              // if(permisos_especiales)if(_.contains(PermisoEspecial,permisos_especiales[0])) rowNew = true;
              
              // let event        = getFocusGlobalEventDetAux();
              // var columnindex  = 0
              // if(event.newColumnIndex){
              //   columnindex = event.newColumnIndex == -1 ? 0 : event.newColumnIndex;
              // }else{
              //   let nameColumn      = await getFocusedColumnName()
              //   let focusIndexColum = gridDet.current.instance.getCellElement(indexRow,nameColumn);
              //   columnindex         =  focusIndexColum.cellIndex == -1 ? 0 : focusIndexColum.cellIndex;
              // }

              // console.log('indexRow',indexRow ,'  -  ','IndexColum',indexColumn)

              // console.log('Evento ',columnindex);

              // rowDet                 = gridDet.current.instance.getDataSource();
              // var columnLength       = columnDet.length;
              // var rowIndex           = indexRow;
              // var columnIndex        = indexColumn;
              
              // if(rowDet._items.length - 1 === rowIndex    &&
              //   columnLength          - 1 === indexColumn &&
              //   rowNew                                    &&
              //   getbandBloqueoGrid()
              //   ){
              //     e.event.preventDefault();
              //     gridDet.current.instance.option("focusedRowKey", 120);
              //     gridDet.current.instance.clearSelection();
              //     AddRowban   = false
              //     banderaAddTabEnter = 0
              //     addRow();
              // }
            // } 
          }

        }else{
          e.event.preventDefault()
        }
      }

      if(e.event.key == "F6"){
        e.event.preventDefault();
        if(activateF6){
          var infoPermiso = await Main.VerificaPermiso(FormName);
          var operaciones   = await getTipoDeOperaciones()
          var band = true;
          var mensaje = ''
          if(operaciones[0]){
            if(infoPermiso[0].insertar != 'S'){
              band = false;
              mensaje = 'No tienes permiso para insertar'
            }
          }
          if(band){
            console.log('entro en este apartado');
            if(funcionNuevo) funcionNuevo()
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

      if(e.event.key == "F10"){
        e.event.preventDefault();
        if(activateF10){
          var infoPermiso = await Main.VerificaPermiso(FormName);
          var operaciones   = await getTipoDeOperaciones()
          var band = true;
          var mensaje = ''
          if(operaciones[0]){
            if(infoPermiso[0].insertar != 'S'){
              band = false;
              mensaje = 'No tienes permiso para insertar'
            }
          }
          if(operaciones[1]){
            if(infoPermiso[0].actualizar !== 'S'){
              band = false;
              mensaje = 'No tienes permiso para actualizar'
            }
          }
          if(operaciones[2]){
            if(infoPermiso[0].borrar != 'S'){
              band = false;
              mensaje = 'No tienes permiso para eliminar'
            }
          }
          if(band){
            var fila = getFocusedRowIndex();
            if(fila == -1) fila = 0;
            await gridDet.current.instance.saveEditData();
            await gridDet.current.instance.repaintRows([fila])
            setActivarSpinner(true)
            setTimeout(async()=>{
              setActivarSpinner(false)
              // if(globalValidateDet) validateSave(guardar);
              validateSave(guardar)
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
      var columnDetalle = await gridDet.current.instance.columnOption(columnName);
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

          if(columnDetalle.cssClass == "grid-radio"){
            
            let cambioCellInput = document.getElementsByClassName("dx-state-focused");
            if(cambioCellInput.length === 0){
              gridDet.current.instance.cellValue(fila, columnDetalle.index,true);
            }else{             
              gridDet.current.instance.cellValue(fila, columnDetalle.index,true);
            }
            await gridDet.current.instance.saveEditData();

          }else{

            let cambioCellInput = document.getElementsByClassName("dx-state-focused");
            if(cambioCellInput.length === 0){
              var valorCheckbox = !rowsCheckbox.rows[fila].values[columnDetalle.index]
              gridDet.current.instance.cellValue(fila, columnDetalle.index,valorCheckbox);        
            }else if(cambioCellInput.length === 2){
              document.getElementsByClassName("dx-state-focused")[0].classList.remove("dx-state-focused")     
            }
            await gridDet.current.instance.saveEditData();
          }
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
    const setCellValue = React.useCallback(async(newData, value, columnRowData, column)=>{
      var newValue       = await value ? column.checkBoxOptions[0] : column.checkBoxOptions[1];
      newData[column.ID] = await newValue;
    },[]);
    const onEditorPreparing = async (e)=>{
      
      let columnNameEdit = e.name;
      var rowsColumn = columnDet.filter( item => item.ID == columnNameEdit);


      if(e.editorName === "dxNumberBox"){
        e.editorOptions.step = 0;  
      }
      // Pendiente // add min or max type number
      // if(e.parentType == 'dataRow' && e.dataType == 'number'){
      //   e.editorOptions.min = 0 
      // }

      if(rowsColumn.length > 0){
        if(rowsColumn[0].isnumber){
          e.editorOptions.min = 0
        }
        if(rowsColumn[0].upper){
          e.editorElement.classList = "uppercaseInputDatagrid";
        }
      }
      if(e.dataType === "boolean"){
        var className = $('.dx-cell-modified');
        if(className){
          $('.dx-cell-modified').removeClass("dx-cell-modified");
        }
      }
    }
    const onCellClick = async (e)=>{
       if(!globalValidateDet){
         e.event.preventDefault();
         return;
       }
       if(e.rowType !== "header"){ 
        if(e.column?.dataType){
          if(e.column.dataType == "boolean" && e.cellElement.className.includes('grid-radio')){
            let cambioCellInput = document.getElementsByClassName("dx-state-focused");
            if(cambioCellInput.length === 0){
              gridDet.current.instance.cellValue(e.rowIndex, e.cellElement.cellIndex,true);
            }else{             
              gridDet.current.instance.cellValue(e.rowIndex, e.cellElement.cellIndex,true);
            }
            await gridDet.current.instance.saveEditData();
          }
        }

        if(e.row !== undefined){
          setComponenteEliminar({'id':e.row.data.IDCOMPONENTE,'delete':canDelete === false ? false : true});
          setComponenteEliminarDet({'id':e.row.data.IDCOMPONENTE,'delete':canDelete === false ? false : true})
         
          if(e.columnIndex){
            setFocusedColumnIndex(e.columnIndex)
            setColumnIndex(e.columnIndex)
          } 
          if(e.rowIndex){
            setFocusedRowIndex(e.rowIndex)
            setRowIndex(e.rowIndex)
            if(e.rowIndex == -1){
              setFocusedRowIndex(0)
              setRowIndex(0)
            } 
          }

        } 

        if(e.column){
          var row = await getFocusGlobalEventDet()
          setTimeout(()=>{
            let fila    = row.rowIndex;
            let columna = e.columnIndex;
            if(fila === '-1') fila = 0;
            if(maxFocus){
              if(maxFocus[0].id == id && maxFocus[0].nextId == e.column.dataField){
                return
              }
            }
          },25);
          setFocusedColumnName(e.column.dataField);
        }
      }
    }
    const onFocusedCellChanged = (e)=>{
      if(setFocusedCellChanged){
        setFocusedCellChanged(e)
      }
    }
    const setCellValueRadio = async (newData, value, columnData, column)=>{
      column.grupoRadio.forEach(element => {
        if(column.ID == element){
          newData[column.id_valor] = column.valor;
        }
      });
    }
    const onFocusedRowChanging = async(e)=>{
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
    return (
        <div className={`paper-container ${ !_.isUndefined(heightHeaderClass) ? 'devExtreme_det' : null }`}>
          <Paper className="paper-styles">
          <Main.ModalDialogo
            positiveButton={""}
            negativeButton={"OK"}
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
              <DataGrid
                  id={id}
                  key="ID"
                  ref={gridDet}
                  showColumnLines={true}
                  repaintChangesOnly={true}
                  showRowLines={true}
                  rowAlternationEnabled={false}
                  autoNavigateToFocusedRow={false}
                  focusedRowEnabled={true}
                  focuRowEnable
                  allowColumnReordering={true}
                  focusRowEnabled={true}
                  allowColumnResizing={false}
                  errorRowEnabled={false}
                  showBorders={true}
                  height={ altura != undefined ? altura : 105 }
                  onCellClick={onCellClick}
                  onEditorPreparing={onEditorPreparing}
                  onRowUpdating={onRowUpdating}
                  onKeyDown={onKeyDown}
                  onFocusedCellChanging={onFocusedCellChanging}
                  onFocusedRowChanged={onFocusedRowChanged}
                  onFocusedCellChanged={onFocusedCellChanged}
                  //
                  onFocusedRowChanging={onFocusedRowChanging}
                  remoteOperations={true}
                  wordWrapEnabled={true}
              >
                { !_.isUndefined(buscadorGrid) ? <SearchPanel visible={true} /> : null}
                <Scrolling mode={_.isUndefined(ScrollingMode) ? 'none' : 'virtual'} />

                  <Sorting mode="single" />
                  <KeyboardNavigation
                      editOnKeyPress={true}
                      enterKeyAction="moveFocus"
                      enterKeyDirection={stockEntrer}// none
                      onEnterKey
                  />
                  <Paging enabled={false} />
                  <Editing
                      mode="cell"
                      allowUpdating={true}
                      allowAdding={false}
                      confirmDelete={false}
                      selectTextOnEditStart="click"
                  />
                   {columnDet.map((column) => (
                      column.multiple_header ?

                        <Column caption   ={column.label   } 
                                cssClass  = {"grid-multihead"}
                                key       ={column.ID      }
                                dataField ={column.ID      } 
                                width     ={column.width   } 
                                minWidth  ={column.minWidth} 
                                alignment ={column.align   } >
                          {
                            column.multiple_column.map((column_multipel) => (
                              column.checkbox 
                              ?
                                <Column 
                                  dataType           = {"boolean"         } 
                                  dataField          = {column_multipel.ID         }
                                  width              = {column_multipel.width      } 
                                  minWidth           = {column_multipel.minWidth   }
                                  maxWidth           = {column_multipel.maxWidth   }
                                  alignment          = {column_multipel.align      }
                                  allowEditing       = {column_multipel.disable ? false : ((_.isUndefined(column_multipel.disable)) && (_.isUndefined(column_multipel.edit))) ? true : false}
                                  key                = {column_multipel.ID         }
                                  caption            = {column_multipel.label      }              
                                  // headerCellRender   = {(e)=>renderHeader(e,column_multipel)}
                                  headerCellRender   = {
                                    doNotsearch != undefined && columBuscador !== undefined ? (e)=>renderHeaderAux(e,column_multipel) : (e)=>renderHeader(e,column_multipel)
                                  }
                                  allowSorting       = {!opcionComparar(column_multipel.ID, notOrderByAccion)}
                                  setCellValue       = {(newData, value, columnData)=>setCellValue(newData, value, columnData, column_multipel)}
                                  calculateCellValue = {(e)=>opcionComparar(e[column_multipel.ID], column.checkBoxOptions[0])}
                                /> 
                              :
                                column.radio 
                              ?
                                <Column 
                                  dataType           = {"boolean"         }
                                  cssClass           = {"grid-radio"      }
                                  dataField          = {column_multipel.ID         }
                                  width              = {column_multipel.width      }
                                  minWidth           = {column_multipel.minWidth   }
                                  maxWidth           = {column_multipel.maxWidth   }
                                  alignment          = {column_multipel.align      }
                                  allowEditing       = {column_multipel.disable ? false : ((_.isUndefined(column_multipel.disable)) && (_.isUndefined(column_multipel.edit))) ? true : false}
                                  key                = {column_multipel.ID         }
                                  caption            = {column_multipel.label      }
                                  headerCellRender   = {(e)=>renderHeader(e,column_multipel)}
                                  allowSorting       = {!opcionComparar(column_multipel.ID, notOrderByAccion)}
                                  setCellValue       = {(newData, value, column_multipelData)=>setCellValueRadio(newData, value, column_multipelData,column_multipel)}
                                  calculateCellValue = {(e)=>opcionComparar(e[column_multipel.id_valor], column_multipel.valor)}
                                /> 
                              : 
                                <Column 
                                  dataField          = {column_multipel.ID          }
                                  key                = {column_multipel.ID          }
                                  caption            = {column_multipel.label       }
                                  dataType           = {column_multipel.isnumber ? 'number' :  column.isdate ? 'date'   : null}
                                  cellRender         = {!_.isUndefined(column_multipel.formatter) ? (e)=>cellRender(e,column_multipel) : null}
                                  allowEditing       = {column_multipel.disable  ? false : true }
                                  width              = {column_multipel.width       } 
                                  minWidth           = {column_multipel.minWidth    }
                                  maxWidth           = {column_multipel.maxWidth    }
                                  alignment          = {column_multipel.align       }
                                  allowSorting       = {!opcionComparar(column_multipel.ID, notOrderByAccion)}
                                  editorOptions      = {column_multipel.isnumber ? {showClearButton:false} : column_multipel.isdate ?  { useMaskBehavior:true, showClearButton:true} 
                                  : { valueChangeEvent: "input"  } } 
                                  format             = {column_multipel.isnumber ? "#,##0" : column_multipel.isdate ? 'dd/MM/yyyy' : ''}
                                  headerCellRender   = {
                                    doNotsearch != undefined && columBuscador !== undefined ? (e)=>renderHeaderAux(e,column_multipel) : (e)=>renderHeader(e,column_multipel)
                                  }
                                > 
                                  {
                                    column.isOpcionSelect ?
                                        <Lookup
                                            dataSource={optionSelect[column_multipel.ID]}
                                            valueExpr="ID"
                                            displayExpr="NAME"
                                        />
                                    : null
                                  }
                                </Column>
                          ))}
                        </Column>
                      :
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
                            // headerCellRender   = {(e)=>renderHeader(e,column)}
                            headerCellRender   = {
                              doNotsearch != undefined && columBuscador !== undefined ? (e)=>renderHeaderAux(e,column) : (e)=>renderHeader(e,column)
                            }
                            allowSorting       = {!opcionComparar(column.ID, notOrderByAccion)}
                            setCellValue       = {(newData, value, columnData)=>setCellValue(newData, value, columnData, column)}
                            calculateCellValue = {(e)=>opcionComparar(e[column.ID], column.checkBoxOptions[0])}
                        /> 
                      :
                        column.radio 
                        ?
                          <Column 
                            dataType           = {"boolean"         }
                            cssClass           = {"grid-radio"      }  
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
                            setCellValue       = {(newData, value, columnData)=>setCellValueRadio(newData, value, columnData,column)}
                            calculateCellValue = {(e)=>opcionComparar(e[column.id_valor], column.valor)}
                        /> 
                      : 
                        <Column 
                          dataField          = {column.ID          }
                          key                = {column.ID          }
                          caption            = {column.label       }
                          dataType           = {column.isnumber ? 'number' :  column.isdate ? 'date'   : null}
                          cellRender         = {!_.isUndefined(column.formatter) ? (e)=>cellRender(e,column) : null}
                          allowEditing       = {column.disable ? false : true }
                          width              = {column.width       } 
                          minWidth           = {column.minWidth    }
                          maxWidth           = {column.maxWidth    }
                          alignment          = {column.align       }
                          allowSorting       = {!opcionComparar(column.ID, notOrderByAccion)}
                          editorOptions      = {column.isnumber ? {showClearButton:false} : column.isdate ?  { useMaskBehavior:true, showClearButton:true} 
                          : { valueChangeEvent: "input"  } } 
                          format             = {column.isnumber ? "#,##0" : column.isdate ? 'dd/MM/yyyy' : ''}
                          // headerCellRender   = {(e)=>renderHeader(e,column)}
                          headerCellRender   = {
                            doNotsearch != undefined && columBuscador !== undefined ? (e)=>renderHeaderAux(e,column) : (e)=>renderHeader(e,column)
                          }
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
                  { (!_.isUndefined(page) ) ? <Paging defaultPageSize={ page} /> : null}
                  { (!_.isUndefined(page))  ? <Pager
                                                visible={true}
                                                allowedPageSizes={false}
                                                displayMode={'full'}
                                                showPageSizeSelector={true}
                                                showInfo={true}
                                                showNavigationButtons={true} 
                                              /> : null}                  
              </DataGrid>
          </Paper>
	      </div>
    );
});
export default DevExtremeDet;


// import React, { memo,useEffect,useState }  from "react";
// import { v4 as uuidID } from "uuid";
// import _                from "underscore";
// import  Paper 					from '@material-ui/core/Paper';
// import Button           from "@material-ui/core/Button";
// import styles           from "./Styles";
// import Main             from "../Main";
// import ArrayStore       from 'devextreme/data/array_store';
// import {validateSave}   from './Search'
// import { BiSearchAlt } 	from "react-icons/bi";
// import {setComponenteEliminar,
//         setTipoDeOperacion   ,
//         getTipoDeOperaciones ,
//         getFocusGlobalEvent} from './DevExtremeCab';
// import DataGrid, { Column, Editing , Paging ,LoadPanel,
//       Lookup, KeyboardNavigation, Sorting,Scrolling,Pager,SearchPanel} from "devextreme-react/data-grid";
// import $ from 'jquery';
// import { modifico } from "./ButtonCancelar";
// // import { add } from "ol/coordinate";
// import { getPermisos } from '../../utils/ObtenerPermisosEspeciales';
// import './styles.css';

// var getHabilitar = false;
// export const setHabilitarDet = (valor) => {
//   getHabilitar = valor;
// };
// export const getHabilitarDet = () => {
//   return getHabilitar;
// };

// var focusGlobalEvent;
// const setFocusGlobalEventDet = (valor) => {
//     focusGlobalEvent = valor;
// };
// export const getFocusGlobalEventDet = () => {
//     return focusGlobalEvent;
// };
// var focusGlobalEventAux;
// const setFocusGlobalEventAux = (valor) => {
//   focusGlobalEventAux = valor;
// };
// export const getFocusGlobalEventDetAux = () => {
//     return focusGlobalEventAux;
// };
// const opcionComparar = (values, opcion) => {
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
// }
// var focusedRowIndex = 0; 
// const setFocusedRowIndex = (valor)=>{
//     focusedRowIndex = valor;
// }
// export const getFocusedRowIndex = ()=>{
//   return focusedRowIndex;
// }
// var focusedColumnNameActual
// const setFocusedColumnNameActual = (valor)=>{
//   focusedColumnNameActual = valor;
// }
// export const getFocusedColumnNameActual = ()=>{
//   return focusedColumnNameActual;
// }
// var focusedColumnName
// const setFocusedColumnName = (valor)=>{
//   focusedColumnName = valor;
// }
// export const getFocusedColumnName = ()=>{
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
// var bloqueoCabecera = false
// export const setBloqueoCabecera = (valor)=>{
//   bloqueoCabecera = valor
// };
// export const getBloqueoCabecera = ()=>{
//   return bloqueoCabecera;
// };
// var bloqueButtonGuardar = false
// export const setBloqueButtonGuardar = (valor)=>{
//   bloqueButtonGuardar = valor
// };
// export const getBloqueButtonGuardar = ()=>{
//   return bloqueButtonGuardar;
// };
// var bloqueo = [];
// export const removeIdComponentUpdate = (id)=>{
//   bloqueo = []
// };
// export const setIdComponentUpdate = (id)=>{
//   if( bloqueo[0] != undefined){
//     bloqueo[0][id] = true
//   }else{
//     bloqueo.push({
//       [id]:true,
//     })
//   }
  
// };
// export const getIdComponentUpdate = ()=>{
//   return bloqueo;
// };
// export var deleteDisable        = false
// export const getDeleteDisable = () =>{
//   return deleteDisable;
// }
// var eventValuesCheckbox
// const setEventValuesCheckbox = (e)=>{
//   eventValuesCheckbox = e;
// };
// const getEventValuesCheckbox = ()=>{
//   return eventValuesCheckbox
// }
// var bandBloqueoGrid = true
// export const setbandBloqueoGrid = (e)=> {
//   bandBloqueoGrid = e
// }
// export const getbandBloqueoGrid = ()=> {
//   return bandBloqueoGrid
// }
// export var globalValidateDet       = true;
// export const setGlobalValidateDet = (e)=>{
//   globalValidateDet = e;
// }
// var componenteEliminar = true;
// export const setComponenteEliminarDet = (e)=>{
//   componenteEliminar = e;
// };
// export const getComponenteEliminarDet = ()=>{
//   return componenteEliminar;
// }

// var insert   = false
// var update   = false

// export const getTipoDeOperacionesDet = ()=>{
//   return [insert,update]
// }
// export const getEstablecerOperacionesDet = ()=>{
//   insert = false, update= false;
// }
// export var ArrayPushHedSeled    = []
// export const setArrayHedSeled = (e) =>{
//   var valor = document.querySelectorAll("#iconoLupa")
//  setTimeout(()=>{
//   if(valor?.length > 1){
//     valor.forEach(element => {
//       let nombre    = element.attributes[0].value
//       let iconohead = document.getElementsByName(nombre);
//       iconohead[0].style.visibility = 'collapse'
//     });
//   }
//   var resul = document.getElementsByName(e)
//   if(resul?.length){
//     resul[0].style.visibility = 'visible';
//   }
//  },66);
//   ArrayPushHedSeled = [];
//   ArrayPushHedSeled.push(e);
// }

// var columnIndex = 0; 
// const setColumnIndex = (valor)=>{
//   columnIndex = valor;
// }
// const getColumnIndex = ()=>{
//   return columnIndex;
// }

// var rowIndex = 0; 
// const setRowIndex = (valor)=>{
//   rowIndex = valor;
// }
// const getRowIndex = ()=>{
//   return rowIndex;
// }

// var valorAnteriorEnter   = ""; 
// var valorActualEnter     = ""; 
// var ArrayDependenciaGlobal = new Array
// var rowDet = []
// var setEditarModalNew  = false;
// var banderaAddTabEnter = ''
// export var ArrayDetecteComponent = [];
// export const limpiarArrayDetecteComponent = ()=>{
//   ArrayDetecteComponent = []
// }
// var columnRequerido   = []
// var columnEditDisable = []
// export const setColumnRequerido = async(column)=>{
//   columnEditDisable = []
//   columnRequerido   = []
//     var arrayInsert = await _.flatten(_.filter(column, function(item){
//       if(item.requerido) columnRequerido.push(item);
//       if(item.editModal === false || item.editModal === true || item.Pk === true) return item;
//     }));
//   columnEditDisable = await arrayInsert
// }

// var activarBandF9 = false;
// var addRowBand    = false;


// var bandera     = true;
// var spinnerband = false;

// const DevExtremeDet = memo(({ gridDet   , initialRow         , notOrderByAccion     ,
//                               FormName  , columnModal        , setUpdateValue       ,
//                               id        , setRowFocusDet     , optionSelect         ,
//                               columnDet , guardar            , newAddRow            ,
//                               canDelete , activateF10        , activateF6           , 
//                               maxFocus                       ,  altura              ,
//                               datos_disable_edit             , permisos_especiales  ,
//                               setActivarSpinner              , operacion            ,
//                               setCellChanging                , setFocusedCellChanged,
//                               doNotsearch                    , columBuscador        ,
//                               setFocusedRowChanged           , dataCabecera         ,
//                               ScrollingMode                  , smallHead            ,
//                               funcionNuevo                   , page                 ,
//                               heightHeaderClass              , buscadorGrid         ,
//                               cellRender
//                             }) => {
    
//     const PermisoEspecial = getPermisos(FormName);
//     const classes = styles();
//     //--------------------------   State  ----------------------------------------------
//     const [tipoDeBusqueda  , setTipoDeBusqueda   ] = useState();
//     const [stockEntrer     , setStockEntrer        ]  = useState('row')


//     //---------------------------Estado Modal-------------------------------------------
//     const [shows            , setShows              ] = useState(false);
//     const [modalTitle       , setModalTitle         ] = useState();
//     const [searchColumns    , setSearchColumns      ] = useState();
//     const [searchData       , setSearchData         ] = useState({});
//     const [headSeled        , setheadSeled          ] = useState([columBuscador]);
//     //---------------------------Estado Modal mensaje ----------------------------------
//     const [visibleMensaje   , setVisibleMensaje     ] = useState(false);
//     const [mensaje          , setMensaje            ] = useState();
//     const [imagen           , setImagen             ] = useState();
//     const [tituloModal      , setTituloModal        ] = useState();

//     useEffect(()=>{      
//       columnEditDisable = []
//       columnRequerido   = []
//       var arrayInsert = _.flatten(_.filter(columnDet, function(item){
//         if(item.requerido) columnRequerido.push(item);
//         if(item.editModal === false || item.editModal === true || item.Pk === true) return item;
//       }));
//       columnEditDisable = arrayInsert
//       deleteDisable     = canDelete === false ? true : false
//       ArrayPushHedSeled.push(columBuscador);

//       // restauramos por defecto las variables globales para que no afecte a los demas formulario
//       setHabilitarDet(false)
//       setbandBloqueoGrid(true)
//       bandera = true;
//     },[]);
//     const establecerFocus = (fila,column,params)=>{
//       setTimeout( ()=>{
//         if(params){
//           gridDet.current.instance.focus(gridDet.current.instance.getCellElement(fila,column));
//         }else{
//           gridDet.current.instance.focus(gridDet.current.instance.getCellElement(0,0));
//         }
//       },200);
//     }
//     const selectedHead = async (e,idHead) => {
//       e.stopPropagation()
//       var iconohead = await document.getElementsByName(idHead);
//       var exists    = await headSeled.includes(idHead);

//       if(exists){
//         iconohead[0].style.visibility = 'collapse'
//         const indice = headSeled.indexOf(idHead)
//         headSeled.splice(indice, 1);
//         ArrayPushHedSeled.splice(indice, 1)
//       }else{
//         setheadSeled(await headSeled.concat(idHead));
//         document.getElementsByName(idHead)[0].style.visibility = 'visible';
//         ArrayPushHedSeled = headSeled.concat(idHead)
//       }
//     }
//     //en caso de que cuente con buscador 
//     const renderHeaderAux = (e,column) => {
//       return (
//         <>
//         { opcionComparar(column.ID, doNotsearch)
//           ? 
//             <div 
//               id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : "horizontalDatagrid"}
//               key={column.ID}
//               className={classes.selectHeader} 
//               disabled>
//               {column.label}
//             </div>
//           :
//             <Button   key={column.ID}
//                       id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : null}
//                       className={classes.selectHeader} 
//                       onClick={(e) => selectedHead(e,column.ID)} >
//                       {column.label}
//                       { headSeled.includes(column.ID)
//             ?
//                 <i name={column.ID} id="iconoLupa" className={classes.auxIconHead}>
//                   <BiSearchAlt/>
//                 </i>
//             :
//                 <i name={column.ID} className={classes.iconHead}>
//                 <BiSearchAlt/>
//               </i>
//             }
//           </Button>
//         }
//         </>
//       );
//     }
//     const renderHeader = (e,column) => {
//       return (
//         <>
//         { opcionComparar(column.ID)
//           ? 
//             <div  id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid_det" : "horizontalDatagrid"}
//                   key={column.ID}
//               >
//               {column.label}
//             </div>
//           :
//             <Button   
//                   key={column.ID}
//                   id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid_det" : null}
//                   className={ smallHead ? classes.selectHeaderAux : classes.selectHeader}
//                   disabled={true}
//                   >
//                 {column.label}
//           </Button>
//         }
//         </>
//       );
//     }
//     const onFocusedRowChanged = async(e)=>{
//       if(setFocusedRowChanged)setFocusedRowChanged(e);

//       if(e.row != undefined){
//         setComponenteEliminar({"id":e.row.data.IDCOMPONENTE,"delete":canDelete == false ? false : true })
//         setComponenteEliminarDet({"id":e.row.data.IDCOMPONENTE,"delete":canDelete == false ? false : true })
//       }
//       setFocusGlobalEventDet(await e);
//       if(setRowFocusDet) setRowFocusDet(e)
//     }
//     const onFocusedCellChanging = async(e) =>{
      
//       var fila = e.prevRowIndex == -1 ? 0 : e.prevRowIndex
//       if(setCellChanging)setCellChanging(e.rows[fila])
//       if(e.rows[fila]){
//         setComponenteEliminar({"id":e.rows[fila].data.IDCOMPONENTE,"delete":canDelete == false ? false : true })
//         setComponenteEliminarDet({"id":e.rows[fila].data.IDCOMPONENTE,"delete":canDelete == false ? false : true })
//       }
//       setFocusGlobalEventAux(e);
//       setEventValuesCheckbox(e);
//       setFocusedColumnName(e.columns[e.newColumnIndex].dataField);      
//       setFocusedColumnNameActual(e);

//       setFocusedColumnIndex(e.prevRowIndex);
//       setFocusedRowIndex(e.prevRowIndex);

//       setColumnIndex(e.newColumnIndex);
//       setRowIndex(e.newRowIndex);

//       let permisoEdit     = await Main.VerificaPermiso(FormName)
//       var dataColumn      = getFocusedColumnName();
      
//       if(columnEditDisable.length > 0){
//         for (let i = 0; i < columnEditDisable.length; i++) {
//           const items = columnEditDisable[i];
//           if(!getbandBloqueoGrid()){
//             e.columns[e.newColumnIndex].allowEditing = false
//             setEditarModalNew = false;
//           }else{
//             if(e.rows[e.newRowIndex]){
//               if(items.ID === dataColumn && permisoEdit[0].actualizar == 'S' && e.rows[e.newRowIndex].data.inserted){
//                 setEditarModalNew = true;
//                 e.columns[e.newColumnIndex].allowEditing = true
//                 break;
//               }
//             }

//             if(items.ID === dataColumn && permisoEdit[0].actualizar == 'S' && items.editModal == true){
//               e.columns[e.newColumnIndex].allowEditing = true          
//               setEditarModalNew = true
//             }
//             if(items.ID === dataColumn && permisoEdit[0].actualizar == 'S' && items.editModal == false){
//               e.columns[e.newColumnIndex].allowEditing = false
//               setEditarModalNew = false
//             }
            
//             if(items.ID === dataColumn && permisoEdit[0].actualizar == 'S' && items.Pk){
//               e.columns[e.newColumnIndex].allowEditing = false
//               setEditarModalNew = false
//             }
//           }
          
//         }
//       }
      
//       if(permisos_especiales){
//         if(datos_disable_edit){
//           for (let index = 0; index < datos_disable_edit.length; index++) {
//             const items = datos_disable_edit[index];
//             if(items == e.columns[e.newColumnIndex].dataField && !_.contains(PermisoEspecial,permisos_especiales[0])){
//               if(e.rows[0].data){
//                 if(e.rows[e.newRowIndex].data.InsertDefault || e.rows[e.newRowIndex].data.inserted) e.columns[e.newColumnIndex].allowEditing = true;
//                 else e.columns[e.newColumnIndex].allowEditing = false;
//                 break
//               }else{
//                 if(_.contains(PermisoEspecial,permisos_especiales[0])) e.columns[e.newColumnIndex].allowEditing = true;
//                 else e.columns[e.newColumnIndex].allowEditing = false;
//                 break
//               }
//             }
//           }
//         }
//       }
//       if(e.event){
//         if(maxFocus){
//           if(e.event.code == "ArrowRight" && e.columns[e.prevColumnIndex].name === maxFocus[0].hasta){
//             let rowindex = e.prevColumnIndex == - 1 ? 0 : e.prevColumnIndex
//             e.cancel = true
//             gridDet.current.instance.focus(gridDet.current.instance.getCellElement(e.prevRowIndex,rowindex))
//           }
//         }
        
//         let rowNew  = true;
//         if(newAddRow === false || _.isUndefined(!newAddRow)) rowNew = false
//         if(permisos_especiales)if(_.contains(PermisoEspecial,permisos_especiales[0])) rowNew = true;
        
//         if(e.event.key === "ArrowDown"){
//           let count      = gridDet.current.instance.getDataSource()._items;
//           let totalRows  = count.length - 1;
//           if(totalRows === fila && rowNew && getbandBloqueoGrid()){
//             var Addband = false
//             var columnaRequerido = ''
//             if(columnRequerido.length){
//               for (let index = 0; index < columnRequerido.length; index++) {
//                   const element = columnRequerido[index];
//                   if(e.rows[e.newRowIndex].data[element.ID]){
//                     if(e.rows[e.newRowIndex].data[element.ID] === ''){
//                       Addband  = true;
//                       columnaRequerido = {'label':element.label,'ID':element.ID}
//                       break
//                     }
//                   }else{
//                     Addband  = true;
//                     columnaRequerido = {'label':element.label,'ID':element.ID}
//                     break
//                   }
//               }
//             }
//             if(!Addband){
//               banderaAddTabEnter = 0
//               addRow();
//             }else{
//               setTimeout(()=>
//                 gridDet.current.instance.focus(gridDet.current.instance.getCellElement(e.newRowIndex,columnaRequerido.ID)),50
//               )
//             }
//           }
//         }
//       }
//     }
//     const addRow = async() => {
//         setTipoDeOperacion('insert',true) 
//         var rowIndex = 0
//         rowDet       = gridDet.current.instance.getDataSource();        
//         modifico();
//         if(!getBloqueoCabecera())setBloqueoCabecera(true)

//         if(rowDet) rowIndex = rowDet._items.length
//         else rowIndex = 0;
        
//         var newKey = uuidID();
//         var row    = [0]
//         row = [{
//           ...row[0],
//           ID          : newKey,
//           inserted    : true,
//           IDCOMPONENTE:id,
//           COD_EMPRESA: sessionStorage.getItem('cod_empresa'),
//           COD_USUARIO: sessionStorage.getItem('cod_usuario'),
//           idCabecera : rowDet._items[0].idCabecera
//         }];
        
//         if( !_.isUndefined(initialRow) ){
//           if(initialRow.length > 0){
//             for (let i = 0; i < initialRow.length; i++) {
//               const item    = initialRow[i];
//               row[0][Object.keys(item)[0]] = rowDet._items[0][Object.keys(item)[0]];
//             }
//           }
//         }

//         columnDet.forEach(async element => {
//           if(element.isdate)    row[0][element.ID] = Main.moment();
//           if(element.checkbox)  row[0][element.ID] = element.checkBoxOptions[1];  
//           if(element.isOpcionSelect){
//           _.flatten(_.filter(optionSelect[element.ID], function(item){
//             if (item.isNew) row[0][element.ID] = item.ID;
//           }));
//           } 
//         });
        
//         console.log('Add ====> ',globalValidateDet);

//         const dataSource = new ArrayStore({
//           data: rowDet._items,
//         });

//         dataSource.push([{
//           type: 'insert',
//           ID  : row[0].ID,
//           data: row[0],
//         }]);

//         gridDet.current.instance.option('loadPanel.enabled', false);  
//         gridDet.current.instance.refresh();
//         gridDet.current.instance.option('dataSource', dataSource);
       
//         setTimeout(()=>{
//           var grid = gridDet.current.instance.getDataSource();		  
//           var filaIndex;
//           if(grid) filaIndex = grid._items.length - 1
//           gridDet.current.instance.focus(gridDet.current.instance.getCellElement(filaIndex,columnDet[0]["ID"]));
//         },100);
//     }
//     const onRowUpdating  = async(value) =>{
//       setTipoDeOperacion('update',true) 
//       var columnNameEdit = Object.keys(value.newData);
//       setNameRowsEnter(Object.keys(value.newData)[0])      
//       if(setUpdateValue)setUpdateValue(value,'',false);
//       setIdComponentUpdate(id);
//       modifico();
//       if(!getBloqueoCabecera())setBloqueoCabecera(true)

//       valorAnteriorEnter  = value.oldData[columnNameEdit[0]];
//       valorActualEnter    = value.newData[columnNameEdit[0]];

//       if(!ArrayDetecteComponent[id]){
//         ArrayDetecteComponent[id] = _.union(ArrayDetecteComponent[id],[{'update':true}]);
//       }

//       var rowsColumn = columnDet.filter(item => item.ID == columnNameEdit[0]);
//       if(rowsColumn[0]){
//         if(rowsColumn[0].upper){
//           value.newData[columnNameEdit[0]] = value.newData[columnNameEdit[0]].toUpperCase();
//         }
//       }
      
//       if(columnModal){
//         if(columnModal[columnNameEdit[0]]){
//           if(!activarBandF9){
            
//             // gridDet.current.instance.option("focusedRowKey", 120);
//             gridDet.current.instance.option("FocusedRowIndex", -1);
//             // gridDet.current.instance.clearSelection();
//             // gridDet.current.instance.focus(0);

//             setStockEntrer('none')
//             await funcionValidacion(columnNameEdit[0], value.newData[columnNameEdit[0]], value);
//           }else{
//             activarBandF9 = false
//           }
//         }else if(columnModal.urlValidar[0][columnNameEdit]){
//           if(!activarBandF9){
//             await funcionValidacion(columnNameEdit[0], value.newData[columnNameEdit[0]], value);
//           }else{
//             activarBandF9 = false
//           }
//         }
//       }      

//       if(operacion){
//         if(operacion.valor1 === columnNameEdit[0] || operacion.valor2 == columnNameEdit[0]){
//           switch (operacion.operac) {
//             case 'multiplicacion':
//               var valor1,valor2
              
//               if(columnNameEdit[0] === operacion.valor1){
//                 valor1 = value.newData[columnNameEdit[0]];  
//               }else{
//                 valor1 = value.oldData[operacion.valor1];
//               }
              
//               if(columnNameEdit[0] === operacion.valor2){
//                 valor2 = value.newData[columnNameEdit[0]];
//               }else{
//                 valor2 = value.oldData[operacion.valor2];
//               } 
              
//               if(valor2){
//                 var rowIndex   = gridDet.current.instance.getRowIndexByKey(value.key); 
//                 var comunIndex = gridDet.current.instance.getCellElement(rowIndex,operacion.resultado);

//                 // value.component.cellValue(rowIndex,comunIndex?.cellIndex, valor1 * valor2);
//                 value.oldData[operacion.resultado] = await valor1 * valor2
//                 value.component.saveEditData()
//               } 
//               break;
//             default:
//               break;
//           }  
//         }
//       }

//       if(globalValidateDet){
//         globalValidateDet = true;
//         if(value.oldData.InsertDefault){
//           value.oldData.inserted = true;
//           value.oldData.InsertDefault = false;
//         }else if(!value.oldData.inserted) value.oldData.updated = true;
        
//       }else{
//         value.cancel   = false
//         var filas      = gridDet.current.instance.getRowIndexByKey(value.key); 
//         var indexComun = gridDet.current.instance.getCellElement(filas,columnNameEdit[0]);
//         setRowColumnErrorModaF9(filas, indexComun?.cellIndex);
//         value.component.cancelEditData();
//       }
//     }
//     const funcionValidacion = async (nameColumn, value, rowsData)=>{
//       var ArrayDataDependencia = await validarDependencia(13);
//       if( ArrayDataDependencia == true){ globalValidateDet = false; return}
  
//       var valor_actual   = await value;
//       rowsData.component.navigateToRow(rowsData.key)
      
//       if(valorAnteriorEnter !== valor_actual || globalValidateDet == false){      
//         var valor       = value
//         if(!_.isNumber(valor) && !_.isNull(valor) && !_.isNaN(valor) && !_.isUndefined(valor) ) valor = await value.trim();
//         var url         = columnModal.urlValidar[0][nameColumn];
//         var indexRows   = rowsData.component.getRowIndexByKey(rowsData.key)
//         if(indexRows == -1) indexRows = 0
//         var columnhead  = getFocusGlobalEventDet();

//         try{
//         var method = 'POST'        
//         var data   = {'valor':valor,'cod_empresa':sessionStorage.getItem('cod_empresa'),dependencia:ArrayDataDependencia};
//         await Main.Request( url, method, data)
//         .then(async response => {				
          
//           if(response.status == 200 ){
//             if(response.data.outBinds.ret == 1){
              
//               if(getBloqueButtonGuardar())setBloqueButtonGuardar(false)

//               if(Object.keys(response.data.outBinds).length > 2){
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

//               if(Object.keys(columnModal.config).length !== 0 ){
//                 if(columnModal.config[nameColumn].dependencia_de.length > 0){
//                   await columnDependencia(rowsData,columnModal.config[nameColumn].dependencia_de,nameColumn,true);
//                 }
//               }
              
//               let indexComun = gridDet.current.instance.getCellElement(indexRows,nameColumn);
//               var columna    = indexComun.cellIndex + 1;
//               if(columnhead.row.cells[columna] && columnModal[nameColumn]){
//                 if(columnhead.row.cells[columna].column.name === columnModal[nameColumn][1].ID){
//                   columna = columna + 1;
//                   }
//               }
//               if(!maxFocus){
//                 if(rowsData.component.getVisibleColumns().length == columna){
//                   if(rowsData.component.getVisibleRows().length == indexRows + 1){
//                     let newAdd = newaddRow == undefined ? true : newAddRow
//                     if(newAdd && getbandBloqueoGrid()){
//                       if(!addRowBand)addRow('funcionValidacion');
//                       else addRowBand = false
//                     }
//                     // gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRows,columna-2));
//                   // }else{
//                     // let fila = rowsData.component.getVisibleRows().length - 1
//                     // gridDet.current.instance.focus(gridDet.current.instance.getCellElement(fila,0));
//                   }
//                 }else{
//                   gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRows,columna));
//                 }
//               }else{
//                 var e  = getFocusGlobalEventDetAux();
//                 if(maxFocus[0].id === id && e.component.getVisibleColumns().length === columna){

//                   console.log('Columna ',e.component.getVisibleColumns().length,'==',columna)

//                   if(e.prevRowIndex == -1) e.prevRowIndex = 0
//                   if(e.component.getVisibleRows().length == e.prevRowIndex + 1){
                    
//                     // console.log('Fila ',e.component.getVisibleRows().length,'==',e.prevRowIndex + 1)

//                     gridDet.current.instance.option("focusedRowKey", 120);
//                     addRow('funcionValidacion');
//                   }else{
//                     gridDet.current.instance.focus(gridDet.current.instance.getCellElement(e.newRowIndex,0));
//                   }
//                 }
//                 // else{
//                 //   gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRows,columna));
//                 // }
//               }                
//               setStockEntrer('row')
//               globalValidateDet = true;
//             }else{              
              
//               globalValidateDet = false;
//               rowsData.component.saveEditData();
//               gridDet.current.instance.option("focusedRowKey", 120);
//               gridDet.current.instance.clearSelection();
//               gridDet.current.instance.focus(0);

//               if(!getBloqueButtonGuardar())setBloqueButtonGuardar(true)
//               showModalMensaje('Atención!','alerta',response.data.outBinds.p_mensaje);
//             }
//           }
//         });
//         } catch (error) {
//           console.log("Error en funcionValidacio",error);
//           // showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
//         }
//       }else{
//         setStockEntrer('row')
//       }
//     }
//     const validarDependencia = async (key)=>{
//       var ArrayDataDependencia = new Array();
//       var nameData             = await getFocusedColumnName();
//       if(key == 13) nameData   = getNameRowsEnter();  
//       var info                 = await getFocusGlobalEventDet().row.data;

//       if((Object.keys(columnModal.config).length == 0) || !columnModal.config[nameData]){
//         return [];
//       }
//       if(columnModal.config[nameData]?.depende_ex_cab !== undefined){
//         for (let i = 0; i < columnModal.config[nameData].depende_ex_cab.length; i++){
//           const items  = columnModal.config[nameData].depende_ex_cab[i];
//           var dataName = items.id
//             if(dataCabecera[dataName] == ""){
//               setTimeout(()=>{
//                 Main.message.info({
//                   content  : `Favor complete el campo ${items.label} antes de continuar!!`,
//                   className: 'custom-class',
//                   duration : `${2}`,
//                   style    : {
//                     marginTop: '2vh',
//                   },
//               });
//               },100)            
//               return true
//             }else{
//                 var data = {[dataName]:dataCabecera[dataName]}
//                 ArrayDataDependencia.push(data);
//                 ArrayDependenciaGlobal = ArrayDataDependencia;
//             }
//         }
//       }
//       if(columnModal.config[nameData].depende_de.length > 0){
  
//         for (let i = 0; i < columnModal.config[nameData].depende_de.length; i++){
//           const items  = columnModal.config[nameData].depende_de[i];
//           var dataName = items.id
//             if(info[dataName] == ""){
//               setTimeout(()=>{
//                 Main.message.info({
//                   content  : `Favor complete el campo ${items.label} antes de continuar!!`,
//                   className: 'custom-class',
//                   duration : `${2}`,
//                   style    : {
//                     marginTop: '2vh',
//                   },
//               });
//               },100)            
//               return true
//             }else{
//                 var data = {[dataName]:info[dataName]}
//                 ArrayDataDependencia.push(data);
//                 ArrayDependenciaGlobal = ArrayDataDependencia;
//             }
//         }
//       }
//       return ArrayDataDependencia
//     }
//     const columnDependencia = async (rows,dependencia,busquedaPor,enter)=>{
//       if( Object.keys(columnModal.config).length == 0 ){
//         return;
//       }
//       var fila;
//       var rowsData    =  getFocusGlobalEventDet()
//         dependencia.forEach(async items => {
//           var key               = items.id
//           var rowDelete         = columnModal[key];
//           if(key !== busquedaPor && (enter)){
//             if(rowDelete){
//               rows.oldData[rowDelete[0].ID] = "";
//               rows.oldData[rowDelete[1].ID] = "";
//             }else{
//               rows.oldData[key] = "";
//             }
//             fila = gridDet.current.instance.getRowIndexByKey(rows.oldData.ID)
//           }else{
//             if(rowDelete){
//               rows[rowDelete[0].ID] = "";
//               rows[rowDelete[1].ID] = "";
//             }else{
//               rows[key] = "";
//             }
//             // rows[rowDelete[0].ID] = ""
//             // rows[rowDelete[1].ID] = ""
//             fila = gridDet.current.instance.getRowIndexByKey(rows.ID)
//           }
//         });
//         await gridDet.current.instance.saveEditData();
//         await rowsData.component.repaintRows([fila]);
//         await gridDet.current.instance.option(rows)
//     }
//     const handleCancel = async() => {
//       setVisibleMensaje(false);
//       setTimeout(async()=>{
//           var column = getFocusedColumnIndex();
//           var fila   = getFocusedRowIndex();
//           if(fila == -1) fila = 0;
//           if(!globalValidateDet){              
//             fila   = await getRowColumnErrorModaF9()[0].fila;
//             column = await getRowColumnErrorModaF9()[1].columna;
//             gridDet.current.instance.focus(gridDet.current.instance.getCellElement(fila,column))
//             await gridDet.current.instance?.editCell(fila, column);
//             await gridDet.current.instance?.cellValue(fila, column,valorActualEnter);
//             // gridDet.current.instance.saveEditData()
//           }else{
//             await gridDet.current.instance.focus(gridDet.current.instance.getCellElement(fila,column))
//             await gridDet.current.instance.editCell(fila, column);
//             // gridDet.current.instance.saveEditData()
//           }        
//        })
//     };
//     const showModalMensaje = (titulo,imagen, mensaje) => {
//       setTituloModal(titulo);
//       setImagen(imagen);
//       setMensaje(mensaje);
//       setVisibleMensaje(true);
//     };
//     const modalSetOnClick = async (datos, busquedaPor, datoskey) => {
//       globalValidateDet = true; 
//       rowDet            = gridDet.current.instance.getDataSource();
//       await gridDet.current.instance.refresh(true);
//       await gridDet.current.instance.cancelEditData();
//       await gridDet.current.instance.saveEditData();

//       if(!ArrayDetecteComponent[id]){
//         ArrayDetecteComponent[id] = _.union(ArrayDetecteComponent[id],[{'update':true}]);
//       }      

//       if(datos !== "" || datos !== undefined){
        
//         modifico()
//         if(!getBloqueoCabecera())setBloqueoCabecera(true)
//         if(getBloqueButtonGuardar())setBloqueButtonGuardar(false)
//         var rows              = await getFocusGlobalEventDet().row.data;
//         if(setUpdateValue)setUpdateValue('',getFocusGlobalEventDet(),true);

//         var valor_anterior     = rows[busquedaPor];
//         var valor_actual       = await datos[0];
//         var codPropiedadColumn = await gridDet.current.instance.columnOption(busquedaPor)

//         var desPropiedadColumn = await gridDet.current.instance.columnOption(columnModal[busquedaPor][1].ID)
//         var indexRows          = await getFocusGlobalEventDet().rowIndex
//         if(indexRows == -1 || indexRows == undefined) indexRows = 0;
//         var indexColum         = codPropiedadColumn.visibleIndex;
        
//           if(columnModal.config[busquedaPor]){
//             if(columnModal.config[busquedaPor].dependencia_de.length > 0){
//               columnDependencia(rows,columnModal.config[busquedaPor].dependencia_de,busquedaPor,false);
//             }
//           }
//           if(columnModal.config[busquedaPor]){
//             if(columnModal.config[busquedaPor].dependencia_de.length > 0){
//               columnDependencia(rows,columnModal.config[busquedaPor].dependencia_de,busquedaPor,false);
//             }
//           }
//           if(!desPropiedadColumn && datos.length > 2 ){
//             var band = false
//             for(var i in datoskey){
//               if(!band){
//                 band = true;
//                 await gridDet.current.instance?.editCell(indexRows, indexColum);
//                 await gridDet.current.instance?.cellValue(indexRows, indexColum,datos[0]); 
//               }else{
//                 if(i != 'ID'){
//                   getFocusGlobalEventDet().row.data[i] = datoskey[i]
//                 }  
//               }
//             }
//             await gridDet.current.instance.option(rows);
//           }else if(!desPropiedadColumn){
//             let key    = Object.keys(datoskey)[0];
//             let auxKey = parseInt(key)

//             if(_.isNaN(auxKey)){
//               var ban = false
//               var valor= ''
//               for(var i in datoskey){
//                 if(i != 'ID'){
//                   if(!ban){
//                     ban = true;
//                     valor = datoskey[i]
//                     await gridDet.current.instance?.editCell(indexRows, indexColum);
//                     await gridDet.current.instance?.cellValue(indexRows, indexColum,datoskey[i]);
//                   }else{
//                     getFocusGlobalEventDet().row.data[i] = datoskey[i]
//                   }
//                 }
//               }
//             }else{
//               for(var i in datoskey){
//                   if(datoskey[i]!= 'ID'){
//                     if(i == 0){
//                       await gridDet.current.instance?.editCell(indexRows, indexColum);
//                       await gridDet.current.instance?.cellValue(indexRows, indexColum,datos[i]);
//                     }else{
//                       getFocusGlobalEventDet().row.data[datoskey[i]] = datos[i]
//                     }
//                   }
//                 }
//             }
//           }else if(datos.length == 3){
//             await gridDet.current.instance?.editCell(indexRows, indexColum);
//             await gridDet.current.instance?.cellValue(indexRows, indexColum,datos[0]);
//             getFocusGlobalEventDet().row.data[desPropiedadColumn.name] = await datos[1]
//           }else{
//             let key    = Object.keys(datoskey)[0];
//             let auxKey = parseInt(key)

//             if(_.isNaN(auxKey)){
//               var ban = false
//               var valor= ''
//               for(var i in datoskey){
//                 if(i != 'ID'){
//                   if(!ban){
//                     ban = true;
//                     valor = datoskey[i]
//                     await gridDet.current.instance?.editCell(indexRows, indexColum);
//                     await gridDet.current.instance?.cellValue(indexRows, indexColum,datoskey[i]);
//                   }else{
//                     getFocusGlobalEventDet().row.data[i] = datoskey[i]
//                   }
//                 }
//               }
//             }else{
//               for(var i in datoskey){
//                   if(datoskey[i]!= 'ID'){
//                     if(i == 0){
//                       await gridDet.current.instance?.editCell(indexRows, indexColum);
//                       await gridDet.current.instance?.cellValue(indexRows, indexColum,datos[i]);
//                     }else{
//                       getFocusGlobalEventDet().row.data[datoskey[i]] = datos[i]
//                     }
//                   }
//                 }
//             }
//           }
//           if(getFocusGlobalEventDet().row.data['InsertDefault']){
//             getFocusGlobalEventDet().row.data['inserted']         = true;
//             getFocusGlobalEventDet().row.data['InsertDefault']    = false; 
//           }else if(!getFocusGlobalEventDet().row.data['inserted']) 
//             getFocusGlobalEventDet().row.data['updated'] = true;

//         showsModal(false);
//         activarBandF9 = true;
//         setStockEntrer('row')

//         gridDet.current.instance.saveEditData();        
//         establecerFocus(indexRows,indexColum,true);
//         if(setRowFocusDet)setRowFocusDet(rows,id,true);
//       }
//     }    
//     const showsModal = async (valor) => {
//       setShows(valor);
//     };
//     const onInteractiveSearch = async (event) => {
//       var nameColumn  = await getFocusedColumnName();
//       var valor       = event.target.value;
//       var url         = columnModal.urlBuscador[0][nameColumn];
//       valor           = valor.trim();
//       if(valor.length === 0 ){
//         valor = 'null';
//       }
//       var dependencia = ArrayDependenciaGlobal;
//       try{
//         var method = 'POST';
//         var data   = {'valor':valor,'cod_empresa':sessionStorage.getItem('cod_empresa'),dependencia};
//         await Main.Request( url, method, data)
//             .then( response => {
//                 if( response.status == 200 ){
//                   setSearchData(response.data.rows);
//                 }
//         })
//       } catch (error) {
//         console.log("Error en onInteractiveSearch",error);
//       }
//     }
//     const getRowDataModal = async (url, tipo, data,dependencia)=>{
//       let dataRows = []
//       if(setActivarSpinner)setActivarSpinner(true)
//       try {
//           var method       = tipo;
//           data.valor       = 'null'
//           data.cod_empresa = sessionStorage.getItem('cod_empresa');
//           data.dependencia = dependencia;
//           await Main.Request(url,method,data)
//           .then((response)=>{        
//               if(response.data.rows){
//                 dataRows = response.data.rows;
//               }                    
//           });   
//         if(setActivarSpinner)setActivarSpinner(false)
//         return dataRows;
//       } catch (error) {
//         if(setActivarSpinner)setActivarSpinner(false)
//           console.log("Error en el metodo getRowDataModal ",error);
//       }
//     }
//     const cambiaFocus = async(tipo,e) => {
//       let indexColumn = await getColumnIndex(); 
//       let indexRow;
    
//       if(tipo == 'Abajo'){
//         indexRow    = await getRowIndex() + 1;

//         if(!_.isUndefined(page)){
//           var rowsCount = e.component.getVisibleRows().length, 
//             pageCount = e.component.pageCount(), 
//             pageIndex = e.component.pageIndex(),
//             key  = e.event && e.event.key,
//             info = await getFocusGlobalEventDetAux();
//             spinnerband = false

//             if(key && info.newRowIndex === rowsCount -1) {
//               spinnerband = true
//               setActivarSpinner(true)
//               if(info.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
//                   info.newRowIndex = 0;
//                   setRowIndex(info.newRowIndex);
//                   await e.component.saveEditData();
//                   e.component.pageIndex(pageIndex + 1).done(function() {
//                   e.component.option('focusedRowIndex', 0);
//                 });
//               }
//             }
//         }

        
//       } 
//       if(tipo == 'Arriba'){
//         indexRow    = await getRowIndex() - 1;

//         if(!_.isUndefined(page)){
//           var rowsCount = e.component.getVisibleRows().length, 
//           pageCount = e.component.pageCount(), 
//           pageIndex = e.component.pageIndex(),
//           key  = e.event && e.event.key,
//           info = await getFocusGlobalEventDetAux();
//           spinnerband = false

//           if(info.newRowIndex === 0 && pageIndex > 0) {
//               spinnerband = true
//               setActivarSpinner(true)

//               info.newRowIndex = rowsCount - 1;
//               setRowIndex(info.newRowIndex);
//               indexRow = info.newRowIndex;
//               e.component.pageIndex(pageIndex - 1).done(function() {
//               e.component.option('focusedRowIndex', rowsCount - 1);
//             });
//           }
//         }  
//       }
//       if(indexRow == -1) indexRow = 0;
//       if(indexColumn == -1) indexColumn = 0;
          
//       gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRow,indexColumn));
//     }
//     const onKeyDown = async (e)=>{
//       if(e.event.repeat){
//         e.event.preventDefault();
//         if(e.event.keyCode == 38){
//           if(bandera){
//             bandera = false;
//             await cambiaFocus('Arriba',e);
//             setTimeout( ()=>{
//               bandera = true
//               if(spinnerband)setActivarSpinner(false)
//             }, 40 );
//           }
//         }else if(e.event.keyCode == 40){
//           if(bandera){
//             bandera = false;
//             await cambiaFocus('Abajo',e);
//             setTimeout( ()=>{
//               bandera = true
//               if(spinnerband)setActivarSpinner(false)
//             }, 40 );
//           }
//         }
//       }
//       if(e.event.code == 'F7') e.event.preventDefault(); 
//       if(e.event.code == 'Escape' && !globalValidateDet){
//         setStockEntrer('row')
//       }
//       if(e.event.key == "Tab" ||e.event.key == "Enter"){
//         if(!e.event.repeat){
//           let indexColumn   = await getColumnIndex();        
//           let indexRow      = await getRowIndex();        
//           var visibleColumn = await gridDet.current.instance.getVisibleColumns()
//           var visiblerow    = await gridDet.current.instance.getVisibleRows()
//           if(visiblerow == undefined) visiblerow = []
//           if(indexColumn == -1) indexColumn = await 0;
//           if(indexRow    == -1) indexRow    = await 0;
//           if(!globalValidateDet) return
//           var columnaRequerido = ''
//           var Addband  = false
//           var AddRowban= newAddRow

//           if(maxFocus){
//             if(((visiblerow.length -1) == indexRow) && visibleColumn[indexColumn].name == maxFocus[0].hasta){
              
//               if(columnRequerido.length){

//                 for (let index = 0; index < columnRequerido.length; index++) {
//                   const element = columnRequerido[index];
//                   if(Addband) break
  
//                   for (let i = 0; i < visiblerow.length; i++) {
//                     const row = visiblerow[i].data;
//                     if(row[element.ID]){
//                       if(row[element.ID] === ''){
//                         Addband = true;
//                         columnaRequerido = {'label':element.label,'ID':element.ID}
//                         break
//                       }
//                     }else{
//                       Addband  = true;
//                       columnaRequerido = {'label':element.label,'ID':element.ID}
//                       break
//                     } 
  
//                   }
  
//                 }
//               }
//             }
//           }else{
//             if(((visiblerow.length -1) == indexRow) && indexColumn== (visibleColumn.length -1)){
//                 if(columnRequerido.length){
//                   for (let index = 0; index < columnRequerido.length; index++) {
//                     const element = columnRequerido[index];
//                     if(visiblerow[indexRow].data[element.ID]){
//                       if(visiblerow[indexRow].data[element.ID] === ''){
//                         Addband  = true;
//                         columnaRequerido = {'label':element.label,'ID':element.ID}
//                         break
//                       }
//                     }else{
//                       Addband  = true;
//                       columnaRequerido = {'label':element.label,'ID':element.ID}
//                       break
//                     }
//                   }
//                 }
//               }
//           }

          
//           let addNewRowAux = newAddRow
//           if(_.isUndefined(addNewRowAux)) addNewRowAux = true
//           if(permisos_especiales)if(_.contains(PermisoEspecial,permisos_especiales[0])) addNewRowAux = true;      
//           if(Addband && addNewRowAux && getbandBloqueoGrid()){  
//             gridDet.current.instance.option("focusedRowKey", 120);
//             gridDet.current.instance.clearSelection();            
//             e.event.preventDefault();        
//             banderaAddTabEnter = 0
//             setTimeout(()=>{
//               gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRow,columnaRequerido.ID)),100
//             })
//             return
//           }

//           if ((e.event.key === "Enter" || e.event.key == "Tab") && !e.event.shiftKey) {
//             if(maxFocus){
//               if(maxFocus[0].id === id && (visiblerow.length -1) == indexRow ){
//                 if(visibleColumn[indexColumn].name == maxFocus[0].hasta && (e.event.key == "Enter" || e.event.key == "Tab")){
//                   if(maxFocus[0].newAddRow && getbandBloqueoGrid()){
//                     if(!columnModal[maxFocus[0].hasta]){
//                       e.event.preventDefault();
//                       gridDet.current.instance.option("focusedRowKey", 120);
//                       gridDet.current.instance.clearSelection();
//                       AddRowban   = false
//                       banderaAddTabEnter = 0
//                       addRow();
//                     }  else if(e.event.target.classList.value == "" || (e.event.key == "Tab" && e.event.target.classList.value == 'dx-texteditor-input')){                      
//                       e.event.preventDefault();
//                       gridDet.current.instance.option("focusedRowKey", 120);
//                       gridDet.current.instance.clearSelection();
//                       addRowBand = true
//                       addRow();
//                     }
//                   }else{
//                     setTimeout(()=>{		  
//                         gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRow, indexColumn));
//                     },10)
//                   }
//                 }
//               }else if(visibleColumn[indexColumn].name == maxFocus[0].hasta){
//                 if(!e.component.hasEditData()) indexRow = indexRow + 1
//                 setTimeout(()=>{
//                   gridDet.current.instance.focus(gridDet.current.instance.getCellElement(indexRow,0));
//                 },10)
//               }
//             } else if(e.event.key == "Enter" || e.event.key == "Tab"){
//               let rowNew  = true;
//               if(AddRowban === false || _.isUndefined(!AddRowban)) rowNew = false
//               if(permisos_especiales)if(_.contains(PermisoEspecial,permisos_especiales[0])) rowNew = true;
  
//               rowDet                 = gridDet.current.instance.getDataSource();
//               var columnLength       = columnDet.length;
//               var rowIndex           = indexRow;
//               var columnIndex        = indexColumn;
              
//               if(rowDet._items.length - 1 === rowIndex    &&
//                 columnLength          - 1 === columnIndex &&
//                 rowNew                                    &&
//                 getbandBloqueoGrid()
//                 ){
//                   e.event.preventDefault();
//                   gridDet.current.instance.option("focusedRowKey", 120);
//                   gridDet.current.instance.clearSelection();
//                   AddRowban   = false
//                   banderaAddTabEnter = 0
//                   addRow();
//               }
//             } 
//           }

//         }else{
//           e.event.preventDefault()
//         }
//       }
//       if(e.event.key == "F6"){
//         e.event.preventDefault();
//         if(activateF6){
//           var infoPermiso = await Main.VerificaPermiso(FormName);
//           var operaciones   = await getTipoDeOperaciones()
//           var band = true;
//           var mensaje = ''
//           if(operaciones[0]){
//             if(infoPermiso[0].insertar != 'S'){
//               band = false;
//               mensaje = 'No tienes permiso para insertar'
//             }
//           }
//           if(band){
//             console.log('entro en este apartado');
//             if(funcionNuevo) funcionNuevo()
//           }else{
//             Main.message.warning({
//               content  : mensaje,
//               className: 'custom-class',
//               duration : `${2}`,
//               style    : {
//               marginTop: '4vh',
//               },
//             });
//           }
//           return;
//         }
//       }

//       if(e.event.key == "F10"){
//         e.event.preventDefault();
//         if(activateF10){
//           var infoPermiso = await Main.VerificaPermiso(FormName);
//           var operaciones   = await getTipoDeOperaciones()
//           var band = true;
//           var mensaje = ''
//           if(operaciones[0]){
//             if(infoPermiso[0].insertar != 'S'){
//               band = false;
//               mensaje = 'No tienes permiso para insertar'
//             }
//           }
//           if(operaciones[1]){
//             if(infoPermiso[0].actualizar !== 'S'){
//               band = false;
//               mensaje = 'No tienes permiso para actualizar'
//             }
//           }
//           if(operaciones[2]){
//             if(infoPermiso[0].borrar != 'S'){
//               band = false;
//               mensaje = 'No tienes permiso para eliminar'
//             }
//           }
//           if(band){
//             var fila = getFocusedRowIndex();
//             if(fila == -1) fila = 0;
//             await gridDet.current.instance.saveEditData();
//             await gridDet.current.instance.repaintRows([fila])
//             setActivarSpinner(true)
//             setTimeout(async()=>{
//               setActivarSpinner(false)
//               // if(globalValidateDet) validateSave(guardar);
//               validateSave(guardar);
//             },5);            
//           }else{
//             Main.message.warning({
//               content  : mensaje,
//               className: 'custom-class',
//               duration : `${2}`,
//               style    : {
//               marginTop: '4vh',
//               },
//             });
//           }
//         return;
//         }
//       }

//       var columnName    = await getFocusedColumnName();
//       var columnDetalle = await gridDet.current.instance.columnOption(columnName);
//       if(columnDetalle){
//         if(e.event.code == "Space" && columnDetalle.userDataType == "boolean" && columnDetalle.allowEditing){

//           e.event.preventDefault();
//           var rowsCheckbox    = await getEventValuesCheckbox();
//           var fila            = rowsCheckbox.newRowIndex;
//           if(fila == -1) fila = 0;
//           let eliminarFocusActivo          = document.getElementsByClassName("dx-cell-modified");
//           if(eliminarFocusActivo.length > 0){
//             document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
//           }

//           if(columnDetalle.cssClass == "grid-radio"){
            
//             let cambioCellInput = document.getElementsByClassName("dx-state-focused");
//             if(cambioCellInput.length === 0){
//               gridDet.current.instance.cellValue(fila, columnDetalle.index,true);
//             }else{             
//               gridDet.current.instance.cellValue(fila, columnDetalle.index,true);
//             }
//             await gridDet.current.instance.saveEditData();

//           }else{

//             let cambioCellInput = document.getElementsByClassName("dx-state-focused");
//             if(cambioCellInput.length === 0){
//               var valorCheckbox = !rowsCheckbox.rows[fila].values[columnDetalle.index]
//               gridDet.current.instance.cellValue(fila, columnDetalle.index,valorCheckbox);        
//             }else if(cambioCellInput.length === 2){
//               document.getElementsByClassName("dx-state-focused")[0].classList.remove("dx-state-focused")     
//             }
//             await gridDet.current.instance.saveEditData();
//           }
//         }
//       }
      
//       if(e.event.keyCode === 40 || e.event.keyCode === 38 || 
//          e.event.keyCode === 39 || e.event.keyCode === 37 ||
//          e.event.keyCode === 13 || e.event.keyCode === 9){
//          let eliminarFocusActivo = document.getElementsByClassName("dx-cell-modified");
//          if(eliminarFocusActivo.length > 0) document.getElementsByClassName("dx-cell-modified")[0].classList.remove("dx-cell-modified")
//       }
  
//       if((e.event.keyCode === 120 && (setEditarModalNew)) && (columnModal)){
//         if(Object.entries(columnModal).length > 0){
//           var ArrayDataDependencia = await validarDependencia(120);        
//           if(ArrayDataDependencia == true) return
//           e.event.preventDefault();
//           var columnName = await getFocusedColumnName();
//           if(columnModal[columnName]){
//             e.event.preventDefault();
//             var url          = columnModal.urlBuscador[0][columnName]
//             var AuxDatamodal = await getRowDataModal(url,'POST', {} ,ArrayDataDependencia)
//             var title = await columnModal.title[0][columnName];
//             setModalTitle(title)
//             setSearchColumns(columnModal[columnName])
//             setSearchData(AuxDatamodal);
//             setTipoDeBusqueda(columnName);           
//             setShows(true);
//           }
//         }    
//       }
//     }
//     const setCellValue = React.useCallback(async(newData, value, columnRowData, column)=>{
//       var newValue       = await value ? column.checkBoxOptions[0] : column.checkBoxOptions[1];
//       newData[column.ID] = await newValue;
//     },[]);
//     const onEditorPreparing = async (e)=>{
      
//       let columnNameEdit = e.name;
//       var rowsColumn = columnDet.filter( item => item.ID == columnNameEdit);
//       if(rowsColumn.length > 0){
//         if(rowsColumn[0].isnumber){
//           e.editorOptions.min = 0
//         }
//         if(rowsColumn[0].upper){
//           e.editorElement.classList = "uppercaseInputDatagrid";
//         }
//       }
//       if(e.dataType === "boolean"){
//         var className = $('.dx-cell-modified');
//         if(className){
//           $('.dx-cell-modified').removeClass("dx-cell-modified");
//         }
//       }
//       if(e.editorName === "dxNumberBox"){
//         e.editorOptions.step = 0;  
//       }
//       // para add min / max 
//       // if(e.parentType == 'dataRow' && e.dataType == 'number'){
//       //   e.editorOptions.min = 0 
//       // }
//     }
//     const onCellClick = async (e)=>{

//        if(!globalValidateDet){
//          e.event.preventDefault();
//          return;
//        }
//        if(e.rowType !== "header"){ 
//         if(e.column?.dataType){
//           if(e.column.dataType == "boolean" && e.cellElement.className.includes('grid-radio')){
//             let cambioCellInput = document.getElementsByClassName("dx-state-focused");
//             if(cambioCellInput.length === 0){
//               gridDet.current.instance.cellValue(e.rowIndex, e.cellElement.cellIndex,true);
//             }else{             
//               gridDet.current.instance.cellValue(e.rowIndex, e.cellElement.cellIndex,true);
//             }
//             await gridDet.current.instance.saveEditData();
//           }
//         }

//         if(e.row !== undefined){
//           setComponenteEliminar({'id':e.row.data.IDCOMPONENTE,'delete':canDelete === false ? false : true});
//           setComponenteEliminarDet({'id':e.row.data.IDCOMPONENTE,'delete':canDelete === false ? false : true})
         
//           if(e.columnIndex){
//             setFocusedColumnIndex(e.columnIndex)
//             setColumnIndex(e.columnIndex)
//           } 
//           if(e.rowIndex){
//             setFocusedRowIndex(e.rowIndex)
//             setRowIndex(e.rowIndex)
//             if(e.rowIndex == -1){
//               setFocusedRowIndex(0)
//               setRowIndex(0)
//             } 
//           }

//         } 

//         if(e.column){
//           var row = await getFocusGlobalEventDet()
//           setTimeout(()=>{
//             let fila    = row.rowIndex;
//             let columna = e.columnIndex;
//             if(fila === '-1') fila = 0;
//             if(maxFocus){
//               if(maxFocus[0].id == id && maxFocus[0].nextId == e.column.dataField){
//                 return
//               }
//             }
//           },25);
//           setFocusedColumnName(e.column.dataField);
//         }
//       }
//     }
//     const onFocusedCellChanged = (e)=>{
//       if(setFocusedCellChanged){
//         setFocusedCellChanged(e)
//       }
//     }
//     const setCellValueRadio = async (newData, value, columnData, column)=>{
//       column.grupoRadio.forEach(element => {
//         if(column.ID == element){
//           newData[column.id_valor] = column.valor;
//         }
//       });
//     }
//     const onFocusedRowChanging = async(e)=>{
//       var rowsCount = e.component.getVisibleRows().length,
//       pageCount     = e.component.pageCount(),
//       pageIndex     = e.component.pageIndex(),
//       key = e.event && e.event.key;
//       if(key && e.prevRowIndex === e.newRowIndex) {
//         if(e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
//             e.component.pageIndex(pageIndex + 1).done(function() {
//             e.component.option('focusedRowIndex', 0);
//           });
//         }else if(key !== "ArrowUp" && pageIndex === pageCount - 1){
//           e.component.option('focusedRowIndex', rowsCount);
//         } else if(e.newRowIndex === 0 && pageIndex > 0) {
//             e.component.pageIndex(pageIndex - 1).done(function() {
//             e.component.option('focusedRowIndex', rowsCount - 1);
//           });
//         }
//       }
//     }
//     return (
//         <div className={`paper-container ${ !_.isUndefined(heightHeaderClass) ? 'devExtreme_det' : null }`}>
//           <Paper className="paper-styles">
//           <Main.ModalDialogo
//             positiveButton={""}
//             negativeButton={"OK"}
//             negativeAction={handleCancel}
//             onClose={handleCancel}
//             setShow={visibleMensaje}
//             title={tituloModal}
//             imagen={imagen}
//             mensaje={mensaje}
//           />
//             <Main.FormModalSearch 
//               showsModal={showsModal}
//               setShows={shows}
//               title={modalTitle}
//                   componentData={
//                       <Main.NewTableSearch
//                         onInteractiveSearch={onInteractiveSearch}
//                         searchData={searchData}
//                         columns={searchColumns}
//                         modalSetOnClick={modalSetOnClick}
//                         tipoDeBusqueda={tipoDeBusqueda}
//                       />
//                   }
//               descripcionClose=""
//               descripcionButton=""
//               actionAceptar=""
//           />
//               <DataGrid
//                   id={id}
//                   key="ID"
//                   ref={gridDet}
//                   showColumnLines={true}
//                   repaintChangesOnly={true}
//                   showRowLines={true}
//                   rowAlternationEnabled={false}
//                   autoNavigateToFocusedRow={false}
//                   focusedRowEnabled={true}
//                   focuRowEnable
//                   allowColumnReordering={true}
//                   focusRowEnabled={true}
//                   allowColumnResizing={false}
//                   errorRowEnabled={false}
//                   showBorders={true}
//                   height={ altura != undefined ? altura : 105 }
//                   onCellClick={onCellClick}
//                   onEditorPreparing={onEditorPreparing}
//                   onRowUpdating={onRowUpdating}
//                   onKeyDown={onKeyDown}
//                   onFocusedCellChanging={onFocusedCellChanging}
//                   onFocusedRowChanged={onFocusedRowChanged}
//                   onFocusedCellChanged={onFocusedCellChanged}
//                   //
//                   onFocusedRowChanging={onFocusedRowChanging}
//                   remoteOperations={true}
//                   wordWrapEnabled={true}
//               >
//                 { !_.isUndefined(buscadorGrid) ? <SearchPanel visible={true} /> : null}
//                 <Scrolling mode={_.isUndefined(ScrollingMode) ? 'none' : 'virtual'} />

//                   <Sorting mode="single" />
//                   <KeyboardNavigation
//                       editOnKeyPress={true}
//                       enterKeyAction="moveFocus"
//                       enterKeyDirection={stockEntrer}// none
//                       onEnterKey
//                   />
//                   <Paging enabled={false} />
//                   <Editing
//                       mode="cell"
//                       allowUpdating={true}
//                       allowAdding={false}
//                       confirmDelete={false}
//                       selectTextOnEditStart="click"
//                   />
//                    {columnDet.map((column) => (
//                       column.multiple_header ?

//                         <Column caption   ={column.label   } 
//                                 cssClass  = {"grid-multihead"}
//                                 key       ={column.ID      }
//                                 dataField ={column.ID      } 
//                                 width     ={column.width   } 
//                                 minWidth  ={column.minWidth} 
//                                 alignment ={column.align   } >
//                           {
//                             column.multiple_column.map((column_multipel) => (
//                               column.checkbox 
//                               ?
//                                 <Column 
//                                   dataType           = {"boolean"         } 
//                                   dataField          = {column_multipel.ID         }
//                                   width              = {column_multipel.width      } 
//                                   minWidth           = {column_multipel.minWidth   }
//                                   maxWidth           = {column_multipel.maxWidth   }
//                                   alignment          = {column_multipel.align      }
//                                   allowEditing       = {column_multipel.disable ? false : ((_.isUndefined(column_multipel.disable)) && (_.isUndefined(column_multipel.edit))) ? true : false}
//                                   key                = {column_multipel.ID         }
//                                   caption            = {column_multipel.label      }              
//                                   // headerCellRender   = {(e)=>renderHeader(e,column_multipel)}
//                                   headerCellRender   = {
//                                     doNotsearch != undefined && columBuscador !== undefined ? (e)=>renderHeaderAux(e,column_multipel) : (e)=>renderHeader(e,column_multipel)
//                                   }
//                                   allowSorting       = {!opcionComparar(column_multipel.ID, notOrderByAccion)}
//                                   setCellValue       = {(newData, value, columnData)=>setCellValue(newData, value, columnData, column_multipel)}
//                                   calculateCellValue = {(e)=>opcionComparar(e[column_multipel.ID], column.checkBoxOptions[0])}
//                                 /> 
//                               :
//                                 column.radio 
//                               ?
//                                 <Column 
//                                   dataType           = {"boolean"         }
//                                   cssClass           = {"grid-radio"      }
//                                   dataField          = {column_multipel.ID         }
//                                   width              = {column_multipel.width      }
//                                   minWidth           = {column_multipel.minWidth   }
//                                   maxWidth           = {column_multipel.maxWidth   }
//                                   alignment          = {column_multipel.align      }
//                                   allowEditing       = {column_multipel.disable ? false : ((_.isUndefined(column_multipel.disable)) && (_.isUndefined(column_multipel.edit))) ? true : false}
//                                   key                = {column_multipel.ID         }
//                                   caption            = {column_multipel.label      }
//                                   headerCellRender   = {(e)=>renderHeader(e,column_multipel)}
//                                   allowSorting       = {!opcionComparar(column_multipel.ID, notOrderByAccion)}
//                                   setCellValue       = {(newData, value, column_multipelData)=>setCellValueRadio(newData, value, column_multipelData,column_multipel)}
//                                   calculateCellValue = {(e)=>opcionComparar(e[column_multipel.id_valor], column_multipel.valor)}
//                                 /> 
//                               : 
//                                 <Column 
//                                   dataField          = {column_multipel.ID          }
//                                   key                = {column_multipel.ID          }
//                                   caption            = {column_multipel.label       }
//                                   dataType           = {column_multipel.isnumber ? 'number' :  column.isdate ? 'date'   : null}
//                                   cellRender         = {!_.isUndefined(column_multipel.formatter) ? (e)=>cellRender(e,column_multipel) : null}
//                                   allowEditing       = {column_multipel.disable  ? false : true }
//                                   width              = {column_multipel.width       } 
//                                   minWidth           = {column_multipel.minWidth    }
//                                   maxWidth           = {column_multipel.maxWidth    }
//                                   alignment          = {column_multipel.align       }
//                                   allowSorting       = {!opcionComparar(column_multipel.ID, notOrderByAccion)}
//                                   editorOptions      = {column_multipel.isnumber ? {showClearButton:false} : column_multipel.isdate ?  { useMaskBehavior:true, showClearButton:true} 
//                                   : { valueChangeEvent: "input"  } } 
//                                   format             = {column_multipel.isnumber ? "#,##0" : column_multipel.isdate ? 'dd/MM/yyyy' : ''}
//                                   headerCellRender   = {
//                                     doNotsearch != undefined && columBuscador !== undefined ? (e)=>renderHeaderAux(e,column_multipel) : (e)=>renderHeader(e,column_multipel)
//                                   }
//                                 > 
//                                   {
//                                     column.isOpcionSelect ?
//                                         <Lookup
//                                             dataSource={optionSelect[column_multipel.ID]}
//                                             valueExpr="ID"
//                                             displayExpr="NAME"
//                                         />
//                                     : null
//                                   }
//                                 </Column>
//                           ))}
//                         </Column>
//                       :
//                       column.checkbox 
//                         ?
//                           <Column 
//                             dataType           = {"boolean"         } 
//                             dataField          = {column.ID         }
//                             width              = {column.width      } 
//                             minWidth           = {column.minWidth   }
//                             maxWidth           = {column.maxWidth   }
//                             alignment          = {column.align      }
//                             allowEditing       = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
//                             key                = {column.ID         }
//                             caption            = {column.label      }              
//                             // headerCellRender   = {(e)=>renderHeader(e,column)}
//                             headerCellRender   = {
//                               doNotsearch != undefined && columBuscador !== undefined ? (e)=>renderHeaderAux(e,column) : (e)=>renderHeader(e,column)
//                             }
//                             allowSorting       = {!opcionComparar(column.ID, notOrderByAccion)}
//                             setCellValue       = {(newData, value, columnData)=>setCellValue(newData, value, columnData, column)}
//                             calculateCellValue = {(e)=>opcionComparar(e[column.ID], column.checkBoxOptions[0])}
//                         /> 
//                       :
//                         column.radio 
//                         ?
//                           <Column 
//                             dataType           = {"boolean"         }
//                             cssClass           = {"grid-radio"      }  
//                             dataField          = {column.ID         }
//                             width              = {column.width      }
//                             minWidth           = {column.minWidth   }
//                             maxWidth           = {column.maxWidth   }
//                             alignment          = {column.align      }
//                             allowEditing       = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
//                             key                = {column.ID         }
//                             caption            = {column.label      }
//                             headerCellRender   = {(e)=>renderHeader(e,column)}
//                             allowSorting       = {!opcionComparar(column.ID, notOrderByAccion)}
//                             setCellValue       = {(newData, value, columnData)=>setCellValueRadio(newData, value, columnData,column)}
//                             calculateCellValue = {(e)=>opcionComparar(e[column.id_valor], column.valor)}
//                         /> 
//                       : 
//                         <Column 
//                           dataField          = {column.ID          }
//                           key                = {column.ID          }
//                           caption            = {column.label       }
//                           dataType           = {column.isnumber ? 'number' :  column.isdate ? 'date'   : null}
//                           cellRender         = {!_.isUndefined(column.formatter) ? (e)=>cellRender(e,column) : null}
//                           allowEditing       = {column.disable ? false : true }
//                           width              = {column.width       } 
//                           minWidth           = {column.minWidth    }
//                           maxWidth           = {column.maxWidth    }
//                           alignment          = {column.align       }
//                           allowSorting       = {!opcionComparar(column.ID, notOrderByAccion)}
//                           editorOptions      = {column.isnumber ? {showClearButton:false} : column.isdate ?  { useMaskBehavior:true, showClearButton:true} 
//                           : { valueChangeEvent: "input"  } } 
//                           format             = {column.isnumber ? "#,##0" : column.isdate ? 'dd/MM/yyyy' : ''}
//                           // headerCellRender   = {(e)=>renderHeader(e,column)}
//                           headerCellRender   = {
//                             doNotsearch != undefined && columBuscador !== undefined ? (e)=>renderHeaderAux(e,column) : (e)=>renderHeader(e,column)
//                           }
//                         > 
//                           {
//                             column.isOpcionSelect ?
//                                 <Lookup
//                                     dataSource={optionSelect[column.ID]}
//                                     valueExpr="ID"
//                                     displayExpr="NAME"
//                                 />
//                             : null
//                           }
//                         </Column>
//                   ))}
//                   <LoadPanel enabled={false} showPane={false} visible={false} showIndicator={false} />
//                   { (!_.isUndefined(page) ) ? <Paging defaultPageSize={ page} /> : null}
//                   { (!_.isUndefined(page))  ? <Pager
//                                                 visible={true}
//                                                 allowedPageSizes={false}
//                                                 displayMode={'full'}
//                                                 showPageSizeSelector={true}
//                                                 showInfo={true}
//                                                 showNavigationButtons={true} 
//                                               /> : null}       
//               </DataGrid>
//               </Paper>
// 	      </div>
//     );
// });
// export default DevExtremeDet;