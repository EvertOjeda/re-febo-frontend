import React, { useState, useRef, memo } from 'react';
import Main            from '../../../../../components/utils/Main';
import DevExpressList   from '../../../../../components/utils/ListViewNew/DevExtremeList';
import { Input, Row, Col, Form}  from 'antd';
import { Paper } from '@material-ui/core';


import '../../../../../assets/css/DevExtreme.css';
import './style.css';

const concepto = {}

const columnsListar = [  
  { ID: 'NRO_DOCUMENTO'           , label: 'Nro documento'          , width: 60     , align:'center'   , requerido:true , Pk:true},
  { ID: 'NOMBRE'                  , label: 'Nombre y Apellido'      , width: 80     , align:'left'     , requerido:true},
  { ID: 'SEXO'                    , label: 'Sexo'                   , width: 50     , align:'center'  },
  { ID: 'ESTADO_CIVIL'            , label: 'Estado civil'           , minWidth: 50  , align:'center'  },
  { ID: 'ZONA_RESIDENCIA'         , label: 'Zona de residencia'     , width: 70     , align:'center'  },
  { ID: 'CELULAR'                 , label: 'Celular'                , minWidth: 50  , align:'center'  },
  { ID: 'EMAIL'                   , label: 'Email'                  , width: 90     , align:'center'  },
  { ID: 'SUCURSAL'                , label: 'Sucursal'               , width: 100    , align:'center'  },
  { ID: 'IND_VACANCIA_INTERES'    , label: 'Vac de interes'         , width: 60     , align:'center'   , requerido:true},
  { ID: 'CONTRATADO'              , label: 'Contratado'             , width: 50     , align:'center'   , checkbox:true  , checkBoxOptions:["S","N"]},
];


const columBuscador         = ['NOMBRE']  // ['NRO_DOCUMENTO'],
const doNotsearch           = ['ZONA_RESIDENCIA','EMAIL','NACIONALIDAD','BARRIO','NIVEL_ESTUDIO','IND_ESTUDIA_HORARIO','IND_EX_FUNCIONARIO'
                                ,'IND_EX_FUNCIONARIO_MOT_SAL', 'SUCURSAL']
const notOrderByAccion      = ['']
const TituloList            = "Lista de postulantes";
var  defaultOpenKeys        = sessionStorage.getItem("mode") === 'vertical' ? [] : ['RH', 'RH-RH1'];
var  defaultSelectedKeys    = sessionStorage.getItem("mode") === 'vertical' ? [] : ['RH-RH1-null-RHPOSTUL'];
const FormName              = 'RHPOSTUL';


