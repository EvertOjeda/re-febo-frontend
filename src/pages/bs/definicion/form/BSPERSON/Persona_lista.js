import React, { useEffect, useState } from "react";
import Main                           from "../../../../../components/utils/Main";
import { message, Spin }              from 'antd';
// --- DECLARACION DE VARIABLES
const Titulo            = "Personas";
const url_lista         = '/bs/persona/';
const urlBuscador       = "/bs/personas/search";
const columBuscador     = 'NOMBRE';
const doNotsearch       = ['ACCION'];
const notOrderByAccion  = ['ACCION'];
const idACCION          = 'ACCIONES';
const columns = [
    { ID: "COD_PERSONA"     , label: "Codigo"           , width:100 },
    { ID: "NOMBRE"          , label: "Nombre"           , maxWidth:200 },
    { ID: "NOMB_FANTASIA"   , label: "Nombre Fantasia"  , maxWidth:200 },
    { ID: "COD_IDENT"       , label: "Tip. Doc,"        , width:100 },
    { ID: "RUC"             , label: "RUC"              , width:100 },
    { ID: "NRO_DOCUMENTO"   , label: "Nro. Documento"   , width:150 },
    { ID: "DIRECCION"       , label: "Dirección"        , maxWidth:300 },
];
const defaultOpenKeys     = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS','BS-BS1'];
const defaultSelectedKeys = sessionStorage.getItem("mode") == 'vertical' ? [] : ['BS-BS1-null-BSPERSON'];
const FormName            = 'BSPERSON';
export default () => {
    const url_base      = '/bs/personas/';
    const cod_empresa   = sessionStorage.getItem('cod_empresa');
    const username      = sessionStorage.getItem('username');
    const [ rows              , setRows             ] = useState({});
    const [ rowsDelete        , setRowsDelete       ] = useState();
    const [ visible           , setVisible          ] = useState(false);
    const [ mensaje           , setMensaje          ] = useState();
    const [ imagen            , setImagen           ] = useState();
    const [ tituloModal       , setTituloModal      ] = useState();
    const [ positiveButton    , setPositiveButton   ] = useState();
    const [ negativeButton    , setNegativeButton   ] = useState();
    const [ positiveAction    , setPositiveAction   ] = useState();
    const [ negativeAction    , setNegativeAction   ] = useState();
    const [ activarSpinner    , setActivarSpinner   ] = useState(true);
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            var url     = url_base;
            var method  = "GET";
            var info   = await Main.Request(url,method,[]);
            setRows(info.data.rows);
            setActivarSpinner(false);
        } catch (error) {
            console.log( error.response.data.message + ' Obs: ' + error.response.data.table );
        }
    };
    const handleDelete = async() => {
        var url                 = url_base;
        var method              = 'POST';
        var id                  = await Main.getDeletedId().ID;
        var data                = await rowsDelete.filter((item) => (item.ID == id));
        data[0]['TIPO']         = 'D'; 
        data[0]['USERNAME']     = username;
        data[0]['COD_EMPRESA']  = cod_empresa;
        await Main.Request( url, method, data[0] ).then(async( response ) => {
            if(response.status == 200){
                if(response.data.ret == 1) {
                    handleCancel();
                    setRows(rows.filter((item) => ( item.ID != id )));
                    message.success('Procesado correctamente');
                }else{
                    handleCancel();
                    showModal("",()=>handleCancel,"OK",()=>handleCancel,response.data.p_mensaje,"error","¡Error!");
                }
            }else{
                handleCancel();
                showModal("",()=>handleCancel,"OK",()=>handleCancel,"Ocurrio un error al eliminar.","error","¡Error!");
            }
        });
    };
    const showModal = (positiveButon, positiveAct, negativeButon,negativeAct,mensajeModal,imagenModal,tituloModal) => {
        setMensaje(mensajeModal);
        setPositiveAction(positiveAct);
        setPositiveButton(positiveButon);
        setNegativeAction(negativeAct);
        setNegativeButton(negativeButon);
        setImagen(imagenModal);
        setTituloModal(tituloModal);
        setVisible(true);
    };
    const modalEliminar = (e) => {
        showModal("SI", () => borrar ,"NO", () => handleCancel , "¿Estas seguro de eliminar?","alerta","¡Atención!");
    }
    const borrar = ()=>{
        setTimeout(handleDelete,100);
    }
    const handleCancel = () => {
        setVisible(false);
    };
    return (
        <>
            <Main.ModalDialogo 
                positiveButton={positiveButton}
                positiveAction={positiveAction}
                negativeButton={negativeButton}
                negativeAction={negativeAction}
                onClose={handleCancel}
                setShow={visible}
                title={tituloModal}
                imagen={imagen}
                mensaje={mensaje}/>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${Titulo}` }/>
                <Spin size="large" spinning={activarSpinner}>
                    <Main.ListView 
                        data={rows}
                        setData={setRowsDelete}
                        columns={columns}
                        formLocation={url_lista}
                        title={Titulo}
                        eliminar={modalEliminar}
                        urlBuscador={urlBuscador}
                        columBuscador={columBuscador}
                        doNotsearch={doNotsearch}
                        notOrderByAccion={notOrderByAccion} 
                        columnID="ID"
                        setDeleteId={Main.setDeletedId}
                        idACCION={idACCION}
                        formName={FormName}/>
                </Spin> 
            </Main.Layout>
        </>
    );
};