let socket = null;

document.getElementById("btnGo").onclick = () => {
    const name = document.getElementById('userText').value;
    document.getElementById('userText').value = ''
    document.getElementById('loginIn').style.display = 'none';
    document.getElementById('chatter').style.display = 'block';
    $.ajax({
        url: 'http://localhost:3000/change',
        method:'POST',
        data: {name: name}
      }).done(function(){
        socket = io.connect();
        
        $("form#chat").submit(function(e) {
            e.preventDefault();
            socket.emit("send message", $(this).find("#msg_text").val(), function() {
                $("form#chat #msg_text").val("");
            });
        });
  
        socket.on('chat message', function(msg){
          $('#history').append($('<p />').text(msg));
        });
  
        socket.on("update messages", function(msg){
          var final_message = $("<p />").text(msg);
          $("#history").append(final_message);
        });
        
      }).fail(function(){
        console.log('Mistakes were made');
      });

}