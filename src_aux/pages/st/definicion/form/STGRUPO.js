import React, { memo } from 'react';
import Main            from "../../../../components/utils/Main";
import DevExpressList  from '../../../../components/utils/ListViewNew/DevExtremeList';

const concepto = {}
const columnsListar = [  
    { ID: 'COD_GRUPO'   , label: 'Grupo'       , minWidth: 20   , align:'left'   , disable:true                 },
    { ID: 'DESC_GRUPO'  , label: 'Desc. Grupo' , minWidth: 800 , align:'left'   , requerido:true    , upper:true                 },
    { ID: 'ESTADO'      , label: 'Estado'      , minWidth: 100   , align:'center' , checkbox:true    , checkBoxOptions:["A","I"] },
];
var url_cod_grupo = '/st/stgrupo/cod_grupo/'+ sessionStorage.getItem('cod_empresa');
const columnModal           = {
    config:{
        auto:[
            {'COD_GRUPO': url_cod_grupo }
        ]
    },
};
const columBuscador         = 'DESC_GRUPO'
const doNotsearch           = ['ESTADO']
const notOrderByAccion      = ['']
const TituloList            = "Grupo";
var defaultOpenKeys         = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
var defaultSelectedKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STGRUPO'];
const FormName              = 'STGRUPO';

const ArticuloGrupo = memo(() => {

    const cod_empresa           =  sessionStorage.getItem('cod_empresa');
    const url_lista             = `/st/stgrupo/${cod_empresa}`;
    const url_buscador          = `/st/stgrupo/search`;
    const url_abm               = "/st/stgrupo";

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
                            defaultFocusColumn={1}
                        />
                  </Main.Spin>
            </Main.Layout>
        </>    
    );
});
export default ArticuloGrupo;