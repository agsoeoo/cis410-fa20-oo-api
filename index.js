const express = require('express')
const db = require('./dbConnectExec')
const app = express();
app.use(express.json())
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require("./config.js")


// app.get("/hi",(req,res)=>{
//     res.send("Hello world")

// })


// app.post("/contacts/login", async (req,res)=>{
//     // console.log("/constacts/login called")
//     // console.log(req.body)
    
//     var email = req.body.email
//     var password = req.body.password

//     if(!email || !password){
//         return res.status(400).send("bad request")
//     }

    //1. check that user email exists in the db

    // var query = `SELECT *
    // FROM contact
    // WHERE email ='${email}'`

    // var result = await db.executeQuery(query);
    
    // let result;

    // try{
    //     result = await db.executeQuery(query)
    // }catch(myError){
    //     console.log('error /contact/login:',myError);
    //     return res.status(500).send()
    // }

    // // console.log(result)

    // if(!result[0]){return res.status(400).send('Invalid user credentials')}

    // 2. check their password matches

    // let user = result[0]
    // // console.log(user)

    // if(!bcrypt.compareSync(password, user.Password)){
    //     console.log('invalid password');
    //     return res.status(400).send("Invalid user credentials")
    // }

    // 3. generate a token 
    
    // let token = jwt.sign({pk: user.ContactPK}, config.JWT, {expiresIn: '60 minutes'})
    
    // console.log(token)

    // 4. save the token in db and send token and user info back to user

//     let setTokenQuery = `UPDATE Contact 
//     Set Token = '${token}'
//     Where ContactPK = ${user.ContactPK}`

    
// try{
//     await db.executeQuery(setTokenQuery)

//     res.status(200).send({
//         token: token, 
//         user: {
//             NameFirst: user.NameFirst, 
//             NameLast: user.NameLast,
//             Email: user.Email,
//             ContactPK: user.ContactPK

//         }

//     })
// }catch(myError){
//     console.log("Error setting user token". myError);
//     res.status(500).send()
// }
    

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

