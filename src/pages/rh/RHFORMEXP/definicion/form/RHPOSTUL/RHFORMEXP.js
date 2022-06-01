import React, { useState, memo }      from 'react';
import Main                           from "../../../../../../components/utils/Main";
import * as XLSX                      from "xlsx";
import { Typography }                 from "antd";
import DataGrid                       from 'devextreme-react/data-grid';
import { Button }                     from 'antd';
import '../../../../../../assets/css/DevExtreme.css';

import swal from 'sweetalert';
import agregarIcon from     '../../../../../../assets/icons/add.svg';
import guardarIcon from     '../../../../../../assets/icons/diskette.svg';
import './style.css';




//    Columnas para la DataGrid DEL EXCEL
const columns = [ 
      { dataField:"NRO_DOCUMENTO"   ,caption:"Nro. de documento"  },
      { dataField:"NOMBRE"          ,caption:"Nombre"             },
      { dataField:"FEC_NACIMIENTO"  ,caption:"Fecha Nacimiento"   },
      { dataField:"SEXO"            ,caption:"Sexo"               },
      { dataField:"ESTADO_CIVIL"    ,caption:"Estado civil"       },
      { dataField:"ZONA_RESIDENCIA" ,caption:"Zona de residencia" },
      { dataField:"CELULAR"         ,caption:"Celular"            },
      { dataField:"EMAIL"           ,caption:"Email"              },
      { dataField:"SUCURSAL"        ,caption:"Sucursal"           },
  ];




  
// FUNCION PRINCIPAL 
const RHFORMEXP = memo(() => {


   // ESTADOS
   const [ activarSpinner, setActivarSpinner ] = useState(true);
   const [ tabKey, setTabKey ] = useState("1");
   const cod_empresa = sessionStorage.getItem('cod_empresa');
   const cod_usuario = sessionStorage.getItem('cod_usuario');

   
   const url_lista             = `/rh/rhformexp/${cod_empresa}`;
   
   React.useEffect(()=>{
     setTimeout(()=>setActivarSpinner(false),30);
    },[])
    
    
  const [  datosListar,   setDatosListar     ] = useState([]);

  const [   items,  setItems  ] = useState([]);
   
  // Lector de archivo Excel
  const readExcel=(file)=>{

    const promise=new Promise((resolve, reject) =>{

        const fileReader=new FileReader();
        fileReader.readAsArrayBuffer(file)

        fileReader.onload=(e) =>{

          const bufferArray=e.target.result;
          const wb=XLSX.read(bufferArray, { type:"buffer" });
          const wsname=wb.SheetNames[0];
          const ws=wb.Sheets[wsname];
          const data=XLSX.utils.sheet_to_json(ws)

          resolve(data);
        };

        fileReader.onerror=((error)=>{
          reject(error);
        })

    })

    promise.then((d)=>{

        setItems(d);
        console.log(d);

    })
  }

{/* ###########################################SOLO PARA PRUEBA################################################################### */}



var array50=[];


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

                array50 = resp.data.response.rows;
                // console.log( "este es => ",  array50);
            }
        });
        
    } catch (error) {

        console.log(error);

    }finally{

        setActivarSpinner(false);

    }
}




{/* ################################################################################################################################ */}
  
 let estado = 0; ///NO TOCAR

  //  Funcion guardar
 const guardar = async () => {

            var registros = items.length;
          if (estado == 0){
          
            console.log("Cargando ....")
            //animacion del estado de carga
            swal({
              title: "Cargando archivo",
              text: "Aguarde",
              icon: "info",
              button: false,
            // timer: "2000"
            });
          
          }

          estado = 1;
          await Main.Request('/rh/rhformexp','POST',items).then(async(response)=>{

              if (estado == 1){

                estado = 0;
                
              }
              console.log(response)

                if (response.status == 200)
                {
                    //animacion de finalizacion de carga
                    swal({
                          title: registros + " Registros cargados correctamente!",
                          text: "  ",
                          icon: "success",
                          button: false,
                          timer: "2000"
                        });
                }

              
                }
          ).catch(function(e) {
            console.log(e);
            var letras = e + "";

              //animacion de error de carga
            swal({
                  title: "Error al cargar archivo",
                  text: letras,
                  icon: "error",
                  button: false,
                      // timer: "2000"

                }
              )
          }
        )
  }

 

  return (
    
    <div className='file'>


             <Main.Paper className="paper-style">


                              <label htmlFor="archivoexcel">
                                    <img className="paper-header-menu-button" src={agregarIcon} width="29"/>
                              </label>
              

                              <Button
                                icon={<img src={guardarIcon} width="25" style={{ marginBottom: '6px', }}  />}
                                className="paper-header-menu-button"
                                onClick={guardar}
                              />

                              <input type="file" id="archivoexcel"
                                    onChange={(e)=>{
                        
                                      const file = e.target.files[0];
                                      readExcel(file);
                                      }
                                  } 
                              />

                              <DataGrid className='hrDevExtreme' height= '537px' 
                                
                                  dataSource              = {items}
                                  defaultColumns          = {columns}
                                  allowColumnReordering   = {true}
                                  allowColumnResizing     = {true}
                                  columnAutoWidth         = {true}
                                  rowAlternationEnabled   = {false}
                                  showBorders             = {false}
                                  noDataText              = "Sin archivo seleccionado"

                              />                               

                             

             </Main.Paper>

    
    </div>

  );


/////////////////
});



export default RHFORMEXP;


