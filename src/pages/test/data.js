import ArrayStore from 'devextreme/data/array_store';
import Main from '../../components/utils/Main';

const cities = ['Los Angeles', 'Denver', 'Bentonville', 'Atlanta', 'Reno', 'Beaver', 'Malibu', 'Phoenix', 'San Diego', 'Little Rock', 'Pasadena', 'Boise', 'San Jose', 'Chatsworth', 'San Fernando', 'South Pasadena', 'San Fernando Valley', 'La Canada', 'St. Louis'];

const orders = [];
const products = [];



for (let i = 1; i <= 5; i += 1) {
    products.push({
        ProductID: i, ProductName: `Product ${i}`, UnitPrice: Math.floor(Math.random() * 1000) + 1, Quantity: 0, Amount: 0, OrderCount: 0,
    });
}

// for (let i = 1; i <= 5; i += 1) {
//     products.push({
//         ID: i, ProductName: `Product ${i}`, UnitPrice: Math.floor(Math.random() * 1000) + 1, Quantity: 0, Amount: 0, OrderCount: 0,
//     });
// }


export var productsStore = new ArrayStore({
    // key: 'ProductID',
    // data: [],
    store: {  
        type: "array",  
        key: "ID",  
        data: data  
    }  
  });

// export var ordersStore = new ArrayStore({
//     key: 'OrderID',
//     data: orders,
// });

// export function getOrderCount() {
//     return orders.length;
//   }

export const addOrder = async(cod_marca) => {

    // console.log('==> ',cod_marca)

    

    // const product = products[Math.round(Math.random() * 4)];

    // const order = {
    //     OrderID: orders.length ? orders[orders.length - 1].OrderID + 1 : 20001,
    //     ShipCity: cities[Math.round(Math.random() * (cities.length - 1))],
    //     ProductID: product.ProductID,
    //     UnitPrice: product.UnitPrice,
    //     OrderDate: new Date(),
    //     Quantity: Math.round(Math.random() * 20) + 1,
    // };

    // ordersStore.push([{ type: 'insert', data: order }]);

    // productsStore = new ArrayStore({
    //     key: 'ProductID',
    //     data: [],
    // });
    // for (let index = 0; index < productsStore.length; index++) {
    //     const element = productsStore[index]; 
    // }

    // console.log(productsStore._array);

    // var content = productsStore._array;
    // for (let index = 0; index < content.length; index++) {
    //     const element = content[index];
    //     productsStore.push([{
    //         type: 'remove',
    //         key: element.ProductID,
    //     }])
    // }
    // productsStore._array = [];

    try {
        var info = await Main.Request('/st/stmarart/tipoCartera','POST',{ cod_empresa: sessionStorage.getItem("cod_empresa"), cod_marca: cod_marca });
        if(info.data.rows){
            // productsStore.clear();
            const content = info.data.rows;
            // console.log(content)
            // productsStore = {
            //     key:'ID',
            //     data: info.data.rows
            // }productsStore

            // productsStore.pop();
            // if(productsStore._array.length !== 0){
            //     productsStore._array = [];
            // }
            productsStore = new ArrayStore();

            for (let index = 0; index < content.length; index++) {
                const element = content[index];
                productsStore.push([{
                    type: 'insert',
                    key: element.ID,
                    // data: {
                    //     OrderCount: '654321',
                    //     Quantity: '123456',
                    //     Amount: '987654321',
                    // },
                    data: element,
                }]);
            }
            // productsStore.load()
            // console.log(productsStore)            
        }
        // return content;
    } catch (error) {
        console.log(error);
    }

    // productsStore.push([{
    //     // type: 'update',
    //     // type: 'insert',
    //     type: 'remove',
    //     key: order.ProductID,
    //     // data: {
    //     // OrderCount: product.OrderCount + 1,
    //     // Quantity: product.Quantity + order.Quantity,
    //     // Amount: product.Amount + order.UnitPrice * order.Quantity,
    //     // },
    //  }]);
}