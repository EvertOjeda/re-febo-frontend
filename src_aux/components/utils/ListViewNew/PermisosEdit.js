import _ from 'underscore';

export const  getPermiso = (FormName,tipo)=>{
    let tienePermiso = false
    var permiso      = JSON.parse(sessionStorage.getItem('acceso'));
    var info         = _.flatten(_.filter(permiso, function(item){
        return item.NOM_FORMA === FormName;
    }));
    if( info.length > 0){
        var canUpdate  = info[0].PUEDE_ACTUALIZAR;
        var canInserte = info[0].PUEDE_INSERTAR;
        var canDelete  = info[0].PUEDE_BORRAR;

        switch (tipo) {
            case 'U':
                if(canUpdate === 'S'){
                    tienePermiso = true
                };            
                return tienePermiso;
            case 'I':
                if(canInserte === 'S'){
                    tienePermiso = true
                };
                return tienePermiso;
            case 'D':
                if(canDelete === 'S'){
                    tienePermiso = true
                };
                return tienePermiso;
            default:
            return tienePermiso;
        }
    }    
}
