const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')

const userModel = require('../models/amaa/user')

const {checkNotNull, checkPassword, hashPassword, getUniqueId, getExtensionOfFile} = require('./util')

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

router.get('/profile/', (req, res) => {
    res.render('amaa/profile')
})

router.post('/follow', async (req, res) => {
    try {
        let {followId} = req.body
        let u = await userModel.findOne({_id: req.session.user.id})
        if(!checkNotNull([u.following])) u.following = []
        u.following.push(followId)
        let result = await u.save()
        res.send("OK")
    } catch (err) {
        console.log(err)
        res.json({
            error: err
        })
    }
})

router.post('/unfollow', async (req, res) => {
    try {
        let {followId} = req.body
        let u = await userModel.findOne({_id: req.session.user.id})
        if(checkNotNull(u.following)) {
            let fid = u.following.indexOf(followId)
            if(fid > -1) u.following.splice(fid, 1)
            let result = await u.save()
        }
        res.send("OK")
    } catch (err) {
        console.log(err)
        res.json({
            error: err
        })
    }
})

router.post('/changeAvatar', upload.single('newava'), async (req, res) => {
    try {
        let u = await userModel.findOne({_id: req.session.user.id})
        u.avatarUrl = req.filename
        let result = await u.save()
        req.flash('message', {type: 'success', message: 'Thay doi anh dai dien thanh cong'})
        res.redirect('/amaa/')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/changePassword',  async (req, res) => {
    try {
        let {oldpassword, newpassword, cfnewpassword} = req.body
        if(!checkNotNull([oldpassword, newpassword, cfnewpassword])) return res.send("Doi mat khau khong thanh cong")
        let u = await userModel.findOne({_id: req.session.user.id})
        if(await checkPassword(oldpassword, u.password)) {
            if(newpassword === cfnewpassword) {
                let npw = await hashPassword(newpassword)
                u.password = npw
                let result = await u.save()
                req.flash('message', {type: 'success', message: 'Doi mat khau thanh cong'})
                res.redirect('/amaa/user/profile')
            } else {
                req.flash('message', {type: 'error', message: 'Mat khau khong khop'})
                res.redirect('/amaa/user/profile')
            }
        } else {
                req.flash('message', {type: 'success', message: 'Mat khau cu khong dung'})
                res.redirect('/amaa/user/profile')
        }
    } catch (err) {
        console.log(err)
        res.send("Co loi xay ra")
    }
})

module.exports = router