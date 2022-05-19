import React, { memo }    from 'react';
import Main               from '../../../../../components/utils/Main';
import _                  from "underscore";
import {Typography}       from 'antd';
import Search             from '../../../../../components/utils/SearchForm/SearchForm';
import {modifico}         from '../../../../../components/utils/SearchForm/Cancelar';
import {setModifico}      from '../../../../../components/utils/SearchForm/Cancelar';
import { Row, Col, Tabs } from "antd";
import DevExtremeDet,{ getFocusGlobalEventDet  , getFocusGlobalEventDetAux   , getComponenteEliminarDet     ,
                       getTipoDeOperacionesDet , getEstablecerOperacionesDet , ArrayPushHedSeled            ,
                       setArrayHedSeled        , ArrayDetecteComponent       , limpiarArrayDetecteComponent
}  from '../../../../../components/utils/DevExtremeGrid/DevExtremeDet';
// import { ValidarColumnasRequeridas }from "../../../../../components/utils/DevExtremeGrid/ValidarColumnasRequeridas";
import DataSource         from "devextreme/data/data_source";
import ArrayStore         from "devextreme/data/array_store";
import { v4 as uuidID }   from "uuid";

const FormName             = 'STCATEGO';
const defaultOpenKeys      = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
const defaultSelectedKeys  = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STCATEGO'];
const title                = 'Articulos - Segmentos'
const { Title }            = Typography;
const { TabPane }          = Tabs;
const doNotsearch_segmentacion   = ['ESTADO']
const columBuscador_segmentacion = 'COD_LINEA'

const doNotsearch_segmentacion_mercadologico_cab   = ['IND_AUTORIZA','IND_VITRINA','IND_MIX','ACTIVO']
const columBuscador_segmentacion_mercadologico_cab = 'DESCRIPCION'

// URL ABM
const url_abm_segmentacion       = "/st/stcatego/segmentacion"
// URL UTIMO COFIGO DE SEGMENTACION
const url_cod_segmentacion       = "/st/stcatego/cod_categorio/";
// URL UTIMO COFIGO DE MERCADOLOGICO
// const url_cod_mercadologico      = "/st/stcatego/cod_tip_cliente/";

// URL BUSCADOR
const url_segmentacion_buscador  = '/st/stcatego/segmentacion/search';
const url_mercadologico_buscador = '/st/stcatego/mercadologico/search';
// URL GET
const url_segmentacion = '/st/stcatego/'; 
const url_segmentacion_mercadologico_cab = '/st/stcatego/MercadologicoCab/'; 
const url_segmentacion_mercadologico_det = '/st/stcatego/MercadologicoDet/'; 
// URL MODAL F9
const url_buscar_categoria    = '/st/stcatego/buscar/categoria'
const url_valida_categoria    = '/st/stcatego/valida/categoria'

const url_buscar_segmentacion = '/st/stcatego/buscar/segmentacion'
const url_valida_segmentacion = '/st/stcatego/valida/segmentacion'

