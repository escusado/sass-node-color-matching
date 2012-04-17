
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , sys = require('sys')
  , terminal = exec = require('child_process').exec;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/sass/:action/:color/:value', function(req, res){
  var action = req.params.action,
      color = req.params.color,
      value = req.params.value;


  // terminal.stdout.on('data', function (data) {
  //   res.send(data);
  //   return
  // });

  exec(
       'echo -e "#main\n  :color '+action+'('+ color +','+ value +')" | ~/.gem/ruby/1.8/gems/sass-3.1.15/bin/sass -t compact',
       
       function(error, stdout, stderr){
        var val = stdout.match(/:(.*?)\;/s)[0].replace(';','').replace(': ','');
        console.log(action +' color '+ color + ' by ' + value +' = '+val);
        res.send(val);
       } 
  );

  //terminal.stdin.resume();
  // terminal.stdin.write('echo -e "#main\n  :color darken(#fff,9)" | ~/.gem/ruby/1.8/gems/sass-3.1.15/bin/sass -t compact &');
  // terminal.stdin.end();
});

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
