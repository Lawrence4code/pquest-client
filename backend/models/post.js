const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    imagePath: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, ref: 'User',required: true, }
},     {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports  = mongoose.model('Post', postSchema);