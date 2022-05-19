import { saveAs } from 'file-saver';
export async function createHtml2ExportTable2Excel2(DataFiltered,ReportTitle){
    var html = "";
    var len      = await getLogitud(DataFiltered[0]);
    var columnas = await getColumnas(DataFiltered[0]);
    var filas    = await getFilas(DataFiltered);
    html     += '<table style="border:1px solid #000;">';
    html     += '<thead>';
    html     += '<tr>';
    html     += '<th colspan="' + len + '">'+ ReportTitle  + '</th>';
    html     += '</tr>';
    html     += '<tr>';
    html     += columnas;
    html     += '</tr>';
    html     += '</thead>';
    html     += '<tbody>';
    html     += filas;
    html     += '</tbody>';
    html     += '</table>';
    var Qlik = new Blob(['<html><head><meta charset="UTF-8"></head><body>' + html + '</body></html>'], {
        type: "application/vnd.ms-excel;charset=utf-8"
    });
    saveAs(Qlik, ReportTitle + ".xls");
}
const getFilas = async(data) =>{
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        html += "<tr>";
        for(var j in item)
            html += "<td>" + item[j] + "</td>";

        html += "</tr>";
    }
    return html;
}
const getColumnas = async(data) =>{
    var html     = "";
    for(var i in data)
        html += '<th style="background-color: #b3e5fc;border:1px solid #424242;">' + i + '</th>';

    return html;
}
const getLogitud = async(data) =>{
    var contador = 0;
    for(var i in data)
        contador++;

    return contador;
}