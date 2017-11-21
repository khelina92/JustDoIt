var express = require('express');
var router = express.Router();
var db = require('./dbconnect');

//endpoint: GET lists
app.get('/', function (req,res){
    
    var sql = 'SELECT * FROM lists';
    db.any(sql).then(function(data){
                     
        res.status(200).json(data); //success - send the data as JSON!
                     }
        }).catch(function(err){
         
         res.status(500).json(err);
         
});

});

// export module
module.exports = app;