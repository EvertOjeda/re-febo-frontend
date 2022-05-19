import {Request} from '../../../../../../config/request';
let url_retorna_cambio_moneda = '/st/stentsal/varios/retorna_cambio_moneda';
let url_retorna_precio_unit = '/st/stentsal/varios/retorna_precio_unit';
export default async (b_cabecera, b_detalle, cod_articulo) => {
  let vprecio = 0;
  let vcosto = 0;
  let vmoneda = 0;
  let vtipcambio = 0;
  let vprecio_unitario = 0;
  let result = await Request(url_retorna_cambio_moneda,'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), cod_sucursal: b_cabecera.COD_SUCURSAL });
  vmoneda = result.data.outBinds.MONEDA;
  vtipcambio = result.data.outBinds.TIP_CAMBIO;
  
  vprecio = await Request(url_retorna_precio_unit,'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), cod_sucursal:b_cabecera.COD_SUCURSAL, cod_articulo})
    .then(response => {
      return response.data.outBinds.ret;
    })
 
  if(b_cabecera.COD_MONEDA == vmoneda){
    vcosto = vprecio;
  }else{
    vcosto = (vprecio / b_cabecera.TIP_CAMBIO * vtipcambio)
  }
  // console.log(vcosto);
  // if(b_detalle.div > 1){
  //   vprecio_unitario = (vcosto * b_detalle.MULT / b_detalle.DIV).toFixed(2);
  // }else{
    vprecio_unitario = vcosto//(vcosto * b_detalle.MULT);
  // }
  return parseFloat(vprecio_unitario);
}