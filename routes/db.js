const conn = require('./config');
const connection = conn();
// 分页查询所有数据
let selectAll = (table, page, callback) => {
    var page = (page - 1) * 5;
    var sql = 'SELECT COUNT(*) FROM '+table+';SELECT * FROM ' + table + ' limit ' + page + ',5';
    console.log("sql============================="+sql);
    connection.query( sql, (err, result, allCount, allPage) => {
        if (err) {
            console.log('err:' + err.sqlMessage);
            let errNews = err.sqlMessage;
            callback(errNews, '','','');
            return;
        }
        // 计算总页数
        var allCount = result[0][0]['COUNT(*)'];
        var allPage = parseInt(allCount)/5;
        var pageStr = allPage.toString();
        // 不能被整除
        if (pageStr.indexOf('.')>0) {
            allPage = parseInt(pageStr.split('.')[0]) + 1; 
        }
        var string = JSON.stringify(result[1]);
        console.log(result[0]);
        console.log("=======count"+allCount+"allPage"+allPage+"pageStr"+pageStr);
        var data = JSON.parse(string);
        callback('', data, allCount, allPage);
    })
}

// 根据ID查找
let findById = (table, id, callback) => {
    connection.query("SELECT * FROM " + table + " where id = " + id, (err, result) => {
        if (err) {
            console.log('err:' + err.sqlMessage);
            let errNews = err.sqlMessage;
            callback(errNews, '');
            return;
        }
        var string = JSON.stringify(result);
        var data = JSON.parse(string);
        callback('', data);
    })
}

// search 搜索功能
let search = (table, page, where, callback) => {
    var _WHERE = '';
    var page = (page - 1) * 5;
    for (var k in where) {
        //where xx='xx' and xxx='xxx' and...
        if(where[k] != null){
            _WHERE += k + "='" + where[k] + "' and ";
        }
    }
    _WHERE = _WHERE.substr(0, _WHERE.length - 4);  //去除多余的 and 
    var a = "SELECT * FROM " + table + ' WHERE ' + _WHERE+ ' limit ' + page + ',5';
    var sql = "SELECT COUNT(*) FROM " + table + ' WHERE ' + _WHERE+";"+a;
    console.log(sql);
    connection.query(sql, (err, result, allCount, allPage) => {
        if (err) {
            console.log('err:' + err.sqlMessage);
            let errNews = err.sqlMessage;
            callback(errNews, '');
            return;
        }
        // 计算总页数
        var allCount = result[0][0]['COUNT(*)'];    //行数
        var allPage = parseInt(allCount)/5;             //页数
        var pageStr = allPage.toString();
        // 不能被整除 向上取整
        if (pageStr.indexOf('.')>0) {
            allPage = parseInt(pageStr.split('.')[0]) + 1; 
        }
        var string = JSON.stringify(result[1]);
        var data = JSON.parse(string);
        callback('', data, allCount, allPage);
    });
}

//多表分页查询(sql+连接条件+where自写) table为主表
let joinTable = (table, sql, page, callback) => {
    var page = (page - 1) * 5;
    var sql = "SELECT COUNT(*) FROM "+table+";"+sql+" limit "+ page + ",5";
    console.log(sql);
    connection.query(sql, (err, result, allCount, allPage) => {
        if (err) {
            console.log('err:' + err.sqlMessage);
            let errNews = err.sqlMessage;
            callback(errNews, '');
            return;
        }
        // 计算总页数
        var allCount = result[0][0]['COUNT(*)'];
        var allPage = parseInt(allCount)/5;
        var pageStr = allPage.toString();
        // 不能被整除
        if (pageStr.indexOf('.')>0) {
            allPage = parseInt(pageStr.split('.')[0]) + 1; 
        }
        var string = JSON.stringify(result[1]);
        console.log(result[0]);
        console.log("=======count"+allCount+"allPage"+allPage+"pageStr"+pageStr);
        var data = JSON.parse(string);
        callback('', data, allCount, allPage);
    });
}

// 插入一条数据
let insertData = (table, datas, callback) => {
    var fields = '';
    var values = '';
    for (var k in datas) {
        fields += k + ',';
        values = values + "'" + datas[k] + "',"
    }
    fields = fields.slice(0, -1);
    values = values.slice(0, -1);
    console.log(fields, values);
    var sql = "INSERT INTO " + table + '(' + fields + ') VALUES(' + values + ')';
    connection.query(sql, callback);
}

// 更新一条数据
let updateData = function (table, sets, where, callback) {
    var _SETS = '';
    var _WHERE = '';
    var keys = '';
    var values = '';
    for (var k in sets) {
        _SETS += k + "='" + sets[k] + "',";
    }
    _SETS = _SETS.slice(0, -1);
    for (var k2 in where) {
        //  _WHERE+=k2+"='"+where[k2]+"' AND ";
        _WHERE += k2 + "=" + where[k2];
    }
    // UPDATE user SET Password='321' WHERE UserId=12
    //update table set username='admin2',age='55'   where id="5";
    var sql = "UPDATE " + table + ' SET ' + _SETS + ' WHERE ' + _WHERE;
    console.log(sql);
    connection.query(sql, callback);
}

// 删除一条数据
let deleteData = function (table, where, callback) {
    var _WHERE = '';
    for (var k2 in where) {
        //多个筛选条件使用  _WHERE+=k2+"='"+where[k2]+"' AND ";
        _WHERE += k2 + "=" + where[k2];
    }
    // DELETE  FROM user WHERE UserId=12  注意UserId的数据类型要和数据库一致
    var sql = "DELETE  FROM " + table + ' WHERE ' + _WHERE;
    connection.query(sql, callback);
}

// login(登录使用) 其他使用需要where条件内条件值不能为空
let findOne = (table, where, callback) => {
    var _WHERE = '';
    for (var k in where) {
        //where xx='xx' and xxx='xxx' and...
        _WHERE += k + "='" + where[k] + "' and ";
    }
    _WHERE = _WHERE.substr(0, _WHERE.length - 4);  //去除多余的 and 
    var sql = "SELECT * FROM " + table + ' WHERE ' + _WHERE;
    console.log(sql);
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('err:' + err.sqlMessage);
            let errNews = err.sqlMessage;
            callback(errNews, '');
            return;
        }
        var string = JSON.stringify(result);
        var data = JSON.parse(string);
        callback('', data);
    });
}

exports.selectAll = selectAll;
exports.insertData = insertData;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.findById = findById;
exports.findOne = findOne;
exports.joinTable = joinTable;
exports.search = search;
