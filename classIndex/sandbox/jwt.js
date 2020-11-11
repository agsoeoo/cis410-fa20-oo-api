const jwt = require('jsonwebtoken');

let myToken = jwt.sign({pk: 12345},'secrestPassword',{expiresIn: '60 minutes'})

console.log('my token', myToken)

let myDecoded = jwt.verify(myToken,'secrestPassword');

console.log('my decode', myDecoded)