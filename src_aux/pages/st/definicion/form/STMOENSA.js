import React, { memo } from 'react';
import Main            from "../../../../components/utils/Main";
import DevExpressList  from '../../../../components/utils/ListViewNew/DevExtremeList';

const columnModal ={ 
    urlValidar:[],
    urlBuscador:[],
    title:[],
    config:{
        auto:[]
    },
}
const concepto = {  IND_ENT_SAL:  [ 
                                    { ID:'E' , NAME:'Entrada'   }, 
                                    { ID:'S' , NAME:'Salida'     , isNew:true}, 
                                    { ID:'A' , NAME:'Ambos'     }
                                  ],
                           TIPO:  [ { ID:'T' , NAME:'Interno'    , isNew:true}, 
                                    { ID:'S' , NAME:'Sucursales'}, 
                                    { ID:'V' , NAME:'Vehiculo'  }, 
                                    { ID:'P' , NAME:'Proveedor' },
                                    { ID:'C' , NAME:'Cliente'   } 
                                 ],
                         ESTADO: [
                                    { ID:'C' , NAME:'Confirmado' , isNew:true},
                                    { ID:'P' , NAME:'Pendiente' },
                                 ],           
                 }
const columnsListar = [
    { ID: 'COD_MOTIVO'   , label: 'Motivo'        , minWidth: 90   , align:'left'   , requerido:true      , isnumber:true             , Pk:true},
    { ID: 'DESCRIPCION'  , label: 'Desc. Motivo'  , minWidth: 245  , align:'left'   , requerido:true      , upper:true               },
    { ID: 'ABREVIATURA'  , label: 'Abreviatura'   , minWidth: 150  , align:'left'   , requerido:true      , upper:true               },    
    { ID: 'IND_ENT_SAL'  , label: 'Tipo'          , minWidth: 100  , align:'left'   , isOpcionSelect:true , Pk:true                  },
    { ID: 'AFECTA_COSTO' , label: 'Af. Costo'     , minWidth: 75   , align:'left'   , checkbox:true       , checkBoxOptions:["S","N"] , ascendente:true},
    { ID: 'ACTIVO'       , label: 'Activo'        , minWidth: 70   , align:'left'   , checkbox:true       , checkBoxOptions:["S","N"] , ascendente:true},
    { ID: 'TIPO'         , label: 'Tipo'          , minWidth: 150  , align:'left'   , isOpcionSelect:true},
    { ID: 'ESTADO'       , label: 'Estado'        , minWidth: 150  , align:'left'   , isOpcionSelect:true},
];
const columBuscador         = 'COD_MOTIVO'
const doNotsearch           = ['IND_ENT_SAL','AFECTA_COSTO','ACTIVO','TIPO','ESTADO']
const notOrderByAccion      = ['']
const TituloList            = "Motivos de ajustes de Stock";
var defaultOpenKeys         = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
var defaultSelectedKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STMOENSA'];
const FormName              = 'STMOENSA';

const MovDeAjustDeStock = memo(() => {

    const cod_empresa           =  sessionStorage.getItem('cod_empresa');
    const url_lista             = `/st/stmoensa/${cod_empresa}`;
    const url_buscador          = `/st/stmoensa/search`;
    const url_abm               = "/st/stmoensa";

    const [ datosListar      , setDatosListar     ] = React.useState([]);
    const [ modeloAuditoria  , setModeloAuditoria ] = React.useState([]);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(false);

    React.useEffect(()=>{
        getData();
    },[])
    const getData = async() =>{
        try {
            var url     = `${url_lista}`;
            var method  = "GET";
            await Main.Request( url,method,[])
            .then( resp =>{
                if(resp.data.response.rows){
                    setModeloAuditoria(resp.data.comlumn);
                    setDatosListar(resp.data.response.rows);

                    console.log(resp.data.column)
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
                            columnModal={columnModal}
                        />
            </Main.Spin>
        </Main.Layout>
        </>    
    );
});

export default MovDeAjustDeStock;