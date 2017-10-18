const url = require("url");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.listen(app.get('port'), function(){
     console.log("Nå funker det, hurra!", app.get("port")); 
    
    });
    
    app.get('/', function (req, res) {
  res.send('Hello World!')
})

    

    
//console.log(tilfeldig);
    
    




