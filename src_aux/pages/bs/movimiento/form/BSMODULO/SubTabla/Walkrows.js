import $ from "jquery";

//variables globales
var numeroDeFila   =  0;
var activeTableRow = "";

export async function funcionNumeroDeFila(valor) {
  numeroDeFila = await valor.split("subtabla")[1];  
}
export function ArrowUp(backgroundColor) {
  var filas = document.getElementsByClassName("subTablaFila");
  if (filas.length) {
    if (numeroDeFila > 0) {
      activeTableRow = $('.activarModuloSubTabla').removeAttr("style").first();
      activeTableRow = $('.activarModuloSubTabla').removeClass('activarModuloSubTabla').first();
      numeroDeFila--;
    } else {
      activeTableRow = 0;
      numeroDeFila = 0;
    }
    if (activeTableRow.length) {
      activeTableRow.prev().attr('style', backgroundColor);
      activeTableRow.prev().addClass('activarModuloSubTabla');
    }
  }  
}
export function ArrowDown(backgroundColor) {

  var filas = document.getElementsByClassName("subTablaFila");
  if (filas.length) {
    if (numeroDeFila < filas.length - 1) {
      activeTableRow = $('tr.activarModuloSubtabla').removeAttr('style');
      activeTableRow = $('tr.activarModuloSubtabla').removeClass('activarModuloSubtabla');

      if (activeTableRow.length === 0) {
        filas[0].style.backgroundColor = backgroundColor;
        filas[0].classList.add("activarModuloSubtabla");
        numeroDeFila = 0;
      } else {
        numeroDeFila++;
      }

    } else if (numeroDeFila > filas.length - 1) {
      numeroDeFila = 0;
      filas[0].style.backgroundColor = backgroundColor;
      filas[0].classList.add("activarModuloSubtabla");
    } else {
      activeTableRow = 0;
    }

    if (activeTableRow.length) {
      activeTableRow.next().attr('style', backgroundColor);
      activeTableRow.next().addClass('activarModuloSubtabla');
    }
  }
}