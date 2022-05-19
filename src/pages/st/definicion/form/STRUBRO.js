import React, { memo } from 'react';
import Main            from "../../../../components/utils/Main";
import DevExpressList  from '../../../../components/utils/ListViewNew/DevExtremeList';
 
const concepto = {}
const columnsListar = [
    { ID: 'COD_RUBRO'   , label: 'Rubro'       , minWidth: 20   , align:'left'   , disable:true    , isnumber:true},
    { ID: 'DESC_RUBRO'  , label: 'Desc. Rubro' , minWidth: 900  , align:'left'   , requerido:true  , upper:true                 },
    { ID: 'ORDEN'       , label: 'Nro. Orden'  , minWidth: 40   , align:'center' , requerido:true },
    { ID: 'ESTADO'      , label: 'Estado'      , minWidth: 40   , align:'center' , checkbox:true   , checkBoxOptions:["A","I"] },
];
var url_cod_rubro = '/st/strubro/cod_rubro';

const columBuscador         = 'DESC_RUBRO'
const doNotsearch           = ['ESTADO']
const notOrderByAccion      = ['']
const TituloList            = "Rubro";
var defaultOpenKeys         = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
var defaultSelectedKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STRUBRO'];
const FormName              = 'STRUBRO';
const columnModal           = {
    config:{
        auto:[
            {'COD_RUBRO': url_cod_rubro }
        ]
    },
};
const ArticuloRubro = memo(() => {

    const cod_empresa           =  sessionStorage.getItem('cod_empresa');
    const url_lista             = `/st/strubro/${cod_empresa}`;
    const url_buscador          = `/st/strubro/search`;
    const url_abm               = "/st/strubro";

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
                            defaultFocusColumn={1}
                            height={500}
                        />
            </Main.Spin>
        </Main.Layout>
        </>    
    );
});
export default ArticuloRubro;