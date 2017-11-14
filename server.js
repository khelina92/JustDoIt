const url = require('url');
const express = require('express');
const app = express(); //server-app
const bodyParser = require('body-parser');
const {Client} = require("pg");

app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    
  //set headers
  res.set('Access-Control-Allow-Origin', '*'); 
  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    
  //set statusline and body - and send
  res.status(200).send('Hei verden!'); //status-line and body

    let staticApp = readTextFile("index.html");
    res.send(staticApp);
    
});


let dbString = "postgres://qiypkwjnjgwadw:ddf8a7f06464234473af6e17bd765d589a1ec038db7b514abdee5cf720293646@ec2-54-75-225-143.eu-west-1.compute.amazonaws.com:5432/da5jtj9gun137e"

app.get('/users', function(req,res){
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

app.get('/lists',function(req,res){
   
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

app.listen(3000, function () {
  console.log('Server listening on port 3000!!!!');
});

