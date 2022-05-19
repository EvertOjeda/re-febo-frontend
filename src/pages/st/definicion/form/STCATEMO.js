import React, { memo }      from 'react';
import Main                 from '../../../../components/utils/Main';
import { Tabs, Typography } from "antd";
import DevExtremeUpload     from '../../../../components/utils/DevExtrmeUpload/DevExtremeUpload';
const columns_Marc_Categ_Seg = [
    { ID: 'COD_ARTICULO'   , label: 'Articulo'     , width:    80   , align:'left'   , disable:true },
    { ID: 'DESC_ARTICULO'  , label: 'Descripción'  , minWidth: 100  , align:'left'   , disable:true },
    { ID: 'COD_MARCA'      , label: 'Marca'        , width:    80   , align:'left'   , disable:true },
    { ID: 'DESC_MARCA'     , label: 'Descripción'  , minWidth: 100  , align:'left'   , disable:true },
    { ID: 'COD_LINEA'      , label: 'Categoria'    , width:    80   , align:'left'   , disable:true },
    { ID: 'DESC_LINEA'     , label: 'Descripción'  , minWidth: 100  , align:'left'   , disable:true },
    { ID: 'COD_CATEGORIA'  , label: 'Segmentación' , width:    120  , align:'left'   , disable:true },
    { ID: 'DESC_CATEGORIA' , label: 'Descripción'  , minWidth: 100  , align:'left'   , disable:true },
];
const columns_Rubro_Familia = [
    { ID: 'COD_ARTICULO'  , label: 'Articulo'     , width:    80   , align:'left'  , disable:true },
    { ID: 'DESC_ARTICULO' , label: 'Descripción'  , minWidth: 100  , align:'left'  , disable:true },
    { ID: 'COD_RUBRO'     , label: 'Rubro'        , width:    80   , align:'left'  , disable:true },
    { ID: 'DESC_RUBRO'    , label: 'Desc. Rubro'  , minWidth: 100  , align:'left'  , disable:true },
    { ID: 'COD_FAMILIA'   , label: 'Familia'      , width:    80   , align:'left'  , disable:true },
    { ID: 'DESC_FAMILIA'  , label: 'Descripción'  , minWidth: 100  , align:'left'  , disable:true },
];
const { Title }               = Typography;
const FormName                = 'STCATEMO';
const defaultOpenKeys         = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST', 'ST-ST1'];
const defaultSelectedKeys     = sessionStorage.getItem("mode") === 'vertical' ? [] : ['ST-ST1-null-STCATEMO'];
const title                   = 'Modificación de Datos Articulos';
const notOrder_Marc_Categ_Seg = ['']
const notOrder_Rubro_Familia  = ['']
const url_desc_marc_categ_seg = '/st/stcatemo/get_categoria_marca_segmento';
const url_desc_rubro_familia  = '/st/stcatemo/get_rubro_familia';
const STCATEMO = memo(() => {
    // ESTADOS
    const [ activarSpinner, setActivarSpinner ] = React.useState(true);
    const [ tabKey, setTabKey ] = React.useState("1");
    const cod_empresa = sessionStorage.getItem('cod_empresa');
    const cod_usuario = sessionStorage.getItem('cod_usuario');
    React.useEffect(()=>{
        setTimeout(()=>setActivarSpinner(false),30);
    },[])
    //-----------------------Estado Modal mensaje ----------------------------------
    const [visibleMensaje	 , setVisibleMensaje   ] = React.useState(false);
    const [mensaje			 , setMensaje	       ] = React.useState();
    const [imagen			 , setImagen		   ] = React.useState();
    const [tituloModal		 , setTituloModal	   ] = React.useState();
    const Save = async(url,method,data)=>{
        setActivarSpinner(true);
        try {
            await Main.Request(url,method,data).then(async(response)=>{
                var resp = response.data.outBinds
                if(resp.ret == 1){
                    Main.message.success({
                        content  : `Procesado correctamente!!`,
                        className: 'custom-class',
                        duration : `${2}`,
                        style    : {
                        marginTop: '4vh',
                        },
                    });
                }else{
                    showModalMensaje('Atención!','alerta',resp.p_mensaje);
                }
            })                    
        } catch (error) {
            console.log(error)
        }finally{                    
            setActivarSpinner(false);
        }
    }
    const showModalMensaje = (titulo, imagen, mensaje) => {
        setTituloModal(titulo);
        setImagen(imagen);
        setMensaje(mensaje);
        setVisibleMensaje(true);
    };
    const handleCancel = async() => {
        setVisibleMensaje(false)
    }
    const handleTabChange = (value) => {
		setTabKey(value);
	}
    const guardar_Marc_Categ_Seg = (valor)=>{
        var url    = '/st/stcatemo/post_categoria_marca_segmento';
        var method = 'POST';
        var valor  = {'cod_empresa':cod_empresa, 'cod_usuario':cod_usuario, 'valor':valor }
        Save(url,method,valor)
    }
    const guardar_Rubro_Familia = (valor)=>{
        var url    = '/st/stcatemo/post_rubro_familia';
        var method = 'POST';
        var valor  = {'cod_empresa':cod_empresa, 'cod_usuario':cod_usuario, 'valor':valor }
        Save(url,method,valor)
    }
    return (
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
            <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${title}`} />
              <Main.ModalDialogo
                    positiveButton={""}
                    negativeButton={"OK"}
                    negativeAction={handleCancel}
                    onClose={handleCancel}
                    setShow={visibleMensaje}
                    title={tituloModal}
                    imagen={imagen}
                    mensaje={mensaje}
                />
                <div className="paper-header">
                    <Title level={5} className="title-color">
                        {title}
                        <div>
                            <Title level={4} style={{ float: 'right', marginTop: '-16px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</Title>
                        </div>
                    </Title>
                </div>
                <Main.Spin size="large" spinning={activarSpinner} >
                    <div className='paper-container'>
                        <Main.Paper className="paper-style">
                            <Tabs 
                                activeKey={tabKey}
                                onChange={handleTabChange}
                                type="card"
                                size={"small"}>
                                <Tabs.TabPane tab="Mod. Marca/Categoria/Segmento" key="1">
                                    <DevExtremeUpload
                                        id="MARC_CATEG_SEG" //id unico, Requerido para que funcione el cancelar
                                        column={columns_Marc_Categ_Seg}
                                        notOrder={notOrder_Marc_Categ_Seg}												
                                        FormName={FormName}
                                        url_desc={url_desc_marc_categ_seg}
                                        guardar={guardar_Marc_Categ_Seg}
                                        altura={'470'}
                                        setActivarSpinner={setActivarSpinner}
                                    />
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Modificación Rubro/Familia" key="2">
                                    <DevExtremeUpload                                    
                                        id="RUBRO_FAMILIA" // id unico, Requerido para que funcione el cancelar
                                        column={columns_Rubro_Familia}
                                        notOrder={notOrder_Rubro_Familia}
                                        url_desc={url_desc_rubro_familia}												
                                        FormName={FormName}
                                        guardar={guardar_Rubro_Familia}                                    
                                        altura={'470'}
                                        setActivarSpinner={setActivarSpinner}                      
                                    />
                                </Tabs.TabPane>
                            </Tabs>
                        </Main.Paper>
                    </div>
                </Main.Spin>
        </Main.Layout>
    );
});
export default STCATEMO;