const POSTULANTES = memo(() => {

    const cod_empresa           =  sessionStorage.getItem('cod_empresa');
    const url_lista             = `/rh/rhpostul/${cod_empresa}`;
    const url_buscador          = `/rh/rhpostul/search`;
    const url_abm               = "/rh/rhpostul";

    
    const [form]                = Form.useForm();
    //REFERENCIAS
    const aptitudesRef              = React.useRef();
    const pretencionRef             = React.useRef();
    const nacionalidadRef           = React.useRef();
    const tienehijoRef              = React.useRef();
    const direccionRef              = React.useRef();
    const barrioRef                 = React.useRef();
    const telefonoRef               = React.useRef();
    const nivelestudioRef           = React.useRef();
    const estudiaRef                = React.useRef();
    const estudiahoraRef            = React.useRef();
    const movilpropiaRef            = React.useRef();
    const tipomovilRef              = React.useRef();
    const trabajaRef                = React.useRef();
    const motivsalidaRef            = React.useRef();
    const horariorotaRef            = React.useRef();
    const experienciaRef            = React.useRef();
    const exfuncionarioRef          = React.useRef();
    const exfuncionariomotsalRef    = React.useRef();
    const medioconoofertalaboral    = React.useRef(); 

    const [ datosListar      , setDatosListar     ] = React.useState([]);
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
                    setDatosListar(resp.data.response.rows);
                    
                    // console.log(resp.data.response.rows);
                }


            });
        } catch (error) {
            console.log(error);
        }finally{
            setActivarSpinner(false)
        }
    }

    //FILA QUE QUEDA EN FOCUS
    const focusRow = async(e,f9,row)=>{

        if(f9){
            aptitudesRef.current.input.value            = row['APTITUDES']
            pretencionRef.current.input.value           = row['PRETENCION_SALARIAL']
            nacionalidadRef.current.input.value         = row['NACIONALIDAD']
            tienehijoRef.current.input.value            = row['IND_TIENE_HIJO']
            direccionRef.current.input.value            = row['DIRECCION']
            barrioRef.current.input.value               = row['BARRIO']
            telefonoRef.current.input.value             = row['TELEFONO']
            nivelestudioRef.current.input.value         = row['NIVEL_ESTUDIO']
            estudiaRef.current.input.value              = row['IND_ESTUDIA']
            estudiahoraRef.current.input.value          = row['IND_ESTUDIA_HORARIO']
            movilpropiaRef.current.input.value          = row['IND_MOVILIDAD_PROPIA']
            tipomovilRef.current.input.value            = row['IND_TIPO_MOVILIDAD']
            trabajaRef.current.input.value              = row['IND_TRABAJA']
            motivsalidaRef.current.input.value          = row['IND_MOTIVO_SALIDA']
            horariorotaRef.current.input.value          = row['IND_HORARIO_ROTATIVO']
            experienciaRef.current.input.value          = row['EXPERIENCIA_LABORAL']
            exfuncionarioRef.current.input.value        = row['IND_EX_FUNCIONARIO']
            exfuncionariomotsalRef.current.input.value  = row['IND_EX_FUNCIONARIO_MOT_SAL']
            medioconoofertalaboral.current.input.value  = row['MEDIO_CON_OFERTA_LABORAL']
            

            
        }else if(e.row){
            if(e.row.data){                
                aptitudesRef.current.input.value            = e.row.data['APTITUDES']
                pretencionRef.current.input.value           = e.row.data['PRETENCION_SALARIAL']
                nacionalidadRef.current.input.value         = e.row.data['NACIONALIDAD']
                tienehijoRef.current.input.value            = e.row.data['IND_TIENE_HIJO']
                direccionRef.current.input.value            = e.row.data['DIRECCION']
                barrioRef.current.input.value               = e.row.data['BARRIO']
                telefonoRef.current.input.value             = e.row.data['TELEFONO']
                nivelestudioRef.current.input.value         = e.row.data['NIVEL_ESTUDIO']
                estudiaRef.current.input.value              = e.row.data['IND_ESTUDIA']
                estudiahoraRef.current.input.value          = e.row.data['IND_ESTUDIA_HORARIO']
                movilpropiaRef.current.input.value          = e.row.data['IND_MOVILIDAD_PROPIA']
                tipomovilRef.current.input.value            = e.row.data['IND_TIPO_MOVILIDAD']
                trabajaRef.current.input.value              = e.row.data['IND_TRABAJA']
                motivsalidaRef.current.input.value          = e.row.data['IND_MOTIVO_SALIDA']
                horariorotaRef.current.input.value          = e.row.data['IND_HORARIO_ROTATIVO']
                experienciaRef.current.input.value          = e.row.data['EXPERIENCIA_LABORAL']
                exfuncionarioRef.current.input.value        = e.row.data['IND_EX_FUNCIONARIO']
                exfuncionariomotsalRef.current.input.value  = e.row.data['IND_EX_FUNCIONARIO_MOT_SAL']
                medioconoofertalaboral.current.input.value  = e.row.data['MEDIO_CON_OFERTA_LABORAL']




            }else{
                aptitudesRef.current.input.value            = "";
                pretencionRef.current.input.value           = "";
                nacionalidadRef.current.input.value         = "";  
                tienehijoRef.current.input.value            = ""; 
                direccionRef.current.input.value            = "";
                barrioRef.current.input.value               = "";
                telefonoRef.current.input.value             = "";
                nivelestudioRef.current.input.value         = "";
                estudiaRef.current.input.value              = "";
                estudiahoraRef.current.input.value          = "";
                movilpropiaRef.current.input.value          = "";
                tipomovilRef.current.input.value            = "";
                trabajaRef.current.input.value              = "";
                motivsalidaRef.current.input.value          = "";
                horariorotaRef.current.input.value          = "";
                experienciaRef.current.input.value          = "";
                exfuncionarioRef.current.input.value        = "";
                exfuncionariomotsalRef.current.input.value  = "";
                medioconoofertalaboral.current.input.value  = "";

            }
        }else{
            aptitudesRef.current.input.value            = "";
            pretencionRef.current.input.value           = "";
            nacionalidadRef.current.input.value         = "";
            tienehijoRef.current.input.value            = "";
            direccionRef.current.input.value            = "";
            barrioRef.current.input.value               = "";
            telefonoRef.current.input.value             = "";
            nivelestudioRef.current.input.value         = "";
            estudiaRef.current.input.value              = "";
            estudiahoraRef.current.input.value          = "";
            movilpropiaRef.current.input.value          = "";
            tipomovilRef.current.input.value            = "";
            trabajaRef.current.input.value              = "";
            motivsalidaRef.current.input.value          = "";
            horariorotaRef.current.input.value          = "";
            experienciaRef.current.input.value          = "";
            exfuncionarioRef.current.input.value        = "";
            exfuncionariomotsalRef.current.input.value  = "";
            medioconoofertalaboral.current.input.value  = "";


        }

    }


    return (
        <>
            <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
                <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}` }/>
                    <Main.Spin size="large" spinning={activarSpinner} >

                         <DevExpressList 
                            data                = {datosListar}
                            columns             = {columnsListar}
                            title               = {TituloList}
                            notOrderByAccion    = {notOrderByAccion}
                            doNotsearch         = {doNotsearch}
                            columBuscador       = {columBuscador}
                            urlBuscador         = {url_buscador}
                            urlAbm              = {url_abm}
                            formName            = {FormName}
                            height              = {316}
                            noDataText          = "Sin Datos Cargados"
                            rowFocus            = {focusRow}    
                            sizePagination      = {10}
                            
                        >
                        </DevExpressList>

                        <div className="hrDevExtreme" >
                        <Form size="small" form={form} style={{marginTop:'6px', paddingBottom:'15px'}}>
                            <Paper className="paper-style" style={{paddingBottom:5}} >
                                <Row style={{paddingTop:'40px', paddingLeft:'5px'}}>
                                        <Col span={8} style={{padding:0}}>
                                            <Form.Item 
                                                label= "Aptitudes"
                                                labelCol={{ span: 0 }}
												wrapperCol={{ span: 20 }}
                                            >
                                                <Input
                                                    ref={aptitudesRef}
                                                    disabled={true}
                                                    // autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Pretención"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={pretencionRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{ paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Nacionalidad"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 10 }}
                                                >
                                                <Input
                                                    ref={nacionalidadRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>


                                </Row>

                                <Row>
                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Tiene hijos?"
                                                labelCol={{ span: 7 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={tienehijoRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"s
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Dirección"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={direccionRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Barrio"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 10 }}
                                                >
                                                <Input
                                                    ref={barrioRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Teléfono"
                                                labelCol={{ span: 7 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={telefonoRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>
                                </Row>

                                <Row>
                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Nivel de estudio"
                                                labelCol={{ span: 7 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={nivelestudioRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Estudiando?"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={estudiaRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Hora de clases"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 10 }}
                                                >
                                                <Input
                                                    ref={estudiahoraRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Movilidad propia?"
                                                labelCol={{ span: 7 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={movilpropiaRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Tipo de movilidad"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={tipomovilRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Trabaja actualmente?"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 10 }}
                                                >
                                                <Input
                                                    ref={trabajaRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>
                                </Row>

                                <Row>
                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Motivo de salida"
                                                labelCol={{ span: 7 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={motivsalidaRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Disp. Horario Rotativo?"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={horariorotaRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Ex Funcionario?"
                                                labelCol={{ span: 10 }}
												wrapperCol={{ span: 10 }}
                                                >
                                                <Input
                                                    ref={exfuncionarioRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>
                                </Row>

                                <Row>
                                        <Col span={8} style={{paddingLeft:5}}>
                                            <Form.Item 
                                                label= "Medio de Conocimiento de la Oferta"
                                                labelCol={{ span: 15 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={medioconoofertalaboral}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8} style={{paddingLeft:5}}>
                                            

                                            <Form.Item 
                                                label= "Mot. de Salida de la Empresa"
                                                labelCol={{ span: 15 }}
												wrapperCol={{ span: 14 }}
                                                >
                                                <Input
                                                    ref={exfuncionariomotsalRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>
                                </Row>

                                <Row>
                                        <Col span={24} style={{paddingLeft:5}}>
                                            <Form.Item label= "Experiencia Laboral">
                                                <Input
                                                    ref={experienciaRef}
                                                    disabled={true}
                                                    autoComplete="off"
                                                    // className="inputArticuloFamilia"
                                                />
                                            </Form.Item>
                                        </Col>
                                </Row>
                            </Paper>
                        </Form>


                        </div>


            </Main.Spin>
        </Main.Layout>
        </>
    );
});

export default POSTULANTES;