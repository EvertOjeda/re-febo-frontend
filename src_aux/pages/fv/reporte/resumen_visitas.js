import React, { memo, useState, useEffect, useRef } from 'react';
import Main from "../../../components/utils/Main";
import locale from 'antd/lib/locale/es_ES';
import {DatePicker, Form, ConfigProvider, Table, Tag, Divider, Col, Row, Button, Space, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'underscore';
import "moment/locale/es";
import moment from 'moment'
moment.locale("es_es", { week: { dow: 3 } });
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createHtml2ExportTable2Excel } from '../../../components/utils/exportTable2Excel';
import excel from "../../../assets/icons/excel.svg";
import { Menu, DireccionMenu } from '../../../components/utils/FocusDelMenu';
const { RangePicker } = DatePicker;
const Titulo = "Resumen de Visitas";
const url = '/fv/reporte/resumen_visita'; 
const FormName = 'FVREPVIS';
const defaultOpenKeys = DireccionMenu(FormName);
const defaultSelectedKeys = Menu(FormName);
const supervisor_column = [
    {
        title: 'Supervisor',
        dataIndex: 'COD_SUPERVISOR',
        width:80
    },
    {
        title: 'Descripción',
        dataIndex: 'DESC_SUPERVISOR',
    }
];
const vendedor_column = [
    {
        title: 'Vendedor',
        dataIndex: 'COD_VENDEDOR',
        width:80
    },
    {
        title: 'Descripción',
        dataIndex: 'DESC_VENDEDOR',
    }
];
var columns = [
    {
        title: 'Supervisor',
        dataIndex: 'COD_SUPERVISOR',
        width:80,
        filters: [],
        onFilter: (value, record) => record.COD_SUPERVISOR.includes(value),
        // fixed: 'left',
    },
    {
        title: 'Vendedor',
        dataIndex: 'COD_VENDEDOR',
        width:80,
        filters: [],
        onFilter: (value, record) => record.COD_VENDEDOR.includes(value),
        // fixed: 'left',
    },
    {
        title: 'Cartera',
        dataIndex: 'DESC_VENDEDOR',
    },
    {
        title: 'Nombre y Apellido',
        dataIndex: 'NOMBRE',
    },
    {
        title: 'Fec. Ingreso',
        dataIndex: 'FEC_VIGENCIA',
        width:60,
    },
    {
        title: 'Total Clientes',
        dataIndex: 'CANT_CLIENTE',
        width:80,
        align:'right',
    },
    {
        title: 'Semana',
        align:'center',
        children:[
            {
                title: 'Cli. Semana',
                dataIndex: 'CLI_SEMANA',
                width:80,
                align: 'right',
                render(text, record) {
                    return {
                        props: {
                            style: {background: "#b7eb8f47", borderLeft : '1px solid #b7eb8f47'}
                        },
                        children: <div>{text}</div>
                    };
                }
            },
            {
                title: 'Tot. Visit. Validas',
                dataIndex: 'VISITA_VALIDA',
                width: 80,
                align: 'right',
                render(text, record) {
                    return {
                        props: {
                            style: {background: "#b7eb8f47", borderLeft : '1px solid #b7eb8f47'}
                        },
                        children: <div>{text}</div>
                    };
                }
            },
            {
                title: 'Total visitas',
                dataIndex: 'TOTAL_VISITA',
                width: 60,
                align: 'right',
                render(text, record) {
                    return {
                        props: {
                            style: {background: "#b7eb8f47", borderLeft : '1px solid #b7eb8f47'}
                        },
                        children: <div>{text}</div>
                    };
                }
            }
        ]
    },
    {
        title: 'Escala de Anulacion',
        align: 'center',
        children: [
            {
                title: 'Total en pareja',
                dataIndex: 'VISITA_EN_PAREJA',
                width: 80,
                align: 'right',
                render(text, record) {
                    return {
                        props: {
                            style: { background: "#ffa39e52", borderLeft : '1px solid #ffa39e52'}
                        },
                        children: <div>{text}</div>
                    };
                }
            },
            {
                title: 'Fuera de Ruta',
                dataIndex: 'FUERA_DE_RUTA',
                width: 80,
                align: 'right',
                render(text, record) {
                    return {
                        props: {
                            style: { background: "#ffa39e52", borderLeft : '1px solid #ffa39e52'}
                        },
                        children: <div>{text}</div>
                    };
                }
            },
            // {
            //     title: 'Env. Tarde Marcación',
            //     dataIndex: "ENVIAR_TARDE_LA_MARCACION",
            //     width: 100,
            //     align: 'right',
            //     render(text, record) {
            //         return {
            //             props: {
            //                 style: { background: "#ffa39e52", borderLeft : '1px solid #ffa39e52'}
            //             },
            //             children: <div>{text}</div>
            //         };
            //     }
            // },
            {
                title: 'No visitado',
                dataIndex: "NO_VISITADO",
                width: 100,
                align: 'right',
                // render(text, record) {
                //     return {
                //         props: {
                //             style: { background: "#ffa39e52", borderLeft : '1px solid #ffa39e52'}
                //         },
                //         children: <div>{text}</div>
                //     };
                // }
            },
            {
                title: 'Tot. Visit. Anuladas',
                dataIndex: 'TOTAL_VISITA_ANULADA',
                width: 100,
                align: 'right',
                // render(text, record) {
                //     return {
                //         props: {
                //             style: { background: "#ffa39e52", borderLeft : '1px solid #ffa39e52'}
                //         },
                //         children: <div>{text}</div>
                //     };
                // }
            },
            {
                title: 'Escala Anulacion',
                dataIndex: 'ESCALA_ANULACION',
                width: 80,
                align: 'center',
                filters: [
                    { text: 'Aceptable' , value: 'Aceptable' },
                    { text: 'Atención'  , value: 'Atención' },
                    { text: 'OK'        , value: 'OK' },
                    { text: 'Grave'     , value: 'Grave' },
                ],
                onFilter: (value, record) => record.ESCALA_ANULACION.includes(value),
                render(text, record) {
                    return {
                        props: {
                            style: { background: "#ffa39e52", borderLeft : '1px solid #ffa39e52', borderRight : '1px solid #ffa39e52'}
                        },
                        children: <div>{text}</div>
                    };
                }
            }
        ]
    },
    {
        title: '% Visitas validas',
        dataIndex: 'PORC_VISITA_VALIDA',
        align:'center',
        width:80,
        render: (text, row, index) => {
            var color = ''
            if( row.PORC_VISITA_VALIDA_NO_FORMAT > 95){
                color='green';
            } 
            if( row.PORC_VISITA_VALIDA_NO_FORMAT <= 95 && row.PORC_VISITA_VALIDA_NO_FORMAT >= 85){
                color='yellow';
            } 
            if( row.PORC_VISITA_VALIDA_NO_FORMAT < 85 ){
                color='red';
            }
            return (
                <Tag color={color}>{text}</Tag>
            );
        }
    },
    {
        title: '% Total Visitas',
        dataIndex: 'PORC_TOTAL_VISITA',
        align:'center',
        width:80,
        render: (text, row, index) => {
            var color = ''
            if( row.PORC_TOTAL_VISITA_NO_FORMAT > 95){
                color='green';
            } 
            if( row.PORC_TOTAL_VISITA_NO_FORMAT <= 95 && row.PORC_TOTAL_VISITA_NO_FORMAT >= 85){
                color='yellow';
            } 
            if( row.PORC_TOTAL_VISITA_NO_FORMAT < 85 ){
                color='red';
            }
            return (
                <Tag color={color}>{text}</Tag>
            );
        }
    }
];
var Rows = [];
const ResumenVisitas = memo(() => {
    const [ Columns         , setColumns            ] = useState([]);
    const [ ResumenVisita   , setResumenVisita      ] = useState([]);
    const [ Data            , setData               ] = useState([]);
    const [ Aux             , setAux                ] = useState([]);
    const [ DataSupervisor  , setDataSupervisor     ] = useState([]);
    const [ FilterSupervisor, setFilterSupervisor   ] = useState([]);
    const [ AuxSupervisor   , setAuxSupervisor      ] = useState([]);
    const [ DataVendedor    , setDataVendedor       ] = useState([]);
    const [ FilterVendedor  , setFilterVendedor     ] = useState([]);
    const [ AuxVendedor     , setAuxVendedor        ] = useState([]);
    const [ activarSpinner  , setActivarSpinner     ] = useState(false);
    const [ showReport      , setShowReport         ] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        setColumns(columns);
        getSupervisor();
        getVendedor();
        form.setFieldsValue({
            ["FECHA"]: moment()
        })
    }, []);
    const getSupervisor = async() =>{
        await Main.Request( '/fv/reporte/resumen_visita/supervisor', 'POST',{cod_empresa:sessionStorage.getItem('cod_empresa')} )
            .then( response =>{
                _.map( response.data.rows, (item) => item.key = item.COD_SUPERVISOR )
                setDataSupervisor(response.data.rows);
                setAuxSupervisor(response.data.rows);
            })
    };
    const getVendedor= async() =>{
        await Main.Request( '/fv/reporte/resumen_visita/vendedor', 'POST',{cod_empresa:sessionStorage.getItem('cod_empresa')} )
            .then( response =>{
                _.map( response.data.rows, (item) => item.key = item.COD_VENDEDOR )
                setDataVendedor(response.data.rows);
                setAuxVendedor(response.data.rows);
            })
    };
    const getData = async() =>{
        setData([]);
        setShowReport(false);
        setActivarSpinner(true);
        var supervisor = '';
        if(FilterSupervisor.length > 0){
            for (let index = 0; index < FilterSupervisor.length; index++) {
                if(index == 0) supervisor += '(';
                supervisor += "'" + FilterSupervisor[index] + "'";
                if(index < FilterSupervisor.length -1 ) supervisor += ','
            }
            supervisor += ')';
        }else{
            supervisor = 'NULL';
        }
        var vendedor = '';
        if(FilterVendedor.length > 0){
            for (let index = 0; index < FilterVendedor.length; index++) {
                if(index == 0) vendedor += '('
                vendedor += "'" + FilterVendedor[index] + "'";
                if(index < FilterVendedor.length -1 ) vendedor += ','
            }
            vendedor += ')';
        }else{
            vendedor = 'NULL';
        } 
        var fecha = form.getFieldValue("FECHA")._d;
        fecha = moment(fecha).format('DD/MM/YYYY');
        var data = {
            cod_empresa: sessionStorage.getItem('cod_empresa'),
            supervisor: supervisor,
            vendedor: vendedor,
            fecha:fecha,
        }
        await Main.Request( url, 'POST',data )
            .then( response =>{
                buildTable(response.data.rows);
                setResumenVisita(response.data.rows);
                setActivarSpinner(false);
            })
    };
    const buildTable = (Data) => {
        var content = _.uniq( Data, (item) => {
            return item.COD_PERSONA;
        });
        // FILTRO VENDEDOR
        var vendedor = [];
        _.map(content, item => {
            vendedor.push({
                text: item.COD_VENDEDOR,
                value: item.COD_VENDEDOR
            })
            return true;
        });
        vendedor.sort(function(a,b){
            if (parseInt(a.value) > parseInt(b.value)) {
                return 1;
            }
            if (parseInt(a.value) < parseInt(b.value)) {
                return -1;
            }
            return 0;
        })
        columns[1].filters = vendedor;
        // SUPERVISOR
        var supervisor = [];
        var info = _.uniq( Data, (item)=>{
            return item.COD_SUPERVISOR;
        });
        _.map(info, item => {
            supervisor.push({
                text: item.COD_SUPERVISOR,
                value: item.COD_SUPERVISOR
            })
            return true;
        });
        supervisor.sort(function(a,b){
            if (parseInt(a.value) > parseInt(b.value)) {
                return 1;
            }
            if (parseInt(a.value) < parseInt(b.value)) {
                return -1;
            }
            return 0;
        })
        columns[0].filters = supervisor;
        Rows = [];
        for (let index = 0; index < content.length; index++) {
            const item = content[index];
            var info = Data.filter( (map) => map.COD_VENDEDOR == item.COD_VENDEDOR );
            var total_visita  = info.length;
            var visita_pareja = info.filter( map => map.VISITA_EN_PAREJA == 'S' ).length;
            var fuera_de_ruta = info.filter( map => map.FUERA_DE_RUTA == 'S' ).length;
            var enviar_tarde_la_marcacion = info.filter( map => map.ENVIA_TARDE_LA_MARCACION == 'S' ).length;
            // var no_visitado = item.no_visitado;
            // var recuento_de_visitas_anuladas = info.filter( map => map.VISITA_EN_PAREJA == 'S' ||  map.FUERA_DE_RUTA == 'S' || map.ENVIA_TARDE_LA_MARCACION == 'S').length;
            // console.log('entro aqui =====> ',recuento_de_visitas_anuladas);
            // var total_visita_anulada = visita_pareja + fuera_de_ruta + enviar_tarde_la_marcacion;
            var total_visita_anulada = info.filter( map => map.VISITA_EN_PAREJA == 'S' ||  map.FUERA_DE_RUTA == 'S').length;
            var visita_valida = total_visita - total_visita_anulada;

            var escala_anulacion = '';
            if(total_visita_anulada == 0) escala_anulacion = 'OK';
            if(total_visita_anulada >= 1 && total_visita_anulada <= 5) escala_anulacion = 'Aceptable';
            if(total_visita_anulada >= 6 && total_visita_anulada <= 9) escala_anulacion = 'Atención';
            if(total_visita_anulada >= 10) escala_anulacion = 'Grave';
            
            var porc_visita_valida = 0;
            var porc_visita_valida_no_format = 0;
            porc_visita_valida = (visita_valida / item.CLI_SEMANA) * 100;
            porc_visita_valida_no_format = porc_visita_valida;
            porc_visita_valida = new Intl.NumberFormat("de-DE").format(porc_visita_valida.toFixed(1)) + ' %';

            var porc_total_visita = 0;
            var porc_total_visita_no_format = 0;
            porc_total_visita = ( total_visita / item.CLI_SEMANA) * 100;
            porc_total_visita_no_format = porc_total_visita;
            porc_total_visita = new Intl.NumberFormat("de-DE").format(porc_total_visita.toFixed(1)) + ' %';
            
            Rows.push({
                key: item.COD_SUPERVISOR + '-' + item.COD_VENDEDOR + '-' + item.COD_PERSONA, 
                COD_SUPERVISOR: item.COD_SUPERVISOR,
                COD_VENDEDOR: item.COD_VENDEDOR,
                DESC_VENDEDOR: item.DESC_VENDEDOR,
                NOMBRE: item.NOMBRE,
                FEC_VIGENCIA: item.FEC_VIGENCIA,
                CANT_CLIENTE: item.CANT_CLIENTE,
                CLI_SEMANA: item.CLI_SEMANA,
                VISITA_VALIDA: visita_valida,
                TOTAL_VISITA: total_visita,
                VISITA_EN_PAREJA: visita_pareja,
                FUERA_DE_RUTA: fuera_de_ruta,
                ENVIAR_TARDE_LA_MARCACION: enviar_tarde_la_marcacion,
                NO_VISITADO:  item.CLI_SEMANA - visita_valida,
                TOTAL_VISITA_ANULADA: total_visita_anulada,
                ESCALA_ANULACION: escala_anulacion,
                PORC_VISITA_VALIDA: porc_visita_valida,
                PORC_TOTAL_VISITA: porc_total_visita,
                PORC_VISITA_VALIDA_NO_FORMAT: porc_visita_valida_no_format,
                PORC_TOTAL_VISITA_NO_FORMAT: porc_total_visita_no_format
            })
        }
        setShowReport(true);
        setColumns(columns);
        setData(Rows);
        setAux(Rows);
    };
    const rowSelectionSupervisor = {
        onChange: (selectedRowKeys, selectedRows) => {
            setFilterSupervisor(selectedRowKeys)
        }
    };
    const rowSelectionVendedor = {
        onChange: (selectedRowKeys, selectedRows) => {
            setFilterVendedor(selectedRowKeys)
        }
    };

    const handleSearchReport = (e) =>{
        var value = e.target.value;
        var content = [];
        if( value.length > 0){
            content = _.flatten(_.filter(Aux,function (item) {
                if( item.COD_SUPERVISOR.indexOf(value) > -1 ){
                    return true;
                }
                if( item.COD_VENDEDOR.indexOf(value) > -1 ){
                    return true;
                }
                if( item.DESC_VENDEDOR.indexOf(value.toUpperCase()) > -1 ){
                    return true;
                }
                if( item.NOMBRE.indexOf(value.toUpperCase()) > -1 ){
                    return true;
                }
            }));
        }else{
            content = Aux;
        }
        setData(content);
    }


    const handleSearchSupervisor = (e) =>{
        var value = e.target.value;
        var content = [];
        if( value.length > 0){
            content = _.flatten(_.filter(AuxSupervisor,function (item) {
                if( item.COD_SUPERVISOR.indexOf(value) > -1 ){
                    return true;
                }
                if( item.DESC_SUPERVISOR.indexOf(value.toUpperCase()) > -1 ){
                    return true;
                }
                
            }));
        }else{
            content = AuxSupervisor;
        }
        setDataSupervisor(content);
    }

    const handleSearchVendedor = (e) =>{
        var value = e.target.value;
        var content = [];
        if( value.length > 0){
            content = _.flatten(_.filter(AuxVendedor,function (item) {
                if( item.COD_VENDEDOR.indexOf(value) > -1 ){
                    return true;
                }
                if( item.DESC_VENDEDOR.indexOf(value.toUpperCase()) > -1 ){
                    return true;
                }
            }));
        }else{
            content = AuxVendedor;
        }
        setDataVendedor(content);
    }

    const ExportToExcel = () => {
        setActivarSpinner(true);
        createHtml2ExportTable2Excel(ResumenVisita,'Resumen de Visitas')
        setTimeout( ()=> {
            setActivarSpinner(false);
        }, 200);
    }

    return (
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${Titulo}` }/>
            <Main.Spin size="large" spinning={activarSpinner}>
                <div className="paper-container">
                    <Main.Paper className="paper-style">
                        <Main.TituloForm titulo={Titulo} />
                        <div className="form-container">
                            <Form form={form}>
                                <ConfigProvider locale={locale}>
                                    <Row>
                                        <Col span={8}>
                                            <div style={{marginRight:'10px'}}>
                                                <Input
                                                    id="input-with-icon-adornment"
                                                    autoComplete="off"
                                                    onChange={handleSearchSupervisor}
                                                    style={{ 
                                                        marginRight: '10px', 
                                                        float: 'right', 
                                                        marginBottom:'5px',
                                                        marginTop:'10px'
                                                    }}
                                                    startAdornment={
                                                        <InputAdornment position="start" >
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    }
                                                />
                                                <Table
                                                    rowSelection={{
                                                        type: 'checkbox',
                                                        ...rowSelectionSupervisor,
                                                    }}
                                                    columns={supervisor_column}
                                                    dataSource={DataSupervisor}
                                                    pagination={false}
                                                    scroll={{ y: 100 }}
                                                />
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div style={{marginRight:'10px'}}>
                                                <Input
                                                    id="input-with-icon-adornment"
                                                    autoComplete="off"
                                                    onChange={handleSearchVendedor}
                                                    style={{ 
                                                        marginRight: '10px', 
                                                        float: 'right', 
                                                        marginBottom:'5px',
                                                        marginTop:'10px'
                                                    }}
                                                    startAdornment={
                                                        <InputAdornment position="start" >
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    }
                                                />
                                                <Table
                                                    rowSelection={{
                                                        type: 'checkbox',
                                                        ...rowSelectionVendedor,
                                                    }}
                                                    columns={vendedor_column}
                                                    dataSource={DataVendedor}
                                                    pagination={false}
                                                    scroll={{ y: 100 }}
                                                />
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                    label="Rango de fechas"
                                                    name="FECHA"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 14 }}
                                                >
                                                    <DatePicker format={"DD/MM/YYYY"} />
                                                    {/* <DatePicker defaultValue={moment('02/12/2021', "DD/MM/YYYY")} disabled /> */}
                                                    {/* <DatePicker picker="month" defaultValue={moment('12/2021', 'MM/YYYY')} disabled /> */}
                                                    {/* <RangePicker
                                                    defaultValue={[moment('02/12/2021', "DD/MM/YYYY"), moment('02/12/2021', "DD/MM/YYYY")]}
                                                    disabled
                                                    /> */}
                                                    {/* <RangePicker
                                                        defaultValue={[moment('07/12/2021', "DD/MM/YYYY"), moment('07/12/2021', "DD/MM/YYYY")]}
                                                        disabled={[false, true]}
                                                    /> */}
                                            </Form.Item>
                                            
                                            <Divider/>
                                            <Button 
                                                type="Buscar" 
                                                icon={<SearchOutlined />}
                                                onClick={getData}
                                                type="primary"
                                                style={{
                                                    float:'right',
                                                    marginBottom: '5px'
                                                }}
                                            >
                                                Buscar 
                                            </Button>
                                        </Col>
                                    </Row> 
                                </ConfigProvider>
                            </Form>
                            <Divider/>
                            {showReport
                                ?   <>
                                        <Button
                                            icon={<img src={excel} width="20" style={{
                                                paddingBottom:'2px'
                                            }}/>}
                                            onClick={ExportToExcel}
                                            className="paper-header-menu-button"
                                            />
                                        <Input
                                            id="input-with-icon-adornment"
                                            autoComplete="off"
                                            onChange={handleSearchReport}
                                            style={{ marginRight: '10px', float: 'right', marginBottom:'10px'}}
                                            startAdornment={
                                                <InputAdornment position="start" >
                                                    <SearchIcon />
                                                </InputAdornment>
                                            }
                                        />
                                        <Table 
                                            columns={Columns} 
                                            dataSource={Data} 
                                            size="small"
                                            pagination={false}
                                            scroll={{ y: 400 }}
                                            />
                                    </>
                                :   null
                            }
                                
                        </div>
                    </Main.Paper>
                </div>
            </Main.Spin>
        </Main.Layout>
    );
});

export default ResumenVisitas;