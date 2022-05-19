import React, { memo } from 'react';
import Main            from "../Main";
import styles          from "./Styles";
import ButtonUpload    from './ButtonUpload'
import Button          from "@material-ui/core/Button";
import DataGrid, { Column, LoadPanel, Lookup, Sorting, Scrolling } from "devextreme-react/data-grid";
import DataSource      from "devextreme/data/data_source";
import ArrayStore      from "devextreme/data/array_store";  
import { setModifico } from './ButtonCancelarUpload';
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
var banf10 = true;
var datosAux  = []
const removeDatosAux = ()=>{
    datosAux = []
}
const DevExtremeUpload = memo(({ column , notOrder, id  , altura, guardar , 
                                FormName, setActivarSpinner ,url_desc }) => {
    const classes = styles();
    const Grid    = React.useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        if(banf10){
          save();
          banf10 = false;
        }else{
          banf10 = true;
        } 
        
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    //State
    const [ loadPanelEnabled, setloadPanelEnabled ] = React.useState(true);
    const [ rows		    , setRows       	  ] = React.useState([]);
    //-----------------------Estado Modal mensaje ----------------------------------
    const [visibleMensaje	 , setVisibleMensaje   ] = React.useState(false);
    const [mensaje			 , setMensaje	       ] = React.useState();
    const [imagen			 , setImagen		   ] = React.useState();
    const [tituloModal		 , setTituloModal	   ] = React.useState();
    const renderHeader = (e,column) => {
        return (
          <>
          { opcionComparar(column.ID)
            ? 
              <div  id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : "horizontalDatagrid"}
                    key={column.ID}
                >
                {column.label}
              </div>
            :
              <Button   
                    key={column.ID}
                    id={column.ascendente ? "ascendeteDataGrid"  : column.vertical ? "verticalDataGrid" : null}
                    className={classes.selectHeader}
                    disabled={true}
                    >
                  {column.label}
            </Button>
          }
          </>
        );
    }
    const setCellValue = React.useCallback(async(newData, value, columnRowData, column)=>{
        var newValue       = await value ? column.checkBoxOptions[0] : column.checkBoxOptions[1];
        newData[column.ID] = await newValue;
    },[]);
    const setCellValueRadio = React.useCallback(async(newData, value, columnData, column)=>{
        column.grupoRadio.forEach(element => {
          if(column.ID == element){
            newData[column.id_valor] = column.valor;
          }
        });
    },[]);
    const setUpload = React.useCallback((e) => {
        datosAux.pop();
        datosAux = e;
    }, []);
    const cargarRow = React.useCallback(async()=>{
        setActivarSpinner(true)        
        var datosUpload = datosAux
        if(datosUpload.length){
            var datos = {   cod_empresa:sessionStorage.getItem('cod_empresa'),
                            cod_usuario:sessionStorage.getItem('cod_usuario'),
                            valor:datosUpload
                        }
            try {
                await Main.Request(url_desc,'POST',datos).then(async(response)=>{
                    var resp = response.data.outBinds                    
                    if(resp.ret == 1){
                        setRows(resp.row);
                        const cargar_row = new DataSource({
                            store: new ArrayStore({
                                data: resp.row,
                            }),
                            key: 'ID'
                        })
                        Grid.current.instance.option('dataSource', cargar_row)
                        setTimeout(()=>{
                            setActivarSpinner(false);
                            Grid.current.instance.focus(Grid.current.instance.getCellElement(0,0))
                        },50)
                    }else{
                        setActivarSpinner(false);
                        showModalMensaje('Atención!','alerta',resp.p_mensaje);
                    }
                })                    
            } catch (error) {
                setActivarSpinner(false);
                console.log(error)
            }            
        }else{
            setActivarSpinner(false);
            Main.message.info({
                content  : `No se han encontrado registro para cargar!!`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                  marginTop: '2vh',
                },
            })
        }
    },[id]);
    const save = async()=>{
        let info = await rows
        if(info !== null) {
            if(info.length >0){
                guardar(info);
            }else{
                Main.message.info({
                    content  : `No se han encontrado registro para Guardar!!`,
                    className: 'custom-class',
                    duration : `${2}`,
                    style    : {
                      marginTop: '2vh',
                    },
                })    
            }
        }else{
            Main.message.info({
                content  : `No se han encontrado registro cargado!!`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                  marginTop: '2vh',
                },
            })
        }
    };
    const cancelar = (e)=>{
        var elements = document.getElementsByClassName(id);
        Array.prototype.filter.call(elements, function(element){
            element.style.position = 'absolute';
        });
        setModifico(id)
        const cargar_row = new DataSource({
            store: new ArrayStore({
            data: [],
            }),
            key: 'ID'
        })
        Grid.current.instance.option('dataSource', cargar_row);
        Grid.current.instance.saveEditData();
        removeDatosAux();
        setRows([])
    }
    const showModalMensaje = (titulo, imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    };
    const handleCancel = async() => {
        setVisibleMensaje(false)
    };
    const onKeyDown =(e)=>{
        if(e.event.keyCode == 121){
            e.event.preventDefault()
            return
        }
    };
    const onContentReady = () => {
        setloadPanelEnabled(false);
    };
    return (
        <>
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
         <div className="paper-container">
            <Main.Paper className="paper-style">           
                <ButtonUpload
                    guardar={save}
                    cancelar={cancelar}
                    agregar={cargarRow}
                    setDatos={setUpload}
                    id={id}
                    FormName={FormName}            
                />                
                    <DataGrid
                        id="ID"
                        ref={Grid}                        
                        showColumnLines={true}
                        showRowLines={true}
                        focusedRowEnabled={true}                        
                        errorRowEnabled={false}
                        showBorders={true}
                        height={ altura != undefined ? altura : 105 }
                        onKeyDown={onKeyDown}                        
                        onContentReady={onContentReady}
                    >
                        <Sorting mode="none" />
                        <Scrolling mode="virtual" />

                        {column.map((column) => (
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
                                    headerCellRender   = { (e)=>renderHeader(e,column)}
                                    allowSorting       = {!opcionComparar(column.ID, notOrder)}
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
                                    allowSorting       = {!opcionComparar(column.ID, notOrder)}
                                    setCellValue       = {(newData, value, columnData)=>setCellValueRadio(newData, value, columnData,column)}
                                    calculateCellValue = {(e)=>opcionComparar(e[column.id_valor], column.valor)}
                                /> 
                            :
                            <Column 
                                dataField          = {column.ID          }
                                key                = {column.ID          }
                                caption            = {column.label       }
                                dataType           = {column.isnumber ? 'number' :  column.isdate ? 'date' : null }
                                allowEditing       = {column.disable ? false : true }
                                width              = {column.width       } 
                                minWidth           = {column.minWidth    }
                                maxWidth           = {column.maxWidth    }
                                alignment          = {column.align       }
                                allowSorting       = {!opcionComparar(column.ID, notOrder)}
                                editorOptions      = {column.isnumber ? {showClearButton:false} : column.isdate ?  { useMaskBehavior:true, showClearButton:true} 
                                : { valueChangeEvent: "input"  } } 
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
                            <LoadPanel enabled={loadPanelEnabled} />
                        </DataGrid>
                </Main.Paper>
            </div>
        </>
    );
});
export default DevExtremeUpload;