const valores = (persona, datos,focus,form)=> {
    return {
        ['TIPO_SOCIEDAD'] : {
            ['DATOS']:{
                ...persona,
                ['TIPO_SOCIEDAD']      : datos[0],
                ['DESC_TIPO_SOCIEDAD'] : datos[1]
            },
            ['FOCUS']:focus['TIPO_SOCIEDAD']
        },
        ['COD_SECTOR'] : {
            ['DATOS']:{
                ...persona,
                ['COD_SECTOR']  : datos[0],
                ['DESC_SECTOR'] : datos[1]
            },
            ['FOCUS']:focus['COD_SECTOR']
        },
        ['COD_PAIS'] : {
            ['DATOS']:{
                ...persona,
                ['COD_PAIS']        : datos[0],
                ['DESC_PAIS']       : datos[1],
                ['COD_PROVINCIA']   : '',
                ['DESC_PROVINCIA']  : '',
                ['COD_CIUDAD']      : '',
                ['DESC_CIUDAD']     : '',
            },
            ['FOCUS']:focus['COD_PAIS']
        },
        ['COD_PROVINCIA'] : {
            ['DATOS']:{
                ...persona,
                ['COD_PROVINCIA']  : datos[0],
                ['DESC_PROVINCIA'] : datos[1],
                ['COD_CIUDAD']     : '',
                ['DESC_CIUDAD']    : '',
            },
            ['FOCUS']:focus['COD_PROVINCIA']
        },
        ['COD_CIUDAD'] : {
            ['DATOS']:{
                ...persona,
                ['COD_CIUDAD']  : datos[0],
                ['DESC_CIUDAD'] : datos[1]
            },
            ['FOCUS']:focus['COD_CIUDAD']
        },
        ['COD_IDENT'] : {
            ['DATOS']:{
                ...persona,
                ['COD_IDENT']  : datos[0],
                ['DESC_IDENT'] : datos[1]
            },
            ['FOCUS']:focus['COD_IDENT']
        },
        ['PROFESION'] : {
            ['DATOS']:{
                ...persona,
                ['PROFESION']      : datos[0],
                ['DESC_PROFESION'] : datos[1]
            },
            ['FOCUS']:focus['PROFESION']
        },
        ['NIVEL_ESTUDIOS'] : {
            ['DATOS']:{
                ...persona,
                ['NIVEL_ESTUDIOS']      : datos[0],
                ['DESC_NIVEL_ESTUDIOS'] : datos[1]
            },
            ['FOCUS']:focus['NIVEL_ESTUDIOS']
        },
        ['COD_ESTADO_CIVIL'] : {
            ['DATOS']:{
                ...persona,
                ['COD_ESTADO_CIVIL']  : datos[0],
                ['DESC_ESTADO_CIVIL'] : datos[1]
            },
            ['FOCUS']:focus['COD_ESTADO_CIVIL']
        },
        ['TIPO_REF'] : {
            ['DATOS']:{
                ...persona,
                ['TIPO_REF']  : datos[0],
                ['DESC_TIPO_REF'] : datos[1]
            },
            ['FOCUS']:focus['TIPO_REF']
        },
    }
}
const Asignar = ( persona
                , setPersona
                , form
                , busquedaPor
                , datos
                , showsModal
                , codPaisAux
                , setCodPaisAux
                , codProvinciaAux
                , setCodProvinciaAux
                , focus
                ) => {
    showsModal(false);
    setTimeout(valores(persona,datos,focus,form)[busquedaPor]['FOCUS'],200);
    if (busquedaPor === 'COD_PAIS'){
        if (datos[0]==codPaisAux) {
            return;
        } else {
            setCodPaisAux(datos[0])
        }
    }
    if (busquedaPor === 'COD_PROVINCIA'){
        if (datos[0]===codProvinciaAux) {
            return;
        } else {
            setCodProvinciaAux(datos[0])
        }
    }
    setPersona(valores(persona,datos,focus,form)[busquedaPor]['DATOS']);
    form.setFieldsValue(valores(persona,datos,focus,form)[busquedaPor]['DATOS']);
}
export default Asignar;