export default () => {
  var guardar = true;
  var CampoRequerido = document.getElementsByClassName('requerido');
  if(CampoRequerido !== undefined && CampoRequerido !== null){
    for(let i = 0; i < CampoRequerido.length; i++){
      let valor = CampoRequerido[i].value;
      if(valor.trim().length == 0){
        guardar=false;
        CampoRequerido[i].style.border = "1px solid rgb(228 52 54)";
      }else{
        CampoRequerido[i].style.border = "1px solid #6d74863b";
      }
    }
  }
  return guardar;
}

export const QuitarClaseRequerido = () => {
  var CampoRequerido = document.getElementsByClassName('requerido');
  if(CampoRequerido !== undefined && CampoRequerido !== null){
    for(let i = 0; i < CampoRequerido.length; i++){
      CampoRequerido[i].style.border = "1px solid #6d74863b";
    }
  }
}

