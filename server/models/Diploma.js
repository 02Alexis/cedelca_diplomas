import mongoose from "mongoose";

const diplomaSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  nameFile: { type: String, required: true },
  url: { type: String, required: true }, // URL en Cloudinary
  emissionDate: { type: Date, default: Date.now },
});

const Diploma = mongoose.models.Diploma || mongoose.model("Diploma", diplomaSchema);

export default Diploma;
