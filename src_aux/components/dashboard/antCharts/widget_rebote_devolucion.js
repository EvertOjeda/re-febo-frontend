import React, { useState, useEffect, useContext }   from 'react';
import { Area, Column }                             from '@ant-design/charts';
import moment 							            from "moment";
import { Spin, Typography, Col } 	                from 'antd';
import _ 								            from "underscore";
import Main 							            from "../../utils/Main";
import UserContext                                  from '../../../context/User/UserContext';
const { Title } = Typography;
const Chart = () => {
    const [ dataRebote      , setDataRebote      ] = useState([]);
    const [ dataDevolucion  , setDataDevolucion  ] = useState([]);
    const [ montoRebote     , setMontoRebote     ] = useState(0);
    const [ montoDevolucion , setMontoDevolucion ] = useState(0);
	const [ loading         , setLoading         ] = useState(true);
    const [ show            , setShow            ] = useState(false);
    const { ctx_desc_empresa } = useContext(UserContext);
    useEffect(() => {
        verify();
    }, [ctx_desc_empresa]);
    const verify = () => {
        var prueba = sessionStorage.getItem('permiso_especial');
        prueba = JSON.parse(prueba);
        prueba = prueba.filter( (item)=>{
            return  item.NOM_FORMA == 'BSHOME' && 
                    item.PARAMETRO == 'DH_WIDGET_REB_DEV' &&
                    item.PERMISO   == 'S'
        });
        if(prueba.length > 0){
            setShow(true);
            getData();
        }
    }
    const getData = async() =>{
		var fecha = moment().add(-1,'days').format('YYYY-MM-DD');
		var url   = `/widget/rebotes/` + sessionStorage.getItem('cod_empresa') + '/' + fecha;
		await Main.Request( url, 'GET', [])
			.then( response => {
				if( _.isArray(response.data) ){
                    var rows = response.data;
                    rows = rows.filter( item => item.COD_EMPRESA == sessionStorage.getItem('cod_empresa'))
					mount(rows);
				}
				setLoading(false);
			});
	}
	const mount = (rows) =>{
        var contentRebote     = [];
        var contentDevolucion = [];
        var total_rebote      = 0;
        var total_devolucion  = 0;
        rows.sort(function (a, b) {
            if (a.FEC_COMPROBANTE > b.FEC_COMPROBANTE) {
                return  1;
            }
            if (a.FEC_COMPROBANTE < b.FEC_COMPROBANTE) {
                return -1;
            }
        });
        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            contentRebote.push({
                date  : element.FEC_COMPROBANTE,
                value : element.MONTO_REBOTE
            });
            contentDevolucion.push({
                date  : element.FEC_COMPROBANTE,
                value : element.MONTO_DEVOLUCION
            });
            total_rebote += element.MONTO_REBOTE;
            total_devolucion += element.MONTO_DEVOLUCION; 
        }
        setMontoRebote(total_rebote);
        setMontoDevolucion(total_devolucion);
        setDataRebote(contentRebote);
        setDataDevolucion(contentDevolucion);
	}
    var configRebote = {
        data: dataRebote,
        padding:[0,0,10,0],
        height: 100,
        xField: 'date',
        yField: 'value',
        xAxis: false,
        yAxis: false,
        color: '#d32029',
        line:{
            color: '#d32029'
        },
        tooltip: {
            formatter: (datum) => {
                return {  name: 'Monto' , value: new Intl.NumberFormat("de-DE").format(datum.value) };
            },
        }
    };
    var configDevolucion = {
        data: dataDevolucion,
        padding:[0,0,10,0],
        height: 100,
        xField: 'date',
        yField: 'value',
        xAxis: false,
        yAxis: false,
        color: '#d89614',
        line:{
            color: '#d89614'
        },
        tooltip: {
            formatter: (datum) => {
                return {  name: 'Monto' , value: new Intl.NumberFormat("de-DE").format(datum.value)};
            },
        }
    };
    return (
        <>
            {show
                ?   <>  
                        <Col span={6}>
                            <Spin spinning={loading}>
                                <div className="widget-dashboard-card">
                                    <Title level={5} className="widget-title">Rebote</Title>
                                    <Column {...configRebote} />
                                    <div className="line"></div>
                                    <Title level={5} className="widget-title" style={{textAlign:'right'}}>{ new Intl.NumberFormat("de-DE").format(montoRebote) }</Title>
                                </div>
                            </Spin>
                        </Col>
                        <Col span={6}>
                            <Spin spinning={loading}>
                                <div className="widget-dashboard-card">
                                    <Title level={5} className="widget-title">Devolución</Title>
                                    <Area {...configDevolucion} />
                                    <div className="line"></div>
                                    <Title level={5} className="widget-title" style={{textAlign:'right'}}>{ new Intl.NumberFormat("de-DE").format(montoDevolucion) }</Title>
                                </div>
                            </Spin>
                        </Col>
                    </>
                :   null             
            }
        </>
    );
};

export default Chart;