
var recent_messages = [];

module.export = function (socket) {
	
	if (recent_messages.length > 0) {
		
		for (i in recent_messages) {
			socket.emit('announcement', recent_messages[i].nick + ': ' + recent_messages[i].msg);
		}
	}
	
  socket.on('user message', function (msg) {
	
		if (recent_messages.length > 5) {
			recent_messages = recent_messages.slice(recent_messages.length-5, recent_messages.length);
		}
		recent_messages.push({nick: socket.nickname, msg: msg});
		// db.

    socket.broadcast.emit('user message', socket.nickname, msg);
  });

  socket.on('nickname', function (nick, fn) {

		var new_user = new db.User({nick: nick});
		
		new_user.save(function(err) {
			
			if (err) {
		
				fn(true);
				
			} else {
		
				fn(false);
				socket.broadcast.emit('announcement', nick + ' connected');
	      io.sockets.emit('nicknames', nicknames);
			}
		});
  });

  socket.on('disconnect', function () {
    if (!socket.nickname) return;

    delete nicknames[socket.nickname];
    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
    socket.broadcast.emit('nicknames', nicknames);
  });
};