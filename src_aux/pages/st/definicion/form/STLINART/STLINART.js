import React, { memo }      from 'react';
import Main                 from '../../../../../components/utils/Main';
import DevExtremeList       from '../../../../../components/utils/ListViewNew/DevExtremeList';
import './STLINART.css'
import {Input,  Row,  Col}  from 'antd';
import _                    from 'underscore';

var url_cod_linea            = '/st/stlinart/cod_linea';

var url_buscar_unidadNegocio = '/st/stlinart/buscar/undidaNegocio';
var url_valida_unidadNegocio = '/st/stlinart/valida/undidaNegocio';

var url_buscar_brandManager = '/st/stlinart/buscar/brandManager'  ;
var url_valida_brandManager = '/st/stlinart/valida/brandManager'  ;

var url_buscar_marca        = '/st/stlinart/buscar/marcas'        ;
var url_valida_marca        = '/st/stlinart/valida/marcas'        ;

var url_buscar_centroCosto  = '/st/stlinart/buscar/centroCostos'  ;
var url_valida_centroCosto  = '/st/stlinart/valida/centroCostos'  ;

const columnModal ={ 
    urlValidar:[
        {  
            COD_UNID_NEGOCIO : url_valida_unidadNegocio,
            COD_MODULO       : url_valida_brandManager ,
            COD_MARCA        : url_valida_marca,
            COD_CENTRO       : url_valida_centroCosto
        }
    ],
    urlBuscador:[
        {
            COD_UNID_NEGOCIO : url_buscar_unidadNegocio,
            COD_MODULO       : url_buscar_brandManager,
            COD_MARCA        : url_buscar_marca,
            COD_CENTRO       : url_buscar_centroCosto
        }
    ],
    title:[
        {
            COD_UNID_NEGOCIO : 'Unidad Negocio',
            COD_MODULO       : 'Brand Manager',
            COD_MARCA        : 'Marca',
            COD_CENTRO       : 'Centro Costos' 
        }
    ],
    COD_UNID_NEGOCIO:[
        { ID: 'COD_UNID_NEGOCIO'   , label: 'Undidad Negocio', width:190      , align: 'left' },
        { ID: 'DESC_UNID_NEGOCIO'  , label: 'Descripcion'    , minWidth: 250  , align: 'left' },
    ],
    COD_MODULO:[
        { ID: 'COD_MODULO'         , label: 'Brand'          , width: 150     , align: 'left' },
        { ID: 'DESC_MANAGER'       , label: 'Descripcion'    , minWidth: 250  , align: 'left' },
    ],
    COD_MARCA:[
        { ID: 'COD_MARCA'          , label: 'Marca'          , width: 150     , align: 'left' },
        { ID: 'DESC_MARCA'         , label: 'Descripcion'    , minWidth: 250  , align: 'left' },
    ],
    COD_CENTRO:[
        { ID: 'COD_CENTRO'         , label: 'Centro'         , width: 150     , align: 'left' },
        { ID: 'DESC_CENTRO_COSTOS' , label: 'Descripcion'    , minWidth: 250  , align: 'left' },
    ],
    config:{
        auto:[
            {'COD_LINEA': url_cod_linea }
        ]
    },
}
const concepto = {}
var arraykeyRadio = [
        {descripcion1:'Activo'  ,key:'A'},
        {descripcion2:'Inactivo',key:'I'}
]
// right
const columnsListar = [
    { ID: 'COD_UNID_NEGOCIO' , label: 'Und N.'   , minWidth: 30  , align:'left'   , editModal:true , requerido:true, vertical:true},
    { ID: 'DESC_UNID_NEGOCIO', label: 'Desc.'    , minWidth: 70  , align:'left'   , disable:true  },
    { ID: 'COD_MODULO'       , label: 'Brand'    , minWidth: 40  , align:'left'   , editModal:true , requerido:true, vertical:true},    
    { ID: 'DESC_MANAGER'     , label: 'Mnger'    , minWidth: 70  , align:'left'   , disable:true  }, 
    { ID: 'COD_MARCA'        , label: 'Marca'    , minWidth: 40  , align:'left'   , editModal:true , requerido:true, vertical:true},
    { ID: 'DESC_MARCA'       , label: 'Desc.'    , minWidth: 76  , align:'left'   , disable:true  },
    { ID: 'COD_LINEA'        , label: 'Categ.'   , minWidth: 40  , align:'left'   , disable:true   , isnumber:true},
    { ID: 'DESCRIPCION'      , label: 'Desc.'    , minWidth: 76  , align:'left'   , upper:true     , requerido:true},
    { ID: 'COD_CENTRO'       , label: 'Centro'   , minWidth: 63  , align:'right'  , editModal:true},
    { ID: 'PORC_COSTO'       , label: '%Cost'    , minWidth: 63  , align:'right'  , isnumber:true },
    { ID: 'PORC_MARGEN'      , label: '%Marg'    , minWidth: 63  , align:'right'  , isnumber:true },
    { ID: 'PORC_TRANS'       , label: '%trns'    , minWidth: 63  , align:'right'  , isnumber:true },
    { ID: 'MARG_UTIL'        , label: '%Util'    , minWidth: 63  , align:'right'  , isnumber:true },
    { ID: 'NRO_ORDEN'        , label: 'Ord.'     , minWidth: 65  , align:'center' , isnumber:true },
    { ID: 'CARGA_META'       , label: 'Meta'     , minWidth: 30  , align:'left'   , checkbox:true  , checkBoxOptions:["S","N"] , vertical:true},
    { ID: 'AC_COMERCIAL'     , label: 'Ac.'      , minWidth: 30  , align:'left'   , checkbox:true  , checkBoxOptions:["S","N"] , vertical:true},
    { ID: 'ESTADO'           , label: 'Act.'     , minWidth: 30  , align:'left'   , checkbox:true  , checkBoxOptions:["A","I"] , vertical:true},
];

