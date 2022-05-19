import React, { useEffect, useState }   from "react";
import { MyContext }                    from "../../../components/utils/NewLayout";
import { createHtml2ExportTable2Excel } from "../../../components/utils/exportTable2Excel";
import { createHtml2ExportTable2Excel2 } from "../../../components/utils/exportToExcelFileSaver";
import { 
        Table
    ,   Input
    ,   Button
    ,   Typography
    ,   Row
    ,   Col 
    ,   Radio
    ,   Divider
    ,   Select
    ,   Form
    ,   Checkbox 
    ,   Modal
    ,   Spin
    ,   notification
    ,   DatePicker
    ,   Switch 
        } from 'antd';
import { SearchOutlined, PrinterOutlined, FileExcelOutlined } from '@ant-design/icons';
import _ from 'underscore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';
import $ from 'jquery';
import logo_negro  from '../../../assets/img/apolo_negro.png';
import Main from "../../../components/utils/Main";
const { Option } = Select;
const { Title } = Typography;
var first_row_columns = [];
const Titulo  = 'Lista de precios';
const options = [
    { label: 'Familia'  , value: 'familia'  },
    { label: 'Categoria', value: 'categoria'},
    { label: 'Marca'    , value: 'marca'    },
];
const columnListaDePrecio   = [
    {
        title: ' ',
        dataIndex: 'cod_lista_precio',
        width: 30
    },{
        title: 'Descripción',
        dataIndex: 'desc_lista_precio',
    }
];
var children = [];
const dateFormat = 'DD/MM/YYYY';
const defaultOpenKeys     = ['VT','VT-VT3', 'VT-VT3-VT31'];
const defaultSelectedKeys = ['VT-VT3-VT31-VTRLPRE'];
const Reporte = ()=>{    
    const [reporteColumns        , setReporteColumns        ] = useState([]);
    const [reporteRows           , setReporteRows           ] = useState([]);
    const [reporteRowsAux        , setReporteRowsAux        ] = useState([]);
    const [vigencia              , setVigencia              ] = useState( moment().format('DD/MM/YYYY') );
    const [paperSize             , setPaperSize             ] = useState('A3');
    const [pagination            , setPagination            ] = useState(true);
    const [listaDePrecio         , setListaDePrecio         ] = useState([]);
    const [familia               , setFamilia               ] = useState([]);
    const [unidadDeNegocio       , setUnidadDeNegocio       ] = useState([]);
    const [jefeDeCategoria       , setJefeDeCategoria       ] = useState([]);
    const [marca                 , setMarca                 ] = useState([]);
    const [categoria             , setCategoria             ] = useState([]);
    const [rubro                 , setRubro                 ] = useState([]);
    const [proveedor             , setProveedor             ] = useState([]);
    const [tipoProducto          , setTipoProducto          ] = useState([]);
    const [listaDePrecioChecked  , setListaDePrecioChecked  ] = useState([]);
    const [listaDePrecio_ids     , setListaDePrecio_ids     ] = useState([]);
    const [familia_ids           , setFamilia_ids           ] = useState([]);
    const [unidadDeNegocio_ids   , setUnidadDeNegocio_ids   ] = useState([]);
    const [jefeCategoria_ids     , setJefeCategoria_ids     ] = useState([]);
    const [tipoDeProducto_ids    , setTipoDeProducto_ids    ] = useState([]);
    const [marca_ids             , setMarca_ids             ] = useState([]);
    const [rubro_ids             , setRubro_ids             ] = useState([]);
    const [categoria_ids         , setCategoria_ids         ] = useState([]);
    const [proveedor_ids         , setProveedor_ids         ] = useState([]);
    const [groupValue            , setGroupValue            ] = useState('categoria');
    const [loader                , setLoader                ] = useState(true);
    const [codigoBarras          , setCodigoBarras          ] = useState(false);
    const [costo                 , setCosto                 ] = useState(false);
    const [referencia            , setReferencia            ] = useState(false);
    const [iva                   , setIva                   ] = useState(false);
    const [caja                  , setCaja                  ] = useState(false);
    const [margen1               , setMargen1               ] = useState(false);
    const [pvp1                  , setPvp1                  ] = useState(false);
    const [margen2               , setMargen2               ] = useState(false);
    const [pvp2                  , setPvp2                  ] = useState(false);
    const [margen3               , setMargen3               ] = useState(false);
    const [pvp3                  , setPvp3                  ] = useState(false);
    const [cantMinina1           , setCantMinima1           ] = useState(false);
    const [cantMinina2           , setCantMinima2           ] = useState(false);
    const [zz                    , setZZ                    ] = useState(false);
    const [catastroSinVerificar  , setCatastroSinVerificar  ] = useState(false);
    const [sinPrecio             , setSinPrecio             ] = useState(false);
    const [proveedorData         , setProveedorData         ] = useState([]);
    const [unidadDeNegocioData   , setUnidadDeNegocioData   ] = useState([]);
    const [jefeDeCategoriaData   , setjefeDeCategoriaData   ] = useState([]);
    const [marcaData             , setMarcaData             ] = useState([]);
    const [rubroData             , setRubroData             ] = useState([]);
    const [categoriaData         , setCategoriaData         ] = useState([]);
    const [dataExcel             , setDataExcel             ] = useState([]);
    useEffect( ()=>{
        getListaDePrecio();
        getFamilia();
        getUnidadNegocio();
        getJefeDeCategoria();
        getMarca();
        getCategoria();
        getRubro();
        getProveedor();
        getTipoProducto();
    },[]);
    const getListaDePrecio = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'lista_de_precio'})
            .then( async(response) =>{
                setListaDePrecio(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            })
    };
    const getProveedor = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'proveedor'})
            .then( async(response) =>{
                setProveedorData(response.data);
                children = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    children.push(<Option key={element.cod_proveedor + ' - ' + element.desc_proveedor} codigo={element.cod_proveedor}>{element.cod_proveedor + ' - ' + element.desc_proveedor}</Option>);
                }
                setProveedor(children);
            })
    };
    const getUnidadNegocio = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'unidad_de_negocio'})
            .then( async(response) =>{
                setUnidadDeNegocioData(response.data);
                children = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    children.push(<Option key={element.cod_unidad_negocio + ' - ' + element.desc_unidad_negocio} codigo={element.cod_unidad_negocio}>{element.cod_unidad_negocio + ' - ' + element.desc_unidad_negocio}</Option>);
                }
                setUnidadDeNegocio(children);
            })
    };
    const getJefeDeCategoria = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'jefe_de_categoria'})
            .then( async(response) =>{
                setjefeDeCategoriaData(response.data);
                children = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    children.push(<Option key={element.cod_jefe_categoria + ' - ' + element.desc_jefe_categoria} codigo={element.cod_jefe_categoria}>{ element.cod_jefe_categoria + ' - ' + element.desc_jefe_categoria}</Option>);
                }
                setJefeDeCategoria(children);
            })
    };
    const getRubro = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'rubro'})
            .then( async(response) =>{
                setRubroData(response.data);
                children = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    children.push(<Option key={element.cod_rubro + ' - ' + element.desc_rubro} codigo={element.cod_rubro}>{element.cod_rubro + ' - ' + element.desc_rubro}</Option>);
                }
                setRubro(children);
            })
    };
    const getFamilia = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'familia'})
            .then( async(response) =>{
                children = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    children.push(<Option key={element.cod_familia + ' - ' + element.desc_familia} codigo={element.cod_familia}>{element.cod_familia + ' - ' + element.desc_familia}</Option>);
                }
                setFamilia(children);
            })
    };
    const getCategoria = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'categoria'})
            .then( async(response) =>{
                setCategoriaData(response.data);
                children = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    children.push(<Option key={element.cod_categoria + ' - ' + element.desc_categoria} codigo={element.cod_categoria}>{ element.cod_categoria + ' - ' + element.desc_categoria}</Option>);
                }
                setCategoria(children);
                setLoader(false);
            })
    };
    const getMarca = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'marca'})
            .then( async(response) =>{
                setMarcaData(response.data);
                children = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    children.push(<Option key={ element.cod_marca + ' - ' + element.desc_marca} codigo={element.cod_marca}>{ element.cod_marca + ' - ' + element.desc_marca}</Option>);
                }
                setMarca(children);
            })
    };
    const getTipoProducto = async() =>{
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{cod_empresa: sessionStorage.getItem('cod_empresa'), tipo:'tipo_producto'})
            .then( async(response) =>{
                children = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    children.push(<Option key={element.desc_tip_producto} codigo={element.cod_tip_producto}>{element.desc_tip_producto}</Option>);
                }
                setTipoProducto(children);
            })
    };
    const execute_report = () => {
        if( listaDePrecio_ids.length == 0 ){
            openNotificationWithIcon('error','Elegir por lo menos una lista de precio. No sea imbécil.!');
        }else{
            getReporte();
        }
    }
    const getReporte = async() =>{
        first_row_columns = [];
        first_row_columns.push({
            title: '   ARTICULO       ( Código, Descripción )    ',
            dataIndex: 'a_desc_articulo',
            fixed: 'left',
            width:200
        });
        /*
        ========================
            CODIGO DE BARRAS
        ========================
        */
        if(codigoBarras) {
            first_row_columns.push({
                title: 'COD BARRA',
                dataIndex: 'a_cod_barra_art',
                width: 100
            });
        }
        /*
        ========================
            COSTO
        ========================
        */
        if(costo) {
            first_row_columns.push({
                title: 'COSTO APOLO',
                dataIndex: 'a_precio_unid',
                width: 100
            });
        }
        /*
        ========================
            REFERENCIA
        ========================
        */
        if(referencia) {
            first_row_columns.push({
                title: 'REFERENCIA',
                dataIndex: 'a_referencia',
                align: 'left',
                width: 100
            });
        }
        /*
        ========================
            IVA
        ========================
        */
        if(iva) {
            first_row_columns.push({
                title: 'IVA',
                dataIndex: 'a_iva',
                align: 'right',
                width: 100
            });
        }
        for (let c = 0; c < listaDePrecioChecked.length; c++) {
            const item   = listaDePrecioChecked[c];
            var children = [];
            first_row_columns.push({
                title: item.cod_lista_precio + ' - ' + item.desc_lista_precio,
            });
            if(caja){
                children.push({
                    title: 'CAJAS',
                    dataIndex: 'caja_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80
                })
            }
            children.push({
                title: 'UNIDAD',
                dataIndex: 'unidad_' + item.cod_lista_precio,
                align: 'right',
                width: 80
            })
            if(margen1){
                children.push({
                    title: 'MG 1 %',
                    dataIndex: 'mg01_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80
                })
            }
            if(pvp1){
                children.push({
                    title: 'PVP 1',
                    dataIndex: 'a_precio_sug01_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80
                })
            }
            if(margen2){
                children.push({
                    title: 'MG 2 %',
                    dataIndex: 'mg02_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80
                })
            }
            if(pvp2){
                children.push({
                    title: 'PVP 2',
                    dataIndex: 'a_precio_sug02_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80
                })
            }
            if(margen3){
                children.push({
                    title: 'MG 3 %',
                    dataIndex: 'mg03_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80 
                })
            }
            if(pvp3){
                children.push({
                    title: 'PVP 3',
                    dataIndex: 'a_precio_sug03_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80
                })
            }
            if(cantMinina1){
                children.push({
                    title: 'CANT MIN I',
                    dataIndex: 'cantidad_minima_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80
                })
            }
            if(cantMinina2){
                children.push({
                    title: 'CANT MIN II',
                    dataIndex: 'cantidad_minima2_' + item.cod_lista_precio,
                    align: 'right',
                    width: 80
                })
            }
            first_row_columns[first_row_columns.length -1]['children'] = children;
        }
        setLoader(true);
        var url   = `/vt/reporte/lista_de_precio`;
        await Main.Request( url, 'POST',{
                tipo                 : 'reporte', 
                vigencia             : vigencia,
                cod_empresa          : sessionStorage.getItem('cod_empresa'), 
                ListaDePrecio        : listaDePrecio_ids, 
                Proveedor            : proveedor_ids,
                UnidadDeNegocio      : unidadDeNegocio_ids,
                JefeCategoria        : jefeCategoria_ids,
                Rubro                : rubro_ids,
                Marca                : marca_ids,
                TipoDeProducto       : tipoDeProducto_ids,
                Categoria            : categoria_ids,
                Familia              : familia_ids, 
                listaDePrecioChecked : listaDePrecioChecked,
                groupBy              : groupValue,
                zz                   : zz,
                catastroSinVerificar : catastroSinVerificar,
                sinPrecio            : sinPrecio,
                formato              : 'reporte'
            })
            .then( async(response) =>{
                
                console.log(response.data[0].Reporte);
                
                setLoader(false);
                setReporteColumns(first_row_columns);
                setReporteRows(response.data[0].Reporte);
                setReporteRowsAux(response.data[0].Reporte);
                setDataExcel(response.data[0].Data);

                showModal();
            })
    };
    // -- SELECCIONES
    const rowSelectionListaDePrecio   = {
        onChange: (selectedRowKeys, selectedRows) => {
            setListaDePrecioChecked(selectedRows);
            setListaDePrecio_ids(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            name: record.name,
        }),
    };
    const [selectionType, setSelectionType] = useState('checkbox');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal    = () => {
        setIsModalVisible(true );
    };
    const handleOk     = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    function changeProveedor(value, array){
        setProveedor_ids([]);
        var info = [];
        for (let index = 0; index < array.length; index++) {
            info.push(array[index].codigo);
            if(index == array.length -1){
                setProveedor_ids(info);
            }
        }
    }
    function changeUnidadDeNegocio(value, array) {
        setUnidadDeNegocio_ids([]);
        var info = [];
        for (let index = 0; index < array.length; index++) {
            info.push(array[index].codigo);
            if(index == array.length -1){
                setUnidadDeNegocio_ids(info);
            }
        }
    }
    function changeJefeCategoria(value, array) {
        setJefeCategoria_ids([]);
        var info = [];
        for (let index = 0; index < array.length; index++) {
            info.push(array[index].codigo);
            if(index == array.length -1){
                setJefeCategoria_ids(info);
            }
        }
    }
    function changeRubro(value, array) {
        setRubro_ids([]);
        var info = [];
        for (let index = 0; index < array.length; index++) {
            info.push(array[index].codigo);
            if(index == array.length -1){
                setRubro_ids(info);
            }
        }
    }
    function changeFamilia(value, array) {
        setFamilia_ids([]);
        var info = [];
        for (let index = 0; index < array.length; index++) {
            info.push(array[index].codigo);
            if(index == array.length -1){
                setFamilia_ids(info);
            }
        }
    }
    function changeCategoria(value, array) {
        setCategoria_ids([]);
        var info = [];
        for (let index = 0; index < array.length; index++) {
            info.push(array[index].codigo);
            if(index == array.length -1){
                setCategoria_ids(info);
            }
        }
    }
    function changeMarca(value, array) {
        setMarca_ids([]);
        var info = [];
        for (let index = 0; index < array.length; index++) {
            info.push(array[index].codigo);
            if(index == array.length -1){
                setMarca_ids(info);
            }
        }
    }
    function changeTipoDeProducto(value, array) {
        setTipoDeProducto_ids([]);
        var info = [];
        for (let index = 0; index < array.length; index++) {
            info.push(array[index].codigo);
            if(index == array.length -1){
                setTipoDeProducto_ids(info);
            }
        }
    }
    const handleChangeDate = (date, dateString) => {
        setVigencia(dateString)
    }
    const handleChangeGroupBy = (e) => {
        setGroupValue(e.target.value)
    }
    const handleSearch = (e) => {
        if( e.target.value.trim().length > 0 ){
            var info = _.flatten(_.filter( reporteRowsAux, function(item){
                return item.a_desc_articulo.includes( e.target.value.toUpperCase() );
            }));
            setReporteRows(info);
        }else{
            setReporteRows(reporteRowsAux);
        }
    }
    /*
    ===============================
        IMPRIMIR PDF
    ===============================
    */
    const printPDF = () =>{
        var info = [];
        // UNIDAD DE NEGOCIO
        var unidad_negocio = '';
        if(unidadDeNegocio_ids.length == 0){
            unidad_negocio = 'Todas las unidades de negocio.'
        }else{
            info = _.flatten(_.filter(unidadDeNegocioData,function (i) {
                return _.contains(unidadDeNegocio_ids, i.cod_unidad_negocio);
            }));
            for (let index = 0; index < info.length; index++) {
                const element = info[index];
                unidad_negocio += element.cod_unidad_negocio + '-' + element.desc_unidad_negocio;
                if( index != info.length -1){
                    unidad_negocio += ' , '
                }
            }
        }
        // JEFE DE CATEGORIA
        var jefe_categoria = '';
        if(jefeCategoria_ids.length == 0){
            jefe_categoria = 'Todos los jefes de categoria.';
        }else{
            info = _.flatten(_.filter(jefeDeCategoriaData,function (i) {
                return _.contains(jefeCategoria_ids, i.cod_jefe_categoria);
            }));
            for (let index = 0; index < info.length; index++) {
                const element = info[index];
                jefe_categoria += element.cod_jefe_categoria + '-' + element.desc_jefe_categoria;
                if( index != info.length -1){
                    jefe_categoria += ' , '
                }
            }
        }
        // PROVEEDOR
        var proveedor = '';
        if(proveedor_ids.length == 0){
            proveedor = 'Todos los proveedores.'
        }else{
            info = _.flatten(_.filter(proveedorData,function (i) {
                return _.contains(proveedor_ids, i.cod_proveedor);
            }));
            for (let index = 0; index < info.length; index++) {
                const element = info[index];
                proveedor += element.cod_proveedor + '-' + element.desc_proveedor;
                if( index != info.length -1){
                    proveedor += ' , '
                }
            }
        }
        // MARCA
        var marca = '';
        if(marca_ids.length == 0){
            marca = 'Todas las marcas.';
        }else{
            info = _.flatten(_.filter(marcaData,function (i) {
                return _.contains(marca_ids, i.cod_marca);
            }));
            for (let index = 0; index < info.length; index++) {
                const element = info[index];
                marca += element.cod_marca + '-' + element.desc_marca;
                if( index != info.length -1){
                    marca += ','
                }
            }
        }
        // RUBRO
        var rubro = '';
        if(rubro_ids.length == 0){
            rubro = 'Todos los rubros.';
        }else{
            info = _.flatten(_.filter(rubroData,function (i) {
                return _.contains(rubro_ids, i.cod_rubro);
            }));
            for (let index = 0; index < info.length; index++) {
                const element = info[index];
                rubro += element.cod_rubro + '-' + element.desc_rubro;
                if( index != info.length -1){
                    rubro += ' , ';
                }
            }
        }
        // CATEGORIA
        var categoria = '';
        if(categoria_ids.length == 0){
            categoria = 'Todas las categorias.'
        }else{
            info = _.flatten(_.filter(categoriaData,function (i) {
                return _.contains(categoria_ids, i.cod_categoria);
            }));
            for (let index = 0; index < info.length; index++) {
                const element = info[index];
                categoria += element.cod_categoria + '-' + element.desc_categoria;
                if( index != info.length -1){
                    categoria += ' , ';
                }
            }
        }
        var tableHead = $('#Xtable table .ant-table-thead')[0];
        var tableBody = $('#Xtable table .ant-table-tbody')[0];
        var html = ``;
        html += `<table>`;
        html += tableHead.outerHTML;
        html += tableBody.outerHTML;
        html += `</table>`;
        var htmlObject = $(html)[0];
        var paper_size =  paperSize;
        var columns    =  first_row_columns;
        var top        = 0;
        var tableWidth = '';
        if(paper_size == 'A4'){
            if(columns.length < 12){
                tableWidth = 'wrap';
            }else{
                tableWidth = 'auto';
            }
            top = 85;

            if(categoria.length > 29){
                categoria = categoria.substring(0, 29) + '...';
            }

            if(unidad_negocio.length > 29){
                unidad_negocio = unidad_negocio.substring(0, 29) + '...';
            }

            if(jefe_categoria.length > 29){
                jefe_categoria = jefe_categoria.substring(0, 29) + '...';
            }

            if(proveedor.length > 29){
                proveedor = proveedor.substring(0, 29) + '...';
            }

            if(marca.length > 31){
                marca = marca.substring(0, 31) + '...';
            }
            if(rubro.length > 31){
                rubro = rubro.substring(0, 31) + '...';
            }
        }else{
            if(columns.length <= 20){
                tableWidth = 'wrap';
            }else{
                tableWidth = 'auto';
            }
            top = 85;
            if(categoria.length > 48){
                categoria = categoria.substring(0, 48) + '...';
            }
            if(unidad_negocio.length > 48){
                unidad_negocio = unidad_negocio.substring(0, 48) + '...';
            }
            if(jefe_categoria.length > 47){
                jefe_categoria = jefe_categoria.substring(0, 47) + '...';
            }
            if(proveedor.length > 47){
                proveedor = proveedor.substring(0, 47) + '...';
            }
            if(marca.length > 47){
                marca = marca.substring(0, 47) + '...';
            }
            if(rubro.length > 47){
                rubro = rubro.substring(0, 47) + '...';
            }
        }
        var hoy             = moment().format('DD/MM/YYYY HH:mm:ss');
        var fecha_vigencia  = vigencia;
        var pdfDoc          = new jsPDF('l', 'pt', paper_size);
        var totalPagesExp   = "{total_pages_count_string}";
        pdfDoc.autoTable({
            showHead: 'everyPage',
            html: htmlObject,
            tableLineColor: [44, 62, 80],
            tableLineWidth: 0.1,
            tableWidth:tableWidth,
            styles: {
                overflow: 'linebreak',
                fontSize: 6,
                cellPadding: 0.8,
                halign: 'right',
                cellWidth: 44,
                lineColor: [44, 62, 80],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: null,
                fontSize: 5,
                textColor: 44,
                minCellWidth: 15,
                cellWidth:44,
                halign: 'center'
            },
            columnStyles:{0: {halign: 'left', cellWidth:190}},
            margin:{top:top, left:15, right:15, bottom:25},
            didDrawPage: function (data) {
                // pdfDoc.addImage(logo_negro, 'png', 15, 15,80,30);
                pdfDoc.addImage( process.env.REACT_APP_BASEURL + sessionStorage.getItem("ruta_logo")  , 'png', 15, 15,80,30);
                pdfDoc.setFontSize(12);
                pdfDoc.setTextColor(40);
                pdfDoc.text('LISTADO DE PRECIOS',(pdfDoc.internal.pageSize.getWidth() / 2) - 70,30);
                pdfDoc.setFontSize(9);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Fecha Vigencia: ' + fecha_vigencia,15,60);
                var str = "Página " + data.pageCount;
                if (typeof pdfDoc.putTotalPages === 'function') {
                    str = str + " de " + totalPagesExp;
                }
                pdfDoc.setFontSize(9);
                pdfDoc.setTextColor(40);
                pdfDoc.text(str,15,70);
                pdfDoc.setFontSize(9);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Categoria: ' + categoria,((pdfDoc.internal.pageSize.getWidth() / 2) /2),60);
                pdfDoc.setFontSize(9);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Unidad Neg: ' + unidad_negocio,((pdfDoc.internal.pageSize.getWidth() / 2) /2),70);
                pdfDoc.setFontSize(9);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Jefe Categ: ' + jefe_categoria,(pdfDoc.internal.pageSize.getWidth() / 2),60);
                pdfDoc.setFontSize(9);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Proveedor: '  + proveedor,(pdfDoc.internal.pageSize.getWidth() / 2),70);
                pdfDoc.setFontSize(9);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Marca: ' + marca,(pdfDoc.internal.pageSize.getWidth() / 2) + ((pdfDoc.internal.pageSize.getWidth() / 2) /2),60);
                pdfDoc.setFontSize(9);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Rubro: ' + rubro,(pdfDoc.internal.pageSize.getWidth() / 2) + ((pdfDoc.internal.pageSize.getWidth() / 2) /2),70);
                pdfDoc.setLineWidth(0.5);
                pdfDoc.setDrawColor('#424242');
                pdfDoc.line(15, top - 10, pdfDoc.internal.pageSize.getWidth() - 15 , top - 10);
                pdfDoc.setFontSize(6);
                pdfDoc.setTextColor(40);
                pdfDoc.text('Fecha de expedición: ' + hoy + ' Hs.', pdfDoc.internal.pageSize.getWidth() - 150, pdfDoc.internal.pageSize.getHeight() - 15);
            },
            willDrawCell: function(data) {
                var rows = data.row.raw[0].content;
                rows = rows.trim();
                if(rows.match(/FAMILIA:/) != null || rows.match(/JEFE DE CATEGORIA:/) != null || rows.match(/UNIDAD DE NEGOCIO:/) != null || rows.match(/CATEGORIA:/) != null || rows.match(/MARCA:/) != null){
                    pdfDoc.setFillColor(229, 229, 229);
                    pdfDoc.setFontSize(6);
                }else{
                    pdfDoc.setFillColor(255, 255, 255);
                }
            }
        });
        if (typeof pdfDoc.putTotalPages === 'function') {
            pdfDoc.putTotalPages(totalPagesExp);
        }
        pdfDoc.save('lista_precios_' + moment().format('DD_MM_YYYY') + '.pdf');
    };
    /*
    ===============================
        EXCEL
    ===============================
    */
    const exportExcel = () => {
        var rowsExcel = [];
        for (let index = 0; index < dataExcel.length; index++) {
            const element = dataExcel[index];
            rowsExcel.push({
                rubro                   : element.a_cod_rubro + element.a_desc_rubro,
                familia                 : element.a_cod_familia + ' - ' + element.a_desc_fam,
                unidad_de_negocio       : element.cc_gerente_makt,
                brand_manager           : element.cc_desc_manager,
                marca                   : element.cc_cod_marca + ' - ' + element.cc_desc_marca,
                categoria               : element.a_cod_linea + ' - ' + element.a_linea,
                cod_articulo            : element.a_cod_articulo,
                cod_barra               : '`' + element.a_cod_barra_art,
                desc_articulo           : element.a_descripcion_articulo,
                referencia              : element.a_referencia,
                cod_lista_precio        : element.a_cod_lista_precio,
                desc_lista_precio       : element.a_desc_canal,
                proveedor               : element.a_cod_proveedor + ' - ' + element.a_desc_proveedor,
                catastro_verificado     : element.a_ver_catastro,
                iva                     : element.a_cod_iva,
                precio_unitario         : element.a_precio_unid,
                precio_caja             : element.a_precio_caja,
                mgn_I                   : element.a_porc_sug01,
                pvp_I                   : element.a_precio_sug01,
                mgn_II                  : element.a_porc_sug02,
                pvp_II                  : element.a_precio_sug02,
                mgn_III                 : element.a_porc_sug03,
                pvp_III                 : element.a_precio_sug03,
                cant_min_I              : element.a_cantidad_minima,
                cant_min_II             : element.a_cantidad_minima2,
                multiplo                : element.a_multiplo,
            });
        }
        createHtml2ExportTable2Excel2(rowsExcel, 'Lista de precios'); 
    }
    const handlePaperSize = (value) =>{
        setPaperSize( value ? 'A3' : 'A4' );
    }
    const handlePagination = (value) =>{
        setPagination(value);
    }
    const openNotificationWithIcon = (type,message) => {
        notification[type]({
            message: 'Aviso',
            description: message,
        });
    };
    return(
        <Main.Layout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
            <MyContext.Consumer>
                {value => {
                    if( value == 'dark'){
                        return <Modal 
                            title="Listado de precios" 
                            visible={isModalVisible} 
                            onCancel={handleCancel} 
                            width={1300} 
                            footer={null}
                            style={{ top: 20 }}
                            wrapProps={{
                                'data-theme': ['dark']
                            }}
                            >
                            <div id="modal-report-table">
                                <Button type="primary" icon={<PrinterOutlined />} onClick={printPDF}/>
                                <Button type="danger" icon={<FileExcelOutlined />} onClick={exportExcel} style={{
                                    margin:'5px'
                                }}/>
                                <Switch 
                                    checkedChildren="A3" 
                                    unCheckedChildren="A4" 
                                    onChange={handlePaperSize}
                                    defaultChecked 
                                    style={{
                                        marginLeft: '10px',
                                        marginRight: '10px'
                                    }}
                                />
                                <Switch 
                                    checkedChildren="Paginar" 
                                    unCheckedChildren="No Paginar" 
                                    onChange={handlePagination}
                                    defaultChecked 
                                    style={{
                                        marginRight: '10px'
                                    }}
                                />
                                <Input 
                                    prefix={<SearchOutlined />}
                                    onChange={handleSearch}
                                    style={{
                                        width:'200px',
                                        marginBottom:'5px',
                                        float:'right',
                                    }}
                                />
                                <Table
                                    id="Xtable"
                                    rowKey="a_desc_producto"
                                    columns={reporteColumns}
                                    dataSource={reporteRows}
                                    rowClassName={(record, index) => record.color  }
                                    bordered
                                    scroll={{ x: 1250, y: 500}}
                                    pagination={
                                        pagination ? { 
                                        size: 'small',
                                        pageSize: 20,
                                        showSizeChanger:false,
                                        showQuickJumper:false,
                                        position: ['bottomCenter'] 
                                        } : pagination
                                    }
                                />
                            </div>
                        </Modal>
                    }else{
                        return <Modal 
                            title="Listado de precios" 
                            visible={isModalVisible} 
                            onCancel={handleCancel} 
                            width={1300} 
                            footer={null}
                            style={{ top: 20 }}
                            wrapProps={{
                                'data-theme': ['light']
                            }}
                            >
                            <div id="modal-report-table">
                                <Button type="primary" icon={<PrinterOutlined />} onClick={printPDF}/>
                                <Button type="danger" icon={<FileExcelOutlined />} onClick={exportExcel} style={{
                                    margin:'5px'
                                }}/>
                                <Switch 
                                    checkedChildren="A3" 
                                    unCheckedChildren="A4" 
                                    onChange={handlePaperSize}
                                    defaultChecked 
                                    style={{
                                        marginLeft: '10px',
                                        marginRight: '10px'
                                    }}
                                />
                                <Switch 
                                    checkedChildren="Paginar" 
                                    unCheckedChildren="No Paginar" 
                                    onChange={handlePagination}
                                    defaultChecked 
                                    style={{
                                        marginRight: '10px'
                                    }}
                                />
                                <Input 
                                    prefix={<SearchOutlined />}
                                    onChange={handleSearch}
                                    style={{
                                        width:'200px',
                                        marginBottom:'5px',
                                        float:'right',
                                    }}
                                />
                                <Table
                                    id="Xtable"
                                    rowKey="a_desc_producto"
                                    columns={reporteColumns}
                                    dataSource={reporteRows}
                                    rowClassName={(record, index) => record.color  }
                                    bordered
                                    scroll={{ x: 1250, y: 500}}
                                    pagination={
                                        pagination ? { 
                                        size: 'small',
                                        showSizeChanger:false,
                                        showQuickJumper:false,
                                        position: ['bottomCenter'] 
                                        } : pagination
                                    }
                                />
                            </div>
                        </Modal>
                    }
                }}
            </MyContext.Consumer>
            <div className="paper-container">
                <Main.Paper className="paper-style">
                    <Main.TituloForm titulo={Titulo} />
                    <Spin size="large" spinning={loader}>
                    <div className="form-container">
                        <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Divider>Listado de precios </Divider>
                            <Table
                                rowSelection={{
                                    type: selectionType,
                                    ...rowSelectionListaDePrecio,
                                }}
                                size="small"
                                pagination={false}
                                columns={columnListaDePrecio}
                                dataSource={listaDePrecio}
                            />
                        </Col>
                        <Col span={8}>
                            <Divider>Filtros </Divider>
                            <Form 
                                className="login-form"
                                layout="vertical"
                                >
                                <Form.Item label="Proveedor">
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }} 
                                        mode="multiple"
                                        onChange={changeProveedor}
                                        showArrow={true}
                                        >
                                        {proveedor}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Unidad de Negocio">
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }} 
                                        mode="multiple"
                                        onChange={changeUnidadDeNegocio}
                                        showArrow={true}
                                        >
                                        {unidadDeNegocio}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Jefe Categoria">
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }} 
                                        mode="multiple"
                                        onChange={changeJefeCategoria}
                                        showArrow={true}
                                        >
                                        {jefeDeCategoria}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Rubro">
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }} 
                                        mode="multiple"
                                        onChange={changeRubro}
                                        showArrow={true}
                                        >
                                        {rubro}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Familia">
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }} 
                                        mode="multiple"
                                        onChange={changeFamilia}
                                        showArrow={true}
                                        >
                                        {familia}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Categoria">
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }} 
                                        mode="multiple"
                                        onChange={changeCategoria}
                                        showArrow={true}
                                        >
                                        {categoria}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Marca">
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }} 
                                        mode="multiple"
                                        onChange={changeMarca}
                                        showArrow={true}
                                        >
                                        {marca}
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={8}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Form 
                                        className="login-form"
                                        layout="vertical"
                                        >
                                        <Form.Item label="Tipo de Producto">
                                            <Select
                                                allowClear
                                                style={{ width: '100%' }} 
                                                mode="multiple"
                                                onChange={changeTipoDeProducto}
                                                showArrow={true}
                                                >
                                                {tipoProducto}
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </Col>
                                <Col span={12}>
                                    <Form 
                                        className="login-form"
                                        layout="vertical"
                                        >
                                        <Form.Item label="Fecha de Vigencia">
                                            <DatePicker 
                                                onChange={handleChangeDate} 
                                                defaultValue={ moment( moment() ,dateFormat) } 
                                                format={dateFormat}
                                                style={{
                                                    width:'100%'
                                                }}/>
                                        </Form.Item>
                                    </Form>
                                </Col>
                                <Col span={24}>
                                    <Divider>Incluir</Divider>
                                    <Row>
                                        <Col span={12}>
                                            <Checkbox onClick={ ()=>{ setCodigoBarras(!codigoBarras)                } }>Codigo de Barras  </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setCaja(!caja)                                } }>Caja              </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setReferencia(!referencia)                    } }>Refencia          </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setIva(!iva)                                  } }>% IVA             </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setCantMinima1(!cantMinina1)                  } }>Cantidad Minima 1 </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setCantMinima2(!cantMinina2)                  } }>Cantidad Minima 2 </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setSinPrecio(!sinPrecio)                      } }>Productos sin precio</Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setZZ(!zz)                                    } }>Incluir ZZ        </Checkbox><br />
                                        </Col>
                                        <Col span={12}>
                                            <Checkbox onClick={ ()=>{ setPvp1(!pvp1)                                } }>PVP 1                   </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setPvp2(!pvp2)                                } }>PVP 2                   </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setPvp3(!pvp3)                                } }>PVP 3                   </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setMargen1(!margen1)                          } }>% Margen 1              </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setMargen2(!margen2)                          } }>% Margen 2              </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setMargen3(!margen3)                          } }>% Margen 3              </Checkbox><br />
                                            <Checkbox onClick={ ()=>{ setCatastroSinVerificar(!catastroSinVerificar)} }>Catastro sin verificar  </Checkbox><br />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Divider>Ordenado por </Divider>
                                    <Radio.Group options={options} onChange={handleChangeGroupBy} value={groupValue} />
                                    <Divider/>
                                    <Button 
                                        onClick={execute_report}
                                        type="primary" 
                                        icon={<DownloadOutlined />} 
                                        block
                                        style={{
                                            float: 'right',
                                        }}>
                                        Generar Reporte
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    </div>
                    </Spin>
                </Main.Paper>
            </div>
        </Main.Layout>
    )
}
export default Reporte;