const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    comments: [{
        content: {
            type: String,
            default: ''
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    commentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
})

module.exports = mongoose.model('comment', commentSchema)