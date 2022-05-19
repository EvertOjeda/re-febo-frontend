// react
import React from 'react';
import { v4 as uuidID } from 'uuid';
import _ from 'underscore';
import Button from '@material-ui/core/Button';
import styles from './Styles';
import DataGrid, {
	Column  , Editing,   Paging,    
  	Lookup  , KeyboardNavigation,
	Sorting ,   LoadPanel,Pager
} from "devextreme-react/data-grid";
var focusGlobalEvent;
const setFocusGlobalEvent = (valor)=>{
  focusGlobalEvent = valor;
}
const getFocusGlobalEvent = ()=>{
  return focusGlobalEvent;
}

// const columns = [
//     { ID: 'COD_MARCA'    , label: 'Marca'        , width: 80      , align:'left'   , requerido:true , upper:true},
//     { ID: 'COD_TIPO'     , label: 'Tipo'         , width: 80      , align:'left'   , requerido:true , upper:true},
//     { ID: 'DESCRIPCION'  , label: 'Descripción'  , minWidth: 190  , align:'left'   , requerido:true , upper:true},
//     { ID: 'CANT_PUNTO'   , label: 'Puntos'       , width: 150     , align:'center'},
// ];
const doNotsearch      = ['CARGA_META','ESTADO'];
const notOrderByAccion = []; 
const TestDetalle = React.memo(({ line, gridDet,columns,page,cellRender, columBuscador})=>{
    const classes        = styles();
    // const gridDetalle		 = React.useRef();
    const cod_empresa		 = sessionStorage.getItem('cod_empresa');
    const cod_usuario		 = sessionStorage.getItem('cod_usuario');
    //Column
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
    const renderHeader = (e,column) => {
        return (
          <>
          { opcionComparar(column.ID, doNotsearch)
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
    // Detalle
    const onFocusedRowChangedDetalle = async(e)=>{
      setFocusGlobalEvent(await e);
      console.log(e);

    }
    const onFocusedCellChangingDetalle = async(e)=> {
      // setEventValuesCheckbox(e);
      // setFocusedColumnName(e.columns[e.newColumnIndex].dataField);
      // setFocusedColumnIndex(e.newColumnIndex);
      // let permisoEdit     = await getPermiso(FormName,'U')
      // var dataColumn      = getFocusedColumnName();
      // if(columnEditDisable.length > 0){
      //   for (let i = 0; i < columnEditDisable.length; i++) {
      //     const items = columnEditDisable[i];
          
      //     if(items.ID === dataColumn && permisoEdit && e.rows[e.newRowIndex].data.inserted){
      //       setEditarModalNew = true;
      //       e.columns[e.newColumnIndex].allowEditing = true
      //       // 
      //       break;
      //     }
      //     if(items.ID === dataColumn && permisoEdit && items.editModal == true){
      //       e.columns[e.newColumnIndex].allowEditing = true          
      //       setEditarModalNew = true
      //     }
      //     if(items.ID === dataColumn && permisoEdit && items.editModal == false){
      //       e.columns[e.newColumnIndex].allowEditing = false
      //        setEditarModalNew = false
      //     }
          
      //     if(items.ID === dataColumn && permisoEdit && items.Pk){
      //       e.columns[e.newColumnIndex].allowEditing = false
      //         setEditarModalNew = false
      //     }      
      //   }
      // }
      if(e.event){
        if (e.event.key === "Enter") {
          let addNewRow  		= true;        
          var columnLength    = ColumnsTipoCartera.length;
          var rowIndex        = e.newRowIndex;
          var columnIndex     = e.newColumnIndex;
          var prevColumnIndex = e.prevColumnIndex;
          if (
            line.length - 1 === rowIndex        &&
            columnLength     - 1 === columnIndex     &&
            columnLength     - 1 === prevColumnIndex &&
            addNewRow
          ) {
            addRow();
          }
        }
      }
    }
    const addRow = async() => {    
      var rowIndex = 0      
      var datos = getFocusGlobalEvent();
      if(datos){
        rowIndex = await gridDetalle.current.instance.getRowIndexByKey(datos.row.data.ID);
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
        COD_USUARIO: cod_usuario,
      //   Headkey    : isNewHaedKey,
      }]
      // if( !_.isUndefined(props.initialRow) ){
      //   if(props.initialRow.length > 0){
      // 	for (let i = 0; i < props.initialRow.length; i++) {
      // 	  const item = props.initialRow[i];
      // 	  row[0][Object.keys(item)] = item[Object.keys(item)];
      // 	}
      //   }
      // }
      ColumnsTipoCartera.forEach(async element => {
        if(element.isdate)         row[0][element.ID] = moment();
        if(element.checkbox)       row[0][element.ID] = element.checkBoxOptions[1];  
        if(element.isOpcionSelect){
        _.flatten(_.filter(optionSelect[element.ID], function(item){
          if (item.isNew) row[0][element.ID] = item.ID;
        }));
        } 
      });
      setLine(line.concat(line.splice(rowIndex, 0, ...row)));      
      setTimeout(()=>{		  
        gridDetalle.current.instance.repaintRows([rowIndex])
        gridDetalle.current.instance.saveEditData();
      },90);
    }
    const onKeyDown = (e)=>{
      console.log(e)
    }
    return(
        <DataGrid
            key="ID"
            ref={gridDet}
            // showColumnLines={true}
            // repaintChangesOnly={true}
            // showRowLines={true}
            // rowAlternationEnabled={false}
            // autoNavigateToFocusedRow={false}
            // focusedRowEnabled={true}
            // focuRowEnable
            // allowColumnReordering={true}
            // focusRowEnabled={true}
            // allowColumnResizing={false}
            // errorRowEnabled={false}
            // showBorders={true}
            // showBorders={true}
            height="350"
            // focusedRowKey={focusedRowKey}
            // autoNavigateToFocusedRow={this.state.autoNavigateToFocusedRow}
            // onFocusedRowChanging={onFocusedRowChanging}
            // onFocusedRowChanged={onFocusedRowChanged}
            // onKeyDown={onKeyDown} 
            onFocusedCellChanging={onFocusedCellChangingDetalle}
            onFocusedRowChanged={onFocusedRowChangedDetalle}
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
              <Column 
                dataField         = {column.ID          }
                key               = {column.ID          }
                caption           = {column.label       }
                dataType          = {column.isnumber ? 'number' :  column.isdate ? 'date' : column.checkbox ? 'boolean' : null }
                allowEditing      = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
                width             = {column.width       } 
                cellRender         = {!_.isUndefined(column.formatter) ? (e)=>cellRender(e,column) : null}
                minWidth          = {column.minWidth    }
                maxWidth          = {column.maxWidth    }
                alignment         = {column.align       }
                allowSorting      = {!opcionComparar(column.ID, notOrderByAccion)}
                editorOptions     = {column.isnumber ? {showClearButton:false} : column.isdate ?  { useMaskBehavior:true, showClearButton:true} : null }
                format            = {column.isnumber ? "#,##0" : column.isdate ? 'dd/MM/yyyy' : ''}
                headerCellRender  = {(e)=>renderHeader(e,column)}
                > 
                {
                  column.isOpcionSelect ?
                    <Lookup
                      dataSource={optionSelect[column.ID]}
                      valueExpr="ID"
                      displayExpr="NAME"
                    />
                  : ''
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
    )
})
export default TestDetalle;