const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    assignedPapers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerPaper'
    }],
}, { timestamps: true });

teacherSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
  }
  
  teacherSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  }
  
  teacherSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
  }

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;