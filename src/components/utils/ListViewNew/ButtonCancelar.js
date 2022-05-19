var claseOcultarMostrar = "button-cancelar-ocultar-visible-grid"

export const modifico =  async (idclassName) => {    
    var valor = document.querySelectorAll(`.claseOcultarMostrar , .${idclassName}-cancelar`)
    if(valor.length > 0){
        document.querySelectorAll(`.claseOcultarMostrar , .${idclassName}-cancelar`)[0].classList.remove(claseOcultarMostrar)
    }
};
export const setModifico = (idclassName) => {
    document.getElementsByClassName(`${idclassName}-cancelar`)[0].classList.add(claseOcultarMostrar)    
};