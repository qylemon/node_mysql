var express = require('express');
var router = express.Router();
var db = require('./db.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/selectAll', function (req, res, next) {
  var page = req.body.page;
  db.selectAll('user', page, (err, result, allCount, allPage) => {
    if (err) {
      res.status(200).json({
        "status": false,
        "msg": err,
        "data": []
      });
    }
    res.status(200).json({
      "status": true,
      "msg": "OK",
      "allCount": allCount,
      "allPage": allPage,
      "page": req.body.page,
      "data": result
    });
  });
});

router.post('/selectOne',function (req,res,next){
  var id = req.body.id;
  db.findById('user', id, (err,result) => {
    if (err) {
      res.status(200).json({
        "status": false,
        "msg": err,
        "data": []
      });
    }
    res.status(200).json({
      "status": true,
      "msg": "OK",
      "data": result
    });
  });
});

router.post('/findOne',function (req,res,next){
  let _where = {id:req.body.id,name:req.body.name};
  db.findOne('user',_where,(err,result) => {
    if (err) {
      res.status(200).json({
        "status": false,
        "msg": err,
        "data": []
      });
    }
    res.status(200).json({
      "status": true,
      "msg": "OK",
      "data": result
    });
  });
});

router.post('/insert', function(req,res,next){
  let name = req.body.name;
  let gender = req.body.gender;
  if(gender==null){
    var saveData = {"name":name};
  }else{
    var saveData = {"name":name,"gender":gender};
  }  
  db.insertData('user',saveData,(err, result)=>{
    if(err){
      res.status(200).json({
        "status": false,
        "msg": err,
        "data": []
      });
    }
    res.status(200).json({
      "status": true,
      "msg": "OK",
      "data": "success"
    });
  });
});

router.post('/update',function(req,res,next){
  let _where = {id:req.body.id};
  let _set = {name:req.body.name};
  db.updateData("user",_set,_where,(err,result)=>{
    if(err){
      res.status(200).json({
        "status": false,
        "msg": err,
        "data": []
      });
    }
    res.status(200).json({
      "status": true,
      "msg": "OK",
      "data": "success"
    });
  });
});

router.post('/delete',function(req,res,next){
  let _where = {id:req.body.id};
  db.deleteData("user",_where,(err,result)=>{
    if(err){
      res.status(200).json({
        "status": false,
        "msg": err,
        "data": []
      });
    }
    res.status(200).json({
      "status": true,
      "msg": "OK",
      "data": "success"
    });
  });
});

router.post('/test', function(req,res,next){
  var page = req.body.page;
  var sql = 'select * from uclass left join user on uclass.userid=user.id'
  db.joinTable('uclass',sql,page,(err, result, allCount, allPage)=>{
    if (err) {
      res.status(200).json({
        "status": false,
        "msg": err,
        "data": []
      });
    }
    res.status(200).json({
      "status": true,
      "msg": "OK",
      "allCount": allCount,
      "allPage": allPage,
      "page": req.body.page,
      "data": result
  });
  })
});

module.exports = router;
