const mongoose = require("./db.js")

const recordSchema = new mongoose.Schema({
    sno: Number, 
    username: String, 
    building:String,
    room:String,
    date:String,
    detail:String,
  });
  // 创建模型类并导出
const Record = mongoose.model("Record", recordSchema, "record")

module.exports = Record