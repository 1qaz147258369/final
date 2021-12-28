var mongoose = require("mongoose");
// 用户的表结构对象
var scoreSchema = new mongoose.Schema({
  Sno: Number, //学号
  Sname: String, //姓名
  Python: Number, //python
  nodejs: Number, //大前端
  Jave: Number, //Java
  system_safety: Number, //软件安全
});
// 创建模型类并导出
module.exports = mongoose.model("Score", scoreSchema);