import express from "express";
const router = express.Router();

//importamos el modelo del post
import Post from "../models/post";
import Usuario from "../models/usuario";
import { fstat } from "fs";
const { verificar_auth } = require("../middleware/autenticacion");

//agregar un nuevo post
router.post("/nuevo_post", verificar_auth, async (req, res) => {
  const body = req.body;

  //agregar el id del usuario ya logueado
  body.id_usuario = req.usuario._id;
  body.nombre_usuario = req.usuario.nombre_usuario;
  try {
    const postDB = await Post.create(body);
    res.status(200).json(postDB);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Ocurrio un error",
      error
    });
  }
});

//cargar la imagen en el servidor
router.post("/uploads", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      //Permite recuperar la imagen cargada
      let upload_image = req.files.upload_image;
      //el método mv() permite colocar la imagen e ela carpeta uploads
      upload_image.mv("./public/uploads/" + upload_image.name);
      //send response
      res.send("Imagen cargada");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get de todos los post
router.get("/get_post", async (req, res) => {
  try {
    const postDB = await Post.find();
    res.json(postDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Ocurrio un error",
      error
    });
  }
});

router.put("/act_post/:id", verificar_auth, async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const post_checker = await Post.findById(_id);
  //verificar si el usuario del post es el mismo que esta logueado
  if (post_checker.id_usuario === req.usuario._id) {
    try {
      const postDB = await Post.findByIdAndUpdate(_id, body, { new: true });
      res.json(postDB);
    } catch (error) {
      return res.status(400).json({
        mensaje: "Ocurrio un error",
        error
      });
    }
  } else {
    return res.status(400).json({
      mensaje: "Usuario no valido para esta accion"
    });
  }
});

router.delete("/del_post/:id", verificar_auth, async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const post_checker = await Post.findById(_id);
  //verificar si el usuario del post  es el mismo que esta logueado
  if (post_checker.id_usuario === req.usuario._id) {
    try {
      const postDB = await Post.findByIdAndDelete({ _id });
      if (!postDB) {
        return res.status(400).json({
          mensaje: "ERROR",
          error
        });
      }
      res.json(postDB);
    } catch (error) {
      return res.status(400).json({
        mensaje: "Ocurrio un error",
        error
      });
    }
  } else {
    return res.status(400).json({
      mensaje: "Usuario no valido para esta accion"
    });
  }
});

module.exports = router;
