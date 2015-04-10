var express = require('express');
var less = require('less');
var app = express();

app.all('/', function(req, res){
    res.sendFile('index.html',{root:__dirname});
});
app.all('/:file', function(req, res){
    res.sendFile(req.params.file,{root:__dirname});
});

app.get('/images/:img', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.sendFile(req.params.img, {
        root : __dirname + '/images/'
    });
});
app.get('/templates/:tmp', function(req, res){
    res.sendFile(req.params.tmp, {
        root : __dirname + '/templates/'
    });
});

app.get('/angular/:ajs',function(req, res){
    res.sendFile(req.params.ajs, {
        root : __dirname + '/angular/'
    });
});

app.get('/javascript/:js',function(req, res){
    res.sendFile(req.params.js, {
        root : __dirname + '/javascript/'
    });
});

app.get('/css/:css',function(req, res){
    res.sendFile(req.params.css, {
        root : __dirname + '/css/'
    });
});

app.listen(8000);