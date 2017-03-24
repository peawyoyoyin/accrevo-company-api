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
    var db = mysql.createConnection(dbconfig);
    var newAPIKey = APIKeyGen.getByUUID();
    
    var err = validateCompany(company);
    if(err.length) {
        if(_callback) {
            _callback({status: 400, message: ["invalid company", err]}, null);
        }
    } else {
    db.connect();
    db.beginTransaction(function(err) {
        if(err) {throw err;}
        db.query({
            sql: `
            INSERT INTO companys
            (name, address, id13, taxbr, type, year, owner, partner, code, created_at, updated_at)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
            `,
            values: [
                company.name,
                company.address,
                company.id13,
                company.taxbr,
                company.type,
                company.year,
                company.owner,
                company.partner,
                company.code
            ]
        },function(err, results) {
            if(err) {
                return db.rollback(function() {
                    throw err;
                });
            }

            db.query({
                sql: `
                INSERT INTO companykey
                (companykey.company_id, companykey.key)
                VALUES
                (LAST_INSERT_ID(), ?)
                `,
                values: [newAPIKey]
            }, function(err, results) {
                if(err) {
                    return db.rollback(function() {
                        throw err;
                    });
                }

                db.commit(function(err) {
                    if(err) {
                        return db.rollback(function() {
                            throw err;
                        });
                    }
                });

                console.log("addNewCompany_v2 success!");
            });
        });
    });
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