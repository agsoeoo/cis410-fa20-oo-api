const sql =require('mssql')

const rockwellconfig = require('./config.js')

const config = {
    user: rockwellconfig.DB.user,
    password: rockwellconfig.DB.password,
    server: rockwellconfig.DB.server, // You can use 'localhost\\instance' to connect to named instance
    database: rockwellconfig.DB.database,
}

var myMovies;
async function executeQuery(aQuery){
    var connection = await sql.connect(config)
    var result = await connection.query(aQuery)
    // console.log(result)
    return result.recordset
    
}


module.exports= {executeQuery: executeQuery }
// executeQuery(`select * 
// from Movie 
// left join Genre
// ON Genre.GenrePK = Movie.MoviePK`)