import React, { useEffect, useState } from "react";
import Main                           from "../../../../../components/utils/Main";
import { message }                    from 'antd';
// --- DECLARACION DE VARIABLES
const Titulo            = "Ciudades";
const url_lista         = '/bs/ciudad/';
const urlBuscador       = "/bs/ciudades/search";
const columBuscador     = 'DESCRIPCION';
const doNotsearch       = ['ACCION'];
const notOrderByAccion  = ['ACCION'];
const idACCION          = 'ACCIONES';
const columns = [
	{ ID: 'COD_CIUDAD'	        , label: 'Codigo'   	, width: 100    },
	{ ID: 'DESCRIPCION'   		, label: 'Descripcion' 	, minWidth: 200 },
  	{ ID: 'DESC_PAIS'   		, label: 'Pais'         , minWidth: 100 },
  	{ ID: 'DESC_DEPARTAMENTO'	, label: 'Departamento' , minWidth: 50  },
  	{ ID: 'ABREVIATURA'   		, label: 'Abreviatura'  , minWidth: 100 },
  	{ ID: 'COD_ZONA'   		    , label: 'Zona'     	, minWidth: 100 },
];
const defaultOpenKeys     = ['BS','BS-BS1'];
const defaultSelectedKeys = ['BS-BS1-null-BSCIUDAD'];
const FormName            = 'BSCIUDAD';

export default () => {  
    const url_base      = '/bs/ciudades/';
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
            if(info.data.rows){
                setRows(info.data.rows);    
            }
            setActivarSpinner(false);
        } catch (error) {
            console.log(error);
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
                    showModal("",()=>handleCancel,"OK",()=>handleCancel,response.data.p_mensaje,"error","¡Error!",5000);
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
                <Main.Spin size="large" spinning={activarSpinner} >
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
                </Main.Spin>
            </Main.Layout>
        </>
    );
}