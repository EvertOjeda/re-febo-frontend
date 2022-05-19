import React, { useEffect, useState } from "react";
import { Spin, Button } from "antd"
import _                                        from 'underscore';
import Main                                     from "../../../../../components/utils/Main";
import $ from "jquery";
import SearchIcon                       from '@material-ui/icons/Search';
import Input                            from '@material-ui/core/Input';
import InputAdornment                   from '@material-ui/core/InputAdornment';
import excel                            from "../../../../../assets/icons/excel.svg";
import pdf                              from "../../../../../assets/icons/pdf.svg";
import { createHtml2ExportTable2Excel2 } from "../../../../../components/utils/exportToExcelFileSaver";
import moment from "moment";
import jsPDF                                    from 'jspdf';
import 'jspdf-autotable';

const Reporte = ()=>{
    const [data, setData] = useState([]);
    const [ activarSpinner , setActivarSpinner   ] = useState(true);
    useEffect( ()=>{
        getData();
    },[]);
    const getData = async() =>{
        var url   = `/vt/reporte/tacticos`;
        await Main.Request( url, 'POST',{tipo:'ajuste_de_precio', cod_empresa: sessionStorage.getItem('cod_empresa')})
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
                html += '-';
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
            return item[value];
        });
        var len = _.uniq(info, function(item){
            return item.COD_ARTICULO_A_BON;
        });
        len = len.length;
        var bonificacion = '';
        if(content.length > 1){
            for (let index = 0; index < content.length; index++) {
                const item = content[index];
                if(index > 0){
                    html += '<tr>';
                }
                html += '<td>' + item.COD_ARTICULO      + '</td>';
                html += '<td>' + item.DESC_ARTICULO     + '</td>';
                html += '<td>' + item.COD_UNIDAD_MEDIDA + ' - ' + item.REFERENCIA +  '</td>';
                html += '<td class="right aligned">' + new Intl.NumberFormat("de-DE").format(item.PRECIO_UNITARIO) + '</td>';
                html += '</tr>';
            }
        }
        if(content.length == 1){
            var item = content[0];
            html += '<td>' + item.COD_ARTICULO + '</td>';
            html += '<td>' + item.DESC_ARTICULO + '</td>';
            html += '<td>' + item.COD_UNIDAD_MEDIDA + '-' + item.REFERENCIA + '</td>';
            html += '<td class="right aligned">' + new Intl.NumberFormat("de-DE").format(item.PRECIO_UNITARIO) + '</td>';
        }
        return html;
    }

    const Build = async(rows_data) =>{
        var info = [];
        var xrows = rows_data;
        var rows_data = _.uniq(rows_data, function(item){
            return item.COD_AJUSTE;
        });
        var html = '';
        for (let index = 0; index < rows_data.length; index++) {
            const item = rows_data[index];
            info = _.flatten(_.filter(xrows,function (i) {
                return i.COD_AJUSTE == item.COD_AJUSTE;
            }));
            var len = _.uniq(info, function(item){
                return item.COD_ARTICULO;
            });
            len = len.length;
            var productos      = await getProducts(info, "COD_ARTICULO");
            html += '<tr>';
            html += '<td rowSpan="' + len + '" class="center aligned">'  + item.ACTIVO + '</td>';
            html += '<td rowSpan="' + len + '" class="center aligned">'  + item.COD_AJUSTE + '</td>';
            html += '<td rowSpan="' + len + '">' + item.DESCRIPCION      + '</td>';
            html += '<td rowSpan="' + len + '">' + item.COMENTARIO       + '</td>';
            html += '<td rowSpan="' + len + '">' + item.FEC_INI_PROMO + '</td>';
            html += '<td rowSpan="' + len + '">' + item.FEC_FIN_PROMO + '</td>';
            html += '<td rowSpan="' + len + '">' + await getInfo(info, "COD_LISTA_PRECIO", "DESC_LISTA_PRECIO", false) + '</td>';
            html += '<td rowSpan="' + len + '">' + await getInfo(info, "COD_SUPERVISOR", "DESC_SUPERVISOR") + '</td>';
            html += '<td rowSpan="' + len + '">' + await getVendedor(info, "COD_VENDEDOR", "DESC_VENDEDOR") + '</td>';
            if(len == 1){
                html += productos;
                html += '</tr>';
            }
            if(len > 1){
                html += productos;
            }
        }
        $('#table-body-ajuste-precio').empty();
        $('#table-body-ajuste-precio').append(html);
    }

    const export2PDF = async() =>{
        // setActivarSpinner(true);
        var pdfDoc = new jsPDF('l', 'pt', 'A4');
        var totalPagesExp = "{total_pages_count_string}";

        // BONIFICACION
        pdfDoc.autoTable({
            theme:'grid',
            html: '#table-ajuste-precio',
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
                0: {halign: 'center', cellWidth:50},
                // Nro Promocion
                1: {halign: 'center', cellWidth:50},
                // Descripcion
                2: {halign: 'left', cellWidth:130},
                // Comentario
                3: {halign: 'left', cellWidth:97},
                // Inicion Vigencia
                4: {halign: 'center', cellWidth:30},
                // Fin Vigencia
                5: {halign: 'center', cellWidth:30},
                // lista de precio
                6: {halign: 'left', cellWidth:60},
                // Supervisor
                7: {halign: 'left', cellWidth:80},
                // Vendedor
                8: {halign: 'left', cellWidth:80},
                // Codigo
                9: {halign: 'left', cellWidth:25},
                // Descripcion
                10: {halign: 'left', cellWidth:100},
                // Unidad de medida
                11: {halign: 'left', cellWidth:50},
                // Precio
                12: {halign: 'right', cellWidth:30},
            },
            margin:{top:60, left:15, right:15, bottom:25},
            didDrawPage: function (data) {

                // pdfDoc.addImage(logo, 'png', 15, 15,80,30);

                pdfDoc.setFontSize(12);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Tácticos - Ajuste de Precios',(pdfDoc.internal.pageSize.getWidth() / 2) - 70,30);

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
        pdfDoc.save('tacticos_ajuste_de_precios_' + moment().format('DD_MM_YYYY') + '.pdf');
    }

    const export2Excel = async() =>{
        setActivarSpinner(true);
        createHtml2ExportTable2Excel2(data,'tacticos_ajuste_de_precios_' + moment().format('DD_MM_YYYY') );
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
                var cod_ajuste = index.COD_AJUSTE;
                cod_ajuste = cod_ajuste.toString();
                // CODIGO AJUSTE
                if( cod_ajuste.indexOf( value ) > -1 ){
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
            <table 
                className="ui basic compact table" 
                style={{fontSize: '.6em', marginBottom:'15px', marginTop:'5px'}}
                id="table-ajuste-precio">
                <thead className="headTable">
                    <tr>
                        <th rowSpan="2" width="60">Estado</th>
                        <th rowSpan="2" width="60">Promocion</th>
                        <th rowSpan="2" width="500">Descripcion</th>
                        <th rowSpan="2" width="500">Comentario</th>
                        <th colSpan="2">Vigencia</th>
                        <th rowSpan="2" width="200">Lista de precios</th>
                        <th rowSpan="2" width="150">Supervisor</th>
                        <th rowSpan="2" width="150">Vendedor</th>
                        <th colSpan="4">Productos</th>
                    </tr>
                    <tr>
                        <th width="60">Inicio</th>
                        <th width="60">Fin</th>
                        <th width="50">Codigo</th>
                        <th width="180">Descripcion</th>
                        <th width="100">Unidad</th>
                        <th width="100">Precio</th>
                    </tr>
                </thead>
                <tbody id="table-body-ajuste-precio" className="table-prueba"></tbody>
            </table>
        </Spin>
    )
}
export default Reporte;