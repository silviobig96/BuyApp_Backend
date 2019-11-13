import express from 'express';
const router = express.Router();

import Usuario from '../models/usuario';

const {verificar_auth, verificar_admin} = require('../middleware/autenticacion');

//Hash Contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

//para filtrar campos de PUT
const _ = require('underscore');

//agregar un nuevo Usuario
router.post('/new_usuario',async (req,res) =>{

    const body = {
        nombre: req.body.nombre,
        nombre_usuario: req.body.nombre_usuario,
        email: req.body.email,
        role: req.body.role
    }

    body.contraseña = bcrypt.hashSync(req.body.contraseña, saltRounds);

    try {

        const usuarioDB = await Usuario.create(body);

        return res.status(200).json(usuarioDB);
        
    } catch (error) {
        
        return res.status(500).json({
            mensaje: 'ERROR No se puede agregar',
            error
        });

    }
});

//buscar un usuario
router.get('/buscar_usuario/:id',verificar_auth, async(req,res) => {
    const _id = req.params.id;

    try {

        const usuarioDB = await Usuario.findOne({_id});
        res.json(usuarioDB);
        
    } catch (error) {
        
        return res.status(400).json({
            mensaje: 'ERROR',
            error
        });

    }
});

//Buscar todos los usuarios
router.get('/lista_usuarios', async (req,res) => {

    try {

        const usuarioDB=await Usuario.find();
        res.json(usuarioDB);
        
    } catch (error) {
        
        return res.status(400).json({
            mensaje: 'ERROR',
            error
        });

    }

});

//eliminar usuario
router.delete('/del_usuario/:id', async(req,res) => {
    const _id = req.params.id;

    try {

        const usuarioDB = await Usuario.findByIdAndDelete({_id});
        if(!usuarioDB){
            return res.status(400).json({
                mensaje: 'ERROR',
                error
            });
        }
        res.json(usuarioDB);
        
    } catch (error) {
        
        return res.status(400).json({
            mensaje: 'Ups 404 No existe :c',
            error
        });

    }
});

//actualizar usuario para administradores
router.put('/act_usuario_admin/:id', [verificar_auth, verificar_admin], async(req,res) =>{
    const _id =req.params.id;
    const body = _.pick(req.body, ['email', 'contraseña', 'estado']);

    if(body.contraseña){
        body.contraseña = bcrypt.hashSync(req.body.contraseña, saltRounds);
    }

    try {

        const usuarioDB = await Usuario.findByIdAndUpdate(_id,body,{new: true, runValidators: true, context: 'query'});
        return res.json(usuarioDB);
        
    } catch (error) {

        return res.status(400).json({
            mensaje: 'Ocurrio un Error',
            error
        });
        
    }
});

//actualizar usuario para usuarios normales
router.put('/act_usuario/:id', verificar_auth, async(req,res) =>{
    const _id =req.params.id;
    const body = _.pick(req.body, ['email', 'contraseña', 'estado','nombre','nombre_usuario']);

    if(body.contraseña){
        body.contraseña = bcrypt.hashSync(req.body.contraseña, saltRounds);
    }

    try {

        const usuarioDB = await Usuario.findByIdAndUpdate(_id,body,{new: true, runValidators: true, context: 'query'});
        return res.json(usuarioDB);
        
    } catch (error) {

        return res.status(400).json({
            mensaje: 'Ocurrio un Error',
            error
        });
        
    }
});

module.exports = router;