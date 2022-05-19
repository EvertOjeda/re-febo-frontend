import _ from 'underscore';
export const VerificaPermiso = (FormName) =>{
    var ArrayPermiso = Array();
    var permiso = JSON.parse(sessionStorage.getItem('acceso'));
    var info = _.flatten(_.filter(permiso, function(item){
        return item.NOM_FORMA === FormName;
    }));
    if( info.length > 0){
        ArrayPermiso.push({
            'insertar'   : info[0].PUEDE_INSERTAR,
            'actualizar' : info[0].PUEDE_ACTUALIZAR,
            'borrar'     : info[0].PUEDE_BORRAR,
        });
    }else{
        ArrayPermiso.push({
            'insertar'   : '',
            'actualizar' : '',
            'borrar'     : '',
        });
    }
    return ArrayPermiso;
}
