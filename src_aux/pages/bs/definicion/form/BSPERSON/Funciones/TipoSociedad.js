import { Request } from "../../../../../../config/request";
const url_buscar_tipo_sociedad  = '/bs/personas/buscar/tipo_sociedad';
const url_valida_tipo_sociedad  = '/bs/personas/valida/tipo_sociedad';
const tipoSociedadColumns = [
    { ID: 'TIPO_SOCIEDAD'       , label: 'Código'       , width: 80     },
    { ID: 'DESC_TIPO_SOCIEDAD'  , label: 'Descripción'  , minWidth: 150 },
]
const getTipoSociedad = async(id) =>{
    var url    = url_buscar_tipo_sociedad;
    var method = 'POST';
    return await Request( url, method,{valor:'null'} )
    .then(response => {
        if( response.data.rows.length > 0){
            return response.data.rows;
        }
    })
}
const TipoSociedad = async( e, 
                            persona, 
                            setPersona, 
                            form, 
                            setTipoSociedadFocus, 
                            setCodSectorFocus,
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
        e.preventDefault();
        var method = 'POST';
        var url    = url_valida_tipo_sociedad;
        var data   = {'valor':e.target.value};
        try {
            await Request( url, method, data )
            .then( response =>{
                if(response.data.outBinds.ret == 1){
                    setPersona({
                        ...persona,
                        ['DESC_TIPO_SOCIEDAD'] : response.data.outBinds.p_desc_sociedad
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_TIPO_SOCIEDAD'] : response.data.outBinds.p_desc_sociedad
                    });
                    setCodSectorFocus();
                }else{
                    showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                    setPersona({
                        ...persona,
                        ['DESC_TIPO_SOCIEDAD'] : '',
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_TIPO_SOCIEDAD'] : '',
                    });
                    setTipoSociedadFocus();
                }
            });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
    }
    if( key == 120){
        e.preventDefault();
        await getTipoSociedad()
            .then( response => {
                setSearchColumns(tipoSociedadColumns);
                setSearchData(response);
                setModalTitle('Tipo de Sociedad');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_tipo_sociedad);
            })
    }
}
export default TipoSociedad;