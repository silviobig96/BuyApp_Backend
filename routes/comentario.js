import express from "express";
const router = express.Router();

//importamos el modelo del comentario
import Comentario from "../models/comentario";
import Usuario from "../models/usuario";
const { verificar_auth } = require("../middleware/autenticacion");

//agregar un nuevo comentario
router.post("/nuevo_comentario", verificar_auth, async (req, res) => {
  const body = req.body;

  //agregar el id del usuario ya logueado
  body.id_usuario = req.usuario._id;
  body.nombre_usuario = req.usuario.nombre_usuario;

  try {
    const comentarioDB = await Comentario.create(body);
    res.status(200).json(comentarioDB);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Ocurrio un error",
      error
    });
  }
});

// Get de todos los comentarios
router.get("/get_comentario", async (req, res) => {
  try {
    const comentarioDB = await Comentario.find();
    res.json(comentarioDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Ocurrio un error",
      error
    });
  }
});

module.exports = router;
