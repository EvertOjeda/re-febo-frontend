import React, { memo }              from 'react';
import Main                         from '../../../../../components/utils/Main';
import _                            from "underscore";
import { Form,Typography, Tabs }    from 'antd';
import { Menu, DireccionMenu }      from '../../../../../components/utils/FocusDelMenu';
import LISTAENTREVISTA from './RHPOSTUL/LISTAENTREVISTA';
import LISTACONTRATADO from './RHPOSTUL/LISTACONTRATADO';
import LISTAPOSTULANTE from './RHPOSTUL/LISTAPOSTULANTE';



import '../../../../../assets/css/DevExtreme.css';


const title                 = "Lista de postulantes";

const FormName              = 'RHPOSTUL';
const { Title }             = Typography;


const POSTULANTES = memo((props) => {

    const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
    const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
    const cod_empresa         = sessionStorage.getItem('cod_empresa');
    const cod_usuario         = sessionStorage.getItem('cod_usuario');


    ///////////////////////////////////////////////////////////////////////////////



    const [ tabKey, setTabKey                       ] = React.useState("1");


    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleTabChange = (value) => {
		setTabKey(value);
	}

    return (
        <>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${title}` }/>
                <div className="paper-header">
                    <Title level={5} className="title-color">
                        {title}
                        <div>
                            <Title level={4} style={{ float: 'right', marginTop: '-16px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</Title>
                        </div>
                    </Title>
                </div>

                <div className='paper-container'>
                    <Tabs 
                            activeKey={tabKey}
                            onChange={handleTabChange}
                            type="card"
                            size={"large"}>
                        <Tabs.TabPane tab="Postulantes" key="1">
                            <Main.Paper className="paper-style">
                                    <LISTAPOSTULANTE/>
                            </Main.Paper>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Entrevista" key="2">
                            <Main.Paper className="paper-style">
                                    <LISTAENTREVISTA/>
                            </Main.Paper>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Contratado" key="3">
                               <Main.Paper className="paper-style">
                                    <LISTACONTRATADO/>
                            </Main.Paper>
                        </Tabs.TabPane>
                    </Tabs>

                </div>

            </Main.Layout>
        
        
        </>
    )

});

export default POSTULANTES;