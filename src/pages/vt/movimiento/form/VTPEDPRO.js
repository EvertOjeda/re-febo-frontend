import React, { memo, useState, useRef, useEffect } from 'react';
import { v4 as uuidID } from "uuid";
import { Typography, Form, Input, Row, Col, Radio, Divider, Button, Card} from 'antd';
import _ from 'underscore';
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import Main from "../../../../components/utils/Main";
import { Menu, DireccionMenu } from '../../../../components/utils/FocusDelMenu';
import { getPermisos } from '../../../../components/utils/ObtenerPermisosEspeciales';
import ValidarCamposRequeridos, { QuitarClaseRequerido } from "../../../../components/utils/ValidarCamposRequeridos";
import nuevo        from '../../../../assets/icons/add.svg';
import iconBuscador from '../../../../assets/icons/search-f7.svg'
import deleteIcon   from '../../../../assets/icons/delete.svg';
import guardar      from '../../../../assets/icons/diskette.svg';
import cancelarEdit from '../../../../assets/icons/iconsCancelar.svg';
import left         from '../../../../assets/icons/prev.svg';
import right        from '../../../../assets/icons/next.svg';
import printer      from '../../../../assets/icons/printer.png';
import DevExtremeDet,{
  getBloqueoCabecera, 
  setBloqueoCabecera,
  getFocusGlobalEventDet, 
  getComponenteEliminarDet,
  setbandBloqueoGrid, 
  getbandBloqueoGrid
} from '../../../../components/utils/DevExtremeGrid/DevExtremeDet';
import { modifico, setModifico } from "../../../../components/utils/DevExtremeGrid/ButtonCancelar";
import jsPDF from 'jspdf';
import currency from 'currency.js';
import 'jspdf-autotable';


const notOrderByAccionDet = ["COD_ARTICULO","DESC_ARTICULO","COD_DEPOSITO","COD_DEPOSITO_ENT","COD_UNIDAD_MEDIDA","DESC_UNIDAD_MEDIDA","CANTIDAD","DESC_CAUSA"];
const { Title, Text }    = Typography;
const { TextArea } = Input;
const TituloList = "Pedidos - Provisorios";
const FormName = "VTPEDPRO";

const columns = [{
    ID: "COD_ARTICULO",
    label: "Articulo",
    width: 100,
    // align: "right",
    // isnumber: true,
    disable: true,
    Pk:true
  },
  {
    ID: "DESC_ARTICULO",
    label: "Descripción",
    minWidth: 200,
    align: "left",
    requerido: true,
    upper: true,
  },{
    ID: "COD_UNIDAD_MEDIDA",
    label: "U.M",
    width: 80,
    align: "left",
    upper: true,
  },
  {
    ID: "DESC_UNIDAD_MEDIDA",
    label: "Descripción",
    minWidth: 200,
    align: "left",
    disable: true,
  },
  {
    ID: "CANTIDAD",
    label: "Cantidad",
    width: 120,
    align: "right",
    disable: true,
  },
  { 
    ID: "PRECIO_UNITARIO_C_IVA", 
    label: "Precio Unitario", 
    width: 120, 
    align: "right" 
  },
  {
    ID: "MONTO_TOTAL_CONIVA",
    label: "Monto Total",
    width: 120,
    align: "right",
    disable: true,
  },
];

