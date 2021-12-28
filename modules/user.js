const mongoose = require("./db.js")

const UserSchema = new mongoose.Schema({
    sno: Number, //学号或工号
    username: String, //姓名
    password: String,//密码
    sex:String,//性别
    building:String,//楼栋
    room:String//寝室
  });
  // 创建模型类并导出
const User = mongoose.model("User", UserSchema, "users")

module.exports = User