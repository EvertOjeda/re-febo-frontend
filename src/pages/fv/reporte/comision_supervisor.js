import React, { Fragment, useEffect, useState } from "react";
import { Table, Button }                        from 'antd';
import moment                                   from "moment";
import _                                        from 'underscore';
import Main                                     from "../../../components/utils/Main";
import jsPDF                                    from 'jspdf';
import 'jspdf-autotable';
import SearchIcon                               from '@material-ui/icons/Search';
import Input                                    from '@material-ui/core/Input';
import InputAdornment                           from '@material-ui/core/InputAdornment';
import { createHtml2ExportTable2Excel }         from '../../../components/utils/exportTable2Excel';
import excel                                    from "../../../assets/icons/excel.svg";
import pdf                                      from "../../../assets/icons/pdf.svg";
const Titulo = "Comision de Supervisor";
const Level  = 2;
const columns_level_0 = [
    { title: 'Supervisor'       , dataIndex: 'description'      , key: 'description'        },
    { title: 'Cod. Persona'     , dataIndex: 'cod_persona'      , key: 'cod_persona'        },
    { title: 'Nombre y Apellido', dataIndex: 'nombre_supervisor', key: 'nombre_supervisor'  },
    { title: 'Total Ventas'     , dataIndex: 'total_invoice'    , key: 'total_invoice'      , align:'right', width: 150 },
    { title: 'Comisión'         , dataIndex: 'total_comision'   , key: 'total_comision'     , align:'right', width: 150 },
];
const columns_level_1 = [
    { title: 'Tipo'         , dataIndex: 'description'      , key: 'description'    },
    { title: 'Total Ventas' , dataIndex: 'total_invoice'    , key: 'total_invoice'  , align: 'right', width: 150},
    { title: 'Comision'     , dataIndex: 'total_comision'   , key: 'total_comision' , align: 'right', width: 150},
];
const columns_level_2 = [
    { title: 'Marca'        , dataIndex: 'description'      , key: 'description'    },
    { title: 'Total Ventas' , dataIndex: 'total_invoice'    , key: 'total_invoice'  , align: 'right', width: 150},
];
const defaultOpenKeys     = ['FV','FV-FV3', 'FV-FV3-FV33'];
const defaultSelectedKeys = ['FV-FV3-FV33-FVRECOSU'];
const Reporte = ()=>{
    const [data, setData] = useState([]);
    const [line, setLine] = useState([]);
    const [ activarSpinner    , setActivarSpinner   ] = useState(true);
    useEffect( ()=>{
        getData();
    },[]);
    const getData = async() =>{
        var url   = `/fv/reporte/comision_supervisor`;
        await Main.Request( url, 'POST',{value:'null'})
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
            return item.COD_SUPERVISOR_PERSONA;
        });
        rows_data.sort(function (a, b) {
            if (parseInt(a.COD_SUPERVISOR_PERSONA) > parseInt(b.COD_SUPERVISOR_PERSONA)) {
                return  1;
            }
            if (parseInt(a.COD_SUPERVISOR_PERSONA) < parseInt(b.COD_SUPERVISOR_PERSONA)) {
                return -1;
            }
        });
        _.each(rows_data,function(item){
            info = _.flatten(_.filter(xrows,function (index) {
                return index.COD_SUPERVISOR_PERSONA == item.COD_SUPERVISOR_PERSONA;
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
                key                     : item.COD_SUPERVISOR_PERSONA,
                description             : `${item.COD_SUPERVISOR} - ${item.DESC_SUPERVISOR}`,
                cod_persona             : item.COD_PERSONA,
                nombre_supervisor       : item.NOMBRE_SUPERVISOR,
                total_invoice           : new Intl.NumberFormat("de-DE").format(total_invoice),
                total_comision          : new Intl.NumberFormat("de-DE").format(total_comision),
                level                   : 0,
                cod_supervisor_persona  : item.COD_SUPERVISOR_PERSONA,
            });
        });
        setLine(rows);
    }
    const handleChange = async(e) =>{
        var value = e.target.value;
        if(value.trim().length == 0){
            value = 'null';
        }
        var url   = `/fv/reporte/comision_supervisor`;
        await Main.Request( url, 'POST', {'value':value})
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
            rows_data = data.filter(item => item.COD_SUPERVISOR_PERSONA.includes(record.key) );
        }
        if(nextLevel == 2){
            columns   = columns_level_2;
            rows_data = data.filter(item => item.COD_SUPERVISOR_PERSONA.includes(record.cod_supervisor_persona) && 
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
                cod_supervisor_persona  : item.COD_SUPERVISOR_PERSONA,
            });   
        }
        return (
                <Fragment>
                    {nextLevel < Level
                        ?   <Table 
                                columns={columns} 
                                dataSource={rows}
                                bordered
                                expandable={{ expandedRowRender }}
                                pagination={false}
                                style={{marginTop:'20px',marginBottom:'20px',marginRight:'10px'}}/>
                        :   <Table 
                                columns={columns} 
                                dataSource={rows}
                                bordered
                                pagination={false}
                                style={{marginTop:'20px',marginBottom:'20px',marginRight:'10px'}}/>
                    }
                </Fragment>
                )
    };
    const getNivelSupervisor = async() => {
        var rows = [];
        var info = [];
        var rows_data = data;
        var xrows = rows_data;
        var rows_data = _.uniq(rows_data, function(item){
            return item.COD_SUPERVISOR_PERSONA;
        });
        rows_data.sort(function (a, b) {
            if (parseInt(a.COD_SUPERVISOR_PERSONA) > parseInt(b.COD_SUPERVISOR_PERSONA)) {
                return  1;
            }
            if (parseInt(a.COD_SUPERVISOR_PERSONA) < parseInt(b.COD_SUPERVISOR_PERSONA)) {
                return -1;
            }
        });
        _.each(rows_data,function(item){
            info = _.flatten(_.filter(xrows,function (index) {
                return index.COD_SUPERVISOR_PERSONA == item.COD_SUPERVISOR_PERSONA;
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
                key                     : item.COD_SUPERVISOR_PERSONA,
                description             : `${item.COD_SUPERVISOR} - ${item.DESC_SUPERVISOR}`,
                cod_persona             : item.COD_PERSONA,
                nombre_supervisor       : item.NOMBRE_SUPERVISOR,
                total_invoice           : new Intl.NumberFormat("de-DE").format(total_invoice),
                total_comision          : new Intl.NumberFormat("de-DE").format(total_comision),
                level                   : 0,
                cod_supervisor_persona  : item.COD_SUPERVISOR_PERSONA,
            });
        });
        return rows;
    }

    const getNivelTipo = async(cod_supervisor_persona) => {
        var rows = [];
        var info = [];
        var rows_data = data;
        var rows_data = _.flatten(_.filter(rows_data, (item)=>{
            return item.COD_SUPERVISOR_PERSONA == cod_supervisor_persona
        }));
        var xrows = rows_data;
        rows_data.sort(function (a, b) {
            if (a.TIP_COM > b.TIP_COM) {
                return  1;
            }
            if (a.TIP_COM < b.TIP_COM) {
                return -1;
            }
        });
        _.each(rows_data,function(item){
            info = _.flatten(_.filter(xrows,function (index) {
                return index.COD_MARCA == item.COD_MARCA;
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
                description    : item.TIP_COM,
                marca          : item.COD_MARCA + ' - ' + item.DESC_MARCA,
                total_invoice  : new Intl.NumberFormat("de-DE").format(total_invoice),
                total_comision : new Intl.NumberFormat("de-DE").format(total_comision),
            });
        });
        return rows;
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
        for (let index = 1; index < columns_level_1.length; index++) {
            const element = columns_level_1[index];
            if(index == 1){
                columns_2.push({
                    header: 'Marca',
                    dataKey: 'marca',
                });
            }
            columns_2.push({
                header: element.title,
                dataKey: element.key
            });
        }
        var totalPagesExp = "{total_pages_count_string}";
        var marginTop = 0;
        var pdfDoc = new jsPDF();
        var content_1 = await getNivelSupervisor();
        var band = false;
        for (let index_1 = 0; index_1 < content_1.length; index_1++) {
            const element_1 = content_1[index_1];
            var showHead = 'never';
            var marginTop = pdfDoc.previousAutoTable.finalY + 2;
            if(index_1 == 0){
                marginTop = 24;
                showHead = 'firstPage';
            }
            pdfDoc.autoTable({
                columns: columns_1,
                body: [element_1],
                theme: 'grid',
                startY: marginTop,
                showHead: showHead,
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
                    description: {halign: 'left', cellWidth:80},
                    cod_persona: {halign: 'right', cellWidth:20},
                    nombre_supervisor: {halign: 'left', cellWidth:56},
                    total_invoice: {halign: 'right', cellWidth:20},
                    total_comision: {halign: 'right', cellWidth:20},
                },
                didDrawPage: (data) => {
                    if(!band){
                        // pdfDoc.addImage(logo_negro, 'png', 7, 7,25,10);
                        pdfDoc.setFontSize(12);
                        pdfDoc.setTextColor(40);
                        pdfDoc.text('Avance de comisiones - Vendedores',(pdfDoc.internal.pageSize.getWidth() / 2) - 30,7);
                        pdfDoc.setFontSize(9);
                        pdfDoc.setTextColor(40);
                        pdfDoc.text('Fecha Vigencia: ' + moment().format('DD/MM/YYYY') , pdfDoc.internal.pageSize.getWidth() - 48,18);
                        pdfDoc.setLineWidth(0.2);
                        pdfDoc.setDrawColor('#424242');
                        pdfDoc.line(7, 20, pdfDoc.internal.pageSize.getWidth() - 7 , 20);
                        band =true;
                    }
                },
            });
            var content_2 = await getNivelTipo(element_1.key);
            var tipos = ['A','B','C','D','E','F','O'];
            var contador_tipos = 0;
            pdfDoc.autoTable({
                columns: columns_2,
                body: content_2,
                theme: 'grid',
                startY: pdfDoc.previousAutoTable.finalY + 2,
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
                    halign: 'left',
                    fillColor: [116, 156, 252]
                },
                margin:{left:17, right:7, bottom:10, top:24},
                columnStyles:{
                    marca: {halign: 'left', cellWidth:146},
                    total_invoice: {halign: 'right', cellWidth:20},
                    total_comision: {halign: 'right', cellWidth:20},
                },
                didDrawCell: function (data) {
                    // console.log(data.column.dataKey);
                    if(data.row.index == 0 && data.column.dataKey == 'marca'){
                        console.log('entro aqui **** ', data);
                    }
                    // Rowspan
                    if (data.column.dataKey === 'marca') {
                        while(contador_tipos < tipos.length - 1){
                            var prueba = content_2.filter( i => i.description == tipos[contador_tipos] );
                            if(prueba.length > 0){
                                break;
                            }else{
                                contador_tipos++;
                            }
                        }
                        if( data.row.raw.description === tipos[contador_tipos]){
                            var cantidad = content_2.filter( i => i.description == tipos[contador_tipos] );
                            cantidad = cantidad.length;
                            pdfDoc.rect(7, data.cell.y,  10  , data.cell.height * cantidad, 'S');
                            pdfDoc.autoTableText(tipos[contador_tipos], 12, data.cell.y + data.cell.height * cantidad / 2, {
                                halign: 'center',
                                valign: 'middle'
                            });
                            contador_tipos++;
                            while(contador_tipos < tipos.length - 1){
                                var prueba = content_2.filter( i => i.description == tipos[contador_tipos] );
                                if(prueba.length > 0){
                                    break;
                                }else{
                                    contador_tipos++;
                                }
                            }
                            if(contador_tipos > tipos.length - 1){
                                contador_tipos = 0;
                            }
                        }
                        pdfDoc.setFillColor(255,255,255);
                        pdfDoc.rect(6, pdfDoc.internal.pageSize.getHeight() - 13.2,  pdfDoc.internal.pageSize.getWidth() - 12 , 15, 'F');
                        return false;
                    }
                }
            });
        }
        if (typeof pdfDoc.putTotalPages === 'function') {
            pdfDoc.putTotalPages(totalPagesExp);
        }
        pdfDoc.save('comisiones_supervisores.pdf');
        setActivarSpinner(false);
    }
    const export2Excel = async() =>{
        setActivarSpinner(true);
        var excel = _.map(data, function(item){
            return _.omit(item, ['COD_SUPERVISOR_PERSONA','MONTO_COBRAR']);
        });
        createHtml2ExportTable2Excel(excel,'Comision de Vendedores')
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