const VTPEDPRO = memo(() => {

  const defaultOpenKeys     = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
	const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);  
  const PermisoEspecial     = getPermisos(FormName);
  const cod_empresa         = sessionStorage.getItem('cod_empresa');  
  const [ form ]            = Form.useForm();
  const Grid                = useRef();
  const [ activarSpinner, setActivarSpinner ] = useState(false);

  return (
    <>
      {/* MENSAJES */}
      {/* <Main.ModalDialogo
        positiveButton={showMessageButton ? "SI" : ""  }
        negativeButton={showMessageButton ? "NO" : "OK"}
        positiveAction={showMessageButton ? SaveForm : null}
        negativeAction={handleCancel}
        onClose={handleCancel}
        setShow={visibleMensaje}
        title={tituloModal}
        imagen={imagen}
        mensaje={mensaje}
      /> */}
      {/* BUSCADOR */}
      {/* <Main.FormModalSearch
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
      /> */}
      {/* LAYOUT */}
      <Main.Layout
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}>
        <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`}/>
        <Main.Spin size="large" spinning={activarSpinner}>
          <div className="paper-container">
            <Main.Paper className="paper-style">
              <div className="paper-header">        
                <Title level={4} className="title-color">
                  {TituloList}
                  <div level={5} style={{ float:'right', marginTop:'5px', marginRight:'5px', fontSize:'10px'}} className="title-color">{FormName}</div> 
                </Title>
              </div>
              <div className="paper-header-menu">
                <Button 
                  icon={<img src={nuevo} width="25"/>}         
                  className="paper-header-menu-button"
                  // onClick={ () => {
                  //   clearForm();
                  //   initialFormData();
                  // }}
                />
                <Button
                  icon={<img src={guardar} width="20" style={{ marginBottom: '3px', }} />}
                  className="paper-header-menu-button"
                  // onClick={SaveForm}
                  />
                <Button 
                  style={{marginRight:'5px', marginRight:'1px'}}
                  icon={<img src={deleteIcon} width="25"/>}
                  className="paper-header-menu-button" 
                  // onClick={deleteRows}
                />
                <Button
                  id="left-arrow"
                  icon={<img src={left} width="25"  id="left-arrow"/>}
                  className="paper-header-menu-button"
                  // onClick={NavigateArrow}
                />
                <Button 
                  id="right-arrow"
                  icon={<img src={right} width="25" id="right-arrow"/>}
                  className="paper-header-menu-button"
                  // onClick={NavigateArrow}
                />
                <Button
                  id="buscador-f7"
                  icon={<img src={iconBuscador} width="25" id="right-arrow"/>}
                  className="paper-header-menu-button" 
                  // onClick={()=>ManejaF7(true)}
                />
                <Button
                  // style={{marginBottom:'0px'}}
                  icon={<img src={printer} width="22"/>}
                  // icon={<PrinterOutlined />}
                  className="paper-header-menu-button" 
                  // onClick={Reporte}
                />
                <Button 
                  style={{marginLeft:'10px'}}
                  icon={<img src={cancelarEdit} width="25"/>}
                  className="paper-header-menu-button button-cancelar-alternativo button-cancelar-ocultar-visible" 
                  // onClick={cancelar}
                />
              </div>
              <Form autoComplete="off" size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px', marginRight:'20px', marginLeft:'20px'}}>
                <div id="form-div-stenvio">
                  <Row gutter={8}>
                    <Col span={16}>
                      <Form.Item label={<label style={{width:'100px'}}>Sucursal</label>}>
                        <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input requerido"/>
                        </Form.Item>
                        <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'100px'}}>Numero</label>}>
                        <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input requerido"/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'100px'}}>Cliente</label>}>
                        <Form.Item name="COD_CLIENTE" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input requerido"/>
                        </Form.Item>
                        <Form.Item name="NOM_CLIENTE" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Row>
                        <Col span={16}>
                          <Form.Item label={<label style={{width:'100px'}}>Sub Cliente</label>}>
                            <Form.Item name="COD_SUBCLIENTE" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input type="number" className="search_input requerido"/>
                            </Form.Item>
                            <Form.Item name="NOM_SUBCLIENTE" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item name="RUC" label={<label style={{width:'100px'}}>R.U.C</label>}>
                            <Input type="number" className="search_input requerido"/>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={16}>
                          <Form.Item name="DIR_CLIENTE" label={<label style={{width:'100px'}}>Direccion</label>}>
                            <Input type="number" className="search_input requerido"/>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item name="FEC_COMPROBANTE" label={<label style={{width:'100px'}}>Fecha</label>}>
                            <Input type="number" className="search_input requerido"/>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label={<label style={{width:'100px'}}>Cliente Ref.</label>}>
                        <Form.Item name="COD_CLIENTE_REF" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input requerido"/>
                        </Form.Item>
                        <Form.Item name="COD_SUBCLIENTE_REF" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                          <Input disabled/>
                        </Form.Item>
                        <Form.Item name="COD_SUBCLIENTE_REF" style={{width:'calc(100% - 108px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'100px'}}>Tipo Venta</label>} name="ESTADO">
                        <Radio.Group>
                          <Radio value="P">
                            Normal
                          </Radio>
                          <Radio value="C">
                            Directa
                          </Radio>
                          <Radio value="A">
                            Competitiva
                          </Radio>
                          <Radio value="A">
                            Devolución
                          </Radio>
                          <Radio value="A">
                            Averiado/Faltante
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Row>
                        <Col span={16}>
                          <Form.Item label={<label style={{width:'100px'}}>Zona</label>}>
                            <Form.Item name="COD_ZONA" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input type="number" className="search_input requerido"/>
                            </Form.Item>
                            <Form.Item name="DESC_ZONA" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item name="CI" label={<label style={{width:'100px'}}>C.I</label>}>
                            <Input type="number" className="search_input requerido"/>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={16}>
                          <Form.Item label={<label style={{width:'100px'}}>Vendedor</label>}>
                            <Form.Item name="COD_VENDEDOR" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input type="number" className="search_input requerido"/>
                            </Form.Item>
                            <Form.Item name="DESC_VENDEDOR" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item name="TEL_CLIENTE" label={<label style={{width:'100px'}}>Tele</label>}>
                            <Input type="number" className="search_input requerido"/>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label={<label style={{width:'100px'}}>Cond. Venta</label>}>
                        <Form.Item name="COD_CONDICION" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input requerido"/>
                        </Form.Item>
                        <Form.Item name="DESC_CONDICION" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Row>
                        <Col span={16}>
                          <Form.Item label={<label style={{width:'100px'}}>Comp. Ref.</label>}>
                            <Form.Item name="TIP_COMPROBANTE_REF" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input type="number" className="search_input requerido"/>
                            </Form.Item>
                            <Form.Item name="NRO_COMPROBANTE_REF" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item name="NRO_ORDEN_COMPRA" label={<label style={{width:'100px'}}>O.C</label>}>
                            <Input type="number" className="search_input requerido"/>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label={<label style={{width:'100px'}}>Lista de Precios</label>}>
                        <Form.Item name="COD_CONDICION" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input requerido"/>
                        </Form.Item>
                        <Form.Item name="DESC_CONDICION" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Row>
                        <Col span={16}>
                          <Form.Item label={<label style={{width:'100px'}}>Deposito</label>}>
                            <Form.Item name="COD_DEPOSITO" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input type="number" className="search_input requerido"/>
                            </Form.Item>
                            <Form.Item name="DESC_DEPOSITO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item name="COD_TIPO" label={<label style={{width:'100px'}}>Perfil</label>}>
                            <Input type="number" className="search_input requerido"/>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={16}>
                          <Form.Item label={<label style={{width:'100px'}}>Moneda</label>}>
                            <Form.Item name="COD_MONEDA" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input type="number" className="search_input requerido"/>
                            </Form.Item>
                            <Form.Item name="DESC_MONEDA" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                              <Input disabled/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item name="COD_TIPO" label={<label style={{width:'100px'}}>Cam.</label>}>
                            <Input type="number" className="search_input requerido"/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8}>
                      <Main.Fieldset
                        anchoContenedor="100%"
                        alineacionTitle="center"
                        alineacionContenedor="left"
                        margenTop="0px"
                        tamañoTitle="15px"
                        title="Credito"
                        contenedor={
                          <>
                            <Form.Item label={<label style={{width:'100px'}}>Limite de Credito</label>}>
                              <Form.Item name="SIGLAS" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                <Input type="number" className="search_input" />
                              </Form.Item>
                              <Form.Item name="LIMITE_CREDITO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                <Input disabled/>
                              </Form.Item>
                            </Form.Item>
                            <Form.Item name="SALDO" label={<label style={{width:'100px'}}>Saldo Gs.</label>}>
                              <Input type="number" className="search_input" />
                            </Form.Item>
                            <Form.Item name="TOT_SALDO_LIMITE" label={<label style={{width:'100px'}}>Saldo Restante</label>}>
                              <Input type="number" className="search_input" />
                            </Form.Item>
                          </>
                        }
                      />
                      <Main.Fieldset
                        anchoContenedor="100%"
                        alineacionTitle="center"
                        alineacionContenedor="left"
                        margenTop="0px"
                        tamañoTitle="15px"
                        title="Descuento Financiero"
                        contenedor={
                          <>
                            <Form.Item label={<label style={{width:'100px'}}>Limite de Credito</label>}>
                              <Form.Item name="SIGLAS" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                <Input type="number" className="search_input" />
                              </Form.Item>
                              <Form.Item name="LIMITE_CREDITO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                <Input disabled/>
                              </Form.Item>
                            </Form.Item>
                          </>
                        }
                      />
                      <Main.Fieldset
                        anchoContenedor="100%"
                        alineacionTitle="center"
                        alineacionContenedor="left"
                        margenTop="5px"
                        tamañoTitle="15px"
                        title="Descuentos Varios"
                        contenedor={
                          <>
                            <Form.Item label={<label style={{width:'100px'}}>Limite de Credito</label>}>
                              <Form.Item name="SIGLAS" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                                <Input type="number" className="search_input" />
                              </Form.Item>
                              <Form.Item name="LIMITE_CREDITO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                                <Input disabled/>
                              </Form.Item>
                            </Form.Item>
                          </>
                        }
                      />
                      <Form.Item name="COMENTARIO" label={<label style={{width:'120px'}}>Comentario</label>}>
                        <Input className="search_input" />
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col span={8}>
                      <Form.Item label={<label style={{width:'65px'}}>Numero</label>} name="NRO_COMPROBANTE">
                        <Input style={{textAlign:'right'}} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsInputBloqued} ref={nroComprobante}/>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'65px'}}>Fecha</label>} name="FEC_COMPROBANTE">
                        <Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsInputBloqued} ref={fecComprobante}/>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'65px'}}>Cambio U$</label>} name="TIP_CAMBIO_US_FORMAT">
                        <Input disabled={true} className="requerido" style={{textAlign:'right'}}/>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'65px'}}>Estado</label>} name="ESTADO" onChange={handleEstado}>
                        <Radio.Group>
                          <Radio 
                            value="P"
                            onKeyDown={ handleKeyDown }
                            disabled={ IsPendienteBloqued }
                            >
                            Pendiente
                          </Radio>
                          <Radio 
                            value="C"
                            onKeyDown={ handleKeyDown }
                            disabled={ IsCondfirmadoBloqued }
                            >
                            Confirmado
                          </Radio>
                          <Radio 
                            value="A" 
                            onKeyDown={ handleKeyDown }
                            disabled={ IsAnularBloqued }
                            >
                            Anulado
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item label={<label style={{width:'100px'}}>Sucursal</label>}>
                        <Form.Item name="COD_SUCURSAL" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input requerido" onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsInputBloqued} ref={codSucursal}/>
                        </Form.Item>
                        <Form.Item name="DESC_SUCURSAL" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'100px'}}>Motivo</label>}>
                        <Form.Item name="COD_MOTIVO" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input requerido" onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsInputBloqued} ref={codMotivo}/>
                        </Form.Item>
                        <Form.Item name="DESC_MOTIVO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'100px'}}>Comentario</label>} name="COMENTARIO">
                        <TextArea type="number" className="search_input" onChange={handleInputChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={handleFocus} readOnly={IsCommentBloqued} ref={comentario}/>
                      </Form.Item>
                      <Row>
                        <Col span={8}>
                          <Form.Item label={<label style={{width:'100px'}}>Nro. Planilla</label>} name="NRO_PLANILLA">
                            <Input type="number" className="search_input" style={{textAlign:'right'}} onChange={handleInputChange} onKeyDown={handleKeyDown} readOnly={IsInputBloqued}/>
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item label={<label style={{width:'100px'}}>Comp. Ref</label>}>
                            <Form.Item name="TIP_COMPROBANTE_REF" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                              <Input onChange={handleInputChange} onKeyDown={handleKeyDown} readOnly={IsInputBloqued}/>
                            </Form.Item>
                            <Form.Item name="SER_COMPROBANTE_REF" style={{width:'100px',  display:'inline-block', marginRight:'4px'}}>
                              <Input onChange={handleInputChange} onKeyDown={handleKeyDown} readOnly={IsInputBloqued}/>
                            </Form.Item>
                            <Form.Item name="NRO_COMPROBANTE_REF" style={{width:'calc(100% - 160px)', display:'inline-block'}}>
                              <Input type="number" className="search_input" style={{textAlign:'right'}} onChange={handleInputChange} onKeyDown={handleKeyDown} readOnly={IsInputBloqued}/>
                            </Form.Item>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>  
                  </Row> */}
                </div>
                <Row style={{marginBottom:'10px'}}>
                  <Col span={24}>
                    <div id="form-div-stenvio-grid">
                      {/* <Divider orientation="left" style={{margin:'2px 0'}}>Detalle</Divider> */}
                      <DevExtremeDet
                          gridDet={Grid}
                          id="GRID_DETALLE"
                          IDCOMPONENTE="GRID_DETALLE"
                          columnDet={columns}
                          // initialRow={initialRow}
                          notOrderByAccion={notOrderByAccionDet}
                          FormName={FormName}
                          guardar={null}
                          // columnModal={columnModal}
                          activateF10={true}
                          altura={300}
                          newAddRow={true}
                          canDelete={true}
                          // setRowFocusDet={setRowFocusDet} 
                          // setCellChanging={setCellChanging} 
                          // setActivarSpinner={setActivarSpinner}
                          // maxFocus={maxFocus} 
                          // dataCabecera={Data[getIndice()]}
                          // limpiarColumnaRequerida={true}
                        />
                      </div>
                  </Col>
                </Row> 
                <Row>
                  <Col span={8}>
                    
                  </Col>
                </Row>               
                {/* <div id="form-div-stenvio">
                  <Row>
                    <Col span={5}>
                      <Form.Item label={<label style={{width:'70px'}}>Dep. Salida</label>} name="DESC_DEPOSITO">
                        <Input disabled={true}/>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label={<label style={{width:'90px'}}>Dep. Entrada</label>} name="DESC_DEPOSITO_ENT">
                        <Input disabled={true}/>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item label={<label style={{width:'85px'}}>Ultimo</label>} name="COSTO_ULTIMO">
                        <Input disabled={true} style={{textAlign:'right'}}/>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item label={<label style={{width:'85px'}}>Unid. Básica</label>} name="CANTIDAD_UB">
                        <Input disabled={true} style={{textAlign:'right'}}/>
                      </Form.Item>
                    </Col>
                    <Col span={4}> 
                      <Form.Item label={<label style={{width:'90px'}}>Creado por</label>} name="COD_USUARIO">
                        <Input disabled={true}/>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={<label style={{width:'90px'}}>Fec. Alta</label>} name="FEC_ALTA">
                        <Input disabled={true}/>
                      </Form.Item> 
                    </Col>
                  </Row>
                </div> */}
              </Form>
              <Row>
                <Col span={24}>
                  <div className='total_registro_pg' style={{margin:'0px 0px 10px 10px'}}>
                    Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
                  </div>
                </Col>
              </Row>
            </Main.Paper>
          </div>
        </Main.Spin>
      </Main.Layout>
    </>
  );
});

export default VTPEDPRO;