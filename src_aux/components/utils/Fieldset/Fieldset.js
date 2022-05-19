import React, { memo } from 'react'
import './fieldset.css'

export default memo(function ContainerText(props) {
    return (
        <>
            <div className="contenedor" style={{marginTop:props.margenTop, width:props.anchoContenedor}}>
                <fieldset className="scheduler-border" style={{textAlign:props.alineacionContenedor}} >
                    <legend className="scheduler-border" style={{textAlign:props.alineacionTitle,fontSize:props.tamañoTitle}}>
                        {props.title}
                    </legend>
                        <span>
                            {props.contenedor}
                        </span>
                </fieldset>
            </div>
        </>
    )
})
