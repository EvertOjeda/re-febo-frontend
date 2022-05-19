import React, { useEffect, useState } from "react";
import { Spin, Button } from 'antd';
import _ from 'underscore';
import Main from "../../../../../components/utils/Main";
import $ from "jquery";
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import excel from "../../../../../assets/icons/excel.svg";
import pdf from "../../../../../assets/icons/pdf.svg";
import { createHtml2ExportTable2Excel2 } from "../../../../../components/utils/exportToExcelFileSaver";
import moment from "moment";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const Reporte = ()=>{
    const [data, setData] = useState([]);
    const [ activarSpinner , setActivarSpinner   ] = useState(true);
    useEffect( ()=>{
        getData();
    },[]);
    const getData = async() =>{
        var url   = `/vt/reporte/tacticos`;
        await Main.Request( url, 'POST',{tipo:'tienda_descuento_monto', cod_empresa: sessionStorage.getItem('cod_empresa')})
            .then( response =>{
                setData(response.data.rows);
                Build(response.data.rows);
                setActivarSpinner(false);
            })
    };

    const getInfo = (info, value, desc_value, mostrar_descripcion) => {
        var html = '';
        var content = info;
        var content = _.uniq(info, function(item){
            return item[value];
        });
        content.sort(function (a, b) {
            if (parseInt(a[value]) > parseInt(b[value])) {
                return  1;
            }
            if (parseInt(a[value]) < parseInt(b[value])) {
                return -1;
            }
        });
        for (let index = 0; index < content.length; index++) {
            const item = content[index];
            if(item[value] != null){
                if(item[value] != '9999' && item[value] != '99999' ){
                    if(mostrar_descripcion){
                        html += item[value] + ' - ' + item[desc_value];
                    }else{
                        html += item[value]
                    }
                }else{
                    html += 'Todos';
                }
                
            }
            if(index != content.length - 1){
                html += ' - ';
            }
        }
        return html;
    }
    
    const getProducts = async(info, value) => {
        var html = '';
        var content = _.uniq(info, function(item){
            return item[value];
        });
        content.sort(function (a, b) {
            if (parseInt(a[value]) < parseInt(b[value])) {
                return  1;
            }
            if (parseInt(a[value]) > parseInt(b[value])) {
                return -1;
            }
        });
        if(content.length > 1){
            for (let index = 0; index < content.length; index++) {
                const item = content[index];
                if( index > 0){
                    html += '<tr>';
                }
                html += '<td>' + item.TIPO_PROM      + '</td>';
                html += '<td>' + item.COD_ARTICULO      + '</td>';
                html += '<td>' + item.DESC_ARTICULO     + '</td>';
                html += '<td>' + item.COD_UNIDAD_MEDIDA + ' - ' + item.REFERENCIA +  '</td>';
                html += '<td class="right aligned">' + item.CANTIDAD + '</td>';
                html += '<td class="right aligned">' + item.CANT_A_PAGAR + '</td>';
                html += '<td class="right aligned">' + parseFloat(item.PORC_DESCUENTO).toFixed(2) + '</td>';
                html += '</tr>';
            }
        }
        if(content.length == 1){
            var item = content[0];
            html += '<td>' + item.TIPO_PROM + '</td>';
            html += '<td>' + item.COD_ARTICULO + '</td>';
            html += '<td>' + item.DESC_ARTICULO + '</td>';
            html += '<td>' + item.COD_UNIDAD_MEDIDA + '-' + item.REFERENCIA + '</td>';
            html += '<td class="right aligned">' + item.CANTIDAD + '</td>';
            html += '<td class="right aligned">' + item.CANT_A_PAGAR + '</td>';
            html += '<td class="right aligned">' + parseFloat(item.PORC_DESCUENTO).toFixed(2) + '</td>';
        }
        return html;
    }

    const Build = async(rows_data) =>{
        var info = [];
        var xrows = rows_data;
        var rows_data = _.uniq(rows_data, function(item){
            return item.NRO_PROMOCION;
        });
        var html = '';
        for (let index = 0; index < rows_data.length; index++) {
            const item = rows_data[index];
            info = _.flatten(_.filter(xrows,function (i) {
                return i.NRO_PROMOCION == item.NRO_PROMOCION;
            }));
            var len = _.uniq(info, function(item){
                return item.COD_ARTICULO;
            });
            len = len.length;
            var productos      = await getProducts(info, "COD_ARTICULO");
            html += '<tr>';
            html += '<td rowSpan="' + len + '" class="center aligned">'  + item.ACTIVO + '</td>';
            html += '<td rowSpan="' + len + '" class="center aligned">'  + item.NRO_PROMOCION + '</td>';
            html += '<td rowSpan="' + len + '">' + item.DESCRIPCION      + '</td>';
            html += '<td rowSpan="' + len + '">' + item.COMENTARIO       + '</td>';
            html += '<td rowSpan="' + len + '">' + item.COD_UNID_NEGOCIO + ' - ' + item.DESC_UNID_NEGOCIO + '</td>';
            html += '<td rowSpan="' + len + '">' + item.COD_TIPO         + ' - ' + item.DESC_TIPO + '</td>';
            html += '<td rowSpan="' + len + '">' + item.IND_COMBO        + '</td>';
            html += '<td rowSpan="' + len + '">' + item.FEC_INI_PROMO    + '</td>';
            html += '<td rowSpan="' + len + '">' + item.FEC_FIN_PROMO    + '</td>';
            html += '<td rowSpan="' + len + '">' + await getInfo(info, "COD_LISTA_PRECIO", "DESC_LISTA_PRECIO", false) + '</td>';
            if(len == 1){
                html += productos;
                html += '</tr>'; 
            }
            if(len > 1){
                html += productos;
            }
        }
        $('#table-body-tienda-descuento-monto').empty();
        $('#table-body-tienda-descuento-monto').append(html);
    }

    const export2PDF = async() =>{
        var pdfDoc = new jsPDF('l', 'pt', 'A4');
        var totalPagesExp = "{total_pages_count_string}";
        pdfDoc.autoTable({
            theme:'grid',
            html: '#table-tienda-descuento-monto',
            styles: {
                fontSize: 5,
                cellPadding: 0.8,
            },
            headStyles: {
                fillColor: '#b8b9b5',
                fontSize: 5,
                lineColor: [223, 223, 223],
                lineWidth: 0.1,
                textColor: 44,
                halign: 'center'
            },
            columnStyles:{
                // Estado
                0: {halign: 'center', cellWidth:25},
                // Nro Promocion
                1: {halign: 'center', cellWidth:35},
                // Descripcion
                2: {halign: 'left', cellWidth:120},
                // Comentario
                3: {halign: 'left', cellWidth:87},
                // Unidad de Negocio
                4: {halign: 'left', cellWidth:40},
                // Tipo de Tactico
                5: {halign: 'left', cellWidth:60},
                // Combo
                6: {halign: 'center', cellWidth:30},
                // Inicion Vigencia
                7: {halign: 'center', cellWidth:30},
                // Fin Vigencia
                8: {halign: 'center', cellWidth:30},
                // lista de precio
                9: {halign: 'left', cellWidth:50},
                // Tipo Descuento
                10: {halign: 'left', cellWidth:30},
                // Codigo
                11: {halign: 'left', cellWidth:25},
                // Descripcion
                12: {halign: 'left', cellWidth:100},
                // Unidad de medida
                13: {halign: 'left', cellWidth:40},
                // Cantidad llevar
                14: {halign: 'right', cellWidth:30},
                // Cantidad Pagar
                15: {halign: 'right', cellWidth:40},
                // Porcentaje descuento
                16: {halign: 'right', cellWidth:40},
            },
            margin:{top:60, left:15, right:15, bottom:25},
            didDrawPage: function (data) {

                // pdfDoc.addImage(logo, 'png', 15, 15,80,30);

                pdfDoc.setFontSize(12);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Tácticos - Tienda Descuento Monto',(pdfDoc.internal.pageSize.getWidth() / 2) - 70,30);

                pdfDoc.setFontSize(6);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Fecha de expedición: ' + moment().format('DD/MM/YYYY') + ' Hs.', pdfDoc.internal.pageSize.getWidth() - 115, pdfDoc.internal.pageSize.getHeight() - 15);
                
                var str = "Página " + data.pageCount;
                if (typeof pdfDoc.putTotalPages === 'function') {
                    str = str + " de " + totalPagesExp;
                }
                pdfDoc.text( str, 15, pdfDoc.internal.pageSize.getHeight() - 15);
            },
        });
        if (typeof pdfDoc.putTotalPages === 'function') {
            pdfDoc.putTotalPages(totalPagesExp);
        }
        pdfDoc.save('tacticos_tienda_descuento_monto_' + moment().format('DD_MM_YYYY') + '.pdf');
    }

    const export2Excel = async() =>{
        setActivarSpinner(true);
        createHtml2ExportTable2Excel2(data,'Tactico_tienda_descuento_monto_' + moment().format('DD_MM_YYYY') );
        setTimeout( ()=> {
            setActivarSpinner(false);
        }, 200);
    }

    const handleChange = (event) => {
        var content = data;
        var value   = event.target.value;
        if(value.length > 0){
            content = _.flatten(_.filter(data, (index) => {
                // ACTIVO
                if( index.ACTIVO.indexOf( value.toUpperCase() ) > -1 ){
                    return true; 
                }
                var nro_promocion = index.NRO_PROMOCION;
                nro_promocion = nro_promocion.toString();
                // NRO PROMOCION
                if( nro_promocion.indexOf( value ) > -1 ){
                    return true; 
                }
                // DESCRIPCION
                if( index.DESCRIPCION.indexOf( value.toUpperCase() ) > -1 ){
                    return true; 
                }
            }));
        }
        Build(content);
    }

    return(
        <Spin spinning={activarSpinner}>
            <div className="paper-header-menu">
                <Button
                    icon={<img src={excel} width="20" style={{
                        paddingBottom:'2px'
                    }}/>}
                    onClick={export2Excel}
                    className="paper-header-menu-button"
                    />
                <Button
                    icon={<img src={pdf} width="20" style={{
                        paddingBottom:'3px'
                    }}/>}
                    onClick={export2PDF}
                    className="paper-header-menu-button"
                />
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
            <table  className="ui basic compact celled table" 
                    style={{fontSize: '.6em', marginBottom:'15px', marginTop:'5px'}}
                    id="table-tienda-descuento-monto">
                <thead className="headTable">
                    <tr>
                        <th rowSpan="2" width="60">Estado</th>
                        <th rowSpan="2" width="60">Promocion</th>
                        <th rowSpan="2" width="500">Descripcion</th>
                        <th rowSpan="2" width="500">Comentario</th>
                        <th rowSpan="2" width="130">Unidad de Negocio</th>
                        <th rowSpan="2" width="130">Tipo de Tactico</th>
                        <th rowSpan="2" width="50">Combo</th>
                        <th colSpan="2">Vigencia</th>
                        <th rowSpan="2" width="100">Lista de precio</th>
                        <th colSpan="7">Productos</th>
                    </tr>
                    <tr>
                        <th width="60">Inicio</th>
                        <th width="60">Fin</th>
                        <th width="50">Tipo Descuento</th>
                        <th width="50">Codigo</th>
                        <th width="300">Descripcion</th>
                        <th width="150">Unidad</th>
                        <th width="50">Cantidad LLevar</th>
                        <th width="50">Cantidad Pagar</th>
                        <th width="50">Porcentaje Descuento</th>
                    </tr>
                </thead>
                <tbody id="table-body-tienda-descuento-monto" className="table-prueba"></tbody>
            </table>
        </Spin>
    )
}
export default Reporte;