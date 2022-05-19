import { Request } from "../../../../../../config/request";
const url_buscar_tipo_identificacion = '/bs/personas/buscar/tipo_identificacion';
const url_valida_tipo_identificacion = '/bs/personas/valida/tipo_identificacion';
const tipoIdentificacionColumns = [
    { ID: 'COD_IDENT'  , label: 'Código'       , width: 80     },
    { ID: 'DESC_IDENT' , label: 'Descripción'  , minWidth: 150 },
]
const getTipoIdentificacion = async(id) =>{
    var url    = url_buscar_tipo_identificacion;
    var method = 'POST';
    return await Request( url, method,{valor:'null'} )
    .then(response => {
        if( response.data.rows.length > 0){
            return response.data.rows;
        }
    })
}
const TipoIndentificacion = async(e, 
                                persona, 
                                setPersona,
                                form, 
                                setCodIdentFocus, 
                                setNroDocumentoFocus,
                                showModalMensaje,
                                setSearchColumns,
                                setSearchData,
                                setModalTitle,
                                setShows,
                                setSearchType,
                                setSearchUrl
                                ) => {
    var key = e.which;
    if( key == 13 || key == 9){
        var method = 'POST';
        var url    = url_valida_tipo_identificacion;
        var data   = {'valor':e.target.value};
        try {
            await Request( url, method, data )
                .then( response =>{
                    if(response.data.outBinds.ret == 1){
                        setPersona({
                            ...persona,
                            ['DESC_IDENT'] : response.data.outBinds.p_desc_ident
                        })
                        form.setFieldsValue({
                            ...form,
                            ['DESC_IDENT'] : response.data.outBinds.p_desc_ident
                        });
                        setNroDocumentoFocus();
                    }else{
                        showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                        setPersona({
                            ...persona,
                            ['DESC_IDENT'] : '',
                        })
                        form.setFieldsValue({
                            ...form,
                            ['DESC_IDENT'] : '',
                        });
                        setCodIdentFocus();
                    }
                });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
    }
    if( key == 120){
        e.preventDefault();
        await getTipoIdentificacion()
            .then( response => {
                setSearchColumns(tipoIdentificacionColumns);
                setSearchData(response);
                setModalTitle('Tipo');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_tipo_identificacion)
            })
    }
}
export default TipoIndentificacion;