const columBuscador        = 'DESC_UNID_NEGOCIO'
const doNotsearch          = ['CARGA_META','AC_COMERCIAL','IND_EGONDOLA','ESTADO','NRO_ORDEN','MARG_UTIL','PORC_TRANS','PORC_MARGEN','PORC_COSTO','COD_CENTRO','COD_UNID_NEGOCIO','COD_MARCA','COD_MODULO']
const notOrderByAccion     = ['ESTADO']

const TituloList           = "Artículos - Categorías";
var defaultOpenKeys        = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
var defaultSelectedKeys    = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STLINART'];
const FormName             = 'STLINART';

const Art_categoria = memo(() => {

    const [ datosListar      , setDatosListar     ] = React.useState([]);
    const [ modeloAuditoria  , setModeloAuditoria ] = React.useState([]);
    const [ activarSpinner   , setActivarSpinner  ] = React.useState(false);
    const [ valueRadio       , setValueRadio      ] = React.useState('A');
    
    const inputRef           = React.useRef();
    const cod_empresa        = sessionStorage.getItem('cod_empresa');
    const url_lista          = `/st/stlinart/list/${cod_empresa}`;
    const url_abm            = "/st/stlinart";
    const url_buscador       = `/st/stlinart/search/${valueRadio}`;

    const onChange = (e)=>{  
        getData(e.target.value);
        setValueRadio(e.target.value);
    };
    React.useEffect(()=>{
        if(datosListar.length === 0){
            getData('A');
        }
    },[])
    const getData = async(estado) =>{
        try {
            var url     = `${url_lista}`;
            var method  = "POST";
            var data    = {ESTADO:estado}
            await Main.Request( url,method,data)
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
    const focusRowchange = (e,f9,row)=>{
        if(f9){
            inputRef.current.input.value = row['DESC_CENTRO_COSTOS']
        }else if(e.row){
            if(e.row.data['DESC_CENTRO_COSTOS']){
                inputRef.current.input.value = e.row.data['DESC_CENTRO_COSTOS']    
            }else{
                inputRef.current.input.value = "";    
            }
        }else{
            inputRef.current.input.value = "";
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
                            modeloAuditoria={modeloAuditoria}
                            // --------
                            sizePagination={15}
                            height={455}
                            rowFocus={focusRowchange}
                            activateheadRadio={true}
                            arraykeyRadio={arraykeyRadio}
                            valueState={valueRadio}
                            accionChange={onChange}
                        />       
                    <div className="hrDevExtreme" >
                        <Row style={{padding:'5px'}} >                        
                            <label className="labelArt_Categoria">Centro:</label>
                            <Col span={5} style={{padding:0}} >
                                <Input 
                                    ref={inputRef}
                                    disabled={true}
                                    autoComplete="off"
                                    className="inputArticuloCate"
                                />
                            </Col>
                        </Row>
                    </div>
             </Main.Spin>
        </Main.Layout>
    );
});

export default Art_categoria;