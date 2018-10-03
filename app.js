const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
//const app = require('http').createServer(response);
//const fs = require('fs');
const io = require('socket.io')(http);

http.listen(3000);
console.log("App is running on port 3000...");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res)=>{
  res.redirect('/index');
});

app.get('/index', (req, res)=>{
  res.sendFile(__dirname + '/index.html');
});
/*
let nameN;
app.post('/change', (req, res)=>{
  nameN = req.body.name;
  res.send('done');
});
*/
/*
function response(req, res){
  let file = ""
  if(req.url == "/"){
    file = __dirname + '/index.html';
  } else {
    file = __dirname + req.url;
  }
  fs.readFile(file, (err, data) => {
      if (err){
        res.writeHead(404);
        return res.end('Page not Found');
      }
      res.writeHead(200);
      res.end(data);
  });
}
*/

io.on("connection", (socket) => {
  io.emit('chat message', ' a new user has joined');

  socket.on("send message", (sent_msg, callback) => {
      sent_msg = "[" + getCurrentDate() + "]: " + sent_msg;
      io.sockets.emit("update messages", sent_msg);
      callback();
  });

  socket.on('disconnect', function() {
       io.emit('chat message', 'some user disconnected');
    });
});
function getCurrentDate() {
    const currentDate = new Date();
    const hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    const minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    const second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();
    return  hour + ":" + minute + ":" + second;
}
