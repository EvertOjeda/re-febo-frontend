import Main from '../../../../../../components/utils/Main';
import { Form , Input , Row , Col } from 'antd';
const Titulo              = 'Barrios';
const defaultOpenKeys     = ['BS','BS-BS1'];
const defaultSelectedKeys = ['BS-BS1-null-BSBARRIO'];
const FormName            = 'BSBARRIO';
const View = (props) =>{
    return (
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}> 
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
                        <Row gutter={8}>
                            <Col span={12}>
                                <Row gutter={8}>
                                    <Col span={6} >
                                        <Form.Item
                                            label="Pais"
                                            labelCol={{span:16}}
                                            wrapperCol={{span:8}}
                                            >
                                            <Input
                                                name="COD_PAIS"
                                                value={props.parametro.COD_PAIS}
                                                onChange={ (e) => Main.handleInputChange( e, props.setParametro, props.parametro) }
                                                onKeyDown={props.handleFocus}
                                                onBlur={props.handleFocus}
                                                onInput={Main.mayuscula}
                                                id="requerido"
                                                disabled={props.editable}
                                                ref={props.codPaisFocus}
                                                />
                                        </Form.Item>
                                    </Col>
                                    <Col span={18}>
                                        <Form.Item>
                                            <Input
                                                name="DESC_PAIS"
                                                value={props.parametro.DESC_PAIS} 
                                                disabled/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={8}>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Departamento"
                                            labelCol={{span:18}}
                                            wrapperCol={{span:6}}
                                            >
                                            <Input
                                                name="COD_PROVINCIA"
                                                value={props.parametro.COD_PROVINCIA}
                                                onChange={ (e) => Main.handleInputChange( e, props.setParametro, props.parametro) }
                                                onKeyDown={props.handleFocus}
                                                type="number"
                                                className="search_input"
                                                id="requerido"
                                                disabled={props.editable}
                                                ref={props.codProvinciaFocus}
                                                />
                                        </Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Input 
                                                name="DESC_DPTO" 
                                                value={props.parametro.DESC_DPTO}
                                                disabled/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={8}>
                                    <Col span={6} >
                                        <Form.Item
                                            label="Ciudad"
                                            labelCol={{span:16}}
                                            wrapperCol={{span:8}}
                                            >
                                            <Input
                                                name="COD_CIUDAD"
                                                value={props.parametro.COD_CIUDAD}
                                                onKeyDown={props.handleFocus}
                                                onChange={ (e) => Main.handleInputChange( e, props.setParametro, props.parametro) }
                                                type="number"
                                                className="search_input"
                                                disabled={props.editable}
                                                id="requerido"
                                                ref={props.codCiudadFocus}
                                                />
                                        </Form.Item>
                                    </Col>
                                    <Col span={18}>
                                        <Form.Item>
                                            <Input
                                                name="DESC_CIUDAD"
                                                value={props.parametro.DESC_CIUDAD}
                                                disabled/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={8}>
                                    <Col span={8} >
                                        <Form.Item
                                            label="Barrio"
                                            labelCol={{span:18}}
                                            wrapperCol={{span:18}}
                                            >
                                            <Input
                                                name="COD_BARRIO"
                                                value={props.parametro.COD_BARRIO}
                                                type="number"
                                                className="search_input"
                                                onKeyDown={props.handleFocus}
                                                onChange={ (e) => Main.handleInputChange( e, props.setParametro, props.parametro) } 
                                                ref={props.codBarrioFocus}
                                                id="requerido"
                                                />
                                        </Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Input
                                                name="DESCRIPCION"
                                                value={props.parametro.DESCRIPCION}
                                                type="text"
                                                className="search_input"
                                                onKeyDown={props.handleFocus}
                                                onChange={ (e) => Main.handleInputChange( e, props.setParametro, props.parametro) }
                                                onInput={Main.mayuscula}
                                                ref={props.descBarrioFocus}
                                                id="requerido"
                                                />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Main.Paper>
        </div>
        </Main.Layout>
    );
}
export default View;