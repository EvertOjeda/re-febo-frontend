import Main from '../../../../../../components/utils/Main';
import { Form     , Input , Card, 
         Checkbox , Row   , Col } from 'antd';
const Titulo              = 'Opciones de Permisos - Usuarios';
const defaultOpenKeys     = ['BS','BS-BS2','BS-BS2-BS21'];
const defaultSelectedKeys = ['BS-BS2-BS21-BSPERMIS'];
const FormName            = 'BSPERMIS';
const View = (props) =>{
    return (
        <Main.Layout 
            defaultOpenKeys={defaultOpenKeys} 
            defaultSelectedKeys={defaultSelectedKeys}>
            <div className="paper-container">
                <Main.Paper className="paper-style">
                    <Main.TituloForm titulo={Titulo} />                     
                    <Form
                        layout="horizontal"
                        size="small"
                        autoComplete="off">
                        <Main.ButtonForm 
                            dirr={props.dirr} 
                            arrayAnterior={props.arrayAnterior} 
                            arrayActual={props.arrayActual} 
                            direccionar={props.direccionar}
                            isNew={props.isNew}
                            titleModal={props.titleModal}
                            mensajeModal={props.mensajeModal}
                            onFinish={props.onFinish}
                            buttonGuardar={props.buttonGuardar}
                            buttonVolver={props.buttonVolver}
                            formName={FormName}/>
                        <div className="form-container">
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item
                                                label="Usuarios" 
                                                labelCol={{span:8}}
                                                wrapperCol={{span:15}}>
                                                <Input
                                                    name="COD_USUARIO"
                                                    value={props.parametro.COD_USUARIO}                                                  
                                                    onChange={ (e) => Main.handleInputChange( e, props.setParametro, props.parametro) }
                                                    disabled={props.isNewInput}
                                                    onKeyDown={props.handleFocus}
                                                    onInput={Main.mayuscula}
                                                    ref={props.codUsuarioFocus}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item>
                                                <Input
                                                    name="DESC_USUARIO"
                                                    value={props.parametro.DESC_USUARIO}                                             
                                                    onChange={props.handleInputChange}
                                                    disabled={true}
                                                    onKeyDown={props.handleFocus}
                                                    onInput={Main.mayuscula}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item
                                                label="Formulario"
                                                labelCol={{span:10}}
                                                wrapperCol={{span:13}} >
                                                <Input
                                                    name="NOM_FORMA"
                                                    value={props.parametro.NOM_FORMA}                                                  
                                                    onChange={ (e) => Main.handleInputChange( e, props.setParametro, props.parametro) }
                                                    disabled={props.isNewInput}
                                                    onKeyDown={props.handleFocus}
                                                    onInput={Main.mayuscula}
                                                    ref={props.nomFormaFocus}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item>
                                                <Input
                                                    name="DESC_FORMA"
                                                    value={props.parametro.DESC_FORMA}                                                
                                                    onChange={props.handleInputChange}
                                                    disabled={true}
                                                    onKeyDown={props.handleFocus}
                                                    onInput={Main.mayuscula}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item
                                                label="Parametro"
                                                labelCol={{span:8}}
                                                wrapperCol={{span:15}}>
                                                <Input
                                                    name="PARAMETRO"
                                                    value={props.parametro.PARAMETRO}                                                 
                                                    onChange={ (e) => Main.handleInputChange( e, props.setParametro, props.parametro) }
                                                    disabled={props.isNewInput}
                                                    onKeyDown={props.handleFocus}
                                                    onInput={Main.mayuscula}
                                                    ref={props.parametroFocus}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item>
                                                <Input
                                                    name="DESC_PARAMETRO"
                                                    value={props.parametro.DESC_PARAMETRO}                                   
                                                    onChange={props.handleInputChange}
                                                    disabled={true}
                                                    onKeyDown={props.handleFocus}
                                                    onInput={Main.mayuscula}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Estado"
                                        labelCol={{span:4}}
                                        wrapperCol={{span:20}}>
                                        <Card>
                                            <Checkbox  
                                                name="PERMISO"
                                                type="checkbox"
                                                checked={props.parametro.PERMISO === 'S'}
                                                onChange={props.handleCheckbox}
                                                onKeyDown={props.handleFocus}
                                                style={{marginTop:"5px"}}
                                                ref={props.permisoFocus}>
                                                    {props.parametro.PERMISO === 'S' ? 'Activo' : 'Inactivo'}
                                            </Checkbox>
                                        </Card>
                                    </Form.Item>
                                </Col>
                                <hr style={{border: '0.-1px solid #fdffff', width:'100%',marginTop:'10px'}} />
                            </Row>
                        </div>
                    </Form>
                </Main.Paper>
            </div>
        </Main.Layout>
    );
}
export default View;