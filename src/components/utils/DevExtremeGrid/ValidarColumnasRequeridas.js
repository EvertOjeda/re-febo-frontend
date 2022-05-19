import Main from "../Main";
import _ from 'underscore';

export const ValidarColumnasRequeridas = async(arrayData)=>{
    
    if(Object.keys(arrayData.datos[0]).length > 0){
        var band = false;
        var keysColumn =  Object.keys(arrayData.column[0])
        //for de la cantidad de columnas requeridas
        for (let i = 0; i < keysColumn.length; i++) {
            const element       = keysColumn[i];
            const dataColumn    = arrayData.column[0][element];
            //for recorrido de las columnas requeridas
            for (let index = 0; index < dataColumn.length; index++) {
                const item = dataColumn[index];
                if(item.requerido){                  
                    var line = Object.keys(arrayData.datos[0][element]).length > 0 ? arrayData.datos[0][element] : [];
                        if(line.length > 0){
                            // for recorrido del array de objeto requerido y verificar si esta vacio
                            for (let c = 0; c < line.length; c++) {
                                const itemsValor = line[c];

                                if(!itemsValor['InsertDefault'] &&  (itemsValor[item.ID] === '' || itemsValor[item.ID] === null) ){
                                    Main.message.info({
                                        content  : `Favor complete el campo ${item.label} antes de continuar!!`,
                                        className: 'custom-class',
                                        duration : `${2}`,
                                        style    : {
                                            marginTop: '2vh',
                                        }
                                    });
                                    band = true
                                    var rowIndex =   arrayData.id[0][element].current.instance.getRowIndexByKey(itemsValor);
                                    if (rowIndex === -1) rowIndex =   arrayData.id[0][element].current.instance.getRowIndexByKey(itemsValor.ID);
                                    var comunIndex = arrayData.id[0][element].current.instance.getCellElement(rowIndex,item.ID);
                                    arrayData.id[0][element].current._instance.focus(arrayData.id[0][element].current.instance.getCellElement(rowIndex,comunIndex?.cellIndex))
                                    break;
                                }else{
                                    if(!itemsValor['InsertDefault']){
                                        if(itemsValor[item.ID] === '' || _.isUndefined(itemsValor[item.ID]) || _.isNull(itemsValor[item.ID])){
                                            Main.message.info({
                                                content  : `Favor complete el campo ${item.label} antes de continuar!!`,
                                                className: 'custom-class',
                                                duration : `${2}`,
                                                style    : {
                                                    marginTop: '2vh',
                                                }
                                            });
                                            band = true
                                            var rowIndex =   arrayData.id[0][element].current.instance.getRowIndexByKey(itemsValor);
                                            if (rowIndex === -1) rowIndex =   arrayData.id[0][element].current.instance.getRowIndexByKey(itemsValor.ID);
                                            var comunIndex = arrayData.id[0][element].current.instance.getCellElement(rowIndex,item.ID);
                                            arrayData.id[0][element].current._instance.focus(arrayData.id[0][element].current.instance.getCellElement(rowIndex,comunIndex?.cellIndex))
                                            break;
                                        }
                                    }
                                }
                                if(!band){
                                    if(arrayData.adicionalRequerido){

                                        for (let index = 0; index < arrayData.adicionalRequerido.length; index++) {
                                            const element = arrayData.adicionalRequerido[index];
        
                                            if(!itemsValor['InsertDefault'] &&  (itemsValor[element] === '' || itemsValor[element] === null) ){
                                                Main.message.warning({
                                                    content  : `Existen campos requeridos no completadas. - ${element}`,
                                                    className: 'custom-class',
                                                    duration : `${3}`,
                                                    style    : {
                                                        marginTop: '2vh',
                                                    }
                                                });
                                                band = true
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    if(band)break;
                }
            }
            if(band)break;
        }
    }
    return band;
};


// export const ValidarColumnasRequeridas = async(arrayData)=>{
//     if(Object.keys(arrayData.datos[0]).length > 0){
//         var band = false;
//         var keysColumn =  Object.keys(arrayData.column[0])
//         //for de la cantidad de columnas requeridas
//         for (let i = 0; i < keysColumn.length; i++) {
//             const element       = keysColumn[i];
//             const dataColumn    = arrayData.column[0][element];
//             //for recorrido de las columnas requeridas
//             for (let index = 0; index < dataColumn.length; index++) {
//                 const item = dataColumn[index];
//                 if(item.requerido){                    
//                     var line = Object.keys(arrayData.datos[0][element]).length > 0 ? arrayData.datos[0][element] : [];
//                         if(line.length > 0){
//                             // for recorrido del array de objeto requerido y verificar si esta vacio
//                             for (let c = 0; c < line.length; c++) {
//                                 const itemsValor = line[c];
//                             if(!itemsValor['InsertDefault'] &&  (itemsValor[item.ID] === '' || itemsValor[item.ID] == null ) ){
//                                 Main.message.info({
//                                     content  : `Favor complete el campo ${item.label} antes de continuar!!`,
//                                     className: 'custom-class',
//                                     duration : `${2}`,
//                                     style    : {
//                                         marginTop: '2vh',
//                                     }
//                                 });
//                                 band = true
//                                 var rowIndex =   arrayData.id[0][element].current.instance.getRowIndexByKey(itemsValor);
//                                 if (rowIndex === -1) rowIndex =   arrayData.id[0][element].current.instance.getRowIndexByKey(itemsValor.ID);
//                                 var comunIndex = arrayData.id[0][element].current.instance.getCellElement(rowIndex,item.ID);
//                                 arrayData.id[0][element].current._instance.focus(arrayData.id[0][element].current.instance.getCellElement(rowIndex,comunIndex?.cellIndex))
//                                 break;
//                             }else{
//                                 if(!itemsValor['InsertDefault']){
//                                     if(itemsValor[item.ID] === '' || _.isUndefined(itemsValor[item.ID]) || _.isNull(itemsValor[item.ID]) ){
//                                         Main.message.info({
//                                             content  : `Favor complete el campo ${item.label} antes de continuar!!`,
//                                             className: 'custom-class',
//                                             duration : `${2}`,
//                                             style    : {
//                                                 marginTop: '2vh',
//                                             }
//                                         });
//                                         band = true
//                                         var rowIndex =   arrayData.id[0][element].current.instance.getRowIndexByKey(itemsValor);
//                                         if (rowIndex === -1) rowIndex =   arrayData.id[0][element].current.instance.getRowIndexByKey(itemsValor.ID);
//                                         var comunIndex = arrayData.id[0][element].current.instance.getCellElement(rowIndex,item.ID);
//                                         arrayData.id[0][element].current._instance.focus(arrayData.id[0][element].current.instance.getCellElement(rowIndex,comunIndex?.cellIndex))
//                                         break;
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                     if(band)break;
//                 }
//             }
//             if(band)break;
//         }
//     }
//     return band;
// };