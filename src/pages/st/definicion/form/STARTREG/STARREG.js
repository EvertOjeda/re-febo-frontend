import React, { memo }          from 'react';
import Main                     from '../../../../../components/utils/Main';
import _                        from "underscore";
import {Input,  Row,  Col,Form,
    DatePicker, ConfigProvider} from 'antd';
import locale                   from 'antd/lib/locale/es_ES';
import DevExtremeList           from '../../../../../components/utils/ListViewNew/DevExtremeList'

const FormName             = 'STARTREG';
const defaultOpenKeys      = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
const defaultSelectedKeys  = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STARTREG'];
const title                = 'Productos en Regimen de Turismo'

// URL MODAL F9
const url_buscar_prod_reg_turismo = '/st/startreg/valida/articulo'
const url_valida_prod_reg_turismo = '/st/startreg/buscar/articulo'

const columnModal_prod_reg_turismo = {
    urlValidar : [ { COD_ARTICULO    : url_buscar_prod_reg_turismo, }, ],
    urlBuscador: [ { COD_ARTICULO    : url_valida_prod_reg_turismo, }, ],
    title      : [ { COD_ARTICULO    : "Articulo", }, ],
	COD_ARTICULO  : [ { ID: 'COD_ARTICULO'   , label: 'Articulo'     , width: 110      , align:'left'  }, 
                      { ID: 'DESC_ARTICULO'  , label: 'Descripción ' , minWidth: 70    , align:'left'  },
                    ],    
    config     :{
        auto:[]
    },
};

const columns_prod_reg_turismo = [
    { ID: 'COD_ARTICULO'   , label: 'Articulo'     , width: 100     , align:'left'   , editModal:true , requerido:true, Pk:true},
    { ID: 'DESC_ARTICULO'  , label: 'Descripción'  , width: 650     , align:'left'   , disable:true  },
    { ID: 'NRO_NCM'        , label: 'Número NCM'   , maxWidth: 100  , align:'left'   , upper:true    },
    { ID: 'ESTADO'         , label: 'Activo'       , width: 90      , align:'center' , checkbox:true  , checkBoxOptions:["S","N"]},
];
const notOrderByAccion               = ['']
const doNotsearch_prod_reg_turismo   = ['ESTADO']
const columBuscador_prod_reg_turismo = 'DESC_ARTICULO'

// URL GET
const url_prod_reg_turismo = '/st/startreg/'; 
// BUSCADOR
const url_buscador         = `/st/startreg/prod_reg_tur/search`;
// URL ABM
const url_abm              = "/st/startreg";


const STARTREG = memo(() => {

    const buttonSaveRef = React.useRef();
    Main.useHotkeys(Main.Guardar, (e) =>{
        e.preventDefault();
        buttonSaveRef.current.click();
    },{filterPreventDefault:true,enableOnTags:['INPUT','TEXTAREA']});

    const cod_empresa      = sessionStorage.getItem('cod_empresa');
    const cod_usuario      = sessionStorage.getItem('cod_usuario');

    // USEREF
    const [form] = Form.useForm();
    const grid_Fec_estado 	 = React.useRef();

    //STATE
    const [ datosListar      , setDatosListar     ] = React.useState([]);
    const [activarSpinner    , setActivarSpinner  ] = React.useState(false);

    React.useEffect(()=>{
            getData();
    },[])
    const getData = async() =>{
        try {
            var url     = url_prod_reg_turismo+cod_empresa;
            var method  = "GET";
            var data    = {}
            await Main.Request(url,method,data)
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
    const formatFechaAndHora = (date)=>{
        var mesDia   = date.split('/');
        var año      = mesDia[2].split(' ');
        var formato1 = Main.moment(`${año[0]}-${mesDia[1]}-${mesDia[0]} ${año[1]}`).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
        var formato2 = new Date(formato1)
        var formato3 = Main.moment(formato2)
        return formato3
    }
    const focusRowchange = (e)=>{
        var FEC_ESTADO;
        if(e.row.data.updated || e.row.data.inserted){
            FEC_ESTADO = e.row.data.FEC_ESTADO;
        }else{
            FEC_ESTADO  =  e.row.data.FEC_ESTADO !== null ? Main.moment(e.row.data.FEC_ESTADO) : ''
        }
        form.setFieldsValue({
            ...form.getFieldsValue(),
            ['FEC_ESTADO']:  FEC_ESTADO,
            ['COD_USUARIO']: e.row.data.COD_USUARIO
        })
    }
    const setOnRowUpdating=(e)=>{
        if(e.newData.ESTADO){
            e.oldData.FEC_ESTADO  = formatFechaAndHora(Main.moment().format('DD/MM/YYYY H:mm:ss')),
            e.oldData.COD_USUARIO = cod_usuario
         
            form.setFieldsValue({
                ...form.getFieldsValue(),
                ['FEC_ESTADO']: formatFechaAndHora(Main.moment().format('DD/MM/YYYY H:mm:ss')),
                ['COD_USUARIO']: cod_usuario
            })
        }
    }

    return (
        <>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${title}`} />
                    <Main.Spin size="large" spinning={activarSpinner} >
                        <DevExtremeList 
                            data={datosListar}
                            columns={columns_prod_reg_turismo}
                            title={title}
                            notOrderByAccion={notOrderByAccion}
                            doNotsearch={doNotsearch_prod_reg_turismo}
                            columBuscador={columBuscador_prod_reg_turismo}
                            urlBuscador={url_buscador}
                            urlAbm={url_abm}
                            arrayColumnModal={columnModal_prod_reg_turismo}
                            formName={FormName}
                            // --------------------
                            sizePagination={17}
                            height={455}
                            rowFocus={focusRowchange}
                            // --------------------
                            activateheadRadio={true}
                            setOnRowUpdating={setOnRowUpdating}
                        />  
                        <div className="hrDevExtreme" >
                        <Form size="small" form={form} style={{marginTop:'6px', paddingBottom:'15px'}}>
                            <Row >                        
                                <Col span={12} style={{padding:0}} >
                                    <Form.Item label="USUARIO" 
                                        labelCol={{ span: 5 }} 
                                        wrapperCol={{ span: 24 }}>
                                        <Form.Item
                                            name="COD_USUARIO"
                                            className="form-input-group-cod"
                                        >
                                            <Input  
                                                name="COD_USUARIO"
                                                disabled={true}
                                            />
                                        </Form.Item>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <ConfigProvider locale={locale}>
                                        <Form.Item
                                            label="FECHA ESTADO"
                                            name="FEC_ESTADO"
                                            labelCol={{ span: 10 }}
                                            wrapperCol={{ span: 14 }} >
                                            <DatePicker
                                                format="DD/MM/YYYY HH:mm:ss"
                                                ref={grid_Fec_estado}
                                                disabled={true}
                                            />
                                        </Form.Item>
                                    </ConfigProvider>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Main.Spin>
            </Main.Layout>
        </>
    );
});

export default STARTREG;