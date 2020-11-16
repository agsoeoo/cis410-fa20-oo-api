const express = require('express')
const db = require('./dbConnectExec.js')
const app = express();
app.use(express.json())
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require("./config")
const auth=require('./middleware2/authenticate')
const cors = require('cors');
// const { NText } = require('mssql');
// const config = require('./config')
app.use(cors())




// products
app.get("/products",(req,res)=>{
    db.executeQuery(`select ProductT.ProductID, ProductT.productName, ProductT.productPrice, CategoryT.CategoryID, CategoryT.CategoryName
    from productT 
    left join CategoryT
    ON CategoryT.CategoryID = ProductT.CategoryID
`)
    .then((result)=>{
        res.status(200).send(result)

    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send()
    })
    
})


app.get("/products/:pk", (req,res)=>{
    var pk = req.params.pk
    console.log("my PK:", pk)
  
db.executeQuery(`select productT.productID, ProductT.productName, ProductT.productPrice, ProductT.CategoryID, CategoryT.CategoryName
from ProductT
left join CategoryT
ON CategoryT.ProductID = ProductT.CategoryID
Where ProductT.ProductID = ${pk}`)
.then((result)=>{
    res.status(200).send(result)
})
.catch((err)=>{
    console.log(err)
    res.status(500).send()
})


  
})



//contacts POST
app.post("/contacts", async(req,res)=>{
    // res.send('creating user')
    // console.log ("request body", req.body)

    var nameFirst = req.body.nameFirst;
    var nameLast = req.body.nameLast;
    var email = req.body.email;
    var password = req.body.password;


    if(!nameFirst || !nameLast || !email || !password){
        return res.status(400).send('bad request')
    }

    nameFirst = nameFirst.replace("'","''")
    nameLast = nameLast.replace("'","''")


    var emailCheckQuery = `SELECT email
    FROM CustomerT
    WHERE email ='${email}'`

    var existingUser = await db.executeQuery(emailCheckQuery)

    // console.log("existing user", existingUser)

    if(existingUser[0]){
        return res.status(409).send("Please enter a different email.")
    }

    var hashPassword = bcrypt.hashSync(password)

    var insertQuery = `INSERT INTO customerT(NameFirst, NameLast, Email, Password)
    VALUES('${nameFirst}', '${nameLast}', '${email}', '${hashPassword}')`

    db.executeQuery(insertQuery).then(()=>{res.status(201).send()})
    .catch((err)=>{
        console.log('error in POST /contacts',err)
        res.status(500).send()
    })


})


//LOGIN GET 

app.post("/contacts/login", async (req,res)=>{
    // console.log("/constacts/login called")
    // console.log(req.body)
    
    var email = req.body.email
    var password = req.body.password

    if(!email || !password){
        return res.status(400).send("bad request")
    }

    // 1. check that user email exists in the db

    var query = `SELECT *
    FROM customerT
    WHERE email ='${email}'`

    // var result = await db.executeQuery(query);
    
    let result;

    try{
        result = await db.executeQuery(query)
    }catch(myError){
        console.log('error /contacts/login:',myError);
        return res.status(500).send()
    }

    // console.log(result)

    if(!result[0]){return res.status(400).send('Invalid user credentials')}

//     // 2. check their password matches

    let user = result[0]
//     // console.log(user)
   

    if(!bcrypt.compareSync(password, user.Password)){
        console.log('invalid password');
        return res.status(400).send("Invalid user credentials")
    }

//     // 3. generate a token 
    
    let token = jwt.sign({pk: user.CustomerID}, config.JWT, {expiresIn: '60 minutes'})
    
    console.log(token)
 

//     // 4. save the token in db and send token and user info back to user

    let setTokenQuery = `UPDATE customerT
    SET Token = '${token}'
    Where CustomerID = ${user.CustomerID}`

    
try{
    await db.executeQuery(setTokenQuery)
    res.status(200).send({
        token: token, 
        user: {
            NameFirst: user.NameFirst, 
            NameLast: user.NameLast,
            Email: user.Email,
            CustomerID: user.CustomerID

        }

    })
}catch(myError){
    console.log("Error setting user token", myError);
    res.status(500).send()
}
    

 })

// const auth = async(req,res,next)=>{
//     console.log(req.header('Authorization'))
//     next()
// }

 app.post("/orders", auth, async (req,res)=>{
     try{   
        var productID = req.body.productID
        var payment = req.body.payment
    
        if(!productID ||!payment){res.status(400).send("bad request")}

        payment = payment.replace("'","''")
       
        // console.log("Here is the customer in /orders",req.customer)
        // res.send("Here is your response")}

        let insertQuery = `INSERT INTO orderT(CustomerID, ProductID, Payment)
        OUTPUT inserted.OrderID, inserted.CustomerID, inserted.ProductID, inserted.Payment
        VALUES (${req.customer.CustomerID}, '${productID}','${payment}')`

        let insertedOrder = await db.executeQuery(insertQuery)
        // console.log(insertedOrder)
        res.status(201).send(insertedOrder[0])

     }
     catch(error){
         console.log("Error is POST /orders", error);
         res.status(500).send()
     }


 })

 app.get("/contacts/me", auth, (req, res)=>{
     res.send(req.customer)
 })

 app.post('/contacts/logout', auth, (req,res)=>{

    var query =`UPDATE CustomerT 
    SET Token = NULL
    Where CustomerID = ${req.customer.CustomerID}`

    db.executeQuery(query)
    .then(()=>{
        res.status(200).send()
    })
    .catch((error)=>{
        console.log("error in POST /contacts/logout",error)
        res.status(500).send()
    })



 })

 app.get("/orders/me", auth, async(req, res)=>{
     var CustomerID = req.customer.CustomerID;
    
     db.executeQuery(`select OrderT.OrderID, OrderT.CustomerID, OrderT.ProductID, OrderT.Payment, ProductT.productName
     from OrderT
     right join ProductT on OrderT.ProductID = ProductT.ProductID
     Where CustomerID = ${CustomerID}`)
     .then((result)=>{
         res.status(200).send(result)
     })
     .catch((error)=>{
         console.log(error)
         res.status(500).send()
     })
    
     

 })

 app.patch('/orders/:pk'), auth, async(req, res)=>{
     let orderID = req.params.pk
     // make sure that the user can only edit their own reviews
 }

 app.patch('/orders/:pk'), auth, async(req, res)=>{
    let orderID = req.params.pk
    // make sure that the user can only delete their own reviews
}


app.get("/", (req,res)=>{res.send("Hello World.")})
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{console.log(`App is running on port ${PORT}`)})
// app.listen(3000,()=>{console.log("App is running on port 3000")})