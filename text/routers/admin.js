var express=require('express')
var router=express.Router();
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        //res.send("非管理员")
        res.redirect('/stext')
        //return
    }
    next()
})

router.get("/",function(req,res,next){
    res.send('欢迎进入')
});

//渲染注册页
router.get("/register",function(req,res,next){
    res.render('register',{})
});
module.exports=router;