const express = require('express')
const db = require('./dbConnectExec')
const app = express();


app.get("/hi",(req,res)=>{
    res.send("Hello world")

})

app.get("/movies",(req,res)=>{
    db.executeQuery(`select * 
    from Movie 
    left join Genre
    ON Genre.GenrePK = Movie.MoviePK`)
    .then((result)=>{
        res.status(200).send(result)

    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send()
    })
    
})


app.get("/movies/:pk", (req,res)=>{
    var pk = req.params.pk
    console.log("my PK:", pk)

     var myQuery = `select * 
     from Movie 
     left join Genre
     ON Genre.GenrePK = Movie.MoviePK
     WHERE moviePK = ${pk}`

     db.executeQuery(myQuery)
     .then((movies)=>{
        //  console.log("Movies: ", movies)
        if(movies[0]){
            res.send(movies[0])
        }
        else{
            res.status(404).send('bad request')
        }
     })
     .catch((err)=>
     {
         console.log('Error in /movies/pk',err)
         res.status(500).send()
     })
})


app.listen(5000,()=>{
    console.log("App is running on port 5000")
})

