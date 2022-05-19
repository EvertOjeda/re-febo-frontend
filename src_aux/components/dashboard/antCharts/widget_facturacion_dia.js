import React, { useState, useEffect, useContext }   from 'react';
import { Column }                       from '@ant-design/charts';
import _ 								from 'underscore';
import moment 							from 'moment';
import Main 							from "../../utils/Main";
import { MyContext } 				    from "../../utils/NewLayout";
import { Row, Col, Typography, Spin } 	from "antd";
import UserContext                      from '../../../context/User/UserContext';
const { Title } = Typography
const Chart = () => {
    const [ data    , setData    ] = useState([]);
	const [ loading , setLoading ] = useState(true);
    const [ show    , setShow    ] = useState(false);
    const { ctx_desc_empresa }     = useContext(UserContext);
    useEffect(()=>{
        verify();
    },[ctx_desc_empresa ]);
    const verify = () => {
        var prueba = sessionStorage.getItem('permiso_especial');
        prueba = JSON.parse(prueba);
        prueba = prueba.filter( (item)=>{
            return  item.NOM_FORMA == 'BSHOME' && 
                    item.PARAMETRO == 'DH_WIDGET_FAC_DIA' &&
                    item.PERMISO   == 'S'
        });
        if(prueba.length > 0){
            setShow(true);
            getData();
        }
    }
    const getData = async() =>{
		var fecha = moment().add(-1,'day').format('YYYY-MM-DD');
		var url   = `/widget/facturaciones_por_dia/` + sessionStorage.getItem('cod_empresa') + '/' + fecha;
		await Main.Request( url,'GET',[])
			.then( response => {
				if( _.isArray(response.data) ){
					var rows = response.data;
                    rows = rows.filter( item => item.COD_EMPRESA == sessionStorage.getItem('cod_empresa'))
					mount(rows);
				}
				setLoading(false);
			});
	}
	const mount = (data) =>{
		var fecha_inicio = moment().add(-1,'days').startOf('month').format('YYYY-MM-DD');
		var dia_fin      = moment().add(-1,'days').endOf('month').format('DD');
		var date   = '';
		var header = [];
		var detail = [];
		var rows   = [];
		for (let index = 0; index < dia_fin; index++) {
			date = moment(fecha_inicio).add(index,'day').format('DD');
			var amount = 0;
			var content = _.flatten(_.filter(data, function(item){
				return item.FECHA === moment(fecha_inicio).add(index,'day').format('YYYY-MM-DD');
			}));
			if(content.length > 0){
				amount = content[0].MONTO;
			}
			header.push(date);
			detail.push(amount);
			rows.push({
				type: date,
				sales: amount,
			});
			if(index === dia_fin - 1){
                setData(rows);
				setLoading(false);
			}
		}
	}
    var configDark = {
        data: data,
        xField: 'type',
        yField: 'sales',
        height: 200,
        padding: [20,10,30,80],
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
                style: {
                    fill: '#fff',
                    fillOpacity: 0.8,
                    cursor: 'pointer'
                  }
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
                formatter: text => text
            },
        },
        meta: {
            type: { alias: 'Monto' },
            sales: { alias: 'Sucursal' },
        },
        tooltip: {
            formatter: (datum) => {
                return {  name: 'Facturado', value: new Intl.NumberFormat("de-DE").format(datum.sales) };
            },
        }
    };
    var configLight = {
        data: data,
        xField: 'type',
        yField: 'sales',
        height: 200,
        padding: [20,10,30,80],
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
                style: {
                    fill: '#000',
                    fillOpacity: 0.8,
                    cursor: 'pointer'
                  }
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
                  }
            },
            formatter: text => text
        },
        meta: {
            type: { alias: 'Monto' },
            sales: { alias: 'Sucursal' },
        },
        tooltip: {
            formatter: (datum) => {
                return {  name: 'Facturado', value: new Intl.NumberFormat("de-DE").format(datum.sales) };
            },
        }
    };
    return (
        <>
            {show
                ?   <Col span={24}>
                        <Spin spinning={loading}>
                            <div className="widget-dashboard-card">
                                <Title level={5} className="widget-title">Facturación por dia</Title>
                                <div className="line"></div>
                                <Row>
                                    <Col span={24}>
                                        <MyContext.Consumer>
                                            {value => {
                                                if(value == 'dark'){
                                                    return <Column {...configDark} />
                                                }else{
                                                    return <Column {...configLight} />
                                                }
                                            } }
                                        </MyContext.Consumer>
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