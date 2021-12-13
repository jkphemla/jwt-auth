require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const RefreshToken = require('./db/RefreshToken')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())
app.use(cors())

//MongoDB database
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }).then(
    () => {
        console.log('[success] Connected to database.')
    },
    error => {
        console.log('[failed] Could not connect to database. ' + error)
        process.exit()
    }
)

const posts = [
    {
        username: 'LUcky',
        title: 'My first post'
    }
]

let refreshTokens = []

app.get('/posts', AuthenticateToken, (req, res) => { 
    res.json(posts.filter(post => post.username === req.user.username))
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = { username }
    const accessToken = GenerateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    new RefreshToken({
        _id: new mongoose.Types.ObjectId(),
        refreshToken
    }).save().then(result => {
        console.log(result)
    }).catch(err => console.log(err))

    //refreshTokens.push(refreshToken)
    res.json({ accessToken, refreshToken })
})

app.post('/refreshtoken', (req, res) => {
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = GenerateAccessToken({ username: user.username })
        res.json({ accessToken })
    })
})

function GenerateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

function AuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        //Token is no longer valid, send 404
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(5000)