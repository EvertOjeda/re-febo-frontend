import React from "react";
import _ from 'underscore';
import * as XLSX from 'xlsx'
import { UploadOutlined } from '@ant-design/icons';
import guardarIcon from '../../../assets/icons/diskette.svg';
import cancelarIcon from '../../../assets/icons/iconsCancelar.svg';
import agregarIcon2 from '../../../assets/icons/download2.svg';
import { Upload, message, Button, Col, Row } from 'antd';
import { modifico } from './ButtonCancelarUpload';
import { VerificaPermiso } from "../VerificaPermiso";
import './ButtonUpload.css';
const ButtonUpload = ({ guardar, cancelar, agregar, setDatos, id, FormName }) => {
  const cancelarComponente = () => {
    cancelar()
  }
  const handleupload = (info) => {
    if (info.file.status !== 'uploading') {
      let reader = new FileReader()
      reader.readAsArrayBuffer(info.fileList[0].originFileObj)
      reader.onloadend = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: true });
        var csv = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
        workbook.SheetNames.forEach(function (sheetName) {
          if (csv.test(info.file.name)) {
            var XL_row_object = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
            let json = JSON.parse(csvJSON(XL_row_object))
            setDatos(json)
            modifico(id);
            message.success(`${info.file.name} subido con éxito`);
          } else {
            let hojas1 = []
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              for (let i = 0; i < XL_row_object.length; i++) {
                const items = XL_row_object[i];
                items.ID = i;
                items.COD_EMPRESA = sessionStorage.getItem('cod_empresa');
                items.COD_USUARIO = sessionStorage.getItem('cod_usuario');
                hojas1.push(items);
              }
            if(XL_row_object.length > 0){
              setDatos(hojas1)
              modifico(id);
              message.success(`${info.file.name} subido con éxito`);
            }
          }
        })
      }
    }
  }
  function csvJSON(csv) {
    var lines = csv.split("\n");
    console.log(lines);
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length - 1; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
        obj.COD_EMPRESA = sessionStorage.getItem('cod_empresa');
        obj.COD_USUARIO = sessionStorage.getItem('cod_usuario');
      }
      result.push(obj);
    }
    return JSON.stringify(result); //JSON
  }
  return (
    <>
      <div className="paper-header-menu">
        <Row >
          <Col span={24}>
            <Row>
              <Upload
                action="#"
                type='file'
                accept=".csv,.xlsx,.xls"
                listType="picture"
                maxCount={1}
                onChange={handleupload}>
                <Button style={{ width: '220px', textAlign: 'center', marginRight:'4px' }} icon={<UploadOutlined />}>Haga clic para cargar</Button>
              </Upload>
              <Button
                icon={<img src={agregarIcon2} width="25" style={{ marginBottom: '5px', }} />}
                className="paper-header-menu-button agregar "
                onClick={agregar} 
              />
              <Button
                icon={<img src={guardarIcon} width="20" style={{ marginBottom: '5px', }} />}
                className="paper-header-menu-button"
                disabled={VerificaPermiso(FormName)[0].insertar == 'S' ? false : true}
                onClick={guardar}
              />
              <Button
                style={{ marginLeft: '5px' }}
                icon={<img src={cancelarIcon} width="25" />}
                className={`${id}-cancelar button-cancelar-ocultar-visible button-cancelar-upload`}
                onClick={cancelarComponente} 
              />
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ButtonUpload;