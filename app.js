const app = require('http').createServer(response);
const fs = require('fs');
const io = require('socket.io')(app)

app.listen(3000);
console.log("App is running on port 3000...");

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
io.on("connection", (socket) => {
    socket.on("send message", (sent_msg, callback) => {
        sent_msg = "[" + getCurrentDate() + "]: " + sent_msg;
        io.sockets.emit("update messages", sent_msg);
        callback();
    });
});
function getCurrentDate() {
    const currentDate = new Date();
    const hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    const minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    const second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();
    return  hour + ":" + minute + ":" + second;
}
