const express = require('express')
const router = express.Router()

const userModel = require('../models/amaa/user')

const postRouter = require('./post')
const userRouter = require('./user')
const watchRouter = require('./watch')

const {checkNotNull, hashPassword, checkPassword} = require('./util.js') 

router.get('/', checkLoggedIn, (req, res) => {
    res.render('amaa/index', {messages: req.flash('message')})
})

router.get('/login', checkNotLoggedIn, (req, res) => {
    res.render('amaa/login', {messages: req.flash('message')})
})

router.post('/login', async (req, res) => {
    let {email, password} = req.body
    if(checkNotNull([email, password])) {
        try {
            let u = await userModel.findOne().where('email').equals(email)
            if(await checkPassword(password, u.password)) {
                req.session.user = {
                    username: u.username,
                    id: u._id
                }
                req.flash('message', {type: 'success', message: 'Welcome to AMAA SOCIAL MEDIA'})
                res.redirect('/amaa/')
            } else {
                req.flash('message', {type: 'error', message: 'Dang nhap that bai'})
                res.redirect('/amaa/login')
            }
        } catch (err) {
            res.send(err)
        }
    } else {
        req.flash('message', {type: 'error', message: 'Mat khau va ten dang nhap khong dc rong'})
        res.redirect('/amaa/login')
    }
})

function checkLoggedIn(req, res, next) {
    if(checkNotNull([req.session.user])) {
        return next();
    }
    req.flash('message', {type: 'error', message: 'Xin hay dang nhap'})
    return res.redirect('/amaa/login')
}

function checkNotLoggedIn(req, res, next) {
    if(checkNotNull([req.session.user])) {
        return res.redirect('/amaa/')
    }
    return next()
}

router.get('/register', (req, res) => {
    res.render('amaa/register')
})

router.post('/register', async (req, res) => {
    let {email, username, password, cfpassword} = req.body
    if(checkNotNull([email, username, password, cfpassword])) {
        if(password !== cfpassword) {
            return res.send("Password khong khop")
        }

        try {
            password = await hashPassword(password)
            let u = new userModel({
                email: email,
                username: username,
                password: password
            })

            let result = await u.save()
            res.send("OK")
        } catch (err) {
            res.send(err)
        }
        
    } else {
        req.flash('message', {type: 'error', message: 'Dang ky khong hop le'})
        res.redirect('/amaa/register')
    }
})

router.get('/logout', checkLoggedIn, (req, res) => {
    req.session.user = undefined
    res.redirect('/amaa/login')
})

router.get('/chat', (req, res) => {
    res.render('amaa/chat')
})

router.get('/notification', (req, res) => {
    res.render('amaa/notification')
})

router.use('/post', checkLoggedIn, postRouter)
router.use('/user', checkLoggedIn, userRouter)
router.use('/watch', checkLoggedIn, watchRouter)

module.exports = router