var express     = require('express');
var router      = express.Router();
var parseString = require('xml2js').parseString;
var MongoClient = require('mongodb').MongoClient
var Assert      = require('assert');
var Url         = 'mongodb://localhost:27017/myproject';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/movistar',function(req,res,next){
    //console.log(req.params,req.body,req.query)
    var doc = req.query['data']
    parseString(doc, function (err, result) {
        Assert.equal(null, err);
        MongoClient.connect(Url, function(merr, db) {
            Assert.equal(null, merr);
            insertDocuments(db,result, function(qerr,qres) {
                if(qerr){
                    db.close();
                    return res.send(qerr);
                }
                db.close();
                return res.send('ok');
            });
        });        
    });    
    //res.send(doc);
});
var insertDocuments = function(db,result, callback) {
  var collection = db.collection('leads');
  collection.insert(result, function(err, result) {
      callback(err,result);
  });
}

module.exports = router;

/*
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});*/