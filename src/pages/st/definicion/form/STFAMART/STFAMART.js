import React, { memo } from 'react';
import Main            from "../../../../../components/utils/Main";
import DevExpressList  from '../../../../../components/utils/ListViewNew/DevExtremeList';
import {Input,  Row,  Col}  from 'antd';
import './STFAMART.css';
var url_valida_rubro = '/st/stfamilia/valida/validaRubro'
var url_buscar_rubro = '/st/stfamilia/buscar/buscarRubro'
var url_cod_familia  = '/st/stfamilia/cod_familia';

const concepto = {}

const columnModal = {
    urlValidar :[ { COD_RUBRO : url_valida_rubro } ],
    urlBuscador:[ { COD_RUBRO : url_buscar_rubro } ],
    title      :[ { COD_RUBRO :'Rubro'           } ],
    COD_RUBRO:[
        { ID: 'COD_RUBRO'  , label: 'Rubro'      , minWidth: 10  , align: 'left' },
        { ID: 'DESC_RUBRO' , label: 'Descripción', minWidth: 350 , align: 'left' },
    ],
    config:{
		auto:[
            {'COD_FAMILIA': url_cod_familia }
        ]
	},
}
const columnsListar = [
    { ID: 'COD_FAMILIA' , label: 'Familia'       , minWidth: 20  , align:'left'    , disable:true      , isnumber: true             },
    { ID: 'DESCRIPCION' , label: 'Desc. Familia' , minWidth: 400 , align:'left'    , requerido:true    , upper:true                 },
    { ID: 'COD_RUBRO'   , label: 'Rubro'         , minWidth: 20   , align:'left'   , editModal:true    , requerido:true , upper:true},
    { ID: 'DESC_RUBRO'  , label: 'Desc. Rubro'   , minWidth: 450  , align:'left'   , disable:true      , requerido:true , upper:true},
    { ID: 'ORDEN'       , label: 'Orden'         , minWidth: 90   , align:'center' , requerido:true   },
    { ID: 'ESTADO'      , label: 'Estado'        , minWidth: 40   , align:'center' , checkbox:true     , checkBoxOptions:["S","N"] },
    
];

const columBuscador         = 'DESCRIPCION'
const doNotsearch           = ['ESTADO']
const notOrderByAccion      = ['']
const TituloList            = "Familia";
var defaultOpenKeys         = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
var defaultSelectedKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STFAMART'];
const FormName              = 'STFAMART';
const defaultFocusColumn    = 1; 

const ArticuloFamilia = memo(() => {
    const cod_empresa         =  sessionStorage.getItem('cod_empresa');
    const url_lista           = `/st/stfamilia/${cod_empresa}`;
    const url_buscador        = `/st/stfamilia/search`;
    const url_abm             = "/st/stfamilia";
    const inputRef           = React.useRef();
    
    const [ datosListar      , setDatosListar     ] = React.useState([]);
    const [ modeloAuditoria  , setModeloAuditoria ] = React.useState([]);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(true);
  
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
    const focusRowchange =async(e,f9,row)=>{
        if(f9){
            inputRef.current.input.value = row['DESC_RUBRO']
        }else if(e.row){
            if(e.row.data['DESC_RUBRO']){                
                inputRef.current.input.value = e.row.data['DESC_RUBRO']
            }else{
                inputRef.current.input.value = "";    
            }
        }else{
            inputRef.current.input.value = "";
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
                            //posicion por defecto
                            defaultFocusColumn={defaultFocusColumn}
                            rowFocus={focusRowchange}
                        />
                        <div className="hrDevExtreme" >
                            <Row style={{padding:'5px'}} >                        
                                <label className="labelArt_Familia">Rubro: </label>
                                <Col span={5} style={{padding:0}} >
                                    <Input
                                        ref={inputRef}
                                        disabled={true}
                                        autoComplete="off"
                                        className="inputArticuloFamilia"
                                    />
                                </Col>
                            </Row>
                        </div>
                </Main.Spin>
            </Main.Layout>
        </>    
    );
});

export default ArticuloFamilia; 