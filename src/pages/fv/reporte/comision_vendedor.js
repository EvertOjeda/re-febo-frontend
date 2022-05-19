import React, { useEffect, useState }   from "react";
import { Table, Button}                 from 'antd';
import _                                from 'underscore';
import jsPDF                            from 'jspdf';
import 'jspdf-autotable';
import SearchIcon                       from '@material-ui/icons/Search';
import Input                            from '@material-ui/core/Input';
import InputAdornment                   from '@material-ui/core/InputAdornment';
import { createHtml2ExportTable2Excel } from '../../../components/utils/exportTable2Excel';
import excel                            from "../../../assets/icons/excel.svg"
import pdf                              from "../../../assets/icons/pdf.svg"
import logo_negro                       from '../../../assets/img/apolo_negro.png';
import Main                             from "../../../components/utils/Main";
import moment                           from "moment";

import { saveAs } from 'file-saver';

const Titulo = "Comision de Vendedor";
const Level  = 2;
const columns_level_0 = [
    { title: 'Vendedor'     , dataIndex: 'description'    , key: 'description'      },
    { title: 'Supervisor'   , dataIndex: 'cod_supervisor' , key: 'cod_supervisor'   , align: 'right', width: 100},
    { title: 'Total Ventas' , dataIndex: 'total_invoice'  , key: 'total_invoice'    , align: 'right', width: 100  },
    { title: 'Comisión'     , dataIndex: 'total_comision' , key: 'total_comision'   , align: 'right', width: 100  },
];
const columns_level_1 = [
    { title: 'Tipo'         , dataIndex: 'description'      , key: 'description'    },
    { title: 'Total Ventas' , dataIndex: 'total_invoice'    , key: 'total_invoice'  , align: 'right', width: 100},
    { title: 'Comision'     , dataIndex: 'total_comision'   , key: 'total_comision' , align: 'right', width: 100},
];
const columns_level_2 = [
    { title: 'Marca'        , dataIndex: 'description'      , key: 'description'    },
    { title: 'Total Ventas' , dataIndex: 'total_invoice'    , key: 'total_invoice'  , align: 'right', width: 100},
];
const defaultOpenKeys     = ['FV','FV-FV3', 'FV-FV3-FV33'];
const defaultSelectedKeys = ['FV-FV3-FV33-RPCVE'];
const url                 = '/fv/reporte/comision_vendedor';
const Reporte = ()=>{
    const [data, setData] = useState([]);
    const [line, setLine] = useState([]);
    const [ activarSpinner    , setActivarSpinner   ] = useState(true);
    useEffect( ()=>{
        getData();
    },[]);
    const getData = async() =>{
        await Main.Request( url, 'POST',{value:'null'} )
            .then( response =>{
                setData(response.data.rows);
                Build(response.data.rows);
                setActivarSpinner(false);
            })
    };
    const Build = (rows_data) =>{
        var rows = [];
        var info = [];
        var xrows = rows_data;
        var rows_data = _.uniq(rows_data, function(item){
            return item.COD_VENDEDOR_PERSONA;
        });
        rows_data.sort(function (a, b) {
            if (parseInt(a.COD_VENDEDOR) > parseInt(b.COD_VENDEDOR)) {
                return  1;
            }
            if (parseInt(a.COD_VENDEDOR) < parseInt(b.COD_VENDEDOR)) {
                return -1;
            }
        });
        _.each(rows_data,function(item){
            info = _.flatten(_.filter(xrows,function (index) {
                return index.COD_VENDEDOR_PERSONA == item.COD_VENDEDOR_PERSONA;
            }));
            var total_invoice=_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_VENTA);
            }),function(memo, num){
                return memo + num;
            },0);
            var total_comision =_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_A_COBRAR);
            }),function(memo, num){
                return memo + num;
            },0);
            rows.push({
                key                     : item.COD_VENDEDOR_PERSONA,
                description             : `${item.COD_VENDEDOR} - ${item.DESC_VENDEDOR}`,
                cod_supervisor          : `${item.COD_SUPERVISOR}`,
                total_invoice           : new Intl.NumberFormat("de-DE").format(total_invoice),
                total_comision          : new Intl.NumberFormat("de-DE").format(total_comision),
                level                   : 0,
                cod_vendedor_persona    : item.COD_VENDEDOR_PERSONA,
            });
        });
        setLine(rows);
    }
    const handleChange = async(e) =>{
        var value = e.target.value;
        if(value.trim().length == 0){
            value = 'null';
        }
        await Main.Request( url, 'POST', {'value':value} )
            .then( response =>{
                Build(response.data.rows);
            })
    }
    const expandedRowRender = (record) => {
        var nextLevel  = record.level + 1;
        var rows       = [];
        var rows_data  = [];
        var xrows      = [];
        var info       = [];
        var columns    = [];
        if(nextLevel == 1){
            columns   = columns_level_1;
            rows_data = data.filter(item => item.COD_VENDEDOR_PERSONA.includes(record.key) );
        }
        if(nextLevel == 2){
            columns   = columns_level_2;
            rows_data = data.filter(item => item.COD_VENDEDOR_PERSONA.includes(record.cod_vendedor_persona) && 
                                            item.TIP_COM.includes(record.key) );
        }
        xrows     = rows_data;
        rows_data = _.uniq(rows_data, function(item){
            if(nextLevel == 1){
                return item.TIP_COM;
            }
            if(nextLevel == 2){
                return item.COD_MARCA;
            }
        });
        rows_data.sort(function (a, b) {
            if(nextLevel == 1){
                if (a.TIP_COM > b.TIP_COM) {
                    return 1;
                }
                if (a.TIP_COM < b.TIP_COM ) {
                    return -1;
                }
            }
            if(nextLevel == 2){
                if (parseInt(a.COD_MARCA) > parseInt(b.COD_MARCA) ) {
                    return 1;
                }
                if (parseInt(a.COD_MARCA) < parseInt(b.COD_MARCA) ) {
                    return -1;
                }
            }
            return 0;
        });
        for (let index = 0; index < rows_data.length; index++) {
            const item = rows_data[index];            
            if(nextLevel == 1){
                info = xrows.filter( i => i.TIP_COM.includes(item.TIP_COM) );
            }
            if(nextLevel == 2){
                info = xrows.filter( i => i.COD_MARCA.includes(item.COD_MARCA) );
            }
            var total_invoice=_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_VENTA);
            }),function(memo, num){
                return memo + num;
            },0);
            var total_comision =_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_A_COBRAR);
            }),function(memo, num){
                return memo + num;
            },0);
            var key         = '';
            var description = '';
            if(nextLevel == 1){
                key = item.TIP_COM;
                description = item.TIP_COM;
            }
            if(nextLevel == 2){
                key = item.COD_MARCA;
                description = `${item.COD_MARCA} - ${item.DESC_MARCA}`;
            }
            rows.push({
                key                     : key,
                description             : description,
                total_invoice           : new Intl.NumberFormat("de-DE").format(total_invoice),
                total_comision          : new Intl.NumberFormat("de-DE").format(total_comision),
                level                   : nextLevel,
                cod_vendedor_persona    : item.COD_VENDEDOR_PERSONA,
            });   
        }
        return (
                <>
                    {nextLevel < Level
                        ?   <Table 
                                columns={columns} 
                                dataSource={rows}
                                bordered
                                expandable={{ expandedRowRender }}
                                pagination={false}
                                style={{marginTop:'10px',marginBottom:'10px',marginRight:'10px'}}
                                />
                        :   <Table 
                                columns={columns} 
                                dataSource={rows}
                                bordered
                                pagination={false}
                                style={{marginTop:'10px',marginBottom:'10px',marginRight:'10px'}}
                                />
                    }
                </>
                )
    };
    const getNivelVendedor = async() => {
        var content_1 = [];
        var rows_1    = [];
        rows_1 = _.uniq(data, function(item){
            return item.COD_VENDEDOR_PERSONA;
        });
        rows_1.sort(function (a, b) {
            if (parseInt(a.COD_VENDEDOR) > parseInt(b.COD_VENDEDOR)) {
                return  1;
            }
            if (parseInt(a.COD_VENDEDOR) < parseInt(b.COD_VENDEDOR)) {
                return -1;
            }
        });
        _.each(rows_1,function(item){
            var info = _.flatten(_.filter(data,function (index) {
                return index.COD_VENDEDOR_PERSONA == item.COD_VENDEDOR_PERSONA;
            }));
            var total_invoice=_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_VENTA);
            }),function(memo, num){
                return memo + num;
            },0);
            var total_comision =_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_A_COBRAR);
            }),function(memo, num){
                return memo + num;
            },0);
            content_1.push({
                description             : item.COD_VENDEDOR + ' - ' + item.DESC_VENDEDOR,
                cod_supervisor          : item.COD_SUPERVISOR,
                total_invoice           : new Intl.NumberFormat("de-DE").format(total_invoice),
                total_comision          : new Intl.NumberFormat("de-DE").format(total_comision),
                cod_vendedor_persona    : item.COD_VENDEDOR_PERSONA,
            });
        });

        return content_1;
    }
    const getNivelTipo = async(cod_vendedor_persona) => {
        var content_2 = [];
        var rows_2    = [];
        rows_2 = data.filter(index => index.COD_VENDEDOR_PERSONA.includes(cod_vendedor_persona) );
        var xrows = rows_2;
        rows_2 = _.uniq(rows_2, function(item){
            return item.TIP_COM;
        });
        rows_2.sort(function (a, b) {
            if (a.TIP_COM > b.TIP_COM) {
                return  1;
            }
            if (a.TIP_COM < b.TIP_COM) {
                return -1;
            }
        });
        _.each(rows_2,function(item){
            var info = xrows.filter(index => index.TIP_COM.includes(item.TIP_COM) );
            var total_invoice=_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_VENTA);
            }),function(memo, num){
                return memo + num;
            },0);
            var total_comision =_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_A_COBRAR);
            }),function(memo, num){
                return memo + num;
            },0);
            content_2.push({
                description             : item.TIP_COM,
                total_invoice           : new Intl.NumberFormat("de-DE").format(total_invoice),
                total_comision          : new Intl.NumberFormat("de-DE").format(total_comision),
                cod_vendedor_persona    : item.COD_VENDEDOR_PERSONA,
                tip_com                 : item.TIP_COM,
            });
        });
        return content_2;
    }
    const getNivelMarca = async(cod_vendedor_persona, tip_com) => {
        var content_3 = [];
        var rows_3    = [];
        rows_3        = data.filter(i => i.COD_VENDEDOR_PERSONA.includes(cod_vendedor_persona) && i.TIP_COM.includes(tip_com) );
        var xrows     = rows_3;
        rows_3 = _.uniq(rows_3, function(item){
            return item.COD_MARCA;
        });
        rows_3.sort(function (a, b) {
            if (a.COD_MARCA > b.COD_MARCA) {
                return  1;
            }
            if (a.COD_MARCA < b.COD_MARCA) {
                return -1;
            }
        });
        for (let index = 0; index < rows_3.length; index++) {
            const element = rows_3[index];
            var info = xrows.filter( i => i.COD_MARCA.includes(element.COD_MARCA) );
            var total_invoice=_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_VENTA);
            }),function(memo, num){
                return memo + num;
            },0);
            content_3.push({
                description   : element.COD_MARCA + ' - ' + element.DESC_MARCA,
                total_invoice : total_invoice,
            });
        }
        return content_3;
    }
    const export2PDF = async() =>{
        setActivarSpinner(true);
        var columns_1 = [];
        for (let index = 0; index < columns_level_0.length; index++) {
            const element = columns_level_0[index];
            columns_1.push({
                header: element.title,
                dataKey: element.key
            });
        }
        var columns_2 = [];
        for (let index = 0; index < columns_level_1.length; index++) {
            const element = columns_level_1[index];
            columns_2.push({
                header: element.title,
                dataKey: element.key
            });
        }
        var columns_3 = [];
        for (let index = 0; index < columns_level_2.length; index++) {
            const element = columns_level_2[index];
            columns_3.push({
                header: element.title,
                dataKey: element.key
            });
        }
        var totalPagesExp = "{total_pages_count_string}";
        var pdfDoc = new jsPDF();
        var content_1 = await getNivelVendedor();
        for (let contador_1 = 0; contador_1 < content_1.length; contador_1++) {
            const item_1 = content_1[contador_1];
            if(contador_1 == 0){
                marginTop = 24;
            }else{
                marginTop = pdfDoc.previousAutoTable.finalY + 3;
            }
            pdfDoc.autoTable({
                columns: columns_1,
                body: [item_1],
                theme: 'grid',
                startY: marginTop,
                styles: {
                    overflow: 'linebreak',
                    cellWidth: 14,
                    fontSize: 5,
                    cellPadding: 0.7,
                    halign: 'right',
                    lineColor: [44, 62, 80],
                    lineWidth: 0.1,
                },
                headStyles: {
                    fontSize: 5,
                    minCellWidth: 15,
                    halign: 'left'
                },
                margin:{left:7, right:7, bottom:10, top:24},
                columnStyles:{
                    description: {halign: 'left', cellWidth:136},
                    cod_supervisor: {halign: 'right', cellWidth:20},
                    total_invoice: {halign: 'right', cellWidth:20},
                    total_comision: {halign: 'right', cellWidth:20},
                },
                didDrawPage: function (data) {
                    pdfDoc.addImage(logo_negro, 'png', 7, 7,25,10);
                    pdfDoc.setFontSize(12);
                    pdfDoc.setTextColor(40);
                    pdfDoc.text('Avance de comisiones - Vendedores',(pdfDoc.internal.pageSize.getWidth() / 2) - 30,7);
                    pdfDoc.setFontSize(9);
                    pdfDoc.setTextColor(40);
                    pdfDoc.text('Fecha Vigencia: ' + moment().format('DD/MM/YYYY') , pdfDoc.internal.pageSize.getWidth() - 48,18);
                    pdfDoc.setLineWidth(0.2);
                    pdfDoc.setDrawColor('#424242');
                    pdfDoc.line(7, 20, pdfDoc.internal.pageSize.getWidth() - 7 , 20);

                    var str = "Página " + data.pageCount;
                    if (typeof pdfDoc.putTotalPages === 'function') {
                        str = str + " de " + totalPagesExp;
                    }
                },
            });
            var content_2 = await getNivelTipo(item_1.cod_vendedor_persona);
            pdfDoc.autoTable({
                columns: columns_2,
                body: [{
                    description:""
                }],
                theme: 'grid',
                startY: pdfDoc.previousAutoTable.finalY,
                styles: {
                    overflow: 'linebreak',
                    cellWidth: 14,
                    fontSize: 5,
                    cellPadding: 0.7,
                    halign: 'right',
                    lineColor: [44, 62, 80],
                    lineWidth: 0.1,
                },
                headStyles: {
                    fontSize: 5,
                    fillColor: [52, 73, 94], // COLOR DE FONDO DEL TITULO
                    minCellWidth: 15,
                    halign: 'left'
                },
                margin:{left:7, right:7, bottom:10, top:24},
                columnStyles:{
                    description: {halign: 'left', cellWidth:156},
                    total_invoice: {halign: 'right', cellWidth:20},
                    total_comision: {halign: 'right', cellWidth:20},
                },
            });
            for (let contador_2 = 0; contador_2 < content_2.length; contador_2++) {
                const item_2 = content_2[contador_2];
                var marginTop = pdfDoc.previousAutoTable.finalY;
                if(contador_2 == 0){
                    marginTop = marginTop - 3.3;
                }
                pdfDoc.autoTable({
                    columns: columns_2,
                    body: [item_2],
                    theme: 'grid',
                    startY: marginTop,
                    showHead: 'never',
                    styles: {
                        overflow: 'linebreak',
                        cellWidth: 14,
                        fontSize: 5,
                        cellPadding: 0.7,
                        halign: 'right',
                        lineColor: [44, 62, 80],
                        lineWidth: 0.1,
                    },
                    margin:{left:7, right:7, bottom:10, top:24},
                    columnStyles:{
                        description: {halign: 'left', cellWidth:156},
                        total_invoice: {halign: 'right', cellWidth:20},
                        total_comision: {halign: 'right', cellWidth:20},
                    },
                });
                var content_3 = await getNivelMarca(item_1.cod_vendedor_persona, item_2.tip_com);
                pdfDoc.autoTable({
                    columns: columns_3,
                    body: [{
                        description:""
                    }],
                    theme: 'grid',
                    startY: pdfDoc.previousAutoTable.finalY,
                    styles: {
                        overflow: 'linebreak',
                        cellWidth: 14,
                        fontSize: 5,
                        cellPadding: 0.7,
                        halign: 'right',
                        lineColor: [44, 62, 80],
                        lineWidth: 0.1,
                    },
                    headStyles: {
                        fontSize: 5,
                        fillColor: [241, 196, 15], // COLOR DE FONDO DEL TITULO
                        minCellWidth: 15,
                        halign: 'left'
                    },
                    margin:{left:7, right:7, bottom:10, top:24},
                    columnStyles:{
                        description: {halign: 'left', cellWidth:176},
                        total_invoice: {halign: 'right', cellWidth:20},
                    },
                });
                for (let contador_3 = 0; contador_3 < content_3.length; contador_3++) {
                    const item_3 = content_3[contador_3];
                    var marginTop = pdfDoc.previousAutoTable.finalY;
                    if(contador_3 == 0){
                        marginTop = marginTop - 3.3;
                    }
                    pdfDoc.autoTable({
                        columns: columns_3,
                        body: [item_3],
                        theme: 'grid',
                        startY: marginTop,
                        showHead: 'never',
                        styles: {
                            overflow: 'linebreak',
                            cellWidth: 14,
                            fontSize: 5,
                            cellPadding: 0.7,
                            halign: 'right',
                            lineColor: [44, 62, 80],
                            lineWidth: 0.1,
                        },
                        margin:{left:7, right:7, bottom:10, top:24},
                        columnStyles:{
                            description: {halign: 'left', cellWidth:176},
                            total_invoice: {halign: 'right', cellWidth:20},
                        },
                    });
                }
            }
        }
        setTimeout( ()=> {
            if (typeof pdfDoc.putTotalPages === 'function') {
                pdfDoc.putTotalPages(totalPagesExp);
            }
            pdfDoc.save('comisiones_vendedores.pdf');
            setActivarSpinner(false);
        }, 1000);
    }
    const export2Excel = async() =>{
        setActivarSpinner(true);
        var excelData = _.map(data, function(item){
            return _.omit(item, ['COD_VENDEDOR_PERSONA','MONTO_COBRAR']);
        });
        // createHtml2ExportTable2Excel(excel,'Comision de Vendedores')

        var vTitleXXX = 'ABCD';

        var vEncodeHead = '<html><head><meta charset="UTF-8"></head><body>';
        var vReportName = '';

        vReportName += '<b style="color:#39639c"><font size="6">';
        vReportName += vTitleXXX;
        vReportName += '</b></font><br>';


        // var HTML = '<table style="font-weight: bold"><tr style="background-color:red"><td>a</td><td>b</td></tr><tr><td>1</td><td>2</td></tr><tr><td>1</td><td>2</td></tr></table>';
        var HTML = "";
        HTML += `   <table>
                        <thead>
                            <tr>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                                <th> X</th>
                            </tr>
                        </thead>
                        <tbody>`;
        console.log(excelData);
        for (let index = 0; index < excelData.length; index++) {
            const element = excelData[index];
            HTML += `       
                            <tr>
                            <td>${element.COD_VENDEDOR}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.COD_VENDEDOR}</td> 
                            <td>${element.COD_VENDEDOR}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            </tr>`;
        }
        for (let index = 0; index < excelData.length; index++) {
            const element = excelData[index];
            HTML += `       
                            <tr>
                            <td>${element.COD_VENDEDOR}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td> 
                            <td>${element.COD_VENDEDOR}</td> 
                            <td>${element.COD_VENDEDOR}</td> 
                            <td>${element.VENDEDOR_PERSONA}</td>  
                            </tr>`;
        }
        for (let index = 0; index < excelData.length; index++) {
            const element = excelData[index];
            HTML += `       
                            <tr>
                                <td>${element.COD_VENDEDOR}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.COD_VENDEDOR}</td> 
                                <td>${element.COD_VENDEDOR}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                            </tr>`;
        }
        for (let index = 0; index < excelData.length; index++) {
            const element = excelData[index];
            HTML += `       
                            <tr>
                                <td>${element.COD_VENDEDOR}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                                <td>${element.COD_VENDEDOR}</td> 
                                <td>${element.COD_VENDEDOR}</td> 
                                <td>${element.VENDEDOR_PERSONA}</td> 
                            </tr>`;
        }
        HTML += `       
                        </tbody>
                    </table `;


        var Qlik = new Blob([vEncodeHead +vReportName  + HTML + '</body></html>'], {
                type: "application/vnd.ms-excel;charset=utf-8"
        });

        saveAs(Qlik, "XXX.xls");



        setTimeout( ()=> {
            setActivarSpinner(false);
        }, 200);
    }
    return(
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${Titulo}` }/>
            <Main.Spin size="large" spinning={activarSpinner}>
                <div className="paper-container">
                    <Main.Paper className="paper-style">
                        <Main.TituloForm titulo={Titulo} />
                        <div className="paper-header-menu">
                            <Button
                                icon={<img src={excel} width="20" style={{
                                    paddingBottom:'2px'
                                }}/>}
                                onClick={export2Excel}
                                className="paper-header-menu-button"
                                />
                            {/* <Button
                                icon={<img src={pdf} width="20" style={{
                                    paddingBottom:'3px'
                                }}/>}
                                onClick={export2PDF}
                                className="paper-header-menu-button"
                            /> */}
                            <Input
                                    id="input-with-icon-adornment"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    style={{ marginRight: '10px', float: 'right'}}
                                    startAdornment={
                                        <InputAdornment position="start" >
                                            <SearchIcon />
                                        </InputAdornment>
                                    }
                                />
                        </div>
                        <div className="form-container">  
                            <Table 
                                dataSource={line} 
                                columns={columns_level_0} 
                                size="small"
                                expandable={{expandedRowRender}}
                                pagination={false}
                                bordered
                            />
                            <br />
                        </div>
                    </Main.Paper>
                </div>
            </Main.Spin>
        </Main.Layout>
    )
}
export default Reporte;