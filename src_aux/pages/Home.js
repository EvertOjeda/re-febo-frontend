import React from 'react';
import { Row } from "antd";
import Main from "../components/utils/Main";
import WidgetEvolucionDiariaVenta from "../components/dashboard/antTable/widget_evolucion_diara_venta";
import WidgetPedido from "../components/dashboard/antCharts/widget_pedido";
import WidgetReboteDevolucion from "../components/dashboard/antCharts/widget_rebote_devolucion";
import WidgetFacturacion from "../components/dashboard/antCharts/widget_facturacion";
import WidgetFacturacionDia from "../components/dashboard/antCharts/widget_facturacion_dia";
import WidgetFacturacionSucursal from "../components/dashboard/antCharts/widget_facturacion_sucursal";
const Titulo = "Inicio";
const Home = () => {
    return (
        <>
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${Titulo}` }/>
            <Main.Layout 
                defaultOpenKeys={[]} 
                defaultSelectedKeys={['_dashboard']}>
                <Row>
                    <WidgetEvolucionDiariaVenta/>
                    <WidgetPedido /> 
                    <WidgetReboteDevolucion />
                    <WidgetFacturacion />
                    <WidgetFacturacionDia/>
                    <WidgetFacturacionSucursal/>
                </Row>
            </Main.Layout>
        </>
    );
}
export default Home;