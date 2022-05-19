import React, { memo } from "react";
import Main from "../../../../components/utils/Main";
import DevExpressList from "../../../../components/utils/ListViewNew/DevExtremeList";
import { Menu, DireccionMenu } from '../../../../components/utils/FocusDelMenu';
const concepto = {};
const columnsListar = [
  { ID: "COD_SUCURSAL"		, label: "Sucursal"		, editModal:true, width: 80			, align: "left"},
  { ID: "DESC_SUCURSAL"		, label: "Descripcion", minWidth: 200	, disable: true },
  { ID: "COD_DEPOSITO"		, label: "Deposito"		, width: 80			, align: "left"	},
  { ID: "DESCRIPCION"			, label: "Descripcion", minWidth: 200	,	upper:true 		},
	{ ID: "COD_DEPOSITO_SD"	, label: "Deposito"		,	editModal:true, width: 80 		},
	{ ID: "DESC_DEPOSITO_SD", label: "SD"					, minWidth: 200},
	{ ID: "ACTIVO"					, label: "Activo"			, width: 100		, align: "center", checkbox: true, checkBoxOptions: ["S", "N"] },
	{ ID: "AFECTA_COSTO"		, label: "Af. Costo"	, width: 100		, align: "center", checkbox: true, checkBoxOptions: ["S", "N"] },
	{ ID: "IND_DEFECTO"			, label: "Por Def."		, width: 100		, align: "center", checkbox: true, checkBoxOptions: ["S", "N"] },
	{ ID: "IND_JAULA"				, label: "Dev/Jaula"	, width: 100		, align: "center", checkbox: true, checkBoxOptions: ["S", "N"] },
	{ ID: "IND_INSUMOS"			, label: "Insumos"	  , width: 100		, align: "center", checkbox: true, checkBoxOptions: ["S", "N"] },
];
var url_cod_deposito   = "/st/stdeposi/cod_deposito/" + sessionStorage.getItem("cod_empresa");
const columBuscador  	 = "DESCRIPCION";
const doNotsearch 	 	 = ["ACTIVO","AFECTA_COSTO","IND_DEFECTO","IND_JAULA","IND_INSUMOS"];
const notOrderByAccion = [""];
const TituloList 		   = "Deposito";
const FormName 				 = "STDEPOSI";
const url_valida_sucursal 	 = '/st/stdeposi/valida/sucursal';
const url_valida_deposito_sd = '/st/stdeposi/valida/deposito';
const url_buscar_sucursal 	 = '/st/stdeposi/buscar/sucursal/' + sessionStorage.getItem('cod_empresa');
const url_buscar_deposito_sd = '/st/stdeposi/buscar/deposito/' + sessionStorage.getItem('cod_empresa');
const columnModal = {
	urlValidar:[
		{  
			COD_SUCURSAL 		: url_valida_sucursal,
			COD_DEPOSITO_SD : url_valida_deposito_sd
		}
	],
	urlBuscador:[
		{
			COD_SUCURSAL 		: url_buscar_sucursal,
			COD_DEPOSITO_SD : url_buscar_deposito_sd
		}
	],
	title:[
		{
			COD_SUCURSAL 		: 'Sucursal',
			COD_DEPOSITO_SD : 'Deposito'
		}
	],
	COD_SUCURSAL:[
		{ ID: 'COD_SUCURSAL'  , label: 'Sucursal'		 , width:190     , align: 'left' },
		{ ID: 'DESC_SUCURSAL' , label: 'Descripción' , minWidth: 250 , align: 'left' },
	],
	COD_DEPOSITO_SD:[
		{ ID: 'COD_DEPOSITO_SD'  , label: 'Deposito'	  , width:190     , align: 'left' },
		{ ID: 'DESC_DEPOSITO_SD' , label: 'Descripción' , minWidth: 250 , align: 'left' },
	],
	config: {
		auto: [{ COD_DEPOSITO: url_cod_deposito }],
	},
};
var codDependenciaAnt = [
    {'COD_SUCURSAL': 'COD_SUCURSAL_ANT'},
    {'COD_DEPOSITO': 'COD_DEPOSITO_ANT'   },
];

const Deposito = memo(() => {

	const defaultOpenKeys = sessionStorage.getItem("mode") === "vertical" ? [] : DireccionMenu(FormName);
	const defaultSelectedKeys = sessionStorage.getItem("mode") === "vertical" ? [] : Menu(FormName);

	const cod_empresa = sessionStorage.getItem("cod_empresa");
	const url_lista = `/st/stdeposi/${cod_empresa}`;
	const url_buscador = `/st/stdeposi/search`;
	const url_abm = "/st/stdeposi/";
	const [Data, setData] = React.useState([]);
	const [modeloAuditoria, setModeloAuditoria] = React.useState([]);
	const [activarSpinner, setActivarSpinner] = React.useState(false);
	React.useEffect(() => {
			getData();
	}, []);
	const getData = async () => {
		try {
			var method = "GET";
			await Main.Request(url_lista, method, []).then((resp) => {
				if (resp.data.response.rows) {
					setModeloAuditoria(resp.data.comlumn);
					setData(resp.data.response.rows);
				}
			});
		} catch (error) {
			console.log(error);
		} finally {
			setActivarSpinner(false);
		}
	};
	return (
		<>
			<Main.Layout
				defaultOpenKeys={defaultOpenKeys}
				defaultSelectedKeys={defaultSelectedKeys}>
				<Main.Helmet title={`${process.env.REACT_APP_TITULO} - ${TituloList}`}/>
				<Main.Spin size="large" spinning={activarSpinner}>
					<DevExpressList
						data={Data}
						columns={columnsListar}
						title={TituloList}
						notOrderByAccion={notOrderByAccion}
						doNotsearch={doNotsearch}
						columBuscador={columBuscador}
						urlBuscador={url_buscador}
						urlAbm={url_abm}
						arrayOptionSelect={concepto}
						arrayColumnModal={columnModal}
						formName={FormName}
						modeloAuditoria={modeloAuditoria}
						sizePagination={17}
						height={500}
						codDependenciaAnt={codDependenciaAnt}
					/>
				</Main.Spin>
			</Main.Layout>
		</>
	);
});
export default Deposito;