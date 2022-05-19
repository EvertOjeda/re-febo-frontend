import $ from "jquery";

//variables globales
var numeroDeFila   = 0;
var activeTableRow = "";

export function funcionNumeroDeFila(valor) {
  numeroDeFila = valor;
}
export function ArrowUp(backgroundColor) {
  var filas = document.getElementsByClassName("filaTabla");
  if (filas.length) {
    if (numeroDeFila > 0) {
      activeTableRow = $('.activarModuloTabla').removeAttr("style").first();
      activeTableRow = $('.activarModuloTabla').removeClass('activarModuloTabla').first();
      numeroDeFila--;
    } else {
      activeTableRow = 0;
      numeroDeFila = 0;
    }

    if (activeTableRow.length) {
      activeTableRow.prev().attr('style', backgroundColor);
      activeTableRow.prev().addClass('activarModuloTabla');
    } 
  }
}
export function ArrowDown(backgroundColor) {

  var filas = document.getElementsByClassName("filaTabla");
  if (filas.length) {
    if (numeroDeFila < filas.length - 1) {
      activeTableRow = $('tr.activarModuloTabla').removeAttr('style');
      activeTableRow = $('tr.activarModuloTabla').removeClass('activarModuloTabla');

      if (activeTableRow.length === 0) {
        filas[0].style.backgroundColor = backgroundColor;
        filas[0].classList.add("activarModuloTabla");
        numeroDeFila = 0;
      } else {
        numeroDeFila++;
      }

    } else if (numeroDeFila > filas.length - 1) {
      numeroDeFila = 0;
      filas[0].style.backgroundColor = backgroundColor;
      filas[0].classList.add("activarModuloTabla");
    } else {
      activeTableRow = 0;
    }

    if (activeTableRow.length) {
      activeTableRow.next().attr('style', backgroundColor);
      activeTableRow.next().addClass('activarModuloTabla');
    }
  }
}