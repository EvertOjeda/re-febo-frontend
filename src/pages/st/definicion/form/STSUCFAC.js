import React, { memo } from 'react';
import Main            from "../../../../components/utils/Main";
import DevExpressList  from '../../../../components/utils/ListViewNew/DevExtremeList';

//BUSCADORES
var url_buscar_zona     = '/st/stsucfac/buscar/zona'
var url_buscar_articulo = '/st/stsucfac/buscar/articulo'
var url_buscar_sucursal = '/st/stsucfac/buscar/sucursal'
var url_buscar_deposito = '/st/stsucfac/buscar/deposito'

//VALIDADORES
var url_valida_zona     = '/st/stsucfac/valida/zona'
var url_valida_articulo = '/st/stsucfac/valida/articulo'
var url_valida_sucursal = '/st/stsucfac/valida/sucursal'
var url_valida_deposito = '/st/stsucfac/valida/deposito'

const concepto = {}
const columnsListar = [
    { ID: 'COD_ZONA'           , label: 'Zona'            , width: 100     , editModal:true , align:'left'    , requerido:true  , isnumber:true },
    { ID: 'DESC_ZONA'          , label: 'Desc. Zona'      , minWidth: 110  , align:'left'   , disable:true    , upper:true     },
    { ID: 'COD_ARTICULO'       , label: 'Articulo'        , width: 100     , editModal:true , align:'left'    , requerido:true  , isnumber:true },
    { ID: 'DESC_ARTICULO'      , label: 'Desc. Articulo'  , minWidth: 120  , align:'left'   , disable:true    , upper:true     },
    { ID: 'COD_SUCURSAL'       , label: 'Suc.'            , width: 100     , editModal:true , align:'center'  , requerido:true },
    { ID: 'DESC_SUCURSAL'      , label: 'Desc. Sucursal'  , minWidth: 120  , align:'left'   , disable:true }  ,
    { ID: 'COD_DEPOSITO'       , label: 'Dep.'            , width: 100     , editModal:true , align:'center'  , requerido:true },
    { ID: 'DESC_DEPOSITO'      , label: 'Desc. Deposito'  , minWidth: 120  , align:'left'   , disable:true   },
    { ID: 'ACTIVO'             , label: 'Activo'          , width: 100     , align:'center' , checkbox:true   , checkBoxOptions:["S","N"]},
];
const columnModal = {
    urlValidar :[
        { 
          COD_ZONA:url_valida_zona,
          COD_ARTICULO:url_valida_articulo,
          COD_SUCURSAL:url_valida_sucursal,
          COD_DEPOSITO:url_valida_deposito
        },
    ],
    urlBuscador:[
        {
          COD_ZONA:url_buscar_zona        ,
          COD_ARTICULO:url_buscar_articulo,
          COD_SUCURSAL:url_buscar_sucursal,
          COD_DEPOSITO:url_buscar_deposito
        },
    ],
    title      :[
        {
          COD_ZONA:'Zona',
          COD_ARTICULO:'Articulos',
          COD_SUCURSAL:'Sucursal',
          COD_DEPOSITO:'Deposito',
        },
        
    ],
    COD_ARTICULO:[
        { ID: 'COD_ARTICULO'  , label: 'Articulos'       , minWidth: 10  , align: 'left' },
        { ID: 'DESC_ARTICULO' , label: 'Descripción', minWidth: 350 , align: 'left' },
    ],
    COD_ZONA:[
        { ID: 'COD_ZONA'  , label: 'Zona'       , minWidth: 10  , align: 'left' },
        { ID: 'DESC_ZONA' , label: 'Descripción', minWidth: 350 , align: 'left' },
    ],
    COD_SUCURSAL:[
        { ID: 'COD_SUCURSAL'  , label: 'Sucursal'       , minWidth: 10  , align: 'left' },
        { ID: 'DESC_SUCURSAL' , label: 'Descripción', minWidth: 350 , align: 'left' },
    ],
    COD_DEPOSITO:[
        { ID: 'COD_DEPOSITO'  , label: 'Deposito'       , minWidth: 10  , align: 'left' },
        { ID: 'DESC_DEPOSITO' , label: 'Descripción', minWidth: 350 , align: 'left' },
    ],
    config:{
        COD_DEPOSITO:{
            depende_de:[
                {id: 'COD_SUCURSAL',label: 'Sucursal'},
            ],
            dependencia_de:[]   
        },
        COD_SUCURSAL:{
            depende_de:[],
            dependencia_de:[
                {id: 'COD_DEPOSITO',label: 'Deposito'},
            ]   
        },
		auto:[]
	},
}
const columBuscador         = 'DESC_ZONA'
const doNotsearch           = ['ACTIVO']
const notOrderByAccion      = ['']
const TituloList            = "Articulos a Facturar en Otra Sucursal";
var defaultOpenKeys         = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
var defaultSelectedKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STSUCFAC'];
const FormName              = 'STSUCFAC';

var codDependenciaAnt = [
        {'COD_ARTICULO': 'COD_ARTICULO_ANT'},
        {'COD_ZONA'    : 'COD_ZONA_ANT'    },
        {'COD_SUCURSAL': 'COD_SUCURSAL_ANT'},
        {'COD_DEPOSITO': 'COD_DEPOSITO_ANT'}
    ];
const FacturaEnOtraSucursal = memo(() => {
    const cod_empresa           =  sessionStorage.getItem('cod_empresa');
    const url_lista             = `/st/stsucfac/${cod_empresa}`;
    const url_buscador          = `/st/stsucfac/search`;
    const url_abm               = "/st/stsucfac";

    const [ datosListar      , setDatosListar     ] = React.useState([]);
    const [ modeloAuditoria  , setModeloAuditoria ] = React.useState([]);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(true);

    React.useEffect(()=>{
        getData();
    },[])
    const getData = async() =>{
        try {
            var url     = url_lista;
            var method  = "GET";
            await Main.Request( url,method,[])
            .then( resp =>{
                if(resp.data.response.rows){
                   setModeloAuditoria(resp.data.comlumn);
                   setDatosListar(resp.data.response.rows);
                }
            });
        } catch (error) {
            console.log(error);
        }finally{
            setActivarSpinner(false)
        }
    }

    return (
        <>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}` }/>
                    <Main.Spin size="large" spinning={activarSpinner} >
                        <DevExpressList 
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
                            modeloAuditoria={modeloAuditoria}
                            sizePagination={17}
                            height={500}
                            codDependenciaAnt={codDependenciaAnt}
                        />
                </Main.Spin>
            </Main.Layout>
        </>    
    );
});

export default FacturaEnOtraSucursal;