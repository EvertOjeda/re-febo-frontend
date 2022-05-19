import React, { Fragment, useState }    from "react";
import { Card ,List }                   from "antd";
import { GiftFilled }                   from "@ant-design/icons";
const HrBirthday   = () =>{
    const [ data ] = useState( JSON.parse(sessionStorage.getItem('hrbirthday')) );
    return(
        <Fragment>
            <Card size="small" title="Cumpleaños" style={{
                margin:'10px',
                padding:0,
            }}>
                {data.length > 0
                    ?   <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                    avatar={<GiftFilled/>}
                                    title={item.NOMBRE_EMPLEADO}
                                    description={item.FECHA}
                                    />
                                </List.Item>
                            )}
                        />
                    :   null
                }
            </Card>
        </Fragment>
    );
}

export default HrBirthday;