const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multipart = require('connect-multiparty')
const Service = require("./modules/service.js")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const multer  = require('multer')

const async = require('async');
const multipartyMiddleware=multipart()


const port = 10514

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('node_modules'))

app.use(session({
    secret: 'this is a session', //服务器生成session签名
    name: 'username',
    resave: false, //强制保存session即使他没有变化
    saveUninitialized: true, //强制保存未初始化的session
    cookie: {
        maxAge: 1000 * 60 * 15
    },
    rolling: true
}))

app.get('/', (req, res) => {
    res.render('index.ejs', {info: null})
})

app.get('/index.ejs', (req, res) => { //首页
    res.render('index.ejs', {info: null})
})
//有关宿管注册
app.get('/a_reg.ejs', (req, res) => { 
    res.render('a_reg.ejs', {info: null})
})

app.post('/a_Reg', multipartyMiddleware,(req, res) => {
    var username = req.body.username
    var password = req.body.password
    var sex = req.body.sex
    var ano=req.body.ano
    var sno=req.body.sno
    var building=req.body.building

    if(sex == "1") sex = "男"
    else sex = "女"
    
    Service.User.find({"username": username}, (err, user) => {
        if(user.length == 0) {
            Service.InsertUser(sno, ano,username, password, sex, building)
            res.render("login.ejs", {info: "注册成功！"})
        }
        else {
            res.render("a_reg.ejs", {info: "该用户已存在！"})
        }
    })
})

app.get('/a_index.ejs', (req, res) => { //宿管首页 
    res.render('a_index.ejs', {info: null})
})

app.get('/s_index.ejs', (req, res) => { //学生首页
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

//有关学生注册
app.get('/reg.ejs', (req, res) => { 
    res.render('reg.ejs', {info: null})
})

app.post('/doReg', multipartyMiddleware,(req, res) => {
    var username = req.body.username
    var password = req.body.password
    var sex = req.body.sex
    var sno=req.body.sno
    var ano=req.body.ano
    var building=req.body.building
    var room=req.body.room

    if(sex == "1") sex = "男"
    else sex = "女"
    
    Service.User.find({"username": username}, (err, user) => {
        if(user.length == 0) {
            Service.InsertUser(sno, ano,username, password, sex, building,room)
            res.render("login.ejs", {info: "注册成功！"})
        }
        else {
            res.render("reg.ejs", {info: "该用户已存在！"})
        }
    })
})

//展现学生列表
app.get("/userlist",(req,res) => {
    Service.User.find({"sno":req.session.sno},(err,stu)=>{
        if(err){
            console.log(err);
            return;
        }
        for(var i=0;i<stu.length;i++){
            stu[i].username=req.session.username
            stu[i].sex=req.session.sex
            stu[i].sno=req.session.sno
            stu[i].building=req.session.building
            v[i].room=req.session.room
        }
        res.render("userlist.ejs",{info:req.session.username,list:stu})
    })
})

//添加信息,展示缺寝列表  
app.get('/addque.ejs', (req, res) => { 
    res.render('addque.ejs', {info: null})
})

app.post('/add', multipartyMiddleware,(req, res) => {
    var username = req.body.username
    var date = req.body.date
    var detail = req.body.detail
    var sno=req.body.sno
    var building=req.body.building
    var room=req.body.room

    Service.Record.find({"username": username}, (err, user) => {
        if(user.length == 0) {
            Service.InsertRecord(sno,username,building,room,date,detail)
            res.render("addque.ejs")
        }
        
    })
})

app.get("recordlist",(req,res) => {
    Service.Record.find({"sno":req.session.sno},(err,rec)=>{
        if(err){
            console.log(err);
            return;
        }
        for(var i=0;i<rec.length;i++){
            rec[i].username=req.session.username
            rec[i].date=req.session.date
            rec[i].sno=req.session.sno
            rec[i].building=req.session.building
            rec[i].room=req.session.room
            rec[i].detail=req.session.detail
        }
        res.render("userlist.ejs",{info:req.session.username,list:rec})
    })
})
//删除信息

//查看用户信息

//查找用户
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



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})