//////////////////////////////////////////
///// Verificar token
/////////////////////////////////////////
const   jwt = require('jsonwebtoken');



function verificarToken (req, res, next) {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                err
            })
        }
        req.user = decoded
        next();
    })
}

function verificaAdmin (req, res, next) {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                err
            })
        }

        if(decoded.user.role === 'ADMIN_ROLE') {
            next();
        } else {
            return res.json({
                err: {
                    message: 'El usuario no es Admin'
                }
            })
        }
    })
}

module.exports = {verificarToken, verificaAdmin};