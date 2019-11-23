import express from "express";
const router = express.Router();
import Post from "../models/post";

/*const {
  verificar_auth,
  verificar_admin
} = require("../middleware/autenticacion");

//Hash Contraseña
const bcrypt = require("bcrypt");
const saltRounds = 10;

//para filtrar campos de PUT
const _ = require("underscore");*/

router.put("/uploads/:tipo/:id", async (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado una imagen"
      }
    });
  }

  let tiposValidos = ["posts", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Los tipos permitidos son " + tiposValidos.join(" , ")
      }
    });
  }

  //Permite recuperar la imagen cargada
  let image = req.files.image; //imput = imagen
  let extensionesPermitidas = ["png", "jpg", "gif", "jepg"];
  //el . divide el nombre de la imagen antes de la extensión y después de ella
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

  //Cambiar el nombre de la imagen
  let nombreImagen =
    req.params.id + new Date().getMilliseconds() + "." + extension;

  //el método mv() permite colocar la imagen e ela carpeta uploads
  image.mv("public/uploads/" + tipo + nombreImagen, err => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });

    imagenPost(id, res, nombreImagen);
    /* res.json({
      ok: true,
      message: "Imagen cargada"
    });*/
  });
});

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
module.exports = router;
