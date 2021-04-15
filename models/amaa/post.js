const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'like'}],
    content: {
        type: String,
        required: true
    },
    assetsUrl: [{type: String}]
})

module.exports = mongoose.model('post', postSchema)