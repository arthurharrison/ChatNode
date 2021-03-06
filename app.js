const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
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

let nameN;
app.post('/change', (req, res)=>{
  nameN = req.body.name;
  res.send('done');
});

io.on("connection", (socket) => {
  io.emit('chat message', ' a new user has joined');

  socket.on("send message", (sent_msg, callback) => {
      sent_msg = "[" + getCurrentDate() + "]: "+nameN+ '-' + sent_msg;
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
    return  hour + ":" + minute;
}
