const url = require('url');
const express = require('express');
const app = express(); //server-app
const bodyParser = require('body-parser').text();
const {Client} = require("pg");
//var pgp = require('pg-promise')();

//pgp.pg.defaults.ssl = true;

app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));

app.use(function(req, res, next){    
  //set headers
  res.set('Access-Control-Allow-Origin', '*'); 
  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

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
    
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    
    var upload = JSON.parse(req.body);
        
    var sql = `PREPARE insert_lists (int, text, text, timestamp, date, time, boolean, int) AS INSERT INTO lists VALUES(DEFAULT, $2, $3, DEFAULT, $5, $6, $7, $8); EXECUTE insert_lists (null, '${upload.listname}', '${upload.listdescription}', null ,'${upload.duedate}', '${upload.duetime}', 'false', 0)`;
    
    console.log(sql)
    
    let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
    });

    client.connect();

    client.query(sql, (err,resp) =>{
        
        //console.log("inne i qutr");

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

//----DELETE LISTS
app.delete('/lists/', function (req,res){
    
    var upload = req.query.listid;
    
    console.log(upload);
    
    var sql = `PREPARE delete_list (int) AS DELETE FROM lists WHERE listid=$1 RETURNING *; EXECUTE delete_list('${upload}')`;
    
    let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
    });
    

    client.connect();

    client.query(sql, (err,resp) =>{

        //res.json({msg: "delete ok"}).end();
        if (!err) {
            res.status(200).json({msg: "delete ok"});
        }
        else{
            res.status(200).json({msg: "can't delete"});
        }
        
    client.end();

    });      
});




    /*db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE delete_list");
        
        if (data.length > 0) {
            res.status(200).json({msg: "delete ok"}); //success
        }
        else{
            res.status(200).json({msg: "can't delete"});
        }
    }).catch(function(err) {
        res.status(500).json(err);
    });
});
*/


    app.listen(3000, function () {
        console.log('Server listening on port 3000!!!!');
    });

