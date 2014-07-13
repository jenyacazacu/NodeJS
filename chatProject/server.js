

var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;

//everything will happen upon successfull connection to mongo
mongo.connect('mongodb://127.0.0.1/chat',function(err, db){

if (err) throw err;
	//connection a specific client
	client.on('connection', function(socket){
	    
		//get the collection that we will work with
		var col = db.collection('messages'),
		
		//define a function that will take care of statuses
		sendStatus = function(s){
		
		socket.emit('status',s);
		};
		;
		
		//emit all messages
		col.find().limit(100).sort({_id:1}).toArray(function(err, res){
		if(err) throw err;
		socket.emit('output',res);
		});
		
		
		//wait for input
		socket.on('input',function(data){
			//inserting into mangodb
			var name = data.name,
				message=data.message;
			whitespacePattern = /^\s*$/;
			
			//check for empty spaces
			if(whitespacePattern.test(name) || whitespacePattern.test(message) ){
			sendStatus('Name and message is required');
			}
			else
			{
			//inserting into the database
			col.insert({name:name,message:message}, function(){
				
				//emit latest message to all clients, we need the object data as an array
				//using client.emit will emit to all
				client.emit('output',[data]);			
				
				sendStatus(
				{
				message:"message sent",
				clear:true
				}
				);
			
			});
			
			}
				
		    
		});
	});

});
	


