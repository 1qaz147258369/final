const User = require("./user")
const Record=require("./record")

//在user表中插入数据
function InsertUser(sno, ano,username, password, sex, building,room) {
    var user = new User({
        sno:sno,
        ano:ano,
        username:username,
        password:password,
        sex:sex,
        building:building,
        room:room
    })
    user.save((err) => {
        if(err) return console.log(err)
        console.log("插入user成功")
    })
}

function InsertRecord(sno,username,building,room,date,detail) {
    var record = new Record({
        sno:sno,
        username:username,
        building:building,
        room:room,
        date:date,
        detail:detail,
    })
    record.save((err) => {
        if(err) return console.log(err)
        console.log("插入record成功")
    })
}



module.exports = {User, Record, InsertUser, InsertRecord}