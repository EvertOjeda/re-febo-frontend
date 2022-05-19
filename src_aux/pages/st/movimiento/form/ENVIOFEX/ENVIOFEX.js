import React, { useState }      from 'react';
import * as XLSX from "xlsx";
import { Tabs, Typography } from "antd";



function ENVIOFEX() {

  const [items, setItems] = useState([])

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
        setItems(d)
        console.log(d)
        
    })
  }



  return (
      <div>
          <button >hola
          </button>


      </div>
  )
}

export default ENVIOFEX;