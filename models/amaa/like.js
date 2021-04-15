const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    type: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reactorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
})

module.exports = mongoose.model('like', likeSchema)