const url = require('url')
const express = require('express')
const bodyParser = require('body-parser');
const server = express()

server.use(express.static(__dirname + '/public'));


})

server.listen(32463, function () {
  console.log('server listening on port 32463!')
})



}

