import moment from "moment";

const dateFormat = (fecha) =>{
  var dateArray = fecha.split('/')
  return moment(`"${dateArray[0]}.${dateArray[1]}.${dateArray[2]}"`, "DD.MM.YYYY").format()
}

function isDate(a) {
  if(a !== undefined){
    if (isNaN(a) && a.includes('/')){
      var mydate = dateFormat(a);
      let dt     = new Date(mydate);
      if (new Date(dt).getYear())
        return true;
      else
        return false;
    }else{
      return false;
    }
  }
}

function tipoDeDatosNumerico(x, y) {
if (!isNaN(x) && !isNaN(y)) {
  return true
}
}

function allLetter(inputtxt) {
var letters = /\d/;
if (letters.test(inputtxt)) {
  return true;
} else {
  return false;
}
}

const collator = new Intl.Collator('es', { ignorePunctuation: true, numeric: true, sensitivity: 'base' });
//función para reutilizar `sort`
const sort_lists = (key, list) =>

[...list].sort((a, b) =>
     a[key] !== undefined && b[key] !== undefined ?
     a[key] === "" || a[key] === null  ?  1
   : b[key] === "" || b[key] === null  ? -1
   : isDate(a[key]) ? dateFormat(a[key]) > dateFormat(b[key]) ? -1 : dateFormat(a[key]) < dateFormat(b[key]) ? 1 : 0
   : tipoDeDatosNumerico(a[key], b[key]) ? a[key] - b[key]
   : allLetter(a[key]) ?  1
   : allLetter(b[key]) ? -1
   : collator.compare(a[key].toLowerCase(), b[key].toLowerCase())
   : null
   )

export function OrderBy(columnOrderBy, Datosrows) {
var newSortedList = sort_lists(columnOrderBy, Datosrows)

if (newSortedList[0] === Datosrows[0]) {
  newSortedList.sort().reverse();
}

return newSortedList;
};

//----------------------------------------------------------------------------------------------------------------------------------------------------
//Formato anterior

// function getorderFecha(a, b) {
//   const as = a.split("/");
//   const ad = new Date(as[2], as[1] - 1, as[0]);
//   const bs = b.split("/");
//   const bd = new Date(bs[2], bs[1] - 1, bs[0]);   
//   return   ad > bd ? -1 : ad < bd ? 1 : 0
// }

// function isDate(a) {
// if(a !== undefined){
//   if (isNaN(a) && a.includes('/')){
//     var parts = a.split('/');
//     var mydate = new Date(parts[0], parts[1] - 1, parts[2])
//     let dt = new Date(mydate);
//     if (dt.getMonth()) {
//         return true;
//     }  
//   }    
// }
// }

// function tipoDeDatosNumerico(x, y) {
// if (!isNaN(x) && !isNaN(y)) {
//   return true
// }
// }

// function allLetter(inputtxt) {
// var letters = /\d/;
// if (letters.test(inputtxt)) {
//   return true;
// } else {
//   return false;
// }
// }

// const collator = new Intl.Collator('es', { ignorePunctuation: true, numeric: true, sensitivity: 'base' });

// //función para reutilizar `sort`
// const sort_lists = (key, list) =>

// [...list].sort((a, b) =>
//     a[key] !== undefined && b[key] !== undefined ?
//      a[key] === "" || a[key] === null  ?  1
//    : b[key] === "" || b[key] === null  ? -1
//    : isDate(a[key]) ? getorderFecha(a[key], b[key])
//    : tipoDeDatosNumerico(a[key], b[key]) ? a[key] - b[key]
//    : allLetter(a[key]) ?  1
//    : allLetter(b[key]) ? -1
//    : collator.compare(a[key].toLowerCase(), b[key].toLowerCase())
//    : null
//    )

// export function OrderBy(columnOrderBy, Datosrows) {
// var newSortedList = sort_lists(columnOrderBy, Datosrows)

// if (newSortedList[0] === Datosrows[0]) {
//   newSortedList.sort().reverse();
// }

// return newSortedList;
// };

//----------------------------------------------------------------------------------------------------------------------------------------------------