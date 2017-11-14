<<<<<<< HEAD
const express = require('express');
const app = express(); //server-app
const bodyParser = require('body-parser');
const {Client} = require("pg");

app.get('/', function (req, res) {
    
  //set headers
  res.set('Access-Control-Allow-Origin', '*'); 
  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    
  //set statusline and body - and send
  res.status(200).send('Hello World!!!'); //status-line and body
    
});


let dbString = "postgres://qiypkwjnjgwadw:ddf8a7f06464234473af6e17bd765d589a1ec038db7b514abdee5cf720293646@ec2-54-75-225-143.eu-west-1.compute.amazonaws.com:5432/da5jtj9gun137e"




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
  console.log('Server listening on port 3000!');
});
=======
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {Client} = require("pg");

let dbString = ""

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.listen(app.get('port'), function() {
    console.log("Super group server is running", app.get("port"));
});

app.get('/', function (req, res) {
  res.send('Hello crazy!')
})

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





//app.get()
>>>>>>> 6e3cf9ac010f9c327394d684e73df3ff483b321e
