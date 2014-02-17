var restify = require('restify');

var server = restify.createServer({
  name: 'Glassy',
  version: '0.0.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Get token
server.get('/token/', function (req, res, next) {
  if(req.params.email && req.params.password) {
	res.send("slsli7O84WT6TtimsHogOVSND");
  }
  else res.send(404);
  return next();
});

// Get huidige actie / actie zoeken
server.get('/actie', function(req, res, next){
	if(!req.params.postalcode) {
		res.send({id: 4, intiatiefnemer: "Barry Hoeks"});
	}else{
		// Search action based on postalcode
		if(req.params.postalcode == '1234AB') res.send({id:2, intiatiefnemer: "Kees van Koten"});
		else res.send(404);
	}
});

// Start an action
server.post('/actie', function(req, res, next){
	send(201, {id: 4, intiatiefnemer: "Barry Hoeks"});
});

// Join an action
server.post('/actie/join', function(req, res, next){
	// if action exists
	if(req.params.action_code) res.send(200);
	res.send(404);
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
