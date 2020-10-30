const express = require('express')
const db = require('./dbConnectExec')
const app = express();
app.use(express.json())
const bcrypt = require('bcryptjs')


// app.get("/hi",(req,res)=>{
//     res.send("Hello world")

// })

app.get("/product",(req,res)=>{
    db.executeQuery(`SELECT [dbo].[Order].CustomerID, [dbo].[Order].OrderID, [dbo].[Order].ProductID, [dbo].[Order].Statue, Customer.Name, Product.Category, Product.Description, Product.Price
    from [dbo].[Order]
    JOIN Product ON [dbo].[Order].ProductID= Product.ProductID
    JOIN Customer ON [dbo].[Order].CustomerID=Customer.CustomerID
    `)
        .then((result)=>{
            res.status(200).send(result)
    
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).send()
        })
})


// testing
// app.post("/contacts", async(req,res)=>{
//     // res.send('creating user')
//     // console.log ("request body", req.body)


//     var nameFirst = req.body.nameFirst;
//     var nameLast = req.body.nameLast;
//     var email = req.body.email;
//     var password = req.body.password;


//     if(!nameFirst || !nameLast || !email || !password){
//         return res.status(400).send('bad request')
//     }

//     nameFirst = nameFirst.replace("'","''")
//     nameLast = nameLast.replace("'","''")


//     var emailCheckQuery = `SELECT email
//     FROM contact 
//     WHERE email ='${email}'`

//     var existingUser = await db.executeQuery(emailCheckQuery)

//     // console.log("existing user", existingUser)

//     if(existingUser[0]){
//         return res.status(409).send("Please enter a different email.")
//     }

//     var hashPassword = bcrypt.hashSync(password)

//     var insertQuery = `INSERT INTO contact(NameFirst, NameLast, Email, Password)
//     VALUES('${nameFirst}', '${nameLast}', '${email}', '${hashPassword}')`

//     db.executeQuery(insertQuery).then(()=>{res.status(201).send()})
//     .catch((err)=>{
//         console.log('error in POST /contacts',err)
//         res.status(500).send()
//     })


// })

// app.get("/movies",(req,res)=>{
//     db.executeQuery(`select * 
//     from Movie 
//     left join Genre
//     ON Genre.GenrePK = Movie.MoviePK`)
//     .then((result)=>{
//         res.status(200).send(result)

//     })
//     .catch((err)=>{
//         console.log(err)
//         res.status(500).send()
//     })
    
// })



// app.get("/movies/:pk", (req,res)=>{
//     var pk = req.params.pk
//     console.log("my PK:", pk)

//      var myQuery = `select * 
//      from Movie 
//      left join Genre
//      ON Genre.GenrePK = Movie.MoviePK
//      WHERE moviePK = ${pk}`

//      db.executeQuery(myQuery)
//      .then((movies)=>{
//         //  console.log("Movies: ", movies)
//         if(movies[0]){
//             res.send(movies[0])
//         }
//         else{
//             res.status(404).send('bad request')
//         }
//      })
//      .catch((err)=>
//      {
//          console.log('Error in /movies/pk',err)
//          res.status(500).send()
//      })
// })




app.listen(5000,()=>{
    console.log("App is running on port 5000")
})

