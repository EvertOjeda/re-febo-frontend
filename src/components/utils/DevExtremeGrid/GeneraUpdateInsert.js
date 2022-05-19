import _ from 'underscore'
import Main from '../../utils/Main'

export const GeneraUpdateInsertCab = async(rows, key, url,updateDependencia,autoCodigo,cod_Not_null) => {
    var updateInsert = [];
    var rowsAux      = [];
    var codigo       = null;
    var update       = false
    var content      = rows.filter( item => item.inserted == true );
    if(content.length > 0){
        if(autoCodigo !== false){
            codigo = await Main.Request(url, 'GET', {})
            .then(response => {
                return response.data.rows;
            })
            codigo = codigo[0].ID
            codigo = codigo + (content.length - 1);
        }else if(cod_Not_null){
            if(content[0][key] !== "" || content[0][key] !== null){
                codigo = await Main.Request(url, 'GET', {})
                .then(response => {
                    return response.data.rows;
                })
                codigo = codigo[0].ID
                codigo = codigo + (content.length - 1);
            }
        }
    }
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        if(element.updated == true){
            update = true
            updateInsert.push(element);
        }
        if(element.inserted == true && !element[key]){
            element[key]        = codigo;
            updateInsert.push(element);
            codigo--;
        }else if(element.inserted == true){
            updateInsert.push(element);
        }
        
        if(updateDependencia){
            if(rows.length > 1){
                rowsAux.push( _.omit(element,'updated','inserted') );
                for (let i = 0; i < updateDependencia.length; i++) {
                    var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
                    var ObjectValueKey = Object.keys(updateDependencia[i])[0];
                    if(rowsAux[index]){
                        if( rowsAux[index][ObjectKey] != rowsAux[index][ObjectValueKey]){
                            rowsAux[index][ObjectKey]  = rowsAux[index][ObjectValueKey];
                        }
                    }
                }
            }else{
                rowsAux.push( _.omit(element,'updated','inserted') );
                for (let i = 0; i < updateDependencia.length; i++) {
                    var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
                    var ObjectValueKey = Object.keys(updateDependencia[i])[0];
                    if(rowsAux[index]){
                        if( rowsAux[index][ObjectKey] != rowsAux[index][ObjectValueKey]){
                            rowsAux[index][ObjectKey]  = rowsAux[index][ObjectValueKey];
                        }
                    }
                }    
            }
        }else{
            rowsAux.push(_.omit(element,['inserted','updated']) )
        }

    }
    return {
        updateInsert: updateInsert,
        rowsAux     : rowsAux,
    }
};

export const GeneraUpdateInsertDet = async(rows, keyNotNull, rowCabecera, updateDependencia, cod_cabecera,url,key)=>{
    var updateInsert = [];
    var rowsAux      = [];
    var update       = false

    var codigo       = null;
    var content      = rows.filter( item => item.inserted == true );

    if(content.length > 0){
        if(url !== undefined){
            codigo = await Main.Request(url, 'GET', {})
            .then(response => {
                return response.data.rows;
            })
            codigo = codigo[0].ID
            codigo = codigo + (content.length - 1);
        }
    }

    for (let index = 0; index < rows.length; index++) {
        const item = rows[index];
        if( item.updated  == true ){
            update = true
            if(keyNotNull.length > 0){
                for (let i = 0; i < keyNotNull.length; i++) {
                    const element = keyNotNull[i];
                    if((item[element] !== undefined && item[element] !== null && item[element] !== "")){
                        updateInsert.push(item);
                    }
                }
            }
        }
        if( item.updated  == true && !item[key] &&  url !== undefined){
            if(keyNotNull.length > 0){
                for (let i = 0; i < keyNotNull.length; i++) {
                    const element = keyNotNull[i];
                    if((item[element] !== undefined && item[element] !== null && item[element] !== "")){
                        updateInsert.push(item);
                    }
                }
            }
        }
        if(item.inserted == true && !item[key] &&  url !== undefined){
            item[key]        = codigo;
            codigo--;
        }
        if(item.inserted == true ){
            if(keyNotNull.length > 0){
                for (let i = 0; i < keyNotNull.length; i++) {
                    const element = keyNotNull[i];
                    if((item[element] !== undefined && item[element] !== null && item[element] !== "")){
                        if(cod_cabecera != undefined){
                            var datosCabecera = await rowCabecera.filter( (index) =>{if(index.ID == item.idCabecera) return index}  );
                            if(datosCabecera.length > 0){
                                item[cod_cabecera] = await datosCabecera[0][cod_cabecera];
                            }
                        }
                        updateInsert.push(item);
                    }
                }
            }
        }
        if(rows.length > 1){
            if(!item.InsertDefault){
                rowsAux.push( _.omit(item,'updated','inserted') );
                for (let i = 0; i < updateDependencia.length; i++) {
                    var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
                    var ObjectValueKey = Object.keys(updateDependencia[i])[0];
                    if(rowsAux[index]){
                        if( rowsAux[index][ObjectKey] != rowsAux[index][ObjectValueKey]){
                            rowsAux[index][ObjectKey]  = rowsAux[index][ObjectValueKey];
                        }
                    }
                }    
            }
        }else{
            // if(!item.InsertDefault){
                rowsAux.push( _.omit(item,'updated','inserted') );
                for (let i = 0; i < updateDependencia.length; i++) {
                    var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
                    var ObjectValueKey = Object.keys(updateDependencia[i])[0];
                    if(rowsAux[index]){
                        if( rowsAux[index][ObjectKey] != rowsAux[index][ObjectValueKey]){
                            rowsAux[index][ObjectKey]  = rowsAux[index][ObjectValueKey];
                        }
                    }
                }    
            // }
        }
    }
    return {
        updateInsert: updateInsert,
        rowsAux     : rowsAux,
        actualizar  : update,
    }
}
// export const GeneraUpdateInsertDet = async(rows, keyNotNull, rowCabecera, updateDependencia, COD_CABECERA)=>{
//     var updateInsert = [];
//     var rowsAux      = [];

