/**
 * dependencies.
 */
var db = require('./lib/db');

/**
 * External Module dependencies.
 */

require.paths.unshift(__dirname + '/../../lib/');

var express = require('express')
  , sio = require('socket.io');

/**
 * App.
 */

var app = express.createServer();

/**
 * App configuration.
 */

app.configure(function () {
  //app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }))
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname);
  app.set('view engine', 'jade');
});

/**
 * App routes.
 */

app.get('/', function (req, res) {
  res.render('index', { layout: false });
});

/**
 * App listen.
 */

app.listen(3000, function () {
  var addr = app.address();
  console.log('   app listening on http://' + addr.address + ':' + addr.port);
});

/**
 * Socket.IO server (single process only)
 */

var io = sio.listen(app);

var recent_messages = [],
		nicknames = {};

io.sockets.on('connection', function (socket) {
	
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

    socket.broadcast.emit('user message', socket.nickname, msg);
  });

  socket.on('nickname', function (nick, fn) {

		var new_user = new db.User({nick: nick});
		
		new_user.save(function(err) {
			
			if (err) {
		
				fn(true);
				
			} else {
		
				fn(false);
				nicknames[nick] = socket.nickname = nick;
				socket.broadcast.emit('announcement', nick + ' connected');
	      io.sockets.emit('nicknames', nicknames);
			}
		});
  });

  socket.on('disconnect', function () {
    if (!socket.nickname) return;

		// TODO: mark as disconnected in DB
		
    delete nicknames[socket.nickname];

		var conditions = { nick: socket.nickname }
		  , update = { connected: false, last_connected: new Date() }
		  , options = { multi: false }
		  , callback = null;

		db.User.update(conditions, update, options, function(err) {
			
			if (err) {
				console.warn('Updating disconnected user record failed');
			}
		});

    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
    socket.broadcast.emit('nicknames', nicknames);
  });
});
