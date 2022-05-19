import React, { memo }      from 'react';
import Main                 from '../../../../../components/utils/Main';
import DevExtremeList       from '../../../../../components/utils/ListViewNew/DevExtremeList';

const url_cod_causa        = '/st/stcautra/cod_causa';
const columnModal ={ 
    urlValidar:[],
    urlBuscador:[],
    title:[],
    config:{
        auto:[
            {'COD_CAUSA': url_cod_causa }
        ]
    },
}
const concepto = {
    IND_TRANS:  [ 
        { ID:'D' , NAME:'Deposito'  , isNew:true}, 
        { ID:'S' , NAME:'Sucursal' }, 
    ],
    TIPO:  [ 
        { ID:'S' , NAME:'Salida'  }, 
        { ID:'E' , NAME:'Entrada' }, 
        { ID:'N' , NAME:'Ningún'   , isNew:true}, 
    ],
    TIPO_ENTRADA: [
        { ID:'R' , NAME:'Rebote' }, 
        { ID:'S' , NAME:'SD'     }, 
        { ID:'A' , NAME:'Ambos'  }, 
        { ID:'E' , NAME:'Reenvió'}, 
        { ID:'O' , NAME:'Otros'  }, 
        { ID:'N' , NAME:'Ningún'  , isNew:true}, 
    ],
    AFECTA:[
        { ID:'C' , NAME:'Conferencia'}, 
        { ID:'V' , NAME:'Variaciones'},
        { ID:'N' , NAME:'Ningún'      , isNew:true}, 
    ]  
}
var codDependenciaAnt = [
    {'IND_TRANS': 'IND_TRANS_ANT'},
    {'ESTADO'   : 'ESTADO_ANT'   },
];
const columnsListar = [
    { ID: 'COD_CAUSA'     , label: 'Causa'          , width:    80  , align:'left'  , disable:true        ,isnumber:true},
    { ID: 'DESCRIPCION'   , label: 'Descripción'    , minWidth: 120 , align:'left'  , upper:true         },
    { ID: 'IND_TRANS'     , label: 'Transaldo/Ent.' , minWidth: 115 , align:'left'  , isOpcionSelect:true , requerido:true},
    { ID: 'IND_WMS'       , label: 'Af. WMS'        , minWidth: 34  , align:'left'  , checkbox:true       , checkBoxOptions:["S","N"]},
    { ID: 'TIPO'          , label: 'Tipo'           , minWidth: 50  , align:'left'  , isOpcionSelect:true},
    { ID: 'TIPO_ENTRADA'  , label: 'Afecta'         , minWidth: 50  , align:'left'  , isOpcionSelect:true},
    { ID: 'SE_FACTURA'    , label: 'Se. Fact.'      , minWidth: 64  , align:'left'  , checkbox:true       , checkBoxOptions:["S","N"]},
    { ID: 'AFECTA_STOCK'  , label: 'Af. Stock'      , minWidth: 64  , align:'left'  , checkbox:true       , checkBoxOptions:["S","N"]},
    { ID: 'AFECTA_SOB_FAL', label: 'Af. Sob Fal'    , width:    105 , align:'left'  , checkbox:true       , checkBoxOptions:["S","N"]},
    { ID: 'AFECTA'        , label: 'Afecta'         , minWidth: 50  , align:'left'  , isOpcionSelect:true},
    { ID: 'ESTADO'        , label: 'Estado'         , width:    65  , align:'left'  , checkbox:true       , checkBoxOptions:["S","N"] , requerido:true},
];

const columBuscador        = 'DESCRIPCION'
const doNotsearch          = ['ESTADO','IND_WMS','SE_FACTURA','AFECTA_STOCK']
const notOrderByAccion     = ['']

const TituloList           = "Motivos de Transferencia e/ Depósitos";
var defaultOpenKeys        = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
var defaultSelectedKeys    = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STCAUTRA'];
const FormName             = 'STCAUTRA';

const STCAUTRA = memo(() => {

    const [ datosListar      , setDatosListar     ] = React.useState([]);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(false);    
    
    const cod_empresa        = sessionStorage.getItem('cod_empresa');
    const url_lista          = `/st/stcautra/${cod_empresa}`;
    const url_abm            = "/st/stcautra";
    const url_buscador       = `/st/stcautra/search`;
    
    React.useEffect(()=>{
        getData();
    },[])

    const getData = async() =>{
        try {
            let url     = `${url_lista}`;
            let method  = "GET";
            await Main.Request( url,method,{})
            .then( resp =>{
                if(resp.status == 200){
                    if(resp.data.rows.length > 0){
                        setDatosListar(resp.data.rows)
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }finally{
            setActivarSpinner(false)
        }
    }
    return (
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}` }/>
                <Main.Spin size="large" spinning={activarSpinner} >
                    <DevExtremeList 
                        data={datosListar}
                        columns={columnsListar}
                        title={TituloList}
                        notOrderByAccion={notOrderByAccion}
                        doNotsearch={doNotsearch}
                        columBuscador={columBuscador}
                        urlBuscador={url_buscador}
                        urlAbm={url_abm}
                        arrayOptionSelect={concepto}
                        arrayColumnModal={columnModal}
                        formName={FormName}
                        modeloAuditoria={[]}
                        defaultFocusColumn={1}
                        // --------
                        sizePagination={17}
                        height={455}
                        codDependenciaAnt={codDependenciaAnt}
                    />       
             </Main.Spin>
        </Main.Layout>
    );
});

export default STCAUTRA;