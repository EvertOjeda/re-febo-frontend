import React, { useState, useEffect, useContext } from 'react';
import { Bar, Pie } from '@ant-design/charts';
import _ 								from 'underscore';
import moment 							from 'moment';
import Main 							from "../../utils/Main";
import { MyContext } 				    from "../../utils/NewLayout";
import { Row, Col, Typography, Spin } 	from "antd";
import UserContext                      from '../../../context/User/UserContext';
const { Title } = Typography
var content = [];
const Chart = () => {
    const [ data     , setData    ] = useState([]);
	const [ loading  , setLoading ] = useState(true);
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
                    item.PARAMETRO == 'DH_WIDGET_FACT_SUCURSAL' &&
                    item.PERMISO   == 'S'
        });
        if(prueba.length > 0){
            setShow(true);
            getData();
        }
    }
	const getData = async() =>{
		var fecha = moment().add(-1,'day').format('YYYY-MM-DD');
		var url   = `/widget/facturaciones_por_sucursal/` + sessionStorage.getItem('cod_empresa') + '/' + fecha;
		await Main.Request( url,'GET',[])
			.then( response => {
				if( _.isArray(response.data) ){
					var rows = response.data;
                    rows = rows.filter( item => item.COD_EMPRESA == sessionStorage.getItem('cod_empresa'))
					mount(rows);
				}
			});
	}
	const mount = (data) =>{
        var rows = [];
        content = [];
        setData([]);
        var total=_.reduce(_.map(data,function(map) {
            if(map.MONTO != null){
                return parseFloat(map.MONTO);
            }else{
                return 0;
            }
        }),function(memo, num){
            return memo + num;
        },0);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if(element.MONTO != null){
                rows.push({
                    type: element.COD_SUCURSAL + ' - ' + element.DESC_SUCURSAL,
                    sales: element.MONTO,
                });
                var porcentaje = (element.MONTO * 100) / total;
                content.push({
                    type: element.DESC_SUCURSAL,
                    value: Math.round(porcentaje),
                })
            }
        }
        setData(rows);
        setLoading(false);
	}
    var configDark = {
        data: data,
        xField: 'sales',
        yField: 'type',
        height: 250,
        padding: [20,50,30,130],
        legend: { position: 'top-left' },
        barBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
        interactions: [{
            type: 'active-region',
            enable: false,
        }],
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
                style: {
                    fill: '#fff',
                    fillOpacity: 0.8,
                    cursor: 'pointer',
                    fontSize: 12,
                },
                formatter: text => new Intl.NumberFormat("de-DE").format(text)
            },
        },
        yAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
                style: {
                    fill: '#fff',
                    fillOpacity: 0.8,
                    cursor: 'pointer'
                },
            },
        },
        tooltip: {
            formatter: (datum) => {
                return {  name: 'Facturado' , value: new Intl.NumberFormat("de-DE").format(datum.sales) + ' ₲' };
            },
        }
    };
    var configLight = {
        data: data,
        xField: 'sales',
        yField: 'type',
        height: 250,
        legend: { position: 'top-left' },
        barBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
        interactions: [{
            type: 'active-region',
            enable: false,
        }],
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
                style: {
                    fill: '#000',
                    fillOpacity: 0.8,
                    cursor: 'pointer'
                },
                formatter: text => new Intl.NumberFormat("de-DE").format(text)
            },
        },
        yAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
                style: {
                    fill: '#000',
                    fillOpacity: 0.8,
                    cursor: 'pointer'
                },
            },
        },
        tooltip: {
            formatter: (datum) => {
                return {  name: 'Facturado' , value: new Intl.NumberFormat("de-DE").format(datum.sales) + ' ₲' };
            },
        }
    };
    var configPie = {
        appendPadding: 10,
        height: 250,
        data: content,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        // startAngle: Math.PI,
        // endAngle: Math.PI * 1.5,
        label: {
            type: 'inner',
            offset: '-8%',
            content: '{value} %',
            style: { 
                fill: '#fff',
                fontSize: 12 
            },
        },
        legend: false,
        interactions: [{ type: 'element-active' }],
        pieStyle: { lineWidth: 0 },
        tooltip: {
            formatter: (datum) => {
                return {  name: datum.type , value: datum.value + ' %' };
            },
        }
    };
    return(
        <>
            {show
                ?   <Col span={24}>
                        <Spin spinning={loading}>
                            <div className="widget-dashboard-card">
                                <Title level={5} className="widget-title">Facturación por Sucursal</Title>
                                <div className="line"></div>
                                <Row>
                                    <Col span={18}>
                                        <MyContext.Consumer>
                                            {value => {
                                                if(value == 'dark'){
                                                    return <Bar {...configDark} />
                                                }else{
                                                    return <Bar {...configLight} />
                                                }
                                            } }
                                        </MyContext.Consumer>
                                    </Col>
                                    <Col span={6}>
                                        <Pie {...configPie} />
                                    </Col>
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                :   null
            }
        </>
    );
};

export default Chart;