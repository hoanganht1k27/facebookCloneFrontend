const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const postModel = require('../models/amaa/post')
const likeModel = require('../models/amaa/like')
const commentModel = require('../models/amaa/comment')

const {getUniqueId, getExtensionOfFile} = require('./util')

const imageTypes = ["image/jpeg", "image/png", "image/gif"]
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join('public', 'assets', 'amaa'))
    },
    filename: (req, file, callback) => {
        let uid = req.session.user.id
        let pid = getUniqueId()
        let ext = getExtensionOfFile(file.originalname)
        // console.log(uid, pid, ext)
        req.fileName = uid + '-' + pid + '.' + ext
        callback(null, uid + '-' + pid + '.' + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if(imageTypes.includes(file.mimetype))
        {
            // console.log(file)
            callback(null, true)
        }
        else callback(new Error('Type khong hop le'), false)
    },
    limits: {fileSize: 3 * 1024 * 1024} //3MB
})

async function savePost(req, res, next) {
    try {
        let uid = req.session.user.id
        let p = new postModel({
            authorId: uid,
            likes: [],
            content: req.body.content,
            assetsUrl: [req.fileName]
        })
        let result = await p.save()
        next()
    } catch (err) {
        console.log(err)
        res.send("Co loi khi luu post")
    }
}

router.post('/add', upload.single('file'), savePost, (req, res) => {
    req.flash('message', {type: 'success', message: 'Dang bai thanh cong'})
    res.redirect('/amaa/')
})

async function getUserIdOfPost(pid) {
    let result = await postModel.findOne({_id: pid})
    return result.authorId
}

router.post('/like', async (req, res) => {
    try {
        console.log(req.body)
        let {pid, type} = req.body
        let l = await likeModel.findOne({
            reactorId: req.session.user.id,
            postId: pid
        })
        if(l === null) {
            let authorId = await getUserIdOfPost(pid)
            l = new likeModel({
                type: type,
                authorId: authorId,
                reactorId: req.session.user.id,
                postId: pid
            })
        } else {
            l.type = type
        }        
        let like = await l.save()
        let post = await postModel.findOne({_id: pid})
        post.likes.push(like._id)
        let result = await post.save()
        res.json({
            likeId: like._id
        })
    } catch (err) {
        console.log(err)
        res.json({
            error: err
        })
    }
})

router.post('/unlike', async (req, res) => {
    try {
        let {pid} = req.body
        let l = await likeModel.findOne({
            postId: pid,
            reactorId: req.session.user.id
        }).remove().exec()
        res.send("Ok")
    } catch (err) {
        res.send("Deo on")
    }
})

router.post('/comment', async (req, res) => {
    try {
        let {pid, comment} = req.body
        let c = await commentModel.findOne({
            postId: pid,
            commentorId: req.session.user.id
        })
        if(c === null) {
            let authorId = await getUserIdOfPost(pid)
            c = new commentModel({
                postId: pid,
                commentorId: req.session.user.id,
                authorId: authorId,
                comments: []
            })
        }
        c.comments.push({
            content: comment,
            createdAt: Date.now()
        })
        let result = await c.save()
        res.json({
            commentId: result._id
        })
    } catch (err) {
        console.log(err)
        res.json({
            error: err
        })
    }
})


module.exports = router