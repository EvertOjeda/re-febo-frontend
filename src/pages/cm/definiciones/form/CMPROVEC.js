import React, { memo }               from 'react';
import Main                          from '../../../../components/utils/Main';
import _                             from "underscore";
import {Card, Grid, Typography}      from 'antd';
import Search                        from '../../../../components/utils/SearchForm/SearchForm';
import {setModifico,modifico}        from '../../../../components/utils/SearchForm/Cancelar';
import { ValidarColumnasRequeridas } from '../../../../components/utils/DevExtremeGrid/ValidarColumnasRequeridas';
import { Menu, DireccionMenu }       from '../../../../components/utils/FocusDelMenu';
import DataSource                    from "devextreme/data/data_source";
import ArrayStore                    from "devextreme/data/array_store";
import { v4 as uuidID }              from "uuid";
import DevExtremeDet,{ getFocusGlobalEventDet , getComponenteEliminarDet , ArrayPushHedSeled ,
                       getFocusedColumnName   , getRowIndex , getComponenteFocusDet
}                                                      from '../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import { Row, Col, Checkbox,Form, Input, Select, Tabs} from "antd";
import ValidarCamposRequeridos,{QuitarClaseRequerido}  from '../../../../components/utils/ValidarCamposRequeridos';

var DeleteForm = []
const LimpiarDelete = () =>{
    DeleteForm = [];
}
var idComponente = 'CMPROVEC_CONT'
const setIdComponente = (value)=>{
    idComponente = value;
}
const getIdComponente = ()=>{
    return idComponente;
}
var cancelar_Cab = '';
const getCancelar_Cab = ()=>{
	return cancelar_Cab;
}
var cancelar_Det = '';
const getCancelar_Det = ()=>{
	return cancelar_Det;
}
var cancelar_Cont = '';
const getCancelar_Cont = ()=>{
	return cancelar_Cont;
}
//validate
const url_valida_cod_persona = '/cm/cmprovec/valida/persona'
//Buscar
const url_buscar_cod_persona = '/cm/cmprovec/buscar/persona'

const columnModal = {
    urlValidar : [  { COD_PERSONA: url_valida_cod_persona, }, ],
    urlBuscador: [  { COD_PERSONA: url_buscar_cod_persona, }, ],
    title      : [  { COD_PERSONA: "Personas"           }, ],
    COD_PERSONA: [
                    { ID: 'COD_PERSONA'   , label: 'Codigo'      , width: 90     , align:'left' },
                    { ID: 'DESC_PERSONA'  , label: 'Descripción' , maxWidth: 100 , align:'left' },
                    ],
    config:{}
}
const concepto    = {
    TIP_FLETE:  [    
        { ID:'N' , NAME:'Ninguno' , isNew:true}, 
        { ID:'C' , NAME:'C.I.F'  }, 
        { ID:'F' , NAME:'F.O.B'  }, 
    ],
}
const columns_cab = [
    { ID: 'COD_PROVEEDOR'        , label: 'código'        , width: 90      , align:'left'         , disable:true  },
    { ID: 'COD_PERSONA'          , label: 'Persona'       , width: 100     , align:'left'         , editModal:true , requerido:true},
    { ID: 'DESC_PERSONA'         , label: 'Nombre'        , maxWidth: 115  , align:'left'         , disable:true  },
    { ID: 'TIP_FLETE'            , label: 'Tip.Flete'     , width: 100     , isOpcionSelect:true },
    { ID: 'NRO_TIMBRADO'         , label: 'Timbrado'      , width: 115     , align:'right'       },
    { ID: 'VENCIMIENTO_TIMBRADO' , label: 'Vencimiento'   , width: 115     , align:'left'         ,  isdate:true},
    { ID: 'NRO_INICIAL'          , label: 'Nro Inicial'   , width: 115     , align:'right'        ,  },
    { ID: 'NRO_FINAL'            , label: 'Nro Final'     , width: 115     , align:'right'        ,  },
    { ID: 'ESTADO'               , label: 'Activo'        , width: 45      , align:'left'         , checkbox:true  , checkBoxOptions:["A","I"], vertical:true},
];
const notOrderByAccion  = ['COD_PROVEEDOR','COD_PERSONA','DESC_PERSONA','NRO_TIMBRADO','VENCIMIENTO_TIMBRADO','NRO_INICIAL','NRO_FINAL','ESTADO','TIP_FLETE']
const doNotsearch_cab   = ['ESTADO','TIP_FLETE']
const columBuscador_cab = 'COD_PROVEEDOR'
const columns_det = [
    { ID: 'DESC_PROVEEDOR' , label: 'Proveedor(Descripción)'  , maxWidth: 180  , align:'left'   } ,
    { ID: 'COD_PROVEEDOR'  , label: 'Codigo'                  , width: 150     , align:'left'   } ,
    { ID: 'NRO_CNPJ'       , label: 'Número CNPJ'             , width: 150     , align:'left'   } ,
    { ID: 'DESCRIPCION'    , label: 'Descripción'             , maxWidth: 180  , align:'left'     , upper:true   },
];
const notOrderByAccion_det  = ['COD_PROVEEDOR','NRO_CNPJ','DESCRIPCION']
const doNotsearch_cab_det   = ['DESC_PROVEEDOR','COD_PROVEEDOR','NRO_CNPJ','DESCRIPCION']
const columns_contacto = [
    { ID: 'NOM_CONTACTO'   , label: 'Nombre'   , maxWidth: 180  , align:'left'   ,requerido:true},
    { ID: 'ASUNTO'         , label: 'Asunto'   , width: 200     , align:'left'  },
    { ID: 'CARGO'          , label: 'Cargo'    , width: 200     , align:'left'  },
    { ID: 'TELEFONO'       , label: 'Teléfono' , maxWidth: 180  , align:'left'   , upper:true   },
];
const notOrderByAccion_cont  = ['NOM_CONTACTO','ASUNTO','CARGO','TELEFONO']
const doNotsearch_cab_cont   = ['NOM_CONTACTO','ASUNTO','CARGO','TELEFONO']
const FormName           = 'CMPROVEC';
const title              = 'Proveedores';
const { Title }          = Typography;
const { TabPane }        = Tabs;
//URL ABM
const url_abm            = '/cm/cmprovec'
//URL CABCERA
const url_getcabecera    = '/cm/cmprovec_cab/';
//URL GET COD PROVEEDOR
const url_getCodProvec   = '/cm/cmprovec_cab_cod/';
//URL GET COD CONTACTO  
const url_getCodContacto = '/cm/cmprovec_det_cod';
//URL DETALLE
const url_getDetalle     = '/cm/cmprovec_det';
//URL CONTACT
const url_getContacto    = '/cm/cmprovec_cont';

//URL VALIDADORES
const url_validar_cuenta_contable  = '/cm/cmprovec/valida/cuentaContable' ;
const url_validar_provPrincipal    = '/cm/cmprovec/valida/provPrincipal'  ;
const url_validar_cuenta_cont      = '/cm/cmprovec/valida/cuentaCont'     ;
const url_validar_rubro            = '/cm/cmprovec/valida/rubro'          ;
const url_validar_condicion_compra = '/cm/cmprovec/valida/condicionCompra';
const url_validar_moneda           = '/cm/cmprovec/valida/moneda'         ;
const url_validar_limite_rendicion = '/cm/cmprovec/valida/limiteRendicion';
//URL BUSCADORES
const url_buscar_cuenta_contable   = '/cm/cmprovec/buscar/cuentaContable' ;
const url_buscar_provPrincipal     = '/cm/cmprovec/buscar/provPrincipal'  ;
const url_buscar_cuenta_cont       = '/cm/cmprovec/buscar/cuentaCont'     ;
const url_buscar_rubro             = '/cm/cmprovec/buscar/rubro'          ;
const url_buscar_condicion_compra  = '/cm/cmprovec/buscar/condicionCompra';
const url_buscar_moneda            = '/cm/cmprovec/buscar/moneda'         ;
const url_modifica_dias_ant        = '/cm/cmprovec/modifica_dias_ant'     ;

