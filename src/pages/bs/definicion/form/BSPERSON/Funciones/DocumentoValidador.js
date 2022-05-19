import { Request } from "../../../../../../config/request";
const url_valida_Documento = '/bs/personas/valida/documento';
const DocumentoValidador =  async(e, 
                                persona, 
                                setPersona,
                                form, 
                                setNroDocumentoFocus, 
                                setNroDigVerFocus,
                                showModalMensaje,
                            ) => {    
    var key = e.which;
    if( key == 13 || key == 9){
        var method = 'POST';
        var url    = url_valida_Documento;
        var data   = {
                        NRO_DOCUMENTO:persona.NRO_DOCUMENTO,
                        COD_PERSONA  :persona.COD_PERSONA,
                        COD_IDENT    :persona.COD_IDENT,
                     };
        try {
            await Request( url, method, data )
                .then( response =>{
                    if(response.data.outBinds.ret == 1){                        
                        setPersona({
                            ...persona,
                            ['NRO_DIG_VER'] : response.data.outBinds.p_nro_dig_ver
                        })
                        form.setFieldsValue({
                            ...form,
                            ['NRO_DIG_VER'] : response.data.outBinds.p_nro_dig_ver
                        });
                        setNroDigVerFocus();
                    }else{
                        showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                        setPersona({
                            ...persona,
                            ['NRO_DIG_VER'] : ''
                        })
                        form.setFieldsValue({
                            ...form,
                            ['NRO_DIG_VER'] : ''
                        });
                        setNroDocumentoFocus();
                    }
                });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
    }
};

export default DocumentoValidador;