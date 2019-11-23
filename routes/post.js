import express from "express";
const router = express.Router();

//importamos el modelo del post
import Post from "../models/post";
import Usuario from "../models/usuario";
const fs = require("fs");
const path = require("path");

//import { fstat } from "fs";
//import { builtinModules } from "module";
const { verificar_auth } = require("../middleware/autenticacion");

//agregar un nuevo post
/*router.post("/nuevo_post", verificar_auth, async (req, res) => {
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
});*/

router.post("/nuevo_post", verificar_auth, async (req, res) => {
  const body = req.body;

  //agregar el id del usuario ya logueado
  body.id_usuario = req.usuario._id;
  body.nombre_usuario = req.usuario.nombre_usuario;

  if (!req.files) {
    res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado una imagen"
      }
    });
  }

  /* let tiposValidos = ["posts", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Los tipos permitidos son " + tiposValidos.join(" , "),
        ext: extension
      }
    });
  }*/

  //Permite recuperar la imagen cargada
  let image = req.files.image; //imput = imagen
  let extensionesPermitidas = ["png", "jpg", "gif", "jepg"];
  //el . divide el nombre de la imagen antes de la extensión y después de ella en un arreglo
  let nomb_cortado = image.name.split(".");
  //permite obtener la extensión
  let extension = nomb_cortado[nomb_cortado.length - 1];

  //verifica si la extensión está o no está
  if (extensionesPermitidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "Las extensiones permitidas son " + extensionesPermitidas.join(" , "),
        ext: extension
      }
    });
  }
  //let publicaciones = await Post.findOneAndUpdate({ post: id });
  //let nomb_image = publicaciones.image;

  let pathImagen = path.resolve(
    __dirname,
    "public/uploads/posts/" + body.imagen
  );
  // verifica si hay una imagen o no, si hay borra la que está para actualizarla (es útil para el perfil de usuario) 
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }

  //Cambiar el nombre de la imagen paa diferenciarl de los demás
  //coloque el id del usuario para diferenciarlo pero en el video explica que es el id del post 
  //lo que pasa es que en el video o hacen para un método put y yo estoy tratandp de hacerlo para un método post
  let nombreImagen =
    req.usuario._id + new Date().getMilliseconds() + "." + extension;
  body.imagen = nombreImagen;
  //el método mv() permite colocar la imagen e ela carpeta uploads/post si fuese usuario sería uploads/usarios
  image.mv("public/uploads/posts/" + nombreImagen, err => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
    //body.image = nombreImagen;
    //imagenPost(id, res, nombreImagen);
    res.json({
      ok: true,
      message: "Imagen cargada"
    });
  });

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

//Guardar el nombre de la imagen en la BD normalmente cuando se actualiza la imagen
function imagenPost(id, res, nombreImagen) {
  Post.findById(id, (err, postDB) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
  });
  if (!postDB) {
    res.status(400).json({
      ok: false,
      err: {
        message: "Post no existe"
      }
    });
  }

  postDB.imagen = nombreImagen;
  postDB.save((err, postGuardado) => {
    res.json({
      ok: true,
      post: postGuardado,
      imagen: nombreImagen
    });
  });
}

/*router.post("/nuevo_post", verificar_auth, async (req, res) => {
  const body = req.body;
  //var body = req.body
  //agregar el id del usuario ya logueado
  body.id_usuario = req.usuario._id;
  body.nombre_usuario = req.usuario.nombre_usuario;

  let upload_image = req.files.upload_image;
  //con esto guarda pero da error
  //upload_image.mv("./images/" + upload_image.name);
  upload_image.mv("./public/uploads/" + upload_image.name);
  res.send("Imagen cargada");
  body.imagen = upload_image.name;
  //var imagen = upload_image.name;

  try {
    const postDB = await Post.create(body);
    res.status(200).json(postDB);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Ocurrio un error",
      error
    });
  }
});*/

//cargar la imagen en el servidor
/*router.post("/uploads", async (req, res) => {
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
});*/

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
