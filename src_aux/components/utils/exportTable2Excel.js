export async function createHtml2ExportTable2Excel(DataFiltered,ReportTitle){
    var html = "";
    var len      = await getLogitud(DataFiltered[0]);
    var columnas = await getColumnas(DataFiltered[0]);
    var filas    = await getFilas(DataFiltered);
    html     = '<caption>' + ReportTitle + '</caption>';
    html     += '<colgroup span="' + len + '" align="center"></colgroup>';
    html     += '<colgroup span="' + len + '" align="center"></colgroup>';
    html     += '<table style="border:1px solid #000;">';
    html     += '<thead>';
    html     += '<tr style="background-color: #b3e5fc;border:1px solid #424242;">';
    html     += columnas;
    html     += '</tr>';
    html     += '</thead>';
    html     += '<tbody>';
    html     += filas;
    html     += '</tbody>';
    html     += '</table>';
    DownloadTable2Excel(html,ReportTitle);
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
        html += "<th>" + i + "</th>";

    return html;
}
const getLogitud = async(data) =>{
    var contador = 0;
    for(var i in data)
        contador++;

    return contador;
}
var DownloadTable2Excel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(table, name) {
        var ctx = {worksheet: name || 'Worksheet', table: table}
        window.location.href = uri + base64(format(template, ctx))
    }
})()