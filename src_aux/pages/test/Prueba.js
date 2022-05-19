import React, { memo } from "react";
import _ from 'underscore';
import Main from "../../components/utils/Main";
import {
    DataGrid,
    Scrolling,
    Column
  } from 'devextreme-react/data-grid';
  import CustomStore from 'devextreme/data/custom_store';

const Prueba = memo(( {columnDet, grid}) => {

    
    


    const store = new CustomStore({
        key: 'ID',
        load(loadOptions) {
            return Main.Request(`/st/stmarart/prueba/${sessionStorage.getItem('cod_empresa')}/${grid.current.instance}`,'POST',[])
                .then( (response) => {
                    var content = {
                        data: response.data.rows,
                        totalCount: response.data.rows.length
                    };
                    return content;
                })
        }
    });

    return (
        <DataGrid
            dataSource={store}
            showBorders={true}
            // height={600}
            remoteOperations={true}
        >
            <Scrolling mode="virtual" />
            {columnDet.map((column) => (
                <Column 
                    dataField          = {column.ID          }
                    key                = {column.ID          }
                    caption            = {column.label       }
                    dataType           = {column.isnumber ? 'number' :  column.isdate ? 'date' : column.checkbox ? 'boolean' : null }
                    allowEditing       = {column.disable ? false : ((_.isUndefined(column.disable)) && (_.isUndefined(column.edit))) ? true : false}
                    width              = {column.width       } 
                    minWidth           = {column.minWidth    }
                    maxWidth           = {column.maxWidth    }
                    alignment          = {column.align       }
                    // allowSorting       = {!opcionComparar(column.ID, notOrderByAccion)}
                    editorOptions      = {column.isnumber ? {showClearButton:false} : column.isdate ?  { useMaskBehavior:true, showClearButton:true} : null }
                    format             = {column.isnumber ? "#,##0" : column.isdate ? 'dd/MM/yyyy' : ''}
                    // headerCellRender   = {(e)=>renderHeader(e,column)}
                    // setCellValue       = {(newData, value, columnData)=>setCellValue(newData, value, columnData, column)}
                    // calculateCellValue = {column.checkbox  ? (e)=>opcionComparar(e[column.ID], column.checkBoxOptions[0]) : undefined} 
                            
                    // setCellValue       = { column.checkbox  ? (newData, value, columnData)=>setCellValue(newData, value, columnData, column) : null}
                    
                    // editCellRender     = { column.checkbox  ? dxSwitchYesNo : null }   
                    // editCellRender     = { column.checkbox  ? (e)=> handleCheckBox(e, column.checkBoxOptions, column.ID) : null }   
                    > 
                </Column>
            ))}

            

            
            
        </DataGrid>
    );
});

export default Prueba;