var banSwitch   = false
var bandBloqueo = false
const setBandBloqueo =(e)=>{
    bandBloqueo = e;
}
var ValidaInput = [
        {
            input: 'COD_PROVEEDOR_REF',
            url: url_validar_provPrincipal,
            url_buscar: url_buscar_provPrincipal,
            valor_ant: null,
            out : ['DESC_PROVEEDOR_REF'],// RETORNO DE LA FUNCION
            data: ['COD_EMPRESA'], // DATOS DE DEPENDENCIA
            rel : [],
            next: 'COD_CUENTA_CONTABLE', // SIGUIENTE FOCUS
            band:true,
            requerido: false,
        },{
            input: 'COD_CUENTA_CONTABLE',
            url: url_validar_cuenta_contable,
            url_buscar: url_buscar_cuenta_contable,
            valor_ant: null,
            out :[ 'DESC_CUENTA_CONTABLE'],
            data:[ 'COD_EMPRESA'],
            rel :[],
            next:'COD_CUENTA_CONT', // SIGUIENTE FOCUS
            band:true,
            requerido: false,
        },{
            input: 'COD_CUENTA_CONT',
            url: url_validar_cuenta_cont,
            url_buscar: url_buscar_cuenta_cont,
            valor_ant: null,
            out :['DESC_CUENTA_REF'],// RETORNO DE LA FUNCION
            data:['COD_EMPRESA'],// DATOS DE DEPENDENCIA
            rel :[],// DATOS RELACIONADOS
            next: 'COD_RUBRO', // SIGUIENTE FOCUS
            band:true,
            requerido: false,
        },{
            input: 'COD_RUBRO',
            url: url_validar_rubro,
            url_buscar: url_buscar_rubro,
            valor_ant: null,
            out :['DESC_RUBRO'],// RETORNO DE LA FUNCION
            data:[],
            rel :[],
            next: 'COD_CONDICION_COMPRA', // SIGUIENTE FOCUS
            band:true,
            requerido: true,
        },{
            input: 'COD_CONDICION_COMPRA',
            url: url_validar_condicion_compra,
            url_buscar: url_buscar_condicion_compra,
            valor_ant: null,
            out:['DESC_CONDICION_COMPRA'],// RETORNO DE LA FUNCION
            data:['COD_EMPRESA'],
            rel:[],
            next: 'COD_MONEDA', // SIGUIENTE FOCUS
            band:true,
            requerido: true,
        },{
            input: 'COD_MONEDA',
            url: url_validar_moneda,
            url_buscar: url_buscar_moneda,
            valor_ant: null,
            out :['DESC_MONEDA'],// RETORNO DE LA FUNCION
            data:[],
            rel :[],
            next: 'CUENTA_BANCARIA', // SIGUIENTE FOCUS
            band:true,
            requerido: true,
        },{
            input: 'CANT_DIA_ANT',
            url: url_validar_limite_rendicion,
            url_buscar: '',
            valor_ant: null,
            out :[],
            data:['MODIFICA_DIAS_ANT'],
            rel :[],
            next: 'IND_PRIORIDAD', // SIGUIENTE FOCUS
            band:true,
            requerido: false,
        }
]
const columnProvPrincipal = [
    { ID: 'COD_PROVEEDOR_REF' , label: 'Código'    , width:100    },
    { ID: 'DESC_PROVEEDOR_REF', label: 'Descrición', minWidth:120 },
];
const columnCuentaContable = [
    { ID: 'COD_CUENTA_CONTABLE' , label: 'Código'    , width:100    },
    { ID: 'DESC_CUENTA_CONTABLE', label: 'Descrición', minWidth:120 },
];
const columnCuentaCont = [
    { ID: 'COD_CUENTA_CONT' , label: 'Código'    , width:100    },
    { ID: 'DESC_CUENTA_REF' , label: 'Descrición', minWidth:120 },
];
const columnRubro = [
    { ID: 'COD_RUBRO' , label: 'Código'    , width:100    },
    { ID: 'DESC_RUBRO', label: 'Descrición', minWidth:120 },
];
const columnCondicionCompra = [
    { ID: 'COD_CONDICION_COMPRA' , label: 'Código'    , width:100    },
    { ID: 'DESC_CONDICION_COMPRA', label: 'Descrición', minWidth:120 },
];
const columnMoneda = [
    { ID: 'COD_MONEDA' , label: 'Código'    , width:100    },
    { ID: 'DESC_MONEDA', label: 'Descrición', minWidth:120 },
];
const initialRow_cont = [
    { COD_PERSONA: "COD_PERSONA" },
];

var  m_dias_ant             = 'N'

