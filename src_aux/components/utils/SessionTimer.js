import React from "react";
import { useIdleTimer } from "react-idle-timer";

export default function (props) {
    const handleOnIdle = (event) => {
        setTimeout( ()=>{
            props.CloseSession();
        }, 3000 );
    };
    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 60,
        onIdle: handleOnIdle,
        debounce: 500,
    });
    return <>{/* text */}</>;
}
