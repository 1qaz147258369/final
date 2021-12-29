const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multipart = require('connect-multiparty')
const Service = require("./modules/service.js")
const querystring = require('querystring')
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
            if (sign=='student'){
                req.session.building=user.building
                req.session.sno=user.sno
                req.session.username=user.username
                req.session.sex=user.sex
                req.session.room=user.room
                req.session.ano=user.ano

                res.render("s_index.ejs")
            } 
            else{
                req.session.building=user.building
                req.session.sno=user.sno
                req.session.username=user.username
                req.session.sex=user.sex
                req.session.room=user.room
                req.session.ano=user.ano
                res.render("a_index.ejs")
            }      
        }
    })
})
//退出
app.get('/logOut', (req, res) => {
    req.session.user = null
    res.render("index.ejs", { info: null })
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

//展现学生列表
app.get("/userlist",(req,res) => {
    //console.log(req.session.building);
    Service.User.find({"building":req.session.building},(err,stu)=>{
        if(err){
            console.log(err);
            return;
        }
        res.render("userlist.ejs", {
            info: req.session.username,
            list: stu
        })
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
    Service.InsertRecord(sno,username,building,room,date,detail)
    res.render("addque.ejs",{info: "添加成功！"})

})

app.get("/recordlist",(req,res) => {
    //console.log(req.session.building);
    Service.Record.find({"building":req.session.building},(err,rec)=>{
        if(err){
            console.log(err);
            return;
        }
        res.render("recordlist.ejs", {
            info: req.session.username,
            list: rec
        })
    })
})
//删除信息
app.get('/delrec', (req, res) => {
    Service.Record.deleteOne({ "_id": req.query.id }, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('成功');
    });

    Service.Record.find({ "sno":req.query.sno }, (err, rec) => {
        if (err) {
            console.log(err);
            return;
        }
        res.render("recordlist.ejs", {
            info: req.session.username,
            list: rec
        })
    })
})
//查看个人信息
app.get('/sInfo', (req, res) => {
    Service.User.find({ "sno": req.session.sno }, (err, docs) => {
        if (err) {
            console.log(err);
            return;
        }
        res.render("studentInfo.ejs", {
            info: req.session.username,
            list: docs
        })
    })
})

app.get('/aInfo', (req, res) => {
    Service.User.find({ "ano": req.session.ano }, (err, docs) => {
        if (err) {
            console.log(err);
            return;
        }
        res.render("adinfo.ejs", {
            info: req.session.username,
            list: docs
        })
    })
})

//学生查看自己的缺寝信息
app.get('/srecord', (req, res) => {
    Service.Record.find({ "sno": req.session.sno }, (err, rec) => {
        if (err) {
            console.log(err);
            return;
        }
        res.render("sname_record.ejs", {
            info: req.session.username,
            list: rec
        })
    })

})

//查找用户
app.get('/searchUser', (req, res) => {
    Service.User.find({ "sno": req.query.sno }, (err, stu) => {
        if (err) {
            console.log(err);
            return;
        }
        res.render("userlist.ejs", {
            info: req.session.username,
            list: stu
        })
    })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})