const CMPROVEC = memo((props) => {

    const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
    const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
    const [form]              = Form.useForm();
    const cod_empresa         = sessionStorage.getItem('cod_empresa');
    const cod_usuario         = sessionStorage.getItem('cod_usuario');
    //---------------------- useState----------------------------------
    const gridCab             = React.useRef();
    const gridDet             = React.useRef();
    const gridCont            = React.useRef();
    // Input
    const refCodProveedot         = React.useRef();
    const refCodCunetaContable    = React.useRef();
    const refCodCuentaContableRef = React.useRef();
    const refCodRubro             = React.useRef();
    const refCuentaBancaria       = React.useRef();
    const refCodCondicionCompra   = React.useRef();
    const refCantDiaAnt           = React.useRef();
    const refCodMoneda            = React.useRef();
    const refIndPrioridad         = React.useRef();
    //checkbox
    const refIndDifPrecio         = React.useRef();
    const refExento               = React.useRef();
    const refIndTransportista     = React.useRef();
    const refDirector             = React.useRef();
    const refIndespachante        = React.useRef();
    const refIndLocal             = React.useRef();
    const refIndCajaChica         = React.useRef();
    const refIndRetencionIva      = React.useRef();
    const refIndReparto           = React.useRef();
    const refIndExportador        = React.useRef();
    const refIndOdc               = React.useRef();

    //---------------------- useState ---------------------------------------
    const [activarSpinner    , setActivarSpinner   ] = React.useState(true);
    const [tabKey		     , setTabKey	  	   ] = React.useState("1");
    // BUSCADORES
    const [ shows            , setShows            ] = React.useState(false);
    const [ modalTitle       , setModalTitle       ] = React.useState('');
    const [ searchColumns    , setSearchColumns    ] = React.useState({});
    const [ searchData       , setSearchData       ] = React.useState([]);
    const [ tipoDeBusqueda   , setTipoDeBusqueda   ] = React.useState();
    //--------------------- Estado Modal mensaje ---------------------------
    const [showMessageButton , setShowMessageButton] = React.useState(false)
    const [visibleMensaje	 , setVisibleMensaje   ] = React.useState(false);
    const [mensaje			 , setMensaje	       ] = React.useState();
    const [imagen			 , setImagen		   ] = React.useState();
    const [tituloModal		 , setTituloModal	   ] = React.useState();

    const idGrid = {
        CMPROVEC_CAB:gridCab,
        CMPROVEC_DET:gridDet,
        CMPROVEC_CONT:gridCont,
        defaultFocus:{
			CMPROVEC_CAB:1,
            CMPROVEC_DET:0,
            CMPROVEC_CONT:0
        }
    }
    
    React.useEffect(()=>{
        getData();
        initialFormData(false);
        setActivarSpinner(false);
    },[])
    
    const buttonSaveRef   = React.useRef();
    const buttonAddRowRef = React.useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys(Main.Nuevo, (e) => {
        e.preventDefault();
        buttonAddRowRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    Main.useHotkeys('F7', (e) => {
        e.preventDefault();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});
    
    const initialFormData = async(isNew)=>{
        try {
            m_dias_ant        = await Main.Request(url_modifica_dias_ant,'POST',{ 'COD_EMPRESA':sessionStorage.getItem('cod_empresa'),
                                                                                  'COD_USUARIO':sessionStorage.getItem('cod_usuario')
                                                                                });
            var  moneda       = await getInfo(url_buscar_moneda,'POST',{valor:'1'});
        } catch (error) {
            console.log(error)
        }

        var valor = {
            ['COD_EMPRESA'          ] : sessionStorage.getItem('cod_empresa'),
            ['COD_USUARIO'          ] : sessionStorage.getItem('cod_usuario'),
            ['COD_PROVEEDOR_REF'    ] : '',
            ['DESC_PROVEEDOR_REF'   ] : '',

            ['COD_CUENTA_CONTABLE'  ] : '',
            ['DESC_CUENTA_CONTABLE' ] : '',

            ['COD_CUENTA_CONT'      ] : '',
            ['DESC_CUENTA_REF'      ] : '',

            ['COD_RUBRO'            ] : '',
            ['DESC_RUBRO'           ] : '',

            ['COD_CONDICION_COMPRA' ] : '',
            ['DESC_CONDICION_COMPRA'] : '',
            
            ['COD_MONEDA'           ] : moneda[0]?.COD_MONEDA  ? moneda[0].COD_MONEDA  : '',
            ['DESC_MONEDA'          ] : moneda[0]?.DESC_MONEDA ? moneda[0].DESC_MONEDA : '',

            ['CUENTA_BANCARIA'      ] : '',
            ['CANT_DIA_ANT'         ] : '',
            ['FEC_ALTA'             ] : Main.moment().format('DD/MM/YYYY h:mm:ss'),
            ['MODIFICADO_POR'       ] : '',
            ['FEC_MODIFICACION'     ] : '',
            ['TIP_FLETE'            ] : 'N',
            ['MODIFICA_DIAS_ANT'    ] : m_dias_ant.data.outBinds.ret,
            
        }        
        if(isNew){
            valor = 
             {...valor,
                ['IND_PRIORIDAD'        ] :'N',
                ['inserted'             ] :true,
                ["IND_DIF_PRECIO"       ] :'N',
                ["EXENTO"               ] :'N',
                ["IND_TRANSPORTISTA"    ] :'N',
                ["DIRECTO"              ] :'N',
                ["IND_DESPACHANTE"      ] :'N',
                ["IND_LOCAL"            ] :'N',
                ["IND_CAJA_CHICA"       ] :'N',
                ["IND_RETENCION_IVA"    ] :'N',
                ["IND_REPARTO"          ] :'N',
                ["IND_EXPORTADOR"       ] :'N',
                ["IND_ODC"              ] :'N',            
            }
            return valor
        }else{
            valor.insertDefault = true
            form.setFieldsValue(valor);
        };
    }
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
            var content = await getInfo(url_getcabecera+cod_empresa, "GET", []);
            if(_.isUndefined(content)) content = []
            var moneda  = await getInfo(url_buscar_moneda,'POST',{valor:'1'});
            if(_.isUndefined(moneda)) moneda = []
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
                COD_USUARIO   : sessionStorage.getItem('cod_usuario'),
                IDCOMPONENTE  : "CMPROVEC_CAB",
                COD_MONEDA    : moneda[0]?.COD_MONEDA  ? moneda[0].COD_MONEDA  : '',
                DESC_MONEDA   : moneda[0]?.DESC_MONEDA ? moneda[0].DESC_MONEDA : '',
                MODIFICA_DIAS_ANT : m_dias_ant.data.outBinds.ret
            }]
        }
        const dataSource_Cab = new DataSource({
            store: new ArrayStore({
                data: content,
            }),
            key: 'ID'
        })
        gridCab.current.instance.option('dataSource', dataSource_Cab);
        cancelar_Cab = JSON.stringify(content);
        setTimeout(()=>{
            gridCab.current.instance.focus(gridCab.current.instance.getCellElement(0,1))
        },100)
    }
    const showModalMensaje = (titulo, imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    };
    const handleCancel = async()=>{
        setVisibleMensaje(false);
        if(showMessageButton){
            funcionCancelar();
        }
    }
    const guardar = async(e)=>{
        setVisibleMensaje(false);
        setActivarSpinner(true);
        let permiso_actualizar = Main.VerificaPermiso(FormName)[0].actualizar
        let banPermiso = false;
        let result_cab =  await gridCab.current.instance.getDataSource() !== undefined ? gridCab.current.instance.getDataSource()._items : [];
        let valorResul_cab = []
        if(result_cab.length){
            result_cab.forEach(element => {
                if(element.inserted || element.updated){
                    element.MODIFICA_DIAS_ANT = m_dias_ant.data.outBinds.ret;
                    valorResul_cab.push(element)
                }
                if(element.updated) banPermiso = true
            });
        }
        let result_cont = await gridCont.current.instance.getDataSource()._items;
        let valorResul_cont = []
        if(result_cont.length){
            result_cont.forEach(element => {
                if(element.inserted || element.updated){
                    valorResul_cont.push(element)
                }
                if(element.updated) banPermiso = true
            });
        }

        if((permiso_actualizar !== "S") && banPermiso){
            Main.message.info({
                content  : `No posee permisos para actualizar`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                    marginTop: '2vh',
                },
            });
            setActivarSpinner(false);
            return
        }
        
        let verificar_input_requerido = ValidarCamposRequeridos();
        if(!verificar_input_requerido){
            setActivarSpinner(false);
            return;
        }
        // VALIDADOR
        var datosValidar = {
            id:[{ 
                CMPROVEC_CAB:gridCab,
                CMPROVEC_CONT:gridCont
            }],
            column:[{ 
                CMPROVEC_CAB:columns_cab, 
                CMPROVEC_CONT:columns_det,
            }],
            datos:[{ 
                CMPROVEC_CAB:valorResul_cab,
                CMPROVEC_CONT:valorResul_cont,
            }],
            adicionalRequerido:['COD_RUBRO','COD_CONDICION_COMPRA']
        }
        const valor = await ValidarColumnasRequeridas(datosValidar);
        if(valor){
            setActivarSpinner(false);
            return;
        } 

        // Validar los permisos de abm
        var datosCab = []
        if(gridCab.current != undefined){
            datosCab    = gridCab.current.instance.getDataSource()._items;
        }
        // GENERAMOS EL PK AUTOMATICO
        var info_cab = await Main.GeneraUpdateInsertCab(datosCab,'COD_PROVEEDOR', url_getCodProvec+cod_empresa, [],true);
        var aux_cab             = info_cab.rowsAux;
        var update_insert_cab   = info_cab.updateInsert;
        var delete_cab          = DeleteForm.CMPROVEC_CAB != undefined ? DeleteForm.CMPROVEC_CAB : [];
        console.log("delete_cab ===> ", delete_cab)

        var datosCont = []
        if(gridCont.current != undefined){
            datosCont    = gridCont.current.instance.getDataSource()._items;
        }
        var info_cont = await Main.GeneraUpdateInsertDet(datosCont,['NOM_CONTACTO'],info_cab.rowsAux,[],'COD_PERSONA',url_getCodContacto,'COD_CONTACTO');
        var aux_cont             = info_cont.rowsAux;
        var update_insert_cont   = info_cont.updateInsert;
        var delete_cont          = DeleteForm.CMPROVEC_CONT !== undefined ? DeleteForm.CMPROVEC_CONT : [];

        console.log("delete_cont ===> ", delete_cont)


        //Formateo de fecha datagrid
        if(update_insert_cab.length > 0){
            for (let i = 0; i < update_insert_cab.length; i++) {
                const items = update_insert_cab[i];
                if(items.VENCIMIENTO_TIMBRADO !== '' && !_.isUndefined(items.VENCIMIENTO_TIMBRADO)){
                    let fecha = Main.moment(items.VENCIMIENTO_TIMBRADO).format('DD/MM/YYYY')
                    if(fecha !== 'Invalid date') items.VENCIMIENTO_TIMBRADO = fecha;
                }
            }
        }
        let valorAuxiliar_cab  = getCancelar_Cab()  !== '' ? JSON.parse(getCancelar_Cab())  : [];
        let valorAuxiliar_cont = getCancelar_Cont() !== '' ? JSON.parse(getCancelar_Cont()) : [];


        console.log("esta va adentro de data ==> ",update_insert_cab)
        var data = {
            // Cabecera
			    update_insert_cab,  delete_cab, valorAuxiliar_cab ,
                
            // Contacto
                update_insert_cont, delete_cont, valorAuxiliar_cont,
            // Adicional
            "cod_usuario": sessionStorage.getItem('cod_usuario'),
            "cod_empresa":sessionStorage.getItem('cod_empresa')
		}
        if(update_insert_cab.length > 0 || delete_cab.length > 0  || 
          update_insert_cont.length > 0 || delete_cont.length > 0 ){
            try{
                var method = "POST"
                await Main.Request( url_abm, method, data).then(async(response) => {
                    console.log("esto es response ==> ",response)


                    var resp = response.data;
                    if(resp.ret == 1){
                        Main.message.success({
							content  : `Procesado correctamente!!`,
							className: 'custom-class',
							duration : `${2}`,
							style    : {
							marginTop: '4vh',
							},
						});
                        // BOTON MODIFICAR
						setModifico();
                        // CLEAR DELETE
                        LimpiarDelete()
                        // ---------------------------------------------
                        var dataSource = '';
                        if(gridCab.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_cab}), key:'ID'})
                            gridCab.current.instance.option('dataSource', dataSource);
						}
                        cancelar_Cab =  JSON.stringify(aux_cab);

                        // ---------------------------------------------
                        if(gridCont.current != undefined){
							dataSource = new DataSource({store: new ArrayStore({keyExpr:"ID", data: aux_cont}), key:'ID'})
                            gridCont.current.instance.option('dataSource', dataSource);
						}
                        cancelar_Cab =  JSON.stringify(aux_cab);
                        QuitarClaseRequerido();
                        setBandBloqueo(false);
                        setShowMessageButton(false)
                        banSwitch = false;
                        setTimeout(()=>{
                            // CMPROVEC_CAB
                            let info = getComponenteFocusDet()
                            let fila = info.CMPROVEC_CAB.rowIndex ? info.CMPROVEC_CAB.rowIndex : 0
                            gridCab.current.instance.focus(gridCab.current.instance.getCellElement(fila,1))
                            console.log('rowIndex ==> ', rowIndex)
                        },60);
                    }else{
                        setActivarSpinner(false);
                        showModalMensaje('Atencion!','atencion',`${response.data.p_mensaje}`);
                    }
                });
            } catch (error) {
                console.log("Error en la funcion de Guardar!",error);
            }
            setActivarSpinner(false);
        }else{
            setModifico();
            setActivarSpinner(false);
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
    const addRow = async()=>{
        if(!bandBloqueo){
            let idComponent = getComponenteEliminarDet().id
            let indexRow  = getRowIndex()
            if(indexRow == -1) indexRow = 0
            if(idComponent !== 'CMPROVEC_CAB') indexRow = 0    
            modifico();
            let initialInput = await initialFormData(true)
            let data = gridCab.current.instance.getDataSource();
            var newKey = uuidID();
            var row    = [0]

            row = [{
                ...initialInput,
                ID	          : newKey,
                IDCOMPONENTE  : "CMPROVEC_CAB",
            }]
            let rows    = data._items;
            let info = rows.concat(rows.splice(indexRow, 0, ...row))

            const dataSource_cab = new DataSource({
                store: new ArrayStore({
                    data: info,
                }),
                key: 'ID'
            });
            gridCab.current.instance.option('dataSource', dataSource_cab);
            setTimeout(()=>{
                gridCab.current.instance.focus(gridCab.current.instance.getCellElement(indexRow,1))
            },110)
        }else{
            gridCab.current.instance.option("focusedRowKey", 120);
            gridCab.current.instance.clearSelection();
            gridCab.current.instance.focus(0);
            setShowMessageButton(true);
            showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
        }
    }
    const deleteRows = async()=>{
        const componete = await getComponenteEliminarDet();
        console.log("Componete ==> ",componete)
        console.log(componete);
        if(componete.delete){
            let indexRow =  await getRowIndex();
            if(indexRow == -1) indexRow = 0
            console.log(" esto es componete segunda vez ==> ",componete)
            let data    = idGrid[componete.id].current.instance.getDataSource()._items
            // console.log('idGrid[componete.id].current ==> ', idGrid[componete.id].current)
            let info    = data[indexRow]
            
            if(_.isUndefined(info) || (_.isUndefined(info.inserted) && _.isUndefined(info.InsertDefault))){
                modifico();

                var nameColumn = await getFocusedColumnName()
                var comunIndex = idGrid[componete.id].current.instance.getCellElement(indexRow,nameColumn).cellIndex;
                if (comunIndex == -1) comunIndex = 0;

                if(DeleteForm[componete.id] !== undefined){
                    if(componete.id == 'CMPROVEC_CAB'){
                        let resul = gridCont.current.instance.getDataSource()._items;
                        if(resul.length > 0){
                            resul.forEach(element => {
                                DeleteForm.CMPROVEC_CONT = _.union(DeleteForm['CMPROVEC_CONT'], [element]);
                            });
                        }
                    }else{
                        setBandBloqueo(true)
                    }
                    DeleteForm[componete.id] = _.union(DeleteForm[componete.id], [info]);
                }else if(DeleteForm.length > 0){

                    if(componete.id == 'CMPROVEC_CAB'){
                        let resul = gridCont.current.instance.getDataSource()._items;
                        if(resul.length > 0){
                            resul.forEach(element => {
                                if(DeleteForm.CMPROVEC_CONT){
                                    DeleteForm.CMPROVEC_CONT = _.union(DeleteForm['CMPROVEC_CONT'], [element]);
                                }else{
                                    DeleteForm.CMPROVEC_CONT = [element]
                                }                                
                            });
                        }
                    }else{
                        setBandBloqueo(true)
                    }

                    DeleteForm[componete.id] = [info];

                }else if(DeleteForm.length == 0){
                    if(componete.id == 'CMPROVEC_CAB'){
                        let resul = gridCont.current.instance.getDataSource()._items;
                        if(resul.length > 0){
                            resul.forEach(element => {
                                if(DeleteForm.CMPROVEC_CONT){
                                    DeleteForm.CMPROVEC_CONT = _.union(DeleteForm['CMPROVEC_CONT'], [element]);
                                }else{
                                    DeleteForm.CMPROVEC_CONT = [element]
                                }     
                            });
                        }
                    }else{
                        setBandBloqueo(true)
                    }
                    DeleteForm[componete.id] = [info];
                }
                if(indexRow == -1) indexRow = 0

                idGrid[componete.id].current.instance.deleteRow(indexRow);
                idGrid[componete.id].current.instance.repaintRows([indexRow]);
            }else{
                idGrid[componete.id].current.instance.deleteRow(indexRow);
                idGrid[componete.id].current.instance.repaintRows([indexRow]);
            }
            setTimeout(()=>{
                indexRow = indexRow - 1;
                idGrid[componete.id].current.instance.focus(idGrid[componete.id].current.instance.getCellElement(indexRow == -1 ? 0 : indexRow ,idGrid.defaultFocus[componete.id]))
            },50);
        }
    }
    const funcionCancelar =async()=>{
        setActivarSpinner(true)
        var e = getFocusGlobalEventDet();
		if(getCancelar_Cab()){
            var AuxDataCancelCab = await JSON.parse(await getCancelar_Cab());

			if(AuxDataCancelCab.length > 0 && gridCab.current){
				const dataSource_cab = new DataSource({
					store: new ArrayStore({
						  keyExpr:"ID",
						  data: AuxDataCancelCab
					}),
					key: 'ID'
				})
				gridCab.current.instance.option('dataSource', dataSource_cab);
				cancelar_Cab = JSON.stringify(AuxDataCancelCab);
                setInputData(e.row.data);                
			}
		}
        if(getCancelar_Cont()){
            var AuxDataCancelCont = await JSON.parse(await getCancelar_Cont());
			if(AuxDataCancelCont.length > 0 && gridCont.current){
				const dataSource_cont = new DataSource({
					store: new ArrayStore({
						  keyExpr:"ID",
						  data: AuxDataCancelCont
					}),
					key: 'ID'
				})
				gridCont.current.instance.option('dataSource', dataSource_cont);
				cancelar_Cont = JSON.stringify(AuxDataCancelCont);
			}
		}
        LimpiarDelete();
        QuitarClaseRequerido();
        banSwitch = false;
        setBandBloqueo(false);
        setShowMessageButton(false)
        setTimeout(()=>{
            setModifico();
            setActivarSpinner(false)
            gridCab.current.instance.focus(gridCab.current.instance.getCellElement(0,1));
            setTabKey('1');
        },50);
    }
    const handleCheckbox = async(e, options) => {
		var row = await getFocusGlobalEventDet().row.data;
		row[e.target.id] = form.getFieldValue(e.target.id) == true ? options[0] : options[1];
		if(!row.inserted){
			row.updated = true;
		}
		modifico()
	}
    const handleChange = async(e)=>{
        var BuscadorRow = []
        var value = e.target.value;
        if(value.trim() == '') value = 'null'
        var url   = '/cm/cmprovec/search'
        if(value == 'null'){
            const index = await ArrayPushHedSeled.indexOf(undefined);
            if (index > -1) {
            ArrayPushHedSeled.splice(index, 1); 
            }

            try {
                var method         = "POST";
                const cod_empresa  = sessionStorage.getItem('cod_empresa');        
                await Main.Request(url,method,{'value':value, 'cod_empresa': cod_empresa, filter:ArrayPushHedSeled })
                    .then( response =>{
                        if( response.status == 200 ){
                        BuscadorRow = new DataSource({
                            store: new ArrayStore({
                                data: response.data.rows,
                            }),
                            key: 'ID'
                        }) 
                        gridCab.current.instance.option('dataSource', BuscadorRow);
                        cancelar_Cab = JSON.stringify(response.data.rows);
                        }
                    setTimeout(()=>{
                        gridCab.current.instance.option('focusedRowIndex', 0);
                    },70)
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
    const onKeyDownBuscar = async(e)=>{
        var BuscadorRow = []
        var value = e.target.value;
        if(value.trim() == '') value = 'null'
        var url   = '/cm/cmprovec/search'
        
        if(e.keyCode == 13){
            
            const index = await ArrayPushHedSeled.indexOf(undefined);
            console.log("index ===>> ",index)
            if (index > -1) {
             ArrayPushHedSeled.splice(index, 1); 
            }
    
            try {
                var method         = "POST";
                const cod_empresa  = sessionStorage.getItem('cod_empresa');        
                await Main.Request(url,method,{'value':value, 'cod_empresa': cod_empresa, filter:ArrayPushHedSeled })
                    .then( response =>{
                        if( response.status == 200 ){
                          BuscadorRow = new DataSource({
                            store: new ArrayStore({
                                data: response.data.rows,
                            }),
                            key: 'ID'
                          }) 
                          gridCab.current.instance.option('dataSource', BuscadorRow);
                          cancelar_Cab = JSON.stringify(response.data.rows);
                        }
                    setTimeout(()=>{
                        gridCab.current.instance.option('focusedRowIndex', 0);
                    },70)
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
    const handleKeydown = async (e)=>{
        
        if(e.keyCode == 13 || e.keyCode == 9){
            e.preventDefault()   
            nextFocus(e);
        }

        if(e.keyCode == 120){
            e.preventDefault();
            setActivarSpinner(true)
            setTipoDeBusqueda(e.target.id);
            switch(e.target.id){
              case "COD_CUENTA_CONTABLE":
                var auxCuenta = await getInfo(url_buscar_cuenta_contable,'POST',{cod_empresa: cod_empresa});
                setModalTitle("Cuenta Contable");
                setSearchColumns(columnCuentaContable);
                setSearchData(auxCuenta);
                setShows(true);
                break;
            case "COD_CUENTA_CONT":
                var auxCuenta = await getInfo(url_buscar_cuenta_cont,'POST',{cod_empresa: cod_empresa});
                setModalTitle("Cuenta Contado");
                setSearchColumns(columnCuentaCont);
                setSearchData(auxCuenta);
                setShows(true);
                break;
            case "COD_RUBRO":
                var auxCuenta = await getInfo(url_buscar_rubro,'POST',{});
                setModalTitle("Rubro");
                setSearchColumns(columnRubro);
                setSearchData(auxCuenta);
                setShows(true);
                break;
            case "COD_CONDICION_COMPRA":
                var auxCuenta = await getInfo(url_buscar_condicion_compra,'POST',{cod_empresa: cod_empresa});
                setModalTitle("Condición Compra");
                setSearchColumns(columnCondicionCompra);
                setSearchData(auxCuenta);
                setShows(true);
                break;
            case "COD_MONEDA":
                var auxCuenta = await getInfo(url_buscar_moneda,'POST',{});
                setModalTitle("Moneda");
                setSearchColumns(columnMoneda);
                setSearchData(auxCuenta);
                setShows(true);
                break;
            case "COD_PROVEEDOR_REF":
                var auxCuenta = await getInfo(url_buscar_provPrincipal,'POST',{cod_empresa: cod_empresa});
                setModalTitle("Proveedor Principal");
                setSearchColumns(columnProvPrincipal);
                setSearchData(auxCuenta);
                setShows(true);
                break;                
                
              default:
                break;
             }
            setActivarSpinner(false)
          }
    }
    const nextFocus = async(e)=>{
        switch (e.target.id) {            
            case 'COD_PROVEEDOR_REF':
                ValidarUnico(e.target.id);
                break;
            case 'COD_CUENTA_CONTABLE':
                ValidarUnico(e.target.id);
                break;
            case 'COD_CUENTA_CONT':
                ValidarUnico(e.target.id);
                break;
            case 'COD_RUBRO':
                ValidarUnico(e.target.id);
                break;
            case 'COD_CONDICION_COMPRA':
                ValidarUnico(e.target.id);
                break;
            case 'COD_MONEDA':
                ValidarUnico(e.target.id);
                break;                                
            case 'CUENTA_BANCARIA':
                refCantDiaAnt.current.focus();
                break;
            case 'CANT_DIA_ANT':
                ValidarUnico(e.target.id);
                break;
            case 'IND_DIF_PRECIO':
                refExento.current.focus();
                break;
            case 'EXENTO':
                refIndTransportista.current.focus();
                break;
            case 'IND_TRANSPORTISTA':
                refDirector.current.focus();
                break;
            case 'DIRECTO':
                refIndespachante.current.focus();
                break;
            case 'IND_DESPACHANTE':
                refIndLocal.current.focus();
                break;
            case 'IND_LOCAL':
                refIndCajaChica.current.focus();
                break;
            case 'IND_CAJA_CHICA':
                refIndRetencionIva.current.focus();
                break;
            case 'IND_RETENCION_IVA':
                refIndReparto.current.focus();
                break;
            case 'IND_REPARTO':
                refIndExportador.current.focus();
                break;
            case 'IND_EXPORTADOR':
                refIndOdc.current.focus();
                break;
            case 'IND_ODC':
                let idComponente = getIdComponente()
                if(idComponente == 'CMPROVEC_DET'){
                    setTimeout(()=>{
                        gridDet.current.instance.focus(gridDet.current.instance.getCellElement(0,0))
                    },80);
                }else{
                    setTimeout(()=>{
                        gridCont.current.instance.focus(gridCont.current.instance.getCellElement(0,0))
                    },80);
                }
                break;    
            default:
                break;
        }        
    }
    const setInputData = async (data)=>{
        form.setFieldsValue({
            ...data,
              ["IND_DIF_PRECIO"]    : data.IND_DIF_PRECIO    == "S" ? true : false,
              ["EXENTO"]            : data.EXENTO            == "S" ? true : false,
              ["IND_TRANSPORTISTA"] : data.IND_TRANSPORTISTA == "S" ? true : false,
              ["DIRECTO"]           : data.DIRECTO           == "S" ? true : false,
              ["IND_DESPACHANTE"]   : data.IND_DESPACHANTE   == "S" ? true : false,
              ["IND_LOCAL"]         : data.IND_LOCAL         == "S" ? true : false,
              ["IND_CAJA_CHICA"]    : data.IND_CAJA_CHICA    == "S" ? true : false,
              ["IND_RETENCION_IVA"] : data.IND_RETENCION_IVA == "S" ? true : false,
              ["IND_REPARTO"]       : data.IND_REPARTO       == "S" ? true : false,
              ["IND_EXPORTADOR"]    : data.IND_EXPORTADOR    == "S" ? true : false,
              ["IND_ODC"]           : data.IND_ODC           == "S" ? true : false,
          });
        let url    = url_getDetalle
        let params = {cod_proveedor: data.COD_PROVEEDOR, 'cod_empresa':cod_empresa, cod_persona:data.COD_PERSONA} 
        // let id     = getIdComponente()
        //   if (id == 'CMPROVEC_CONT') url = await url_getContacto;
        url = await url_getContacto;
        getDetalle(url,params,data);
    }
    const setRowFocus = async(e,grid,f9)=>{
        if(!bandBloqueo){
            if(e.row != undefined){
                setInputData(e.row.data)
            } 
        }else{
            gridCab.current.instance.option("focusedRowKey", 120);
            gridCab.current.instance.clearSelection();
            gridCab.current.instance.focus(0);
            setShowMessageButton(true);
            showModalMensaje('Atencion!','atencion','Hay cambios pendientes. ¿Desea guardar los cambios?');
        }
    }
    const getDetalle = async(url,params,data)=>{
        var content = []
        try {
            content = await Main.Request(url, "POST", params);
        } catch (error) {
            console.log(error)
        }
        console.log('data.ID ==> ',data.ID)
        
        if(content.data.rows.length == 0){
            let newKey = uuidID();
            content = [{
                ID	           : newKey,
                COD_EMPRESA    : cod_empresa,
                idCabecera     : data.ID,
                IDCOMPONENTE   : getIdComponente(),
                InsertDefault  : true,
                COD_PROVEEDOR  : params.cod_proveedor,
                COD_PERSONA    : params.cod_persona,
                COD_CONTACTO   : undefined
            }]
        }else{
            content = content.data.rows
        }

        const dataSource_det = new DataSource({
            store: new ArrayStore({
                data: content,
            }),
            key: 'ID'
        })

        // if(getIdComponente() == 'CMPROVEC_CONT'){
            banSwitch = false
            gridCont.current.instance.option('dataSource', dataSource_det);
            cancelar_Cont = JSON.stringify(content)

            console.log('content es esto ==> ', content)
        // }else{
        //     banSwitch = false
        //     gridDet.current.instance.option('dataSource', dataSource_det);
        //     cancelar_Det = JSON.stringify(content)
        // }
    }   
    const handleTabChange = (value) => {
		setTabKey(value);
		manageTabs(value);
	}
    const manageTabs = async (value)=>{
        switch (value) {
            case "1":
            setIdComponente("CMPROVEC_DET");
                if(gridDet.current.instance.getDataSource()._items){
                    cancelar_Cont = JSON.stringify(content);
                    setTimeout(()=>{
                        gridDet.current.instance.focus(gridDet.current.instance.getCellElement(0,0))
                    },80);
                }
                break;
            case "2":
            setIdComponente("CMPROVEC_CONT");
                if(!banSwitch){
                    let info = form.getFieldsValue()
                    try {
                        setActivarSpinner(true);
                        var datos   = {'cod_persona':info.COD_PERSONA}
                        var content = []
                        content = await getInfo(url_getContacto, "POST", datos);
                    } catch (error) {
                        console.log(error)
                    }
                    setActivarSpinner(false);                    
                    if(content.length == 0){
                        var newKey = uuidID();
                        content = [{
                            ID	          : newKey,
                            COD_EMPRESA   : cod_empresa,
                            InsertDefault : true,
                            IDCOMPONENTE  : "CMPROVEC_CONT",
                            idCabecera    : info.ID,
                        }]
                    }
                    const datos_contacto = new DataSource({
                        store: new ArrayStore({
                            data: content,
                        }),
                        key: 'ID'
                    })
                    gridCont.current.instance.option('dataSource', datos_contacto);
                    cancelar_Cont = JSON.stringify(content);
                    setTimeout(()=>{
                        gridCont.current.instance.focus(gridCont.current.instance.getCellElement(0,0))
                    },80)
                    banSwitch = true
                }
            break;
            default:
                break;
        }
    }
    const setUpdateValue_det = (e)=>{
        setBandBloqueo(true)
    }
    // VALIDADORES
    const ValidarUnico = async(input) => {
        let item    = await ValidaInput.find( item => item.input == input);
        var dataRow = await getFocusGlobalEventDet().row.data;
        if(!_.isObject(item)) return;
        let valor = form.getFieldValue(item.input);
        if(valor == null) valor = '';
        if(_.isNumber(valor)) valor = `${valor}`;
        if(valor.trim().length == 0 ){
        item.valor_ant = null;
        item.band = false;
        item.out.map( x => {
            form.setFieldsValue({
            ...form.getFieldsValue(),
            [x]: ''
            });
            dataRow[x] = ''
        });
        item.rel.map( x => {
            form.setFieldsValue({
            ...form.getFieldsValue(),
            [x]: ''
            });
            dataRow[x] = ''
        });
        if(!item.requerido){
            if(!item.grid_next) document.getElementById(item.next).focus(); else Grid.current.instance.focus(Grid.current.instance.getCellElement(0,0)); 
        }
        return;
        }
        if( form.getFieldValue(item.input) != item.valor_ant){
            try {
                let data = {}
                item.data.map( x => {
                data = { ...data, [x.toLowerCase()]:form.getFieldValue(x) }
                });
                data = {...data, valor:form.getFieldValue(item.input)};
                return await Main.Request( item.url, 'POST', data )
                .then( response => {
                    if(response.data.outBinds.ret == 1){
                        item.valor_ant = form.getFieldValue(item.input);
                        item.out.map( x => {
                            form.setFieldsValue({
                            ...form.getFieldsValue(),
                            [x]: response.data.outBinds[x]
                            });
                            dataRow[x] = response.data.outBinds[x];
                        });
                        item.rel.map( x => {
                            form.setFieldsValue({
                            ...form.getFieldsValue(),
                            [x]: ''
                            });
                            dataRow[x] = '';
                        });
                        if(!item.grid_next){
                            document.getElementById(item.next).focus();
                            document.getElementById(item.next).select();
                        }else{
                            Grid.current.instance.focus(Grid.current.instance.getCellElement(0,0));
                        }
                    }else{
                        item.valor_ant = null;
                        item.band = false;
                        item.out.map( x => {
                            form.setFieldsValue({
                            ...form.getFieldsValue(),
                            [x]: ''
                            });
                            dataRow[x] = '';
                        });
                        item.rel.map( x => {
                            form.setFieldsValue({
                            ...form.getFieldsValue(),
                            [x]: ''
                            });
                            dataRow[x] = '';
                        });
                        document.getElementById(item.input).focus();
                        document.getElementById(item.input).select();
                        showModalMensaje('¡Atención!','alerta', response.data.outBinds.p_mensaje);
                    }
                });
            } catch (error) {
                console.log(error);
            }        
        }else{
            document.getElementById(item.next).focus();
            document.getElementById(item.next).select();
        }
    }
    // BUSCADORES
    const modalSetOnClick = async (datos, BusquedaPor) => {
        if(datos !== "" || datos !== undefined){
            modifico();
            let info    = await ValidaInput.find( item => item.input == BusquedaPor );
            var dataRow = await getFocusGlobalEventDet().row.data;
            if(info.valor_ant != datos[0]){
                // JUNTAR EL CODIGO, CON EL RETORNO DEL VALIDA
                let keys = [ info.input, ...info.out ];
                keys.map(( item, index) => {
                // FORM
                    form.setFieldsValue({
                        ...form.getFieldsValue(),
                        [item]: datos[index] 
                    });
                    dataRow[item] = datos[index]
                });
                // LIMPIAR DATOS RELACIONADOS
                info.rel.map(( item ) => {
                // FORM
                    form.setFieldsValue({
                        ...form.getFieldsValue(),
                        [item]: '' 
                    });
                    dataRow[item] = datos[index]
                });
            }
            showsModal(false)
            let rowsData = await getFocusGlobalEventDet()
            if(rowsData){
                rowsData.row.data[BusquedaPor] = datos[0]

                if(rowsData.row.data.InsertDefault){
                    rowsData.row.data['inserted']      = true;
                    rowsData.row.data['InsertDefault'] = false;
                }else if(rowsData.row.data.inserted){
                    rowsData.row.data['InsertDefault'] = false;
                }else{
                    rowsData.row.data['updated'] = true;
                    rowsData.row.data['FEC_MODIFICACION'] = Main.moment().format('DD/MM/YYYY');
                    rowsData.row.data['MODIFICADO_POR'  ] = cod_usuario;
                }
            }
            setTimeout( ()=>{ document.getElementById(info.next).focus() }, 200 );
        }
    }
    const onInteractiveSearch = async(event) => {
        let valor = event.target.value;
        let data = {'cod_empresa':cod_empresa,'valor':valor}
        if(valor.trim().length === 0 ) valor = 'null';
        let info = ValidaInput.find( item => item.input == tipoDeBusqueda );
        let url = info.url_buscar;
        if(valor !== null){
        try {
            await Main.Request(url,'POST',data).then(response => { 
                if( response.status == 200 ){
                    setSearchData(response.data.rows)   
                } 
            });
        } catch (error) {
            console.log(error);
        }
        }
    }
    const showsModal = async (valor) => {
        setShows(valor);
    };
    const handleInputChange = async(e)=>{
        modifico();
        let info = await getFocusGlobalEventDet()
        console.log("info => ", info)      
        if(info){
            info.row.data[e.target.id] = e.target.value
            if(info.row.data.InsertDefault){
                info.row.data['inserted']      = true;
                info.row.data['InsertDefault'] = false;
            }else if(info.row.data.inserted){
                info.row.data['InsertDefault'] = false;
            }else{
                info.row.data['updated'] = true;
                info.row.data['FEC_MODIFICACION'] = Main.moment().format('DD/MM/YYYY');
                info.row.data['MODIFICADO_POR'  ] = cod_usuario;    
            }
            gridCab.current.instance.repaintRows(info.rowIndex);
        }        
    }
    
    return (
        <Main.Spin size="large" spinning={activarSpinner} >
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
            <Main.FormModalSearch
                showsModal={showsModal}
                setShows={shows}
                title={modalTitle}
                componentData={
                <Main.NewTableSearch
                    onInteractiveSearch={onInteractiveSearch}
                    columns={searchColumns}
                    searchData={searchData}
                    modalSetOnClick={modalSetOnClick}
                    tipoDeBusqueda={tipoDeBusqueda}/>
                }
                descripcionClose=""
                descripcionButton=""
                actionAceptar=""
            />
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${title}`} />
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
                            onKeyDownBuscar={onKeyDownBuscar}
                            buttonGuardar={buttonSaveRef}
                            buttonAddRef={buttonAddRowRef}
                        />
                        <div style={{padding:'10px'}}>
                            <DevExtremeDet
                                gridDet={gridCab}
                                id="CMPROVEC_CAB"
                                IDCOMPONENTE="CMPROVEC_CAB"
                                columnDet={columns_cab}
                                notOrderByAccion={notOrderByAccion}												
                                FormName={FormName}
                                guardar={guardar}
                                newAddRow={false}
                                deleteDisable={false}
                                setRowFocusDet={setRowFocus}
                                columnModal={columnModal}
                                optionSelect={concepto}
                                activateF10={false}
                                activateF6={false}
                                setActivarSpinner={setActivarSpinner}
                                altura={'180px'}
                                doNotsearch={doNotsearch_cab}
                                columBuscador={columBuscador_cab}
                                nextFocusNew={"COD_PROVEEDOR_REF"}
                            />
                        
                            <Form autoComplete="off" size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px'}}>
                                <Col span={24}>
                                    <Row gutter={[8, 8]}>
                                        <Col span={18}>
                                            <Row>
                                                <Col span={24}>
                                                    <Form.Item label="Prov. Principal" 
                                                        labelCol={{ span: 4 }} 
                                                        wrapperCol={{ span: 20 }}>
                                                        <Form.Item name="COD_PROVEEDOR_REF" className="form-input-group-cod" >
                                                            <Input
                                                                onKeyDown={handleKeydown}
                                                                onChange={handleInputChange}                                                                
                                                                ref={refCodProveedot}
                                                                // onFocus={handleFocus}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item name="DESC_PROVEEDOR_REF" className="form-input-group-desc" >
                                                            <Input disabled/>
                                                        </Form.Item>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item label="Cuent. Contable" 
                                                        labelCol={{ span: 4 }} 
                                                        wrapperCol={{ span: 20 }}>
                                                        <Form.Item name="COD_CUENTA_CONTABLE" className="form-input-group-cod">
                                                            <Input  
                                                                onKeyDown={handleKeydown}
                                                                onChange={handleInputChange}
                                                                ref={refCodCunetaContable}
                                                                // onFocus={handleFocus}
                                                                />
                                                        </Form.Item>
                                                        <Form.Item name="DESC_CUENTA_CONTABLE" className="form-input-group-desc" >
                                                            <Input disabled/>
                                                        </Form.Item>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item label="Cuent. Cont. Mil." 
                                                        labelCol={{ span: 4 }} 
                                                        wrapperCol={{ span: 20 }}
                                                        >
                                                        <Form.Item name="COD_CUENTA_CONT" className="form-input-group-cod" >
                                                            <Input  
                                                                onKeyDown={handleKeydown}
                                                                onChange={handleInputChange}
                                                                ref={refCodCuentaContableRef}
                                                                // onFocus={handleFocus}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item name="DESC_CUENTA_REF" className="form-input-group-desc">
                                                            <Input disabled/>
                                                        </Form.Item>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={16}>
                                                    <Form.Item label="Rubro" 
                                                        labelCol={{ span: 6 }} 
                                                        wrapperCol={{ span: 18 }}
                                                    >
                                                        <Form.Item name="COD_RUBRO" className="form-input-group-cod">
                                                            <Input      
                                                                onKeyDown={handleKeydown}
                                                                onChange={handleInputChange}
                                                                className="requerido"
                                                                ref={refCodRubro}
                                                                // onFocus={handleFocus}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item name="DESC_RUBRO" className="form-input-group-desc">
                                                            <Input disabled/>
                                                        </Form.Item>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item
                                                            label="Cuent. Banc."
                                                            name="CUENTA_BANCARIA"
                                                            labelCol={{ span: 10 }}
                                                            wrapperCol={{ span: 14 }}>
                                                        <Input
                                                            onKeyDown={handleKeydown}
                                                            onChange={handleInputChange}
                                                            ref={refCuentaBancaria}
                                                            // autocomplete="off"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={16}>
                                                    <Form.Item label="Cond. Comp." 
                                                        labelCol={{ span: 6 }} 
                                                        wrapperCol={{ span: 18 }}>
                                                        <Form.Item name="COD_CONDICION_COMPRA" className="form-input-group-cod" >
                                                            <Input  
                                                                onKeyDown={handleKeydown}
                                                                onChange={handleInputChange}
                                                                className="requerido"
                                                                ref={refCodCondicionCompra}
                                                                // onFocus={handleFocus}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item name="DESC_CONDICION_COMPRA" className="form-input-group-desc" >
                                                            <Input disabled/>
                                                        </Form.Item>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item label="Límit. Rendición" 
                                                        name="CANT_DIA_ANT"
                                                        labelCol={{ span: 10 }} 
                                                        wrapperCol={{ span: 14 }}>
                                                        <Input  
                                                            onKeyDown={handleKeydown}
                                                            onChange={handleInputChange}
                                                            ref={refCantDiaAnt}
                                                            // onFocus={handleFocus}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={16}>

                                                    <Form.Item label="Mon." 
                                                        labelCol={{ span: 6 }} 
                                                        wrapperCol={{ span: 18 }}>

                                                        <Form.Item name="COD_MONEDA" className="form-input-group-cod" >
                                                            <Input  
                                                                onKeyDown={handleKeydown}
                                                                onChange={handleInputChange}
                                                                ref={refCodMoneda}
                                                                className="requerido"
                                                                // onFocus={handleFocus}
                                                                />
                                                        </Form.Item>
                                                        <Form.Item name="DESC_MONEDA" className="form-input-group-desc" >
                                                            <Input disabled/>
                                                        </Form.Item>

                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                        <Form.Item 
                                                            name="IND_PRIORIDAD" 
                                                            label="Prioridad/Compra" 
                                                            labelCol={{ span: 10 }} 
                                                            wrapperCol={{ span: 14 }}
                                                            >
                                                        <Select 
                                                            ref={refIndPrioridad} allowClear
                                                            initialvalues="N"
                                                            onChange={ async(e)=>{
                                                                modifico();
                                                                var row = await gridCab.current.instance.getDataSource()._items[getRowIndex()];
                                                                if(row.InsertDefault){
                                                                    row.inserted = true;
                                                                    row.InsertDefault = false;
                                                                }else if(!row.inserted) row.updated = true;
                                                                row.IND_PRIORIDAD = e;
                                                            }}>
                                                                <Select.Option value="N">Ninguna   </Select.Option>
                                                                <Select.Option value="S">Semanal   </Select.Option>
                                                                <Select.Option value="Q">Quincenal </Select.Option>
                                                                <Select.Option value="M">Mensual   </Select.Option>
                                                                <Select.Option value="A">Anual     </Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>                                                
                                            </Row>                                    
                                        </Col>
                                        <Col span={6}>
                                            <div style={{ paddingLeft: "10px" }}>
                                                <Card>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Form.Item
                                                                name="IND_DIF_PRECIO"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndDifPrecio} > Permite Precio Diferente </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                         <Col span={12}>
                                                            <Form.Item
                                                                name="EXENTO"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refExento} > Exento </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="IND_TRANSPORTISTA"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndTransportista} > Transportista </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="DIRECTO"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refDirector} > Directo </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="IND_DESPACHANTE"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndespachante}> Despachante </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="IND_LOCAL"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndLocal}> Local </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="IND_CAJA_CHICA"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndCajaChica} > Caja Chica </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="IND_RETENCION_IVA"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndRetencionIva} > Ret. IVA </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="IND_REPARTO"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndReparto} > Ir a Reparto </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="IND_EXPORTADOR"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndExportador} > Exportador </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                name="IND_ODC"
                                                                valuePropName="checked"
                                                                onKeyDown={handleKeydown}
                                                                onChange={ (e)=> handleCheckbox(e,["S","N"]) }
                                                            >
                                                                <Checkbox ref={refIndOdc} > Exige ODC </Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>                                                
                                                </Card>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Tabs 
                                    // activeKey={tabKey}
                                    onChange={handleTabChange}
                                    type="card"
                                    size={"small"}>
                                    {/* <TabPane tab="Proveedores de Foz Global" key="1"> */}
                                        {/* <DevExtremeDet
                                            gridDet={gridDet}
                                            id="CMPROVEC_DET"
                                            IDCOMPONENTE="CMPROVEC_DET"
                                            columnDet={columns_det}
                                            initialRow={initialRow_det}
                                            FormName={FormName}
                                            guardar={guardar}
                                            newAddRow={true}
                                            deleteDisable={false}
                                            activateF6={false}
                                            // columnModal={columnModal_Segmentacion}
                                            activateF10={false}
                                            setActivarSpinner={setActivarSpinner}
                                            altura={'130px'}
                                            notOrderByAccion={notOrderByAccion_det}
                                            doNotsearch={doNotsearch_cab_det}
                                            // buscadorGrid={true}
                                            setUpdateValue={setUpdateValue_det}
                                        /> */}
                                    {/* </TabPane> */}
                                    <TabPane tab="Contactos" key="2">
                                        <DevExtremeDet
                                            gridDet={gridCont}
                                            id="CMPROVEC_CONT"
                                            IDCOMPONENTE="CMPROVEC_CONT"
                                            columnDet={columns_contacto}
                                            initialRow={initialRow_cont}
                                            FormName={FormName}
                                            newAddRow={true}
                                            activateF10={false}
                                            activateF6={false}
                                            setActivarSpinner={setActivarSpinner}
                                            altura={'130px'}
                                            doNotsearch={doNotsearch_cab_cont}
                                            notOrderByAccion={notOrderByAccion_cont}
                                            setUpdateValue={setUpdateValue_det}                           
                                        />
                                    </TabPane>
                                </Tabs>
                                <Row style={{ marginTop:'10px' }}>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Creado por."
                                            name="COD_USUARIO"
                                            labelCol={{ span: 10 }}
                                            wrapperCol={{ span: 14 }}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Fecha"
                                            name="FEC_ALTA"
                                            labelCol={{ span: 10 }}
                                            wrapperCol={{ span: 14 }}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Modificado"
                                            name="MODIFICADO_POR"
                                            labelCol={{ span: 10 }}
                                            wrapperCol={{ span: 14 }}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            label="Fecha"
                                            name="FEC_MODIFICACION"
                                            labelCol={{ span: 10 }}
                                            wrapperCol={{ span: 14 }}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                               </Row>
                           </Form>
                           
                        </div> 
                    </Main.Paper>
                </div>
            </Main.Layout>
        </Main.Spin>
    );
});

export default CMPROVEC;