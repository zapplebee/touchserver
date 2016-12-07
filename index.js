var express = require('express');
var app = express();
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var server = require('http').Server(app);
const screenshot = require('desktop-screenshot');
const fs = require('fs');
const _ = require('lodash');
const Jimp = require("jimp");

var robot = require('robotjs');
var size = robot.getScreenSize();


var server = require('http').Server(app);
var io = require('socket.io')(server);
///var size ={width: 100,height: 100};

server.listen(80);


//pug renderer, index
app.set('views', './views')
app.set('view engine', 'pug')
app.get('/', function (req, res) {
  res.render('index', {});
});


app.use('/script/angular.js', express.static(__dirname + '/node_modules/angular/angular.js'));
app.use('/script/socket.io.js', express.static(__dirname + '/node_modules/socket.io/client.js'));
app.use('/script', express.static(__dirname + '/src'));


//sass
app.use(sassMiddleware({
    src: path.join(__dirname, 'style'),
    dest: path.join(__dirname, 'style'),
    debug: true,
    outputStyle: 'extended',
    prefix: "/style"
}));
app.use("/style", express.static(path.join(__dirname, '/style')));
app.use("/images", express.static(path.join(__dirname, 'images')));


function doCapture(){
  var img = robot.screen.capture(100, 0, size.width, size.height);
  var image = new Jimp(size.width, size.height, function (err, image) {
    image.bitmap.data = img.image;
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      //stupid robot has its color's reversed.
      var blue   = this.bitmap.data[ idx + 0 ];
      var red  = this.bitmap.data[ idx + 2 ];
      this.bitmap.data[ idx + 0 ] = red;
      this.bitmap.data[ idx + 2 ] = blue;
      this.bitmap.data[ idx + 3 ] = 255;
    });
    image.greyscale(); 
    image.quality(10);
    image.getBase64( Jimp.MIME_JPEG, function(err,base64){
      io.emit('image',base64);
    }); 
  });
}


setInterval(doCapture,200);