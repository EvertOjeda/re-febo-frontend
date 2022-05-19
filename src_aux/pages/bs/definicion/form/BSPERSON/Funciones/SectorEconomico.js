import { Request } from "../../../../../../config/request";
const url_buscar_sector = '/bs/personas/buscar/sector_economico';
const url_valida_sector = '/bs/personas/valida/sector_economico';
const sectorColumns = [
    { ID: 'COD_SECTOR'  , label: 'Código'      , width: 80     },
    { ID: 'DESC_SECTOR' , label: 'Descripción' , minWidth: 150 },
]
const getSector = async() =>{
    var url    = url_buscar_sector;
    var method = 'POST';
    return await Request( url, method,{valor:'null'} )
    .then(response => {
        if( response.data.rows.length > 0){
            return response.data.rows;
        }
    })
}
const Provincia = async(e, 
                        persona, 
                        setPersona,
                        form, 
                        setCodSectorFocus, 
                        setCodPaisFocus,
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
        var url    = url_valida_sector;
        var data   = {'valor':e.target.value};
        try {
            await Request( url, method, data )
            .then( response =>{
                if(response.data.outBinds.ret == 1){
                    setPersona({
                        ...persona,
                        ['DESC_SECTOR'] : response.data.outBinds.p_desc_sector
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_SECTOR'] : response.data.outBinds.p_desc_sector
                    });
                    setCodPaisFocus()
                }else{
                    showModalMensaje('ERROR!','error',response.data.outBinds.p_mensaje);
                    setPersona({
                        ...persona,
                        ['DESC_SECTOR'] : '',
                    })
                    form.setFieldsValue({
                        ...form,
                        ['DESC_SECTOR'] : '',
                    });
                    setCodSectorFocus();
                }
            });
        } catch (error) {
            showModalMensaje('ERROR!','error','Se produjo un error al realizar la peticion.');
        }
    }
    if( key == 120){
        e.preventDefault();
        await getSector()
            .then( response => {
                setSearchColumns(sectorColumns);
                setSearchData(response);
                setModalTitle('Sector Economico');
                setShows(true);
                setSearchType(e.target.name);
                setSearchUrl(url_buscar_sector);
            })
    }
}
export default Provincia;