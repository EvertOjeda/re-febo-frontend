import $ from "jquery";

//variables globales
var numeroDeFila   = 0;
var activeTableRow = "";

export function setNumeroDeFila(valor) {
  numeroDeFila = valor;
}
export function ArrowUp(backgroundColor) {
  var filas = document.getElementsByClassName('filas');
  if (filas.length) {
    if (numeroDeFila > 0) {
      activeTableRow = $('.activar').removeAttr("style").first();
      activeTableRow = $('.activar').removeClass('activar').first();
      numeroDeFila--;
    } else {
      activeTableRow = 0;
      numeroDeFila = 0;
    }

    if (activeTableRow.length) {
      activeTableRow.prev().attr('style', backgroundColor);
      activeTableRow.prev().addClass('activar');
    }
  }
}
export function ArrowDown(backgroundColor) {
  var filas = document.getElementsByClassName('filas');
  if (filas.length) {
    if (numeroDeFila < filas.length - 1) {
      activeTableRow = $('tr.activar').removeAttr('style');
      activeTableRow = $('tr.activar').removeClass('activar');

      if (activeTableRow.length === 0) {
        filas[0].style.backgroundColor = backgroundColor;
        filas[0].classList.add("activar");
        numeroDeFila = 0;
      } else {
        numeroDeFila++;
      }

    } else if (numeroDeFila > filas.length - 1) {
      numeroDeFila = 0;
      filas[0].style.backgroundColor = backgroundColor;
      filas[0].classList.add("activar");
    } else {
      activeTableRow = 0;
    }

    if (activeTableRow.length) {
      activeTableRow.next().attr('style', backgroundColor);
      activeTableRow.next().addClass('activar');
    }

  }

}

// variable global / controla la caontidad de salto a dar en la paginacion
var valorPagina = 0;
var countData = 0;

/*
*esta funcion es para cuando el usuario 
*hace un onclick en el button siguiente de la paginacion, se le cetea el valor de la paginacion
*/
export function setPaginacion(valor) {
  valorPagina = valor;
}

//cetemamos la cantidad de registro que hay
export function setCountData(valor) {
  countData = valor;
}

//esta funcion calcula la paginacion y retorna el valor a la pagina siguiente
export function calculoPaginacion(lefAndRight, totalPag) {

  var paginacion;
  var totalDatos = countData;
  const totalPaginacion = totalPag;

  if (totalDatos > 0 && totalDatos !== undefined) {

    const obtenerTotalDatos = totalDatos;
    if (obtenerTotalDatos === totalPaginacion) paginacion = 0;
    else paginacion = obtenerTotalDatos / totalPaginacion;

    if (totalPaginacion % 2 === 0) {
      paginacion--;
    } else {
      paginacion = Math.floor(paginacion)
    }

    if (totalDatos === paginacion) paginacion--;

    if (valorPagina > 0 && lefAndRight === "ArrowLeft") {
      valorPagina--;
    }

    if (valorPagina < paginacion && lefAndRight === "ArrowRight") {
      valorPagina++;
    }

    return valorPagina;
  } else {
    return 0;
  }
}