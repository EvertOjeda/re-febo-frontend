import _ from 'underscore';
export const getPermisos = (form) => {
  var rows = [];
  var permiso = JSON.parse(sessionStorage.getItem('permiso_especial'));
  if(permiso == null || permiso == undefined) return [];
  permiso = permiso.filter( item => item.NOM_FORMA == form );
  if( permiso.length == 0 ) return [];
  rows = _.pluck(permiso, 'PARAMETRO');
  return rows;
}