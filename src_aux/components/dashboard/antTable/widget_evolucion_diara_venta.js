import React, { useEffect, useState, useContext }   from "react";
import { Table, Spin, Typography, Col } from 'antd';
import _                                from 'underscore';
import moment                           from "moment";
import Main                             from "../../utils/Main";
import UserContext                      from '../../../context/User/UserContext';
import $ from "jquery";
const { Title } = Typography
const columns_level_0 = [
    { title: 'Unidad de negocio'  , dataIndex: 'description'            , key: 'descripcion'      },
    { title: 'Ped. ' + moment().add(-2,'days').format('DD/MM/YYYY') , dataIndex: 'sale_order_2_days_ago'  , key: 'sale_order_2_days_ago'  , align: 'right' , render: value => numberFormatting(value)  , width: 80},
    { title: 'Ped. ' + moment().add(-1,'days').format('DD/MM/YYYY') , dataIndex: 'sale_order_1_day_ago'   , key: 'sale_order_1_day_ago'   , align: 'right' , render: value => numberFormatting(value)  , width: 80},
    { title: 'Total de pedidos'   , dataIndex: 'total_sale_order'       , key: 'total_sale_order'       , align: 'right' , render: value => numberFormatting(value)  , width: 80 },
    { title: 'Cli c/ Ventas'      , dataIndex: 'customer_with_sales'    , key: 'customer_with_sales'    , align: 'right' , render: value => numberFormatting(value)  , width: 80 },
    { title: 'Total Factura'      , dataIndex: 'total_invoice'          , key: 'total_invoice'          , align: 'right' , render: value => numberFormatting(value)  , width: 80 },
    { title: 'Meta'               , dataIndex: 'objetive'               , key: 'objetive'               , align: 'right' , render: value => numberFormatting(value)  , width: 80 },
    { title: '%M. Log.'           , dataIndex: 'm_log'                  , key: 'm_log'                  , align: 'right' , render: value => percentFormatting(value) , width: 60 },
    { title: '%Reb.'              , dataIndex: 'reb'                    , key: 'reb'                    , align: 'right' , render: value => percentFormatting(value) , width: 60 },
    { title: '%Dev.'              , dataIndex: 'dev'                    , key: 'dev'                    , align: 'right' , render: value => percentFormatting(value) , width: 60 }, 
];
const rows_order = [
    { title: 'Unidad de Negocio', dataIndex: 'cod_unidad_negocio' , dataDesc: 'desc_unidad_negocio' , dataOrder: 'cod_unidad_negocio' },
    { title: 'Gerente'          , dataIndex: 'cod_gerente'        , dataDesc: 'desc_gerente'        , dataOrder: 'cod_gerente'},
    { title: 'Marca'            , dataIndex: 'cod_marca'          , dataDesc: 'desc_marca'          , dataOrder: 'cod_marca'},
    { title: 'Categoria'        , dataIndex: 'cod_categoria'      , dataDesc: 'desc_categoria'      , dataOrder: 'cod_categoria'},
    { title: 'Segmento'         , dataIndex: 'cod_segmento'       , dataDesc: 'desc_segmento'       , dataOrder: 'cod_segmento'},
];
var Data = [];
var band = false;
const numberFormatting = (value) =>{
    return new Intl.NumberFormat("de-DE").format(value);
}
const percentFormatting = (value) => {
    return new Intl.NumberFormat("de-DE").format(value) + '%';
}
const Reporte = ()=>{
    const [ line    , setLine    ] = useState([]);
    const [ loading , setLoading ] = useState(true);
    const [ show    , setShow    ] = useState(false);
    const { ctx_desc_empresa } = useContext(UserContext);
    useEffect( ()=>{
        verify();
    },[ctx_desc_empresa]);

    const verify = () => {
        var prueba = sessionStorage.getItem('permiso_especial');
        prueba = JSON.parse(prueba);
        prueba = prueba.filter( (item)=>{
            return  item.NOM_FORMA == 'BSHOME' && 
                    item.PARAMETRO == 'DH_WIDGET_EVO_DIA_VENTA' &&
                    item.PERMISO   == 'S'
        });
        if(prueba.length > 0){
            setShow(true);
            getData();
        }
    }

    const getData = async() =>{
        setLine([]);
        setLoading(true);
        var url   = `/widget/evolucion_venta_diaria`;
        var fecha = moment().add(-1,'days').format('DD_MM_YYYY');
        await Main.Request( url, 'POST',{fecha:fecha, cod_empresa: sessionStorage.getItem('cod_empresa')} )
            .then( response =>{
                Data = response.data;
                Build([]);
                setLoading(false);
            })
    };
    const onExpand = (expanded, record) => {
        var level = 0;
        var child = 2;
        if( expanded ){
            level = record.level + 1;
        }else{
            level = record.level;
        }
        setTimeout( ()=>{
            if(level == rows_order.length -1){
                child = 1;
            }
            $('#table_level_' + level + ' th:nth-child(' + child + ')').text( rows_order[level].title )
        },5)
    }
    const Build = () =>{
        var rows      = [];
        var info      = [];
        var columns   = columns_level_0;
        var rows_data = Data;
        var xrows     = rows_data;
        var order     = 0;
        var position = rows_order[order];
        columns[0].title = position.title;
        var rows_data = _.uniq(rows_data, function(item){
            return item[position.dataIndex];
        });
        var rows_data = _.reject(rows_data, function(item){
            return item[position.dataDesc] == undefined || item[position.dataDesc] == null
        });
        rows_data.sort(function (a, b) {
            if (parseInt(a[position.dataOrder]) > parseInt(b[position.dataOrder])) {
                return  1;
            }
            if (parseInt(a[position.dataOrder]) < parseInt(b[position.dataOrder])) {
                return -1;
            }
        });
        _.each(rows_data,function(item){
            info = _.flatten(_.filter(xrows,function (index) {
                return index[position.dataIndex] == item[position.dataIndex];
            }));
            // PEDIDO - HACE 2 DIAS
            var sale_order_2_days_ago=_.reduce(_.map(info,function(map) {
                if(map.sale_order_2_days_ago!=undefined){return parseFloat(map.sale_order_2_days_ago);}else{return 0;}
            }),function(memo, num){return memo + num;},0);
            // PEDIDO - HACE 1 DIA
            var sale_order_1_day_ago=_.reduce(_.map(info,function(map){if(map.sale_order_1_day_ago != undefined){return parseFloat(map.sale_order_1_day_ago);}else{return 0;}
            }),function(memo, num){return memo + num;},0);
            // TOTAL PEDIDO
            var total_sale_order=_.reduce(_.map(info,function(map){if(map.total_pedido!=undefined){return parseFloat(map.total_pedido);}else{return 0;}
            }),function(memo, num){return memo + num;},0);
            // CLIENTES CON VENTA
            var clientes_con_ventas = _.flatten(_.filter(Data,function (index) {
                if( position.dataIndex == 'cod_unidad_negocio'){ 
                    return index.cod_unidad_negocio == item.cod_unidad_negocio && index.clientes_con_ventas_x_unidad_negocio != undefined;
                }
                if( position.dataIndex =='cod_gerente_venta'){ 
                    return index.cod_gerente_venta  == item.cod_gerente_venta  && index.clientes_con_ventas_x_gerente_venta != undefined && index.cod_unidad_negocio == item.cod_unidad_negocio;
                }
                if( position.dataIndex =='cod_supervisor'){
                    return index.cod_supervisor     == item.cod_supervisor     && index.clientes_con_ventas_x_supervisor    != undefined && index.cod_unidad_negocio == item.cod_unidad_negocio;
                }
                if( position.dataIndex =='cod_vendedor'){
                    return index.cod_vendedor       == item.cod_vendedor       && index.clientes_con_ventas_x_vendedor      != undefined && index.cod_unidad_negocio == item.cod_unidad_negocio;
                }
            }));
            if(clientes_con_ventas.length > 0){
                if( position.dataIndex =='cod_unidad_negocio'){clientes_con_ventas = clientes_con_ventas[0].clientes_con_ventas_x_unidad_negocio;}
                if( position.dataIndex =='cod_gerente_venta'){clientes_con_ventas = clientes_con_ventas[0].clientes_con_ventas_x_gerente_venta;}
                if( position.dataIndex =='cod_supervisor'){clientes_con_ventas = clientes_con_ventas[0].clientes_con_ventas_x_supervisor;}
                if( position.dataIndex =='cod_vendedor'){clientes_con_ventas = clientes_con_ventas[0].clientes_con_ventas_x_vendedor;}
            }else{
                clientes_con_ventas = 0;
            }
            // TOTAL FACTURADO
            var total_invoice=_.reduce(_.map(info,function(map){if(map.total_facturado!=undefined){return parseFloat(map.total_facturado);}else{return 0;}
            }),function(memo, num){return memo + num;},0);
            // META - META LOGRADO
            var porcentaje_logrado = 0;
            var objetive = _.flatten(_.filter(Data,function (index) {
                if(position.dataIndex=='cod_unidad_negocio'){
                    return index.meta_por_segmento != null && index.cod_unidad_negocio == item.cod_unidad_negocio;
                }
                if(position.dataIndex=='cod_gerente'){
                    return index.meta_por_segmento != null && index.cod_gerente == item.cod_gerente;
                }
                if(position.dataIndex=='cod_marca'){
                    return index.meta_por_segmento != null && index.cod_marca == item.cod_marca;
                }
                if(position.dataIndex=='cod_categoria'){
                    return index.meta_por_segmento != null && index.cod_categoria == item.cod_categoria;
                }
                if(position.dataIndex=='cod_segmento'){
                    return index.meta_por_segmento != null && index.cod_segmento == item.cod_segmento;
                }
            }));
            if(objetive.length > 0 && total_invoice > 0){
                if(position.dataIndex=='cod_unidad_negocio'){
                    var meta = _.reduce(_.map(objetive,function(map) {
                        return parseFloat(map.meta_por_segmento);
                    }),function(memo, num) {
                        return memo + num;
                    },0);
                    if(meta > 0){
                        porcentaje_logrado = (total_invoice * 100)/meta;    
                    }
                }
                if(position.dataIndex=='cod_gerente'){
                    var meta = _.reduce(_.map(objetive,function(map) {
                        return parseFloat(map.meta_por_segmento);
                    }),function(memo, num) {
                        return memo + num;
                    },0);
                    porcentaje_logrado = (total_invoice * 100)/meta;
                }
                if(position.dataIndex=='cod_marca'){
                    var meta = _.reduce(_.map(objetive,function(map) {
                        return parseFloat(map.meta_por_segmento);
                    }),function(memo, num) {
                        return memo + num;
                    },0);
                    porcentaje_logrado = (total_invoice * 100)/meta;
                }
                if(position.dataIndex=='cod_categoria'){
                    var meta = _.reduce(_.map(objetive,function(map) {
                        return parseFloat(map.meta_por_segmento);
                    }),function(memo, num) {
                        return memo + num;
                    },0);
                    porcentaje_logrado = (total_invoice * 100)/meta;
                }
                if(position.dataIndex=='cod_segmento'){
                    var meta = _.reduce(_.map(objetive,function(map) {
                        return parseFloat(map.meta_por_segmento);
                    }),function(memo, num) {
                        return memo + num;
                    },0);
                    porcentaje_logrado = (total_invoice * 100)/meta;
                }
            }else{
                meta = 0;
            }
            // REBOTE Y DEVOLUCIONES
            var rebote_devolucion = _.flatten(_.filter(Data,function (index) {
                if(position.dataIndex=='cod_unidad_negocio'){return index.cod_unidad_negocio == item.cod_unidad_negocio && index.monto_rebote != null && index.monto_devolucion != null;}
                if(position.dataIndex=='cod_gerente'){return index.cod_gerente == item.cod_gerente && index.monto_rebote != null && index.monto_devolucion != null;}
                if(position.dataIndex=='cod_marca'){return index.cod_marca == item.cod_marca && index.monto_rebote != null && index.monto_devolucion != null;}
                if(position.dataIndex=='cod_categoria'){return index.cod_categoria == item.cod_categoria && index.monto_rebote != null && index.monto_devolucion != null;}
                if(position.dataIndex=='cod_segmento'){return index.cod_segmento == item.cod_segmento && index.monto_rebote != null && index.monto_devolucion != null;}
            }));
            var monto_rebote = _.reduce(_.map(rebote_devolucion,function(map) {
                if(map.monto_rebote != undefined){
                    return parseFloat(map.monto_rebote);
                }else{
                    return 0;
                }
            }),function(memo, num) {
                return memo + num;
            },0);
            var monto_devolucion = _.reduce(_.map(rebote_devolucion,function(map) {
                if(map.monto_devolucion != undefined){
                    return parseFloat(map.monto_devolucion);
                }else{
                    return 0;
                }
            }),function(memo, num) {
                return memo + num;
            },0);
            var rebote = 0;
            if(monto_rebote > 0 && total_invoice > 0){
                rebote = (monto_rebote * 100) / total_invoice;
            }
            var devolucion = 0;
            if(monto_devolucion > 0 && total_invoice > 0){
                devolucion = (monto_devolucion * 100) / total_invoice;
            }
            rows.push({
                key                     : item[position.dataIndex],
                description             : `${item[position.dataDesc]} - ${item[position.dataIndex]}`,
                sale_order_2_days_ago   : sale_order_2_days_ago,
                sale_order_1_day_ago    : sale_order_1_day_ago,
                total_sale_order        : total_sale_order,
                customer_with_sales     : clientes_con_ventas,
                total_invoice           : total_invoice,
                objetive                : meta,
                m_log                   : porcentaje_logrado,
                reb                     : rebote,
                dev                     : devolucion,
                monto_rebote            : monto_rebote,
                monto_devolucion        : monto_devolucion,
                // LEVEL
                level                   : order,
                // PARENT
                parent                  : [{field:position.dataIndex, value:item[position.dataIndex] }],
            });
        });
        setLine(rows);
    }
    const expandedRowRender = (record) => {
        var rows      = [];
        var columns   = columns_level_0;
        var rows_data = Data;
        var xrows     = rows_data;
        var order     = 0;
        order = record.level + 1;
        if( order < rows_order.length - 1){ 
            band = true;
        }else{
            band = false;
        }
        _.each(record.parent, function(x){
            var l = 0;
            rows_data = _.flatten(_.filter(rows_data,function (index) {
                l ++;
                return rows_data[l - 1][x.field] == x.value;
            }));
        });
        var position = rows_order[order];
        rows_data = _.uniq(rows_data, function(item){
            return item[position.dataIndex];
        });
        rows_data = _.reject(rows_data, function(item){
            return item[position.dataDesc] == undefined
        });
        rows_data.sort(function (a, b) {
            if (parseInt(a[position.dataOrder]) > parseInt(b[position.dataOrder])) {
                return  1;
            }
            if (parseInt(a[position.dataOrder]) < parseInt(b[position.dataOrder])) {
                return -1;
            }
        });
        _.each(rows_data,function(item){
            var info = _.flatten(_.filter(xrows,function (index) {
                return index[position.dataIndex] == item[position.dataIndex];
            }));
            // PEDIDO - HACE 2 DIAS
            var sale_order_2_days_ago=_.reduce(_.map(info,function(map) {
                if(map.sale_order_2_days_ago!=undefined){return parseFloat(map.sale_order_2_days_ago);}else{return 0;}
            }),function(memo, num){return memo + num;},0);
            // PEDIDO - HACE 1 DIA
            var sale_order_1_day_ago=_.reduce(_.map(info,function(map){if(map.sale_order_1_day_ago != undefined){return parseFloat(map.sale_order_1_day_ago);}else{return 0;}
            }),function(memo, num){return memo + num;},0);
            // TOTAL PEDIDO
            var total_sale_order=_.reduce(_.map(info,function(map){if(map.total_pedido!=undefined){return parseFloat(map.total_pedido);}else{return 0;}
            }),function(memo, num){return memo + num;},0);
            // CLIENTES CON VENTA
            var clientes_con_ventas = _.flatten(_.filter(Data,function (index) {
                if( position.dataIndex == 'cod_unidad_negocio'){ 
                    return index.cod_unidad_negocio == item.cod_unidad_negocio && index.clientes_con_ventas_x_unidad_negocio != undefined;
                }
                if( position.dataIndex =='cod_gerente_venta'){ 
                    return index.cod_gerente_venta  == item.cod_gerente_venta  && index.clientes_con_ventas_x_gerente_venta != undefined && index.cod_unidad_negocio == item.cod_unidad_negocio;
                }
                if( position.dataIndex =='cod_supervisor'){
                    return index.cod_supervisor     == item.cod_supervisor     && index.clientes_con_ventas_x_supervisor    != undefined && index.cod_unidad_negocio == item.cod_unidad_negocio;
                }
                if( position.dataIndex =='cod_vendedor'){
                    return index.cod_vendedor       == item.cod_vendedor       && index.clientes_con_ventas_x_vendedor      != undefined && index.cod_unidad_negocio == item.cod_unidad_negocio;
                }
            }));
            if(clientes_con_ventas.length > 0){
                if( position.dataIndex =='cod_unidad_negocio'){clientes_con_ventas = clientes_con_ventas[0].clientes_con_ventas_x_unidad_negocio;}
                if( position.dataIndex =='cod_gerente_venta'){clientes_con_ventas = clientes_con_ventas[0].clientes_con_ventas_x_gerente_venta;}
                if( position.dataIndex =='cod_supervisor'){clientes_con_ventas = clientes_con_ventas[0].clientes_con_ventas_x_supervisor;}
                if( position.dataIndex =='cod_vendedor'){clientes_con_ventas = clientes_con_ventas[0].clientes_con_ventas_x_vendedor;}
            }else{
                clientes_con_ventas = 0;
            }
            // TOTAL FACTURADO
            var total_invoice=_.reduce(_.map(info,function(map){if(map.total_facturado!=undefined){return parseFloat(map.total_facturado);}else{return 0;}
            }),function(memo, num){return memo + num;},0);
            // META - META LOGRADO
            var porcentaje_logrado = 0;
            var objetive = _.flatten(_.filter(Data,function (index) {
                if(position.dataIndex=='cod_unidad_negocio'){
                    return index.meta_x_marca != null && index.cod_unidad_negocio == item.cod_unidad_negocio;
                }
                if(position.dataIndex=='cod_gerente'){
                    return index.meta_x_marca != null && index.cod_gerente == item.cod_gerente;
                }
                if(position.dataIndex=='cod_marca'){
                    return index.meta_x_marca != null && index.cod_marca == item.cod_marca;
                }
                if(position.dataIndex=='cod_categoria'){return 0}
                if(position.dataIndex=='cod_segmento'){return 0}
            }));
            if(objetive.length > 0 && total_invoice > 0){
                if(position.dataIndex=='cod_unidad_negocio'){
                    var meta = _.reduce(_.map(objetive,function(map) {
                        return parseFloat(map.meta_x_marca);
                    }),function(memo, num) {
                        return memo + num;
                    },0);
                    if(meta > 0){
                        porcentaje_logrado = (total_invoice * 100)/meta;    
                    }
                }
                if(position.dataIndex=='cod_gerente'){
                    var meta = _.reduce(_.map(objetive,function(map) {
                        return parseFloat(map.meta_x_marca);
                    }),function(memo, num) {
                        return memo + num;
                    },0);
                    porcentaje_logrado = (total_invoice * 100)/meta;
                }
                if(position.dataIndex=='cod_marca'){
                    meta = objetive[0].meta_x_marca;
                    porcentaje_logrado = (total_invoice * 100)/objetive[0].meta_x_marca;
                }
                if(position.dataIndex=='cod_categoria'){
                    meta = 0;
                    porcentaje_logrado = 0;
                }
                if(position.dataIndex=='cod_segmento'){
                    meta = 0;
                    porcentaje_logrado = 0;
                }
            }else{
                meta = 0;
            }
            // REBOTE Y DEVOLUCIONES
            var rebote_devolucion = _.flatten(_.filter(Data,function (index) {
                if(position.dataIndex=='cod_unidad_negocio'){return index.cod_unidad_negocio == item.cod_unidad_negocio && index.monto_rebote != null && index.monto_devolucion != null;}
                if(position.dataIndex=='cod_gerente'){return index.cod_gerente == item.cod_gerente && index.monto_rebote != null && index.monto_devolucion != null;}
                if(position.dataIndex=='cod_marca'){return index.cod_marca == item.cod_marca && index.monto_rebote != null && index.monto_devolucion != null;}
                if(position.dataIndex=='cod_categoria'){return index.cod_categoria == item.cod_categoria && index.monto_rebote != null && index.monto_devolucion != null;}
                if(position.dataIndex=='cod_segmento'){return index.cod_segmento == item.cod_segmento && index.monto_rebote != null && index.monto_devolucion != null;}
            }));
            var monto_rebote = _.reduce(_.map(rebote_devolucion,function(map) {
                if(map.monto_rebote != undefined){
                    return parseFloat(map.monto_rebote);
                }else{
                    return 0;
                }
            }),function(memo, num) {
                return memo + num;
            },0);
            var monto_devolucion = _.reduce(_.map(rebote_devolucion,function(map) {
                if(map.monto_devolucion != undefined){
                    return parseFloat(map.monto_devolucion);
                }else{
                    return 0;
                }
            }),function(memo, num) {
                return memo + num;
            },0);
            var rebote = 0;
            if(monto_rebote > 0 && total_invoice > 0){
                rebote = (monto_rebote * 100) / total_invoice;
            }
            var devolucion = 0;
            if(monto_devolucion > 0 && total_invoice > 0){
                devolucion = (monto_devolucion * 100) / total_invoice;
            }
            // PARENT
            var parent_data = [];
            for (let x = 0; x <= order; x++) {
                const element = rows_order[x].dataIndex;
                var val =_.values(_.pick(item, element));
                parent_data.push({
                    field: element,
                    value: val[0],
                });
            }
            rows.push({
                key                     : item[position.dataIndex],
                description             : `${item[position.dataDesc]} - ${item[position.dataIndex]}`,
                sale_order_2_days_ago   : sale_order_2_days_ago,
                sale_order_1_day_ago    : sale_order_1_day_ago,
                total_sale_order        : total_sale_order,
                customer_with_sales     : clientes_con_ventas,
                total_invoice           : total_invoice,
                objetive                : meta,
                m_log                   : porcentaje_logrado,
                reb                     : rebote,
                dev                     : devolucion,
                monto_rebote            : monto_rebote,
                monto_devolucion        : monto_devolucion,
                // LEVEL
                level                   : order,
                // PARENT
                parent                  : parent_data,
            });
        });
        return(
            <>
                {band
                    ?   <Table 
                            id={"table_level_" + order}
                            columns={columns} 
                            dataSource={rows}
                            expandable={{expandedRowRender}}
                            onExpand={onExpand}
                            bordered
                            pagination={false}
                            style={{marginTop:'10px',marginBottom:'10px',marginRight:'10px'}}
                            />
                    :   <Table 
                            id={"table_level_" + order}
                            columns={columns} 
                            dataSource={rows}
                            bordered
                            pagination={false}
                            style={{marginTop:'10px',marginBottom:'10px',marginRight:'10px'}}
                            />
                }
            </>
        );
    };

    return(
        <>
            {show
                ?   <Col span={24}>
                        <Spin spinning={loading}>
                            <div className="widget-dashboard-card">
                                <Title level={5} className="widget-title">Evolución Diaria de Ventas</Title>
                                <div className="line"></div>
                                <Table 
                                    id="table_level_0"
                                    dataSource={line} 
                                    columns={columns_level_0} 
                                    size="small"
                                    expandable={{expandedRowRender}}
                                    pagination={false}
                                    bordered
                                    onExpand={onExpand}
                                    style={{
                                        paddingTop: '5px',
                                        paddingBottom: '10px',
                                    }}
                                    summary={pageData => {
                                        // PEDIDO - HACE 2 DIAS
                                        var sale_order_2_days_ago = _.reduce(_.map(pageData,function(map) {
                                            return parseFloat(map.sale_order_2_days_ago)
                                        }),function(memo, num){return memo + num;},0);
                                        // PEDIDO - HACE 1 DIA
                                        var sale_order_1_day_ago = _.reduce(_.map(pageData,function(map){
                                            return parseFloat(map.sale_order_1_day_ago);
                                        }),function(memo, num){return memo + num;},0);
                                        // TOTAL PEDIDO
                                        var total_sale_order = _.reduce(_.map(pageData,function(map){
                                            return parseFloat(map.total_sale_order);
                                        }),function(memo, num){return memo + num;},0);
                                        // CLIENTE CON VENTA
                                        var customer_with_sales = _.reduce(_.map(pageData,function(map){
                                            return parseFloat(map.customer_with_sales);
                                        }),function(memo, num){return memo + num;},0);
                                        // TOTAL FACTURADO
                                        var total_invoice=_.reduce(_.map(pageData,function(map){
                                            return parseFloat(map.total_invoice);
                                        }),function(memo, num){return memo + num;},0);
                                        // META
                                            var objetive=_.reduce(_.map(pageData,function(map){
                                            return parseFloat(map.objetive);
                                        }),function(memo, num){return memo + num;},0);
                                        // META LOGRADA
                                        var meta = 0;
                                        if(total_invoice > 0 && objetive > 0){
                                            meta = (total_invoice * 100) / objetive;
                                        } 
                                        // REBOTE
                                        var rebote =  _.reduce(_.map(pageData,function(item){
                                            return parseFloat(item.monto_rebote);
                                        }),function(memo, num){return memo + num;},0);
                                        rebote = (rebote * 100) / total_invoice;
                                        // DEVOLUCION
                                        var devolucion =  _.reduce(_.map(pageData,function(item){
                                            return parseFloat(item.monto_devolucion);
                                        }),function(memo, num){return memo + num;},0);
                                        devolucion = (devolucion * 100) / total_invoice;
                                        return (
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell> </Table.Summary.Cell>
                                                <Table.Summary.Cell>TOTAL</Table.Summary.Cell>
                                                <Table.Summary.Cell align="right"> 
                                                    { numberFormatting(sale_order_2_days_ago) }
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    { numberFormatting(sale_order_1_day_ago) }
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right">
                                                    { numberFormatting(total_sale_order) }
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right"> 
                                                    { numberFormatting(customer_with_sales) }
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right"> 
                                                    { numberFormatting(total_invoice) }
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right"> 
                                                    { numberFormatting(objetive) }
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell align="right"> 
                                                    { percentFormatting(meta) }
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell  align="right"> 
                                                    { percentFormatting(rebote) }
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell  align="right"> 
                                                    { percentFormatting(devolucion) }
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        )
                                    }}
                                />
                            </div>
                        </Spin>
                    </Col>
                :   null
            }
        </>
        
    )
}
export default Reporte;