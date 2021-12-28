//服务器模块
const express =require('express');
const app=express();
const mongoose = require('mongoose');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const cookies=require('cookie-parser');
const User = require('../models/user');//引入模型类
app.use('/',express.static('public'))
app.use(express.json())
mongoose.connect('mongodb://172.21.2.236:27017/190110910514');

const schema={
    Sno: Number, //学号
    Sname: String, //姓名
    Python: Number, //python
    nodejs: Number, //大前端
    Jave: Number, //Java
    system_safety: Number //软件安全
}

const schema1={
    username: String,
    password: String,
    identity:String
}
//获取注册数据
app.post('/register',function(req,res,next){
    console.log(req.body);
    var username=String(req.body.username);
    var password=String(req.body.password);
    var identity=String(req.body.identity);
    next();
})
const userdata=mongoose.model('userdatas',schema);
app.use('/register',function(req,res,next){
    const kitty=new userdata({username:username,password:password,identity:identity});
    kitty.save().then(()=>console.log('test'));
    ejs.renderFile('views/register.html',function(err,str){
        if(err){
            console.log('error')
        }else{
            res.setHeader('Content-Type','text/html');
            res.end(str)
        }
    });
})
//登陆
app.use('/login',function(req,res,next){
    userdata.findOne({username:username},'password identity',function(err,userdata){
        if(err) return handleError(err);
        if(password==userdata.password){
            identity=userdata.identity
            if(identity=='common user'){

            }
        }
    })
})

app.use(function(req,res,next){
    req.cookies=new cookies(req.res);
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));
 
            //获取当前登录用户的类型，是否是管理员,实时的
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch (e){
            next();
        }
    }else{
        next();
    }

});
//app.use('/admin',require('./routers/admin'));

app.listen(10514);

