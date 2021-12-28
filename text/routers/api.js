var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var User = require('../models/user');//引入模型类
//定义返回变量格式
var resData; 
module.exports=router;

router.use(function(req,res,next){
	resData = {
		code:0,
		message:''
	};
	next();
})
//注册逻辑
router.post('/register',function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	//用户名不能空
	if(username == ''){
		resData.code = 1;
		resData.message = '用户名不能为空';
		res.json(resData); //使用res.json的方法返回前端数据
		return;
	}
	//密码不能为空
	if(password == ''){
		resData.code = 2;
		resData.message = '密码不能为空';
		res.json(resData);
		return;
	}
	//验证用户名是否已经注册，需要通过模型类查询数据库
	user.findOne({
		username:username
	}).then(function(userInfo ){
		// console.log(userInfo); //若控制台返回空表示没有查到数据
		if(userInfo){
			//若数据库有该记录
			resData.code = 4;
			resData.message = '用户名已被注册';
			res.json(resData);
			return;
		}
		//用户名没有被注册则将用户保存在数据库中
		var user = new User({
			username:username,
			password:password
		});//通过操作对象操作数据库
		return user.save();
	}).then(function(newUserInfo){
		resData.message = '注册成功';
		res.json(resData);
		res.redirect('/login')
	});
 
})

router.post('/login',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	if(username == '' || password == ''){
		resData.code = 1;
		resData.message = '用户名或密码不能为空';
		res.json(resData);
		return;
	}
	//查询数据库验证用户名和密码
	user.findOne({
		username: username,
		password: password
	}).then(function(userInfo){
		if(!userInfo){
			resData.code = 2;
			resData.message = '用户名或密码错误';
			res.json(resData);
			//return;
		}
		//验证通过则登录
		resData.message = '登录成功';
		resData.userInfo = {
			_id: userInfo._id,
			username: userInfo.username
		};
		res.redirect('/acontest')
		res.json(resData);
		//return;
	})
})

 
module.exports = router;
