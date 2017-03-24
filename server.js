var app = require('express')();
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var db = require('./db/db');
var checkAuth = require('./auth');
var apiKeyGen = require('./db/api-key');

const PORT = 3307;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/areyouhere', function(req,res) {
    res.send("hello");
});

app.post('/canipost', function(req,res) {
    console.log(req.body);
    res.status(200).end();
});

app.post('/company', function(req, res) {
    var credentials = auth(req);
    console.log(credentials);
    if(!checkAuth(credentials)) {
        res.status(401);
        res.send("Unauthorized");
        return;
    }
    var companydata = req.body;
    db.addNewCompany(companydata, function(err, results) {
        if(err) {
            res.status(err.status);
            res.send(err.message);
        } else {
            res.status(200);
            res.send("added");
        }
    });
    console.log(companydata);
});

app.get('/company/getNewAPIkey', function(req,res) {
    console.log("get getNewAPIKey");
    db.getNewAPIKey(req.query.name, function(err, results) {
        if(err) {
            res.status(err.status);
            res.send(err.message);
        } else {
            res.send(results);
        }
    });
});

app.get('/company/:companyname', function(req,res) {
    console.log("get /company with companyname: "+req.params.companyname);
    db.getCompanyByName(req.params.companyname, function(error, results){
        if(error) throw error;
        if(results.length == 0) {
            res.status(404);
            res.send(req.params.companyname + " not found");
        } else {
            res.status(200);
            res.send(JSON.stringify(results));
        }
    });
});

app.listen(PORT, function() {
    console.log("listening at port " + PORT);
});