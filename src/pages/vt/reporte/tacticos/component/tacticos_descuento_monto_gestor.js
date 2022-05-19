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
import jsPDF                                    from 'jspdf';
import 'jspdf-autotable';
const Reporte = ()=>{
    const [data, setData] = useState([]);
    const [line, setLine] = useState([]);
    const [ activarSpinner    , setActivarSpinner   ] = useState(true);
    
    useEffect( ()=>{
        getData();
    },[]);

    const getData = async() =>{
        var url   = `/vt/reporte/tacticos`;
        await Main.Request( url, 'POST',{tipo:'descuento_monto_gestor', cod_empresa: sessionStorage.getItem('cod_empresa')})
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

    const getVendedor = (info, value) => {
        var html = '';
        var content = info;
        var content = _.uniq(info, function(item){
            return item.COD_SUPERVISOR;
        });
        content.sort(function (a, b) {
            if (parseInt(a.COD_SUPERVISOR) > parseInt(b.COD_SUPERVISOR)) {
                return  1;
            }
            if (parseInt(a.COD_SUPERVISOR) < parseInt(b.COD_SUPERVISOR)) {
                return -1;
            }
        });
        for (let index = 0; index < content.length; index++) {
            const item = content[index];
            if(item.COD_SUPERVISOR != '9999' ){
                var vendedor = info.filter( i => i.COD_SUPERVISOR === item.COD_SUPERVISOR );
                vendedor = _.uniq(vendedor, function(y){
                    return y.COD_VENDEDOR;
                });
                var html_vendedor = '';
                for (let x = 0; x < vendedor.length; x++) {
                    const element = vendedor[x];
                    if(element.COD_VENDEDOR != null){
                        if(element.COD_VENDEDOR != '99999'){
                            html_vendedor += element.COD_VENDEDOR;
                            if( x < vendedor.length - 1){
                                html_vendedor += ' - '
                            }
                        }else{
                            html_vendedor += 'Todos';
                        }
                        
                    }
                }
                html += item.COD_SUPERVISOR + ' ( ' + html_vendedor + ' )';
            }else{
                html += 'Todos';
            }
            if(index != content.length - 1){
                html += '<br/>';
            }
        }
        return html;
    }

    const getProducts = async(info, value) => {
        var html = '';
        var content = _.uniq(info, function(item){
            return item.COD_ARTICULO;
        });
        content.sort(function (a, b) {
            if (parseInt(a.COD_SEGMENTO) < parseInt(b.COD_SEGMENTO)) {
                return  1;
            }
            if (parseInt(a.COD_SEGMENTO) > parseInt(b.COD_SEGMENTO)) {
                return -1;
            }
        });
        if(content.length > 1){
            for (let index = 0; index < content.length; index++) {
                const item = content[index];
                if(index > 0){
                    html += '<tr>';
                }
                html += '<td>' + item.COD_SEGMENTO  + '</td>';
                html += '<td>' + item.COD_ARTICULO  + '</td>';
                html += '<td>' + item.DESC_ARTICULO + '</td>';
                html += '<td class="right aligned">' + new Intl.NumberFormat("de-DE").format(item.TOT_VALOR)  + '</td>';
                html += '<td class="right aligned">' + new Intl.NumberFormat("de-DE").format(item.PORC_DESC)  + '</td>';
                html += '</tr>';
            }
        }
        if(content.length == 1){
            var item = content[0];
            html += '<td>' + item.COD_SEGMENTO  + '</td>';
            html += '<td>' + item.COD_ARTICULO  + '</td>';
            html += '<td>' + item.DESC_ARTICULO + '</td>';
            html += '<td class="right aligned">' + new Intl.NumberFormat("de-DE").format(item.TOT_VALOR)  + '</td>';
            html += '<td class="right aligned">' + new Intl.NumberFormat("de-DE").format(item.PORC_DESC)  + '</td>';
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
            html += '<td rowSpan="' + len + '">' + item.COD_UNID_NEGOCIO + ' - ' + item.DESC_UNID_NEGOCIO +'</td>';
            html += '<td rowSpan="' + len + '">' + item.COD_TIPO + '-' + item.DESC_TIPO         +'</td>';
            html += '<td rowSpan="' + len + '" class="center aligned">' + item.IND_COMBO     + '</td>';
            html += '<td rowSpan="' + len + '">' + item.FEC_INI_PROMO + '</td>';
            html += '<td rowSpan="' + len + '">' + item.FEC_FIN_PROMO + '</td>';
            html += '<td rowSpan="' + len + '">' + await getInfo(info, "TIP_CLIENTE", "DESC_TIP_CLIENTE", false) + '</td>';
            html += '<td rowSpan="' + len + '">' + await getInfo(info, "COD_LISTA_PRECIO", "DESC_LISTA_PRECIO", false) + '</td>';
            html += '<td rowSpan="' + len + '">' + await getInfo(info, "COD_GERENTE", "DESC_GERENTE") + '</td>';
            html += '<td rowSpan="' + len + '">' + await getInfo(info, "COD_SUPERVISOR", "DESC_SUPERVISOR") + '</td>';
            html += '<td rowSpan="' + len + '">' + await getVendedor(info, "COD_VENDEDOR", "DESC_VENDEDOR") + '</td>';
            html += '<td rowSpan="' + len + '">' + item.TIPO_TACTICO + '</td>';
            html += '<td rowSpan="' + len + '">' + await getInfo(info, "COD_CATEGORIA", "DESC_CATEGORIA", true) + '</td>';
            if(len == 1){
                html += productos; 
                html += '</tr>'; 
            }
            if(len > 1){
                html += productos;
            }
        }
        $('#table-body-descuento-monto-gestor').empty();
        $('#table-body-descuento-monto-gestor').append(html);
    }

    const export2PDF = async() =>{
        // setActivarSpinner(true);
        var pdfDoc = new jsPDF('l', 'pt', 'A4');
        var totalPagesExp = "{total_pages_count_string}";

        // BONIFICACION
        pdfDoc.autoTable({
            theme:'grid',
            html: '#table-descuento-monto-gestor',
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
                0: {halign: 'center', cellWidth:30},
                // Nro Promocion
                1: {halign: 'center', cellWidth:30},
                // Descripcion
                2: {halign: 'left', cellWidth:70},
                // Comentario
                3: {halign: 'left', cellWidth:57},
                // Unidad de Negocio
                4: {halign: 'left', cellWidth:40},
                // Tipo de Tactico
                5: {halign: 'left', cellWidth:40},
                // Combo
                6: {halign: 'center', cellWidth:25},
                // Inicion Vigencia
                7: {halign: 'center', cellWidth:30},
                // Fin Vigencia
                8: {halign: 'center', cellWidth:30},
                // perfil
                9: {halign: 'left', cellWidth:50},
                // lista de precio
                10: {halign: 'left', cellWidth:50},
                // Jefe Venta
                11: {halign: 'left', cellWidth:35},
                // Supervisor
                12: {halign: 'left', cellWidth:35},
                // Vendedor
                13: {halign: 'left', cellWidth:35},
                // Tipo
                14: {halign: 'center', cellWidth:30},
                // Categoria
                15: {halign: 'left', cellWidth:30},
                // Segmento
                16: {halign: 'left', cellWidth:30},
                // Codigo
                17: {halign: 'left', cellWidth:25},
                // Descripcion
                18: {halign: 'left', cellWidth:80},
                // Valor Compra
                19: {halign: 'right', cellWidth:30},
                // Porcentage Descuento
                20: {halign: 'right', cellWidth:30},
            },
            margin:{top:60, left:15, right:15, bottom:25},
            didDrawPage: function (data) {

                // pdfDoc.addImage(logo, 'png', 15, 15,80,30);

                pdfDoc.setFontSize(12);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Tácticos - Descuento Monto Gestor',(pdfDoc.internal.pageSize.getWidth() / 2) - 70,30);

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
        pdfDoc.save('tacticos_descuento_monto_gestor_' + moment().format('DD_MM_YYYY') + '.pdf');
    }

    const export2Excel = async() =>{
        setActivarSpinner(true);
        createHtml2ExportTable2Excel2(data,'Tactico_descuento_monto_gestor_' + moment().format('DD_MM_YYYY') );
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
                    id="table-descuento-monto-gestor">
                <thead className="headTable">
                    <tr>
                        <th rowSpan="2" width="60">Estado</th>
                        <th rowSpan="2" width="60">Promocion</th>
                        <th rowSpan="2" width="500">Descripcion</th>
                        <th rowSpan="2" width="500">Comentario</th>
                        <th rowSpan="2" width="200">Unid. Negocio</th>
                        <th rowSpan="2" width="120">Tip. Tactico</th>
                        <th rowSpan="2" width="50">Combo</th>
                        <th colSpan="2" >Vigencia</th>
                        <th rowSpan="2" width="200">Perfil</th>
                        <th rowSpan="2" width="200">Lista de precios</th>
                        <th rowSpan="2" width="150">Jefe de ventas</th>
                        <th rowSpan="2" width="150">Supervisor</th>
                        <th rowSpan="2" width="150">Vendedor</th>
                        <th rowSpan="2" width="150">Tipo</th>
                        <th rowSpan="2" width="150">Categoria</th>
                        <th colSpan="5" >Productos</th>
                    </tr>
                    <tr>
                        <th width="60">Inicio</th>
                        <th width="60">Fin</th>
                        <th width="50">Segmento</th>
                        <th width="50">Codigo</th>
                        <th width="180">Descripción</th>
                        <th width="180">Valor Compra</th>
                        <th width="50">Porcentaje Descuento</th>
                    </tr>
                </thead>
                <tbody id="table-body-descuento-monto-gestor" className="table-prueba"></tbody>
            </table>  
        </Spin>          
    )
}
export default Reporte;