import React, { useContext, useEffect } from "react"
import { Layout } from 'antd';
import HrBirthday from "../dashboard/SidebarRight/HrBirthday";
import UserContext from '../../context/User/UserContext';
const { Sider } = Layout;
export const SidebarRight = ({theme, toggle})=>{
    const { ctx_desc_empresa, ctx_desc_sucursal } = useContext(UserContext);

    useEffect( ()=>{
        
    },[ctx_desc_sucursal] )

    return(
        <Sider id="sidebarRight" data-theme={theme} data-toggle={toggle} style={{ top:64 }}>
            <h1 className="siderbar-sucursal">{ sessionStorage.getItem('desc_sucursal') }</h1>
            <HrBirthday/>
        </Sider>
    )
}
export default SidebarRight;