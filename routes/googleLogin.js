const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

router.get('/', checkAuthenticated, (req, res) => {
    res.send("Hello")
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/googleLogin/login')
    }
}

function checkNotAuthenticated(req, res, next) {
    if(!req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/googleLogin')
    }
}

passport.use(new GoogleStrategy({
        clientID: "163174062913-kd6r4ra1oeh13qp7bqo1ql30jnhb7st1.apps.googleusercontent.com",
        clientSecret: "Bc0WxARgCYcZuAkLepehqmV5",
        callbackURL: "http://localhost:3000/googleLogin/callback"
    }, function(accessToken, refreshToken, profile, cb) {
        // console.log(accessToken)
        // console.log(refreshToken)
        // console.log(profile)
        return cb(null, profile.id)
    }
))

passport.serializeUser((id, done) => {
    done(null, id);
});
  
passport.deserializeUser((id, done) => {
    done(null, id)
});

router.get('/login', checkNotAuthenticated, passport.authenticate('google',{ scope: ['profile', 'email'], prompt: 'select_account' }))

router.get('/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    //   res.redirect('/googleLogin/')
    res.send("OK")
  }
);

module.exports = router