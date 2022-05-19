import { Request } from "../../../../../../config/request";
const url_buscar_estado_civil        = '/bs/personas/buscar/estado_civil';
const url_valida_estado_civil        = '/bs/personas/valida/estado_civil';
const estadoCivilColumns = [
    { ID: 'COD_ESTADO_CIVIL'    , label: 'Código'       , width: 80     },
    { ID: 'DESC_ESTADO_CIVIL'   , label: 'Descripción'  , minWidth: 150 },
]
const getEstadoCivil = async(id) =>{
    var url    = url_buscar_estado_civil;
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
                                setCodEstadoCivilFocus, 
                                setConyugueFocus,
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
        var url    = url_valida_estado_civil;
        var data   = {'valor':e.target.value};
        try {
            await Request( url, method, data )
                .then( response =>{
                    if(response.data.outBinds.ret == 1){
                        setPersona({
                            ...persona,
                            ['DESC_ESTADO_CIVIL'] : response.data.outBinds.p_desc_estado_civil
                        })
                        form.setFieldsValue({
                            ...form,
                            ['DESC_ESTADO_CIVIL'] : response.data.outBinds.p_desc_estado_civil
                        });
                        setConyugueFocus();
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
                        setCodEstadoCivilFocus();
                    }
                });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
    }
    if( key == 120){
        e.preventDefault();
        await getEstadoCivil()
            .then( response => {
                setSearchColumns(estadoCivilColumns);
                setSearchData(response);
                setModalTitle('Estado Civil');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_estado_civil)
            })
    }
}
export default TipoIndentificacion;