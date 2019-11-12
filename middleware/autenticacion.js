const jwt = require('jsonwebtoken');

const verificar_auth = (req, res, next) => {
    
    const token = req.get('token');

    jwt.verify(token, 'the_BuyApp_secret', (err,decoded) => {

        if(err){
            return res.status(401).json({
                mensaje: 'Usuario NO válido'
            });
        }

        req.usuario = decoded.data;

        next();
    })

    
}

const verificar_admin = (req, res, next) => {

    const rol = req.usuario.role

    if(rol === 'ADMIN'){
        next();
    }else{
        return res.status(401).json({
            mensaje: 'Usuario NO permitido'
        });
    }

}

module.exports = {verificar_auth, verificar_admin}