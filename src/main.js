console.log('main.js');

var app = angular.module('app', []);

app.controller('navctrl', function($scope,$timeout){
   
  
})


var img = document.querySelector('img');
  var socket = io.connect('http://localhost');
  socket.on('image', function (data) {
    img.src = data;
  });


