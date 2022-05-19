import { useRef } from "react";
const UseFocus = () => {
    const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}
export default UseFocus;