const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const multer  = require('multer')
const path  = require('path')
const Service = require("./modules/service.js")
const async = require('async');
var ObjectId = require('mongodb').ObjectId
const { ServerResponse } = require('http')
const { callbackify } = require('util')
const { Serializer } = require('v8')

const port = 10514

app.use(express.static('node_modules'))

app.get('/', (req, res) => {
    res.render('index.ejs', {info: null})
})

app.get('/index.ejs', (req, res) => { //首页
    res.render('index.ejs', {info: null})
})

app.get('/a_reg.ejs', (req, res) => { //宿管注册
    res.render('a_reg.ejs', {info: null})
})

app.post('/a_Reg', (req, res) => {
    var username = req.body.username
    var password = req.body.assword
    var sex = req.body.sex
    var sno=req.body.sno
    var building=req.body.building

    if(sex == "1") sex = "男"
    else sex = "女"
    
    Service.User.find({"username": username}, (err, user) => {
        if(user.length == 0) {
            Service.InsertUser(username, password, sex, sno, building)
            res.render("login.ejs", {info: "注册成功！"})
        }
        else {
            res.render("a_reg.ejs", {info: "该用户已存在！"})
        }
    })
})

app.get('/a_index.ejs', (req, res) => { //首页 
    res.render('a_index.ejs', {info: null})
})

app.get('/s_index.ejs', (req, res) => { //首页
    res.render('s_index.ejs', {info: null})
})

//有关登陆
app.get('/login.ejs', (req, res) => { 
     res.render('login.ejs', {info: null})
})
app.post('/doLogin', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    var sign=req.body.sign
    Service.User.findOne({"username": username, "password": password}).exec((err, user) => {
        if(err) return console.log(err)
        if(!user) res.render("login.ejs", {info: "用户名或密码错误"})
        else {
            if (sign=='student') res.render("s_index.ejs")
            else res.render("a_index.ejs")
        }
    })
})

//有关注册
app.get('/reg.ejs', (req, res) => { 
    res.render('reg.ejs', {info: null})
})

app.post('/doReg', (req, res) => {
    var username = req.body.username
    var password = req.body.assword
    var sex = req.body.sex
    var sno=req.body.sno
    var building=req.body.building
    var room=req.body.room

    if(sex == "1") sex = "男"
    else sex = "女"
    
    Service.User.find({"username": username}, (err, user) => {
        if(user.length == 0) {
            Service.InsertUser(username, password, sex, sno, building,room)
            res.render("login.ejs", {info: "注册成功！"})
        }
        else {
            res.render("reg.ejs", {info: "该用户已存在！"})
        }
    })
})

app.use((req, res, next) => {
    var user = req.session.user
    if(user == null) res.render('login.ejs', {info: null})
    else next()
})

app.get('/logOut', (req, res) => { //退出
    req.session.username = ""
    res.render("login.ejs", {info: null})
})

app.get("/userInfo", (req, res) => {
    var user = req.session.user
    var username = req.query.username
    Service.User.findOne({"username": username}, (err, lookUser) =>{
        if(err) return console.log(err)
        res.render("userInfo.ejs", {
            user: user,
            lookUser: lookUser
        })
    })
})

app.get("/searchUser", (req, res) => {
    var user = req.session.user
    var search = req.query.search
    var query = {}
    query["username"] = new RegExp(search)
    Service.User.find(query, (err, docs) => {
        if(err)  return console.log(err)
        res.render("userList.ejs", {
            user: user,
            userList: docs
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})