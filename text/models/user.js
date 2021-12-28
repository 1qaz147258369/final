var mongoose = require("mongoose");
// 用户的表结构对象
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    identity:String,
    isAdmin:{
        type: Boolean,
        default:false
    }
});
// 创建模型类并导出
module.exports = mongoose.model("User", userSchema);