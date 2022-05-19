export const add_dataRequerido = async (grid,idcolumns)=>{
  var Addband = false
  var columnaRequerido = []      
  if(grid.columna[idcolumns]){
    var rowDet = grid[idcolumns].current.instance.getDataSource() !== undefined ? grid[idcolumns].current.instance.getDataSource()._items : []
    for (let index = 0; index < grid.columna[idcolumns].length; index++) {
      const element = grid.columna[idcolumns][index];
        if(element.requerido){
          for (let i = 0; i < rowDet.length; i++) {
            const items = rowDet[i];
            if(items[element.ID]){
              if(items[element.ID] === ''){
                Addband  = true;
                var filas     = grid[idcolumns].current.instance.getRowIndexByKey(items); 
                if(filas == -1) filas = 0 
                var indexComun = grid[idcolumns].current.instance.getCellElement(filas,element.ID);
                columnaRequerido = {'label':element.label,'ID':element.ID, indexRow:filas, indexComun:indexComun?.cellIndex}
                break
              }
            }else{
              Addband  = true;
              var filas      = grid[idcolumns].current.instance.getRowIndexByKey(items); 
              if(filas == -1) filas = 0 
              var indexComun = grid[idcolumns].current.instance.getCellElement(filas,element.ID);
              columnaRequerido = {'label':element.label,'ID':element.ID, indexRow:filas, indexComun:indexComun?.cellIndex}
              break
            }
          }
          if(Addband) break
        }
     }
  }
  return {Addband, columnaRequerido}
}