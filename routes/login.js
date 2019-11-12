import express from 'express';
const router = express.Router();
const jwt = require('jsonwebtoken');

import Usuario from '../models/usuario';

//Hash Contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/login', async (req,res) =>{
    
    const body = req.body;

    try {
        //evaluarmos el email
        const usuarioDB = await Usuario.findOne({email: body.email});
        
        if(!usuarioDB){
            return res.status(400).json({
                mensaje: 'Usuario o contraseña inválidos'
            });
        }

        //evaluamos la contraseña
        if(!bcrypt.compareSync(body.contraseña, usuarioDB.contraseña)){
            return res.status(400).json({
                mensaje: 'Usuario o contraseña inválidos'
            });
        }

        //generar token
        const token = jwt.sign({
            data: usuarioDB
        }, 'the_BuyApp_secret', { expiresIn: 60 * 60 * 24 * 30 });

        res.json({
            usuarioDB,
            token
        })

    } catch (error) {

        return res.status(400).json({
            mensaje: 'ERROR',
            error
        });
    }

});

module.exports = router;