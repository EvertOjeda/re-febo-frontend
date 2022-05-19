import React, { memo, useState, useRef, useEffect } from 'react';
import { Typography, Form, Input, Row, Col, Radio, Divider, Button, Tabs, Select, Checkbox , Table, Space} from 'antd';
import Main from "../../../../components/utils/Main";
import { Menu, DireccionMenu } from '../../../../components/utils/FocusDelMenu';
import { DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import _, { zip } from 'underscore';
import currency from 'currency.js';

import ReactExport from "react-export-excel";
// import {ExcelFile, ExcelSheet} from "react-export-excel";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import { CSVLink } from "react-csv";
import { LegendTitleSubtitle } from 'devextreme-react/chart';
const { Title } = Typography;
const TituloList = "Rotacion de Stock";
const FormName = "STCOMPRA";
const SucursalColumn   = [
  {
    title: ' ',
    dataIndex: 'cod_sucursal',
    width: 30
  },{
    title: 'Descripción',
    dataIndex: 'desc_sucursal',
  },{
    title: 'Deposito',
    dataIndex: 'desc_deposito',
  }
];
const DepositoColumn   = [
  {
    title: ' ',
    dataIndex: 'cod_deposito',
    width: 30
  },{
    title: 'Descripción',
    dataIndex: 'desc_deposito',
  }
];
// VALIDAR
var url_validar_unidad_medida = "/st/stcompra/validar/unidad_medida";
var url_validar_jefe_categoria = "/st/stcompra/validar/jefe_categoria";
var url_validar_articulo = "/st/stcompra/validar/articulo";
var url_validar_proveedor = "/st/stcompra/validar/proveedor";
// BUSCAR
var url_buscar_unidad_medida = "/st/stcompra/buscar/unidad_medida";
var url_buscar_jefe_categoria = "/st/stcompra/buscar/jefe_categoria";
var url_buscar_articulo = "/st/stcompra/buscar/articulo";
var url_buscar_proveedor = "/st/stcompra/buscar/proveedor";
var ValidaInput = [
  {
    input: 'COD_GERENTE_MARK',
    url: url_validar_unidad_medida,
    url_buscar: url_buscar_unidad_medida,
    valor_ant: null,
    out: ['DESC_GERENTE_MKT'],
    data: ['COD_EMPRESA'],
    rel:[],
    next: 'COD_JEFE_CATEGORIA',
    band:true,
    requerido: false,
    grid_next: false
  },
  {
    input: 'COD_JEFE_CATEGORIA',
    url: url_validar_jefe_categoria,
    url_buscar: url_buscar_jefe_categoria,
    valor_ant: null,
    out: ['DESC_JEFE_CATEGORIA'],
    data: ['COD_EMPRESA'],
    rel:[],
    next: 'COD_ARTICULO',
    band:true,
    requerido: false,
    grid_next: false
  },
  {
    input: 'COD_ARTICULO',
    url: url_validar_articulo,
    url_buscar: url_buscar_articulo,
    valor_ant: null,
    out: ['DESC_ARTICULO'],
    data: ['COD_EMPRESA'],
    rel:[],
    next: 'COD_PROVEEDOR',
    band:true,
    requerido: false,
    grid_next: false
  },
  {
    input: 'COD_PROVEEDOR',
    url: url_validar_proveedor,
    url_buscar: url_buscar_proveedor,
    valor_ant: null,
    out: ['DESC_PROVEEDOR'],
    data: ['COD_EMPRESA'],
    rel:[],
    next: 'COD_PROVEEDOR',
    band:true,
    requerido: false,
    grid_next: false
  }
]
// COLUMNAS
const columnUnidadNegocio = [
  { ID: 'COD_GERENTE_MARK', label: 'Código', width:50 },
  { ID: 'DESC_GERENTE_MKT', label: 'Descrición' }
];
const columnJefeCategoria = [
  { ID: 'COD_JEFE_CATEGORIA', label: 'Código', width:50 },
  { ID: 'DESC_JEFE_CATEGORIA', label: 'Descrición' }
];
const columnArticulo = [
  { ID: 'COD_ARTICULO', label: 'Código', width:50 },
  { ID: 'DESC_ARTICULO', label: 'Descrición' }
];
const columnProveedor = [
  { ID: 'COD_PROVEEDOR', label: 'Código', width:50 },
  { ID: 'DESC_PROVEEDOR', label: 'Descrición' }
];
const STCOMPRA = memo(() => {
  const defaultOpenKeys = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
	const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);
  const [ activarSpinner, setActivarSpinner ] = useState(false);
  const [ form ] = Form.useForm();
  const [ Sucursal, setSucursal ] = useState([]);
  const [ SucursalChecked, setSucursalChecked ] = useState([]);
  // const [ Sucursal_ids, setSucursal_ids ] = useState([]);
  const [ Deposito, setDeposito ] = useState([]);
  const [ DataCSV, setDataCSV ] = useState([]);
  // MENSAJES
  const [ showMessageButton, setShowMessageButton ] = useState(false);
  const [ visibleMensaje, setVisibleMensaje ] = useState(false);
  const [ mensaje, setMensaje ] = useState();
  const [ imagen, setImagen ] = useState();
  const [ tituloModal, setTituloModal ] = useState();
  // BUSCADORES
  const [ shows, setShows ] = useState(false);
  const [ modalTitle, setModalTitle ] = useState('');
  const [ searchColumns, setSearchColumns ] = useState({});
  const [ searchData, setSearchData ] = useState([]);
  const [ tipoDeBusqueda, setTipoDeBusqueda ] = useState();
  useEffect( ()=>{
    getSucursal(); 
    getDeposito();
    initialForm();
    setTimeout( ()=>{
      document.getElementById("COD_GERENTE_MARK").focus()
    },200 )
  },[]);
  const initialForm = () => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      COD_EMPRESA: sessionStorage.getItem("cod_empresa"),
      P_DIAS: 30,
      P_ART_ZZ: 'T',
      P_ESTADO: 'T',
      P_TIPO_INFORME: 'P',
      P_TIPO: 'G',
      P_SIZE:'A4',
      IND_ADM: false,
      IND_VENTA: true,
      IND_COMPRA: true,
      P_TIPO_EXPORTACION: 'pdf'
    })
  };
  const getSucursal = async() =>{
    var url = `/st/stcompra/sucursal`;
    await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'lista_de_precio'})
      .then( async(response) =>{
        setSucursal(response.data);
      })
      .catch((error) => {
          console.log(error.response);
      })
  };
  const getDeposito = async() =>{
    var url = `/st/stcompra/deposito`;
    await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'lista_de_precio'})
      .then( async(response) =>{
        setDeposito(response.data);
      })
      .catch((error) => {
          console.log(error.response);
      })
  };
  const getData = async (data, url) => {
		try {
			return await Main.Request(url, "POST", data).then( resp => { return resp.data.rows });
		} catch (error) {
			console.log(error);
      return [];
		}
	};
  const onKeyDown = async(e) => {
    if(e.keyCode == 13 || e.keyCode == 9){
      e.preventDefault();
      switch(e.target.id){
        case "P_DIAS":
          document.getElementById("COD_GERENTE_MARK").focus();
        case "COD_GERENTE_MARK":
          ValidarUnico(e.target.id);
          break;
        case "COD_JEFE_CATEGORIA":
          ValidarUnico(e.target.id);
          break;
        case "COD_ARTICULO":
          ValidarUnico(e.target.id);
          break;
        case "COD_PROVEEDOR":
          ValidarUnico(e.target.id);
          break;
        default:
          console.log('No existe condicion');
      }
    }
    if(e.keyCode == 120){
      e.preventDefault();
      setTipoDeBusqueda(e.target.id);
      switch(e.target.id){
        case "COD_GERENTE_MARK":
          setModalTitle("Unidad de Negocio");
          setSearchColumns(columnUnidadNegocio);
          setSearchData( await getData( {cod_empresa: sessionStorage.getItem('cod_empresa') }, url_buscar_unidad_medida ) );
          setShows(true);
          break;
        case "COD_JEFE_CATEGORIA":
          setModalTitle("Jefe de Categoria");
          setSearchColumns(columnJefeCategoria);
          setSearchData( await getData( {cod_empresa: sessionStorage.getItem('cod_empresa') }, url_buscar_jefe_categoria ) );
          setShows(true);
          break;
        case "COD_ARTICULO":
          setModalTitle("Articulo");
          setSearchColumns(columnArticulo);
          setSearchData( await getData( {cod_empresa: sessionStorage.getItem('cod_empresa') }, url_buscar_articulo )  );
          setShows(true);
          break;
        case "COD_PROVEEDOR":
          setModalTitle("Proveedor");
          setSearchColumns(columnProveedor);
          setSearchData( await getData( {cod_empresa: sessionStorage.getItem('cod_empresa') }, url_buscar_proveedor ) );
          setShows(true);
          break;
        default:
          console.log('No existe condicion')
      }
    }
  }
  // VALIDADORES
  const ValidarUnico = async(input) => {
    let item = await ValidaInput.find( item => item.input == input);
    if(!_.isObject(item)) return;
    if( form.getFieldValue(item.input).trim().length == 0 ){
      item.valor_ant = null;
      item.band = false;
      item.out.map( x => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [x]: ''
        });
      });
      item.rel.map( x => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [x]: ''
        });
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
              });
              item.rel.map( x => {
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  [x]: ''
                });
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
              });
              item.rel.map( x => {
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  [x]: ''
                });
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
  // -- SELECCIONES
  const Sucursal_rowSelection   = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSucursalChecked(selectedRows);
      // setSucursal_ids(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };
  const [selectionType, setSelectionType] = useState('checkbox');
  const execute_report = () => {
    setActivarSpinner(true);
    getReporte();
    
  }
  const getReporte = async() =>{
    if( form.getFieldValue('P_TIPO') == 'G' && form.getFieldValue('P_SIZE') == 'A3'){
      showModalMensaje('¡Atención!','alerta', 'El informe de rotación global solo esta disponible en formato A4.');
      return;
    }
    let Sucursal_ids = [];
    let Deposito_ids = [];
    SucursalChecked.map( item => { Deposito_ids = [ ...Deposito_ids, item.cod_deposito ] } );
    SucursalChecked.map( item => { Sucursal_ids = [ ...Sucursal_ids, item.cod_sucursal ] } );
    if( SucursalChecked.length == 0 ){
      Sucursal.map( item => { Deposito_ids = [ ...Deposito_ids, item.cod_deposito ] } );
    }
    if( SucursalChecked.length == 0 ){
      Sucursal.map( item => { Sucursal_ids = [ ...Sucursal_ids, item.cod_sucursal ] } );
    }
    let url = `/st/stcompra`;
    let data = {
      p_cod_empresa               : sessionStorage.getItem('cod_empresa'),
      p_cod_gerente_mkt           : form.getFieldValue('COD_GERENTE_MARK') ? form.getFieldValue('COD_GERENTE_MARK') : null,
      p_cod_manager               : form.getFieldValue('COD_JEFE_CATEGORIA') ? form.getFieldValue('COD_JEFE_CATEGORIA') : null,
      p_cod_articulo              : form.getFieldValue('COD_ARTICULO') ? form.getFieldValue('COD_ARTICULO') : null,
      p_cod_proveedor             : form.getFieldValue('COD_PROVEEDOR') ? form.getFieldValue('COD_PROVEEDOR') : null,
      p_tipo_informe              : form.getFieldValue('P_TIPO_INFORME'),
      p_art_zz                    : form.getFieldValue('P_ART_ZZ'),
      p_dias                      : form.getFieldValue('P_DIAS'),
      p_estado                    : form.getFieldValue('P_ESTADO'),
      p_tipo                      : form.getFieldValue('P_TIPO'),
      p_ind_adm                   : form.getFieldValue('IND_ADM') ? 'S': 'N',
      p_ind_compra                : form.getFieldValue('IND_COMPRA') ? 'S': 'N',
      p_ind_venta                 : form.getFieldValue('IND_VENTA') ? 'S': 'N',
      p_sin_rotacion              : form.getFieldValue('P_SIN_ROTACION') ? 'S': 'N',
      p_tipo_exportacion          : form.getFieldValue('P_TIPO_EXPORTACION'),
      p_deposito: Deposito_ids,
      p_sucursal: Sucursal_ids
    }
    await Main.Request( url, 'POST',data).then( async(resp) =>{
      if( form.getFieldValue('P_TIPO_EXPORTACION') == 'pdf' ){
        if( form.getFieldValue('P_TIPO') == 'G' ){
          printPDF_f1(resp.data.rows); 
        }else{
          printPDF_f2(resp.data.rows);
        }
      }
      if( form.getFieldValue('P_TIPO_EXPORTACION') == 'csv' ){
        setDataCSV( resp.data.content );
        setTimeout( ()=>{
          document.getElementById('test_csv').click();
          setActivarSpinner(false);
        }, 200 );
      }
      if( form.getFieldValue('P_TIPO_EXPORTACION') == 'excel' ){
        if( form.getFieldValue("P_TIPO") == 'G' ){
          excel_f1(resp.data.rows);
        }
        if( form.getFieldValue("P_TIPO") == 'SD' ){
          excel_f2(resp.data.rows);
        }
      }
    })
  };
  const excel_f1 = async(data) => {
    var columns    =  [
      { dataKey: 'descripcion', header: 'Descripción' },
      { dataKey: 'venta', header: 'Ventas' },
      { dataKey: 'devolucion', header: 'Devolución' },
      { dataKey: 'stock', header: 'Stock' },
      { dataKey: 'transito', header: 'Transito' },
      { dataKey: 'stock_total', header: 'Stock Total' },
      { dataKey: 'sugestion', header: 'Sugestión' },
      { dataKey: 'dias', header: 'Dias' },
    ];
    let html = '';
    html += `<tr><td colspan="${columns.length}" style="font-size:50px;font-weight:bold;text-align:center;">Rotación de Stock</td></tr>`;
    data.map( item => {
      html += `<tr>`;
      columns.map( index => {
        if( item[index.dataKey] != undefined){
          if( index.dataKey == 'descripcion'){
            if( item[index.dataKey].match(/Proveedor:/) != null || item[index.dataKey].match(/Categoría:/) != null){
              html += `<td style="width:700px">${item[index.dataKey]}</td>`;
              let xprueba = Object.keys(item);
              xprueba.map( x => {
                if( x != 'descripcion'){
                  html += `<td colspan="7" style="text-align:center;border:1px solid black;background:#eee;">${item[x]}</td>`;
                }
              });
            }else{
              if( item[index.dataKey].match(/Artículo/) != null || item[index.dataKey].match(/Unid. Neg.:/) != null){ 
                html += `<td style="width:500px;">${item[index.dataKey]}</td>`;
              }else{
                html += `<td style="width:500px;border:1px solid black;">${item[index.dataKey]}</td>`;
              }
            }
          }else{
            html += `<td style="width:100px;border:1px solid black;">${item[index.dataKey]}</td>`;
          }
        } 
      });
      html += `</tr>`;
    });
    document.getElementById("table-to-xls").innerHTML = html;
    document.getElementById("test-table-xls-button").click();
    setActivarSpinner(false);
  }
  const excel_f2 = async(data) => {
    let colum_len = 0;
    let key = [];
    var test = data.filter( item => item.descripcion.includes('Artículo'));
    test.map(item => {
      if( Object.keys(item).length > colum_len){
        colum_len = Object.keys(item).length;
        key = item;
      } 
    });
    let columns = [];
    Object.keys(key).map( item => {
      columns = [ ...columns, {dataKey: item, header: key[item]} ]
    });
    let html = '';
    html += `<tr><td colspan="${columns.length}" style="font-size:50px;font-weight:bold;text-align:center;">Rotación de Stock</td></tr>`;
    data.map( item => {
      html += `<tr>`;
      columns.map( index => {
        if( item[index.dataKey] != undefined){
          if( index.dataKey == 'descripcion'){
            if( item[index.dataKey].match(/Proveedor:/) != null || item[index.dataKey].match(/Categoría:/) != null){
              html += `<td style="width:700px">${item[index.dataKey]}</td>`;
              let xprueba = Object.keys(item);
              xprueba.map( x => {
                if( x != 'descripcion'){
                  html += `<td colspan="6" style="text-align:center;border:1px solid black;background:#eee;">${item[x]}</td>`;
                }
              });
            }else{
              if( item[index.dataKey].match(/Artículo/) != null || item[index.dataKey].match(/Unid. Neg.:/) != null){ 
                html += `<td style="width:500px;">${item[index.dataKey]}</td>`;
              }else{
                html += `<td style="width:500px;border:1px solid black;">${item[index.dataKey]}</td>`;
              }
            }
          }else{

            html += `<td style="width:100px;border:1px solid black;">${item[index.dataKey]}</td>`;
          }
        } 
      });
      html += `</tr>`;
    });
    document.getElementById("table-to-xls").innerHTML = html;
    document.getElementById("test-table-xls-button").click();
    setActivarSpinner(false);
  }
  const printPDF_f1 = async(data) =>{
    setTimeout( ()=> setActivarSpinner(false), 500 );
    let info = data;
    // UNIDAD DE NEGOCIO
    let unidad_negocio = '';
    if(form.getFieldValue('COD_GERENTE_MARK')?.length == 0 || form.getFieldValue('COD_GERENTE_MARK') == undefined) unidad_negocio = 'Todos'
    else unidad_negocio = form.getFieldValue('COD_GERENTE_MARK') + ' - ' + form.getFieldValue('DESC_GERENTE_MKT')

    let unidad_negocio_len = unidad_negocio.length;
    unidad_negocio = unidad_negocio.trim().substring(0,48);
    if(unidad_negocio_len > 48){
      unidad_negocio += '...';
    }
    
    // JEFE DE CATEGORIA
    var jefe_categoria = '';
    if(form.getFieldValue('COD_GERENTE_MARK')?.length == 0 || form.getFieldValue('COD_JEFE_CATEGORIA') == undefined) jefe_categoria = 'Todos';
    else jefe_categoria = form.getFieldValue('COD_JEFE_CATEGORIA') + ' - ' + form.getFieldValue('DESC_JEFE_CATEGORIA')

    let jefe_categoria_len = jefe_categoria.length;
    jefe_categoria = jefe_categoria.trim().substring(0,48);
    if(jefe_categoria_len > 48){
      jefe_categoria += '...';
    }

    // ARTICULO
    var articulo = '';
    if(form.getFieldValue('COD_ARTICULO')?.length == 0 || form.getFieldValue('COD_ARTICULO') == undefined) articulo = 'Todos';
    else articulo = form.getFieldValue('COD_ARTICULO') + ' - ' + form.getFieldValue('DESC_ARTICULO')

    let articulo_len = articulo.length;
    articulo = articulo.trim().substring(0,48);
    if(articulo_len > 48){
      articulo += '...';
    }

    // PROVEEDOR
    var proveedor = '';
    if(form.getFieldValue('COD_PROVEEDOR')?.length == 0 || form.getFieldValue('COD_PROVEEDOR') == undefined) proveedor = 'Todos';
    else proveedor = form.getFieldValue('COD_PROVEEDOR') + ' - ' + form.getFieldValue('DESC_PROVEEDOR')

    let proveedor_len = proveedor.length;
    proveedor = proveedor.trim().substring(0,48);
    if(proveedor_len > 48){
      proveedor += '...';
    }

    // DEPOSITO
    var deposito = '';
    let Deposito_ids = [];
    SucursalChecked.map( item => { Deposito_ids = [...Deposito_ids, item.cod_deposito] } );
    if( Deposito_ids.length > 0 ){
      await Deposito_ids.map( async (item, orden) => {
        let dep = await Deposito.find( i => i.key == item);
        if(orden == 0) deposito += `${dep.cod_deposito} - ${dep.desc_deposito}`;
        else deposito += `, ${dep.cod_deposito} - ${dep.desc_deposito}`;
      })
    }else{
      deposito = 'Todos';
    }

    let deposito_len = deposito.length;
    deposito = deposito.trim().substring(0,100);
    if(deposito_len > 100){
      deposito += '...';
    }

    var paper_size =  'A4'; //paperSize;
    var columns    =  [
      { dataKey: 'descripcion'  , header: 'Descripcion' },
      { dataKey: 'venta'        , header: 'Ventas'      },
      { dataKey: 'devolucion'   , header: 'Devolucion'  },
      { dataKey: 'stock'        , header: 'Stock'       },
      { dataKey: 'transito'     , header: 'Transito'    },
      { dataKey: 'stock_total'  , header: 'Stock Total' },
      { dataKey: 'sugestion'    , header: 'Sugestion'   },
      { dataKey: 'dias'         , header: 'Dias'        },
    ];
    var top = 0;
    var tableWidth = '';
    if(paper_size == 'A4'){
        if(columns.length < 12){
            tableWidth = 'wrap';
        }else{
            tableWidth = 'auto';
        }
        top = 75;
    }else{
        if(columns.length <= 20){
            tableWidth = 'wrap';
        }else{
            tableWidth = 'auto';
        }
        top = 75;
    }
    var pdfDoc          = new jsPDF('', 'pt', paper_size);
    var totalPagesExp   = "{total_pages_count_string}";
    // table body
    pdfDoc.autoTable({
        showHead: 'never',
        theme: 'plain',
        columns: columns,
        body: info,
        tableWidth:tableWidth,
        styles: {
          overflow: 'linebreak',
          fontSize: 7,
          cellPadding: 2,
          halign: 'right',
          cellWidth: 40,
          textColor: [10,10,10],
          overflow: 'ellipsize'
        },
        columnStyles:{
          0: {halign: 'left', cellWidth:285}
        },
        margin:{top:top, left:15, right:15, bottom:25},
        // Header
      didDrawPage: function (data) {
          // pdfDoc.addImage(logo_negro, 'png', 15, 15,80,30);
          // pdfDoc.addImage( process.env.REACT_APP_BASEURL + sessionStorage.getItem("ruta_logo")  , 'png', 15, 15,80,30);
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.text('Fecha: ' + Main.moment().format('DD/MM/YYYY HH:mm:ss'),15,20,'left');
        
          var str = "Página " + data.pageCount;
          if (typeof pdfDoc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
          }

          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.text(str,15,27,'left');

          pdfDoc.setFontSize(7);
          pdfDoc.setTextColor(40);
          pdfDoc.text(sessionStorage.getItem("desc_empresa"),(pdfDoc.internal.pageSize.getWidth() / 2),20,'center');

          pdfDoc.setFontSize(10);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text('Rótacion de Stock ',(pdfDoc.internal.pageSize.getWidth() / 2),30,'center');
          
          pdfDoc.setLineWidth(1);
          pdfDoc.setDrawColor(30,30,30);
          pdfDoc.line(15, 32, pdfDoc.internal.pageSize.getWidth() - 15, 32, 'S');
          
          pdfDoc.setFont(undefined, 'normal');

          // PRIMERA COLUMNA
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Artículo: ',15,42, 'left');
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(articulo, 60, 42, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Proveedor: ', 15,51,'left');
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(proveedor, 60, 51, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Deposito: ',15,60,'left');
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(deposito, 60, 60, 'left');

          // SEGUNDA COLUMNA
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Unid. Neg.: ', 300, 42, 'left');
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(unidad_negocio, 350, 42, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Jefe Cat.: ', 300, 51,'left');
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(jefe_categoria, 350, 51, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Ventas de los últimos: ', 465, 60,'left');
          pdfDoc.text('dia/s', 580, 60,'right');

          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.text( form.getFieldValue('P_DIAS').toString() , 550, 60,'center');
          pdfDoc.line(15, 65, pdfDoc.internal.pageSize.getWidth() - 15, 65, 'S')
      },
      willDrawCell: function(data) {
        var rows = data.row.raw.descripcion;
        rows = rows.trim();
        if(rows.match(/Proveedor:/) != null || rows.match(/Categoría:/) != null){
          pdfDoc.setFont(undefined, 'bold')
          pdfDoc.setTextColor(60, 60, 60)
          pdfDoc.setFontSize(7);
          if(rows.match(/Proveedor:/) != null || rows.match(/Categoría:/) != null){
            if (data.section === 'body' && data.column.index == 5) {
              pdfDoc.setLineWidth(0.5);
              pdfDoc.setDrawColor(30,30,30);
              pdfDoc.setFillColor(210, 210, 210);
              pdfDoc.rect(data.cell.x - 160, data.cell.y, 280,  12, 'F');
              pdfDoc.rect(data.cell.x - 160, data.cell.y, 280,  12, 'S');
              pdfDoc.rect(data.cell.x - 160, data.cell.y + 12, 280,  12, 'S');
              pdfDoc.text(data.row.raw.sucursal, data.cell.x - 50, data.cell.y + 8);
            }
          }
        }else{
          if(rows.match(/Artículo /) != null){
            pdfDoc.setFont(undefined, 'bold')
            pdfDoc.setTextColor(60, 60, 60)
          }else{
            // pdfDoc.setTextColor(80,80,80)
            if (data.section === 'body' && data.column.index == 0){
              pdfDoc.setLineWidth(0.5);
              pdfDoc.setDrawColor(30,30,30);
              pdfDoc.rect(data.cell.x, data.cell.y, data.column.width,  12, 'S');
            }
            if (data.section === 'body' && data.column.index == 1){
              pdfDoc.setLineWidth(0.5);
              pdfDoc.setDrawColor(30,30,30);
              pdfDoc.rect(data.cell.x, data.cell.y, data.column.width * 7,  12, 'S');
            }
          }
        }
      },
      // didParseCell: function (data) {
      //   var rows = data.row.raw.descripcion;
      //   if( rows.match(/Proveedor:/) == null && rows.match(/Categoría:/) == null  && rows.match(/Artículo /) == null && rows.trim().length > 0 ){
      //     let s = data.cell.styles;
      //     s.lineColor = [30,30,30];
      //     s.lineWidth = 0.5;
      //   }
      // }
    });
    if (typeof pdfDoc.putTotalPages === 'function') {
      pdfDoc.putTotalPages(totalPagesExp);
    }
    // pdfDoc.save('rotacion_de_stock_' + Main.moment().format('DD_MM_YYYY') + '.pdf');
    window.open(pdfDoc.output('bloburl'));
  };
  const printPDF_f2 = async(data) =>{
    setTimeout( ()=> setActivarSpinner(false), 500 ); 
    let info = data;
    // UNIDAD DE NEGOCIO
    let unidad_negocio = '';
    if(form.getFieldValue('COD_GERENTE_MARK')?.length == 0 || form.getFieldValue('COD_GERENTE_MARK') == undefined) unidad_negocio = 'Todos'
    else unidad_negocio = form.getFieldValue('COD_GERENTE_MARK') + ' - ' + form.getFieldValue('DESC_GERENTE_MKT')
    
    // JEFE DE CATEGORIA
    let jefe_categoria = '';
    if(form.getFieldValue('COD_GERENTE_MARK')?.length == 0 || form.getFieldValue('COD_JEFE_CATEGORIA') == undefined) jefe_categoria = 'Todos';
    else jefe_categoria = form.getFieldValue('COD_JEFE_CATEGORIA') + ' - ' + form.getFieldValue('DESC_JEFE_CATEGORIA')

    // ARTICULO
    let articulo = '';
    if(form.getFieldValue('COD_ARTICULO')?.length == 0 || form.getFieldValue('COD_ARTICULO') == undefined) articulo = 'Todos';
    else articulo = form.getFieldValue('COD_ARTICULO') + ' - ' + form.getFieldValue('DESC_ARTICULO')

    // ARTICULO
    let proveedor = '';
    if(form.getFieldValue('COD_PROVEEDOR')?.length == 0 || form.getFieldValue('COD_PROVEEDOR') == undefined) proveedor = 'Todos';
    else proveedor = form.getFieldValue('COD_PROVEEDOR') + ' - ' + form.getFieldValue('DESC_PROVEEDOR')

    // DEPOSITO
    let deposito = '';
    if( SucursalChecked.length > 0 ){
      SucursalChecked.map( async (item, orden) => {
        if(orden == 0) deposito += `${item.cod_deposito} - ${item.desc_deposito}`;
        else deposito += `, ${item.cod_deposito} - ${item.desc_deposito}`;
      });
    }else{
      deposito = 'Todos';
    }

    // SUCURSAL
    let sucursal = '';
    if( SucursalChecked.length > 0 ){
      SucursalChecked.map( async (item, orden) => {
        if(orden == 0) sucursal += `${item.cod_sucursal} - ${item.desc_sucursal}`;
        else sucursal += `, ${item.cod_sucursal} - ${item.desc_sucursal}`;
      })
    }else{
      sucursal = 'Todos';
    }

    let colum_len = 0;
    let key = [];
    var test = data.filter( item => item.descripcion.includes('Artículo'));
    test.map(item => {
      if( Object.keys(item).length > colum_len){
        colum_len = Object.keys(item).length;
        key = item;
      } 
    });
    let columns = [];
    Object.keys(key).map( item => {
      columns = [ ...columns, {dataKey: item, header: key[item]} ]
    });
    var top = 75;
    var tableWidth = 'wrap';
    var pdfDoc = new jsPDF('l', 'pt', columns.length > 20 ? 'A3' : form.getFieldValue('P_SIZE') );
    var totalPagesExp = "{total_pages_count_string}";
    pdfDoc.autoTable({
        showHead: 'never',
        theme: 'plain',
        columns: columns,
        body: info,
        tableWidth:tableWidth,
        styles: {
          fontSize: 5,
          cellPadding: 1,
          halign: 'right',
          cellWidth: 25,
          textColor: [10,10,10],
          overflow: 'ellipsize'
        },
        columnStyles:{
          0: {halign: 'left', cellWidth:170}
        },
        margin:{top:top, left:15, right:15, bottom:25},
        didDrawPage: function (data) {
          // pdfDoc.addImage(logo_negro, 'png', 15, 15,80,30);
          // pdfDoc.addImage( process.env.REACT_APP_BASEURL + sessionStorage.getItem("ruta_logo")  , 'png', 15, 15,80,30);
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.text('Fecha: ' + Main.moment().format('DD/MM/YYYY HH:mm:ss'),15,20,'left');
          var str = "Página " + data.pageCount;
          if (typeof pdfDoc.putTotalPages === 'function') {
              str = str + " de " + totalPagesExp;
          }
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.text(str,15,27,'left');

          pdfDoc.setFontSize(7);
          pdfDoc.setTextColor(40);
          pdfDoc.text(sessionStorage.getItem("desc_empresa"),(pdfDoc.internal.pageSize.getWidth() / 2),20,'center');

          pdfDoc.setFontSize(10);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text('Rótacion de Stock ',(pdfDoc.internal.pageSize.getWidth() / 2),30,'center');
          
          pdfDoc.setLineWidth(1);
          pdfDoc.setDrawColor(30,30,30);
          pdfDoc.line(15, 32, pdfDoc.internal.pageSize.getWidth() - 15, 32, 'S');
          
          pdfDoc.setFont(undefined, 'normal');

          // PRIMERA COLUMNA
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Artículo: ',15,42, 'left');
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(articulo, 60, 42, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Proveedor: ', 15,51,'left');
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(proveedor, 60, 51, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Deposito: ',15,60,'left');
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(deposito, 60, 60, 'left');

          // SEGUNDA COLUMNA
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Unid. Neg.: ', (pdfDoc.internal.pageSize.getWidth() / 2) - 50, 42, 'left');
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(unidad_negocio, pdfDoc.internal.pageSize.getWidth() / 2, 42, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Jefe Cat.: ', (pdfDoc.internal.pageSize.getWidth() / 2) - 50, 51,'left');
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(jefe_categoria, pdfDoc.internal.pageSize.getWidth() / 2, 51, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Sucursal: ', (pdfDoc.internal.pageSize.getWidth() / 2) - 50, 60,'left');
          pdfDoc.setFontSize(6);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.text(sucursal, pdfDoc.internal.pageSize.getWidth() / 2, 60, 'left');

          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text('Ventas de los últimos: ', pdfDoc.internal.pageSize.getWidth() - 140, 30,'left');
          pdfDoc.text('dia/s', pdfDoc.internal.pageSize.getWidth() - 20, 30,'right');

          pdfDoc.setFont(undefined, 'bold');
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(40);
          pdfDoc.text( form.getFieldValue('P_DIAS').toString() , pdfDoc.internal.pageSize.getWidth() - 55, 30,'center');
          
          pdfDoc.setFontSize(7);
          pdfDoc.setTextColor(40);
          pdfDoc.setFont(undefined, 'normal');
          pdfDoc.text( form.getFieldValue('SIN_ROTACION') ? 'Incluir artículos sin rotación' : 'No incluir artículos sin rotación' , pdfDoc.internal.pageSize.getWidth() - 140, 39,'left');
          pdfDoc.text( form.getFieldValue('IND_ADM') ? 'Incluir artículos ADM y MKT' : 'No trae los artículos ADM y MKT' ,  pdfDoc.internal.pageSize.getWidth() - 140, 47,'left');
          pdfDoc.text( form.getFieldValue('IND_COMPRA') ? 'Solo trae los artículos que se compran' : 'No trae artículos que se compran' ,  pdfDoc.internal.pageSize.getWidth() - 140, 55,'left');
          pdfDoc.text( form.getFieldValue('IND_VENTA') ? 'Solo trae los artículos que se venden' : 'No trae artículos que se venden',  pdfDoc.internal.pageSize.getWidth() - 140, 63,'left');

          pdfDoc.line(15, 65, pdfDoc.internal.pageSize.getWidth() - 15, 65, 'S')
      },
      willDrawCell: function(data) {
        var rows = data.row.raw.descripcion;
        rows = rows.trim();
        if(rows.match(/Unid. Neg.:/) != null || rows.match(/Categoría:/) != null || rows.match(/Proveedor:/) != null){
          pdfDoc.setFont(undefined, 'bold')
          pdfDoc.setTextColor(60, 60, 60)
          pdfDoc.setFontSize(7);
          if(rows.match(/Proveedor:/) != null || rows.match(/Categoría:/) != null){
            if (data.section === 'body' && data.column.index == 3) {
              pdfDoc.setLineWidth(0.2);
              pdfDoc.setDrawColor(0,0,0);
              pdfDoc.setFillColor(210, 210, 210);
              pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'F');
              pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'S');
              pdfDoc.rect(data.cell.x - 50, data.cell.y + 8, 150,  7.5,'S');
              pdfDoc.text(data.row.raw['0-sucursal'], data.cell.x, data.cell.y + 7);
            }
            if (data.section === 'body' && data.column.index == 9) {
              if( data.row.raw['1-sucursal'] != undefined ){
                pdfDoc.setLineWidth(0.2);
                pdfDoc.setDrawColor(0,0,0);
                pdfDoc.setFillColor(210, 210, 210);
                pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'F');
                pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'S');
                pdfDoc.rect(data.cell.x - 50, data.cell.y + 8, 150,  7.5,'S');
                pdfDoc.text(data.row.raw['1-sucursal'], data.cell.x, data.cell.y + 7);
              }
            }
            if (data.section === 'body' && data.column.index == 15) {
              if( data.row.raw['2-sucursal'] != undefined ){
                pdfDoc.setLineWidth(0.2);
                pdfDoc.setDrawColor(0,0,0);
                pdfDoc.setFillColor(210, 210, 210);
                pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'F');
                pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'S');
                pdfDoc.rect(data.cell.x - 50, data.cell.y + 8, 150,  7.5,'S');
                pdfDoc.text( data.row.raw['2-sucursal'], data.cell.x, data.cell.y + 7);
              }
            }
            if (data.section === 'body' && data.column.index == 21){
              if( data.row.raw['3-sucursal'] != undefined ){
                pdfDoc.setLineWidth(0.2);
                pdfDoc.setDrawColor(0,0,0);
                pdfDoc.setFillColor(210, 210, 210);
                pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'F');
                pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'S');
                pdfDoc.rect(data.cell.x - 50, data.cell.y + 8, 150,  7.5,'S');
                pdfDoc.text(data.row.raw['3-sucursal'], data.cell.x, data.cell.y + 7);
              }
            }
            if (data.section === 'body' && data.column.index == 27) {
              if( data.row.raw['4-sucursal'] != undefined ){
                pdfDoc.setLineWidth(0.2);
                pdfDoc.setDrawColor(0,0,0);
                pdfDoc.setFillColor(210, 210, 210);
                pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'F');
                pdfDoc.rect(data.cell.x - 50, data.cell.y, 150,  8, 'S');
                pdfDoc.rect(data.cell.x - 50, data.cell.y + 8, 150,  7.5,'S');
                pdfDoc.text(data.row.raw['4-sucursal'], data.cell.x, data.cell.y + 7);
              }
            }
          }
        }else{
          if(rows.match(/Artículo /) != null){
            pdfDoc.setFont(undefined, 'bold')
            pdfDoc.setTextColor(10, 10, 10)
          }else{
            if (data.section === 'body' && data.column.index == 0){
              pdfDoc.setLineWidth(0.2);
              pdfDoc.setDrawColor(0,0,0);
              pdfDoc.rect(data.cell.x, data.cell.y, data.column.width,  7.7, 'S');
            }
            if (data.section === 'body' && data.column.index == 1){
              pdfDoc.setLineWidth(0.2);
              pdfDoc.setDrawColor(0,0,0);
              pdfDoc.rect(data.cell.x, data.cell.y, data.column.width * 6,  7.7, 'S');
            }
            if (data.section === 'body' && data.column.index == 7){
              pdfDoc.setLineWidth(0.2);
              pdfDoc.setDrawColor(0,0,0);
              let key = data.column.dataKey;
              let value = data.row.raw[key];
              if(value != undefined) pdfDoc.rect(data.cell.x, data.cell.y, data.column.width * 6,  7.7, 'S');
            }
            if (data.section === 'body' && data.column.index == 13){
              pdfDoc.setLineWidth(0.2);
              pdfDoc.setDrawColor(0,0,0);
              let key = data.column.dataKey;
              let value = data.row.raw[key];
              if(value != undefined) pdfDoc.rect(data.cell.x, data.cell.y, data.column.width * 6,  7.7, 'S');
            }
            if (data.section === 'body' && data.column.index == 19){
              pdfDoc.setLineWidth(0.2);
              pdfDoc.setDrawColor(0,0,0);
              let key = data.column.dataKey;
              let value = data.row.raw[key];
              if(value != undefined) pdfDoc.rect(data.cell.x, data.cell.y, data.column.width * 6,  7.7, 'S');
            }
            if (data.section === 'body' && data.column.index == 25){
              pdfDoc.setLineWidth(0.2);
              pdfDoc.setDrawColor(0,0,0);
              let key = data.column.dataKey;
              let value = data.row.raw[key];
              if(value != undefined) pdfDoc.rect(data.cell.x, data.cell.y, data.column.width * 6,  7.7, 'S');
            }
            pdfDoc.setTextColor(10,10,10)
          }
        }
      },
      // didParseCell: function (data) {
      //   var rows = data.row.raw.descripcion;
      //   if( ( rows.match(/Unid. Neg.:/) == null && rows.match(/Proveedor:/) == null && rows.match(/Categoría:/) == null)  && rows.match(/Artículo /) == null ){
      //     if( data.row.raw[data.column.dataKey] != undefined ){ 
      //       let s = data.cell.styles;
      //       s.lineColor = [30,30,30];
      //       s.lineWidth = 0.5; 
      //     } 
        // }
      // }
    });
    if (typeof pdfDoc.putTotalPages === 'function') {
        pdfDoc.putTotalPages(totalPagesExp);
    }
    // pdfDoc.save('rotacion_de_stock_' + Main.moment().format('DD_MM_YYYY') + '.pdf');
    window.open(pdfDoc.output('bloburl'));
  };
  // MENSAJES
  const showModalMensaje = (titulo, imagen, mensaje) => {
    setTituloModal(titulo);
    setImagen(imagen);
    setMensaje(mensaje);
    setVisibleMensaje(true);
  };
  const handleCancel = async() => {
		setVisibleMensaje(false);
    setActivarSpinner(false);
	};
  // BUSCADORES
  const modalSetOnClick = async (datos, BusquedaPor) => {
    if(datos !== "" || datos !== undefined){
      let info = ValidaInput.find( item => item.input == BusquedaPor );
      if(info.valor_ant != datos[0]){
        // JUNTAR EL CODIGO, CON EL RETORNO DEL VALIDA
        let keys = [ info.input, ...info.out ];
        keys.map(( item, index) => {
          // FORM
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [item]: datos[index] 
          });
        });
        // LIMPIAR DATOS RELACIONADOS
        info.rel.map(( item ) => {
          // FORM
          form.setFieldsValue({
            ...form.getFieldsValue(),
            [item]: '' 
          });
        });
      }
      setTimeout( ()=>{ document.getElementById(info.next).focus() }, 200 )
    }
    showsModal(false)
  };
  const onInteractiveSearch = async(event) => {
    let valor = event.target.value;
    let data = {'cod_empresa': sessionStorage.getItem('cod_empresa') ,'valor':valor}
    if(valor.trim().length === 0 ) valor = 'null';
    let info = ValidaInput.find( item => item.input == tipoDeBusqueda );
    let url = info.url_buscar;
    if(valor !== null){
      try {
        await Main.Request(url,'POST',data).then(response => { if( response.status == 200 ) setSearchData(response.data.rows) });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const showsModal = async (valor) => {
    setShows(valor);
  };
  return (
    <Main.Spin id="thingtoclick" size="large" spinning={activarSpinner}>
    {/* MENSAJES */}
    <Main.ModalDialogo
      positiveButton={showMessageButton ? "SI" : ""  }
      negativeButton={showMessageButton ? "NO" : "OK"}
      positiveAction={showMessageButton ? SaveForm : null}
      negativeAction={handleCancel}
      onClose={handleCancel}
      setShow={visibleMensaje}
      title={tituloModal}
      imagen={imagen}
      mensaje={mensaje}
    />
    {/* BUSCADOR */}
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
    <Main.Layout
      defaultOpenKeys={defaultOpenKeys}
      defaultSelectedKeys={defaultSelectedKeys}>
      <Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`}/>
        <div className="paper-container">
          <Main.Paper className="paper-style">
            <div className="paper-header">        
              <Title level={4} className="title-color">
                {TituloList}
                <div level={5} style={{ float:'right', marginTop:'5px', marginRight:'5px', fontSize:'10px'}} className="title-color">{FormName}</div> 
              </Title>
            </div>
            <Form size="small" form={form} style={{marginTop:'10px', paddingBottom:'15px', marginRight:'20px', marginLeft:'20px'}}>
              <Row gutter={[8]}>
                <Col span={8}>
                  <Divider>Sucursal </Divider>
                  <Table
                      rowSelection={{
                          type: selectionType,
                          ...Sucursal_rowSelection,
                      }}
                      size="small"
                      pagination={false}
                      columns={SucursalColumn}
                      dataSource={Sucursal}
                  />
                  <Divider>Incluir</Divider>
                  <div style={{paddingLeft:'15px', paddingBottom:'10px'}}>
                    <Form.Item name="SIN_ROTACION" valuePropName="checked">
                      <Checkbox>
                        Incluir Artículos sin Rotación ?
                      </Checkbox>
                    </Form.Item>
                    <Form.Item name="IND_ADM" valuePropName="checked">
                      <Checkbox>
                        Incluir Artículos Administrativos y Promocionales ?
                      </Checkbox>
                    </Form.Item>
                    <Form.Item name="IND_VENTA" valuePropName="checked">
                      <Checkbox>
                        Solo Artículos que se vende ?
                      </Checkbox>
                    </Form.Item>
                    <Form.Item name="IND_COMPRA" valuePropName="checked">
                      <Checkbox>
                        Solo Artículos que se compra ?
                      </Checkbox>
                    </Form.Item>
                  </div>
                </Col>
                <Col span={16}> 
                  <Row gutter={[8]}>
                    <Col span={24}>
                      <Divider orientation="left">Filtros</Divider>
                      <Form.Item label={<label style={{width:'150px'}}>Unidad de Negocio</label>}>
                        <Form.Item name="COD_GERENTE_MARK" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                          <Input  type="number" className="search_input" onKeyDown={onKeyDown}/>
                        </Form.Item>
                        <Form.Item name="DESC_GERENTE_MKT" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'150px'}}>Jefe de Categoria</label>}>
                        <Form.Item name="COD_JEFE_CATEGORIA" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input" onKeyDown={onKeyDown}/>
                        </Form.Item>
                        <Form.Item name="DESC_JEFE_CATEGORIA" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'150px'}}>Artículo</label>}>
                        <Form.Item name="COD_ARTICULO" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input" onKeyDown={onKeyDown}/>
                        </Form.Item>
                        <Form.Item name="DESC_ARTICULO" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'150px'}}>Proveedor</label>}>
                        <Form.Item name="COD_PROVEEDOR" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input" onKeyDown={onKeyDown}/>
                        </Form.Item>
                        <Form.Item name="DESC_PROVEEDOR" style={{width:'calc(100% - 54px)', display:'inline-block'}}>
                          <Input disabled/>
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label={<label style={{width:'150px'}}> Ventas de los últimos </label>}>
                        <Form.Item name="P_DIAS" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                          <Input type="number" className="search_input" onKeyDown={onKeyDown}/>
                        </Form.Item>
                        <span className="ant-form-text" style={{color:'white'}}> &nbsp;&nbsp;dias</span>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8]}>
                    <Col span={8}>
                      <Divider>Articulos ZZ</Divider>
                      <Form.Item name="P_ART_ZZ">
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value="S">
                              Solo ZZ
                            </Radio>
                            <Radio value="N">
                              Excluir
                            </Radio>
                            <Radio value="T">
                              Todos
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Divider>Agrupar por</Divider>
                      <Form.Item name="P_TIPO_INFORME">
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value="P">
                              Por Proveedor
                            </Radio>
                            <Radio value="C">
                              Por Categoria
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Divider>Estado</Divider>
                      <Form.Item name="P_ESTADO">
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value="A">
                              Activo
                            </Radio>
                            <Radio value="I">
                              Inactivo
                            </Radio>
                            <Radio value="T">
                              Todos
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8]}>
                    <Col span={8}>
                      <Divider>Exportar a </Divider>
                      <Form.Item name="P_TIPO_EXPORTACION">
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value="pdf">
                              PDF
                            </Radio>
                            <Radio value="csv">
                              CSV
                            </Radio>
                            <Radio value="excel">
                              Excel
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Divider>Tamaño de Hoja</Divider>
                      <Form.Item name="P_SIZE">
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value="A4">
                              A4
                            </Radio>
                            <Radio value="A3">
                              A3
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Divider>Tipo </Divider>
                      <Form.Item name="P_TIPO">
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value="SD">
                              Rotación por sucursal
                            </Radio>
                            <Radio value="G">
                              Rotación Global
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col> 
              </Row>
              <Row>
                <Col span={24}>
                  <Divider></Divider>
                  <CSVLink data={DataCSV} id="test_csv" hidden> Download me </CSVLink>
                  <div hidden>
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button"
                      table="table-to-xls"
                      filename={"rotacion_de_stock_" + Main.moment().format('DD_MM_YYYY') }
                      sheet="Rotacion de stock"
                      buttonText="Download as XLS"/>
                    <table id="table-to-xls"></table>
                  </div>
                  <Button 
                    size="large"
                    onClick={execute_report}
                    type="primary" 
                    icon={<DownloadOutlined />}
                    style={{
                        float: 'right',
                    }}>
                    Generar Reporte
                  </Button>
                </Col>
              </Row> 
            </Form>
          </Main.Paper>
        </div>
      </Main.Layout>
    </Main.Spin>
  );
});
export default STCOMPRA;