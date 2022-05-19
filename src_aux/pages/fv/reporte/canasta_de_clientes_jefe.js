import React, { Fragment, useEffect, useState } from "react";
import Layout from "../../../components/utils/NewLayout";
import { Table,Input,Button,Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'underscore';
import { RequestAlt } from "../../../config/request";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const { Text } = Typography;

const Level = 1;
const columns_level_0 = [
    { title: 'Gerente'          , dataIndex: 'description'      , key: 'descripcion'        },
    { title: 'Cod. Persona'     , dataIndex: 'cod_persona'      , key: 'cod_persona'        , align:'right', width: 100},
    { title: 'Monto a Cobrar'   , dataIndex: 'monto_a_cobrar'   , key: 'monto_a_cobrar'     , align:'right', width: 100},
];
const columns_level_1 = [
    { title: 'Cliente'              , dataIndex: 'description'      , key: 'description'    },
    { title: 'Puntaje Cliente'      , dataIndex: 'puntaje_cliente'  , key: 'puntaje_cliente', align: 'right', width: 100},
    { title: 'Categoria'            , dataIndex: 'cat_cliente'      , key: 'cat_cliente'    , align: 'center', width: 100},
    { title: 'Valor de la Canasta'  , dataIndex: 'valor_canasta'    , key: 'valor_canasta'  , align: 'right', width: 100},
    { title: 'Ventas'               , dataIndex: 'ventas'           , key: 'ventas'         , align: 'right', width: 100},
    { title: 'Metas'                , dataIndex: 'cuota'            , key: 'cuota'          , align: 'right', width: 100},
    { title: '% Cumpl. Meta'        , dataIndex: 'porc_cump'        , key: 'porc_cump'      , align: 'right', width: 100},
    { title: 'Total a Percibir'     , dataIndex: 'monto_a_cobrar'   , key: 'monto_a_cobrar' , align: 'right', width: 100},
];
// const columns_level_2 = [
//     { title: 'Marca'        , dataIndex: 'description'      , key: 'description'    },
//     { title: 'Total Ventas' , dataIndex: 'total_invoice'    , key: 'total_invoice'  , align: 'right', width: 150},
// ];
var TableOrder   = [
    {title:'Gerente',field:'cod_gerente'},
    {title:'Cliente',field:'cod_cliente'}
];
const Reporte = ()=>{
    const [data, setData] = useState({});
    const [line, setLine] = useState({});
    useEffect( ()=>{
        getData();
    },[]);
    const getData = async() =>{
        var url   = `/fv/reporte/canasta_de_clientes_jefe`;
        await RequestAlt( url, 'POST',{value:'null'} )
            .then( response =>{
                setData(response.data.rows);
                Build(0,response.data.rows);
            })
    };

    const Build = (i,rows_data) =>{
        var table_order = TableOrder;
        var rows = [];
        var info = [];
        var xrows = rows_data;
        var rows_data = _.uniq(rows_data, function(item){
            return item.COD_GERENTE_PERSONA;
        });
        rows_data.sort(function (a, b) {
            if (parseInt(a.COD_GERENTE_PERSONA) > parseInt(b.COD_GERENTE_PERSONA)) {
                return  1;
            }
            if (parseInt(a.COD_GERENTE_PERSONA) < parseInt(b.COD_GERENTE_PERSONA)) {
                return -1;
            }
        });
        _.each(rows_data,function(item){
            info = _.flatten(_.filter(xrows,function (index) {
                return index.COD_GERENTE_PERSONA == item.COD_GERENTE_PERSONA;
            }));
            var monto_a_cobrar =_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_A_COBRAR);
            }),function(memo, num){
                return memo + num;
            },0);
            if(monto_a_cobrar < 0){
                monto_a_cobrar = 0;
            }

            var parent_data = [];
            for (let x = 0; x <= i; x++) {
                const element = table_order[x].field;
                var val =_.values(_.pick(item, element));
                parent_data.push({
                    field: element,
                    value: val[0],
                });
            }

            // console.log(parent_data);

            rows.push({
                key                     : item.COD_GERENTE_PERSONA,
                description             : `${item.COD_GERENTE} - ${item.DESC_GERENTE}`,
                cod_persona             : item.COD_PERSONA,
                monto_a_cobrar          : monto_a_cobrar,
                level                   : 0,
                cod_gerente_persona     : item.COD_GERENTE_PERSONA,
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
        await RequestAlt( url, 'POST', {'value':value})
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
            rows_data = data.filter(item => item.COD_GERENTE_PERSONA.includes(record.key) );
        }
        // if(nextLevel == 2){
        //     columns   = columns_level_2;
        //     rows_data = data.filter(item => item.COD_SUPERVISOR_PERSONA.includes(record.cod_supervisor_persona) && 
        //                                     item.TIP_COM.includes(record.key) );
        // }
        xrows     = rows_data;
        rows_data = _.uniq(rows_data, function(item){
            if(nextLevel == 1){
                return item.COD_GERENTE_CLIENTE;
            }
        });
        rows_data.sort(function (a, b) {
            if(nextLevel == 1){
                if (parseInt(a.COD_CLIENTE) > parseInt(b.COD_CLIENTE) ) {
                    return 1;
                }
                if (parseInt(a.COD_CLIENTE) < parseInt(b.COD_CLIENTE) ) {
                    return -1;
                }
            }
            return 0;
        });
        for (let index = 0; index < rows_data.length; index++) {
            const item = rows_data[index];            
            if(nextLevel == 1){
                info = xrows.filter( i => i.COD_GERENTE_CLIENTE.includes(item.COD_GERENTE_CLIENTE) );
            }
            var monto_a_cobrar =_.reduce(_.map(info,function(map){
                return parseFloat(map.MONTO_A_COBRAR);
            }),function(memo, num){
                return memo + num;
            },0);
            // if(monto_a_cobrar < 0){
            //     monto_a_cobrar = 0;
            // }
            var key         = '';
            var description = '';
            if(nextLevel == 1){
                key = item.COD_GERENTE_CLIENTE;
                description =`${item.COD_CLIENTE} - ${item.DESC_CLIENTE}`
            }
            rows.push({
                key                 : key,
                description         : description,
                puntaje_cliente     : item.PUNTAJE_CLIENTE,
                cat_cliente         : item.CAT_CLIENTE,
                valor_canasta       : item.VALOR_CANASTA,
                ventas              : item.VENTAS,
                cuota               : item.CUOTA,
                porc_cump           : item.PORC_CUMP,
                monto_a_cobrar      : monto_a_cobrar,
                level               : nextLevel,
                cod_gerente_persona : item.COD_GERENTE_PERSONA,
                // NO FORMAT
                valor_canasta_no_format : item.VALOR_CANASTA,
                ventas_no_format        : item.VENTAS,
                cuota_no_format         : item.CUOTA,
                monto_a_cobrar_no_format: monto_a_cobrar,
            });   
        }
        return (
                <Fragment>
                    {nextLevel < Level
                        ?   <Table 
                                columns={columns} 
                                dataSource={rows}
                                expandable={{ expandedRowRender }}
                                pagination={false}
                                style={{marginTop:'20px',marginBottom:'20px',marginRight:'10px'}}
                                summary={pageData => {
                                    let totalPuntaje = 0;
                                    let totalValorCanasta = 0;
                                    let totalVentas       = 0;
                                    let totalCuota        = 0;
                                    let totalMontoACobrar = 0;
                                    pageData.forEach((item) => {
                                        console.log(item);
                                        totalPuntaje        += item.puntaje_cliente;
                                        totalValorCanasta   += item.valor_canasta_no_format;
                                        totalVentas         += item.ventas_no_format;
                                        totalCuota          += item.cuota_no_format;
                                        totalMontoACobrar   += item.monto_a_cobrar_no_format
                                    });
                                    return (
                                        <>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell>TOTAL</Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{ totalPuntaje }</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text></Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{ totalValorCanasta }</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{ totalVentas }</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{ totalCuota }</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text></Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{ totalMontoACobrar }</Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </>
                                    );
                                }}/>
                        :   <Table 
                                columns={columns} 
                                dataSource={rows}
                                pagination={false}
                                style={{marginTop:'20px',marginBottom:'20px',marginRight:'10px'}}
                                summary={pageData => {
                                    let totalPuntaje = 0;
                                    let totalValorCanasta = 0;
                                    let totalVentas       = 0;
                                    let totalCuota        = 0;
                                    let totalMontoACobrar = 0;
                                    pageData.forEach((item) => {
                                        console.log(item);
                                        totalPuntaje        += item.puntaje_cliente;
                                        totalValorCanasta   += item.valor_canasta_no_format;
                                        totalVentas         += item.ventas_no_format;
                                        totalCuota          += item.cuota_no_format;
                                        totalMontoACobrar   += item.monto_a_cobrar_no_format
                                    });
                                    return (
                                        <>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell>TOTAL</Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{totalPuntaje}</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text></Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{totalValorCanasta }</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{totalVentas }</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{totalCuota }</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text></Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    <Text>{totalMontoACobrar }</Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </>
                                    );
                                }}/>
                    }
                </Fragment>
                )
    };

    const export2PDF = () =>{
        // console.log('entro aqui');
        const doc = new jsPDF()

        // It can parse html:
        // <table id="my-table"><!-- ... --></table>
        // doc.autoTable({ html: '#my-table' })

        // Or use javascript directly:
        doc.autoTable({
            head: [['Name', 'Email', 'Country']],
            body: [
                ['David', 'david@example.com', 'Sweden'],
                ['Castille', 'castille@example.com', 'Spain'],
                // ...
            ],
        });
        doc.save('table.pdf')
    }

    const export2Excel = async() =>{
        var html;
        html     = '<caption>Comision de Vendedores</caption>';
        html     += '<colgroup span="' + 10 + '" align="center"></colgroup>';
        html     += '<colgroup span="' + 10 + '" align="center"></colgroup>';
        html     += '<table style="border:1px solid #000;">';
        html     += '<thead>';
        html     += '<tr style="background-color: #b3e5fc;border:1px solid #424242;">';
        
        html     += '<th>cod_empresa</th>';
        html     += '<th>cod_supervisor</th>';
        html     += '<th>cod_vendedor</th>';
        // html     += '<th>vendedor_persona</th>';
        // html     += '<th>desc_vendedor</th>';
        // html     += '<th>tip_com</th>';
        // html     += '<th>cod_marca</th>';
        // html     += '<th>desc_marca</th>';
        // html     += '<th>monto_venta</th>';
        // html     += '<th>monto_meta</th>';
        // html     += '<th>porc_cobertura</th>';
        // html     += '<th>porc_log</th>';
        // html     += '<th>monto_a_cobrar</th>';
        // html     += '<th>tot_clientes</th>';
        // html     += '<th>clientes_visitados</th>';
        
        html     += '</tr>';
        html     += '</thead>';
        html     += '<tbody>';
        _.each(data,function(item){
            html += '<tr>';
            html += '<td>' + item.COD_EMPRESA           									+ '</td>';
            html += '<td>' + item.COD_SUPERVISOR        									+ '</td>';
            html += '<td>' + item.COD_VENDEDOR          									+ '</td>';
            html += '</tr>';
        });
        html     += '</tbody></table>';
        tableToExcel(html,'Comision de Vendedores');
    }

    var tableToExcel = (function() {
        var uri = 'data:application/vnd.ms-excel;base64,'
            ,   template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            ,   base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            ,   format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
        return function(table, name) {
            var ctx = {worksheet: name || 'Worksheet', table: table}
            window.location.href = uri + base64(format(template, ctx))
        }
    })()

    return(
        <Layout>
            <Button type="primary" onClick={export2PDF}>PDF</Button>
            <Button type="primary" onClick={export2Excel} style={{marginLeft:'3px'}}>EXCEL</Button>
            <Input
                prefix={<SearchOutlined className="site-form-item-icon" />}
                onChange={handleChange}
                style={{
                    width: 200,
                    float:'right',
                    marginTop: '10px',
                    marginBottom: '10px',
                }}
                />
            {line.length > 0
                ?   <Table 
                        dataSource={line} 
                        columns={columns_level_0} 
                        size="small"
                        expandable={{expandedRowRender}}
                        pagination={false}
                        scroll={{ y: 550 }}
                    />
                :   null
            }
        </Layout>
    )
}
export default Reporte;