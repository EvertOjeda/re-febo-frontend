import React, { useContext } from "react";
import { Tabs } from 'antd';
import './component/styles.css';
import _ from 'underscore';
import Main from "../../../../components/utils/Main";
import Bonificacion from "./component/tacticos_bonificaciones";
import DescuentoGestor from "./component/tacticos_descuento_gestor";
import DescuentoGestorMonto from "./component/tacticos_descuento_monto_gestor";
import TiendaDescuentoMonto from "./component/tacticos_tienda_descuento_monto";
import TiendaDescuento from "./component/tacticos_tienda_descuento";
import AjusteDePrecio       from "./component/tacticos_ajuste_de_precio";
import Context  from '../../../../context/User/UserContext';
const { TabPane } = Tabs;
const Titulo = "Promociones Vigentes";
const defaultOpenKeys = ['VT','VT-VT3', 'VT-VT3-VT31'];
const defaultSelectedKeys = ['VT-VT3-VT31-VTREPTAC'];
const Reporte = ()=>{
    const { theme } = useContext(Context);
    return(
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${Titulo}` }/>
            <div className="paper-container containerDarkLight" data-theme={theme} >
                <Main.Paper className="paper-style">
                    <Main.TituloForm titulo={Titulo} />
                    <div className="form-container">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Bonificaciones" key="1">
                                <Bonificacion/>
                            </TabPane>
                            <TabPane tab="Descuentos varios" key="2">
                                <DescuentoGestor/>
                            </TabPane>
                            <TabPane tab="Descuentos por monto" key="3">
                                <DescuentoGestorMonto/>
                            </TabPane>
                            <TabPane tab="Descuentos tienda" key="4">
                                <TiendaDescuento/>
                            </TabPane>
                            <TabPane tab="Bonificaciones tienda" key="5">
                                <TiendaDescuentoMonto/>
                            </TabPane>
                            <TabPane tab="Ajustes de precio" key="6">
                                <AjusteDePrecio/>
                            </TabPane>
                        </Tabs>
                    </div>
                </Main.Paper>
            </div>
        </Main.Layout>
    )
}
export default Reporte;