const columnModal_Segmentacion = {
    urlValidar : [ { COD_LINEA    : url_valida_categoria , }, ],
    urlBuscador: [ { COD_LINEA    : url_buscar_categoria , }, ],
    title      : [ { COD_LINEA    : "Categoría", }, ],
	COD_LINEA  : [ { ID: 'COD_LINEA'   , label: 'Categoria'    , width: 110      , align:'left'  }, 
                   { ID: 'DESC_LINEA'  , label: 'Descripción ' , minWidth: 70    , align:'left'  },
                 ],    
    config     :{},
};
const columnModal_seg_mercadologico_det = {
    urlValidar: [ {
                    COD_LINEA    : url_valida_categoria,
                    COD_CATEGORIA: url_valida_segmentacion,
                  },
                ],
    urlBuscador: [ {
                    COD_LINEA: url_buscar_categoria,
                    COD_CATEGORIA: url_buscar_segmentacion,
                   },
                ],
    title:      [ {
                    COD_LINEA: "Categoría",
                    COD_CATEGORIA: "Segmentación",
                  },
                ],
	COD_LINEA:  [  { ID: 'COD_LINEA'   , label: 'Categoria'    , width: 110      , align:'left'  },
    	           { ID: 'DESC_LINEA'  , label: 'Descripción ' , minWidth: 70    , align:'left'  },
                ],
    COD_CATEGORIA:[ { ID: 'COD_CATEGORIA'   , label: 'Segmentación' , width: 95      , align:'left'  },
                    { ID: 'DESC_CATEGORIA'  , label: 'Descripción ' , minWidth: 120  , align:'left'  },
                    { ID: 'COD_LINEA'       , label: 'Categoria'    , width: 95      , align:'left'  },
                  ],
    config:{
        COD_CATEGORIA:{
            depende_de:[
                {id: 'COD_LINEA',label: 'Categoría'},
            ],
            dependencia_de:[]   
        },
        COD_LINEA:{
            depende_de:[],
            dependencia_de:[
                {id: 'COD_CATEGORIA',label: 'Segmentación'},
            ]   
        },
		auto:[]
    },
};
const columns_segmentacion = [
    { ID: 'COD_LINEA'      , label: 'Categoria'               , width: 90      , align:'left'    , editModal:true, requerido:true},
    { ID: 'DESC_LINEA'     , label: 'Descripción'             , maxWidth: 100  , align:'left'    , disable:true  },
    { ID: 'COD_CATEGORIA'  , label: 'Segmentación'            , width: 115     , align:'left'    , disable:true  },
    { ID: 'DESC_CATEGORIA' , label: 'Descripción'             , maxWidth: 100  , align:'left'    , upper:true    },
    { ID: 'PESO'           , label: 'Peso'                    , width: 79      , align:'right'   , isnumber:true },
    { ID: 'ORDEN'          , label: 'Orden'                   , width: 77      , align:'right'   , isnumber:true },
    { ID: 'PORC_VTA1'      , label: '% Desc. Vta Cant Min'    , width: 180     , align:'right'   , isnumber:true },
    { ID: 'PORC_VTA2'      , label: '% Desc. Vta. UN. Básica' , width: 180     , align:'right'   , isnumber:true },
    { ID: 'ESTADO'         , label: 'Activo'                  , width: 45      , align:'left'    , checkbox:true  , checkBoxOptions:["A","I"], vertical:true},
];
const grupoRadio = ['PUNTO_EXTRA','AMBOS','GONDULA']
const columns_segmentacion_mercadologico_cab = [
    { ID: 'COD_TIP_CLIENTE' , label: 'Perfil MercadoLógico' , width: 230    , align:'left' , disable:true},
    { ID: 'DESCRIPCION'     , label: 'Descripción'          , maxWidth: 510 , align:'left' , disable:true},
    { ID: 'IND_AUTORIZA'    , label: 'Aut.'                 , width: 110    , align:'left' , checkbox:true , checkBoxOptions:["S","N"]},
    { ID: 'IND_VITRINA'     , label: 'Vitrina'              , width: 100    , align:'left' , checkbox:true , checkBoxOptions:["S","N"]},
    { ID: 'IND_MIX'         , label: 'Surt. Ef.'            , width: 110    , align:'left' , checkbox:true , checkBoxOptions:["S","N"]},
    { ID: 'ACTIVO'          , label: 'Activo'               , width: 100    , align:'left' , checkbox:true , checkBoxOptions:["S","N"]},
];
const columns_segmentacion_mercadologico_des = [
    { ID: 'COD_LINEA'      , label: 'Categoria'     , width: 80      , align:'left'   , editModal:true  , requerido:true, Pk:true},
    { ID: 'DESC_LINEA'     , label: 'Descripción'   , maxWidth: 200  , align:'left'   , disable:true   },
    { ID: 'COD_CATEGORIA'  , label: 'Segmentación'  , maxWidth: 150  , align:'left'   , editModal:true  , requerido:true, Pk:true},
    { ID: 'DESC_CATEGORIA' , label: 'Descripción'   , width: 210     , align:'left'   , disable:true   },
    { ID: 'ORDEN'          , label: 'Orden'         , width: 80      , align:'left'   , isnumber:true  },
    { ID: 'GONDULA'        , label:'Gondula'        , id_valor:"TIPO", width: 110     , align:'center'  , radio:true , valor:'G', grupoRadio:grupoRadio},
    { ID: 'PUNTO_EXTRA'    , label:'Punto Extra'    , id_valor:"TIPO", width: 100     , align:'center'  , radio:true , valor:'P', grupoRadio:grupoRadio},
    { ID: 'AMBOS'          , label:'Ambos'          , id_valor:"TIPO", width: 110     , align:'center'  , radio:true , valor:'A', grupoRadio:grupoRadio},
    { ID: 'ESTADO'         , label: 'Activo'        , width: 100     , align:'center' , checkbox:true   , checkBoxOptions:["A","I"]},
];

const notOrderByAccion = ['ESTADO']

var ArrayPushDelete      = {}
const limpiarArrayDelete = () =>{
  ArrayPushDelete = [];
}
var cancelarSegmentacion = '';
const getCancelarCancelarSegmentacion = ()=>{
	return cancelarSegmentacion;
}
var cancelarMercadologicoCab = '';
const getCancelarMercadologicoCab = ()=>{
	return cancelarMercadologicoCab;
}
var cancelarMercadologicoDet = '';
const getCancelarMercadologicoDet = ()=>{
	return cancelarMercadologicoDet;
}
var idComponente = 'SEGMENTACION'
const setIdComponente = (value)=>{
    idComponente = value;
}
const getIdComponente = ()=>{
    return idComponente;
}

