import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  document: { type: String, required: true, unique: true },
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