//     for (let index = 0; index < rows.length; index++) {
//         const item = rows[index];
//         if( item.updated  == true ){
//             if(keyNotNull.length > 0){
//                 for (let i = 0; i < keyNotNull.length; i++) {
//                     const element = keyNotNull[i];
//                     if((item[element] !== undefined && item[element] !== null && item[element].length > 0)){
//                         updateInsert.push(item);
//                     }
//                 }
//             }
//         }        
//         if(item.inserted == true ){
//             if(keyNotNull.length > 0){
//                 for (let i = 0; i < keyNotNull.length; i++) {
//                     const element = keyNotNull[i];
//                     if((item[element] !== undefined && item[element] !== null && item[element].length > 0)){
//                         if(COD_CABECERA != undefined){
//                             var datosCabecera = await rowCabecera.filter( (index) =>{if(index.ID == item.idCabecera) return index}  );
//                             if(datosCabecera.length > 0){
//                                 item[COD_CABECERA] = await datosCabecera[0][COD_CABECERA];
//                             }
//                         }
//                         updateInsert.push(item);
//                     }
//                 }
//             }
//         }
//         if(rows.length > 1){
//             if(!item.InsertDefault){
//                 rowsAux.push( _.omit(item,'updated','inserted') );
//                 for (let i = 0; i < updateDependencia.length; i++) {
//                     var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
//                     var ObjectValueKey = Object.keys(updateDependencia[i])[0];
//                     if(rowsAux[index]){
//                         if( rowsAux[index][ObjectKey] != rowsAux[index][ObjectValueKey]){
//                             rowsAux[index][ObjectKey]  = rowsAux[index][ObjectValueKey];
//                         }
//                     }
//                 }    
//             }
//         }else{
//             // if(!item.InsertDefault){
//                 rowsAux.push( _.omit(item,'updated','inserted') );
//                 for (let i = 0; i < updateDependencia.length; i++) {
//                     var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
//                     var ObjectValueKey = Object.keys(updateDependencia[i])[0];
//                     if(rowsAux[index]){
//                         if( rowsAux[index][ObjectKey] != rowsAux[index][ObjectValueKey]){
//                             rowsAux[index][ObjectKey]  = rowsAux[index][ObjectValueKey];
//                         }
//                     }
//                 }    
//             // }
//         }
//     }
//     return {
//         updateInsert: updateInsert,
//         rowsAux     : rowsAux,
//     }
// }

export const GeneraUpdateInsert = async(rows, updateDependencia)=>{
    var updateInsert = [];
    var rowsAux      = [];
    for (let index = 0; index < rows.length; index++) {
        const item = rows[index];
        if( item.updated  == true ){
            updateInsert.push(item);
        }        
        if(item.inserted == true ){
            updateInsert.push(item);
        }
        rowsAux.push( _.omit(item,'updated','inserted','InsertDefault') );
        if(item.inserted || item.updated){
            for (let i = 0; i < updateDependencia.length; i++) {
                var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
                var ObjectValueKey = Object.keys(updateDependencia[i])[0];
                if(rowsAux[index]){
                    if( rowsAux[index][ObjectKey] != rowsAux[index][ObjectValueKey]){
                        rowsAux[index][ObjectKey]  = rowsAux[index][ObjectValueKey];
                    }
                }
            } 
        }      
    }
    return {
        updateInsert: updateInsert,
        rowsAux     : rowsAux,
    }
}