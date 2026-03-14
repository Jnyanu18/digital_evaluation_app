const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: true
    },
    sectionName: {
        type: String,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;