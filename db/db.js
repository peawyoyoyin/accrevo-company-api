var mysql = require('mysql');
var dbconfig = require('./dbconfig');
var APIKeyGen = require('./api-key');
var validateCompany = require('./validate-company');

module.exports.getCompanyByName = function(name, _callback) {
    console.log("getCompanyByName call with name: "+name);
    var db = mysql.createConnection(dbconfig);

    db.connect();
    db.query({
        sql:'SELECT id,name,address,code,id13 FROM companys WHERE name = ?',
        values: [name]
        }, function(error, results) {
        db.end();
        if(_callback) {
            _callback(error, results);
        }
    });
};

module.exports.addNewCompany = function(company, _callback) {
    console.log("addNewCompany call");
    console.log(company);
    
    //try to validate company object
    var err = validateCompany(company);

    if(err.length) {
        if(_callback) {
            _callback({status: 400, message: ["invalid company",err]},null);
        }
    } else {
        var db = mysql.createConnection(dbconfig);
        var newAPIKey = APIKeyGen.getByUUID();
        db.connect();
        db.query({
            //create company(name, address, id13, taxbr, type, year, owner, partner, code,newapikey)
            sql: "CALL create_company(?,?,?,?,?,?,?,?,?,?);",
            values: [
                company.name,
                company.address,
                company.id13,
                company.taxbr,
                company.type,
                company.year,
                company.owner,
                company.partner,
                company.code,
                newAPIKey,
            ]
        }, function(error, results) {
            if(error) { 
                console.log(error);
                if(_callback) {
                    _callback({status: 500, message: ["internal server error"]},null);
                }
                return;
            }
            if(_callback) {
                _callback(undefined, results);
            }
        });
        console.log("inserted new company");
        console.log(company);
    }
};

module.exports.getNewAPIKey = function(companyname, _callback) {
    console.log("getNewAPIKey call");
    var err;
    var db = mysql.createConnection(dbconfig);

    var newAPIKey = APIKeyGen.getByUUID();

    db.connect();
    db.query({
        sql: "UPDATE companykey JOIN companys ON companys.id = companykey.company_id SET companykey.key = ? WHERE companys.name = ? ORDER BY companykey.id LIMIT 1",
        values: [newAPIKey, companyname]
    }, function(error, results) {
        var err;
        db.end();
        if(results.changedRows == 0) {
            err = {
                status: 404,
                message: companyname + "not found"
            }
        }
        _callback(err, newAPIKey);
    });
    console.log(companyname);
};