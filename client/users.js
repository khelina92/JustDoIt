var express = require('express');
var router = express.Router();
var db = require('./dbconnect');


app.get('/', function (req,res){
    
    var sql = 'SELECT * FROM listitems';
    
    db.any(sql).then(function(data){
                     
        res.status(200).json(data); //success - send the data as JSON!
                     }
    }).catch(function(err){
         
        res.status(500).json(err);
         
    });

});


app.post('/users/', bodyParser, function (req, res){
    
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    
    
        
    var upload = JSON.parse(req.body);
        
    var sql = `PREPARE insert_users (int, text, text, text, text, text, int, boolean) AS INSERT INTO users VALUES(DEFAULT, $2, $3, $4, $5, $6, $7, $8); EXECUTE insert_users (0, '${upload.username}', '${upload.password}', '${upload.firstname}','${upload.lastname}', 'bilde', 0, 'true' )`;
    
    
    
    console.log(sql)
    
    let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
    });

    client.connect();

    client.query(sql, (err,resp) =>{

        res.json({msg: "insert ok"}).end();
        client.end();
    });
    
// export module
module.exports = router;