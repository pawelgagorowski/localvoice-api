const jwt = require('jsonwebtoken')


function verify (token, secret) {

    return new Promise(function(resolve, reject){
        jwt.verify(token, secret, function(err, decode) {
            if (err){
                reject(err)
                return
            }

            resolve(decode)
        })
    })
}

module.exports = {
  verify
}
