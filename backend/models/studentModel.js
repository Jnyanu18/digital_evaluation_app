const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
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
    roll_no: {
        type: String,
        required: true
    },
    section:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    },
    semester: {
        type: Number,
        required: true
    },
    answerpapers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerPaper'
    }],
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }],
}, { timestamps: true });

studentSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

studentSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

studentSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;