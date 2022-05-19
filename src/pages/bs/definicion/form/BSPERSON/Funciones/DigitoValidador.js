import { Request } from "../../../../../../config/request";
const url_valida_Digito = '/bs/personas/valida/digito_verificador';
const DigitoValidador = async ( e, 
                                persona, 
                                setNroDigVerFocus, 
                                setDirecElectronicaFocus,
                                showModalMensaje,
                            )  => {
    var key = e.which;
    if( key == 13 || key == 9){
        var method = 'POST';
        var url    = url_valida_Digito;
        var data   = {
                    NRO_DOCUMENTO:persona.NRO_DOCUMENTO,
                    COD_PERSONA  :persona.COD_PERSONA,
                    COD_IDENT    :persona.COD_IDENT,
                    NRO_DIG_VER  :persona.NRO_DIG_VER
         };
        try {
            await Request( url, method, data )
                .then( response =>{
                    if(response.data.outBinds.ret != 1){
                        showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                        setNroDigVerFocus()
                    }else{
                        setDirecElectronicaFocus()
                    }
                });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
    }
};

export default DigitoValidador;