import React, {useState} from 'react';
import Map from 'devextreme-react/map';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import {  Form                   , Input           , Button     
    , Row                    , Col             , Card    
    , Radio                  , Tabs            , Divider 
    , Table                  , Select          , List   
    , Avatar                 , Empty           } from 'antd'; 
const markerUrl = 'https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png';
// import { markersData } from './data.js';

const markersData = [
    {location: [-24.46686, -55.69211 ]},
    {location: [-24.46694, -55.69229 ]},
    {location: [-24.46696, -55.69236 ]},
    {location: [-24.467, -55.69245 ]},

    {location: [-24.46704, -55.69252 ]},
    {location: [-24.46707, -55.69261 ]},
    {location: [-24.46714, -55.69281 ]},
    {location: [-24.46717, -55.69291 ]},


]

const routesData = [{
    weight: 6,
    color: 'blue',
    opacity: 0.5,
    mode: '',
    locations: [
        [-24.46686, -55.69211 ],
        [-24.46694, -55.69229 ],
        [-24.46696, -55.69236 ],
        [-24.467, -55.69245 ],
        
        [-24.46704, -55.69252 ],
        [-24.46707, -55.69261 ],
        [-24.46714, -55.69281 ],
        [-24.46717, -55.69291 ],

        [-24.46722,	-55.69304],
        [-24.46724,	-55.69312],
        [-24.46731,	-55.69333],
        [-24.46734,	-55.6934],
        
        [-24.46736,	-55.69345],
        [-24.46739,	-55.69351],
        [-24.46741,	-55.69356],
        [-24.46742,	-55.69361],
        [-24.46746,	-55.6937],
        [-24.4675,  -55.69381],
        [-24.46753,	-55.69389],
    ],
  }];

const Test = () => {
    const [value, setValue] = useState()
    return (
        <>
            <Form
                size="small"
                autoComplete="off"
                >
                <Form.Item 
                    name="NOMBRE"
                    label="Nombre">
                    <PhoneInput
                        international
                        defaultCountry="PY"    
                        placeholder="Enter phone number"
                        value={value}
                        onChange={setValue}/>
                </Form.Item>
            </Form>
            
            <br />
            <Map
                // defaultCenter="Ciudad del Este,PY"
                defaultZoom={14}
                apiKey={{'bing':'Ak1tVFHGAtPV73DtmMDu8BYMtnGEXSzoLh_irep8NbWB93LsViT2csSZtONmnzND' }}
                height={800}
                width="100%"
                provider="bing"
                type={'hybrid'}
                controls={true}
                markerIconSrc={markerUrl}
                // markers={markersData}
                routes={routesData}
                >
            </Map>
        </>
    )
}
export default Test