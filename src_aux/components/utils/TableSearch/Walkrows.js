import $ from "jquery";

//variables globales
var numeroDeFila   = 0;
var activeTableRow = "";

export function setNumeroDeFila(valor){
  numeroDeFila = valor;
}
export function ArrowUp(backgroundColor){
  var filas = document.getElementsByClassName('filasModal');

  if (filas.length) {
    if (numeroDeFila > 0) {
      activeTableRow = $('.activarRowsModal').removeAttr("style").first();
      activeTableRow = $('.activarRowsModal').removeClass('activarRowsModal').first();

      numeroDeFila--;
    } else {
      activeTableRow = 0;
      numeroDeFila = 0;
    }

    if (activeTableRow.length) {
      activeTableRow.prev().attr('style', backgroundColor);
      activeTableRow.prev().addClass('activarRowsModal');
    }

  }

}
export function ArrowDown(backgroundColor){

  var filas = document.getElementsByClassName('filasModal');
  if (filas.length) {
    if (numeroDeFila < filas.length - 1) {

      activeTableRow = $('tr.activarRowsModal').removeAttr('style');
      activeTableRow = $('tr.activarRowsModal').removeClass('activarRowsModal');

      if (activeTableRow.length === 0) {
        filas[0].style.backgroundColor = backgroundColor;
        filas[0].classList.add("activarRowsModal");
        numeroDeFila = 0;
      } else {
        numeroDeFila++;
      }

    } else if (numeroDeFila > filas.length - 1) {
      numeroDeFila = 0;
      filas[0].style.backgroundColor = backgroundColor;
      filas[0].classList.add("activarRowsModal");
    } else {
      activeTableRow = 0;
    }

    if (activeTableRow.length) {
      activeTableRow.next().attr('style', backgroundColor);
      activeTableRow.next().addClass('activarRowsModal');
    }
  }
}