var banSwitch   = false
var insert      = false
var eliminar    = false
var bandBloqueo = false
const setBandBloqueo =(e)=>{
    bandBloqueo = e;
}
const reiniciar_Inse_upda_elim =()=>{
    insert= false; eliminar= false;
}

const STCATEGO = memo(() => {

    const buttonSaveRef = React.useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    
    const initialrow_segmentacion_det = [
        { COD_TIPO        : "COD_TIPO"        },
        { COD_SUBTIPO     : "COD_SUBTIPO"     },
        { COD_TIP_CLIENTE : "COD_TIP_CLIENTE" },
        { TIPO            : 'A'  , valueDefault:true},
        { GONDULA         : 'A'  , valueDefault:true},
        { PUNTO_EXTRA     : 'A'  , valueDefault:true},
        { AMBOS           : 'A'  , valueDefault:true},
    ];
    const cod_empresa      = sessionStorage.getItem('cod_empresa');
    const cod_usuario      = sessionStorage.getItem('cod_usuario');
    // USEREF
    const gridSegmentacion             = React.useRef();
    const gridSegmentoMercadologicoCab = React.useRef();
    const gridSegmentoMercadologicoDet = React.useRef();

    const idGrid = {
        SEGMENTACION:gridSegmentacion,
        SEGMENTACION_MERCADOLOGICO_CAB:gridSegmentoMercadologicoCab,
        SEGMENTACION_MERCADOLOGICO_DET:gridSegmentoMercadologicoDet,
        defaultFocus:{
			SEGMENTACION_MERCADOLOGICO_CAB:0,
            SEGMENTACION_MERCADOLOGICO_DET:0,
        }
    }
    //STATE
    const [activarSpinner    , setActivarSpinner   ] = React.useState(false);
    const [tabKey		     , setTabKey	  	   ] = React.useState("1");
    
    //-----------------------Estado Modal mensaje ----------------------------------
    const [showMessageButton , setShowMessageButton] = React.useState(false)
    const [visibleMensaje	 , setVisibleMensaje   ] = React.useState(false);
    const [mensaje			 , setMensaje	       ] = React.useState();
    const [imagen			 , setImagen		   ] = React.useState();
    const [tituloModal		 , setTituloModal	   ] = React.useState();

    React.useEffect(async () => {
		getData();
        funcionCancelar(); 
    }, []);
    const showModalMensaje = (titulo, imagen, mensaje) => {
      setTituloModal(titulo);
      setImagen(imagen);
      setMensaje(mensaje);
      setVisibleMensaje(true);
    };
    // GET GENERICO
    const getInfo = async (url, method, data) => {
      var content = [];        
      try {
        var info = await Main.Request(url, method, data);
        if (info.data.rows) {
                content = info.data.rows;
        }
        return content;
      } catch (error) {
        console.log(error);
      }
    };
    const getData = async()=>{
        try {
            setActivarSpinner(true);
            var content = await getInfo(url_segmentacion+cod_empresa, "GET", []);    
        } catch (error) {
            console.log(error)
        }finally{
            setActivarSpinner(false);
        }
        if(content.length == 0){            
            var newKey = uuidID();
            content = [{
                ID	          : newKey,
                COD_EMPRESA   : cod_empresa,
                InsertDefault : true,
                IDCOMPONENTE  : "SEGMENTACION",
            }]
        }
        // setFocusIDComponent(gridSegmentacion,"SEGMENTACION")
        const dataSource_Segmentacion = new DataSource({
            store: new ArrayStore({
                data: content,
            }),
            key: 'ID'
        })
        gridSegmentacion.current.instance.option('dataSource', dataSource_Segmentacion);
        cancelarSegmentacion = JSON.stringify(content);
        setTimeout(()=>{
            gridSegmentacion.current.instance.focus(gridSegmentacion.current.instance.getCellElement(0,0))
        },180)
    }
    const addRow = async ()=>{
        insert = true
        var idComponente = getComponenteEliminarDet()
        var indexRow     = getFocusGlobalEventDet().rowIndex;
        if(idComponente.id == "SEGMENTACION_MERCADOLOGICO_CAB" || idComponente.id == "SEGMENTACION_MERCADOLOGICO_DET"){
            Main.message.info({
                content  : `No es posible agregar`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                    marginTop: '2vh',
                },
            });
            return
        } 
        modifico();
        let rowDet   = idGrid[idComponente.id].current.instance.getDataSource();
        if(rowDet._items.length == 0) indexRow = rowDet._items.length
        var id_cabecera = rowDet._items.length > 0 ? rowDet._items[0].idCabecera : newKey
        var newKey = uuidID();
        var row    = [0]
        row = [{
          ...row[0],
          ID          : newKey,
          inserted    : true,
          IDCOMPONENTE: idComponente.id,
          COD_EMPRESA : cod_empresa,
          COD_USUARIO : cod_usuario,
          idCabecera  : id_cabecera
        }];
        let rows    = rowDet._items;
        let content = rows.concat(rows.splice(indexRow, 0, ...row))
        const addNewRow = new DataSource({
            store: new ArrayStore({
                data: content,
            }),
            key: 'ID'
        })

        idGrid[idComponente.id].current.instance.option('dataSource', addNewRow);
        setTimeout(()=>{
            if(rowDet._items.length >= 0){
                    idGrid[idComponente.id].current.instance.focus(
                    idGrid[idComponente.id].current.instance.getCellElement(indexRow,0)
                );
            }
        },150);
    }
    const deleteRows = async ()=>{
        eliminar = true;
        var idComponente = getComponenteEliminarDet()
        var fila         = getFocusGlobalEventDet().rowIndex;
        var indexRow     = getFocusGlobalEventDet().rowIndex;
        //valida si tiene permiso para eliminar
        if(indexRow !== undefined){
            if(idComponente.id == "SEGMENTACION_MERCADOLOGICO_CAB"){
                Main.message.info({
                    content  : `No es posible eliminar`,
                    className: 'custom-class',
                    duration : `${2}`,
                    style    : {
                        marginTop: '2vh',
                    },
                });
                return
            } 
            if(indexRow == -1) indexRow =  0; 
            if(indexRow !== 0){
                indexRow = await indexRow -1;
            }
            var rowdelete = getFocusGlobalEventDetAux();
            
            var rowsInfo  = await idGrid[idComponente.id].current.instance.getDataSource()._items[fila];
            if(await _.isUndefined(rowsInfo.inserted) &&  await _.isUndefined(rowsInfo.InsertDefault)){
                modifico();
                rowsInfo.delete = true;
                rowsInfo.COD_EMPRESA = cod_empresa
                if( ArrayPushDelete[idComponente.id] !== undefined){
                    ArrayPushDelete[idComponente.id] = _.union(ArrayPushDelete[idComponente.id], [rowsInfo]);
                }else{
                  ArrayPushDelete[idComponente.id] = [rowsInfo];
                }
                await rowdelete.component.deleteRow(fila);
                idGrid[idComponente.id].current.instance.repaintRows([indexRow])
            }else{
                await rowdelete.component.deleteRow(fila);
                idGrid[idComponente.id].current.instance.repaintRows([indexRow])
                
            }
            setTimeout(()=>{
                var valor = idGrid[idComponente.id].current.instance.getDataSource()._items;
                if(valor.length >= 0){
                        idGrid[idComponente.id].current.instance.focus(
                        idGrid[idComponente.id].current.instance.getCellElement(indexRow,0)
                    )
                }
            },80);
        }
    }
    const guardar = async ()=>{
        setVisibleMensaje(false);
        let resultOperaciones = await permisos();
        if(resultOperaciones){
            // SEGMENTO
            var Segmentacion = [];
            if(gridSegmentacion.current != undefined){
                Segmentacion =  gridSegmentacion.current.instance.getDataSource()._items;
                gridSegmentacion.current.instance.saveEditData();
                gridSegmentacion.current.instance.repaintRows([0])
            } 
            var updateDependencia = [
                {'COD_LINEA': 'COD_LINEA_ANT'},
            ];

            // GENERAMOS EL PK AUTOMATICO 
            var info = await Main.GeneraUpdateInsertCab(Segmentacion,'COD_CATEGORIA', url_cod_segmentacion+cod_empresa, updateDependencia);
            var aux_segmentacion           = info.rowsAux;
            var update_insert_segmentacion = info.updateInsert;
            var delete_segmentacion        = ArrayPushDelete.SEGMENTACION != undefined ? ArrayPushDelete.SEGMENTACION : [];

            // SEGMENTO POR PERFIL MERCADOLOGICO
            var seg_MercadologicoCab = []
            if(gridSegmentoMercadologicoCab.current != undefined){
                seg_MercadologicoCab = gridSegmentoMercadologicoCab.current.instance.getDataSource()._items;
                gridSegmentoMercadologicoCab.current.instance.saveEditData();
                gridSegmentoMercadologicoCab.current.instance.repaintRows([0])
            }
            var info = await Main.GeneraUpdateInsertCab(seg_MercadologicoCab,'','', [],false);
            var aux_seg_MercadologicoCab            = info.rowsAux;
            var update_insert_seg_MercadologicoCab  = info.updateInsert;

            // SEGMENTO POR PERFIL MERCADOLOGICO DET
            var seg_MercadologicoDet = []
            if(gridSegmentoMercadologicoDet.current != undefined){
                seg_MercadologicoDet = gridSegmentoMercadologicoDet.current.instance.getDataSource()._items;
                gridSegmentoMercadologicoDet.current.instance.saveEditData();
                await gridSegmentoMercadologicoDet.current.instance.repaintRows([0])
            } 
            var updateDependencia_seg_merc_det = [
                {'COD_CATEGORIA':'COD_CATEGORIA_ANT'},
                {'COD_LINEA'    :'COD_LINEA_ANT'},
            ];
            var info = await Main.GeneraUpdateInsertCab(seg_MercadologicoDet,'','',updateDependencia_seg_merc_det,false);
            var aux_seg_MercadologicoDet            = info.rowsAux;
            var update_insert_seg_MercadologicoDet  = info.updateInsert;
            var delete_seg_MercadologicoDet         = ArrayPushDelete.SEGMENTACION_MERCADOLOGICO_DET != undefined ? ArrayPushDelete.SEGMENTACION_MERCADOLOGICO_DET : [];

            var AditionalData = [{"cod_usuario": cod_usuario,"cod_empresa":cod_empresa}];

            // return
            var data = { update_insert_segmentacion         ,
                         delete_segmentacion                ,
                         update_insert_seg_MercadologicoCab ,
                         update_insert_seg_MercadologicoDet ,
                         delete_seg_MercadologicoDet        ,
                         AditionalData
            }
            // VALIDADOR
            var datosValidar = {
                id:[{ 
                    SEGMENTACION:gridSegmentacion                              ,
                    SEGMENTACION_MERCADOLOGICO_DET:gridSegmentoMercadologicoDet,

                }],
                column:[{ 
                    SEGMENTACION:columns_segmentacion      , 		
                    SEGMENTACION_MERCADOLOGICO_DET: columns_segmentacion_mercadologico_des,
                }],
                datos:[{
                    SEGMENTACION:update_insert_segmentacion,
                    SEGMENTACION_MERCADOLOGICO_DET:update_insert_seg_MercadologicoDet,
                }]
            }
            const valor = await Main.ValidarColumnasRequeridas(datosValidar);
            if(valor) return;

            if( update_insert_segmentacion.length > 0          ||
                delete_segmentacion.length > 0                 ||
                //---------------------------------------------->
                update_insert_seg_MercadologicoCab.length > 0  ||
                //---------------------------------------------->
                update_insert_seg_MercadologicoDet.length > 0  ||
                delete_seg_MercadologicoDet.length > 0        
                ){
                setActivarSpinner(true);
                try {
                    var method = "POST"
                    await Main.Request(url_abm_segmentacion,method,data).then(async(response)=>{
                        var resp = response.data
                        if(resp.ret == 1){
                            Main.message.success({
								content  : `Procesado correctamente!!`,
								className: 'custom-class',
								duration : `${2}`,
								style    : {
								marginTop: '4vh',
								},
							});
                            // SEGMENTACION
                            if(gridSegmentacion.current != undefined){
                                const dataSource = new DataSource({
                                    store: new ArrayStore({
                                            keyExpr:"ID",
                                            data: aux_segmentacion
                                    }),
                                    key: 'ID'
                                })
                                gridSegmentacion.current.instance.option('dataSource', dataSource);
                                gridSegmentacion.current.instance.refresh();
                                cancelarSegmentacion = JSON.stringify(aux_segmentacion)
                            }
                            
                            //SEG_MERCADOLOGICO CAB
                            if(gridSegmentoMercadologicoCab.current != undefined){
                                const dataSource = new DataSource({
                                    store: new ArrayStore({
                                            keyExpr:"ID",
                                            data: aux_seg_MercadologicoCab
                                    }),
                                    key: 'ID'
                                })
                                gridSegmentoMercadologicoCab.current.instance.option('dataSource', dataSource);
                                gridSegmentoMercadologicoCab.current.instance.refresh();
                                cancelarMercadologicoCab = JSON.stringify(aux_seg_MercadologicoCab)
                            }

                            //SEG_MERCADOLOGICO DET
                            if(gridSegmentoMercadologicoDet.current != undefined){
                                const dataSource = new DataSource({
                                    store: new ArrayStore({
                                            keyExpr:"ID",
                                            data: aux_seg_MercadologicoDet
                                    }),
                                    key: 'ID'
                                })
                                gridSegmentoMercadologicoDet.current.instance.option('dataSource', dataSource);
                                gridSegmentoMercadologicoDet.current.instance.refresh();
                                cancelarMercadologicoDet = JSON.stringify(aux_seg_MercadologicoDet)
                            }

                            setModifico(); 
                            reiniciar_Inse_upda_elim(); 
                            getEstablecerOperacionesDet(); 
                            limpiarArrayDelete(); 
                            banSwitch = false;
                            setBandBloqueo(false)
                            limpiarArrayDetecteComponent()
                            setActivarSpinner(false);
                            setTimeout(()=>{
                                var indexRow     = getFocusGlobalEventDet().rowIndex;
                                var indexcolum   = getFocusGlobalEventDetAux();
                                
                                indexcolum = indexcolum.newColumnIndex ? indexcolum.newColumnIndex   : 0
                                indexRow   = (indexRow !== undefined && indexRow !== -1) ? indexRow  : 0
                                var idComponente = getComponenteEliminarDet()
                                var valor = idGrid[idComponente.id].current.instance.getDataSource()._items;
                                if(valor.length >= 0){
                                        idGrid[idComponente.id].current.instance.focus(
                                        idGrid[idComponente.id].current.instance.getCellElement(indexRow,indexcolum)
                                    );
                                }
                            },60);

                        }else{
							showModalMensaje('ERROR!','error', resp.p_mensaje);
                            setActivarSpinner(true);
						}
                    })                    
                } catch (error) {
                    console.log(error)
                }finally{                    
                    setActivarSpinner(false);
                }
            }else{
                setModifico();
                setVisibleMensaje(false)
                setBandBloqueo(false)
                Main.message.info({
                    content  : `No encontramos cambios para guardar`,
                    className: 'custom-class',
                    duration : `${2}`,
                    style    : {
                        marginTop: '2vh',
                    },
                });
            }
        }
    }
    const permisos = async ()=>{
        var update      = getTipoDeOperacionesDet()[1];
        var infoPermiso = await Main.VerificaPermiso(FormName);
        var band = true;
        var mensaje = ''

        if(insert){
            if(infoPermiso[0].insertar != 'S'){
              band = false;
              mensaje = 'No tienes permiso para insertar'
            }
        }
        if(update){
            if(infoPermiso[0].actualizar != 'S'){
                band = false;
                mensaje = 'No tienes permiso para actualizar'
            }
        }
        if(eliminar){
            if(infoPermiso[0].borrar != 'S'){
              band = false;
              mensaje = 'No tienes permiso para eliminar'
            }
        }
        if(!band){
            Main.message.warning({
                content  : mensaje,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                marginTop: '4vh',
                },
            });
        }
        return band
    }
    const handleChange = async(e)=>{
        var idComponente = await getIdComponente();
        var BuscadorRow = []
        var value = e.target.value;
        var url   = ''
        if(value.trim().length === 0){
            value = 'null';
        }
        if(idComponente == "SEGMENTACION" ){
            url = url_segmentacion_buscador
        }else{
            url = url_mercadologico_buscador
        }
        
        try {
            var method         = "POST";
            const cod_empresa  = sessionStorage.getItem('cod_empresa');        
            await Main.Request( url,method,{'value':value, 'cod_empresa': cod_empresa, filter:ArrayPushHedSeled })
                .then( response =>{
                    if( response.status == 200 ){
                      BuscadorRow = new DataSource({
                        store: new ArrayStore({
                            data: response.data.rows,
                        }),
                        key: 'ID'
                      }) 
                      idGrid[idComponente].current.instance.option('dataSource', BuscadorRow);
                    }
                setTimeout(()=>{
                    idGrid[idComponente].current.instance.option('focusedRowIndex', 0);
                },70)
            });
        } catch (error) {
            console.log(error);
        }
    }
    const manageTabs = async (value)=>{
        switch (value) {
            case "1":
                setIdComponente("SEGMENTACION");
                if(gridSegmentacion.current.instance.getDataSource()._items){
                    setTimeout(()=>{
                        gridSegmentacion.current.instance.focus(gridSegmentacion.current.instance.getCellElement(0,0))
                    },100)
                }
                setArrayHedSeled(columBuscador_segmentacion);
                break;
            case "2":
                setIdComponente("SEGMENTACION_MERCADOLOGICO_CAB");
                if(!banSwitch){
                    try {
                        setActivarSpinner(true);
                        var content = await getInfo(url_segmentacion_mercadologico_cab+cod_empresa, "GET", []);
                    } catch (error) {
                        console.log(error)
                    }finally{
                        setActivarSpinner(false);
                    }
                    
                    if(content.length == 0){
                        var newKey = uuidID();
                        content = [{
                            ID	          : newKey,
                            COD_EMPRESA   : cod_empresa,
                            InsertDefault : true,
                            IDCOMPONENTE  : "SEGMENTACION_MERCADOLOGICO_CAB",
                        }]
                    }
                    const dataSource_Segmentacion = new DataSource({
                        store: new ArrayStore({
                                data: content,
                        }),
                        key: 'ID'
                    })
                    gridSegmentoMercadologicoCab.current.instance.option('dataSource', dataSource_Segmentacion);
                    cancelarMercadologicoCab = JSON.stringify(content);
                    setTimeout(()=>{
                        gridSegmentoMercadologicoCab.current.instance.focus(gridSegmentoMercadologicoCab.current.instance.getCellElement(0,0))
                    },90)
                    banSwitch = true
                }
                setArrayHedSeled(columBuscador_segmentacion_mercadologico_cab);
            break;
            default:
                break;
        }
    }
    const handleTabChange = (value) => {
		setTabKey(value);
		manageTabs(value);
	}
    const funcionCancelar = async (filaIndex)=>{
        var idComponente = getComponenteEliminarDet()
        var indexRow     = filaIndex;
        if(getFocusGlobalEventDet()) indexRow = getFocusGlobalEventDet().rowIndex
  
        if(getCancelarCancelarSegmentacion()){
			var AuxDataCancelarSegmentacion  = await JSON.parse(await getCancelarCancelarSegmentacion());
			if(AuxDataCancelarSegmentacion.length > 0){
				const dataSource_segmentacion = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelarSegmentacion
					}),
					key: 'ID'
				})
				gridSegmentacion.current.instance.option('dataSource', dataSource_segmentacion);
				cancelarSegmentacion = JSON.stringify(AuxDataCancelarSegmentacion);
			}
		}
        if(getCancelarMercadologicoCab()){
            var AuxDataCancelarMercadologicoCab = await JSON.parse(await getCancelarMercadologicoCab());
			if(AuxDataCancelarMercadologicoCab.length > 0){
				const dataSource_mercadologicoCab = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelarMercadologicoCab
					}),
					key: 'ID'
				})
				if(gridSegmentoMercadologicoCab.current) {
                    gridSegmentoMercadologicoCab.current.instance.option('dataSource', dataSource_mercadologicoCab);
                }
				cancelarMercadologicoCab = JSON.stringify(AuxDataCancelarMercadologicoCab);
			}
        }
        if(getCancelarMercadologicoDet()){
            var AuxDataCancelarMercadologicoDet  = await JSON.parse(await getCancelarMercadologicoDet());
			if(AuxDataCancelarMercadologicoDet.length > 0){
				const dataSource_mercadologicoDet = new DataSource({
					store: new ArrayStore({
					  keyExpr:"ID",
					  data: AuxDataCancelarMercadologicoDet
					}),
					key: 'ID'
				})
                if(gridSegmentoMercadologicoDet.current){
                    gridSegmentoMercadologicoDet.current.instance.option('dataSource', dataSource_mercadologicoDet);
                }
                cancelarMercadologicoDet = JSON.stringify(AuxDataCancelarMercadologicoDet);
			}
        }
        banSwitch= false
        reiniciar_Inse_upda_elim();
        getEstablecerOperacionesDet();
        setActivarSpinner(true)
        limpiarArrayDelete();
        limpiarArrayDetecteComponent();
        setBandBloqueo(false);
        setTimeout(()=>{
            if(idGrid[idComponente.id]?.current){
                setModifico();
                setActivarSpinner(false);
                var valor = idGrid[idComponente.id].current.instance.getDataSource()._items;
                if(valor.length >= 0){
                        idGrid[idComponente.id].current.instance.focus(
                        idGrid[idComponente.id].current.instance.getCellElement(indexRow,0)
                    )
                }
            }
        },30);
        
    }
    const handleCancel = async() => {
		setVisibleMensaje(false);
        if(showMessageButton){
            funcionCancelar();
        }		
	};
    const setRowFocusDet = async(e)=>{
        var content = []
        if(!bandBloqueo){
            if(e.row){
                content = await Main.Request(url_segmentacion_mercadologico_det+cod_empresa, "POST", {'COD_TIP_CLIENTE':e.row.data.COD_TIP_CLIENTE});
                if(content.data.rows.length == 0){
                    var newKey = uuidID();
                    content = [{
                        ID	           : newKey,
                        COD_EMPRESA    : cod_empresa,
                        TIPO           : 'A' ,
                        GONDULA        : 'A' ,
                        PUNTO_EXTRA    : 'A' ,
                        AMBOS          : 'A' ,
                        idCabecera     : e.row.data.ID,
                        IDCOMPONENTE   : "SEGMENTACION_MERCADOLOGICO_DET",
                        InsertDefault  : true,
                        COD_TIP_CLIENTE: e.row.data.COD_TIP_CLIENTE ? e.row.data.COD_TIP_CLIENTE : '',
                        COD_TIPO       : e.row.data.COD_TIPO        ? e.row.data.COD_TIPO        : '',
                        COD_SUBTIPO    : e.row.data.COD_SUBTIPO     ? e.row.data.COD_SUBTIPO     : '',
                    }]
                }else{
                    content = content.data.rows
                }
                const dataSource_Segmentacion_det = new DataSource({
                    store: new ArrayStore({
                        data: content,
                    }),
                    key: 'ID'
                })
                gridSegmentoMercadologicoDet.current.instance.option('dataSource', dataSource_Segmentacion_det);
                cancelarMercadologicoDet = JSON.stringify(content)
            }else{
                const dataSource_Segmentacion_det = new DataSource({
                    store: new ArrayStore({
                        data: content,
                    }),
                    key: 'ID'
                })
                gridSegmentoMercadologicoDet.current.instance.option('dataSource', dataSource_Segmentacion_det);
                cancelarMercadologicoDet = JSON.stringify(content);
            }  
        }
    }
    const setFocusedRowChanged = (e)=>{
        if(ArrayDetecteComponent['SEGMENTACION_MERCADOLOGICO_DET'] || ArrayPushDelete['SEGMENTACION_MERCADOLOGICO_DET']){
            setBandBloqueo(true);
            gridSegmentoMercadologicoCab.current.instance.option("focusedRowKey", 120);
            gridSegmentoMercadologicoCab.current.instance.clearSelection();
            gridSegmentoMercadologicoCab.current.instance.focus(0);            
            setShowMessageButton(true);
            showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
        }
    }

    return (
        <>
        	<Main.ModalDialogo
				positiveButton={showMessageButton ? "SI" : ""  }
				negativeButton={showMessageButton ? "NO" : "OK"}
				positiveAction={showMessageButton ? guardar : null}
				negativeAction={handleCancel}
				onClose={handleCancel}
				setShow={visibleMensaje}
				title={tituloModal}
				imagen={imagen}
				mensaje={mensaje}
			/>
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${title}`} />
            <Main.Spin size="large" spinning={activarSpinner} >
                <div className="paper-header">
                    <Title level={5} className="title-color">
                        {title}
                        <div>
                            <Title level={4} style={{ float: 'right', marginTop: '-16px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</Title>
                        </div>
                    </Title>
                </div>
                <div className='paper-container'>
                    <Main.Paper className="paper-style">
                        <Search
                            addRow={addRow}
                            eliminarRow={deleteRows}
                            cancelarProceso={funcionCancelar}
                            formName={FormName}
                            guardarRow={guardar}
                            handleChange={handleChange}
                            buttonGuardar={buttonSaveRef}
                        />
                        <div style={{padding:'10px'}}>
                            <Tabs 
                                activeKey={tabKey}
                                onChange={handleTabChange}
                                type="card"
                                size={"small"}>
                                    <TabPane tab="Segmentación" key="1">
                                        <DevExtremeDet
                                            gridDet={gridSegmentacion}
                                            id="SEGMENTACION"
                                            IDCOMPONENTE="SEGMENTACION"
                                            columnDet={columns_segmentacion}
                                            notOrderByAccion={notOrderByAccion}												
                                            FormName={FormName}
                                            guardar={guardar}
                                            newAddRow={false}
                                            deleteDisable={false}
                                            columnModal={columnModal_Segmentacion}
                                            activateF10={false}
                                            setActivarSpinner={setActivarSpinner}
                                            altura={'510px'}
                                            doNotsearch={doNotsearch_segmentacion}
                                            columBuscador={columBuscador_segmentacion}
                                        />
                                    </TabPane>
                                    <TabPane tab="Segmentación por Perfil Mercadologico" key="2">
                                        <Row gutter={[16, 24]}>
                                            <Col span={24}>
                                              <DevExtremeDet
                                                    gridDet={gridSegmentoMercadologicoCab}
                                                    id="SEGMENTACION_MERCADOLOGICO_CAB"
                                                    IDCOMPONENTE="SEGMENTACION_MERCADOLOGICO_CAB"
                                                    columnDet={columns_segmentacion_mercadologico_cab}
                                                    notOrderByAccion={notOrderByAccion}												
                                                    FormName={FormName}
                                                    guardar={guardar}
                                                    deleteDisable={false}
                                                    setRowFocusDet={setRowFocusDet}
                                                    setFocusedRowChanged={setFocusedRowChanged}
                                                    activateF10={false}
                                                    newAddRow={false}
                                                    canDelete={false}
                                                    setActivarSpinner={setActivarSpinner}
                                                    altura={'190px'}
                                                    doNotsearch={doNotsearch_segmentacion_mercadologico_cab}
                                                    columBuscador={columBuscador_segmentacion_mercadologico_cab}
                                                />
                                            </Col>
                                            <Col span={24}>
                                                <DevExtremeDet
                                                    gridDet={gridSegmentoMercadologicoDet}
                                                    id="SEGMENTACION_MERCADOLOGICO_DET"
                                                    IDCOMPONENTE="SEGMENTACION_MERCADOLOGICO_DET"
                                                    columnDet={columns_segmentacion_mercadologico_des}
                                                    initialRow={initialrow_segmentacion_det}
                                                    notOrderByAccion={[]}												
                                                    FormName={FormName}
                                                    guardar={guardar}
                                                    deleteDisable={true}
                                                    newAddRow={true}
                                                    columnModal={columnModal_seg_mercadologico_det}
                                                    altura={'310px'}
                                                />  
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Main.Paper>
                    </div>
                </Main.Spin>
            </Main.Layout>
        </>
    );
});

export default STCATEGO;