import React, { useEffect, useRef }                        from 'react';
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";

const Test = () => {
    const mapElement = useRef()
    useEffect( () => {

        var map = new Map({
            layers: [
                new TileLayer({
                    visible: true,
                    preload: Infinity,
                    source: new BingMaps({
                    // key: 'Your Bing Maps Key from http://www.bingmapsportal.com/ here',
                    key: "Ak1tVFHGAtPV73DtmMDu8BYMtnGEXSzoLh_irep8NbWB93LsViT2csSZtONmnzND",
                    imagerySet: 'AerialWithLabelsOnDemand'
                    // use maxZoom 19 to see stretched tiles instead of the BingMaps
                    // "no photos at this zoom level" tiles
                    // maxZoom: 19
                    })
                })
            ],
            target: mapElement.current,
            view: new View({
                // center: [-6655.5402445057125, 6709968.258934638],
                center: [-25,492883, -54,729568],
                // zoom: 5
                // center: ol.proj.fromLonLat([37.41, 8.82]),
                zoom: 4
            })
        });
    },[])
  
    return (
        <div className="App">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, necessitatibus! Illum incidunt rem numquam architecto.
            {/* <div ref={mapElement} className="map" style={{
                height:'100vh',
                width:'100vw',
                border: '2px solid green'
            }}></div> */}
        </div>
    )
}

export default Test