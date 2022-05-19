import { Request } from "../../../../../../config/request";
const url_buscar_nivel_estudio  = '/bs/personas/buscar/nivel_estudio';
const url_valida_nivel_estudio  = '/bs/personas/valida/nivel_estudio';
const nivelEstudioColumns = [
    { ID: 'COD_NIVEL_ESTUDIOS'  , label: 'Código'       , width: 80     },
    { ID: 'DESC_NIVEL_ESTUDIOS' , label: 'Descripción'  , minWidth: 150 },
]
const getNivelEstudios = async() =>{
    var url    = url_buscar_nivel_estudio;
    var method = 'POST';
    return await Request( url, method,{valor:'null'} )
    .then(response => {
        if( response.data.rows.length > 0){
            return response.data.rows;
        }
    })
}
const NivelEstudio = async( e, 
                            persona, 
                            setPersona, 
                            form, 
                            setNivelEstudiosFocus, 
                            setNacionalidadFocus,
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
        var url    = url_valida_nivel_estudio;
        var data   = {'valor':e.target.value};
        try {
            await Request( url, method, data )
                .then( response =>{
                    if(response.data.outBinds.ret == 1){
                        setPersona({
                            ...persona,
                            ['DESC_NIVEL_ESTUDIOS'] : response.data.outBinds.p_desc_nivel
                        })
                        form.setFieldsValue({
                            ...form,
                            ['DESC_NIVEL_ESTUDIOS'] : response.data.outBinds.p_desc_nivel
                        });
                        setNacionalidadFocus();
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
                        setNivelEstudiosFocus();
                    }
                    return 'ok'
                }); 
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
    }
    if( key == 120){
        e.preventDefault();
        await getNivelEstudios()
            .then( response => {
                setSearchColumns(nivelEstudioColumns);
                setSearchData(response);
                setModalTitle('Nivel de Estudio');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_nivel_estudio)
            })
    }
}
export default NivelEstudio;