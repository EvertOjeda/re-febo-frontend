import React                        from 'react';
import Main                         from '../../../../components/utils/Main';
import _                            from "underscore";
import { Typography }               from 'antd';
import { Menu, DireccionMenu }      from '../../../../components/utils/FocusDelMenu';


const title                 = "Conceptos para Planillas";

const FormName              = 'RHPLACON';
const { Title }             = Typography;


const POSTULANTES = () => {

    const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
    const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(false);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

                    

                    </Main.Spin>


            </Main.Layout>
        
        
        </>
    )

};

export default POSTULANTES;