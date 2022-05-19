import { Request } from '../../../../../../config/request';
const buscador = async(data,setSearchData,searchUrl) => {
    var url = searchUrl;
    var method = 'POST';
    await Request( url, method, data )
        .then( response => {
            if( response.status == 200 ){
                setSearchData(response.data.rows);
            }
        })
}
export default buscador;