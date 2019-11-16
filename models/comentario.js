import mongoose from "mongoose";
const Schema = mongoose.Schema;

const comentario_schema = new Schema({
  descripcion: {
    type: String,
    required: [true, "La descripción del comentario es requerida"]
  },
  fecha_creacion: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true },
  id_post: String,
  id_usuario: String,
  nombre_usuario: String
});

const Comentario = mongoose.model("Comentario", comentario_schema);
export default Comentario;
