import express from 'express';
const router = express.Router();

//importamos el modelo de post_sugerencia
import Post_sugerencia from '../models/post_sugerencia'
import Usuario from '../models/usuario';
const {verificar_auth} = require('../middleware/autenticacion');

//agregar un post de sugerencia
router.post('/nueva_sugerencia', verificar_auth, async (req, res) => {
    const body = req.body;

    //agregar el id del usuario ya logueado
    body.id_usuario = req.usuario._id;
    body.nombre_usuario = req.usuario.nombre_usuario;

    try {
        const post_sugerenciaDB = await Post_sugerencia.create(body);
        res.status(200).json(post_sugerenciaDB);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
          });
    }
});

// Get todas las sugerencias
router.get('/get_sugerencias', async (req, res) => {
    
    try {
        const post_sugerenciaDB = await Post_sugerencia.find();
        res.json(post_sugerenciaDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
          });
    }
});

//actualizar sugerencia
router.put('/act_sugerencia/:id', verificar_auth, async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    const post_sugerencia_checker=await Post_sugerencia.findById(_id);
    //verificar si el usuario del post de sugerencia es el mismo que esta logueado
    if(post_sugerencia_checker.id_usuario===req.usuario._id){
        try {
        const post_sugerenciaDB = await Post_sugerencia.findByIdAndUpdate(_id, body, {new: true});
        res.json(post_sugerenciaDB);
        } catch (error) {
            return res.status(400).json({
                mensaje: 'Ocurrio un error',
                error
            });
        }
    }else{
        return res.status(400).json({
            mensaje: 'Usuario no valido para esta accion',
        });
    }
    
});

module.exports = router;