export const Menu = (form) => {
    var rows = [];
    var menu = JSON.parse(sessionStorage.getItem('menu'));
    if(menu == null || menu == undefined) return [];
    menu = menu.filter( item => item.COD_FORMA == form );
    if( menu.length == 0 ) return [];
    var nodo_padre = menu[0].NODO_PADRE;
    var nodo_hijo_1 = menu[0].NODO_HIJO_1;
    var nodo_hijo_2 = menu[0].NODO_HIJO_2;
    rows.push( nodo_padre + '-' + nodo_hijo_1 + '-' + nodo_hijo_2 + '-' + form )
    return rows;
}
export const DireccionMenu = (form) => {
    var rows = [];
    var menu = JSON.parse(sessionStorage.getItem('menu'));
    if(menu == null || menu == undefined) return [];
    menu = menu.filter( item => item.COD_FORMA == form )
    if( menu.length == 0 ) return [];
    var nodo_padre = menu[0].NODO_PADRE;
    var nodo_hijo_1 = menu[0].NODO_HIJO_1;
    var nodo_hijo_2 = menu[0].NODO_HIJO_2;
    rows.push( nodo_padre );
    rows.push( nodo_padre  + '-' + nodo_hijo_1 );
    rows.push( nodo_padre  + '-' + nodo_hijo_1 + '-' + nodo_hijo_2);
    return rows;
}