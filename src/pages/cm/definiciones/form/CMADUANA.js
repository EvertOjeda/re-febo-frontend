import React, { memo }          from 'react';
import Main                     from "../../../../components/utils/Main";
import DevExpressList           from '../../../../components/utils/ListViewNew/DevExtremeList';
import { Menu, DireccionMenu }  from '../../../../components/utils/FocusDelMenu';

// valida
var url_valida_pais   = '/cm/cmaduana/valida/pais';
var url_valida_depar  = '/cm/cmaduana/valida/provincia';
var url_valida_ciudad = '/cm/cmaduana/valida/ciudad';
// buscadores
var url_buscar_pais   = '/cm/cmaduana/buscar/pais';
var url_buscar_depar  = '/cm/cmaduana/buscar/provincia';
var url_buscar_ciudad = '/cm/cmaduana/buscar/ciudad';

// list
var url_list_cmaduana   = '/cm/cmaduana/list'
// buscador
var url_buscar_cmaduana = '/cm/cmaduana/search'
// Abm
var url_abm_cmaduana    = '/cm/cmaduana'

const columnModal = {
  urlValidar :[
      { 
        COD_PAIS:url_valida_pais          ,
        COD_DEPARTAMENTO:url_valida_depar ,
        COD_CIUDAD:url_valida_ciudad      ,
      },
  ],
  urlBuscador:[
      {
        COD_PAIS:url_buscar_pais          ,
        COD_DEPARTAMENTO:url_buscar_depar ,
        COD_CIUDAD:url_buscar_ciudad      ,
      },
  ],
  title:[
      { COD_PAIS:'País',
        COD_DEPARTAMENTO:'Departamento',
        COD_CIUDAD:'Ciudad',
      },
  ],
  COD_PAIS:[
    { ID: 'COD_PAIS'  , label: 'Codigo'     , width: 100  , align: 'left' },
    { ID: 'DESC_PAIS' , label: 'Descripción', minWidth: 350 , align: 'left' },
  ],
  COD_DEPARTAMENTO:[
    { ID: 'COD_DEPARTAMENTO'  , label: 'Codigo'     , width: 100  , align: 'left' },
    { ID: 'DESC_DEPARTAMENTO' , label: 'Descripción', minWidth: 350 , align: 'left' },
  ],
  COD_CIUDAD:[
    { ID: 'COD_CIUDAD'  , label: 'Codigo'     , width: 100  , align: 'left' },
    { ID: 'DESC_CIUDAD' , label: 'Descripción', minWidth: 350 , align: 'left' },
  ],
  config:{
    COD_PAIS:{
      depende_de:[],
      dependencia_de:[
        {id: 'COD_DEPARTAMENTO',label: 'Departamento'},
        {id: 'COD_CIUDAD'      ,label: 'Ciudad'},
      ]   
    },
    COD_DEPARTAMENTO:{
        depende_de:[
          {id: 'COD_PAIS'    ,label: 'País'},
        ],
        dependencia_de:[
          {id: 'COD_CIUDAD'  ,label: 'Ciudad'},
        ]   
      },
    COD_CIUDAD:{
      depende_de:[
        {id: 'COD_PAIS'        ,label: 'País'},
        {id: 'COD_DEPARTAMENTO',label: 'Departamento'},
      ],
      dependencia_de:[]
    },
  auto:[]
},
}
	
const columnsListar = [
  { ID: 'COD_ADUANA'        , label: 'Aduana'           , minWidth: 50   , align:'left'   , requerido:true   , upper:true   },
  { ID: 'DESCRIPCION'       , label: 'Cod. Descripción' , minWidth: 100  , align:'left'   , requerido:true   , upper:true   },
  { ID: 'COD_PAIS'          , label: 'País'             , minWidth: 50   , align:'left'   , editModal:true   , upper:true   },
  { ID: 'DESC_PAIS'         , label: 'Cod. Descripción' , minWidth: 100  , align:'left'   , disable:false    , upper:true   },
  { ID: 'COD_DEPARTAMENTO'  , label: 'Departamento'     , minWidth: 50   , align:'left'   , editModal:true   , isnumber:true},
  { ID: 'DESC_DEPARTAMENTO' , label: 'Cod. Descripción' , minWidth: 100  , align:'left'   , disable:false    , upper:true   },
  { ID: 'COD_CIUDAD'        , label: 'Ciudad'           , minWidth: 50   , align:'left'   , editModal:true   , isnumber:true},
  { ID: 'DESC_CIUDAD'       , label: 'Cod. Descripción' , minWidth: 100  , align:'left'   , disable:false    , upper:true   },
];

const columBuscador         = 'DESCRIPCION'
const doNotsearch           = []
const notOrderByAccion      = ['COD_PAIS','DESC_PAIS','COD_DEPARTAMENTO','DESC_DEPARTAMENTO','COD_CIUDAD','DESC_CIUDAD']

const TituloList = "Aduanas";
const FormName   = "CMADUANA";

const maxFocus = [{
  id:"CMADUANA", //add name FormName
	hasta:"COD_CIUDAD"
}];
const codDependenciaAnt = [
  {'COD_ADUANA': 'COD_ADUANA_ANT'}
];

const CMADUANA = memo(() => {

  const defaultOpenKeys = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
  const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);

  const [ datosListar      , setDatosListar     ] = React.useState([]);
  const [ modeloAuditoria  , setModeloAuditoria ] = React.useState([]);
  const [ activarSpinner   , setActivarSpinner  ] = React.useState(true);
  React.useEffect(()=>{
    getData();
    setActivarSpinner(false);
  },[])
  const getData = async() =>{
    try {
        await Main.Request(url_list_cmaduana,"GET",[])
        .then( resp =>{
            if(resp.data.rows){
              setDatosListar(resp.data.rows);
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
          <DevExpressList 
            data={datosListar}
            columns={columnsListar}
            title={TituloList}
            notOrderByAccion={notOrderByAccion}
            doNotsearch={doNotsearch}
            columBuscador={columBuscador}
            urlBuscador={url_buscar_cmaduana}
            urlAbm={url_abm_cmaduana}
            arrayColumnModal={columnModal}
            formName={FormName}
            modeloAuditoria={modeloAuditoria}
            sizePagination={17}
            height={500}
            //posicion por defecto
            defaultFocusColumn={0}
            maxFocus={maxFocus}
            codDependenciaAnt={codDependenciaAnt}
          />
        </Main.Spin>
    </Main.Layout>
  );
});

export default CMADUANA;