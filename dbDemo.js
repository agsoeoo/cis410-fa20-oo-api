const sql =require('mssql')

const config = {
    user: 'csu',
    password: 'Uuxwp7Mcxo7Khy',
    server: 'cobazsqlcis410.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'agsoeoo',
}

// sql.connect(config)
// .then((myConnection)=>{
//   return myConnection.query(`SELECT * FROM movie`)
// }).then((myResult)=>{
//     console.log(myResult.recordset)
// }).catch((myError)=>{
//     console.log("Something went wrong", myError)
// })

// var myMovies;
// async function executeQuery(){
//     var connection = await sql.connect(config)
//     var result = await connection.query(`SELECT * FROM movie`)
//     // console.log(result)
//     myMovies = result;
// }

// executeQuery().then(()=>{console.log(myMovies)})
// console.log("Here are my movies:" + myMovies)


// fetch('https://cis410-fa20-rockwellapi.azurewebsites.net/quotes')
// .then(response=>response.json())
// .then(myData=>console.log(myData))

var myMovies;
async function executeQuery(){
    var connection = await sql.connect(config)
    var result = await connection.query(`SELECT * from customer, product, [dbo].[order]`)
    // console.log(result)
    myMovies = result;
}

executeQuery().then(()=>{console.log(myMovies.recordset)})
// console.log("Here are my movies:" + myMovies)