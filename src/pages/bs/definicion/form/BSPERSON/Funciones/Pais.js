import { Request } from "../../../../../../config/request";
const url_buscar_pais           = '/bs/personas/buscar/pais';
const url_valida_pais           = '/bs/personas/valida/pais';
const paisColumns = [
    { ID: 'COD_PAIS'            , label: 'Código'       , width: 80     },
    { ID: 'DESC_PAIS'           , label: 'Descripción'  , minWidth: 150 },
]
const getPais = async(id) =>{
    var url    = url_buscar_pais;
    var method = 'POST';
    return await Request( url, method,{valor:'null'} )
    .then(response => {
        if( response.data.rows.length > 0){
            return response.data.rows;
        }
    })
}
const Pais = async( e, 
                    persona, 
                    setPersona,
                    paisAux,
                    setPaisAux,
                    setProvinciaAux,
                    form, 
                    setCodPaisFocus, 
                    setCodProvinciaFocus,
                    showModalMensaje,
                    setSearchColumns,
                    setSearchData,
                    setModalTitle,
                    setShows,
                    setSearchType,
                    setSearchUrl,
                    ) => {
    var key = e.which;
    if( key == 13 || key == 9){
        var method = 'POST';
        var url    = url_valida_pais;
        var data   = {'valor':e.target.value};
        if(paisAux == e.target.value){
            setCodProvinciaFocus();
            return;
        }
        try {
            await Request( url, method, data )
            .then( response =>{
                if(response.data.outBinds.ret == 1){
                    setPersona({
                        ...persona,
                        ['DESC_PAIS'] : response.data.outBinds.p_desc_pais,
                        ['COD_PROVINCIA'] : '',
                        ['DESC_PROVINCIA'] : '',
                        ['COD_CIUDAD'] : '',
                        ['DESC_CIUDAD'] : '',
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_PAIS'] : response.data.outBinds.p_desc_pais,
                        ['COD_PROVINCIA'] : '',
                        ['DESC_PROVINCIA'] : '',
                        ['COD_CIUDAD'] : '',
                        ['DESC_CIUDAD'] : '',
                    });
                    setCodProvinciaFocus();
                }else{
                    showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                    setPersona({
                        ...persona,
                        ['DESC_PAIS'] : '',
                        ['COD_PROVINCA'] : '',
                        ['DESC_PROVINCA'] : '',
                        ['COD_CIUDAD'] : '',
                        ['DESC_CIUDAD'] : '',
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_PAIS'] : '',
                        ['COD_PROVINCA'] : '',
                        ['DESC_PROVINCA'] : '',
                        ['COD_CIUDAD'] : '',
                        ['DESC_CIUDAD'] : '',
                    });
                    setCodPaisFocus();
                }
                setPaisAux(e.target.value);
                setProvinciaAux('');
            });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
       
    }
    if( key == 120){
        e.preventDefault();
        await getPais()
            .then( response => {
                setSearchColumns(paisColumns);
                setSearchData(response);
                setModalTitle('Pais');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_pais);
            })
    }
}
export default Pais;