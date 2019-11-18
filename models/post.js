import mongoose from "mongoose";
const Schema = mongoose.Schema;

const post_schema = new Schema({
  titulo: { type: String, required: [true, "El titulo es requerido"] },
  descripcion: {
    type: String,
    required: [true, "La descripción es requerida"]
  },
  //enlace: { type: String },
  categoria: { type: String, required: [true, "La categoria es requerida"] },
  enlace: { type: String, required: [true, "El enlace es requerido"] },
  //upload_image: String,
  imagen: String,
  //extension: { type: String, required: [true, "La imagen es requerida"] },
  fecha_creacion: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true },
  id_usuario: String,
  nombre_usuario: String
});

const Post = mongoose.model("Post", post_schema);
export default Post;
