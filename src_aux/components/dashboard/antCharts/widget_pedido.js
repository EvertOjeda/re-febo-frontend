import React, { useState, useEffect,useContext } from 'react';
import { Area } from '@ant-design/charts';
import moment 							from "moment";
import { Spin, Typography, Col } 	    from 'antd';
import _ 								from "underscore";
import Main 							from "../../utils/Main";
import UserContext                      from '../../../context/User/UserContext';
const { Title } = Typography;
const Chart = () => {
    const [ data    , setData    ] = useState([]);
    const [ monto   , setMonto   ] = useState(0);
	const [ loading , setLoading ] = useState(true);
    const [ show    , setShow    ] = useState(false);
    const { ctx_desc_empresa } = useContext(UserContext);
    useEffect(() => {
        verify();
    }, [ctx_desc_empresa]);
    useEffect(() => {
        verify();
    }, []);
    const verify = () => {
        var prueba = sessionStorage.getItem('permiso_especial');
        prueba = JSON.parse(prueba);
        prueba = prueba.filter( (item)=>{
            return  item.NOM_FORMA == 'BSHOME' && 
                    item.PARAMETRO == 'DH_WIDGET_PEDIDO' &&
                    item.PERMISO   == 'S'
        });
        if(prueba.length > 0){
            setShow(true);
            getData();
        }
    }
    const getData = async() =>{
		var fecha = moment().add(-1,'days').format('YYYY-MM-DD');
		var url   = `/widget/pedidos/` + sessionStorage.getItem('cod_empresa') + '/' + fecha;
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
        var content = [];
        var total   = 0;
        for (let index = 0; index < rows.length; index++) { 
            const element = rows[index];
            if(element.MONTO != null){
                content.push({
                    date  : element.FEC_COMPROBANTE,
                    value : element.MONTO
                });
                total += element.MONTO;
            }    
        }
        setMonto(total);
        setData(content);
	}
    var config = {
        data: data,
        padding:[0,0,10,0],
        height: 100,
        xField: 'date',
        yField: 'value',
        xAxis: false,
        yAxis: false,
        color: '#8bbb11',
        line:{
            color: '#8bbb11'
        },
        tooltip: {
            formatter: (datum) => {
                return {  name: 'Monto' ,  value: new Intl.NumberFormat("de-DE").format(datum.value)  };
            },
        }
    };
    return (
        <>
            {show
                ?   <Col span={6}>
                        <Spin spinning={loading}>
                            <div className="widget-dashboard-card">
                                <Title level={5} className="widget-title">Pedidos</Title>
                                <Area {...config} />
                                <div className="line"></div>
                                <Title level={5} className="widget-title" style={{textAlign:'right'}}>{ new Intl.NumberFormat("de-DE").format(monto) }</Title>
                            </div>
                        </Spin>
                    </Col>
                :   null
            }
        </>
        
    );
};

export default Chart;