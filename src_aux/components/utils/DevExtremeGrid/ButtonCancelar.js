var claseAlternativo    = "button-cancelar-alternativo";
var claseOcultarMostrar = "button-cancelar-ocultar-visible"

export const modifico =  async () => {    
    var valor = await document.getElementsByClassName(claseOcultarMostrar);
    if(valor.length > 0){
        document.getElementsByClassName(claseOcultarMostrar)[0].classList.remove(claseOcultarMostrar)
    }
};

export const setModifico = () => {
    document.getElementsByClassName(claseAlternativo)[0].classList.add(claseOcultarMostrar)    
};