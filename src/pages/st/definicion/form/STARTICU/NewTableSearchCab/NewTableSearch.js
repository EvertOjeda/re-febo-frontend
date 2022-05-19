import React              from 'react';
import Input              from '@material-ui/core/Input';
import InputAdornment     from '@material-ui/core/InputAdornment';
import SearchIcon         from '@material-ui/icons/Search';
import styles             from './Styles';
import _                  from "underscore"
import DataGrid, {
    Column ,    Editing ,   Paging , Scrolling,
    KeyboardNavigation  , LoadPanel, Sorting  } from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
import "./NewTableSearch.css";

var dataRows;
const setDataRows = async(valor)=>{
    dataRows = await valor;
}
const getDataRows = ()=>{
    return dataRows;
}
var dataRowsKey;
const setDataRowskey = async(valor)=>{
    dataRowsKey = await valor;
}
const getDataRowsKey = ()=>{
    return dataRowsKey;
}
var focusedRowIndex= -1; 
export const setFocusedRowIndex = async (valor)=>{
    focusedRowIndex = await valor;
}
export const getFocusedRowIndex = ()=>{
  return focusedRowIndex;
}

const NewTableSearch = ({ grid                 , searchData           ,
                          columns              , onInteractiveSearch  ,
                          modalSetOnClick      , tipoDeBusqueda       ,
                          cancelarModal 
                        }) => {
    
    const classes               = styles();
    const onFocusedRowChanging = (e) =>{
        var rowsCount = e.component.getVisibleRows().length,
        pageCount = e.component.pageCount(),
        pageIndex = e.component.pageIndex(),
        key = e.event && e.event.key;
    
      if(key && e.prevRowIndex == e.newRowIndex) {
        if(e.newRowIndex == rowsCount - 1 && pageIndex < pageCount - 1) {
          e.component.pageIndex(pageIndex + 1).done(function() {
            e.component.option('focusedRowIndex', 0);
          });
        } else if(key !== "ArrowUp" && pageIndex == pageCount - 1){
            e.component.option('focusedRowIndex', rowsCount);
        } else if(e.newRowIndex == 0 && pageIndex > 0) {
            e.component.pageIndex(pageIndex - 1).done(function() {
            e.component.option('focusedRowIndex', rowsCount - 1);
          });
        }
      }        
    }
    const onFocusedRowChanged = async (e)=>{
        setDataRows( await e.row.values);
        setDataRowskey(e.row.data);
    }
    const onRowDblClick = async (e)=>{
        setFocusedRowIndex(-1);
        modalSetOnClick(await e.values, tipoDeBusqueda, Object.keys(e.data))
    }
    const onKeyDown = async (e)=>{
        if(e.event.keyCode !== 13){return;}
        else{ setFocusedRowIndex(-1);
            var keyColumn = Object.keys(getDataRowsKey());
            modalSetOnClick(await getDataRows(), tipoDeBusqueda, keyColumn);
        }
    }
    const keyDownInput = async(e)=>{

        if(e.keyCode === 13){
            var keyColumn = Object.keys(getDataRowsKey());
            modalSetOnClick(await getDataRows(), tipoDeBusqueda, keyColumn);
        }

        var key = e.which;
        if(key == '27'){
            e.preventDefault();
          if(cancelarModal){
             cancelarModal()
            }
        };
        if(key == '38'){
			e.preventDefault();
            var index = await getFocusedRowIndex() - 1;
			if(index < 0){
				index = 0;
			}
			setFocusedRowIndex(index);
            grid.current.instance.focus(grid.current.instance.getCellElement(index,0));
        }
		if(key == '40'){
			e.preventDefault();
            var searchData = await grid.current.instance.getDataSource()._items
            var index = await getFocusedRowIndex() + 1;
			if(index > searchData.length - 1){
				index = searchData.length - 1;
			}
			setFocusedRowIndex(index);
            grid.current.instance.focus(grid.current.instance.getCellElement(index,0));
		}
    }
    const establecerFocus = ()=>{
        setTimeout( ()=>{
            grid.current.instance.focus(grid.current.instance.getCellElement(0,0));            
        },100);
    }
    React.useEffect(() => {
        establecerFocus();
        setTimeout(()=>document.getElementById("searchInput").focus(),200);
	}, []);
    const onFocusedCellChanging = (e) => {
		e.isHighlighted = false;  
	}
    
    return (
        <>
            <Input
                className={classes.input}
                style={{padding: '2px 0px !important',fontSize: '12px'}}
                id="searchInput"
                onChange={onInteractiveSearch}
                autoComplete="off"
                onKeyDown={keyDownInput}
                startAdornment={
                    <InputAdornment position="start" >
                        <SearchIcon className={classes.searchIcon} />
                    </InputAdornment>
                }
            />
            <div style={{marginTop:"40px", width:"100%"}}>
            <div id="data-grid-modal">
                <DataGrid                
                    ref={grid}
                    showColumnLines={false}
                    showRowLines={true}
                    showBorders={false}
                    rowAlternationEnabled={false}
                    onFocusedCellChanging={onFocusedCellChanging}
                    focusedRowEnabled={true}
                    height={290}
                    onFocusedRowChanging={onFocusedRowChanging}
                    onFocusedRowChanged={onFocusedRowChanged}
                    onKeyDown={onKeyDown}
                    onRowDblClick={onRowDblClick}
                    errorRowEnabled={false}
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
                                        {columns.map((column) => (
                            <Column 
                                dataField        = {column.ID          }
                                key              = {column.ID          }
                                caption          = {column.label       }
                                allowEditing     = {false              }
                                alignment        = {column.align       }
                                width            = {column.width       } 
                                minWidth         = {column.minWidth    }
                                maxWidth         = {column.maxWidth    }
                            />
                        ))}
                    <LoadPanel disabled={true} showPane={false} visible={false} showIndicator={false} />                    
                    <Scrolling mode="standard" />
                   </DataGrid>
                </div>
            </div>
        </>
    );
};
export default NewTableSearch;