import { Request } from "../../../../../../config/request";
const url_buscar_ciudad = '/bs/personas/buscar/ciudad';
const url_valida_ciudad = '/bs/personas/valida/ciudad';
const ciudadColumns = [
    { ID: 'COD_CIUDAD'   , label: 'Código'       , width: 80     },
    { ID: 'DESC_CIUDAD'  , label: 'Descripción'  , minWidth: 150 },
]
const getCiudad = async(cod_pais, cod_provincia) =>{
    var url    = url_buscar_ciudad;
    var method = 'POST';
    return await Request( url, method,{valor:'null', cod_pais:cod_pais,cod_provincia:cod_provincia})
    .then(response => {
        if( response.data.rows.length > 0){
            return response.data.rows;
        }else{
            return [];
        }
    })
}
const Ciudad = async( e, 
                    persona, 
                    setPersona,
                    form, 
                    setCodCiudadFocus, 
                    setDireccionFocus,
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
        var url    = url_valida_ciudad;
        var data   = {'cod_pais':persona.COD_PAIS,'cod_dpto':persona.COD_PROVINCIA,'cod_ciudad':e.target.value};
        try {
            await Request( url, method, data )
            .then( response =>{
                if(response.data.outBinds.ret == 1){
                    setPersona({
                        ...persona,
                        ['DESC_CIUDAD'] : response.data.outBinds.p_desc_ciudad
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_CIUDAD'] : response.data.outBinds.p_desc_ciudad
                    });
                    setDireccionFocus();
                }else{
                    showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                    setPersona({
                        ...persona,
                        ['DESC_CIUDAD'] : '',
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_CIUDAD'] : '',
                    });
                    setCodCiudadFocus();
                }
            });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
        
    }
    if( key == 120){
        e.preventDefault();
        await getCiudad(persona.COD_PAIS, persona.COD_PROVINCIA)
            .then( response => {
                if(response.length == 0){
                    showModalMensaje('Atención','alerta','No se han registrado ciudades a este departamento.');
                    return;
                }
                setSearchColumns(ciudadColumns);
                setSearchData(response);
                setModalTitle('Ciudad');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_ciudad)
            })
    }
                        
}
export default Ciudad;