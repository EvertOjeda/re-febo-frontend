import { Request } from "../../../../../../config/request";
const url_buscar_provincia      = '/bs/personas/buscar/provincia';
const url_valida_provincia      = '/bs/personas/valida/provincia';
const provinciaColumns = [
    { ID: 'COD_PROVINCIA'       , label: 'Código'       , width: 80     },
    { ID: 'DESC_PROVINCIA'      , label: 'Descripción'  , minWidth: 150 },
]
const getProvincia = async(cod_pais) =>{
    var url    = url_buscar_provincia;
    var method = 'POST';
    return await Request( url, method,{valor:'null', cod_pais: cod_pais} )
    .then(response => {
        if( response.data.rows.length > 0){
            return response.data.rows;
        }
    })
}
const Provincia = async( e, 
                    persona, 
                    setPersona, 
                    provinciaAux,
                    setProvinciaAux,
                    paisAux,
                    form, 
                    setCodProvinciaFocus, 
                    setCodCiudadFocus,
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
        var url    = url_valida_provincia;
        var data   = {'cod_dpto':e.target.value, 'cod_pais': persona.COD_PAIS};
        if(provinciaAux == e.target.value){
            setCodCiudadFocus();
            return;
        }
        try {
            await Request( url, method, data )
            .then( response =>{
                if(response.data.outBinds.ret == 1){
                    setPersona({
                        ...persona,
                        ['DESC_PROVINCIA'] : response.data.outBinds.p_desc_dpto,
                        ['COD_CIUDAD']     : '',
                        ['DESC_CIUDAD']    : '',
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_PROVINCIA'] : response.data.outBinds.p_desc_dpto,
                        ['COD_CIUDAD']     : '',
                        ['DESC_CIUDAD']    : '',
                    });
                    setCodCiudadFocus();
                }else{
                    showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                    setPersona({
                        ...persona,
                        ['DESC_PROVINCIA'] : '',
                        ['COD_CIUDAD']     : '',
                        ['DESC_CIUDAD']    : '',
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_PROVINCIA'] : '',
                        ['COD_CIUDAD']     : '',
                        ['DESC_CIUDAD']    : '',
                    });
                    setCodProvinciaFocus();
                }
                setProvinciaAux(e.target.value);
            });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
        
    }
    if( key == 120){
        e.preventDefault();
        await getProvincia(paisAux)
            .then( response => {
                setSearchColumns(provinciaColumns);
                setSearchData(response);
                setModalTitle('Departamento');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_provincia)
            })
    }
}
export default Provincia;