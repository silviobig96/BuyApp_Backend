import express from 'express';
const router = express.Router();

import Usuario from '../models/usuario';

//agregar un nuevo Usuario
router.post('/new_usuario',async (req,res) =>{

    const body = req.body;

    try {

        const usuarioDB = await Usuario.create(body);

        res.status(200).json(usuarioDB);
        
    } catch (error) {
        
        return res.status(500).json({
            mensaje: 'ERROR No se puede agregar',
            error
        });

    }
});

//buscar un usuario
router.get('/buscar_usuario/:id', async(req,res) => {
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

//actualizar usuario
router.put('/act_usuario/:id', async(req,res) =>{
    const _id =req.params.id;
    const body = req.body;

    try {

        const usuarioDB = await Usuario.findByIdAndUpdate(_id,body,{new: true});
        res.json(usuarioDB);
        
    } catch (error) {

        return res.status(400).json({
            mensaje: 'Ups 404 No existe :c',
            error
        });
        
    }
});

module.exports = router;