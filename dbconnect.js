var pgp = require('pg-promise')();

//db connect string
var conn = process.env.DATABASE_URL || 'postgres://qiypkwjnjgwadw:ddf8a7f06464234473af6e17bd765d589a1ec038db7b514abdee5cf720293646@ec2-54-75-225-143.eu-west-1.compute.amazonaws.com:5432/da5jtj9gun137e';
var db = pgp(conn);

module.exports = db;
