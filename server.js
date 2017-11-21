const url = require('url');
const express = require('express');
const app = express(); //server-app
const bodyParser = require('body-parser').text();
const {Client} = require("pg");
var pgp = require('pg-promise')();

pgp.pg.defaults.ssl = true;

app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));

app.get('/', function (req, res) {
    
  //set headers
  res.set('Access-Control-Allow-Origin', '*'); 
  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    
  //set statusline and body - and send
  res.status(200).send('Hei verden!'); //status-line and body

    let staticApp = readTextFile("index.html");
    res.send(staticApp);
    
});


let dbString = "postgres://qiypkwjnjgwadw:ddf8a7f06464234473af6e17bd765d589a1ec038db7b514abdee5cf720293646@ec2-54-75-225-143.eu-west-1.compute.amazonaws.com:5432/da5jtj9gun137e";

//---GET USERS
    app.get('/users/', function(req,res){
        
        res.set('Access-Control-Allow-Origin', '*'); 
        res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        
        let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
        });

        client.connect();

        client.query("select * from users", (err,resp) =>{
        
            res.json(resp.rows).end();
            client.end();
        });
});


//var users = require('./users.js');
//app.use('/users/', users);

//---POST USERS
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
        
    
    /*db.any(sql).then(function(data){
        
        db.any("DEALLOCATE insert_users");
        res.status(200).json({msg: "insert ok"}); // success!
        
    }).catch(function(err){
        
        console.log(err);
        
        res.status(500).json(err);
        
    });*/
    
    
});


//----GET LISTS
    app.get('/lists/',function(req,res){
    
        res.set('Access-Control-Allow-Origin', '*'); 
        res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
   
        let client = new Client({
        connectionString:process.env.DATABASE_URL || dbString,
        ssl:true
    });

    client.connect();

    client.query("select * from lists", (err,resp) =>{
        
       
        res.json(resp.rows).end();
        client.end();
    });

    
});

//------POST LISTE
app.post('/lists/', bodyParser, function (req, res){
    
    console.log("innie post list");
    
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    
    var upload = JSON.parse(req.body);
        
    var sql = `PREPARE insert_lists (int, text, text, timestamp, date, time, boolean, int) AS INSERT INTO lists VALUES(DEFAULT, $2, $3, $4, $5, $6, $7, $8); EXECUTE insert_lists (0, '${upload.listname}', '${upload.listdescription}', '2017-11-22 12:53','${upload.duedate}', '${upload.duetime}', 'true', 0)`;
    
    console.log(sql)
    
    let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
    });

    client.connect();

    client.query(sql, (err,resp) =>{
        
        console.log("inne i qutr");

        //res.json({msg: "insert ok for list"}).end();
        res.json(err).end();
        client.end();
    });
    
});
        
//----GET ITEMS

    app.get('/listitems/',function(req,res){
        
        res.set('Access-Control-Allow-Origin', '*'); 
        res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
   
       let client = new Client({
        connectionString:process.env.DATABASE_URL || dbString,
        ssl:true
    });

    client.connect();

    client.query("select * from listitems", (err,resp) =>{
        
       
        res.json(resp.rows).end();
        client.end();
    });

});


    app.listen(3000, function () {
        console.log('Server listening on port 3000!!!!');
    });

