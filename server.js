const url = require('url');
const express = require('express');
const app = express(); //server-app
const bodyParser = require('body-parser').text();
const {Client} = require("pg");
var db = require('./dbconnect'); //database
var jwt = require("jsonwebtoken");
var sha256 = require('sha256');

var secret = "frenchfriestastegood!";

var access = function(req,res, next){
	res.set('Access-Control-Allow-Origin', '*');
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
	next();
}


app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));
app.use(bodyParser);
app.use(access);


app.get('/', function (req, res) {

  //set headers
  

  //set statusline and body - and send
  res.status(200).send('Hei verden!'); //status-line and body
  let staticApp = readTextFile("index.html");
  res.send(staticApp);
});

let dbString = "postgres://qiypkwjnjgwadw:ddf8a7f06464234473af6e17bd765d589a1ec038db7b514abdee5cf720293646@ec2-54-75-225-143.eu-west-1.compute.amazonaws.com:5432/da5jtj9gun137e";



//---GET USERS
    app.get('/users/', function(req,res){

        /*
        let client = new Client({
            connectionString:process.env.DATABASE_URL | 'postgres://postgres:root@localhost:5432/JustDoIt';
            ssl:true
        });
        
        */
        
        
        let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
        });
        
        

        client.connect();

        client.query("select * from users", (err,res) =>{

            res.json(res.rows).end();
            client.end();
        });
});


//var users = require('./users.js');
//app.use('/users/', users);

//---POST USERS, opprett bruker
app.post('/users/', bodyParser, function (req, res){

    
    var upload = JSON.parse(req.body);
    var encrPassw = sha256(upload.password); //hasher passordet

    var sql = `PREPARE insert_users (int, text, text, text, text, text, int, boolean) AS
                INSERT INTO users VALUES(DEFAULT, $2, $3, $4, $5, $6, $7, $8);
                EXECUTE insert_users (0, '${upload.username}', '${encrPassw}', '${upload.firstname}','${upload.lastname}', 'bilde', 0, 'true' )`;

    let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
    });

    client.connect();

    client.query(sql, (err,dbresp) =>{

        //create token
        var payload = {username: upload.username, firstname: upload.firstname, lastname: upload.lastname};
        var tok = jwt.sign(payload, secret, {expiresIn: "12h"});

        //send logininfo + token to the client
        res.status(200).json({username: upload.username, firstname: upload.firstname, lastname: upload.lastname, token: tok}).end();

        //res.json({msg: "insert ok"}).end();
        client.end();
    });
});

//-- LOG IN

   app.post('/users/auth/', bodyParser, function (req, res){
       
        let upload = JSON.parse(req.body);
       
       
        console.log(upload);
       
        let encrPassw =  sha256(upload.password); //hasher passordet
       
        let sql = `SELECT * FROM users WHERE username='${upload.username}'`;
       
       console.log(sql);
        
        let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
        });
       
        client.connect();

        client.query(sql, (err,dbresp) =>{

            let dbpassw = dbresp.rows[0].password;
            
            if (dbresp.rows.length <= 0) {
                dbresp.json({msg: "Vennligst skriv inn brukernavn"}).end();
            }

            else {
                
                if (dbpassw && encrPassw == dbpassw ){

                    //create token
                    let payload = {username: upload.username, firstname: upload.firstname, lastname: upload.lastname};
                    let tok = jwt.sign(payload, secret, {expiresIn: "12h"});
                    

                    //send logininfo + token to the client
                    res.status(200).json({username: upload.username, firstname: upload.firstname, lastname: upload.lastname, token: tok, msg:"du er logget inn"}).end();
                }
                else {
                    res.status(401).json({msg: "Feil brukernavn og passord"}).end();
                }
            };
       });
   });



//----GET LISTS

    app.get('/lists/', bodyParser, function(req,res){

        
    
        
   // var upload = req.headers.cookie;
     //   console.log(upload);
   
        
    let token = req.query.token;
    
        
    let logindata = jwt.verify(token, secret); //check the token
        
    //let sql = `PREPARE get_lists (text) AS SELECT * FROM lists WHERE username=$1; EXECUTE get_lists ('${logindata.username}')`;
        
     
        
        
        
    let sql = `SELECT * FROM lists WHERE username='${logindata.username}'`;

        let client = new Client({
                connectionString:process.env.DATABASE_URL || dbString,
                ssl:true
        });
       
        client.connect();

        client.query(sql, (err,dbresp) =>{

           
            res.status(200).json(dbresp.rows);
            
            
       });

});

//------POST LISTE
app.post('/lists/', bodyParser, function (req, res){
    
    var upload = JSON.parse(req.body);
    let token = req.query.token;
   
    
    let logindata = jwt.verify(token, secret); //check the token
    console.log(logindata);
    var sql = `PREPARE insert_lists (int, text, text, timestamp, date, time, boolean, text) AS INSERT INTO lists VALUES(DEFAULT, $2, $3, $4, $5, $6, $7, $8); EXECUTE insert_lists (0, '${upload.listname}', '${upload.listdescription}', '2017-11-22 12:53','${upload.duedate}', '${upload.duetime}', 'true', '${logindata.username}')`;

    
    let client = new Client({
            connectionString:process.env.DATABASE_URL || dbString,
            ssl:true
    });

    client.connect();

    client.query(sql, (err, resp) =>{

        res.json(err).end();
        client.end();
    });

});

//----GET ITEMS

app.get('/listitems/',function(req,res){
    
       
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


    app.listen(3000, function () {
        console.log('Server listening on port 3000!!!!');
    });
