const jwt = require('jsonwebtoken')
const config = require('../config.js')
const db =require('../dbConnectExec.js')
const auth = async(req,res, next)=>{
    
    try{

        //1. decode token

        let myToken = req.header('Authorization').replace('Bearer ','')
        console.log(myToken)
        let decodedToken = jwt.verify(myToken, config.JWT)
        console.log(decodedToken)

        let customerID = decodedToken.pk;
        console.log(customerID)

        //2. compare token with db token
   
       let query =` SELECT CustomerID, NameFirst, Namelast, Email 
                 FROM customerT
                 WHERE customerID =${customerID} and Token = '${myToken}'`

        let returnedUser = await db.executeQuery(query)
        // console.log(returnedUser)
                 
        //3. save user information in resquest
        
        if(returnedUser[0]){
            req.customer = returnedUser[0];
            next()

        }
        else(res.status(400).send('Authentication failed'))

    }catch(myError){
        res.status(401).send("Authentication failed")
    }
}
//     console.log(req.header('Authorization'))
//     next()
// }
//     try{
//         //1. decode token

//         let myToken =  req.header('Authorization').replace('Bearer ','')
//         // console.log(myToken)
//         let decodedToken = jwt.verify(myToken, config.JWT)
//         // console.log(decodedToken)

//         let contactPK = decodedToken.pk;
//         console.log(contactPK)

//         //2. Compare token with db token 
//         let query = `SELECT ContactPK, NameFirst, Namelast, Email 
//         FROM Contact
//         WHERE ContactPk = ${contactPK} and Token = '${myToken}'`

//         let returnedUser = await db.executeQuery(query)
//         console.log(returnedUser)

//         //3. save user information in request

//         if(returnedUser[0]){
//             req.contact = returnedUser[0];
//             next()

//         }
//         else(res.status(400).send('Authentication failed'))

//     }catch(myError){
//         res.status(401).send("Authorization failed.")
//     }
// }

    module.exports = auth