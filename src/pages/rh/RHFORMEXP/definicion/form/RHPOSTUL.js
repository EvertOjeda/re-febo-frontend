import React                        from 'react';
import Main                         from '../../../../../components/utils/Main';
import _                            from "underscore";
import { Typography, Tabs }         from 'antd';
import { Menu, DireccionMenu }      from '../../../../../components/utils/FocusDelMenu';


import LISTAENTREVISTA from './RHPOSTUL/LISTAENTREVISTA';
import LISTACONTRATADO from './RHPOSTUL/LISTACONTRATADO';
import LISTAPOSTULANTE from './RHPOSTUL/LISTAPOSTULANTE';
import RHFORMEXP       from './RHPOSTUL/RHFORMEXP';
// import LISTAPRUEBA     from './RHPOSTUL/LISTAPRUEBA';

import '../../../../../assets/css/DevExtreme.css';


const title                 = "Lista de postulantes";

const FormName              = 'RHPOSTUL';
const { Title }             = Typography;


const POSTULANTES = () => {

    const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
    const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(false);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [ tabKey, setTabKey                       ] = React.useState("1");

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleTabChange = (value) => {
		setTabKey(value);
	}

    return (
        <>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${title}` }/>
                    <Main.Spin size="large" spinning={activarSpinner} >
                        <div className="paper-header">
                            <Title level={5} className="title-color">
                                {title}
                                <div>
                                    <Title 
                                        level={4} 
                                        style={{ 
                                                float: 'right', 
                                                marginTop: '-16px', 
                                                marginRight: '5px', 
                                                fontSize: '10px' 
                                            }} 
                                        className="title-color">{FormName}
                                    </Title>
                                </div>
                            </Title>
                        </div>

                    
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

                                <Tabs.TabPane tab="Importar lista" key="4">
                                    <Main.Paper className="paper-style">
                                            <RHFORMEXP/>
                                    </Main.Paper>
                                </Tabs.TabPane>

                        </Tabs>

                    </Main.Spin>


            </Main.Layout>
        
        
        </>
    )

};

export default POSTULANTES;