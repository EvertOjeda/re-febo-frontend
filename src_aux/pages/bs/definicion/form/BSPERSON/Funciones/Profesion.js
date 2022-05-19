import { Request } from "../../../../../../config/request";
const url_buscar_profesion           = '/bs/personas/buscar/profesion';
const url_valida_profesion           = '/bs/personas/valida/profesion';
const profesionColumns = [
    { ID: 'COD_PROFESION'       , label: 'Codigo'       , width: 80     },
    { ID: 'DESC_PROFESION'      , label: 'Descripcion'  , minWidth: 150 },
]
const getProfesion = async(id) =>{
    var url    = url_buscar_profesion;
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
                                setProfesionFocus, 
                                setNivelEstudiosFocus,
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
        var url    = url_valida_profesion;
        var data   = {'valor':e.target.value};
        try {
            await Request( url, method, data )
                .then( response =>{
                    if(response.data.outBinds.ret == 1){
                        setPersona({
                            ...persona,
                            ['DESC_PROFESION'] : response.data.outBinds.p_desc_profesion
                        })
                        form.setFieldsValue({
                            ...form,
                            ['DESC_PROFESION'] : response.data.outBinds.p_desc_profesion
                        });
                        setNivelEstudiosFocus();
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
                        setProfesionFocus();
                    }
                });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
    }
    if( key == 120){
        e.preventDefault();
        await getProfesion()
            .then( response => {
                setSearchColumns(profesionColumns);
                setSearchData(response);
                setModalTitle('Profesión');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_profesion)
            })
    }
}
export default TipoIndentificacion;