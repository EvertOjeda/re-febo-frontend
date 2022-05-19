const electron = require('electron');
const { contextBridge, ipcRenderer} = require('electron');

const $ = require('jquery');

document.addEventListener('DOMContentLoaded', (event) => {


    console.log(event);

    // document.getElementsByTagName('a')[0].addEventListener('click',()=>{

    document.getElementById('prueba_menu').addEventListener('click',()=>{
        // electron.ipcRenderer('closeWindow')
        console.log('entro aqui ***** ');
    });

    // $('#prueba_menu').on('click',()=>{
    //     console.log('entro aqui ********');
    // });

});